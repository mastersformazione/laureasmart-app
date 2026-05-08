"use client";

import { useState } from "react";
import BottomNav from "@/components/ui/BottomNav";
import ProgressBar from "@/components/ui/ProgressBar";
import QuizCard from "@/components/ui/QuizCard";
import SimulationResult from "@/components/ui/SimulationResult";

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

  async function handleSelect(value: string) {
    const updated = {
      ...answers,
      [current.id]: value,
    };

    setAnswers(updated);

    if (step < domande.length - 1) {
      setStep(step + 1);
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
    }
  }

  function handleRestart() {
    setStep(0);
    setAnswers({});
    setCompleted(false);
  }

  function handleContact() {
    const testo = encodeURIComponent(
      "Ciao, ho fatto la simulazione del mio percorso reale su Laurea Smart e vorrei capire meglio il percorso più adatto a me."
    );

    window.open(`https://wa.me/393298170817?text=${testo}`, "_blank");
  }

  return (
    <main className="min-h-screen bg-[#F8FBFF] px-4 pb-[120px] pt-5">
      <div className="mx-auto max-w-md space-y-5">
        <section className="rounded-[30px] bg-gradient-to-br from-[#1F6FB2] to-[#155487] p-6 text-white shadow-[0_18px_42px_rgba(31,111,178,0.20)]">
          <p className="text-sm font-bold opacity-90">Laurea Smart</p>

          <h1 className="mt-2 text-[31px] font-extrabold leading-[34px] tracking-[-0.7px]">
            Il tuo percorso reale
          </h1>

          <p className="mt-3 text-[15px] leading-6 opacity-95">
            Scopri se l’università online può entrare davvero nella tua vita.
          </p>
        </section>

        {!completed && (
          <>
            <ProgressBar current={step + 1} total={domande.length} />

            <QuizCard
              domanda={current.domanda}
              descrizione={current.descrizione}
              options={current.options}
              onSelect={handleSelect}
            />
          </>
        )}

        {completed && (
          <SimulationResult
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
