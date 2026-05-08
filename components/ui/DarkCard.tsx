"use client";

export default function DarkCard({
  title,
  description,
  badge,
  children,
  onClick,
}: {
  title: string;
  description: string;
  badge?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <section
      onClick={onClick}
      style={{
        padding: 18,
        borderRadius: 24,
        background: "rgba(17,32,51,0.86)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 14px 34px rgba(0,0,0,0.24)",
        cursor: onClick ? "pointer" : "default",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 17,
            lineHeight: 1.25,
            color: "#FFFFFF",
            fontWeight: 850,
          }}
        >
          {title}
        </h3>

        {badge && (
          <span
            style={{
              padding: "6px 10px",
              borderRadius: 999,
              background: "rgba(58,160,255,0.16)",
              color: "#78C2FF",
              fontSize: 11,
              fontWeight: 850,
              whiteSpace: "nowrap",
            }}
          >
            {badge}
          </span>
        )}
      </div>

      <p
        style={{
          margin: "10px 0 0",
          fontSize: 14,
          lineHeight: 1.5,
          color: "rgba(255,255,255,0.68)",
        }}
      >
        {description}
      </p>

      {children}
    </section>
  );
}
