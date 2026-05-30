"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/ui/BottomNav";
import AppBadge from "@/components/ui/AppBadge";
import AppButton from "@/components/ui/AppButton";
import AppCard from "@/components/ui/AppCard";
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
  cta_whatsapp?: string | number | boolean;
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
    breve: "Mi interessano più aree, ma non capisco quale sia più adatta a me.",
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
  if (lower.includes("cambiare") || lower.includes("università"))
    return "cambio";
  if (lower.includes("paura")) return "paura";
  if (lower.includes("costo") || lower.includes("costa")) return "costi";

  return "scelta";
}

function normalizzaCasoApprovato(caso: ApprovedCaseApi): CasoStudente {
  const categoria = caso.categoria || "Caso studente";
  const ctaWhatsapp =
    caso.cta_whatsapp === true ||
    caso.cta_whatsapp === 1 ||
    caso.cta_whatsapp === "1";

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
    whatsapp: ctaWhatsapp || !caso.cta_href,
    icon: categoriaToIcon(categoria),
    fonte: "utente",
  };
}

function getCaseVariant(index: number, caso: CasoStudente) {
  if (caso.fonte === "utente") return "purple" as const;

  const variants = ["white", "blue", "cyan", "green", "amber"] as const;
  return variants[index % variants.length];
}

function getBadgeVariant(caso: CasoStudente) {
  if (caso.fonte === "utente") return "purple" as const;
  if (caso.icon === "costi") return "amber" as const;
  if (caso.icon === "paura") return "red" as const;
  if (caso.icon === "cfu") return "green" as const;
  return "blue" as const;
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
    <main className="ls-dark-page">
      <div className="ls-page-container max-w-3xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/12"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna indietro
        </button>

        <AppCard
          variant="dark"
          badge="Casi e dubbi reali"
          icon={<Sparkles className="h-6 w-6" />}
          title="Spazio Studenti"
          description="Trova domande e situazioni simili alla tua. I casi sono guidati da Laurea Smart e ti aiutano a capire quale prossimo passo può essere più utile prima di scegliere."
        >
          <div style={{ display: "grid", gap: 14 }}>
            <AppButton
              type="button"
              onClick={() => router.push("/dashboard/spazio-studenti/racconta")}
            >
              <PenLine className="h-5 w-5" />
              Racconta il tuo caso
            </AppButton>

            <div
              style={{
                borderRadius: 22,
                border: "1px solid rgba(125,211,252,0.22)",
                background: "rgba(232,247,251,0.12)",
                padding: 16,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
              >
                <UsersRound
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: "#BAE6FD" }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.86)",
                    fontWeight: 550,
                  }}
                >
                  Non è un forum libero: è uno spazio ordinato con problemi
                  frequenti, risposte brevi e casi approvati da Laurea Smart.
                </p>
              </div>
            </div>
          </div>
        </AppCard>

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
            <p className="mt-2 text-sm font-bold text-slate-300">
              Caricamento casi approvati...
            </p>
          )}
        </section>

        <section className="mt-4 grid gap-4">
          {casiFiltrati.map((caso, index) => {
            const Icon = iconMap[caso.icon];
            const variant = getCaseVariant(index, caso);
            const badgeVariant = getBadgeVariant(caso);

            return (
              <AppCard key={caso.id} variant={variant}>
                <div className="mb-4 flex items-start gap-3">
                  {caso.foto_url ? (
                    <img
                      src={caso.foto_url}
                      alt={caso.nome_pubblico || "Studente Laurea Smart"}
                      className="h-12 w-12 shrink-0 rounded-2xl border border-sky-200/20 object-cover"
                    />
                  ) : (
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 18,
                        background: "rgba(31,111,178,0.12)",
                        color: "var(--ls-primary)",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  )}

                  <div style={{ minWidth: 0 }}>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <AppBadge variant={badgeVariant}>
                        {caso.categoria}
                      </AppBadge>
                      <AppBadge
                        variant={caso.fonte === "utente" ? "purple" : "gray"}
                      >
                        {caso.fonte === "utente"
                          ? "Caso approvato"
                          : "Caso frequente"}
                      </AppBadge>
                    </div>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: 22,
                        lineHeight: 1.18,
                        letterSpacing: "-0.035em",
                        fontWeight: 900,
                        color: "var(--ls-text)",
                      }}
                    >
                      {caso.domanda}
                    </h2>

                    <p
                      style={{
                        margin: "7px 0 0",
                        fontSize: 13,
                        lineHeight: 1.4,
                        fontWeight: 800,
                        color: "var(--ls-muted)",
                      }}
                    >
                      {caso.nome_pubblico || "Studente Laurea Smart"}
                    </p>

                    <p
                      style={{
                        margin: "10px 0 0",
                        whiteSpace: "pre-wrap",
                        fontSize: 15,
                        lineHeight: 1.62,
                        color: "var(--ls-text-soft)",
                        fontWeight: 520,
                      }}
                    >
                      {caso.breve}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: 22,
                    border: "1px solid rgba(31,111,178,0.12)",
                    background: "#FFFFFF",
                    padding: 16,
                    boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
                  }}
                >
                  <div
                    style={{
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 14,
                      fontWeight: 900,
                      color: "var(--ls-primary)",
                    }}
                  >
                    <CircleHelp className="h-4 w-4" />
                    Risposta Laurea Smart
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 15,
                      lineHeight: 1.62,
                      color: "var(--ls-text-soft)",
                      fontWeight: 520,
                    }}
                  >
                    {caso.risposta}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 12,
                    borderRadius: 22,
                    border: "1px solid var(--ls-cyan-border)",
                    background: "var(--ls-cyan-soft)",
                    padding: 16,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 900,
                      color: "var(--ls-cyan-text)",
                    }}
                  >
                    Prossimo passo consigliato
                  </p>
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: 15,
                      lineHeight: 1.62,
                      color: "var(--ls-text-soft)",
                      fontWeight: 520,
                    }}
                  >
                    {caso.prossimoPasso}
                  </p>
                </div>

                <div className="mt-4">
                  <AppButton type="button" onClick={() => handleCta(caso)}>
                    {caso.whatsapp && <MessageCircle className="h-5 w-5" />}
                    {caso.ctaLabel}
                    <ArrowRight className="h-5 w-5" />
                  </AppButton>
                </div>
              </AppCard>
            );
          })}
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
