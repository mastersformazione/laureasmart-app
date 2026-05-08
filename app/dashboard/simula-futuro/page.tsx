"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Card from "@/components/ui/Card";
import BottomNav from "@/components/ui/BottomNav";

type TitoloStudio = "diploma" | "triennale" | "magistrale" | "altro";
type Obiettivo = "stabilita" | "carriera" | "cambio_settore" | "concorsi";
type Settore = "scuola" | "psicologia" | "economia" | "giuridico" | "digitale";
type Tempo = "poco" | "medio" | "alto";

type FormData = {
  titolo: TitoloStudio;
  obiettivo: Obiettivo;
  settore: Settore;
  tempo: Tempo;
};

const initialForm: FormData = {
  titolo: "diploma",
  obiettivo: "stabilita",
  settore: "scuola",
  tempo: "medio",
};

const settorePercorso: Record<Settore, string> = {
  scuola: "L-19 Scienze dell’Educazione",
  psicologia: "L-24 Scienze e Tecniche Psicologiche",
  economia: "Laurea o Master in area Economia e Management",
  giuridico: "Laurea in Servizi Giuridici o Giurisprudenza",
  digitale: "Percorso in area Digital, AI o Management",
};

const settoreOpportunita: Record<Settore, string[]> = {
  scuola: [
    "servizi educativi",
    "cooperative sociali",
    "concorsi pubblici",
    "percorsi scuola",
    "magistrali pedagogiche",
  ],
  psicologia: [
    "area educativa e sociale",
    "risorse umane",
    "magistrale LM-51",
    "servizi alla persona",
    "orientamento e formazione",
  ],
  economia: [
    "amministrazione",
    "management",
    "controllo di gestione",
    "project management",
    "ruoli aziendali",
  ],
  giuridico: [
    "concorsi pubblici",
    "studi professionali",
    "compliance",
    "amministrazione",
    "area legale aziendale",
  ],
  digitale: [
    "marketing digitale",
    "AI e automazione",
    "project management",
    "consulenza digitale",
    "business online",
  ],
};

function calculateScores(form: FormData) {
  let base = 35;

  if (form.titolo === "diploma") base += 8;
  if (form.titolo === "triennale") base += 12;
  if (form.titolo === "magistrale") base += 10;

  if (form.obiettivo === "stabilita") base += 10;
  if (form.obiettivo === "carriera") base += 14;
  if (form.obiettivo === "cambio_settore") base += 12;
  if (form.obiettivo === "concorsi") base += 11;

  if (form.tempo === "medio") base += 8;
  if (form.tempo === "alto") base += 12;
  if (form.tempo === "poco") base += 4;

  const crescita = Math.min(base + 20, 92);
  const compatibilita = Math.min(base + 12, 95);
  const spendibilita = Math.min(base + 15, 90);
  const stabilita =
    form.obiettivo === "stabilita" || form.obiettivo === "concorsi" ? 85 : 72;
  const rischio = form.tempo === "poco" ? "Medio" : "Basso";

  return {
    crescita,
    compatibilita,
    spendibilita,
    stabilita,
    rischio,
  };
}

function createChartData(scores: ReturnType<typeof calculateScores>) {
  return [
    {
      mese: "Oggi",
      senzaPercorso: 35,
      conPercorso: 35,
    },
    {
      mese: "12 mesi",
      senzaPercorso: 40,
      conPercorso: Math.round(scores.crescita * 0.55),
    },
    {
      mese: "24 mesi",
      senzaPercorso: 44,
      conPercorso: Math.round(scores.crescita * 0.78),
    },
    {
      mese: "36 mesi",
      senzaPercorso: 48,
      conPercorso: scores.crescita,
    },
  ];
}

