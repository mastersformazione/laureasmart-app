"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/ui/BottomNav";
import type { Percorso } from "@/lib/data/percorsi";
import {
  Heart,
  Search,
  X,
  Trash2,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function PreferitiPage() {
  const [preferiti, setPreferiti] = useState<Percorso[]>([]);
  const [queryRicerca, setQueryRicerca] = useState("");

  useEffect(() => {
    const datiSalvati = localStorage.getItem("percorsi_preferiti");

    if (datiSalvati) {
      try {
        setPreferiti(JSON.parse(datiSalvati));
      } catch {
        setPreferiti([]);
      }
    }
  }, []);

  function rimuoviPreferito(id: string) {
    const nuoviPreferiti = preferiti.filter((item) => item.id !== id);

    setPreferiti(nuoviPreferiti);
    localStorage.setItem("percorsi_preferiti", JSON.stringify(nuoviPreferiti));
  }

  const preferitiFiltrati = preferiti.filter((percorso) => {
    const testoRicerca = queryRicerca.toLowerCase().trim();

    return (
      testoRicerca === "" ||
      percorso.titolo.toLowerCase().includes(testoRicerca) ||
      percorso.classe.toLowerCase().includes(testoRicerca) ||
      percorso.settore.toLowerCase().includes(testoRicerca) ||
      percorso.tags.some((tag) => tag.toLowerCase().includes(testoRicerca))
    );
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 20,
        paddingBottom: 120,
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
          padding: 28,
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
            right: -44,
            top: -44,
            width: 155,
            height: 155,
            borderRadius: 999,
            background: "rgba(255,255,255,0.14)",
          }}
        />

        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 22,
            background: "rgba(255,255,255,0.16)",
            border: "1px solid rgba(255,255,255,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Heart size={31} />
        </div>

        <p
          style={{
            margin: "0 0 8px",
            fontSize: 14,
            fontWeight: 850,
            opacity: 0.92,
            position: "relative",
            zIndex: 1,
          }}
        >
          Laurea Smart
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: 34,
            lineHeight: 1.05,
            fontWeight: 900,
            letterSpacing: "-1px",
            position: "relative",
            zIndex: 1,
          }}
        >
          I miei percorsi
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            fontSize: 15,
            lineHeight: 1.6,
            opacity: 0.95,
            position: "relative",
            zIndex: 1,
          }}
        >
          Qui trovi i percorsi che hai salvato cliccando su “Mi interessa”.
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 16,
            padding: "8px 12px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.16)",
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: 900,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Sparkles size={14} />
          Percorsi salvati: {preferiti.length}
        </div>
      </section>

      <section
        style={{
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          borderRadius: 22,
          background: "rgba(17,32,51,0.86)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 14px 34px rgba(0,0,0,0.24)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Search size={22} color="#78C2FF" />

        <input
          type="text"
          value={queryRicerca}
          onChange={(e) => setQueryRicerca(e.target.value)}
          placeholder="Cerca tra i tuoi percorsi..."
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#FFFFFF",
            fontSize: 14,
            fontFamily: "inherit",
          }}
        />

        {queryRicerca && (
          <button
            type="button"
            onClick={() => setQueryRicerca("")}
            style={{
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.55)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        )}
      </section>

      {preferiti.length === 0 ? (
        <DarkEmptyCard />
      ) : preferitiFiltrati.length === 0 ? (
        <DarkCard
          title="Nessun risultato trovato"
          description="Prova a cercare con un altro nome, area o classe di laurea."
          badge="Ricerca"
          icon={<Search size={24} />}
        />
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {preferitiFiltrati.map((percorso) => (
            <DarkCard
              key={percorso.id}
              title={percorso.titolo}
              description={`Durata: ${percorso.durata}`}
              badge={percorso.classe}
              icon={<span>{percorso.classe.replace("L-", "L")}</span>}
            >
              <div
                style={{
                  marginTop: 14,
                  padding: 13,
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.68)",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                Area:{" "}
                <strong style={{ color: "#FFFFFF" }}>{percorso.settore}</strong>
              </div>

              <button
                onClick={() => rimuoviPreferito(percorso.id)}
                style={{
                  marginTop: 14,
                  width: "100%",
                  minHeight: 54,
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 850,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                  cursor: "pointer",
                }}
              >
                <Trash2 size={18} color="#78C2FF" />
                Rimuovi dai preferiti
              </button>
            </DarkCard>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}

function DarkEmptyCard() {
  return (
    <section
      style={{
        padding: 22,
        borderRadius: 28,
        background: "rgba(17,32,51,0.86)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
        backdropFilter: "blur(16px)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 66,
          height: 66,
          borderRadius: 24,
          background: "rgba(58,160,255,0.16)",
          color: "#78C2FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <GraduationCap size={32} />
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: 22,
          lineHeight: 1.15,
          fontWeight: 900,
          color: "#FFFFFF",
          letterSpacing: "-0.5px",
        }}
      >
        Nessun percorso salvato
      </h2>

      <p
        style={{
          margin: "10px 0 0",
          fontSize: 14,
          lineHeight: 1.55,
          color: "rgba(255,255,255,0.66)",
        }}
      >
        Quando trovi un corso interessante, clicca su “Mi interessa” per
        salvarlo qui.
      </p>
    </section>
  );
}

function DarkCard({
  title,
  description,
  badge,
  icon,
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section
      style={{
        padding: 18,
        borderRadius: 28,
        background: "rgba(17,32,51,0.86)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 13,
        }}
      >
        {icon && (
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 20,
              background: "rgba(58,160,255,0.16)",
              color: "#78C2FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 16,
              fontWeight: 900,
              boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
            }}
          >
            {icon}
          </div>
        )}

        <div style={{ flex: 1 }}>
          {badge && (
            <div
              style={{
                display: "inline-flex",
                marginBottom: 9,
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(58,160,255,0.16)",
                color: "#78C2FF",
                fontSize: 11,
                fontWeight: 900,
              }}
            >
              {badge}
            </div>
          )}

          <h2
            style={{
              margin: 0,
              fontSize: 21,
              lineHeight: 1.14,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "-0.45px",
            }}
          >
            {title}
          </h2>

          <p
            style={{
              margin: "9px 0 0",
              color: "rgba(255,255,255,0.64)",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}
