"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Download,
  FileText,
  Filter,
  Heart,
  Loader2,
  Search,
  Send,
  ShieldAlert,
  Upload,
  X,
} from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import {
  CLASSI_LAUREA,
  getAreaClasseLabel,
  getClasseLaureaLabel,
  getClassiByTipo,
  getTipoClasseLabel,
  TIPI_CLASSI_LAUREA,
  type TipoClasseLaurea,
} from "@/lib/data/classiLaurea";

type GpsUser = {
  nome?: string;
  email?: string;
};

type MaterialeBiblioteca = {
  id: number;
  autore?: string;
  titolo: string;
  descrizione?: string;
  area_corso?: string;
  classe_laurea?: string;
  esame?: string;
  tipo_materiale?: string;
  file_url?: string;
  file_nome?: string;
  file_tipo?: string;
  file_size?: number;
  stato?: string;
  download_count?: number;
  save_count?: number;
  segnalazioni_count?: number;
  created_at?: string;
  updated_at?: string;
  salvato_at?: string;
  saved?: boolean;
  caricato_da_me?: boolean;
};

type TabAttiva = "biblioteca" | "carica" | "salvati";

type SegnalazioneModal = {
  materiale: MaterialeBiblioteca;
  motivo: string;
  note: string;
} | null;

const API_BASE = "https://laureasmart.it/api";

const TIPI_MATERIALE = [
  { value: "riassunto", label: "Riassunto" },
  { value: "schema", label: "Schema" },
  { value: "mappa_concettuale", label: "Mappa concettuale" },
  { value: "appunti", label: "Appunti personali" },
  { value: "domande_esame", label: "Domande d'esame ricordate" },
  { value: "piano_ripasso", label: "Piano di ripasso" },
  { value: "altro", label: "Altro" },
];

const MOTIVI_SEGNALAZIONE = [
  { value: "copyright", label: "Copyright / materiale non condivisibile" },
  { value: "contenuto_non_adatto", label: "Contenuto non adatto" },
  { value: "file_non_apribile", label: "File non apribile" },
  { value: "materiale_duplicato", label: "Materiale duplicato" },
  { value: "informazioni_errate", label: "Informazioni errate" },
  { value: "altro", label: "Altro" },
];

const cardStyle: React.CSSProperties = {
  borderRadius: 28,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.08)",
  boxShadow: "0 22px 55px rgba(0,0,0,0.24)",
  padding: 18,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.08)",
  color: "#FFFFFF",
  padding: "0 14px",
  fontSize: 14,
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 96,
  padding: 14,
  resize: "vertical",
};

const primaryButtonStyle: React.CSSProperties = {
  minHeight: 52,
  borderRadius: 18,
  border: "none",
  background: "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 100%)",
  color: "white",
  fontSize: 14,
  fontWeight: 900,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "0 16px",
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  minHeight: 46,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  fontSize: 13,
  fontWeight: 850,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  padding: "0 14px",
  cursor: "pointer",
};

const mutedText: React.CSSProperties = {
  margin: 0,
  color: "rgba(255,255,255,0.72)",
  fontSize: 13,
  lineHeight: 1.5,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 850,
  color: "rgba(255,255,255,0.86)",
  marginBottom: 8,
};

