"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/ui/BottomNav";
import type { Percorso } from "@/lib/data/percorsi";
import {
  Heart,
  Search,
  X,
  Trash2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  GitCompare,
  Trophy,
  TrendingUp,
  Target,
} from "lucide-react";

type ProfiloUtente = {
  situazione: string;
  titoloStudio: string;
  obiettivo: string;
  urgenza: string;
  tempo: string;
  area: string;
};

type PercorsoConScore = {
  percorso: Percorso;
  compatibilita: number;
};

function getProfiloUtente(): ProfiloUtente {
  return {
    situazione: localStorage.getItem("situazione") || "",
    titoloStudio: localStorage.getItem("titolo_studio") || "",
    obiettivo: localStorage.getItem("obiettivo") || "",
    urgenza: localStorage.getItem("urgenza_obiettivo") || "",
    tempo: localStorage.getItem("tempo_disponibile") || "",
    area: localStorage.getItem("area_interesse") || "",
  };
}

function calcolaCompatibilita(percorso: Percorso, profilo: ProfiloUtente) {
  let score = 74;

  const settore = percorso.settore.toLowerCase();
  const titolo = percorso.titolo.toLowerCase();
  const tags = percorso.tags.map((tag) => tag.toLowerCase()).join(" ");
  const area = profilo.area.toLowerCase();
  const obiettivo = profilo.obiettivo.toLowerCase();

  if (
    area &&
    area !== "non so ancora" &&
    (settore.includes(area) || titolo.includes(area) || tags.includes(area))
  ) {
    score += 9;
  }

  if (profilo.tempo === "5-7 ore a settimana") score += 5;

  if (
    profilo.tempo === "8-10 ore a settimana" ||
    profilo.tempo === "Più di 10 ore a settimana"
  ) {
    score += 8;
  }

  if (profilo.tempo === "2-4 ore a settimana") score += 2;

  if (
    profilo.situazione === "Lavoro full-time" ||
    profilo.situazione === "Lavoro part-time" ||
    profilo.situazione === "Studio e lavoro"
  ) {
    score += 4;
  }

  if (
    obiettivo.includes("concorsi") &&
    (settore.includes("giurisprudenza") ||
      settore.includes("educazione") ||
      settore.includes("scuola"))
  ) {
    score += 5;
  }

  if (
    obiettivo.includes("insegnare") &&
    (settore.includes("educazione") || settore.includes("scuola"))
  ) {
    score += 6;
  }

  if (
    obiettivo.includes("cambiare lavoro") ||
    obiettivo.includes("aumentare lo stipendio") ||
    obiettivo.includes("completare")
  ) {
    score += 4;
  }

  if (profilo.urgenza === "Subito / entro 1 mese") score += 2;
  if (profilo.urgenza === "Entro 3 mesi") score += 3;

  return Math.min(score, 96);
}

function getLivelloCompatibilita(score: number) {
  if (score >= 88) return "Molto alta";
  if (score >= 82) return "Alta";
  if (score >= 76) return "Buona";
  return "Da valutare";
}

function getSostenibilita(profilo: ProfiloUtente) {
  if (profilo.tempo === "2-4 ore a settimana") return "Graduale";
  if (profilo.tempo === "5-7 ore a settimana") return "Equilibrata";
  if (
    profilo.tempo === "8-10 ore a settimana" ||
    profilo.tempo === "Più di 10 ore a settimana"
  ) {
    return "Alta";
  }

  return "Da definire";
}

function getTempoConsigliato(profilo: ProfiloUtente) {
  if (profilo.tempo === "2-4 ore a settimana") return "Piano lento";
  if (profilo.tempo === "5-7 ore a settimana") return "Piano regolare";
  if (
    profilo.tempo === "8-10 ore a settimana" ||
    profilo.tempo === "Più di 10 ore a settimana"
  ) {
    return "Piano intenso";
  }

  return "Piano personalizzato";
}

