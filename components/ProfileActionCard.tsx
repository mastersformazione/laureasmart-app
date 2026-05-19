"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSmartTheme, type SmartTone } from "@/components/ui/cardThemes";

type ProfileActionCardProps = {
  title: string;
  description: string;
  href: string;
  buttonText: string;
  badge?: string;
  icon?: ReactNode;
  tone?: SmartTone;
  variant?: "primary" | "secondary";
};

export default function ProfileActionCard({
  title,
  description,
  href,
  buttonText,
  badge,
  icon,
  tone = "purple",
  variant = "secondary",
}: ProfileActionCardProps) {
  const theme = getSmartTheme(tone);
  const isPrimary = variant === "primary";

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: isPrimary ? theme.bgStrong : theme.bg,
        border: `1px solid ${isPrimary ? theme.borderStrong : theme.border}`,
        borderRadius: 24,
        padding: 16,
        color: "#ffffff",
        boxShadow: isPrimary ? theme.shadow : `0 18px 44px rgba(0,0,0,0.24), 0 0 0 1px ${theme.glow}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -40,
          top: -40,
          width: 150,
          height: 150,
          borderRadius: 999,
          background: "rgba(255,255,255,0.12)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 5,
          background: isPrimary ? "rgba(255,255,255,0.88)" : theme.accent,
          boxShadow: `0 0 24px ${theme.glow}`,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
          {icon && (
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 16,
                background: isPrimary ? "rgba(255,255,255,0.16)" : theme.iconBg,
                border: `1px solid ${isPrimary ? "rgba(255,255,255,0.18)" : theme.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isPrimary ? "#FFFFFF" : theme.accentStrong,
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
          )}

          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 950, lineHeight: 1.18 }}>
                {title}
              </h2>

              {badge && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 950,
                    color: isPrimary ? "#FFFFFF" : theme.accentStrong,
                    background: isPrimary ? "rgba(255,255,255,0.16)" : theme.accentSoft,
                    border: `1px solid ${isPrimary ? "rgba(255,255,255,0.18)" : theme.border}`,
                    padding: "5px 9px",
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                  }}
                >
                  {badge}
                </span>
              )}
            </div>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: 12.5,
                lineHeight: 1.58,
                color: isPrimary ? "rgba(255,255,255,0.88)" : theme.muted,
              }}
            >
              {description}
            </p>
          </div>
        </div>

        <Link
          href={href}
          style={{
            marginTop: 14,
            width: "100%",
            minHeight: 50,
            borderRadius: 17,
            background: isPrimary ? "#FFFFFF" : theme.accent,
            color: isPrimary ? "#1F6FB2" : "#FFFFFF",
            border: "none",
            textAlign: "center",
            fontWeight: 950,
            fontSize: 13,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: `0 13px 28px ${theme.glow}`,
          }}
        >
          {buttonText}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
