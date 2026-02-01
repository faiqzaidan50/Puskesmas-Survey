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

  if (!clusterCode) {
    return NextResponse.json({ error: "clusterCode required" }, { status: 400 });
  }

  const [clusters] = await pool.query<any[]>(
    "SELECT id, name FROM clusters WHERE code=:code LIMIT 1",
    { code: clusterCode }
  );

  if (!clusters.length) {
    return NextResponse.json({ error: "Cluster not found" }, { status: 404 });
  }

  const clusterId = clusters[0].id;

  const [rows] = await pool.query<any[]>(
    `
    SELECT
      r.id,
      r.submitted_at,
      r.rating,
      r.suggestion,
      ROUND(AVG(a.score), 2) AS avg_emoticon
    FROM survey_responses r
    LEFT JOIN survey_answers a ON a.response_id = r.id
    WHERE r.cluster_id = :clusterId
    GROUP BY r.id
    ORDER BY r.submitted_at DESC
    LIMIT 200
    `,
    { clusterId }
  );

  return NextResponse.json({
    clusterName: clusters[0].name,
    rows,
  });
}
