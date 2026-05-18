"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type ProfileActionCardProps = {
  title: string;
  description: string;
  href: string;
  buttonText: string;
  badge?: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary";
};

export default function ProfileActionCard({
  title,
  description,
  href,
  buttonText,
  badge,
  icon,
  variant = "secondary",
}: ProfileActionCardProps) {
  const isPrimary = variant === "primary";

  return (
    <section
      style={{
        background: isPrimary
          ? "linear-gradient(135deg, rgba(31,111,178,0.95), rgba(15,35,58,0.96))"
          : "rgba(15, 35, 58, 0.94)",
        border: isPrimary
          ? "1px solid rgba(147,197,253,0.32)"
          : "1px solid rgba(148, 163, 184, 0.18)",
        borderRadius: 20,
        padding: 14,
        color: "#ffffff",
        boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
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
        <div style={{ display: "flex", gap: 10 }}>
          {icon && (
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                background: isPrimary
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(31,111,178,0.22)",
                border: "1px solid rgba(96,165,250,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#93c5fd",
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
          )}

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 950,
                  lineHeight: 1.25,
                }}
              >
                {title}
              </h2>

              {badge && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 900,
                    color: "#bfdbfe",
                    background: "rgba(37,99,235,0.28)",
                    border: "1px solid rgba(96,165,250,0.24)",
                    padding: "4px 8px",
                    borderRadius: 999,
                  }}
                >
                  {badge}
                </span>
              )}
            </div>

            <p
              style={{
                margin: "7px 0 0",
                fontSize: 12,
                lineHeight: 1.55,
                color: isPrimary ? "#dbeafe" : "#cbd5e1",
              }}
            >
              {description}
            </p>
          </div>
        </div>
      </div>

      <Link
        href={href}
        style={{
          marginTop: 13,
          width: "100%",
          borderRadius: 14,
          padding: "12px 14px",
          background: isPrimary ? "#ffffff" : "rgba(255,255,255,0.08)",
          color: isPrimary ? "#1F6FB2" : "#ffffff",
          border: isPrimary ? "none" : "1px solid rgba(255,255,255,0.16)",
          textAlign: "center",
          fontWeight: 900,
          fontSize: 13,
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
        }}
      >
        {buttonText}
        <ArrowRight size={15} />
      </Link>
    </section>
  );
}
