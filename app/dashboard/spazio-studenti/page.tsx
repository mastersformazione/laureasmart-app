"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  CircleHelp,
  Coins,
  GraduationCap,
  MessageCircle,
  PenLine,
  RotateCcw,
  SearchCheck,
  ShieldAlert,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

const WHATSAPP_NUMBER = "393793673257";
const APPROVED_CASES_ENDPOINT =
  "https://laureasmart.it/api/spazio-studenti-casi.php";

type CasoStudente = {
  id: string;
  categoria: string;
  domanda: string;
  nome_pubblico?: string;
  foto_url?: string;
  breve: string;
  risposta: string;
  prossimoPasso: string;
  ctaLabel: string;
  href?: string;
  whatsapp?: boolean;
  icon: "cfu" | "lavoro" | "scelta" | "concorsi" | "cambio" | "paura" | "costi";
  fonte?: "iniziale" | "utente";
};

type ApprovedCaseApi = {
  id: string;
  nome_pubblico?: string;
  categoria?: string;
  titolo?: string;
  contenuto?: string;
  foto_url?: string;
  risposta_laurea_smart?: string;
  prossimo_passo?: string;
  cta_label?: string;
  cta_href?: string;
  cta_whatsapp?: string;
};

const casiIniziali: CasoStudente[] = [
  {
    id: "esami-cfu",
    categoria: "Esami e CFU",
    domanda: "Ho già fatto esami: posso recuperarli?",
    nome_pubblico: "Marco, 33 anni",
    breve: "Ho fatto alcuni esami anni fa e non so se devo ripartire da zero.",
    risposta:
      "Non è detto che tu debba ricominciare da capo. Gli esami già sostenuti possono essere valutati, ma il riconoscimento dipende dal percorso, dai programmi e dall’ateneo.",
    prossimoPasso:
      "Carica foto, screenshot, certificati o descrivi gli esami che hai sostenuto.",
    ctaLabel: "Valuta quello che hai già fatto",
    href: "/dashboard/valuta-quello-che-hai-fatto",
    icon: "cfu",
    fonte: "iniziale",
  },
  {
    id: "studio-lavoro",
    categoria: "Studio e lavoro",
    domanda: "Studio e lavoro: come organizzarmi?",
    nome_pubblico: "Andrea, 38 anni",
    breve: "Lavoro full time e ho paura di non riuscire a preparare gli esami.",
    risposta:
      "La scelta dovrebbe considerare tempo disponibile, modalità degli esami, supporto, ritmo di studio e flessibilità. Non sempre il corso più interessante è anche quello più sostenibile.",
    prossimoPasso:
      "Usa la checklist “Prima di scegliere” per capire quali criteri contano davvero.",
    ctaLabel: "Prima di scegliere",
    href: "/dashboard/prima-di-scegliere",
    icon: "lavoro",
    fonte: "iniziale",
  },
  {
    id: "percorso-scegliere",
    categoria: "Scelta del percorso",
    domanda: "Non so quale percorso scegliere",
    nome_pubblico: "Chiara, 24 anni",
    breve:
      "Mi interessano più aree, ma non capisco quale sia più adatta a me.",
    risposta:
      "Quando hai dubbi tra più direzioni, conviene partire dal profilo: obiettivi, interessi, vincoli, modo di studiare e prospettive future.",
    prossimoPasso:
      "Fai il test sul futuro e poi confronta le possibilità più coerenti.",
    ctaLabel: "Fai il test sul futuro",
    href: "/dashboard/orientamento/futuro",
    icon: "scelta",
    fonte: "iniziale",
  },
  {
    id: "concorsi",
    categoria: "Concorsi e carriera",
    domanda: "Voglio laurearmi per concorsi",
    nome_pubblico: "Roberto, 39 anni",
    breve:
      "Mi serve una laurea per partecipare a concorsi pubblici e non so da dove partire.",
    risposta:
      "In questo caso è utile valutare classe di laurea, obiettivo, tempi, costi, sostenibilità e possibili crediti o titoli già posseduti.",
    prossimoPasso:
      "Chiedi un confronto tra più percorsi e più atenei in base al tuo obiettivo.",
    ctaLabel: "Voglio confrontare le mie possibilità",
    whatsapp: true,
    icon: "concorsi",
    fonte: "iniziale",
  },
  {
    id: "cambiare-universita",
    categoria: "Cambio università",
    domanda: "Vorrei cambiare università",
    nome_pubblico: "Giorgia, 25 anni",
    breve:
      "Sono iscritta a un ateneo ma non mi trovo bene. Posso cambiare senza perdere tutto?",
    risposta:
      "Prima di decidere, è utile verificare se gli esami già sostenuti possono essere valutati e se esistono percorsi più adatti alla tua situazione attuale.",
    prossimoPasso:
      "Carica o descrivi il tuo percorso precedente per preparare una valutazione orientativa.",
    ctaLabel: "Carica o descrivi il percorso",
    href: "/dashboard/valuta-quello-che-hai-fatto",
    icon: "cambio",
    fonte: "iniziale",
  },
  {
    id: "paura-studiare",
    categoria: "Dubbi e blocchi",
    domanda: "Ho paura di non riuscire a studiare",
    nome_pubblico: "Silvia, 37 anni",
    breve: "Non studio da anni e temo di non riuscire a riprendere il ritmo.",
    risposta:
      "È un dubbio normale. Per ridurlo, bisogna confrontare percorsi anche per ritmo, supporto, modalità di studio e compatibilità con la vita reale.",
    prossimoPasso:
      "Prima di scegliere, individua quali aspetti ti preoccupano di più.",
    ctaLabel: "Capisci cosa valutare",
    href: "/dashboard/prima-di-scegliere",
    icon: "paura",
    fonte: "iniziale",
  },
  {
    id: "costi",
    categoria: "Costi",
    domanda: "Quanto costa davvero iniziare?",
    nome_pubblico: "Stefano, 29 anni",
    breve: "Vorrei capire il costo reale: retta, rate, tasse e altri costi.",
    risposta:
      "Prima di decidere, conviene confrontare il costo reale insieme a durata stimata, eventuali crediti riconosciuti, supporto, modalità degli esami e obiettivo finale.",
    prossimoPasso:
      "Seleziona i criteri che vuoi confrontare e poi chiedi una valutazione personalizzata.",
    ctaLabel: "Prima di scegliere",
    href: "/dashboard/prima-di-scegliere",
    icon: "costi",
    fonte: "iniziale",
  },
];

