"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";

type ProfileKey =
  | "STRATEGICO_PROFESSIONALE"
  | "RELAZIONALE_SOCIALE"
  | "NORMATIVO_ISTITUZIONALE"
  | "CREATIVO_COMUNICATIVO"
  | "TECNICO_ANALITICO"
  | "EDUCATIVO_FORMATIVO"
  | "ESPLORATIVO_GUIDATO";

type ScoreMap = Partial<Record<ProfileKey, number>>;

type Option = {
  label: string;
  scores: ScoreMap;
};

type Question = {
  id: string;
  sezione: string;
  domanda: string;
  sottotitolo?: string;
  options: Option[];
};

type ProfileResult = {
  nome: string;
  frase: string;
  descrizione: string;
  puntiForza: string[];
  attenzione: string;
  aree: string[];
};

const STORAGE_KEY = "test_futuro_somiglia_risultato";
const EMAIL_ENDPOINT = "https://laureasmart.it/api/invia-test-futuro.php";

const pageBackground =
  "radial-gradient(circle at top left, rgba(96,194,255,0.24) 0%, transparent 30%), radial-gradient(circle at 88% 12%, rgba(31,111,178,0.38) 0%, transparent 28%), radial-gradient(circle at 18% 82%, rgba(56,189,248,0.14) 0%, transparent 34%), linear-gradient(160deg, #07111F 0%, #0B1728 42%, #102B47 100%)";
const cardBackground =
  "linear-gradient(145deg, rgba(255,255,255,0.11), rgba(31,111,178,0.16) 42%, rgba(11,23,40,0.92))";
const primaryGradient =
  "linear-gradient(135deg, #1F6FB2 0%, #2F8ED8 45%, #60C2FF 100%)";
const softBlueGradient =
  "linear-gradient(145deg, rgba(31,111,178,0.34), rgba(11,23,40,0.92) 62%, rgba(96,194,255,0.15))";

const profileResults: Record<ProfileKey, ProfileResult> = {
  STRATEGICO_PROFESSIONALE: {
    nome: "Profilo Strategico",
    frase: "Cerchi una direzione concreta, utile e capace di aprire opportunità reali.",
    descrizione:
      "Tendi a leggere il futuro come un progetto da costruire. Quando devi scegliere, hai bisogno di vedere un vantaggio chiaro: crescita professionale, nuove possibilità, risultati misurabili e una strada che abbia senso anche nel lavoro.",
    puntiForza: [
      "buona capacità di orientarti verso obiettivi pratici",
      "attenzione al rapporto tra scelta, tempo e risultato",
      "tendenza a cercare percorsi spendibili e riconoscibili",
    ],
    attenzione:
      "Potresti scartare troppo presto percorsi che ti interessano davvero solo perché non ne vedi subito l’utilità pratica.",
    aree: [
      "Economia e management",
      "Comunicazione e marketing",
      "Giurisprudenza e servizi giuridici",
      "Informatica e digitale",
    ],
  },
  RELAZIONALE_SOCIALE: {
    nome: "Profilo Relazionale",
    frase: "Ti muovi meglio quando al centro ci sono persone, ascolto e relazioni.",
    descrizione:
      "Il tuo modo di scegliere sembra legato al bisogno di capire gli altri, accompagnare, sostenere o migliorare contesti umani. Dai valore all’impatto personale delle scelte e tendi a cercare percorsi in cui competenze e sensibilità possano lavorare insieme.",
    puntiForza: [
      "buona sensibilità verso bisogni e comportamenti delle persone",
      "capacità di leggere le situazioni anche dal punto di vista umano",
      "interesse per contesti di aiuto, supporto o relazione",
    ],
    attenzione:
      "Quando una scelta coinvolge molte persone o molte aspettative, potresti faticare a mettere al centro i tuoi obiettivi personali.",
    aree: [
      "Psicologia",
      "Scienze dell’educazione",
      "Servizi sociali e ambito socio-pedagogico",
      "Scienze motorie e benessere",
    ],
  },
  NORMATIVO_ISTITUZIONALE: {
    nome: "Profilo Ordinato",
    frase: "Hai bisogno di una strada chiara, riconoscibile e con regole comprensibili.",
    descrizione:
      "Il tuo profilo tende a valorizzare stabilità, procedure, titoli e percorsi con una funzione precisa. Prima di scegliere vuoi capire requisiti, riconoscimenti, sbocchi, tempi e passaggi necessari. Ti rassicurano le direzioni strutturate.",
    puntiForza: [
      "attenzione alle regole e ai passaggi formali",
      "orientamento verso titoli utili e spendibili",
      "buona capacità di valutare requisiti, vincoli e procedure",
    ],
    attenzione:
      "Il bisogno di certezza potrebbe rallentarti: alcune scelte diventano più chiare solo dopo un primo confronto o una prima simulazione concreta.",
    aree: [
      "Giurisprudenza",
      "Scienze politiche",
      "Economia per pubblica amministrazione e concorsi",
      "Percorsi scuola, graduatorie e formazione professionale",
    ],
  },
  CREATIVO_COMUNICATIVO: {
    nome: "Profilo Espressivo",
    frase: "Hai bisogno di una direzione in cui idee, linguaggio e identità abbiano spazio.",
    descrizione:
      "Il tuo modo di immaginare il futuro passa spesso da comunicazione, contenuti, creatività o capacità di dare forma alle idee. Ti interessano i contesti in cui si possono raccontare progetti, costruire messaggi, interpretare linguaggi e creare connessioni.",
    puntiForza: [
      "buona propensione a comunicare e dare forma ai pensieri",
      "interesse per contenuti, linguaggi e narrazione",
      "capacità di collegare idee, persone e contesti",
    ],
    attenzione:
      "Potresti avere molte direzioni possibili: serve trasformare l’interesse in un percorso riconoscibile e sostenibile.",
    aree: [
      "Comunicazione",
      "Marketing digitale",
      "Lettere e discipline umanistiche",
      "Lingue e mediazione linguistica",
    ],
  },
  TECNICO_ANALITICO: {
    nome: "Profilo Analitico",
    frase: "Ti valorizzano problemi, dati, metodo e soluzioni verificabili.",
    descrizione:
      "Tendi a fidarti di ciò che puoi comprendere, misurare o organizzare con logica. Ti trovi meglio quando una scelta può essere scomposta in elementi concreti: dati, strumenti, competenze, processi, tecnologie o problemi da risolvere.",
    puntiForza: [
      "capacità di analizzare problemi complessi",
      "attenzione a dati, processi e strumenti",
      "buona propensione verso metodo e precisione",
    ],
    attenzione:
      "Potresti sottovalutare la parte emotiva o motivazionale della scelta, che invece incide molto sulla costanza nello studio.",
    aree: [
      "Informatica",
      "Ingegneria",
      "Statistica e data analysis",
      "Cyber security e competenze digitali",
    ],
  },
  EDUCATIVO_FORMATIVO: {
    nome: "Profilo Guida",
    frase: "Ti realizzi quando puoi aiutare qualcuno a crescere, capire o migliorare.",
    descrizione:
      "Il tuo profilo mostra attenzione verso apprendimento, crescita personale e accompagnamento degli altri. Non cerchi solo un titolo, ma una direzione in cui la conoscenza diventi utile per educare, formare, sostenere o facilitare un cambiamento.",
    puntiForza: [
      "interesse per crescita, apprendimento e formazione",
      "capacità di dare valore ai percorsi delle persone",
      "buona predisposizione a ruoli educativi o di accompagnamento",
    ],
    attenzione:
      "Potresti scegliere in base a ciò che senti utile per gli altri, senza verificare abbastanza bene tempi, requisiti e sbocchi per te.",
    aree: [
      "Scienze dell’educazione",
      "Scienze pedagogiche",
      "Formazione primaria",
      "Master e percorsi per scuola e docenza",
    ],
  },
  ESPLORATIVO_GUIDATO: {
    nome: "Profilo Esploratore",
    frase: "Hai diverse possibilità davanti e hai bisogno di metterle in ordine.",
    descrizione:
      "Il tuo profilo non indica mancanza di idee, ma bisogno di orientare meglio energie, interessi e vincoli. Probabilmente hai più direzioni possibili o non hai ancora trasformato le tue preferenze in una scelta precisa.",
    puntiForza: [
      "apertura verso possibilità diverse",
      "capacità di rimettere in discussione scelte e abitudini",
      "buon potenziale se guidato con criteri chiari",
    ],
    attenzione:
      "Il rischio principale è rimandare la decisione. Ti serve una comparazione semplice tra poche alternative realistiche.",
    aree: [
      "Percorsi trasversali da confrontare",
      "Aree umanistiche, sociali o economiche in base agli obiettivi",
      "Valutazione CFU o titoli già posseduti",
      "Confronto guidato con un orientatore",
    ],
  },
};

