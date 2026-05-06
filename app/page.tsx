"use client";

import { useState } from "react";
import InstallButton from "./install-button";
import { useRouter } from "next/navigation";
import ActionSheet from "@/components/ActionSheet";
import Button from "@/components/ui/Button";
import { Share } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAction = (action: string) => {
    setMenuOpen(false);

    if (action === "Accedi") router.push("/dashboard");
    if (action === "Registrati") router.push("/register");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "34px 22px 34px",
        fontFamily: "Arial, sans-serif",
        maxWidth: 430,
        margin: "0 auto",
        background:
          "linear-gradient(180deg, #EAF4FC 0%, #FFFFFF 42%, #FFFFFF 100%)",
        color: "#102033",
      }}
    >
      <section
        style={{
          minHeight: "calc(100vh - 68px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 104,
            height: 104,
            margin: "0 auto 22px",
            borderRadius: 28,
            background: "linear-gradient(135deg, #1F6FB2 0%, #155487 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 18px 40px rgba(31, 111, 178, 0.25)",
            fontSize: 46,
          }}
        >
          🎓
        </div>

        <p
          style={{
            margin: "0 0 10px",
            color: "#1F6FB2",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Laurea Smart
        </p>

        <h1
          style={{
            margin: "0 auto 14px",
            fontSize: 31,
            lineHeight: 1.12,
            letterSpacing: "-0.5px",
            maxWidth: 360,
          }}
        >
          Trova il Percorso Universitario più adatto a te
        </h1>

        <p
          style={{
            margin: "0 auto 26px",
            color: "#5F6B7A",
            fontSize: 16,
            lineHeight: 1.55,
            maxWidth: 350,
          }}
        >
          Scarica la app e ricevi consigli personalizzati su Lauree, Master e
          percorsi agevolati e individualizzati.
        </p>

        <div
          style={{
            display: "grid",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <div style={cardStyle}>🎯 Orientamento Gratuito e Personalizzato</div>
          <div style={cardStyle}>
            🔔 Notifiche su Scadenze, Promozioni e Opportunità
          </div>
          <div style={cardStyle}>💬 Supporto Diretto e Individualizzato</div>
        </div>

        <InstallButton />

        <div
          style={{
            marginTop: 18,
            padding: "14px 16px",
            borderRadius: 18,
            background: "#F4F9FD",
            border: "1px solid #D7E7F5",
            textAlign: "left",
            boxShadow: "0 6px 18px rgba(31, 111, 178, 0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "#1F6FB2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 16,
              }}
            >
              📱
            </div>

            <strong style={{ fontSize: 14, color: "#102033" }}>
              Scarica su iPhone
            </strong>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#5F6B7A",
              lineHeight: 1.6,
            }}
          >
            Premi il pulsante{" "}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                borderRadius: 8,
                background: "#FFFFFF",
                border: "1px solid #D8E5F0",
                verticalAlign: "middle",
                margin: "0 4px",
              }}
            >
              <Share size={14} color="#1F6FB2" />
            </span>
            di Safari e seleziona{" "}
            <strong>“Aggiungi alla schermata Home”</strong>.
          </p>
        </div>

        <div style={{ marginTop: 18, opacity: 0.72 }}>
          <Button
            label="Accedi o Registrati"
            variant="secondary"
            onClick={() => setMenuOpen(true)}
          />
        </div>
      </section>

      {menuOpen && (
        <ActionSheet
          title="Cosa vuoi fare?"
          description="Accedi alla dashboard oppure crea il tuo profilo gratuito."
          actions={["Accedi", "Registrati"]}
          onAction={handleAction}
        />
      )}
    </main>
  );
}

const cardStyle = {
  padding: "14px 16px",
  borderRadius: 16,
  background: "#FFFFFF",
  border: "1px solid #DDEAF5",
  textAlign: "left" as const,
  fontSize: 15,
  boxShadow: "0 8px 24px rgba(16, 32, 51, 0.04)",
};
