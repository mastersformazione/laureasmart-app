"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { getPercorsiVisibili, Percorso } from "@/lib/data/percorsi";
import BottomNav from "@/components/ui/BottomNav";
import { trackMetaEvent } from "../../../lib/data/metaPixel";
import {
  Search,
  GraduationCap,
  Sparkles,
  Heart,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  FileCheck2,
  Wallet,
  X,
} from "lucide-react";

type InteresseStorage = {
  settori: Record<string, number>;
  tags: Record<string, number>;
  percorsi: Record<string, number>;
};

const nomiSettori: Record<string, string> = {
  tutti: "Tutti",
  giuridico: "Giuridica",
  politico_sociale: "Politico-sociale",
  psicologia: "Psicologia",
  scienze_motorie: "Scienze motorie",
  comunicazione: "Comunicazione",
  educazione: "Educazione",
  turismo: "Turismo",
  biologia: "Biologia",
  lingue: "Lingue",
  lettere_arte_spettacolo: "Lettere, arte e spettacolo",
  informatica_ingegneria: "Informatica",
  ingegneria_industriale: "Ingegneria industriale",
  ingegneria_civile: "Ingegneria civile",
  economia: "Economia",
  design_moda: "Design e moda",
  scuola: "Scuola",
  sanitario: "Sanitario",
};

const nomiTipi: Record<string, string> = {
  tutti: "Tutti",
  laurea_triennale: "Triennali",
  laurea_magistrale: "Magistrali",
  master: "Master",
};

type Tone = "blue" | "purple" | "teal" | "amber" | "rose" | "cyan";

const toneStyles: Record<
  Tone,
  {
    accent: string;
    icon: string;
    bg: string;
    softBg: string;
    border: string;
    glow: string;
  }
> = {
  blue: {
    accent: "#60A5FA",
    icon: "#BFDBFE",
    bg: "linear-gradient(135deg, rgba(59,130,246,0.24), rgba(12,25,42,0.96))",
    softBg: "rgba(59,130,246,0.13)",
    border: "rgba(96,165,250,0.30)",
    glow: "rgba(59,130,246,0.22)",
  },
  purple: {
    accent: "#A78BFA",
    icon: "#DDD6FE",
    bg: "linear-gradient(135deg, rgba(139,92,246,0.24), rgba(12,25,42,0.96))",
    softBg: "rgba(139,92,246,0.13)",
    border: "rgba(167,139,250,0.30)",
    glow: "rgba(139,92,246,0.22)",
  },
  teal: {
    accent: "#2DD4BF",
    icon: "#99F6E4",
    bg: "linear-gradient(135deg, rgba(20,184,166,0.23), rgba(12,25,42,0.96))",
    softBg: "rgba(20,184,166,0.13)",
    border: "rgba(45,212,191,0.28)",
    glow: "rgba(20,184,166,0.20)",
  },
  amber: {
    accent: "#FBBF24",
    icon: "#FDE68A",
    bg: "linear-gradient(135deg, rgba(245,158,11,0.23), rgba(12,25,42,0.96))",
    softBg: "rgba(245,158,11,0.13)",
    border: "rgba(251,191,36,0.30)",
    glow: "rgba(245,158,11,0.20)",
  },
  rose: {
    accent: "#FB7185",
    icon: "#FECDD3",
    bg: "linear-gradient(135deg, rgba(244,63,94,0.23), rgba(12,25,42,0.96))",
    softBg: "rgba(244,63,94,0.13)",
    border: "rgba(251,113,133,0.28)",
    glow: "rgba(244,63,94,0.20)",
  },
  cyan: {
    accent: "#22D3EE",
    icon: "#A5F3FC",
    bg: "linear-gradient(135deg, rgba(6,182,212,0.23), rgba(12,25,42,0.96))",
    softBg: "rgba(6,182,212,0.13)",
    border: "rgba(34,211,238,0.28)",
    glow: "rgba(6,182,212,0.20)",
  },
};

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: 20,
  paddingBottom: 120,
  maxWidth: 500,
  margin: "0 auto",
  color: "#FFFFFF",
  background:
    "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
  fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
  overflowX: "hidden",
  boxSizing: "border-box",
};

