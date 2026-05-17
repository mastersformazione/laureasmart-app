"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Heart,
  MessageCircle,
  Target,
  TrendingUp,
  User,
} from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";

type GpsUser = {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
};

type EsameSmart = {
  id: string;
  nome: string;
  cfu: number;
  stato: "da_preparare" | "in_corso" | "completato";
  difficolta: "bassa" | "media" | "alta";
};

const AREE_CORSO_ATTUALE = [
  { value: "", label: "Seleziona area" },
  { value: "ECONOMIA", label: "Economia, management e amministrazione" },
  { value: "PSICOLOGIA", label: "Psicologia" },
  { value: "EDUCAZIONE", label: "Educazione, formazione e scuola" },
  { value: "GIURIDICA", label: "Giuridica e servizi legali" },
  { value: "SPORT", label: "Scienze motorie e sport" },
  { value: "COMUNICAZIONE", label: "Comunicazione, marketing e media" },
  { value: "TECNOLOGIA", label: "Informatica, ingegneria e digitale" },
  { value: "UMANISTICA", label: "Lettere, filosofia, storia e beni culturali" },
  { value: "SANITARIA", label: "Area sanitaria e socio-sanitaria" },
  { value: "ALTRO", label: "Altro / non sono sicuro" },
];

const TIPI_CORSO_ATTUALE = [
  { value: "", label: "Seleziona tipo percorso" },
  { value: "laurea_triennale", label: "Laurea triennale" },
  { value: "laurea_magistrale", label: "Laurea magistrale" },
  { value: "laurea_ciclo_unico", label: "Laurea a ciclo unico" },
  { value: "master", label: "Master universitario" },
  { value: "altro", label: "Altro" },
];

const ANNI_CORSO = [
  { value: "", label: "Seleziona anno" },
  { value: "1", label: "1° anno" },
  { value: "2", label: "2° anno" },
  { value: "3", label: "3° anno" },
  { value: "4", label: "4° anno" },
  { value: "5", label: "5° anno" },
  { value: "fuori_corso", label: "Fuori corso" },
];

const OBIETTIVI_POST_LAUREA = [
  { value: "", label: "Seleziona obiettivo" },
  { value: "magistrale", label: "Proseguire con una magistrale" },
  { value: "master", label: "Fare un master" },
  { value: "concorsi", label: "Partecipare a concorsi" },
  { value: "cambio_lavoro", label: "Cambiare lavoro" },
  { value: "crescita_attuale", label: "Migliorare la posizione attuale" },
  { value: "non_so", label: "Non lo so ancora" },
];

function getSegmentoFromStato(stato: string) {
  if (stato === "Sì, sono già iscritto" || stato === "si_iscritto") {
    return "GIA_ISCRITTO";
  }

  if (
    stato === "Ho iniziato ma ho interrotto" ||
    stato === "universita_interrotta"
  ) {
    return "UNIVERSITA_INTERROTTA";
  }

  if (stato === "Sto valutando un trasferimento" || stato === "trasferimento") {
    return "TRASFERIMENTO";
  }

  return "NON_ISCRITTO";
}

function getLabel(options: { value: string; label: string }[], value: string) {
  return (
    options.find((option) => option.value === value)?.label || "Da completare"
  );
}

