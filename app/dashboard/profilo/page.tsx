"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileText,
  CheckCircle2,
  GraduationCap,
  Heart,
  MessageCircle,
  Target,
  TrendingUp,
  User,
} from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import ProfileAccordionCard from "@/components/ProfileAccordionCard";
import ProfileSummaryCard from "@/components/ProfileSummaryCard";
import ProfileActionCard from "@/components/ProfileActionCard";
import {
  TIPI_CLASSI_LAUREA,
  getAreaClasseLabel,
  getClasseLaureaByCodice,
  getClasseLaureaLabel,
  getClassiByTipo,
  getTipoClasseLabel,
  type AreaClasseLaurea,
  type TipoClasseLaurea,
} from "@/lib/data/classiLaurea";
import {
  ateneiItaliani,
  getAteneoByNome,
  getAteneoCategoriaLabel,
  type CategoriaAteneo,
  type ModalitaAteneo,
} from "@/lib/data/atenei";

type GpsUser = {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
};

type EsameSmart = {
  id: string;
  nome: string;
  cfu: number;
  stato: "da_preparare" | "in_corso" | "completato";
  difficolta: "bassa" | "media" | "alta";
};

type BudgetMensileValue =
  | ""
  | "100_200"
  | "200_300"
  | "oltre_300"
  | "parla_orientatore";

type PagamentoStudi = {
  id: string;
  nome: string;
  importo: string;
  scadenza: string;
  stato: "da_pagare" | "pagato";
  dataPagamento: string;
  note: string;
};

const ANNI_CORSO = [
  { value: "", label: "Seleziona anno" },
  { value: "1", label: "1° anno" },
  { value: "2", label: "2° anno" },
  { value: "3", label: "3° anno" },
  { value: "4", label: "4° anno" },
  { value: "5", label: "5° anno" },
  { value: "fuori_corso", label: "Fuori corso" },
];

const OBIETTIVI_POST_LAUREA = [
  { value: "", label: "Seleziona obiettivo" },
  { value: "magistrale", label: "Proseguire con una magistrale" },
  { value: "master", label: "Fare un master" },
  { value: "concorsi", label: "Partecipare a concorsi" },
  { value: "cambio_lavoro", label: "Cambiare lavoro" },
  { value: "crescita_attuale", label: "Migliorare la posizione attuale" },
  { value: "non_so", label: "Non lo so ancora" },
];

const BUDGET_MENSILE_OPTIONS: { value: BudgetMensileValue; label: string }[] = [
  { value: "", label: "Seleziona budget mensile" },
  { value: "100_200", label: "100 - 200 € al mese" },
  { value: "200_300", label: "200 - 300 € al mese" },
  { value: "oltre_300", label: "Oltre 300 € al mese" },
  {
    value: "parla_orientatore",
    label: "Preferisco parlare con un orientatore",
  },
];

const BUDGET_STUDI_TIPI_PERCORSO = [
  { value: "", label: "Seleziona percorso" },
  { value: "laurea_triennale", label: "Laurea triennale" },
  { value: "laurea_magistrale", label: "Laurea magistrale" },
  { value: "master", label: "Master" },
  { value: "certificazioni", label: "Certificazioni o corsi" },
  { value: "non_so", label: "Non lo so, voglio orientarmi" },
];

const BUDGET_STUDI_OBIETTIVI = [
  { value: "", label: "Seleziona preferenza" },
  { value: "mensile_leggero", label: "Budget mensile più leggero possibile" },
  { value: "equilibrio", label: "Equilibrio tra costo mensile e tempi" },
  { value: "inizio_rapido", label: "Vorrei iniziare il prima possibile" },
  { value: "valutazione", label: "Preferisco una valutazione personalizzata" },
];

const BUDGET_RESPONSE_COPY: Record<Exclude<BudgetMensileValue, "">, string> = {
  "100_200":
    "Il budget indicato è un punto di partenza utile per una valutazione personalizzata. Alcune soluzioni potrebbero richiedere un importo mensile superiore, ma possiamo comunque verificare quali percorsi si avvicinano meglio alle tue esigenze, tutto compreso, senza finanziarie e senza interessi.",
  "200_300":
    "Il budget mensile indicato permette di avviare una valutazione concreta delle soluzioni disponibili. Un orientatore può aiutarti a capire quale percorso risulta più coerente con le tue esigenze, considerando ateneo, corso, eventuali convenzioni e modalità di pagamento tutto compreso.",
  oltre_300:
    "Il budget mensile indicato è un buon punto di partenza per valutare diverse soluzioni universitarie. Possiamo aiutarti a capire quale percorso può essere più adatto, con una formula sostenibile, tutto compreso, senza finanziarie e senza interessi.",
  parla_orientatore:
    "Perfetto: un orientatore può aiutarti a valutare le soluzioni più adatte senza partire da un importo rigido, chiarendo budget mensile, percorso, eventuali convenzioni e modalità di pagamento previste dall’ateneo.",
};

function getSegmentoFromStato(stato: string) {
  if (stato === "Sì, sono già iscritto" || stato === "si_iscritto") {
    return "GIA_ISCRITTO";
  }

  if (
    stato === "Ho iniziato ma ho interrotto" ||
    stato === "universita_interrotta"
  ) {
    return "UNIVERSITA_INTERROTTA";
  }

  if (stato === "Sto valutando un trasferimento" || stato === "trasferimento") {
    return "TRASFERIMENTO";
  }

  return "NON_ISCRITTO";
}

function getLabel(options: { value: string; label: string }[], value: string) {
  return (
    options.find((option) => option.value === value)?.label || "Da completare"
  );
}

function getAreaLabel(value: string) {
  if (!value) return "Area ancora da indicare";
  return getAreaClasseLabel(value as AreaClasseLaurea);
}

function getTipoLabel(value: string) {
  if (!value) return "Tipo percorso da indicare";
  return getTipoClasseLabel(value as TipoClasseLaurea);
}

