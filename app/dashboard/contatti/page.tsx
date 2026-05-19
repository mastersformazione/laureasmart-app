"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/ui/BottomNav";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  UserRoundCheck,
} from "lucide-react";

type GpsUser = {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
  interesse?: string;
};

type ProfileSnapshot = {
  segmentoStudente: string;
  statoIscrizione: string;
  obiettivo: string;
  titoloStudio: string;
  areaInteresse: string;
  risultatoTipo: string;
  corsoSuggerito: string;
  segmentoAspetto: string;
  aspettoDaValutare: string;
  ateneoAttuale: string;
  modalitaStudio: string;
  corsoAttuale: string;
  cfuConseguiti: string;
  cfuTotali: string;
  esamiMancanti: string;
};

const ORIENTATRICE = {
  nome: "Giulia C.",
  ruolo: "Orientatrice suggerita Laurea Smart",
  telefono: "3793673257",
  telefonoWhatsapp: "393793673257",
  email: "info@laureasmart.it",
  foto: "/giulia-orientatrice.png",
};

function getLocalValue(key: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) || "";
}

function getUserFromStorage(): GpsUser | null {
  if (typeof window === "undefined") return null;

  const storedUser =
    localStorage.getItem("gps_user") ||
    localStorage.getItem("laurea_smart_user") ||
    localStorage.getItem("user");

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as GpsUser;
  } catch {
    return null;
  }
}

function getProfileSnapshot(): ProfileSnapshot {
  return {
    segmentoStudente: getLocalValue("segmento_studente"),
    statoIscrizione: getLocalValue("stato_iscrizione"),
    obiettivo: getLocalValue("obiettivo"),
    titoloStudio: getLocalValue("titolo_studio"),
    areaInteresse: getLocalValue("area_interesse"),
    risultatoTipo: getLocalValue("profilo_utente"),
    corsoSuggerito: getLocalValue("corso_suggerito"),
    segmentoAspetto: getLocalValue("segmento_aspetto"),
    aspettoDaValutare: getLocalValue("aspetto_da_valutare"),
    ateneoAttuale: getLocalValue("ateneo_attuale"),
    modalitaStudio: getLocalValue("modalita_studio"),
    corsoAttuale: getLocalValue("corso_attuale"),
    cfuConseguiti: getLocalValue("cfu_conseguiti"),
    cfuTotali: getLocalValue("cfu_totali"),
    esamiMancanti: getLocalValue("esami_mancanti"),
  };
}

function getHeroCopy(snapshot: ProfileSnapshot) {
  if (snapshot.segmentoStudente === "TRASFERIMENTO") {
    return {
      badge: "Valutazione trasferimento",
      title: "Parla con un orientatore per capire come muoverti",
      description:
        "Se stai valutando un cambio corso o ateneo, puoi chiedere un confronto gratuito per chiarire esami, CFU, tempi e alternative possibili.",
    };
  }

  if (snapshot.segmentoStudente === "UNIVERSITA_INTERROTTA") {
    return {
      badge: "Ripresa studi",
      title: "Prima di ripartire, verifica cosa puoi valorizzare",
      description:
        "Un orientatore può aiutarti a fare ordine tra percorso precedente, obiettivo attuale e possibili passi per riprendere senza ricominciare automaticamente da zero.",
    };
  }

  if (snapshot.segmentoStudente === "GIA_ISCRITTO") {
    return {
      badge: "Supporto percorso",
      title: "Hai già iniziato? Possiamo aiutarti a fare chiarezza",
      description:
        "Se vuoi organizzare meglio il percorso, valutare prossimi step o capire se esistono alternative più sostenibili, puoi richiedere un confronto gratuito.",
    };
  }

  return {
    badge: "Orientamento gratuito",
    title: "Hai dubbi sul percorso universitario giusto?",
    description:
      "Confrontati gratuitamente con un orientatore per valutare corso, ateneo, costi, tempi, modalità di studio ed eventuali agevolazioni.",
  };
}

