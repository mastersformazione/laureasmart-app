"use client";

import BottomNav from "@/components/ui/BottomNav";
import {
  MessageCircle,
  Clock,
  ShieldCheck,
  UserRound,
  HeartHandshake,
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
        background: "#F8FBFF",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
      }}
    >
      <section
        style={{
          background: "linear-gradient(135deg, #1F6FB2 0%, #155487 100%)",
          borderRadius: 30,
          padding: 28,
          color: "#FFFFFF",
          boxShadow: "0 18px 40px rgba(31,111,178,0.18)",
        }}
      >
        <p
          style={{
            margin: "0 0 10px",
            fontSize: 14,
            opacity: 0.9,
            fontWeight: 700,
          }}
        >
          Supporto Laurea Smart
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
          Parla gratis con un orientatore
        </h1>

        <p
          style={{
            marginTop: 16,
            lineHeight: 1.6,
            fontSize: 15,
            opacity: 0.95,
          }}
        >
          Una persona reale ti aiuta a capire da dove partire, quale percorso
          valutare e quali possibilità possono essere più adatte al tuo profilo.
        </p>
      </section>

      <section
        style={{
          marginTop: 22,
          background: "#FFFFFF",
          border: "1px solid #E4EAF1",
          borderRadius: 26,
          padding: 22,
          boxShadow: "0 8px 28px rgba(15,23,42,0.05)",
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
          background: "#FFFFFF",
          border: "1px solid #D7E7F5",
          borderRadius: 28,
          padding: 22,
          boxShadow: "0 12px 34px rgba(15,23,42,0.06)",
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 20,
            background: "#25D366",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            marginBottom: 16,
            boxShadow: "0 12px 24px rgba(37,211,102,0.22)",
          }}
        >
          <MessageCircle size={29} />
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: 23,
            lineHeight: 1.15,
            fontWeight: 850,
            color: "#09090B",
            letterSpacing: "-0.4px",
          }}
        >
          Scrivici su WhatsApp
        </h2>

        <p
          style={{
            margin: "10px 0 18px",
            color: "#5F6B7A",
            fontSize: 15,
            lineHeight: 1.55,
          }}
        >
          Ti risponderemo appena possibile negli orari di disponibilità. Puoi
          anche scrivere solo per chiarire un dubbio iniziale.
        </p>

        <a
          href={`https://wa.me/393298170817?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: "100%",
            height: 58,
            borderRadius: 20,
            background: "#25D366",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            textDecoration: "none",
            fontWeight: 850,
            fontSize: 16,
            boxShadow: "0 12px 24px rgba(37,211,102,0.22)",
          }}
        >
          <MessageCircle size={22} />
          Apri WhatsApp
        </a>
      </section>

      <p
        style={{
          margin: "18px auto 0",
          textAlign: "center",
          color: "#71717A",
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
        borderBottom: last ? "none" : "1px solid #EEF2F6",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 16,
          background: "#EAF4FC",
          color: "#1F6FB2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div>
        <h3
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 850,
            color: "#102033",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: "5px 0 0",
            fontSize: 14,
            lineHeight: 1.5,
            color: "#5F6B7A",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
