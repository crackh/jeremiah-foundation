// File: app/api/volunteers/route.ts
"use server";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

// --- Initialize Supabase client with server-side service role key ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-only key
);

// --- Initialize Nodemailer transporter ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const { name, email, message } = body;

    if (!name || !email) {
      console.warn("Validation failed: missing name or email");
      return NextResponse.json(
        { success: false, error: "Name and Email are required" },
        { status: 400 }
      );
    }

    // --- 1️⃣ Insert volunteer into Supabase ---
    const { data, error: supabaseError } = await supabase
      .from("volunteers")
      .insert([
        {
          full_name: name,
          email,
          message,
          joined_at: new Date().toISOString(),
        },
      ])
      .select();

    if (supabaseError) {
      console.error("Supabase insert error:", supabaseError);
      return NextResponse.json(
        { success: false, error: supabaseError.message },
        { status: 500 }
      );
    }

    console.log("Supabase insert successful:", data);

    // --- 2️⃣ Send notification email to org ---
    let emailFailed = false;
    try {
      await transporter.sendMail({
        from: `"Jeremiah Foundation" <${process.env.SMTP_USER}>`,
        to: process.env.ORG_EMAIL || process.env.SMTP_USER,
        subject: "New Volunteer Signup",
        text: `New volunteer joined:
Name: ${name}
Email: ${email}
Message: ${message}`,
        html: `<h3>New Volunteer Signup</h3>
<p><b>Name:</b> ${name}</p>
<p><b>Email:</b> ${email}</p>
<p><b>Message:</b> ${message}</p>`,
      });
      console.log("Notification email sent successfully");
    } catch (mailError) {
      emailFailed = true;
      console.error("Email send error:", mailError);
    }

    return NextResponse.json({ success: true, data, emailFailed });
  } catch (err) {
    console.error("Unexpected API error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
