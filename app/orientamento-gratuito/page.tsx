// File: app/orientamento-gratuito/page.tsx
"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  GraduationCap,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

type Tone = "blue" | "purple" | "teal" | "amber";

const tones: Record<
  Tone,
  {
    accent: string;
    icon: string;
    bg: string;
    softBg: string;
    border: string;
    glow: string;
  }
> = {
  blue: {
    accent: "#60A5FA",
    icon: "#BFDBFE",
    bg: "linear-gradient(135deg, rgba(59,130,246,0.24), rgba(12,25,42,0.96))",
    softBg: "rgba(59,130,246,0.13)",
    border: "rgba(96,165,250,0.28)",
    glow: "rgba(59,130,246,0.22)",
  },
  purple: {
    accent: "#A78BFA",
    icon: "#DDD6FE",
    bg: "linear-gradient(135deg, rgba(139,92,246,0.26), rgba(12,25,42,0.96))",
    softBg: "rgba(139,92,246,0.13)",
    border: "rgba(167,139,250,0.30)",
    glow: "rgba(139,92,246,0.22)",
  },
  teal: {
    accent: "#2DD4BF",
    icon: "#99F6E4",
    bg: "linear-gradient(135deg, rgba(20,184,166,0.24), rgba(12,25,42,0.96))",
    softBg: "rgba(20,184,166,0.13)",
    border: "rgba(45,212,191,0.28)",
    glow: "rgba(20,184,166,0.22)",
  },
  amber: {
    accent: "#FBBF24",
    icon: "#FDE68A",
    bg: "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(12,25,42,0.96))",
    softBg: "rgba(245,158,11,0.13)",
    border: "rgba(251,191,36,0.28)",
    glow: "rgba(245,158,11,0.20)",
  },
};

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "22px 18px 54px",
  maxWidth: 500,
  margin: "0 auto",
  color: "#FFFFFF",
  background:
    "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
  fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
  overflowX: "hidden",
  boxSizing: "border-box",
};

const glassCard: CSSProperties = {
  borderRadius: 28,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  boxShadow: "0 24px 60px rgba(0,0,0,0.26)",
  backdropFilter: "blur(12px)",
};

const primaryButtonStyle: CSSProperties = {
  minHeight: 56,
  borderRadius: 18,
  border: "none",
  background: "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 100%)",
  color: "white",
  fontSize: 15,
  fontWeight: 950,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  padding: "0 18px",
  cursor: "pointer",
  textDecoration: "none",
  boxShadow: "0 18px 38px rgba(31,111,178,0.34)",
};

function startOnboarding() {
  try {
    localStorage.setItem("onboarding_start", new Date().toISOString());
    localStorage.setItem("onboarding_source", "landing_orientamento_gratuito");
  } catch {
    // evita blocchi se localStorage non è disponibile
  }
}

function MiniCard({
  icon,
  title,
  text,
  tone,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  tone: Tone;
}) {
  const theme = tones[tone];

  return (
    <section
      style={{
        borderRadius: 24,
        border: `1px solid ${theme.border}`,
        background: theme.bg,
        padding: 15,
        boxShadow: `0 20px 42px ${theme.glow}`,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 16,
          background: theme.softBg,
          border: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.icon,
          marginBottom: 11,
        }}
      >
        {icon}
      </div>
      <h2 style={{ margin: 0, fontSize: 15, lineHeight: 1.25 }}>{title}</h2>
      <p
        style={{
          margin: "7px 0 0",
          fontSize: 12,
          lineHeight: 1.55,
          color: "rgba(255,255,255,0.72)",
        }}
      >
        {text}
      </p>
    </section>
  );
}