function buildWhatsappMessage(user: GpsUser | null, snapshot: ProfileSnapshot) {
  const nome = [user?.nome, user?.cognome].filter(Boolean).join(" ");

  return `Ciao Giulia, vorrei parlare con un orientatore Laurea Smart.

Nome: ${nome || ""}
Email: ${user?.email || ""}
Telefono: ${user?.telefono || ""}

Stato iscrizione: ${snapshot.statoIscrizione || ""}
Segmento studente: ${snapshot.segmentoStudente || ""}
Titolo di studio: ${snapshot.titoloStudio || ""}
Obiettivo: ${snapshot.obiettivo || ""}
Area interesse: ${snapshot.areaInteresse || ""}
Profilo orientativo: ${snapshot.risultatoTipo || ""}
Corso suggerito: ${snapshot.corsoSuggerito || ""}
Aspetto da valutare: ${snapshot.aspettoDaValutare || ""}

Ateneo attuale/precedente: ${snapshot.ateneoAttuale || ""}
Modalità studio: ${snapshot.modalitaStudio || ""}
Corso attuale: ${snapshot.corsoAttuale || ""}
CFU: ${snapshot.cfuConseguiti || ""}/${snapshot.cfuTotali || ""}
Esami mancanti: ${snapshot.esamiMancanti || ""}

Vorrei ricevere un confronto gratuito sul percorso più adatto.`;
}