const iconMap = {
  cfu: BookOpenCheck,
  lavoro: BriefcaseBusiness,
  scelta: SearchCheck,
  concorsi: GraduationCap,
  cambio: RotateCcw,
  paura: ShieldAlert,
  costi: Coins,
};

const categorieBase = [
  "Tutti",
  "Esami e CFU",
  "Studio e lavoro",
  "Scelta del percorso",
  "Concorsi e carriera",
  "Cambio università",
  "Dubbi e blocchi",
  "Costi",
];

function categoriaToIcon(categoria: string): CasoStudente["icon"] {
  const lower = categoria.toLowerCase();

  if (lower.includes("cfu") || lower.includes("esami")) return "cfu";
  if (lower.includes("lavoro")) return "lavoro";
  if (lower.includes("concorsi")) return "concorsi";
  if (lower.includes("cambiare") || lower.includes("università")) return "cambio";
  if (lower.includes("paura")) return "paura";
  if (lower.includes("costo") || lower.includes("costa")) return "costi";

  return "scelta";
}

function normalizzaCasoApprovato(caso: ApprovedCaseApi): CasoStudente {
  const categoria = caso.categoria || "Caso studente";

  return {
    id: caso.id,
    categoria,
    domanda: caso.titolo || "Caso inviato da uno studente",
    nome_pubblico: caso.nome_pubblico || "Studente Laurea Smart",
    foto_url: caso.foto_url,
    breve: caso.contenuto || "",
    risposta:
      caso.risposta_laurea_smart ||
      "Questo caso è stato inviato da un utente e approvato da Laurea Smart. Può aiutarti a riconoscere una situazione simile alla tua e capire quale passaggio fare.",
    prossimoPasso:
      caso.prossimo_passo ||
      "Se questo caso somiglia al tuo, puoi chiedere un confronto personalizzato oppure usare una delle funzioni guidate dell’app.",
    ctaLabel: caso.cta_label || "Voglio confrontare le mie possibilità",
    href: caso.cta_href || undefined,
    whatsapp: caso.cta_whatsapp === "1" || !caso.cta_href,
    icon: categoriaToIcon(categoria),
    fonte: "utente",
  };
}

