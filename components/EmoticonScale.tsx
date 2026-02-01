"use client";

const items = [
  { score: 1, emoji: "😡", label: "Sangat Buruk" },
  { score: 2, emoji: "🙁", label: "Buruk" },
  { score: 3, emoji: "😐", label: "Biasa" },
  { score: 4, emoji: "🙂", label: "Baik" },
  { score: 5, emoji: "😍", label: "Sangat Baik" },
];

export function EmoticonScale({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {items.map(it => {
        const active = value === it.score;
        return (
          <button
            key={it.score}
            type="button"
            onClick={() => onChange(it.score)}
            title={it.label}
            style={{
              border: active ? "2px solid #111827" : "1px solid #e5e7eb",
              borderRadius: 14,
              padding: "10px 12px",
              background: active ? "#f9fafb" : "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 22 }}>{it.emoji}</span>
            <span style={{ fontSize: 13, opacity: 0.8 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
