"use client";

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
          <GraduationCap size={31} />
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
          Percorsi consigliati
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
          In base al tuo titolo di studio, questi sono i percorsi più adatti da
          valutare.
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
          Titolo rilevato: {titoloStudio}
        </div>
      </section>

      <section
        style={{
          marginBottom: 16,
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
          placeholder="Cerca corso, area o parola chiave..."
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

      <FilterScroller>
        {["tutti", "laurea_triennale", "laurea_magistrale", "master"].map(
          (tipo) => (
            <FilterButton
              key={tipo}
              active={tipoAttivo === tipo}
              onClick={() => setTipoAttivo(tipo)}
              label={nomiTipi[tipo]}
              variant="pill"
            />
          )
        )}
      </FilterScroller>

      <FilterScroller>
        {settoriDisponibili.map((settore) => (
          <FilterButton
            key={settore}
            active={settoreAttivo === settore}
            onClick={() => setSettoreAttivo(settore)}
            label={nomiSettori[settore] || settore}
            variant="soft"
          />
        ))}
      </FilterScroller>

      {messaggio && (
        <div
          style={{
            marginBottom: 16,
            padding: 14,
            borderRadius: 18,
            background: "rgba(37,211,102,0.13)",
            border: "1px solid rgba(37,211,102,0.25)",
            color: "#7CFFB1",
            fontSize: 13,
            lineHeight: 1.45,
            fontWeight: 800,
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
          marginBottom: 14,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: "-0.4px",
            color: "#FFFFFF",
          }}
        >
          Risultati
        </h2>

        <span
          style={{
            minWidth: 34,
            height: 32,
            padding: "0 11px",
            borderRadius: 999,
            background: "rgba(58,160,255,0.16)",
            color: "#78C2FF",
            fontSize: 13,
            fontWeight: 900,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
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
            background: "rgba(2,7,18,0.82)",
            padding: 20,
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 390,
              borderRadius: 32,
              background:
                "linear-gradient(135deg, rgba(17,32,51,0.98) 0%, rgba(11,23,40,0.98) 100%)",
              padding: 24,
              boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "#FFFFFF",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
                borderRadius: 999,
                background: "rgba(37,211,102,0.13)",
                color: "#7CFFB1",
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 900,
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
                fontWeight: 900,
                letterSpacing: "-0.8px",
                color: "#FFFFFF",
              }}
            >
              {percorsoAttivo.titolo}
            </h2>

            <p
              style={{
                margin: "14px 0 0",
                fontSize: 14,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.68)",
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
              }}
            >
              <button
                onClick={() => apriWhatsAppCosto(percorsoAttivo)}
                style={{
                  minHeight: 56,
                  borderRadius: 20,
                  border: "none",
                  background: "#25D366",
                  color: "#FFFFFF",
                  fontSize: 15,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                  cursor: "pointer",
                  boxShadow: "0 16px 34px rgba(37,211,102,0.28)",
                }}
              >
                <Wallet size={19} />
                Scopri quanto costa
              </button>

              <button
                onClick={() => vaiAPercorsoAgevolato(percorsoAttivo)}
                style={{
                  minHeight: 54,
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#78C2FF",
                  fontSize: 14,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                  cursor: "pointer",
                }}
              >
                <FileCheck2 size={18} />
                Verifica CFU e percorso agevolato
              </button>

              <button
                onClick={() => parlaConOrientatore(percorsoAttivo)}
                style={{
                  minHeight: 54,
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#78C2FF",
                  fontSize: 14,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                  cursor: "pointer",
                }}
              >
                <MessageCircle size={18} />
                Parla con un orientatore
              </button>

              <button
                onClick={() => setPercorsoAttivo(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "rgba(255,255,255,0.45)",
                  padding: "8px 4px",
                  fontSize: 13,
                  fontWeight: 700,
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

function FilterScroller({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginBottom: 14,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          paddingBottom: 3,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  variant,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  variant: "pill" | "soft";
}) {
  return (
    <button
      onClick={onClick}
      style={{
        whiteSpace: "nowrap",
        borderRadius: variant === "pill" ? 999 : 15,
        border: active
          ? "1px solid rgba(58,160,255,0.55)"
          : "1px solid rgba(255,255,255,0.08)",
        padding: variant === "pill" ? "10px 15px" : "9px 12px",
        background: active ? "rgba(58,160,255,0.20)" : "rgba(17,32,51,0.72)",
        color: active ? "#78C2FF" : "rgba(255,255,255,0.62)",
        fontSize: variant === "pill" ? 13 : 12,
        fontWeight: 900,
        cursor: "pointer",
        boxShadow: active ? "0 10px 24px rgba(58,160,255,0.12)" : "none",
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
          {percorso.classe.replace("L-", "L")}
        </div>

        <div style={{ flex: 1 }}>
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
            {nomiSettori[percorso.settore] || percorso.settore}
          </div>

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
            {percorso.titolo}
          </h2>

          <p
            style={{
              margin: "9px 0 0",
              color: "rgba(255,255,255,0.64)",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            Durata: {percorso.durata}
          </p>
        </div>
      </div>

      {percorso.sbocchi && percorso.sbocchi.length > 0 && (
        <InfoList title="Sbocchi principali" items={percorso.sbocchi} />
      )}

      {percorso.prosecuzione && percorso.prosecuzione.length > 0 && (
        <InfoList title="Se vuoi proseguire" items={percorso.prosecuzione} />
      )}

      {percorsiSimili.length > 0 && (
        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 22,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h3
            style={{
              margin: "0 0 10px",
              fontSize: 14,
              fontWeight: 900,
              color: "#FFFFFF",
            }}
          >
            Percorsi simili
          </h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {percorsiSimili.map((simile) => (
              <button
                key={simile.id}
                onClick={() => onInteresse(simile)}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.72)",
                  padding: "8px 11px",
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer",
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
          minHeight: 56,
          borderRadius: 20,
          border: "none",
          background: "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 100%)",
          color: "#FFFFFF",
          fontSize: 16,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          cursor: "pointer",
          boxShadow: "0 16px 34px rgba(31,111,178,0.28)",
        }}
      >
        <Heart size={19} />
        Mi interessa
        <ArrowRight size={19} />
      </button>
    </section>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div
      style={{
        marginTop: 15,
      }}
    >
      <h3
        style={{
          margin: "0 0 9px",
          fontSize: 14,
          fontWeight: 900,
          color: "#FFFFFF",
        }}
      >
        {title}
      </h3>

      <div
        style={{
          display: "grid",
          gap: 8,
        }}
      >
        {items.map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              gap: 9,
              fontSize: 13,
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.66)",
            }}
          >
            <CheckCircle2
              size={16}
              color="#78C2FF"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
