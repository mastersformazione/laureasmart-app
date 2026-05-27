"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import BottomNav from "@/components/ui/BottomNav";
import { GraduationCap, FileCheck2, Sparkles, ShieldCheck } from "lucide-react";

type FormData = {
  titolo: string;
  esami: string;
  numeroEsami: string;
  esperienza: string;
  area: string;
  note: string;
};

export default function PercorsoAgevolatoPage() {
  const [form, setForm] = useState<FormData>({
    titolo: "",
    esami: "",
    numeroEsami: "",
    esperienza: "",
    area: "",
    note: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    localStorage.setItem("percorso_agevolato", JSON.stringify(form));
    localStorage.setItem("titolo_studio", form.titolo);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappUrl = `https://wa.me/393793673257?text=${encodeURIComponent(
    `Ciao, vorrei confrontare le mie possibilità di riconoscimento CFU, titoli e CV con Laurea Smart.

Vorrei capire se esistono due o più opzioni utili per abbreviare o rendere più adatto il mio percorso.

Titolo di studio: ${form.titolo}
Esami già sostenuti: ${form.esami}
Numero esami: ${form.numeroEsami}
Esperienza lavorativa/CV: ${form.esperienza}
Area di interesse: ${form.area}
Note: ${form.note}`
  )}`;

  if (submitted) {
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
        <HeroCard />

        <section style={{ marginTop: 20 }}>
          <DarkCard
            icon={<Sparkles size={26} />}
            title="Possiamo confrontare più possibilità"
            description="In base alle informazioni inserite, potrebbero esserci due o più opzioni per valorizzare esami, titoli, esperienze o CV e rendere il tuo percorso più sostenibile."
            badge="Risultato"
            featured
          >
            <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
              <MiniInfoCard
                icon={<FileCheck2 size={22} />}
                title="Non esiste sempre una sola valutazione"
                description="Lo stesso profilo può essere letto in modi diversi: esami già sostenuti, titoli universitari, titoli AFAM, certificazioni e curriculum possono aprire più scenari di riconoscimento."
              />

              <MiniInfoCard
                icon={<ShieldCheck size={22} />}
                title="Confrontiamo più scenari"
                description="Laurea Smart può aiutarti a confrontare due o più possibilità di percorso, valutando CFU riconoscibili, tempi, sostenibilità, obiettivo finale e ateneo più adatto alla tua situazione."
              />

              <Button
                label="Voglio confrontare le mie possibilità"
                variant="primary"
                onClick={() => window.open(whatsappUrl, "_blank")}
              />

              <button
                onClick={() => setSubmitted(false)}
                style={{
                  width: "100%",
                  minHeight: 54,
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#FFFFFF",
                  fontSize: 15,
                  fontWeight: 850,
                  cursor: "pointer",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
                }}
              >
                Modifica risposte
              </button>
            </div>
          </DarkCard>
        </section>

        <BottomNav />
      </main>
    );
  }

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
      <HeroCard />

      <section style={{ marginTop: 20 }}>
        <DarkCard
          icon={<GraduationCap size={26} />}
          title="Verifica riconoscimento CFU, titoli e CV"
          description="Hai già studiato, lavorato o sostenuto esami universitari? L’app Laurea Smart può aiutarti a capire se esistono due o più opzioni da confrontare."
          badge="CFU"
          featured
        >
          <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
            <DarkSelect
              value={form.titolo}
              onChange={(value) => setForm({ ...form, titolo: value })}
              options={[
                ["", "Titolo di studio attuale"],
                ["Diploma", "Diploma"],
                ["Laurea triennale", "Laurea triennale"],
                ["Laurea magistrale", "Laurea magistrale"],
                ["Laurea vecchio ordinamento", "Laurea vecchio ordinamento"],
                ["Master universitario", "Master universitario"],
                [
                  "Diploma accademico di primo livello (AFAM)",
                  "Diploma accademico di primo livello (AFAM)",
                ],
                [
                  "Diploma accademico di secondo livello (AFAM)",
                  "Diploma accademico di secondo livello (AFAM)",
                ],
                [
                  "Diploma conservatorio (vecchio ordinamento)",
                  "Diploma conservatorio (vecchio ordinamento)",
                ],
                [
                  "Diploma accademia di belle arti",
                  "Diploma accademia di belle arti",
                ],
                [
                  "Ho iniziato l’università ma non ho terminato",
                  "Ho iniziato l’università ma non ho terminato",
                ],
                ["Altro", "Altro"],
              ]}
            />

            <DarkSelect
              value={form.esami}
              onChange={(value) => setForm({ ...form, esami: value })}
              options={[
                ["", "Hai già sostenuto esami universitari?"],
                ["No", "No"],
                ["Sì, pochi esami", "Sì, pochi esami"],
                ["Sì, diversi esami", "Sì, diversi esami"],
                [
                  "Sì, ho una carriera universitaria precedente",
                  "Sì, ho una carriera universitaria precedente",
                ],
                ["Non lo so", "Non lo so"],
              ]}
            />

            <DarkSelect
              value={form.numeroEsami}
              onChange={(value) => setForm({ ...form, numeroEsami: value })}
              options={[
                ["", "Quanti esami hai sostenuto?"],
                ["Nessuno", "Nessuno"],
                ["1-3 esami", "1-3 esami"],
                ["4-8 esami", "4-8 esami"],
                ["9-15 esami", "9-15 esami"],
                ["Oltre 15 esami", "Oltre 15 esami"],
                ["Non ricordo", "Non ricordo"],
              ]}
            />

            <DarkSelect
              value={form.esperienza}
              onChange={(value) => setForm({ ...form, esperienza: value })}
              options={[
                ["", "Esperienza lavorativa rilevante"],
                [
                  "Nessuna esperienza rilevante",
                  "Nessuna esperienza rilevante",
                ],
                ["1-3 anni", "1-3 anni"],
                ["4-6 anni", "4-6 anni"],
                ["Oltre 6 anni", "Oltre 6 anni"],
                [
                  "Esperienza nel settore che vorrei studiare",
                  "Esperienza nel settore che vorrei studiare",
                ],
              ]}
            />

            <DarkSelect
              value={form.area}
              onChange={(value) => setForm({ ...form, area: value })}
              options={[
                ["", "Area di interesse"],
                ["Economia e management", "Economia e management"],
                ["Psicologia", "Psicologia"],
                ["Scienze dell’educazione", "Scienze dell’educazione"],
                [
                  "Giurisprudenza / servizi giuridici",
                  "Giurisprudenza / servizi giuridici",
                ],
                ["Scienze motorie", "Scienze motorie"],
                ["Comunicazione", "Comunicazione"],
                ["Informatica / tecnologia", "Informatica / tecnologia"],
                ["Scuola e insegnamento", "Scuola e insegnamento"],
                ["Non so ancora", "Non so ancora"],
              ]}
            />

            <textarea
              placeholder="Vuoi aggiungere qualcosa su esami, titoli, certificazioni o CV? (facoltativo)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={4}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.08)",
                color: "#FFFFFF",
                outline: "none",
                fontFamily: "inherit",
                fontSize: 14,
                lineHeight: 1.5,
                resize: "vertical",
              }}
            />

            <Button
              label="Verifica le possibilità di riconoscimento"
              variant="primary"
              onClick={handleSubmit}
            />

            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "rgba(255,255,255,0.58)",
                lineHeight: 1.55,
              }}
            >
              La valutazione definitiva deve essere fatta da un orientatore o da
              un ufficio competente. Questa funzione serve a capire se conviene
              confrontare più opzioni di riconoscimento prima di scegliere il
              percorso.
            </p>
          </div>
        </DarkCard>
      </section>

      <BottomNav />
    </main>
  );
}

