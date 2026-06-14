import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendContactEmails } from "@/lib/email";

export async function POST(req) {
  try {
    const { name, email, phone, reason, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
    }

    const entry = await prisma.contact.create({
      data: { name: name.trim(), email: email.trim(), phone: phone?.trim() || null, reason: reason?.trim() || null, message: message.trim() },
    });

    sendContactEmails({ name, email, phone, reason, message }).catch(() => {});

    return NextResponse.json({ ok: true, id: entry.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/contact", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
