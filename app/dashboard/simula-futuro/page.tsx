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
import Button from "@/components/ui/Button";
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
    { mese: "Oggi", senzaPercorso: 35, conPercorso: 35 },
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
    { mese: "36 mesi", senzaPercorso: 48, conPercorso: scores.crescita },
  ];
}

function BarScore({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-[#102033]">{label}</span>
        <span className="font-bold text-[#1F6FB2]">{value}%</span>
      </div>

      <div className="h-3 rounded-full bg-[rgba(31,111,178,0.10)]">
        <div
          className="h-3 rounded-full bg-[#1F6FB2] shadow-[0_6px_14px_rgba(31,111,178,0.22)]"
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
    <main className="min-h-screen bg-[#F8FBFF] px-4 pb-[120px] pt-5">
      <div className="mx-auto max-w-md space-y-5">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm font-semibold text-[#1F6FB2]"
        >
          ← Torna alla dashboard
        </button>

        <section className="rounded-[30px] bg-gradient-to-br from-[#1F6FB2] to-[#155487] p-6 text-white shadow-[0_18px_42px_rgba(31,111,178,0.20)]">
          <p className="text-sm font-bold opacity-90">Laurea Smart</p>

          <h1 className="mt-2 text-[32px] font-extrabold leading-[35px] tracking-[-0.7px]">
            Simula il tuo futuro
          </h1>

          <p className="mt-3 text-[15px] leading-6 opacity-95">
            Scopri come potrebbe evolvere il tuo profilo nei prossimi 36 mesi in
            base al tuo titolo di studio, ai tuoi obiettivi e al percorso più
            adatto.
          </p>
        </section>

        {!showResult && (
          <Card
            title="Costruiamo la tua simulazione"
            description="Rispondi a poche domande per generare una proiezione personalizzata."
            badge="Gratis"
          >
            <div className="space-y-5">
              <SelectField
                label="Titolo di studio attuale"
                value={form.titolo}
                onChange={(value) =>
                  updateField("titolo", value as TitoloStudio)
                }
                options={[
                  ["diploma", "Diploma"],
                  ["triennale", "Laurea triennale"],
                  ["magistrale", "Laurea magistrale"],
                  ["altro", "Altro percorso"],
                ]}
              />

              <SelectField
                label="Obiettivo principale"
                value={form.obiettivo}
                onChange={(value) =>
                  updateField("obiettivo", value as Obiettivo)
                }
                options={[
                  ["stabilita", "Più stabilità lavorativa"],
                  ["carriera", "Crescita di carriera"],
                  ["cambio_settore", "Cambiare settore"],
                  ["concorsi", "Accedere a concorsi"],
                ]}
              />

              <SelectField
                label="Settore di interesse"
                value={form.settore}
                onChange={(value) => updateField("settore", value as Settore)}
                options={[
                  ["scuola", "Scuola / educazione"],
                  ["psicologia", "Psicologia / sociale"],
                  ["economia", "Economia / management"],
                  ["giuridico", "Giuridico / concorsi"],
                  ["digitale", "Digitale / AI / marketing"],
                ]}
              />

              <SelectField
                label="Tempo disponibile per studiare"
                value={form.tempo}
                onChange={(value) => updateField("tempo", value as Tempo)}
                options={[
                  ["poco", "Poco tempo"],
                  ["medio", "Tempo medio"],
                  ["alto", "Buona disponibilità"],
                ]}
              />

              <Button
                label="Genera simulazione"
                variant="primary"
                onClick={handleSubmit}
              />
            </div>
          </Card>
        )}

        {showResult && (
          <div className="space-y-5">
            <Card
              title={percorso}
              description="Nei prossimi 36 mesi questo percorso potrebbe aumentare la spendibilità del tuo profilo, aprendo nuove opportunità coerenti con il tuo obiettivo."
              badge="Percorso"
            />

            <Card title="Curva di crescita del profilo" badge="36 mesi">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF1" />
                    <XAxis dataKey="mese" fontSize={12} />
                    <YAxis domain={[0, 100]} fontSize={12} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="senzaPercorso"
                      name="Scenario attuale"
                      stroke="#9CA3AF"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="conPercorso"
                      name="Con percorso"
                      stroke="#1F6FB2"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#71717A]">
                Il grafico rappresenta un indice orientativo di crescita
                professionale, non una previsione di stipendio.
              </p>
            </Card>

            <Card title="Indicatori principali" badge="Profilo">
              <div className="space-y-5">
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

            <Card title="Tabella riassuntiva" badge="Sintesi">
              <div className="overflow-hidden rounded-2xl border border-[rgba(31,111,178,0.10)]">
                <table className="w-full text-sm">
                  <tbody>
                    <SummaryRow label="Percorso" value={percorso} />
                    <SummaryRow label="Orizzonte" value="36 mesi" />
                    <SummaryRow
                      label="Spendibilità"
                      value={`${scores.spendibilita}%`}
                    />
                    <SummaryRow
                      label="Rischio percorso"
                      value={scores.rischio}
                      last
                    />
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Opportunità collegate" badge="Possibilità">
              <div className="flex flex-wrap gap-2">
                {opportunita.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-[rgba(31,111,178,0.10)] px-3 py-2 text-xs font-bold text-[#1F6FB2]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-sm leading-6 text-[#71717A]">
                Il valore principale del percorso è l’apertura di nuove
                possibilità: più canali lavorativi, maggiore coerenza del
                profilo e una strategia più chiara per il futuro.
              </p>
            </Card>

            <div className="space-y-3">
              <Button
                label="Vedi i corsi consigliati"
                variant="primary"
                onClick={() => router.push("/dashboard/percorsi")}
              />

              <button
                onClick={() => setShowResult(false)}
                className="w-full rounded-2xl bg-white px-4 py-4 text-base font-semibold text-[#102033] shadow-[0_8px_22px_rgba(31,111,178,0.08)] active:scale-[0.98]"
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

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-[#102033]">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-[rgba(31,111,178,0.10)] bg-white p-4 text-sm font-semibold text-[#102033] outline-none shadow-[0_8px_22px_rgba(31,111,178,0.06)]"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <tr className={last ? "" : "border-b border-[rgba(31,111,178,0.10)]"}>
      <td className="bg-[rgba(31,111,178,0.06)] p-3 font-bold text-[#102033]">
        {label}
      </td>
      <td className="p-3 text-[#5F6B7A]">{value}</td>
    </tr>
  );
}