function HeroCard() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 32,
        padding: 28,
        color: "#FFFFFF",
        background:
          "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 52%, #155487 100%)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.36)",
        border: "1px solid rgba(255,255,255,0.14)",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -44,
          top: -44,
          width: 150,
          height: 150,
          borderRadius: 999,
          background: "rgba(255,255,255,0.14)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: -58,
          bottom: -70,
          width: 190,
          height: 190,
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
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
          backdropFilter: "blur(10px)",
          boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <FileCheck2 size={30} />
      </div>

      <p
        style={{
          margin: "0 0 10px",
          fontSize: 14,
          opacity: 0.92,
          fontWeight: 800,
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
          lineHeight: 1.04,
          fontWeight: 900,
          letterSpacing: "-1px",
          position: "relative",
          zIndex: 1,
        }}
      >
        Confronta le possibilità di riconoscimento
      </h1>

      <p
        style={{
          marginTop: 16,
          lineHeight: 1.6,
          fontSize: 15,
          opacity: 0.96,
          position: "relative",
          zIndex: 1,
        }}
      >
        Inserisci titoli, esami, esperienza o CV: ti aiutiamo a capire se ci
        sono più opzioni da confrontare per valorizzare il tuo percorso.
      </p>
    </section>
  );
}

function DarkCard({
  icon,
  title,
  description,
  badge,
  children,
  featured = false,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  children?: React.ReactNode;
  featured?: boolean;
}) {
  return (
    <section
      style={{
        padding: 20,
        borderRadius: 28,
        background: featured
          ? "linear-gradient(135deg, rgba(17,32,51,0.92) 0%, rgba(17,32,51,0.80) 100%)"
          : "rgba(17,32,51,0.86)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 13,
          alignItems: "flex-start",
        }}
      >
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
              boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
            }}
          >
            {icon}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                lineHeight: 1.12,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "-0.4px",
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

          <p
            style={{
              margin: "10px 0 0",
              fontSize: 14,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.68)",
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

function MiniInfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <section
      style={{
        display: "flex",
        gap: 12,
        padding: 14,
        borderRadius: 22,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 16,
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

      <div>
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 900,
            color: "#FFFFFF",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: "6px 0 0",
            fontSize: 13,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.62)",
          }}
        >
          {description}
        </p>
      </div>
    </section>
  );
}

function DarkSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: 14,
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.08)",
        color: "#FFFFFF",
        outline: "none",
        fontFamily: "inherit",
        fontSize: 14,
        fontWeight: 750,
      }}
    >
      {options.map(([optionValue, label]) => (
        <option key={optionValue || label} value={optionValue}>
          {label}
        </option>
      ))}
    </select>
  );
}
