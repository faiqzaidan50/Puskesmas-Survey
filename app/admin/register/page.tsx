"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function submit() {
    setMsg("");
    const res = await fetch("/api/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) setMsg(data?.error || "Register gagal");
    else window.location.href = "/admin/dashboard";
  }

  return (
    <main style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>Admin Register</h1>
      <p style={{ opacity: 0.8, marginTop: 6 }}>
        Buat akun admin untuk mengakses dashboard.
      </p>

      <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nama"
          style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }} />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"
          style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }} />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (min 6)"
          type="password"
          style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }} />

        <button onClick={submit}
          style={{ padding: 12, borderRadius: 12, border: "none", background: "#111827", color: "white", fontWeight: 800 }}>
          Register
        </button>
        {msg && <div style={{ color: "#b91c1c" }}>{msg}</div>}
      </div>

      <div style={{ marginTop: 14 }}>
        <Link href="/admin/login">Sudah punya akun? Login</Link>
      </div>
    </main>
  );
}
