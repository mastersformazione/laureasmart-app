"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  GraduationCap,
  MessageCircle,
  Plus,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import AppCard from "@/components/ui/AppCard";
import BottomNav from "@/components/ui/BottomNav";
import type { ClasseConcorso, EsameCfu, RisultatoVerificaCfu, TitoloCompleto } from "@/lib/classi-concorso/types";
import { createEmptyExam, verificaCfuClasse } from "@/lib/classi-concorso/verificaCfu";
import { normalizeSSD } from "@/lib/classi-concorso/ssd";

type GpsUser = {
  nome: string;
  email: string;
  telefono: string;
  interesse?: string;
};

const STORAGE_KEY = "ls_verifica_cfu_v1";

const livelli = [
  { value: "triennale", label: "Triennale" },
  { value: "magistrale", label: "Magistrale" },
  { value: "ciclo_unico", label: "Ciclo unico" },
  { value: "altro", label: "Altro" },
] as const;

export default function VerificaCfuPage() {
  const router = useRouter();
  const [user, setUser] = useState<GpsUser | null>(null);
  const [classi, setClassi] = useState<ClasseConcorso[]>([]);
  const [titoli, setTitoli] = useState<TitoloCompleto[]>([]);
  const [titoloCodice, setTitoloCodice] = useState("");
  const [classeCodice, setClasseCodice] = useState("");
  const [esami, setEsami] = useState<EsameCfu[]>([createEmptyExam()]);
  const [loading, setLoading] = useState(true);
  const [queryTitolo, setQueryTitolo] = useState("");
  const [queryClasse, setQueryClasse] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("gps_user");

    if (!storedUser) {
      router.push("/register");
      return;
    }

    setUser(JSON.parse(storedUser));

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          titoloCodice?: string;
          classeCodice?: string;
          esami?: EsameCfu[];
        };

        setTitoloCodice(parsed.titoloCodice || "");
        setClasseCodice(parsed.classeCodice || "");
        if (parsed.esami?.length) setEsami(parsed.esami);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    Promise.all([
      fetch("/data/classi-concorso/classi_concorso.json", { cache: "force-cache" }).then((res) => res.json()),
      fetch("/data/classi-concorso/titoli_completi.json", { cache: "force-cache" }).then((res) => res.json()),
    ])
      .then(([classiData, titoliData]) => {
        setClassi(classiData || []);
        setTitoli(titoliData || []);
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ titoloCodice, classeCodice, esami })
    );
  }, [titoloCodice, classeCodice, esami]);

  const titoloSelezionato = useMemo(
    () => titoli.find((titolo) => titolo.codice === titoloCodice) || null,
    [titoli, titoloCodice]
  );

  const classeSelezionata = useMemo(
    () => classi.find((classe) => classe.codice === classeCodice) || null,
    [classi, classeCodice]
  );

  const titoliFiltrati = useMemo(() => {
    const q = queryTitolo.trim().toLowerCase();
    return titoli
      .filter((titolo) =>
        !q ||
        titolo.codice.toLowerCase().includes(q) ||
        titolo.titolo.toLowerCase().includes(q)
      )
      .slice(0, 220);
  }, [titoli, queryTitolo]);

  const classiCompatibiliConTitolo = useMemo(() => {
    if (!titoloSelezionato) return classi;
    const codici = new Set(titoloSelezionato.classi.map((item) => item.codice));
    return classi.filter((classe) => codici.has(classe.codice));
  }, [classi, titoloSelezionato]);

  const classiFiltrate = useMemo(() => {
    const q = queryClasse.trim().toLowerCase();
    return classiCompatibiliConTitolo
      .filter((classe) =>
        !q ||
        classe.codice.toLowerCase().includes(q) ||
        classe.descrizione.toLowerCase().includes(q)
      )
      .slice(0, 220);
  }, [classiCompatibiliConTitolo, queryClasse]);

  const risultato: RisultatoVerificaCfu | null = useMemo(() => {
    if (!classeSelezionata || !titoloSelezionato) return null;
    return verificaCfuClasse({
      classe: classeSelezionata,
      titolo: titoloSelezionato,
      esami: esami.filter((esame) => esame.ssd.trim() && Number(esame.cfu) > 0),
    });
  }, [classeSelezionata, titoloSelezionato, esami]);

  const updateExam = (id: string, field: keyof EsameCfu, value: string | number) => {
    setEsami((current) =>
      current.map((esame) =>
        esame.id === id
          ? {
              ...esame,
              [field]: field === "cfu" ? Number(value) : value,
            }
          : esame
      )
    );
  };

  const removeExam = (id: string) => {
    setEsami((current) =>
      current.length === 1 ? current : current.filter((esame) => esame.id !== id)
    );
  };

  const addExam = () => setEsami((current) => [...current, createEmptyExam()]);

  const resetAll = () => {
    setTitoloCodice("");
    setClasseCodice("");
    setQueryTitolo("");
    setQueryClasse("");
    setEsami([createEmptyExam()]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const inviaAOrientatore = () => {
    const testo = encodeURIComponent(
      `Ciao, vorrei una verifica gratuita dei miei CFU per accedere a una classe di concorso.\n\nNome: ${user?.nome || ""}\nEmail: ${user?.email || ""}\nTelefono: ${user?.telefono || ""}\nTitolo dichiarato: ${titoloSelezionato?.codice || ""} - ${titoloSelezionato?.titolo || ""}\nClasse richiesta: ${classeSelezionata?.codice || ""} - ${classeSelezionata?.descrizione || ""}\n\nEsami inseriti:\n${esami
        .filter((esame) => esame.ssd || esame.nome || esame.cfu)
        .map((esame) => `- ${esame.nome || "Esame"}: ${normalizeSSD(esame.ssd)} - ${esame.cfu} CFU`)
        .join("\n")}\n\nRisultato automatico:\n${risultato?.requisiti
        .map((req) => `- ${req.label}: posseduti ${req.cfuPosseduti}, mancanti ${req.cfuMancanti}`)
        .join("\n") || "Da verificare"}`
    );

    window.location.href = `https://wa.me/393793673257?text=${testo}`;
  };

  if (!user) return null;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "22px 18px 120px",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
        maxWidth: 460,
        margin: "0 auto",
        color: "#FFFFFF",
        background:
          "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
      }}
    >
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        style={{
          border: "none",
          background: "rgba(255,255,255,0.10)",
          color: "#FFFFFF",
          borderRadius: 999,
          padding: "10px 13px",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 850,
          marginBottom: 16,
          cursor: "pointer",
        }}
      >
        <ArrowLeft size={18} /> Dashboard
      </button>

      <section
        style={{
          borderRadius: 30,
          padding: 24,
          marginBottom: 18,
          background:
            "linear-gradient(135deg, rgba(31,111,178,0.98) 0%, rgba(58,160,255,0.90) 58%, rgba(15,118,110,0.92) 100%)",
          boxShadow: "0 22px 54px rgba(0,0,0,0.34)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 11px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.16)",
            fontSize: 12,
            fontWeight: 950,
            marginBottom: 14,
          }}
        >
          <BookOpenCheck size={15} /> VERIFICA PRELIMINARE
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 31,
            lineHeight: 1.05,
            fontWeight: 950,
            letterSpacing: "-0.9px",
          }}
        >
          Controlla i CFU per le classi di concorso
        </h1>

        <p style={{ margin: "13px 0 0", fontSize: 15.5, lineHeight: 1.6, opacity: 0.95 }}>
          Inserisci titolo, esami, SSD e CFU. Laurea Smart ti restituisce una prima lettura automatica dei crediti eventualmente mancanti.
        </p>
      </section>

      {loading ? (
        <AppCard variant="dark" title="Caricamento dati" description="Sto preparando titoli e classi di concorso." />
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          <AppCard
            variant="dark"
            title="1. Titolo di studio"
            description="Cerca il codice o il nome del titolo dichiarato. Esempio: LM-51, LS 6, diploma, psicologia."
            icon={<GraduationCap size={22} />}
          >
            <input
              value={queryTitolo}
              onChange={(e) => setQueryTitolo(e.target.value)}
              placeholder="Cerca titolo di studio..."
              style={inputStyle}
            />

            <select
              value={titoloCodice}
              onChange={(e) => {
                setTitoloCodice(e.target.value);
                setClasseCodice("");
              }}
              style={{ ...inputStyle, marginTop: 10 }}
            >
              <option value="">Seleziona titolo</option>
              {titoliFiltrati.map((titolo) => (
                <option key={titolo.codice} value={titolo.codice}>
                  {titolo.codice} — {titolo.titolo}
                </option>
              ))}
            </select>
          </AppCard>

          <AppCard
            variant="dark"
            title="2. Esami, SSD e CFU"
            description="Inserisci tutti gli esami utili sostenuti tra triennale e magistrale. Il codice SSD viene normalizzato automaticamente."
            icon={<Plus size={22} />}
          >
            <div style={{ display: "grid", gap: 12 }}>
              {esami.map((esame, index) => (
                <div
                  key={esame.id}
                  style={{
                    borderRadius: 22,
                    padding: 14,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <strong>Esame {index + 1}</strong>
                    <button
                      type="button"
                      onClick={() => removeExam(esame.id)}
                      disabled={esami.length === 1}
                      style={{
                        border: "none",
                        background: "rgba(255,255,255,0.10)",
                        color: "#FFFFFF",
                        borderRadius: 12,
                        width: 36,
                        height: 36,
                        display: "grid",
                        placeItems: "center",
                        opacity: esami.length === 1 ? 0.4 : 1,
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <input
                    value={esame.nome}
                    onChange={(e) => updateExam(esame.id, "nome", e.target.value)}
                    placeholder="Nome esame"
                    style={inputStyle}
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: 8, marginTop: 8 }}>
                    <input
                      value={esame.ssd}
                      onChange={(e) => updateExam(esame.id, "ssd", e.target.value)}
                      onBlur={(e) => updateExam(esame.id, "ssd", normalizeSSD(e.target.value))}
                      placeholder="SSD es. MAT/05"
                      style={inputStyle}
                    />
                    <input
                      value={esame.cfu || ""}
                      onChange={(e) => updateExam(esame.id, "cfu", e.target.value)}
                      type="number"
                      min={0}
                      placeholder="CFU"
                      style={inputStyle}
                    />
                  </div>

                  <select
                    value={esame.livello}
                    onChange={(e) => updateExam(esame.id, "livello", e.target.value)}
                    style={{ ...inputStyle, marginTop: 8 }}
                  >
                    {livelli.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12 }}>
              <AppButton type="button" variant="secondary" onClick={addExam}>
                <Plus size={18} /> Aggiungi esame
              </AppButton>
            </div>
          </AppCard>

          <AppCard
            variant="dark"
            title="3. Classe di concorso"
            description={
              titoloSelezionato
                ? "L’elenco mostra le classi collegate al titolo selezionato."
                : "Prima scegli un titolo di studio, poi seleziona la classe da verificare."
            }
            icon={<BookOpenCheck size={22} />}
          >
            <input
              value={queryClasse}
              onChange={(e) => setQueryClasse(e.target.value)}
              placeholder="Cerca classe, esempio A-28 o matematica..."
              style={inputStyle}
            />

            <select
              value={classeCodice}
              onChange={(e) => setClasseCodice(e.target.value)}
              style={{ ...inputStyle, marginTop: 10 }}
              disabled={!titoloSelezionato}
            >
              <option value="">Seleziona classe</option>
              {classiFiltrate.map((classe) => (
                <option key={classe.codice} value={classe.codice}>
                  {classe.codice} — {classe.descrizione}
                </option>
              ))}
            </select>
          </AppCard>

          {risultato && classeSelezionata && titoloSelezionato && (
            <RisultatoCard
              risultato={risultato}
              classe={classeSelezionata}
              titolo={titoloSelezionato}
              onInvia={inviaAOrientatore}
            />
          )}

          <AppCard variant="dark" title="Nota importante" badge="Orientamento">
            <p style={{ margin: 0, color: "rgba(255,255,255,0.74)" }}>
              Il conteggio è una verifica automatica preliminare basata sui dati inseriti. Le note ministeriali e i piani di studio possono contenere condizioni particolari: per questo il risultato va sempre controllato da un orientatore.
            </p>
            <div style={{ marginTop: 12 }}>
              <AppButton type="button" variant="ghost" onClick={resetAll}>
                Ricomincia da capo
              </AppButton>
            </div>
          </AppCard>
        </div>
      )}

      <BottomNav />
    </main>
  );
}

function RisultatoCard({
  risultato,
  classe,
  titolo,
  onInvia,
}: {
  risultato: RisultatoVerificaCfu;
  classe: ClasseConcorso;
  titolo: TitoloCompleto;
  onInvia: () => void;
}) {
  const positive = risultato.stato === "positivo";
  const notCompatible = risultato.stato === "titolo_non_compatibile";

  return (
    <AppCard
      variant={notCompatible ? "red" : positive ? "green" : "amber"}
      title="Risultato preliminare"
      badge={positive ? "OK" : notCompatible ? "Titolo non compatibile" : "Da verificare"}
      icon={positive ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
    >
      <div style={{ display: "grid", gap: 12 }}>
        <InfoRow label="Titolo" value={`${titolo.codice} — ${titolo.titolo}`} />
        <InfoRow label="Classe" value={`${classe.codice} — ${classe.descrizione}`} />

        {notCompatible ? (
          <p style={{ margin: 0 }}>
            Il titolo selezionato non risulta tra quelli associati a questa classe di concorso nei dati caricati.
          </p>
        ) : risultato.requisiti.length > 0 ? (
          <div style={{ display: "grid", gap: 10 }}>
            {risultato.requisiti.map((req) => (
              <div
                key={req.id}
                style={{
                  borderRadius: 18,
                  padding: 13,
                  background: "rgba(255,255,255,0.58)",
                  border: "1px solid rgba(15,23,42,0.08)",
                }}
              >
                <strong style={{ display: "block", marginBottom: 6 }}>{req.label}</strong>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 14 }}>
                  <span>Posseduti: {req.cfuPosseduti} CFU</span>
                  <span>{req.soddisfatto ? "Requisito soddisfatto" : `Mancano ${req.cfuMancanti} CFU`}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0 }}>
            Per questa combinazione non sono stati rilevati requisiti CFU automatici nella nota, oppure la nota richiede una lettura manuale.
          </p>
        )}

        {risultato.note && (
          <details>
            <summary style={{ cursor: "pointer", fontWeight: 850 }}>Mostra nota originale</summary>
            <p style={{ margin: "8px 0 0", fontSize: 13.5, lineHeight: 1.55 }}>{risultato.note}</p>
          </details>
        )}

        <div
          style={{
            borderRadius: 20,
            padding: 14,
            background: "rgba(31,111,178,0.10)",
            border: "1px solid rgba(31,111,178,0.14)",
          }}
        >
          <strong>Verifica gratuita consigliata</strong>
          <p style={{ margin: "6px 0 0" }}>
            Invia il riepilogo a un orientatore: controllerà gratuitamente titolo, SSD e CFU senza impegno.
          </p>
        </div>

        <AppButton type="button" variant="whatsapp" onClick={onInvia}>
          <MessageCircle size={18} /> Invia verifica gratuita
        </AppButton>
      </div>
    </AppCard>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.4px", opacity: 0.7, fontWeight: 900 }}>
        {label}
      </div>
      <div style={{ fontWeight: 850, lineHeight: 1.35 }}>{value}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.94)",
  color: "#102033",
  padding: "0 13px",
  fontSize: 15,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};