export default function ProfiloPage() {
  const router = useRouter();

  const [user, setUser] = useState<GpsUser | null>(null);
  const [esami, setEsami] = useState<EsameSmart[]>([]);
  const [cfuTotali, setCfuTotali] = useState(180);
  const [oreSettimanali, setOreSettimanali] = useState("6");
  const [obiettivo, setObiettivo] = useState("Percorso universitario");
  const [profilo, setProfilo] = useState("Da definire");
  const [statoIscrizione, setStatoIscrizione] = useState("Non indicato");
  const [segmentoStudente, setSegmentoStudente] = useState("NON_ISCRITTO");
  const [preferitiCount, setPreferitiCount] = useState(0);

  const [corsoAttuale, setCorsoAttuale] = useState("");
  const [areaCorsoAttuale, setAreaCorsoAttuale] = useState("");
  const [tipoCorsoAttuale, setTipoCorsoAttuale] = useState("");
  const [annoCorsoAttuale, setAnnoCorsoAttuale] = useState("");
  const [cfuConseguitiProfilo, setCfuConseguitiProfilo] = useState("");
  const [esamiMancantiProfilo, setEsamiMancantiProfilo] = useState("");
  const [obiettivoPostLaurea, setObiettivoPostLaurea] = useState("");
  const [profiloUniversitarioSalvato, setProfiloUniversitarioSalvato] =
    useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("gps_user");
    const storedEsami = localStorage.getItem("percorso_smart_esami");
    const storedCfuTotali = localStorage.getItem("percorso_smart_cfu_totali");
    const storedOre = localStorage.getItem("percorso_smart_ore_settimanali");
    const storedObiettivo = localStorage.getItem("obiettivo");
    const storedProfilo = localStorage.getItem("profilo_utente");
    const storedStatoIscrizione = localStorage.getItem("stato_iscrizione");
    const storedSegmentoStudente = localStorage.getItem("segmento_studente");
    const storedPreferiti =
      localStorage.getItem("percorsi_preferiti") ||
      localStorage.getItem("preferiti") ||
      "[]";

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setEsami(storedEsami ? JSON.parse(storedEsami) : []);
    setCfuTotali(storedCfuTotali ? Number(storedCfuTotali) : 180);
    setOreSettimanali(storedOre || "6");
    setObiettivo(storedObiettivo || "Percorso universitario");
    setProfilo(storedProfilo || "Da definire");
    setStatoIscrizione(storedStatoIscrizione || "Non indicato");

    setSegmentoStudente(
      storedSegmentoStudente ||
        (storedStatoIscrizione
          ? getSegmentoFromStato(storedStatoIscrizione)
          : "NON_ISCRITTO")
    );

    setCorsoAttuale(localStorage.getItem("corso_attuale") || "");
    setAreaCorsoAttuale(localStorage.getItem("area_corso_attuale") || "");
    setTipoCorsoAttuale(localStorage.getItem("tipo_corso_attuale") || "");
    setAnnoCorsoAttuale(localStorage.getItem("anno_corso_attuale") || "");
    setCfuConseguitiProfilo(localStorage.getItem("cfu_conseguiti") || "");
    setEsamiMancantiProfilo(localStorage.getItem("esami_mancanti") || "");
    setObiettivoPostLaurea(localStorage.getItem("obiettivo_post_laurea") || "");

    try {
      const parsed = JSON.parse(storedPreferiti);
      setPreferitiCount(Array.isArray(parsed) ? parsed.length : 0);
    } catch {
      setPreferitiCount(0);
    }
  }, []);

  const cfuDaEsami = useMemo(
    () =>
      esami
        .filter((esame) => esame.stato === "completato")
        .reduce((totale, esame) => totale + esame.cfu, 0),
    [esami]
  );

  const cfuProfiloNumero = Number(cfuConseguitiProfilo) || 0;
  const cfuCompletati = cfuDaEsami > 0 ? cfuDaEsami : cfuProfiloNumero;

  const esamiCompletati = esami.filter(
    (esame) => esame.stato === "completato"
  ).length;

  const percentuale = Math.min(
    100,
    Math.round((cfuCompletati / cfuTotali) * 100)
  );

  const prossimoEsame =
    esami.find((esame) => esame.stato === "in_corso") ||
    esami.find((esame) => esame.stato === "da_preparare");

  const oreNumero = Number(oreSettimanali) || 0;

  const cfuMancanti = Math.max(0, cfuTotali - cfuCompletati);

  const cfuMensiliStimati =
    oreNumero <= 0
      ? 0
      : oreNumero <= 3
      ? 4
      : oreNumero <= 7
      ? 8
      : oreNumero <= 12
      ? 12
      : 16;

  const mesiStimatiLaurea =
    cfuMensiliStimati > 0
      ? Math.max(1, Math.ceil(cfuMancanti / cfuMensiliStimati))
      : null;

  const dataStimataLaurea = mesiStimatiLaurea
    ? new Date(new Date().setMonth(new Date().getMonth() + mesiStimatiLaurea))
    : null;

  const dataStimataLabel = dataStimataLaurea
    ? dataStimataLaurea.toLocaleDateString("it-IT", {
        month: "long",
        year: "numeric",
      })
    : "Da calcolare";

  const nome = user?.nome?.trim() || "Studente";

  const isGiaIscritto = segmentoStudente === "GIA_ISCRITTO";
  const isTrasferimento = segmentoStudente === "TRASFERIMENTO";
  const showProfiloUniversitario = isGiaIscritto || isTrasferimento;

  const aggiornaStatoIscrizione = (nuovoStato: string) => {
    const nuovoSegmento = getSegmentoFromStato(nuovoStato);

    setStatoIscrizione(nuovoStato);
    setSegmentoStudente(nuovoSegmento);

    localStorage.setItem("stato_iscrizione", nuovoStato);
    localStorage.setItem("segmento_studente", nuovoSegmento);

    const orientamentoData = localStorage.getItem("orientamento_data");

    if (orientamentoData) {
      try {
        const parsed = JSON.parse(orientamentoData);
        localStorage.setItem(
          "orientamento_data",
          JSON.stringify({
            ...parsed,
            stato_iscrizione: nuovoStato,
            segmento_studente: nuovoSegmento,
          })
        );
      } catch {
        console.log("Impossibile aggiornare orientamento_data");
      }
    }
  };

  const salvaProfiloUniversitario = () => {
    localStorage.setItem("corso_attuale", corsoAttuale.trim());
    localStorage.setItem("area_corso_attuale", areaCorsoAttuale);
    localStorage.setItem("tipo_corso_attuale", tipoCorsoAttuale);
    localStorage.setItem("anno_corso_attuale", annoCorsoAttuale);
    localStorage.setItem("cfu_conseguiti", cfuConseguitiProfilo);
    localStorage.setItem("esami_mancanti", esamiMancantiProfilo);
    localStorage.setItem("obiettivo_post_laurea", obiettivoPostLaurea);

    const cfuDefault =
      tipoCorsoAttuale === "laurea_ciclo_unico"
        ? 300
        : tipoCorsoAttuale === "laurea_magistrale"
        ? 120
        : tipoCorsoAttuale === "master"
        ? 60
        : 180;

    localStorage.setItem("percorso_smart_cfu_totali", String(cfuDefault));
    setCfuTotali(cfuDefault);
    setProfiloUniversitarioSalvato(true);

    window.setTimeout(() => {
      setProfiloUniversitarioSalvato(false);
    }, 2600);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "22px 18px 120px",
        maxWidth: 500,
        margin: "0 auto",
        color: "#FFFFFF",
        background:
          "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
      }}
    >
      <section style={heroStyle}>
        <div style={heroIconStyle}>
          <User size={30} />
        </div>

        <p style={eyebrowStyle}>Profilo personale</p>

        <h1 style={heroTitleStyle}>Ciao {nome} 👋</h1>

        <p style={heroTextStyle}>
          Da qui puoi seguire il tuo percorso, controllare i progressi e
          continuare a costruire la strada verso la laurea.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <MetricCard
          icon={<TrendingUp size={22} />}
          title={`${percentuale}%`}
          description="Avanzamento"
        />

        <MetricCard
          icon={<BookOpen size={22} />}
          title={`${cfuCompletati}/${cfuTotali}`}
          description="CFU"
        />

        <MetricCard
          icon={<CheckCircle2 size={22} />}
          title={`${esamiCompletati}/${esami.length}`}
          description="Esami"
        />

        <MetricCard
          icon={<Heart size={22} />}
          title={`${preferitiCount}`}
          description="Preferiti"
        />
      </section>

      {showProfiloUniversitario && (
        <>
          <DarkCard
            title="Il tuo percorso universitario attuale"
            badge={isTrasferimento ? "Trasferimento" : "Percorso"}
          >
            <p style={mutedTextStyle}>
              Completa questi dati per rendere Percorso Smart più utile. La
              priorità è l’area del tuo percorso, perché ci permette di
              mostrarti suggerimenti coerenti senza chiederti subito un piano di
              studi completo.
            </p>

            <div style={formGridStyle}>
              <FieldLabel label="Area del tuo corso attuale">
                <select
                  value={areaCorsoAttuale}
                  onChange={(event) => setAreaCorsoAttuale(event.target.value)}
                  style={inputStyle}
                >
                  {AREE_CORSO_ATTUALE.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldLabel>

              <FieldLabel label="Tipo di percorso">
                <select
                  value={tipoCorsoAttuale}
                  onChange={(event) => setTipoCorsoAttuale(event.target.value)}
                  style={inputStyle}
                >
                  {TIPI_CORSO_ATTUALE.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldLabel>

              <FieldLabel label="Anno di corso">
                <select
                  value={annoCorsoAttuale}
                  onChange={(event) => setAnnoCorsoAttuale(event.target.value)}
                  style={inputStyle}
                >
                  {ANNI_CORSO.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldLabel>

              <FieldLabel label="CFU già conseguiti">
                <input
                  type="number"
                  min="0"
                  max="300"
                  inputMode="numeric"
                  value={cfuConseguitiProfilo}
                  onChange={(event) =>
                    setCfuConseguitiProfilo(event.target.value)
                  }
                  placeholder="Esempio: 72"
                  style={inputStyle}
                />
              </FieldLabel>

              <FieldLabel label="Esami mancanti">
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={esamiMancantiProfilo}
                  onChange={(event) =>
                    setEsamiMancantiProfilo(event.target.value)
                  }
                  placeholder="Esempio: 8"
                  style={inputStyle}
                />
              </FieldLabel>

              <FieldLabel label="Obiettivo dopo la laurea">
                <select
                  value={obiettivoPostLaurea}
                  onChange={(event) =>
                    setObiettivoPostLaurea(event.target.value)
                  }
                  style={inputStyle}
                >
                  {OBIETTIVI_POST_LAUREA.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldLabel>

              <FieldLabel label="Nome del corso, facoltativo">
                <input
                  type="text"
                  value={corsoAttuale}
                  onChange={(event) => setCorsoAttuale(event.target.value)}
                  placeholder="Esempio: Scienze dell’Educazione"
                  style={inputStyle}
                />
              </FieldLabel>
            </div>

            <div style={summaryBoxStyle}>
              <p style={smallLabelStyle}>Profilo rilevato</p>
              <h3 style={{ ...metricTitleStyle, marginTop: 6 }}>
                {areaCorsoAttuale
                  ? getLabel(AREE_CORSO_ATTUALE, areaCorsoAttuale)
                  : "Area ancora da indicare"}
              </h3>
              <p style={mutedTextStyle}>
                {tipoCorsoAttuale
                  ? `${getLabel(
                      TIPI_CORSO_ATTUALE,
                      tipoCorsoAttuale
                    )} · ${getLabel(ANNI_CORSO, annoCorsoAttuale)}`
                  : "Questi dati serviranno a personalizzare Percorso Smart e i prossimi step."}
              </p>
            </div>

            <button
              type="button"
              onClick={salvaProfiloUniversitario}
              style={primaryButtonStyle}
            >
              {profiloUniversitarioSalvato
                ? "Percorso salvato"
                : "Salva percorso universitario"}
              <ArrowRight size={19} />
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/percorso-smart")}
              style={secondaryButtonStyle}
            >
              Apri Percorso Smart
              <ArrowRight size={18} />
            </button>
          </DarkCard>

          <div style={{ height: 14 }} />
        </>
      )}

      <DarkCard
        title="Percorso Smart"
        badge={showProfiloUniversitario ? "Attivo" : "Simulazione"}
      >
        <div style={progressTrackStyle}>
          <div
            style={{
              width: `${percentuale}%`,
              height: "100%",
              borderRadius: 999,
              background: "linear-gradient(90deg, #3AA0FF, #78C2FF)",
            }}
          />
        </div>

        <p style={mutedTextStyle}>
          {esami.length === 0
            ? showProfiloUniversitario
              ? "Inserisci esami e obiettivi per trasformare il profilo in un piano di studio concreto."
              : "Non hai ancora inserito esami. Puoi usare Percorso Smart come simulazione per capire tempi e impegno."
            : prossimoEsame
            ? `Prossimo esame: ${prossimoEsame.nome}`
            : "Hai completato tutti gli esami inseriti. Ottimo lavoro."}
        </p>

        <button
          type="button"
          onClick={() => router.push("/dashboard/percorso-smart")}
          style={primaryButtonStyle}
        >
          {showProfiloUniversitario
            ? "Apri Percorso Smart"
            : "Simula Percorso Smart"}
          <ArrowRight size={19} />
        </button>
      </DarkCard>

      <div style={{ height: 14 }} />

      <DarkCard
        title="Timeline laurea"
        badge={showProfiloUniversitario ? "Proiezione" : "Simulazione"}
      >
        <div style={timelineBoxStyle}>
          <div style={smallIconStyle}>
            <CalendarDays size={24} />
          </div>

          <p style={smallLabelStyle}>Possibile traguardo</p>

          <h2 style={bigValueStyle}>{dataStimataLabel}</h2>

          <p style={mutedTextStyle}>
            {mesiStimatiLaurea
              ? `Con il ritmo attuale potresti completare il percorso in circa ${mesiStimatiLaurea} mesi.`
              : showProfiloUniversitario
              ? "Aggiungi CFU conseguiti, ore di studio ed esami nel Percorso Smart per ottenere una stima."
              : "Aggiungi ore di studio ed esami nel Percorso Smart per ottenere una simulazione."}
          </p>
        </div>
      </DarkCard>

      <div style={{ height: 14 }} />

      <DarkCard title="Stato percorso" badge="Segmento">
        <InfoRow
          icon={<GraduationCap size={20} />}
          title={statoIscrizione}
          description="Questa scelta serve a mostrarti le funzioni più adatte: Percorso Smart se sei già iscritto, orientamento e scelta corso se devi ancora iscriverti."
        />

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          {[
            "Sì, sono già iscritto",
            "No, non sono ancora iscritto",
            "Ho iniziato ma ho interrotto",
            "Sto valutando un trasferimento",
          ].map((opzione) => {
            const active = statoIscrizione === opzione;

            return (
              <button
                key={opzione}
                type="button"
                onClick={() => aggiornaStatoIscrizione(opzione)}
                style={{
                  width: "100%",
                  minHeight: 48,
                  borderRadius: 17,
                  border: active
                    ? "1px solid rgba(120,194,255,0.75)"
                    : "1px solid rgba(255,255,255,0.10)",
                  background: active
                    ? "rgba(58,160,255,0.20)"
                    : "rgba(255,255,255,0.06)",
                  color: "#FFFFFF",
                  padding: "12px 14px",
                  textAlign: "left",
                  fontSize: 14,
                  fontWeight: 850,
                  cursor: "pointer",
                }}
              >
                {opzione}
              </button>
            );
          })}
        </div>
      </DarkCard>

      <div style={{ height: 14 }} />

      <DarkCard title="Il tuo obiettivo" badge="Profilo">
        <InfoRow
          icon={<Target size={20} />}
          title={obiettivo}
          description={`Profilo orientativo: ${profilo}`}
        />

        <button
          type="button"
          onClick={() => router.push("/dashboard/orientamento/test")}
          style={secondaryButtonStyle}
        >
          Aggiorna orientamento
          <ArrowRight size={18} />
        </button>
      </DarkCard>

      <div style={{ height: 14 }} />

      <DarkCard title="Strumenti utili" badge="App">
        <InfoRow
          icon={<GraduationCap size={20} />}
          title={
            showProfiloUniversitario
              ? "Percorsi e prossimi step"
              : "Percorsi salvati"
          }
          description={
            showProfiloUniversitario
              ? "In base all’area del tuo percorso potremo mostrarti in seguito magistrali, master o alternative coerenti."
              : "Consulta i corsi che hai messo tra i preferiti e confrontali con il tuo obiettivo."
          }
        />

        <button
          type="button"
          onClick={() => router.push("/dashboard/percorsi")}
          style={secondaryButtonStyle}
        >
          {showProfiloUniversitario
            ? "Valuta prossimi step"
            : "Vai ai percorsi"}
          <ArrowRight size={18} />
        </button>
      </DarkCard>

      {!isGiaIscritto && (
        <>
          <div style={{ height: 14 }} />

          <DarkCard
            title={
              isTrasferimento
                ? "Vuoi valutare un trasferimento?"
                : "Hai bisogno di supporto?"
            }
            badge={isTrasferimento ? "CFU" : "Gratis"}
          >
            <InfoRow
              icon={<MessageCircle size={20} />}
              title={
                isTrasferimento
                  ? "Verifica esami e CFU"
                  : "Parla con un orientatore"
              }
              description={
                isTrasferimento
                  ? "Se stai valutando un cambio corso o ateneo, puoi chiedere una verifica del percorso e degli esami già sostenuti."
                  : "Se hai dubbi su scelta del corso, obiettivi o iscrizione, puoi chiedere supporto gratuito."
              }
            />

            <button
              type="button"
              onClick={() => router.push("/dashboard/contatti")}
              style={whatsappButtonStyle}
            >
              {isTrasferimento
                ? "Richiedi valutazione"
                : "Contatta un orientatore"}
              <ArrowRight size={18} />
            </button>
          </DarkCard>
        </>
      )}

      <BottomNav />
    </main>
  );
}

function MetricCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <section style={metricCardStyle}>
      <div style={metricIconStyle}>{icon}</div>
      <h3 style={metricTitleStyle}>{title}</h3>
      <p style={metricTextStyle}>{description}</p>
    </section>
  );
}

