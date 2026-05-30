"use client";

import type { ReactNode } from "react";

type AppBadgeVariant =
  | "blue"
  | "green"
  | "purple"
  | "amber"
  | "red"
  | "gray"
  | "white";

type AppBadgeProps = {
  children: ReactNode;
  variant?: AppBadgeVariant;
};

const variants: Record<
  AppBadgeVariant,
  {
    background: string;
    color: string;
    border: string;
  }
> = {
  blue: {
    background: "rgba(31,111,178,0.10)",
    color: "var(--ls-primary)",
    border: "1px solid rgba(31,111,178,0.12)",
  },
  green: {
    background: "rgba(22,163,74,0.10)",
    color: "var(--ls-green-text)",
    border: "1px solid rgba(22,163,74,0.12)",
  },
  purple: {
    background: "rgba(126,34,206,0.10)",
    color: "var(--ls-purple-text)",
    border: "1px solid rgba(126,34,206,0.12)",
  },
  amber: {
    background: "rgba(180,83,9,0.10)",
    color: "var(--ls-amber-text)",
    border: "1px solid rgba(180,83,9,0.12)",
  },
  red: {
    background: "rgba(220,38,38,0.10)",
    color: "var(--ls-red-text)",
    border: "1px solid rgba(220,38,38,0.12)",
  },
  gray: {
    background: "rgba(100,116,139,0.10)",
    color: "var(--ls-gray-text)",
    border: "1px solid rgba(100,116,139,0.12)",
  },
  white: {
    background: "rgba(255,255,255,0.12)",
    color: "#FFFFFF",
    border: "1px solid rgba(255,255,255,0.14)",
  },
};

export default function AppBadge({
  children,
  variant = "blue",
}: AppBadgeProps) {
  const style = variants[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "6px 10px",
        background: style.background,
        color: style.color,
        border: style.border,
        fontSize: 12,
        fontWeight: 850,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
