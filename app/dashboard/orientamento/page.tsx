"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import BottomNav from "@/components/ui/BottomNav";
import {
  Target,
  GraduationCap,
  FileCheck2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function OrientamentoHubPage() {
  const router = useRouter();

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        paddingBottom: 120,
        maxWidth: 430,
        margin: "0 auto",
        color: "#FFFFFF",
        background:
          "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
      }}
    >
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: 28,
          borderRadius: 32,
          background:
            "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 52%, #155487 100%)",
          color: "#FFFFFF",
          boxShadow: "0 24px 60px rgba(0,0,0,0.36)",
          border: "1px solid rgba(255,255,255,0.14)",
          marginBottom: 22,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -42,
            top: -42,
            width: 150,
            height: 150,
            borderRadius: 999,
            background: "rgba(255,255,255,0.14)",
          }}
        />

        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 22,
            background: "rgba(255,255,255,0.16)",
            border: "1px solid rgba(255,255,255,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Sparkles size={30} />
        </div>

        <p
          style={{
            margin: "0 0 8px",
            fontSize: 14,
            opacity: 0.92,
            fontWeight: 850,
            position: "relative",
            zIndex: 1,
          }}
        >
          Orientamento Laurea Smart
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: 35,
            lineHeight: 1.05,
            fontWeight: 900,
            letterSpacing: "-0.9px",
            position: "relative",
            zIndex: 1,
          }}
        >
          Capisci da dove partire
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            fontSize: 15,
            lineHeight: 1.6,
            opacity: 0.95,
            position: "relative",
            zIndex: 1,
          }}
        >
          Fai il test gratuito e scopri quale percorso universitario può essere
          più adatto al tuo profilo, al tuo lavoro e ai tuoi obiettivi.
        </p>
      </section>

      <div style={{ display: "grid", gap: 16 }}>
        <DarkActionCard
          icon={<Target size={25} />}
          title="Test di orientamento"
          description="Rispondi a poche domande e ricevi un primo consiglio personalizzato su area, percorso e priorità."
          badge="Consigliato"
          buttonLabel="Inizia il test gratuito"
          onClick={() => router.push("/dashboard/orientamento/test")}
        />

        <DarkActionCard
          icon={<GraduationCap size={25} />}
          title="Percorsi consigliati"
          description="Esplora lauree e percorsi coerenti con il tuo titolo di studio. Più interagisci, più i consigli diventano personalizzati in base ai tuoi interessi."
          badge="Nuovo"
          buttonLabel="Vedi i percorsi consigliati"
          onClick={() => router.push("/dashboard/percorsi")}
        />

        <section
          style={{
            padding: 22,
            borderRadius: 28,
            background:
              "linear-gradient(135deg, rgba(17,32,51,0.92) 0%, rgba(17,32,51,0.82) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 20,
              background: "rgba(58,160,255,0.16)",
              color: "#78C2FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
            }}
          >
            <FileCheck2 size={27} />
          </div>

          <div
            style={{
              display: "inline-flex",
              padding: "7px 11px",
              borderRadius: 999,
              background: "rgba(58,160,255,0.16)",
              color: "#78C2FF",
              fontSize: 12,
              fontWeight: 900,
              marginBottom: 12,
            }}
          >
            Possibile abbreviazione percorso
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 25,
              lineHeight: 1.12,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "-0.5px",
            }}
          >
            Hai già esami, titoli o esperienza lavorativa?
          </h2>

          <p
            style={{
              margin: "12px 0 0",
              fontSize: 15,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.68)",
            }}
          >
            In alcuni casi è possibile richiedere una valutazione del pregresso:
            esami universitari già sostenuti, titoli precedenti, certificazioni
            o competenze documentabili da CV possono aiutarti a costruire un
            percorso più rapido.
          </p>

          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 17,
              color: "rgba(255,255,255,0.76)",
              fontSize: 14,
              fontWeight: 750,
            }}
          >
            <Benefit text="Esami universitari già sostenuti" />
            <Benefit text="Titoli, master o percorsi precedenti" />
            <Benefit text="Esperienze e competenze documentabili" />
          </div>

          <div style={{ marginTop: 18 }}>
            <Button
              label="Verifica il percorso agevolato"
              variant="primary"
              onClick={() =>
                router.push("/dashboard/orientamento/percorso-agevolato")
              }
            />
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}

function DarkActionCard({
  icon,
  title,
  description,
  badge,
  buttonLabel,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  buttonLabel: string;
  onClick: () => void;
}) {
  return (
    <section
      style={{
        padding: 22,
        borderRadius: 28,
        background: "rgba(17,32,51,0.86)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 20,
            background: "rgba(58,160,255,0.16)",
            color: "#78C2FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
          }}
        >
          {icon}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              padding: "6px 10px",
              borderRadius: 999,
              background: "rgba(58,160,255,0.16)",
              color: "#78C2FF",
              fontSize: 11,
              fontWeight: 900,
              marginBottom: 9,
            }}
          >
            {badge}
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 22,
              lineHeight: 1.12,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "-0.4px",
            }}
          >
            {title}
          </h2>

          <p
            style={{
              margin: "9px 0 16px",
              fontSize: 14,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.66)",
            }}
          >
            {description}
          </p>

          <Button label={buttonLabel} variant="primary" onClick={onClick} />
        </div>
      </div>
    </section>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
      }}
    >
      <CheckCircle2 size={18} color="#78C2FF" />
      <span>{text}</span>
    </div>
  );
}