function DarkCard({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children?: ReactNode;
}) {
  return (
    <section style={darkCardStyle}>
      <div style={cardHeaderStyle}>
        <h2 style={cardTitleStyle}>{title}</h2>
        {badge && <span style={badgeStyle}>{badge}</span>}
      </div>
      {children}
    </section>
  );
}

function InfoRow({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
      <div style={smallIconStyle}>{icon}</div>

      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>{title}</h3>
        <p style={mutedTextStyle}>{description}</p>
      </div>
    </div>
  );
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label style={fieldLabelStyle}>
      <span>{label}</span>
      {children}
    </label>
  );
}

const heroStyle: React.CSSProperties = {
  padding: 24,
  borderRadius: 32,
  background: "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 52%, #155487 100%)",
  boxShadow: "0 24px 60px rgba(0,0,0,0.36)",
  marginBottom: 18,
  border: "1px solid rgba(255,255,255,0.14)",
};

const heroIconStyle: React.CSSProperties = {
  width: 58,
  height: 58,
  borderRadius: 22,
  background: "rgba(255,255,255,0.16)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 16,
};

const eyebrowStyle: React.CSSProperties = {
  margin: "0 0 8px",
  fontSize: 14,
  fontWeight: 850,
};

const heroTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 33,
  lineHeight: 1.06,
  fontWeight: 900,
  letterSpacing: "-0.8px",
};

