"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/ui/Button";
import BottomNav from "@/components/ui/BottomNav";

export default function AdminPage() {
  const [form, setForm] = useState({
    titolo: "",
    messaggio: "",
    target: "ALL",
    adminKey: "",
  });

  const [status, setStatus] = useState("");

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
