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
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  UserRound,
} from "lucide-react";
import {
  calcolaRisultatoOrientamento,
  calcolaSegmentiOrientamento,
} from "@/lib/orientamento";
import type { PercorsoConsigliatoOrientamento } from "@/lib/orientamento";

const DOWNLOAD_FUNNEL_ENDPOINT =
  "https://laureasmart.it/api/track-download-funnel.php";

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
  percorso_prioritario: string;
  percorsi_compatibili: string[];
  approfondimento: string;
  prossimo_passo: string;
  cta_orientatore: string;
  percorsiConsigliati: PercorsoConsigliatoOrientamento[];
  modalitaPreferibile: "online" | "valutazione_orientatore";
  motivoModalitaOnline: string;
  testoRispostaFinale: string;
};

type StepItem = {
  id: keyof OrientamentoData;
  domanda: string;
  sottotitolo: string;
  opzioni: string[];
};

type Tone = "blue" | "purple" | "teal" | "amber" | "cyan";

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
  return calcolaSegmentiOrientamento(data);
}

function getPercorsiCompatibili(data: OrientamentoData): string[] {
  const titolo = data.titolo_studio || "";
  const area = data.area || "Area da valutare";

  if (titolo === "Diploma") {
    return [
      `Laurea triennale in area ${area}`,
      "Percorso universitario coerente con obiettivi e tempo disponibile",
      "Valutazione orientativa dei requisiti di accesso",
    ];
  }

  if (
    titolo === "Laurea triennale" ||
    titolo === "Diploma accademico di primo livello (AFAM)"
  ) {
    return [
      `Laurea magistrale coerente con ${area}`,
      "Master universitario di primo livello",
      "Percorso di specializzazione professionale",
    ];
  }

  if (
    titolo === "Laurea magistrale" ||
    titolo === "Laurea vecchio ordinamento" ||
    titolo === "Master universitario" ||
    titolo === "Diploma accademico di secondo livello (AFAM)" ||
    titolo === "Diploma conservatorio (vecchio ordinamento)" ||
    titolo === "Diploma accademia di belle arti"
  ) {
    return [
      "Master universitario di secondo livello",
      "Corso di perfezionamento",
      "Percorso executive o specialistico",
    ];
  }

  if (titolo === "Ho iniziato l’università ma non ho terminato") {
    return [
      "Valutazione degli esami già sostenuti",
      "Ripresa del percorso universitario",
      "Eventuale trasferimento o riconoscimento CFU",
    ];
  }

  return [
    "Percorso universitario da confrontare",
    "Valutazione del titolo di partenza",
    "Analisi degli obiettivi professionali",
  ];
}

