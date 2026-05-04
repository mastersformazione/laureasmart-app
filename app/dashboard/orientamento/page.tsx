"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type OrientamentoData = {
  cambiamento?: string;
  titolo_studio?: string;
  interesse?: string;
  urgenza?: string;
};

type StepItem = {
  id: keyof OrientamentoData;
  domanda: string;
  opzioni: string[];
};

export default function OrientamentoPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<OrientamentoData>({});

  const steps: StepItem[] = [
    {
      id: "cambiamento",
      domanda: "Che cambiamento vorresti ottenere nella tua vita?",
      opzioni: [
        "Voglio lavorare nella scuola",
        "Voglio diventare un professionista",
        "Voglio guadagnare di più",
        "Voglio cambiare lavoro",
        "Voglio prendere una laurea",
        "Non ho ancora le idee chiare",
      ],
    },
    {
      id: "titolo_studio",
      domanda: "Qual è il tuo titolo di studio attuale?",
      opzioni: [
        "Diploma",
        "Laurea triennale",
        "Laurea magistrale",
        "Laurea vecchio ordinamento",
        "Master",
        "Non ho ancora un titolo universitario",
        "Altro",
      ],
    },
    {
      id: "interesse",
      domanda: "Quale ambito ti appassiona di più?",
      opzioni: [
        "Aiutare le persone",
        "Insegnare",
        "Lavorare con bambini e ragazzi",
        "Economia e impresa",
        "Diritto e giustizia",
        "Comunicazione",
        "Tecnologia",
        "Sport e benessere",
        "Pubblica amministrazione",
        "Non saprei",
      ],
    },
    {
      id: "urgenza",
      domanda: "Quando vorresti iniziare a costruire questo percorso?",
      opzioni: [
        "Subito",
        "Entro 3 mesi",
        "Entro 6 mesi",
        "Più avanti",
        "Sto solo cercando informazioni",
      ],
    },
  ];

  const getRisultato = () => {
    const cambiamento = formData.cambiamento || "";
    const interesse = formData.interesse || "";

    if (
      cambiamento === "Voglio lavorare nella scuola" ||
      interesse === "Insegnare"
    ) {
      return {
        tipo: "SCUOLA_GPS",
        titolo: "Percorso consigliato: mondo scuola",
        descrizione:
          "Le tue risposte indicano un interesse verso l’insegnamento, le GPS o la crescita nel mondo scuola. Il primo passo è verificare se il tuo titolo è già spendibile o se servono integrazioni, master o certificazioni.",
        consigli: [
          "Verifica del titolo di studio",
          "Controllo delle classi di concorso accessibili",
          "Eventuale integrazione di esami",
          "Master universitari per aumentare il punteggio",
          "Certificazioni informatiche e linguistiche",
        ],
      };
    }

    if (cambiamento === "Voglio diventare un professionista") {
      return {
        tipo: "PROFESSIONE",
        titolo: "Percorso consigliato: professione regolamentata",
        descrizione:
          "Hai scelto una strada che può richiedere una laurea specifica, un percorso strutturato e, in alcuni casi, tirocinio o abilitazione professionale.",
        consigli: [
          "Scelta della laurea più coerente",
          "Verifica dei requisiti professionali",
          "Valutazione tra triennale, magistrale o ciclo unico",
          "Orientamento prima dell’iscrizione",
        ],
      };
    }

    if (
      cambiamento === "Voglio guadagnare di più" ||
      cambiamento === "Voglio cambiare lavoro"
    ) {
      return {
        tipo: "CRESCITA_LAVORO",
        titolo: "Percorso consigliato: crescita professionale",
        descrizione:
          "Il tuo obiettivo sembra essere migliorare la tua posizione, aumentare le opportunità o cambiare settore. In questo caso può essere utile valutare una laurea, un master o certificazioni mirate.",
        consigli: [
          "Laurea triennale o magistrale",
          "Master professionalizzante",
          "Certificazioni spendibili nel lavoro",
          "Percorsi collegati a scuola, concorsi o aziende",
        ],
      };
    }

    if (cambiamento === "Voglio prendere una laurea") {
      return {
        tipo: "LAUREA",
        titolo: "Percorso consigliato: scelta universitaria",
        descrizione:
          "Le tue risposte indicano che vuoi costruire un percorso universitario. La scelta migliore dipende dal tuo titolo attuale, dai tuoi interessi e dal tipo di lavoro che immagini per il futuro.",
        consigli: [
          "Analisi dell’area universitaria più adatta",
          "Confronto tra corsi di laurea",
          "Valutazione degli sbocchi professionali",
          "Piano di studio compatibile con lavoro e impegni",
        ],
      };
    }

    return {
      tipo: "INDECISO",
      titolo: "Percorso consigliato: chiarire la direzione",
      descrizione:
        "È normale non avere ancora le idee chiare. Il punto di partenza migliore è capire quale obiettivo vuoi costruire e quale percorso può essere più realistico per la tua situazione.",
      consigli: [
        "Consulenza orientativa",
        "Analisi del titolo attuale",
        "Confronto tra più aree di studio",
        "Valutazione delle opportunità più concrete",
      ],
    };
  };

  const salvaDati = async (data: OrientamentoData) => {
    try {
      const risultato = getRisultato();

      localStorage.setItem("profilo_utente", risultato.tipo);

      try {
        const OneSignal = (
          window as typeof window & {
            OneSignal?: {
              User?: {
                addTag?: (key: string, value: string) => void;
              };
            };
          }
        ).OneSignal;

        if (OneSignal?.User?.addTag) {
          OneSignal.User.addTag("profilo", risultato.tipo);
          console.log("Tag OneSignal aggiornato dopo test:", risultato.tipo);
        }
      } catch (tagError) {
        console.error("Errore aggiornamento tag OneSignal:", tagError);
      }

      await fetch("/api/orientamento/salva", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: "test@app.com",
          user_nome: "Utente",
          cambiamento: data.cambiamento,
          obiettivo: data.cambiamento,
          titolo_studio: data.titolo_studio,
          interesse: data.interesse,
          urgenza: data.urgenza,
          risultato_tipo: risultato.tipo,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelect = async (value: string) => {
    const currentStep = steps[step];

    const updatedData: OrientamentoData = {
      ...formData,
      [currentStep.id]: value,
    };

    setFormData(updatedData);

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      await salvaDati(updatedData);
      setStep(step + 1);
    }
  };

  if (step >= steps.length) {
    const risultato = getRisultato();

    const whatsappUrl = `https://wa.me/393298170817?text=Ho%20fatto%20il%20test%20orientamento.%0A%0ACambiamento:%20${encodeURIComponent(
      formData.cambiamento || ""
    )}%0ATitolo:%20${encodeURIComponent(
      formData.titolo_studio || ""
    )}%0AInteresse:%20${encodeURIComponent(
      formData.interesse || ""
    )}%0AUrgenza:%20${encodeURIComponent(formData.urgenza || "")}`;

    return (
      <main style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
        <Card title={risultato.titolo} description={risultato.descrizione}>
          <div style={{ display: "grid", gap: 12 }}>
            <Card
              title="Dove sei oggi"
              description="Con il tuo titolo attuale puoi accedere a opportunità limitate o comunque non ottimizzate rispetto ai tuoi obiettivi."
            />

            <Card
              title="Dove puoi arrivare"
              description="Con il percorso giusto puoi accedere a opportunità molto più stabili, aumentare le possibilità di lavoro e costruire una crescita reale nel tempo."
            />

            <div>
              <h3>Percorso consigliato per te</h3>

              <ul style={{ marginTop: 10 }}>
                {risultato.consigli.map((item, index) => (
                  <li key={index} style={{ marginBottom: 6 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p style={{ marginTop: 8, fontWeight: "bold" }}>
              Il punto non è scegliere un corso qualsiasi, ma capire qual è il
              percorso più veloce e adatto alla tua situazione.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", textDecoration: "none" }}
            >
              <Button
                label="Ricevi Gratis il tuo piano personalizzato su WhatsApp"
                variant="primary"
              />
            </a>

            <p style={{ marginTop: 0, fontSize: 14, color: "#555" }}>
              Un orientatore analizzerà GRATUITAMENTE il tuo caso e ti dirà
              esattamente cosa fare.
            </p>
          </div>
        </Card>
      </main>
    );
  }

  const current = steps[step];

  return (
    <main style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <Card
        title="Trova la tua strada"
        description={`Domanda ${step + 1} di ${steps.length}: ${
          current.domanda
        }`}
      >
        <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
          {current.opzioni.map((opzione) => (
            <Button
              key={opzione}
              label={opzione}
              onClick={() => handleSelect(opzione)}
              variant="secondary"
            />
          ))}
        </div>
      </Card>
    </main>
  );
}
