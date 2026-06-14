import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendNewsletterEmails } from "@/lib/email";

export async function POST(req) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const entry = await prisma.newsletter.create({
      data: {
        name: name?.trim() || null,
        email: email.trim(),
        phone: phone?.trim() || null,
        message: message?.trim() || null,
      },
    });

    sendNewsletterEmails({ name, email, phone, message }).catch(() => {});

    return NextResponse.json({ ok: true, id: entry.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/newsletter", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
