import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const admin = token ? verifyAdminToken(token) : null;

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const clusterCode = url.searchParams.get("clusterCode");

  const [clusters] = await pool.query<any[]>(
    "SELECT id, name FROM clusters WHERE code=:code LIMIT 1",
    { code: clusterCode }
  );

  const clusterId = clusters[0].id;

  const [distribution] = await pool.query<any[]>(
    `
    SELECT score, COUNT(*) AS total
    FROM survey_answers a
    JOIN survey_responses r ON r.id = a.response_id
    WHERE r.cluster_id = :clusterId
    GROUP BY score
    ORDER BY score
    `,
    { clusterId }
  );

  return NextResponse.json({
    distribution,
  });
}