const glassCard: CSSProperties = {
  borderRadius: 28,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.07)",
  boxShadow: "0 22px 55px rgba(0,0,0,0.26)",
  backdropFilter: "blur(16px)",
};

function getSettoreTone(settore: string): Tone {
  const mappa: Record<string, Tone> = {
    giuridico: "amber",
    politico_sociale: "cyan",
    psicologia: "purple",
    scienze_motorie: "teal",
    comunicazione: "blue",
    educazione: "teal",
    turismo: "amber",
    biologia: "teal",
    lingue: "cyan",
    lettere_arte_spettacolo: "purple",
    informatica_ingegneria: "cyan",
    ingegneria_industriale: "amber",
    ingegneria_civile: "blue",
    economia: "blue",
    design_moda: "purple",
    scuola: "teal",
    sanitario: "rose",
  };

  return mappa[settore] || "blue";
}

function formatTipo(tipo: string) {
  if (tipo === "laurea_triennale") return "Laurea triennale";
  if (tipo === "laurea_magistrale") return "Laurea magistrale";
  if (tipo === "laurea_ciclo_unico") return "Laurea a ciclo unico";
  if (tipo === "corso_post_diploma") return "Corso post diploma";
  if (tipo === "master_primo_livello") return "Master I livello";
  if (tipo === "master_secondo_livello") return "Master II livello";

  return nomiTipi[tipo] || tipo.replaceAll("_", " ");
}

function formatClasseBadge(percorso: Percorso) {
  const classe = percorso.classe || "";

  if (
    percorso.tipo === "master_primo_livello" ||
    percorso.tipo === "master_secondo_livello"
  ) {
    if (classe.includes("CP")) return "CP";
    if (classe.includes("CF")) return "CF";
    return "MASTER";
  }

  if (percorso.tipo === "laurea_ciclo_unico") {
    return "CU";
  }

  if (percorso.tipo === "corso_post_diploma") {
    return "POST";
  }

  return classe.replace("L-", "L").replace("LM-", "LM");
}

function formatClasseDettaglio(percorso: Percorso) {
  if (
    percorso.tipo === "master_primo_livello" ||
    percorso.tipo === "master_secondo_livello"
  ) {
    return percorso.classe;
  }

  if (percorso.tipo === "laurea_ciclo_unico") {
    return `Ciclo unico - ${percorso.classe}`;
  }

  if (percorso.tipo === "corso_post_diploma") {
    return percorso.classe;
  }

  return `Classe ${percorso.classe}`;
}

