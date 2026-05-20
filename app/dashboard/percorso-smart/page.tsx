"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  MessageCircle,
  Plus,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";

type ModalitaStudente = "iscritto" | "non_iscritto";
type TipoPercorso = "triennale" | "magistrale" | "ciclo_unico";
type StatoEsame = "da_preparare" | "in_corso" | "completato";
type DifficoltaEsame = "bassa" | "media" | "alta";
type TipoEsame = "quiz" | "orale" | "scritto" | "misto";
type RitmoAnno = "prudente" | "equilibrato" | "veloce";
type TempoFuturo = "poco" | "medio" | "alto";
type SettoreFuturo =
  | "scuola"
  | "psicologia"
  | "economia"
  | "giuridico"
  | "digitale";
type ObiettivoFuturo = "stabilita" | "carriera" | "cambio_settore" | "concorsi";

type EsameSmart = {
  id: string;
  nome: string;
  cfu: number;
  stato: StatoEsame;
  difficolta: DifficoltaEsame;
  dataEsame?: string;
};

type PianoAnnoForm = {
  esamiAnno: string;
  cfuTotali: string;
  sessioni: string;
  tipoEsame: TipoEsame;
  oreSettimana: string;
  ritmo: RitmoAnno;
};

type VitaRealeForm = {
  lavoro: "full_time" | "part_time" | "no";
  tempo: "basso" | "medio" | "alto";
  regolarita: "si" | "abbastanza" | "no";
  stanchezza: "alta" | "media" | "bassa";
  preoccupazione: "tempo" | "costanza" | "esami" | "mollare";
};

type FuturoForm = {
  obiettivo: ObiettivoFuturo;
  settore: SettoreFuturo;
  tempo: TempoFuturo;
};

const STORAGE_ESAMI = "percorso_smart_esami";
const STORAGE_CFU_TOTALI = "percorso_smart_cfu_totali";
const STORAGE_TIPO_PERCORSO = "percorso_smart_tipo_percorso";
const STORAGE_ORE_SETTIMANALI = "percorso_smart_ore_settimanali";
const STORAGE_GIORNI_STUDIO = "percorso_smart_giorni_studio";
const STORAGE_REMINDER_STUDIO = "percorso_smart_reminder_studio";
const STORAGE_ORARIO_REMINDER = "percorso_smart_orario_reminder";
const STORAGE_MODALITA = "percorso_smart_modalita";
const STORAGE_PIANO_ANNO = "percorso_smart_piano_anno";
const STORAGE_VITA_REALE = "percorso_smart_vita_reale";
const STORAGE_FUTURO = "percorso_smart_futuro";

const initialPianoAnno: PianoAnnoForm = {
  esamiAnno: "6",
  cfuTotali: "60",
  sessioni: "4",
  tipoEsame: "quiz",
  oreSettimana: "5",
  ritmo: "equilibrato",
};

const initialVitaReale: VitaRealeForm = {
  lavoro: "full_time",
  tempo: "medio",
  regolarita: "abbastanza",
  stanchezza: "media",
  preoccupazione: "tempo",
};

const initialFuturo: FuturoForm = {
  obiettivo: "stabilita",
  settore: "scuola",
  tempo: "medio",
};

const settorePercorso: Record<SettoreFuturo, string> = {
  scuola: "L-19 Scienze dell’Educazione o percorsi area scuola",
  psicologia: "L-24 Scienze e Tecniche Psicologiche",
  economia: "Laurea o Master in area Economia e Management",
  giuridico: "Servizi Giuridici, Giurisprudenza o area concorsi",
  digitale: "Percorsi in area Digital, AI, comunicazione o management",
};

const settoreOpportunita: Record<SettoreFuturo, string[]> = {
  scuola: ["servizi educativi", "concorsi", "cooperative", "percorsi scuola"],
  psicologia: [
    "area sociale",
    "risorse umane",
    "magistrale LM-51",
    "formazione",
  ],
  economia: [
    "amministrazione",
    "management",
    "controllo",
    "project management",
  ],
  giuridico: ["concorsi", "compliance", "amministrazione", "area legale"],
  digitale: ["marketing digitale", "AI", "automazione", "consulenza"],
};

function leggiJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function rilevaModalitaStudente(): ModalitaStudente {
  if (typeof window === "undefined") return "non_iscritto";

  const saved = localStorage.getItem(
    STORAGE_MODALITA
  ) as ModalitaStudente | null;
  if (saved === "iscritto" || saved === "non_iscritto") return saved;

  const valori = [
    localStorage.getItem("segmento_studente"),
    localStorage.getItem("stato_iscrizione"),
    localStorage.getItem("orientamento_data"),
    localStorage.getItem("orientamento_risultato"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    valori.includes("gia_iscritto") ||
    valori.includes("già iscritto") ||
    valori.includes("gia iscritto") ||
    valori.includes("iscritto a un corso")
  ) {
    return "iscritto";
  }

  return "non_iscritto";
}

function orePerCfu(tipo: TipoEsame) {
  if (tipo === "quiz") return 3.5;
  if (tipo === "orale") return 5;
  if (tipo === "scritto") return 5.5;
  return 4.5;
}

function coefficienteRitmo(ritmo: RitmoAnno) {
  if (ritmo === "prudente") return 0.8;
  if (ritmo === "veloce") return 1.15;
  return 1;
}

function calcolaPianoAnno(form: PianoAnnoForm) {
  const esamiAnno = Math.max(1, Number(form.esamiAnno) || 1);
  const cfuTotali = Math.max(1, Number(form.cfuTotali) || 60);
  const sessioni = Math.max(1, Number(form.sessioni) || 4);
  const oreSettimana = Math.max(1, Number(form.oreSettimana) || 4);
  const cfuMedioEsame = Math.round(cfuTotali / esamiAnno);
  const oreStimateTotali = Math.round(cfuTotali * orePerCfu(form.tipoEsame));
  const oreAnnueDisponibili = Math.round(
    oreSettimana * 48 * coefficienteRitmo(form.ritmo)
  );
  const copertura = Math.min(1, oreAnnueDisponibili / oreStimateTotali);
  const esamiRealistici = Math.max(
    1,
    Math.min(esamiAnno, Math.floor(esamiAnno * copertura))
  );
  const cfuRealistici = Math.round(esamiRealistici * cfuMedioEsame);
  const esamiPerSessione = Math.max(1, Math.ceil(esamiRealistici / sessioni));

  const carico =
    copertura < 0.55
      ? "Da organizzare"
      : copertura > 0.85
      ? "Molto gestibile"
      : "Sostenibile";
  const messaggio =
    copertura < 0.55
      ? "Il carico può diventare sostenibile partendo da pochi esami ben distribuiti, senza concentrare tutto a ridosso delle sessioni."
      : copertura > 0.85
      ? "Con il tempo indicato puoi affrontare l’anno con buona continuità e lasciare margine per ripasso e imprevisti."
      : "Il piano sembra compatibile con una routine reale, soprattutto se lo studio viene distribuito in modo regolare.";

  const pianoSessioni = Array.from({ length: sessioni }).map((_, index) => {
    const esamiRestanti = esamiRealistici - index * esamiPerSessione;
    const esami = Math.max(0, Math.min(esamiPerSessione, esamiRestanti));

    return {
      sessione: `Sessione ${index + 1}`,
      testo:
        esami > 0
          ? `${esami} esame${esami > 1 ? "i" : ""} consigliato${
              esami > 1 ? "i" : ""
            }`
          : "Recupero, ripasso o pausa strategica",
    };
  });

  return {
    esamiAnno,
    cfuTotali,
    sessioni,
    oreSettimana,
    oreStimateTotali,
    oreAnnueDisponibili,
    esamiRealistici,
    cfuRealistici,
    carico,
    messaggio,
    pianoSessioni,
  };
}

function calcolaVitaReale(form: VitaRealeForm) {
  let compatibilita = 62;
  let stress = 35;

  if (form.lavoro === "full_time") {
    compatibilita -= 8;
    stress += 14;
  }
  if (form.lavoro === "part_time") compatibilita += 6;
  if (form.lavoro === "no") compatibilita += 12;

  if (form.tempo === "alto") compatibilita += 16;
  if (form.tempo === "medio") compatibilita += 8;
  if (form.tempo === "basso") {
    compatibilita -= 6;
    stress += 10;
  }

  if (form.regolarita === "si") compatibilita += 10;
  if (form.regolarita === "no") stress += 14;
  if (form.stanchezza === "alta") stress += 16;
  if (form.stanchezza === "bassa") stress -= 8;
  if (form.preoccupazione === "mollare") stress += 8;
  if (form.preoccupazione === "esami") stress += 6;

  const score = Math.max(
    35,
    Math.min(95, compatibilita - Math.round(stress / 8))
  );
  const stressScore = Math.max(10, Math.min(90, stress));

  const profilo =
    score >= 78
      ? "Molto compatibile"
      : score >= 62
      ? "Compatibile con metodo"
      : "Serve un piano graduale";

  const strategia =
    score >= 78
      ? "Puoi puntare a un percorso regolare, scegliendo obiettivi chiari e sessioni ben distribuite."
      : score >= 62
      ? "Il percorso è possibile, ma va costruito con pochi obiettivi alla volta e promemoria costanti."
      : "Conviene partire da un piano leggero: meno esami, più continuità, supporto orientativo prima dell’iscrizione.";

  return { score, stressScore, profilo, strategia };
}

function calcolaFuturo(form: FuturoForm) {
  let base = 42;

  if (form.obiettivo === "stabilita") base += 10;
  if (form.obiettivo === "carriera") base += 15;
  if (form.obiettivo === "cambio_settore") base += 12;
  if (form.obiettivo === "concorsi") base += 11;
  if (form.tempo === "alto") base += 12;
  if (form.tempo === "medio") base += 8;
  if (form.tempo === "poco") base += 4;

  return {
    crescita: Math.min(base + 18, 94),
    compatibilita: Math.min(base + 10, 95),
    spendibilita: Math.min(base + 14, 91),
    rischio: form.tempo === "poco" ? "Medio" : "Basso",
  };
}

export default function PercorsoSmartPage() {
  const [isReady, setIsReady] = useState(false);
  const [modalita, setModalita] = useState<ModalitaStudente>("non_iscritto");
  const [esami, setEsami] = useState<EsameSmart[]>([]);
  const [cfuTotali, setCfuTotali] = useState(180);
  const [tipoPercorso, setTipoPercorso] = useState<TipoPercorso>("triennale");
  const [showForm, setShowForm] = useState(false);
  const [nomeEsame, setNomeEsame] = useState("");
  const [cfuEsame, setCfuEsame] = useState("6");
  const [dataEsame, setDataEsame] = useState("");
  const [difficolta, setDifficolta] = useState<DifficoltaEsame>("media");
  const [oreSettimanali, setOreSettimanali] = useState("6");
  const [giorniStudio, setGiorniStudio] = useState("3");
  const [reminderStudio, setReminderStudio] = useState("3_settimana");
  const [orarioReminder, setOrarioReminder] = useState("18:30");
  const [pianoAnno, setPianoAnno] = useState<PianoAnnoForm>(initialPianoAnno);
  const [vitaReale, setVitaReale] = useState<VitaRealeForm>(initialVitaReale);
  const [futuro, setFuturo] = useState<FuturoForm>(initialFuturo);

  useEffect(() => {
    setModalita(rilevaModalitaStudente());
    setEsami(leggiJson<EsameSmart[]>(STORAGE_ESAMI, []));
    setPianoAnno(
      leggiJson<PianoAnnoForm>(STORAGE_PIANO_ANNO, initialPianoAnno)
    );
    setVitaReale(
      leggiJson<VitaRealeForm>(STORAGE_VITA_REALE, initialVitaReale)
    );
    setFuturo(leggiJson<FuturoForm>(STORAGE_FUTURO, initialFuturo));
    setCfuTotali(Number(localStorage.getItem(STORAGE_CFU_TOTALI)) || 180);
    setOreSettimanali(localStorage.getItem(STORAGE_ORE_SETTIMANALI) || "6");
    setGiorniStudio(localStorage.getItem(STORAGE_GIORNI_STUDIO) || "3");
    setReminderStudio(
      localStorage.getItem(STORAGE_REMINDER_STUDIO) || "3_settimana"
    );
    setOrarioReminder(localStorage.getItem(STORAGE_ORARIO_REMINDER) || "18:30");

    const savedTipo = localStorage.getItem(
      STORAGE_TIPO_PERCORSO
    ) as TipoPercorso | null;
    if (
      savedTipo === "triennale" ||
      savedTipo === "magistrale" ||
      savedTipo === "ciclo_unico"
    ) {
      setTipoPercorso(savedTipo);
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem(STORAGE_MODALITA, modalita);
  }, [modalita, isReady]);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem(STORAGE_ESAMI, JSON.stringify(esami));
  }, [esami, isReady]);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem(STORAGE_ORE_SETTIMANALI, oreSettimanali);
    localStorage.setItem(STORAGE_GIORNI_STUDIO, giorniStudio);
    localStorage.setItem(STORAGE_REMINDER_STUDIO, reminderStudio);
    localStorage.setItem(STORAGE_ORARIO_REMINDER, orarioReminder);
  }, [oreSettimanali, giorniStudio, reminderStudio, orarioReminder, isReady]);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem(STORAGE_PIANO_ANNO, JSON.stringify(pianoAnno));
    localStorage.setItem(STORAGE_VITA_REALE, JSON.stringify(vitaReale));
    localStorage.setItem(STORAGE_FUTURO, JSON.stringify(futuro));
  }, [pianoAnno, vitaReale, futuro, isReady]);

  const cfuCompletati = useMemo(
    () =>
      esami
        .filter((esame) => esame.stato === "completato")
        .reduce((totale, esame) => totale + esame.cfu, 0),
    [esami]
  );
  const esamiCompletati = esami.filter(
    (esame) => esame.stato === "completato"
  ).length;
  const percentuale = Math.min(
    100,
    Math.round((cfuCompletati / cfuTotali) * 100)
  );
  const cfuMancanti = Math.max(0, cfuTotali - cfuCompletati);
  const oreNumero = Number(oreSettimanali) || 0;
  const giorniNumero = Math.max(1, Number(giorniStudio) || 1);
  const orePerGiorno =
    oreNumero > 0 ? Math.round((oreNumero / giorniNumero) * 10) / 10 : 0;
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
  const prossimoEsame = [...esami]
    .filter((esame) => esame.stato !== "completato")
    .sort((a, b) => {
      if (a.stato === "in_corso" && b.stato !== "in_corso") return -1;
      if (b.stato === "in_corso" && a.stato !== "in_corso") return 1;
      if (a.dataEsame && b.dataEsame)
        return (
          new Date(a.dataEsame).getTime() - new Date(b.dataEsame).getTime()
        );
      if (a.dataEsame && !b.dataEsame) return -1;
      if (!a.dataEsame && b.dataEsame) return 1;
      return 0;
    })[0];
  const giorniAlProssimoEsame = prossimoEsame?.dataEsame
    ? Math.ceil(
        (new Date(prossimoEsame.dataEsame).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;
  const caricoStudio =
    oreNumero <= 0
      ? "Da impostare"
      : oreNumero <= 3
      ? "Graduale"
      : oreNumero <= 7
      ? "Sostenibile"
      : oreNumero <= 12
      ? "Buono"
      : "Intenso";
  const pianoAnnoResult = useMemo(
    () => calcolaPianoAnno(pianoAnno),
    [pianoAnno]
  );
  const vitaRealeResult = useMemo(
    () => calcolaVitaReale(vitaReale),
    [vitaReale]
  );
  const futuroResult = useMemo(() => calcolaFuturo(futuro), [futuro]);

  function aggiornaTipoPercorso(value: TipoPercorso) {
    const nuoviCfu =
      value === "triennale" ? 180 : value === "magistrale" ? 120 : 300;
    setTipoPercorso(value);
    setCfuTotali(nuoviCfu);
    localStorage.setItem(STORAGE_TIPO_PERCORSO, value);
    localStorage.setItem(STORAGE_CFU_TOTALI, String(nuoviCfu));
  }

  function aggiungiEsame() {
    const nomePulito = nomeEsame.trim();
    const cfuNumero = Number(cfuEsame);

    if (!nomePulito || !cfuNumero || cfuNumero <= 0) {
      alert("Inserisci nome esame e CFU validi.");
      return;
    }

    setEsami((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        nome: nomePulito,
        cfu: cfuNumero,
        stato: "da_preparare",
        difficolta,
        dataEsame: dataEsame || undefined,
      },
    ]);
    setNomeEsame("");
    setCfuEsame("6");
    setDataEsame("");
    setDifficolta("media");
    setShowForm(false);
  }

  function aggiornaStatoEsame(id: string, nuovoStato: StatoEsame) {
    setEsami((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stato: nuovoStato } : item
      )
    );
  }

  function eliminaEsame(id: string) {
    const esame = esami.find((item) => item.id === id);
    const conferma = window.confirm(
      `Vuoi eliminare l’esame "${esame?.nome || "selezionato"}"?`
    );
    if (!conferma) return;
    setEsami((prev) => prev.filter((item) => item.id !== id));
  }

  function contattaOrientatore() {
    const testo = encodeURIComponent(
      modalita === "iscritto"
        ? `Ciao, sto usando Percorso Smart su Laurea Smart e vorrei supporto sul mio percorso universitario. CFU completati: ${cfuCompletati}/${cfuTotali}. Prossimo esame: ${
            prossimoEsame?.nome || "da definire"
          }.`
        : `Ciao, sto usando Percorso Smart su Laurea Smart. Vorrei capire se un percorso universitario è compatibile con la mia situazione. Piano simulato: ${
            pianoAnnoResult.esamiRealistici
          } esami, ${
            pianoAnnoResult.cfuRealistici
          } CFU sostenibili. Compatibilità reale: ${
            vitaRealeResult.score
          }%. Settore: ${settorePercorso[futuro.settore]}.`
    );

    window.open(`https://wa.me/393793673257?text=${testo}`, "_blank");
  }

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <div style={heroIconStyle}>
          <GraduationCap size={30} />
        </div>
        <p style={eyebrowStyle}>Percorso Smart</p>
        <h1 style={heroTitleStyle}>
          {modalita === "iscritto"
            ? "Gestisci il tuo percorso reale"
            : "Simula il tuo percorso prima di iscriverti"}
        </h1>
        <p style={heroTextStyle}>
          {modalita === "iscritto"
            ? "Monitora CFU, esami, ritmo di studio, calendario e promemoria in un’unica schermata."
            : "Un’unica area per simulare anno accademico, compatibilità con la vita reale e possibili scenari futuri."}
        </p>
      </section>

      <section style={switchStyle}>
        <ModeButton
          active={modalita === "non_iscritto"}
          onClick={() => setModalita("non_iscritto")}
          title="Non sono iscritto"
          description="Simulazione e orientamento"
        />
        <ModeButton
          active={modalita === "iscritto"}
          onClick={() => setModalita("iscritto")}
          title="Sono già iscritto"
          description="CFU, esami e studio"
        />
      </section>

      {modalita === "iscritto" ? (
        <IscrittoView
          esami={esami}
          cfuTotali={cfuTotali}
          tipoPercorso={tipoPercorso}
          percentuale={percentuale}
          cfuCompletati={cfuCompletati}
          esamiCompletati={esamiCompletati}
          cfuMancanti={cfuMancanti}
          caricoStudio={caricoStudio}
          oreSettimanali={oreSettimanali}
          giorniStudio={giorniStudio}
          orePerGiorno={orePerGiorno}
          dataStimataLabel={dataStimataLabel}
          mesiStimatiLaurea={mesiStimatiLaurea}
          prossimoEsame={prossimoEsame}
          giorniAlProssimoEsame={giorniAlProssimoEsame}
          reminderStudio={reminderStudio}
          orarioReminder={orarioReminder}
          showForm={showForm}
          nomeEsame={nomeEsame}
          cfuEsame={cfuEsame}
          dataEsame={dataEsame}
          difficolta={difficolta}
          setOreSettimanali={setOreSettimanali}
          setGiorniStudio={setGiorniStudio}
          setReminderStudio={setReminderStudio}
          setOrarioReminder={setOrarioReminder}
          setShowForm={setShowForm}
          setNomeEsame={setNomeEsame}
          setCfuEsame={setCfuEsame}
          setDataEsame={setDataEsame}
          setDifficolta={setDifficolta}
          aggiornaTipoPercorso={aggiornaTipoPercorso}
          aggiungiEsame={aggiungiEsame}
          aggiornaStatoEsame={aggiornaStatoEsame}
          eliminaEsame={eliminaEsame}
          contattaOrientatore={contattaOrientatore}
        />
      ) : (
        <NonIscrittoView
          pianoAnno={pianoAnno}
          setPianoAnno={setPianoAnno}
          pianoAnnoResult={pianoAnnoResult}
          vitaReale={vitaReale}
          setVitaReale={setVitaReale}
          vitaRealeResult={vitaRealeResult}
          futuro={futuro}
          setFuturo={setFuturo}
          futuroResult={futuroResult}
          contattaOrientatore={contattaOrientatore}
        />
      )}

      <BottomNav />
    </main>
  );
}

