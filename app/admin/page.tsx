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

type TemplateSummary = {
  sequence_key: string;
  step_number: number;
  template_key: string;
  subject: string;
  is_active: number;
  updated_at?: string | null;
};

type EmailTemplate = {
  id?: number;
  sequence_key: string;
  step_number: number;
  template_key: string;
  subject: string;
  preheader: string;
  hero_title: string;
  hero_subtitle: string;
  intro_text: string;
  result_box_title: string;
  result_box_body: string;
  main_title: string;
  main_body: string;
  focus_title: string;
  focus_body: string;
  next_step_title: string;
  next_step_body: string;
  note_text: string;
  cta_primary_label: string;
  cta_secondary_label: string;
  is_active: number;
};

type ApiResponse = {
  success: boolean;
  message: string;
  summary?: Summary;
  leads?: LeadRow[];
  events?: EventRow[];
  sequences?: Sequence[];
  templates?: TemplateSummary[];
  template?: EmailTemplate;
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

function TemplateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span
        style={{
          color: "rgba(255,255,255,0.74)",
          fontSize: 13,
          fontWeight: 900,
        }}
      >
        {label}
      </span>
      <input
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: "100%",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.95)",
          color: "#0F172A",
          borderRadius: 15,
          padding: "12px 13px",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </label>
  );
}

function TemplateTextarea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span
        style={{
          color: "rgba(255,255,255,0.74)",
          fontSize: 13,
          fontWeight: 900,
        }}
      >
        {label}
      </span>
      <textarea
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        style={{
          width: "100%",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.95)",
          color: "#0F172A",
          borderRadius: 15,
          padding: "12px 13px",
          fontSize: 14,
          lineHeight: 1.55,
          outline: "none",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />
    </label>
  );
}

