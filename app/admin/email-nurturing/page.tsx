"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Mail,
  MousePointerClick,
  RefreshCcw,
  Search,
  Send,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";

const API_URL = "https://laureasmart.it/api/admin-email-nurturing.php";
const ADMIN_KEY = "Fra29Sus03";

type Summary = {
  lead_totali: number;
  lead_attivi: number;
  lead_completati: number;
  lead_pausa: number;
  disiscritti: number;
  lead_caldi: number;
  lead_con_apertura: number;
  lead_con_click: number;
  lead_in_scadenza: number;
  email_eventi_totali: number;
  email_inviate: number;
  email_aperte: number;
  email_cliccate: number;
  email_fallite: number;
  aperture_totali: number;
  click_totali: number;
  click_whatsapp: number;
  open_rate: number;
  click_rate: number;
  lead_click_rate: number;
};

type LeadRow = {
  id: number;
  email: string;
  nome?: string | null;
  cognome?: string | null;
  telefono?: string | null;
  titolo_studio?: string | null;
  obiettivo?: string | null;
  area_interesse?: string | null;
  segmento_ingresso?: string | null;
  segmento_intento?: string | null;
  segmento_urgenza?: string | null;
  sequence_key: string;
  nurturing_status: string;
  lead_status: string;
  lead_score: number;
  is_unsubscribed: number;
  next_email_due_at?: string | null;
  last_email_sent_at?: string | null;
  last_opened_at?: string | null;
  last_clicked_at?: string | null;
  created_at?: string | null;
  email_inviate: number;
  email_aperte: number;
  email_cliccate: number;
  click_totali: number;
  click_whatsapp: number;
};

type EventRow = {
  id: number;
  lead_id: number;
  email: string;
  sequence_key: string;
  step_number: number;
  template_key: string;
  subject: string;
  status: string;
  sent_at?: string | null;
  opened_at?: string | null;
  first_clicked_at?: string | null;
  last_clicked_at?: string | null;
  open_count: number;
  click_count: number;
  created_at?: string | null;
};

type Sequence = {
  sequence_key: string;
  nome: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  summary?: Summary;
  leads?: LeadRow[];
  events?: EventRow[];
  sequences?: Sequence[];
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
};

function formatDate(value?: string | null) {
  if (!value) return "-";

  try {
    return new Date(value.replace(" ", "T")).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function formatPercent(value?: number | null) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "0%";
  return `${n.toFixed(2).replace(".", ",")}%`;
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, #173E68 0, #0B1728 42%, #07111F 100%)",
  color: "#fff",
  padding: "22px 16px 94px",
};

const shellStyle: React.CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
};

const cardStyle: React.CSSProperties = {
  borderRadius: 26,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 18px 46px rgba(0,0,0,0.24)",
  backdropFilter: "blur(16px)",
};

const thStyle: React.CSSProperties = {
  padding: "12px 12px",
  textAlign: "left",
  fontSize: 12,
  color: "rgba(255,255,255,0.62)",
  borderBottom: "1px solid rgba(255,255,255,0.10)",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "13px 12px",
  fontSize: 13,
  color: "rgba(255,255,255,0.82)",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  verticalAlign: "top",
};

function StatCard({
  title,
  value,
  subtitle,
  icon,
  tone,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  tone: "blue" | "green" | "amber" | "purple" | "red" | "cyan";
}) {
  const tones = {
    blue: { bg: "#EAF3FB", color: "#1F6FB2" },
    green: { bg: "#ECFDF3", color: "#15803D" },
    amber: { bg: "#FFF7E6", color: "#B45309" },
    purple: { bg: "#F3E8FF", color: "#7E22CE" },
    red: { bg: "#FEF2F2", color: "#DC2626" },
    cyan: { bg: "#E8F7FB", color: "#0E7490" },
  };

  const selected = tones[tone];

  return (
    <section
      style={{
        borderRadius: 24,
        background: selected.bg,
        color: "#0F172A",
        padding: 18,
        boxShadow: "0 14px 34px rgba(15,23,42,0.14)",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 16,
          display: "grid",
          placeItems: "center",
          background: "rgba(255,255,255,0.78)",
          color: selected.color,
          marginBottom: 12,
        }}
      >
        {icon}
      </div>

      <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: "#475569" }}>
        {title}
      </p>

      <strong
        style={{
          display: "block",
          marginTop: 4,
          fontSize: 30,
          lineHeight: 1,
          letterSpacing: -1.2,
        }}
      >
        {value}
      </strong>

      <p
        style={{
          margin: "8px 0 0",
          fontSize: 13,
          lineHeight: 1.45,
          color: "#64748B",
          fontWeight: 650,
        }}
      >
        {subtitle}
      </p>
    </section>
  );
}

