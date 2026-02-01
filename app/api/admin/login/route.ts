import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcrypt";
import { signAdminToken } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid json" }, { status: 400 });

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  const [rows] = await pool.query<any[]>(
    "SELECT id, name, email, password_hash FROM admins WHERE email=:email LIMIT 1",
    { email }
  );
  if (!rows.length) return NextResponse.json({ error: "invalid credentials" }, { status: 401 });

  const admin = rows[0];
  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) return NextResponse.json({ error: "invalid credentials" }, { status: 401 });

  const token = signAdminToken({ adminId: admin.id, email: admin.email, name: admin.name });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
