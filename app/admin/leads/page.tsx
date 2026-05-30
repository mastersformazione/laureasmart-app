"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Filter,
  Flame,
  GraduationCap,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";

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

type LeadTask = {
  id: number;
  user_email: string;
  lead_nome?: string | null;
  lead_telefono?: string | null;
  orientatore?: string | null;
  titolo: string;
  descrizione?: string | null;
  due_at: string;
  status: "aperto" | "completato" | "annullato" | string;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  count?: number;
  leads?: Lead[];
};

type TasksApiResponse = {
  success: boolean;
  message?: string;
  count?: number;
  tasks?: LeadTask[];
};

type UsersApiResponse = {
  success: boolean;
  message?: string;
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
  users?: Lead[];
};

const API_URL = "https://laureasmart.it/api/ls-admin-leads-list.php";

const TASKS_LIST_API_URL = "https://laureasmart.it/api/ls-admin-tasks-list.php";

const TASK_SAVE_API_URL = "https://laureasmart.it/api/ls-admin-task-save.php";

const TASK_UPDATE_API_URL =
  "https://laureasmart.it/api/ls-admin-task-update-status.php";

const LEAD_STATUS_UPDATE_API_URL =
  "https://laureasmart.it/api/ls-admin-lead-update-status.php";

const USERS_LIST_API_URL = "https://laureasmart.it/api/ls-admin-users-list.php";

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
  const [messaggioLeadStatus, setMessaggioLeadStatus] = useState("");
  const [aggiornamentoLeadInCorso, setAggiornamentoLeadInCorso] = useState("");
  const [ultimoAggiornamento, setUltimoAggiornamento] = useState("");

  const [search, setSearch] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [orientatore, setOrientatore] = useState("");

  const [tasks, setTasks] = useState<LeadTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [messaggioTask, setMessaggioTask] = useState("");

  const [utentiRegistrati, setUtentiRegistrati] = useState<Lead[]>([]);
  const [loadingUtenti, setLoadingUtenti] = useState(false);
  const [paginaUtenti, setPaginaUtenti] = useState(1);
  const [totaleUtenti, setTotaleUtenti] = useState(0);
  const [totalePagineUtenti, setTotalePagineUtenti] = useState(1);
  const [searchUtenti, setSearchUtenti] = useState("");
  const [erroreUtenti, setErroreUtenti] = useState("");

  const [taskLead, setTaskLead] = useState<Lead | null>(null);
  const [taskTitolo, setTaskTitolo] = useState("");
  const [taskDescrizione, setTaskDescrizione] = useState("");
  const [taskData, setTaskData] = useState("");
  const [taskOra, setTaskOra] = useState("");

  const keyAttiva = adminKeySaved || adminKey;

  async function caricaTasks() {
    setMessaggioTask("");

    if (!keyAttiva.trim()) {
      return;
    }

    try {
      setLoadingTasks(true);

      const response = await fetch(TASKS_LIST_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_key: keyAttiva.trim(),
          status: "aperto",
          limit: 100,
        }),
      });

      const result = (await response.json()) as TasksApiResponse;

      if (!response.ok || !result.success) {
        setMessaggioTask(result.message || "Errore nel caricamento dei task.");
        return;
      }

      setTasks(result.tasks || []);
    } catch (error) {
      console.error(error);
      setMessaggioTask(
        "Errore di connessione durante il caricamento dei task."
      );
    } finally {
      setLoadingTasks(false);
    }
  }

  async function caricaUtentiRegistrati(pageToLoad = paginaUtenti) {
    setErroreUtenti("");

    if (!keyAttiva.trim()) {
      return;
    }

    try {
      setLoadingUtenti(true);

      const response = await fetch(USERS_LIST_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_key: keyAttiva.trim(),
          page: pageToLoad,
          per_page: 50,
          search: searchUtenti.trim(),
        }),
      });

      const result = (await response.json()) as UsersApiResponse;

      if (!response.ok || !result.success) {
        setErroreUtenti(result.message || "Errore nel caricamento utenti.");
        return;
      }

      setUtentiRegistrati(result.users || []);
      setPaginaUtenti(result.page || pageToLoad);
      setTotaleUtenti(result.total || 0);
      setTotalePagineUtenti(result.total_pages || 1);
    } catch (error) {
      console.error(error);
      setErroreUtenti("Errore di connessione durante il caricamento utenti.");
    } finally {
      setLoadingUtenti(false);
    }
  }

  function apriTaskForm(lead: Lead) {
    setTaskLead(lead);
    setTaskTitolo(`Ricontattare ${getLeadName(lead)}`);
    setTaskDescrizione(
      lead.corso_suggerito
        ? `Verificare interesse per: ${lead.corso_suggerito}`
        : ""
    );
    setTaskData("");
    setTaskOra("");
    setMessaggioTask("");
  }

  function chiudiTaskForm() {
    setTaskLead(null);
    setTaskTitolo("");
    setTaskDescrizione("");
    setTaskData("");
    setTaskOra("");
  }

  async function salvaTask() {
    setMessaggioTask("");

    if (!keyAttiva.trim()) {
      setMessaggioTask("Chiave admin mancante.");
      return;
    }

    if (!taskLead) {
      setMessaggioTask("Lead non selezionato.");
      return;
    }

    if (!taskTitolo.trim()) {
      setMessaggioTask("Inserisci il titolo del task.");
      return;
    }

    if (!taskData || !taskOra) {
      setMessaggioTask("Inserisci data e ora del promemoria.");
      return;
    }

    const dueAt = `${taskData} ${taskOra}:00`;

    try {
      const response = await fetch(TASK_SAVE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_key: keyAttiva.trim(),
          user_email: taskLead.email,
          lead_nome: getLeadName(taskLead),
          lead_telefono: taskLead.telefono || "",
          orientatore: taskLead.orientatore_assegnato || "Giulia",
          titolo: taskTitolo.trim(),
          descrizione: taskDescrizione.trim(),
          due_at: dueAt,
          created_by: "Admin Laurea Smart",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessaggioTask(
          result.message || "Errore durante il salvataggio task."
        );
        return;
      }

      setMessaggioTask("Task creato correttamente.");
      chiudiTaskForm();
      await caricaTasks();
      await caricaUtentiRegistrati(1);
    } catch (error) {
      console.error(error);
      setMessaggioTask("Errore di connessione durante il salvataggio task.");
    }
  }

  async function aggiornaStatusTask(
    taskId: number,
    status: "completato" | "annullato"
  ) {
    setMessaggioTask("");

    if (!keyAttiva.trim()) {
      setMessaggioTask("Chiave admin mancante.");
      return;
    }

    try {
      const response = await fetch(TASK_UPDATE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_key: keyAttiva.trim(),
          task_id: taskId,
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessaggioTask(result.message || "Errore aggiornamento task.");
        return;
      }

      setMessaggioTask(
        status === "completato" ? "Task completato." : "Task annullato."
      );

      await caricaTasks();
    } catch (error) {
      console.error(error);
      setMessaggioTask("Errore di connessione durante l'aggiornamento task.");
    }
  }

  async function aggiornaStatusLead(lead: Lead, nuovoStatus: string) {
    const email = lead.email;

    setErrore("");
    setMessaggioLeadStatus("");

    if (!keyAttiva.trim()) {
      setErrore("Chiave admin mancante.");
      return;
    }

    if (!email) {
      setErrore("Email lead mancante.");
      return;
    }

    if (!nuovoStatus) {
      setErrore("Seleziona uno stato valido.");
      return;
    }

    const oldStatus = lead.lead_status || "nuovo";

    if (oldStatus === nuovoStatus) {
      return;
    }

    try {
      setAggiornamentoLeadInCorso(email);

      const response = await fetch(LEAD_STATUS_UPDATE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_key: keyAttiva.trim(),
          user_email: email,
          old_status: oldStatus,
          new_status: nuovoStatus,
          operatore: "Admin Laurea Smart",
          nota: `Cambio stato da ${oldStatus} a ${nuovoStatus}`,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrore(result.message || "Errore aggiornamento stato lead.");
        return;
      }

      const nowIso = new Date().toISOString();
      const updateLead = (item: Lead) =>
        item.email === email
          ? {
              ...item,
              lead_status: nuovoStatus,
              ultimo_evento: "lead_status_aggiornato",
              ultima_attivita_at: nowIso,
              updated_at: nowIso,
            }
          : item;

      setLeads((current) => current.map(updateLead));
      setUtentiRegistrati((current) => current.map(updateLead));

      setMessaggioLeadStatus(
        `${getLeadName(lead)} aggiornato a: ${nuovoStatus}`
      );
    } catch (error) {
      console.error(error);
      setErrore("Errore di connessione durante l'aggiornamento stato lead.");
    } finally {
      setAggiornamentoLeadInCorso("");
    }
  }

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
      await caricaTasks();
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
    setTasks([]);
    setUtentiRegistrati([]);
    setPaginaUtenti(1);
    setTotaleUtenti(0);
    setTotalePagineUtenti(1);
    setErroreUtenti("");
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
      {taskLead && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(2,6,23,0.72)",
            display: "grid",
            placeItems: "center",
            padding: 18,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              borderRadius: 28,
              background: "#FFFFFF",
              color: "#0F172A",
              padding: 22,
              boxShadow: "0 24px 70px rgba(0,0,0,0.38)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 24,
                    letterSpacing: "-0.04em",
                  }}
                >
                  Nuovo task
                </h2>
                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#64748B",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  Lead: <strong>{getLeadName(taskLead)}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={chiudiTaskForm}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 14,
                  border: "1px solid #E2E8F0",
                  background: "#F8FAFC",
                  color: "#0F172A",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <XCircle size={20} />
              </button>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <label>
                <span style={modalLabelStyle}>Titolo task</span>
                <input
                  value={taskTitolo}
                  onChange={(event) => setTaskTitolo(event.target.value)}
                  placeholder="Es. Richiamare per informazioni"
                  style={modalInputStyle}
                />
              </label>

              <label>
                <span style={modalLabelStyle}>Descrizione</span>
                <textarea
                  value={taskDescrizione}
                  onChange={(event) => setTaskDescrizione(event.target.value)}
                  placeholder="Note operative per l'orientatore"
                  rows={4}
                  style={{
                    ...modalInputStyle,
                    height: "auto",
                    paddingTop: 12,
                    resize: "vertical",
                  }}
                />
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <label>
                  <span style={modalLabelStyle}>Data</span>
                  <input
                    type="date"
                    value={taskData}
                    onChange={(event) => setTaskData(event.target.value)}
                    style={modalInputStyle}
                  />
                </label>

                <label>
                  <span style={modalLabelStyle}>Ora</span>
                  <input
                    type="time"
                    value={taskOra}
                    onChange={(event) => setTaskOra(event.target.value)}
                    style={modalInputStyle}
                  />
                </label>
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 18,
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  fontSize: 13,
                  color: "#334155",
                  lineHeight: 1.5,
                }}
              >
                <strong>Orientatore:</strong>{" "}
                {taskLead.orientatore_assegnato || "Giulia"}
              </div>

              <button
                type="button"
                onClick={salvaTask}
                style={primaryButtonStyle}
              >
                <CalendarPlus size={17} />
                Salva task
              </button>
            </div>
          </div>
        </div>
      )}

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

          {messaggioLeadStatus && (
            <div
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 16,
                background: "rgba(22,163,74,0.16)",
                border: "1px solid rgba(74,222,128,0.24)",
                color: "#BBF7D0",
                fontSize: 13,
                fontWeight: 750,
              }}
            >
              {messaggioLeadStatus}
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

        <section
          style={{
            borderRadius: 28,
            padding: 18,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  letterSpacing: "-0.04em",
                }}
              >
                Task aperti
              </h2>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "rgba(255,255,255,0.62)",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                Promemoria operativi per richiamare o seguire i lead.
              </p>
            </div>

            <button
              type="button"
              onClick={caricaTasks}
              disabled={loadingTasks}
              style={secondaryButtonStyle}
            >
              <RefreshCw size={17} />
              {loadingTasks ? "Carico..." : "Aggiorna task"}
            </button>
          </div>

          {messaggioTask && (
            <div
              style={{
                marginBottom: 12,
                padding: 12,
                borderRadius: 16,
                background: "rgba(31,111,178,0.18)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#DBEAFE",
                fontSize: 13,
                fontWeight: 750,
              }}
            >
              {messaggioTask}
            </div>
          )}

          {tasks.length === 0 ? (
            <div
              style={{
                borderRadius: 20,
                padding: 18,
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.68)",
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              Nessun task aperto. Puoi crearne uno dalla scheda di un lead.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onComplete={() => aggiornaStatusTask(task.id, "completato")}
                  onCancel={() => aggiornaStatusTask(task.id, "annullato")}
                />
              ))}
            </div>
          )}
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
              <LeadCard
                key={`${lead.email}-${lead.id}`}
                lead={lead}
                onCreateTask={() => apriTaskForm(lead)}
                onUpdateStatus={(nuovoStatus) =>
                  aggiornaStatusLead(lead, nuovoStatus)
                }
                statusUpdating={aggiornamentoLeadInCorso === lead.email}
              />
            ))}
          </div>
        )}

        <section
          style={{
            marginTop: 28,
            borderRadius: 28,
            padding: 18,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 24,
                  letterSpacing: "-0.04em",
                }}
              >
                Utenti registrati in app
              </h2>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "rgba(255,255,255,0.62)",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                Elenco cronologico dal più recente al meno recente, 50 contatti
                per pagina.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
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
                  value={searchUtenti}
                  onChange={(event) => setSearchUtenti(event.target.value)}
                  placeholder="Cerca contatto..."
                  style={{
                    ...inputStyle,
                    width: 260,
                    paddingLeft: 42,
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => caricaUtentiRegistrati(1)}
                disabled={loadingUtenti}
                style={secondaryButtonStyle}
              >
                <RefreshCw size={17} />
                {loadingUtenti ? "Carico..." : "Carica utenti"}
              </button>
            </div>
          </div>

          {erroreUtenti && (
            <div
              style={{
                marginBottom: 12,
                padding: 12,
                borderRadius: 16,
                background: "rgba(220,38,38,0.14)",
                border: "1px solid rgba(248,113,113,0.24)",
                color: "#fecaca",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {erroreUtenti}
            </div>
          )}

          <div
            style={{
              marginBottom: 12,
              color: "rgba(255,255,255,0.62)",
              fontSize: 13,
              fontWeight: 750,
            }}
          >
            Totale contatti: {totaleUtenti} · Pagina {paginaUtenti} di{" "}
            {totalePagineUtenti}
          </div>

          <div
            style={{
              overflowX: "auto",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 980,
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.74)",
                    fontSize: 12,
                    textAlign: "left",
                  }}
                >
                  <th style={tableHeaderStyle}>Arrivo</th>
                  <th style={tableHeaderStyle}>Contatto</th>
                  <th style={tableHeaderStyle}>Telefono</th>
                  <th style={tableHeaderStyle}>Area</th>
                  <th style={tableHeaderStyle}>Corso suggerito</th>
                  <th style={tableHeaderStyle}>Score</th>
                  <th style={tableHeaderStyle}>Stato</th>
                  <th style={tableHeaderStyle}>Orientatore</th>
                  <th style={tableHeaderStyle}>Ultimo evento</th>
                </tr>
              </thead>

              <tbody>
                {utentiRegistrati.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        padding: 18,
                        color: "rgba(255,255,255,0.62)",
                        fontSize: 14,
                        textAlign: "center",
                      }}
                    >
                      Nessun contatto caricato.
                    </td>
                  </tr>
                ) : (
                  utentiRegistrati.map((utente) => (
                    <tr
                      key={`${utente.email}-${utente.id}`}
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <td style={tableCellStyle}>
                        {formatDate(utente.created_at)}
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ fontWeight: 900, color: "#FFFFFF" }}>
                          {getLeadName(utente)}
                        </div>
                        <div
                          style={{
                            marginTop: 3,
                            color: "rgba(255,255,255,0.58)",
                            fontSize: 12,
                          }}
                        >
                          {utente.email}
                        </div>
                      </td>
                      <td style={tableCellStyle}>{utente.telefono || "—"}</td>
                      <td style={tableCellStyle}>
                        {utente.area_interesse || "—"}
                      </td>
                      <td style={tableCellStyle}>
                        {utente.corso_suggerito || "—"}
                      </td>
                      <td style={tableCellStyle}>{utente.lead_score ?? 0}</td>
                      <td style={tableCellStyle}>
                        {utente.lead_status || "nuovo"}
                      </td>
                      <td style={tableCellStyle}>
                        {utente.orientatore_assegnato || "—"}
                      </td>
                      <td style={tableCellStyle}>
                        {utente.ultimo_evento || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              marginTop: 14,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() =>
                caricaUtentiRegistrati(Math.max(1, paginaUtenti - 1))
              }
              disabled={loadingUtenti || paginaUtenti <= 1}
              style={{
                ...secondaryButtonStyle,
                opacity: paginaUtenti <= 1 ? 0.45 : 1,
              }}
            >
              Pagina precedente
            </button>

            <button
              type="button"
              onClick={() =>
                caricaUtentiRegistrati(
                  Math.min(totalePagineUtenti, paginaUtenti + 1)
                )
              }
              disabled={loadingUtenti || paginaUtenti >= totalePagineUtenti}
              style={{
                ...secondaryButtonStyle,
                opacity: paginaUtenti >= totalePagineUtenti ? 0.45 : 1,
              }}
            >
              Pagina successiva
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function LeadCard({
  lead,
  onCreateTask,
  onUpdateStatus,
  statusUpdating,
}: {
  lead: Lead;
  onCreateTask: () => void;
  onUpdateStatus: (nuovoStatus: string) => void;
  statusUpdating: boolean;
}) {
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
          marginTop: 16,
          padding: 14,
          borderRadius: 20,
          background: "#EFF6FF",
          border: "1px solid rgba(31,111,178,0.16)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          alignItems: "end",
        }}
      >
        <label>
          <span
            style={{
              display: "block",
              marginBottom: 7,
              fontSize: 12,
              fontWeight: 900,
              color: "#1E3A8A",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Stato lead
          </span>
          <select
            value={lead.lead_status || "nuovo"}
            disabled={statusUpdating}
            onChange={(event) => onUpdateStatus(event.target.value)}
            style={{
              width: "100%",
              height: 44,
              borderRadius: 15,
              border: "1px solid rgba(31,111,178,0.22)",
              background: "#FFFFFF",
              color: "#0F172A",
              padding: "0 12px",
              fontSize: 14,
              fontWeight: 800,
              outline: "none",
              cursor: statusUpdating ? "wait" : "pointer",
            }}
          >
            {statiLead
              .filter((item) => item.value !== "")
              .map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
          </select>
        </label>

        <div
          style={{
            color: "#1E40AF",
            fontSize: 12,
            lineHeight: 1.45,
            fontWeight: 700,
          }}
        >
          {statusUpdating
            ? "Aggiornamento stato in corso..."
            : "Il cambio stato viene salvato nello storico lead."}
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

        <button
          type="button"
          onClick={onCreateTask}
          style={{
            ...secondaryButtonStyle,
            color: "#1F6FB2",
            borderColor: "rgba(31,111,178,0.18)",
            background: "#F8FAFC",
          }}
        >
          <CalendarPlus size={17} />
          Crea task
        </button>
      </div>
    </article>
  );
}

function TaskRow({
  task,
  onComplete,
  onCancel,
}: {
  task: LeadTask;
  onComplete: () => void;
  onCancel: () => void;
}) {
  const parsedDueAt = new Date(task.due_at.replace(" ", "T"));
  const isOverdue =
    !Number.isNaN(parsedDueAt.getTime()) && parsedDueAt.getTime() < Date.now();

  return (
    <div
      style={{
        borderRadius: 22,
        padding: 14,
        background: isOverdue
          ? "rgba(220,38,38,0.14)"
          : "rgba(255,255,255,0.07)",
        border: isOverdue
          ? "1px solid rgba(248,113,113,0.24)"
          : "1px solid rgba(255,255,255,0.10)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
              color: "#FFFFFF",
              fontWeight: 900,
            }}
          >
            <ClipboardList size={17} />
            {task.titolo}
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.68)",
              fontSize: 13,
              lineHeight: 1.45,
            }}
          >
            <strong>{task.lead_nome || task.user_email}</strong>
            {" · "}
            {formatDate(task.due_at)}
            {" · "}
            {task.orientatore || "Orientatore"}
          </div>

          {task.descrizione && (
            <div
              style={{
                marginTop: 7,
                color: "rgba(255,255,255,0.58)",
                fontSize: 13,
                lineHeight: 1.45,
              }}
            >
              {task.descrizione}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={onComplete}
            style={{
              ...smallTaskButtonStyle,
              background: "rgba(22,163,74,0.18)",
              color: "#BBF7D0",
            }}
          >
            <CheckCircle2 size={15} />
            Fatto
          </button>

          <button
            type="button"
            onClick={onCancel}
            style={{
              ...smallTaskButtonStyle,
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
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

function Badge({ children }: { children: ReactNode }) {
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
  icon: ReactNode;
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

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontSize: 12,
  fontWeight: 850,
  color: "rgba(255,255,255,0.74)",
};

const inputStyle: CSSProperties = {
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

const primaryButtonStyle: CSSProperties = {
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

const secondaryButtonStyle: CSSProperties = {
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

const ghostButtonStyle: CSSProperties = {
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

const disabledButtonStyle: CSSProperties = {
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

const modalLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: 7,
  fontSize: 12,
  fontWeight: 850,
  color: "#334155",
};

const modalInputStyle: CSSProperties = {
  width: "100%",
  height: 46,
  borderRadius: 16,
  border: "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#0F172A",
  padding: "0 14px",
  outline: "none",
  fontSize: 14,
  fontWeight: 700,
};

const smallTaskButtonStyle: CSSProperties = {
  minHeight: 34,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  padding: "0 10px",
  fontSize: 12,
  fontWeight: 850,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  cursor: "pointer",
};

const tableHeaderStyle: CSSProperties = {
  padding: "12px 14px",
  fontWeight: 900,
  whiteSpace: "nowrap",
};

const tableCellStyle: CSSProperties = {
  padding: "13px 14px",
  color: "rgba(255,255,255,0.76)",
  fontSize: 13,
  lineHeight: 1.35,
  verticalAlign: "top",
};
