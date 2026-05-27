"use client";

import {
  ArrowRight,
  MessageSquareText,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SpazioStudentiCard() {
  const router = useRouter();

  return (
    <section className="relative mb-5 overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-300/45 via-blue-500/30 to-indigo-700/35 p-[1px] shadow-[0_24px_70px_rgba(14,165,233,0.16)]">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-300/24 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-indigo-500/22 blur-3xl" />

      <div className="relative rounded-[31px] bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.22),transparent_34%),linear-gradient(135deg,#123B63_0%,#0B1728_52%,#06111F_100%)] p-5 text-white sm:p-6">
        <div className="mb-4 flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-3xl bg-sky-300/35 blur-xl" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-3xl border border-sky-100/30 bg-sky-200/14">
              <UsersRound className="h-7 w-7 text-sky-100" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-sky-100/25 bg-sky-100/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-sky-100">
              <Sparkles className="h-3.5 w-3.5" />
              Casi e dubbi reali
            </div>

            <h2 className="text-[29px] font-black leading-[1.02] tracking-tight text-white sm:text-4xl">
              Spazio Studenti
            </h2>

            <p className="mt-3 text-[15px] leading-7 text-slate-100/88">
              Leggi domande e situazioni simili alla tua: esami già sostenuti,
              studio e lavoro, concorsi, costi, cambio università e paura di non
              riuscire.
            </p>
          </div>
        </div>

        <div className="mb-5 rounded-3xl border border-white/10 bg-white/[0.07] p-4">
          <div className="flex items-start gap-3">
            <MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-sky-100" />
            <p className="text-sm leading-6 text-slate-200/82">
              Non è un forum libero: trovi casi guidati, risposte curate da
              Laurea Smart e il prossimo passo più utile da fare.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard/spazio-studenti")}
          className="group inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-200 px-5 py-3 text-center text-[15px] font-black leading-tight text-slate-950 shadow-[0_18px_42px_rgba(56,189,248,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(56,189,248,0.38)] active:translate-y-0"
        >
          Entra nello Spazio Studenti
          <ArrowRight className="h-5 w-5 shrink-0 transition duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