function IscrittoView(props: {
  esami: EsameSmart[];
  cfuTotali: number;
  tipoPercorso: TipoPercorso;
  percentuale: number;
  cfuCompletati: number;
  esamiCompletati: number;
  cfuMancanti: number;
  caricoStudio: string;
  oreSettimanali: string;
  giorniStudio: string;
  orePerGiorno: number;
  dataStimataLabel: string;
  mesiStimatiLaurea: number | null;
  prossimoEsame?: EsameSmart;
  giorniAlProssimoEsame: number | null;
  reminderStudio: string;
  orarioReminder: string;
  showForm: boolean;
  nomeEsame: string;
  cfuEsame: string;
  dataEsame: string;
  difficolta: DifficoltaEsame;
  setOreSettimanali: (value: string) => void;
  setGiorniStudio: (value: string) => void;
  setReminderStudio: (value: string) => void;
  setOrarioReminder: (value: string) => void;
  setShowForm: (value: boolean | ((prev: boolean) => boolean)) => void;
  setNomeEsame: (value: string) => void;
  setCfuEsame: (value: string) => void;
  setDataEsame: (value: string) => void;
  setDifficolta: (value: DifficoltaEsame) => void;
  aggiornaTipoPercorso: (value: TipoPercorso) => void;
  aggiungiEsame: () => void;
  aggiornaStatoEsame: (id: string, stato: StatoEsame) => void;
  eliminaEsame: (id: string) => void;
  contattaOrientatore: () => void;
}) {
  const reminderLabel =
    props.reminderStudio === "mai"
      ? "Disattivato"
      : props.reminderStudio === "2_settimana"
      ? "2 volte a settimana"
      : props.reminderStudio === "3_settimana"
      ? "3 volte a settimana"
      : "Ogni giorno";

  return (
    <>
      <section style={metricsGridStyle}>
        <MetricCard
          icon={<TrendingUp size={22} />}
          title={`${props.percentuale}%`}
          description="Avanzamento"
        />
        <MetricCard
          icon={<BookOpen size={22} />}
          title={`${props.cfuCompletati}/${props.cfuTotali}`}
          description="CFU completati"
        />
        <MetricCard
          icon={<CheckCircle2 size={22} />}
          title={`${props.esamiCompletati}/${props.esami.length}`}
          description="Esami conclusi"
        />
        <MetricCard
          icon={<Target size={22} />}
          title={`${props.cfuMancanti}`}
          description="CFU mancanti"
        />
      </section>

      <ProgressCard percentuale={props.percentuale} />

      <DarkCard title="Tipo di percorso" badge={`${props.cfuTotali} CFU`}>
        <div style={stackStyle}>
          <ChoiceButton
            active={props.tipoPercorso === "triennale"}
            onClick={() => props.aggiornaTipoPercorso("triennale")}
          >
            Laurea triennale · 180 CFU
          </ChoiceButton>
          <ChoiceButton
            active={props.tipoPercorso === "magistrale"}
            onClick={() => props.aggiornaTipoPercorso("magistrale")}
          >
            Laurea magistrale · 120 CFU
          </ChoiceButton>
          <ChoiceButton
            active={props.tipoPercorso === "ciclo_unico"}
            onClick={() => props.aggiornaTipoPercorso("ciclo_unico")}
          >
            Magistrale a ciclo unico · 300 CFU
          </ChoiceButton>
        </div>
      </DarkCard>

      <DarkCard title="Ritmo di studio" badge={props.caricoStudio}>
        <div style={stackStyle}>
          <Field label="Ore disponibili a settimana">
            <input
              value={props.oreSettimanali}
              onChange={(e) => props.setOreSettimanali(e.target.value)}
              type="number"
              min="0"
              style={inputStyle}
            />
          </Field>
          <Field label="Giorni di studio a settimana">
            <input
              value={props.giorniStudio}
              onChange={(e) => props.setGiorniStudio(e.target.value)}
              type="number"
              min="1"
              max="7"
              style={inputStyle}
            />
          </Field>
          <SmartBox
            title={
              props.orePerGiorno > 0
                ? `${props.orePerGiorno} ore circa per giorno di studio`
                : "Imposta il tuo ritmo"
            }
            text="Questa stima sostituisce la vecchia simulazione annuale: ora è integrata direttamente nel Percorso Smart."
          />
        </div>
      </DarkCard>

      <DarkCard title="Timeline laurea" badge="Proiezione">
        <div style={stackStyle}>
          <HighlightBox
            icon={<CalendarDays size={24} />}
            label="Possibile traguardo"
            title={props.dataStimataLabel}
            text={
              props.mesiStimatiLaurea
                ? `Continuando con il ritmo attuale, potresti completare il percorso in circa ${props.mesiStimatiLaurea} mesi.`
                : "Aggiungi ore di studio e CFU completati per generare una stima."
            }
          />
          <TwoColumns>
            <MiniBox
              title={`${props.cfuMancanti}`}
              description="CFU mancanti"
            />
            <MiniBox
              title={props.prossimoEsame?.nome || "Da definire"}
              description="Prossimo esame"
            />
          </TwoColumns>
        </div>
      </DarkCard>

      <DarkCard title="Calendario e reminder" badge={reminderLabel}>
        <div style={stackStyle}>
          <SmartBox
            title={
              props.prossimoEsame
                ? props.prossimoEsame.nome
                : "Nessun esame pianificato"
            }
            text={
              props.prossimoEsame
                ? `Giorni mancanti: ${
                    props.giorniAlProssimoEsame === null
                      ? "data non impostata"
                      : Math.max(0, props.giorniAlProssimoEsame)
                  }.`
                : "Aggiungi un esame con una data prevista per iniziare a pianificare."
            }
          />
          <Field label="Ricordami di studiare">
            <select
              value={props.reminderStudio}
              onChange={(e) => props.setReminderStudio(e.target.value)}
              style={inputStyle}
            >
              <option value="mai">Mai</option>
              <option value="2_settimana">2 volte a settimana</option>
              <option value="3_settimana">3 volte a settimana</option>
              <option value="ogni_giorno">Ogni giorno</option>
            </select>
          </Field>
          <Field label="Orario reminder">
            <input
              value={props.orarioReminder}
              onChange={(e) => props.setOrarioReminder(e.target.value)}
              type="time"
              style={inputStyle}
            />
          </Field>
        </div>
      </DarkCard>

      <button
        type="button"
        onClick={() => props.setShowForm((prev) => !prev)}
        style={primaryButtonStyle}
      >
        <Plus size={20} /> Aggiungi esame
      </button>

      {props.showForm && (
        <DarkCard title="Nuovo esame">
          <div style={stackStyle}>
            <input
              value={props.nomeEsame}
              onChange={(e) => props.setNomeEsame(e.target.value)}
              placeholder="Nome esame"
              style={inputStyle}
            />
            <input
              value={props.cfuEsame}
              onChange={(e) => props.setCfuEsame(e.target.value)}
              placeholder="CFU"
              type="number"
              style={inputStyle}
            />
            <input
              value={props.dataEsame}
              onChange={(e) => props.setDataEsame(e.target.value)}
              type="date"
              style={inputStyle}
            />
            <select
              value={props.difficolta}
              onChange={(e) =>
                props.setDifficolta(e.target.value as DifficoltaEsame)
              }
              style={inputStyle}
            >
              <option value="bassa">Difficoltà bassa</option>
              <option value="media">Difficoltà media</option>
              <option value="alta">Difficoltà alta</option>
            </select>
            <button
              type="button"
              onClick={props.aggiungiEsame}
              style={saveButtonStyle}
            >
              Salva esame
            </button>
          </div>
        </DarkCard>
      )}

      <section style={stackStyle}>
        {props.esami.map((esame) => (
          <section key={esame.id} style={examCardStyle}>
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  ...examIconStyle,
                  color: esame.stato === "completato" ? "#25D366" : "#78C2FF",
                }}
              >
                {esame.stato === "completato" ? (
                  <CheckCircle2 size={22} />
                ) : (
                  <Clock size={22} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <h3 style={examTitleStyle}>{esame.nome}</h3>
                  <button
                    type="button"
                    onClick={() => props.eliminaEsame(esame.id)}
                    style={deleteButtonStyle}
                    aria-label="Elimina esame"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p style={mutedTextStyle}>
                  {esame.cfu} CFU · difficoltà {esame.difficolta}
                  {esame.dataEsame
                    ? ` · ${new Date(esame.dataEsame).toLocaleDateString(
                        "it-IT"
                      )}`
                    : ""}
                </p>
                <div style={statusGridStyle}>
                  <StatusButton
                    active={esame.stato === "da_preparare"}
                    label="Da preparare"
                    onClick={() =>
                      props.aggiornaStatoEsame(esame.id, "da_preparare")
                    }
                  />
                  <StatusButton
                    active={esame.stato === "in_corso"}
                    label="In corso"
                    onClick={() =>
                      props.aggiornaStatoEsame(esame.id, "in_corso")
                    }
                  />
                  <StatusButton
                    active={esame.stato === "completato"}
                    label="Completato"
                    onClick={() =>
                      props.aggiornaStatoEsame(esame.id, "completato")
                    }
                  />
                </div>
              </div>
            </div>
          </section>
        ))}
      </section>

      <button
        type="button"
        onClick={props.contattaOrientatore}
        style={whatsappButtonStyle}
      >
        <MessageCircle size={20} /> Richiedi supporto sul percorso
      </button>
    </>
  );
}

