"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import BottomNav from "@/components/ui/BottomNav";

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
  };

  const whatsappUrl = `https://wa.me/393793673257?text=${encodeURIComponent(
    `Vorrei una valutazione gratuita CFU per Laurea Smart.

Titolo di studio: ${form.titolo}
Esami già sostenuti: ${form.esami}
Numero esami: ${form.numeroEsami}
Esperienza lavorativa: ${form.esperienza}
Area di interesse: ${form.area}
Note: ${form.note}`
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
              description="Un orientatore può verificare il tuo caso, valutare eventuali esami già sostenuti, titoli AFAM, titoli universitari ed esperienza lavorativa utile."
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
          <select
            value={form.titolo}
            onChange={(e) => setForm({ ...form, titolo: e.target.value })}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            <option value="">Titolo di studio attuale</option>
            <option value="Diploma">Diploma</option>
            <option value="Laurea triennale">Laurea triennale</option>
            <option value="Laurea magistrale">Laurea magistrale</option>
            <option value="Laurea vecchio ordinamento">
              Laurea vecchio ordinamento
            </option>
            <option value="Master universitario">Master universitario</option>
            <option value="Diploma accademico di primo livello (AFAM)">
              Diploma accademico di primo livello (AFAM)
            </option>
            <option value="Diploma accademico di secondo livello (AFAM)">
              Diploma accademico di secondo livello (AFAM)
            </option>
            <option value="Diploma conservatorio (vecchio ordinamento)">
              Diploma conservatorio (vecchio ordinamento)
            </option>
            <option value="Diploma accademia di belle arti">
              Diploma accademia di belle arti
            </option>
            <option value="Ho iniziato l’università ma non ho terminato">
              Ho iniziato l’università ma non ho terminato
            </option>
            <option value="Altro">Altro</option>
          </select>

          <select
            value={form.esami}
            onChange={(e) => setForm({ ...form, esami: e.target.value })}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            <option value="">Hai già sostenuto esami universitari?</option>
            <option value="No">No</option>
            <option value="Sì, pochi esami">Sì, pochi esami</option>
            <option value="Sì, diversi esami">Sì, diversi esami</option>
            <option value="Sì, ho una carriera universitaria precedente">
              Sì, ho una carriera universitaria precedente
            </option>
            <option value="Non lo so">Non lo so</option>
          </select>

          <select
            value={form.numeroEsami}
            onChange={(e) => setForm({ ...form, numeroEsami: e.target.value })}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            <option value="">Quanti esami hai sostenuto?</option>
            <option value="Nessuno">Nessuno</option>
            <option value="1-3 esami">1-3 esami</option>
            <option value="4-8 esami">4-8 esami</option>
            <option value="9-15 esami">9-15 esami</option>
            <option value="Oltre 15 esami">Oltre 15 esami</option>
            <option value="Non ricordo">Non ricordo</option>
          </select>

          <select
            value={form.esperienza}
            onChange={(e) => setForm({ ...form, esperienza: e.target.value })}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            <option value="">Esperienza lavorativa rilevante</option>
            <option value="Nessuna esperienza rilevante">
              Nessuna esperienza rilevante
            </option>
            <option value="1-3 anni">1-3 anni</option>
            <option value="4-6 anni">4-6 anni</option>
            <option value="Oltre 6 anni">Oltre 6 anni</option>
            <option value="Esperienza nel settore che vorrei studiare">
              Esperienza nel settore che vorrei studiare
            </option>
          </select>

          <select
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            <option value="">Area di interesse</option>
            <option value="Economia e management">Economia e management</option>
            <option value="Psicologia">Psicologia</option>
            <option value="Scienze dell’educazione">
              Scienze dell’educazione
            </option>
            <option value="Giurisprudenza / servizi giuridici">
              Giurisprudenza / servizi giuridici
            </option>
            <option value="Scienze motorie">Scienze motorie</option>
            <option value="Comunicazione">Comunicazione</option>
            <option value="Informatica / tecnologia">
              Informatica / tecnologia
            </option>
            <option value="Scuola e insegnamento">Scuola e insegnamento</option>
            <option value="Non so ancora">Non so ancora</option>
          </select>

          <textarea
            placeholder="Vuoi aggiungere qualcosa sul tuo percorso? (facoltativo)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
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
      <BottomNav />
    </main>
  );
}
