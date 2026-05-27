"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  GitCompareArrows,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const WHATSAPP_NUMBER = "393793673257";

type StatoConfronto =
  | "non_richiesto"
  | "whatsapp_aperto"
  | "messaggio_inviato"
  | "da_completare";

const STORAGE_KEY = "confronto_possibilita_stato";

export default function ConfrontoPossibilitaCard() {
  const [statoConfronto, setStatoConfronto] =
    useState<StatoConfronto>("non_richiesto");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as StatoConfronto | null;

      // Compatibilità con la vecchia chiave usata nelle versioni precedenti.
      const oldSaved = localStorage.getItem("confronto_possibilita_richiesto");

      if (
        saved === "non_richiesto" ||
        saved === "whatsapp_aperto" ||
        saved === "messaggio_inviato" ||
        saved === "da_completare"
      ) {
        setStatoConfronto(saved);
        return;
      }

      if (oldSaved === "si") {
        setStatoConfronto("whatsapp_aperto");
        localStorage.setItem(STORAGE_KEY, "whatsapp_aperto");
      }
    } catch {
      setStatoConfronto("non_richiesto");
    }
  }, []);

  const salvaStato = (stato: StatoConfronto) => {
    setStatoConfronto(stato);

    try {
      localStorage.setItem(STORAGE_KEY, stato);

      // Manteniamo anche la vecchia chiave per non rompere nulla nel caso
      // venisse letta altrove in futuro.
      if (stato === "non_richiesto") {
        localStorage.removeItem("confronto_possibilita_richiesto");
      } else {
        localStorage.setItem("confronto_possibilita_richiesto", "si");
      }
    } catch {
      // Lo stato visivo resta aggiornato anche se localStorage non è disponibile.
    }
  };

  const apriWhatsApp = () => {
    salvaStato("whatsapp_aperto");

    const messaggio =
      "Ciao, vorrei confrontare le mie possibilità su Laurea Smart. Vorrei capire quali percorsi e quali atenei potrebbero essere più adatti alla mia situazione.";

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      messaggio
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const statoUI = {
    non_richiesto: {
      label: "Stato: confronto non ancora richiesto",
      title: "Avvia il confronto personalizzato",
      text: "Apri WhatsApp e invia la richiesta: il messaggio è già pronto.",
      button: "Voglio confrontare le mie possibilità",
      tone:
        "bg-white/10 text-slate-100 ring-white/15 border-white/15",
    },
    whatsapp_aperto: {
      label: "Stato: richiesta avviata",
      title: "Hai aperto il contatto con Laurea Smart",
      text: "Se non hai ancora inviato il messaggio su WhatsApp, puoi riprenderlo da qui.",
      button: "Riprendi il contatto",
      tone:
        "bg-amber-300/16 text-amber-100 ring-amber-200/30 border-amber-200/20",
    },
    messaggio_inviato: {
      label: "Stato: messaggio inviato",
      title: "Messaggio inviato",
      text: "Perfetto. Ora attendi il riscontro dell’orientatore. Puoi comunque riaprire WhatsApp quando vuoi.",
      button: "Apri di nuovo WhatsApp",
      tone:
        "bg-emerald-400/16 text-emerald-100 ring-emerald-300/30 border-emerald-300/20",
    },
    da_completare: {
      label: "Stato: contatto da completare",
      title: "Contatto da completare",
      text: "Hai già aperto WhatsApp, ma potresti non aver inviato il messaggio. Puoi completare la richiesta quando vuoi.",
      button: "Completa il contatto",
      tone:
        "bg-orange-300/16 text-orange-100 ring-orange-200/30 border-orange-200/20",
    },
  }[statoConfronto];

  const mostraFeedback =
    statoConfronto === "whatsapp_aperto" || statoConfronto === "da_completare";

  return (
    <section className="relative mb-5 overflow-hidden rounded-[34px] bg-gradient-to-br from-sky-300/55 via-blue-500/35 to-indigo-500/35 p-[1px] shadow-[0_30px_90px_rgba(14,165,233,0.25)]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[33px] bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_34%),linear-gradient(135deg,#164A78_0%,#0B1728_48%,#06111F_100%)] p-5 text-white sm:p-6">
        <div className="mb-5 flex items-start gap-4">
          <div className="relative hidden shrink-0 min-[420px]:block">
            <div className="absolute inset-0 rounded-3xl bg-sky-300/40 blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-sky-200/35 bg-sky-300/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
              <GitCompareArrows className="h-8 w-8 text-sky-100" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/30 bg-sky-100/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-sky-100">
                <Sparkles className="h-3.5 w-3.5" />
                Consigliato
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-100">
                Scelta guidata
              </span>

              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold ring-1 ${statoUI.tone}`}
              >
                {statoUI.label}
              </span>
            </div>

            <div className="flex items-center gap-3 min-[420px]:block">
              <div className="relative shrink-0 min-[420px]:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-200/35 bg-sky-300/15">
                  <GitCompareArrows className="h-6 w-6 text-sky-100" />
                </div>
              </div>

              <h2 className="text-[31px] font-black leading-[0.98] tracking-tight text-white sm:text-4xl">
                Le tue possibilità
              </h2>
            </div>

            <p className="mt-4 max-w-2xl text-[16px] leading-7 text-slate-100/90">
              In base al tuo profilo, potrebbero esserci più percorsi e più
              atenei adatti alla tua situazione. Laurea Smart può aiutarti a
              confrontarli valutando tempi, costi, modalità di studio, supporto
              e obiettivi futuri.
            </p>
          </div>
        </div>

        <div className="mb-5 rounded-3xl border border-sky-200/18 bg-white/[0.07] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur">
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-sky-100">
            <ShieldCheck className="h-4 w-4" />
            Cosa confrontiamo per te
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <div className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-[#071827]/70 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-sky-200/30 hover:bg-[#0A2237] hover:shadow-[0_18px_42px_rgba(56,189,248,0.16)] lg:block">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-300/15 text-sky-100 ring-1 ring-sky-200/20 transition duration-300 group-hover:scale-105 group-hover:bg-sky-300/22 lg:mb-3">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[17px] font-black leading-snug text-white">
                  Due o più percorsi
                </h3>
                <p className="mt-1 text-[13px] leading-5 text-slate-200/78 lg:mt-2">
                  Possibilità compatibili con il tuo profilo.
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-[#071827]/70 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-sky-200/30 hover:bg-[#0A2237] hover:shadow-[0_18px_42px_rgba(56,189,248,0.16)] lg:block">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-300/15 text-sky-100 ring-1 ring-sky-200/20 transition duration-300 group-hover:scale-105 group-hover:bg-sky-300/22 lg:mb-3">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[17px] font-black leading-snug text-white">
                  Due o più atenei
                </h3>
                <p className="mt-1 text-[13px] leading-5 text-slate-200/78 lg:mt-2">
                  Alternative da confrontare prima di scegliere.
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-[#071827]/70 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-sky-200/30 hover:bg-[#0A2237] hover:shadow-[0_18px_42px_rgba(56,189,248,0.16)] lg:block">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-300/15 text-sky-100 ring-1 ring-sky-200/20 transition duration-300 group-hover:scale-105 group-hover:bg-sky-300/22 lg:mb-3">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[17px] font-black leading-snug text-white">
                  Tempi, costi e supporto
                </h3>
                <p className="mt-1 text-[13px] leading-5 text-slate-200/78 lg:mt-2">
                  Valutazione più chiara della tua situazione.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-200/20 bg-gradient-to-r from-cyan-200/13 via-sky-300/10 to-blue-400/10 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-200/15 text-cyan-100 ring-1 ring-cyan-100/20">
                {statoConfronto === "messaggio_inviato" ? (
                  <MessageCircle className="h-5 w-5" />
                ) : statoConfronto === "da_completare" ? (
                  <RotateCcw className="h-5 w-5" />
                ) : (
                  <Zap className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-black text-white">
                  {statoUI.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-200/78">
                  {statoUI.text}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={apriWhatsApp}
              className="group inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-200 px-5 py-3 text-center text-[15px] font-black leading-tight text-slate-950 shadow-[0_18px_42px_rgba(56,189,248,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(56,189,248,0.42)] active:translate-y-0 lg:w-auto"
            >
              <span>{statoUI.button}</span>
              <ArrowRight className="h-5 w-5 shrink-0 transition duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {mostraFeedback && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-[#061827]/55 p-4">
              <p className="mb-3 text-sm font-black text-white">
                Com’è andato il contatto?
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => salvaStato("messaggio_inviato")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/25 bg-emerald-300/12 px-4 py-3 text-sm font-extrabold text-emerald-100 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-300/18"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Ho inviato il messaggio
                </button>

                <button
                  type="button"
                  onClick={() => salvaStato("da_completare")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-300/25 bg-orange-300/12 px-4 py-3 text-sm font-extrabold text-orange-100 transition duration-300 hover:-translate-y-0.5 hover:bg-orange-300/18"
                >
                  <RotateCcw className="h-4 w-4" />
                  Non l’ho ancora inviato
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
