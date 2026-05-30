"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Phone,
  Mail,
  Flame,
  Clock3,
  GraduationCap,
  MessageCircle,
  Filter,
} from "lucide-react";
import Link from "next/link";

type Lead = {
  id: number;
  email: string;
  nome?: string | null;
  cognome?: string | null;
  telefono?: string | null;

  stato_iscrizione?: string | null;
  segmento_studente?: string | null;
  titolo_studio?: string | null;
  obiettivo?: string | null;
  motivazione_studio?: string | null;
  urgenza?: string | null;
  tempo_disponibile?: string | null;
  area_interesse?: string | null;
  aspetto_da_valutare?: string | null;

  profilo_utente?: string | null;
  corso_suggerito?: string | null;

  segmento_intento?: string | null;
  segmento_ingresso?: string | null;
  segmento_urgenza?: string | null;
  segmento_motivazione?: string | null;
  segmento_aspetto?: string | null;

  lead_score?: number | null;
  lead_status?: string | null;
  orientatore_assegnato?: string | null;
  ultimo_evento?: string | null;
  ultima_attivita_at?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  count?: number;
  leads?: Lead[];
};

const API_URL = "https://laureasmart.it/api/ls-admin-leads-list.php";

const statiLead = [
  { value: "", label: "Tutti gli stati" },
  { value: "nuovo", label: "Nuovo" },
  { value: "da_chiamare", label: "Da chiamare" },
  { value: "contattato", label: "Contattato" },
  { value: "interessato", label: "Interessato" },
  { value: "non_risponde", label: "Non risponde" },
  { value: "iscritto", label: "Iscritto" },
  { value: "perso", label: "Perso" },
];

const orientatori = [
  { value: "", label: "Tutti gli orientatori" },
  { value: "Giulia C.", label: "Giulia C." },
  { value: "Giulia", label: "Giulia" },
  { value: "Guido", label: "Guido" },
  { value: "Non assegnato", label: "Non assegnato" },
];

