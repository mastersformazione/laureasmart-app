"use client";

import { useState } from "react";
import InstallButton from "./install-button";
import { useRouter } from "next/navigation";
import ActionSheet from "@/components/ActionSheet";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAction = (action: string) => {
    setMenuOpen(false);

    if (action === "Accedi") {
      router.push("/dashboard");
    }

    if (action === "Registrati") {
      router.push("/register");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "28px 20px 40px",
        fontFamily: "Arial",
        maxWidth: 440,
        margin: "0 auto",
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 48%)",
      }}
    >
      <Header
        title="Laurea Smart"
        subtitle="Installa la app e scopri il percorso universitario online più adatto ai tuoi obiettivi, al tuo lavoro e al tuo futuro."
      />

      <section
        style={{
          marginTop: 24,
          padding: 22,
          borderRadius: 22,
          background: "linear-gradient(135deg, #111827 0%, #2563eb 100%)",
          color: "#fff",
          boxShadow: "0 14px 35px rgba(37, 99, 235, 0.22)",
        }}
      >
        <h1 style={{ margin: "0 0 12px", fontSize: 28, lineHeight: 1.12 }}>
          Trova la laurea giusta senza perdere tempo
        </h1>

        <p style={{ margin: 0, lineHeight: 1.6, fontSize: 15 }}>
          Rispondi a poche domande, ricevi consigli personalizzati e resta
          aggiornato su lauree, master, percorsi agevolati e opportunità per
          crescere professionalmente.
        </p>
      </section>

      <section
        style={{
          marginTop: 22,
          display: "grid",
          gap: 12,
        }}
      >
        <div
          style={{
            padding: 16,
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            background: "#fff",
          }}
        >
          <strong>🎯 Orientamento personalizzato</strong>
          <p style={{ margin: "6px 0 0", color: "#555", lineHeight: 1.5 }}>
            Scopri se ti conviene una laurea, un master o un percorso
            universitario agevolato.
          </p>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            background: "#fff",
          }}
        >
          <strong>🔔 Aggiornamenti utili</strong>
          <p style={{ margin: "6px 0 0", color: "#555", lineHeight: 1.5 }}>
            Ricevi notifiche su novità, scadenze e opportunità formative.
          </p>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            background: "#fff",
          }}
        >
          <strong>💬 Supporto diretto</strong>
          <p style={{ margin: "6px 0 0", color: "#555", lineHeight: 1.5 }}>
            Dopo il test puoi richiedere un piano personalizzato su WhatsApp.
          </p>
        </div>
      </section>

      <div style={{ marginTop: 26, textAlign: "center" }}>
        <InstallButton />

        <div style={{ marginTop: 14 }}>
          <Button
            label="Accedi o registrati"
            variant="secondary"
            onClick={() => setMenuOpen(true)}
          />
        </div>

        <p
          style={{
            marginTop: 18,
            fontSize: 14,
            color: "#555",
            lineHeight: 1.5,
          }}
        >
          Installa la app per avere sempre a portata di mano il tuo percorso,
          gli aggiornamenti e gli strumenti di orientamento.
        </p>
      </div>

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
