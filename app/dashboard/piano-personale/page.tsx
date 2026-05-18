"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type User = {
  email?: string;
  nome?: string;
  cognome?: string;
  telefono?: string;
};

type Piano = {
  puntoPartenza: string;
  obiettivo: string;
  area: string;
  situazioneUniversitaria: string;
  sostenibilita: string;
  criticita: string[];
  azioni: string[];
  prossimoPasso: string;
};

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.96)",
  borderRadius: 22,
  padding: 22,
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
  border: "1px solid rgba(148, 163, 184, 0.25)",
};

const buttonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 999,
  padding: "13px 20px",
  fontWeight: 800,
  cursor: "pointer",
  background: "#1F6FB2",
  color: "#ffffff",
  boxShadow: "0 12px 25px rgba(31, 111, 178, 0.25)",
};

const secondaryButtonStyle: React.CSSProperties = {
  border: "1px solid rgba(31, 111, 178, 0.25)",
  borderRadius: 999,
  padding: "13px 20px",
  fontWeight: 800,
  cursor: "pointer",
  background: "#ffffff",
  color: "#1F6FB2",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

function safeLocalStorage(key: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) || "";
}

function generaPiano(): Piano {
  const segmentoStudente = safeLocalStorage("segmento_studente");
  const statoIscrizione = safeLocalStorage("stato_iscrizione");
  const titoloStudio = safeLocalStorage("titolo_studio");
  const obiettivo = safeLocalStorage("obiettivo");
  const motivazioneStudio = safeLocalStorage("motivazione_studio");
  const areaInteresse = safeLocalStorage("area_interesse");
  const risultatoTipo = safeLocalStorage("profilo_utente");
  const tempoDisponibile = safeLocalStorage("tempo_disponibile");
  const urgenzaObiettivo = safeLocalStorage("urgenza_obiettivo");
  const segmentoAspetto = safeLocalStorage("segmento_aspetto");
  const aspettoDaValutare = safeLocalStorage("aspetto_da_valutare");

  const ateneoAttuale = safeLocalStorage("ateneo_attuale");
  const categoriaAteneo = safeLocalStorage("categoria_ateneo_attuale");
  const modalitaStudio = safeLocalStorage("modalita_studio");
  const corsoAttuale = safeLocalStorage("corso_attuale");
  const cfuConseguiti = safeLocalStorage("cfu_conseguiti");
  const cfuTotali = safeLocalStorage("cfu_totali");
  const esamiMancanti = safeLocalStorage("esami_mancanti");

  const isGiaIscritto = segmentoStudente === "GIA_ISCRITTO";
  const isTrasferimento = segmentoStudente === "TRASFERIMENTO";
  const isInterrotta = segmentoStudente === "UNIVERSITA_INTERROTTA";
  const isPresenza = modalitaStudio === "PRESENZA";
  const isOnline = modalitaStudio === "ONLINE";

  let puntoPartenza =
    "Hai completato una prima fase di orientamento. Il tuo profilo può essere analizzato considerando obiettivo, area di interesse, tempo disponibile e sostenibilità del percorso.";

  if (isGiaIscritto && isPresenza) {
    puntoPartenza =
      "Risulti già collegato a un percorso universitario prevalentemente in presenza. Questo dato è importante perché, prima di scegliere se proseguire, cambiare o trasferirti, conviene valutare tempi, organizzazione, CFU già acquisiti e compatibilità con il tuo obiettivo.";
  } else if (isGiaIscritto && isOnline) {
    puntoPartenza =
      "Risulti già collegato a un percorso universitario online. In questo caso è utile valutare se il percorso attuale è ancora coerente con il tuo obiettivo, con i tempi che hai a disposizione e con il supporto di cui hai bisogno.";
  } else if (isTrasferimento) {
    puntoPartenza =
      "Hai indicato una possibile situazione di trasferimento. Prima di prendere una decisione, è importante verificare il percorso già svolto, gli esami sostenuti e le alternative più coerenti con il tuo obiettivo.";
  } else if (isInterrotta) {
    puntoPartenza =
      "Hai indicato un percorso universitario iniziato in passato. In questi casi è utile non ripartire automaticamente da zero, ma verificare se parte della carriera precedente può essere valorizzata.";
  } else if (statoIscrizione) {
    puntoPartenza =
      "Il tuo profilo parte da una fase di valutazione iniziale. Prima di scegliere un percorso universitario, conviene chiarire obiettivo, modalità di studio, tempi, costi e servizi disponibili.";
  }

  const obiettivoTesto = obiettivo
    ? `Il tuo obiettivo principale sembra essere: ${obiettivo}. La scelta del percorso dovrebbe quindi tenere conto non solo dell'interesse personale, ma anche della coerenza con il risultato che vuoi raggiungere.`
    : "Non hai ancora definito un obiettivo preciso. In questa fase può essere utile confrontare più alternative e chiarire quale percorso sia più coerente con il tuo profilo.";

  const areaTesto = areaInteresse
    ? `L'area emersa dal test è: ${areaInteresse}. Questa indicazione può aiutarti a restringere il campo e a valutare percorsi coerenti con interessi, titolo di partenza e obiettivo professionale.`
    : risultatoTipo
    ? `Dal test emerge un orientamento verso il profilo ${risultatoTipo}. Questa indicazione può essere usata come primo punto di partenza, da verificare con un orientatore.`
    : "L'area consigliata non è ancora definita in modo completo. Può essere utile aggiornare il test o completare il profilo.";

  let situazioneUniversitaria =
    "Non risultano ancora dati universitari completi nel profilo. Aggiornare il profilo può rendere il piano più preciso.";

  if (ateneoAttuale || corsoAttuale) {
    situazioneUniversitaria = `Hai indicato ${
      ateneoAttuale
        ? `come ateneo attuale o precedente: ${ateneoAttuale}`
        : "un percorso universitario già avviato"
    }. ${categoriaAteneo ? `Categoria ateneo: ${categoriaAteneo}.` : ""} ${
      modalitaStudio ? `Modalità di studio: ${modalitaStudio}.` : ""
    } ${corsoAttuale ? `Corso attuale: ${corsoAttuale}.` : ""} ${
      cfuConseguiti ? `CFU conseguiti: ${cfuConseguiti}.` : ""
    } ${cfuTotali ? `CFU totali dichiarati: ${cfuTotali}.` : ""} ${
      esamiMancanti ? `Esami mancanti dichiarati: ${esamiMancanti}.` : ""
    }`;
  }

  const sostenibilita =
    tempoDisponibile || urgenzaObiettivo
      ? `Hai indicato elementi utili sulla sostenibilità del percorso. Tempo disponibile: ${
          tempoDisponibile || "non indicato"
        }. Urgenza: ${
          urgenzaObiettivo || "non indicata"
        }. Il piano dovrebbe essere costruito evitando scelte affrettate e valutando un ritmo realistico.`
      : "La sostenibilità del percorso va valutata con attenzione: tempo disponibile, metodo di studio, costi, eventuali agevolazioni e modalità d'esame possono incidere molto sulla scelta.";

  const criticita: string[] = [
    "Verificare se il percorso desiderato è davvero coerente con l'obiettivo dichiarato.",
    "Valutare tempi realistici di studio e conclusione del percorso.",
    "Chiarire costi, eventuali agevolazioni, servizi inclusi e modalità d'esame.",
  ];

  if (segmentoAspetto === "CFU_INTERESSE") {
    criticita.push(
      "Verificare eventuali CFU o esami già sostenuti, così da non ripartire automaticamente da zero."
    );
  }

  if (segmentoAspetto === "AGEVOLAZIONI_INTERESSE") {
    criticita.push(
      "Approfondire eventuali agevolazioni, convenzioni o formule più sostenibili per il tuo profilo."
    );
  }

  if (segmentoAspetto === "SUPPORTO_STUDIO_AGEVOLAZIONI") {
    criticita.push(
      "Valutare con particolare attenzione eventuali supporti allo studio, servizi dedicati o agevolazioni disponibili."
    );
  }

  if (isPresenza) {
    criticita.push(
      "Se studi in presenza, valutare se frequenza, spostamenti e organizzazione sono compatibili con la tua situazione personale o lavorativa."
    );
  }

  if (isTrasferimento || isInterrotta) {
    criticita.push(
      "Prima di cambiare o riprendere, verificare carriera pregressa, esami sostenuti e possibilità di riconoscimento."
    );
  }

  const azioni: string[] = [
    "Raccogliere i dati principali del percorso: corso, ateneo, esami, CFU e obiettivo.",
    "Confrontare il percorso attuale o desiderato con le alternative disponibili.",
    "Valutare sostenibilità economica, tempi di studio e modalità d'esame.",
    "Parlare gratuitamente con un orientatore prima di scegliere o modificare percorso.",
  ];

  if (isGiaIscritto || isTrasferimento || isInterrotta) {
    azioni.unshift(
      "Recuperare il libretto universitario aggiornato o l'elenco degli esami sostenuti."
    );
  }

  if (aspettoDaValutare) {
    azioni.push(
      `Approfondire l'aspetto indicato nel test: ${aspettoDaValutare}.`
    );
  }

  const prossimoPasso =
    "Il piano che hai generato è una prima analisi orientativa. Per scegliere con maggiore sicurezza, ti consigliamo di parlare gratuitamente con un orientatore. Potrai valutare atenei, corsi, costi, eventuali CFU riconoscibili, agevolazioni e modalità di studio in base al tuo caso specifico.";

  return {
    puntoPartenza,
    obiettivo: obiettivoTesto,
    area: areaTesto,
    situazioneUniversitaria,
    sostenibilita,
    criticita,
    azioni,
    prossimoPasso,
  };
}

