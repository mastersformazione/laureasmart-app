"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import SelectField from "@/components/ui/SelectField";
import BottomNav from "@/components/ui/BottomNav";

type TipoEsame = "quiz" | "orale" | "scritto" | "misto";
type Ritmo = "prudente" | "equilibrato" | "veloce";

type FormData = {
  esamiAnno: string;
  cfuTotali: string;
  sessioni: string;
  tipoEsame: TipoEsame;
  oreSettimana: string;
  ritmo: Ritmo;
};

const initialForm: FormData = {
  esamiAnno: "6",
  cfuTotali: "60",
  sessioni: "4",
  tipoEsame: "quiz",
  oreSettimana: "5",
  ritmo: "equilibrato",
};

function orePerCfu(tipo: TipoEsame) {
  if (tipo === "quiz") return 3.5;
  if (tipo === "orale") return 5;
  if (tipo === "scritto") return 5.5;
  return 4.5;
}

function coefficienteRitmo(ritmo: Ritmo) {
  if (ritmo === "prudente") return 0.8;
  if (ritmo === "veloce") return 1.15;
  return 1;
}

function calcolaPiano(form: FormData) {
  const esamiAnno = Number(form.esamiAnno) || 1;
  const cfuTotali = Number(form.cfuTotali) || 60;
  const sessioni = Number(form.sessioni) || 4;
  const oreSettimana = Number(form.oreSettimana) || 4;

  const cfuMedioEsame = Math.round(cfuTotali / esamiAnno);
  const oreStimateTotali = cfuTotali * orePerCfu(form.tipoEsame);
  const oreAnnueDisponibili = oreSettimana * 48 * coefficienteRitmo(form.ritmo);

  const percentualeCopertura = Math.min(
    1,
    oreAnnueDisponibili / oreStimateTotali
  );

  const esamiRealistici = Math.max(
    1,
    Math.min(esamiAnno, Math.floor(esamiAnno * percentualeCopertura))
  );

  const cfuRealistici = Math.round(esamiRealistici * cfuMedioEsame);
  const esamiPerSessione = Math.max(1, Math.ceil(esamiRealistici / sessioni));

  let carico = "Sostenibile";
  let messaggio =
    "Il piano sembra sostenibile e compatibile con una routine reale. Anche poche ore ben organizzate possono permetterti di avanzare in modo costante.";

  if (percentualeCopertura < 0.55) {
    carico = "Da organizzare";
    messaggio =
      "Anche con poche ore a settimana puoi costruire un percorso sostenibile. Il consiglio è partire da pochi esami ben distribuiti, senza concentrare tutto a ridosso delle sessioni.";
  }

  if (percentualeCopertura > 0.85 && form.ritmo !== "veloce") {
    carico = "Molto gestibile";
    messaggio =
      "Con il tempo indicato puoi affrontare l’anno con buona sostenibilità, distribuendo lo studio in modo regolare.";
  }

  const pianoSessioni = Array.from({ length: sessioni }).map((_, index) => {
    const esamiRestanti = esamiRealistici - index * esamiPerSessione;
    const esami = Math.max(0, Math.min(esamiPerSessione, esamiRestanti));

    return {
      sessione: `Sessione ${index + 1}`,
      testo:
        esami > 0
          ? `${esami} esame${esami > 1 ? "i" : ""} consigliato${
              esami > 1 ? "i" : ""
            }`
          : "Sessione utile per recupero o ripasso",
    };
  });

  return {
    esamiAnno,
    cfuTotali,
    sessioni,
    oreSettimana,
    cfuMedioEsame,
    oreStimateTotali,
    esamiRealistici,
    cfuRealistici,
    carico,
    messaggio,
    pianoSessioni,
  };
}

