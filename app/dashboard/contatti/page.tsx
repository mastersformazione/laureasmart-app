"use client";

import BottomNav from "@/components/ui/BottomNav";
import {
  MessageCircle,
  Clock,
  ShieldCheck,
  UserRound,
  HeartHandshake,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function ContattiPage() {
  const whatsappText = encodeURIComponent(
    "Ciao, vorrei parlare gratuitamente con un orientatore Laurea Smart per capire quale percorso universitario può essere più adatto a me."
  );

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
          background:
            "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 52%, #155487 100%)",
          borderRadius: 32,
          padding: 28,
          color: "#FFFFFF",
          boxShadow: "0 24px 60px rgba(0,0,0,0.36)",
          border: "1px solid rgba(255,255,255,0.14)",
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
            position: "absolute",
            left: -54,
            bottom: -64,
            width: 180,
            height: 180,
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
          }}
        />

        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 22,
            background: "rgba(255,255,255,0.16)",
            border: "1px solid rgba(255,255,255,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
            backdropFilter: "blur(10px)",
            boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <HeartHandshake size={30} />
        </div>

        <p
          style={{
            margin: "0 0 10px",
            fontSize: 14,
            opacity: 0.92,
            fontWeight: 800,
            position: "relative",
            zIndex: 1,
          }}
        >
          Supporto Laurea Smart
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: 34,
            lineHeight: 1.04,
            fontWeight: 900,
            letterSpacing: "-1px",
            position: "relative",
            zIndex: 1,
          }}
        >
          Parla gratis con un orientatore
        </h1>

        <p
          style={{
            marginTop: 16,
            lineHeight: 1.6,
            fontSize: 15,
            opacity: 0.96,
            position: "relative",
            zIndex: 1,
          }}
        >
          Una persona reale ti aiuta a capire da dove partire, quale percorso
          valutare e quali possibilità possono essere più adatte al tuo profilo.
        </p>
      </section>

      <section
        style={{
          marginTop: 20,
          padding: 18,
          borderRadius: 28,
          background: "rgba(17,32,51,0.86)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
          backdropFilter: "blur(16px)",
        }}
      >
        <InfoRow
          icon={<UserRound size={23} />}
          title="Orientatore reale"
          text="Non è una risposta automatica: verrai seguito da una persona che può ascoltare il tuo caso."
        />

        <InfoRow
          icon={<Clock size={23} />}
          title="Disponibile dal lunedì al venerdì"
          text="Orari: 9:00–13:00 e 15:00–18:00."
        />

        <InfoRow
          icon={<ShieldCheck size={23} />}
          title="Nessun impegno"
          text="Il contatto è gratuito e non comporta alcun obbligo di iscrizione."
        />

        <InfoRow
          icon={<HeartHandshake size={23} />}
          title="Consulenza tranquilla"
          text="Puoi fare domande su costi, tempi, corsi, CFU e modalità di studio online."
          last
        />
      </section>

      <section
        style={{
          marginTop: 22,
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(37,211,102,0.18) 0%, rgba(17,32,51,0.92) 48%, rgba(17,32,51,0.96) 100%)",
          border: "1px solid rgba(37,211,102,0.28)",
          borderRadius: 32,
          padding: 24,
          boxShadow: "0 22px 54px rgba(0,0,0,0.34)",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -46,
            top: -46,
            width: 150,
            height: 150,
            borderRadius: 999,
            background: "rgba(37,211,102,0.16)",
          }}
        />

        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 24,
            background: "#25D366",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            marginBottom: 18,
            boxShadow: "0 16px 34px rgba(37,211,102,0.28)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <MessageCircle size={32} />
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px",
            borderRadius: 999,
            background: "rgba(37,211,102,0.13)",
            color: "#7CFFB1",
            fontSize: 12,
            fontWeight: 900,
            marginBottom: 14,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Sparkles size={14} />
          Risposta da un consulente reale
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: 26,
            lineHeight: 1.12,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "-0.6px",
            position: "relative",
            zIndex: 1,
          }}
        >
          Scrivici ora su WhatsApp
        </h2>

        <p
          style={{
            margin: "12px 0 20px",
            color: "rgba(255,255,255,0.72)",
            fontSize: 15,
            lineHeight: 1.6,
            position: "relative",
            zIndex: 1,
          }}
        >
          Ti risponderemo appena possibile negli orari di disponibilità. Puoi
          anche scrivere solo per chiarire un dubbio iniziale.
        </p>

        <a
          href={`https://wa.me/393793673257?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: "100%",
            height: 62,
            borderRadius: 22,
            background: "#25D366",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            textDecoration: "none",
            fontWeight: 900,
            fontSize: 17,
            boxShadow: "0 16px 34px rgba(37,211,102,0.30)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <MessageCircle size={22} />
          Apri WhatsApp
          <ArrowRight size={20} />
        </a>
      </section>

      <p
        style={{
          margin: "18px auto 0",
          textAlign: "center",
          color: "rgba(255,255,255,0.58)",
          fontSize: 13,
          lineHeight: 1.5,
          maxWidth: 330,
        }}
      >
        Il servizio serve solo a orientarti meglio: decidi tu se e quando
        proseguire.
      </p>

      <BottomNav />
    </main>
  );
}

function InfoRow({
  icon,
  title,
  text,
  last,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 13,
        paddingBottom: last ? 0 : 16,
        marginBottom: last ? 0 : 16,
        borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 17,
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

      <div>
        <h3
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 900,
            color: "#FFFFFF",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: "6px 0 0",
            fontSize: 14,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.66)",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
