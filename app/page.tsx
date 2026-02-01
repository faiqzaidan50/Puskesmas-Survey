import Link from "next/link";

const clusters = [
  { code: "klaster3", label: "Klaster 3" },
  { code: "klaster2", label: "Klaster 2" },
  { code: "lintas", label: "Lintas Klaster" },
];

export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Survei Kepuasan Puskesmas</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Pilih klaster layanan untuk mulai mengisi survei.
      </p>

      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        {clusters.map(c => (
          <Link
            key={c.code}
            href={`/survey/${c.code}`}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: 16,
              textDecoration: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 600 }}>{c.label}</span>
            <span aria-hidden>➡️</span>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <Link href="/admin/login">Admin Login</Link>
      </div>
    </main>
  );
}
