import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(
    "SELECT code, name FROM clusters WHERE is_active=1 ORDER BY id DESC"
  );
  return NextResponse.json({ clusters: rows });
}