const heroTextStyle: React.CSSProperties = {
  margin: "14px 0 0",
  fontSize: 15,
  lineHeight: 1.6,
  opacity: 0.94,
};

const darkCardStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 26,
  background: "rgba(17,32,51,0.86)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 19,
  lineHeight: 1.2,
  fontWeight: 900,
};

const badgeStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(58,160,255,0.16)",
  color: "#78C2FF",
  fontSize: 11,
  fontWeight: 900,
  whiteSpace: "nowrap",
};

const metricCardStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 22,
  background: "rgba(17,32,51,0.86)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
};

const metricIconStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 16,
  background: "rgba(58,160,255,0.16)",
  color: "#78C2FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 10,
};

const metricTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 20,
  lineHeight: 1.1,
  fontWeight: 900,
};

const metricTextStyle: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: 12,
  lineHeight: 1.45,
  color: "rgba(255,255,255,0.62)",
};

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
  marginTop: 16,
};

const fieldLabelStyle: React.CSSProperties = {
  display: "grid",
  gap: 7,
  color: "rgba(255,255,255,0.78)",
  fontSize: 12,
  fontWeight: 900,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.08)",
  color: "#FFFFFF",
  padding: "0 12px",
  fontSize: 14,
  fontWeight: 800,
  outline: "none",
};

