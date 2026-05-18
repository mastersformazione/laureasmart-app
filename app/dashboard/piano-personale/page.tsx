"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  GraduationCap,
  ListChecks,
  Loader2,
  MessageCircle,
  Target,
  UserRound,
} from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";

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

type InvioStato = "idle" | "sending" | "sent" | "error";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "22px 18px 120px",
  maxWidth: 500,
  margin: "0 auto",
  color: "#FFFFFF",
  background:
    "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
  fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
};

const heroStyle: CSSProperties = {
  borderRadius: 32,
  padding: "26px 20px",
  marginBottom: 16,
  border: "1px solid rgba(255,255,255,0.12)",
  background:
    "linear-gradient(145deg, rgba(31,111,178,0.32), rgba(255,255,255,0.07))",
  boxShadow: "0 24px 65px rgba(0,0,0,0.32)",
};

const heroIconStyle: CSSProperties = {
  width: 58,
  height: 58,
  borderRadius: 22,
  background: "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 14,
  boxShadow: "0 18px 38px rgba(31,111,178,0.36)",
};

const eyebrowStyle: CSSProperties = {
  margin: "0 0 8px",
  textTransform: "uppercase",
  fontSize: 11,
  letterSpacing: 1.5,
  color: "rgba(255,255,255,0.66)",
  fontWeight: 900,
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 29,
  lineHeight: 1.1,
  letterSpacing: -0.8,
};

const heroTextStyle: CSSProperties = {
  margin: "12px 0 0",
  color: "rgba(255,255,255,0.76)",
  fontSize: 14,
  lineHeight: 1.65,
};

const cardStyle: CSSProperties = {
  borderRadius: 28,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.08)",
  boxShadow: "0 22px 55px rgba(0,0,0,0.24)",
  padding: 18,
};

const compactCardStyle: CSSProperties = {
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,0.11)",
  background: "rgba(255,255,255,0.07)",
  padding: 16,
};

const primaryButtonStyle: CSSProperties = {
  minHeight: 52,
  borderRadius: 18,
  border: "none",
  background: "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 100%)",
  color: "white",
  fontSize: 14,
  fontWeight: 900,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "0 16px",
  cursor: "pointer",
  textDecoration: "none",
};

const secondaryButtonStyle: CSSProperties = {
  minHeight: 48,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  fontSize: 13,
  fontWeight: 850,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  padding: "0 14px",
  cursor: "pointer",
  textDecoration: "none",
};

const mutedTextStyle: CSSProperties = {
  margin: 0,
  color: "rgba(255,255,255,0.72)",
  fontSize: 13,
  lineHeight: 1.6,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 17,
  letterSpacing: -0.2,
};

function safeLocalStorage(key: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) || "";
}

