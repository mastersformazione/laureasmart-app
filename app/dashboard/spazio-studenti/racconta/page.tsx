"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Loader2,
  Send,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

const endpoint = "https://laureasmart.it/api/spazio-studenti-invia-caso.php";

const categorie = [
  "Ho già fatto esami: posso recuperarli?",
  "Studio e lavoro: come organizzarmi?",
  "Non so quale percorso scegliere",
  "Voglio laurearmi per concorsi",
  "Vorrei cambiare università",
  "Ho paura di non riuscire a studiare",
  "Quanto costa davvero iniziare?",
  "Altro dubbio",
];

export default function RaccontaCasoSpazioStudentiPage() {
  const router = useRouter();

  const [nomePubblico, setNomePubblico] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [categoria, setCategoria] = useState(categorie[0]);
  const [titolo, setTitolo] = useState("");
  const [contenuto, setContenuto] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [privacy, setPrivacy] = useState(false);
  const [pubblicazione, setPubblicazione] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [successo, setSuccesso] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");

    if (
      !nomePubblico.trim() ||
      !email.trim() ||
      !titolo.trim() ||
      !contenuto.trim()
    ) {
      setStatus("Nome pubblico, email, titolo e contenuto sono obbligatori.");
      return;
    }

    if (!privacy || !pubblicazione) {
      setStatus(
        "Per inviare il caso devi accettare privacy e pubblicazione moderata."
      );
      return;
    }

    const formData = new FormData();
    formData.append("nome_pubblico", nomePubblico.trim());
    formData.append("email", email.trim());
    formData.append("telefono", telefono.trim());
    formData.append("categoria", categoria);
    formData.append("titolo", titolo.trim());
    formData.append("contenuto", contenuto.trim());

    if (foto) {
      formData.append("foto", foto);
    }

    setLoading(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.message || "Non siamo riusciti a inviare il caso."
        );
      }

      setSuccesso(true);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Errore durante l’invio del caso."
      );
    } finally {
      setLoading(false);
    }
  };

  if (successo) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1F6FB2_0%,#0B1728_42%,#07111F_100%)] px-4 py-6 text-white">
        <div className="mx-auto max-w-3xl">
          <section className="overflow-hidden rounded-[34px] border border-emerald-300/25 bg-gradient-to-br from-emerald-300/16 via-sky-300/12 to-white/6 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.35)]">
            <div className="rounded-[28px] bg-[#061827]/70 p-6 backdrop-blur">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-300/15 text-emerald-100 ring-1 ring-emerald-200/25">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-100">
                Caso ricevuto
              </p>

              <h1 className="text-3xl font-black leading-tight">
                Grazie, abbiamo ricevuto il tuo caso
              </h1>

              <p className="mt-4 text-[16px] leading-7 text-slate-100/88">
                Prima della pubblicazione, il contenuto verrà letto da Laurea
                Smart. Se approvato, potrà comparire nello Spazio Studenti con
                il nome pubblico e l’eventuale foto che hai indicato.
              </p>

              <button
                type="button"
                onClick={() => router.push("/dashboard/spazio-studenti")}
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-200 px-5 py-4 text-sm font-black text-slate-950 shadow-[0_18px_42px_rgba(56,189,248,0.28)] transition hover:-translate-y-0.5 sm:w-auto"
              >
                Torna allo Spazio Studenti
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

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
              Spazio Studenti
            </div>

            <h1 className="text-[34px] font-black leading-[0.98] tracking-tight sm:text-5xl">
              Racconta il tuo caso
            </h1>

            <p className="mt-4 text-[16px] leading-7 text-slate-100/88">
              Condividi una situazione reale: può aiutare altri studenti con
              dubbi simili. Il contenuto non viene pubblicato subito: viene
              prima moderato da Laurea Smart.
            </p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <section className="rounded-[30px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-300/15 text-sky-100 ring-1 ring-sky-200/20">
                <UsersRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black">Il tuo profilo pubblico</h2>
                <p className="text-sm text-slate-200/78">
                  Usa il nome reale, un nome di fantasia o un formato tipo
                  “Marco, 34 anni”.
                </p>
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-slate-100">
                Nome pubblico *
              </span>
              <input
                required
                value={nomePubblico}
                onChange={(event) => setNomePubblico(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#061827]/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-sky-200/55 focus:ring-4 focus:ring-sky-300/12"
                placeholder="Esempio: Marco, 34 anni"
              />
            </label>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-sky-200/35 bg-[#061827]/60 px-4 py-7 text-center transition hover:border-sky-100/60 hover:bg-[#0A2237]">
              <Camera className="mb-3 h-9 w-9 text-sky-100" />
              <span className="text-base font-black text-white">
                {foto ? foto.name : "Carica o scatta una foto profilo"}
              </span>
              <span className="mt-2 text-xs leading-5 text-slate-300">
                JPG, PNG o HEIC. La foto verrà pubblicata solo dopo moderazione.
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setFoto(event.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
            <h2 className="text-xl font-black">Contatti</h2>
            <p className="mt-1 text-sm text-slate-200/78">
              Non saranno pubblicati nello Spazio Studenti.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-100">
                  Email *
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#061827]/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-sky-200/55 focus:ring-4 focus:ring-sky-300/12"
                  placeholder="nome@email.it"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-100">
                  Telefono
                </span>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(event) => setTelefono(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#061827]/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-sky-200/55 focus:ring-4 focus:ring-sky-300/12"
                  placeholder="+39 333 000 0000"
                />
              </label>
            </div>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
            <h2 className="text-xl font-black">Il caso da condividere</h2>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-bold text-slate-100">
                Categoria *
              </span>
              <select
                value={categoria}
                onChange={(event) => setCategoria(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#061827]/70 px-4 py-3 text-white outline-none transition focus:border-sky-200/55 focus:ring-4 focus:ring-sky-300/12"
              >
                {categorie.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-bold text-slate-100">
                Titolo del caso *
              </span>
              <input
                required
                value={titolo}
                onChange={(event) => setTitolo(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#061827]/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-sky-200/55 focus:ring-4 focus:ring-sky-300/12"
                placeholder="Esempio: Ho fatto 6 esami, posso recuperarli?"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-bold text-slate-100">
                Racconta la situazione *
              </span>
              <textarea
                required
                value={contenuto}
                onChange={(event) => setContenuto(event.target.value)}
                rows={6}
                className="w-full rounded-2xl border border-white/10 bg-[#061827]/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-sky-200/55 focus:ring-4 focus:ring-sky-300/12"
                placeholder="Racconta il tuo dubbio, cosa hai già fatto, cosa vorresti capire o cosa ti blocca."
              />
            </label>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
            <label className="flex items-start gap-3">
              <input
                required
                type="checkbox"
                checked={privacy}
                onChange={(event) => setPrivacy(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border-white/20 bg-[#061827]"
              />
              <span className="text-sm leading-6 text-slate-100/84">
                Acconsento al trattamento dei dati inseriti per la gestione del
                caso e per eventuale ricontatto da parte di Laurea Smart.
              </span>
            </label>

            <label className="mt-4 flex items-start gap-3">
              <input
                required
                type="checkbox"
                checked={pubblicazione}
                onChange={(event) => setPubblicazione(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border-white/20 bg-[#061827]"
              />
              <span className="text-sm leading-6 text-slate-100/84">
                Autorizzo Laurea Smart a pubblicare il caso nello Spazio
                Studenti dopo moderazione, usando il nome pubblico e l’eventuale
                foto profilo caricata.
              </span>
            </label>

            {status && (
              <div className="mt-4 rounded-2xl border border-red-300/25 bg-red-300/12 px-4 py-3 text-sm font-bold text-red-100">
                {status}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-200 px-5 py-4 text-center text-[15px] font-black text-slate-950 shadow-[0_18px_42px_rgba(56,189,248,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Invio in corso...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Invia il mio caso
                </>
              )}
            </button>
          </section>
        </form>
      </div>
    </main>
  );
}