export default function ContattiPage() {
  const [user, setUser] = useState<GpsUser | null>(null);
  const [snapshot, setSnapshot] = useState<ProfileSnapshot>(() => ({
    segmentoStudente: "",
    statoIscrizione: "",
    obiettivo: "",
    titoloStudio: "",
    areaInteresse: "",
    risultatoTipo: "",
    corsoSuggerito: "",
    segmentoAspetto: "",
    aspettoDaValutare: "",
    ateneoAttuale: "",
    modalitaStudio: "",
    corsoAttuale: "",
    cfuConseguiti: "",
    cfuTotali: "",
    esamiMancanti: "",
  }));

  useEffect(() => {
    setUser(getUserFromStorage());
    setSnapshot(getProfileSnapshot());
  }, []);

  const heroCopy = useMemo(() => getHeroCopy(snapshot), [snapshot]);
  const whatsappMessage = useMemo(
    () => buildWhatsappMessage(user, snapshot),
    [user, snapshot]
  );

  const whatsappUrl = `https://wa.me/${
    ORIENTATRICE.telefonoWhatsapp
  }?text=${encodeURIComponent(whatsappMessage)}`;

  const emailSubject = encodeURIComponent(
    "Richiesta orientamento Laurea Smart"
  );
  const emailBody = encodeURIComponent(whatsappMessage);

  const handleWhatsappClick = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("contatto_orientatore_click", "whatsapp");
      localStorage.setItem(
        "contatto_orientatore_click_at",
        new Date().toISOString()
      );
      localStorage.setItem("assigned_tutor_name", ORIENTATRICE.nome);
      localStorage.setItem(
        "assigned_tutor_phone",
        ORIENTATRICE.telefonoWhatsapp
      );
    }
  };

  const handleCallClick = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("contatto_orientatore_click", "telefono");
      localStorage.setItem(
        "contatto_orientatore_click_at",
        new Date().toISOString()
      );
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "22px 18px 120px",
        maxWidth: 430,
        margin: "0 auto",
        color: "#FFFFFF",
        background:
          "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
      }}
    >
      <section style={heroStyle}>
        <div style={heroGlowStyle} />
        <div style={heroGlowSecondaryStyle} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={heroBadgeStyle}>
            <Sparkles size={15} />
            {heroCopy.badge}
          </div>

          <h1 style={heroTitleStyle}>{heroCopy.title}</h1>
          <p style={heroTextStyle}>{heroCopy.description}</p>
        </div>
      </section>

      <section style={tutorCardStyle}>
        <div style={tutorAccentStyle} />

        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={photoShellStyle}>
            <Image
              src={ORIENTATRICE.foto}
              alt="Orientatrice Laurea Smart"
              width={78}
              height={78}
              style={{
                width: 78,
                height: 78,
                borderRadius: 26,
                objectFit: "cover",
              }}
              priority
            />
          </div>

          <div style={{ flex: 1 }}>
            <div style={miniBadgeStyle}>Orientatrice suggerita</div>
            <h2 style={tutorNameStyle}>{ORIENTATRICE.nome}</h2>
            <p style={tutorRoleStyle}>{ORIENTATRICE.ruolo}</p>
          </div>
        </div>

        <div style={specializationGridStyle}>
          <SpecializationChip
            icon={<ShieldCheck size={14} />}
            text="Confronto gratuito"
          />
          <SpecializationChip
            icon={<FileText size={14} />}
            text="CFU e carriera"
          />
          <SpecializationChip
            icon={<Clock3 size={14} />}
            text="Tempi e costi"
          />
          <SpecializationChip
            icon={<Target size={14} />}
            text="Percorso adatto"
          />
        </div>
      </section>

      <section style={actionsGridStyle}>
        <a
          href={whatsappUrl}
          rel="noopener noreferrer"
          onClick={handleWhatsappClick}
          style={primaryActionStyle}
        >
          <div style={actionIconLightStyle}>
            <MessageCircle size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <strong style={actionTitleStyle}>Scrivi su WhatsApp</strong>
            <span style={actionTextStyle}>
              Invia già i dati del tuo profilo
            </span>
          </div>
          <ArrowRight size={21} />
        </a>

        <a
          href={`tel:${ORIENTATRICE.telefono}`}
          onClick={handleCallClick}
          style={secondaryActionStyle("blue")}
        >
          <Phone size={22} />
          <div>
            <strong style={smallActionTitleStyle}>Chiama</strong>
            <span style={smallActionTextStyle}>{ORIENTATRICE.telefono}</span>
          </div>
        </a>

        <a
          href={`mailto:${ORIENTATRICE.email}?subject=${emailSubject}&body=${emailBody}`}
          style={secondaryActionStyle("purple")}
        >
          <Mail size={22} />
          <div>
            <strong style={smallActionTitleStyle}>Email</strong>
            <span style={smallActionTextStyle}>info@laureasmart.it</span>
          </div>
        </a>
      </section>

      <section style={infoCardStyle("green")}>
        <div style={sectionHeaderStyle}>
          <div style={iconBubbleStyle("green")}>
            <UserRoundCheck size={22} />
          </div>
          <div>
            <div style={sectionBadgeStyle("green")}>Cosa puoi chiedere</div>
            <h2 style={sectionTitleStyle}>Un confronto pratico sul tuo caso</h2>
          </div>
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          <CheckRow text="Capire quale percorso universitario è più coerente con il tuo obiettivo." />
          <CheckRow text="Valutare tempi, costi, modalità di studio ed eventuali agevolazioni." />
          <CheckRow text="Verificare se esami, CFU o esperienze precedenti possono essere considerati." />
          <CheckRow text="Chiarire se conviene iniziare, proseguire, riprendere o valutare un trasferimento." />
        </div>
      </section>

      <section style={infoCardStyle("amber")}>
        <div style={sectionHeaderStyle}>
          <div style={iconBubbleStyle("amber")}>
            <BookOpenCheck size={22} />
          </div>
          <div>
            <div style={sectionBadgeStyle("amber")}>Prima del contatto</div>
            <h2 style={sectionTitleStyle}>Prepara questi dati, se li hai</h2>
          </div>
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          <CheckRow text="Titolo di studio o percorso universitario già iniziato." />
          <CheckRow text="Eventuale libretto universitario o elenco esami sostenuti." />
          <CheckRow text="Obiettivo: lavoro, concorsi, crescita personale, trasferimento o ripresa studi." />
          <CheckRow text="Eventuali esigenze di supporto, agevolazioni o vincoli di tempo." />
        </div>
      </section>

      <section style={profileSummaryStyle}>
        <div style={sectionHeaderStyle}>
          <div style={iconBubbleStyle("purple")}>
            <GraduationCap size={22} />
          </div>
          <div>
            <div style={sectionBadgeStyle("purple")}>
              Profilo letto dall’app
            </div>
            <h2 style={sectionTitleStyle}>
              Dati che invieremo all’orientatrice
            </h2>
          </div>
        </div>

        <div style={summaryRowsStyle}>
          <SummaryRow
            label="Stato"
            value={snapshot.statoIscrizione || snapshot.segmentoStudente}
          />
          <SummaryRow label="Obiettivo" value={snapshot.obiettivo} />
          <SummaryRow
            label="Area"
            value={snapshot.areaInteresse || snapshot.risultatoTipo}
          />
          <SummaryRow label="Ateneo" value={snapshot.ateneoAttuale} />
          <SummaryRow label="Modalità" value={snapshot.modalitaStudio} />
          <SummaryRow
            label="Aspetto"
            value={snapshot.aspettoDaValutare || snapshot.segmentoAspetto}
          />
        </div>

        <p style={privacyTextStyle}>
          I dati servono solo a rendere il primo confronto più preciso. Potrai
          sempre chiarire o correggere le informazioni direttamente con
          l’orientatore.
        </p>
      </section>

      <Link href="/dashboard/piano-personale" style={pianoLinkStyle}>
        <div style={pianoIconStyle}>
          <CalendarCheck size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <strong style={{ display: "block", fontSize: 15, fontWeight: 950 }}>
            Hai già creato il Piano Universitario Personalizzato?
          </strong>
          <span
            style={{
              display: "block",
              marginTop: 4,
              fontSize: 12,
              color: "#dbeafe",
            }}
          >
            Generarlo prima del contatto può aiutare l’orientatore a valutare
            meglio il tuo profilo.
          </span>
        </div>
        <ArrowRight size={20} />
      </Link>

      <BottomNav />
    </main>
  );
}

