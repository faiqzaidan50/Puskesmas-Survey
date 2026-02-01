import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Survei Kepuasan UPTD Puskesmas Ciwaru",
  description: "Aplikasi survei puskesmas berbasis emoticon, rating, dan saran per klaster layanan.",
  applicationName: "Puskesmas Survey",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          background: "#ecfdf5", // mint kesehatan
          color: "#0f172a",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        }}
      >
        {/* Top bar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(236,253,245,0.9)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid #a7f3d0",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                aria-hidden
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 14,
                  background: "#0f766e", // teal
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  fontWeight: 900,
                }}
              >
                PS
              </div>
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontWeight: 900 }}>Survei Kepuasan Puskesmas</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  Klaster 2 (KIA) • Klaster 3 (Remaja & Lansia) • Lintas Klaster
                </div>
              </div>
            </div>

            <nav style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <a
                href="/"
                style={{
                  textDecoration: "none",
                  color: "#0f172a",
                  fontWeight: 800,
                  padding: "8px 10px",
                  borderRadius: 12,
                }}
              >
                Home
              </a>
              <a
                href="/admin/login"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontWeight: 900,
                  padding: "9px 12px",
                  borderRadius: 12,
                  background: "#0f766e",
                  boxShadow: "0 10px 25px rgba(15,118,110,0.25)",
                }}
              >
                Admin
              </a>
            </nav>
          </div>
        </header>

        {/* Main container */}
        <main
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "18px 16px 48px",
            position: "relative",
          }}
        >
          {/* Subtle background gradients */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: -1,
              background:
                "radial-gradient(900px 380px at 20% 0%, rgba(15,118,110,0.10), transparent 60%), radial-gradient(700px 300px at 80% 10%, rgba(16,185,129,0.10), transparent 55%)",
            }}
          />
          {children}
        </main>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid #a7f3d0", background: "rgba(255,255,255,0.75)" }}>
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "14px 16px",
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-between",
              color: "#0f172a",
              fontSize: 13,
              opacity: 0.85,
            }}
          >
            <span>© {new Date().getFullYear()} Puskesmas Survey</span>
            <span>Database: MySQL</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