function getApprofondimento(data: OrientamentoData): string {
  if (data.stato_iscrizione === "Sì, sono già iscritto") {
    return "Nel tuo caso è utile capire se vuoi proseguire nel percorso attuale, migliorare l’organizzazione dello studio, valutare un cambio corso o ricevere supporto personalizzato.";
  }

  if (data.stato_iscrizione === "Sto valutando un trasferimento") {
    return "Prima di scegliere è importante verificare eventuali esami riconoscibili, tempi di trasferimento, compatibilità del corso e sostenibilità del nuovo percorso.";
  }

  if (data.stato_iscrizione === "Ho iniziato ma ho interrotto") {
    return "Il punto principale è capire se puoi recuperare esami già sostenuti, riprendere da dove avevi interrotto o scegliere un percorso più sostenibile.";
  }

  if (data.aspetto_da_valutare === "Esami universitari già sostenuti") {
    return "L’aspetto più importante da verificare è il possibile riconoscimento degli esami già sostenuti e l’eventuale abbreviazione del percorso.";
  }

  if (data.aspetto_da_valutare === "Esperienze lavorative o certificazioni") {
    return "Conviene verificare se esperienze professionali, certificazioni o percorsi precedenti possono aiutarti a scegliere un percorso più coerente.";
  }

  if (data.aspetto_da_valutare === "Possibili agevolazioni o convenzioni") {
    return "Nel tuo caso è utile approfondire costi, agevolazioni, convenzioni disponibili e sostenibilità mensile del percorso.";
  }

  if (
    data.aspetto_da_valutare ===
    "Esigenze di supporto allo studio, DSA, BES o disabilità"
  ) {
    return "È consigliabile valutare con attenzione servizi di supporto, modalità di studio, accessibilità e strumenti disponibili per affrontare il percorso con maggiore serenità.";
  }

  if (data.tempo === "2-4 ore a settimana") {
    return "Hai indicato poco tempo disponibile: la scelta dovrebbe tenere conto non solo del corso, ma anche del carico di studio, dell’organizzazione e della sostenibilità nel tempo.";
  }

  if (
    data.obiettivo === "Partecipare a concorsi" ||
    data.motivazione_studio ===
      "Mi serve una laurea per concorsi, graduatorie o avanzamenti"
  ) {
    return "Per i concorsi è importante non scegliere solo per area di interesse: bisogna verificare classe di laurea, requisiti del bando e titolo effettivamente richiesto.";
  }

  if (data.obiettivo === "Insegnare") {
    return "Per l’insegnamento è fondamentale verificare il titolo di accesso, la classe di concorso, gli eventuali CFU richiesti e il percorso più coerente con il tuo obiettivo.";
  }

  return "Prima di scegliere è utile verificare requisiti di accesso, obiettivi professionali, tempi di studio, costi, eventuali CFU riconoscibili e modalità più adatta alla tua situazione.";
}

function getProssimoPasso(data: OrientamentoData): string {
  if (data.stato_iscrizione === "Sì, sono già iscritto") {
    return "Puoi entrare nella dashboard e usare gli strumenti disponibili per organizzare meglio il percorso attuale.";
  }

  if (data.stato_iscrizione === "Sto valutando un trasferimento") {
    return "Puoi entrare nella dashboard e valutare con attenzione percorso svolto, possibili CFU riconoscibili e alternative disponibili.";
  }

  if (data.stato_iscrizione === "Ho iniziato ma ho interrotto") {
    return "Puoi entrare nella dashboard e costruire un piano di ripartenza realistico, partendo da ciò che hai già fatto.";
  }

  if (data.area === "Non so ancora") {
    return "Puoi entrare nella dashboard e confrontare più possibilità prima di scegliere il percorso definitivo.";
  }

  return "Puoi entrare nella dashboard e continuare con gli strumenti di orientamento, confronto e organizzazione del percorso.";
}

function getCtaOrientatore(data: OrientamentoData): string {
  if (data.stato_iscrizione === "Sto valutando un trasferimento") {
    return "Valuta trasferimento e CFU";
  }

  if (data.stato_iscrizione === "Ho iniziato ma ho interrotto") {
    return "Verifica recupero esami";
  }

  if (data.aspetto_da_valutare === "Esami universitari già sostenuti") {
    return "Richiedi valutazione CFU";
  }

  return "Continua nella dashboard";
}

