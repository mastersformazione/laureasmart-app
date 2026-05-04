"use client";

import { useEffect, useState } from "react";
import Header from "@/components/ui/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function PercorsoPage() {
  const [profilo, setProfilo] = useState<string | null>(null);

  useEffect(() => {
    const p = localStorage.getItem("profilo_utente");
    setProfilo(p);
  }, []);

  if (!profilo) return null;

  const getPercorso = () => {
    if (profilo === "SCUOLA_GPS") {
      return {
        titolo: "Percorso più veloce per entrare in GPS",
        tempo: "8–12 mesi",
        difficolta: "Media",
        steps: [
          "Verifica del titolo di studio",
          "Iscrizione al percorso universitario",
          "Aumento punteggio GPS",
          "Inserimento in graduatoria",
        ],
        mancanze: [
          "Master universitario (+3 punti)",
          "Certificazione informatica (+1 punto)",
        ],
      };
    }

    if (profilo === "PROFESSIONE") {
      return {
        titolo: "Percorso più veloce per una professione",
        tempo: "12–24 mesi",
        difficolta: "Media",
        steps: [
          "Scelta della laurea",
          "Percorso universitario",
          "Eventuale tirocinio",
          "Accesso al lavoro",
        ],
        mancanze: ["Laurea specifica", "Esperienza pratica"],
      };
    }

    return {
      titolo: "Percorso da chiarire",
      tempo: "Variabile",
      difficolta: "Bassa",
      steps: ["Analisi obiettivo", "Scelta percorso", "Orientamento guidato"],
      mancanze: ["Chiarezza sull’obiettivo"],
    };
  };

  const risultato = getPercorso();

  return (
    <main style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <Header
        title="Il tuo percorso più veloce"
        subtitle="Abbiamo analizzato il tuo profilo"
      />

      <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
        <Card title={risultato.titolo}>
          <p>⏱ Tempo: {risultato.tempo}</p>
          <p>📊 Difficoltà: {risultato.difficolta}</p>
        </Card>

        <Card title="Il percorso passo dopo passo">
          <ul>
            {risultato.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Card>

        <Card title="Cosa ti manca">
          <ul>
            {risultato.mancanze.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </Card>

        <Button
          label="Ricevi il piano personalizzato"
          variant="primary"
          onClick={() =>
            window.open(
              "https://wa.me/393298170817?text=Ho visto il mio percorso, voglio il piano",
              "_blank"
            )
          }
        />
      </div>
    </main>
  );
}
