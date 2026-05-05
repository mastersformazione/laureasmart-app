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
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("https://laureasmart.it/api/leads.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          interesse: "N/A",
        }),
      });

      const data = await res.json();

      if (data.success) {
        // 👉 salva utente
        localStorage.setItem("gps_user", JSON.stringify(form));

        // 👉 indica che NON ha ancora fatto il test
        localStorage.setItem("ha_fatto_test", "no");

        setForm({
          nome: "",
          email: "",
          telefono: "",
        });

        // 👉 redirect diretto al test (conversione)
        router.push("/dashboard/orientamento");
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
        minHeight: "100vh",
        padding: "28px 20px 40px",
        fontFamily: "Arial",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: 8 }}>Inizia il tuo percorso</h1>

      <p style={{ color: "#555", lineHeight: 1.5 }}>
        Inserisci i tuoi dati e scopri subito il percorso universitario più
        adatto ai tuoi obiettivi.
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
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
          style={{ padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={{ padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
        />

        <input
          type="text"
          placeholder="Telefono"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          required
          style={{ padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
        />

        <Button
          label="Scopri il tuo percorso"
          variant="primary"
          type="submit"
        />
      </form>
    </main>
  );
}