function getRisultato(data: OrientamentoData): Risultato {
  const risultatoCentrale = calcolaRisultatoOrientamento(data);

  const percorsiCompatibili =
    risultatoCentrale.percorsiConsigliati.length > 0
      ? risultatoCentrale.percorsiConsigliati.map(
          (percorso) => `${percorso.classe} ${percorso.nome}`
        )
      : getPercorsiCompatibili(data);

  const percorsoPrioritario =
    percorsiCompatibili[0] ||
    risultatoCentrale.corsoSuggerito ||
    "Percorso universitario da valutare";

  return {
    tipo: risultatoCentrale.tipo,
    titolo: "Il tuo risultato orientativo",
    descrizione: risultatoCentrale.descrizione,
    percorso: risultatoCentrale.testoRispostaFinale,
    percorso_prioritario: percorsoPrioritario,
    percorsi_compatibili: percorsiCompatibili,
    approfondimento: getApprofondimento(data),
    prossimo_passo: getProssimoPasso(data),
    cta_orientatore: getCtaOrientatore(data),
    percorsiConsigliati: risultatoCentrale.percorsiConsigliati,
    modalitaPreferibile: risultatoCentrale.modalitaPreferibile,
    motivoModalitaOnline: risultatoCentrale.motivoModalitaOnline,
    testoRispostaFinale: risultatoCentrale.testoRispostaFinale,
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
  localStorage.setItem("percorso_prioritario", risultato.percorso_prioritario);
  localStorage.setItem(
    "percorsi_compatibili",
    JSON.stringify(risultato.percorsi_compatibili)
  );
  localStorage.setItem(
    "approfondimento_orientamento",
    risultato.approfondimento
  );
  localStorage.setItem("prossimo_passo_orientamento", risultato.prossimo_passo);
  localStorage.setItem("cta_orientatore", risultato.cta_orientatore);
  localStorage.setItem(
    "percorsi_consigliati_orientamento",
    JSON.stringify(risultato.percorsiConsigliati)
  );
  localStorage.setItem("modalita_preferibile", risultato.modalitaPreferibile);
  localStorage.setItem(
    "motivo_modalita_online",
    risultato.motivoModalitaOnline
  );
  localStorage.setItem(
    "testo_risposta_finale_orientamento",
    risultato.testoRispostaFinale
  );

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

function getStoredDownloadClickId() {
  if (typeof window === "undefined") return "";

  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("ls_click_id");

    if (fromUrl) {
      localStorage.setItem("ls_download_click_id", fromUrl);
      return fromUrl;
    }

    return localStorage.getItem("ls_download_click_id") || "";
  } catch {
    return "";
  }
}

async function trackDownloadFunnelEvent(payload: {
  event_name: "test_started" | "test_result_viewed";
}) {
  if (typeof window === "undefined") return;

  const clickId = getStoredDownloadClickId();

  if (!clickId) return;

  try {
    await fetch(DOWNLOAD_FUNNEL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      body: JSON.stringify({
        click_id: clickId,
        event_name: payload.event_name,
        source_page: window.location.href,
      }),
    });
  } catch (error) {
    console.warn("Tracking funnel download non riuscito", error);
  }
}

export default function OrientamentoGratuitoTestPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<OrientamentoData>({});
  const [fase, setFase] = useState<"test" | "risultato">("test");
  const [testStartedTracked, setTestStartedTracked] = useState(false);

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

  const risultato = useMemo(() => getRisultato(data), [data]);

  function goToResult(finalData: OrientamentoData) {
    const finalSegmenti = getSegmenti(finalData);
    const finalRisultato = getRisultato(finalData);

    saveToLocalStorage(finalData, finalSegmenti, finalRisultato);

    try {
      localStorage.setItem(
        "gps_user",
        JSON.stringify({
          nome: "Utente",
          cognome: "Laurea Smart",
          email: "",
          telefono: "",
        })
      );
      if (!localStorage.getItem("registered_at")) {
        localStorage.setItem("registered_at", new Date().toISOString());
      }

      localStorage.setItem("onboarding_lead_salvato", "NO");
      localStorage.setItem("onboarding_lead_data", new Date().toISOString());
    } catch {
      // evita blocchi se localStorage non è disponibile
    }

    void trackDownloadFunnelEvent({
      event_name: "test_result_viewed",
    });

    setFase("risultato");
  }

  function handleAnswer(value: string) {
    if (!testStartedTracked) {
      setTestStartedTracked(true);
      void trackDownloadFunnelEvent({
        event_name: "test_started",
      });
    }

    const nextData = {
      ...data,
      [currentStep.id]: value,
    };

    setData(nextData);

    if (stepIndex < activeSteps.length - 1) {
      setStepIndex((index) => index + 1);
      return;
    }

    goToResult(nextData);
  }

  function goBack() {
    if (stepIndex > 0) {
      setStepIndex((index) => index - 1);
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

      {fase === "risultato" && (
        <section style={{ display: "grid", gap: 14 }}>
          <div
            style={{
              ...glassCard,
              padding: 20,
              background:
                "linear-gradient(145deg, rgba(31,111,178,0.32), rgba(20,184,166,0.18), rgba(255,255,255,0.06))",
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: 23,
                background: "linear-gradient(135deg, #16A34A 0%, #1F6FB2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                boxShadow: "0 18px 38px rgba(22,163,74,0.26)",
              }}
            >
              <CheckCircle2 size={30} />
            </div>

            <p
              style={{
                margin: "0 0 8px",
                fontSize: 12,
                color: "#BBF7D0",
                fontWeight: 950,
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              Risultato disponibile
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
                color: "rgba(255,255,255,0.76)",
              }}
            >
              {risultato.descrizione}
            </p>
          </div>

          <section
            style={{
              ...glassCard,
              padding: 16,
              borderRadius: 24,
              border: `1px solid ${tones.blue.border}`,
              background: tones.blue.bg,
              boxShadow: `0 20px 42px ${tones.blue.glow}`,
            }}
          >
            <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 42,
                  minWidth: 42,
                  height: 42,
                  borderRadius: 16,
                  background: tones.blue.softBg,
                  border: `1px solid ${tones.blue.border}`,
                  color: tones.blue.icon,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ClipboardCheck size={20} />
              </div>

              <div>
                <h2 style={{ margin: 0, fontSize: 15 }}>
                  Percorso prioritario da valutare
                </h2>

                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.78)",
                    fontWeight: 850,
                  }}
                >
                  {risultato.percorso_prioritario}
                </p>
              </div>
            </div>
          </section>

          {risultato.percorsi_compatibili.length > 1 && (
            <section
              style={{
                ...glassCard,
                padding: 16,
                borderRadius: 24,
                border: `1px solid ${tones.teal.border}`,
                background: tones.teal.bg,
                boxShadow: `0 20px 42px ${tones.teal.glow}`,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 15 }}>
                Altri percorsi compatibili
              </h2>

              <ul
                style={{
                  margin: "9px 0 0",
                  paddingLeft: 18,
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                {risultato.percorsi_compatibili.slice(1, 4).map((percorso) => (
                  <li key={percorso}>{percorso}</li>
                ))}
              </ul>
            </section>
          )}

          <section
            style={{
              ...glassCard,
              padding: 16,
              borderRadius: 24,
              border: `1px solid ${tones.purple.border}`,
              background: tones.purple.bg,
              boxShadow: `0 20px 42px ${tones.purple.glow}`,
            }}
          >
            <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 42,
                  minWidth: 42,
                  height: 42,
                  borderRadius: 16,
                  background: tones.purple.softBg,
                  border: `1px solid ${tones.purple.border}`,
                  color: tones.purple.icon,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Target size={20} />
              </div>

              <div>
                <h2 style={{ margin: 0, fontSize: 15 }}>
                  Prossimo passo consigliato
                </h2>

                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  {risultato.prossimo_passo}
                </p>
              </div>
            </div>
          </section>

          <section
            style={{
              ...glassCard,
              padding: 16,
              borderRadius: 24,
              border: `1px solid ${tones.amber.border}`,
              background: tones.amber.bg,
              boxShadow: `0 20px 42px ${tones.amber.glow}`,
            }}
          >
            <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 42,
                  minWidth: 42,
                  height: 42,
                  borderRadius: 16,
                  background: tones.amber.softBg,
                  border: `1px solid ${tones.amber.border}`,
                  color: tones.amber.icon,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldCheck size={20} />
              </div>

              <div>
                <h2 style={{ margin: 0, fontSize: 15 }}>Nota importante</h2>

                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  Il risultato ha valore orientativo. Requisiti di accesso,
                  costi, agevolazioni, CFU riconoscibili e condizioni di
                  iscrizione devono sempre essere verificati con l’ateneo o con
                  un orientatore.
                </p>
              </div>
            </div>
          </section>

          <Link href="/dashboard" style={primaryButtonStyle}>
            Vai alla dashboard
            <ArrowRight size={17} />
          </Link>
        </section>
      )}
    </main>
  );
}