function getIdealePer(percorso: Percorso, profilo: ProfiloUtente) {
  const settore = percorso.settore.toLowerCase();
  const titolo = percorso.titolo.toLowerCase();

  if (settore.includes("psicologia") || titolo.includes("psicologia")) {
    return "persone e relazioni";
  }

  if (
    settore.includes("educazione") ||
    settore.includes("scuola") ||
    titolo.includes("educazione")
  ) {
    return "educazione e servizi";
  }

  if (
    settore.includes("economia") ||
    settore.includes("management") ||
    titolo.includes("economia")
  ) {
    return "lavoro e crescita";
  }

  if (
    settore.includes("giurisprudenza") ||
    settore.includes("giuridic") ||
    titolo.includes("giurisprudenza")
  ) {
    return "diritto e concorsi";
  }

  if (settore.includes("comunicazione") || titolo.includes("comunicazione")) {
    return "comunicazione e digitale";
  }

  if (profilo.obiettivo) return profilo.obiettivo.toLowerCase();

  return "crescita personale";
}

function getMotiviPercorso(percorso: Percorso, profilo: ProfiloUtente) {
  const motivi = [];

  if (
    profilo.situazione === "Lavoro full-time" ||
    profilo.situazione === "Lavoro part-time" ||
    profilo.situazione === "Studio e lavoro"
  ) {
    motivi.push(
      "Può essere valutato anche da chi deve conciliare studio e impegni quotidiani."
    );
  } else {
    motivi.push(
      "Può aiutarti a costruire un percorso universitario più ordinato e progressivo."
    );
  }

  if (profilo.tempo === "2-4 ore a settimana") {
    motivi.push(
      "Con poco tempo disponibile, conviene ragionare su un piano graduale e sostenibile."
    );
  } else if (profilo.tempo) {
    motivi.push(
      "Il tempo che hai indicato permette una valutazione più concreta del percorso."
    );
  }

  if (profilo.obiettivo) {
    motivi.push(
      `È utile da confrontare con il tuo obiettivo: ${profilo.obiettivo.toLowerCase()}.`
    );
  } else {
    motivi.push(
      "È utile da confrontare con i tuoi obiettivi professionali e personali."
    );
  }

  return motivi.slice(0, 3);
}

function getDomandeUtili() {
  return [
    "Quali materie troverei nel piano di studio?",
    "Quanto è sostenibile con il mio tempo?",
    "È coerente con il mio obiettivo professionale?",
  ];
}

