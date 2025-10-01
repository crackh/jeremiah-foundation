import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import nodemailer from "nodemailer";

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactMessage = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Save to Supabase
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert([{ name: body.name, email: body.email, message: body.message }]);

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ error: "Failed to save message." }, { status: 500 });
    }

    // Send email
    let emailFailed = false;
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Jeremiah 29:11 Kids Foundation" <${process.env.SMTP_USER}>`,
        to: "jeremiahkidsfoundation@gmail.com",
        subject: "New Contact Message",
        text: `Name: ${body.name}\nEmail: ${body.email}\nMessage:\n${body.message}`,
        html: `<p><strong>Name:</strong> ${body.name}</p>
               <p><strong>Email:</strong> ${body.email}</p>
               <p><strong>Message:</strong><br/>${body.message}</p>`,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      emailFailed = true; // flag email failure
    }

    return NextResponse.json({
      message: "Message sent successfully!",
      emailFailed,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
