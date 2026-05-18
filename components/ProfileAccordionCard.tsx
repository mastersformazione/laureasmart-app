"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type ProfileAccordionCardProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  defaultOpen?: boolean;
  icon?: ReactNode;
  children: ReactNode;
};

export default function ProfileAccordionCard({
  title,
  subtitle,
  badge,
  defaultOpen = false,
  icon,
  children,
}: ProfileAccordionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      style={{
        background: "rgba(15, 35, 58, 0.94)",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        borderRadius: 20,
        padding: 14,
        boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {icon && (
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                background: "rgba(31,111,178,0.22)",
                border: "1px solid rgba(96,165,250,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#60a5fa",
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
                  fontWeight: 900,
                  letterSpacing: "-0.01em",
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

            {subtitle && (
              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: 12,
                  lineHeight: 1.45,
                  color: "#cbd5e1",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#bfdbfe",
            flexShrink: 0,
          }}
        >
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {open && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px solid rgba(148, 163, 184, 0.16)",
          }}
        >
          {children}
        </div>
      )}
    </section>
  );
}