export default function PercorsiPage() {
  const [titoloStudio, setTitoloStudio] = useState("diploma");
  const [messaggio, setMessaggio] = useState("");
  const [settoreAttivo, setSettoreAttivo] = useState("tutti");
  const [tipoAttivo, setTipoAttivo] = useState("tutti");
  const [queryRicerca, setQueryRicerca] = useState("");
  const [percorsoAttivo, setPercorsoAttivo] = useState<Percorso | null>(null);

  const [interessi, setInteressi] = useState<InteresseStorage>({
    settori: {},
    tags: {},
    percorsi: {},
  });

  useEffect(() => {
    const titoloSalvato = localStorage.getItem("titolo_studio");

    if (titoloSalvato) {
      setTitoloStudio(titoloSalvato);
    } else {
      setTitoloStudio("diploma");
    }

    const datiSalvati = localStorage.getItem("interessi_percorsi");

    if (datiSalvati) {
      try {
        setInteressi(JSON.parse(datiSalvati));
      } catch {
        setInteressi({
          settori: {},
          tags: {},
          percorsi: {},
        });
      }
    }
  }, []);

  const percorsi = getPercorsiVisibili(titoloStudio);

  const settoriDisponibili = [
    "tutti",
    ...Array.from(new Set(percorsi.map((percorso) => percorso.settore))),
  ];

  const percorsiFiltrati = percorsi.filter((percorso) => {
    const filtroSettore =
      settoreAttivo === "tutti" || percorso.settore === settoreAttivo;

    const filtroTipo =
      tipoAttivo === "tutti" ||
      percorso.tipo === tipoAttivo ||
      (tipoAttivo === "master" &&
        (percorso.tipo === "master_primo_livello" ||
          percorso.tipo === "master_secondo_livello"));

    const testoRicerca = queryRicerca.toLowerCase().trim();

    const filtroRicerca =
      testoRicerca === "" ||
      percorso.titolo.toLowerCase().includes(testoRicerca) ||
      percorso.classe.toLowerCase().includes(testoRicerca) ||
      percorso.settore.toLowerCase().includes(testoRicerca) ||
      percorso.tags.some((tag) => tag.toLowerCase().includes(testoRicerca));

    return filtroSettore && filtroTipo && filtroRicerca;
  });

  const percorsiOrdinati = [...percorsiFiltrati].sort((a, b) => {
    const scoreSettoreA = interessi.settori[a.settore] || 0;
    const scoreSettoreB = interessi.settori[b.settore] || 0;

    const scorePercorsoA = interessi.percorsi[a.id] || 0;
    const scorePercorsoB = interessi.percorsi[b.id] || 0;

    const prioritaTipo = (tipo: string) => {
      if (tipo === "master_secondo_livello") return 40;
      if (tipo === "master_primo_livello") return 35;
      if (tipo === "laurea_magistrale") return 20;
      if (tipo === "laurea_triennale") return 5;
      return 0;
    };

    const scoreA =
      scoreSettoreA +
      scorePercorsoA +
      a.prioritaCommerciale +
      prioritaTipo(a.tipo);

    const scoreB =
      scoreSettoreB +
      scorePercorsoB +
      b.prioritaCommerciale +
      prioritaTipo(b.tipo);

    return scoreB - scoreA;
  });

  function getPercorsiSimili(percorsoCorrente: Percorso) {
    return percorsi
      .filter((altroPercorso) => altroPercorso.id !== percorsoCorrente.id)
      .map((altroPercorso) => {
        const stessoSettore =
          altroPercorso.settore === percorsoCorrente.settore ? 3 : 0;

        const tagInComune = altroPercorso.tags.filter((tag) =>
          percorsoCorrente.tags.includes(tag)
        ).length;

        const score = stessoSettore + tagInComune;

        return {
          percorso: altroPercorso,
          score,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.percorso);
  }

  function mappaSettoreInProfilo(settore: string) {
    const mappa: Record<string, string> = {
      giuridico: "GIURIDICA",
      politico_sociale: "SCUOLA",
      psicologia: "PSICOLOGIA",
      scienze_motorie: "SPORT",
      comunicazione: "COMUNICAZIONE",
      educazione: "EDUCAZIONE",
      turismo: "ECONOMIA",
      biologia: "TECNOLOGIA",
      lingue: "COMUNICAZIONE",
      lettere_arte_spettacolo: "COMUNICAZIONE",
      informatica_ingegneria: "TECNOLOGIA",
      ingegneria_industriale: "TECNOLOGIA",
      ingegneria_civile: "TECNOLOGIA",
      economia: "ECONOMIA",
      design_moda: "COMUNICAZIONE",
      scuola: "SCUOLA",
      sanitario: "PSICOLOGIA",
    };

    return mappa[settore] || "GENERALE";
  }

  async function aggiornaTagOneSignal(percorso: Percorso) {
    try {
      const storedUser = localStorage.getItem("gps_user");

      if (!storedUser) return;

      const user = JSON.parse(storedUser);

      if (!user?.email) return;

      const profilo = mappaSettoreInProfilo(percorso.settore);
      const titolo = localStorage.getItem("titolo_studio") || "Non indicato";
      const obiettivo = localStorage.getItem("obiettivo") || "Non indicato";

      await fetch("https://laureasmart.it/api/sync-onesignal-tags.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          nome: user.nome || "",
          cognome: user.cognome || "",
          telefono: user.telefono || "",
          profilo,
          titolo_studio: titolo,
          obiettivo,
        }),
      });

      console.log("OneSignal aggiornato:", {
        profilo,
        titolo,
        obiettivo,
      });
    } catch (error) {
      console.error("Errore sync OneSignal:", error);
    }
  }

  function inviaInteresseAlBackend(
    percorso: Percorso,
    actionType: string = "click"
  ) {
    try {
      const profiloSalvato = localStorage.getItem("gps_user");
      const profilo = profiloSalvato ? JSON.parse(profiloSalvato) : null;

      fetch("https://laureasmart.it/api/salva-interesse-percorso.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: profilo?.email || null,
          percorso_id: percorso.id,
          percorso_titolo: percorso.titolo,
          settore: percorso.settore,
          tags: percorso.tags,
          action_type: actionType,
        }),
      }).catch((error) => {
        console.error("Errore salvataggio interesse percorso:", error);
      });
    } catch (error) {
      console.error("Errore preparazione salvataggio interesse:", error);
    }
  }

  function registraInteresse(percorso: Percorso) {
    const nuoviInteressi: InteresseStorage = {
      settori: { ...interessi.settori },
      tags: { ...interessi.tags },
      percorsi: { ...interessi.percorsi },
    };

    nuoviInteressi.settori[percorso.settore] =
      (nuoviInteressi.settori[percorso.settore] || 0) + 1;

    nuoviInteressi.percorsi[percorso.id] =
      (nuoviInteressi.percorsi[percorso.id] || 0) + 1;

    percorso.tags.forEach((tag) => {
      nuoviInteressi.tags[tag] = (nuoviInteressi.tags[tag] || 0) + 1;
    });

    localStorage.setItem("interessi_percorsi", JSON.stringify(nuoviInteressi));

    const preferitiSalvati = localStorage.getItem("percorsi_preferiti");

    const preferiti: Percorso[] = preferitiSalvati
      ? JSON.parse(preferitiSalvati)
      : [];

    const giaPresente = preferiti.some((item) => item.id === percorso.id);

    if (!giaPresente) {
      preferiti.push(percorso);
      localStorage.setItem("percorsi_preferiti", JSON.stringify(preferiti));
      trackMetaEvent("AggiuntoPreferiti", {
        corso: percorso.titolo,
        categoria: percorso.settore,
        tipo: percorso.tipo,
      });
    }

    setInteressi(nuoviInteressi);
    setMessaggio(`${percorso.titolo} aggiunto ai tuoi percorsi preferiti`);

    inviaInteresseAlBackend(percorso, "click_mi_interessa");
    aggiornaTagOneSignal(percorso);
    setPercorsoAttivo(percorso);
  }

  function vaiAPercorsoAgevolato(percorso: Percorso) {
    localStorage.setItem("corso_interesse_attivo", JSON.stringify(percorso));
    inviaInteresseAlBackend(percorso, "click_cfu");
    setPercorsoAttivo(null);
    window.location.href = "/dashboard/orientamento/percorso-agevolato";
  }

  function apriWhatsAppCosto(percorso: Percorso) {
    inviaInteresseAlBackend(percorso, "click_costo_whatsapp");

    const testo = encodeURIComponent(
      `Ciao, ho salvato questo percorso su Laurea Smart: ${percorso.titolo}. Vorrei ricevere informazioni su costi, agevolazioni e modalità di iscrizione.`
    );

    setPercorsoAttivo(null);
    window.open(`https://wa.me/393793673257?text=${testo}`, "_blank");
  }

  function parlaConOrientatore(percorso: Percorso) {
    inviaInteresseAlBackend(percorso, "click_orientatore_whatsapp");

    const testo = encodeURIComponent(
      `Ciao, vorrei parlare con un orientatore Laurea Smart. Il percorso che mi interessa è: ${percorso.titolo}.`
    );

    setPercorsoAttivo(null);
    window.open(`https://wa.me/393793673257?text=${testo}`, "_blank");
  }

  return (
    <main style={pageStyle}>
      <section
        style={{
          ...glassCard,
          position: "relative",
          overflow: "hidden",
          padding: 22,
          marginBottom: 16,
          background:
            "linear-gradient(145deg, rgba(31,111,178,0.42), rgba(139,92,246,0.20), rgba(255,255,255,0.06))",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -48,
            top: -48,
            width: 170,
            height: 170,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(58,160,255,0.25), transparent 68%)",
          }}
        />

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.12)",
            marginBottom: 14,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Sparkles size={14} color="#BFDBFE" />
          <span
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: "#DBEAFE",
              letterSpacing: 0.5,
            }}
          >
            Laurea Smart · Catalogo percorsi
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 62,
              minWidth: 62,
              height: 62,
              borderRadius: 24,
              background: "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 42px rgba(31,111,178,0.36)",
            }}
          >
            <GraduationCap size={32} />
          </div>

          <div style={{ flex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 32,
                lineHeight: 1.05,
                fontWeight: 950,
                letterSpacing: "-1px",
              }}
            >
              Percorsi consigliati
            </h1>

            <p
              style={{
                margin: "12px 0 0",
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Esplora lauree, magistrali e master coerenti con il tuo titolo di
              studio. Salva i percorsi più interessanti per ricevere
              suggerimenti sempre più precisi.
            </p>
          </div>
        </div>

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
          <HeroMetric
            label="Titolo rilevato"
            value={titoloStudio}
            icon={<Sparkles size={16} />}
            tone="blue"
          />
          <HeroMetric
            label="Risultati"
            value={`${percorsiOrdinati.length} percorsi`}
            icon={<Search size={16} />}
            tone="purple"
          />
        </div>
      </section>

      <section
        style={{
          ...glassCard,
          marginBottom: 14,
          padding: 14,
          background:
            "linear-gradient(135deg, rgba(6,182,212,0.16), rgba(255,255,255,0.06))",
          border: "1px solid rgba(34,211,238,0.22)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 16,
              background: "rgba(34,211,238,0.12)",
              border: "1px solid rgba(34,211,238,0.22)",
              color: "#A5F3FC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Search size={22} />
          </div>

          <input
            type="text"
            value={queryRicerca}
            onChange={(e) => setQueryRicerca(e.target.value)}
            placeholder="Cerca corso, classe, area o parola chiave..."
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
                width: 34,
                height: 34,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.70)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gap: 10,
          marginBottom: 14,
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <FilterBlock label="Tipo percorso">
          {["tutti", "laurea_triennale", "laurea_magistrale", "master"].map(
            (tipo) => (
              <FilterButton
                key={tipo}
                active={tipoAttivo === tipo}
                onClick={() => setTipoAttivo(tipo)}
                label={nomiTipi[tipo]}
                tone={tipo === "master" ? "purple" : "blue"}
              />
            )
          )}
        </FilterBlock>

        <FilterBlock label="Area di interesse">
          {settoriDisponibili.map((settore) => (
            <FilterButton
              key={settore}
              active={settoreAttivo === settore}
              onClick={() => setSettoreAttivo(settore)}
              label={nomiSettori[settore] || settore}
              tone={settore === "tutti" ? "blue" : getSettoreTone(settore)}
            />
          ))}
        </FilterBlock>
      </div>

      {messaggio && (
        <div
          style={{
            marginBottom: 16,
            padding: 14,
            borderRadius: 20,
            background: "rgba(34,197,94,0.14)",
            border: "1px solid rgba(34,197,94,0.28)",
            color: "#BBF7D0",
            fontSize: 13,
            lineHeight: 1.45,
            fontWeight: 850,
            boxShadow: "0 14px 30px rgba(34,197,94,0.10)",
          }}
        >
          {messaggio}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          margin: "18px 0 14px",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1.1,
              color: "rgba(255,255,255,0.54)",
              fontWeight: 900,
            }}
          >
            Catalogo filtrato
          </p>
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 950,
              letterSpacing: "-0.5px",
              color: "#FFFFFF",
            }}
          >
            Risultati
          </h2>
        </div>

        <span
          style={{
            minWidth: 44,
            height: 38,
            padding: "0 13px",
            borderRadius: 999,
            background:
              "linear-gradient(135deg, rgba(58,160,255,0.24), rgba(139,92,246,0.18))",
            border: "1px solid rgba(120,194,255,0.25)",
            color: "#BFDBFE",
            fontSize: 14,
            fontWeight: 950,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 14px 28px rgba(58,160,255,0.12)",
          }}
        >
          {percorsiOrdinati.length}
        </span>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {percorsiOrdinati.map((percorso) => {
          const percorsiSimili = getPercorsiSimili(percorso);

          return (
            <PercorsoCard
              key={percorso.id}
              percorso={percorso}
              percorsiSimili={percorsiSimili}
              onInteresse={registraInteresse}
            />
          );
        })}
      </div>

      {percorsoAttivo && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(2,7,18,0.84)",
            padding: 20,
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 392,
              borderRadius: 32,
              background:
                "linear-gradient(145deg, rgba(31,111,178,0.28), rgba(139,92,246,0.16), rgba(11,23,40,0.98))",
              padding: 22,
              boxShadow: "0 34px 90px rgba(0,0,0,0.48)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#FFFFFF",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -24,
                width: 135,
                height: 135,
                borderRadius: 999,
                background:
                  "radial-gradient(circle, rgba(37,211,102,0.18), transparent 70%)",
              }}
            />

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
                borderRadius: 999,
                background: "rgba(37,211,102,0.14)",
                color: "#BBF7D0",
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 900,
                border: "1px solid rgba(37,211,102,0.24)",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Heart size={15} />
              Percorso salvato nei preferiti
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 27,
                lineHeight: 1.08,
                fontWeight: 950,
                letterSpacing: "-0.8px",
                color: "#FFFFFF",
                position: "relative",
                zIndex: 1,
              }}
            >
              {percorsoAttivo.titolo}
            </h2>

            <p
              style={{
                margin: "14px 0 0",
                fontSize: 14,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.72)",
                position: "relative",
                zIndex: 1,
              }}
            >
              Vuoi fare un passo in più? Puoi scoprire costi, agevolazioni,
              possibilità di riconoscimento CFU o parlare subito con un
              orientatore.
            </p>

            <div
              style={{
                display: "grid",
                gap: 11,
                marginTop: 22,
                position: "relative",
                zIndex: 1,
              }}
            >
              <button
                onClick={() => apriWhatsAppCosto(percorsoAttivo)}
                style={{
                  minHeight: 56,
                  borderRadius: 20,
                  border: "none",
                  background: "linear-gradient(135deg, #22C55E, #25D366)",
                  color: "#FFFFFF",
                  fontSize: 15,
                  fontWeight: 950,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                  cursor: "pointer",
                  boxShadow: "0 18px 38px rgba(37,211,102,0.25)",
                }}
              >
                <Wallet size={19} />
                Scopri quanto costa
              </button>

              <button
                onClick={() => vaiAPercorsoAgevolato(percorsoAttivo)}
                style={modalButtonStyle}
              >
                <FileCheck2 size={18} />
                Verifica CFU e percorso agevolato
              </button>

              <button
                onClick={() => parlaConOrientatore(percorsoAttivo)}
                style={modalButtonStyle}
              >
                <MessageCircle size={18} />
                Parla con un orientatore
              </button>

              <button
                onClick={() => setPercorsoAttivo(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "rgba(255,255,255,0.48)",
                  padding: "8px 4px",
                  fontSize: 13,
                  fontWeight: 750,
                  cursor: "pointer",
                }}
              >
                Continua a esplorare
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}

