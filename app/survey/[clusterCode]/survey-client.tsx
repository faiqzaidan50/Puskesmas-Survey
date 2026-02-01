"use client";

import { useEffect, useMemo, useState } from "react";
import { EmoticonScale } from "@/components/EmoticonScale";
import { Rating } from "@/components/Rating";
import Link from "next/link";

type Q = { id: number; question_text: string; sort_order: number };

export default function SurveyClient({ clusterCode }: { clusterCode: string }) {
  const [clusterName, setClusterName] = useState<string>("");
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [rating, setRating] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/public/questions?clusterCode=${encodeURIComponent(clusterCode)}`);
      const data = await res.json();
      setClusterName(data.cluster?.name || "");
      setQuestions(data.questions || []);
    })();
  }, [clusterCode]);

  const canSubmit = useMemo(() => {
    if (!questions.length) return false;
    return questions.every(q => typeof answers[q.id] === "number");
  }, [questions, answers]);

  async function onSubmit() {
    setStatus("loading");
    try {
      const payload = {
        clusterCode,
        rating,
        suggestion,
        answers: questions.map(q => ({ questionId: q.id, score: answers[q.id] })),
      };
      const res = await fetch("/api/public/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("success");
      setAnswers({});
      setRating(null);
      setSuggestion("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main style={{ maxWidth: 820, margin: "40px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700 }}>
            Survei {clusterName || clusterCode}
          </h1>
          <p style={{ opacity: 0.8, marginTop: 6 }}>
            Pilih emoticon pada setiap pertanyaan, lalu beri rating dan saran (opsional).
          </p>
        </div>
        <Link href="/" style={{ alignSelf: "center" }}>← Home</Link>
      </div>

      <section style={{ marginTop: 22, display: "grid", gap: 18 }}>
        {questions.map(q => (
          <div
            key={q.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 16,
              background: "white",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 10 }}>{q.question_text}</div>
            <EmoticonScale
              value={answers[q.id] ?? null}
              onChange={(v) => setAnswers(prev => ({ ...prev, [q.id]: v }))}
            />
          </div>
        ))}
      </section>

      <section style={{ marginTop: 18, border: "1px solid #e5e7eb", borderRadius: 16, padding: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Rating</h2>
        <div style={{ marginTop: 10 }}>
          <Rating value={rating} onChange={setRating} />
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 18 }}>Saran</h2>
        <textarea
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          rows={4}
          placeholder="Tulis saran/masukan (opsional)"
          style={{
            width: "100%",
            marginTop: 10,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 12,
          }}
        />
      </section>

      <div style={{ marginTop: 18, display: "flex", gap: 12, alignItems: "center" }}>
        <button
          type="button"
          disabled={!canSubmit || status === "loading"}
          onClick={onSubmit}
          style={{
            border: "none",
            borderRadius: 14,
            padding: "12px 16px",
            background: canSubmit ? "#111827" : "#9ca3af",
            color: "white",
            cursor: canSubmit ? "pointer" : "not-allowed",
            fontWeight: 700,
          }}
        >
          {status === "loading" ? "Mengirim..." : "Kirim Survei"}
        </button>

        {status === "success" && <span>✅ Terima kasih! Survei tersimpan.</span>}
        {status === "error" && <span>❌ Gagal mengirim. Coba lagi ya.</span>}
      </div>
    </main>
  );
}
