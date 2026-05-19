"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getSmartTheme, type SmartTone } from "@/components/ui/cardThemes";

type ProfileAccordionCardProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  defaultOpen?: boolean;
  icon?: ReactNode;
  tone?: SmartTone;
  children: ReactNode;
};

export default function ProfileAccordionCard({
  title,
  subtitle,
  badge,
  defaultOpen = false,
  icon,
  tone = "blue",
  children,
}: ProfileAccordionCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const theme = getSmartTheme(tone);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: theme.bg,
        border: `1px solid ${open ? theme.borderStrong : theme.border}`,
        borderRadius: 24,
        padding: 15,
        boxShadow: `0 18px 44px rgba(0,0,0,0.24), 0 0 0 1px ${theme.glow}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 90% 0%, ${theme.glow} 0%, transparent 34%)`,
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
          background: theme.accent,
          boxShadow: `0 0 24px ${theme.glow}`,
        }}
      />

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          border: "none",
          background: "transparent",
          padding: 0,
          color: "#ffffff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
          {icon && (
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 15,
                background: theme.iconBg,
                border: `1px solid ${theme.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.accentStrong,
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
          )}

          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: 1.18,
                  fontWeight: 950,
                  letterSpacing: "-0.02em",
                }}
              >
                {title}
              </h2>

              {badge && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 950,
                    color: theme.accentStrong,
                    background: theme.accentSoft,
                    border: `1px solid ${theme.border}`,
                    padding: "5px 9px",
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                  }}
                >
                  {badge}
                </span>
              )}
            </div>

            {subtitle && (
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 12.5,
                  lineHeight: 1.45,
                  color: theme.muted,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 13,
            background: theme.accentSoft,
            border: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.accentStrong,
            flexShrink: 0,
          }}
        >
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {open && (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: 15,
            paddingTop: 15,
            borderTop: `1px solid ${theme.border}`,
          }}
        >
          {children}
        </div>
      )}
    </section>
  );
}