const summaryBoxStyle: React.CSSProperties = {
  marginTop: 16,
  padding: 14,
  borderRadius: 20,
  background: "rgba(58,160,255,0.12)",
  border: "1px solid rgba(120,194,255,0.16)",
};

const progressTrackStyle: React.CSSProperties = {
  height: 12,
  borderRadius: 999,
  background: "rgba(255,255,255,0.08)",
  overflow: "hidden",
  margin: "16px 0 12px",
};

const mutedTextStyle: React.CSSProperties = {
  margin: "7px 0 0",
  fontSize: 13,
  lineHeight: 1.5,
  color: "rgba(255,255,255,0.68)",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 56,
  borderRadius: 20,
  border: "none",
  background: "#3AA0FF",
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: 900,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  marginTop: 14,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 52,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.08)",
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: 850,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  marginTop: 14,
  cursor: "pointer",
};

const whatsappButtonStyle: React.CSSProperties = {
  ...secondaryButtonStyle,
  background: "#25D366",
  border: "none",
};

const timelineBoxStyle: React.CSSProperties = {
  marginTop: 14,
  padding: 16,
  borderRadius: 22,
  background:
    "linear-gradient(135deg, rgba(58,160,255,0.18) 0%, rgba(120,194,255,0.08) 100%)",
  border: "1px solid rgba(120,194,255,0.16)",
};

const smallIconStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 16,
  background: "rgba(58,160,255,0.16)",
  color: "#78C2FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const smallLabelStyle: React.CSSProperties = {
  margin: "12px 0 0",
  fontSize: 13,
  color: "rgba(255,255,255,0.68)",
  fontWeight: 800,
};

const bigValueStyle: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: 25,
  lineHeight: 1.1,
  fontWeight: 950,
  textTransform: "capitalize",
};
