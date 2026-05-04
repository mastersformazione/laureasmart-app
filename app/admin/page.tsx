"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/ui/Button";

export default function AdminPage() {
  const [form, setForm] = useState({
    titolo: "",
    messaggio: "",
    categoria: "Generale",
    target: "ALL",
    adminKey: "",
  });

  const [status, setStatus] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Invio in corso...");

    try {
      const res = await fetch(
        "https://graduatoriegps.it/api/admin-crea-notifica.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Key": form.adminKey.trim(),
          },
          body: JSON.stringify({
            titolo: form.titolo,
            messaggio: form.messaggio,
            categoria: form.categoria,
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
          categoria: "Generale",
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
        Da qui puoi pubblicare una notifica nella dashboard e inviare una push
        anche a utenti segmentati.
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

        <label>Categoria notifica</label>
        <select
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
        >
          <option value="Generale">Generale</option>
          <option value="GPS">GPS</option>
          <option value="Percorsi abilitanti">Percorsi abilitanti</option>
          <option value="TFA sostegno">TFA sostegno</option>
          <option value="Master scuola">Master scuola</option>
          <option value="Lauree">Lauree</option>
          <option value="Orientamento">Orientamento</option>
        </select>

        <label>Target push OneSignal</label>
        <select
          value={form.target}
          onChange={(e) => setForm({ ...form, target: e.target.value })}
        >
          <option value="ALL">Tutti gli utenti</option>
          <option value="SCUOLA_GPS">Scuola / GPS</option>
          <option value="PROFESSIONE">Professioni</option>
          <option value="CRESCITA_LAVORO">Crescita lavoro</option>
          <option value="LAUREA">Laurea</option>
          <option value="INDECISO">Indecisi</option>
        </select>

        {/* BOTTONE UI RIUTILIZZABILE */}
        <Button label="Pubblica notifica" variant="primary" type="submit" />
      </form>

      {status && <p style={{ marginTop: 20 }}>{status}</p>}
    </main>
  );
}
