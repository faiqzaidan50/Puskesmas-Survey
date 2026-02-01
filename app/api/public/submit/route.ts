import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid json" }, { status: 400 });

  const { clusterCode, rating, suggestion, answers } = body;

  if (!clusterCode || !Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: "clusterCode & answers required" }, { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [clusters] = await conn.query<any[]>(
      "SELECT id FROM clusters WHERE code=:code AND is_active=1 LIMIT 1",
      { code: clusterCode }
    );
    if (!clusters.length) {
      await conn.rollback();
      return NextResponse.json({ error: "cluster not found" }, { status: 404 });
    }
    const clusterId = clusters[0].id as number;

    const [respResult] = await conn.query<any>(
      `INSERT INTO survey_responses (cluster_id, rating, suggestion)
       VALUES (:clusterId, :rating, :suggestion)`,
      {
        clusterId,
        rating: rating ?? null,
        suggestion: suggestion ?? null,
      }
    );
    const responseId = respResult.insertId as number;

    for (const a of answers) {
      const qid = Number(a.questionId);
      const score = Number(a.score);
      if (!qid || score < 1 || score > 5) continue;

      await conn.query(
        `INSERT INTO survey_answers (response_id, question_id, score)
         VALUES (:responseId, :questionId, :score)`,
        { responseId, questionId: qid, score }
      );
    }

    await conn.commit();
    return NextResponse.json({ ok: true, responseId });
  } catch (e) {
    await conn.rollback();
    return NextResponse.json({ error: "submit failed" }, { status: 500 });
  } finally {
    conn.release();
  }
}