function getSviluppiPercorso(percorso: Percorso) {
  const settore = percorso.settore.toLowerCase();
  const titolo = percorso.titolo.toLowerCase();
  const tags = percorso.tags.map((tag) => tag.toLowerCase()).join(" ");

  const testo = `${settore} ${titolo} ${tags}`;

  if (testo.includes("psicologia")) {
    return [
      "Risorse umane e selezione",
      "Formazione e orientamento",
      "Psicologia del lavoro",
      "Proseguimento verso magistrale LM-51",
      "Ambiti educativi e relazionali",
    ];
  }

  if (
    testo.includes("educazione") ||
    testo.includes("scienze dell’educazione") ||
    testo.includes("scienze dell'educazione")
  ) {
    return [
      "Servizi educativi e sociali",
      "Comunità e terzo settore",
      "Infanzia e formazione",
      "Coordinamento di attività educative",
      "Concorsi e servizi alla persona",
    ];
  }

  if (
    testo.includes("economia") ||
    testo.includes("management") ||
    testo.includes("aziendale")
  ) {
    return [
      "Aziende e amministrazione",
      "Management e organizzazione",
      "Marketing e commerciale",
      "Concorsi area amministrativa",
      "Attività autonoma o imprenditoriale",
    ];
  }

  if (
    testo.includes("giurisprudenza") ||
    testo.includes("giuridic") ||
    testo.includes("diritto")
  ) {
    return [
      "Concorsi pubblici",
      "Ambito legale e amministrativo",
      "Consulenza e servizi giuridici",
      "Aziende e uffici amministrativi",
      "Proseguimento verso percorsi specialistici",
    ];
  }

  if (
    testo.includes("comunicazione") ||
    testo.includes("marketing") ||
    testo.includes("media")
  ) {
    return [
      "Comunicazione aziendale",
      "Marketing digitale",
      "Social media e contenuti",
      "Branding e pubblicità",
      "Media e relazioni esterne",
    ];
  }

  if (
    testo.includes("informatica") ||
    testo.includes("tecnologia") ||
    testo.includes("digitale")
  ) {
    return [
      "Competenze digitali",
      "Aziende tecnologiche",
      "Gestione sistemi e dati",
      "Progetti digitali",
      "Ruoli tecnici e innovazione",
    ];
  }

  if (
    testo.includes("motorie") ||
    testo.includes("sport") ||
    testo.includes("benessere")
  ) {
    return [
      "Sport e attività motoria",
      "Benessere e prevenzione",
      "Preparazione fisica",
      "Centri sportivi",
      "Percorsi educativi legati al movimento",
    ];
  }

  return [
    "Crescita professionale",
    "Nuove opportunità lavorative",
    "Concorsi e qualificazione",
    "Percorsi specialistici successivi",
    "Maggiore solidità del profilo",
  ];
}

function creaWhatsAppUrl(percorso: Percorso, compatibilita: number) {
  return `https://wa.me/393793673257?text=${encodeURIComponent(
    `Ciao, vorrei ricevere il piano di studio spiegato in modo semplice per questo percorso:

${percorso.titolo}
Classe: ${percorso.classe}
Area: ${percorso.settore}
Compatibilità indicata in app: ${compatibilita}%

Vorrei capire se è davvero adatto al mio profilo.`
  )}`;
}

function creaWhatsAppConfrontoUrl(percorsi: PercorsoConScore[]) {
  const elenco = percorsi
    .slice(0, 4)
    .map(
      (item, index) =>
        `${index + 1}. ${item.percorso.titolo} - ${
          item.percorso.classe
        } - compatibilità ${item.compatibilita}%`
    )
    .join("\n");

  return `https://wa.me/393793673257?text=${encodeURIComponent(
    `Ciao, ho salvato più percorsi su Laurea Smart e vorrei ricevere un confronto spiegato in modo semplice.

Percorsi salvati:
${elenco}

Vorrei capire quale percorso è più adatto al mio profilo, al mio tempo e ai miei obiettivi.`
  )}`;
}