function SpecializationChip({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div style={chipStyle}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

function CheckRow({ text }: { text: string }) {
  return (
    <div style={checkRowStyle}>
      <CheckCircle2
        size={17}
        color="#86efac"
        style={{ flexShrink: 0, marginTop: 1 }}
      />
      <span>{text}</span>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div style={summaryRowStyle}>
      <span style={summaryLabelStyle}>{label}</span>
      <strong style={summaryValueStyle}>{value || "Non indicato"}</strong>
    </div>
  );
}

const heroStyle: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 32,
  padding: 24,
  background: "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 52%, #155487 100%)",
  boxShadow: "0 24px 60px rgba(58,160,255,0.24)",
  border: "1px solid rgba(255,255,255,0.18)",
  marginBottom: 16,
};

const heroGlowStyle: React.CSSProperties = {
  position: "absolute",
  right: -34,
  top: -34,
  width: 140,
  height: 140,
  borderRadius: 999,
  background: "rgba(255,255,255,0.16)",
};

const heroGlowSecondaryStyle: React.CSSProperties = {
  position: "absolute",
  left: -40,
  bottom: -46,
  width: 130,
  height: 130,
  borderRadius: 999,
  background: "rgba(255,255,255,0.08)",
};

const heroBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  padding: "7px 11px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.16)",
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 900,
  marginBottom: 14,
};

const heroTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 31,
  lineHeight: 1.05,
  fontWeight: 950,
  letterSpacing: "-0.8px",
};

const heroTextStyle: React.CSSProperties = {
  margin: "12px 0 0",
  fontSize: 14,
  lineHeight: 1.6,
  color: "rgba(255,255,255,0.92)",
};

const tutorCardStyle: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  padding: 16,
  borderRadius: 28,
  background:
    "linear-gradient(135deg, rgba(139,92,246,0.28) 0%, rgba(17,32,51,0.96) 100%)",
  border: "1px solid rgba(196,181,253,0.26)",
  boxShadow:
    "0 18px 46px rgba(0,0,0,0.26), inset 4px 0 0 rgba(139,92,246,0.94)",
  marginBottom: 14,
};

const tutorAccentStyle: React.CSSProperties = {
  position: "absolute",
  right: -24,
  top: -24,
  width: 100,
  height: 100,
  borderRadius: 999,
  background: "rgba(139,92,246,0.18)",
};

const photoShellStyle: React.CSSProperties = {
  width: 86,
  height: 86,
  borderRadius: 30,
  padding: 4,
  background: "linear-gradient(135deg, #c4b5fd 0%, #3AA0FF 100%)",
  boxShadow: "0 16px 32px rgba(139,92,246,0.24)",
  flexShrink: 0,
};

const miniBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  padding: "5px 9px",
  borderRadius: 999,
  background: "rgba(139,92,246,0.24)",
  border: "1px solid rgba(196,181,253,0.24)",
  color: "#ddd6fe",
  fontSize: 10,
  fontWeight: 900,
  marginBottom: 7,
};

const tutorNameStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 23,
  lineHeight: 1.05,
  fontWeight: 950,
};

const tutorRoleStyle: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: 12,
  lineHeight: 1.45,
  color: "#dbeafe",
};

const specializationGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 8,
  marginTop: 14,
};

const chipStyle: React.CSSProperties = {
  minHeight: 38,
  borderRadius: 14,
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "#e0f2fe",
  display: "flex",
  alignItems: "center",
  gap: 7,
  padding: "8px 10px",
  fontSize: 11,
  fontWeight: 850,
};

const actionsGridStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  marginBottom: 14,
};

const primaryActionStyle: React.CSSProperties = {
  minHeight: 76,
  borderRadius: 24,
  padding: 15,
  background: "linear-gradient(135deg, #16A34A 0%, #22C55E 54%, #15803D 100%)",
  border: "1px solid rgba(187,247,208,0.34)",
  boxShadow: "0 18px 40px rgba(34,197,94,0.22)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  gap: 12,
  textDecoration: "none",
};

const actionIconLightStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 17,
  background: "rgba(255,255,255,0.16)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const actionTitleStyle: React.CSSProperties = {
  display: "block",
  fontSize: 16,
  fontWeight: 950,
};

const actionTextStyle: React.CSSProperties = {
  display: "block",
  marginTop: 4,
  fontSize: 12,
  color: "rgba(255,255,255,0.86)",
};

