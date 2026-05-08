"use client";

export default function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        background: "rgba(17,32,51,0.82)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 28,
        backdropFilter: "blur(16px)",
        boxShadow: "0 18px 46px rgba(0,0,0,0.26)",
      }}
    >
      {children}
    </section>
  );
}
