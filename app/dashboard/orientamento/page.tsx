"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  MessageCircle,
  Route,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";

type GpsUser = {
  nome: string;
  email: string;
  telefono: string;
  interesse: string;
};

type Tone = "blue" | "teal" | "purple" | "amber" | "cyan";

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
    bg: "linear-gradient(135deg, rgba(59,130,246,0.30), rgba(11,23,40,0.96))",
    softBg: "rgba(59,130,246,0.13)",
    border: "rgba(96,165,250,0.30)",
    glow: "rgba(59,130,246,0.24)",
  },
  teal: {
    accent: "#2DD4BF",
    icon: "#99F6E4",
    bg: "linear-gradient(135deg, rgba(20,184,166,0.28), rgba(11,23,40,0.96))",
    softBg: "rgba(20,184,166,0.14)",
    border: "rgba(45,212,191,0.28)",
    glow: "rgba(20,184,166,0.24)",
  },
  purple: {
    accent: "#A78BFA",
    icon: "#DDD6FE",
    bg: "linear-gradient(135deg, rgba(139,92,246,0.30), rgba(11,23,40,0.96))",
    softBg: "rgba(139,92,246,0.14)",
    border: "rgba(167,139,250,0.30)",
    glow: "rgba(139,92,246,0.24)",
  },
  amber: {
    accent: "#FBBF24",
    icon: "#FDE68A",
    bg: "linear-gradient(135deg, rgba(245,158,11,0.28), rgba(11,23,40,0.96))",
    softBg: "rgba(245,158,11,0.14)",
    border: "rgba(251,191,36,0.30)",
    glow: "rgba(245,158,11,0.22)",
  },
  cyan: {
    accent: "#22D3EE",
    icon: "#A5F3FC",
    bg: "linear-gradient(135deg, rgba(6,182,212,0.28), rgba(11,23,40,0.96))",
    softBg: "rgba(6,182,212,0.14)",
    border: "rgba(34,211,238,0.30)",
    glow: "rgba(6,182,212,0.22)",
  },
};

function getLocalValue(key: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) || "";
}

