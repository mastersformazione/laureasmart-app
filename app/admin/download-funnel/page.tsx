"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  MousePointerClick,
  RefreshCcw,
  Search,
  Target,
  UserCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";

const ADMIN_DOWNLOAD_FUNNEL_ENDPOINT =
  "https://laureasmart.it/api/admin-download-funnel.php";

/*
  Inserisci qui la stessa admin key usata negli altri admin.
  Se nelle altre pagine la prendi da localStorage o env, possiamo uniformarla dopo.
*/
const ADMIN_KEY = "Fra29Sus03";

type FunnelSummary = {
  click_totali: number;
  arrivati_al_form: number;
  lead_inviati: number;
  solo_click: number;
  persi_sul_form: number;
  conversione_click_form: number;
  conversione_click_lead: number;
  conversione_form_lead: number;
};

type FunnelRow = {
  id: number;
  click_id: string;
  event_name?: string;
  source_page?: string;
  destination_url?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  funnel_status?: string | null;
  form_reached_at?: string | null;
  lead_submitted_at?: string | null;
  lead_email?: string | null;
  lead_nome?: string | null;
  lead_telefono?: string | null;
  created_at?: string;
  stato_label: string;
  stato_key: "solo_click" | "arrivato_form" | "lead_inviato";
};

type ApiResponse = {
  success: boolean;
  message: string;
  summary: FunnelSummary;
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  rows: FunnelRow[];
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, #173E68 0%, transparent 34%), linear-gradient(180deg, #0B1728 0%, #07111F 100%)",
  color: "#FFFFFF",
  padding: "24px 18px 80px",
  fontFamily: "var(--font-sora), Arial, sans-serif",
};

const containerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 1180,
  margin: "0 auto",
};

const cardStyle: React.CSSProperties = {
  borderRadius: 28,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 22px 55px rgba(0,0,0,0.22)",
  backdropFilter: "blur(12px)",
};

const inputStyle: React.CSSProperties = {
  minHeight: 46,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  color: "#FFFFFF",
  padding: "0 14px",
  outline: "none",
  fontSize: 14,
  fontWeight: 700,
};

const buttonStyle: React.CSSProperties = {
  minHeight: 46,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.10)",
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