function StepRow({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        padding: "13px 0",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          width: 34,
          minWidth: 34,
          height: 34,
          borderRadius: 13,
          background: "rgba(58,160,255,0.16)",
          border: "1px solid rgba(96,165,250,0.25)",
          color: "#BFDBFE",
          fontSize: 12,
          fontWeight: 950,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {number}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: 14 }}>{title}</h3>
        <p
          style={{
            margin: "5px 0 0",
            fontSize: 12,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.68)",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

export default function OrientamentoGratuitoLandingPage() {
  return (
    <main style={pageStyle}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 16,
              background: "linear-gradient(135deg, #1F6FB2, #3AA0FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 14px 30px rgba(31,111,178,0.32)",
            }}
          >
            <GraduationCap size={23} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 950 }}>
              Laurea Smart
            </p>
            <p
              style={{
                margin: "3px 0 0",
                fontSize: 11,
                color: "rgba(255,255,255,0.58)",
              }}
            >
              Orientamento universitario gratuito
            </p>
          </div>
        </div>

        <Link
          href="/register"
          style={{
            color: "#BFDBFE",
            textDecoration: "none",
            fontSize: 12,
            fontWeight: 900,
            border: "1px solid rgba(96,165,250,0.22)",
            borderRadius: 999,
            padding: "8px 11px",
            background: "rgba(59,130,246,0.10)",
          }}
        >
          Accedi
        </Link>
      </header>

      <section
        style={{
          ...glassCard,
          position: "relative",
          overflow: "hidden",
          padding: 21,
          marginBottom: 16,
          background:
            "linear-gradient(145deg, rgba(31,111,178,0.36), rgba(139,92,246,0.22), rgba(255,255,255,0.07))",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -38,
            top: -35,
            width: 145,
            height: 145,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(58,160,255,0.24), transparent 70%)",
          }}
        />

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "7px 12px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.10)",
            marginBottom: 15,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Sparkles size={14} color="#BFDBFE" />
          <span
            style={{
              fontSize: 11,
              fontWeight: 950,
              color: "#DBEAFE",
              letterSpacing: 0.5,
            }}
          >
            Test gratuito · risultato personalizzato
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 34,
            lineHeight: 1.04,
            letterSpacing: -1.15,
            position: "relative",
            zIndex: 1,
          }}
        >
          Scopri il percorso universitario più adatto a te
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            color: "rgba(255,255,255,0.78)",
            fontSize: 14,
            lineHeight: 1.7,
            position: "relative",
            zIndex: 1,
          }}
        >
          Rispondi a poche domande su obiettivo, tempo disponibile, situazione
          attuale e aspetti da valutare. Alla fine potrai salvare il risultato e
          ricevere una prima indicazione orientativa.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 18,
            position: "relative",
            zIndex: 1,
          }}
        >
          <MiniCard
            tone="blue"
            icon={<Clock size={18} />}
            title="2 minuti"
            text="Un test breve, pensato per partire subito."
          />
          <MiniCard
            tone="purple"
            icon={<FileText size={18} />}
            title="Risultato"
            text="Area, percorso e prossimo passo consigliato."
          />
        </div>

        <div
          style={{
            display: "grid",
            gap: 10,
            marginTop: 18,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Link
            href="/orientamento-gratuito/test"
            onClick={startOnboarding}
            style={primaryButtonStyle}
          >
            Inizia il test gratuito
            <ArrowRight size={19} />
          </Link>

          <p
            style={{
              margin: 0,
              textAlign: "center",
              fontSize: 11,
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.56)",
            }}
          >
            Gratuito, senza obbligo di iscrizione. Il risultato completo viene
            salvato solo dopo aver inserito i tuoi dati.
          </p>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <MiniCard
          tone="teal"
          icon={<Target size={18} />}
          title="Obiettivo"
          text="Capire quale percorso è coerente con ciò che vuoi ottenere."
        />
        <MiniCard
          tone="amber"
          icon={<ShieldCheck size={18} />}
          title="Valutazione"
          text="CFU, tempi, sostenibilità e possibili supporti da verificare."
        />
      </section>

      <section style={{ ...glassCard, padding: 18, marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 15,
              background: "rgba(59,130,246,0.13)",
              border: "1px solid rgba(96,165,250,0.22)",
              color: "#BFDBFE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ClipboardCheck size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18 }}>Come funziona</h2>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 12,
                color: "rgba(255,255,255,0.58)",
              }}
            >
              Un percorso guidato, senza domande inutili.
            </p>
          </div>
        </div>

        <StepRow
          number="01"
          title="Rispondi al test"
          text="Indichi situazione, obiettivo, tempo disponibile, area di interesse e aspetti da valutare."
        />
        <StepRow
          number="02"
          title="Salvi il risultato"
          text="Alla fine inserisci i dati per conservare il profilo e ricevere il riepilogo completo."
        />
        <StepRow
          number="03"
          title="Generi il piano"
          text="Puoi trasformare il risultato in un Piano Universitario Personalizzato e parlare con un orientatore."
        />
      </section>

      <section
        style={{
          borderRadius: 26,
          border: "1px solid rgba(45,212,191,0.24)",
          background:
            "linear-gradient(135deg, rgba(20,184,166,0.18), rgba(12,25,42,0.94))",
          padding: 18,
          marginBottom: 16,
          boxShadow: "0 22px 48px rgba(20,184,166,0.14)",
        }}
      >
        <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
          <div
            style={{
              width: 42,
              minWidth: 42,
              height: 42,
              borderRadius: 16,
              background: "rgba(20,184,166,0.14)",
              border: "1px solid rgba(45,212,191,0.24)",
              color: "#99F6E4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MessageCircle size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 17 }}>
              Non sai da dove partire?
            </h2>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 13,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.72)",
              }}
            >
              Il test serve proprio a questo: mettere ordine tra corsi,
              obiettivi, tempi, costi, eventuali CFU e supporti allo studio.
            </p>
          </div>
        </div>
      </section>

      <section
        style={{
          borderRadius: 22,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.045)",
          padding: 14,
        }}
      >
        <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
          <CheckCircle2
            size={17}
            color="#93C5FD"
            style={{ marginTop: 1, flexShrink: 0 }}
          />
          <p
            style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.58)",
            }}
          >
            Il risultato ha valore orientativo. Costi, agevolazioni, CFU
            riconoscibili e condizioni di iscrizione devono sempre essere
            verificati con l’ateneo o con un orientatore.
          </p>
        </div>
      </section>
    </main>
  );
}
