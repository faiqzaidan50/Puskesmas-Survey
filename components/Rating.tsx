"use client";

export function Rating({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "8px 10px",
            background: value === n ? "#111827" : "white",
            color: value === n ? "white" : "#111827",
            cursor: "pointer",
          }}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
