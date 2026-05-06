"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import BottomNav from "@/components/ui/BottomNav";

type FormData = {
  lavoro: string;
  ore: string;
  momento: string;
};

export default function StudioLavoroPage() {
  const [form, setForm] = useState<FormData>({
    lavoro: "",
    ore: "",
    momento: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    localStorage.setItem("studio_lavoro", JSON.stringify(form));
    setSubmitted(true);
  };

  const whatsappUrl = `https://wa.me/393298170817?text=${encodeURIComponent(
    `Vorrei un piano di studio personalizzato per Laurea Smart.

Situazione lavorativa: ${form.lavoro}
Ore disponibili a settimana: ${form.ore}
Momento preferito per studiare: ${form.momento}`
  )}`;

  if (submitted) {
    return (
      <main style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
        <Card
          title="Puoi studiare senza stravolgere la tua vita"
          description="In base alle tue risposte, il percorso migliore è quello che si adatta ai tuoi tempi, non il contrario."
        >
          <div style={{ display: "grid", gap: 12 }}>
            <Card
              title="Il tuo piano realistico"
              description={`Hai indicato ${
                form.ore || "un numero limitato di"
              } ore a settimana. Possiamo costruire un percorso flessibile, compatibile con lavoro e impegni personali.`}
            />

            <Card
              title="Perché la laurea online può aiutarti"
              description="Le lezioni online, il tutoraggio e la gestione flessibile dello studio permettono di organizzare il percorso anche se lavori o hai poco tempo."
            />

            <Button
              label="Ricevi il tuo piano di studio"
              variant="primary"
              onClick={() => window.open(whatsappUrl, "_blank")}
            />
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <Card
        title="Studia mentre lavori"
        description="Scopri se puoi iniziare un percorso universitario online compatibile con i tuoi orari e i tuoi impegni."
      >
        <div style={{ display: "grid", gap: 12 }}>
          <select
            value={form.lavoro}
            onChange={(e) => setForm({ ...form, lavoro: e.target.value })}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            <option value="">Qual è la tua situazione lavorativa?</option>
            <option value="Lavoro full-time">Lavoro full-time</option>
            <option value="Lavoro part-time">Lavoro part-time</option>
            <option value="Turni variabili">Turni variabili</option>
            <option value="Studio e lavoro">Studio e lavoro</option>
            <option value="Non lavoro al momento">Non lavoro al momento</option>
          </select>

          <select
            value={form.ore}
            onChange={(e) => setForm({ ...form, ore: e.target.value })}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            <option value="">Quante ore puoi dedicare allo studio?</option>
            <option value="2-4 ore">2-4 ore a settimana</option>
            <option value="5-7 ore">5-7 ore a settimana</option>
            <option value="8-10 ore">8-10 ore a settimana</option>
            <option value="Più di 10 ore">Più di 10 ore a settimana</option>
          </select>

          <select
            value={form.momento}
            onChange={(e) => setForm({ ...form, momento: e.target.value })}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            <option value="">Quando preferisci studiare?</option>
            <option value="Sera">La sera</option>
            <option value="Weekend">Nel weekend</option>
            <option value="Pausa lavoro">Nelle pause dal lavoro</option>
            <option value="Orari flessibili">Con orari flessibili</option>
          </select>

          <Button
            label="Crea il mio piano realistico"
            variant="primary"
            onClick={handleSubmit}
          />

          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>
            L’obiettivo non è promettere una laurea facile, ma costruire un
            percorso sostenibile in base al tempo che hai davvero.
          </p>
        </div>
      </Card>
    </main>
  );
}
