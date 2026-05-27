"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/ui/Button";
import BottomNav from "@/components/ui/BottomNav";

type SpazioStudentiCase = {
  id: string;
  created_at: string;
  nome_pubblico: string;
  email: string;
  telefono?: string;
  categoria: string;
  titolo: string;
  contenuto: string;
  foto_url?: string;
};

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
    if (!form.adminKey.trim()) {
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
            "X-Admin-Key": form.adminKey.trim(),
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setCasiInAttesa(data.cases || []);
        setCasiStatus(
          `Casi in attesa: ${(data.cases || []).length}`
        );
      } else {
        setCasiStatus("Errore: " + (data.message || data.error || "impossibile caricare i casi."));
      }
    } catch (error) {
      console.error(error);
      setCasiStatus("Errore di connessione durante il caricamento dei casi.");
    } finally {
      setCasiLoading(false);
    }
  };

  const moderaCaso = async (id: string, action: "approve" | "reject") => {
    if (!form.adminKey.trim()) {
      setCasiStatus("Inserisci la chiave admin prima di moderare.");
      return;
    }

    setCasiLoading(true);
    setCasiStatus(action === "approve" ? "Approvazione in corso..." : "Rifiuto in corso...");

    try {
      const res = await fetch(
        "https://laureasmart.it/api/spazio-studenti-admin.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Key": form.adminKey.trim(),
          },
          body: JSON.stringify({ id, action }),
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
        setCasiStatus("Errore: " + (data.message || data.error || "operazione non riuscita."));
      }
    } catch (error) {
      console.error(error);
      setCasiStatus("Errore di connessione durante la moderazione.");
    } finally {
      setCasiLoading(false);
    }
  };


  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 20,
        paddingBottom: 120,
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
        maxWidth: 500,
        margin: "0 auto",
        background: "#F8FBFF",
      }}
    >
      <h1 style={{ marginBottom: 8 }}>Pannello Admin</h1>

      <p style={{ color: "#555", lineHeight: 1.5 }}>
        Pubblica una notifica e inviala agli utenti in base alla segmentazione
        OneSignal.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 20,
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

        <label style={{ fontWeight: 700, marginTop: 4 }}>
          Target push OneSignal
        </label>

        <select
          value={form.target}
          onChange={(e) => setForm({ ...form, target: e.target.value })}
          style={inputStyle}
        >
          <option value="ALL">Tutti gli utenti</option>

          <optgroup label="Area / Profilo">
            <option value="PROFILO:ECONOMIA">Economia e management</option>
            <option value="PROFILO:PSICOLOGIA">Psicologia</option>
            <option value="PROFILO:EDUCAZIONE">Scienze dell’educazione</option>
            <option value="PROFILO:GIURIDICA">Area giuridica</option>
            <option value="PROFILO:SPORT">Scienze motorie</option>
            <option value="PROFILO:COMUNICAZIONE">Comunicazione</option>
            <option value="PROFILO:TECNOLOGIA">Informatica / tecnologia</option>
            <option value="PROFILO:SCUOLA">Scuola e insegnamento</option>
            <option value="PROFILO:ORIENTAMENTO">
              Indecisi / orientamento
            </option>
          </optgroup>

          <optgroup label="Obiettivo">
            <option value="OBIETTIVO:Aumentare lo stipendio">
              Aumentare lo stipendio
            </option>
            <option value="OBIETTIVO:Cambiare lavoro">Cambiare lavoro</option>
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
            <option value="OBIETTIVO:Non sono sicuro">Non sono sicuro</option>
          </optgroup>

          <optgroup label="Urgenza obiettivo">
            <option value="URGENZA:ALTA">Alta - Subito / entro 1 mese</option>
            <option value="URGENZA:MEDIO_ALTA">
              Medio-alta - Entro 3 mesi
            </option>
            <option value="URGENZA:MEDIA">Media - Entro 6 mesi</option>
            <option value="URGENZA:BASSA">Bassa - Entro 12 mesi</option>
            <option value="URGENZA:FREDDA">
              Fredda - Nessuna scadenza precisa
            </option>
            <option value="URGENZA:NON_DEFINITA">Urgenza non definita</option>
          </optgroup>

          <optgroup label="Titolo di studio">
            <option value="TITOLO:Diploma">Diploma</option>
            <option value="TITOLO:Laurea triennale">Laurea triennale</option>
            <option value="TITOLO:Laurea magistrale">Laurea magistrale</option>
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
        <p style={{ marginTop: 20, fontSize: 14, color: "#333" }}>{status}</p>
      )}


      <section
        style={{
          marginTop: 28,
          padding: 16,
          borderRadius: 24,
          background: "#FFFFFF",
          border: "1px solid #D7E7F5",
          boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
        }}
      >
        <h2 style={{ margin: "0 0 8px", fontSize: 22 }}>
          Spazio Studenti
        </h2>

        <p style={{ color: "#555", lineHeight: 1.5, marginTop: 0 }}>
          Qui trovi i casi inviati dagli utenti. Puoi approvarli o rifiutarli
          prima che vengano usati nello Spazio Studenti.
        </p>

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
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
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

                  <p style={{ margin: "0 0 6px", fontSize: 13, color: "#555" }}>
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
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
                  Approva
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
      </section>

      <BottomNav />
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #D7E7F5",
  background: "#FFFFFF",
  fontSize: 14,
};
