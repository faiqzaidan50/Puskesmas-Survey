import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const admin = token ? verifyAdminToken(token) : null;

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [rows] = await pool.query<any[]>(
    `
    SELECT
      c.code,
      c.name,
      COUNT(DISTINCT r.id) AS total_responses,
      ROUND(AVG(a.score), 2) AS avg_emoticon,
      ROUND(AVG(r.rating), 2) AS avg_rating
    FROM clusters c
    LEFT JOIN survey_responses r ON r.cluster_id = c.id
    LEFT JOIN survey_answers a ON a.response_id = r.id
    WHERE c.is_active = 1
    GROUP BY c.id
    ORDER BY c.id
    `
  );

  return NextResponse.json({ rows });
}