function formatBytes(size?: number) {
  if (!size) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getTipoMaterialeLabel(value?: string) {
  return (
    TIPI_MATERIALE.find((item) => item.value === value)?.label ||
    value ||
    "Materiale"
  );
}

function getClasseLabel(codice?: string) {
  if (!codice) return "Classe non indicata";
  return getClasseLaureaLabel(codice as never) || codice;
}

function getAreaLabel(area?: string) {
  if (!area) return "Area non indicata";
  return getAreaClasseLabel(area as never) || area;
}

function getUserFromStorage(): GpsUser | null {
  try {
    const raw = localStorage.getItem("gps_user");
    return raw ? (JSON.parse(raw) as GpsUser) : null;
  } catch {
    return null;
  }
}

export default function BibliotecaSmartPage() {
  const [user, setUser] = useState<GpsUser | null>(null);
  const [segmentoStudente, setSegmentoStudente] = useState("NON_ISCRITTO");

  const [tab, setTab] = useState<TabAttiva>("biblioteca");
  const [loading, setLoading] = useState(true);
  const [loadingSalvati, setLoadingSalvati] = useState(false);
  const [materiali, setMateriali] = useState<MaterialeBiblioteca[]>([]);
  const [salvati, setSalvati] = useState<MaterialeBiblioteca[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");
  const [filtroArea, setFiltroArea] = useState("");
  const [filtroClasse, setFiltroClasse] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

  const [tipoPercorso, setTipoPercorso] =
    useState<TipoClasseLaurea>("laurea_triennale");
  const [classeLaurea, setClasseLaurea] = useState("");
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [esame, setEsame] = useState("");
  const [tipoMateriale, setTipoMateriale] = useState("riassunto");
  const [file, setFile] = useState<File | null>(null);
  const [copyrightOk, setCopyrightOk] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [segnalazione, setSegnalazione] = useState<SegnalazioneModal>(null);
  const [sendingReport, setSendingReport] = useState(false);

  const isGiaIscritto = segmentoStudente === "GIA_ISCRITTO";
  const isTrasferimento = segmentoStudente === "TRASFERIMENTO";
  const isUniversitaInterrotta = segmentoStudente === "UNIVERSITA_INTERROTTA";

  const canViewBiblioteca =
    isGiaIscritto || isTrasferimento || isUniversitaInterrotta;

  const canUpload = isGiaIscritto || isTrasferimento;

  const classiFiltrateUpload = useMemo(
    () => getClassiByTipo(tipoPercorso),
    [tipoPercorso]
  );

  const classiFiltro = useMemo(() => CLASSI_LAUREA, []);

  const selectedClasse = useMemo(
    () => CLASSI_LAUREA.find((classe) => classe.codice === classeLaurea),
    [classeLaurea]
  );

  const areeFiltro = useMemo(() => {
    const unique = Array.from(
      new Set(CLASSI_LAUREA.map((classe) => classe.area))
    );
    return unique.sort();
  }, []);

  const fetchMateriali = async () => {
    if (!canViewBiblioteca) {
      setLoading(false);
      setMateriali([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (filtroArea) params.set("area_corso", filtroArea);
      if (filtroClasse) params.set("classe_laurea", filtroClasse);
      if (filtroTipo) params.set("tipo_materiale", filtroTipo);
      if (user?.email) params.set("user_email", user.email);
      params.set("limit", "50");
      params.set("offset", "0");

      const url = `${API_BASE}/biblioteca-smart-lista.php?${params.toString()}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Errore nel caricamento dei materiali");
      }

      setMateriali(data.materiali || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  };

  const fetchSalvati = async (email?: string) => {
    const userEmail = email || user?.email;
    if (!userEmail) return;

    setLoadingSalvati(true);

    try {
      const params = new URLSearchParams({ user_email: userEmail });
      const response = await fetch(
        `${API_BASE}/biblioteca-smart-salvati.php?${params.toString()}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Errore nel caricamento dei salvati");
      }

      const items = data.materiali || [];
      setSalvati(items);
      setSavedIds(items.map((item: MaterialeBiblioteca) => item.id));
    } catch (err) {
      console.error("Errore materiali salvati", err);
    } finally {
      setLoadingSalvati(false);
    }
  };

  useEffect(() => {
    const storedUser = getUserFromStorage();
    setUser(storedUser);
    setSegmentoStudente(
      localStorage.getItem("segmento_studente") || "NON_ISCRITTO"
    );

    const savedArea = localStorage.getItem("area_corso_attuale") || "";
    const savedClasse = localStorage.getItem("classe_laurea_attuale") || "";
    const savedTipo = localStorage.getItem(
      "tipo_corso_attuale"
    ) as TipoClasseLaurea | null;

    if (savedArea) setFiltroArea(savedArea);
    if (savedClasse) setFiltroClasse(savedClasse);
    if (savedTipo) setTipoPercorso(savedTipo);
    if (savedClasse) setClasseLaurea(savedClasse);

    if (storedUser?.email) {
      fetchSalvati(storedUser.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      fetchMateriali();
    }, 350);

    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filtroArea, filtroClasse, filtroTipo, segmentoStudente]);

  const handleOpenMateriale = (materiale: MaterialeBiblioteca) => {
    window.open(
      `${API_BASE}/biblioteca-smart-download.php?id=${materiale.id}`,
      "_blank",
      "noopener,noreferrer"
    );

    setMateriali((prev) =>
      prev.map((item) =>
        item.id === materiale.id
          ? { ...item, download_count: (item.download_count || 0) + 1 }
          : item
      )
    );
  };

  const handleToggleSalvato = async (materiale: MaterialeBiblioteca) => {
    if (!user?.email) {
      setError("Per salvare un materiale devi accedere con il tuo profilo.");
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${API_BASE}/biblioteca-smart-toggle-salvato.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_email: user.email,
            materiale_id: materiale.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Operazione non riuscita");
      }

      if (data.saved) {
        setSavedIds((prev) => Array.from(new Set([...prev, materiale.id])));
        setSuccessMessage("Materiale salvato nella tua Biblioteca Smart.");
      } else {
        setSavedIds((prev) => prev.filter((id) => id !== materiale.id));
        setSalvati((prev) => prev.filter((item) => item.id !== materiale.id));
        setSuccessMessage("Materiale rimosso dai salvati.");
      }

      fetchSalvati();
      fetchMateriali();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Errore durante il salvataggio"
      );
    }
  };

  const handleEliminaMateriale = async (materiale: MaterialeBiblioteca) => {
    if (!user?.email) {
      setError("Per rimuovere un materiale devi accedere con il tuo profilo.");
      return;
    }

    const conferma = window.confirm(
      "Vuoi rimuovere questo materiale dalla Biblioteca Smart? Non sarà più visibile agli altri utenti."
    );

    if (!conferma) return;

    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE}/biblioteca-smart-elimina.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: user.email,
          materiale_id: materiale.id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Rimozione non riuscita");
      }

      setSuccessMessage("Materiale rimosso dalla Biblioteca Smart.");

      await fetchMateriali();
      await fetchSalvati();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Errore durante la rimozione del materiale"
      );
    }
  };

  const handleUpload = async () => {
    setError("");
    setSuccessMessage("");

    if (!canUpload) {
      setError(
        "Il caricamento è disponibile per studenti già iscritti o in trasferimento."
      );
      return;
    }

    if (!user?.email) {
      setError("Email utente mancante. Accedi nuovamente alla app.");
      return;
    }

    if (!titolo.trim()) {
      setError("Inserisci un titolo per il materiale.");
      return;
    }

    if (!tipoMateriale) {
      setError("Seleziona il tipo di materiale.");
      return;
    }

    if (!file) {
      setError("Seleziona un file PDF o immagine da caricare.");
      return;
    }

    if (!copyrightOk) {
      setError(
        "Devi confermare che il materiale è stato creato da te e che hai il diritto di condividerlo."
      );
      return;
    }

    setUploading(true);

    try {
      const area =
        selectedClasse?.area ||
        localStorage.getItem("area_corso_attuale") ||
        "";
      const formData = new FormData();

      formData.append("user_email", user.email);
      formData.append("titolo", titolo.trim());
      formData.append("descrizione", descrizione.trim());
      formData.append("area_corso", area);
      formData.append("classe_laurea", classeLaurea);
      formData.append("esame", esame.trim());
      formData.append("tipo_materiale", tipoMateriale);
      formData.append("copyright_ok", copyrightOk ? "1" : "0");
      formData.append("file", file);

      const response = await fetch(`${API_BASE}/biblioteca-smart-carica.php`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Caricamento non riuscito");
      }

      setSuccessMessage("Materiale caricato nella Biblioteca Smart.");
      setTitolo("");
      setDescrizione("");
      setEsame("");
      setTipoMateriale("riassunto");
      setFile(null);
      setCopyrightOk(false);
      setTab("biblioteca");
      fetchMateriali();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Errore durante il caricamento"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSendReport = async () => {
    if (!segnalazione) return;

    setSendingReport(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE}/biblioteca-smart-segnala.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: user?.email || "",
          materiale_id: segnalazione.materiale.id,
          motivo: segnalazione.motivo,
          note: segnalazione.note,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Segnalazione non riuscita");
      }

      setSuccessMessage(data.message || "Segnalazione inviata correttamente.");
      setSegnalazione(null);
      fetchMateriali();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Errore durante la segnalazione"
      );
    } finally {
      setSendingReport(false);
    }
  };

  const renderMaterialeCard = (materiale: MaterialeBiblioteca) => {
    const isSaved = savedIds.includes(materiale.id) || materiale.saved;

    return (
      <article key={materiale.id} style={{ ...cardStyle, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              background: "rgba(58,160,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileText size={22} color="#7CC7FF" />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  borderRadius: 999,
                  padding: "5px 9px",
                  background: "rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.82)",
                  fontSize: 11,
                  fontWeight: 850,
                }}
              >
                {getTipoMaterialeLabel(materiale.tipo_materiale)}
              </span>
              <span
                style={{
                  borderRadius: 999,
                  padding: "5px 9px",
                  background: "rgba(20,184,166,0.14)",
                  color: "#99F6E4",
                  fontSize: 11,
                  fontWeight: 850,
                }}
              >
                {getAreaLabel(materiale.area_corso)}
              </span>
            </div>

            <h3
              style={{
                margin: "0 0 6px",
                fontSize: 17,
                lineHeight: 1.25,
                color: "white",
              }}
            >
              {materiale.titolo}
            </h3>

            <p style={{ ...mutedText, marginBottom: 10 }}>
              {materiale.descrizione ||
                "Materiale condiviso nella Biblioteca Smart."}
            </p>

            <div style={{ display: "grid", gap: 5, marginBottom: 12 }}>
              <p style={{ ...mutedText, fontSize: 12 }}>
                <strong style={{ color: "rgba(255,255,255,0.88)" }}>
                  Classe:
                </strong>{" "}
                {getClasseLabel(materiale.classe_laurea)}
              </p>
              {materiale.esame && (
                <p style={{ ...mutedText, fontSize: 12 }}>
                  <strong style={{ color: "rgba(255,255,255,0.88)" }}>
                    Esame:
                  </strong>{" "}
                  {materiale.esame}
                </p>
              )}
              <p style={{ ...mutedText, fontSize: 12 }}>
                <strong style={{ color: "rgba(255,255,255,0.88)" }}>
                  Autore:
                </strong>{" "}
                {materiale.autore || "Studente Laurea Smart"}
                {materiale.file_size
                  ? ` · ${formatBytes(materiale.file_size)}`
                  : ""}
              </p>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => handleOpenMateriale(materiale)}
                style={primaryButtonStyle}
              >
                <Download size={17} />
                Apri
              </button>

              <button
                type="button"
                onClick={() => handleToggleSalvato(materiale)}
                style={{
                  ...secondaryButtonStyle,
                  background: isSaved
                    ? "rgba(244,63,94,0.18)"
                    : secondaryButtonStyle.background,
                  borderColor: isSaved
                    ? "rgba(244,63,94,0.25)"
                    : "rgba(255,255,255,0.14)",
                }}
              >
                <Heart
                  size={17}
                  fill={isSaved ? "#FB7185" : "none"}
                  color={isSaved ? "#FB7185" : "white"}
                />
                {isSaved ? "Salvato" : "Salva"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setSegnalazione({
                    materiale,
                    motivo: "copyright",
                    note: "",
                  })
                }
                style={secondaryButtonStyle}
              >
                <ShieldAlert size={17} />
                Segnala
              </button>

              {materiale.caricato_da_me && (
                <button
                  type="button"
                  onClick={() => handleEliminaMateriale(materiale)}
                  style={{
                    ...secondaryButtonStyle,
                    borderColor: "rgba(248,113,113,0.45)",
                    background: "rgba(127,29,29,0.28)",
                    color: "#FCA5A5",
                  }}
                >
                  Rimuovi
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  };

  if (!canViewBiblioteca) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "22px 18px 92px",
          background:
            "radial-gradient(circle at top left, rgba(58,160,255,0.30), transparent 32%), linear-gradient(180deg, #081526 0%, #0A1E33 48%, #07111F 100%)",
          color: "white",
        }}
      >
        <section
          style={{
            maxWidth: 920,
            margin: "0 auto",
            display: "grid",
            gap: 18,
          }}
        >
          <header
            style={{
              ...cardStyle,
              background:
                "linear-gradient(135deg, rgba(31,111,178,0.98) 0%, rgba(12,35,64,0.96) 100%)",
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 20,
                background: "rgba(255,255,255,0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <BookOpen size={28} />
            </div>

            <p
              style={{
                margin: "0 0 8px",
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 900,
                color: "rgba(255,255,255,0.72)",
              }}
            >
              Biblioteca Smart
            </p>

            <h1 style={{ margin: "0 0 10px", fontSize: 32, lineHeight: 1.08 }}>
              Materiali disponibili per studenti iscritti
            </h1>

            <p style={{ ...mutedText, fontSize: 15, maxWidth: 680 }}>
              Questa funzione è pensata per chi è già iscritto a un corso di
              laurea, per chi sta valutando un trasferimento o per chi ha
              interrotto un percorso universitario e vuole ripartire.
            </p>
          </header>

          <section
            style={{
              ...cardStyle,
              borderColor: "rgba(58,160,255,0.24)",
              background: "rgba(58,160,255,0.10)",
            }}
          >
            <h2 style={{ margin: "0 0 8px", fontSize: 20 }}>
              Completa il tuo stato nel profilo
            </h2>
            <p style={mutedText}>
              Se sei già iscritto, aggiorna il tuo profilo universitario: potrai
              accedere alla Biblioteca Smart, cercare materiali coerenti con la
              tua area di studio e usare gli appunti condivisi dagli studenti.
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 16,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/dashboard/profilo";
                }}
                style={primaryButtonStyle}
              >
                Vai al profilo
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/dashboard/orientamento/test";
                }}
                style={secondaryButtonStyle}
              >
                Aggiorna il test
              </button>
            </div>
          </section>

          <section
            style={{
              ...cardStyle,
              borderColor: "rgba(251,191,36,0.24)",
              background: "rgba(251,191,36,0.10)",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <AlertTriangle
                size={24}
                color="#FBBF24"
                style={{ flexShrink: 0 }}
              />
              <div>
                <h2 style={{ margin: "0 0 6px", fontSize: 16 }}>
                  Regola fondamentale sui materiali
                </h2>
                <p style={mutedText}>
                  Nella Biblioteca Smart possono essere condivisi solo materiali
                  creati dagli utenti: appunti personali, riassunti originali,
                  schemi e mappe concettuali. Non sono ammessi libri, slide
                  ufficiali, dispense dell&apos;ateneo o contenuti coperti da
                  copyright.
                </p>
              </div>
            </div>
          </section>
        </section>

        <BottomNav />
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "22px 18px 92px",
        background:
          "radial-gradient(circle at top left, rgba(58,160,255,0.30), transparent 32%), linear-gradient(180deg, #081526 0%, #0A1E33 48%, #07111F 100%)",
        color: "white",
      }}
    >
      <section
        style={{
          maxWidth: 920,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <header
          style={{
            ...cardStyle,
            background:
              "linear-gradient(135deg, rgba(31,111,178,0.98) 0%, rgba(12,35,64,0.96) 100%)",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 20,
              background: "rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <BookOpen size={28} />
          </div>

          <p
            style={{
              margin: "0 0 8px",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 900,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            Biblioteca Smart
          </p>

          <h1 style={{ margin: "0 0 10px", fontSize: 32, lineHeight: 1.08 }}>
            Appunti, schemi e materiali condivisi dagli studenti
          </h1>

          <p style={{ ...mutedText, fontSize: 15, maxWidth: 680 }}>
            Trova materiali utili per la tua area di studio, salva quelli più
            importanti e condividi solo appunti o riassunti creati da te.
          </p>
        </header>

        <section
          style={{
            ...cardStyle,
            borderColor: "rgba(251,191,36,0.24)",
            background: "rgba(251,191,36,0.10)",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <AlertTriangle
              size={24}
              color="#FBBF24"
              style={{ flexShrink: 0 }}
            />
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: 16 }}>
                Regola fondamentale sui materiali
              </h2>
              <p style={mutedText}>
                Puoi condividere solo materiali creati da te: appunti personali,
                riassunti originali, schemi o mappe concettuali. Non caricare
                libri, slide ufficiali dei docenti, dispense dell&apos;ateneo,
                contenuti da piattaforme e-learning o materiale coperto da
                copyright. I contenuti non conformi possono essere segnalati e
                rimossi.
              </p>
            </div>
          </div>
        </section>

        {isUniversitaInterrotta && (
          <section
            style={{
              ...cardStyle,
              borderColor: "rgba(58,160,255,0.24)",
              background: "rgba(58,160,255,0.10)",
            }}
          >
            <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>
              Consultazione attiva
            </h2>
            <p style={mutedText}>
              Puoi consultare, salvare e segnalare i materiali condivisi dagli
              studenti. Il caricamento, invece, è riservato a chi è già iscritto
              o sta valutando un trasferimento universitario.
            </p>
          </section>
        )}

        <nav
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
          }}
        >
          {[
            {
              id: "biblioteca",
              label: "Materiali",
              icon: <BookOpen size={17} />,
            },
            { id: "carica", label: "Carica", icon: <Upload size={17} /> },
            { id: "salvati", label: "Salvati", icon: <Heart size={17} /> },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as TabAttiva)}
              style={{
                minHeight: 48,
                borderRadius: 17,
                border:
                  tab === item.id
                    ? "1px solid rgba(58,160,255,0.72)"
                    : "1px solid rgba(255,255,255,0.12)",
                background:
                  tab === item.id
                    ? "rgba(58,160,255,0.18)"
                    : "rgba(255,255,255,0.06)",
                color: "white",
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                cursor: "pointer",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {error && (
          <div
            style={{
              ...cardStyle,
              borderColor: "rgba(248,113,113,0.26)",
              background: "rgba(127,29,29,0.18)",
            }}
          >
            <p style={{ margin: 0, color: "#FCA5A5", fontWeight: 850 }}>
              {error}
            </p>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              ...cardStyle,
              borderColor: "rgba(134,239,172,0.26)",
              background: "rgba(22,101,52,0.18)",
            }}
          >
            <p style={{ margin: 0, color: "#86EFAC", fontWeight: 850 }}>
              {successMessage}
            </p>
          </div>
        )}

        {tab === "biblioteca" && (
          <section style={{ display: "grid", gap: 14 }}>
            <div style={{ ...cardStyle, display: "grid", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Filter size={19} color="#7CC7FF" />
                <h2 style={{ margin: 0, fontSize: 18 }}>Filtra i materiali</h2>
              </div>

              <div
                style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}
              >
                <div style={{ position: "relative" }}>
                  <Search
                    size={18}
                    style={{
                      position: "absolute",
                      left: 14,
                      top: 15,
                      opacity: 0.65,
                    }}
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Cerca per titolo, descrizione o esame"
                    style={{ ...inputStyle, paddingLeft: 42 }}
                  />
                </div>

                <select
                  value={filtroArea}
                  onChange={(event) => setFiltroArea(event.target.value)}
                  style={inputStyle}
                >
                  <option value="">Tutte le aree</option>
                  {areeFiltro.map((area) => (
                    <option key={area} value={area}>
                      {getAreaLabel(area)}
                    </option>
                  ))}
                </select>

                <select
                  value={filtroClasse}
                  onChange={(event) => setFiltroClasse(event.target.value)}
                  style={inputStyle}
                >
                  <option value="">Tutte le classi di laurea</option>
                  {classiFiltro.map((classe) => (
                    <option key={classe.codice} value={classe.codice}>
                      {classe.codice} - {classe.nome}
                    </option>
                  ))}
                </select>

                <select
                  value={filtroTipo}
                  onChange={(event) => setFiltroTipo(event.target.value)}
                  style={inputStyle}
                >
                  <option value="">Tutti i tipi di materiale</option>
                  {TIPI_MATERIALE.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div
                style={{
                  ...cardStyle,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <Loader2 size={20} className="animate-spin" />
                <p style={mutedText}>Caricamento materiali...</p>
              </div>
            ) : materiali.length === 0 ? (
              <div style={cardStyle}>
                <h3 style={{ margin: "0 0 8px" }}>Nessun materiale trovato</h3>
                <p style={mutedText}>
                  Appena verranno caricati appunti coerenti con i filtri scelti,
                  li troverai qui.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {materiali.map(renderMaterialeCard)}
              </div>
            )}
          </section>
        )}

        {tab === "carica" && (
          <section style={{ display: "grid", gap: 14 }}>
            {!canUpload && (
              <div
                style={{
                  ...cardStyle,
                  borderColor: "rgba(58,160,255,0.24)",
                  background: "rgba(58,160,255,0.10)",
                }}
              >
                <h2 style={{ margin: "0 0 8px", fontSize: 19 }}>
                  Caricamento riservato agli studenti iscritti
                </h2>
                <p style={mutedText}>
                  La condivisione dei materiali è pensata soprattutto per chi è
                  già iscritto a un corso o sta valutando un trasferimento. Puoi
                  comunque consultare i materiali approvati nella Biblioteca
                  Smart.
                </p>
              </div>
            )}

            {canUpload && (
              <div style={{ ...cardStyle, display: "grid", gap: 14 }}>
                <div>
                  <h2 style={{ margin: "0 0 8px", fontSize: 20 }}>
                    Carica un materiale
                  </h2>
                  <p style={mutedText}>
                    Condividi solo appunti personali, riassunti originali,
                    schemi o mappe creati da te. Il caricamento di materiali
                    protetti è vietato.
                  </p>
                </div>

                <div>
                  <label style={labelStyle}>Titolo materiale</label>
                  <input
                    value={titolo}
                    onChange={(event) => setTitolo(event.target.value)}
                    placeholder="Esempio: Riassunto Psicologia generale"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Descrizione</label>
                  <textarea
                    value={descrizione}
                    onChange={(event) => setDescrizione(event.target.value)}
                    placeholder="Spiega brevemente cosa contiene il materiale."
                    style={textareaStyle}
                  />
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  <div>
                    <label style={labelStyle}>Tipo percorso</label>
                    <select
                      value={tipoPercorso}
                      onChange={(event) => {
                        const nextTipo = event.target.value as TipoClasseLaurea;
                        setTipoPercorso(nextTipo);
                        setClasseLaurea("");
                      }}
                      style={inputStyle}
                    >
                      {TIPI_CLASSI_LAUREA.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Classe di laurea</label>
                    <select
                      value={classeLaurea}
                      onChange={(event) => setClasseLaurea(event.target.value)}
                      style={inputStyle}
                    >
                      <option value="">Seleziona classe</option>
                      {classiFiltrateUpload.map((classe) => (
                        <option key={classe.codice} value={classe.codice}>
                          {classe.codice} - {classe.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedClasse && (
                    <p style={{ ...mutedText, marginTop: -2 }}>
                      Area rilevata:{" "}
                      <strong style={{ color: "#99F6E4" }}>
                        {getAreaLabel(selectedClasse.area)}
                      </strong>{" "}
                      · {getTipoClasseLabel(selectedClasse.tipo)}
                    </p>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Esame o argomento</label>
                  <input
                    value={esame}
                    onChange={(event) => setEsame(event.target.value)}
                    placeholder="Esempio: Diritto privato, Pedagogia generale..."
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Tipo materiale</label>
                  <select
                    value={tipoMateriale}
                    onChange={(event) => setTipoMateriale(event.target.value)}
                    style={inputStyle}
                  >
                    {TIPI_MATERIALE.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>File PDF o immagine</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                    onChange={(event) =>
                      setFile(event.target.files?.[0] || null)
                    }
                    style={{ ...inputStyle, padding: 11 }}
                  />
                  <p style={{ ...mutedText, marginTop: 8, fontSize: 12 }}>
                    Formati consentiti: PDF, JPG, PNG, WEBP. Dimensione massima:
                    10 MB.
                  </p>
                </div>

                <label
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    borderRadius: 18,
                    border: "1px solid rgba(251,191,36,0.24)",
                    background: "rgba(251,191,36,0.10)",
                    padding: 14,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={copyrightOk}
                    onChange={(event) => setCopyrightOk(event.target.checked)}
                    style={{ marginTop: 4 }}
                  />
                  <span
                    style={{ ...mutedText, color: "rgba(255,255,255,0.86)" }}
                  >
                    Confermo che il materiale è stato creato da me e che ho il
                    diritto di condividerlo. Non sto caricando libri, slide
                    ufficiali, dispense universitarie protette, contenuti
                    dell&apos;ateneo o materiali coperti da copyright.
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  style={{
                    ...primaryButtonStyle,
                    opacity: uploading ? 0.7 : 1,
                    cursor: uploading ? "not-allowed" : "pointer",
                  }}
                >
                  {uploading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Upload size={18} />
                  )}
                  {uploading
                    ? "Caricamento..."
                    : "Carica nella Biblioteca Smart"}
                </button>
              </div>
            )}
          </section>
        )}

        {tab === "salvati" && (
          <section style={{ display: "grid", gap: 12 }}>
            <div style={cardStyle}>
              <h2 style={{ margin: "0 0 8px", fontSize: 20 }}>
                Materiali salvati
              </h2>
              <p style={mutedText}>
                Ritrova qui appunti, schemi e riassunti che hai salvato dalla
                Biblioteca Smart.
              </p>
            </div>

            {loadingSalvati ? (
              <div
                style={{
                  ...cardStyle,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <Loader2 size={20} className="animate-spin" />
                <p style={mutedText}>Caricamento materiali salvati...</p>
              </div>
            ) : salvati.length === 0 ? (
              <div style={cardStyle}>
                <h3 style={{ margin: "0 0 8px" }}>Nessun materiale salvato</h3>
                <p style={mutedText}>
                  Quando salvi un materiale, lo ritroverai in questa sezione.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {salvati.map(renderMaterialeCard)}
              </div>
            )}
          </section>
        )}
      </section>

      {segnalazione && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.62)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 18,
          }}
        >
          <div
            style={{
              ...cardStyle,
              width: "100%",
              maxWidth: 520,
              background: "#0B1D31",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div>
                <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>
                  Segnala materiale
                </h2>
                <p style={mutedText}>{segnalazione.materiale.titolo}</p>
              </div>
              <button
                type="button"
                onClick={() => setSegnalazione(null)}
                style={{ ...secondaryButtonStyle, width: 44, padding: 0 }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={labelStyle}>Motivo</label>
                <select
                  value={segnalazione.motivo}
                  onChange={(event) =>
                    setSegnalazione({
                      ...segnalazione,
                      motivo: event.target.value,
                    })
                  }
                  style={inputStyle}
                >
                  {MOTIVI_SEGNALAZIONE.map((motivo) => (
                    <option key={motivo.value} value={motivo.value}>
                      {motivo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Note facoltative</label>
                <textarea
                  value={segnalazione.note}
                  onChange={(event) =>
                    setSegnalazione({
                      ...segnalazione,
                      note: event.target.value,
                    })
                  }
                  placeholder="Aggiungi dettagli utili per verificare il contenuto."
                  style={textareaStyle}
                />
              </div>

              <button
                type="button"
                onClick={handleSendReport}
                disabled={sendingReport}
                style={{
                  ...primaryButtonStyle,
                  background:
                    "linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)",
                  opacity: sendingReport ? 0.7 : 1,
                }}
              >
                {sendingReport ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                {sendingReport ? "Invio..." : "Invia segnalazione"}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
