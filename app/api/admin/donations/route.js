import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const entries = await prisma.donation.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(entries);
  } catch (err) {
    console.error("GET /api/admin/donations", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
