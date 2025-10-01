import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // secure server-side key
);

// ✅ Create transporter only if SMTP config exists
let transporter: nodemailer.Transporter | null = null;

if (
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true", // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and Email are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Insert into Supabase
    const { data, error } = await supabase
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

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // 2️⃣ Attempt to send email if transporter is available
    let emailFailed = false;

    if (transporter) {
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
      } catch (mailError) {
        emailFailed = true;
        console.error("Email send error:", mailError);
      }
    } else {
      emailFailed = true;
      console.warn(
        "⚠️ SMTP not configured: skipping email send. Check Vercel environment variables."
      );
    }

    return NextResponse.json({ success: true, data, emailFailed });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}