export default function PreferitiPage() {
  const [preferiti, setPreferiti] = useState<Percorso[]>([]);
  const [queryRicerca, setQueryRicerca] = useState("");
  const [profilo, setProfilo] = useState<ProfiloUtente | null>(null);
  const [mostraConfronto, setMostraConfronto] = useState(false);

  useEffect(() => {
    const datiSalvati = localStorage.getItem("percorsi_preferiti");

    if (datiSalvati) {
      try {
        setPreferiti(JSON.parse(datiSalvati));
      } catch {
        setPreferiti([]);
      }
    }

    setProfilo(getProfiloUtente());
  }, []);

  function rimuoviPreferito(id: string) {
    const nuoviPreferiti = preferiti.filter((item) => item.id !== id);

    setPreferiti(nuoviPreferiti);
    localStorage.setItem("percorsi_preferiti", JSON.stringify(nuoviPreferiti));

    if (nuoviPreferiti.length < 2) {
      setMostraConfronto(false);
    }
  }

  const preferitiFiltrati = preferiti.filter((percorso) => {
    const testoRicerca = queryRicerca.toLowerCase().trim();

    return (
      testoRicerca === "" ||
      percorso.titolo.toLowerCase().includes(testoRicerca) ||
      percorso.classe.toLowerCase().includes(testoRicerca) ||
      percorso.settore.toLowerCase().includes(testoRicerca) ||
      percorso.tags.some((tag) => tag.toLowerCase().includes(testoRicerca))
    );
  });

  const percorsiConScore: PercorsoConScore[] = preferiti
    .map((percorso) => ({
      percorso,
      compatibilita: profilo ? calcolaCompatibilita(percorso, profilo) : 78,
    }))
    .sort((a, b) => b.compatibilita - a.compatibilita);

  const migliorePercorso = percorsiConScore[0];
  const whatsappConfrontoUrl = creaWhatsAppConfrontoUrl(percorsiConScore);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 20,
        paddingBottom: 120,
        maxWidth: 500,
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
          borderRadius: 32,
          padding: 28,
          background:
            "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 52%, #155487 100%)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.36)",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -44,
            top: -44,
            width: 155,
            height: 155,
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
          <Heart size={31} />
        </div>

        <p
          style={{
            margin: "0 0 8px",
            fontSize: 14,
            fontWeight: 850,
            opacity: 0.92,
            position: "relative",
            zIndex: 1,
          }}
        >
          Laurea Smart
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: 34,
            lineHeight: 1.05,
            fontWeight: 900,
            letterSpacing: "-1px",
            position: "relative",
            zIndex: 1,
          }}
        >
          I miei percorsi
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
          Confronta i corsi che hai salvato e capisci quali sono più coerenti
          con il tuo profilo, il tuo tempo e i tuoi obiettivi.
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 16,
            padding: "8px 12px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.16)",
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: 900,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Sparkles size={14} />
          Percorsi salvati: {preferiti.length}
        </div>
      </section>

      <section
        style={{
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          borderRadius: 22,
          background: "rgba(17,32,51,0.86)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 14px 34px rgba(0,0,0,0.24)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Search size={22} color="#78C2FF" />

        <input
          type="text"
          value={queryRicerca}
          onChange={(e) => setQueryRicerca(e.target.value)}
          placeholder="Cerca tra i tuoi percorsi..."
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#FFFFFF",
            fontSize: 14,
            fontFamily: "inherit",
          }}
        />

        {queryRicerca && (
          <button
            type="button"
            onClick={() => setQueryRicerca("")}
            style={{
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.55)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        )}
      </section>

      {preferiti.length >= 2 && migliorePercorso && profilo && (
        <section
          style={{
            marginBottom: 18,
            padding: 18,
            borderRadius: 28,
            background:
              "linear-gradient(135deg, rgba(31,111,178,0.92) 0%, rgba(58,160,255,0.72) 58%, rgba(21,84,135,0.92) 100%)",
            border: "1px solid rgba(120,194,255,0.24)",
            boxShadow: "0 18px 46px rgba(0,0,0,0.26)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -38,
              top: -38,
              width: 140,
              height: 140,
              borderRadius: 999,
              background: "rgba(255,255,255,0.13)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 20,
                background: "rgba(255,255,255,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 15,
              }}
            >
              <GitCompare size={28} />
            </div>

            <p
              style={{
                margin: "0 0 7px",
                fontSize: 13,
                fontWeight: 900,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              Confronto intelligente
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: 25,
                lineHeight: 1.08,
                fontWeight: 900,
                letterSpacing: "-0.7px",
              }}
            >
              Vuoi capire quale percorso è più adatto a te?
            </h2>

            <p
              style={{
                margin: "11px 0 0",
                fontSize: 14,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              Hai salvato più corsi. Possiamo confrontarli in base a
              compatibilità, sostenibilità e coerenza con il tuo obiettivo.
            </p>

            <button
              type="button"
              onClick={() => setMostraConfronto(!mostraConfronto)}
              style={{
                marginTop: 16,
                width: "100%",
                minHeight: 54,
                borderRadius: 20,
                border: "none",
                background: "#FFFFFF",
                color: "#1F6FB2",
                fontSize: 15,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                cursor: "pointer",
              }}
            >
              {mostraConfronto ? "Nascondi confronto" : "Confronta ora"}
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      )}

      {mostraConfronto && preferiti.length >= 2 && profilo && (
        <ConfrontoPercorsi
          percorsi={percorsiConScore}
          profilo={profilo}
          whatsappUrl={whatsappConfrontoUrl}
        />
      )}

      {preferiti.length === 0 ? (
        <DarkEmptyCard />
      ) : preferitiFiltrati.length === 0 ? (
        <DarkCard
          title="Nessun risultato trovato"
          description="Prova a cercare con un altro nome, area o classe di laurea."
          badge="Ricerca"
          icon={<Search size={24} />}
        />
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {preferitiFiltrati.map((percorso) => {
            const compatibilita = profilo
              ? calcolaCompatibilita(percorso, profilo)
              : 78;

            const motivi = profilo ? getMotiviPercorso(percorso, profilo) : [];
            const whatsappUrl = creaWhatsAppUrl(percorso, compatibilita);

            return (
              <DarkCard
                key={percorso.id}
                title={percorso.titolo}
                description={`Durata: ${percorso.durata}`}
                badge={percorso.classe}
                icon={<span>{percorso.classe.replace("L-", "L")}</span>}
              >
                <div
                  style={{
                    marginTop: 14,
                    padding: 13,
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.68)",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  Area:{" "}
                  <strong style={{ color: "#FFFFFF" }}>
                    {percorso.settore}
                  </strong>
                </div>

                <div
                  style={{
                    marginTop: 14,
                    padding: 14,
                    borderRadius: 20,
                    background:
                      "linear-gradient(135deg, rgba(31,111,178,0.34), rgba(58,160,255,0.16))",
                    border: "1px solid rgba(120,194,255,0.20)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 14,
                        fontWeight: 900,
                        color: "#FFFFFF",
                      }}
                    >
                      <ShieldCheck size={18} color="#78C2FF" />
                      Compatibilità col tuo profilo
                    </div>

                    <strong
                      style={{
                        fontSize: 20,
                        color: "#FFFFFF",
                        letterSpacing: "-0.4px",
                      }}
                    >
                      {compatibilita}%
                    </strong>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: 9,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.12)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${compatibilita}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: "#78C2FF",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gap: 9, marginTop: 14 }}>
                  {motivi.map((motivo, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: 9,
                        padding: 11,
                        borderRadius: 16,
                        background:
                          "linear-gradient(135deg, rgba(31,111,178,0.16) 0%, rgba(17,32,51,0.92) 100%)",

                        border: "1px solid rgba(120,194,255,0.18)",

                        boxShadow: "0 14px 34px rgba(0,0,0,0.22)",
                        color: "rgba(255,255,255,0.74)",
                        fontSize: 13,
                        lineHeight: 1.45,
                      }}
                    >
                      <CheckCircle2
                        size={17}
                        color="#78C2FF"
                        style={{ flexShrink: 0, marginTop: 1 }}
                      />
                      <span>{motivo}</span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 14,
                    padding: 15,
                    borderRadius: 22,
                    background:
                      "linear-gradient(135deg, rgba(31,111,178,0.20) 0%, rgba(17,32,51,0.96) 100%)",
                    border: "1px solid rgba(120,194,255,0.20)",
                    boxShadow: "0 14px 34px rgba(0,0,0,0.22)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <TrendingUp size={18} color="#78C2FF" />

                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 900,
                        color: "#FFFFFF",
                        letterSpacing: "-0.2px",
                      }}
                    >
                      Dove può portarti questo percorso
                    </h3>
                  </div>

                  <div style={{ display: "grid", gap: 9 }}>
                    {getSviluppiPercorso(percorso).map((sviluppo) => (
                      <div
                        key={sviluppo}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          fontSize: 13,
                          lineHeight: 1.45,
                          color: "rgba(255,255,255,0.74)",
                        }}
                      >
                        <CheckCircle2
                          size={16}
                          color="#78C2FF"
                          style={{ flexShrink: 0, marginTop: 1 }}
                        />
                        <span>{sviluppo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 14,
                    padding: 15,
                    borderRadius: 22,
                    background:
                      "linear-gradient(135deg, rgba(31,111,178,0.16) 0%, rgba(17,32,51,0.96) 100%)",
                    border: "1px solid rgba(120,194,255,0.18)",
                    boxShadow: "0 14px 34px rgba(0,0,0,0.22)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <Target size={18} color="#78C2FF" />

                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 900,
                        color: "#FFFFFF",
                        letterSpacing: "-0.2px",
                      }}
                    >
                      Cosa conviene valutare prima di scegliere
                    </h3>
                  </div>

                  <div style={{ display: "grid", gap: 8 }}>
                    {getDomandeUtili().map((domanda) => (
                      <div
                        key={domanda}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          fontSize: 13,
                          lineHeight: 1.45,
                          color: "rgba(255,255,255,0.72)",
                        }}
                      >
                        <CheckCircle2
                          size={16}
                          color="#78C2FF"
                          style={{ flexShrink: 0, marginTop: 1 }}
                        />
                        <span>{domanda}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: 14,
                    width: "100%",
                    minHeight: 56,
                    borderRadius: 20,
                    background: "#25D366",
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 9,
                    textDecoration: "none",
                    boxShadow: "0 14px 30px rgba(37,211,102,0.24)",
                  }}
                >
                  <MessageCircle size={18} />
                  Ricevi il piano di studio spiegato
                  <ArrowRight size={18} />
                </a>

                <button
                  onClick={() => rimuoviPreferito(percorso.id)}
                  style={{
                    marginTop: 12,
                    width: "100%",
                    minHeight: 50,
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.78)",
                    fontSize: 13,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={17} color="#78C2FF" />
                  Rimuovi dai preferiti
                </button>
              </DarkCard>
            );
          })}
        </div>
      )}

      <BottomNav />
    </main>
  );
}

