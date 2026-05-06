"use client";

import BottomNav from "@/components/ui/BottomNav";
import { MessageCircle } from "lucide-react";

export default function ContattiPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        paddingBottom: 120,
        maxWidth: 430,
        margin: "0 auto",
        background: "#F8FBFF",
        fontFamily: "var(--font-geist-sans)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1F6FB2 0%, #155487 100%)",
          borderRadius: 28,
          padding: 28,
          color: "#FFFFFF",
          boxShadow: "0 18px 40px rgba(31,111,178,0.18)",
        }}
      >
        <p style={{ margin: "0 0 10px", fontSize: 14, opacity: 0.9 }}>
          Supporto Laurea Smart
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: 30,
            lineHeight: 1.1,
            fontWeight: 700,
          }}
        >
          Hai bisogno di orientamento?
        </h1>

        <p
          style={{
            marginTop: 16,
            lineHeight: 1.6,
            fontSize: 15,
            opacity: 0.95,
          }}
        >
          Contattaci direttamente su WhatsApp per ricevere gratuitamente un
          piano personalizzato in base ai tuoi obiettivi.
        </p>
      </div>

      <div
        style={{
          marginTop: 22,
          background: "#FFFFFF",
          border: "1px solid #E4EAF1",
          borderRadius: 24,
          padding: 22,
          boxShadow: "0 8px 28px rgba(15,23,42,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "#25D366",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
            }}
          >
            <MessageCircle size={26} />
          </div>

          <div>
            <h2 style={{ margin: 0, fontSize: 18, color: "#09090B" }}>
              WhatsApp diretto
            </h2>

            <p
              style={{
                margin: "4px 0 0",
                color: "#71717A",
                fontSize: 14,
              }}
            >
              Risposta rapida e supporto personalizzato.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/393298170817"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: "100%",
            height: 56,
            borderRadius: 18,
            background: "#25D366",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 16,
            boxShadow: "0 12px 24px rgba(37,211,102,0.22)",
          }}
        >
          Apri WhatsApp
        </a>
      </div>

      <BottomNav />
    </main>
  );
}
