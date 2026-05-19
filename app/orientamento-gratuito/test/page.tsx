"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Loader2,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";

type OrientamentoData = {
  stato_iscrizione?: string;
  eta?: string;
  situazione?: string;
  titolo_studio?: string;
  obiettivo?: string;
  motivazione_studio?: string;
  urgenza?: string;
  tempo?: string;
  area?: string;
  aspetto_da_valutare?: string;
};

type Segmenti = {
  segmento_studente: string;
  segmento_intento: string;
  segmento_motivazione: string;
  segmento_ingresso: string;
  segmento_urgenza: string;
  segmento_aspetto: string;
};

type Risultato = {
  tipo: string;
  titolo: string;
  descrizione: string;
  percorso: string;
};

type LeadForm = {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  privacy: boolean;
};

const steps: {
  id: keyof OrientamentoData;
  domanda: string;
  sottotitolo?: string;
  opzioni: string[];
}[] = [
  {
    id: "stato_iscrizione",
    domanda: "Sei già iscritto a un corso di laurea?",
    sottotitolo:
      "Ci aiuta a capire se stai iniziando da zero, se vuoi riprendere o se stai valutando un cambio percorso.",
    opzioni: [
      "Sì, sono già iscritto",
      "No, non sono ancora iscritto",
      "Ho iniziato ma ho interrotto",
      "Sto valutando un trasferimento",
    ],
  },
  {
    id: "eta",
    domanda: "Qual è la tua fascia d’età?",
    opzioni: ["18-24", "25-34", "35-44", "45 o più"],
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
      "Ho iniziato l’università ma non ho concluso",
      "Altro",
    ],
  },
  {
    id: "obiettivo",
    domanda: "Qual è il tuo obiettivo principale?",
    opzioni: [
      "Cambiare lavoro",
      "Aumentare lo stipendio",
      "Partecipare a concorsi",
      "Insegnare",
      "Crescita personale",
      "Completare il mio profilo professionale",
      "Non sono sicuro",
    ],
  },
  {
    id: "motivazione_studio",
    domanda: "Perché vuoi laurearti?",
    sottotitolo:
      "Non esiste una risposta giusta: serve solo a capire quale percorso può essere più coerente con te.",
    opzioni: [
      "Voglio imparare e acquisire nuove conoscenze",
      "Mi serve un titolo per migliorare lavoro o carriera",
      "Voglio ottenere il titolo nel modo più rapido e organizzato possibile",
      "Mi serve una laurea per concorsi, graduatorie o avanzamenti",
      "Voglio cambiare settore professionale",
      "Voglio completare un percorso universitario iniziato in passato",
      "Non lo so ancora, vorrei essere guidato nella scelta",
    ],
  },
  {
    id: "urgenza",
    domanda: "Quando vorresti iniziare?",
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
    domanda: "Quanto tempo pensi di poter dedicare allo studio?",
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
      "Economia",
      "Psicologia",
      "Scienze dell’educazione",
      "Giurisprudenza",
      "Ingegneria",
      "Informatica",
      "Scienze motorie",
      "Comunicazione",
      "Lettere",
      "Lingue",
      "Scuola",
      "Non lo so",
    ],
  },
  {
    id: "aspetto_da_valutare",
    domanda:
      "C’è qualche aspetto che sarebbe utile valutare prima dell’iscrizione?",
    sottotitolo:
      "Puoi indicare un elemento da approfondire oppure scegliere di parlarne con un orientatore.",
    opzioni: [
      "Esami universitari già sostenuti",
      "Esperienze lavorative o certificazioni",
      "Possibili agevolazioni o convenzioni",
      "Esigenze di supporto allo studio, DSA, BES o disabilità",
      "Non saprei",
      "Preferisco parlarne con un orientatore",
    ],
  },
];

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "22px 18px 60px",
  maxWidth: 500,
  margin: "0 auto",
  color: "#FFFFFF",
  background:
    "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
  fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
  overflowX: "hidden",
};

const glassCard: CSSProperties = {
  borderRadius: 30,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  boxShadow: "0 24px 60px rgba(0,0,0,0.26)",
  backdropFilter: "blur(12px)",
};

const primaryButtonStyle: CSSProperties = {
  minHeight: 56,
  borderRadius: 18,
  border: "none",
  background: "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 100%)",
  color: "white",
  fontSize: 15,
  fontWeight: 950,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  padding: "0 18px",
  cursor: "pointer",
  textDecoration: "none",
  boxShadow: "0 18px 38px rgba(31,111,178,0.34)",
};

