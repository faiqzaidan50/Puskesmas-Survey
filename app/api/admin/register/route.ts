import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcrypt";
import { signAdminToken } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid json" }, { status: 400 });

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!name || !email || password.length < 6) {
    return NextResponse.json({ error: "name/email/password invalid" }, { status: 400 });
  }

  const password_hash = await bcrypt.hash(password, 10);

  try {
    const [result] = await pool.query<any>(
      `INSERT INTO admins (name, email, password_hash)
       VALUES (:name, :email, :password_hash)`,
      { name, email, password_hash }
    );

    const token = signAdminToken({ adminId: result.insertId, email, name });

    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "email already used?" }, { status: 400 });
  }
}