export default function EmailNurturingAdminPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState("");
  const [selectedTemplateStep, setSelectedTemplateStep] = useState(1);
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [templateStatus, setTemplateStatus] = useState("");
  const [templateLoading, setTemplateLoading] = useState(false);
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
      setTemplates(json.templates || []);
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

  const loadTemplate = useCallback(async () => {
    if (!selectedTemplateKey || !selectedTemplateStep) {
      setTemplateStatus("Seleziona una sequenza e uno step.");
      return;
    }

    setTemplateLoading(true);
    setTemplateStatus("Caricamento template...");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          admin_key: ADMIN_KEY,
          action: "get_template",
          sequence_key: selectedTemplateKey,
          step_number: selectedTemplateStep,
        }),
      });

      const json = (await response.json()) as ApiResponse;

      if (!response.ok || !json.success || !json.template) {
        throw new Error(json.message || "Template non trovato");
      }

      setEmailTemplate(json.template);
      setTemplateStatus("Template caricato. Puoi modificarlo e salvarlo.");
    } catch (error) {
      setEmailTemplate(null);
      setTemplateStatus(
        error instanceof Error ? error.message : "Errore caricamento template"
      );
    } finally {
      setTemplateLoading(false);
    }
  }, [selectedTemplateKey, selectedTemplateStep]);

  const saveTemplate = async () => {
    if (!emailTemplate) {
      setTemplateStatus("Nessun template caricato.");
      return;
    }

    setTemplateLoading(true);
    setTemplateStatus("Salvataggio template...");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          admin_key: ADMIN_KEY,
          action: "update_template",
          template: emailTemplate,
        }),
      });

      const json = (await response.json()) as ApiResponse;

      if (!response.ok || !json.success) {
        throw new Error(json.message || "Errore salvataggio template");
      }

      setTemplateStatus("Template salvato correttamente.");
      void fetchData();
    } catch (error) {
      setTemplateStatus(
        error instanceof Error ? error.message : "Errore salvataggio template"
      );
    } finally {
      setTemplateLoading(false);
    }
  };

  const updateTemplateField = (
    field: keyof EmailTemplate,
    value: string | number
  ) => {
    setEmailTemplate((current) => {
      if (!current) return current;

      return {
        ...current,
        [field]: value,
      };
    });
  };

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

        <section
          style={{
            ...cardStyle,
            padding: 16,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
              alignItems: "flex-start",
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 22 }}>
                Gestione template email
              </h2>
              <p
                style={{
                  margin: "7px 0 0",
                  color: "rgba(255,255,255,0.66)",
                  fontSize: 14,
                  lineHeight: 1.55,
                }}
              >
                Modifica oggetto, titolo, testi e CTA delle email nurturing.
                Puoi usare variabili come {"{{titolo_studio}}"},{" "}
                {"{{obiettivo}}"},{"{{percorso_prioritario}}"}.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 1fr) 120px 160px",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <select
              value={selectedTemplateKey}
              onChange={(event) => {
                setSelectedTemplateKey(event.target.value);
                setEmailTemplate(null);
                setTemplateStatus("");
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
              <option value="">Seleziona sequenza</option>
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
              value={selectedTemplateStep}
              onChange={(event) => {
                setSelectedTemplateStep(Number(event.target.value));
                setEmailTemplate(null);
                setTemplateStatus("");
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
              {[1, 2, 3, 4, 5].map((step) => (
                <option key={step} value={step}>
                  Step {step}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => void loadTemplate()}
              disabled={templateLoading}
              style={{
                border: 0,
                borderRadius: 16,
                minHeight: 46,
                background: "#FFFFFF",
                color: "#1F6FB2",
                fontWeight: 950,
                cursor: "pointer",
              }}
            >
              {templateLoading ? "Carico..." : "Carica"}
            </button>
          </div>

          {templateStatus && (
            <p
              style={{
                margin: "0 0 14px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: 12,
                color: "rgba(255,255,255,0.76)",
                fontSize: 13,
                fontWeight: 750,
              }}
            >
              {templateStatus}
            </p>
          )}

          {emailTemplate && (
            <div style={{ display: "grid", gap: 12 }}>
              <TemplateInput
                label="Oggetto email"
                value={emailTemplate.subject}
                onChange={(value) => updateTemplateField("subject", value)}
              />

              <TemplateInput
                label="Preheader"
                value={emailTemplate.preheader}
                onChange={(value) => updateTemplateField("preheader", value)}
              />

              <TemplateInput
                label="Titolo hero"
                value={emailTemplate.hero_title}
                onChange={(value) => updateTemplateField("hero_title", value)}
              />

              <TemplateInput
                label="Sottotitolo hero"
                value={emailTemplate.hero_subtitle}
                onChange={(value) =>
                  updateTemplateField("hero_subtitle", value)
                }
              />

              <TemplateTextarea
                label="Testo introduttivo"
                value={emailTemplate.intro_text}
                onChange={(value) => updateTemplateField("intro_text", value)}
                rows={4}
              />

              <TemplateInput
                label="Titolo box risultato"
                value={emailTemplate.result_box_title}
                onChange={(value) =>
                  updateTemplateField("result_box_title", value)
                }
              />

              <TemplateTextarea
                label="Corpo box risultato"
                value={emailTemplate.result_box_body}
                onChange={(value) =>
                  updateTemplateField("result_box_body", value)
                }
                rows={3}
              />

              <TemplateInput
                label="Titolo principale"
                value={emailTemplate.main_title}
                onChange={(value) => updateTemplateField("main_title", value)}
              />

              <TemplateTextarea
                label="Corpo principale"
                value={emailTemplate.main_body}
                onChange={(value) => updateTemplateField("main_body", value)}
                rows={5}
              />

              <TemplateInput
                label="Titolo approfondimento"
                value={emailTemplate.focus_title}
                onChange={(value) => updateTemplateField("focus_title", value)}
              />

              <TemplateTextarea
                label="Corpo approfondimento"
                value={emailTemplate.focus_body}
                onChange={(value) => updateTemplateField("focus_body", value)}
                rows={4}
              />

              <TemplateInput
                label="Titolo prossimo passo"
                value={emailTemplate.next_step_title}
                onChange={(value) =>
                  updateTemplateField("next_step_title", value)
                }
              />

              <TemplateTextarea
                label="Corpo prossimo passo"
                value={emailTemplate.next_step_body}
                onChange={(value) =>
                  updateTemplateField("next_step_body", value)
                }
                rows={4}
              />

              <TemplateTextarea
                label="Nota finale"
                value={emailTemplate.note_text}
                onChange={(value) => updateTemplateField("note_text", value)}
                rows={4}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 10,
                }}
              >
                <TemplateInput
                  label="CTA primaria"
                  value={emailTemplate.cta_primary_label}
                  onChange={(value) =>
                    updateTemplateField("cta_primary_label", value)
                  }
                />

                <TemplateInput
                  label="CTA WhatsApp"
                  value={emailTemplate.cta_secondary_label}
                  onChange={(value) =>
                    updateTemplateField("cta_secondary_label", value)
                  }
                />
              </div>

              <div
                style={{
                  borderRadius: 18,
                  background: "rgba(34,211,238,0.10)",
                  border: "1px solid rgba(34,211,238,0.18)",
                  padding: 14,
                  color: "rgba(255,255,255,0.78)",
                  fontSize: 13,
                  lineHeight: 1.55,
                }}
              >
                Variabili disponibili: {"{{titolo_studio}}"}, {"{{obiettivo}}"},
                {" {{area_interesse}}"}, {"{{risultato_titolo}}"},
                {" {{percorso_prioritario}}"},
                {" {{approfondimento_orientamento}}"},
                {" {{prossimo_passo_orientamento}}"}, {"{{sequence_key}}"}.
              </div>

              <button
                type="button"
                onClick={() => void saveTemplate()}
                disabled={templateLoading}
                style={{
                  border: 0,
                  borderRadius: 18,
                  minHeight: 52,
                  background: "#FFFFFF",
                  color: "#1F6FB2",
                  fontWeight: 950,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.20)",
                }}
              >
                {templateLoading ? "Salvataggio..." : "Salva template"}
              </button>
            </div>
          )}

          {templates.length > 0 && (
            <details style={{ marginTop: 16 }}>
              <summary
                style={{
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 900,
                  fontSize: 13,
                }}
              >
                Mostra lista template disponibili ({templates.length})
              </summary>

              <div
                style={{
                  marginTop: 10,
                  maxHeight: 220,
                  overflow: "auto",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Sequenza</th>
                      <th style={thStyle}>Step</th>
                      <th style={thStyle}>Oggetto</th>
                      <th style={thStyle}>Aggiornato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {templates.slice(0, 80).map((template) => (
                      <tr
                        key={`${template.sequence_key}-${template.step_number}`}
                      >
                        <td style={tdStyle}>{template.sequence_key}</td>
                        <td style={tdStyle}>{template.step_number}</td>
                        <td style={tdStyle}>{template.subject}</td>
                        <td style={tdStyle}>
                          {formatDate(template.updated_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
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
