"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  GitCompareArrows,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const WHATSAPP_NUMBER = "393793673257";

export default function ConfrontoPossibilitaCard() {
  const [confrontoRichiesto, setConfrontoRichiesto] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("confronto_possibilita_richiesto");
      setConfrontoRichiesto(saved === "si");
    } catch {
      setConfrontoRichiesto(false);
    }
  }, []);

  const apriWhatsApp = () => {
    try {
      localStorage.setItem("confronto_possibilita_richiesto", "si");
      setConfrontoRichiesto(true);
    } catch {
      // Non blocca l'apertura di WhatsApp se localStorage non è disponibile.
    }

    const messaggio =
      "Ciao, vorrei confrontare le mie possibilità su Laurea Smart. Vorrei capire quali percorsi e quali atenei potrebbero essere più adatti alla mia situazione.";

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      messaggio
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative mb-5 overflow-hidden rounded-[34px] bg-gradient-to-br from-sky-300/55 via-blue-500/35 to-indigo-500/35 p-[1px] shadow-[0_30px_90px_rgba(14,165,233,0.25)]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[33px] bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_34%),linear-gradient(135deg,#164A78_0%,#0B1728_48%,#06111F_100%)] p-5 text-white sm:p-6">
        <div className="absolute right-5 top-5 hidden rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-sky-100 backdrop-blur sm:block">
          Scelta guidata
        </div>

        <div className="mb-5 flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-3xl bg-sky-300/40 blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-sky-200/35 bg-sky-300/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
              <GitCompareArrows className="h-8 w-8 text-sky-100" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/30 bg-sky-100/12 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-sky-100">
                <Sparkles className="h-3.5 w-3.5" />
                Consigliato
              </span>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${
                  confrontoRichiesto
                    ? "bg-emerald-400/16 text-emerald-100 ring-emerald-300/30"
                    : "bg-white/10 text-slate-100 ring-white/15"
                }`}
              >
                {confrontoRichiesto
                  ? "Stato: confronto richiesto"
                  : "Stato: confronto non ancora richiesto"}
              </span>
            </div>

            <h2 className="text-[32px] font-black leading-[0.98] tracking-tight text-white sm:text-4xl">
              Le tue possibilità
            </h2>

            <p className="mt-3 max-w-2xl text-[16px] leading-7 text-slate-100/90">
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

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="group rounded-2xl border border-white/10 bg-[#071827]/70 p-4 transition duration-300 hover:-translate-y-1 hover:border-sky-200/30 hover:bg-[#0A2237] hover:shadow-[0_18px_42px_rgba(56,189,248,0.16)]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-300/15 text-sky-100 ring-1 ring-sky-200/20 transition duration-300 group-hover:scale-105 group-hover:bg-sky-300/22">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-[18px] font-black leading-tight text-white">
                Due o più percorsi
              </h3>
              <p className="mt-2 text-[13px] leading-5 text-slate-200/78">
                Possibilità compatibili con il tuo profilo.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-[#071827]/70 p-4 transition duration-300 hover:-translate-y-1 hover:border-sky-200/30 hover:bg-[#0A2237] hover:shadow-[0_18px_42px_rgba(56,189,248,0.16)]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-300/15 text-sky-100 ring-1 ring-sky-200/20 transition duration-300 group-hover:scale-105 group-hover:bg-sky-300/22">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-[18px] font-black leading-tight text-white">
                Due o più atenei
              </h3>
              <p className="mt-2 text-[13px] leading-5 text-slate-200/78">
                Alternative da confrontare prima di scegliere.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-[#071827]/70 p-4 transition duration-300 hover:-translate-y-1 hover:border-sky-200/30 hover:bg-[#0A2237] hover:shadow-[0_18px_42px_rgba(56,189,248,0.16)]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-300/15 text-sky-100 ring-1 ring-sky-200/20 transition duration-300 group-hover:scale-105 group-hover:bg-sky-300/22">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-[18px] font-black leading-tight text-white">
                Tempi, costi e supporto
              </h3>
              <p className="mt-2 text-[13px] leading-5 text-slate-200/78">
                Valutazione più chiara della tua situazione.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-200/20 bg-gradient-to-r from-cyan-200/13 via-sky-300/10 to-blue-400/10 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-200/15 text-cyan-100 ring-1 ring-cyan-100/20">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-white">
                  Avvia il confronto personalizzato
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-200/78">
                  Apri WhatsApp e invia la richiesta: il messaggio è già pronto.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={apriWhatsApp}
              className="group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-200 px-5 py-3 text-[15px] font-black text-slate-950 shadow-[0_18px_42px_rgba(56,189,248,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(56,189,248,0.42)] active:translate-y-0"
            >
              Voglio confrontare le mie possibilità
              <ArrowRight className="h-5 w-5 transition duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
