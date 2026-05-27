"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

const WHATSAPP_NUMBER = "393793673257";

type ChecklistItem = {
  id: string;
  title: string;
  description: string;
};

const items: ChecklistItem[] = [
  {
    id: "costi",
    title: "Costi e rate",
    description:
      "Voglio capire bene retta, rate, eventuali costi extra e sostenibilità economica.",
  },
  {
    id: "esami",
    title: "Modalità degli esami",
    description:
      "Voglio confrontare come si svolgono gli esami e quanto sono compatibili con i miei impegni.",
  },
  {
    id: "studio",
    title: "Modalità di studio",
    description:
      "Voglio capire se il metodo di studio è adatto al mio tempo e alla mia organizzazione.",
  },
  {
    id: "supporto",
    title: "Supporto durante il percorso",
    description:
      "Per me è importante avere orientamento, assistenza e un riferimento durante il percorso.",
  },
  {
    id: "cfu",
    title: "Riconoscimento CFU, esami o titoli",
    description:
      "Ho già fatto qualcosa e voglio capire se può essere valutato.",
  },
  {
    id: "tempo",
    title: "Tempi per arrivare alla laurea",
    description:
      "Voglio capire se esiste una strada più breve o più sostenibile.",
  },
  {
    id: "lavoro_famiglia",
    title: "Compatibilità con lavoro e famiglia",
    description:
      "Devo scegliere un percorso compatibile con impegni reali e poco tempo.",
  },
  {
    id: "obiettivo",
    title: "Obiettivo futuro",
    description:
      "Voglio scegliere qualcosa che abbia senso per lavoro, concorsi o crescita personale.",
  },
  {
    id: "ateneo",
    title: "Differenze tra atenei",
    description: "Voglio capire cosa cambia davvero tra un ateneo e un altro.",
  },
  {
    id: "non_so",
    title: "Non so ancora cosa valutare",
    description: "Sono confuso e vorrei capire da quali criteri partire.",
  },
];

export default function PrimaDiSceglierePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const selectedItems = useMemo(
    () => items.filter((item) => selected.includes(item.id)),
    [selected]
  );

  const toggleItem = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
    setShowResult(false);
  };

  const salvaRisultato = () => {
    try {
      localStorage.setItem(
        "prima_di_scegliere_priorita",
        JSON.stringify({
          selected,
          labels: selectedItems.map((item) => item.title),
          updatedAt: new Date().toISOString(),
        })
      );
      localStorage.setItem("prima_di_scegliere_completato", "si");
    } catch {
      // Il salvataggio locale non deve bloccare il risultato.
    }

    setShowResult(true);
  };

  const apriWhatsApp = () => {
    const priorita =
      selectedItems.length > 0
        ? selectedItems.map((item) => item.title).join(", ")
        : "non ho ancora le idee chiare";

    const messaggio = `Ciao, ho completato la checklist “Prima di scegliere” su Laurea Smart. Vorrei confrontare le mie possibilità in base a questi aspetti: ${priorita}.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      messaggio
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1F6FB2_0%,#0B1728_42%,#07111F_100%)] px-4 py-6 text-white">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/12"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna indietro
        </button>

        <section className="relative overflow-hidden rounded-[34px] border border-sky-300/25 bg-gradient-to-br from-sky-300/18 via-white/8 to-white/[0.03] p-5 shadow-[0_30px_90px_rgba(15,23,42,0.35)]">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-300/22 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-24 h-64 w-64 rounded-full bg-blue-600/22 blur-3xl" />

          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200/25 bg-sky-100/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-sky-100">
              <Sparkles className="h-3.5 w-3.5" />
              Checklist Smart
            </div>

            <h1 className="text-[34px] font-black leading-[0.98] tracking-tight sm:text-5xl">
              Prima di scegliere
            </h1>

            <p className="mt-4 text-[16px] leading-7 text-slate-100/88">
              Non sempre la scelta migliore dipende solo dal corso di laurea.
              Costi, modalità di studio, esami, supporto, tempi e riconoscimento
              CFU possono cambiare molto da un ateneo all’altro.
            </p>

            <div className="mt-5 rounded-3xl border border-cyan-200/18 bg-cyan-200/10 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-100" />
                <p className="text-sm leading-6 text-slate-100/86">
                  Seleziona gli aspetti che vuoi confrontare. Alla fine potrai
                  chiedere a Laurea Smart di aiutarti a valutare le possibilità
                  più adatte alla tua situazione.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[30px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-300/15 text-sky-100 ring-1 ring-sky-200/20">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black">Cosa vuoi valutare meglio?</h2>
              <p className="text-sm text-slate-200/78">
                Puoi selezionare uno o più aspetti.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {items.map((item) => {
              const active = selected.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-0.5 ${
                    active
                      ? "border-sky-200/45 bg-sky-300/15 shadow-[0_16px_38px_rgba(56,189,248,0.16)]"
                      : "border-white/10 bg-[#061827]/55 hover:border-sky-200/25 hover:bg-[#0A2237]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        active
                          ? "bg-sky-200 text-slate-950"
                          : "bg-white/10 text-slate-200"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-black text-white">{item.title}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-200/74">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={salvaRisultato}
            disabled={selected.length === 0}
            className="mt-5 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-200 px-5 py-4 text-center text-[15px] font-black text-slate-950 shadow-[0_18px_42px_rgba(56,189,248,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mostra cosa confrontare
            <ArrowRight className="h-5 w-5" />
          </button>
        </section>

        {showResult && (
          <section className="mt-5 overflow-hidden rounded-[34px] border border-emerald-300/25 bg-gradient-to-br from-emerald-300/16 via-sky-300/12 to-white/6 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.35)]">
            <div className="rounded-[28px] bg-[#061827]/70 p-5 backdrop-blur">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-300/15 text-emerald-100 ring-1 ring-emerald-200/25">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-100">
                Risultato checklist
              </p>

              <h2 className="text-3xl font-black leading-tight">
                Hai selezionato {selectedItems.length}{" "}
                {selectedItems.length === 1
                  ? "aspetto importante"
                  : "aspetti importanti"}
              </h2>

              <p className="mt-4 text-[16px] leading-7 text-slate-100/88">
                Prima di scegliere, potrebbe essere utile confrontare più atenei
                e più percorsi sulla base delle priorità che hai indicato.
                Laurea Smart può aiutarti a valutare le opzioni più adatte alla
                tua situazione.
              </p>

              <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.07] p-4">
                <p className="text-sm font-black text-white">
                  Priorità selezionate
                </p>
                <ul className="mt-3 space-y-2">
                  {selectedItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-2 text-sm leading-6 text-slate-200/85"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-200" />
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={apriWhatsApp}
                className="mt-5 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-200 px-5 py-4 text-center text-[15px] font-black text-slate-950 shadow-[0_18px_42px_rgba(56,189,248,0.28)] transition hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" />
                Voglio confrontare le mie possibilità
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
