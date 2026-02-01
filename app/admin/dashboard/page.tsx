"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CLUSTERS = [
  { code: "klaster2", label: "Klaster 2 (KIA)" },
  { code: "klaster3", label: "Klaster 3 (Remaja & Lansia)" },
  { code: "lintas", label: "Lintas Klaster" },
];

function emojiFromScore(score: number | null) {
  if (score === null || score === undefined) return "—";
  if (score >= 4.7) return "😍";
  if (score >= 4.0) return "🙂";
  if (score >= 3.0) return "😐";
  if (score >= 2.0) return "🙁";
  return "😡";
}

function labelFromScore(score: number | null) {
  if (score === null || score === undefined) return "-";
  if (score >= 4.7) return "Sangat Baik";
  if (score >= 4.0) return "Baik";
  if (score >= 3.0) return "Biasa";
  if (score >= 2.0) return "Buruk";
  return "Sangat Buruk";
}

function fmtDateTime(v: any) {
  try {
    return new Date(v).toLocaleString();
  } catch {
    return String(v ?? "");
  }
}

export default function AdminDashboard() {
  const [cluster, setCluster] = useState("klaster3");
  const [rows, setRows] = useState<any[]>([]);
  const [dist, setDist] = useState<any[]>([]);
  const [summary, setSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setErrMsg("");

      try {
        const [r1, r2, r3] = await Promise.all([
          fetch(`/api/admin/responses?clusterCode=${encodeURIComponent(cluster)}`),
          fetch(`/api/admin/stats?clusterCode=${encodeURIComponent(cluster)}`),
          fetch(`/api/admin/summary`),
        ]);

        const t1 = await r1.text();
        const t2 = await r2.text();
        const t3 = await r3.text();

        const j1 = t1 ? JSON.parse(t1) : null;
        const j2 = t2 ? JSON.parse(t2) : null;
        const j3 = t3 ? JSON.parse(t3) : null;

        if (!r1.ok) throw new Error(j1?.error || "Gagal mengambil responses");
        if (!r2.ok) throw new Error(j2?.error || "Gagal mengambil stats");
        if (!r3.ok) throw new Error(j3?.error || "Gagal mengambil summary");

        if (cancelled) return;

        setRows(j1?.rows || []);
        setDist(j2?.distribution || []);
        setSummary(j3?.rows || []);
      } catch (e: any) {
        if (cancelled) return;
        setErrMsg(String(e?.message || e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cluster]);

  const best = useMemo(() => {
    const valid = (summary || []).filter((x: any) => x?.avg_emoticon !== null && x?.avg_emoticon !== undefined);
    valid.sort((a: any, b: any) => (b.avg_emoticon ?? 0) - (a.avg_emoticon ?? 0));
    return valid[0] || null;
  }, [summary]);

  const distNormalized = useMemo(() => {
    // Pastikan score 1..5 selalu muncul (biar chart rapi)
    const map = new Map<number, number>();
    for (const r of dist || []) map.set(Number(r.score), Number(r.total));
    return [1, 2, 3, 4, 5].map((s) => ({ score: s, total: map.get(s) || 0 }));
  }, [dist]);

  return (
    <main style={{ maxWidth: 1100, margin: "28px auto", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Dashboard Admin</h1>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            Ringkasan per klaster • Tabel hasil • Grafik distribusi emoticon
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontWeight: 800 }}>Klaster:</span>
          <select
            value={cluster}
            onChange={(e) => setCluster(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #a7f3d0",
              background: "white",
              fontWeight: 800,
            }}
          >
            {CLUSTERS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {errMsg && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 14,
            border: "1px solid #fecaca",
            background: "#fff1f2",
            color: "#991b1b",
            fontWeight: 700,
          }}
        >
          {errMsg}
        </div>
      )}

      {/* PERBANDINGAN 3 KLASTER */}
      <section
        style={{
          marginTop: 16,
          background: "white",
          borderRadius: 18,
          padding: 16,
          border: "1px solid #d1fae5",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Perbandingan 3 Klaster</h2>
            <div style={{ marginTop: 6, opacity: 0.75 }}>
              Menentukan klaster dengan penilaian terbaik berdasarkan <b>Avg Emoticon</b>.
            </div>
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderRadius: 14,
              border: "1px solid #a7f3d0",
              background: "#ecfdf5",
              fontWeight: 900,
            }}
          >
            {best ? (
              <>
                🏆 Terbaik: {best.name} — {best.avg_emoticon} {emojiFromScore(best.avg_emoticon)} ({labelFromScore(best.avg_emoticon)})
              </>
            ) : (
              <>🏆 Terbaik: -</>
            )}
          </div>
        </div>

        <div style={{ width: "100%", height: 260, marginTop: 14 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
              <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
              <Tooltip />
              <Bar dataKey="avg_emoticon" name="Avg Emoticon (1-5)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 10 }}>
          {(summary || []).map((s: any) => (
            <div
              key={s.code}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                padding: 12,
                minWidth: 240,
                background: "#f8fafc",
              }}
            >
              <div style={{ fontWeight: 900 }}>{s.name}</div>
              <div style={{ marginTop: 8 }}>
                Respon: <b>{s.total_responses ?? 0}</b>
              </div>
              <div>
                Avg Emoticon: <b>{s.avg_emoticon ?? "-"}</b> <span style={{ fontSize: 18 }}>{emojiFromScore(s.avg_emoticon)}</span>
              </div>
              <div>
                Avg Rating: <b>{s.avg_rating ?? "-"}</b>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GRAFIK DISTRIBUSI (PER KLASTER TERPILIH) */}
      <section
        style={{
          marginTop: 16,
          background: "white",
          borderRadius: 18,
          padding: 16,
          border: "1px solid #d1fae5",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Distribusi Emoticon (Klaster terpilih)</h2>
        <div style={{ marginTop: 6, opacity: 0.75 }}>
          Jumlah jawaban emoticon untuk skor 1–5.
        </div>

        <div style={{ width: "100%", height: 260, marginTop: 14 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distNormalized}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="score" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" name="Jumlah" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 10, opacity: 0.85 }}>
          <span>1 😡</span>
          <span>2 🙁</span>
          <span>3 😐</span>
          <span>4 🙂</span>
          <span>5 😍</span>
        </div>
      </section>

      {/* TABEL */}
      <section
        style={{
          marginTop: 16,
          background: "white",
          borderRadius: 18,
          padding: 16,
          border: "1px solid #d1fae5",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Hasil Survei (Klaster terpilih)</h2>
          <div style={{ opacity: 0.75 }}>
            {loading ? "Memuat..." : `Total tampil: ${rows.length}`}
          </div>
        </div>

        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr>
                {["Waktu", "Avg Emoticon", "Emoji", "Rating", "Saran"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 10px",
                      borderBottom: "1px solid #e5e7eb",
                      fontWeight: 900,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(rows || []).map((r: any) => (
                <tr key={r.id}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>
                    {fmtDateTime(r.submitted_at)}
                  </td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #f1f5f9", fontWeight: 900 }}>
                    {r.avg_emoticon ?? "-"}
                    <span style={{ marginLeft: 10, fontSize: 12, opacity: 0.75 }}>
                      {labelFromScore(r.avg_emoticon)}
                    </span>
                  </td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #f1f5f9", fontSize: 22 }}>
                    {emojiFromScore(r.avg_emoticon)}
                  </td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #f1f5f9" }}>
                    {r.rating ?? "-"}
                  </td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #f1f5f9", minWidth: 220 }}>
                    {r.suggestion || "-"}
                  </td>
                </tr>
              ))}

              {!loading && (!rows || rows.length === 0) && (
                <tr>
                  <td colSpan={5} style={{ padding: 14, opacity: 0.8 }}>
                    Belum ada data untuk klaster ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