function getUserFromStorage(): User {
  if (typeof window === "undefined") return {};

  const keys = ["gps_user", "user", "laurea_smart_user"];

  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      return JSON.parse(raw) as User;
    } catch {
      continue;
    }
  }

  return {};
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
    ? `Il tuo obiettivo principale sembra essere: ${obiettivo}. ${
        titoloStudio
          ? `Parti da un titolo di studio dichiarato: ${titoloStudio}. `
          : ""
      }${
        motivazioneStudio
          ? `La motivazione che hai indicato è: ${motivazioneStudio}. `
          : ""
      }Per questo motivo, la scelta del percorso non dovrebbe basarsi solo sul nome del corso, ma anche sulla coerenza con il risultato che vuoi raggiungere, sui tempi che hai a disposizione e sulle opportunità che vuoi costruire.`
    : `Non hai ancora definito un obiettivo preciso. ${
        titoloStudio
          ? `Parti comunque da un titolo di studio dichiarato: ${titoloStudio}. `
          : ""
      }In questa fase può essere utile confrontare più alternative e chiarire quale percorso sia più coerente con il tuo profilo, prima di prendere una decisione definitiva.`;

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
    "Il piano che hai generato è una prima analisi orientativa. Il passaggio successivo è confrontarlo con un orientatore, così da valutare con maggiore precisione quale percorso, ateneo e modalità di studio siano più adatti al tuo caso. In questa fase possono essere approfonditi anche costi, eventuali CFU riconoscibili, agevolazioni, tempi di conclusione e servizi disponibili.";

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

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={cardStyle}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div
          style={{
            width: 42,
            height: 42,
            minWidth: 42,
            borderRadius: 16,
            background: "rgba(31,111,178,0.18)",
            color: "#7CC4FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={sectionTitleStyle}>{title}</h2>
          <div style={{ marginTop: 10 }}>{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function PianoPersonalePage() {
  const [piano, setPiano] = useState<Piano | null>(null);
  const [user, setUser] = useState<User>({});
  const [invioStato, setInvioStato] = useState<InvioStato>("idle");
  const [errore, setErrore] = useState("");

  useEffect(() => {
    const storedUser = getUserFromStorage();
    setUser(storedUser);
    setPiano(generaPiano());
  }, []);

  const pianoTesto = useMemo(() => (piano ? pianoToText(piano) : ""), [piano]);

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
      <main style={pageStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Loader2 size={18} />
            <p style={mutedTextStyle}>Generazione piano in corso...</p>
          </div>
        </section>
        <BottomNav />
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={{ marginBottom: 16 }}>
        <Link
          href="/dashboard"
          style={{
            color: "rgba(255,255,255,0.82)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontSize: 13,
            fontWeight: 850,
          }}
        >
          <ArrowLeft size={16} />
          Dashboard
        </Link>
      </div>

      <section style={heroStyle}>
        <div style={heroIconStyle}>
          <ClipboardCheck size={30} />
        </div>

        <p style={eyebrowStyle}>Laurea Smart</p>

        <h1 style={heroTitleStyle}>Piano Universitario Personalizzato</h1>

        <p style={heroTextStyle}>
          Abbiamo raccolto le informazioni principali del tuo profilo e le
          abbiamo trasformate in una prima analisi orientativa. Il piano ti
          aiuta a capire da dove parti, quali aspetti valutare con attenzione e
          quale potrebbe essere il prossimo passo più utile.
        </p>

        <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
          <button
            type="button"
            style={{
              ...primaryButtonStyle,
              opacity:
                invioStato === "sending" || invioStato === "sent" ? 0.72 : 1,
            }}
            onClick={inviaEmailPiano}
            disabled={invioStato === "sending" || invioStato === "sent"}
          >
            {invioStato === "sending" ? (
              <Loader2 size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            {invioStato === "sending"
              ? "Invio in corso..."
              : invioStato === "sent"
              ? "Piano inviato"
              : "Conferma e invia il piano"}
          </button>

          <Link href="/dashboard/profilo" style={secondaryButtonStyle}>
            <UserRound size={17} />
            Aggiorna profilo
          </Link>
        </div>

        {invioStato === "sent" && (
          <div
            style={{
              marginTop: 14,
              borderRadius: 18,
              padding: 12,
              background: "rgba(34,197,94,0.14)",
              border: "1px solid rgba(34,197,94,0.25)",
            }}
          >
            <p style={{ ...mutedTextStyle, color: "#BBF7D0", fontWeight: 850 }}>
              Piano inviato correttamente. Un orientatore potrà leggere il tuo
              profilo e valutare con maggiore attenzione il percorso più adatto.
            </p>
          </div>
        )}

        {invioStato === "error" && (
          <div
            style={{
              marginTop: 14,
              borderRadius: 18,
              padding: 12,
              background: "rgba(239,68,68,0.14)",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            <p style={{ ...mutedTextStyle, color: "#FECACA", fontWeight: 850 }}>
              {errore}
            </p>
          </div>
        )}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div style={compactCardStyle}>
          <Target size={22} color="#7CC4FF" />
          <p
            style={{
              margin: "10px 0 4px",
              fontSize: 12,
              color: "rgba(255,255,255,0.62)",
            }}
          >
            Obiettivo
          </p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 900 }}>
            {safeLocalStorage("obiettivo") || "Da definire"}
          </p>
        </div>

        <div style={compactCardStyle}>
          <GraduationCap size={22} color="#7CC4FF" />
          <p
            style={{
              margin: "10px 0 4px",
              fontSize: 12,
              color: "rgba(255,255,255,0.62)",
            }}
          >
            Modalità
          </p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 900 }}>
            {safeLocalStorage("modalita_studio") || "Da indicare"}
          </p>
        </div>
      </section>

      <div style={{ display: "grid", gap: 14 }}>
        <InfoCard icon={<UserRound size={21} />} title="1. Punto di partenza">
          <p style={mutedTextStyle}>{piano.puntoPartenza}</p>
        </InfoCard>

        <InfoCard icon={<Target size={21} />} title="2. Obiettivo">
          <p style={mutedTextStyle}>{piano.obiettivo}</p>
        </InfoCard>

        <InfoCard icon={<BookOpen size={21} />} title="3. Area consigliata">
          <p style={mutedTextStyle}>{piano.area}</p>
        </InfoCard>

        <InfoCard
          icon={<Building2 size={21} />}
          title="4. Situazione universitaria"
        >
          <p style={mutedTextStyle}>{piano.situazioneUniversitaria}</p>
        </InfoCard>

        <InfoCard icon={<Clock size={21} />} title="5. Tempo e sostenibilità">
          <p style={mutedTextStyle}>{piano.sostenibilita}</p>
        </InfoCard>

        <InfoCard
          icon={<AlertTriangle size={21} />}
          title="6. Aspetti da verificare"
        >
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              color: "rgba(255,255,255,0.74)",
              lineHeight: 1.7,
              fontSize: 13,
            }}
          >
            {piano.criticita.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard icon={<ListChecks size={21} />} title="7. Azioni consigliate">
          <ol
            style={{
              margin: 0,
              paddingLeft: 18,
              color: "rgba(255,255,255,0.74)",
              lineHeight: 1.7,
              fontSize: 13,
            }}
          >
            {piano.azioni.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </InfoCard>

        <InfoCard icon={<MessageCircle size={21} />} title="8. Prossimo passo">
          <p style={mutedTextStyle}>{piano.prossimoPasso}</p>

          <a
            href="https://wa.me/393472769291?text=Ciao%2C%20ho%20generato%20il%20mio%20Piano%20Universitario%20Personalizzato%20su%20Laurea%20Smart%20e%20vorrei%20parlare%20con%20un%20orientatore."
            target="_blank"
            rel="noreferrer"
            style={{ ...primaryButtonStyle, marginTop: 14, width: "100%" }}
          >
            <MessageCircle size={18} />
            Parla gratis con un orientatore
          </a>
        </InfoCard>

        <section
          style={{
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            padding: 14,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.56)",
            }}
          >
            Questo piano ha valore esclusivamente orientativo. La scelta del
            percorso universitario, il riconoscimento di eventuali CFU, le
            agevolazioni, i costi e le condizioni di iscrizione devono essere
            verificati con l’ateneo o con un orientatore autorizzato.
          </p>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
