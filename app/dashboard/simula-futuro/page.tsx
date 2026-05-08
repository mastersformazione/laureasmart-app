"use client";

import { useMemo, useState } from "react";
import SelectField from "@/components/ui/SelectField";
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
import Button from "@/components/ui/Button";
import BottomNav from "@/components/ui/BottomNav";
import { BarChart3, RefreshCcw, Sparkles, TrendingUp } from "lucide-react";

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
    {
      mese: "36 mesi",
      senzaPercorso: 48,
      conPercorso: scores.crescita,
    },
  ];
}

function BarScore({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "grid", gap: 9 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          fontSize: 14,
        }}
      >
        <span style={{ fontWeight: 850, color: "rgba(255,255,255,0.78)" }}>
          {label}
        </span>

        <span style={{ fontWeight: 900, color: "#78C2FF" }}>{value}%</span>
      </div>

      <div
        style={{
          height: 12,
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            borderRadius: 999,
            background: "linear-gradient(90deg, #1F6FB2, #3AA0FF, #78C2FF)",
            boxShadow: "0 8px 18px rgba(58,160,255,0.26)",
          }}
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
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            border: "none",
            background: "transparent",
            color: "#78C2FF",
            fontSize: 14,
            fontWeight: 850,
            textAlign: "left",
            padding: 0,
            cursor: "pointer",
          }}
        >
          ← Torna alla dashboard
        </button>

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
            <TrendingUp size={31} />
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
            Simula il tuo futuro
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
            Scopri come potrebbe evolvere il tuo profilo nei prossimi 36 mesi in
            base al tuo titolo di studio, ai tuoi obiettivi e al percorso più
            adatto.
          </p>
        </section>

        {!showResult && (
          <DarkCard
            title="Costruiamo la tua simulazione"
            description="Rispondi a poche domande per generare una proiezione personalizzata."
            badge="Gratis"
          >
            <div style={{ display: "grid", gap: 20, marginTop: 18 }}>
              <SelectField
                label="Titolo di studio attuale"
                value={form.titolo}
                onChange={(value) =>
                  updateField("titolo", value as TitoloStudio)
                }
                options={[
                  { value: "diploma", label: "Diploma" },
                  { value: "triennale", label: "Laurea triennale" },
                  { value: "magistrale", label: "Laurea magistrale" },
                  { value: "altro", label: "Altro percorso" },
                ]}
              />

              <SelectField
                label="Obiettivo principale"
                value={form.obiettivo}
                onChange={(value) =>
                  updateField("obiettivo", value as Obiettivo)
                }
                options={[
                  { value: "stabilita", label: "Più stabilità lavorativa" },
                  { value: "carriera", label: "Crescita di carriera" },
                  { value: "cambio_settore", label: "Cambiare settore" },
                  { value: "concorsi", label: "Accedere a concorsi" },
                ]}
              />

              <SelectField
                label="Settore di interesse"
                value={form.settore}
                onChange={(value) => updateField("settore", value as Settore)}
                options={[
                  { value: "scuola", label: "Scuola / educazione" },
                  { value: "psicologia", label: "Psicologia / sociale" },
                  { value: "economia", label: "Economia / management" },
                  { value: "giuridico", label: "Giuridico / concorsi" },
                  { value: "digitale", label: "Digitale / AI / marketing" },
                ]}
              />

              <SelectField
                label="Tempo disponibile per studiare"
                value={form.tempo}
                onChange={(value) => updateField("tempo", value as Tempo)}
                options={[
                  { value: "poco", label: "Poco tempo" },
                  { value: "medio", label: "Tempo medio" },
                  { value: "alto", label: "Buona disponibilità" },
                ]}
              />

              <Button
                label="Genera simulazione"
                variant="primary"
                onClick={handleSubmit}
              />
            </div>
          </DarkCard>
        )}

        {showResult && (
          <div style={{ display: "grid", gap: 20 }}>
            <DarkCard
              title={percorso}
              description="Nei prossimi 36 mesi questo percorso potrebbe aumentare la spendibilità del tuo profilo, aprendo nuove opportunità coerenti con il tuo obiettivo."
              badge="Percorso"
              icon={<Sparkles size={24} />}
            />

            <DarkCard
              title="Curva di crescita del profilo"
              badge="36 mesi"
              icon={<BarChart3 size={24} />}
            >
              <div
                style={{
                  height: 260,
                  width: "100%",
                  marginTop: 18,
                  borderRadius: 22,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: 8,
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.10)"
                    />
                    <XAxis
                      dataKey="mese"
                      fontSize={12}
                      stroke="rgba(255,255,255,0.55)"
                    />
                    <YAxis
                      domain={[0, 100]}
                      fontSize={12}
                      stroke="rgba(255,255,255,0.55)"
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#102033",
                        border: "1px solid rgba(255,255,255,0.10)",
                        borderRadius: 14,
                        color: "#FFFFFF",
                      }}
                      labelStyle={{ color: "#FFFFFF" }}
                    />
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
                      stroke="#3AA0FF"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 12,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                Il grafico rappresenta un indice orientativo di crescita
                professionale, non una previsione di stipendio.
              </p>
            </DarkCard>

            <DarkCard title="Indicatori principali" badge="Profilo">
              <div style={{ display: "grid", gap: 20, marginTop: 18 }}>
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
            </DarkCard>

            <DarkCard title="Tabella riassuntiva" badge="Sintesi">
              <div
                style={{
                  marginTop: 18,
                  overflow: "hidden",
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 14,
                  }}
                >
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
            </DarkCard>

            <DarkCard title="Opportunità collegate" badge="Possibilità">
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 9,
                  marginTop: 18,
                }}
              >
                {opportunita.map((item) => (
                  <span
                    key={item}
                    style={{
                      borderRadius: 999,
                      background: "rgba(58,160,255,0.16)",
                      color: "#78C2FF",
                      padding: "9px 12px",
                      fontSize: 12,
                      fontWeight: 900,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <p
                style={{
                  margin: "16px 0 0",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.64)",
                }}
              >
                Il valore principale del percorso è l’apertura di nuove
                possibilità: più canali lavorativi, maggiore coerenza del
                profilo e una strategia più chiara per il futuro.
              </p>
            </DarkCard>

            <div style={{ display: "grid", gap: 12 }}>
              <Button
                label="Vedi i corsi consigliati"
                variant="primary"
                onClick={() => router.push("/dashboard/percorsi")}
              />

              <button
                onClick={() => setShowResult(false)}
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

function DarkCard({
  title,
  description,
  badge,
  icon,
  children,
}: {
  title: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
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
      <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
        {icon && (
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
        )}

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 21,
                lineHeight: 1.16,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "-0.45px",
              }}
            >
              {title}
            </h2>

            {badge && (
              <span
                style={{
                  borderRadius: 999,
                  background: "rgba(58,160,255,0.16)",
                  color: "#78C2FF",
                  padding: "6px 10px",
                  fontSize: 11,
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                }}
              >
                {badge}
              </span>
            )}
          </div>

          {description && (
            <p
              style={{
                margin: "10px 0 0",
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.66)",
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
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
    <tr>
      <td
        style={{
          padding: 13,
          width: "38%",
          background: "rgba(58,160,255,0.10)",
          borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.08)",
          fontWeight: 900,
          color: "#FFFFFF",
          verticalAlign: "top",
        }}
      >
        {label}
      </td>

      <td
        style={{
          padding: 13,
          borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.68)",
          lineHeight: 1.45,
        }}
      >
        {value}
      </td>
    </tr>
  );
}
