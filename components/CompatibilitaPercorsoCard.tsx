"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

type CompatibilitaData = {
  score: number;
  titolo: string;
  descrizione: string;
  motivi: string[];
};

function calcolaCompatibilita(): CompatibilitaData {
  const situazione = localStorage.getItem("situazione") || "";
  const titoloStudio = localStorage.getItem("titolo_studio") || "";
  const urgenza = localStorage.getItem("urgenza_obiettivo") || "";
  const tempo = localStorage.getItem("tempo_disponibile") || "";
  const area = localStorage.getItem("area_interesse") || "";
  const obiettivo = localStorage.getItem("obiettivo") || "";

  let score = 72;

  const motivi: string[] = [];

  if (tempo === "5-7 ore a settimana") {
    score += 6;
    motivi.push("Hai indicato un tempo di studio realistico e sostenibile.");
  } else if (
    tempo === "8-10 ore a settimana" ||
    tempo === "Più di 10 ore a settimana"
  ) {
    score += 9;
    motivi.push(
      "La tua disponibilità di tempo può rendere il percorso più fluido."
    );
  } else if (tempo === "2-4 ore a settimana") {
    score += 3;
    motivi.push(
      "Anche con poco tempo, un percorso graduale può essere sostenibile."
    );
  } else {
    score += 2;
    motivi.push("Il percorso può essere costruito in modo progressivo.");
  }

  if (
    situazione === "Lavoro full-time" ||
    situazione === "Lavoro part-time" ||
    situazione === "Studio e lavoro"
  ) {
    score += 5;
    motivi.push(
      "La modalità online può adattarsi meglio ai tuoi impegni quotidiani."
    );
  } else if (
    situazione === "Studio" ||
    situazione === "Non lavoro al momento"
  ) {
    score += 7;
    motivi.push(
      "Hai una situazione che può facilitare l’organizzazione dello studio."
    );
  } else {
    score += 3;
    motivi.push("Il percorso può essere adattato alla tua situazione attuale.");
  }

  if (area && area !== "Non so ancora") {
    score += 6;
    motivi.push(
      "Hai già espresso un’area di interesse, quindi la scelta è più orientata."
    );
  } else {
    score += 2;
    motivi.push(
      "Anche se hai ancora dubbi, puoi iniziare da una valutazione guidata."
    );
  }

  if (
    obiettivo === "Cambiare lavoro" ||
    obiettivo === "Aumentare lo stipendio" ||
    obiettivo === "Partecipare a concorsi" ||
    obiettivo === "Insegnare"
  ) {
    score += 5;
    motivi.push(
      "Il tuo obiettivo è abbastanza concreto e può guidare meglio la scelta."
    );
  } else {
    score += 2;
  }

  if (
    titoloStudio === "Diploma" ||
    titoloStudio === "Laurea triennale" ||
    titoloStudio === "Laurea magistrale"
  ) {
    score += 4;
  }

  if (urgenza === "Subito / entro 1 mese" || urgenza === "Entro 3 mesi") {
    score += 3;
  } else if (urgenza === "Entro 6 mesi" || urgenza === "Entro 12 mesi") {
    score += 4;
  }

  score = Math.min(Math.max(score, 72), 96);

  const descrizione =
    score >= 88
      ? "Il tuo profilo sembra molto compatibile con un percorso universitario online, soprattutto se costruito con obiettivi chiari e tempi realistici."
      : score >= 80
      ? "Il tuo profilo mostra una buona compatibilità con un percorso online, a condizione di scegliere un piano sostenibile."
      : "Il tuo profilo può essere compatibile con un percorso universitario online, purché la scelta venga costruita con gradualità.";

  return {
    score,
    titolo: `Compatibilità reale: ${score}%`,
    descrizione,
    motivi: motivi.slice(0, 3),
  };
}

export default function CompatibilitaPercorsoCard() {
  const router = useRouter();
  const [data, setData] = useState<CompatibilitaData | null>(null);

  useEffect(() => {
    setData(calcolaCompatibilita());
  }, []);

  if (!data) return null;

  return (
    <section
      onClick={() => router.push("/dashboard/percorso-smart")}
      style={{
        background: "rgba(17,32,51,0.82)",
        borderRadius: 30,
        border: "1px solid rgba(120,194,255,0.22)",
        padding: 16,
        boxShadow: "0 18px 46px rgba(0,0,0,0.26)",
        marginBottom: 20,
        cursor: "pointer",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          borderRadius: 28,
          padding: 20,
          color: "#FFFFFF",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0B2440 0%, #1F6FB2 54%, #3AA0FF 100%)",
          boxShadow: "0 16px 34px rgba(31,111,178,0.24)",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -38,
            top: -38,
            width: 150,
            height: 150,
            borderRadius: 999,
            background: "rgba(255,255,255,0.13)",
          }}
        />

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
          ANALISI DEL PROFILO
        </div>

        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 20,
            background: "rgba(0,0,0,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <ShieldCheck size={31} />
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: 25,
            lineHeight: 1.04,
            fontWeight: 900,
            letterSpacing: "-0.8px",
          }}
        >
          {data.titolo}
        </h2>

        <div
          style={{
            width: "100%",
            height: 10,
            borderRadius: 999,
            background: "rgba(255,255,255,0.18)",
            overflow: "hidden",
            margin: "16px 0 14px",
          }}
        >
          <div
            style={{
              width: `${data.score}%`,
              height: "100%",
              borderRadius: 999,
              background: "#FFFFFF",
            }}
          />
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.92)",
          }}
        >
          {data.descrizione}
        </p>

        <div style={{ display: "grid", gap: 9, marginTop: 16 }}>
          {data.motivi.map((motivo, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                fontSize: 13,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              <CheckCircle2 size={17} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{motivo}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 17,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 900,
          }}
        >
          Verifica il percorso più sostenibile
          <ArrowRight size={18} />
        </div>
      </div>
    </section>
  );
}
