import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import nodemailer from "nodemailer";

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

// ✅ Reusable transporter (only created if SMTP env vars exist)
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
} else {
  console.warn("⚠️ SMTP not fully configured. Emails will not be sent.");
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactMessage = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // 1️⃣ Save to Supabase
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert([{ name: body.name, email: body.email, message: body.message }]);

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { success: false, error: "Failed to save message." },
        { status: 500 }
      );
    }

    // 2️⃣ Attempt to send email if transporter exists
    let emailFailed = false;
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"Jeremiah 29:11 Kids Foundation" <${process.env.SMTP_USER}>`,
          to: process.env.ORG_EMAIL || "jeremiahkidsfoundation@gmail.com",
          subject: "New Contact Message",
          text: `Name: ${body.name}\nEmail: ${body.email}\nMessage:\n${body.message}`,
          html: `<p><strong>Name:</strong> ${body.name}</p>
                 <p><strong>Email:</strong> ${body.email}</p>
                 <p><strong>Message:</strong><br/>${body.message}</p>`,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        emailFailed = true;
      }
    } else {
      emailFailed = true;
      console.warn("⚠️ Skipping email send: SMTP not configured in production.");
    }

    return NextResponse.json({
      success: true,
      message: "Message processed successfully",
      emailFailed,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send message." },
      { status: 500 }
    );
  }
}