export default function AnnoAccademicoPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [showResult, setShowResult] = useState(false);

  const result = calcolaPiano(form);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function generaPiano() {
    localStorage.setItem("anno_accademico_data", JSON.stringify(form));
    localStorage.setItem("anno_accademico_result", JSON.stringify(result));
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function contattaOrientatore() {
    const testo = encodeURIComponent(
      `Ciao, sto preparando il mio anno accademico su Laurea Smart e vorrei verificare piano di studi, CFU e sessioni.

Esami previsti: ${form.esamiAnno}
CFU totali: ${form.cfuTotali}
Sessioni: ${form.sessioni}
Tipo esame: ${form.tipoEsame}
Ore disponibili: ${form.oreSettimana}/settimana
Ritmo: ${form.ritmo}

Risultato simulazione:
Esami realistici: ${result.esamiRealistici}
CFU sostenibili: ${result.cfuRealistici}
Carico: ${result.carico}`
    );

    window.open(`https://wa.me/393298170817?text=${testo}`, "_blank");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#173E68_0%,#0B1728_34%,#07111F_100%)] px-4 pb-[120px] pt-5 text-white">
      <div className="mx-auto max-w-md space-y-5">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm font-semibold text-[#78C2FF]"
        >
          ← Torna alla dashboard
        </button>

        <section className="rounded-[30px] border border-white/10 bg-gradient-to-br from-[#1F6FB2] to-[#155487] p-6 text-white shadow-[0_22px_54px_rgba(0,0,0,0.34)]">
          <p className="text-sm font-bold opacity-90">Laurea Smart</p>

          <h1 className="mt-2 text-[31px] font-extrabold leading-[34px] tracking-[-0.7px]">
            Prepara il tuo anno accademico
          </h1>

          <p className="mt-3 text-[15px] leading-6 opacity-95">
            Simula esami, CFU, sessioni e tempo di studio per capire se il
            percorso è sostenibile prima ancora di iniziare.
          </p>
        </section>

        {!showResult && (
          <DarkCard
            title="Costruiamo il tuo piano annuale"
            description="Inserisci dati indicativi: se non conosci piano di studi o sessioni, puoi verificarli con un orientatore."
            badge="Simulazione"
          >
            <div className="space-y-5">
              <SelectField
                label="Quanti esami prevede il primo anno?"
                value={form.esamiAnno}
                onChange={(value) => updateField("esamiAnno", value)}
                options={[
                  { value: "4", label: "4 esami" },
                  { value: "5", label: "5 esami" },
                  { value: "6", label: "6 esami" },
                  { value: "7", label: "7 esami" },
                  { value: "8", label: "8 o più esami" },
                ]}
              />

              <SelectField
                label="Quanti CFU vuoi sostenere nell’anno?"
                value={form.cfuTotali}
                onChange={(value) => updateField("cfuTotali", value)}
                options={[
                  { value: "30", label: "30 CFU" },
                  { value: "36", label: "36 CFU" },
                  { value: "42", label: "42 CFU" },
                  { value: "48", label: "48 CFU" },
                  { value: "60", label: "60 CFU" },
                ]}
              />

              <SelectField
                label="Quante sessioni d’esame sono previste?"
                value={form.sessioni}
                onChange={(value) => updateField("sessioni", value)}
                options={[
                  { value: "3", label: "3 sessioni" },
                  { value: "4", label: "4 sessioni" },
                  { value: "5", label: "5 sessioni" },
                  { value: "6", label: "6 sessioni" },
                ]}
              />

              <SelectField
                label="Che tipo di esami immagini di sostenere?"
                value={form.tipoEsame}
                onChange={(value) =>
                  updateField("tipoEsame", value as TipoEsame)
                }
                options={[
                  { value: "quiz", label: "Quiz / risposta multipla" },
                  { value: "orale", label: "Orali" },
                  { value: "scritto", label: "Scritti / domande aperte" },
                  { value: "misto", label: "Misti" },
                ]}
              />

              <SelectField
                label="Quante ore puoi studiare a settimana?"
                value={form.oreSettimana}
                onChange={(value) => updateField("oreSettimana", value)}
                options={[
                  { value: "3", label: "Circa 3 ore" },
                  { value: "5", label: "Circa 5 ore" },
                  { value: "7", label: "Circa 7 ore" },
                  { value: "10", label: "10 ore o più" },
                ]}
              />

              <SelectField
                label="Che ritmo preferisci?"
                value={form.ritmo}
                onChange={(value) => updateField("ritmo", value as Ritmo)}
                options={[
                  { value: "prudente", label: "Prudente" },
                  { value: "equilibrato", label: "Equilibrato" },
                  { value: "veloce", label: "Veloce" },
                ]}
              />

              <Button
                label="Genera piano annuale"
                variant="primary"
                onClick={generaPiano}
              />
            </div>
          </DarkCard>
        )}

        {showResult && (
          <div className="space-y-5">
            <DarkCard
              title={`${result.esamiRealistici} esami realistici`}
              description={`Su ${result.esamiAnno} esami previsti, il sistema stima che tu possa puntare realisticamente a ${result.esamiRealistici} esami nell’anno, pari a circa ${result.cfuRealistici} CFU.`}
              badge={result.carico}
            />

            <DarkCard title="Ore di studio stimate" badge="Tempo">
              <div className="grid gap-3">
                <ResultRow
                  label="Ore settimanali disponibili"
                  value={`${result.oreSettimana} ore`}
                />
                <ResultRow
                  label="Ore totali stimate per il piano"
                  value={`${result.oreStimateTotali} ore`}
                />
                <ResultRow
                  label="CFU medio per esame"
                  value={`${result.cfuMedioEsame} CFU`}
                />
              </div>
            </DarkCard>

            <DarkCard title="Distribuzione per sessioni" badge="Piano">
              <div className="grid gap-3">
                {result.pianoSessioni.map((item) => (
                  <div
                    key={item.sessione}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3"
                  >
                    <p className="text-sm font-extrabold text-[#78C2FF]">
                      {item.sessione}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white/75">
                      {item.testo}
                    </p>
                  </div>
                ))}
              </div>
            </DarkCard>

            <DarkCard
              title="Lettura del piano"
              description={result.messaggio}
              badge="Consiglio"
            />

            <DarkCard
              title="Non conosci piano di studi o sessioni?"
              description="È normale. Prima dell’iscrizione puoi chiedere a un orientatore di verificare numero esami, CFU, modalità d’esame e calendario indicativo."
              badge="Gratis"
            />

            <Button
              label="Verifica il piano con un orientatore"
              variant="primary"
              onClick={contattaOrientatore}
            />

            <button
              onClick={() => setShowResult(false)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-4 text-base font-semibold text-white shadow-[0_14px_34px_rgba(0,0,0,0.22)] active:scale-[0.98]"
            >
              Modifica simulazione
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
      <span className="text-sm font-bold text-white/75">{label}</span>
      <span className="text-sm font-extrabold text-[#78C2FF]">{value}</span>
    </div>
  );
}

function DarkCard({
  title,
  description,
  badge,
  children,
}: {
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="rounded-[26px] border border-white/10 bg-[rgba(17,32,51,0.86)] p-[18px] shadow-[0_14px_34px_rgba(0,0,0,0.24)] backdrop-blur-[16px]">
      <div className="flex items-start justify-between gap-3">
        <h2 className="m-0 text-[18px] font-extrabold leading-snug text-white">
          {title}
        </h2>

        {badge && (
          <span className="shrink-0 rounded-full bg-[#3AA0FF]/15 px-3 py-1.5 text-[11px] font-extrabold text-[#78C2FF]">
            {badge}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-3 text-[14px] leading-6 text-white/65">
          {description}
        </p>
      )}

      {children && <div className="mt-5">{children}</div>}
    </section>
  );
}
