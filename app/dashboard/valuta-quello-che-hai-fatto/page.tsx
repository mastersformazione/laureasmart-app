"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileUp,
  Loader2,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

const endpoint = "https://laureasmart.it/api/invia-documenti-valutazione.php";

export default function ValutaQuelloCheHaiGiaFattoPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nota, setNota] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState("");
  const [successo, setSuccesso] = useState(false);

  const numeroFile = files?.length ?? 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrore("");

    if (!nome.trim() || !cognome.trim() || !email.trim() || !telefono.trim()) {
      setErrore("Nome, cognome, email e telefono sono obbligatori.");
      return;
    }

    if (!privacy) {
      setErrore("Per inviare la richiesta devi accettare la privacy.");
      return;
    }

    if ((!files || files.length === 0) && !nota.trim()) {
      setErrore(
        "Carica almeno una foto o un documento, oppure scrivi nelle note cosa vorresti farti riconoscere."
      );
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome.trim());
    formData.append("cognome", cognome.trim());
    formData.append("email", email.trim());
    formData.append("telefono", telefono.trim());
    formData.append("categoria", "valutazione_libera");
    formData.append(
      "categoria_label",
      "Valutazione libera documenti e percorso pregresso"
    );
    formData.append("nota", nota.trim());

    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        formData.append("documenti[]", file);
      });
    }

    setLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Non siamo riusciti a inviare la richiesta. Riprova tra qualche minuto."
        );
      }

      try {
        localStorage.setItem("valutazione_documenti_inviata", "si");
        localStorage.setItem(
          "valutazione_documenti_ultimo_invio",
          new Date().toISOString()
        );
      } catch {
        // Il salvataggio locale non deve bloccare il completamento.
      }

      setSuccesso(true);
    } catch (error) {
      setErrore(
        error instanceof Error
          ? error.message
          : "Errore durante l’invio della richiesta."
      );
    } finally {
      setLoading(false);
    }
  };

  if (successo) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#2F86D1_0%,#0B1728_42%,#07111F_100%)] px-4 py-6 pb-28 text-white">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/12"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna indietro
          </button>

          <section className="overflow-hidden rounded-[34px] border border-emerald-300/25 bg-gradient-to-br from-emerald-300/16 via-sky-300/12 to-white/6 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.35)]">
            <div className="rounded-[28px] bg-[#061827]/70 p-6 backdrop-blur">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-300/15 text-emerald-100 ring-1 ring-emerald-200/25">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-100">
                Richiesta inviata
              </p>

              <h1 className="text-3xl font-black leading-tight">
                Abbiamo ricevuto i tuoi documenti
              </h1>

              <p className="mt-4 text-[16px] leading-7 text-slate-100/88">
                Laurea Smart userà i materiali inviati per preparare una prima
                valutazione orientativa. Il tuo percorso sarà confrontato con
                almeno due atenei, così da verificare quali possibilità di
                riconoscimento potrebbero essere più adatte alla tua situazione.
              </p>

              <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.07] p-4">
                <p className="text-sm font-black text-white">
                  Cosa succede ora?
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200/85">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-200" />
                    Verifichiamo quali elementi possono essere utili per una
                    valutazione.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-200" />
                    Confrontiamo più possibilità, senza dare per scontata una
                    sola soluzione.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-200" />
                    Ti contatteremo usando i dati che hai indicato.
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-200 px-5 py-4 text-sm font-black text-slate-950 shadow-[0_18px_42px_rgba(56,189,248,0.28)] transition hover:-translate-y-0.5 sm:w-auto"
              >
                Torna alla dashboard
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#2F86D1_0%,#0B1728_42%,#07111F_100%)] px-4 py-6 pb-28 text-white">
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
          <div className="pointer-events-none absolute -bottom-20 -left-24 h-64 w-64 rounded-full bg-blue-600/22 blur-3xl" />

          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200/25 bg-sky-100/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-sky-100">
              <Sparkles className="h-3.5 w-3.5" />
              Valutazione Smart
            </div>

            <h1 className="text-[34px] font-black leading-[0.98] tracking-tight sm:text-5xl">
              Valuta quello che hai già fatto
            </h1>

            <p className="mt-4 text-[16px] leading-7 text-slate-100/88">
              Carica quello che pensi possa avere valore: foto, screenshot,
              documenti, certificazioni, CV o anche semplici informazioni sul
              tuo percorso. Laurea Smart ti aiuta a capire se ci sono elementi
              utili da far valutare agli atenei.
            </p>

            <div className="mt-5 rounded-3xl border border-cyan-200/18 bg-cyan-200/10 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-100" />
                <p className="text-sm leading-6 text-slate-100/86">
                  Faremo valutare il tuo percorso ad almeno due atenei, così da
                  confrontare più opzioni possibili e non fermarti a una sola
                  risposta.
                </p>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <section className="rounded-[30px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-300/15 text-sky-100 ring-1 ring-sky-200/20">
                <FileUp className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black">
                  Carica quello che pensi possa avere valore
                </h2>
                <p className="text-sm leading-6 text-slate-200/78">
                  Non devi sapere già cosa può essere riconosciuto. Carica ciò
                  che hai oppure spiegalo nelle note: penseremo noi a fare una
                  prima lettura e a confrontare il percorso con almeno due
                  atenei.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-sky-200/18 bg-[#061827]/62 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-black text-white">
                  <CheckCircle2 className="h-4 w-4 text-sky-200" />
                  Puoi caricare
                </div>
                <p className="text-sm leading-6 text-slate-200/78">
                  esami, libretto, screenshot, certificazioni, titoli, CV,
                  attestati o altri documenti che ritieni utili.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-200/18 bg-cyan-200/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-black text-white">
                  <CheckCircle2 className="h-4 w-4 text-cyan-100" />
                  Puoi anche solo scrivere
                </div>
                <p className="text-sm leading-6 text-slate-200/78">
                  cosa vorresti farti riconoscere, anche se non hai ancora il
                  documento pronto o non sai quale file allegare.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
            <h2 className="text-xl font-black">I tuoi dati</h2>
            <p className="mt-1 text-sm text-slate-200/78">
              Nome, cognome, email e telefono sono obbligatori per poterti
              ricontattare dopo la prima verifica.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-100">
                  Nome *
                </span>
                <input
                  required
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#061827]/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-sky-200/55 focus:ring-4 focus:ring-sky-300/12"
                  placeholder="Il tuo nome"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-100">
                  Cognome *
                </span>
                <input
                  required
                  value={cognome}
                  onChange={(event) => setCognome(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#061827]/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-sky-200/55 focus:ring-4 focus:ring-sky-300/12"
                  placeholder="Il tuo cognome"
                />
              </label>

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
                  Telefono *
                </span>
                <input
                  required
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
            <h2 className="text-xl font-black">Carica foto o documenti</h2>
            <p className="mt-1 text-sm leading-6 text-slate-200/78">
              Carica liberamente ciò che pensi possa avere valore. Non serve
              scegliere una categoria e non serve avere tutto pronto: anche una
              foto, uno screenshot o una spiegazione possono bastare per
              iniziare.
            </p>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-sky-200/35 bg-[#061827]/60 px-4 py-8 text-center transition hover:border-sky-100/60 hover:bg-[#0A2237]">
              <UploadCloud className="mb-3 h-9 w-9 text-sky-100" />
              <span className="text-base font-black text-white">
                {numeroFile > 0
                  ? `${numeroFile} file selezionato${numeroFile > 1 ? "i" : ""}`
                  : "Carica foto, screenshot o file"}
              </span>
              <span className="mt-2 text-xs leading-5 text-slate-300">
                PDF, JPG, PNG, HEIC, DOC, DOCX. Max consigliato: 8 MB per file.
              </span>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx,application/pdf,image/jpeg,image/png,image/heic,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(event) => setFiles(event.target.files)}
                className="hidden"
              />
            </label>

            <div className="mt-4 rounded-3xl border border-amber-200/22 bg-amber-200/10 p-4">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-amber-100">
                  Non hai documenti pronti? Scrivi qui cosa vorresti farti
                  riconoscere
                </span>
                <p className="mb-3 text-xs leading-5 text-slate-200/78">
                  Puoi descrivere esami sostenuti, anni di università già fatti,
                  certificazioni, esperienze lavorative, corsi frequentati o
                  qualsiasi elemento che secondo te potrebbe avere valore.
                </p>
                <textarea
                  value={nota}
                  onChange={(event) => setNota(event.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-amber-100/20 bg-[#061827]/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-amber-100/55 focus:ring-4 focus:ring-amber-200/12"
                  placeholder="Esempio: ho sostenuto 6 esami in Psicologia ma non ho ancora il certificato; vorrei capire se possono essere valutati. Oppure: ho esperienza lavorativa nel settore educativo e vorrei sapere se può essere utile."
                />
              </label>
            </div>
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
                Dichiaro di essere consapevole che i documenti caricati possono
                contenere dati personali e autorizzo Laurea Smart a utilizzarli
                esclusivamente per una prima valutazione orientativa delle
                possibilità di riconoscimento e per essere ricontattato.
              </span>
            </label>

            <p className="mt-3 text-xs leading-5 text-slate-300/78">
              La valutazione non ha valore ufficiale e non sostituisce la
              delibera dell’ateneo. Serve a capire se esistono elementi utili da
              approfondire e confrontare presso almeno due atenei.
            </p>

            {errore && (
              <div className="mt-4 rounded-2xl border border-red-300/25 bg-red-300/12 px-4 py-3 text-sm font-bold text-red-100">
                {errore}
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
                "Invia per far valutare il percorso"
              )}
            </button>
          </section>
        </form>
      </div>
      <BottomNav />
    </main>
  );
}