export default function SpazioStudentiPage() {
  const router = useRouter();
  const [categoriaAttiva, setCategoriaAttiva] = useState("Tutti");
  const [casiApprovati, setCasiApprovati] = useState<CasoStudente[]>([]);
  const [loadingApproved, setLoadingApproved] = useState(false);

  useEffect(() => {
    const loadApprovedCases = async () => {
      setLoadingApproved(true);

      try {
        const res = await fetch(APPROVED_CASES_ENDPOINT, {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (data?.success && Array.isArray(data.cases)) {
          setCasiApprovati(data.cases.map(normalizzaCasoApprovato));
        }
      } catch (error) {
        console.error("Errore caricamento casi approvati", error);
      } finally {
        setLoadingApproved(false);
      }
    };

    loadApprovedCases();
  }, []);

  const tuttiICasi = useMemo(
    () => [...casiApprovati, ...casiIniziali],
    [casiApprovati]
  );

  const categorie = useMemo(() => {
    const dynamicCategories = tuttiICasi.map((caso) => caso.categoria);
    return Array.from(new Set([...categorieBase, ...dynamicCategories]));
  }, [tuttiICasi]);

  const casiFiltrati = useMemo(() => {
    if (categoriaAttiva === "Tutti") return tuttiICasi;
    return tuttiICasi.filter((caso) => caso.categoria === categoriaAttiva);
  }, [categoriaAttiva, tuttiICasi]);

  const apriWhatsApp = (caso: CasoStudente) => {
    const messaggio = `Ciao, sto leggendo lo Spazio Studenti di Laurea Smart. Il caso che mi interessa è: “${caso.domanda}”. Vorrei confrontare le mie possibilità.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      messaggio
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCta = (caso: CasoStudente) => {
    if (caso.whatsapp) {
      apriWhatsApp(caso);
      return;
    }

    if (caso.href) {
      router.push(caso.href);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1F6FB2_0%,#0B1728_42%,#07111F_100%)] px-4 py-6 text-white">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/12"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna indietro
        </button>

        <section className="relative overflow-hidden rounded-[34px] border border-sky-300/25 bg-gradient-to-br from-sky-300/18 via-white/8 to-white/[0.03] p-5 shadow-[0_30px_90px_rgba(15,23,42,0.35)]">
          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200/25 bg-sky-100/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-sky-100">
              <Sparkles className="h-3.5 w-3.5" />
              Casi e dubbi reali
            </div>

            <h1 className="text-[34px] font-black leading-[0.98] tracking-tight sm:text-5xl">
              Spazio Studenti
            </h1>

            <p className="mt-4 text-[16px] leading-7 text-slate-100/88">
              Trova domande e situazioni simili alla tua. I casi sono guidati da
              Laurea Smart e ti aiutano a capire quale prossimo passo può essere
              più utile prima di scegliere.
            </p>

            <button
              type="button"
              onClick={() => router.push("/dashboard/spazio-studenti/racconta")}
              className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-200 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_18px_42px_rgba(56,189,248,0.25)] transition hover:-translate-y-0.5"
            >
              <PenLine className="h-5 w-5" />
              Racconta il tuo caso
            </button>

            <div className="mt-5 rounded-3xl border border-cyan-200/18 bg-cyan-200/10 p-4">
              <div className="flex items-start gap-3">
                <UsersRound className="mt-0.5 h-5 w-5 shrink-0 text-cyan-100" />
                <p className="text-sm leading-6 text-slate-100/86">
                  Non è un forum libero: è uno spazio ordinato con problemi
                  frequenti, risposte brevi e casi approvati da Laurea Smart.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categorie.map((categoria) => {
              const active = categoriaAttiva === categoria;

              return (
                <button
                  key={categoria}
                  type="button"
                  onClick={() => setCategoriaAttiva(categoria)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black transition ${
                    active
                      ? "border-sky-200/45 bg-sky-200 text-slate-950"
                      : "border-white/10 bg-white/[0.07] text-slate-100 hover:bg-white/12"
                  }`}
                >
                  {categoria}
                </button>
              );
            })}
          </div>

          {loadingApproved && (
            <p className="mt-2 text-sm text-slate-300">
              Caricamento casi approvati...
            </p>
          )}
        </section>

        <section className="mt-4 grid gap-4">
          {casiFiltrati.map((caso) => {
            const Icon = iconMap[caso.icon];

            return (
              <article
                key={caso.id}
                className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-sky-200/25 hover:bg-white/[0.09]"
              >
                <div className="mb-4 flex items-start gap-3">
                  {caso.foto_url ? (
                    <img
                      src={caso.foto_url}
                      alt={caso.nome_pubblico || "Studente Laurea Smart"}
                      className="h-12 w-12 shrink-0 rounded-2xl border border-sky-200/20 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-300/15 text-sky-100 ring-1 ring-sky-200/20">
                      <Icon className="h-6 w-6" />
                    </div>
                  )}

                  <div>
                    <p className="mb-1 text-[11px] font-black uppercase tracking-[0.16em] text-sky-100">
                      {caso.categoria}
                    </p>
                    <h2 className="text-xl font-black leading-tight text-white">
                      {caso.domanda}
                    </h2>
                    <p className="mt-1 text-xs font-bold text-slate-300/80">
                      {caso.nome_pubblico || "Studente Laurea Smart"}
                      {caso.fonte === "utente"
                        ? " · caso approvato"
                        : " · caso frequente"}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-200/76">
                      {caso.breve}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#061827]/60 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-black text-white">
                    <CircleHelp className="h-4 w-4 text-sky-100" />
                    Risposta Laurea Smart
                  </div>
                  <p className="text-sm leading-6 text-slate-200/82">
                    {caso.risposta}
                  </p>
                </div>

                <div className="mt-3 rounded-3xl border border-cyan-200/18 bg-cyan-200/10 p-4">
                  <p className="text-sm font-black text-cyan-100">
                    Prossimo passo consigliato
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-200/82">
                    {caso.prossimoPasso}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCta(caso)}
                  className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-200 px-5 py-3 text-center text-sm font-black text-slate-950 shadow-[0_16px_34px_rgba(56,189,248,0.22)] transition hover:-translate-y-0.5"
                >
                  {caso.whatsapp && <MessageCircle className="h-5 w-5" />}
                  {caso.ctaLabel}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
