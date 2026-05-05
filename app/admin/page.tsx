"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/ui/Button";

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
          "Notifica salvata. Target: " +
            data.target +
            " - OneSignal code: " +
            data.onesignal_http_code +
            " - Response: " +
            JSON.stringify(data.onesignal_response)
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
        padding: 20,
        fontFamily: "Arial",
        maxWidth: 500,
        margin: "0 auto",
      }}
    >
      <h1>Pannello Admin</h1>

      <p>
        Da qui puoi pubblicare una notifica e inviare una push agli utenti in
        base al segmento scelto.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          type="password"
          placeholder="Chiave admin"
          value={form.adminKey}
          onChange={(e) => setForm({ ...form, adminKey: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Titolo notifica"
          value={form.titolo}
          onChange={(e) => setForm({ ...form, titolo: e.target.value })}
          required
        />

        <textarea
          placeholder="Messaggio"
          value={form.messaggio}
          onChange={(e) => setForm({ ...form, messaggio: e.target.value })}
          required
          rows={5}
        />

        <label>Target push OneSignal</label>
        <select
          value={form.target}
          onChange={(e) => setForm({ ...form, target: e.target.value })}
        >
          <option value="ALL">Tutti gli utenti</option>
          <option value="ECONOMIA">Economia e management</option>
          <option value="PSICOLOGIA">Psicologia</option>
          <option value="EDUCAZIONE">Scienze dell’educazione</option>
          <option value="GIURIDICA">Area giuridica</option>
          <option value="SPORT">Scienze motorie</option>
          <option value="COMUNICAZIONE">Comunicazione</option>
          <option value="TECNOLOGIA">Informatica / tecnologia</option>
          <option value="SCUOLA">Scuola e insegnamento</option>
          <option value="ORIENTAMENTO">Indecisi / orientamento</option>
          <option value="GENERALE">Generale</option>
        </select>

        <Button label="Pubblica notifica" variant="primary" type="submit" />
      </form>

      {status && <p style={{ marginTop: 20 }}>{status}</p>}
    </main>
  );
}
