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
import AppButton from "@/components/ui/AppButton";
import AppCard from "@/components/ui/AppCard";

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
      <main className="ls-dark-page px-4 py-6 pb-28">
        <div className="mx-auto max-w-3xl">
          <BackButton onClick={() => router.back()} />

          <AppCard
            variant="green"
            title="Abbiamo ricevuto i tuoi documenti"
            description="Laurea Smart userà i materiali inviati per preparare una prima valutazione orientativa del tuo percorso."
            badge="Richiesta inviata"
            icon={<CheckCircle2 className="h-7 w-7" />}
          >
            <p className="text-[16px] leading-7 text-slate-700">
              Il tuo percorso sarà confrontato con almeno due atenei, così da
              verificare quali possibilità di riconoscimento potrebbero essere
              più adatte alla tua situazione.
            </p>

            <div className="mt-5 rounded-3xl border border-emerald-200 bg-white/70 p-4">
              <p className="text-[15px] font-black text-slate-950">
                Cosa succede ora?
              </p>

              <ul className="mt-3 space-y-2 text-[15px] leading-6 text-slate-700">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  Verifichiamo quali elementi possono essere utili per una
                  valutazione.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  Confrontiamo più possibilità, senza dare per scontata una sola
                  soluzione.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  Ti contatteremo usando i dati che hai indicato.
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <AppButton
                type="button"
                onClick={() => router.push("/dashboard")}
                fullWidth={false}
              >
                Torna alla dashboard
              </AppButton>
            </div>
          </AppCard>
        </div>
      </main>
    );
  }

  return (
    <main className="ls-dark-page px-4 py-6 pb-28">
      <div className="mx-auto max-w-3xl">
        <BackButton onClick={() => router.back()} />

        <AppCard
          variant="dark"
          badge="Valutazione Smart"
          icon={<Sparkles className="h-6 w-6" />}
        >
          <h1 className="text-[34px] font-black leading-[0.98] tracking-tight sm:text-5xl">
            Valuta quello che hai già fatto
          </h1>

          <p className="mt-4 text-[17px] leading-7 text-slate-100/88">
            Carica quello che pensi possa avere valore: foto, screenshot,
            documenti, certificazioni, CV o anche semplici informazioni sul tuo
            percorso. Laurea Smart ti aiuta a capire se ci sono elementi utili
            da far valutare agli atenei.
          </p>

          <div className="mt-5 rounded-3xl border border-cyan-200/20 bg-cyan-200/10 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-100" />
              <p className="text-[15px] leading-6 text-slate-100/88">
                Faremo valutare il tuo percorso ad almeno due atenei, così da
                confrontare più opzioni possibili e non fermarti a una sola
                risposta.
              </p>
            </div>
          </div>
        </AppCard>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <AppCard
            variant="blue"
            title="Carica quello che pensi possa avere valore"
            description="Non devi sapere già cosa può essere riconosciuto. Carica ciò che hai oppure spiegalo nelle note: penseremo noi a fare una prima lettura."
            icon={<FileUp className="h-6 w-6" />}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-sky-200/70 bg-white/70 p-4">
                <div className="mb-2 flex items-center gap-2 text-[15px] font-black text-slate-950">
                  <CheckCircle2 className="h-4 w-4 text-sky-700" />
                  Puoi caricare
                </div>
                <p className="text-[15px] leading-6 text-slate-700">
                  Esami, libretto, screenshot, certificazioni, titoli, CV,
                  attestati o altri documenti che ritieni utili.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-200/80 bg-white/70 p-4">
                <div className="mb-2 flex items-center gap-2 text-[15px] font-black text-slate-950">
                  <CheckCircle2 className="h-4 w-4 text-cyan-700" />
                  Puoi anche solo scrivere
                </div>
                <p className="text-[15px] leading-6 text-slate-700">
                  Descrivi cosa vorresti farti riconoscere, anche se non hai
                  ancora il documento pronto o non sai quale file allegare.
                </p>
              </div>
            </div>
          </AppCard>

          <AppCard
            variant="white"
            title="I tuoi dati"
            description="Nome, cognome, email e telefono sono obbligatori per poterti ricontattare dopo la prima verifica."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <FormInput
                label="Nome *"
                value={nome}
                onChange={setNome}
                placeholder="Il tuo nome"
                required
              />

              <FormInput
                label="Cognome *"
                value={cognome}
                onChange={setCognome}
                placeholder="Il tuo cognome"
                required
              />

              <FormInput
                label="Email *"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="nome@email.it"
                required
              />

              <FormInput
                label="Telefono *"
                type="tel"
                value={telefono}
                onChange={setTelefono}
                placeholder="+39 333 000 0000"
                required
              />
            </div>
          </AppCard>

          <AppCard
            variant="cyan"
            title="Carica foto o documenti"
            description="Carica liberamente ciò che pensi possa avere valore. Anche una foto, uno screenshot o una spiegazione possono bastare per iniziare."
            icon={<UploadCloud className="h-6 w-6" />}
          >
            <label className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-500/35 bg-white/70 px-4 py-8 text-center transition hover:border-cyan-600/50 hover:bg-white">
              <UploadCloud className="mb-3 h-9 w-9 text-cyan-700" />
              <span className="text-[16px] font-black text-slate-950">
                {numeroFile > 0
                  ? `${numeroFile} file selezionato${numeroFile > 1 ? "i" : ""}`
                  : "Carica foto, screenshot o file"}
              </span>
              <span className="mt-2 text-[13px] leading-5 text-slate-600">
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

            <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-4">
              <label className="block">
                <span className="mb-2 block text-[15px] font-black text-amber-900">
                  Non hai documenti pronti? Scrivi qui cosa vorresti farti
                  riconoscere
                </span>
                <p className="mb-3 text-[13px] leading-5 text-slate-700">
                  Puoi descrivere esami sostenuti, anni di università già fatti,
                  certificazioni, esperienze lavorative, corsi frequentati o
                  qualsiasi elemento che secondo te potrebbe avere valore.
                </p>
                <textarea
                  value={nota}
                  onChange={(event) => setNota(event.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-amber-500/55 focus:ring-4 focus:ring-amber-200/30"
                  placeholder="Esempio: ho sostenuto 6 esami in Psicologia ma non ho ancora il certificato; vorrei capire se possono essere valutati. Oppure: ho esperienza lavorativa nel settore educativo e vorrei sapere se può essere utile."
                />
              </label>
            </div>
          </AppCard>

          <AppCard variant="amber" title="Privacy e invio richiesta">
            <label className="flex items-start gap-3">
              <input
                required
                type="checkbox"
                checked={privacy}
                onChange={(event) => setPrivacy(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-300 bg-white"
              />
              <span className="text-[15px] leading-6 text-slate-700">
                Dichiaro di essere consapevole che i documenti caricati possono
                contenere dati personali e autorizzo Laurea Smart a utilizzarli
                esclusivamente per una prima valutazione orientativa delle
                possibilità di riconoscimento e per essere ricontattato.
              </span>
            </label>

            <p className="mt-3 text-[13px] leading-5 text-slate-600">
              La valutazione non ha valore ufficiale e non sostituisce la
              delibera dell’ateneo. Serve a capire se esistono elementi utili da
              approfondire e confrontare presso almeno due atenei.
            </p>

            {errore && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-bold text-red-700">
                {errore}
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
                  "Invia per far valutare il percorso"
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

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/15"
    >
      <ArrowLeft className="h-4 w-4" />
      Torna indietro
    </button>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[14px] font-bold text-slate-700">
        {label}
      </span>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500/55 focus:ring-4 focus:ring-sky-200/40"
        placeholder={placeholder}
      />
    </label>
  );
}
