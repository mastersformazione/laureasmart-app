"use client";

export default function SectionTitle({
  title,
  badge,
}: {
  title: string;
  badge?: string | number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 14,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 22,
          color: "#FFFFFF",
          fontWeight: 850,
          letterSpacing: "-0.4px",
        }}
      >
        {title}
      </h2>

      {badge && (
        <span
          style={{
            minWidth: 30,
            height: 30,
            padding: "0 10px",
            borderRadius: 999,
            background: "#3AA0FF",
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: 800,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 22px rgba(58,160,255,0.32)",
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}