const modalButtonStyle: CSSProperties = {
  minHeight: 54,
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.08)",
  color: "#BFDBFE",
  fontSize: 14,
  fontWeight: 900,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  cursor: "pointer",
};

function HeroMetric({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone: Tone;
}) {
  const theme = toneStyles[tone];

  return (
    <div
      style={{
        borderRadius: 20,
        border: `1px solid ${theme.border}`,
        background: theme.bg,
        padding: 12,
        boxShadow: `0 14px 30px ${theme.glow}`,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 13,
          background: theme.softBg,
          border: `1px solid ${theme.border}`,
          color: theme.icon,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        {icon}
      </div>
      <p
        style={{
          margin: "0 0 4px",
          fontSize: 10,
          color: "rgba(255,255,255,0.58)",
          fontWeight: 900,
        }}
      >
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 950, lineHeight: 1.25 }}>
        {value}
      </p>
    </div>
  );
}

function FilterBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        ...glassCard,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        borderRadius: 22,
        padding: 12,
        background: "rgba(255,255,255,0.055)",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          margin: "0 0 10px",
          fontSize: 11,
          color: "rgba(255,255,255,0.56)",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: 0.9,
        }}
      >
        {label}
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            gap: 8,
            paddingBottom: 2,
            minWidth: "max-content",
            maxWidth: "none",
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  tone: Tone;
}) {
  const theme = toneStyles[tone];

  return (
    <button
      onClick={onClick}
      style={{
        whiteSpace: "nowrap",
        borderRadius: 999,
        border: active
          ? `1px solid ${theme.border}`
          : "1px solid rgba(255,255,255,0.08)",
        padding: "10px 13px",
        background: active ? theme.softBg : "rgba(17,32,51,0.72)",
        color: active ? theme.icon : "rgba(255,255,255,0.62)",
        fontSize: 12,
        fontWeight: 900,
        cursor: "pointer",
        boxShadow: active ? `0 12px 24px ${theme.glow}` : "none",
        backdropFilter: "blur(12px)",
      }}
    >
      {label}
    </button>
  );
}

