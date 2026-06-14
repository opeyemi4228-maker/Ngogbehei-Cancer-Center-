import { NextResponse } from "next/server";

export async function POST(req) {
  const { username, password } = await req.json();

  const validUser = process.env.ADMIN_USERNAME || "admin";
  const validPass = process.env.ADMIN_PASSWORD || "NCC@2024";

  if (username?.trim() === validUser && password === validPass) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
}