function NonIscrittoView(props: {
  pianoAnno: PianoAnnoForm;
  setPianoAnno: (
    value: PianoAnnoForm | ((prev: PianoAnnoForm) => PianoAnnoForm)
  ) => void;
  pianoAnnoResult: ReturnType<typeof calcolaPianoAnno>;
  vitaReale: VitaRealeForm;
  setVitaReale: (
    value: VitaRealeForm | ((prev: VitaRealeForm) => VitaRealeForm)
  ) => void;
  vitaRealeResult: ReturnType<typeof calcolaVitaReale>;
  futuro: FuturoForm;
  setFuturo: (value: FuturoForm | ((prev: FuturoForm) => FuturoForm)) => void;
  futuroResult: ReturnType<typeof calcolaFuturo>;
  contattaOrientatore: () => void;
}) {
  return (
    <>
      <section style={metricsGridStyle}>
        <MetricCard
          icon={<CalendarDays size={22} />}
          title={`${props.pianoAnnoResult.esamiRealistici}`}
          description="Esami realistici"
        />
        <MetricCard
          icon={<BookOpen size={22} />}
          title={`${props.pianoAnnoResult.cfuRealistici}`}
          description="CFU sostenibili"
        />
        <MetricCard
          icon={<TrendingUp size={22} />}
          title={`${props.vitaRealeResult.score}%`}
          description="Compatibilità"
        />
        <MetricCard
          icon={<Sparkles size={22} />}
          title={props.futuroResult.rischio}
          description="Rischio abbandono"
        />
      </section>

      <DarkCard
        title="1. Simula anno accademico"
        badge={props.pianoAnnoResult.carico}
      >
        <div style={stackStyle}>
          <TwoColumns>
            <Field label="Esami nell’anno">
              <select
                value={props.pianoAnno.esamiAnno}
                onChange={(e) =>
                  props.setPianoAnno((prev) => ({
                    ...prev,
                    esamiAnno: e.target.value,
                  }))
                }
                style={inputStyle}
              >
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </Field>
            <Field label="CFU nell’anno">
              <select
                value={props.pianoAnno.cfuTotali}
                onChange={(e) =>
                  props.setPianoAnno((prev) => ({
                    ...prev,
                    cfuTotali: e.target.value,
                  }))
                }
                style={inputStyle}
              >
                <option value="30">30</option>
                <option value="36">36</option>
                <option value="42">42</option>
                <option value="48">48</option>
                <option value="60">60</option>
              </select>
            </Field>
          </TwoColumns>
          <TwoColumns>
            <Field label="Sessioni">
              <select
                value={props.pianoAnno.sessioni}
                onChange={(e) =>
                  props.setPianoAnno((prev) => ({
                    ...prev,
                    sessioni: e.target.value,
                  }))
                }
                style={inputStyle}
              >
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </Field>
            <Field label="Ore/settimana">
              <input
                value={props.pianoAnno.oreSettimana}
                onChange={(e) =>
                  props.setPianoAnno((prev) => ({
                    ...prev,
                    oreSettimana: e.target.value,
                  }))
                }
                type="number"
                min="1"
                style={inputStyle}
              />
            </Field>
          </TwoColumns>
          <Field label="Tipo di esame prevalente">
            <select
              value={props.pianoAnno.tipoEsame}
              onChange={(e) =>
                props.setPianoAnno((prev) => ({
                  ...prev,
                  tipoEsame: e.target.value as TipoEsame,
                }))
              }
              style={inputStyle}
            >
              <option value="quiz">Quiz</option>
              <option value="orale">Orale</option>
              <option value="scritto">Scritto</option>
              <option value="misto">Misto</option>
            </select>
          </Field>
          <Field label="Ritmo desiderato">
            <select
              value={props.pianoAnno.ritmo}
              onChange={(e) =>
                props.setPianoAnno((prev) => ({
                  ...prev,
                  ritmo: e.target.value as RitmoAnno,
                }))
              }
              style={inputStyle}
            >
              <option value="prudente">Prudente</option>
              <option value="equilibrato">Equilibrato</option>
              <option value="veloce">Veloce</option>
            </select>
          </Field>
          <SmartBox
            title={`${props.pianoAnnoResult.esamiRealistici} esami e ${props.pianoAnnoResult.cfuRealistici} CFU sostenibili`}
            text={props.pianoAnnoResult.messaggio}
          />
          <section style={sessionGridStyle}>
            {props.pianoAnnoResult.pianoSessioni.map((item) => (
              <MiniBox
                key={item.sessione}
                title={item.sessione}
                description={item.testo}
              />
            ))}
          </section>
        </div>
      </DarkCard>

      <DarkCard
        title="2. Compatibilità con la vita reale"
        badge={props.vitaRealeResult.profilo}
      >
        <div style={stackStyle}>
          <Field label="Oggi lavori?">
            <select
              value={props.vitaReale.lavoro}
              onChange={(e) =>
                props.setVitaReale((prev) => ({
                  ...prev,
                  lavoro: e.target.value as VitaRealeForm["lavoro"],
                }))
              }
              style={inputStyle}
            >
              <option value="full_time">Sì, full-time</option>
              <option value="part_time">Sì, part-time</option>
              <option value="no">No</option>
            </select>
          </Field>
          <Field label="Tempo realistico">
            <select
              value={props.vitaReale.tempo}
              onChange={(e) =>
                props.setVitaReale((prev) => ({
                  ...prev,
                  tempo: e.target.value as VitaRealeForm["tempo"],
                }))
              }
              style={inputStyle}
            >
              <option value="basso">2-4 ore/settimana</option>
              <option value="medio">5-7 ore/settimana</option>
              <option value="alto">8-10+ ore/settimana</option>
            </select>
          </Field>
          <TwoColumns>
            <Field label="Regolarità">
              <select
                value={props.vitaReale.regolarita}
                onChange={(e) =>
                  props.setVitaReale((prev) => ({
                    ...prev,
                    regolarita: e.target.value as VitaRealeForm["regolarita"],
                  }))
                }
                style={inputStyle}
              >
                <option value="si">Regolare</option>
                <option value="abbastanza">Abbastanza</option>
                <option value="no">Variabile</option>
              </select>
            </Field>
            <Field label="Stanchezza">
              <select
                value={props.vitaReale.stanchezza}
                onChange={(e) =>
                  props.setVitaReale((prev) => ({
                    ...prev,
                    stanchezza: e.target.value as VitaRealeForm["stanchezza"],
                  }))
                }
                style={inputStyle}
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="bassa">Bassa</option>
              </select>
            </Field>
          </TwoColumns>
          <Field label="Preoccupazione principale">
            <select
              value={props.vitaReale.preoccupazione}
              onChange={(e) =>
                props.setVitaReale((prev) => ({
                  ...prev,
                  preoccupazione: e.target
                    .value as VitaRealeForm["preoccupazione"],
                }))
              }
              style={inputStyle}
            >
              <option value="tempo">Non avere tempo</option>
              <option value="costanza">Non essere costante</option>
              <option value="esami">Ansia per gli esami</option>
              <option value="mollare">Mollare a metà</option>
            </select>
          </Field>
          <ScoreBar
            label="Compatibilità reale"
            value={props.vitaRealeResult.score}
          />
          <ScoreBar
            label="Stress previsto"
            value={props.vitaRealeResult.stressScore}
          />
          <SmartBox
            title={props.vitaRealeResult.profilo}
            text={props.vitaRealeResult.strategia}
          />
        </div>
      </DarkCard>

      <DarkCard title="3. Simula il futuro" badge="Scenario">
        <div style={stackStyle}>
          <Field label="Obiettivo">
            <select
              value={props.futuro.obiettivo}
              onChange={(e) =>
                props.setFuturo((prev) => ({
                  ...prev,
                  obiettivo: e.target.value as ObiettivoFuturo,
                }))
              }
              style={inputStyle}
            >
              <option value="stabilita">Stabilità</option>
              <option value="carriera">Crescita di carriera</option>
              <option value="cambio_settore">Cambio settore</option>
              <option value="concorsi">Concorsi</option>
            </select>
          </Field>
          <Field label="Area di interesse">
            <select
              value={props.futuro.settore}
              onChange={(e) =>
                props.setFuturo((prev) => ({
                  ...prev,
                  settore: e.target.value as SettoreFuturo,
                }))
              }
              style={inputStyle}
            >
              <option value="scuola">Scuola / educazione</option>
              <option value="psicologia">Psicologia</option>
              <option value="economia">Economia</option>
              <option value="giuridico">Giuridico</option>
              <option value="digitale">Digitale</option>
            </select>
          </Field>
          <Field label="Tempo disponibile">
            <select
              value={props.futuro.tempo}
              onChange={(e) =>
                props.setFuturo((prev) => ({
                  ...prev,
                  tempo: e.target.value as TempoFuturo,
                }))
              }
              style={inputStyle}
            >
              <option value="poco">Poco</option>
              <option value="medio">Medio</option>
              <option value="alto">Alto</option>
            </select>
          </Field>
          <SmartBox
            title={settorePercorso[props.futuro.settore]}
            text={`Opportunità coerenti: ${settoreOpportunita[
              props.futuro.settore
            ].join(", ")}.`}
          />
          <ScoreBar
            label="Crescita potenziale"
            value={props.futuroResult.crescita}
          />
          <ScoreBar
            label="Compatibilità percorso"
            value={props.futuroResult.compatibilita}
          />
          <ScoreBar
            label="Spendibilità"
            value={props.futuroResult.spendibilita}
          />
        </div>
      </DarkCard>

      <button
        type="button"
        onClick={props.contattaOrientatore}
        style={whatsappButtonStyle}
      >
        <MessageCircle size={20} /> Parla con un orientatore
      </button>
    </>
  );
}

