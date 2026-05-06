"use client";

import { useState } from "react";
import OneSignal from "react-onesignal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import BottomNav from "@/components/ui/BottomNav";

type OrientamentoData = {
  situazione?: string;
  titolo_studio?: string;
  obiettivo?: string;
  urgenza?: string;
  tempo?: string;
  area?: string;
};

type StepItem = {
  id: keyof OrientamentoData;
  domanda: string;
  opzioni: string[];
};

type Risultato = {
  tipo: string;
  percorso: string;
  corsoSuggerito: string;
  tempoStimato: string;
  difficolta: string;
  descrizione: string;
  motivazioni: string[];
  prossimoPasso: string;
  ctaSecondaria: string;
};

type Segmenti = {
  segmento_intento: string;
  segmento_ingresso: string;
  segmento_urgenza: string;
};

export default function OrientamentoPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<OrientamentoData>({});

  const steps: StepItem[] = [
    {
      id: "situazione",
      domanda: "Cosa fai oggi?",
      opzioni: [
        "Lavoro full-time",
        "Lavoro part-time",
        "Studio",
        "Studio e lavoro",
        "Non lavoro al momento",
        "Altro",
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
        "Master universitario",
        "Diploma accademico di primo livello (AFAM)",
        "Diploma accademico di secondo livello (AFAM)",
        "Diploma conservatorio (vecchio ordinamento)",
        "Diploma accademia di belle arti",
        "Ho iniziato l’università ma non ho terminato",
        "Altro",
      ],
    },
    {
      id: "obiettivo",
      domanda: "Perché vuoi laurearti?",
      opzioni: [
        "Aumentare lo stipendio",
        "Cambiare lavoro",
        "Partecipare a concorsi",
        "Insegnare",
        "Crescita personale",
        "Completare il mio profilo professionale",
        "Non sono sicuro",
      ],
    },
    {
      id: "urgenza",
      domanda: "Entro quanto tempo vuoi realizzare questo obiettivo?",
      opzioni: [
        "Subito / entro 1 mese",
        "Entro 3 mesi",
        "Entro 6 mesi",
        "Entro 12 mesi",
        "Non ho una scadenza precisa",
      ],
    },
    {
      id: "tempo",
      domanda: "Quanto tempo puoi dedicare allo studio?",
      opzioni: [
        "2-4 ore a settimana",
        "5-7 ore a settimana",
        "8-10 ore a settimana",
        "Più di 10 ore a settimana",
        "Non lo so ancora",
      ],
    },
    {
      id: "area",
      domanda: "Quale area ti interessa di più?",
      opzioni: [
        "Economia e management",
        "Psicologia",
        "Scienze dell’educazione",
        "Giurisprudenza / servizi giuridici",
        "Scienze motorie",
        "Comunicazione",
        "Informatica / tecnologia",
        "Scuola e insegnamento",
        "Non so ancora",
      ],
    },
  ];

  const getRisultato = (data: OrientamentoData = formData): Risultato => {
    const situazione = data.situazione || "";
    const titolo = data.titolo_studio || "";
    const obiettivo = data.obiettivo || "";
    const urgenza = data.urgenza || "";
    const tempo = data.tempo || "";
    const area = data.area || "";

    let tipo = "GENERALE";
    let corsoSuggerito = "Percorso universitario online personalizzato";
    let percorso = "Percorso consigliato da definire con un orientatore";
    let descrizione =
      "Le tue risposte indicano che hai bisogno di un orientamento personalizzato per scegliere il percorso universitario più adatto al tuo obiettivo.";
    let tempoStimato = "Da valutare";
    let difficolta = "Sostenibile";
    let prossimoPasso = "Ricevere una valutazione personalizzata";
    let ctaSecondaria = "Verifica se puoi accedere a un percorso agevolato";

    const motivazioni: string[] = [];

    if (situazione.includes("Lavoro")) {
      motivazioni.push(
        "Hai bisogno di un percorso flessibile, compatibile con lavoro e impegni quotidiani."
      );
    }

    if (situazione === "Studio e lavoro") {
      motivazioni.push(
        "Studiare e lavorare richiede un piano realistico: la modalità online può aiutarti a gestire meglio i tempi."
      );
    }

    if (titolo === "Diploma") {
      motivazioni.push(
        "Partendo dal diploma, il primo passo naturale è valutare una laurea triennale online."
      );
    }

    if (titolo === "Laurea triennale") {
      motivazioni.push(
        "Avendo già una laurea triennale, potresti completare il profilo con una magistrale online."
      );
    }

    if (
      titolo.includes("AFAM") ||
      titolo.includes("conservatorio") ||
      titolo.includes("accademia") ||
      titolo === "Ho iniziato l’università ma non ho terminato"
    ) {
      motivazioni.push(
        "Il tuo percorso precedente potrebbe essere valorizzato con una valutazione CFU o un percorso personalizzato."
      );
      prossimoPasso = "Richiedere una valutazione gratuita dei CFU";
      ctaSecondaria = "Verifica subito il percorso agevolato";
    }

    if (urgenza === "Subito / entro 1 mese") {
      motivazioni.push(
        "Hai indicato un obiettivo molto ravvicinato: conviene valutare subito il percorso più rapido e sostenibile."
      );
    }

    if (urgenza === "Entro 3 mesi") {
      motivazioni.push(
        "Hai una finestra temporale breve: è utile chiarire presto titolo di ingresso, area e possibilità di agevolazione."
      );
    }

    if (tempo === "2-4 ore a settimana") {
      tempoStimato = "Percorso graduale";
      difficolta = "Bassa/media, se ben organizzato";
      motivazioni.push(
        "Hai poco tempo: serve un percorso sostenibile, non una scelta affrettata."
      );
    }

    if (tempo === "5-7 ore a settimana") {
      tempoStimato = "Percorso equilibrato";
      difficolta = "Media";
      motivazioni.push(
        "Il tempo indicato permette di costruire un ritmo di studio realistico."
      );
    }

    if (
      tempo === "8-10 ore a settimana" ||
      tempo === "Più di 10 ore a settimana"
    ) {
      tempoStimato = "Percorso potenzialmente più rapido";
      difficolta = "Media, con buona costanza";
      motivazioni.push(
        "Hai una disponibilità di tempo interessante: potresti organizzare un percorso più rapido."
      );
    }

    if (area === "Economia e management") {
      tipo = "ECONOMIA";
      corsoSuggerito = "Laurea online in area Economia e Management";
      percorso = "Percorso consigliato: crescita professionale e aziendale";
      descrizione =
        "Questo percorso è indicato se vuoi migliorare il tuo profilo nel lavoro, crescere in azienda, gestire attività o aprirti nuove opportunità professionali.";
    }

    if (area === "Psicologia") {
      tipo = "PSICOLOGIA";
      corsoSuggerito = "Laurea online in area Psicologia";
      percorso = "Percorso consigliato: persone, relazioni e organizzazioni";
      descrizione =
        "Questo percorso è indicato se ti interessa lavorare con le persone, comprendere comportamenti, dinamiche relazionali, formazione o contesti organizzativi.";
    }

    if (area === "Scienze dell’educazione") {
      tipo = "EDUCAZIONE";
      corsoSuggerito = "Laurea online in Scienze dell’Educazione";
      percorso =
        "Percorso consigliato: educazione, formazione e servizi alla persona";
      descrizione =
        "Questo percorso è adatto se vuoi lavorare in ambito educativo, sociale, formativo o nei servizi rivolti a bambini, ragazzi, famiglie e comunità.";
    }

    if (area === "Giurisprudenza / servizi giuridici") {
      tipo = "GIURIDICA";
      corsoSuggerito = "Laurea online in area Giuridica";
      percorso = "Percorso consigliato: diritto, amministrazione e concorsi";
      descrizione =
        "Questo percorso può essere utile se vuoi rafforzare il tuo profilo in ambito amministrativo, legale, aziendale, pubblico o concorsuale.";
    }

    if (area === "Scienze motorie") {
      tipo = "SPORT";
      corsoSuggerito = "Laurea online in Scienze Motorie";
      percorso = "Percorso consigliato: sport, benessere e attività motoria";
      descrizione =
        "Questo percorso è adatto se vuoi lavorare nel mondo dello sport, del benessere, della preparazione fisica o dell’attività motoria.";
    }

    if (area === "Comunicazione") {
      tipo = "COMUNICAZIONE";
      corsoSuggerito = "Laurea online in Comunicazione";
      percorso = "Percorso consigliato: comunicazione, marketing e digitale";
      descrizione =
        "Questo percorso è indicato se vuoi lavorare nella comunicazione, nel marketing, nei media, nei contenuti digitali o migliorare il tuo profilo creativo.";
    }

    if (area === "Informatica / tecnologia") {
      tipo = "TECNOLOGIA";
      corsoSuggerito = "Laurea online in Informatica o area Tecnologica";
      percorso = "Percorso consigliato: competenze digitali e tecnologia";
      descrizione =
        "Questo percorso è utile se vuoi sviluppare competenze tecniche e digitali, oggi molto richieste nel lavoro e nelle aziende.";
    }

    if (area === "Scuola e insegnamento" || obiettivo === "Insegnare") {
      tipo = "SCUOLA";
      corsoSuggerito = "Percorso online collegato a scuola e insegnamento";
      percorso = "Percorso consigliato: scuola, titoli e graduatorie";
      descrizione =
        "Questo percorso è indicato se vuoi lavorare nella scuola, migliorare il tuo profilo per graduatorie, concorsi o percorsi collegati all’insegnamento.";
    }

    if (obiettivo === "Aumentare lo stipendio") {
      motivazioni.push(
        "Il tuo obiettivo è economico: serve un percorso spendibile e coerente con il mercato del lavoro."
      );
    }

    if (obiettivo === "Cambiare lavoro") {
      motivazioni.push(
        "Vuoi cambiare direzione: la scelta del corso deve essere collegata a sbocchi professionali concreti."
      );
    }

    if (obiettivo === "Partecipare a concorsi") {
      motivazioni.push(
        "Se punti ai concorsi, è importante scegliere un titolo coerente e valutare bene requisiti e spendibilità."
      );
    }

    if (obiettivo === "Crescita personale") {
      motivazioni.push(
        "La crescita personale è importante, ma va collegata anche a un percorso utile e sostenibile."
      );
    }

    if (area === "Non so ancora" || obiettivo === "Non sono sicuro") {
      tipo = "ORIENTAMENTO";
      corsoSuggerito = "Percorso di orientamento universitario";
      percorso = "Percorso consigliato: chiarire la scelta prima di iscriversi";
      descrizione =
        "Le tue risposte indicano che prima di scegliere un corso è utile fare una valutazione guidata. La cosa più importante è evitare una scelta casuale.";
      prossimoPasso = "Parlare con un orientatore prima di scegliere";
      ctaSecondaria = "Ricevi una consulenza orientativa gratuita";
    }

    if (motivazioni.length === 0) {
      motivazioni.push(
        "Il percorso migliore va scelto mettendo insieme titolo di partenza, obiettivo, tempo disponibile e area di interesse."
      );
    }

    return {
      tipo,
      percorso,
      corsoSuggerito,
      tempoStimato,
      difficolta,
      descrizione,
      motivazioni,
      prossimoPasso,
      ctaSecondaria,
    };
  };

  const getSegmenti = (data: OrientamentoData): Segmenti => {
    let segmento_intento = "INDECISO";
    let segmento_ingresso = "ALTRO";
    let segmento_urgenza = "BASSA";

    if (data.obiettivo === "Cambiare lavoro") {
      segmento_intento = "CAMBIO_LAVORO";
    } else if (data.obiettivo === "Aumentare lo stipendio") {
      segmento_intento = "AUMENTO_STIPENDIO";
    } else if (data.obiettivo === "Partecipare a concorsi") {
      segmento_intento = "CONCORSI";
    } else if (data.obiettivo === "Insegnare") {
      segmento_intento = "SCUOLA";
    } else if (data.obiettivo === "Crescita personale") {
      segmento_intento = "CRESCITA_PERSONALE";
    } else if (data.obiettivo === "Completare il mio profilo professionale") {
      segmento_intento = "COMPLETAMENTO_PROFILO";
    } else if (data.obiettivo === "Non sono sicuro") {
      segmento_intento = "INDECISO";
    }

    if (data.titolo_studio === "Diploma") {
      segmento_ingresso = "DIPLOMA";
    } else if (data.titolo_studio === "Laurea triennale") {
      segmento_ingresso = "LAUREA_TRIENNALE";
    } else if (data.titolo_studio === "Laurea magistrale") {
      segmento_ingresso = "LAUREA_MAGISTRALE";
    } else if (data.titolo_studio === "Laurea vecchio ordinamento") {
      segmento_ingresso = "LAUREA_VECCHIO_ORDINAMENTO";
    } else if (data.titolo_studio === "Master universitario") {
      segmento_ingresso = "MASTER";
    } else if (
      data.titolo_studio?.includes("AFAM") ||
      data.titolo_studio?.includes("conservatorio") ||
      data.titolo_studio?.includes("accademia")
    ) {
      segmento_ingresso = "AFAM";
    } else if (data.titolo_studio?.includes("università")) {
      segmento_ingresso = "UNIVERSITA_INCOMPLETA";
    }

    if (data.urgenza === "Subito / entro 1 mese") {
      segmento_urgenza = "ALTA";
    } else if (data.urgenza === "Entro 3 mesi") {
      segmento_urgenza = "MEDIO_ALTA";
    } else if (data.urgenza === "Entro 6 mesi") {
      segmento_urgenza = "MEDIA";
    } else if (data.urgenza === "Entro 12 mesi") {
      segmento_urgenza = "BASSA";
    } else if (data.urgenza === "Non ho una scadenza precisa") {
      segmento_urgenza = "FREDDA";
    }

    return {
      segmento_intento,
      segmento_ingresso,
      segmento_urgenza,
    };
  };

  const salvaDati = async (data: OrientamentoData) => {
    const risultato = getRisultato(data);
    const segmenti = getSegmenti(data);

    const storedUser = localStorage.getItem("gps_user");
    const user = storedUser
      ? (JSON.parse(storedUser) as {
          nome?: string;
          cognome?: string;
          email?: string;
          telefono?: string;
        })
      : null;

    localStorage.setItem("profilo_utente", risultato.tipo);
    localStorage.setItem("titolo_studio", data.titolo_studio || "");
    localStorage.setItem("obiettivo", data.obiettivo || "");
    localStorage.setItem("urgenza_obiettivo", data.urgenza || "");
    localStorage.setItem("area_interesse", data.area || "");

    try {
      if (!user?.email) {
        console.log("OneSignal: email utente mancante");
      } else {
        const externalId = `ls_${user.email.toLowerCase().trim()}`;
        await OneSignal.login(externalId);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        await OneSignal.User.addTags({
          email: user.email,
          nome: user.nome || "",
          cognome: user.cognome || "",
          telefono: user.telefono || "",
          profilo: risultato.tipo,
          titolo_studio: data.titolo_studio || "",
          obiettivo: data.obiettivo || "",
          urgenza_obiettivo: data.urgenza || "",
          tempo_disponibile: data.tempo || "",
          area_interesse: data.area || "",
          segmento_intento: segmenti.segmento_intento,
          segmento_ingresso: segmenti.segmento_ingresso,
          segmento_urgenza: segmenti.segmento_urgenza,
        });

        console.log("OneSignal tag inviati correttamente", {
          profilo: risultato.tipo,
          titolo_studio: data.titolo_studio,
          obiettivo: data.obiettivo,
          urgenza_obiettivo: data.urgenza,
          tempo_disponibile: data.tempo,
          area_interesse: data.area,
          segmento_intento: segmenti.segmento_intento,
          segmento_ingresso: segmenti.segmento_ingresso,
          segmento_urgenza: segmenti.segmento_urgenza,
        });
      }
    } catch (tagError) {
      console.error("Errore aggiornamento tag OneSignal:", tagError);
    }

    try {
      await fetch("/api/orientamento/salva", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: user?.email || "",
          user_nome: user?.nome || "",
          situazione: data.situazione,
          titolo_studio: data.titolo_studio,
          obiettivo: data.obiettivo,
          urgenza_obiettivo: data.urgenza,
          tempo: data.tempo,
          area: data.area,
          risultato_tipo: risultato.tipo,
          corso_suggerito: risultato.corsoSuggerito,
          segmento_intento: segmenti.segmento_intento,
          segmento_ingresso: segmenti.segmento_ingresso,
          segmento_urgenza: segmenti.segmento_urgenza,
        }),
      });
    } catch (error) {
      console.error("Errore salvataggio orientamento:", error);
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

    const whatsappUrl = `https://wa.me/393298170817?text=${encodeURIComponent(
      `Ho fatto il test Laurea Smart e vorrei ricevere il mio piano personalizzato.

Situazione attuale: ${formData.situazione || ""}
Titolo di studio: ${formData.titolo_studio || ""}
Obiettivo: ${formData.obiettivo || ""}
Urgenza obiettivo: ${formData.urgenza || ""}
Tempo disponibile: ${formData.tempo || ""}
Area di interesse: ${formData.area || ""}

Risultato: ${risultato.percorso}
Corso suggerito: ${risultato.corsoSuggerito}`
    )}`;

    return (
      <main
        style={{
          minHeight: "100vh",
          padding: 20,
          paddingBottom: 120,
          maxWidth: 500,
          margin: "0 auto",
          background: "#F8FBFF",
          fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
        }}
      >
        <Card title={risultato.percorso} description={risultato.descrizione}>
          <div style={{ display: "grid", gap: 12 }}>
            <Card
              title="Corso suggerito"
              description={risultato.corsoSuggerito}
            />

            <Card title="Tempo stimato" description={risultato.tempoStimato} />

            <Card
              title="Difficoltà percepita"
              description={risultato.difficolta}
            />

            <Card title="Perché è adatto al tuo profilo">
              <ul style={{ marginTop: 0, paddingLeft: 18 }}>
                {risultato.motivazioni.map((item, index) => (
                  <li key={index} style={{ marginBottom: 6 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card
              title="Prossimo passo"
              description={risultato.prossimoPasso}
            />

            <Button
              label="Ricevi il tuo piano personalizzato (gratis)"
              variant="primary"
              onClick={() => window.open(whatsappUrl, "_blank")}
            />

            <p
              style={{
                marginTop: 0,
                fontSize: 13,
                color: "#666",
                lineHeight: 1.5,
              }}
            >
              {risultato.ctaSecondaria}. Un orientatore può aiutarti a capire
              quale percorso online è più adatto al tuo lavoro, al tuo tempo e
              al tuo obiettivo.
            </p>
          </div>
        </Card>

        <BottomNav />
      </main>
    );
  }

  const current = steps[step];

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 20,
        paddingBottom: 120,
        maxWidth: 500,
        margin: "0 auto",
        background: "#F8FBFF",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
      }}
    >
      <Card title="Trova la laurea giusta per te">
        <div style={{ marginBottom: 18 }}>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 13,
              fontWeight: 700,
              color: "#1F6FB2",
            }}
          >
            Domanda {step + 1} di {steps.length}
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: 24,
              lineHeight: 1.18,
              fontWeight: 800,
              color: "#09090B",
              letterSpacing: "-0.5px",
            }}
          >
            {current.domanda}
          </h2>
        </div>

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

      <BottomNav />
    </main>
  );
}
