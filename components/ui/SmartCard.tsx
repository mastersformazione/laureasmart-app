"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSmartTheme, type SmartTone } from "@/components/ui/cardThemes";

type SmartCardProps = {
  title?: string;
  description?: string;
  badge?: string;
  icon?: ReactNode;
  tone?: SmartTone;
  variant?: "default" | "hero" | "soft" | "outline";
  href?: string;
  buttonText?: string;
  onClick?: () => void;
  children?: ReactNode;
};

export default function SmartCard({
  title,
  description,
  badge,
  icon,
  tone = "blue",
  variant = "default",
  href,
  buttonText,
  onClick,
  children,
}: SmartCardProps) {
  const theme = getSmartTheme(tone);
  const isHero = variant === "hero";
  const isSoft = variant === "soft";
  const isOutline = variant === "outline";

  const content = (
    <section
      onClick={onClick}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: isHero ? 30 : 24,
        padding: isHero ? 20 : 16,
        color: "#FFFFFF",
        background: isHero ? theme.bgStrong : isSoft ? theme.accentSoft : theme.bg,
        border: isOutline
          ? `1px solid ${theme.borderStrong}`
          : `1px solid ${theme.border}`,
        boxShadow: isHero ? theme.shadow : `0 16px 42px rgba(0,0,0,0.24), 0 0 0 1px ${theme.glow}`,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(circle at 88% 0%, ${theme.glow} 0%, transparent 34%)`,
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
          boxShadow: `0 0 22px ${theme.glow}`,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {(title || icon || badge) && (
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 11, minWidth: 0 }}>
              {icon && (
                <div
                  style={{
                    width: isHero ? 52 : 40,
                    height: isHero ? 52 : 40,
                    borderRadius: isHero ? 20 : 15,
                    background: isHero ? "rgba(255,255,255,0.16)" : theme.iconBg,
                    border: `1px solid ${theme.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isHero ? "#FFFFFF" : theme.accentStrong,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
              )}

              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {title && (
                    <h2
                      style={{
                        margin: 0,
                        fontSize: isHero ? 23 : 16,
                        lineHeight: 1.15,
                        fontWeight: 950,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {title}
                    </h2>
                  )}

                  {badge && (
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "5px 9px",
                        background: isHero ? "rgba(255,255,255,0.18)" : theme.accentSoft,
                        border: `1px solid ${theme.border}`,
                        color: isHero ? "#FFFFFF" : theme.accentStrong,
                        fontSize: 10,
                        fontWeight: 950,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </div>

                {description && (
                  <p
                    style={{
                      margin: "7px 0 0",
                      fontSize: 12.5,
                      lineHeight: 1.55,
                      color: isHero ? "rgba(255,255,255,0.88)" : theme.muted,
                    }}
                  >
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {children && <div style={{ marginTop: title || description ? 14 : 0 }}>{children}</div>}

        {href && buttonText && (
          <Link
            href={href}
            style={{
              marginTop: 14,
              width: "100%",
              minHeight: 48,
              borderRadius: 16,
              background: isHero ? "#FFFFFF" : theme.accent,
              color: isHero ? "#1F6FB2" : "#FFFFFF",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 950,
              boxShadow: `0 12px 28px ${theme.glow}`,
            }}
          >
            {buttonText}
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </section>
  );

  return content;
}
