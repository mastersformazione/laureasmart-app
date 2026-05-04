"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type FormData = {
  titolo: string;
  esami: string;
  esperienza: string;
};

export default function PercorsoAgevolatoPage() {
  const [form, setForm] = useState<FormData>({
    titolo: "",
    esami: "",
    esperienza: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    localStorage.setItem("percorso_agevolato", JSON.stringify(form));
    setSubmitted(true);
  };

  const whatsappUrl = `https://wa.me/393298170817?text=${encodeURIComponent(
    `Vorrei una valutazione gratuita CFU per Laurea Smart.

Titolo di studio: ${form.titolo}
Esami già sostenuti: ${form.esami}
Esperienza lavorativa: ${form.esperienza}`
  )}`;

  if (submitted) {
    return (
      <main style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
        <Card
          title="Potresti avere un percorso agevolato"
          description="In base alle informazioni inserite, potresti avere diritto a una valutazione dei CFU già maturati e ridurre il percorso universitario."
        >
          <div style={{ display: "grid", gap: 12 }}>
            <Card
              title="Cosa succede ora"
              description="Un orientatore può verificare il tuo caso, valutare eventuali esami già sostenuti, titoli ed esperienza lavorativa utile."
            />

            <Card
              title="Perché è importante"
              description="Una valutazione corretta può aiutarti a evitare iscrizioni sbagliate, perdere meno tempo e scegliere un percorso più sostenibile."
            />

            <Button
              label="Richiedi valutazione gratuita CFU"
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
        title="Verifica percorso agevolato"
        description="Hai già studiato, lavorato o sostenuto esami universitari? Potresti abbreviare il tuo percorso di laurea online."
      >
        <div style={{ display: "grid", gap: 12 }}>
          <input
            type="text"
            placeholder="Titolo di studio attuale"
            value={form.titolo}
            onChange={(e) => setForm({ ...form, titolo: e.target.value })}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "1px solid #e5e7eb",
            }}
          />

          <textarea
            placeholder="Hai già sostenuto esami universitari? Se sì, quali?"
            value={form.esami}
            onChange={(e) => setForm({ ...form, esami: e.target.value })}
            rows={4}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "1px solid #e5e7eb",
            }}
          />

          <textarea
            placeholder="Hai esperienza lavorativa rilevante?"
            value={form.esperienza}
            onChange={(e) => setForm({ ...form, esperienza: e.target.value })}
            rows={4}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "1px solid #e5e7eb",
            }}
          />

          <Button
            label="Scopri se puoi abbreviare il percorso"
            variant="primary"
            onClick={handleSubmit}
          />

          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>
            La valutazione definitiva deve essere fatta da un orientatore o da
            un ufficio competente. Questa funzione serve a capire se vale la
            pena richiedere una verifica personalizzata.
          </p>
        </div>
      </Card>
    </main>
  );
}