function ConfrontoPercorsi({
  percorsi,
  profilo,
  whatsappUrl,
}: {
  percorsi: PercorsoConScore[];
  profilo: ProfiloUtente;
  whatsappUrl: string;
}) {
  const topPercorsi = percorsi.slice(0, 4);
  const migliore = topPercorsi[0];

  return (
    <section
      style={{
        marginBottom: 20,
        padding: 18,
        borderRadius: 28,
        background: "rgba(17,32,51,0.90)",
        border: "1px solid rgba(120,194,255,0.18)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 13,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 20,
            background: "rgba(255,201,64,0.18)",
            color: "#FFC940",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Trophy size={27} />
        </div>

        <div>
          <div
            style={{
              display: "inline-flex",
              marginBottom: 8,
              padding: "6px 10px",
              borderRadius: 999,
              background: "rgba(255,201,64,0.14)",
              color: "#FFC940",
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            Percorso più coerente
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 21,
              lineHeight: 1.18,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "-0.45px",
            }}
          >
            {migliore.percorso.titolo}
          </h2>

          <p
            style={{
              margin: "8px 0 0",
              color: "rgba(255,255,255,0.66)",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            In base ai dati del tuo profilo, questo è il corso che oggi mostra
            la compatibilità più alta tra quelli salvati.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {topPercorsi.map((item, index) => (
          <div
            key={item.percorso.id}
            style={{
              padding: 13,
              borderRadius: 18,
              background:
                index === 0
                  ? "rgba(255,201,64,0.10)"
                  : "rgba(255,255,255,0.05)",
              border:
                index === 0
                  ? "1px solid rgba(255,201,64,0.22)"
                  : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <div>
                <strong
                  style={{
                    display: "block",
                    fontSize: 14,
                    lineHeight: 1.25,
                    color: "#FFFFFF",
                    fontWeight: 900,
                  }}
                >
                  {index + 1}. {item.percorso.titolo}
                </strong>

                <span
                  style={{
                    display: "block",
                    marginTop: 4,
                    fontSize: 12,
                    color: "rgba(255,255,255,0.58)",
                  }}
                >
                  {item.percorso.classe} · {item.percorso.settore}
                </span>
              </div>

              <strong
                style={{
                  fontSize: 18,
                  color: index === 0 ? "#FFC940" : "#78C2FF",
                  whiteSpace: "nowrap",
                }}
              >
                {item.compatibilita}%
              </strong>
            </div>

            <div
              style={{
                width: "100%",
                height: 8,
                borderRadius: 999,
                background: "rgba(255,255,255,0.10)",
                overflow: "hidden",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: `${item.compatibilita}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: index === 0 ? "#FFC940" : "#78C2FF",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <MiniCompareItem
                label="Compatibilità"
                value={getLivelloCompatibilita(item.compatibilita)}
              />
              <MiniCompareItem
                label="Sostenibilità"
                value={getSostenibilita(profilo)}
              />
              <MiniCompareItem
                label="Tempo"
                value={getTempoConsigliato(profilo)}
              />
              <MiniCompareItem
                label="Ideale per"
                value={getIdealePer(item.percorso, profilo)}
              />
            </div>
          </div>
        ))}
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: 16,
          width: "100%",
          minHeight: 58,
          borderRadius: 20,
          background: "#25D366",
          color: "#FFFFFF",
          fontSize: 14,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          textDecoration: "none",
          boxShadow: "0 14px 30px rgba(37,211,102,0.24)",
        }}
      >
        <MessageCircle size={18} />
        Ricevi il confronto spiegato
        <ArrowRight size={18} />
      </a>
    </section>
  );
}

function MiniCompareItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: 10,
        borderRadius: 14,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.48)",
          fontWeight: 800,
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: "0.3px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#FFFFFF",
          fontWeight: 850,
          lineHeight: 1.25,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function DarkEmptyCard() {
  return (
    <section
      style={{
        padding: 22,
        borderRadius: 28,
        background: "rgba(17,32,51,0.86)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
        backdropFilter: "blur(16px)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 66,
          height: 66,
          borderRadius: 24,
          background: "rgba(58,160,255,0.16)",
          color: "#78C2FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <GraduationCap size={32} />
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: 22,
          lineHeight: 1.15,
          fontWeight: 900,
          color: "#FFFFFF",
          letterSpacing: "-0.5px",
        }}
      >
        Nessun percorso salvato
      </h2>

      <p
        style={{
          margin: "10px 0 0",
          fontSize: 14,
          lineHeight: 1.55,
          color: "rgba(255,255,255,0.66)",
        }}
      >
        Quando trovi un corso interessante, clicca su “Mi interessa” per
        salvarlo qui.
      </p>
    </section>
  );
}

function DarkCard({
  title,
  description,
  badge,
  icon,
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section
      style={{
        padding: 18,
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
          gap: 13,
        }}
      >
        {icon && (
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
              fontSize: 16,
              fontWeight: 900,
              boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
            }}
          >
            {icon}
          </div>
        )}

        <div style={{ flex: 1 }}>
          {badge && (
            <div
              style={{
                display: "inline-flex",
                marginBottom: 9,
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(58,160,255,0.16)",
                color: "#78C2FF",
                fontSize: 11,
                fontWeight: 900,
              }}
            >
              {badge}
            </div>
          )}

          <h2
            style={{
              margin: 0,
              fontSize: 21,
              lineHeight: 1.14,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "-0.45px",
            }}
          >
            {title}
          </h2>

          <p
            style={{
              margin: "9px 0 0",
              color: "rgba(255,255,255,0.64)",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}
