"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  GitCompareArrows,
  Sparkles,
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
    <section className="relative overflow-hidden rounded-[28px] border border-sky-300/25 bg-gradient-to-br from-[#123B63] via-[#0B1728] to-[#06111F] p-[1px] shadow-[0_22px_70px_rgba(15,23,42,0.45)]">
      <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-sky-400/25 blur-3xl" />
      <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-blue-600/25 blur-3xl" />

      <div className="relative rounded-[27px] bg-gradient-to-br from-white/12 via-white/7 to-white/[0.03] p-5 text-white backdrop-blur-xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-300/15 ring-1 ring-sky-200/25">
              <GitCompareArrows className="h-6 w-6 text-sky-200" />
            </div>

            <div>
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-sky-200/25 bg-sky-100/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-100">
                <Sparkles className="h-3.5 w-3.5" />
                Consigliato
              </div>

              <h2 className="text-2xl font-black tracking-tight text-white">
                Le tue possibilità
              </h2>
            </div>
          </div>

          <div
            className={`hidden rounded-full px-3 py-1.5 text-xs font-bold ring-1 sm:inline-flex ${
              confrontoRichiesto
                ? "bg-emerald-400/15 text-emerald-100 ring-emerald-300/25"
                : "bg-white/10 text-slate-100 ring-white/15"
            }`}
          >
            {confrontoRichiesto
              ? "Confronto richiesto"
              : "Confronto non ancora richiesto"}
          </div>
        </div>

        <p className="mb-5 max-w-2xl text-[15px] leading-7 text-slate-100/90">
          In base al tuo profilo, potrebbero esserci più percorsi e più atenei
          adatti alla tua situazione. Laurea Smart può aiutarti a confrontarli
          valutando tempi, costi, modalità di studio, supporto e obiettivi
          futuri.
        </p>

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/8 p-3 transition duration-300 hover:-translate-y-0.5 hover:bg-white/12 hover:shadow-lg">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
              <CheckCircle2 className="h-4 w-4 text-sky-200" />
              Due o più percorsi
            </div>
            <p className="text-xs leading-5 text-slate-200/80">
              Possibilità compatibili con il tuo profilo.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/8 p-3 transition duration-300 hover:-translate-y-0.5 hover:bg-white/12 hover:shadow-lg">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
              <CheckCircle2 className="h-4 w-4 text-sky-200" />
              Due o più atenei
            </div>
            <p className="text-xs leading-5 text-slate-200/80">
              Alternative da confrontare prima di scegliere.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/8 p-3 transition duration-300 hover:-translate-y-0.5 hover:bg-white/12 hover:shadow-lg">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
              <CheckCircle2 className="h-4 w-4 text-sky-200" />
              Tempi, costi e supporto
            </div>
            <p className="text-xs leading-5 text-slate-200/80">
              Valutazione più chiara della tua situazione.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-bold ring-1 sm:hidden ${
              confrontoRichiesto
                ? "bg-emerald-400/15 text-emerald-100 ring-emerald-300/25"
                : "bg-white/10 text-slate-100 ring-white/15"
            }`}
          >
            Stato:{" "}
            {confrontoRichiesto
              ? "confronto richiesto"
              : "confronto non ancora richiesto"}
          </div>

          <button
            type="button"
            onClick={apriWhatsApp}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-200 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_14px_35px_rgba(56,189,248,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(56,189,248,0.38)] active:translate-y-0"
          >
            Voglio confrontare le mie possibilità
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
