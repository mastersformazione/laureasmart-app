"use client";

import { useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import Link from "next/link";
import {
  BarChart3,
  BellRing,
  BookOpenCheck,
  ExternalLink,
  LayoutDashboard,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import Button from "@/components/ui/Button";
import BottomNav from "@/components/ui/BottomNav";

type SpazioStudentiCase = {
  id: string;
  created_at: string;
  nome_pubblico: string;
  email?: string;
  telefono?: string;
  categoria: string;
  titolo: string;
  contenuto: string;
  foto_url?: string;
  risposta_laurea_smart?: string;
  prossimo_passo?: string;
  cta_label?: string;
  cta_href?: string;
  cta_whatsapp?: string;
};

type CasoEdit = {
  risposta: string;
  prossimoPasso: string;
  cta: "valuta" | "prima" | "test" | "confronto";
};

const ctaOptions: Record<
  CasoEdit["cta"],
  { label: string; href?: string; whatsapp?: boolean }
> = {
  valuta: {
    label: "Valuta quello che hai già fatto",
    href: "/dashboard/valuta-quello-che-hai-fatto",
  },
  prima: {
    label: "Prima di scegliere",
    href: "/dashboard/prima-di-scegliere",
  },
  test: {
    label: "Fai il test sul futuro",
    href: "/dashboard/orientamento/futuro",
  },
  confronto: {
    label: "Voglio confrontare le mie possibilità",
    whatsapp: true,
  },
};

function creaEditDefault(caso: SpazioStudentiCase): CasoEdit {
  const categoria = caso.categoria.toLowerCase();

  let cta: CasoEdit["cta"] = "confronto";

  if (
    categoria.includes("esami") ||
    categoria.includes("cfu") ||
    categoria.includes("cambiare")
  ) {
    cta = "valuta";
  } else if (
    categoria.includes("lavoro") ||
    categoria.includes("paura") ||
    categoria.includes("costa")
  ) {
    cta = "prima";
  } else if (categoria.includes("percorso")) {
    cta = "test";
  }

  return {
    risposta:
      "Grazie per aver condiviso il tuo caso. Prima di scegliere, è utile valutare la situazione in modo completo e confrontare più possibilità, perché percorso, tempi, costi, supporto e riconoscimenti possono cambiare da un ateneo all’altro.",
    prossimoPasso:
      "Il prossimo passo consigliato è approfondire il caso con Laurea Smart e confrontare le opzioni più adatte alla situazione descritta.",
    cta,
  };
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "24px 18px 120px",
  fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
  background:
    "radial-gradient(circle at top left, #173E68 0%, transparent 32%), linear-gradient(180deg, #0B1728 0%, #07111F 100%)",
  color: "#FFFFFF",
};

const containerStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1120,
  margin: "0 auto",
};

const heroStyle: CSSProperties = {
  borderRadius: 34,
  padding: 22,
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.06))",
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
  backdropFilter: "blur(14px)",
};

const softCardStyle: CSSProperties = {
  borderRadius: 28,
  background: "#FFFFFF",
  border: "1px solid rgba(215,231,245,0.95)",
  boxShadow: "0 18px 42px rgba(15,23,42,0.12)",
  color: "#0F172A",
};

const mutedTextStyle: CSSProperties = {
  color: "#64748B",
  lineHeight: 1.58,
  fontSize: 15,
  fontWeight: 550,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.05,
  letterSpacing: -0.7,
  fontWeight: 950,
};

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: 7,
  fontSize: 13,
  fontWeight: 900,
  color: "#243244",
};

const adminLinkCards = [
  {
    title: "Gestione lead",
    description:
      "Apri il CRM interno con contatti, stati, orientatore assegnato, task e storico attività.",
    href: "/admin/leads",
    icon: <UsersRound size={23} />,
    bg: "#EAF3FB",
    color: "#1F6FB2",
  },
  {
    title: "Download funnel",
    description:
      "Controlla click dalla landing, arrivo al form finale e lead inviati dal test gratuito.",
    href: "/admin/download-funnel",
    icon: <BarChart3 size={23} />,
    bg: "#ECFDF3",
    color: "#15803D",
  },
];

