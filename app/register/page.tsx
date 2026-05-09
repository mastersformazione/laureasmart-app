"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import Button from "@/components/ui/Button";
import { Sparkles, User, Mail, Phone } from "lucide-react";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    cognome: "",
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
        localStorage.setItem("gps_user", JSON.stringify(form));
        localStorage.setItem("ha_fatto_test", "no");

        setForm({
          nome: "",
          cognome: "",
          email: "",
          telefono: "",
        });

        router.push("/dashboard/orientamento/test");
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
        padding: 20,
        maxWidth: 500,
        margin: "0 auto",
        color: "#FFFFFF",
        background:
          "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
      }}
    >
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 32,
          padding: 26,
          background:
            "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 52%, #155487 100%)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.36)",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -42,
            top: -42,
            width: 150,
            height: 150,
            borderRadius: 999,
            background: "rgba(255,255,255,0.14)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 22,
              background: "rgba(255,255,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Sparkles size={30} />
          </div>

          <p
            style={{
              margin: "0 0 8px",
              fontSize: 14,
              fontWeight: 850,
              opacity: 0.92,
            }}
          >
            Profilo Laurea Smart
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: 33,
              lineHeight: 1.04,
              fontWeight: 900,
              letterSpacing: "-1px",
            }}
          >
            Inizia il tuo percorso
          </h1>

          <p
            style={{
              margin: "14px 0 0",
              fontSize: 15,
              lineHeight: 1.6,
              opacity: 0.94,
            }}
          >
            Inserisci i tuoi dati: subito dopo potrai completare il test e
            scoprire una prima ipotesi di percorso adatto a te.
          </p>
        </div>
      </section>

      <section
        style={{
          padding: 20,
          borderRadius: 28,
          background: "rgba(17,32,51,0.86)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
          backdropFilter: "blur(16px)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          <Field
            icon={<User size={20} />}
            type="text"
            placeholder="Nome"
            value={form.nome}
            onChange={(value) => setForm({ ...form, nome: value })}
          />

          <Field
            icon={<User size={20} />}
            type="text"
            placeholder="Cognome"
            value={form.cognome}
            onChange={(value) => setForm({ ...form, cognome: value })}
          />

          <Field
            icon={<Mail size={20} />}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(value) => setForm({ ...form, email: value })}
          />

          <Field
            icon={<Phone size={20} />}
            type="tel"
            placeholder="Telefono"
            value={form.telefono}
            onChange={(value) => setForm({ ...form, telefono: value })}
          />

          <div style={{ marginTop: 8 }}>
            <Button
              label="Vai al Test (Durata 30 Secondi)"
              variant="primary"
              type="submit"
            />
          </div>
        </form>

        <p
          style={{
            margin: "16px 0 0",
            fontSize: 12,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.52)",
            textAlign: "center",
          }}
        >
          I dati servono per creare il tuo profilo e mostrarti percorsi più
          coerenti con i tuoi obiettivi.
        </p>
      </section>
    </main>
  );
}

function Field({
  icon,
  type,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label
      style={{
        minHeight: 58,
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.07)",
        color: "#FFFFFF",
        padding: "0 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 10px 24px rgba(0,0,0,0.14)",
      }}
    >
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: 13,
          background: "rgba(58,160,255,0.16)",
          color: "#78C2FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        style={{
          width: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          color: "#FFFFFF",
          fontSize: 15,
          fontWeight: 750,
          fontFamily: "inherit",
        }}
      />
    </label>
  );
}
