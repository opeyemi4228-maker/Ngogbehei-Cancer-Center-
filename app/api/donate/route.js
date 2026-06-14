import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendDonationEmails } from "@/lib/email";

export async function POST(req) {
  try {
    const { name, email, amount, currency, frequency, dedicate, dedicatee } = await req.json();

    if (!name?.trim() || !email?.trim() || !amount || !currency?.trim() || !frequency?.trim()) {
      return NextResponse.json({ error: "Name, email, amount, currency and frequency are required." }, { status: 400 });
    }

    const entry = await prisma.donation.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        amount: Number(amount),
        currency: currency.trim(),
        frequency: frequency.trim(),
        dedicate: Boolean(dedicate),
        dedicatee: dedicatee?.trim() || null,
      },
    });

    sendDonationEmails({ name, email, amount, currency, frequency, dedicate, dedicatee }).catch(() => {});

    return NextResponse.json({ ok: true, id: entry.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/donate", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
