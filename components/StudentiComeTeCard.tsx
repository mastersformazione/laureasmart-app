"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Heart, Sparkles, RefreshCcw } from "lucide-react";

type StudentStory = {
  id: string;
  user_email: string;
  titolo: string;
  testo: string;
  area_interesse?: string;
  situazione?: string;
  tempo_studio?: string;
  obiettivo?: string;
  created_at?: string;
};

export default function StudentiComeTeCard() {
  const [story, setStory] = useState<StudentStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    async function loadStory() {
      try {
        const storedUser = localStorage.getItem("gps_user");

        if (!storedUser) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);

        const response = await fetch(
          "https://laureasmart.it/api/genera-storia-studente.php?t=" +
            Date.now(),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_email: user?.email || "",
              area_interesse: localStorage.getItem("area_interesse") || "",
              situazione: localStorage.getItem("situazione") || "",
              tempo_studio: localStorage.getItem("tempo_disponibile") || "",
              obiettivo: localStorage.getItem("obiettivo") || "",
              eta: localStorage.getItem("eta") || "30-40",
            }),
          }
        );

        const data = await response.json();

        if (data.success && data.story) {
          setStory(data.story);
          tracciaInterazione(data.story.id, "view");
        }
      } catch (error) {
        console.error("Errore caricamento Studenti come te:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStory();
  }, []);

  async function tracciaInterazione(storiaId: string, actionType: string) {
    try {
      const storedUser = localStorage.getItem("gps_user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      await fetch("https://laureasmart.it/api/traccia-storia-studente.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storia_id: storiaId,
          user_email: user?.email || "",
          action_type: actionType,
        }),
      });
    } catch (error) {
      console.error("Errore tracking storia:", error);
    }
  }

  function handleMiRitrovo() {
    if (!story) return;

    setLiked(true);
    tracciaInterazione(story.id, "mi_ritrovo");
  }

  function handleWhatsApp() {
    if (!story) return;

    tracciaInterazione(story.id, "whatsapp");

    const testo = encodeURIComponent(
      `Ciao, ho letto una storia su Laurea Smart in cui mi ritrovo e vorrei capire quale percorso universitario può essere più adatto a me.`
    );

    window.open(`https://wa.me/393793673257?text=${testo}`, "_blank");
  }

  if (loading) {
    return (
      <section
        style={{
          padding: 18,
          borderRadius: 28,
          background: "rgba(17,32,51,0.86)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
          color: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <RefreshCcw size={18} color="#78C2FF" />
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.68)" }}>
            Caricamento storia...
          </span>
        </div>
      </section>
    );
  }

  if (!story) {
    return (
      <section
        style={{
          padding: 20,
          borderRadius: 30,
          background: "rgba(17,32,51,0.86)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 18px 46px rgba(0,0,0,0.28)",
          color: "#FFFFFF",
          backdropFilter: "blur(16px)",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px",
            borderRadius: 999,
            background: "rgba(58,160,255,0.16)",
            color: "#78C2FF",
            fontSize: 12,
            fontWeight: 900,
            marginBottom: 14,
          }}
        >
          Studenti come te
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: 23,
            lineHeight: 1.12,
            fontWeight: 900,
            letterSpacing: "-0.5px",
          }}
        >
          Storie in arrivo per il tuo profilo
        </h2>

        <p
          style={{
            margin: "12px 0 0",
            fontSize: 15,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.72)",
          }}
        >
          Presto troverai qui esperienze di studenti con obiettivi e ritmi
          simili ai tuoi.
        </p>
      </section>
    );
  }

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: 20,
        borderRadius: 30,
        background:
          "linear-gradient(135deg, rgba(17,32,51,0.94) 0%, rgba(17,32,51,0.84) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 18px 46px rgba(0,0,0,0.28)",
        color: "#FFFFFF",
        backdropFilter: "blur(16px)",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -42,
          top: -42,
          width: 140,
          height: 140,
          borderRadius: 999,
          background: "rgba(58,160,255,0.14)",
        }}
      />

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 12px",
          borderRadius: 999,
          background: "rgba(58,160,255,0.16)",
          color: "#78C2FF",
          fontSize: 12,
          fontWeight: 900,
          marginBottom: 14,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Sparkles size={14} />
        Studenti come te
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: 23,
          lineHeight: 1.12,
          fontWeight: 900,
          letterSpacing: "-0.5px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {story.titolo}
      </h2>

      <p
        style={{
          margin: "12px 0 0",
          fontSize: 15,
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.72)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {story.testo}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginTop: 18,
          position: "relative",
          zIndex: 1,
        }}
      >
        <button
          type="button"
          onClick={handleMiRitrovo}
          style={{
            minHeight: 52,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.10)",
            background: liked
              ? "rgba(37,211,102,0.16)"
              : "rgba(255,255,255,0.08)",
            color: liked ? "#7CFFB1" : "#FFFFFF",
            fontSize: 14,
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <Heart size={17} />
          Mi ritrovo
        </button>

        <button
          type="button"
          onClick={handleWhatsApp}
          style={{
            minHeight: 52,
            borderRadius: 18,
            border: "none",
            background: "#25D366",
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
            boxShadow: "0 12px 28px rgba(37,211,102,0.24)",
          }}
        >
          <MessageCircle size={17} />
          Orientatore
        </button>
      </div>
    </section>
  );
}
