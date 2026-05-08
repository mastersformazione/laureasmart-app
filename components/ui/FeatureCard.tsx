"use client";

import { ChevronRight } from "lucide-react";

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  gradient?: string;
  highlight?: boolean;
};

export default function FeatureCard({
  icon,
  title,
  description,
  onClick,
  gradient = "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 52%, #155487 100%)",
  highlight = false,
}: Props) {
  return (
    <section
      onClick={onClick}
      style={{
        background: "#FFFFFF",
        borderRadius: 30,
        border: highlight
          ? "2px solid rgba(255,196,64,0.35)"
          : "1px solid #E4EAF1",
        padding: 18,
        boxShadow: highlight
          ? "0 16px 40px rgba(255,196,64,0.16)"
          : "0 12px 34px rgba(15,23,42,0.08)",
        marginBottom: 20,
        cursor: "pointer",
        transition: "all .2s ease",
      }}
    >
      <div
        style={{
          minHeight: 145,
          borderRadius: 26,
          background: gradient,
          padding: 20,
          color: "#FFFFFF",
          position: "relative",
          overflow: "hidden",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -35,
            top: -20,
            width: 140,
            height: 140,
            borderRadius: 999,
            background: "rgba(255,255,255,0.14)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: 18,
            top: "50%",
            transform: "translateY(-50%)",
            width: 54,
            height: 54,
            borderRadius: 999,
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.14)",
          }}
        >
          <ChevronRight size={30} color="#1F6FB2" />
        </div>

        {highlight && (
          <div
            style={{
              display: "inline-flex",
              marginBottom: 14,
              padding: "6px 12px",
              borderRadius: 999,
              background: "#FFC940",
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.3px",
              boxShadow: "0 6px 16px rgba(255,201,64,0.30)",
            }}
          >
            NOVITÀ
          </div>
        )}

        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 20,
            background: "rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
            backdropFilter: "blur(8px)",
            boxShadow: "0 10px 22px rgba(0,0,0,0.18)",
          }}
        >
          {icon}
        </div>

        <h2
          style={{
            margin: "0 70px 8px 0",
            fontSize: 24,
            lineHeight: 1.05,
            fontWeight: 850,
            letterSpacing: "-0.8px",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: 0,
            maxWidth: 280,
            fontSize: 15,
            lineHeight: 1.5,
            opacity: 0.96,
          }}
        >
          {description}
        </p>
      </div>
    </section>
  );
}
