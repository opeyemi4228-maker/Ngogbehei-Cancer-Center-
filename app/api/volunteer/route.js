import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendVolunteerEmails } from "@/lib/email";

export async function POST(req) {
  try {
    const { name, email, phone, location, pathway, availability, skills, why, over18, consent } = await req.json();

    if (!name?.trim() || !email?.trim() || !location?.trim() || !pathway?.trim() || !why?.trim()) {
      return NextResponse.json({ error: "Name, email, location, pathway and why are required." }, { status: 400 });
    }

    const entry = await prisma.volunteer.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        location: location.trim(),
        pathway: pathway.trim(),
        availability: availability?.trim() || null,
        skills: skills?.trim() || null,
        why: why.trim(),
        over18: Boolean(over18),
        consent: Boolean(consent),
      },
    });

    sendVolunteerEmails({ name, email, phone, location, pathway, availability, skills, why }).catch(() => {});

    return NextResponse.json({ ok: true, id: entry.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/volunteer", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