function AdminQuickLinkCard({
  title,
  description,
  href,
  icon,
  bg,
  color,
}: {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  bg: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        borderRadius: 26,
        background: bg,
        color: "#0F172A",
        border: "1px solid rgba(31,111,178,0.12)",
        padding: 18,
        textDecoration: "none",
        boxShadow: "0 14px 34px rgba(15,23,42,0.10)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 18,
            display: "grid",
            placeItems: "center",
            background: "rgba(255,255,255,0.78)",
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        <ExternalLink size={18} color={color} />
      </div>

      <h2
        style={{
          margin: "14px 0 0",
          fontSize: 21,
          lineHeight: 1.12,
          letterSpacing: -0.6,
          fontWeight: 950,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: "8px 0 0",
          color: "#475569",
          fontSize: 14,
          lineHeight: 1.5,
          fontWeight: 650,
        }}
      >
        {description}
      </p>
    </Link>
  );
}

export default function AdminPage() {
  const [form, setForm] = useState({
    titolo: "",
    messaggio: "",
    target: "ALL",
    adminKey: "",
  });

  const [status, setStatus] = useState("");
  const [casiStatus, setCasiStatus] = useState("");
  const [casiLoading, setCasiLoading] = useState(false);
  const [casiInAttesa, setCasiInAttesa] = useState<SpazioStudentiCase[]>([]);
  const [casiPubblicati, setCasiPubblicati] = useState<SpazioStudentiCase[]>(
    []
  );
  const [casiEliminati, setCasiEliminati] = useState<SpazioStudentiCase[]>([]);
  const [spazioStudentiAdminKey, setSpazioStudentiAdminKey] = useState("");
  const [caseEdits, setCaseEdits] = useState<Record<string, CasoEdit>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Invio in corso...");

    try {
      const res = await fetch(
        "https://laureasmart.it/api/admin-crea-notifica.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Key": form.adminKey.trim(),
          },
          body: JSON.stringify({
            titolo: form.titolo,
            messaggio: form.messaggio,
            categoria: "Generale",
            target: form.target,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setStatus(
          "Notifica inviata. Target: " +
            data.target +
            " - OneSignal code: " +
            data.onesignal_http_code
        );

        setForm({
          titolo: "",
          messaggio: "",
          target: "ALL",
          adminKey: form.adminKey,
        });
      } else {
        setStatus("Errore: " + data.error);
      }
    } catch (error) {
      console.error(error);
      setStatus("Errore di connessione.");
    }
  };

  const caricaCasiInAttesa = async () => {
    const adminKey = getSpazioStudentiAdminKey();

    if (!adminKey) {
      setCasiStatus("Inserisci la chiave admin prima di caricare i casi.");
      return;
    }

    setCasiLoading(true);
    setCasiStatus("Caricamento casi in attesa...");

    try {
      const res = await fetch(
        "https://laureasmart.it/api/spazio-studenti-admin.php?action=list",
        {
          method: "GET",
          headers: {
            "X-Admin-Key": adminKey,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        const cases = (data.cases || []) as SpazioStudentiCase[];
        setCasiInAttesa(cases);
        setCaseEdits((current) => {
          const next = { ...current };

          cases.forEach((caso) => {
            if (!next[caso.id]) {
              next[caso.id] = creaEditDefault(caso);
            }
          });

          return next;
        });
        setCasiStatus(`Casi in attesa: ${cases.length}`);
      } else {
        setCasiStatus(
          "Errore: " +
            (data.message || data.error || "impossibile caricare i casi.")
        );
      }
    } catch (error) {
      console.error(error);
      setCasiStatus("Errore di connessione durante il caricamento dei casi.");
    } finally {
      setCasiLoading(false);
    }
  };

  const aggiornaCasoEdit = (
    id: string,
    field: keyof CasoEdit,
    value: string
  ) => {
    setCaseEdits((current) => ({
      ...current,
      [id]: {
        ...(current[id] || {
          risposta: "",
          prossimoPasso: "",
          cta: "confronto",
        }),
        [field]: value,
      } as CasoEdit,
    }));
  };

  const getSpazioStudentiAdminKey = () =>
    spazioStudentiAdminKey.trim() || form.adminKey.trim();

  const caricaCasiPubblicati = async () => {
    const adminKey = getSpazioStudentiAdminKey();

    if (!adminKey) {
      setCasiStatus(
        "Inserisci la chiave admin prima di caricare i casi pubblicati."
      );
      return;
    }

    setCasiLoading(true);
    setCasiStatus("Caricamento casi pubblicati...");

    try {
      const res = await fetch(
        "https://laureasmart.it/api/spazio-studenti-admin.php?action=list_approved",
        {
          method: "GET",
          headers: {
            "X-Admin-Key": adminKey,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        const cases = (data.cases || []) as SpazioStudentiCase[];
        setCasiPubblicati(cases);
        setCasiStatus(`Casi pubblicati: ${cases.length}`);
      } else {
        setCasiStatus(
          "Errore: " +
            (data.message ||
              data.error ||
              "impossibile caricare i casi pubblicati.")
        );
      }
    } catch (error) {
      console.error(error);
      setCasiStatus(
        "Errore di connessione durante il caricamento dei casi pubblicati."
      );
    } finally {
      setCasiLoading(false);
    }
  };

  const caricaCasiEliminati = async () => {
    const adminKey = getSpazioStudentiAdminKey();

    if (!adminKey) {
      setCasiStatus(
        "Inserisci la chiave admin prima di caricare i casi eliminati."
      );
      return;
    }

    setCasiLoading(true);
    setCasiStatus("Caricamento casi eliminati...");

    try {
      const res = await fetch(
        "https://laureasmart.it/api/spazio-studenti-admin.php?action=list_deleted",
        {
          method: "GET",
          headers: {
            "X-Admin-Key": adminKey,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        const cases = (data.cases || []) as SpazioStudentiCase[];
        setCasiEliminati(cases);
        setCasiStatus(`Casi eliminati: ${cases.length}`);
      } else {
        setCasiStatus(
          "Errore: " +
            (data.message ||
              data.error ||
              "impossibile caricare i casi eliminati.")
        );
      }
    } catch (error) {
      console.error(error);
      setCasiStatus(
        "Errore di connessione durante il caricamento dei casi eliminati."
      );
    } finally {
      setCasiLoading(false);
    }
  };

  const aggiornaStatoCasoPubblicato = async (
    id: string,
    action: "delete_approved" | "restore_deleted"
  ) => {
    const adminKey = getSpazioStudentiAdminKey();

    if (!adminKey) {
      setCasiStatus("Inserisci la chiave admin prima di continuare.");
      return;
    }

    const conferma =
      action === "delete_approved"
        ? window.confirm(
            "Vuoi spostare questo caso tra gli eliminati? Non sarà più visibile nello Spazio Studenti."
          )
        : window.confirm(
            "Vuoi ripristinare questo caso tra i casi pubblicati?"
          );

    if (!conferma) return;

    setCasiLoading(true);
    setCasiStatus(
      action === "delete_approved"
        ? "Spostamento tra eliminati in corso..."
        : "Ripristino in corso..."
    );

    try {
      const res = await fetch(
        "https://laureasmart.it/api/spazio-studenti-admin.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Key": adminKey,
          },
          body: JSON.stringify({ id, action }),
        }
      );

      const data = await res.json();

      if (data.success) {
        if (action === "delete_approved") {
          const moved = casiPubblicati.find((item) => item.id === id);
          setCasiPubblicati((current) =>
            current.filter((item) => item.id !== id)
          );
          if (moved) {
            setCasiEliminati((current) => [moved, ...current]);
          }
          setCasiStatus("Caso spostato tra gli eliminati.");
        } else {
          const moved = casiEliminati.find((item) => item.id === id);
          setCasiEliminati((current) =>
            current.filter((item) => item.id !== id)
          );
          if (moved) {
            setCasiPubblicati((current) => [moved, ...current]);
          }
          setCasiStatus("Caso ripristinato tra i pubblicati.");
        }
      } else {
        setCasiStatus(
          "Errore: " +
            (data.message || data.error || "operazione non riuscita.")
        );
      }
    } catch (error) {
      console.error(error);
      setCasiStatus("Errore di connessione durante l’operazione.");
    } finally {
      setCasiLoading(false);
    }
  };

  const moderaCaso = async (id: string, action: "approve" | "reject") => {
    const adminKey = getSpazioStudentiAdminKey();

    if (!adminKey) {
      setCasiStatus("Inserisci la chiave admin prima di moderare.");
      return;
    }

    setCasiLoading(true);
    setCasiStatus(
      action === "approve" ? "Approvazione in corso..." : "Rifiuto in corso..."
    );

    try {
      const res = await fetch(
        "https://laureasmart.it/api/spazio-studenti-admin.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Key": adminKey,
          },
          body: JSON.stringify({
            id,
            action,
            risposta_laurea_smart: caseEdits[id]?.risposta || "",
            prossimo_passo: caseEdits[id]?.prossimoPasso || "",
            cta_label: ctaOptions[caseEdits[id]?.cta || "confronto"].label,
            cta_href: ctaOptions[caseEdits[id]?.cta || "confronto"].href || "",
            cta_whatsapp: ctaOptions[caseEdits[id]?.cta || "confronto"].whatsapp
              ? "1"
              : "0",
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setCasiInAttesa((current) => current.filter((item) => item.id !== id));
        setCasiStatus(
          action === "approve"
            ? "Caso approvato e spostato tra i contenuti pubblicabili."
            : "Caso rifiutato."
        );
      } else {
        setCasiStatus(
          "Errore: " +
            (data.message || data.error || "operazione non riuscita.")
        );
      }
    } catch (error) {
      console.error(error);
      setCasiStatus("Errore di connessione durante la moderazione.");
    } finally {
      setCasiLoading(false);
    }
  };

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <section style={heroStyle}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 11px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#BFDBFE",
              fontSize: 12,
              fontWeight: 950,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 14,
            }}
          >
            <LayoutDashboard size={15} />
            Area tecnica
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 40,
              lineHeight: 1,
              letterSpacing: -1.7,
              fontWeight: 950,
            }}
          >
            Dashboard Admin Laurea Smart
          </h1>

          <p
            style={{
              margin: "13px 0 0",
              maxWidth: 760,
              color: "rgba(255,255,255,0.74)",
              lineHeight: 1.62,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Gestisci notifiche push, moderazione dello Spazio Studenti, lead,
            attività commerciali e monitoraggio del funnel download.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
            marginTop: 18,
          }}
        >
          {adminLinkCards.map((item) => (
            <AdminQuickLinkCard key={item.href} {...item} />
          ))}
        </section>

        <section
          style={{
            ...softCardStyle,
            marginTop: 18,
            padding: 18,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 18,
                display: "grid",
                placeItems: "center",
                background: "#EAF3FB",
                color: "#1F6FB2",
                flexShrink: 0,
              }}
            >
              <BellRing size={23} />
            </div>

            <div>
              <h2 style={sectionTitleStyle}>Notifiche push OneSignal</h2>
              <p style={{ ...mutedTextStyle, margin: "8px 0 0" }}>
                Pubblica una notifica e inviala agli utenti in base alla
                segmentazione OneSignal.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 18,
            }}
          >
            <input
              type="password"
              placeholder="Chiave admin"
              value={form.adminKey}
              onChange={(e) => setForm({ ...form, adminKey: e.target.value })}
              required
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Titolo notifica"
              value={form.titolo}
              onChange={(e) => setForm({ ...form, titolo: e.target.value })}
              required
              style={inputStyle}
            />

            <textarea
              placeholder="Messaggio"
              value={form.messaggio}
              onChange={(e) => setForm({ ...form, messaggio: e.target.value })}
              required
              rows={5}
              style={inputStyle}
            />

            <label style={labelStyle}>Target push OneSignal</label>

            <select
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
              style={inputStyle}
            >
              <option value="ALL">Tutti gli utenti</option>

              <optgroup label="Area / Profilo">
                <option value="PROFILO:ECONOMIA">Economia e management</option>
                <option value="PROFILO:PSICOLOGIA">Psicologia</option>
                <option value="PROFILO:EDUCAZIONE">
                  Scienze dell’educazione
                </option>
                <option value="PROFILO:GIURIDICA">Area giuridica</option>
                <option value="PROFILO:SPORT">Scienze motorie</option>
                <option value="PROFILO:COMUNICAZIONE">Comunicazione</option>
                <option value="PROFILO:TECNOLOGIA">
                  Informatica / tecnologia
                </option>
                <option value="PROFILO:SCUOLA">Scuola e insegnamento</option>
                <option value="PROFILO:ORIENTAMENTO">
                  Indecisi / orientamento
                </option>
              </optgroup>

              <optgroup label="Obiettivo">
                <option value="OBIETTIVO:Aumentare lo stipendio">
                  Aumentare lo stipendio
                </option>
                <option value="OBIETTIVO:Cambiare lavoro">
                  Cambiare lavoro
                </option>
                <option value="OBIETTIVO:Partecipare a concorsi">
                  Partecipare a concorsi
                </option>
                <option value="OBIETTIVO:Insegnare">Insegnare</option>
                <option value="OBIETTIVO:Crescita personale">
                  Crescita personale
                </option>
                <option value="OBIETTIVO:Completare il mio profilo professionale">
                  Completare il profilo professionale
                </option>
                <option value="OBIETTIVO:Non sono sicuro">
                  Non sono sicuro
                </option>
              </optgroup>

              <optgroup label="Urgenza obiettivo">
                <option value="URGENZA:ALTA">
                  Alta - Subito / entro 1 mese
                </option>
                <option value="URGENZA:MEDIO_ALTA">
                  Medio-alta - Entro 3 mesi
                </option>
                <option value="URGENZA:MEDIA">Media - Entro 6 mesi</option>
                <option value="URGENZA:BASSA">Bassa - Entro 12 mesi</option>
                <option value="URGENZA:FREDDA">
                  Fredda - Nessuna scadenza precisa
                </option>
                <option value="URGENZA:NON_DEFINITA">
                  Urgenza non definita
                </option>
              </optgroup>

              <optgroup label="Titolo di studio">
                <option value="TITOLO:Diploma">Diploma</option>
                <option value="TITOLO:Laurea triennale">
                  Laurea triennale
                </option>
                <option value="TITOLO:Laurea magistrale">
                  Laurea magistrale
                </option>
                <option value="TITOLO:Laurea vecchio ordinamento">
                  Laurea vecchio ordinamento
                </option>
                <option value="TITOLO:Master universitario">
                  Master universitario
                </option>
                <option value="TITOLO:AFAM">
                  AFAM / Conservatorio / Accademia
                </option>
                <option value="TITOLO:Università incompleta">
                  Università incompleta
                </option>
              </optgroup>
            </select>

            <Button label="Pubblica notifica" variant="primary" type="submit" />
          </form>

          {status && (
            <p
              style={{
                margin: "16px 0 0",
                fontSize: 14,
                color: "#243244",
                fontWeight: 750,
                borderRadius: 16,
                background: "#EAF3FB",
                border: "1px solid #D7E7F5",
                padding: 12,
              }}
            >
              {status}
            </p>
          )}
        </section>

        <section
          style={{
            ...softCardStyle,
            marginTop: 18,
            padding: 18,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 18,
                display: "grid",
                placeItems: "center",
                background: "#F3E8FF",
                color: "#7E22CE",
                flexShrink: 0,
              }}
            >
              <BookOpenCheck size={23} />
            </div>

            <div>
              <h2 style={sectionTitleStyle}>Spazio Studenti</h2>
              <p style={{ ...mutedTextStyle, margin: "8px 0 0" }}>
                Qui trovi i casi inviati dagli utenti. Puoi approvarli,
                rifiutarli, archiviare i pubblicati o ripristinare gli
                eliminati.
              </p>
            </div>
          </div>

          <label
            style={{
              display: "block",
              marginTop: 14,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 14,
                fontWeight: 800,
                color: "#243244",
              }}
            >
              Chiave admin Spazio Studenti
            </span>

            <input
              type="password"
              placeholder="Inserisci la chiave admin"
              value={spazioStudentiAdminKey}
              onChange={(e) => setSpazioStudentiAdminKey(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid #D7E7F5",
                borderRadius: 16,
                padding: "13px 14px",
                fontSize: 15,
                outline: "none",
                background: "#FFFFFF",
              }}
            />
          </label>

          <Button
            label={casiLoading ? "Caricamento..." : "Carica casi in attesa"}
            variant="secondary"
            type="button"
            onClick={caricaCasiInAttesa}
          />

          {casiStatus && (
            <p style={{ marginTop: 14, fontSize: 14, color: "#333" }}>
              {casiStatus}
            </p>
          )}

          <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
            {casiInAttesa.map((caso) => (
              <article
                key={caso.id}
                style={{
                  borderRadius: 22,
                  border: "1px solid #D7E7F5",
                  background: "#F8FBFF",
                  padding: 14,
                }}
              >
                <div
                  style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                >
                  {caso.foto_url ? (
                    <img
                      src={caso.foto_url}
                      alt={caso.nome_pubblico}
                      style={{
                        width: 58,
                        height: 58,
                        objectFit: "cover",
                        borderRadius: 18,
                        border: "1px solid #D7E7F5",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: 18,
                        background: "#1F6FB2",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: 22,
                        flexShrink: 0,
                      }}
                    >
                      {(caso.nome_pubblico || "S").slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        margin: "0 0 3px",
                        fontSize: 12,
                        color: "#1F6FB2",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {caso.categoria}
                    </p>

                    <h3 style={{ margin: "0 0 5px", fontSize: 17 }}>
                      {caso.titolo}
                    </h3>

                    <p
                      style={{ margin: "0 0 6px", fontSize: 13, color: "#555" }}
                    >
                      {caso.nome_pubblico} · {caso.email}
                      {caso.telefono ? ` · ${caso.telefono}` : ""}
                    </p>
                  </div>
                </div>

                <p
                  style={{
                    marginTop: 12,
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.55,
                    color: "#243244",
                    fontSize: 14,
                  }}
                >
                  {caso.contenuto}
                </p>

                <div
                  style={{
                    marginTop: 14,
                    padding: 12,
                    borderRadius: 18,
                    background: "#FFFFFF",
                    border: "1px solid #D7E7F5",
                  }}
                >
                  <label style={{ display: "block", marginBottom: 12 }}>
                    <span
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontSize: 13,
                        fontWeight: 900,
                        color: "#243244",
                      }}
                    >
                      Risposta Laurea Smart
                    </span>

                    <textarea
                      value={caseEdits[caso.id]?.risposta || ""}
                      onChange={(e) =>
                        aggiornaCasoEdit(caso.id, "risposta", e.target.value)
                      }
                      rows={5}
                      placeholder="Scrivi la risposta che verrà mostrata pubblicamente sotto il caso."
                      style={{
                        width: "100%",
                        border: "1px solid #D7E7F5",
                        borderRadius: 14,
                        padding: 12,
                        fontSize: 14,
                        lineHeight: 1.5,
                        resize: "vertical",
                        outline: "none",
                      }}
                    />
                  </label>

                  <label style={{ display: "block", marginBottom: 12 }}>
                    <span
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontSize: 13,
                        fontWeight: 900,
                        color: "#243244",
                      }}
                    >
                      Prossimo passo consigliato
                    </span>

                    <textarea
                      value={caseEdits[caso.id]?.prossimoPasso || ""}
                      onChange={(e) =>
                        aggiornaCasoEdit(
                          caso.id,
                          "prossimoPasso",
                          e.target.value
                        )
                      }
                      rows={3}
                      placeholder="Indica cosa dovrebbe fare l’utente dopo aver letto il caso."
                      style={{
                        width: "100%",
                        border: "1px solid #D7E7F5",
                        borderRadius: 14,
                        padding: 12,
                        fontSize: 14,
                        lineHeight: 1.5,
                        resize: "vertical",
                        outline: "none",
                      }}
                    />
                  </label>

                  <label style={{ display: "block" }}>
                    <span
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontSize: 13,
                        fontWeight: 900,
                        color: "#243244",
                      }}
                    >
                      CTA consigliata
                    </span>

                    <select
                      value={caseEdits[caso.id]?.cta || "confronto"}
                      onChange={(e) =>
                        aggiornaCasoEdit(caso.id, "cta", e.target.value)
                      }
                      style={{
                        width: "100%",
                        border: "1px solid #D7E7F5",
                        borderRadius: 14,
                        padding: 12,
                        fontSize: 14,
                        background: "#FFFFFF",
                        outline: "none",
                      }}
                    >
                      <option value="valuta">
                        Valuta quello che hai già fatto
                      </option>
                      <option value="prima">Prima di scegliere</option>
                      <option value="test">Fai il test sul futuro</option>
                      <option value="confronto">
                        Voglio confrontare le mie possibilità
                      </option>
                    </select>
                  </label>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                    marginTop: 12,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => moderaCaso(caso.id, "approve")}
                    disabled={casiLoading}
                    style={{
                      minHeight: 46,
                      border: "0",
                      borderRadius: 16,
                      background: "#16A34A",
                      color: "#FFFFFF",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    Approva e pubblica
                  </button>

                  <button
                    type="button"
                    onClick={() => moderaCaso(caso.id, "reject")}
                    disabled={casiLoading}
                    style={{
                      minHeight: 46,
                      border: "0",
                      borderRadius: 16,
                      background: "#DC2626",
                      color: "#FFFFFF",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    Rifiuta
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div
            style={{
              marginTop: 24,
              paddingTop: 18,
              borderTop: "1px solid #E4EEF8",
            }}
          >
            <h3 style={{ margin: "0 0 8px", fontSize: 19 }}>Casi pubblicati</h3>

            <p style={{ margin: "0 0 12px", color: "#555", lineHeight: 1.5 }}>
              Qui trovi i casi già visibili nello Spazio Studenti. Puoi
              spostarli tra gli eliminati senza cancellarli definitivamente.
            </p>

            <Button
              label={casiLoading ? "Caricamento..." : "Carica casi pubblicati"}
              variant="secondary"
              type="button"
              onClick={caricaCasiPubblicati}
            />

            <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
              {casiPubblicati.map((caso) => (
                <article
                  key={caso.id}
                  style={{
                    borderRadius: 20,
                    border: "1px solid #D7E7F5",
                    background: "#F8FBFF",
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    {caso.foto_url ? (
                      <img
                        src={caso.foto_url}
                        alt={caso.nome_pubblico}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 16,
                          border: "1px solid #D7E7F5",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 16,
                          background: "#1F6FB2",
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 900,
                          fontSize: 20,
                          flexShrink: 0,
                        }}
                      >
                        {(caso.nome_pubblico || "S").slice(0, 1).toUpperCase()}
                      </div>
                    )}

                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          margin: "0 0 3px",
                          fontSize: 12,
                          color: "#16A34A",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Pubblicato · {caso.categoria}
                      </p>

                      <h4 style={{ margin: "0 0 5px", fontSize: 16 }}>
                        {caso.titolo}
                      </h4>

                      <p style={{ margin: 0, fontSize: 13, color: "#555" }}>
                        {caso.nome_pubblico}
                      </p>
                    </div>
                  </div>

                  <p
                    style={{
                      marginTop: 10,
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.5,
                      color: "#243244",
                      fontSize: 13,
                    }}
                  >
                    {caso.contenuto}
                  </p>

                  {caso.risposta_laurea_smart && (
                    <div
                      style={{
                        marginTop: 10,
                        borderRadius: 16,
                        background: "#FFFFFF",
                        border: "1px solid #D7E7F5",
                        padding: 12,
                      }}
                    >
                      <strong style={{ fontSize: 13 }}>
                        Risposta Laurea Smart
                      </strong>
                      <p
                        style={{
                          margin: "6px 0 0",
                          fontSize: 13,
                          lineHeight: 1.5,
                        }}
                      >
                        {caso.risposta_laurea_smart}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      aggiornaStatoCasoPubblicato(caso.id, "delete_approved")
                    }
                    disabled={casiLoading}
                    style={{
                      marginTop: 12,
                      width: "100%",
                      minHeight: 44,
                      border: "0",
                      borderRadius: 15,
                      background: "#DC2626",
                      color: "#FFFFFF",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    Elimina dai pubblicati
                  </button>
                </article>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              paddingTop: 18,
              borderTop: "1px solid #E4EEF8",
            }}
          >
            <h3 style={{ margin: "0 0 8px", fontSize: 19 }}>Casi eliminati</h3>

            <p style={{ margin: "0 0 12px", color: "#555", lineHeight: 1.5 }}>
              I casi eliminati non sono visibili nella app, ma restano
              archiviati e possono essere ripristinati.
            </p>

            <Button
              label={casiLoading ? "Caricamento..." : "Carica casi eliminati"}
              variant="secondary"
              type="button"
              onClick={caricaCasiEliminati}
            />

            <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
              {casiEliminati.map((caso) => (
                <article
                  key={caso.id}
                  style={{
                    borderRadius: 20,
                    border: "1px solid #FECACA",
                    background: "#FFF7F7",
                    padding: 14,
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 3px",
                      fontSize: 12,
                      color: "#DC2626",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Eliminato · {caso.categoria}
                  </p>

                  <h4 style={{ margin: "0 0 5px", fontSize: 16 }}>
                    {caso.titolo}
                  </h4>

                  <p style={{ margin: 0, fontSize: 13, color: "#555" }}>
                    {caso.nome_pubblico}
                  </p>

                  <p
                    style={{
                      marginTop: 10,
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.5,
                      color: "#243244",
                      fontSize: 13,
                    }}
                  >
                    {caso.contenuto}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      aggiornaStatoCasoPubblicato(caso.id, "restore_deleted")
                    }
                    disabled={casiLoading}
                    style={{
                      marginTop: 12,
                      width: "100%",
                      minHeight: 44,
                      border: "0",
                      borderRadius: 15,
                      background: "#16A34A",
                      color: "#FFFFFF",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    Ripristina tra i pubblicati
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            ...heroStyle,
            marginTop: 18,
            padding: 18,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 18,
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.12)",
                color: "#BFDBFE",
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={23} />
            </div>

            <div>
              <h2 style={{ margin: 0, fontSize: 22, letterSpacing: -0.6 }}>
                Collegamenti rapidi
              </h2>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "rgba(255,255,255,0.70)",
                  lineHeight: 1.55,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Usa questa dashboard come punto di ingresso per le attività
                tecniche e commerciali principali.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 12,
              marginTop: 16,
            }}
          >
            <Link
              href="/admin/leads"
              style={{
                minHeight: 52,
                borderRadius: 18,
                background: "#FFFFFF",
                color: "#1F6FB2",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                textDecoration: "none",
                fontWeight: 950,
              }}
            >
              <UsersRound size={18} />
              Apri gestione lead
            </Link>

            <Link
              href="/admin/download-funnel"
              style={{
                minHeight: 52,
                borderRadius: 18,
                background: "#ECFDF3",
                color: "#15803D",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                textDecoration: "none",
                fontWeight: 950,
              }}
            >
              <BarChart3 size={18} />
              Apri download funnel
            </Link>
          </div>
        </section>

        <BottomNav />
      </div>
    </main>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: 13,
  borderRadius: 16,
  border: "1px solid #D7E7F5",
  background: "#FFFFFF",
  fontSize: 15,
  color: "#0F172A",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};
