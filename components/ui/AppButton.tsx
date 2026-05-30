"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type AppButtonVariant =
  | "primary"
  | "secondary"
  | "white"
  | "whatsapp"
  | "danger"
  | "ghost";

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: AppButtonVariant;
  fullWidth?: boolean;
};

const variants: Record<AppButtonVariant, React.CSSProperties> = {
  primary: {
    background: "var(--ls-primary)",
    color: "#FFFFFF",
    border: "1px solid rgba(31,111,178,0.20)",
  },
  secondary: {
    background: "var(--ls-blue-soft)",
    color: "var(--ls-primary)",
    border: "1px solid var(--ls-blue-border)",
  },
  white: {
    background: "#FFFFFF",
    color: "var(--ls-primary)",
    border: "1px solid rgba(31,111,178,0.16)",
  },
  whatsapp: {
    background: "#25D366",
    color: "#FFFFFF",
    border: "1px solid rgba(37,211,102,0.20)",
  },
  danger: {
    background: "var(--ls-red-soft)",
    color: "var(--ls-red-text)",
    border: "1px solid var(--ls-red-border)",
  },
  ghost: {
    background: "transparent",
    color: "var(--ls-primary)",
    border: "1px solid rgba(31,111,178,0.14)",
  },
};

export default function AppButton({
  children,
  variant = "primary",
  fullWidth = true,
  disabled,
  style,
  ...props
}: AppButtonProps) {
  return (
    <button
      disabled={disabled}
      style={{
        minHeight: 48,
        width: fullWidth ? "100%" : "auto",
        borderRadius: 17,
        padding: "0 18px",
        fontSize: 15,
        fontWeight: 850,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        boxShadow: variant === "primary" ? "var(--ls-blue-shadow)" : "none",
        transition: "transform 0.16s ease, opacity 0.16s ease",
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