function BarScore({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-semibold text-slate-900">{value}%</span>
      </div>
      <div className="h-3 rounded-full bg-slate-200">
        <div
          className="h-3 rounded-full bg-slate-900"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function SimulaFuturoPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [showResult, setShowResult] = useState(false);

  const scores = useMemo(() => calculateScores(form), [form]);
  const chartData = useMemo(() => createChartData(scores), [scores]);

  const percorso = settorePercorso[form.settore];
  const opportunita = settoreOpportunita[form.settore];

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-28 pt-5">
      <div className="mx-auto max-w-md space-y-5">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm font-medium text-slate-600"
        >
          ← Torna alla dashboard
        </button>

        <section className="rounded-3xl bg-slate-900 p-5 text-white shadow-lg">
          <p className="text-sm text-slate-300">LaureaSmart</p>
          <h1 className="mt-2 text-2xl font-bold leading-tight">
            Simula il tuo futuro
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-200">
            Scopri come potrebbe evolvere il tuo profilo nei prossimi 36 mesi in
            base al tuo titolo di studio, ai tuoi obiettivi e al percorso più
            adatto.
          </p>
        </section>

        {!showResult && (
          <Card>
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Costruiamo la tua simulazione
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Rispondi a poche domande per generare una proiezione
                  personalizzata.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Titolo di studio attuale
                </label>
                <select
                  value={form.titolo}
                  onChange={(e) =>
                    updateField("titolo", e.target.value as TitoloStudio)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none"
                >
                  <option value="diploma">Diploma</option>
                  <option value="triennale">Laurea triennale</option>
                  <option value="magistrale">Laurea magistrale</option>
                  <option value="altro">Altro percorso</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Obiettivo principale
                </label>
                <select
                  value={form.obiettivo}
                  onChange={(e) =>
                    updateField("obiettivo", e.target.value as Obiettivo)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none"
                >
                  <option value="stabilita">Più stabilità lavorativa</option>
                  <option value="carriera">Crescita di carriera</option>
                  <option value="cambio_settore">Cambiare settore</option>
                  <option value="concorsi">Accedere a concorsi</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Settore di interesse
                </label>
                <select
                  value={form.settore}
                  onChange={(e) =>
                    updateField("settore", e.target.value as Settore)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none"
                >
                  <option value="scuola">Scuola / educazione</option>
                  <option value="psicologia">Psicologia / sociale</option>
                  <option value="economia">Economia / management</option>
                  <option value="giuridico">Giuridico / concorsi</option>
                  <option value="digitale">Digitale / AI / marketing</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Tempo disponibile per studiare
                </label>
                <select
                  value={form.tempo}
                  onChange={(e) =>
                    updateField("tempo", e.target.value as Tempo)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none"
                >
                  <option value="poco">Poco tempo</option>
                  <option value="medio">Tempo medio</option>
                  <option value="alto">Buona disponibilità</option>
                </select>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-md"
              >
                Genera simulazione
              </button>
            </div>
          </Card>
        )}

        {showResult && (
          <div className="space-y-5">
            <Card>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-500">
                  Percorso consigliato
                </p>
                <h2 className="text-xl font-bold text-slate-900">{percorso}</h2>
                <p className="text-sm leading-6 text-slate-600">
                  Nei prossimi 36 mesi questo percorso potrebbe aumentare la
                  spendibilità del tuo profilo, aprendo nuove opportunità
                  coerenti con il tuo obiettivo. La simulazione non promette un
                  risultato economico certo, ma mostra una possibile evoluzione
                  professionale.
                </p>
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Curva di crescita del profilo
                </h3>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mese" fontSize={12} />
                      <YAxis domain={[0, 100]} fontSize={12} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="senzaPercorso"
                        name="Scenario attuale"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="conPercorso"
                        name="Con percorso"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-xs leading-5 text-slate-500">
                  Il grafico rappresenta un indice orientativo di crescita
                  professionale, non una previsione di stipendio.
                </p>
              </div>
            </Card>

            <Card>
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-slate-900">
                  Indicatori principali
                </h3>

                <BarScore
                  label="Compatibilità con il tuo obiettivo"
                  value={scores.compatibilita}
                />
                <BarScore
                  label="Spendibilità del profilo"
                  value={scores.spendibilita}
                />
                <BarScore
                  label="Crescita professionale stimata"
                  value={scores.crescita}
                />
                <BarScore
                  label="Stabilità potenziale"
                  value={scores.stabilita}
                />
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Tabella riassuntiva
                </h3>

                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="bg-slate-100 p-3 font-semibold">
                          Percorso
                        </td>
                        <td className="p-3">{percorso}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="bg-slate-100 p-3 font-semibold">
                          Orizzonte
                        </td>
                        <td className="p-3">36 mesi</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="bg-slate-100 p-3 font-semibold">
                          Spendibilità
                        </td>
                        <td className="p-3">{scores.spendibilita}%</td>
                      </tr>
                      <tr>
                        <td className="bg-slate-100 p-3 font-semibold">
                          Rischio percorso
                        </td>
                        <td className="p-3">{scores.rischio}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Opportunità collegate
                </h3>

                <div className="flex flex-wrap gap-2">
                  {opportunita.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  Il valore principale del percorso è l’apertura di nuove
                  possibilità: più canali lavorativi, maggiore coerenza del
                  profilo e una strategia più chiara per il futuro.
                </p>
              </div>
            </Card>

            <div className="space-y-3">
              <button
                onClick={() => router.push("/dashboard/corsi")}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-md"
              >
                Vedi i corsi consigliati
              </button>

              <button
                onClick={() => setShowResult(false)}
                className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm"
              >
                Modifica simulazione
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