const questions: Question[] = [
  {
    id: "q1",
    sezione: "Istinto iniziale",
    domanda: "Quando immagini il tuo futuro, quale pensiero arriva per primo?",
    options: [
      { label: "Vorrei costruire qualcosa di più solido per il lavoro", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Vorrei sentirmi più utile per le persone intorno a me", scores: { RELAZIONALE_SOCIALE: 3, EDUCATIVO_FORMATIVO: 1 } },
      { label: "Vorrei avere una strada chiara, con passaggi precisi", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Vorrei esprimere meglio idee, interessi e capacità", scores: { CREATIVO_COMUNICATIVO: 3 } },
      { label: "Vorrei capire prima quali possibilità sono davvero adatte a me", scores: { ESPLORATIVO_GUIDATO: 3 } },
    ],
  },
  {
    id: "q2",
    sezione: "Istinto iniziale",
    domanda: "In quale situazione senti di dare il meglio?",
    options: [
      { label: "Quando devo organizzare, decidere e raggiungere un obiettivo", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Quando devo ascoltare, aiutare o comprendere qualcuno", scores: { RELAZIONALE_SOCIALE: 3 } },
      { label: "Quando devo interpretare regole, criteri o procedure", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Quando devo analizzare informazioni, problemi o dati", scores: { TECNICO_ANALITICO: 3 } },
      { label: "Quando devo spiegare qualcosa e renderlo più semplice", scores: { EDUCATIVO_FORMATIVO: 3 } },
    ],
  },
  {
    id: "q3",
    sezione: "Istinto iniziale",
    domanda: "Quale frase ti descrive meglio in questo momento?",
    options: [
      { label: "Ho bisogno di una scelta utile, non solo interessante", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Mi interessa capire meglio me stesso e gli altri", scores: { RELAZIONALE_SOCIALE: 2, ESPLORATIVO_GUIDATO: 1 } },
      { label: "Voglio un titolo che abbia valore e riconoscibilità", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Ho molti interessi e non so ancora quale pesi di più", scores: { ESPLORATIVO_GUIDATO: 3 } },
      { label: "Mi piace costruire contenuti, idee o messaggi", scores: { CREATIVO_COMUNICATIVO: 3 } },
    ],
  },
  {
    id: "q4",
    sezione: "Istinto iniziale",
    domanda: "Quando qualcosa ti interessa davvero, cosa ti viene naturale fare?",
    options: [
      { label: "Capire come può diventare un’opportunità concreta", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Approfondire, cercare collegamenti e ragionare sui dettagli", scores: { TECNICO_ANALITICO: 3 } },
      { label: "Raccontarlo, condividerlo o trasformarlo in un progetto", scores: { CREATIVO_COMUNICATIVO: 3 } },
      { label: "Usarlo per aiutare o orientare altre persone", scores: { EDUCATIVO_FORMATIVO: 3, RELAZIONALE_SOCIALE: 1 } },
      { label: "Confrontarlo con altre possibilità prima di decidere", scores: { ESPLORATIVO_GUIDATO: 3 } },
    ],
  },
  {
    id: "q5",
    sezione: "Modo di scegliere",
    domanda: "Quando devi prendere una decisione importante, cosa ti pesa di più?",
    options: [
      { label: "Non sapere se quella scelta porterà risultati reali", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Temere di non essere abbastanza preparato", scores: { ESPLORATIVO_GUIDATO: 2, EDUCATIVO_FORMATIVO: 1 } },
      { label: "Non capire bene regole, requisiti o passaggi", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Dover rinunciare a una parte creativa o personale", scores: { CREATIVO_COMUNICATIVO: 3 } },
      { label: "Avere troppe opzioni simili e non riuscire a ordinarle", scores: { ESPLORATIVO_GUIDATO: 3 } },
    ],
  },
  {
    id: "q6",
    sezione: "Modo di scegliere",
    domanda: "Di fronte a una scelta nuova, cosa ti rassicura di più?",
    options: [
      { label: "Vedere esempi concreti di persone che ce l’hanno fatta", scores: { RELAZIONALE_SOCIALE: 2, ESPLORATIVO_GUIDATO: 1 } },
      { label: "Avere una mappa chiara di tempi, costi e passaggi", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Sapere che quella scelta può migliorare lavoro e prospettive", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Poter analizzare dati, programmi e informazioni precise", scores: { TECNICO_ANALITICO: 3 } },
      { label: "Sentire che quella strada mi rappresenta davvero", scores: { CREATIVO_COMUNICATIVO: 2, RELAZIONALE_SOCIALE: 1 } },
    ],
  },
  {
    id: "q7",
    sezione: "Modo di scegliere",
    domanda: "Quale rischio vuoi evitare di più?",
    options: [
      { label: "Perdere tempo in un percorso poco spendibile", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Scegliere qualcosa che non sento mio", scores: { CREATIVO_COMUNICATIVO: 2, ESPLORATIVO_GUIDATO: 1 } },
      { label: "Non rispettare requisiti, scadenze o procedure", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Trovarmi senza metodo e senza continuità", scores: { EDUCATIVO_FORMATIVO: 2, ESPLORATIVO_GUIDATO: 1 } },
      { label: "Non riuscire a capire se ho davvero le capacità adatte", scores: { TECNICO_ANALITICO: 2, ESPLORATIVO_GUIDATO: 1 } },
    ],
  },
  {
    id: "q8",
    sezione: "Modo di scegliere",
    domanda: "Quando hai un dubbio, quale aiuto ti sarebbe più utile?",
    options: [
      { label: "Una comparazione chiara tra le alternative", scores: { ESPLORATIVO_GUIDATO: 3, NORMATIVO_ISTITUZIONALE: 1 } },
      { label: "Un consiglio pratico su cosa conviene davvero", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Un confronto umano con qualcuno che mi ascolta", scores: { RELAZIONALE_SOCIALE: 3 } },
      { label: "Un’analisi precisa di dati, sbocchi e programmi", scores: { TECNICO_ANALITICO: 3 } },
      { label: "Una spiegazione semplice, passo dopo passo", scores: { EDUCATIVO_FORMATIVO: 3 } },
    ],
  },
  {
    id: "q9",
    sezione: "Energia personale",
    domanda: "Quale attività ti assorbe di più senza farti sentire il peso del tempo?",
    options: [
      { label: "Organizzare progetti, obiettivi o strategie", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Capire comportamenti, emozioni o relazioni", scores: { RELAZIONALE_SOCIALE: 3 } },
      { label: "Scrivere, comunicare, creare o raccontare", scores: { CREATIVO_COMUNICATIVO: 3 } },
      { label: "Risolvere problemi logici o tecnici", scores: { TECNICO_ANALITICO: 3 } },
      { label: "Spiegare qualcosa a qualcuno finché non diventa chiaro", scores: { EDUCATIVO_FORMATIVO: 3 } },
    ],
  },
  {
    id: "q10",
    sezione: "Energia personale",
    domanda: "Quale contesto ti sembra più vicino al tuo modo di essere?",
    options: [
      { label: "Un contesto dinamico, con risultati e responsabilità", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Un contesto umano, dove contano ascolto e fiducia", scores: { RELAZIONALE_SOCIALE: 3 } },
      { label: "Un contesto ordinato, con regole e obiettivi definiti", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Un contesto creativo, dove posso dare forma alle idee", scores: { CREATIVO_COMUNICATIVO: 3 } },
      { label: "Un contesto tecnico, dove contano precisione e metodo", scores: { TECNICO_ANALITICO: 3 } },
    ],
  },
  {
    id: "q11",
    sezione: "Energia personale",
    domanda: "Cosa ti fa pensare: “qui potrei crescere davvero”?",
    options: [
      { label: "La possibilità di migliorare ruolo, reddito o carriera", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "La possibilità di lavorare con persone e bisogni reali", scores: { RELAZIONALE_SOCIALE: 3 } },
      { label: "La possibilità di entrare in un sistema riconosciuto", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "La possibilità di imparare strumenti complessi e utili", scores: { TECNICO_ANALITICO: 3 } },
      { label: "La possibilità di aiutare altri a imparare o orientarsi", scores: { EDUCATIVO_FORMATIVO: 3 } },
    ],
  },
  {
    id: "q12",
    sezione: "Energia personale",
    domanda: "Quale parola senti più vicina al tuo momento attuale?",
    options: [
      { label: "Crescita", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Cura", scores: { RELAZIONALE_SOCIALE: 3 } },
      { label: "Stabilità", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Espressione", scores: { CREATIVO_COMUNICATIVO: 3 } },
      { label: "Ricerca", scores: { ESPLORATIVO_GUIDATO: 3, TECNICO_ANALITICO: 1 } },
    ],
  },
  {
    id: "q13",
    sezione: "Studio e costanza",
    domanda: "Quando devi studiare qualcosa di nuovo, quale approccio ti viene più naturale?",
    options: [
      { label: "Parto dagli obiettivi e cerco di capire a cosa serve", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Cerco spiegazioni chiare e collegamenti con esempi reali", scores: { EDUCATIVO_FORMATIVO: 2, RELAZIONALE_SOCIALE: 1 } },
      { label: "Mi serve un programma ordinato, con tappe precise", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Approfondisco molto, anche oltre quello che è richiesto", scores: { TECNICO_ANALITICO: 3 } },
      { label: "Faccio fatica a partire se non capisco bene perché lo sto facendo", scores: { ESPLORATIVO_GUIDATO: 3 } },
    ],
  },
  {
    id: "q14",
    sezione: "Studio e costanza",
    domanda: "Che rapporto hai con le scadenze?",
    options: [
      { label: "Mi aiutano se sono collegate a un risultato concreto", scores: { STRATEGICO_PROFESSIONALE: 2, NORMATIVO_ISTITUZIONALE: 1 } },
      { label: "Mi tranquillizzano perché danno ordine", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Le rispetto meglio se qualcuno mi accompagna nel percorso", scores: { EDUCATIVO_FORMATIVO: 2, ESPLORATIVO_GUIDATO: 1 } },
      { label: "Preferisco lavorare con autonomia, purché il tema mi interessi", scores: { CREATIVO_COMUNICATIVO: 2, TECNICO_ANALITICO: 1 } },
      { label: "Mi creano pressione se non ho un piano semplice", scores: { ESPLORATIVO_GUIDATO: 3 } },
    ],
  },
  {
    id: "q15",
    sezione: "Studio e costanza",
    domanda: "Cosa ti aiuterebbe a essere più costante?",
    options: [
      { label: "Sapere che ogni passo ha un ritorno pratico", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Avere qualcuno che mi aiuta a non mollare", scores: { RELAZIONALE_SOCIALE: 2, EDUCATIVO_FORMATIVO: 1 } },
      { label: "Avere regole chiare e un calendario ordinato", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Studiare argomenti che stimolano curiosità e ragionamento", scores: { TECNICO_ANALITICO: 3 } },
      { label: "Vedere che il percorso rispecchia davvero chi sono", scores: { CREATIVO_COMUNICATIVO: 2, ESPLORATIVO_GUIDATO: 1 } },
    ],
  },
  {
    id: "q16",
    sezione: "Studio e costanza",
    domanda: "Quale difficoltà temi di più in un percorso lungo?",
    options: [
      { label: "Non vedere risultati abbastanza presto", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Sentirmi solo o poco seguito", scores: { RELAZIONALE_SOCIALE: 2, EDUCATIVO_FORMATIVO: 1 } },
      { label: "Perdermi tra procedure, esami e passaggi tecnici", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Annoiarmi se il percorso è troppo rigido", scores: { CREATIVO_COMUNICATIVO: 3 } },
      { label: "Scoprire troppo tardi che non era la scelta giusta", scores: { ESPLORATIVO_GUIDATO: 3 } },
    ],
  },
  {
    id: "q17",
    sezione: "Direzione futura",
    domanda: "Tra tre anni, cosa vorresti poter dire di te?",
    options: [
      { label: "Ho costruito una possibilità professionale migliore", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Ho imparato a capire meglio persone e relazioni", scores: { RELAZIONALE_SOCIALE: 3 } },
      { label: "Ho ottenuto un titolo utile e riconosciuto", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Ho dato forma a una parte di me che restava ferma", scores: { CREATIVO_COMUNICATIVO: 3 } },
      { label: "Ho finalmente chiarito quale strada fa per me", scores: { ESPLORATIVO_GUIDATO: 3 } },
    ],
  },
  {
    id: "q18",
    sezione: "Direzione futura",
    domanda: "Quale tipo di riconoscimento ti darebbe più soddisfazione?",
    options: [
      { label: "Essere visto come una persona competente e affidabile", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Essere riconosciuto per empatia e capacità di ascolto", scores: { RELAZIONALE_SOCIALE: 3 } },
      { label: "Avere un titolo valido per procedure, concorsi o avanzamenti", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Essere apprezzato per idee, linguaggio o creatività", scores: { CREATIVO_COMUNICATIVO: 3 } },
      { label: "Essere cercato per metodo, precisione e capacità analitica", scores: { TECNICO_ANALITICO: 3 } },
    ],
  },
  {
    id: "q19",
    sezione: "Direzione futura",
    domanda: "Cosa ti farebbe sentire di aver scelto bene?",
    options: [
      { label: "Vedere che il percorso mi apre opportunità concrete", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Sentire che ciò che studio mi rende più consapevole", scores: { RELAZIONALE_SOCIALE: 2, CREATIVO_COMUNICATIVO: 1 } },
      { label: "Sapere di aver seguito una strada ordinata e sicura", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Capire problemi complessi con strumenti più forti", scores: { TECNICO_ANALITICO: 3 } },
      { label: "Accorgermi di poter aiutare altri a crescere", scores: { EDUCATIVO_FORMATIVO: 3 } },
    ],
  },
  {
    id: "q20",
    sezione: "Direzione futura",
    domanda: "Quale scenario ti attrae di più?",
    options: [
      { label: "Un ruolo con più autonomia e responsabilità", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Un lavoro o progetto legato alle persone", scores: { RELAZIONALE_SOCIALE: 3 } },
      { label: "Una posizione stabile, con requisiti chiari", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Un’attività legata a comunicazione, cultura o contenuti", scores: { CREATIVO_COMUNICATIVO: 3 } },
      { label: "Un ambito legato a tecnologia, dati o innovazione", scores: { TECNICO_ANALITICO: 3 } },
    ],
  },
  {
    id: "q21",
    sezione: "Bisogni nascosti",
    domanda: "Se dovessi essere sincero, oggi hai più bisogno di...",
    options: [
      { label: "una scelta che abbia utilità pratica", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "una scelta che mi faccia sentire più sicuro", scores: { ESPLORATIVO_GUIDATO: 3 } },
      { label: "una scelta riconosciuta e ordinata", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "una scelta che mi somigli di più", scores: { CREATIVO_COMUNICATIVO: 2, RELAZIONALE_SOCIALE: 1 } },
      { label: "una scelta che mi dia strumenti veri", scores: { TECNICO_ANALITICO: 2, EDUCATIVO_FORMATIVO: 1 } },
    ],
  },
  {
    id: "q22",
    sezione: "Bisogni nascosti",
    domanda: "Quale frase potrebbe bloccarti più facilmente?",
    options: [
      { label: "E se poi non servisse davvero?", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "E se non fossi portato?", scores: { ESPLORATIVO_GUIDATO: 3 } },
      { label: "E se sbagliassi requisiti o procedura?", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "E se fosse troppo distante da ciò che sono?", scores: { CREATIVO_COMUNICATIVO: 2, RELAZIONALE_SOCIALE: 1 } },
      { label: "E se non riuscissi a capirlo fino in fondo?", scores: { TECNICO_ANALITICO: 3 } },
    ],
  },
  {
    id: "q23",
    sezione: "Bisogni nascosti",
    domanda: "Quando pensi a una guida esterna, cosa vorresti ricevere?",
    options: [
      { label: "Un consiglio diretto sulle opzioni più utili", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Un ascolto reale, senza giudizio", scores: { RELAZIONALE_SOCIALE: 3 } },
      { label: "Una spiegazione precisa di regole e passaggi", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Una lettura più profonda dei miei interessi", scores: { CREATIVO_COMUNICATIVO: 2, ESPLORATIVO_GUIDATO: 1 } },
      { label: "Una sintesi logica tra dati, vincoli e possibilità", scores: { TECNICO_ANALITICO: 3 } },
    ],
  },
  {
    id: "q24",
    sezione: "Bisogni nascosti",
    domanda: "Alla fine, che cosa vuoi evitare davvero?",
    options: [
      { label: "Restare fermo mentre potrei crescere", scores: { STRATEGICO_PROFESSIONALE: 3 } },
      { label: "Scegliere qualcosa che non mi rappresenta", scores: { CREATIVO_COMUNICATIVO: 2, ESPLORATIVO_GUIDATO: 1 } },
      { label: "Perdere occasioni per mancanza di titolo o requisiti", scores: { NORMATIVO_ISTITUZIONALE: 3 } },
      { label: "Non usare le mie capacità per aiutare o guidare altri", scores: { EDUCATIVO_FORMATIVO: 3, RELAZIONALE_SOCIALE: 1 } },
      { label: "Decidere senza avere abbastanza elementi", scores: { ESPLORATIVO_GUIDATO: 3, TECNICO_ANALITICO: 1 } },
    ],
  },
];

function getInitialScores(): Record<ProfileKey, number> {
  return {
    STRATEGICO_PROFESSIONALE: 0,
    RELAZIONALE_SOCIALE: 0,
    NORMATIVO_ISTITUZIONALE: 0,
    CREATIVO_COMUNICATIVO: 0,
    TECNICO_ANALITICO: 0,
    EDUCATIVO_FORMATIVO: 0,
    ESPLORATIVO_GUIDATO: 0,
  };
}

function calculateScores(answers: Record<string, number>) {
  const scores = getInitialScores();

  Object.entries(answers).forEach(([questionId, optionIndex]) => {
    const question = questions.find((item) => item.id === questionId);
    const option = question?.options[optionIndex];

    if (!option) return;

    Object.entries(option.scores).forEach(([key, value]) => {
      scores[key as ProfileKey] += value || 0;
    });
  });

  const sorted = (Object.entries(scores) as [ProfileKey, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  return {
    scores,
    primary: sorted[0][0],
    secondary: sorted[1][0],
  };
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function TestFuturoPage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [email, setEmail] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSending, setEmailSending] = useState(false);

  const completed = Object.keys(answers).length === questions.length;
  const currentQuestion = questions[currentIndex];
  const progress = started
    ? Math.round(((currentIndex + 1) / questions.length) * 100)
    : 0;

  const result = useMemo(() => calculateScores(answers), [answers]);
  const primaryResult = profileResults[result.primary];
  const secondaryResult = profileResults[result.secondary];
  const maxScore = Math.max(...Object.values(result.scores), 1);

  const handleAnswer = (optionIndex: number) => {
    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: optionIndex,
    };

    setAnswers(nextAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((value) => value + 1);
      return;
    }
  };

  const handleEmailSubmit = async () => {
    setEmailError("");

    if (!isValidEmail(email)) {
      setEmailError("Inserisci un indirizzo email valido.");
      return;
    }

    if (!privacy) {
      setEmailError("Per vedere il risultato completo devi accettare la Privacy Policy.");
      return;
    }

    const payload = {
      email: email.trim(),
      primary: result.primary,
      secondary: result.secondary,
      scores: result.scores,
      answers,
      completedAt: new Date().toISOString(),
      result: {
        primaryName: primaryResult.nome,
        primaryPhrase: primaryResult.frase,
        primaryDescription: primaryResult.descrizione,
        secondaryName: secondaryResult.nome,
        strengths: primaryResult.puntiForza,
        attention: primaryResult.attenzione,
        areas: primaryResult.aree,
      },
    };

    try {
      setEmailSending(true);

      const response = await fetch(EMAIL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Invio email non riuscito.");
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem("test_futuro_somiglia_completato", "si");
      localStorage.setItem("test_futuro_somiglia_email", email.trim());
      setEmailConfirmed(true);
    } catch (error) {
      setEmailError(
        error instanceof Error
          ? error.message
          : "Non siamo riusciti a inviare la copia del profilo. Riprova tra poco."
      );
    } finally {
      setEmailSending(false);
    }
  };

  const resetTest = () => {
    setStarted(false);
    setCurrentIndex(0);
    setAnswers({});
    setEmail("");
    setPrivacy(false);
    setEmailConfirmed(false);
    setEmailError("");
    setEmailSending(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("test_futuro_somiglia_completato");
    localStorage.removeItem("test_futuro_somiglia_email");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "22px 18px 120px",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
        maxWidth: 430,
        margin: "0 auto",
        color: "#FFFFFF",
        background: pageBackground,
      }}
    >

      <style jsx global>{`
        .futuro-back-button,
        .futuro-hero,
        .futuro-start-button,
        .futuro-question-card,
        .futuro-option,
        .futuro-ghost-button,
        .futuro-email-card,
        .futuro-input,
        .futuro-primary-button,
        .futuro-result-hero,
        .futuro-result-card,
        .futuro-pillline,
        .futuro-area,
        .futuro-reset,
        .futuro-chip {
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease,
            opacity 180ms ease,
            filter 180ms ease;
        }

        .futuro-hero,
        .futuro-email-card,
        .futuro-result-hero,
        .futuro-question-card,
        .futuro-result-card {
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .futuro-hero::after,
        .futuro-result-hero::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.18) 38%, transparent 58%),
            radial-gradient(circle at 18% 15%, rgba(255,255,255,0.20), transparent 32%);
          opacity: 0.45;
        }

        .futuro-input::placeholder {
          color: rgba(224,242,254,0.46);
        }

        .futuro-input:focus {
          border-color: rgba(96,194,255,0.78) !important;
          background: rgba(255,255,255,0.12) !important;
          box-shadow: 0 0 0 4px rgba(96,194,255,0.14), 0 16px 32px rgba(0,0,0,0.20);
        }

        @media (hover: hover) {
          .futuro-back-button:hover,
          .futuro-ghost-button:hover,
          .futuro-reset:hover {
            transform: translateY(-2px);
            border-color: rgba(96,194,255,0.34) !important;
            background: rgba(96,194,255,0.12) !important;
            color: #FFFFFF !important;
            box-shadow: 0 14px 32px rgba(0,0,0,0.22);
          }

          .futuro-hero:hover,
          .futuro-email-card:hover,
          .futuro-result-hero:hover {
            transform: translateY(-3px);
            box-shadow: 0 28px 72px rgba(0,0,0,0.42), 0 0 0 1px rgba(96,194,255,0.18) inset !important;
          }

          .futuro-question-card:hover,
          .futuro-result-card:hover {
            transform: translateY(-2px);
            border-color: rgba(96,194,255,0.24) !important;
            box-shadow: 0 22px 56px rgba(0,0,0,0.34), 0 0 0 1px rgba(96,194,255,0.08) inset !important;
          }

          .futuro-option:hover {
            transform: translateY(-3px);
            border-color: rgba(96,194,255,0.52) !important;
            background: linear-gradient(135deg, rgba(31,111,178,0.36), rgba(96,194,255,0.14)) !important;
            box-shadow: 0 18px 38px rgba(31,111,178,0.24), 0 0 0 1px rgba(255,255,255,0.08) inset !important;
          }

          .futuro-start-button:hover,
          .futuro-primary-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 46px rgba(31,111,178,0.36), 0 0 0 1px rgba(255,255,255,0.14) inset !important;
            filter: saturate(1.08);
          }

          .futuro-chip:hover,
          .futuro-pillline:hover,
          .futuro-area:hover {
            transform: translateY(-2px);
            border-color: rgba(96,194,255,0.34) !important;
            background: linear-gradient(135deg, rgba(96,194,255,0.18), rgba(255,255,255,0.08)) !important;
          }
        }

        .futuro-option:active,
        .futuro-start-button:active,
        .futuro-primary-button:active,
        .futuro-reset:active {
          transform: scale(0.985);
        }

        @keyframes futuroPulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.92; transform: scale(1.05); }
        }

        .futuro-orb {
          animation: futuroPulse 5.2s ease-in-out infinite;
        }
      `}</style>

      <button
        className="futuro-back-button"
        type="button"
        onClick={() => router.push("/dashboard")}
        style={{
          minHeight: 44,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.07)",
          color: "#FFFFFF",
          borderRadius: 999,
          padding: "0 14px",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          fontWeight: 850,
          cursor: "pointer",
          marginBottom: 16,
        }}
      >
        <ArrowLeft size={18} /> Torna alla dashboard
      </button>

      {!started && (
        <section
          className="futuro-hero"
          style={{
            borderRadius: 32,
            padding: 24,
            background: primaryGradient,
            boxShadow: "0 24px 60px rgba(0,0,0,0.36)",
            border: "1px solid rgba(255,255,255,0.12)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            className="futuro-orb"
            style={{
              position: "absolute",
              right: -48,
              top: -42,
              width: 170,
              height: 170,
              borderRadius: 999,
              background: "rgba(255,255,255,0.10)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: 62,
              height: 62,
              borderRadius: 22,
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
            }}
          >
            <Sparkles size={31} />
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "inline-flex",
              padding: "7px 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.14)",
              color: "#E0F2FE",
              fontSize: 12,
              fontWeight: 900,
              marginBottom: 14,
            }}
          >
            RISULTATO PERSONALIZZATO
          </div>

          <h1
            style={{
              position: "relative",
              zIndex: 1,
              margin: 0,
              fontSize: 34,
              lineHeight: 1.03,
              fontWeight: 950,
              letterSpacing: "-1px",
            }}
          >
            Che tipo di futuro ti somiglia?
          </h1>

          <p
            style={{
              position: "relative",
              zIndex: 1,
              margin: "16px 0 0",
              fontSize: 15.5,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.86)",
            }}
          >
            Rispondi ad alcune domande e scopri il profilo che descrive meglio
            il tuo modo di scegliere, studiare e immaginare il futuro.
          </p>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 18,
            }}
          >
            {["domande guidate", "profilo finale", "copia via email"].map(
              (item) => (
                <span
                  key={item}
                  className="futuro-chip"
                  style={{
                    borderRadius: 999,
                    padding: "8px 11px",
                    background: "rgba(255,255,255,0.13)",
                    color: "rgba(255,255,255,0.88)",
                    fontSize: 12,
                    fontWeight: 850,
                  }}
                >
                  {item}
                </span>
              )
            )}
          </div>

          <button
            className="futuro-start-button"
            type="button"
            onClick={() => setStarted(true)}
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              minHeight: 58,
              borderRadius: 22,
              border: "none",
              background: "linear-gradient(135deg, #FFFFFF, #E0F2FE)",
              color: "#0B1728",
              fontSize: 16,
              fontWeight: 950,
              marginTop: 24,
              cursor: "pointer",
              boxShadow: "0 16px 38px rgba(0,0,0,0.20)",
            }}
          >
            Inizia il test
          </button>
        </section>
      )}

      {started && !completed && (
        <section>
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
                color: "rgba(255,255,255,0.78)",
                fontSize: 13,
                fontWeight: 850,
              }}
            >
              <span>{currentQuestion.sezione}</span>
              <span>
                {currentIndex + 1}/{questions.length}
              </span>
            </div>
            <div
              style={{
                height: 10,
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
                  background: "linear-gradient(90deg, #1F6FB2 0%, #2F8ED8 45%, #60C2FF 100%)",
                  transition: "width .25s ease",
                }}
              />
            </div>
          </div>

          <section
            className="futuro-question-card"
            style={{
              borderRadius: 30,
              padding: 20,
              background: cardBackground,
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 20px 52px rgba(0,0,0,0.30)",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: 25,
                lineHeight: 1.12,
                fontWeight: 950,
                letterSpacing: "-0.6px",
              }}
            >
              {currentQuestion.domanda}
            </h1>

            {currentQuestion.sottotitolo && (
              <p
                style={{
                  margin: "10px 0 0",
                  color: "rgba(255,255,255,0.70)",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {currentQuestion.sottotitolo}
              </p>
            )}

            <div style={{ display: "grid", gap: 11, marginTop: 22 }}>
              {currentQuestion.options.map((option, optionIndex) => (
                <button
                  key={option.label}
                  className="futuro-option"
                  type="button"
                  onClick={() => handleAnswer(optionIndex)}
                  style={{
                    width: "100%",
                    borderRadius: 22,
                    border: "1px solid rgba(148,210,255,0.16)",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.09), rgba(31,111,178,0.11))",
                    color: "#FFFFFF",
                    padding: "16px 15px",
                    textAlign: "left",
                    fontSize: 14.5,
                    lineHeight: 1.45,
                    fontWeight: 850,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.16)",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {currentIndex > 0 && (
              <button
                className="futuro-ghost-button"
                type="button"
                onClick={() => setCurrentIndex((value) => Math.max(value - 1, 0))}
                style={{
                  width: "100%",
                  minHeight: 48,
                  marginTop: 16,
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 850,
                  cursor: "pointer",
                }}
              >
                Torna alla domanda precedente
              </button>
            )}
          </section>
        </section>
      )}

      {started && completed && !emailConfirmed && (
        <section
          className="futuro-email-card"
          style={{
            borderRadius: 30,
            padding: 22,
            background: softBlueGradient,
            border: "1px solid rgba(96,194,255,0.24)",
            boxShadow: "0 22px 54px rgba(0,0,0,0.34)",
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 22,
              background: "rgba(31,111,178,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              color: "#BAE6FD",
            }}
          >
            <Mail size={28} />
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 30,
              lineHeight: 1.08,
              fontWeight: 950,
              letterSpacing: "-0.8px",
            }}
          >
            Il tuo profilo è pronto
          </h1>

          <p
            style={{
              margin: "13px 0 0",
              color: "rgba(255,255,255,0.76)",
              fontSize: 15,
              lineHeight: 1.65,
            }}
          >
            Abbiamo elaborato le tue risposte. Inserisci la tua email per vedere
            il risultato completo e ricevere una copia del profilo da info@laureasmart.it.
          </p>

          <div
            style={{
              marginTop: 20,
              borderRadius: 24,
              padding: 16,
              background: "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(31,111,178,0.12))",
              border: "1px solid rgba(148,210,255,0.16)",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 900,
                color: "#E0F2FE",
                marginBottom: 8,
              }}
            >
              La tua email
            </label>
            <input
              className="futuro-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nome@email.it"
              inputMode="email"
              style={{
                width: "100%",
                minHeight: 56,
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.10)",
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 850,
                padding: "0 15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginTop: 14,
                color: "rgba(255,255,255,0.72)",
                fontSize: 12.5,
                lineHeight: 1.45,
                fontWeight: 700,
              }}
            >
              <input
                type="checkbox"
                checked={privacy}
                onChange={(event) => setPrivacy(event.target.checked)}
                style={{ marginTop: 2 }}
              />
              <span>
                Acconsento al trattamento dei dati secondo la Privacy Policy.
              </span>
            </label>

            {emailError && (
              <p
                style={{
                  margin: "12px 0 0",
                  color: "#FCA5A5",
                  fontSize: 13,
                  fontWeight: 850,
                }}
              >
                {emailError}
              </p>
            )}

            <button
              className="futuro-primary-button"
              type="button"
              onClick={handleEmailSubmit}
              disabled={emailSending}
              style={{
                width: "100%",
                minHeight: 56,
                borderRadius: 20,
                border: "none",
                background: "linear-gradient(135deg, #1F6FB2 0%, #2F8ED8 48%, #60C2FF 100%)",
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 950,
                marginTop: 16,
                cursor: emailSending ? "not-allowed" : "pointer",
                opacity: emailSending ? 0.78 : 1,
                boxShadow: "0 16px 34px rgba(31,111,178,0.28)",
              }}
            >
              {emailSending ? "Invio della copia in corso..." : "Mostra il mio profilo"}
            </button>
          </div>
        </section>
      )}

      {started && completed && emailConfirmed && (
        <section>
          <section
            className="futuro-result-hero"
            style={{
              borderRadius: 32,
              padding: 22,
              background: primaryGradient,
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.36)",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 22,
                background: "rgba(255,255,255,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <CheckCircle2 size={30} />
            </div>

            <p
              style={{
                margin: "0 0 8px",
                color: "rgba(255,255,255,0.76)",
                fontSize: 13,
                fontWeight: 900,
              }}
            >
              Il tuo profilo prevalente
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: 34,
                lineHeight: 1.03,
                fontWeight: 950,
                letterSpacing: "-1px",
              }}
            >
              {primaryResult.nome}
            </h1>

            <p
              style={{
                margin: "14px 0 0",
                fontSize: 16,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.90)",
                fontWeight: 800,
              }}
            >
              {primaryResult.frase}
            </p>
          </section>

          <ResultCard title="Lettura del profilo">
            <p style={paragraphStyle}>{primaryResult.descrizione}</p>
          </ResultCard>

          <ResultCard title="Profilo secondario">
            <p style={paragraphStyle}>
              Accanto al profilo principale emerge anche una componente: <strong>{secondaryResult.nome}</strong>. Questo significa che la tua scelta potrebbe funzionare meglio se tiene insieme direzione personale e vincoli pratici.
            </p>
          </ResultCard>

          <ResultCard title="Punti di forza">
            <div style={{ display: "grid", gap: 10 }}>
              {primaryResult.puntiForza.map((item) => (
                <div key={item} className="futuro-pillline" style={pillLineStyle}>
                  <CheckCircle2 size={17} color="#A7F3D0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </ResultCard>

          <ResultCard title="Mappa del profilo">
            <div style={{ display: "grid", gap: 12 }}>
              {(Object.entries(result.scores) as [ProfileKey, number][])
                .sort((a, b) => b[1] - a[1])
                .map(([key, value]) => (
                  <div key={key}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        fontSize: 12.5,
                        color: "rgba(255,255,255,0.72)",
                        fontWeight: 850,
                        marginBottom: 6,
                      }}
                    >
                      <span>{profileResults[key].nome}</span>
                      <span>{value}</span>
                    </div>
                    <div
                      style={{
                        height: 9,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.10)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.round((value / maxScore) * 100)}%`,
                          height: "100%",
                          borderRadius: 999,
                          background: "linear-gradient(90deg, #1F6FB2 0%, #2F8ED8 45%, #60C2FF 100%)",
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </ResultCard>

          <ResultCard title="Aree che potrebbero valorizzarti">
            <div style={{ display: "grid", gap: 10 }}>
              {primaryResult.aree.map((area) => (
                <div key={area} className="futuro-area" style={areaStyle}>
                  {area}
                </div>
              ))}
            </div>
          </ResultCard>

          <ResultCard title="Punto di attenzione">
            <p style={paragraphStyle}>{primaryResult.attenzione}</p>
          </ResultCard>

          <button
            className="futuro-reset"
            type="button"
            onClick={resetTest}
            style={{
              width: "100%",
              minHeight: 54,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.82)",
              fontSize: 14,
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={17} /> Rifai il test
          </button>
        </section>
      )}

      <BottomNav />
    </main>
  );
}

const paragraphStyle: React.CSSProperties = {
  margin: 0,
  color: "rgba(255,255,255,0.74)",
  fontSize: 14.5,
  lineHeight: 1.62,
  fontWeight: 650,
};

const pillLineStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 9,
  borderRadius: 18,
  padding: 12,
  background: "linear-gradient(135deg, rgba(255,255,255,0.085), rgba(31,111,178,0.13))",
  border: "1px solid rgba(148,210,255,0.14)",
  color: "rgba(255,255,255,0.82)",
  fontSize: 13.5,
  lineHeight: 1.45,
  fontWeight: 800,
};

const areaStyle: React.CSSProperties = {
  borderRadius: 18,
  padding: "12px 13px",
  background: "linear-gradient(135deg, rgba(58,160,255,0.17), rgba(255,255,255,0.07))",
  border: "1px solid rgba(120,194,255,0.22)",
  color: "#E0F2FE",
  fontSize: 13.5,
  fontWeight: 900,
};

function ResultCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="futuro-result-card"
      style={{
        borderRadius: 26,
        padding: 18,
        background: cardBackground,
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 16px 42px rgba(0,0,0,0.25)",
        marginBottom: 14,
      }}
    >
      <h2
        style={{
          margin: "0 0 12px",
          color: "#FFFFFF",
          fontSize: 19,
          fontWeight: 950,
          letterSpacing: "-0.35px",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