function statusBadge(status: string, unsubscribed?: number) {
  if (unsubscribed) {
    return {
      label: "Disiscritto",
      bg: "#FEF2F2",
      color: "#DC2626",
    };
  }

  if (status === "completed") {
    return {
      label: "Completato",
      bg: "#ECFDF3",
      color: "#15803D",
    };
  }

  if (status === "paused") {
    return {
      label: "In pausa",
      bg: "#FFF7E6",
      color: "#B45309",
    };
  }

  return {
    label: "Attivo",
    bg: "#EAF3FB",
    color: "#1F6FB2",
  };
}

function eventBadge(status: string) {
  if (status === "clicked") {
    return { bg: "#ECFDF3", color: "#15803D" };
  }

  if (status === "opened") {
    return { bg: "#EAF3FB", color: "#1F6FB2" };
  }

  if (status === "failed") {
    return { bg: "#FEF2F2", color: "#DC2626" };
  }

  if (status === "pending") {
    return { bg: "#FFF7E6", color: "#B45309" };
  }

  return { bg: "#F3E8FF", color: "#7E22CE" };
}

export default function EmailNurturingAdminPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sequenceKey, setSequenceKey] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrore("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          admin_key: ADMIN_KEY,
          page,
          per_page: 50,
          search,
          status,
          sequence_key: sequenceKey,
        }),
      });

      const json = (await response.json()) as ApiResponse;

      if (!response.ok || !json.success) {
        throw new Error(json.message || "Errore caricamento dati");
      }

      setSummary(json.summary || null);
      setLeads(json.leads || []);
      setEvents(json.events || []);
      setSequences(json.sequences || []);
      setTotal(json.total || 0);
      setTotalPages(json.total_pages || 1);
    } catch (error) {
      setErrore(error instanceof Error ? error.message : "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, sequenceKey]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filteredSummaryText = useMemo(() => {
    if (!summary) return "";
    return `Open rate ${formatPercent(
      summary.open_rate
    )} · Click rate ${formatPercent(summary.click_rate)} · WhatsApp ${
      summary.click_whatsapp
    }`;
  }, [summary]);

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 14,
            flexWrap: "wrap",
            marginBottom: 20,
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
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              <ArrowLeft size={16} />
              Torna alla dashboard admin
            </Link>

            <h1
              style={{
                margin: 0,
                fontSize: 36,
                lineHeight: 1.05,
                letterSpacing: -1.3,
              }}
            >
              Email nurturing
            </h1>

            <p
              style={{
                margin: "10px 0 0",
                color: "rgba(255,255,255,0.68)",
                fontSize: 15,
                lineHeight: 1.55,
                maxWidth: 760,
              }}
            >
              Monitoraggio proprietario delle sequenze email Laurea Smart:
              invii, aperture, click, WhatsApp, disiscrizioni e lead caldi.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchData()}
            disabled={loading}
            style={{
              border: 0,
              borderRadius: 16,
              padding: "12px 16px",
              background: "#ffffff",
              color: "#0F172A",
              fontWeight: 900,
              display: "inline-flex",
              gap: 8,
              alignItems: "center",
              cursor: "pointer",
              boxShadow: "0 12px 28px rgba(0,0,0,0.20)",
            }}
          >
            <RefreshCcw size={17} />
            {loading ? "Aggiorno..." : "Aggiorna"}
          </button>
        </header>

        {errore && (
          <section
            style={{
              ...cardStyle,
              padding: 16,
              marginBottom: 18,
              background: "rgba(220,38,38,0.14)",
              color: "#FECACA",
            }}
          >
            <strong>Errore:</strong> {errore}
          </section>
        )}

        {summary && (
          <>
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: 14,
                marginBottom: 18,
              }}
            >
              <StatCard
                title="Lead nurturing"
                value={summary.lead_totali}
                subtitle={`${summary.lead_attivi} attivi · ${summary.lead_completati} completati`}
                icon={<Users size={22} />}
                tone="blue"
              />

              <StatCard
                title="Email inviate"
                value={summary.email_inviate}
                subtitle={`${summary.email_fallite} fallite`}
                icon={<Mail size={22} />}
                tone="purple"
              />

              <StatCard
                title="Open rate"
                value={formatPercent(summary.open_rate)}
                subtitle={`${summary.email_aperte} email aperte`}
                icon={<Activity size={22} />}
                tone="cyan"
              />

              <StatCard
                title="Click rate"
                value={formatPercent(summary.click_rate)}
                subtitle={`${summary.email_cliccate} email cliccate`}
                icon={<MousePointerClick size={22} />}
                tone="green"
              />

              <StatCard
                title="Click WhatsApp"
                value={summary.click_whatsapp}
                subtitle="Click tracciati verso orientatore"
                icon={<Send size={22} />}
                tone="green"
              />

              <StatCard
                title="Disiscritti"
                value={summary.disiscritti}
                subtitle={`${summary.lead_caldi} lead caldi`}
                icon={<XCircle size={22} />}
                tone="red"
              />
            </section>

            <section
              style={{
                ...cardStyle,
                padding: 18,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "7px 11px",
                      borderRadius: 999,
                      background: "rgba(34,211,238,0.12)",
                      border: "1px solid rgba(34,211,238,0.22)",
                      color: "#A5F3FC",
                      fontSize: 12,
                      fontWeight: 950,
                      marginBottom: 10,
                    }}
                  >
                    <TrendingUp size={15} />
                    Sintesi nurturing
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      fontSize: 24,
                      lineHeight: 1.08,
                      letterSpacing: -0.8,
                    }}
                  >
                    {summary.lead_con_click} lead hanno cliccato almeno una
                    email.
                  </h2>

                  <p
                    style={{
                      margin: "10px 0 0",
                      color: "rgba(255,255,255,0.70)",
                      fontSize: 14,
                      lineHeight: 1.55,
                      fontWeight: 650,
                    }}
                  >
                    {filteredSummaryText}. Lead con prossima email già in
                    scadenza: <strong>{summary.lead_in_scadenza}</strong>.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        <section
          style={{
            ...cardStyle,
            padding: 16,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(220px, 1fr) minmax(180px, 260px) minmax(160px, 220px)",
              gap: 10,
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: "0 12px",
              }}
            >
              <Search size={16} style={{ color: "rgba(255,255,255,0.62)" }} />
              <input
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                placeholder="Cerca email, obiettivo, sequenza..."
                style={{
                  width: "100%",
                  border: 0,
                  outline: 0,
                  background: "transparent",
                  color: "#fff",
                  padding: "13px 0",
                  fontSize: 14,
                }}
              />
            </label>

            <select
              value={sequenceKey}
              onChange={(event) => {
                setPage(1);
                setSequenceKey(event.target.value);
              }}
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                borderRadius: 16,
                padding: "0 12px",
                minHeight: 46,
                fontWeight: 800,
              }}
            >
              <option value="">Tutte le sequenze</option>
              {sequences.map((sequence) => (
                <option
                  key={sequence.sequence_key}
                  value={sequence.sequence_key}
                >
                  {sequence.sequence_key}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(event) => {
                setPage(1);
                setStatus(event.target.value);
              }}
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                borderRadius: 16,
                padding: "0 12px",
                minHeight: 46,
                fontWeight: 800,
              }}
            >
              <option value="">Tutti gli stati</option>
              <option value="active">Attivi</option>
              <option value="due">In scadenza</option>
              <option value="opened">Hanno aperto</option>
              <option value="clicked">Hanno cliccato</option>
              <option value="hot">Lead caldi</option>
              <option value="completed">Completati</option>
              <option value="unsubscribed">Disiscritti</option>
            </select>
          </div>
        </section>

        <section style={{ ...cardStyle, overflow: "hidden", marginBottom: 18 }}>
          <div
            style={{
              padding: 16,
              borderBottom: "1px solid rgba(255,255,255,0.10)",
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 20 }}>Lead nurturing</h2>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "rgba(255,255,255,0.60)",
                  fontSize: 13,
                }}
              >
                {total} lead trovati · pagina {page} di {totalPages}
              </p>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Lead</th>
                  <th style={thStyle}>Profilo</th>
                  <th style={thStyle}>Sequenza</th>
                  <th style={thStyle}>Stato</th>
                  <th style={thStyle}>Score</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Prossima</th>
                  <th style={thStyle}>Ultime azioni</th>
                </tr>
              </thead>

              <tbody>
                {leads.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        ...tdStyle,
                        textAlign: "center",
                        padding: 28,
                        color: "rgba(255,255,255,0.62)",
                      }}
                    >
                      Nessun lead trovato.
                    </td>
                  </tr>
                )}

                {leads.map((lead) => {
                  const badge = statusBadge(
                    lead.nurturing_status,
                    lead.is_unsubscribed
                  );

                  return (
                    <tr key={lead.id}>
                      <td style={tdStyle}>
                        <strong style={{ color: "#fff" }}>{lead.email}</strong>
                        <br />
                        <span style={{ color: "rgba(255,255,255,0.54)" }}>
                          ID {lead.id} · {formatDate(lead.created_at)}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <strong>{lead.titolo_studio || "-"}</strong>
                        <br />
                        {lead.obiettivo || "-"}
                        <br />
                        <span style={{ color: "rgba(255,255,255,0.54)" }}>
                          {lead.area_interesse || "-"}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <code
                          style={{
                            fontSize: 12,
                            color: "#BAE6FD",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {lead.sequence_key}
                        </code>
                        <br />
                        <span style={{ color: "rgba(255,255,255,0.54)" }}>
                          {lead.segmento_ingresso} · {lead.segmento_intento}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 9px",
                            borderRadius: 999,
                            background: badge.bg,
                            color: badge.color,
                            fontSize: 12,
                            fontWeight: 900,
                          }}
                        >
                          {lead.is_unsubscribed ? (
                            <XCircle size={13} />
                          ) : lead.nurturing_status === "completed" ? (
                            <CheckCircle2 size={13} />
                          ) : (
                            <Clock size={13} />
                          )}
                          {badge.label}
                        </span>
                        <br />
                        <span style={{ color: "rgba(255,255,255,0.54)" }}>
                          {lead.lead_status}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <strong style={{ fontSize: 18, color: "#fff" }}>
                          {lead.lead_score}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        Inviate: {lead.email_inviate}
                        <br />
                        Aperte: {lead.email_aperte}
                        <br />
                        Click: {lead.click_totali}
                        <br />
                        WhatsApp: {lead.click_whatsapp}
                      </td>

                      <td style={tdStyle}>
                        {formatDate(lead.next_email_due_at)}
                      </td>

                      <td style={tdStyle}>
                        Ultima email: {formatDate(lead.last_email_sent_at)}
                        <br />
                        Apertura: {formatDate(lead.last_opened_at)}
                        <br />
                        Click: {formatDate(lead.last_clicked_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div
            style={{
              padding: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              style={{
                border: 0,
                borderRadius: 14,
                padding: "10px 14px",
                fontWeight: 900,
                cursor: page <= 1 ? "not-allowed" : "pointer",
                opacity: page <= 1 ? 0.5 : 1,
              }}
            >
              Pagina precedente
            </button>

            <span style={{ color: "rgba(255,255,255,0.64)", fontSize: 13 }}>
              Pagina {page} di {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              style={{
                border: 0,
                borderRadius: 14,
                padding: "10px 14px",
                fontWeight: 900,
                cursor: page >= totalPages ? "not-allowed" : "pointer",
                opacity: page >= totalPages ? 0.5 : 1,
              }}
            >
              Pagina successiva
            </button>
          </div>
        </section>

        <section style={{ ...cardStyle, overflow: "hidden" }}>
          <div
            style={{
              padding: 16,
              borderBottom: "1px solid rgba(255,255,255,0.10)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Mail size={20} />
            <div>
              <h2 style={{ margin: 0, fontSize: 20 }}>Ultimi eventi email</h2>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "rgba(255,255,255,0.60)",
                  fontSize: 13,
                }}
              >
                Invii, aperture, click e fallimenti recenti.
              </p>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Step</th>
                  <th style={thStyle}>Oggetto</th>
                  <th style={thStyle}>Stato</th>
                  <th style={thStyle}>Aperture</th>
                  <th style={thStyle}>Click</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>

              <tbody>
                {events.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        ...tdStyle,
                        textAlign: "center",
                        padding: 28,
                        color: "rgba(255,255,255,0.62)",
                      }}
                    >
                      Nessun evento email trovato.
                    </td>
                  </tr>
                )}

                {events.map((event) => {
                  const badge = eventBadge(event.status);

                  return (
                    <tr key={event.id}>
                      <td style={tdStyle}>
                        <strong>{event.email}</strong>
                        <br />
                        <code style={{ color: "#BAE6FD", fontSize: 12 }}>
                          {event.sequence_key}
                        </code>
                      </td>

                      <td style={tdStyle}>
                        Step {event.step_number}
                        <br />
                        <span style={{ color: "rgba(255,255,255,0.54)" }}>
                          {event.template_key}
                        </span>
                      </td>

                      <td style={tdStyle}>{event.subject}</td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 9px",
                            borderRadius: 999,
                            background: badge.bg,
                            color: badge.color,
                            fontSize: 12,
                            fontWeight: 900,
                          }}
                        >
                          {event.status === "failed" ? (
                            <AlertTriangle size={13} />
                          ) : event.status === "clicked" ? (
                            <MousePointerClick size={13} />
                          ) : (
                            <Mail size={13} />
                          )}
                          {event.status}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        {event.open_count}
                        <br />
                        {formatDate(event.opened_at)}
                      </td>

                      <td style={tdStyle}>
                        {event.click_count}
                        <br />
                        {formatDate(event.first_clicked_at)}
                      </td>

                      <td style={tdStyle}>
                        Creata: {formatDate(event.created_at)}
                        <br />
                        Inviata: {formatDate(event.sent_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