function secondaryActionStyle(tone: "blue" | "purple"): React.CSSProperties {
  const isBlue = tone === "blue";

  return {
    minHeight: 62,
    borderRadius: 22,
    padding: 14,
    background: isBlue
      ? "linear-gradient(135deg, rgba(31,111,178,0.34), rgba(17,32,51,0.96))"
      : "linear-gradient(135deg, rgba(139,92,246,0.30), rgba(17,32,51,0.96))",
    border: isBlue
      ? "1px solid rgba(120,194,255,0.24)"
      : "1px solid rgba(196,181,253,0.24)",
    boxShadow: "0 14px 34px rgba(0,0,0,0.22)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: 12,
    textDecoration: "none",
  };
}

const smallActionTitleStyle: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  fontWeight: 950,
};

const smallActionTextStyle: React.CSSProperties = {
  display: "block",
  marginTop: 3,
  fontSize: 11,
  color: "#cbd5e1",
};

function infoCardStyle(tone: "green" | "amber"): React.CSSProperties {
  const isGreen = tone === "green";

  return {
    padding: 16,
    borderRadius: 26,
    background: isGreen
      ? "linear-gradient(135deg, rgba(20,184,166,0.20), rgba(17,32,51,0.96))"
      : "linear-gradient(135deg, rgba(251,191,36,0.18), rgba(17,32,51,0.96))",
    border: isGreen
      ? "1px solid rgba(45,212,191,0.22)"
      : "1px solid rgba(251,191,36,0.24)",
    boxShadow: isGreen
      ? "0 18px 42px rgba(20,184,166,0.12), inset 4px 0 0 rgba(20,184,166,0.90)"
      : "0 18px 42px rgba(251,191,36,0.10), inset 4px 0 0 rgba(251,191,36,0.90)",
    marginBottom: 14,
  };
}

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
};

function iconBubbleStyle(
  tone: "green" | "amber" | "purple"
): React.CSSProperties {
  const colors = {
    green: ["rgba(20,184,166,0.24)", "#5eead4", "rgba(45,212,191,0.22)"],
    amber: ["rgba(251,191,36,0.22)", "#fde68a", "rgba(251,191,36,0.24)"],
    purple: ["rgba(139,92,246,0.24)", "#c4b5fd", "rgba(196,181,253,0.24)"],
  } as const;

  return {
    width: 42,
    height: 42,
    borderRadius: 16,
    background: colors[tone][0],
    color: colors[tone][1],
    border: `1px solid ${colors[tone][2]}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };
}

function sectionBadgeStyle(
  tone: "green" | "amber" | "purple"
): React.CSSProperties {
  const color =
    tone === "green" ? "#5eead4" : tone === "amber" ? "#fde68a" : "#c4b5fd";

  return {
    color,
    fontSize: 10,
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 5,
  };
}

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  lineHeight: 1.18,
  fontWeight: 950,
  letterSpacing: "-0.25px",
};

const checkRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 9,
  padding: 11,
  borderRadius: 17,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.76)",
  fontSize: 13,
  lineHeight: 1.45,
};

const profileSummaryStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 26,
  background:
    "linear-gradient(135deg, rgba(139,92,246,0.18), rgba(17,32,51,0.96))",
  border: "1px solid rgba(196,181,253,0.22)",
  boxShadow:
    "0 18px 42px rgba(0,0,0,0.24), inset 4px 0 0 rgba(139,92,246,0.88)",
  marginBottom: 14,
};

const summaryRowsStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  marginTop: 14,
};

const summaryRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  padding: "10px 11px",
  borderRadius: 16,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const summaryLabelStyle: React.CSSProperties = {
  color: "#cbd5e1",
  fontSize: 11,
  fontWeight: 850,
  flexShrink: 0,
};

const summaryValueStyle: React.CSSProperties = {
  color: "#ffffff",
  fontSize: 12,
  textAlign: "right",
  lineHeight: 1.35,
};

const privacyTextStyle: React.CSSProperties = {
  margin: "12px 0 0",
  color: "rgba(255,255,255,0.56)",
  fontSize: 11,
  lineHeight: 1.5,
};

const pianoLinkStyle: React.CSSProperties = {
  minHeight: 82,
  borderRadius: 26,
  padding: 15,
  background:
    "linear-gradient(135deg, rgba(37,99,235,0.36), rgba(139,92,246,0.34), rgba(17,32,51,0.96))",
  border: "1px solid rgba(147,197,253,0.26)",
  boxShadow: "0 18px 42px rgba(37,99,235,0.14)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  gap: 12,
  textDecoration: "none",
};

const pianoIconStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 18,
  background: "rgba(255,255,255,0.12)",
  color: "#bfdbfe",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
