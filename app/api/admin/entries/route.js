import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const MODELS = {
  contacts: prisma.contact,
  volunteers: prisma.volunteer,
  donations: prisma.donation,
  newsletter: prisma.newsletter,
};

export async function DELETE(req) {
  try {
    const { type, id } = await req.json();

    if (!MODELS[type]) {
      return NextResponse.json({ error: "Invalid type." }, { status: 400 });
    }
    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    await MODELS[type].delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/entries", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