export default function ProfiloPage() {
  const router = useRouter();

  const [user, setUser] = useState<GpsUser | null>(null);
  const [esami, setEsami] = useState<EsameSmart[]>([]);
  const [cfuTotali, setCfuTotali] = useState(180);
  const [oreSettimanali, setOreSettimanali] = useState("6");
  const [obiettivo, setObiettivo] = useState("Percorso universitario");
  const [profilo, setProfilo] = useState("Da definire");
  const [statoIscrizione, setStatoIscrizione] = useState("Non indicato");
  const [segmentoStudente, setSegmentoStudente] = useState("NON_ISCRITTO");
  const [ateneoAttuale, setAteneoAttuale] = useState("");
  const [categoriaAteneoAttuale, setCategoriaAteneoAttuale] = useState<
    CategoriaAteneo | ""
  >("");
  const [modalitaAteneoAttuale, setModalitaAteneoAttuale] = useState<
    ModalitaAteneo | ""
  >("");
  const [preferitiCount, setPreferitiCount] = useState(0);

  const [budgetMensile, setBudgetMensile] = useState<BudgetMensileValue>("");
  const [budgetTipoPercorso, setBudgetTipoPercorso] = useState("");
  const [budgetPreferenza, setBudgetPreferenza] = useState("");
  const [budgetSaved, setBudgetSaved] = useState(false);

  const [pagamentiStudi, setPagamentiStudi] = useState<PagamentoStudi[]>([]);
  const [pagamentoNome, setPagamentoNome] = useState("");
  const [pagamentoImporto, setPagamentoImporto] = useState("");
  const [pagamentoScadenza, setPagamentoScadenza] = useState("");
  const [pagamentoDataPagamento, setPagamentoDataPagamento] = useState("");
  const [pagamentoNote, setPagamentoNote] = useState("");

  const [classeLaureaAttuale, setClasseLaureaAttuale] = useState("");
  const [corsoAttuale, setCorsoAttuale] = useState("");
  const [areaCorsoAttuale, setAreaCorsoAttuale] = useState("");
  const [tipoCorsoAttuale, setTipoCorsoAttuale] = useState("");
  const [annoCorsoAttuale, setAnnoCorsoAttuale] = useState("");
  const [cfuConseguitiProfilo, setCfuConseguitiProfilo] = useState("");
  const [esamiMancantiProfilo, setEsamiMancantiProfilo] = useState("");
  const [obiettivoPostLaurea, setObiettivoPostLaurea] = useState("");
  const [profiloUniversitarioSaving, setProfiloUniversitarioSaving] =
    useState(false);
  const [profiloUniversitarioSaved, setProfiloUniversitarioSaved] =
    useState(false);
  const [profiloUniversitarioError, setProfiloUniversitarioError] =
    useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("gps_user");
    const storedEsami = localStorage.getItem("percorso_smart_esami");
    const storedCfuTotali = localStorage.getItem("percorso_smart_cfu_totali");
    const storedOre = localStorage.getItem("percorso_smart_ore_settimanali");
    const storedObiettivo = localStorage.getItem("obiettivo");
    const storedProfilo = localStorage.getItem("profilo_utente");
    const storedStatoIscrizione = localStorage.getItem("stato_iscrizione");
    const storedSegmentoStudente = localStorage.getItem("segmento_studente");
    const storedPreferiti =
      localStorage.getItem("percorsi_preferiti") ||
      localStorage.getItem("preferiti") ||
      "[]";

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setEsami(storedEsami ? JSON.parse(storedEsami) : []);
    setCfuTotali(storedCfuTotali ? Number(storedCfuTotali) : 180);
    setOreSettimanali(storedOre || "6");
    setObiettivo(storedObiettivo || "Percorso universitario");
    setProfilo(storedProfilo || "Da definire");
    setStatoIscrizione(storedStatoIscrizione || "Non indicato");

    setSegmentoStudente(
      storedSegmentoStudente ||
        (storedStatoIscrizione
          ? getSegmentoFromStato(storedStatoIscrizione)
          : "NON_ISCRITTO")
    );

    setAteneoAttuale(localStorage.getItem("ateneo_attuale") || "");
    setCategoriaAteneoAttuale(
      (localStorage.getItem("categoria_ateneo_attuale") as CategoriaAteneo) ||
        ""
    );
    setModalitaAteneoAttuale(
      (localStorage.getItem("modalita_ateneo_attuale") as ModalitaAteneo) || ""
    );
    setClasseLaureaAttuale(localStorage.getItem("classe_laurea_attuale") || "");
    setCorsoAttuale(localStorage.getItem("corso_attuale_dettaglio") || "");
    setAreaCorsoAttuale(localStorage.getItem("area_corso_attuale") || "");
    setTipoCorsoAttuale(localStorage.getItem("tipo_corso_attuale") || "");
    setAnnoCorsoAttuale(localStorage.getItem("anno_corso_attuale") || "");
    setCfuConseguitiProfilo(localStorage.getItem("cfu_conseguiti") || "");
    setEsamiMancantiProfilo(localStorage.getItem("esami_mancanti") || "");
    setObiettivoPostLaurea(localStorage.getItem("obiettivo_post_laurea") || "");
    setBudgetMensile(
      (localStorage.getItem("budget_studi_mensile") as BudgetMensileValue) || ""
    );
    setBudgetTipoPercorso(
      localStorage.getItem("budget_studi_tipo_percorso") || ""
    );
    setBudgetPreferenza(localStorage.getItem("budget_studi_preferenza") || "");

    try {
      const parsedPagamenti = JSON.parse(
        localStorage.getItem("budget_studi_pagamenti") || "[]"
      );
      setPagamentiStudi(Array.isArray(parsedPagamenti) ? parsedPagamenti : []);
    } catch {
      setPagamentiStudi([]);
    }

    try {
      const parsed = JSON.parse(storedPreferiti);
      setPreferitiCount(Array.isArray(parsed) ? parsed.length : 0);
    } catch {
      setPreferitiCount(0);
    }
  }, []);

  const cfuDaEsami = useMemo(
    () =>
      esami
        .filter((esame) => esame.stato === "completato")
        .reduce((totale, esame) => totale + esame.cfu, 0),
    [esami]
  );

  const cfuProfiloNumero = Number(cfuConseguitiProfilo) || 0;
  const cfuCompletati = cfuDaEsami > 0 ? cfuDaEsami : cfuProfiloNumero;

  const esamiCompletati = esami.filter(
    (esame) => esame.stato === "completato"
  ).length;

  const percentuale = Math.min(
    100,
    Math.round((cfuCompletati / cfuTotali) * 100)
  );

  const prossimoEsame =
    esami.find((esame) => esame.stato === "in_corso") ||
    esami.find((esame) => esame.stato === "da_preparare");

  const oreNumero = Number(oreSettimanali) || 0;

  const cfuMancanti = Math.max(0, cfuTotali - cfuCompletati);

  const cfuMensiliStimati =
    oreNumero <= 0
      ? 0
      : oreNumero <= 3
      ? 4
      : oreNumero <= 7
      ? 8
      : oreNumero <= 12
      ? 12
      : 16;

  const mesiStimatiLaurea =
    cfuMensiliStimati > 0
      ? Math.max(1, Math.ceil(cfuMancanti / cfuMensiliStimati))
      : null;

  const dataStimataLaurea = mesiStimatiLaurea
    ? new Date(new Date().setMonth(new Date().getMonth() + mesiStimatiLaurea))
    : null;

  const dataStimataLabel = dataStimataLaurea
    ? dataStimataLaurea.toLocaleDateString("it-IT", {
        month: "long",
        year: "numeric",
      })
    : "Da calcolare";

  const nome = user?.nome?.trim() || "Studente";

  const isGiaIscritto = segmentoStudente === "GIA_ISCRITTO";
  const isTrasferimento = segmentoStudente === "TRASFERIMENTO";
  const isUniversitaInterrotta = segmentoStudente === "UNIVERSITA_INTERROTTA";
  const showProfiloUniversitario =
    isGiaIscritto || isTrasferimento || isUniversitaInterrotta;

  const budgetMensileLabel = getLabel(BUDGET_MENSILE_OPTIONS, budgetMensile);
  const budgetResponse = budgetMensile
    ? BUDGET_RESPONSE_COPY[budgetMensile as Exclude<BudgetMensileValue, "">]
    : "Seleziona il budget mensile che vorresti non superare per ricevere un primo orientamento, tutto compreso, senza finanziarie e senza interessi.";

  const totalePagato = pagamentiStudi
    .filter((pagamento) => pagamento.stato === "pagato")
    .reduce(
      (totale, pagamento) => totale + (Number(pagamento.importo) || 0),
      0
    );

  const totaleDaPagare = pagamentiStudi
    .filter((pagamento) => pagamento.stato === "da_pagare")
    .reduce(
      (totale, pagamento) => totale + (Number(pagamento.importo) || 0),
      0
    );

  const oggiIso = new Date().toISOString().slice(0, 10);

  const pagamentiInRitardo = pagamentiStudi.filter(
    (pagamento) =>
      pagamento.stato === "da_pagare" &&
      pagamento.scadenza &&
      pagamento.scadenza < oggiIso
  ).length;

  const prossimaScadenza = pagamentiStudi
    .filter(
      (pagamento) =>
        pagamento.stato === "da_pagare" &&
        pagamento.scadenza &&
        pagamento.scadenza >= oggiIso
    )
    .sort((a, b) => a.scadenza.localeCompare(b.scadenza))[0];

  const salvaBudgetStudiNonIscritto = () => {
    localStorage.setItem("budget_studi_mensile", budgetMensile);
    localStorage.setItem("budget_studi_tipo_percorso", budgetTipoPercorso);
    localStorage.setItem("budget_studi_preferenza", budgetPreferenza);

    window.dispatchEvent(
      new CustomEvent("budget_studi_saved", {
        detail: {
          budget_mensile: budgetMensile,
          tipo_percorso: budgetTipoPercorso,
          preferenza: budgetPreferenza,
        },
      })
    );

    setBudgetSaved(true);
  };

  const salvaPagamentiStudi = (nuoviPagamenti: PagamentoStudi[]) => {
    setPagamentiStudi(nuoviPagamenti);
    localStorage.setItem(
      "budget_studi_pagamenti",
      JSON.stringify(nuoviPagamenti)
    );
  };

  const aggiungiPagamentoStudi = () => {
    if (!pagamentoNome.trim() || !pagamentoScadenza) return;

    const nuovoPagamento: PagamentoStudi = {
      id: `${Date.now()}`,
      nome: pagamentoNome.trim(),
      importo: pagamentoImporto,
      scadenza: pagamentoScadenza,
      stato: pagamentoDataPagamento ? "pagato" : "da_pagare",
      dataPagamento: pagamentoDataPagamento,
      note: pagamentoNote.trim(),
    };

    salvaPagamentiStudi([nuovoPagamento, ...pagamentiStudi]);
    setPagamentoNome("");
    setPagamentoImporto("");
    setPagamentoScadenza("");
    setPagamentoDataPagamento("");
    setPagamentoNote("");
  };

  const aggiornaStatoPagamento = (
    id: string,
    stato: PagamentoStudi["stato"]
  ) => {
    const nuoviPagamenti = pagamentiStudi.map((pagamento) =>
      pagamento.id === id
        ? {
            ...pagamento,
            stato,
            dataPagamento:
              stato === "pagato"
                ? pagamento.dataPagamento || oggiIso
                : pagamento.dataPagamento,
          }
        : pagamento
    );

    salvaPagamentiStudi(nuoviPagamenti);
  };

  const rimuoviPagamentoStudi = (id: string) => {
    salvaPagamentiStudi(
      pagamentiStudi.filter((pagamento) => pagamento.id !== id)
    );
  };

  const formatEuro = (value: number) =>
    value.toLocaleString("it-IT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    });

  const classiDisponibili = tipoCorsoAttuale
    ? getClassiByTipo(tipoCorsoAttuale as TipoClasseLaurea)
    : [];

  const classeSelezionata = classeLaureaAttuale
    ? getClasseLaureaByCodice(classeLaureaAttuale)
    : null;

  const classeLaureaLabel = classeSelezionata
    ? getClasseLaureaLabel(classeSelezionata)
    : "Classe di laurea ancora da indicare";

  const aggiornaStatoIscrizione = (nuovoStato: string) => {
    const nuovoSegmento = getSegmentoFromStato(nuovoStato);

    setStatoIscrizione(nuovoStato);
    setSegmentoStudente(nuovoSegmento);

    localStorage.setItem("stato_iscrizione", nuovoStato);
    localStorage.setItem("segmento_studente", nuovoSegmento);

    const orientamentoData = localStorage.getItem("orientamento_data");

    if (orientamentoData) {
      try {
        const parsed = JSON.parse(orientamentoData);
        localStorage.setItem(
          "orientamento_data",
          JSON.stringify({
            ...parsed,
            stato_iscrizione: nuovoStato,
            segmento_studente: nuovoSegmento,
          })
        );
      } catch {
        console.log("Impossibile aggiornare orientamento_data");
      }
    }
  };

  const aggiornaAteneoAttuale = (nomeAteneo: string) => {
    setAteneoAttuale(nomeAteneo);

    const ateneo = getAteneoByNome(nomeAteneo);

    if (ateneo) {
      setCategoriaAteneoAttuale(ateneo.categoria);
      setModalitaAteneoAttuale(ateneo.modalita);
    } else if (nomeAteneo.trim()) {
      setCategoriaAteneoAttuale("altro");
      setModalitaAteneoAttuale("non_applicabile");
    } else {
      setCategoriaAteneoAttuale("");
      setModalitaAteneoAttuale("");
    }
  };

  const aggiornaTipoCorsoAttuale = (nuovoTipo: string) => {
    setTipoCorsoAttuale(nuovoTipo);
    setClasseLaureaAttuale("");
    setAreaCorsoAttuale("");
  };

  const aggiornaClasseLaureaAttuale = (codice: string) => {
    setClasseLaureaAttuale(codice);

    const classe = getClasseLaureaByCodice(codice);

    if (!classe) return;

    setTipoCorsoAttuale(classe.tipo);
    setAreaCorsoAttuale(classe.area);
    setCfuTotali(classe.cfuDefault);
  };

  const getCfuTotaliDaTipoCorso = (tipoCorso: string) => {
    if (tipoCorso === "laurea_magistrale") return 120;
    if (tipoCorso === "laurea_ciclo_unico") return 300;
    if (tipoCorso === "master") return 60;

    return 180;
  };

  const salvaProfiloUniversitario = async () => {
    setProfiloUniversitarioSaving(true);
    setProfiloUniversitarioSaved(false);
    setProfiloUniversitarioError("");

    try {
      const ateneoRilevato = getAteneoByNome(ateneoAttuale);
      const categoriaAteneo =
        ateneoRilevato?.categoria || categoriaAteneoAttuale || "altro";
      const modalitaAteneo =
        ateneoRilevato?.modalita || modalitaAteneoAttuale || "non_applicabile";
      const cfuDefault =
        classeSelezionata?.cfuDefault ||
        getCfuTotaliDaTipoCorso(tipoCorsoAttuale);
      const corsoAttualeDettaglio = corsoAttuale.trim();
      const corsoAttualePulito = classeSelezionata
        ? `${getClasseLaureaLabel(classeSelezionata)}${
            corsoAttualeDettaglio ? ` · ${corsoAttualeDettaglio}` : ""
          }`
        : corsoAttualeDettaglio;

      localStorage.setItem("ateneo_attuale", ateneoAttuale);
      localStorage.setItem("categoria_ateneo_attuale", categoriaAteneo);
      localStorage.setItem("modalita_ateneo_attuale", modalitaAteneo);
      localStorage.setItem("classe_laurea_attuale", classeLaureaAttuale);
      localStorage.setItem("corso_attuale", corsoAttualePulito);
      localStorage.setItem("corso_attuale_dettaglio", corsoAttualeDettaglio);
      localStorage.setItem("area_corso_attuale", areaCorsoAttuale);
      localStorage.setItem("tipo_corso_attuale", tipoCorsoAttuale);
      localStorage.setItem("anno_corso_attuale", annoCorsoAttuale);
      localStorage.setItem("cfu_conseguiti", cfuConseguitiProfilo);
      localStorage.setItem("cfu_totali", String(cfuDefault));
      localStorage.setItem("percorso_smart_cfu_totali", String(cfuDefault));
      localStorage.setItem("esami_mancanti", esamiMancantiProfilo);
      localStorage.setItem("obiettivo_post_laurea", obiettivoPostLaurea);

      setCfuTotali(cfuDefault);

      if (!user?.email) {
        throw new Error("Email utente mancante");
      }

      const response = await fetch(
        "https://laureasmart.it/api/profilo-universitario-salva.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_email: user.email,
            ateneo_attuale: ateneoAttuale,
            categoria_ateneo_attuale: categoriaAteneo,
            modalita_ateneo_attuale: modalitaAteneo,
            classe_laurea_attuale: classeLaureaAttuale,
            corso_attuale: corsoAttualePulito,
            area_corso_attuale: areaCorsoAttuale,
            tipo_corso_attuale: tipoCorsoAttuale,
            anno_corso_attuale: annoCorsoAttuale,
            cfu_conseguiti: cfuConseguitiProfilo,
            cfu_totali: cfuDefault,
            esami_mancanti: esamiMancantiProfilo,
            obiettivo_post_laurea: obiettivoPostLaurea,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Salvataggio non riuscito");
      }

      setProfiloUniversitarioSaved(true);

      window.dispatchEvent(
        new CustomEvent("profilo_universitario_saved", {
          detail: {
            ateneo_attuale: ateneoAttuale,
            categoria_ateneo_attuale: categoriaAteneo,
            modalita_ateneo_attuale: modalitaAteneo,
            classe_laurea_attuale: classeLaureaAttuale,
            corso_attuale: corsoAttualePulito,
            area_corso_attuale: areaCorsoAttuale,
            tipo_corso_attuale: tipoCorsoAttuale,
            anno_corso_attuale: annoCorsoAttuale,
            cfu_conseguiti: cfuConseguitiProfilo,
            cfu_totali: cfuDefault,
            esami_mancanti: esamiMancantiProfilo,
            obiettivo_post_laurea: obiettivoPostLaurea,
          },
        })
      );
    } catch (error) {
      console.error("Errore salvataggio profilo universitario:", error);

      setProfiloUniversitarioError(
        error instanceof Error ? error.message : "Errore durante il salvataggio"
      );
    } finally {
      setProfiloUniversitarioSaving(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "22px 18px 120px",
        maxWidth: 500,
        margin: "0 auto",
        color: "#FFFFFF",
        background:
          "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
      }}
    >
      <section style={heroStyle}>
        <div style={heroIconStyle}>
          <User size={30} />
        </div>

        <p style={eyebrowStyle}>Profilo personale</p>

        <h1 style={heroTitleStyle}>Ciao {nome} 👋</h1>

        <p style={heroTextStyle}>
          Da qui puoi seguire il tuo percorso, controllare i progressi e
          continuare a costruire la strada verso la laurea.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <MetricCard
          icon={<TrendingUp size={22} />}
          title={`${percentuale}%`}
          description="Avanzamento"
        />

        <MetricCard
          icon={<BookOpen size={22} />}
          title={`${cfuCompletati}/${cfuTotali}`}
          description="CFU"
        />

        <MetricCard
          icon={<CheckCircle2 size={22} />}
          title={`${esamiCompletati}/${esami.length}`}
          description="Esami"
        />

        <MetricCard
          icon={<Heart size={22} />}
          title={`${preferitiCount}`}
          description="Preferiti"
        />
      </section>

      {showProfiloUniversitario && (
        <>
          <ProfileSummaryCard
            tone="green"
            corsoAttuale={
              classeLaureaAttuale
                ? classeLaureaLabel
                : corsoAttuale || "Percorso universitario da completare"
            }
            ateneoAttuale={ateneoAttuale}
            categoriaAteneo={
              categoriaAteneoAttuale
                ? getAteneoCategoriaLabel(categoriaAteneoAttuale)
                : ""
            }
            modalitaStudio={
              modalitaAteneoAttuale === "online"
                ? "ONLINE"
                : modalitaAteneoAttuale === "presenza"
                ? "PRESENZA"
                : ""
            }
            cfuConseguiti={cfuCompletati}
            cfuTotali={cfuTotali}
            esamiMancanti={esamiMancantiProfilo}
            traguardoStimato={dataStimataLabel}
          />

          <div style={{ height: 14 }} />

          <ProfileAccordionCard
            tone="blue"
            title="Dati universitari"
            badge={isTrasferimento ? "Trasferimento" : "Percorso"}
            subtitle={
              classeLaureaAttuale || ateneoAttuale || cfuConseguitiProfilo
                ? "Apri questa scheda solo quando vuoi aggiornare ateneo, corso, CFU o obiettivo."
                : "Completa questi dati per rendere Percorso Smart più utile."
            }
            icon={<GraduationCap size={19} />}
            defaultOpen={
              !classeLaureaAttuale && !ateneoAttuale && !cfuConseguitiProfilo
            }
          >
            <p style={mutedTextStyle}>
              Completa questi dati per rendere Percorso Smart più utile. Puoi
              indicare anche l’ateneo attuale o precedente: ci aiuta a capire
              meglio il tuo punto di partenza e a valutare eventuali passaggi.
            </p>

            <div style={formGridStyle}>
              <FieldLabel label="Ateneo attuale o precedente">
                <select
                  value={ateneoAttuale}
                  onChange={(event) =>
                    aggiornaAteneoAttuale(event.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="">Seleziona ateneo</option>
                  {ateneiItaliani.map((ateneo) => (
                    <option key={ateneo.id} value={ateneo.nome}>
                      {ateneo.nome}
                    </option>
                  ))}
                </select>
              </FieldLabel>

              <FieldLabel label="Categoria ateneo rilevata">
                <input
                  type="text"
                  value={
                    categoriaAteneoAttuale
                      ? getAteneoCategoriaLabel(categoriaAteneoAttuale)
                      : ""
                  }
                  readOnly
                  placeholder="Si compila dopo la scelta dell’ateneo"
                  style={{ ...inputStyle, opacity: 0.82 }}
                />
              </FieldLabel>

              <FieldLabel label="Tipo di percorso">
                <select
                  value={tipoCorsoAttuale}
                  onChange={(event) =>
                    aggiornaTipoCorsoAttuale(event.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="">Seleziona tipo percorso</option>
                  {TIPI_CLASSI_LAUREA.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldLabel>

              <FieldLabel label="Classe di laurea">
                <select
                  value={classeLaureaAttuale}
                  onChange={(event) =>
                    aggiornaClasseLaureaAttuale(event.target.value)
                  }
                  style={inputStyle}
                  disabled={!tipoCorsoAttuale || tipoCorsoAttuale === "altro"}
                >
                  <option value="">
                    {tipoCorsoAttuale && tipoCorsoAttuale !== "altro"
                      ? "Seleziona classe di laurea"
                      : "Seleziona prima il tipo di percorso"}
                  </option>
                  {classiDisponibili.map((classe) => (
                    <option key={classe.codice} value={classe.codice}>
                      {getClasseLaureaLabel(classe)}
                    </option>
                  ))}
                </select>
              </FieldLabel>

              <FieldLabel label="Area rilevata automaticamente">
                <input
                  type="text"
                  value={areaCorsoAttuale ? getAreaLabel(areaCorsoAttuale) : ""}
                  readOnly
                  placeholder="Si compila dopo la scelta della classe"
                  style={{ ...inputStyle, opacity: 0.82 }}
                />
              </FieldLabel>

              <FieldLabel label="Anno di corso">
                <select
                  value={annoCorsoAttuale}
                  onChange={(event) => setAnnoCorsoAttuale(event.target.value)}
                  style={inputStyle}
                >
                  {ANNI_CORSO.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldLabel>

              <FieldLabel label="CFU già conseguiti">
                <input
                  type="number"
                  min="0"
                  max={String(
                    classeSelezionata?.cfuDefault || cfuTotali || 300
                  )}
                  inputMode="numeric"
                  value={cfuConseguitiProfilo}
                  onChange={(event) =>
                    setCfuConseguitiProfilo(event.target.value)
                  }
                  placeholder="Esempio: 72"
                  style={inputStyle}
                />
              </FieldLabel>

              <FieldLabel label="Esami mancanti">
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={esamiMancantiProfilo}
                  onChange={(event) =>
                    setEsamiMancantiProfilo(event.target.value)
                  }
                  placeholder="Esempio: 8"
                  style={inputStyle}
                />
              </FieldLabel>

              <FieldLabel label="Obiettivo dopo la laurea">
                <select
                  value={obiettivoPostLaurea}
                  onChange={(event) =>
                    setObiettivoPostLaurea(event.target.value)
                  }
                  style={inputStyle}
                >
                  {OBIETTIVI_POST_LAUREA.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldLabel>

              <FieldLabel label="Nome corso o curriculum, facoltativo">
                <input
                  type="text"
                  value={corsoAttuale}
                  onChange={(event) => setCorsoAttuale(event.target.value)}
                  placeholder="Esempio: curriculum, indirizzo o nome usato dall’ateneo"
                  style={inputStyle}
                />
              </FieldLabel>
            </div>

            <div style={summaryBoxStyle}>
              <p style={smallLabelStyle}>Profilo rilevato</p>
              <h3 style={{ ...metricTitleStyle, marginTop: 6 }}>
                {classeLaureaAttuale
                  ? classeLaureaLabel
                  : getAreaLabel(areaCorsoAttuale)}
              </h3>
              <p style={mutedTextStyle}>
                {tipoCorsoAttuale || ateneoAttuale
                  ? `${ateneoAttuale || "Ateneo da completare"} · ${
                      tipoCorsoAttuale
                        ? getTipoLabel(tipoCorsoAttuale)
                        : "Tipo percorso da completare"
                    } · ${getLabel(ANNI_CORSO, annoCorsoAttuale)} · ${
                      areaCorsoAttuale
                        ? getAreaLabel(areaCorsoAttuale)
                        : "Area da completare"
                    }`
                  : "Questi dati serviranno a personalizzare Percorso Smart e i prossimi step."}
              </p>
            </div>

            <button
              type="button"
              onClick={salvaProfiloUniversitario}
              disabled={profiloUniversitarioSaving}
              style={{
                ...primaryButtonStyle,
                opacity: profiloUniversitarioSaving ? 0.7 : 1,
                cursor: profiloUniversitarioSaving ? "not-allowed" : "pointer",
              }}
            >
              {profiloUniversitarioSaving
                ? "Salvataggio..."
                : profiloUniversitarioSaved
                ? "Percorso salvato"
                : "Salva percorso universitario"}
              <ArrowRight size={19} />
            </button>

            {profiloUniversitarioSaved && (
              <p
                style={{
                  margin: "10px 0 0",
                  color: "#86EFAC",
                  fontSize: 13,
                  fontWeight: 800,
                  lineHeight: 1.45,
                }}
              >
                Percorso universitario salvato correttamente.
              </p>
            )}

            {profiloUniversitarioError && (
              <p
                style={{
                  margin: "10px 0 0",
                  color: "#FCA5A5",
                  fontSize: 13,
                  fontWeight: 800,
                  lineHeight: 1.45,
                }}
              >
                {profiloUniversitarioError}
              </p>
            )}
          </ProfileAccordionCard>

          <div style={{ height: 14 }} />
        </>
      )}

      <DarkCard
        title="Percorso Smart"
        badge={showProfiloUniversitario ? "Attivo" : "Simulazione"}
      >
        <div style={progressTrackStyle}>
          <div
            style={{
              width: `${percentuale}%`,
              height: "100%",
              borderRadius: 999,
              background: "linear-gradient(90deg, #3AA0FF, #78C2FF)",
            }}
          />
        </div>

        <p style={mutedTextStyle}>
          {esami.length === 0
            ? showProfiloUniversitario
              ? "Inserisci esami e obiettivi per trasformare il profilo in un piano di studio concreto."
              : "Non hai ancora inserito esami. Puoi usare Percorso Smart come simulazione per capire tempi e impegno."
            : prossimoEsame
            ? `Prossimo esame: ${prossimoEsame.nome}`
            : "Hai completato tutti gli esami inseriti. Ottimo lavoro."}
        </p>

        <button
          type="button"
          onClick={() => router.push("/dashboard/percorso-smart")}
          style={primaryButtonStyle}
        >
          {showProfiloUniversitario
            ? "Apri Percorso Smart"
            : "Simula Percorso Smart"}
          <ArrowRight size={19} />
        </button>
      </DarkCard>

      <div style={{ height: 14 }} />

      <DarkCard
        title="Timeline laurea"
        badge={showProfiloUniversitario ? "Proiezione" : "Simulazione"}
      >
        <div style={timelineBoxStyle}>
          <div style={smallIconStyle}>
            <CalendarDays size={24} />
          </div>

          <p style={smallLabelStyle}>Possibile traguardo</p>

          <h2 style={bigValueStyle}>{dataStimataLabel}</h2>

          <p style={mutedTextStyle}>
            {mesiStimatiLaurea
              ? `Con il ritmo attuale potresti completare il percorso in circa ${mesiStimatiLaurea} mesi.`
              : showProfiloUniversitario
              ? "Aggiungi CFU conseguiti, ore di studio ed esami nel Percorso Smart per ottenere una stima."
              : "Aggiungi ore di studio ed esami nel Percorso Smart per ottenere una simulazione."}
          </p>
        </div>
      </DarkCard>

      <div style={{ height: 14 }} />

      <ProfileAccordionCard
        tone={showProfiloUniversitario ? "green" : "amber"}
        title="Budget Studi"
        badge={showProfiloUniversitario ? "Scadenze" : "Mensile"}
        subtitle={
          showProfiloUniversitario
            ? "Organizza versamenti, scadenze e pagamenti già effettuati."
            : "Indica il budget mensile che vorresti non superare, tutto compreso."
        }
        icon={<CalendarDays size={19} />}
        defaultOpen={false}
      >
        {showProfiloUniversitario ? (
          <>
            <InfoRow
              icon={<CalendarDays size={20} />}
              title="Promemoria pagamenti universitari"
              description="Segna rate, tasse, scadenze e versamenti già effettuati. I dati restano salvati sul dispositivo e ti aiutano a non perdere di vista le prossime date."
            />

            <div style={budgetStatsGridStyle}>
              <div style={budgetMiniStatStyle}>
                <p style={smallLabelStyle}>Prossima scadenza</p>
                <h3 style={budgetStatValueStyle}>
                  {prossimaScadenza
                    ? new Date(prossimaScadenza.scadenza).toLocaleDateString(
                        "it-IT"
                      )
                    : "Da inserire"}
                </h3>
              </div>

              <div style={budgetMiniStatStyle}>
                <p style={smallLabelStyle}>Da pagare</p>
                <h3 style={budgetStatValueStyle}>
                  {formatEuro(totaleDaPagare)}
                </h3>
              </div>

              <div style={budgetMiniStatStyle}>
                <p style={smallLabelStyle}>Già pagato</p>
                <h3 style={budgetStatValueStyle}>{formatEuro(totalePagato)}</h3>
              </div>

              <div style={budgetMiniStatStyle}>
                <p style={smallLabelStyle}>In ritardo</p>
                <h3 style={budgetStatValueStyle}>{pagamentiInRitardo}</h3>
              </div>
            </div>

            <div style={formGridStyle}>
              <FieldLabel label="Nome pagamento">
                <input
                  type="text"
                  value={pagamentoNome}
                  onChange={(event) => setPagamentoNome(event.target.value)}
                  placeholder="Esempio: prima rata, tassa regionale, segreteria"
                  style={inputStyle}
                />
              </FieldLabel>

              <FieldLabel label="Importo">
                <input
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={pagamentoImporto}
                  onChange={(event) => setPagamentoImporto(event.target.value)}
                  placeholder="Esempio: 450"
                  style={inputStyle}
                />
              </FieldLabel>

              <FieldLabel label="Scadenza">
                <input
                  type="date"
                  value={pagamentoScadenza}
                  onChange={(event) => setPagamentoScadenza(event.target.value)}
                  style={inputStyle}
                />
              </FieldLabel>

              <FieldLabel label="Data pagamento, se già pagato">
                <input
                  type="date"
                  value={pagamentoDataPagamento}
                  onChange={(event) =>
                    setPagamentoDataPagamento(event.target.value)
                  }
                  style={inputStyle}
                />
              </FieldLabel>

              <FieldLabel label="Note">
                <input
                  type="text"
                  value={pagamentoNote}
                  onChange={(event) => setPagamentoNote(event.target.value)}
                  placeholder="Esempio: pagato con bonifico, carta, bollettino"
                  style={inputStyle}
                />
              </FieldLabel>
            </div>

            <button
              type="button"
              onClick={aggiungiPagamentoStudi}
              disabled={!pagamentoNome.trim() || !pagamentoScadenza}
              style={{
                ...primaryButtonStyle,
                opacity: !pagamentoNome.trim() || !pagamentoScadenza ? 0.55 : 1,
                cursor:
                  !pagamentoNome.trim() || !pagamentoScadenza
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Aggiungi pagamento
              <ArrowRight size={19} />
            </button>

            <div style={paymentListStyle}>
              {pagamentiStudi.length === 0 ? (
                <p style={mutedTextStyle}>
                  Non hai ancora inserito pagamenti. Aggiungi la prossima
                  scadenza per iniziare a usare il promemoria.
                </p>
              ) : (
                pagamentiStudi.map((pagamento) => {
                  const isInRitardo =
                    pagamento.stato === "da_pagare" &&
                    pagamento.scadenza &&
                    pagamento.scadenza < oggiIso;

                  return (
                    <div key={pagamento.id} style={paymentItemStyle}>
                      <div>
                        <p style={paymentTitleStyle}>{pagamento.nome}</p>
                        <p style={mutedTextStyle}>
                          {pagamento.importo
                            ? `${formatEuro(Number(pagamento.importo) || 0)} · `
                            : ""}
                          scadenza{" "}
                          {new Date(pagamento.scadenza).toLocaleDateString(
                            "it-IT"
                          )}
                          {pagamento.dataPagamento
                            ? ` · pagato il ${new Date(
                                pagamento.dataPagamento
                              ).toLocaleDateString("it-IT")}`
                            : ""}
                        </p>
                        {pagamento.note && (
                          <p style={mutedTextStyle}>{pagamento.note}</p>
                        )}
                      </div>

                      <div style={paymentActionsStyle}>
                        <button
                          type="button"
                          onClick={() =>
                            aggiornaStatoPagamento(
                              pagamento.id,
                              pagamento.stato === "pagato"
                                ? "da_pagare"
                                : "pagato"
                            )
                          }
                          style={{
                            ...miniButtonStyle,
                            background:
                              pagamento.stato === "pagato"
                                ? "rgba(34,197,94,0.22)"
                                : isInRitardo
                                ? "rgba(248,113,113,0.22)"
                                : "rgba(251,191,36,0.18)",
                            borderColor:
                              pagamento.stato === "pagato"
                                ? "rgba(134,239,172,0.40)"
                                : isInRitardo
                                ? "rgba(252,165,165,0.42)"
                                : "rgba(253,230,138,0.34)",
                          }}
                        >
                          {pagamento.stato === "pagato"
                            ? "Pagato"
                            : isInRitardo
                            ? "In ritardo"
                            : "Da pagare"}
                        </button>

                        <button
                          type="button"
                          onClick={() => rimuoviPagamentoStudi(pagamento.id)}
                          style={miniButtonStyle}
                        >
                          Elimina
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <>
            <InfoRow
              icon={<Target size={20} />}
              title="Budget mensile tutto compreso"
              description="Indica il budget mensile massimo che vorresti non superare. L’obiettivo è orientare la valutazione verso soluzioni sostenibili, senza finanziarie e senza interessi."
            />

            <div style={formGridStyle}>
              <FieldLabel label="Qual è il budget mensile massimo che vorresti non superare?">
                <select
                  value={budgetMensile}
                  onChange={(event) => {
                    setBudgetMensile(event.target.value as BudgetMensileValue);
                    setBudgetSaved(false);
                  }}
                  style={inputStyle}
                >
                  {BUDGET_MENSILE_OPTIONS.map((option) => (
                    <option key={option.value || "vuoto"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldLabel>

              <FieldLabel label="Che percorso vuoi valutare?">
                <select
                  value={budgetTipoPercorso}
                  onChange={(event) => {
                    setBudgetTipoPercorso(event.target.value);
                    setBudgetSaved(false);
                  }}
                  style={inputStyle}
                >
                  {BUDGET_STUDI_TIPI_PERCORSO.map((option) => (
                    <option key={option.value || "vuoto"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldLabel>

              <FieldLabel label="Qual è la tua preferenza?">
                <select
                  value={budgetPreferenza}
                  onChange={(event) => {
                    setBudgetPreferenza(event.target.value);
                    setBudgetSaved(false);
                  }}
                  style={inputStyle}
                >
                  {BUDGET_STUDI_OBIETTIVI.map((option) => (
                    <option key={option.value || "vuoto"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldLabel>
            </div>

            <div style={budgetResultStyle}>
              <p style={smallLabelStyle}>Valutazione orientativa</p>
              <h3 style={{ ...metricTitleStyle, marginTop: 6 }}>
                {budgetMensile
                  ? `Budget selezionato: ${budgetMensileLabel}`
                  : "Seleziona un budget mensile"}
              </h3>
              <p style={mutedTextStyle}>{budgetResponse}</p>
              <p style={budgetDisclaimerStyle}>
                Il budget mensile serve solo come riferimento per la
                valutazione. L’importo effettivo può variare in base all’ateneo,
                al percorso scelto, alle convenzioni disponibili e alle modalità
                di pagamento previste.
              </p>
            </div>

            <button
              type="button"
              onClick={salvaBudgetStudiNonIscritto}
              disabled={!budgetMensile}
              style={{
                ...primaryButtonStyle,
                opacity: !budgetMensile ? 0.55 : 1,
                cursor: !budgetMensile ? "not-allowed" : "pointer",
              }}
            >
              {budgetSaved ? "Budget salvato" : "Salva Budget Studi"}
              <ArrowRight size={19} />
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/contatti")}
              style={secondaryButtonStyle}
            >
              Verifica il percorso più adatto al mio budget
              <ArrowRight size={18} />
            </button>
          </>
        )}
      </ProfileAccordionCard>

      <div style={{ height: 14 }} />

      <ProfileAccordionCard
        tone={isTrasferimento || isUniversitaInterrotta ? "amber" : "cyan"}
        title="Stato percorso"
        badge="Segmento"
        subtitle={statoIscrizione}
        icon={<GraduationCap size={19} />}
        defaultOpen={false}
      >
        <InfoRow
          icon={<GraduationCap size={20} />}
          title={statoIscrizione}
          description="Questa scelta serve a mostrarti le funzioni più adatte: Percorso Smart se sei già iscritto, orientamento e scelta corso se devi ancora iscriverti."
        />

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          {[
            "Sì, sono già iscritto",
            "No, non sono ancora iscritto",
            "Ho iniziato ma ho interrotto",
            "Sto valutando un trasferimento",
          ].map((opzione) => {
            const active = statoIscrizione === opzione;

            return (
              <button
                key={opzione}
                type="button"
                onClick={() => aggiornaStatoIscrizione(opzione)}
                style={{
                  width: "100%",
                  minHeight: 48,
                  borderRadius: 17,
                  border: active
                    ? "1px solid rgba(120,194,255,0.75)"
                    : "1px solid rgba(255,255,255,0.10)",
                  background: active
                    ? "rgba(58,160,255,0.20)"
                    : "rgba(255,255,255,0.06)",
                  color: "#FFFFFF",
                  padding: "12px 14px",
                  textAlign: "left",
                  fontSize: 14,
                  fontWeight: 850,
                  cursor: "pointer",
                }}
              >
                {opzione}
              </button>
            );
          })}
        </div>
      </ProfileAccordionCard>

      <div style={{ height: 14 }} />

      <ProfileAccordionCard
        tone="purple"
        title="Il tuo obiettivo"
        badge="Profilo"
        subtitle={`${obiettivo} · Profilo orientativo: ${profilo}`}
        icon={<Target size={19} />}
        defaultOpen={false}
      >
        <InfoRow
          icon={<Target size={20} />}
          title={obiettivo}
          description={`Profilo orientativo: ${profilo}`}
        />

        <button
          type="button"
          onClick={() => router.push("/dashboard/orientamento/test")}
          style={secondaryButtonStyle}
        >
          Aggiorna orientamento
          <ArrowRight size={18} />
        </button>
      </ProfileAccordionCard>

      <div style={{ height: 14 }} />

      <ProfileActionCard
        tone="purple"
        title="Piano Universitario Personalizzato"
        badge="Novità"
        icon={<FileText size={19} />}
        description={
          showProfiloUniversitario
            ? "Usa test, ateneo, corso, CFU e obiettivo per generare una prima analisi orientativa da far valutare a un orientatore."
            : "Usa il risultato del test per generare una prima analisi con obiettivo, area consigliata, sostenibilità e prossimi passi."
        }
        href="/dashboard/piano-personale"
        buttonText="Genera il piano"
        variant="primary"
      />

      <div style={{ height: 14 }} />

      <ProfileAccordionCard
        tone="green"
        title="Strumenti utili"
        badge="App"
        subtitle="Percorsi, prossimi step e funzioni da consultare quando servono."
        icon={<GraduationCap size={19} />}
        defaultOpen={false}
      >
        <InfoRow
          icon={<GraduationCap size={20} />}
          title={
            showProfiloUniversitario
              ? "Percorsi e prossimi step"
              : "Percorsi salvati"
          }
          description={
            showProfiloUniversitario
              ? "In base all’area del tuo percorso potremo mostrarti in seguito magistrali, master o alternative coerenti."
              : "Consulta i corsi che hai messo tra i preferiti e confrontali con il tuo obiettivo."
          }
        />

        <button
          type="button"
          onClick={() => router.push("/dashboard/percorsi")}
          style={secondaryButtonStyle}
        >
          {showProfiloUniversitario
            ? "Valuta prossimi step"
            : "Vai ai percorsi"}
          <ArrowRight size={18} />
        </button>
      </ProfileAccordionCard>

      <div style={{ height: 14 }} />

      <ProfileAccordionCard
        tone="purple"
        title="Biblioteca Smart"
        badge={
          isGiaIscritto || isTrasferimento
            ? "Materiali"
            : segmentoStudente === "UNIVERSITA_INTERROTTA"
            ? "Consulta"
            : "Preview"
        }
        subtitle="Appunti, schemi e materiali utili quando vuoi approfondire."
        icon={<BookOpen size={19} />}
        defaultOpen={false}
      >
        <InfoRow
          icon={<BookOpen size={20} />}
          title={
            isGiaIscritto || isTrasferimento
              ? "Appunti, schemi e riassunti della tua area"
              : segmentoStudente === "UNIVERSITA_INTERROTTA"
              ? "Consulta materiali utili per ripartire"
              : "Una funzione da usare quando inizierai"
          }
          description={
            isGiaIscritto || isTrasferimento
              ? "Trova materiali condivisi dagli studenti, salva quelli più utili e carica solo appunti o riassunti creati da te."
              : segmentoStudente === "UNIVERSITA_INTERROTTA"
              ? "Puoi consultare e salvare materiali condivisi dagli studenti. Il caricamento è riservato a chi è già iscritto o valuta un trasferimento."
              : "La Biblioteca Smart raccoglie appunti, schemi e riassunti condivisi dagli studenti. Te la mostriamo ora per ricordarti che potrà accompagnarti anche dopo la scelta del corso."
          }
        />

        <button
          type="button"
          onClick={() => router.push("/dashboard/biblioteca-smart")}
          style={secondaryButtonStyle}
        >
          {isGiaIscritto || isTrasferimento
            ? "Apri Biblioteca Smart"
            : segmentoStudente === "UNIVERSITA_INTERROTTA"
            ? "Consulta Biblioteca Smart"
            : "Scopri Biblioteca Smart"}
          <ArrowRight size={18} />
        </button>
      </ProfileAccordionCard>

      {!isGiaIscritto && (
        <>
          <div style={{ height: 14 }} />

          <DarkCard
            title={
              isTrasferimento
                ? "Vuoi valutare un trasferimento?"
                : "Hai bisogno di supporto?"
            }
            badge={isTrasferimento ? "CFU" : "Gratis"}
          >
            <InfoRow
              icon={<MessageCircle size={20} />}
              title={
                isTrasferimento
                  ? "Verifica esami e CFU"
                  : "Parla con un orientatore"
              }
              description={
                isTrasferimento
                  ? "Se stai valutando un cambio corso o ateneo, puoi chiedere una verifica del percorso e degli esami già sostenuti."
                  : "Se hai dubbi su scelta del corso, obiettivi o iscrizione, puoi chiedere supporto gratuito."
              }
            />

            <button
              type="button"
              onClick={() => router.push("/dashboard/contatti")}
              style={whatsappButtonStyle}
            >
              {isTrasferimento
                ? "Richiedi valutazione"
                : "Contatta un orientatore"}
              <ArrowRight size={18} />
            </button>
          </DarkCard>
        </>
      )}

      <BottomNav />
    </main>
  );
}

function MetricCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <section style={metricCardStyle}>
      <div style={metricIconStyle}>{icon}</div>
      <h3 style={metricTitleStyle}>{title}</h3>
      <p style={metricTextStyle}>{description}</p>
    </section>
  );
}

function DarkCard({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children?: ReactNode;
}) {
  return (
    <section style={darkCardStyle}>
      <div style={cardHeaderStyle}>
        <h2 style={cardTitleStyle}>{title}</h2>
        {badge && <span style={badgeStyle}>{badge}</span>}
      </div>
      {children}
    </section>
  );
}

function InfoRow({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
      <div style={smallIconStyle}>{icon}</div>

      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>{title}</h3>
        <p style={mutedTextStyle}>{description}</p>
      </div>
    </div>
  );
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label style={fieldLabelStyle}>
      <span>{label}</span>
      {children}
    </label>
  );
}

const heroStyle: React.CSSProperties = {
  padding: 24,
  borderRadius: 32,
  background: "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 45%, #7C3AED 100%)",
  boxShadow: "0 26px 70px rgba(58,160,255,0.28)",
  marginBottom: 18,
  border: "1px solid rgba(147,197,253,0.34)",
  position: "relative",
  overflow: "hidden",
};

const heroIconStyle: React.CSSProperties = {
  width: 58,
  height: 58,
  borderRadius: 22,
  background: "rgba(255,255,255,0.16)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 16,
};

const eyebrowStyle: React.CSSProperties = {
  margin: "0 0 8px",
  fontSize: 14,
  fontWeight: 850,
};

const heroTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 33,
  lineHeight: 1.06,
  fontWeight: 900,
  letterSpacing: "-0.8px",
};

const heroTextStyle: React.CSSProperties = {
  margin: "14px 0 0",
  fontSize: 15,
  lineHeight: 1.6,
  opacity: 0.94,
};

const darkCardStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 26,
  background:
    "linear-gradient(135deg, rgba(58,160,255,0.18) 0%, rgba(17,32,51,0.94) 72%)",
  border: "1px solid rgba(120,194,255,0.28)",
  boxShadow:
    "inset 5px 0 0 rgba(58,160,255,0.85), 0 18px 44px rgba(0,0,0,0.26), 0 0 0 1px rgba(58,160,255,0.10)",
  position: "relative",
  overflow: "hidden",
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 19,
  lineHeight: 1.2,
  fontWeight: 900,
};

const badgeStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(58,160,255,0.30)",
  border: "1px solid rgba(120,194,255,0.42)",
  color: "#BFDBFE",
  fontSize: 11,
  fontWeight: 950,
  whiteSpace: "nowrap",
};

const metricCardStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 22,
  background:
    "linear-gradient(135deg, rgba(31,111,178,0.28), rgba(17,32,51,0.92))",
  border: "1px solid rgba(120,194,255,0.26)",
  boxShadow:
    "inset 0 3px 0 rgba(58,160,255,0.72), 0 14px 34px rgba(0,0,0,0.24)",
};

const metricIconStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 16,
  background:
    "linear-gradient(135deg, rgba(58,160,255,0.36), rgba(31,111,178,0.16))",
  border: "1px solid rgba(120,194,255,0.30)",
  color: "#BFDBFE",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 10,
};

const metricTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 20,
  lineHeight: 1.1,
  fontWeight: 900,
};

const metricTextStyle: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: 12,
  lineHeight: 1.45,
  color: "rgba(255,255,255,0.62)",
};

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
  marginTop: 16,
};

const fieldLabelStyle: React.CSSProperties = {
  display: "grid",
  gap: 7,
  color: "rgba(255,255,255,0.78)",
  fontSize: 12,
  fontWeight: 900,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  borderRadius: 16,
  border: "1px solid rgba(120,194,255,0.24)",
  background: "rgba(255,255,255,0.10)",
  color: "#FFFFFF",
  padding: "0 12px",
  fontSize: 14,
  fontWeight: 800,
  outline: "none",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
};

const summaryBoxStyle: React.CSSProperties = {
  marginTop: 16,
  padding: 14,
  borderRadius: 20,
  background:
    "linear-gradient(135deg, rgba(20,184,166,0.18), rgba(58,160,255,0.12))",
  border: "1px solid rgba(94,234,212,0.26)",
  boxShadow: "inset 4px 0 0 rgba(20,184,166,0.72)",
};

const progressTrackStyle: React.CSSProperties = {
  height: 12,
  borderRadius: 999,
  background: "rgba(255,255,255,0.08)",
  overflow: "hidden",
  margin: "16px 0 12px",
};

const mutedTextStyle: React.CSSProperties = {
  margin: "7px 0 0",
  fontSize: 13,
  lineHeight: 1.5,
  color: "rgba(255,255,255,0.68)",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 56,
  borderRadius: 20,
  border: "none",
  background: "linear-gradient(135deg, #1F6FB2, #3AA0FF)",
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: 950,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  marginTop: 14,
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(58,160,255,0.28)",
};

const secondaryButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 52,
  borderRadius: 18,
  border: "1px solid rgba(120,194,255,0.22)",
  background: "rgba(255,255,255,0.10)",
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: 900,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  marginTop: 14,
  cursor: "pointer",
};

const whatsappButtonStyle: React.CSSProperties = {
  ...secondaryButtonStyle,
  background: "#25D366",
  border: "none",
};

const timelineBoxStyle: React.CSSProperties = {
  marginTop: 14,
  padding: 16,
  borderRadius: 22,
  background:
    "linear-gradient(135deg, rgba(251,191,36,0.20) 0%, rgba(58,160,255,0.12) 100%)",
  border: "1px solid rgba(253,230,138,0.26)",
  boxShadow: "inset 4px 0 0 rgba(251,191,36,0.75)",
};

const smallIconStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 16,
  background:
    "linear-gradient(135deg, rgba(58,160,255,0.34), rgba(31,111,178,0.16))",
  border: "1px solid rgba(120,194,255,0.28)",
  color: "#BFDBFE",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const smallLabelStyle: React.CSSProperties = {
  margin: "12px 0 0",
  fontSize: 13,
  color: "rgba(255,255,255,0.68)",
  fontWeight: 800,
};

const bigValueStyle: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: 25,
  lineHeight: 1.1,
  fontWeight: 950,
  textTransform: "capitalize",
};

const budgetStatsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginTop: 16,
};

const budgetMiniStatStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 18,
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(58,160,255,0.10))",
  border: "1px solid rgba(120,194,255,0.20)",
};

const budgetStatValueStyle: React.CSSProperties = {
  margin: "5px 0 0",
  fontSize: 16,
  lineHeight: 1.15,
  fontWeight: 950,
};

const budgetResultStyle: React.CSSProperties = {
  marginTop: 16,
  padding: 15,
  borderRadius: 21,
  background:
    "linear-gradient(135deg, rgba(251,191,36,0.20), rgba(58,160,255,0.12))",
  border: "1px solid rgba(253,230,138,0.28)",
  boxShadow: "inset 4px 0 0 rgba(251,191,36,0.75)",
};

const budgetDisclaimerStyle: React.CSSProperties = {
  margin: "10px 0 0",
  padding: 11,
  borderRadius: 15,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "rgba(255,255,255,0.70)",
  fontSize: 12,
  lineHeight: 1.45,
  fontWeight: 750,
};

const paymentListStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  marginTop: 16,
};

const paymentItemStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
  padding: 13,
  borderRadius: 18,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(120,194,255,0.18)",
};

const paymentTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.25,
  fontWeight: 950,
};

const paymentActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const miniButtonStyle: React.CSSProperties = {
  minHeight: 36,
  borderRadius: 999,
  border: "1px solid rgba(120,194,255,0.22)",
  background: "rgba(255,255,255,0.08)",
  color: "#FFFFFF",
  padding: "0 12px",
  fontSize: 12,
  fontWeight: 900,
  cursor: "pointer",
};
