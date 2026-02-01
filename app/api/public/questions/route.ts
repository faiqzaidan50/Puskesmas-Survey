import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const clusterCode = url.searchParams.get("clusterCode");

    if (!clusterCode) {
      return NextResponse.json({ error: "clusterCode required" }, { status: 400 });
    }

    const [clusters] = await pool.query<any[]>(
      "SELECT id, code, name FROM clusters WHERE code=:code AND is_active=1 LIMIT 1",
      { code: clusterCode }
    );

    if (!clusters.length) {
      return NextResponse.json({ error: "cluster not found" }, { status: 404 });
    }

    const cluster = clusters[0];

    const [questions] = await pool.query<any[]>(
      `SELECT id, question_text, sort_order
       FROM survey_questions
       WHERE cluster_id=:clusterId AND is_active=1
       ORDER BY sort_order ASC`,
      { clusterId: cluster.id }
    );

    return NextResponse.json({
      cluster: { code: cluster.code, name: cluster.name },
      questions: questions || [],
    });
  } catch (err: any) {
    // biar client selalu dapat JSON meskipun error
    return NextResponse.json(
      { error: "server error", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}