const secondaryButtonStyle: CSSProperties = {
  minHeight: 50,
  borderRadius: 17,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  fontSize: 13,
  fontWeight: 900,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "0 15px",
  cursor: "pointer",
  textDecoration: "none",
};

function getSegmenti(data: OrientamentoData): Segmenti {
  let segmento_studente = "NON_ISCRITTO";

  if (data.stato_iscrizione === "Sì, sono già iscritto") {
    segmento_studente = "GIA_ISCRITTO";
  } else if (data.stato_iscrizione === "Ho iniziato ma ho interrotto") {
    segmento_studente = "UNIVERSITA_INTERROTTA";
  } else if (data.stato_iscrizione === "Sto valutando un trasferimento") {
    segmento_studente = "TRASFERIMENTO";
  }

  let segmento_intento = "INDECISO";

  if (data.obiettivo === "Cambiare lavoro") segmento_intento = "CAMBIO_LAVORO";
  else if (data.obiettivo === "Aumentare lo stipendio")
    segmento_intento = "AUMENTO_STIPENDIO";
  else if (data.obiettivo === "Partecipare a concorsi")
    segmento_intento = "CONCORSI";
  else if (data.obiettivo === "Insegnare") segmento_intento = "SCUOLA";
  else if (data.obiettivo === "Crescita personale")
    segmento_intento = "CRESCITA_PERSONALE";
  else if (data.obiettivo === "Completare il mio profilo professionale")
    segmento_intento = "COMPLETAMENTO_PROFILO";

  let segmento_motivazione = "INDECISO";

  if (
    data.motivazione_studio === "Voglio imparare e acquisire nuove conoscenze"
  )
    segmento_motivazione = "CONOSCENZA";
  else if (
    data.motivazione_studio ===
    "Mi serve un titolo per migliorare lavoro o carriera"
  )
    segmento_motivazione = "CARRIERA";
  else if (
    data.motivazione_studio ===
    "Voglio ottenere il titolo nel modo più rapido e organizzato possibile"
  )
    segmento_motivazione = "TITOLO_RAPIDO";
  else if (
    data.motivazione_studio ===
    "Mi serve una laurea per concorsi, graduatorie o avanzamenti"
  )
    segmento_motivazione = "CONCORSI";
  else if (data.motivazione_studio === "Voglio cambiare settore professionale")
    segmento_motivazione = "CAMBIO_SETTORE";
  else if (
    data.motivazione_studio ===
    "Voglio completare un percorso universitario iniziato in passato"
  )
    segmento_motivazione = "COMPLETAMENTO";

  let segmento_ingresso = "ALTRO";

  if (data.titolo_studio === "Diploma") segmento_ingresso = "DIPLOMA";
  else if (data.titolo_studio === "Laurea triennale")
    segmento_ingresso = "LAUREA_TRIENNALE";
  else if (data.titolo_studio === "Laurea magistrale")
    segmento_ingresso = "LAUREA_MAGISTRALE";
  else if (data.titolo_studio === "Laurea vecchio ordinamento")
    segmento_ingresso = "LAUREA_VECCHIO_ORDINAMENTO";
  else if (data.titolo_studio === "Master universitario")
    segmento_ingresso = "MASTER";
  else if (data.titolo_studio === "Ho iniziato l’università ma non ho concluso")
    segmento_ingresso = "UNIVERSITA_INCOMPLETA";

  let segmento_urgenza = "NON_DEFINITA";

  if (data.urgenza === "Subito / entro 1 mese") segmento_urgenza = "ALTA";
  else if (data.urgenza === "Entro 3 mesi") segmento_urgenza = "MEDIO_ALTA";
  else if (data.urgenza === "Entro 6 mesi") segmento_urgenza = "MEDIA";
  else if (data.urgenza === "Entro 12 mesi") segmento_urgenza = "BASSA";
  else if (data.urgenza === "Non ho una scadenza precisa")
    segmento_urgenza = "FREDDA";

  let segmento_aspetto = "NESSUNO";

  if (data.aspetto_da_valutare === "Esami universitari già sostenuti")
    segmento_aspetto = "CFU_INTERESSE";
  else if (
    data.aspetto_da_valutare === "Esperienze lavorative o certificazioni"
  )
    segmento_aspetto = "VALUTAZIONE_CARRIERA";
  else if (data.aspetto_da_valutare === "Possibili agevolazioni o convenzioni")
    segmento_aspetto = "AGEVOLAZIONI_INTERESSE";
  else if (
    data.aspetto_da_valutare ===
    "Esigenze di supporto allo studio, DSA, BES o disabilità"
  )
    segmento_aspetto = "SUPPORTO_STUDIO_AGEVOLAZIONI";
  else if (data.aspetto_da_valutare === "Non saprei")
    segmento_aspetto = "DA_ORIENTARE";
  else if (
    data.aspetto_da_valutare === "Preferisco parlarne con un orientatore"
  )
    segmento_aspetto = "CONTATTO_RISERVATO";

  return {
    segmento_studente,
    segmento_intento,
    segmento_motivazione,
    segmento_ingresso,
    segmento_urgenza,
    segmento_aspetto,
  };
}

