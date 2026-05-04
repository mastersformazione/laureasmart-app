"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import Button from "@/components/ui/Button";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefono: "",
    interesse: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("https://graduatoriegps.it/api/leads.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("gps_user", JSON.stringify(form));

        setForm({
          nome: "",
          email: "",
          telefono: "",
          interesse: "",
        });

        router.push("/dashboard");
      } else {
        alert("Errore: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Errore di connessione");
    }
  };

  return (
    <main
      style={{
        padding: 20,
        fontFamily: "Arial",
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      <h1>Registrati</h1>

      <p>
        Inserisci i tuoi dati per ricevere aggiornamenti su GPS, abilitazioni e
        percorsi universitari.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Telefono"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          required
        />

        <select
          value={form.interesse}
          onChange={(e) => setForm({ ...form, interesse: e.target.value })}
          required
        >
          <option value="">Seleziona interesse</option>
          <option value="Percorsi abilitanti">Percorsi abilitanti</option>
          <option value="GPS">GPS</option>
          <option value="TFA sostegno">TFA sostegno</option>
          <option value="Master scuola">Master scuola</option>
        </select>

        {/* BOTTONE UNIFICATO */}
        <Button label="Registrati" variant="primary" type="submit" />
      </form>
    </main>
  );
}
