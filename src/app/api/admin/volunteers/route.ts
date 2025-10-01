import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { sendEmail } from "@/lib/sendEmail";

export async function GET() {
  const { data, error } = await supabaseServer.from("volunteers").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { name, email, message } = await req.json();
  const { error } = await supabaseServer.from("volunteers").insert({ name, email, message });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Volunteer added" });
}

// Reply to volunteer
export async function PUT(req: Request) {
  const { id, reply } = await req.json();
  const { data, error } = await supabaseServer.from("volunteers").select("email").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await sendEmail(data.email, "Volunteer Feedback", reply);
  return NextResponse.json({ message: "Reply sent" });
}
