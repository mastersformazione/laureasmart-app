"use client";

import type { ReactNode } from "react";

type AppCardVariant =
  | "white"
  | "blue"
  | "cyan"
  | "green"
  | "purple"
  | "amber"
  | "red"
  | "dark";

type AppCardProps = {
  children?: ReactNode;
  title?: string;
  description?: string;
  badge?: string;
  icon?: ReactNode;
  variant?: AppCardVariant;
  onClick?: () => void;
  className?: string;
};

const variantStyles: Record<
  AppCardVariant,
  {
    background: string;
    color: string;
    border: string;
    muted: string;
    badgeBg: string;
    badgeColor: string;
    iconBg: string;
    iconColor: string;
    shadow: string;
  }
> = {
  white: {
    background: "var(--ls-surface)",
    color: "var(--ls-text)",
    border: "1px solid var(--ls-border)",
    muted: "var(--ls-muted)",
    badgeBg: "rgba(31,111,178,0.10)",
    badgeColor: "var(--ls-primary)",
    iconBg: "rgba(31,111,178,0.10)",
    iconColor: "var(--ls-primary)",
    shadow: "var(--ls-soft-shadow)",
  },
  blue: {
    background: "var(--ls-blue-soft)",
    color: "var(--ls-text)",
    border: "1px solid var(--ls-blue-border)",
    muted: "var(--ls-text-soft)",
    badgeBg: "rgba(31,111,178,0.12)",
    badgeColor: "var(--ls-blue-text)",
    iconBg: "rgba(31,111,178,0.14)",
    iconColor: "var(--ls-blue-text)",
    shadow: "var(--ls-soft-shadow)",
  },
  cyan: {
    background: "var(--ls-cyan-soft)",
    color: "var(--ls-text)",
    border: "1px solid var(--ls-cyan-border)",
    muted: "var(--ls-text-soft)",
    badgeBg: "rgba(14,116,144,0.12)",
    badgeColor: "var(--ls-cyan-text)",
    iconBg: "rgba(14,116,144,0.12)",
    iconColor: "var(--ls-cyan-text)",
    shadow: "var(--ls-soft-shadow)",
  },
  green: {
    background: "var(--ls-green-soft)",
    color: "var(--ls-text)",
    border: "1px solid var(--ls-green-border)",
    muted: "var(--ls-text-soft)",
    badgeBg: "rgba(22,163,74,0.12)",
    badgeColor: "var(--ls-green-text)",
    iconBg: "rgba(22,163,74,0.12)",
    iconColor: "var(--ls-green-text)",
    shadow: "var(--ls-soft-shadow)",
  },
  purple: {
    background: "var(--ls-purple-soft)",
    color: "var(--ls-text)",
    border: "1px solid var(--ls-purple-border)",
    muted: "var(--ls-text-soft)",
    badgeBg: "rgba(126,34,206,0.12)",
    badgeColor: "var(--ls-purple-text)",
    iconBg: "rgba(126,34,206,0.12)",
    iconColor: "var(--ls-purple-text)",
    shadow: "var(--ls-soft-shadow)",
  },
  amber: {
    background: "var(--ls-amber-soft)",
    color: "var(--ls-text)",
    border: "1px solid var(--ls-amber-border)",
    muted: "var(--ls-text-soft)",
    badgeBg: "rgba(180,83,9,0.12)",
    badgeColor: "var(--ls-amber-text)",
    iconBg: "rgba(180,83,9,0.12)",
    iconColor: "var(--ls-amber-text)",
    shadow: "var(--ls-soft-shadow)",
  },
  red: {
    background: "var(--ls-red-soft)",
    color: "var(--ls-text)",
    border: "1px solid var(--ls-red-border)",
    muted: "var(--ls-text-soft)",
    badgeBg: "rgba(220,38,38,0.12)",
    badgeColor: "var(--ls-red-text)",
    iconBg: "rgba(220,38,38,0.12)",
    iconColor: "var(--ls-red-text)",
    shadow: "var(--ls-soft-shadow)",
  },
  dark: {
    background: "rgba(255,255,255,0.08)",
    color: "#FFFFFF",
    border: "1px solid rgba(255,255,255,0.12)",
    muted: "rgba(255,255,255,0.68)",
    badgeBg: "rgba(255,255,255,0.12)",
    badgeColor: "#FFFFFF",
    iconBg: "rgba(255,255,255,0.12)",
    iconColor: "#FFFFFF",
    shadow: "var(--ls-card-shadow)",
  },
};

export default function AppCard({
  children,
  title,
  description,
  badge,
  icon,
  variant = "white",
  onClick,
  className = "",
}: AppCardProps) {
  const style = variantStyles[variant];

  return (
    <section
      onClick={onClick}
      className={className}
      style={{
        borderRadius: "var(--ls-radius-xl)",
        background: style.background,
        color: style.color,
        border: style.border,
        padding: 20,
        boxShadow: style.shadow,
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.16s ease, box-shadow 0.16s ease",
      }}
    >
      {(title || description || badge || icon) && (
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
            marginBottom: children ? 16 : 0,
          }}
        >
          {icon && (
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 18,
                background: style.iconBg,
                color: style.iconColor,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              {title && (
                <h2
                  style={{
                    margin: 0,
                    fontSize: 21,
                    lineHeight: 1.16,
                    letterSpacing: "-0.035em",
                    fontWeight: 900,
                  }}
                >
                  {title}
                </h2>
              )}

              {badge && (
                <span
                  style={{
                    borderRadius: 999,
                    padding: "6px 10px",
                    background: style.badgeBg,
                    color: style.badgeColor,
                    fontSize: 12,
                    fontWeight: 850,
                    whiteSpace: "nowrap",
                    lineHeight: 1,
                  }}
                >
                  {badge}
                </span>
              )}
            </div>

            {description && (
              <p
                style={{
                  margin: "8px 0 0",
                  color: style.muted,
                  fontSize: 15,
                  lineHeight: 1.58,
                  fontWeight: 550,
                }}
              >
                {description}
              </p>
            )}
          </div>
        </div>
      )}

      {children && (
        <div
          style={{
            fontSize: 15,
            lineHeight: 1.58,
          }}
        >
          {children}
        </div>
      )}
    </section>
  );
}
