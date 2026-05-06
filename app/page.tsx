"use client";

import { useState } from "react";
import InstallButton from "./install-button";
import { useRouter } from "next/navigation";
import ActionSheet from "@/components/ActionSheet";
import Button from "@/components/ui/Button";

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
          Trova il percorso universitario più adatto a te
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
          Installa la app, rispondi a poche domande e ricevi consigli
          personalizzati su lauree, master e percorsi agevolati.
        </p>

        <div
          style={{
            display: "grid",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 16,
              background: "#FFFFFF",
              border: "1px solid #DDEAF5",
              textAlign: "left",
              fontSize: 15,
              boxShadow: "0 8px 24px rgba(16, 32, 51, 0.04)",
            }}
          >
            🎯 Orientamento gratuito e personalizzato
          </div>

          <div
            style={{
              padding: "14px 16px",
              borderRadius: 16,
              background: "#FFFFFF",
              border: "1px solid #DDEAF5",
              textAlign: "left",
              fontSize: 15,
              boxShadow: "0 8px 24px rgba(16, 32, 51, 0.04)",
            }}
          >
            🔔 Notifiche su scadenze e opportunità
          </div>

          <div
            style={{
              padding: "14px 16px",
              borderRadius: 16,
              background: "#FFFFFF",
              border: "1px solid #DDEAF5",
              textAlign: "left",
              fontSize: 15,
              boxShadow: "0 8px 24px rgba(16, 32, 51, 0.04)",
            }}
          >
            💬 Supporto diretto dopo il test
          </div>
        </div>

        <InstallButton />

        <div style={{ marginTop: 12 }}>
          <Button
            label="Accedi o registrati"
            variant="secondary"
            onClick={() => setMenuOpen(true)}
          />
        </div>

        <p
          style={{
            margin: "18px auto 0",
            fontSize: 13,
            color: "#6B7280",
            lineHeight: 1.45,
            maxWidth: 330,
          }}
        >
          Su iPhone puoi installarla dal pulsante di condivisione di Safari e
          poi “Aggiungi alla schermata Home”.
        </p>
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