function PercorsoCard({
  percorso,
  percorsiSimili,
  onInteresse,
}: {
  percorso: Percorso;
  percorsiSimili: Percorso[];
  onInteresse: (percorso: Percorso) => void;
}) {
  const tone = getSettoreTone(percorso.settore);
  const theme = toneStyles[tone];

  const badgeClasse = formatClasseBadge(percorso);
  const tipoLabel = formatTipo(percorso.tipo);
  const settoreLabel = nomiSettori[percorso.settore] || percorso.settore;
  const classeDettaglio = formatClasseDettaglio(percorso);

  return (
    <section
      style={{
        borderRadius: 30,
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        boxShadow: `0 22px 52px ${theme.glow}`,
        backdropFilter: "blur(16px)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: 5,
          background: `linear-gradient(90deg, ${theme.accent}, transparent)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: -46,
          top: -46,
          width: 138,
          height: 138,
          borderRadius: 999,
          background: `radial-gradient(circle, ${theme.glow}, transparent 68%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ padding: 18, position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "64px minmax(0, 1fr)",
            gap: 13,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 24,
              background: `linear-gradient(145deg, ${theme.softBg}, rgba(255,255,255,0.06))`,
              border: `1px solid ${theme.border}`,
              color: theme.icon,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: badgeClasse.length > 4 ? 11 : 15,
              fontWeight: 950,
              letterSpacing: badgeClasse.length > 4 ? 0.3 : 0,
              lineHeight: 1,
              textAlign: "center",
              boxShadow: `0 14px 28px ${theme.glow}`,
              padding: 6,
              boxSizing: "border-box",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {badgeClasse}
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                gap: 7,
                flexWrap: "wrap",
                marginBottom: 10,
                maxWidth: "100%",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  maxWidth: "100%",
                  minWidth: 0,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: theme.softBg,
                  border: `1px solid ${theme.border}`,
                  color: theme.icon,
                  fontSize: 11,
                  fontWeight: 950,
                  lineHeight: 1.15,
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                }}
              >
                {settoreLabel}
              </span>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  maxWidth: "100%",
                  minWidth: 0,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.075)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.76)",
                  fontSize: 11,
                  fontWeight: 900,
                  lineHeight: 1.15,
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                }}
              >
                {tipoLabel}
              </span>
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 21,
                lineHeight: 1.14,
                fontWeight: 950,
                color: "#FFFFFF",
                letterSpacing: "-0.45px",
                overflowWrap: "anywhere",
              }}
            >
              {percorso.titolo}
            </h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 11,
              }}
            >
              <MiniInfoPill label={classeDettaglio} />
              <MiniInfoPill label={percorso.durata} />
            </div>
          </div>
        </div>

        {percorso.tags && percorso.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 7,
              marginTop: 15,
            }}
          >
            {percorso.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  borderRadius: 999,
                  padding: "6px 9px",
                  background: "rgba(255,255,255,0.065)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.64)",
                  fontSize: 11,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  maxWidth: "100%",
                  overflowWrap: "anywhere",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {percorso.sbocchi && percorso.sbocchi.length > 0 && (
          <InfoList
            title="Sbocchi principali"
            items={percorso.sbocchi}
            tone={tone}
          />
        )}

        {percorso.prosecuzione && percorso.prosecuzione.length > 0 && (
          <InfoList
            title="Se vuoi proseguire"
            items={percorso.prosecuzione}
            tone={tone}
          />
        )}

        {percorsiSimili.length > 0 && (
          <div
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 22,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px",
                fontSize: 14,
                fontWeight: 950,
                color: "#FFFFFF",
              }}
            >
              Percorsi simili
            </h3>

            <div style={{ display: "grid", gap: 8 }}>
              {percorsiSimili.map((simile) => (
                <button
                  key={simile.id}
                  onClick={() => onInteresse(simile)}
                  style={{
                    width: "100%",
                    borderRadius: 16,
                    border: `1px solid ${theme.border}`,
                    background: theme.softBg,
                    color: theme.icon,
                    padding: "10px 11px",
                    fontSize: 12,
                    fontWeight: 850,
                    lineHeight: 1.25,
                    textAlign: "left",
                    cursor: "pointer",
                    overflowWrap: "anywhere",
                  }}
                >
                  {simile.titolo}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => onInteresse(percorso)}
          style={{
            marginTop: 18,
            width: "100%",
            minHeight: 58,
            borderRadius: 21,
            border: "none",
            background: `linear-gradient(135deg, ${theme.accent}, #1F6FB2)`,
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: 950,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
            boxShadow: `0 18px 36px ${theme.glow}`,
          }}
        >
          <Heart size={19} />
          Mi interessa
          <ArrowRight size={19} />
        </button>
      </div>
    </section>
  );
}

function MiniInfoPill({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        maxWidth: "100%",
        minWidth: 0,
        padding: "7px 10px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.075)",
        border: "1px solid rgba(255,255,255,0.09)",
        color: "rgba(255,255,255,0.72)",
        fontSize: 11,
        fontWeight: 850,
        lineHeight: 1.15,
        overflowWrap: "anywhere",
      }}
    >
      {label}
    </span>
  );
}
function InfoList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: Tone;
}) {
  const theme = toneStyles[tone];

  return (
    <div
      style={{
        marginTop: 16,
        padding: 14,
        borderRadius: 22,
        background: "rgba(255,255,255,0.055)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <h3
        style={{
          margin: "0 0 10px",
          fontSize: 14,
          fontWeight: 950,
          color: "#FFFFFF",
        }}
      >
        {title}
      </h3>

      <div style={{ display: "grid", gap: 8 }}>
        {items.slice(0, 4).map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              color: "rgba(255,255,255,0.72)",
              fontSize: 13,
              lineHeight: 1.35,
              fontWeight: 650,
            }}
          >
            <CheckCircle2
              size={15}
              color={theme.icon}
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