function ModeButton({
  active,
  onClick,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...modeButtonStyle, ...(active ? activeModeButtonStyle : {}) }}
    >
      <strong>{title}</strong>
      <span>{description}</span>
    </button>
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
      <p style={metricTitleStyle}>{title}</p>
      <p style={metricDescriptionStyle}>{description}</p>
    </section>
  );
}

function ProgressCard({ percentuale }: { percentuale: number }) {
  return (
    <section style={progressCardStyle}>
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
        {percentuale === 0
          ? "Inizia aggiungendo gli esami o impostando il ritmo."
          : percentuale < 50
          ? "Stai costruendo le basi del tuo percorso."
          : percentuale < 100
          ? "Hai superato una parte importante del percorso."
          : "Percorso completato. Ottimo lavoro!"}
      </p>
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
  children: ReactNode;
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={fieldStyle}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...choiceButtonStyle, ...(active ? activeChoiceStyle : {}) }}
    >
      {children}
    </button>
  );
}

function StatusButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...statusButtonStyle, ...(active ? activeStatusStyle : {}) }}
    >
      {label}
    </button>
  );
}

function SmartBox({ title, text }: { title: string; text: string }) {
  return (
    <div style={smartBoxStyle}>
      <p style={smartTitleStyle}>{title}</p>
      <p style={mutedTextStyle}>{text}</p>
    </div>
  );
}

