"use client";

import { useState } from "react";
import BottomNav from "@/components/ui/BottomNav";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

type Answers = Record<string, string>;

type Domanda = {
  id: string;
  domanda: string;
  descrizione?: string;
  options: {
    value: string;
    label: string;
  }[];
};

const domande: Domanda[] = [
  {
    id: "lavoro",
    domanda: "Oggi lavori?",
    descrizione:
      "Serve per capire quanto il percorso dovrà adattarsi alla tua routine.",
    options: [
      { value: "full_time", label: "Sì, lavoro full-time" },
      { value: "part_time", label: "Sì, lavoro part-time" },
      { value: "no", label: "No, al momento non lavoro" },
    ],
  },

  {
    id: "tempo",
    domanda: "Quante ore realistiche potresti dedicare allo studio?",
    options: [
      { value: "basso", label: "2-4 ore a settimana" },
      { value: "medio", label: "5-7 ore a settimana" },
      { value: "alto", label: "8-10 ore o più" },
    ],
  },

  {
    id: "momento",
    domanda: "Quando riusciresti a studiare più facilmente?",
    options: [
      { value: "sera", label: "La sera" },
      { value: "mattina", label: "La mattina" },
      { value: "weekend", label: "Nel weekend" },
      { value: "variabile", label: "Dipende dai giorni" },
    ],
  },

  {
    id: "regolarita",
    domanda: "Il tuo tempo libero è abbastanza regolare?",
    options: [
      { value: "si", label: "Sì, abbastanza regolare" },
      { value: "abbastanza", label: "Abbastanza" },
      { value: "no", label: "No, cambia spesso" },
    ],
  },

  {
    id: "stanchezza",
    domanda: "A fine giornata ti senti spesso molto stanco?",
    options: [
      { value: "alta", label: "Quasi sempre" },
      { value: "media", label: "A volte" },
      { value: "bassa", label: "Raramente" },
    ],
  },

  {
    id: "preoccupazione",
    domanda: "Cosa ti preoccupa di più dell’università?",
    options: [
      { value: "tempo", label: "Non avere tempo" },
      { value: "costanza", label: "Non riuscire a essere costante" },
      { value: "esami", label: "Ansia per gli esami" },
      { value: "mollare", label: "Mollare a metà" },
    ],
  },

  {
    id: "ritmo",
    domanda: "Come vorresti vivere questo percorso?",
    options: [
      { value: "graduale", label: "Con calma e sostenibilità" },
      { value: "equilibrato", label: "In modo equilibrato" },
      { value: "rapido", label: "Cercando di accelerare" },
    ],
  },

  {
    id: "esperienza",
    domanda: "Hai già studiato mentre lavoravi?",
    options: [
      { value: "bene", label: "Sì, e mi sono trovato bene" },
      { value: "difficile", label: "Sì, ma è stato difficile" },
      { value: "mai", label: "No, mai" },
    ],
  },

  {
    id: "organizzazione",
    domanda: "Come ti organizzi di solito?",
    options: [
      { value: "alta", label: "Molto bene" },
      { value: "media", label: "Abbastanza bene" },
      { value: "bassa", label: "Faccio fatica a mantenere costanza" },
    ],
  },

  {
    id: "priorita",
    domanda: "Cosa cerchi soprattutto?",
    options: [
      { value: "sostenibile", label: "Un percorso sostenibile" },
      { value: "rapido", label: "Un percorso più rapido" },
      { value: "equilibrato", label: "Un equilibrio tra tempi e serenità" },
    ],
  },
];

function calcolaRisultato(answers: Answers) {
  let score = 72;

  if (answers.tempo === "alto") score += 10;
  if (answers.tempo === "medio") score += 6;
  if (answers.tempo === "basso") score -= 4;

  if (answers.lavoro === "full_time") score -= 4;
  if (answers.lavoro === "part_time") score += 2;

  if (answers.stanchezza === "alta") score -= 6;
  if (answers.stanchezza === "bassa") score += 5;

  if (answers.organizzazione === "alta") score += 8;
  if (answers.organizzazione === "bassa") score -= 5;

  if (answers.ritmo === "graduale") score += 8;
  if (answers.ritmo === "rapido") score -= 5;

  const compatibilita = Math.max(55, Math.min(score, 94));

  let stress: "Basso" | "Moderato" | "Alto" = "Moderato";

  if (
    answers.tempo === "basso" &&
    answers.stanchezza === "alta" &&
    answers.ritmo === "rapido"
  ) {
    stress = "Alto";
  } else if (
    answers.tempo !== "basso" &&
    answers.ritmo !== "rapido" &&
    answers.organizzazione !== "bassa"
  ) {
    stress = "Basso";
  }

  const stressText =
    stress === "Basso"
      ? "Il percorso sembra gestibile, soprattutto se mantieni una routine semplice e costante."
      : stress === "Moderato"
      ? "Il percorso è sostenibile, ma conviene partire con un ritmo graduale."
      : "Il percorso può essere affrontato, ma è importante evitare una partenza troppo intensa.";

  const settimana = [
    "2 sessioni brevi durante la settimana",
    "1 sessione più lunga nel weekend",
    "1 giorno libero senza studio",
  ];

  const strategia = [
    "Preparare un esame alla volta",
    "Studiare con continuità",
    "Usare sessioni brevi ma frequenti",
    "Organizzare il tempo in modo realistico",
  ];

  const rassicurazione =
    "Non serve stravolgere la tua vita. La costanza vale più dell’intensità.";

  const timeline = [
    {
      periodo: "Primi 30 giorni",
      testo: "Ambientamento e organizzazione del metodo di studio.",
    },

    {
      periodo: "2-3 mesi",
      testo: "Possibile preparazione del primo esame.",
    },

    {
      periodo: "6 mesi",
      testo: "Routine più stabile e maggiore sicurezza.",
    },
  ];

  return {
    compatibilita,
    stress,
    stressText,
    settimana,
    strategia,
    rassicurazione,
    timeline,
  };
}

