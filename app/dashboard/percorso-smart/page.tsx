"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  Plus,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
// import { trackEvent } from "@/lib/trackEvent";

const trackEvent = async (eventData: unknown) => {
  void eventData;
};

type TipoPercorso = "triennale" | "magistrale" | "ciclo_unico";

type EsameSmart = {
  id: string;
  nome: string;
  cfu: number;
  stato: "da_preparare" | "in_corso" | "completato";
  difficolta: "bassa" | "media" | "alta";
};

const STORAGE_ESAMI = "percorso_smart_esami";
const STORAGE_CFU_TOTALI = "percorso_smart_cfu_totali";
const STORAGE_OBIETTIVO = "percorso_smart_obiettivo";
const STORAGE_TIPO_PERCORSO = "percorso_smart_tipo_percorso";
const STORAGE_ORE_SETTIMANALI = "percorso_smart_ore_settimanali";
const STORAGE_GIORNI_STUDIO = "percorso_smart_giorni_studio";

export default function PercorsoSmartPage() {
  const [isReady, setIsReady] = useState(false);
  const [esami, setEsami] = useState<EsameSmart[]>([]);
  const [cfuTotali, setCfuTotali] = useState(180);
  const [tipoPercorso, setTipoPercorso] = useState<TipoPercorso>("triennale");
  const [obiettivo, setObiettivo] = useState(
    "Laurearti con un piano sostenibile"
  );
  const [showForm, setShowForm] = useState(false);

  const [nomeEsame, setNomeEsame] = useState("");
  const [cfuEsame, setCfuEsame] = useState("6");
  const [difficolta, setDifficolta] =
    useState<EsameSmart["difficolta"]>("media");

  const [oreSettimanali, setOreSettimanali] = useState("6");
  const [giorniStudio, setGiorniStudio] = useState("3");

  useEffect(() => {
    const savedEsami = localStorage.getItem(STORAGE_ESAMI);
    const savedCfuTotali = localStorage.getItem(STORAGE_CFU_TOTALI);
    const savedObiettivo = localStorage.getItem(STORAGE_OBIETTIVO);
    const savedTipoPercorso = localStorage.getItem(
      STORAGE_TIPO_PERCORSO
    ) as TipoPercorso | null;
    const savedOreSettimanali = localStorage.getItem(STORAGE_ORE_SETTIMANALI);
    const savedGiorniStudio = localStorage.getItem(STORAGE_GIORNI_STUDIO);

    setEsami(savedEsami ? JSON.parse(savedEsami) : []);
    setCfuTotali(savedCfuTotali ? Number(savedCfuTotali) : 180);
    setObiettivo(savedObiettivo || "Laurearti con un piano sostenibile");
    setOreSettimanali(savedOreSettimanali || "6");
    setGiorniStudio(savedGiorniStudio || "3");

    if (savedTipoPercorso) {
      setTipoPercorso(savedTipoPercorso);
    }

    setIsReady(true);

    void trackEvent({
      event_name: "percorso_smart_view",
      event_category: "retention",
      metadata: { page: "percorso_smart" },
    });
  }, []);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem(STORAGE_ESAMI, JSON.stringify(esami));
  }, [esami, isReady]);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem(STORAGE_ORE_SETTIMANALI, oreSettimanali);
    localStorage.setItem(STORAGE_GIORNI_STUDIO, giorniStudio);
  }, [oreSettimanali, giorniStudio, isReady]);

  const cfuCompletati = useMemo(
    () =>
      esami
        .filter((esame) => esame.stato === "completato")
        .reduce((totale, esame) => totale + esame.cfu, 0),
    [esami]
  );

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
  const giorniNumero = Math.max(1, Number(giorniStudio) || 1);

  const caricoStudio =
    oreNumero <= 0
      ? "Da impostare"
      : oreNumero <= 3
      ? "Graduale"
      : oreNumero <= 7
      ? "Sostenibile"
      : oreNumero <= 12
      ? "Buono"
      : "Intenso";

  const orePerGiorno =
    oreNumero > 0 ? Math.round((oreNumero / giorniNumero) * 10) / 10 : 0;

  const moltiplicatoreDifficolta =
    prossimoEsame?.difficolta === "bassa"
      ? 1.2
      : prossimoEsame?.difficolta === "alta"
      ? 2.3
      : 1.7;

  const oreStimateProssimoEsame = prossimoEsame
    ? Math.max(6, Math.round(prossimoEsame.cfu * moltiplicatoreDifficolta))
    : 0;

  const settimaneStimateProssimoEsame =
    oreNumero > 0 && prossimoEsame
      ? Math.max(1, Math.ceil(oreStimateProssimoEsame / oreNumero))
      : null;

  const messaggioRitmo =
    oreNumero <= 0
      ? "Inserisci le ore disponibili per costruire una previsione realistica."
      : oreNumero <= 3
      ? "Ritmo graduale: puoi procedere senza pressione, scegliendo pochi obiettivi alla volta."
      : oreNumero <= 7
      ? "Ritmo sostenibile: hai una base concreta per avanzare con regolarità."
      : oreNumero <= 12
      ? "Ottimo ritmo: puoi programmare un avanzamento costante e motivante."
      : "Ritmo intenso: puoi accelerare molto, mantenendo però attenzione al recupero.";

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

  const messaggioTimeline =
    cfuMancanti <= 0
      ? "Hai completato tutti i CFU previsti. Risultato straordinario."
      : oreNumero <= 0
      ? "Imposta il tuo ritmo di studio per vedere una proiezione del percorso."
      : cfuMancanti <= 30
      ? "Sei nella fase finale: ogni esame adesso avvicina moltissimo il traguardo."
      : percentuale >= 50
      ? "Hai già superato una parte importante del percorso. La laurea è molto più vicina di quanto sembri."
      : "Anche un ritmo costante e sostenibile può portarti molto lontano, un esame alla volta.";

  const aggiornaTipoPercorso = (value: TipoPercorso) => {
    const nuoviCfu =
      value === "triennale" ? 180 : value === "magistrale" ? 120 : 300;

    setTipoPercorso(value);
    setCfuTotali(nuoviCfu);

    localStorage.setItem(STORAGE_TIPO_PERCORSO, value);
    localStorage.setItem(STORAGE_CFU_TOTALI, String(nuoviCfu));

    void trackEvent({
      event_name: "percorso_smart_tipo_percorso",
      event_category: "percorso_smart",
      metadata: { tipo_percorso: value, cfu_totali: nuoviCfu },
    });
  };

  const aggiungiEsame = () => {
    const nomePulito = nomeEsame.trim();
    const cfuNumero = Number(cfuEsame);

    if (!nomePulito || !cfuNumero || cfuNumero <= 0) {
      alert("Inserisci nome esame e CFU validi.");
      return;
    }

    const nuovoEsame: EsameSmart = {
      id: `${Date.now()}`,
      nome: nomePulito,
      cfu: cfuNumero,
      stato: "da_preparare",
      difficolta,
    };

    setEsami((prev) => [...prev, nuovoEsame]);
    setNomeEsame("");
    setCfuEsame("6");
    setDifficolta("media");
    setShowForm(false);

    void trackEvent({
      event_name: "esame_aggiunto",
      event_category: "percorso_smart",
      metadata: {
        nome_esame: nuovoEsame.nome,
        cfu: nuovoEsame.cfu,
        difficolta: nuovoEsame.difficolta,
      },
    });
  };

  const aggiornaStatoEsame = (id: string, nuovoStato: EsameSmart["stato"]) => {
    const esame = esami.find((item) => item.id === id);

    setEsami((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stato: nuovoStato } : item
      )
    );

    if (nuovoStato === "completato") {
      void trackEvent({
        event_name: "esame_completato",
        event_category: "percorso_smart",
        metadata: {
          nome_esame: esame?.nome || "",
          cfu: esame?.cfu || 0,
        },
      });
    }
  };

  const eliminaEsame = (id: string) => {
    const esame = esami.find((item) => item.id === id);

    const conferma = window.confirm(
      `Vuoi eliminare l’esame "${esame?.nome || "selezionato"}"?`
    );

    if (!conferma) return;

    setEsami((prev) => prev.filter((item) => item.id !== id));

    void trackEvent({
      event_name: "esame_eliminato",
      event_category: "percorso_smart",
      metadata: {
        nome_esame: esame?.nome || "",
        cfu: esame?.cfu || 0,
      },
    });
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
          <GraduationCap size={30} />
        </div>

        <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 850 }}>
          Percorso Smart
        </p>

        <h1 style={heroTitleStyle}>
          Organizza il tuo percorso fino alla laurea
        </h1>

        <p style={heroTextStyle}>
          Tieni traccia di CFU, esami e ritmo di studio. L’obiettivo è costruire
          un piano realistico, sostenibile e motivante.
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
          description="CFU completati"
        />
        <MetricCard
          icon={<CheckCircle2 size={22} />}
          title={`${esamiCompletati}/${esami.length}`}
          description="Esami conclusi"
        />
        <MetricCard
          icon={<Target size={22} />}
          title="Obiettivo"
          description={obiettivo}
        />
      </section>

      <section style={progressCardStyle}>
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

        <p style={progressTextStyle}>
          {percentuale === 0
            ? "Inizia scegliendo il tipo di percorso e aggiungendo gli esami del tuo piano di studi."
            : percentuale < 50
            ? "Stai costruendo le basi del tuo percorso. Procedi con un ritmo sostenibile."
            : percentuale < 100
            ? "Hai superato metà percorso. Continua ad aggiornare gli esami completati."
            : "Percorso completato. Ottimo lavoro!"}
        </p>
      </section>

      <DarkCard title="Tipo di percorso" badge={`${cfuTotali} CFU`}>
        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          <ChoiceButton
            active={tipoPercorso === "triennale"}
            onClick={() => aggiornaTipoPercorso("triennale")}
          >
            Laurea triennale · 180 CFU
          </ChoiceButton>

          <ChoiceButton
            active={tipoPercorso === "magistrale"}
            onClick={() => aggiornaTipoPercorso("magistrale")}
          >
            Laurea magistrale · 120 CFU
          </ChoiceButton>

          <ChoiceButton
            active={tipoPercorso === "ciclo_unico"}
            onClick={() => aggiornaTipoPercorso("ciclo_unico")}
          >
            Laurea magistrale a ciclo unico · 300 CFU
          </ChoiceButton>
        </div>
      </DarkCard>

      <div style={{ height: 14 }} />

      <DarkCard title="Ritmo di studio" badge={caricoStudio}>
        <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
          <div>
            <label style={labelStyle}>Ore disponibili a settimana</label>
            <input
              value={oreSettimanali}
              onChange={(e) => setOreSettimanali(e.target.value)}
              type="number"
              min="0"
              placeholder="Es. 6"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Giorni di studio a settimana</label>
            <input
              value={giorniStudio}
              onChange={(e) => setGiorniStudio(e.target.value)}
              type="number"
              min="1"
              max="7"
              placeholder="Es. 3"
              style={inputStyle}
            />
          </div>

          <div style={smartBoxStyle}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 900 }}>
              {oreNumero > 0
                ? `${orePerGiorno} ore circa per giorno di studio`
                : "Imposta il tuo ritmo"}
            </p>

            <p style={mutedTextStyle}>{messaggioRitmo}</p>
          </div>

          {prossimoEsame && settimaneStimateProssimoEsame && (
            <div style={softBoxStyle}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 900 }}>
                Prossimo esame: {prossimoEsame.nome}
              </p>

              <p style={mutedTextStyle}>
                Con il ritmo attuale potresti prepararlo in circa{" "}
                <strong>{settimaneStimateProssimoEsame} settimane</strong>.
              </p>
            </div>
          )}
        </div>
      </DarkCard>

      <div style={{ height: 14 }} />

      <DarkCard title="Timeline laurea stimata" badge="Proiezione">
        <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
          <div style={timelineHeroStyle}>
            <div style={timelineIconStyle}>
              <CalendarDays size={24} />
            </div>

            <p style={timelineLabelStyle}>Possibile traguardo</p>

            <h3 style={timelineTitleStyle}>{dataStimataLabel}</h3>

            <p style={timelineTextStyle}>
              {mesiStimatiLaurea
                ? `Continuando con il ritmo attuale, potresti completare il percorso in circa ${mesiStimatiLaurea} mesi.`
                : "Aggiungi ore di studio settimanali e CFU completati per generare una stima."}
            </p>
          </div>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            <MiniTimelineBox
              title={`${cfuMancanti}`}
              description="CFU mancanti"
            />

            <MiniTimelineBox
              title={`${cfuMensiliStimati || "-"}`}
              description="CFU/mese stimati"
            />
          </section>

          <div style={positiveBoxStyle}>
            <p style={positiveTextStyle}>{messaggioTimeline}</p>
          </div>
        </div>
      </DarkCard>

      <div style={{ height: 14 }} />

      <DarkCard title="Prossimo passo consigliato" badge="Smart">
        <div style={smartBoxStyle}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 850 }}>
            {prossimoEsame ? prossimoEsame.nome : "Aggiungi il primo esame"}
          </p>

          <p style={mutedTextStyle}>
            {prossimoEsame
              ? `${prossimoEsame.cfu} CFU · difficoltà ${prossimoEsame.difficolta}`
              : "Crea il tuo piano esami per iniziare a monitorare il percorso."}
          </p>
        </div>
      </DarkCard>

      <button
        type="button"
        onClick={() => setShowForm((prev) => !prev)}
        style={primaryButtonStyle}
      >
        <Plus size={20} />
        Aggiungi esame
      </button>

      {showForm && (
        <DarkCard title="Nuovo esame">
          <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
            <input
              value={nomeEsame}
              onChange={(e) => setNomeEsame(e.target.value)}
              placeholder="Nome esame"
              style={inputStyle}
            />

            <input
              value={cfuEsame}
              onChange={(e) => setCfuEsame(e.target.value)}
              placeholder="CFU"
              type="number"
              style={inputStyle}
            />

            <select
              value={difficolta}
              onChange={(e) =>
                setDifficolta(e.target.value as EsameSmart["difficolta"])
              }
              style={inputStyle}
            >
              <option value="bassa">Difficoltà bassa</option>
              <option value="media">Difficoltà media</option>
              <option value="alta">Difficoltà alta</option>
            </select>

            <button
              type="button"
              onClick={aggiungiEsame}
              style={saveButtonStyle}
            >
              Salva esame
            </button>
          </div>
        </DarkCard>
      )}

      <section style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {esami.map((esame) => (
          <section key={esame.id} style={examCardStyle}>
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 18,
                  background:
                    esame.stato === "completato"
                      ? "rgba(37,211,102,0.16)"
                      : "rgba(58,160,255,0.16)",
                  color: esame.stato === "completato" ? "#25D366" : "#78C2FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {esame.stato === "completato" ? (
                  <CheckCircle2 size={22} />
                ) : (
                  <Clock size={22} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 16,
                      lineHeight: 1.25,
                      fontWeight: 900,
                    }}
                  >
                    {esame.nome}
                  </h3>

                  <button
                    type="button"
                    onClick={() => eliminaEsame(esame.id)}
                    style={deleteButtonStyle}
                    aria-label="Elimina esame"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p
                  style={{
                    margin: "6px 0 12px",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.62)",
                  }}
                >
                  {esame.cfu} CFU · difficoltà {esame.difficolta}
                </p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <StatusButton
                    active={esame.stato === "da_preparare"}
                    label="Da preparare"
                    onClick={() => aggiornaStatoEsame(esame.id, "da_preparare")}
                  />

                  <StatusButton
                    active={esame.stato === "in_corso"}
                    label="In corso"
                    onClick={() => aggiornaStatoEsame(esame.id, "in_corso")}
                  />

                  <StatusButton
                    active={esame.stato === "completato"}
                    label="Completato"
                    onClick={() => aggiornaStatoEsame(esame.id, "completato")}
                  />
                </div>
              </div>
            </div>
          </section>
        ))}
      </section>

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

      <h3 style={{ margin: 0, fontSize: 20, lineHeight: 1.1, fontWeight: 900 }}>
        {title}
      </h3>

      <p
        style={{
          margin: "6px 0 0",
          fontSize: 12,
          lineHeight: 1.45,
          color: "rgba(255,255,255,0.62)",
        }}
      >
        {description}
      </p>
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
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <h2
          style={{ margin: 0, fontSize: 19, lineHeight: 1.2, fontWeight: 900 }}
        >
          {title}
        </h2>

        {badge && <span style={badgeStyle}>{badge}</span>}
      </div>

      {children}
    </section>
  );
}

function StatusButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: "none",
        borderRadius: 999,
        padding: "7px 10px",
        background: active ? "#3AA0FF" : "rgba(255,255,255,0.08)",
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: 850,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...choiceButtonStyle,
        background: active ? "#3AA0FF" : "rgba(255,255,255,0.08)",
      }}
    >
      {children}
    </button>
  );
}

function MiniTimelineBox({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section style={miniTimelineBoxStyle}>
      <h4
        style={{
          margin: 0,
          fontSize: 22,
          lineHeight: 1,
          fontWeight: 950,
          color: "#FFFFFF",
        }}
      >
        {title}
      </h4>

      <p
        style={{
          margin: "7px 0 0",
          fontSize: 12,
          lineHeight: 1.4,
          color: "rgba(255,255,255,0.62)",
        }}
      >
        {description}
      </p>
    </section>
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

const heroTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 32,
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

const progressCardStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 26,
  background: "rgba(17,32,51,0.86)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
  marginBottom: 14,
};

const progressTrackStyle: React.CSSProperties = {
  height: 12,
  borderRadius: 999,
  background: "rgba(255,255,255,0.08)",
  overflow: "hidden",
  marginBottom: 14,
};

const progressTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.55,
  color: "rgba(255,255,255,0.72)",
};

const darkCardStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 26,
  background: "rgba(17,32,51,0.86)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
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

const badgeStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(58,160,255,0.16)",
  color: "#78C2FF",
  fontSize: 11,
  fontWeight: 900,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 52,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.08)",
  color: "#FFFFFF",
  padding: "0 14px",
  fontSize: 15,
  outline: "none",
};

const choiceButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 52,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#FFFFFF",
  padding: "0 14px",
  fontSize: 14,
  fontWeight: 850,
  cursor: "pointer",
  textAlign: "left",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 7,
  fontSize: 13,
  fontWeight: 850,
  color: "rgba(255,255,255,0.76)",
};

const smartBoxStyle: React.CSSProperties = {
  marginTop: 14,
  padding: 14,
  borderRadius: 20,
  background: "rgba(58,160,255,0.12)",
  border: "1px solid rgba(120,194,255,0.14)",
};

const softBoxStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 20,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const mutedTextStyle: React.CSSProperties = {
  margin: "7px 0 0",
  fontSize: 13,
  lineHeight: 1.5,
  color: "rgba(255,255,255,0.68)",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 58,
  borderRadius: 22,
  border: "none",
  background: "#3AA0FF",
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: 900,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  margin: "14px 0",
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(58,160,255,0.24)",
};

const saveButtonStyle: React.CSSProperties = {
  minHeight: 52,
  borderRadius: 18,
  border: "none",
  background: "#25D366",
  color: "#FFFFFF",
  fontWeight: 900,
  cursor: "pointer",
};

const deleteButtonStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.72)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};

const examCardStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 24,
  background: "rgba(17,32,51,0.86)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
};

const timelineHeroStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 22,
  background:
    "linear-gradient(135deg, rgba(58,160,255,0.18) 0%, rgba(120,194,255,0.08) 100%)",
  border: "1px solid rgba(120,194,255,0.16)",
};

const timelineIconStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 18,
  background: "rgba(58,160,255,0.16)",
  color: "#78C2FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 12,
};

const timelineLabelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "rgba(255,255,255,0.68)",
  fontWeight: 800,
};

const timelineTitleStyle: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: 25,
  lineHeight: 1.1,
  fontWeight: 950,
  color: "#FFFFFF",
  letterSpacing: "-0.5px",
  textTransform: "capitalize",
};

const timelineTextStyle: React.CSSProperties = {
  margin: "10px 0 0",
  fontSize: 14,
  lineHeight: 1.5,
  color: "rgba(255,255,255,0.72)",
};

const miniTimelineBoxStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 20,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const positiveBoxStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 20,
  background: "rgba(37,211,102,0.10)",
  border: "1px solid rgba(37,211,102,0.16)",
};

const positiveTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.55,
  color: "rgba(255,255,255,0.78)",
  fontWeight: 750,
};
