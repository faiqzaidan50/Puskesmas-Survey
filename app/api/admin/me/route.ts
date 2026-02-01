import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies(); // ⬅️ FIX PENTING
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ admin: null }, { status: 401 });
  }

  try {
    const admin = verifyAdminToken(token);
    return NextResponse.json({ admin });
  } catch {
    return NextResponse.json({ admin: null }, { status: 401 });
  }
}