function statusStyle(status: FunnelRow["stato_key"]): React.CSSProperties {
  if (status === "lead_inviato") {
    return {
      background: "#ECFDF3",
      color: "#15803D",
      border: "1px solid rgba(22,163,74,0.18)",
    };
  }

  if (status === "arrivato_form") {
    return {
      background: "#FFF7E6",
      color: "#B45309",
      border: "1px solid rgba(180,83,9,0.18)",
    };
  }

  return {
    background: "#EAF3FB",
    color: "#1F6FB2",
    border: "1px solid rgba(31,111,178,0.18)",
  };
}

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
  tone: "blue" | "green" | "amber" | "purple" | "red";
}) {
  const tones = {
    blue: {
      bg: "#EAF3FB",
      color: "#1F6FB2",
    },
    green: {
      bg: "#ECFDF3",
      color: "#15803D",
    },
    amber: {
      bg: "#FFF7E6",
      color: "#B45309",
    },
    purple: {
      bg: "#F3E8FF",
      color: "#7E22CE",
    },
    red: {
      bg: "#FEF2F2",
      color: "#DC2626",
    },
  };

  const selected = tones[tone];

  return (
    <section
      style={{
        borderRadius: 24,
        background: selected.bg,
        color: "#0F172A",
        padding: 18,
        border: "1px solid rgba(255,255,255,0.14)",
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

      <p
        style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 900,
          color: "#475569",
        }}
      >
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

export default function AdminDownloadFunnelPage() {
  const [rows, setRows] = useState<FunnelRow[]>([]);
  const [summary, setSummary] = useState<FunnelSummary | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState("");

  const hasData = useMemo(() => rows.length > 0, [rows]);

  const caricaDati = async (nextPage = page) => {
    setLoading(true);
    setErrore("");

    try {
      const response = await fetch(ADMIN_DOWNLOAD_FUNNEL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          admin_key: ADMIN_KEY,
          page: nextPage,
          per_page: 50,
          search,
          status,
        }),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Errore caricamento funnel");
      }

      setRows(data.rows || []);
      setSummary(data.summary);
      setPage(data.page || nextPage);
      setTotalPages(data.total_pages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      setErrore(
        error instanceof Error
          ? error.message
          : "Errore durante il caricamento dati"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void caricaDati(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applicaFiltri = () => {
    setPage(1);
    void caricaDati(1);
  };

  const resetFiltri = () => {
    setSearch("");
    setStatus("");
    setPage(1);

    setTimeout(() => {
      void caricaDati(1);
    }, 0);
  };

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 14,
            alignItems: "flex-start",
            marginBottom: 22,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Link
              href="/admin/leads"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "rgba(255,255,255,0.72)",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 850,
                marginBottom: 14,
              }}
            >
              <ArrowLeft size={16} />
              Torna ad admin lead
            </Link>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 11px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.14)",
                fontSize: 12,
                fontWeight: 900,
                color: "#BFDBFE",
                marginBottom: 12,
              }}
            >
              <Download size={14} />
              Download funnel
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 38,
                lineHeight: 1,
                letterSpacing: -1.6,
              }}
            >
              Funnel download Laurea Smart
            </h1>

            <p
              style={{
                margin: "12px 0 0",
                maxWidth: 720,
                color: "rgba(255,255,255,0.72)",
                fontSize: 15,
                lineHeight: 1.6,
                fontWeight: 600,
              }}
            >
              Monitora quante persone cliccano dalla landing, quante arrivano
              alla scheda finale del test e quante lasciano i dati.
            </p>
          </div>

          <button
            type="button"
            onClick={() => caricaDati()}
            style={buttonStyle}
          >
            {loading ? <Loader2 size={17} /> : <RefreshCcw size={17} />}
            Aggiorna
          </button>
        </header>

        {summary && (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 14,
              marginBottom: 18,
            }}
          >
            <StatCard
              title="Click landing"
              value={summary.click_totali}
              subtitle="Tutti i click sui pulsanti download/test."
              icon={<MousePointerClick size={22} />}
              tone="blue"
            />

            <StatCard
              title="Arrivati al form"
              value={summary.arrivati_al_form}
              subtitle={`${summary.conversione_click_form}% dei click arrivano alla scheda dati.`}
              icon={<Target size={22} />}
              tone="amber"
            />

            <StatCard
              title="Lead inviati"
              value={summary.lead_inviati}
              subtitle={`${summary.conversione_click_lead}% dei click diventano lead.`}
              icon={<UserCheck size={22} />}
              tone="green"
            />

            <StatCard
              title="Persi sul form"
              value={summary.persi_sul_form}
              subtitle={`${summary.conversione_form_lead}% di conversione form → lead.`}
              icon={<XCircle size={22} />}
              tone="red"
            />
          </section>
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
              gridTemplateColumns: "minmax(220px, 1fr) 220px auto auto",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.48)",
                }}
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cerca email, telefono, click id, campagna..."
                style={{
                  ...inputStyle,
                  width: "100%",
                  paddingLeft: 40,
                }}
              />
            </div>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              style={inputStyle}
            >
              <option value="">Tutti gli stati</option>
              <option value="solo_click">Solo click</option>
              <option value="arrivato_form">Arrivato al form</option>
              <option value="lead_inviato">Lead inviato</option>
            </select>

            <button type="button" onClick={applicaFiltri} style={buttonStyle}>
              Filtra
            </button>

            <button type="button" onClick={resetFiltri} style={buttonStyle}>
              Reset
            </button>
          </div>
        </section>

        {errore && (
          <div
            style={{
              borderRadius: 18,
              padding: 14,
              background: "#FEF2F2",
              color: "#DC2626",
              fontSize: 14,
              fontWeight: 850,
              marginBottom: 18,
            }}
          >
            {errore}
          </div>
        )}

        <section
          style={{
            ...cardStyle,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 20 }}>Dettaglio eventi</h2>
              <p
                style={{
                  margin: "5px 0 0",
                  color: "rgba(255,255,255,0.62)",
                  fontSize: 13,
                  fontWeight: 650,
                }}
              >
                {total} record trovati
              </p>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "rgba(255,255,255,0.68)",
                fontWeight: 750,
              }}
            >
              <Activity size={16} />
              Pagina {page} di {totalPages}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 1050,
                borderCollapse: "collapse",
                color: "#FFFFFF",
              }}
            >
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.06)" }}>
                  <th style={thStyle}>Stato</th>
                  <th style={thStyle}>Lead</th>
                  <th style={thStyle}>Telefono</th>
                  <th style={thStyle}>Click</th>
                  <th style={thStyle}>Form</th>
                  <th style={thStyle}>Invio dati</th>
                  <th style={thStyle}>Campagna</th>
                  <th style={thStyle}>Click ID</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={8} style={emptyStyle}>
                      <Loader2 size={18} /> Caricamento dati...
                    </td>
                  </tr>
                )}

                {!loading && !hasData && (
                  <tr>
                    <td colSpan={8} style={emptyStyle}>
                      Nessun dato trovato.
                    </td>
                  </tr>
                )}

                {!loading &&
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <td style={tdStyle}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "7px 10px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 900,
                            whiteSpace: "nowrap",
                            ...statusStyle(row.stato_key),
                          }}
                        >
                          {row.stato_key === "lead_inviato" && (
                            <CheckCircle2 size={14} />
                          )}
                          {row.stato_key === "arrivato_form" && (
                            <Clock size={14} />
                          )}
                          {row.stato_key === "solo_click" && (
                            <MousePointerClick size={14} />
                          )}
                          {row.stato_label}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <strong>{row.lead_nome || "-"}</strong>
                        <div style={{ color: "rgba(255,255,255,0.58)" }}>
                          {row.lead_email || "-"}
                        </div>
                      </td>

                      <td style={tdStyle}>{row.lead_telefono || "-"}</td>

                      <td style={tdStyle}>{formatDate(row.created_at)}</td>

                      <td style={tdStyle}>{formatDate(row.form_reached_at)}</td>

                      <td style={tdStyle}>
                        {formatDate(row.lead_submitted_at)}
                      </td>

                      <td style={tdStyle}>
                        <div>{row.utm_source || "-"}</div>
                        <div style={{ color: "rgba(255,255,255,0.58)" }}>
                          {row.utm_campaign || ""}
                        </div>
                      </td>

                      <td style={tdStyle}>
                        <code
                          style={{
                            fontSize: 11,
                            color: "#BFDBFE",
                            wordBreak: "break-all",
                          }}
                        >
                          {row.click_id}
                        </code>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
              borderTop: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => {
                const next = Math.max(1, page - 1);
                setPage(next);
                void caricaDati(next);
              }}
              style={{
                ...buttonStyle,
                opacity: page <= 1 || loading ? 0.45 : 1,
              }}
            >
              Precedente
            </button>

            <span
              style={{
                color: "rgba(255,255,255,0.68)",
                fontSize: 13,
                fontWeight: 750,
              }}
            >
              {page} / {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => {
                const next = Math.min(totalPages, page + 1);
                setPage(next);
                void caricaDati(next);
              }}
              style={{
                ...buttonStyle,
                opacity: page >= totalPages || loading ? 0.45 : 1,
              }}
            >
              Successiva
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 14px",
  fontSize: 12,
  color: "rgba(255,255,255,0.62)",
  textTransform: "uppercase",
  letterSpacing: 0.6,
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "13px 14px",
  fontSize: 13,
  verticalAlign: "top",
  lineHeight: 1.45,
};

const emptyStyle: React.CSSProperties = {
  padding: 28,
  textAlign: "center",
  color: "rgba(255,255,255,0.64)",
  fontSize: 14,
};