function getRisultato(data: OrientamentoData): Risultato {
  const area = data.area || "";

  if (area === "Economia") {
    return {
      tipo: "ECONOMIA",
      titolo: "Profilo economico-manageriale",
      descrizione:
        "Le tue risposte indicano un interesse verso percorsi legati a organizzazione, gestione, amministrazione, impresa o crescita professionale.",
      percorso:
        "Potresti valutare percorsi in Economia, Management, Amministrazione, Marketing o ambiti affini.",
    };
  }

  if (area === "Psicologia") {
    return {
      tipo: "PSICOLOGIA",
      titolo: "Profilo psicologico e relazionale",
      descrizione:
        "Il tuo profilo sembra orientato verso la comprensione delle persone, dei comportamenti, delle relazioni e dei contesti sociali.",
      percorso:
        "Potresti valutare percorsi in Scienze e Tecniche Psicologiche o aree collegate alle scienze umane.",
    };
  }

  if (area === "Scienze dell’educazione" || area === "Scuola") {
    return {
      tipo: "EDUCAZIONE",
      titolo: "Profilo educativo e formativo",
      descrizione:
        "Le tue risposte evidenziano un interesse per formazione, educazione, servizi alla persona, scuola o supporto nei contesti educativi.",
      percorso:
        "Potresti valutare percorsi in Scienze dell’Educazione, formazione, pedagogia o ambiti collegati alla scuola.",
    };
  }

  if (area === "Giurisprudenza") {
    return {
      tipo: "GIURIDICA",
      titolo: "Profilo giuridico",
      descrizione:
        "Il tuo profilo sembra orientato verso norme, istituzioni, diritto, amministrazione o concorsi.",
      percorso:
        "Potresti valutare percorsi giuridici o politico-amministrativi, anche in relazione a concorsi e avanzamenti.",
    };
  }

  if (area === "Ingegneria" || area === "Informatica") {
    return {
      tipo: "TECNOLOGIA",
      titolo: "Profilo tecnico e digitale",
      descrizione:
        "Le tue risposte indicano un interesse per ambiti tecnici, digitali, progettuali o tecnologici.",
      percorso:
        "Potresti valutare percorsi in Ingegneria, Informatica, tecnologie digitali o ambiti tecnico-scientifici.",
    };
  }

  if (area === "Scienze motorie") {
    return {
      tipo: "SPORT",
      titolo: "Profilo sportivo e motorio",
      descrizione:
        "Il tuo profilo è vicino all’area del benessere, movimento, sport e attività motorie.",
      percorso:
        "Potresti valutare percorsi in Scienze Motorie o ambiti legati a sport, benessere e salute.",
    };
  }

  if (area === "Comunicazione" || area === "Lettere" || area === "Lingue") {
    return {
      tipo: "COMUNICAZIONE",
      titolo: "Profilo comunicativo e umanistico",
      descrizione:
        "Le tue risposte indicano un interesse per comunicazione, linguaggi, cultura, scrittura, relazioni e contenuti.",
      percorso:
        "Potresti valutare percorsi in Comunicazione, Lingue, Lettere, discipline umanistiche o creative.",
    };
  }

  return {
    tipo: "GENERALE",
    titolo: "Profilo da orientare",
    descrizione:
      "Le tue risposte mostrano che potresti avere bisogno di confrontare più aree prima di scegliere.",
    percorso:
      "Il passo più utile è valutare con attenzione obiettivo, tempo disponibile, titolo di partenza e sostenibilità del percorso.",
  };
}

