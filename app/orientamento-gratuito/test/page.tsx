"use client";

import type { CSSProperties, ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  Loader2,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
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
  budget_mensile?: string;
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

type StepItem = {
  id: keyof OrientamentoData;
  domanda: string;
  sottotitolo: string;
  opzioni: string[];
};

type Tone = "blue" | "purple" | "teal" | "amber" | "rose" | "cyan";

const tones: Record<
  Tone,
  {
    accent: string;
    icon: string;
    bg: string;
    softBg: string;
    border: string;
    glow: string;
  }
> = {
  blue: {
    accent: "#60A5FA",
    icon: "#BFDBFE",
    bg: "linear-gradient(135deg, rgba(59,130,246,0.24), rgba(12,25,42,0.96))",
    softBg: "rgba(59,130,246,0.13)",
    border: "rgba(96,165,250,0.28)",
    glow: "rgba(59,130,246,0.22)",
  },
  purple: {
    accent: "#A78BFA",
    icon: "#DDD6FE",
    bg: "linear-gradient(135deg, rgba(139,92,246,0.26), rgba(12,25,42,0.96))",
    softBg: "rgba(139,92,246,0.13)",
    border: "rgba(167,139,250,0.30)",
    glow: "rgba(139,92,246,0.22)",
  },
  teal: {
    accent: "#2DD4BF",
    icon: "#99F6E4",
    bg: "linear-gradient(135deg, rgba(20,184,166,0.24), rgba(12,25,42,0.96))",
    softBg: "rgba(20,184,166,0.13)",
    border: "rgba(45,212,191,0.28)",
    glow: "rgba(20,184,166,0.22)",
  },
  amber: {
    accent: "#FBBF24",
    icon: "#FDE68A",
    bg: "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(12,25,42,0.96))",
    softBg: "rgba(245,158,11,0.13)",
    border: "rgba(251,191,36,0.28)",
    glow: "rgba(245,158,11,0.20)",
  },
  rose: {
    accent: "#FB7185",
    icon: "#FECDD3",
    bg: "linear-gradient(135deg, rgba(244,63,94,0.22), rgba(12,25,42,0.96))",
    softBg: "rgba(244,63,94,0.12)",
    border: "rgba(251,113,133,0.26)",
    glow: "rgba(244,63,94,0.18)",
  },
  cyan: {
    accent: "#22D3EE",
    icon: "#A5F3FC",
    bg: "linear-gradient(135deg, rgba(6,182,212,0.22), rgba(12,25,42,0.96))",
    softBg: "rgba(6,182,212,0.12)",
    border: "rgba(34,211,238,0.24)",
    glow: "rgba(6,182,212,0.18)",
  },
};

const steps: StepItem[] = [
  {
    id: "stato_iscrizione",
    domanda: "Sei già iscritto a un corso di laurea?",
    sottotitolo:
      "Ci aiuta a capire se stai iniziando da zero, se vuoi riprendere un percorso o se stai valutando un trasferimento.",
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
    sottotitolo:
      "Serve solo per rendere il risultato più aderente alla tua situazione personale e professionale.",
    opzioni: [
      "18-24",
      "25-34",
      "35-44",
      "45-54",
      "55+",
      "Preferisco non indicarlo",
    ],
  },
  {
    id: "situazione",
    domanda: "Cosa fai oggi?",
    sottotitolo:
      "La sostenibilità del percorso cambia molto se lavori, studi o devi conciliare più impegni.",
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
    sottotitolo:
      "Il titolo di partenza è fondamentale per capire quali percorsi puoi valutare e con quali requisiti di accesso.",
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
    sottotitolo:
      "Questa risposta orienta il test verso lavoro, concorsi, crescita personale o completamento del profilo.",
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
    id: "motivazione_studio",
    domanda:
      "Qual è il motivo principale per cui vuoi iniziare o completare un percorso universitario?",
    sottotitolo:
      "Non esiste una risposta giusta: serve a capire quale tipo di supporto e quale percorso possono essere più coerenti.",
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
    domanda: "Entro quanto tempo vorresti iniziare un Corso?",
    sottotitolo:
      "La tempistica aiuta a distinguere chi vuole partire subito da chi sta ancora esplorando le alternative.",
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
    sottotitolo:
      "Meglio un percorso sostenibile che una scelta teoricamente perfetta ma difficile da mantenere.",
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
    sottotitolo:
      "Scegli l’area che senti più vicina. Se hai dubbi, puoi indicare che non sai ancora.",
    opzioni: [
      "Economia e management",
      "Marketing e comunicazione digitale",
      "Psicologia",
      "Scienze dell’educazione",
      "Pedagogia e formazione",
      "Giurisprudenza / servizi giuridici",
      "Criminologia e sicurezza",
      "Scienze politiche e relazioni internazionali",
      "Sociologia e servizi sociali",
      "Scienze motorie",
      "Sport e benessere",
      "Comunicazione",
      "Lettere, arte e spettacolo",
      "Lingue e mediazione linguistica",
      "Turismo, cultura e territorio",
      "Informatica / tecnologia",
      "Data, AI e innovazione digitale",
      "Ingegneria industriale",
      "Ingegneria civile e ambientale",
      "Architettura, design e moda",
      "Biologia e nutrizione",
      "Sanità e professioni sanitarie",
      "Agraria, alimentazione e gastronomia",
      "Scuola e insegnamento",
      "Pubblica amministrazione e concorsi",
      "Non so ancora",
    ],
  },
  {
    id: "aspetto_da_valutare",
    domanda:
      "C’è qualche aspetto che sarebbe utile valutare prima dell’iscrizione?",
    sottotitolo:
      "Puoi indicare un elemento da approfondire. Se riguarda una situazione personale, verrà gestito con discrezione.",
    opzioni: [
      "Esami universitari già sostenuti",
      "Esperienze lavorative o certificazioni",
      "Possibili agevolazioni o convenzioni",
      "Esigenze di supporto allo studio, DSA, BES o disabilità",
      "Non saprei",
      "Preferisco parlarne con un orientatore",
    ],
  },
  {
    id: "budget_mensile",
    domanda: "Qual è il budget mensile massimo che vorresti non superare?",
    sottotitolo:
      "Indica un riferimento mensile tutto compreso: serve solo per orientare la valutazione, senza finanziarie e senza interessi. L’importo effettivo dipende sempre da ateneo, percorso, convenzioni disponibili e valutazione personalizzata.",
    opzioni: [
      "100 - 200 € al mese",
      "200 - 300 € al mese",
      "Oltre 300 € al mese",
      "Preferisco parlare con un orientatore",
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
  boxSizing: "border-box",
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

function getStepTone(id: keyof OrientamentoData): Tone {
  if (id === "stato_iscrizione" || id === "titolo_studio") return "blue";
  if (id === "obiettivo" || id === "motivazione_studio") return "purple";
  if (id === "urgenza" || id === "tempo") return "teal";
  if (id === "aspetto_da_valutare") return "amber";
  if (id === "budget_mensile") return "cyan";
  if (id === "situazione") return "cyan";
  return "blue";
}

function getStepIcon(id: keyof OrientamentoData) {
  if (id === "stato_iscrizione") return <GraduationCap size={25} />;
  if (id === "eta") return <UserRound size={25} />;
  if (id === "situazione") return <BriefcaseBusiness size={25} />;
  if (id === "titolo_studio") return <ClipboardCheck size={25} />;
  if (id === "obiettivo") return <Target size={25} />;
  if (id === "motivazione_studio") return <HeartHandshake size={25} />;
  if (id === "urgenza") return <Timer size={25} />;
  if (id === "tempo") return <Timer size={25} />;
  if (id === "area") return <Sparkles size={25} />;
  if (id === "aspetto_da_valutare") return <HelpCircle size={25} />;
  if (id === "budget_mensile") return <ShieldCheck size={25} />;
  return <Sparkles size={25} />;
}

function getSegmenti(data: OrientamentoData): Segmenti {
  let segmento_studente = "NON_ISCRITTO";

  if (data.stato_iscrizione === "Sì, sono già iscritto")
    segmento_studente = "GIA_ISCRITTO";
  else if (data.stato_iscrizione === "Ho iniziato ma ho interrotto")
    segmento_studente = "UNIVERSITA_INTERROTTA";
  else if (data.stato_iscrizione === "Sto valutando un trasferimento")
    segmento_studente = "TRASFERIMENTO";

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
  else if (
    data.titolo_studio?.includes("AFAM") ||
    data.titolo_studio?.includes("conservatorio") ||
    data.titolo_studio?.includes("accademia")
  )
    segmento_ingresso = "AFAM";
  else if (
    data.titolo_studio === "Ho iniziato l’università ma non ho terminato"
  )
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

  if (area === "Economia e management") {
    return {
      tipo: "ECONOMIA",
      titolo: "Profilo economico-manageriale",
      descrizione:
        "Le tue risposte indicano un interesse verso organizzazione, gestione, amministrazione, impresa, marketing o crescita professionale.",
      percorso:
        "Potresti valutare percorsi in Economia, Management, Amministrazione, Marketing o ambiti affini.",
    };
  }

  if (area === "Economia e management") {
    return {
      tipo: "ECONOMIA",
      titolo: "Profilo economico-manageriale",
      descrizione:
        "Il tuo profilo sembra orientato verso gestione, organizzazione, amministrazione, impresa, marketing o crescita professionale.",
      percorso:
        "Potresti valutare percorsi in Economia, Management, Amministrazione, Marketing o ambiti aziendali affini.",
    };
  }

  if (area === "Marketing e comunicazione digitale") {
    return {
      tipo: "COMUNICAZIONE",
      titolo: "Profilo marketing e comunicazione digitale",
      descrizione:
        "Il tuo profilo sembra orientato verso comunicazione, contenuti digitali, social media, pubblicità, brand e strategie online.",
      percorso:
        "Potresti valutare percorsi in Comunicazione, Marketing digitale, Digital media o ambiti legati alla comunicazione d’impresa.",
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

  if (area === "Scienze dell’educazione") {
    return {
      tipo: "EDUCAZIONE",
      titolo: "Profilo educativo e formativo",
      descrizione:
        "Il tuo profilo sembra orientato verso educazione, formazione, servizi alla persona, infanzia, comunità e contesti sociali.",
      percorso:
        "Potresti valutare percorsi in Scienze dell’Educazione, formazione, pedagogia o servizi socio-educativi.",
    };
  }

  if (area === "Pedagogia e formazione") {
    return {
      tipo: "EDUCAZIONE",
      titolo: "Profilo pedagogico e formativo",
      descrizione:
        "Il tuo profilo sembra orientato verso apprendimento, crescita personale, progettazione educativa, formazione e supporto nei percorsi di sviluppo.",
      percorso:
        "Potresti valutare percorsi in Pedagogia, Scienze dell’Educazione, formazione degli adulti o progettazione educativa.",
    };
  }

  if (area === "Giurisprudenza / servizi giuridici") {
    return {
      tipo: "GIURIDICA",
      titolo: "Profilo giuridico-amministrativo",
      descrizione:
        "Il tuo profilo sembra orientato verso diritto, norme, amministrazione, servizi giuridici, tutela, istituzioni o concorsi.",
      percorso:
        "Potresti valutare percorsi in Giurisprudenza, Servizi giuridici, Scienze giuridiche o aree amministrative.",
    };
  }

  if (area === "Criminologia e sicurezza") {
    return {
      tipo: "GIURIDICA",
      titolo: "Profilo criminologico e sicurezza",
      descrizione:
        "Il tuo profilo sembra orientato verso sicurezza, criminologia, diritto, prevenzione, analisi dei fenomeni sociali e contesti investigativi.",
      percorso:
        "Potresti valutare percorsi in area giuridica, criminologica, sicurezza, investigazione o discipline socio-giuridiche.",
    };
  }

  if (area === "Scienze politiche e relazioni internazionali") {
    return {
      tipo: "GIURIDICA",
      titolo: "Profilo politico-istituzionale",
      descrizione:
        "Il tuo profilo sembra orientato verso istituzioni, pubblica amministrazione, politica, relazioni internazionali, società e organizzazioni.",
      percorso:
        "Potresti valutare percorsi in Scienze Politiche, Relazioni Internazionali, Pubblica Amministrazione o studi politico-sociali.",
    };
  }

  if (area === "Sociologia e servizi sociali") {
    return {
      tipo: "EDUCAZIONE",
      titolo: "Profilo sociale e comunitario",
      descrizione:
        "Il tuo profilo sembra orientato verso persone, comunità, inclusione, servizi sociali, disagio, territorio e progettazione sociale.",
      percorso:
        "Potresti valutare percorsi in Sociologia, Servizi Sociali, Scienze dell’Educazione o aree socio-comunitarie.",
    };
  }

  if (area === "Scienze motorie") {
    return {
      tipo: "SPORT",
      titolo: "Profilo sportivo e motorio",
      descrizione:
        "Il tuo profilo sembra orientato verso sport, movimento, benessere, preparazione fisica e promozione di stili di vita attivi.",
      percorso:
        "Potresti valutare percorsi in Scienze Motorie, sport, benessere o attività motorie.",
    };
  }

  if (area === "Sport e benessere") {
    return {
      tipo: "SPORT",
      titolo: "Profilo sport e benessere",
      descrizione:
        "Il tuo profilo sembra orientato verso fitness, benessere, movimento, salute preventiva, preparazione fisica e qualità della vita.",
      percorso:
        "Potresti valutare percorsi in Scienze Motorie, sport, benessere, wellness o attività fisica adattata.",
    };
  }

  if (area === "Comunicazione") {
    return {
      tipo: "COMUNICAZIONE",
      titolo: "Profilo comunicativo",
      descrizione:
        "Il tuo profilo sembra orientato verso linguaggi, media, relazioni, contenuti, comunicazione d’impresa e comunicazione digitale.",
      percorso:
        "Potresti valutare percorsi in Comunicazione, media digitali, marketing, contenuti o comunicazione aziendale.",
    };
  }

  if (area === "Lettere, arte e spettacolo") {
    return {
      tipo: "COMUNICAZIONE",
      titolo: "Profilo umanistico e culturale",
      descrizione:
        "Il tuo profilo sembra orientato verso cultura, scrittura, editoria, arte, spettacolo, contenuti e valorizzazione del patrimonio.",
      percorso:
        "Potresti valutare percorsi in Lettere, Arte, Spettacolo, discipline umanistiche o comunicazione culturale.",
    };
  }

  if (area === "Lingue e mediazione linguistica") {
    return {
      tipo: "COMUNICAZIONE",
      titolo: "Profilo linguistico e internazionale",
      descrizione:
        "Il tuo profilo sembra orientato verso lingue, comunicazione interculturale, mediazione, traduzione, turismo e contesti internazionali.",
      percorso:
        "Potresti valutare percorsi in Lingue, Mediazione linguistica, comunicazione interculturale o relazioni internazionali.",
    };
  }

  if (area === "Turismo, cultura e territorio") {
    return {
      tipo: "ECONOMIA",
      titolo: "Profilo turistico-culturale",
      descrizione:
        "Il tuo profilo sembra orientato verso turismo, ospitalità, promozione del territorio, beni culturali, eventi e gestione dei servizi.",
      percorso:
        "Potresti valutare percorsi in Turismo, Management del turismo, Beni culturali o valorizzazione territoriale.",
    };
  }

  if (area === "Informatica / tecnologia") {
    return {
      tipo: "TECNOLOGIA",
      titolo: "Profilo tecnologico e digitale",
      descrizione:
        "Il tuo profilo sembra orientato verso informatica, software, dati, sistemi digitali, innovazione e tecnologie applicate.",
      percorso:
        "Potresti valutare percorsi in Informatica, Ingegneria informatica, tecnologie digitali o sistemi informativi.",
    };
  }

  if (area === "Data, AI e innovazione digitale") {
    return {
      tipo: "TECNOLOGIA",
      titolo: "Profilo data, AI e innovazione",
      descrizione:
        "Il tuo profilo sembra orientato verso dati, intelligenza artificiale, automazione, innovazione digitale e trasformazione tecnologica.",
      percorso:
        "Potresti valutare percorsi in Informatica, Data Science, AI, innovazione digitale o tecnologie applicate al lavoro.",
    };
  }

  if (area === "Ingegneria industriale") {
    return {
      tipo: "TECNOLOGIA",
      titolo: "Profilo ingegneristico-industriale",
      descrizione:
        "Il tuo profilo sembra orientato verso industria, produzione, energia, processi tecnici, organizzazione e innovazione applicata.",
      percorso:
        "Potresti valutare percorsi in Ingegneria Industriale, Gestionale, Meccanica, Energetica o ambiti tecnico-produttivi.",
    };
  }

  if (area === "Ingegneria civile e ambientale") {
    return {
      tipo: "TECNOLOGIA",
      titolo: "Profilo civile e ambientale",
      descrizione:
        "Il tuo profilo sembra orientato verso costruzioni, territorio, ambiente, infrastrutture, sicurezza, progettazione e sostenibilità.",
      percorso:
        "Potresti valutare percorsi in Ingegneria Civile, Ambientale, Edile o ambiti collegati alla gestione del territorio.",
    };
  }

  if (area === "Architettura, design e moda") {
    return {
      tipo: "COMUNICAZIONE",
      titolo: "Profilo creativo e progettuale",
      descrizione:
        "Il tuo profilo sembra orientato verso creatività, estetica, progettazione, design, moda, spazi e comunicazione visiva.",
      percorso:
        "Potresti valutare percorsi in Design, Moda, Architettura, comunicazione visiva o discipline creative.",
    };
  }

  if (area === "Biologia e nutrizione") {
    return {
      tipo: "TECNOLOGIA",
      titolo: "Profilo scientifico e nutrizionale",
      descrizione:
        "Il tuo profilo sembra orientato verso biologia, alimentazione, nutrizione, salute, benessere, qualità e ambiente.",
      percorso:
        "Potresti valutare percorsi in Scienze Biologiche, Nutrizione, alimentazione, benessere o aree scientifiche collegate.",
    };
  }

  if (area === "Sanità e professioni sanitarie") {
    return {
      tipo: "PSICOLOGIA",
      titolo: "Profilo sanitario e servizi alla persona",
      descrizione:
        "Il tuo profilo sembra orientato verso salute, prevenzione, cura, benessere, organizzazione sanitaria e supporto alla persona.",
      percorso:
        "Potresti valutare percorsi in area sanitaria, servizi alla persona, management sanitario o discipline collegate al benessere.",
    };
  }

  if (area === "Agraria, alimentazione e gastronomia") {
    return {
      tipo: "ECONOMIA",
      titolo: "Profilo agroalimentare e gastronomico",
      descrizione:
        "Il tuo profilo sembra orientato verso alimentazione, filiere agroalimentari, sostenibilità, gastronomia, qualità e valorizzazione del territorio.",
      percorso:
        "Potresti valutare percorsi in Agraria, Gastronomia, Scienze dell’alimentazione, food management o valorizzazione agroalimentare.",
    };
  }

  if (area === "Scuola e insegnamento") {
    return {
      tipo: "SCUOLA",
      titolo: "Profilo scuola e insegnamento",
      descrizione:
        "Il tuo profilo sembra orientato verso scuola, insegnamento, graduatorie, concorsi, aggiornamento professionale e formazione.",
      percorso:
        "Potresti valutare percorsi utili per la scuola, l’insegnamento, le graduatorie o il rafforzamento del profilo formativo.",
    };
  }

  if (area === "Pubblica amministrazione e concorsi") {
    return {
      tipo: "GIURIDICA",
      titolo: "Profilo pubblica amministrazione e concorsi",
      descrizione:
        "Il tuo profilo sembra orientato verso concorsi pubblici, graduatorie, amministrazione, avanzamenti professionali e ruoli istituzionali.",
      percorso:
        "Potresti valutare percorsi in area giuridica, economica, politico-sociale o amministrativa, in base al bando o all’obiettivo.",
    };
  }

  if (area === "Non so ancora") {
    return {
      tipo: "GENERALE",
      titolo: "Profilo da orientare",
      descrizione:
        "Le tue risposte mostrano che potresti avere bisogno di confrontare più aree prima di scegliere.",
      percorso:
        "Il passo più utile è valutare con attenzione obiettivo, tempo disponibile, titolo di partenza e sostenibilità del percorso.",
    };
  }

  return {
    tipo: "GENERALE",
    titolo: "Profilo da orientare",
    descrizione:
      "Le tue risposte mostrano che potrebbe essere utile confrontare più aree prima di scegliere.",
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
  localStorage.setItem("eta", data.eta || "");
  localStorage.setItem("situazione", data.situazione || "");
  localStorage.setItem("titolo_studio", data.titolo_studio || "");
  localStorage.setItem("obiettivo", data.obiettivo || "");
  localStorage.setItem("motivazione_studio", data.motivazione_studio || "");
  localStorage.setItem("urgenza_obiettivo", data.urgenza || "");
  localStorage.setItem("tempo_disponibile", data.tempo || "");
  localStorage.setItem("area_interesse", data.area || "");
  localStorage.setItem("aspetto_da_valutare", data.aspetto_da_valutare || "");
  localStorage.setItem("budget_studi_mensile", data.budget_mensile || "");

  localStorage.setItem("profilo_utente", risultato.tipo);
  localStorage.setItem("corso_suggerito", risultato.percorso);

  localStorage.setItem("segmento_studente", segmenti.segmento_studente);
  localStorage.setItem("segmento_intento", segmenti.segmento_intento);
  localStorage.setItem("segmento_motivazione", segmenti.segmento_motivazione);
  localStorage.setItem("segmento_ingresso", segmenti.segmento_ingresso);
  localStorage.setItem("segmento_urgenza", segmenti.segmento_urgenza);
  localStorage.setItem("segmento_aspetto", segmenti.segmento_aspetto);
}

function InfoPill({ children, tone }: { children: ReactNode; tone: Tone }) {
  const theme = tones[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 11px",
        borderRadius: 999,
        background: theme.softBg,
        border: `1px solid ${theme.border}`,
        color: theme.icon,
        fontSize: 11,
        fontWeight: 950,
      }}
    >
      {children}
    </span>
  );
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

  const activeSteps = useMemo(
    () =>
      steps.filter(
        (step) =>
          step.id !== "budget_mensile" ||
          data.stato_iscrizione !== "Sì, sono già iscritto"
      ),
    [data.stato_iscrizione]
  );

  const currentStep =
    activeSteps[stepIndex] || activeSteps[activeSteps.length - 1];
  const progress = Math.round(((stepIndex + 1) / activeSteps.length) * 100);
  const stepTone = getStepTone(currentStep.id);
  const theme = tones[stepTone];

  const segmenti = useMemo(() => getSegmenti(data), [data]);
  const risultato = useMemo(() => getRisultato(data), [data]);

  function handleAnswer(value: string) {
    const nextData = {
      ...data,
      [currentStep.id]: value,
    };

    setData(nextData);

    if (stepIndex < activeSteps.length - 1) {
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
      setStepIndex(activeSteps.length - 1);
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
          <ArrowLeft size={16} />
          Torna all’introduzione
        </Link>
      </header>

      {fase === "test" && (
        <>
          <section
            style={{
              ...glassCard,
              padding: 18,
              marginBottom: 16,
              background: theme.bg,
              border: `1px solid ${theme.border}`,
              boxShadow: `0 24px 60px ${theme.glow}`,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.accent}, transparent)`,
              }}
            />

            <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
              <div
                style={{
                  width: 56,
                  minWidth: 56,
                  height: 56,
                  borderRadius: 21,
                  background: theme.softBg,
                  border: `1px solid ${theme.border}`,
                  color: theme.icon,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 14px 30px ${theme.glow}`,
                }}
              >
                {getStepIcon(currentStep.id)}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 7,
                    marginBottom: 10,
                  }}
                >
                  <InfoPill tone={stepTone}>
                    <Sparkles size={13} /> Domanda {stepIndex + 1} di{" "}
                    {activeSteps.length}
                  </InfoPill>
                  <InfoPill tone="blue">Test gratuito</InfoPill>
                </div>

                <h1
                  style={{
                    margin: 0,
                    fontSize: 26,
                    lineHeight: 1.12,
                    letterSpacing: -0.8,
                  }}
                >
                  {currentStep.domanda}
                </h1>

                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  {currentStep.sottotitolo}
                </p>
              </div>
            </div>

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
                  background: `linear-gradient(90deg, ${theme.accent}, #3AA0FF, #A78BFA)`,
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
                      ? `1px solid ${theme.border}`
                      : "1px solid rgba(255,255,255,0.10)",
                    background: selected ? theme.bg : "rgba(255,255,255,0.065)",
                    color: "#FFFFFF",
                    padding: 15,
                    cursor: "pointer",
                    boxShadow: selected
                      ? `0 18px 38px ${theme.glow}`
                      : "0 12px 28px rgba(0,0,0,0.18)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      background: theme.accent,
                      opacity: selected ? 1 : 0.55,
                    }}
                  />
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      fontSize: 14,
                      lineHeight: 1.4,
                      fontWeight: 850,
                      paddingLeft: 4,
                    }}
                  >
                    {opzione}
                    <ArrowRight size={17} color={theme.icon} />
                  </span>
                </button>
              );
            })}
          </section>

          {stepIndex > 0 && (
            <button
              type="button"
              onClick={goBack}
              style={{ marginTop: 16, width: "100%", ...secondaryButtonStyle }}
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
              style={{ ...secondaryButtonStyle, width: "100%" }}
            >
              Modifica risposte
            </button>
          </div>
        </section>
      )}

      {fase === "risultato" && (
        <section style={{ display: "grid", gap: 14 }}>
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
            tone="blue"
          />
          <ResultCard
            icon={<Target size={20} />}
            title="Aspetto da approfondire"
            text={
              data.aspetto_da_valutare ||
              "Costi, tempi, modalità di studio, CFU ed eventuali agevolazioni."
            }
            tone="amber"
          />
          <ResultCard
            icon={<ShieldCheck size={20} />}
            title="Prossimo passo"
            text="Puoi ora generare il tuo Piano Universitario Personalizzato oppure entrare nell’app per salvare il profilo e continuare l’orientamento."
            tone="teal"
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
  tone,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  tone: Tone;
}) {
  const theme = tones[tone];

  return (
    <section
      style={{
        ...glassCard,
        padding: 16,
        borderRadius: 24,
        border: `1px solid ${theme.border}`,
        background: theme.bg,
        boxShadow: `0 20px 42px ${theme.glow}`,
      }}
    >
      <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
        <div
          style={{
            width: 42,
            minWidth: 42,
            height: 42,
            borderRadius: 16,
            background: theme.softBg,
            border: `1px solid ${theme.border}`,
            color: theme.icon,
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
              color: "rgba(255,255,255,0.72)",
            }}
          >
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}