function pianoToText(piano: Piano) {
  return `
PUNTO DI PARTENZA
${piano.puntoPartenza}

OBIETTIVO
${piano.obiettivo}

AREA CONSIGLIATA
${piano.area}

SITUAZIONE UNIVERSITARIA
${piano.situazioneUniversitaria}

TEMPO E SOSTENIBILITÀ
${piano.sostenibilita}

ASPETTI DA VERIFICARE
${piano.criticita.map((item) => "- " + item).join("\n")}

AZIONI CONSIGLIATE
${piano.azioni.map((item, index) => `${index + 1}. ${item}`).join("\n")}

PROSSIMO PASSO
${piano.prossimoPasso}
`;
}

export default function PianoPersonalePage() {
  const [piano, setPiano] = useState<Piano | null>(null);
  const [user, setUser] = useState<User>({});
  const [invioStato, setInvioStato] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [errore, setErrore] = useState("");

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user") ||
        localStorage.getItem("laurea_smart_user") ||
        localStorage.getItem("gps_user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const nuovoPiano = generaPiano();
      setPiano(nuovoPiano);
    } catch (error) {
      console.error("Errore generazione piano", error);
    }
  }, []);

  const pianoTesto = useMemo(() => {
    return piano ? pianoToText(piano) : "";
  }, [piano]);

  const inviaEmailPiano = async () => {
    if (!piano) return;

    const email = user.email || safeLocalStorage("user_email");

    if (!email) {
      setErrore("Email utente non trovata. Effettua l'accesso e riprova.");
      setInvioStato("error");
      return;
    }

    setInvioStato("sending");
    setErrore("");

    try {
      const response = await fetch(
        "https://laureasmart.it/api/piano-personale-crea.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_email: email,
            user_nome: user.nome || "",
            user_telefono: user.telefono || "",

            segmento_studente: safeLocalStorage("segmento_studente"),
            stato_iscrizione: safeLocalStorage("stato_iscrizione"),
            titolo_studio: safeLocalStorage("titolo_studio"),
            obiettivo: safeLocalStorage("obiettivo"),
            motivazione_studio: safeLocalStorage("motivazione_studio"),
            area_interesse: safeLocalStorage("area_interesse"),
            risultato_tipo: safeLocalStorage("profilo_utente"),
            corso_suggerito: safeLocalStorage("corso_suggerito"),
            tempo_disponibile: safeLocalStorage("tempo_disponibile"),
            urgenza_obiettivo: safeLocalStorage("urgenza_obiettivo"),

            aspetto_da_valutare: safeLocalStorage("aspetto_da_valutare"),
            segmento_aspetto: safeLocalStorage("segmento_aspetto"),

            ateneo_attuale: safeLocalStorage("ateneo_attuale"),
            categoria_ateneo_attuale: safeLocalStorage(
              "categoria_ateneo_attuale"
            ),
            modalita_ateneo_attuale: safeLocalStorage(
              "modalita_ateneo_attuale"
            ),
            modalita_studio: safeLocalStorage("modalita_studio"),

            corso_attuale: safeLocalStorage("corso_attuale"),
            area_corso_attuale: safeLocalStorage("area_corso_attuale"),
            tipo_corso_attuale: safeLocalStorage("tipo_corso_attuale"),
            anno_corso_attuale: safeLocalStorage("anno_corso_attuale"),
            cfu_conseguiti: safeLocalStorage("cfu_conseguiti"),
            cfu_totali: safeLocalStorage("cfu_totali"),
            esami_mancanti: safeLocalStorage("esami_mancanti"),
            obiettivo_post_laurea: safeLocalStorage("obiettivo_post_laurea"),

            piano_testo: pianoTesto,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Invio non riuscito");
      }

      localStorage.setItem("piano_personale_generato", "SI");
      localStorage.setItem("piano_personale_data", new Date().toISOString());

      setInvioStato("sent");
    } catch (error) {
      console.error("Errore invio piano", error);
      setErrore("Non è stato possibile inviare il piano. Riprova tra poco.");
      setInvioStato("error");
    }
  };

  if (!piano) {
    return (
      <main style={{ padding: 24 }}>
        <p>Generazione piano in corso...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "28px 18px 90px",
        background:
          "linear-gradient(180deg, #eef6ff 0%, #f8fafc 45%, #ffffff 100%)",
        color: "#0f172a",
      }}
    >
      <section style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ marginBottom: 22 }}>
          <Link href="/dashboard" style={{ color: "#1F6FB2", fontWeight: 800 }}>
            ← Torna alla dashboard
          </Link>
        </div>

        <div style={{ ...cardStyle, marginBottom: 18 }}>
          <p
            style={{
              margin: "0 0 8px",
              textTransform: "uppercase",
              fontSize: 12,
              letterSpacing: 1.4,
              color: "#1F6FB2",
              fontWeight: 900,
            }}
          >
            Laurea Smart
          </p>

          <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.15 }}>
            Piano Universitario Personalizzato
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#475569" }}>
            Una prima analisi orientativa basata sulle risposte del test e sui
            dati del tuo profilo. Il piano non sostituisce una valutazione
            ufficiale, ma ti aiuta a capire quali aspetti approfondire prima di
            scegliere.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              type="button"
              style={buttonStyle}
              onClick={inviaEmailPiano}
              disabled={invioStato === "sending" || invioStato === "sent"}
            >
              {invioStato === "sending"
                ? "Invio in corso..."
                : invioStato === "sent"
                ? "Piano creato"
                : "Crea il mio piano"}
            </button>

            <Link href="/dashboard/profilo" style={secondaryButtonStyle}>
              Aggiorna profilo
            </Link>
          </div>

          {invioStato === "sent" && (
            <p style={{ marginTop: 14, color: "#15803d", fontWeight: 800 }}>
              Piano creato correttamente. Un orientatore potrà valutare il tuo
              profilo.
            </p>
          )}

          {invioStato === "error" && (
            <p style={{ marginTop: 14, color: "#b91c1c", fontWeight: 800 }}>
              {errore}
            </p>
          )}
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>1. Punto di partenza</h2>
            <p style={{ lineHeight: 1.7, color: "#334155" }}>
              {piano.puntoPartenza}
            </p>
          </section>

          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>2. Obiettivo</h2>
            <p style={{ lineHeight: 1.7, color: "#334155" }}>
              {piano.obiettivo}
            </p>
          </section>

          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>3. Area consigliata</h2>
            <p style={{ lineHeight: 1.7, color: "#334155" }}>{piano.area}</p>
          </section>

          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>4. Situazione universitaria</h2>
            <p style={{ lineHeight: 1.7, color: "#334155" }}>
              {piano.situazioneUniversitaria}
            </p>
          </section>

          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>5. Tempo e sostenibilità</h2>
            <p style={{ lineHeight: 1.7, color: "#334155" }}>
              {piano.sostenibilita}
            </p>
          </section>

          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>6. Aspetti da verificare</h2>
            <ul style={{ lineHeight: 1.8, color: "#334155", paddingLeft: 22 }}>
              {piano.criticita.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>7. Azioni consigliate</h2>
            <ol style={{ lineHeight: 1.8, color: "#334155", paddingLeft: 22 }}>
              {piano.azioni.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>

          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>8. Prossimo passo</h2>
            <p style={{ lineHeight: 1.7, color: "#334155" }}>
              {piano.prossimoPasso}
            </p>

            <a
              href="https://wa.me/393472769291?text=Ciao%2C%20ho%20generato%20il%20mio%20Piano%20Universitario%20Personalizzato%20su%20Laurea%20Smart%20e%20vorrei%20parlare%20con%20un%20orientatore."
              target="_blank"
              rel="noreferrer"
              style={{
                ...buttonStyle,
                display: "inline-flex",
                textDecoration: "none",
                marginTop: 8,
              }}
            >
              Parla gratis con un orientatore
            </a>
          </section>

          <section
            style={{
              ...cardStyle,
              background: "#f8fafc",
              boxShadow: "none",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.6,
                color: "#64748b",
              }}
            >
              Questo piano ha valore esclusivamente orientativo. La scelta del
              percorso universitario, il riconoscimento di eventuali CFU, le
              agevolazioni, i costi e le condizioni di iscrizione devono essere
              verificati con l’ateneo o con un orientatore autorizzato.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