function saveToLocalStorage(
  data: OrientamentoData,
  segmenti: Segmenti,
  risultato: Risultato
) {
  localStorage.setItem("onboarding_test_data", JSON.stringify(data));
  localStorage.setItem("orientamento_data", JSON.stringify(data));
  localStorage.setItem("orientamento_risultato", JSON.stringify(risultato));
  localStorage.setItem("ha_fatto_test", "si");

  localStorage.setItem("stato_iscrizione", data.stato_iscrizione || "");
  localStorage.setItem("titolo_studio", data.titolo_studio || "");
  localStorage.setItem("obiettivo", data.obiettivo || "");
  localStorage.setItem("motivazione_studio", data.motivazione_studio || "");
  localStorage.setItem("urgenza_obiettivo", data.urgenza || "");
  localStorage.setItem("tempo_disponibile", data.tempo || "");
  localStorage.setItem("area_interesse", data.area || "");
  localStorage.setItem("aspetto_da_valutare", data.aspetto_da_valutare || "");

  localStorage.setItem("profilo_utente", risultato.tipo);
  localStorage.setItem("corso_suggerito", risultato.percorso);

  localStorage.setItem("segmento_studente", segmenti.segmento_studente);
  localStorage.setItem("segmento_intento", segmenti.segmento_intento);
  localStorage.setItem("segmento_motivazione", segmenti.segmento_motivazione);
  localStorage.setItem("segmento_ingresso", segmenti.segmento_ingresso);
  localStorage.setItem("segmento_urgenza", segmenti.segmento_urgenza);
  localStorage.setItem("segmento_aspetto", segmenti.segmento_aspetto);
}

export default function OrientamentoGratuitoTestPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<OrientamentoData>({});
  const [fase, setFase] = useState<"test" | "form" | "risultato">("test");
  const [lead, setLead] = useState<LeadForm>({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    privacy: false,
  });
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState("");

  const currentStep = steps[stepIndex];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

  const segmenti = useMemo(() => getSegmenti(data), [data]);
  const risultato = useMemo(() => getRisultato(data), [data]);

  function handleAnswer(value: string) {
    const nextData = {
      ...data,
      [currentStep.id]: value,
    };

    setData(nextData);

    if (stepIndex < steps.length - 1) {
      setStepIndex((index) => index + 1);
      return;
    }

    const finalSegmenti = getSegmenti(nextData);
    const finalRisultato = getRisultato(nextData);

    saveToLocalStorage(nextData, finalSegmenti, finalRisultato);
    setFase("form");
  }

  function goBack() {
    if (fase === "form") {
      setFase("test");
      setStepIndex(steps.length - 1);
      return;
    }

    if (stepIndex > 0) {
      setStepIndex((index) => index - 1);
    }
  }

  async function submitLead() {
    setErrore("");

    if (!lead.nome || !lead.cognome || !lead.email || !lead.telefono) {
      setErrore(
        "Compila nome, cognome, email e telefono per vedere il risultato."
      );
      return;
    }

    if (!lead.privacy) {
      setErrore("Per continuare devi accettare l’informativa privacy.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nome: lead.nome,
        cognome: lead.cognome,
        email: lead.email,
        telefono: lead.telefono,

        ...data,
        ...segmenti,

        risultato_tipo: risultato.tipo,
        risultato_titolo: risultato.titolo,
        risultato_descrizione: risultato.descrizione,
        corso_suggerito: risultato.percorso,

        source: "orientamento_gratuito",
      };

      const response = await fetch(
        "https://laureasmart.it/api/orientamento-gratuito-salva.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Salvataggio non riuscito");
      }

      const gpsUser = {
        nome: lead.nome,
        cognome: lead.cognome,
        email: lead.email,
        telefono: lead.telefono,
      };

      localStorage.setItem("gps_user", JSON.stringify(gpsUser));
      localStorage.setItem("user_email", lead.email);
      localStorage.setItem("onboarding_lead_salvato", "SI");
      localStorage.setItem("onboarding_lead_data", new Date().toISOString());

      saveToLocalStorage(data, segmenti, risultato);

      setFase("risultato");
    } catch (error) {
      console.error("Errore orientamento gratuito", error);
      setErrore(
        "Non è stato possibile salvare il risultato. Riprova tra poco."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={pageStyle}>
      <header style={{ marginBottom: 16 }}>
        <Link
          href="/orientamento-gratuito"
          style={{
            color: "rgba(255,255,255,0.82)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontSize: 13,
            fontWeight: 850,
          }}
        >
          ← Torna indietro
        </Link>
      </header>

      {fase === "test" && (
        <>
          <section
            style={{
              ...glassCard,
              padding: 18,
              marginBottom: 16,
              background:
                "linear-gradient(145deg, rgba(31,111,178,0.30), rgba(139,92,246,0.16), rgba(255,255,255,0.06))",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.10)",
                marginBottom: 13,
              }}
            >
              <Sparkles size={14} color="#BFDBFE" />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 950,
                  color: "#DBEAFE",
                  letterSpacing: 0.5,
                }}
              >
                Test gratuito · domanda {stepIndex + 1} di {steps.length}
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 27,
                lineHeight: 1.12,
                letterSpacing: -0.8,
              }}
            >
              {currentStep.domanda}
            </h1>

            {currentStep.sottotitolo && (
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.70)",
                }}
              >
                {currentStep.sottotitolo}
              </p>
            )}

            <div
              style={{
                marginTop: 16,
                height: 9,
                borderRadius: 999,
                background: "rgba(255,255,255,0.10)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  borderRadius: 999,
                  background:
                    "linear-gradient(90deg, #1F6FB2 0%, #3AA0FF 50%, #A78BFA 100%)",
                }}
              />
            </div>
          </section>

          <section style={{ display: "grid", gap: 11 }}>
            {currentStep.opzioni.map((opzione) => {
              const selected = data[currentStep.id] === opzione;

              return (
                <button
                  key={opzione}
                  type="button"
                  onClick={() => handleAnswer(opzione)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    borderRadius: 22,
                    border: selected
                      ? "1px solid rgba(96,165,250,0.58)"
                      : "1px solid rgba(255,255,255,0.10)",
                    background: selected
                      ? "linear-gradient(135deg, rgba(59,130,246,0.24), rgba(139,92,246,0.14))"
                      : "rgba(255,255,255,0.065)",
                    color: "#FFFFFF",
                    padding: 15,
                    cursor: "pointer",
                    boxShadow: selected
                      ? "0 18px 38px rgba(59,130,246,0.18)"
                      : "0 12px 28px rgba(0,0,0,0.18)",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      fontSize: 14,
                      lineHeight: 1.4,
                      fontWeight: 850,
                    }}
                  >
                    {opzione}
                    <ArrowRight size={17} color="#93C5FD" />
                  </span>
                </button>
              );
            })}
          </section>

          {stepIndex > 0 && (
            <button
              type="button"
              onClick={goBack}
              style={{
                marginTop: 16,
                width: "100%",
                ...secondaryButtonStyle,
              }}
            >
              Torna alla domanda precedente
            </button>
          )}
        </>
      )}

      {fase === "form" && (
        <section
          style={{
            ...glassCard,
            padding: 20,
            background:
              "linear-gradient(145deg, rgba(31,111,178,0.30), rgba(20,184,166,0.15), rgba(255,255,255,0.06))",
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 22,
              background: "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 18px 38px rgba(31,111,178,0.34)",
              marginBottom: 16,
            }}
          >
            <LockKeyhole size={28} />
          </div>

          <p
            style={{
              margin: "0 0 8px",
              fontSize: 12,
              color: "#BFDBFE",
              fontWeight: 950,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            Il tuo risultato è pronto
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: 29,
              lineHeight: 1.08,
              letterSpacing: -0.9,
            }}
          >
            Salva il risultato e visualizza il profilo completo
          </h1>

          <p
            style={{
              margin: "12px 0 0",
              fontSize: 13,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            Inserisci i tuoi dati per vedere il risultato completo, conservarlo
            nel profilo Laurea Smart e generare il Piano Universitario
            Personalizzato.
          </p>

          <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
            <InputField
              label="Nome"
              value={lead.nome}
              onChange={(value) =>
                setLead((prev) => ({ ...prev, nome: value }))
              }
            />
            <InputField
              label="Cognome"
              value={lead.cognome}
              onChange={(value) =>
                setLead((prev) => ({ ...prev, cognome: value }))
              }
            />
            <InputField
              label="Email"
              type="email"
              value={lead.email}
              onChange={(value) =>
                setLead((prev) => ({ ...prev, email: value }))
              }
            />
            <InputField
              label="Telefono"
              type="tel"
              value={lead.telefono}
              onChange={(value) =>
                setLead((prev) => ({ ...prev, telefono: value }))
              }
            />

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: 13,
                borderRadius: 18,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={lead.privacy}
                onChange={(event) =>
                  setLead((prev) => ({
                    ...prev,
                    privacy: event.target.checked,
                  }))
                }
                style={{ marginTop: 3 }}
              />
              <span
                style={{
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,0.68)",
                }}
              >
                Accetto l’informativa privacy e autorizzo il trattamento dei
                dati per ricevere il risultato del test e informazioni di
                orientamento universitario.
              </span>
            </label>

            {errore && (
              <p
                style={{
                  margin: 0,
                  color: "#FCA5A5",
                  fontSize: 12,
                  fontWeight: 850,
                }}
              >
                {errore}
              </p>
            )}

            <button
              type="button"
              onClick={submitLead}
              disabled={loading}
              style={{
                ...primaryButtonStyle,
                width: "100%",
                opacity: loading ? 0.72 : 1,
              }}
            >
              {loading ? <Loader2 size={18} /> : <CheckCircle2 size={18} />}
              {loading ? "Salvataggio..." : "Vedi il mio risultato"}
            </button>

            <button
              type="button"
              onClick={goBack}
              style={{
                ...secondaryButtonStyle,
                width: "100%",
              }}
            >
              Modifica risposte
            </button>
          </div>
        </section>
      )}

      {fase === "risultato" && (
        <section
          style={{
            display: "grid",
            gap: 14,
          }}
        >
          <div
            style={{
              ...glassCard,
              padding: 20,
              background:
                "linear-gradient(145deg, rgba(31,111,178,0.32), rgba(139,92,246,0.18), rgba(255,255,255,0.06))",
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 22,
                background: "linear-gradient(135deg, #1F6FB2 0%, #8B5CF6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <ClipboardCheck size={28} />
            </div>

            <p
              style={{
                margin: "0 0 8px",
                fontSize: 12,
                color: "#BFDBFE",
                fontWeight: 950,
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              Risultato orientativo
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: 29,
                lineHeight: 1.08,
                letterSpacing: -0.9,
              }}
            >
              {risultato.titolo}
            </h1>

            <p
              style={{
                margin: "12px 0 0",
                fontSize: 14,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.74)",
              }}
            >
              {risultato.descrizione}
            </p>
          </div>

          <ResultCard
            icon={<GraduationCap size={20} />}
            title="Percorso da valutare"
            text={risultato.percorso}
          />

          <ResultCard
            icon={<Target size={20} />}
            title="Aspetto da approfondire"
            text={
              data.aspetto_da_valutare ||
              "Costi, tempi, modalità di studio, CFU ed eventuali agevolazioni."
            }
          />

          <ResultCard
            icon={<ShieldCheck size={20} />}
            title="Prossimo passo"
            text="Puoi ora generare il tuo Piano Universitario Personalizzato oppure entrare nell’app per salvare il profilo e continuare l’orientamento."
          />

          <div style={{ display: "grid", gap: 10 }}>
            <Link href="/dashboard/piano-personale" style={primaryButtonStyle}>
              Genera Piano Universitario
              <ArrowRight size={18} />
            </Link>

            <Link href="/register" style={secondaryButtonStyle}>
              Scarica / accedi all’app
              <UserRound size={17} />
            </Link>

            <Link href="/dashboard/contatti" style={secondaryButtonStyle}>
              Parla gratis con un orientatore
              <MessageCircle size={17} />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.64)",
          fontWeight: 850,
        }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: "100%",
          minHeight: 50,
          borderRadius: 17,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.08)",
          color: "#FFFFFF",
          outline: "none",
          padding: "0 14px",
          fontSize: 14,
          fontFamily: "inherit",
          boxSizing: "border-box",
        }}
      />
    </label>
  );
}

function ResultCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <section
      style={{
        ...glassCard,
        padding: 16,
        borderRadius: 24,
      }}
    >
      <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
        <div
          style={{
            width: 42,
            minWidth: 42,
            height: 42,
            borderRadius: 16,
            background: "rgba(59,130,246,0.13)",
            border: "1px solid rgba(96,165,250,0.22)",
            color: "#BFDBFE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 15 }}>{title}</h2>
          <p
            style={{
              margin: "7px 0 0",
              fontSize: 13,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.70)",
            }}
          >
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}
