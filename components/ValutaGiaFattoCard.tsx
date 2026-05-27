"use client";

import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ValutaGiaFattoCard() {
  const router = useRouter();

  return (
    <section className="relative mb-5 overflow-hidden rounded-[32px] bg-gradient-to-br from-cyan-300/45 via-sky-500/30 to-blue-700/35 p-[1px] shadow-[0_24px_70px_rgba(14,165,233,0.18)]">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-blue-600/25 blur-3xl" />

      <div className="relative rounded-[31px] bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.22),transparent_34%),linear-gradient(135deg,#123B63_0%,#0B1728_52%,#06111F_100%)] p-5 text-white sm:p-6">
        <div className="mb-4 flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-3xl bg-cyan-300/35 blur-xl" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-3xl border border-cyan-100/30 bg-cyan-200/14">
              <FileSearch className="h-7 w-7 text-cyan-100" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-100/25 bg-cyan-100/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" />
              Percorso più breve
            </div>

            <h2 className="text-[29px] font-black leading-[1.02] tracking-tight text-white sm:text-4xl">
              Valuta quello che hai già fatto
            </h2>

            <p className="mt-3 text-[15px] leading-7 text-slate-100/88">
              Esami sostenuti, certificazioni, titoli, CV o esperienze possono
              avere valore. Carica documenti, foto o scrivi semplicemente cosa
              vorresti farti riconoscere: Laurea Smart può aiutarti a far
              valutare il tuo percorso ad almeno due atenei.
            </p>
          </div>
        </div>

        <div className="mb-5 rounded-3xl border border-white/10 bg-white/[0.07] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-cyan-100">
            <GraduationCap className="h-4 w-4" />
            Perché può aiutarti ad accorciare il percorso?
          </div>

          <div className="grid gap-3">
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#061827]/60 p-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-100" />
              <p className="text-sm leading-6 text-slate-200/82">
                Se alcuni esami, titoli o certificazioni vengono ritenuti
                coerenti, potresti evitare di ripartire da zero.
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#061827]/60 p-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-100" />
              <p className="text-sm leading-6 text-slate-200/82">
                Confrontiamo più possibilità, perché atenei diversi possono
                valutare in modo diverso il tuo percorso precedente.
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#061827]/60 p-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-100" />
              <p className="text-sm leading-6 text-slate-200/82">
                La valutazione non è automatica, ma può aiutarti a capire se
                esiste una strada più breve o più adatta alla tua situazione.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard/valuta-quello-che-hai-fatto")}
          className="group inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-200 via-sky-200 to-blue-200 px-5 py-3 text-center text-[15px] font-black leading-tight text-slate-950 shadow-[0_18px_42px_rgba(56,189,248,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(56,189,248,0.38)] active:translate-y-0"
        >
          Carica o descrivi il tuo percorso
          <ArrowRight className="h-5 w-5 shrink-0 transition duration-300 group-hover:translate-x-1" />
        </button>

        <p className="mt-3 text-center text-[11px] leading-5 text-slate-300/75">
          La valutazione è orientativa e non sostituisce la delibera ufficiale
          dell’ateneo.
        </p>
      </div>
    </section>
  );
}