function FeatureCard({
  icon,
  title,
  description,
  tone,
  onClick,
  badge,
  primary = false,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  tone: Tone;
  onClick: () => void;
  badge?: string;
  primary?: boolean;
}) {
  const theme = tones[tone];

  return (
    <section
      onClick={onClick}
      style={{
        borderRadius: primary ? 32 : 28,
        border: `1px solid ${theme.border}`,
        background: primary
          ? `linear-gradient(145deg, rgba(31,111,178,0.44), rgba(139,92,246,0.24), rgba(255,255,255,0.08))`
          : theme.bg,
        boxShadow: `0 24px 54px ${theme.glow}`,
        marginBottom: 14,
        cursor: "pointer",
        backdropFilter: "blur(16px)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${theme.accent}, transparent)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: -30,
          top: -28,
          width: 130,
          height: 130,
          borderRadius: 999,
          background: `radial-gradient(circle, ${theme.softBg}, transparent 68%)`,
        }}
      />

      <div
        style={{ padding: primary ? 20 : 16, position: "relative", zIndex: 1 }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
          <div
            style={{
              width: primary ? 58 : 48,
              height: primary ? 58 : 48,
              minWidth: primary ? 58 : 48,
              borderRadius: primary ? 22 : 18,
              background: theme.softBg,
              border: `1px solid ${theme.border}`,
              color: theme.icon,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 16px 32px ${theme.glow}`,
            }}
          >
            {icon}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {badge && (
                <span
                  style={{
                    display: "inline-flex",
                    padding: "5px 9px",
                    borderRadius: 999,
                    background: theme.softBg,
                    border: `1px solid ${theme.border}`,
                    color: theme.icon,
                    fontSize: 10,
                    fontWeight: 950,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                  }}
                >
                  {badge}
                </span>
              )}
            </div>

            <h2
              style={{
                margin: badge ? "9px 0 7px" : "0 0 7px",
                fontSize: primary ? 24 : 19,
                lineHeight: 1.08,
                fontWeight: 950,
                letterSpacing: -0.6,
                color: "#FFFFFF",
              }}
            >
              {title}
            </h2>

            <p
              style={{
                margin: 0,
                fontSize: primary ? 14 : 13,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.74)",
              }}
            >
              {description}
            </p>
          </div>

          <div
            style={{
              width: 34,
              minWidth: 34,
              height: 34,
              borderRadius: 14,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.icon,
              marginTop: 2,
            }}
          >
            <ArrowRight size={17} />
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStep({
  icon,
  title,
  description,
  tone,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  tone: Tone;
}) {
  const theme = tones[tone];

  return (
    <div
      style={{
        borderRadius: 20,
        border: `1px solid ${theme.border}`,
        background: theme.softBg,
        padding: 12,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.icon,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.10)",
          marginBottom: 9,
        }}
      >
        {icon}
      </div>
      <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 950 }}>
        {title}
      </p>
      <p
        style={{
          margin: 0,
          color: "rgba(255,255,255,0.63)",
          lineHeight: 1.45,
          fontSize: 11,
        }}
      >
        {description}
      </p>
    </div>
  );
}

function ContactCard({ onClick }: { onClick: () => void }) {
  return (
    <section
      onClick={onClick}
      style={{
        padding: 16,
        borderRadius: 28,
        background:
          "linear-gradient(135deg, rgba(20,184,166,0.22), rgba(17,32,51,0.94))",
        border: "1px solid rgba(45,212,191,0.24)",
        boxShadow: "0 22px 50px rgba(20,184,166,0.18)",
        cursor: "pointer",
        backdropFilter: "blur(16px)",
        marginTop: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: "linear-gradient(180deg, #2DD4BF, #60A5FA)",
        }}
      />
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          paddingLeft: 4,
        }}
      >
        <div
          style={{
            width: 44,
            minWidth: 44,
            height: 44,
            borderRadius: 17,
            background: "rgba(20,184,166,0.14)",
            border: "1px solid rgba(45,212,191,0.22)",
            color: "#99F6E4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MessageCircle size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <h3 style={{ margin: 0, fontSize: 17, lineHeight: 1.2 }}>
              Hai ancora dubbi?
            </h3>
            <span
              style={{
                padding: "4px 8px",
                borderRadius: 999,
                background: "rgba(20,184,166,0.14)",
                border: "1px solid rgba(45,212,191,0.24)",
                color: "#99F6E4",
                fontSize: 10,
                fontWeight: 950,
              }}
            >
              Gratis
            </span>
          </div>
          <p
            style={{
              margin: "8px 0 10px",
              fontSize: 13,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            Un orientatore può aiutarti gratuitamente a leggere il risultato del
            test e capire quale strada seguire.
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              color: "#99F6E4",
              fontSize: 13,
              fontWeight: 900,
            }}
          >
            Parla con un orientatore
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function OrientamentoPage() {
  const router = useRouter();
  const [user, setUser] = useState<GpsUser | null>(null);
  const [profiloUtente, setProfiloUtente] = useState("");
  const [pianoGenerato, setPianoGenerato] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("gps_user");

    if (!storedUser) {
      router.push("/register");
      return;
    }

    setUser(JSON.parse(storedUser) as GpsUser);
    setProfiloUtente(
      getLocalValue("profilo_utente") || getLocalValue("area_interesse")
    );
    setPianoGenerato(getLocalValue("piano_personale_generato") === "SI");
  }, [router]);

  const firstName = useMemo(() => {
    if (!user?.nome) return "";
    return user.nome.split(" ")[0];
  }, [user]);

  if (!user) return null;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "22px 18px 120px",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
        maxWidth: 500,
        margin: "0 auto",
        color: "#FFFFFF",
        background:
          "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
      }}
    >
      <section
        style={{
          borderRadius: 34,
          padding: 20,
          color: "#FFFFFF",
          marginBottom: 16,
          border: "1px solid rgba(255,255,255,0.12)",
          background:
            "linear-gradient(145deg, rgba(31,111,178,0.45), rgba(139,92,246,0.20), rgba(255,255,255,0.07))",
          boxShadow: "0 26px 62px rgba(0,0,0,0.32)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -36,
            top: -38,
            width: 155,
            height: 155,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(58,160,255,0.24), transparent 68%)",
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
            border: "1px solid rgba(255,255,255,0.11)",
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
              letterSpacing: 0.7,
            }}
          >
            Orientamento Laurea Smart
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 62,
              minWidth: 62,
              height: 62,
              borderRadius: 24,
              background: "linear-gradient(135deg, #1F6FB2, #8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 18px 40px rgba(31,111,178,0.35)",
            }}
          >
            <GraduationCap size={31} />
          </div>

          <div style={{ flex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 31,
                lineHeight: 1.05,
                fontWeight: 950,
                letterSpacing: "-0.9px",
              }}
            >
              {firstName
                ? `${firstName}, scegli il prossimo passo`
                : "Scegli il prossimo passo"}
            </h1>

            <p
              style={{
                margin: "12px 0 0",
                fontSize: 14,
                lineHeight: 1.62,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Valuta il percorso più adatto, aggiorna il test, genera un piano
              personale o chiedi supporto a un orientatore.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 17,
            position: "relative",
            zIndex: 1,
          }}
        >
          <MiniStep
            tone="blue"
            icon={<UserRound size={17} />}
            title={profiloUtente || "Profilo da definire"}
            description="Dati del test"
          />
          <MiniStep
            tone={pianoGenerato ? "teal" : "purple"}
            icon={
              pianoGenerato ? (
                <CheckCircle2 size={17} />
              ) : (
                <FileText size={17} />
              )
            }
            title={pianoGenerato ? "Piano creato" : "Piano da creare"}
            description="Analisi personale"
          />
        </div>
      </section>

      <FeatureCard
        icon={<ClipboardCheck size={27} />}
        title="Aggiorna il tuo test"
        description="Rivedi obiettivi, tempo disponibile, area di interesse e aspetti da valutare prima dell’iscrizione."
        tone="purple"
        badge="Punto di partenza"
        primary
        onClick={() => router.push("/dashboard/orientamento/test")}
      />

      <FeatureCard
        icon={<FileText size={27} />}
        title="Piano Universitario Personalizzato"
        description="Trasforma test, profilo e percorso in una prima analisi orientativa da inviare all’orientatore."
        tone="cyan"
        badge="Nuovo"
        onClick={() => router.push("/dashboard/piano-personale")}
      />

      <FeatureCard
        icon={<Route size={27} />}
        title="Percorso agevolato"
        description="Scopri se puoi accedere a un percorso più rapido, sostenibile o personalizzato in base al tuo profilo."
        tone="teal"
        badge="Consigliato"
        onClick={() =>
          router.push("/dashboard/orientamento/percorso-agevolato")
        }
      />

      <FeatureCard
        icon={<BookOpen size={27} />}
        title="Esplora i percorsi"
        description="Consulta lauree, magistrali e master disponibili e continua dai corsi più coerenti con i tuoi obiettivi."
        tone="blue"
        onClick={() => router.push("/dashboard/percorsi")}
      />

      <section
        style={{
          borderRadius: 28,
          border: "1px solid rgba(251,191,36,0.24)",
          background:
            "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(17,32,51,0.92))",
          padding: 15,
          boxShadow: "0 20px 44px rgba(245,158,11,0.12)",
          marginTop: 2,
        }}
      >
        <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
          <div
            style={{
              width: 40,
              minWidth: 40,
              height: 40,
              borderRadius: 16,
              background: "rgba(245,158,11,0.14)",
              border: "1px solid rgba(251,191,36,0.24)",
              color: "#FDE68A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Target size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 15 }}>
              Come usare questa sezione
            </h3>
            <p
              style={{
                margin: "7px 0 0",
                fontSize: 12,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.68)",
              }}
            >
              Parti dal test se vuoi aggiornare il profilo. Usa il Piano
              Personalizzato se vuoi trasformare le risposte in una traccia
              concreta da valutare con un orientatore.
            </p>
          </div>
        </div>
      </section>

      <ContactCard onClick={() => router.push("/dashboard/contatti")} />

      <BottomNav />
    </main>
  );
}