function formatDate(value?: string | null) {
  if (!value) return "—";

  const parsed = new Date(value.replace(" ", "T"));

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getLeadName(lead: Lead) {
  const fullName = [lead.nome, lead.cognome].filter(Boolean).join(" ").trim();
  return fullName || lead.email || "Lead senza nome";
}

function getScoreLabel(score?: number | null) {
  const value = Number(score || 0);

  if (value >= 80) return "Caldo";
  if (value >= 50) return "Tiepido";
  if (value >= 25) return "Freddo";
  return "Nuovo";
}

function getWhatsAppUrl(lead: Lead) {
  const phone = (lead.telefono || "").replace(/\D/g, "");

  if (!phone) return "";

  const text = encodeURIComponent(
    `Ciao ${
      lead.nome || ""
    }, sono dell'orientamento Laurea Smart. Ho visto che hai completato il test e ti interessa ${
      lead.area_interesse || "un percorso universitario"
    }. Vuoi che ti aiuti a capire il percorso più adatto?`
  );

  return `https://wa.me/39${phone.replace(/^39/, "")}?text=${text}`;
}

export default function AdminLeadsPage() {
  const [adminKey, setAdminKey] = useState("");
  const [adminKeySaved, setAdminKeySaved] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("ls_admin_key") || "";
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState("");
  const [ultimoAggiornamento, setUltimoAggiornamento] = useState("");

  const [search, setSearch] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [orientatore, setOrientatore] = useState("");

  const keyAttiva = adminKeySaved || adminKey;

  async function caricaLeads() {
    setErrore("");

    if (!keyAttiva.trim()) {
      setErrore("Inserisci la chiave admin per caricare i lead.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_key: keyAttiva.trim(),
          search: search.trim(),
          lead_status: leadStatus,
          orientatore_assegnato: orientatore,
          limit: 150,
        }),
      });

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        setErrore(result.message || "Errore nel caricamento dei lead.");
        return;
      }

      setLeads(result.leads || []);
      setUltimoAggiornamento(new Date().toLocaleString("it-IT"));
    } catch (error) {
      console.error(error);
      setErrore("Errore di connessione durante il caricamento dei lead.");
    } finally {
      setLoading(false);
    }
  }

  function salvaChiaveAdmin() {
    const key = adminKey.trim();

    if (!key) {
      setErrore("Inserisci una chiave admin valida.");
      return;
    }

    localStorage.setItem("ls_admin_key", key);
    setAdminKeySaved(key);
    setAdminKey("");
    setErrore("");
  }

  function rimuoviChiaveAdmin() {
    localStorage.removeItem("ls_admin_key");
    setAdminKeySaved("");
    setAdminKey("");
    setLeads([]);
  }

  const statistiche = useMemo(() => {
    const totale = leads.length;
    const caldi = leads.filter(
      (lead) => Number(lead.lead_score || 0) >= 80
    ).length;
    const daChiamare = leads.filter(
      (lead) =>
        lead.lead_status === "da_chiamare" || lead.lead_status === "nuovo"
    ).length;
    const conTelefono = leads.filter((lead) => Boolean(lead.telefono)).length;

    return {
      totale,
      caldi,
      daChiamare,
      conTelefono,
    };
  }, [leads]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #173E68 0%, transparent 32%), linear-gradient(180deg, #0B1728 0%, #07111F 100%)",
        color: "#FFFFFF",
        padding: 20,
        paddingBottom: 80,
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <Link
              href="/admin"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "rgba(255,255,255,0.72)",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              <ArrowLeft size={16} />
              Torna ad admin
            </Link>

            <h1
              style={{
                margin: 0,
                fontSize: 34,
                lineHeight: 1.05,
                letterSpacing: "-0.05em",
              }}
            >
              Lead Laurea Smart
            </h1>

            <p
              style={{
                margin: "10px 0 0",
                color: "rgba(255,255,255,0.68)",
                fontSize: 15,
                lineHeight: 1.6,
                maxWidth: 720,
              }}
            >
              Pannello operativo per vedere profili, score, interessi e ultime
              attività degli utenti che hanno usato l&apos;app.
            </p>
          </div>

          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 22,
              background: "rgba(31,111,178,0.22)",
              display: "grid",
              placeItems: "center",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <ShieldCheck size={26} />
          </div>
        </header>

        <section
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 28,
            padding: 18,
            marginBottom: 18,
            boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            <div>
              <label style={labelStyle}>Chiave admin</label>
              <input
                type="password"
                value={adminKeySaved ? "••••••••••••••••" : adminKey}
                disabled={Boolean(adminKeySaved)}
                onChange={(event) => setAdminKey(event.target.value)}
                placeholder="Inserisci chiave admin"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Cerca lead</label>
              <div style={{ position: "relative" }}>
                <Search
                  size={17}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.46)",
                  }}
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Nome, email, corso..."
                  style={{
                    ...inputStyle,
                    paddingLeft: 42,
                  }}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Stato lead</label>
              <select
                value={leadStatus}
                onChange={(event) => setLeadStatus(event.target.value)}
                style={inputStyle}
              >
                {statiLead.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Orientatore</label>
              <select
                value={orientatore}
                onChange={(event) => setOrientatore(event.target.value)}
                style={inputStyle}
              >
                {orientatori.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 16,
            }}
          >
            <button
              type="button"
              onClick={adminKeySaved ? caricaLeads : salvaChiaveAdmin}
              disabled={loading}
              style={primaryButtonStyle}
            >
              {loading ? <RefreshCw size={17} /> : <Filter size={17} />}
              {adminKeySaved ? "Carica lead" : "Salva chiave"}
            </button>

            {adminKeySaved && (
              <>
                <button
                  type="button"
                  onClick={caricaLeads}
                  disabled={loading}
                  style={secondaryButtonStyle}
                >
                  <RefreshCw size={17} />
                  Aggiorna
                </button>

                <button
                  type="button"
                  onClick={rimuoviChiaveAdmin}
                  style={ghostButtonStyle}
                >
                  Rimuovi chiave
                </button>
              </>
            )}
          </div>

          {errore && (
            <div
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 16,
                background: "rgba(220,38,38,0.14)",
                border: "1px solid rgba(248,113,113,0.24)",
                color: "#fecaca",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {errore}
            </div>
          )}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <StatCard label="Lead caricati" value={statistiche.totale} />
          <StatCard label="Lead caldi" value={statistiche.caldi} />
          <StatCard label="Da chiamare" value={statistiche.daChiamare} />
          <StatCard label="Con telefono" value={statistiche.conTelefono} />
        </section>

        {ultimoAggiornamento && (
          <p
            style={{
              margin: "0 0 12px",
              color: "rgba(255,255,255,0.54)",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Ultimo aggiornamento: {ultimoAggiornamento}
          </p>
        )}

        {leads.length === 0 ? (
          <section
            style={{
              borderRadius: 28,
              padding: 28,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.10)",
              textAlign: "center",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            <UserRound size={34} style={{ marginBottom: 12 }} />
            <h2 style={{ margin: 0, fontSize: 20 }}>Nessun lead caricato</h2>
            <p
              style={{ margin: "10px auto 0", maxWidth: 520, lineHeight: 1.6 }}
            >
              Inserisci la chiave admin e clicca su Carica lead per visualizzare
              gli utenti salvati nel database.
            </p>
          </section>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            {leads.map((lead) => (
              <LeadCard key={`${lead.email}-${lead.id}`} lead={lead} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const score = Number(lead.lead_score || 0);
  const scoreLabel = getScoreLabel(score);
  const whatsappUrl = getWhatsAppUrl(lead);

  return (
    <article
      style={{
        borderRadius: 28,
        background: "#FFFFFF",
        color: "#0F172A",
        padding: 20,
        boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 14,
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 21,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
            }}
          >
            {getLeadName(lead)}
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 10,
            }}
          >
            <Badge>{lead.lead_status || "nuovo"}</Badge>
            <Badge>{lead.orientatore_assegnato || "Non assegnato"}</Badge>
            <Badge>{lead.area_interesse || "Area non indicata"}</Badge>
          </div>
        </div>

        <div
          style={{
            minWidth: 82,
            textAlign: "center",
            borderRadius: 22,
            padding: "10px 12px",
            background:
              score >= 80
                ? "rgba(220,38,38,0.10)"
                : score >= 50
                ? "rgba(245,158,11,0.12)"
                : "rgba(31,111,178,0.10)",
            color:
              score >= 80 ? "#DC2626" : score >= 50 ? "#B45309" : "#1F6FB2",
            fontWeight: 900,
          }}
        >
          <div style={{ fontSize: 24, lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 11, marginTop: 3 }}>{scoreLabel}</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginTop: 16,
        }}
      >
        <InfoRow icon={<Mail size={16} />} label="Email" value={lead.email} />
        <InfoRow
          icon={<Phone size={16} />}
          label="Telefono"
          value={lead.telefono || "Non indicato"}
        />
        <InfoRow
          icon={<GraduationCap size={16} />}
          label="Corso suggerito"
          value={lead.corso_suggerito || "Non ancora disponibile"}
        />
        <InfoRow
          icon={<Flame size={16} />}
          label="Urgenza"
          value={lead.urgenza || lead.segmento_urgenza || "Non indicata"}
        />
        <InfoRow
          icon={<Clock3 size={16} />}
          label="Ultima attività"
          value={formatDate(lead.ultima_attivita_at || lead.updated_at)}
        />
        <InfoRow
          icon={<UserRound size={16} />}
          label="Ultimo evento"
          value={lead.ultimo_evento || "—"}
        />
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 20,
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 10,
            fontSize: 13,
            color: "#334155",
            lineHeight: 1.45,
          }}
        >
          <div>
            <strong>Obiettivo:</strong> {lead.obiettivo || "—"}
          </div>
          <div>
            <strong>Titolo studio:</strong> {lead.titolo_studio || "—"}
          </div>
          <div>
            <strong>Motivazione:</strong> {lead.motivazione_studio || "—"}
          </div>
          <div>
            <strong>Aspetto critico:</strong> {lead.aspetto_da_valutare || "—"}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginTop: 16,
        }}
      >
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...primaryButtonStyle,
              background: "#25D366",
              textDecoration: "none",
            }}
          >
            <MessageCircle size={17} />
            Scrivi su WhatsApp
          </a>
        ) : (
          <button type="button" disabled style={disabledButtonStyle}>
            <MessageCircle size={17} />
            Telefono mancante
          </button>
        )}

        <a
          href={`mailto:${lead.email}`}
          style={{
            ...secondaryButtonStyle,
            color: "#1F6FB2",
            borderColor: "rgba(31,111,178,0.18)",
            textDecoration: "none",
          }}
        >
          <Mail size={17} />
          Email
        </a>
      </div>
    </article>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        borderRadius: 24,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        padding: 18,
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 900,
          letterSpacing: "-0.04em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 4,
          color: "rgba(255,255,255,0.62)",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "6px 10px",
        background: "rgba(31,111,178,0.10)",
        color: "#1F6FB2",
        fontSize: 12,
        fontWeight: 850,
      }}
    >
      {children}
    </span>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 12,
          background: "rgba(31,111,178,0.10)",
          color: "#1F6FB2",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 850,
            textTransform: "uppercase",
            color: "#64748B",
            letterSpacing: "0.04em",
            marginBottom: 3,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 750,
            color: "#0F172A",
            overflowWrap: "anywhere",
            lineHeight: 1.35,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontSize: 12,
  fontWeight: 850,
  color: "rgba(255,255,255,0.74)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 46,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  color: "#FFFFFF",
  padding: "0 14px",
  outline: "none",
  fontSize: 14,
  fontWeight: 700,
};

const primaryButtonStyle: React.CSSProperties = {
  minHeight: 46,
  border: 0,
  borderRadius: 16,
  background: "#1F6FB2",
  color: "#FFFFFF",
  padding: "0 16px",
  fontSize: 14,
  fontWeight: 850,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  minHeight: 46,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  color: "#FFFFFF",
  padding: "0 16px",
  fontSize: 14,
  fontWeight: 850,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  cursor: "pointer",
};

const ghostButtonStyle: React.CSSProperties = {
  minHeight: 46,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "transparent",
  color: "rgba(255,255,255,0.72)",
  padding: "0 16px",
  fontSize: 14,
  fontWeight: 850,
  cursor: "pointer",
};

const disabledButtonStyle: React.CSSProperties = {
  minHeight: 46,
  borderRadius: 16,
  border: "1px solid #E2E8F0",
  background: "#F1F5F9",
  color: "#94A3B8",
  padding: "0 16px",
  fontSize: 14,
  fontWeight: 850,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  cursor: "not-allowed",
};