export default function PercorsoRealePage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [completed, setCompleted] = useState(false);

  const current = domande[step] || domande[0];
  const result = calcolaRisultato(answers);
  const progress = Math.round(((step + 1) / domande.length) * 100);

  async function handleSelect(value: string) {
    const updated = {
      ...answers,
      [current.id]: value,
    };

    setAnswers(updated);

    if (step < domande.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const risultato = calcolaRisultato(updated);

      localStorage.setItem("percorso_reale_data", JSON.stringify(updated));
      localStorage.setItem("percorso_reale_result", JSON.stringify(risultato));

      try {
        const storedUser = localStorage.getItem("gps_user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        await fetch("https://laureasmart.it/api/salva-percorso-reale.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_email: user?.email || "",
            user_nome: user?.nome || "",

            lavoro: updated.lavoro,
            tempo: updated.tempo,
            momento: updated.momento,
            regolarita: updated.regolarita,
            stanchezza: updated.stanchezza,
            preoccupazione: updated.preoccupazione,
            ritmo: updated.ritmo,
            esperienza: updated.esperienza,
            organizzazione: updated.organizzazione,
            priorita: updated.priorita,

            compatibilita: risultato.compatibilita,
            stress: risultato.stress,
          }),
        });
      } catch (error) {
        console.error("Errore salvataggio:", error);
      }

      setCompleted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleRestart() {
    setStep(0);
    setAnswers({});
    setCompleted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleContact() {
    const testo = encodeURIComponent(
      "Ciao, ho fatto la simulazione del mio percorso reale su Laurea Smart e vorrei capire meglio il percorso più adatto a me."
    );

    window.open(`https://wa.me/393298170817?text=${testo}`, "_blank");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "20px 16px 120px",
        color: "#FFFFFF",
        background:
          "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
      }}
    >
      <div
        style={{ maxWidth: 430, margin: "0 auto", display: "grid", gap: 20 }}
      >
        <Hero />

        {!completed && (
          <>
            <Progress current={step + 1} total={domande.length} />

            <section
              style={{
                padding: 20,
                borderRadius: 28,
                background: "rgba(17,32,51,0.86)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div style={{ marginBottom: 18 }}>
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: 13,
                    fontWeight: 900,
                    color: "#78C2FF",
                  }}
                >
                  Domanda {step + 1} di {domande.length}
                </p>

                <h2
                  style={{
                    margin: 0,
                    fontSize: 25,
                    lineHeight: 1.16,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    letterSpacing: "-0.6px",
                  }}
                >
                  {current.domanda}
                </h2>

                {current.descrizione && (
                  <p
                    style={{
                      margin: "10px 0 0",
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: "rgba(255,255,255,0.64)",
                    }}
                  >
                    {current.descrizione}
                  </p>
                )}
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {current.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    style={{
                      width: "100%",
                      minHeight: 58,
                      borderRadius: 20,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(255,255,255,0.07)",
                      color: "#FFFFFF",
                      padding: "14px 15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      textAlign: "left",
                      fontSize: 15,
                      fontWeight: 850,
                      cursor: "pointer",
                      boxShadow: "0 10px 24px rgba(0,0,0,0.14)",
                    }}
                  >
                    <span>{option.label}</span>
                    <ArrowRight size={18} color="#78C2FF" />
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {completed && (
          <ResultCard
            compatibilita={result.compatibilita}
            stress={result.stress}
            stressText={result.stressText}
            settimana={result.settimana}
            strategia={result.strategia}
            rassicurazione={result.rassicurazione}
            timeline={result.timeline}
            onRestart={handleRestart}
            onContact={handleContact}
          />
        )}
      </div>

      <BottomNav />
    </main>
  );
}

function Hero() {
  return (
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
        <Sparkles size={31} />
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
        Il tuo percorso reale
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
        Scopri se l’università online può entrare davvero nella tua vita.
      </p>
    </section>
  );
}

function Progress({ current, total }: { current: number; total: number }) {
  const progress = Math.round((current / total) * 100);

  return (
    <section
      style={{
        padding: 16,
        borderRadius: 22,
        background: "rgba(17,32,51,0.72)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.20)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
          color: "#78C2FF",
          fontSize: 13,
          fontWeight: 900,
        }}
      >
        <span>
          Step {current} di {total}
        </span>
        <span>{progress}%</span>
      </div>

      <div
        style={{
          height: 8,
          width: "100%",
          borderRadius: 999,
          overflow: "hidden",
          background: "rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: 999,
            background: "linear-gradient(90deg, #3AA0FF, #78C2FF)",
          }}
        />
      </div>
    </section>
  );
}

function ResultCard({
  compatibilita,
  stress,
  stressText,
  settimana,
  strategia,
  rassicurazione,
  timeline,
  onRestart,
  onContact,
}: {
  compatibilita: number;
  stress: "Basso" | "Moderato" | "Alto";
  stressText: string;
  settimana: string[];
  strategia: string[];
  rassicurazione: string;
  timeline: {
    periodo: string;
    testo: string;
  }[];
  onRestart: () => void;
  onContact: () => void;
}) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: 24,
          borderRadius: 30,
          background:
            "linear-gradient(135deg, rgba(31,111,178,0.98) 0%, rgba(58,160,255,0.88) 100%)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.36)",
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 13,
            fontWeight: 900,
            opacity: 0.92,
          }}
        >
          Risultato simulazione
        </p>

        <h2
          style={{
            margin: 0,
            fontSize: 31,
            lineHeight: 1.06,
            fontWeight: 900,
            letterSpacing: "-0.9px",
          }}
        >
          Compatibilità {compatibilita}%
        </h2>

        <p
          style={{
            margin: "12px 0 0",
            fontSize: 15,
            lineHeight: 1.55,
            opacity: 0.95,
          }}
        >
          {stressText}
        </p>
      </section>

      <DarkCard
        icon={<ShieldCheck size={23} />}
        title="Livello di stress stimato"
        description={stress}
        badge="Analisi"
      />

      <DarkList
        icon={<Clock size={23} />}
        title="Settimana consigliata"
        items={settimana}
      />

      <DarkList
        icon={<TrendingUp size={23} />}
        title="Strategia consigliata"
        items={strategia}
      />

      <DarkCard
        icon={<CheckCircle2 size={23} />}
        title="Da ricordare"
        description={rassicurazione}
        badge="Metodo"
      />

      <section
        style={{
          padding: 20,
          borderRadius: 28,
          background: "rgba(17,32,51,0.86)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
          backdropFilter: "blur(16px)",
        }}
      >
        <h3
          style={{
            margin: "0 0 14px",
            fontSize: 20,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "-0.4px",
          }}
        >
          Timeline realistica
        </h3>

        <div style={{ display: "grid", gap: 12 }}>
          {timeline.map((item) => (
            <div
              key={item.periodo}
              style={{
                padding: 14,
                borderRadius: 20,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 900,
                  color: "#78C2FF",
                }}
              >
                {item.periodo}
              </p>

              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,0.66)",
                }}
              >
                {item.testo}
              </p>
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={onContact}
        style={{
          width: "100%",
          minHeight: 60,
          borderRadius: 22,
          border: "none",
          background: "#25D366",
          color: "#FFFFFF",
          fontSize: 16,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          cursor: "pointer",
          boxShadow: "0 16px 34px rgba(37,211,102,0.30)",
        }}
      >
        <MessageCircle size={22} />
        Parla con un orientatore
      </button>

      <button
        onClick={onRestart}
        style={{
          width: "100%",
          minHeight: 56,
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.08)",
          color: "#FFFFFF",
          fontSize: 15,
          fontWeight: 850,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          cursor: "pointer",
        }}
      >
        <RefreshCcw size={18} />
        Rifai la simulazione
      </button>
    </div>
  );
}

function DarkCard({
  icon,
  title,
  description,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <section
      style={{
        display: "flex",
        gap: 13,
        padding: 18,
        borderRadius: 26,
        background: "rgba(17,32,51,0.86)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 18,
          background: "rgba(58,160,255,0.16)",
          color: "#78C2FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
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

          {badge && (
            <span
              style={{
                padding: "5px 9px",
                borderRadius: 999,
                background: "rgba(58,160,255,0.16)",
                color: "#78C2FF",
                fontSize: 11,
                fontWeight: 900,
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <p
          style={{
            margin: "7px 0 0",
            fontSize: 14,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.66)",
          }}
        >
          {description}
        </p>
      </div>
    </section>
  );
}

function DarkList({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <section
      style={{
        padding: 18,
        borderRadius: 26,
        background: "rgba(17,32,51,0.86)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 18,
            background: "rgba(58,160,255,0.16)",
            color: "#78C2FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 900,
            color: "#FFFFFF",
          }}
        >
          {title}
        </h3>
      </div>

      <div style={{ display: "grid", gap: 9, marginTop: 14 }}>
        {items.map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              gap: 9,
              color: "rgba(255,255,255,0.68)",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            <CheckCircle2
              size={17}
              color="#78C2FF"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
