"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function submit() {
    setMsg("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) setMsg(data?.error || "Login gagal");
    else window.location.href = "/admin/dashboard";
  }

  return (
    <main style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>Admin Login</h1>

      <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email (contoh: admin@gmail.com)"
          type="email"
          style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
          type="password"
          style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }} />

        <button onClick={submit}
          style={{ padding: 12, borderRadius: 12, border: "none", background: "#111827", color: "white", fontWeight: 800 }}>
          Login
        </button>
        {msg && <div style={{ color: "#b91c1c" }}>{msg}</div>}
      </div>

      <div style={{ marginTop: 14 }}>
        <Link href="/admin/register">Belum punya akun? Register</Link>
      </div>
    </main>
  );
}
