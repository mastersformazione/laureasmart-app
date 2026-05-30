"use client";

import { FormEvent, useState } from "react";
import BottomNav from "@/components/ui/BottomNav";
import AppButton from "@/components/ui/AppButton";
import AppCard from "@/components/ui/AppCard";
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

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-[#061827]/70 px-4 py-3.5 text-[15px] font-semibold text-white outline-none transition placeholder:text-slate-400 focus:border-sky-200/55 focus:ring-4 focus:ring-sky-300/12";

const labelClassName = "mb-1.5 block text-[15px] font-extrabold text-slate-100";

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
      <main className="ls-dark-page px-4 py-6 pb-28">
        <div className="mx-auto max-w-3xl">
          <AppCard
            variant="green"
            title="Grazie, abbiamo ricevuto il tuo caso"
            description="Prima della pubblicazione, il contenuto verrà letto da Laurea Smart. Se approvato, potrà comparire nello Spazio Studenti con il nome pubblico e l’eventuale foto che hai indicato."
            badge="Caso ricevuto"
            icon={<CheckCircle2 className="h-7 w-7" />}
          >
            <div className="mt-1 rounded-3xl border border-emerald-200/55 bg-white/60 p-4">
              <p className="text-[15px] font-extrabold text-slate-900">
                Cosa succede ora?
              </p>
              <p className="mt-2 text-[15px] leading-7 text-slate-700">
                Il caso verrà moderato e, se utile alla community, potrà essere
                pubblicato nello Spazio Studenti come esempio reale per altri
                utenti con dubbi simili.
              </p>
            </div>

            <div className="mt-5">
              <AppButton
                type="button"
                onClick={() => router.push("/dashboard/spazio-studenti")}
              >
                Torna allo Spazio Studenti
              </AppButton>
            </div>
          </AppCard>
        </div>

        <BottomNav />
      </main>
    );
  }

  return (
    <main className="ls-dark-page px-4 py-6 pb-28">
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
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-300/22 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-600/22 blur-3xl" />

          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200/25 bg-sky-100/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-sky-100">
              <Sparkles className="h-3.5 w-3.5" />
              Spazio Studenti
            </div>

            <h1 className="text-[35px] font-black leading-[0.98] tracking-tight sm:text-5xl">
              Racconta il tuo caso
            </h1>

            <p className="mt-4 text-[17px] leading-8 text-slate-100/90">
              Condividi una situazione reale: può aiutare altri studenti con
              dubbi simili. Il contenuto non viene pubblicato subito, ma viene
              prima moderato da Laurea Smart.
            </p>

            <div className="mt-5 rounded-3xl border border-cyan-200/18 bg-cyan-200/10 p-4">
              <div className="flex items-start gap-3">
                <UsersRound className="mt-0.5 h-5 w-5 shrink-0 text-cyan-100" />
                <p className="text-[15px] leading-7 text-slate-100/88">
                  Puoi usare un nome pubblico, un nome di fantasia o un formato
                  come “Marco, 34 anni”. Email e telefono non saranno
                  pubblicati.
                </p>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <AppCard
            variant="blue"
            title="Il tuo profilo pubblico"
            description="Queste informazioni servono solo per presentare il caso nello Spazio Studenti dopo la moderazione."
            icon={<UsersRound className="h-5 w-5" />}
          >
            <label className="block">
              <span className={labelClassName}>Nome pubblico *</span>
              <input
                required
                value={nomePubblico}
                onChange={(event) => setNomePubblico(event.target.value)}
                className={inputClassName}
                placeholder="Esempio: Marco, 34 anni"
              />
            </label>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-sky-300/45 bg-white/55 px-4 py-7 text-center transition hover:border-sky-500/45 hover:bg-white/75">
              <Camera className="mb-3 h-9 w-9 text-[#1F6FB2]" />
              <span className="text-[16px] font-black text-slate-950">
                {foto ? foto.name : "Carica o scatta una foto profilo"}
              </span>
              <span className="mt-2 text-[13px] leading-5 text-slate-600">
                JPG, PNG o HEIC. La foto verrà pubblicata solo dopo moderazione.
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setFoto(event.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </AppCard>

          <AppCard
            variant="cyan"
            title="Contatti"
            description="Email e telefono non saranno pubblicati nello Spazio Studenti. Servono solo per eventuale ricontatto."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={labelClassName}>Email *</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClassName}
                  placeholder="nome@email.it"
                />
              </label>

              <label className="block">
                <span className={labelClassName}>Telefono</span>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(event) => setTelefono(event.target.value)}
                  className={inputClassName}
                  placeholder="+39 333 000 0000"
                />
              </label>
            </div>
          </AppCard>

          <AppCard
            variant="purple"
            title="Il caso da condividere"
            description="Scrivi il dubbio in modo semplice: cosa hai già fatto, cosa vorresti capire e cosa ti blocca."
          >
            <label className="block">
              <span className={labelClassName}>Categoria *</span>
              <select
                value={categoria}
                onChange={(event) => setCategoria(event.target.value)}
                className={inputClassName}
              >
                {categorie.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block">
              <span className={labelClassName}>Titolo del caso *</span>
              <input
                required
                value={titolo}
                onChange={(event) => setTitolo(event.target.value)}
                className={inputClassName}
                placeholder="Esempio: Ho fatto 6 esami, posso recuperarli?"
              />
            </label>

            <label className="mt-4 block">
              <span className={labelClassName}>Racconta la situazione *</span>
              <textarea
                required
                value={contenuto}
                onChange={(event) => setContenuto(event.target.value)}
                rows={6}
                className={inputClassName}
                placeholder="Racconta il tuo dubbio, cosa hai già fatto, cosa vorresti capire o cosa ti blocca."
              />
            </label>
          </AppCard>

          <AppCard
            variant="amber"
            title="Privacy e pubblicazione"
            description="Il caso sarà pubblicato solo dopo moderazione. I dati di contatto non saranno visibili nella scheda pubblica."
          >
            <label className="flex items-start gap-3 rounded-2xl border border-amber-200/60 bg-white/55 p-4">
              <input
                required
                type="checkbox"
                checked={privacy}
                onChange={(event) => setPrivacy(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-300"
              />
              <span className="text-[15px] leading-7 text-slate-800">
                Acconsento al trattamento dei dati inseriti per la gestione del
                caso e per eventuale ricontatto da parte di Laurea Smart.
              </span>
            </label>

            <label className="mt-3 flex items-start gap-3 rounded-2xl border border-amber-200/60 bg-white/55 p-4">
              <input
                required
                type="checkbox"
                checked={pubblicazione}
                onChange={(event) => setPubblicazione(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-300"
              />
              <span className="text-[15px] leading-7 text-slate-800">
                Autorizzo Laurea Smart a pubblicare il caso nello Spazio
                Studenti dopo moderazione, usando il nome pubblico e l’eventuale
                foto profilo caricata.
              </span>
            </label>

            {status && (
              <div className="mt-4 rounded-2xl border border-red-300/60 bg-red-50 px-4 py-3 text-[15px] font-extrabold text-red-700">
                {status}
              </div>
            )}

            <div className="mt-5">
              <AppButton type="submit" disabled={loading}>
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
              </AppButton>
            </div>
          </AppCard>
        </form>
      </div>

      <BottomNav />
    </main>
  );
}