function HighlightBox({
  icon,
  label,
  title,
  text,
}: {
  icon: ReactNode;
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div style={highlightBoxStyle}>
      <div style={highlightIconStyle}>{icon}</div>
      <p style={timelineLabelStyle}>{label}</p>
      <h3 style={timelineTitleStyle}>{title}</h3>
      <p style={timelineTextStyle}>{text}</p>
    </div>
  );
}

function TwoColumns({ children }: { children: ReactNode }) {
  return <section style={twoColumnsStyle}>{children}</section>;
}

function MiniBox({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div style={miniBoxStyle}>
      <p style={miniTitleStyle}>{title}</p>
      <p style={miniDescriptionStyle}>{description}</p>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={scoreWrapStyle}>
      <div style={scoreLabelStyle}>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div style={scoreTrackStyle}>
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            borderRadius: 999,
            background: "linear-gradient(90deg, #1F6FB2, #3AA0FF, #78C2FF)",
          }}
        />
      </div>
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "22px 18px 120px",
  maxWidth: 500,
  margin: "0 auto",
  color: "#FFFFFF",
  background:
    "radial-gradient(circle at 18% 0%, rgba(58,160,255,0.42), transparent 34%), radial-gradient(circle at 88% 18%, rgba(120,194,255,0.18), transparent 28%), linear-gradient(180deg, #123B62 0%, #0B243D 42%, #071726 100%)",
  fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
};
const heroStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 34,
  padding: 24,
  marginBottom: 14,
  background:
    "linear-gradient(135deg, rgba(31,111,178,0.98) 0%, rgba(58,160,255,0.92) 48%, rgba(21,84,135,0.98) 100%)",
  border: "1px solid rgba(255,255,255,0.20)",
  boxShadow: "0 24px 60px rgba(0,0,0,0.30)",
};
const heroIconStyle: CSSProperties = {
  width: 62,
  height: 62,
  borderRadius: 24,
  background: "rgba(255,255,255,0.16)",
  border: "1px solid rgba(255,255,255,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 16,
};
const eyebrowStyle: CSSProperties = {
  margin: "0 0 8px",
  fontSize: 14,
  fontWeight: 850,
};
const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 31,
  lineHeight: "35px",
  letterSpacing: "-0.8px",
  fontWeight: 950,
};
const heroTextStyle: CSSProperties = {
  margin: "12px 0 0",
  fontSize: 15,
  lineHeight: 1.55,
  color: "rgba(255,255,255,0.9)",
};
const switchStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginBottom: 14,
};
const modeButtonStyle: CSSProperties = {
  border: "1px solid rgba(120,194,255,0.16)",
  background: "rgba(255,255,255,0.095)",
  color: "rgba(255,255,255,0.82)",
  borderRadius: 22,
  padding: "13px 12px",
  textAlign: "left",
  display: "grid",
  gap: 5,
  cursor: "pointer",
};
const activeModeButtonStyle: CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(58,160,255,0.28), rgba(120,194,255,0.16))",
  border: "1px solid rgba(120,194,255,0.58)",
  color: "#FFFFFF",
  boxShadow: "0 14px 34px rgba(31,111,178,0.24)",
};
const metricsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginBottom: 14,
};
const metricCardStyle: CSSProperties = {
  borderRadius: 26,
  padding: 15,
  background: "linear-gradient(180deg, rgba(22,53,82,0.88), rgba(12,31,53,0.84))",
  border: "1px solid rgba(120,194,255,0.22)",
  boxShadow: "0 16px 38px rgba(0,0,0,0.20)",
};
const metricIconStyle: CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 16,
  background: "rgba(58,160,255,0.14)",
  color: "#78C2FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 10,
};
const metricTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 22,
  fontWeight: 950,
  letterSpacing: "-0.5px",
};
const metricDescriptionStyle: CSSProperties = {
  margin: "4px 0 0",
  fontSize: 12.5,
  lineHeight: 1.35,
  color: "rgba(255,255,255,0.62)",
  fontWeight: 700,
};
const darkCardStyle: CSSProperties = {
  borderRadius: 30,
  padding: 18,
  marginBottom: 14,
  background:
    "linear-gradient(180deg, rgba(18,48,78,0.90), rgba(9,27,47,0.88))",
  border: "1px solid rgba(120,194,255,0.22)",
  boxShadow: "0 20px 48px rgba(0,0,0,0.24)",
  backdropFilter: "blur(18px)",
};
const cardHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 14,
};
const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 950,
  letterSpacing: "-0.35px",
};
const badgeStyle: CSSProperties = {
  borderRadius: 999,
  padding: "7px 10px",
  background: "rgba(120,194,255,0.14)",
  color: "#78C2FF",
  fontSize: 12,
  fontWeight: 900,
  whiteSpace: "nowrap",
};
const stackStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  marginBottom: 14,
};
const twoColumnsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};
const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 46,
  borderRadius: 17,
  border: "1px solid rgba(120,194,255,0.20)",
  background: "rgba(5,19,34,0.66)",
  color: "#FFFFFF",
  padding: "0 13px",
  fontSize: 14,
  fontWeight: 750,
  outline: "none",
  boxSizing: "border-box",
};
const fieldStyle: CSSProperties = { display: "grid", gap: 8 };
const labelStyle: CSSProperties = {
  fontSize: 12.5,
  color: "rgba(255,255,255,0.68)",
  fontWeight: 850,
};
const smartBoxStyle: CSSProperties = {
  borderRadius: 22,
  padding: 15,
  background: "rgba(58,160,255,0.1)",
  border: "1px solid rgba(120,194,255,0.18)",
};
const smartTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 950,
  color: "#FFFFFF",
};
const mutedTextStyle: CSSProperties = {
  margin: "7px 0 0",
  fontSize: 13.5,
  lineHeight: 1.5,
  color: "rgba(255,255,255,0.66)",
  fontWeight: 650,
};
const choiceButtonStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.78)",
  borderRadius: 18,
  padding: "13px 14px",
  textAlign: "left",
  fontSize: 14,
  fontWeight: 850,
  cursor: "pointer",
};
const activeChoiceStyle: CSSProperties = {
  borderColor: "rgba(120,194,255,0.62)",
  background: "rgba(58,160,255,0.18)",
  color: "#FFFFFF",
};
const progressCardStyle: CSSProperties = {
  borderRadius: 24,
  padding: 15,
  marginBottom: 14,
  background: "rgba(58,160,255,0.10)",
  border: "1px solid rgba(120,194,255,0.18)",
};
const progressTrackStyle: CSSProperties = {
  width: "100%",
  height: 12,
  borderRadius: 999,
  background: "rgba(255,255,255,0.11)",
  overflow: "hidden",
};
const highlightBoxStyle: CSSProperties = {
  borderRadius: 26,
  padding: 18,
  textAlign: "center",
  background:
    "linear-gradient(135deg, rgba(31,111,178,0.28), rgba(58,160,255,0.12))",
  border: "1px solid rgba(120,194,255,0.18)",
};
const highlightIconStyle: CSSProperties = {
  width: 50,
  height: 50,
  borderRadius: 20,
  margin: "0 auto 10px",
  background: "rgba(120,194,255,0.16)",
  color: "#78C2FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const timelineLabelStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  fontWeight: 900,
  color: "#78C2FF",
  textTransform: "uppercase",
  letterSpacing: "0.45px",
};
const timelineTitleStyle: CSSProperties = {
  margin: "6px 0 0",
  fontSize: 24,
  fontWeight: 950,
  letterSpacing: "-0.5px",
};
const timelineTextStyle: CSSProperties = {
  margin: "8px 0 0",
  fontSize: 13.5,
  lineHeight: 1.5,
  color: "rgba(255,255,255,0.68)",
};
const miniBoxStyle: CSSProperties = {
  borderRadius: 20,
  padding: 13,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
};
const miniTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 950,
  color: "#FFFFFF",
};
const miniDescriptionStyle: CSSProperties = {
  margin: "5px 0 0",
  fontSize: 12.5,
  lineHeight: 1.35,
  color: "rgba(255,255,255,0.62)",
  fontWeight: 700,
};
const primaryButtonStyle: CSSProperties = {
  width: "100%",
  border: "none",
  borderRadius: 22,
  padding: "15px 18px",
  marginBottom: 14,
  background: "linear-gradient(135deg, #1F6FB2, #3AA0FF)",
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: 950,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  cursor: "pointer",
  boxShadow: "0 16px 38px rgba(31,111,178,0.32)",
};
const saveButtonStyle: CSSProperties = {
  ...primaryButtonStyle,
  marginBottom: 0,
};
const whatsappButtonStyle: CSSProperties = {
  ...primaryButtonStyle,
  background: "linear-gradient(135deg, #128C7E, #25D366)",
  marginTop: 2,
};
const examCardStyle: CSSProperties = {
  borderRadius: 24,
  padding: 15,
  background: "rgba(17,32,51,0.78)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 14px 36px rgba(0,0,0,0.22)",
};
const examIconStyle: CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: 18,
  background: "rgba(58,160,255,0.13)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
const examTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 16,
  lineHeight: 1.25,
  fontWeight: 950,
};
const deleteButtonStyle: CSSProperties = {
  border: "none",
  background: "rgba(255,255,255,0.07)",
  color: "rgba(255,255,255,0.72)",
  width: 34,
  height: 34,
  borderRadius: 13,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};
const statusGridStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};
const statusButtonStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.72)",
  borderRadius: 999,
  padding: "8px 10px",
  fontSize: 12.5,
  fontWeight: 850,
  cursor: "pointer",
};
const activeStatusStyle: CSSProperties = {
  borderColor: "rgba(120,194,255,0.58)",
  background: "rgba(58,160,255,0.18)",
  color: "#FFFFFF",
};
const sessionGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};
const scoreWrapStyle: CSSProperties = { display: "grid", gap: 8 };
const scoreLabelStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  fontSize: 13.5,
  color: "rgba(255,255,255,0.78)",
  fontWeight: 850,
};
const scoreTrackStyle: CSSProperties = {
  height: 12,
  borderRadius: 999,
  background: "rgba(255,255,255,0.09)",
  overflow: "hidden",
};
