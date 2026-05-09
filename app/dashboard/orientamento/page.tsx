"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import {
  BookOpen,
  Sparkles,
  GraduationCap,
  Route,
  ClipboardCheck,
  MessageCircle,
} from "lucide-react";

type GpsUser = {
  nome: string;
  email: string;
  telefono: string;
  interesse: string;
};

function FeatureCard({
  icon,
  title,
  description,
  gradient,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <section
      onClick={onClick}
      style={{
        background: "rgba(17,32,51,0.82)",
        borderRadius: 30,
        border: "1px solid rgba(255,255,255,0.08)",
        padding: 16,
        boxShadow: "0 18px 46px rgba(0,0,0,0.26)",
        marginBottom: 20,
        cursor: "pointer",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          minHeight: 155,
          borderRadius: 28,
          background: gradient,
          padding: 20,
          color: "#FFFFFF",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 16px 34px rgba(31,111,178,0.24)",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -34,
            top: -24,
            width: 140,
            height: 140,
            borderRadius: 999,
            background: "rgba(255,255,255,0.13)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: 18,
            top: "50%",
            transform: "translateY(-50%)",
            width: 56,
            height: 56,
            borderRadius: 999,
            background: "rgba(255,255,255,0.94)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1F6FB2",
            fontSize: 36,
            fontWeight: 900,
            boxShadow: "0 10px 24px rgba(0,0,0,0.20)",
          }}
        >
          ›
        </div>

        {badge && (
          <div
            style={{
              display: "inline-flex",
              marginBottom: 14,
              padding: "6px 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.18)",
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 850,
              letterSpacing: "0.3px",
            }}
          >
            {badge}
          </div>
        )}

        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 20,
            background: "rgba(0,0,0,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
            backdropFilter: "blur(8px)",
            boxShadow: "0 10px 24px rgba(0,0,0,0.16)",
          }}
        >
          {icon}
        </div>

        <h2
          style={{
            margin: "0 80px 8px 0",
            fontSize: 24,
            lineHeight: 1.04,
            fontWeight: 850,
            letterSpacing: "-0.8px",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.55,
            opacity: 0.96,
            maxWidth: 290,
          }}
        >
          {description}
        </p>
      </div>
    </section>
  );
}

export default function OrientamentoPage() {
  const router = useRouter();
  const [user, setUser] = useState<GpsUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("gps_user");

    if (!storedUser) {
      router.push("/register");
      return;
    }

    setUser(JSON.parse(storedUser) as GpsUser);
  }, [router]);

  if (!user) return null;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "22px 18px 120px",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
        maxWidth: 430,
        margin: "0 auto",
        color: "#FFFFFF",
        background:
          "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
      }}
    >
      <section
        style={{
          background:
            "linear-gradient(135deg, rgba(31,111,178,0.98) 0%, rgba(21,84,135,0.96) 100%)",
          borderRadius: 30,
          padding: 24,
          color: "#FFFFFF",
          boxShadow: "0 22px 54px rgba(0,0,0,0.34)",
          marginBottom: 20,
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 14,
            opacity: 0.9,
            fontWeight: 700,
          }}
        >
          Orientamento Laurea Smart
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: 32,
            lineHeight: 1.08,
            fontWeight: 850,
            letterSpacing: "-0.7px",
          }}
        >
          Scegli il prossimo passo giusto
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            fontSize: 15,
            lineHeight: 1.6,
            opacity: 0.95,
          }}
        >
          Da qui puoi valutare percorsi agevolati, esplorare i corsi consigliati
          oppure rifare il test se vuoi aggiornare il tuo profilo.
        </p>
      </section>

      <FeatureCard
        icon={<Route size={30} />}
        title="Percorso agevolato"
        description="Scopri se puoi accedere a un percorso più rapido, sostenibile o personalizzato in base al tuo profilo."
        gradient="linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 52%, #155487 100%)"
        badge="Consigliato"
        onClick={() =>
          router.push("/dashboard/orientamento/percorso-agevolato")
        }
      />

      <FeatureCard
        icon={<BookOpen size={30} />}
        title="Esplora i percorsi"
        description="Consulta lauree, magistrali e master disponibili e continua dai corsi più coerenti con i tuoi obiettivi."
        gradient="linear-gradient(135deg, #102033 0%, #1F6FB2 58%, #3AA0FF 100%)"
        onClick={() => router.push("/dashboard/percorsi")}
      />

      <FeatureCard
        icon={<ClipboardCheck size={30} />}
        title="Aggiorna il tuo test"
        description="Rifai il test di orientamento se sono cambiati obiettivi, tempo disponibile o area di interesse."
        gradient="linear-gradient(135deg, #0B2440 0%, #155487 52%, #1F6FB2 100%)"
        onClick={() => router.push("/dashboard/orientamento/test")}
      />

      <section style={{ marginTop: 22 }}>
        <DarkCard
          title="Hai ancora dubbi?"
          description="Un orientatore può aiutarti gratuitamente a leggere il risultato del test e capire quale strada seguire."
          badge="Gratis"
          onClick={() => router.push("/dashboard/contatti")}
        >
          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#3AA0FF",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            <MessageCircle size={18} />
            Parla con un orientatore
          </div>
        </DarkCard>
      </section>

      <BottomNav />
    </main>
  );
}

function DarkCard({
  title,
  description,
  badge,
  children,
  onClick,
}: {
  title: string;
  description: string;
  badge?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <section
      onClick={onClick}
      style={{
        padding: 18,
        borderRadius: 24,
        background: "rgba(17,32,51,0.86)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 14px 34px rgba(0,0,0,0.24)",
        cursor: onClick ? "pointer" : "default",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 17,
            lineHeight: 1.25,
            color: "#FFFFFF",
            fontWeight: 850,
          }}
        >
          {title}
        </h3>

        {badge && (
          <span
            style={{
              padding: "6px 10px",
              borderRadius: 999,
              background: "rgba(58,160,255,0.16)",
              color: "#78C2FF",
              fontSize: 11,
              fontWeight: 850,
              whiteSpace: "nowrap",
            }}
          >
            {badge}
          </span>
        )}
      </div>

      <p
        style={{
          margin: "10px 0 0",
          fontSize: 14,
          lineHeight: 1.5,
          color: "rgba(255,255,255,0.68)",
        }}
      >
        {description}
      </p>

      {children}
    </section>
  );
}
