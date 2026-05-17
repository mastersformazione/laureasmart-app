"use client";

import { useEffect, useState } from "react";
import StudentiComeTeCard from "@/components/StudentiComeTeCard";
import { useRouter } from "next/navigation";
import CompatibilitaPercorsoCard from "@/components/CompatibilitaPercorsoCard";
import BottomNav from "@/components/ui/BottomNav";
import {
  BookOpen,
  Bell,
  Search,
  Heart,
  MessageCircle,
  TrendingUp,
  CalendarCheck,
  CalendarDays,
  Share2,
  GraduationCap,
} from "lucide-react";

type GpsUser = {
  nome: string;
  email: string;
  telefono: string;
  interesse: string;
};

type Notifica = {
  id: string;
  titolo: string;
  messaggio: string;
  categoria: string;
  created_at: string;
};

function FeatureCard({
  icon,
  title,
  description,
  gradient,
  onClick,
  highlight = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <section
      onClick={onClick}
      style={{
        background: "rgba(17,32,51,0.82)",
        borderRadius: 30,
        border: highlight
          ? "1px solid rgba(255,201,64,0.35)"
          : "1px solid rgba(255,255,255,0.08)",
        padding: 16,
        boxShadow: highlight
          ? "0 18px 44px rgba(255,196,64,0.16)"
          : "0 18px 46px rgba(0,0,0,0.26)",
        marginBottom: 20,
        cursor: "pointer",
        transition: "all .2s ease",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          minHeight: 145,
          borderRadius: 28,
          background: gradient,
          padding: 20,
          color: "#FFFFFF",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 16px 34px rgba(31,111,178,0.24)",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -34,
            top: -24,
            width: 140,
            height: 140,
            borderRadius: 999,
            background: "rgba(255,255,255,0.13)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: 18,
            top: "50%",
            transform: "translateY(-50%)",
            width: 56,
            height: 56,
            borderRadius: 999,
            background: "rgba(255,255,255,0.94)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1F6FB2",
            fontSize: 36,
            fontWeight: 900,
            boxShadow: "0 10px 24px rgba(0,0,0,0.20)",
          }}
        >
          ›
        </div>

        {highlight && (
          <div
            style={{
              display: "inline-flex",
              marginBottom: 14,
              padding: "6px 12px",
              borderRadius: 999,
              background: "#FFC940",
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 850,
              letterSpacing: "0.3px",
              boxShadow: "0 6px 16px rgba(255,201,64,0.30)",
            }}
          >
            NOVITÀ
          </div>
        )}

        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 20,
            background: "rgba(0,0,0,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
            backdropFilter: "blur(8px)",
            boxShadow: "0 10px 24px rgba(0,0,0,0.16)",
          }}
        >
          {icon}
        </div>

        <h2
          style={{
            margin: "0 80px 8px 0",
            fontSize: 24,
            lineHeight: 1.04,
            fontWeight: 850,
            letterSpacing: "-0.8px",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.55,
            opacity: 0.96,
            maxWidth: 290,
          }}
        >
          {description}
        </p>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<GpsUser | null>(null);
  const [notifiche, setNotifiche] = useState<Notifica[]>([]);
  const [query, setQuery] = useState("");
  const [segmentoStudente, setSegmentoStudente] = useState("NON_ISCRITTO");

  const handleShareApp = async () => {
    const shareData = {
      title: "Laurea Smart",
      text: "Scopri gratuitamente quale percorso universitario è più adatto al tuo profilo.",
      url: "https://app.laureasmart.it",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copiato");
      }
    } catch {
      console.log("Condivisione annullata");
    }
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("gps_user");

    if (!storedUser) {
      router.push("/register");
      return;
    }

    setUser(JSON.parse(storedUser) as GpsUser);
    const savedSegmentoStudente =
      localStorage.getItem("segmento_studente") || "NON_ISCRITTO";

    setSegmentoStudente(savedSegmentoStudente);
    const aggiornaBadge = (count: number) => {
      if ("setAppBadge" in navigator && count > 0) {
        navigator.setAppBadge(count).catch(console.error);
      }

      if ("clearAppBadge" in navigator && count === 0) {
        navigator.clearAppBadge().catch(console.error);
      }
    };

    const loadNotifiche = () => {
      const registeredAt = localStorage.getItem("registered_at") || "";

      const url =
        "https://laureasmart.it/api/notifiche.php?t=" +
        Date.now() +
        "&registered_at=" +
        encodeURIComponent(registeredAt);

      fetch(url, {
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const lista = data.data || [];
            setNotifiche(lista);
            aggiornaBadge(lista.length);
          }
        })
        .catch((error) => {
          console.error("Errore caricamento notifiche:", error);
        });
    };

    loadNotifiche();
    const interval = setInterval(loadNotifiche, 10000);

    return () => clearInterval(interval);
  }, [router]);

  if (!user) return null;
  const isGiaIscritto = segmentoStudente === "GIA_ISCRITTO";
  const isNonIscritto = segmentoStudente === "NON_ISCRITTO";
  const isUniversitaInterrotta = segmentoStudente === "UNIVERSITA_INTERROTTA";
  const isTrasferimento = segmentoStudente === "TRASFERIMENTO";
  const notificheFiltrate = notifiche.filter((notifica) => {
    const testo = query.toLowerCase().trim();

    return (
      testo === "" ||
      notifica.titolo.toLowerCase().includes(testo) ||
      notifica.messaggio.toLowerCase().includes(testo) ||
      notifica.categoria.toLowerCase().includes(testo)
    );
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "22px 18px 120px",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
        maxWidth: 430,
        margin: "0 auto",
        color: "#FFFFFF",
        background:
          "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
      }}
    >
      <section
        style={{
          background:
            "linear-gradient(135deg, rgba(31,111,178,0.98) 0%, rgba(21,84,135,0.96) 100%)",
          borderRadius: 30,
          padding: 24,
          color: "#FFFFFF",
          boxShadow: "0 22px 54px rgba(0,0,0,0.34)",
          marginBottom: 20,
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 14,
            opacity: 0.9,
            fontWeight: 700,
          }}
        >
          Benvenuto, {user.nome} 👋
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: 32,
            lineHeight: 1.08,
            fontWeight: 850,
            letterSpacing: "-0.7px",
          }}
        >
          {isGiaIscritto
            ? "Organizza il tuo percorso di studi"
            : isUniversitaInterrotta
            ? "Riparti dal percorso giusto"
            : isTrasferimento
            ? "Valuta il tuo nuovo percorso"
            : "Costruisci il tuo percorso universitario"}
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            fontSize: 15,
            lineHeight: 1.6,
            opacity: 0.95,
          }}
        >
          {isGiaIscritto
            ? "Monitora esami, CFU e obiettivi settimanali. Laurea Smart ti aiuta a rendere più ordinato il percorso che hai già iniziato."
            : isUniversitaInterrotta
            ? "Hai già iniziato l’università? Puoi ripartire valorizzando esami sostenuti, CFU e obiettivi personali."
            : isTrasferimento
            ? "Se stai valutando un cambio corso o ateneo, puoi verificare il percorso più adatto e capire quali esami potrebbero essere valorizzati."
            : "Ritrova i corsi salvati, ricevi aggiornamenti e scopri opportunità coerenti con il tuo profilo."}
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(255,255,255,0.09)",
            background: "rgba(17,32,51,0.82)",
            borderRadius: 22,
            padding: "14px 16px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.20)",
            backdropFilter: "blur(16px)",
          }}
        >
          <Search size={22} color="#3AA0FF" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca notifiche, scadenze, opportunità..."
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

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              style={{
                border: "none",
                background: "transparent",
                color: "rgba(255,255,255,0.65)",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          )}
        </div>
      </section>

      <section style={{ marginBottom: 20 }}>
        <button
          onClick={() =>
            router.push(
              isGiaIscritto
                ? "/dashboard/percorso-smart"
                : "/dashboard/preferiti"
            )
          }
          style={{
            width: "100%",
            border: "1px solid rgba(58,160,255,0.28)",
            background:
              "linear-gradient(135deg, rgba(31,111,178,0.96) 0%, rgba(58,160,255,0.92) 55%, rgba(21,84,135,0.96) 100%)",
            borderRadius: 28,
            padding: 20,
            textAlign: "left",
            boxShadow: "0 20px 48px rgba(58,160,255,0.22)",
            cursor: "pointer",
            color: "#FFFFFF",
            position: "relative",
            overflow: "hidden",
            fontFamily: "inherit",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -34,
              top: -34,
              width: 130,
              height: 130,
              borderRadius: 999,
              background: "rgba(255,255,255,0.14)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 20,
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Heart size={28} />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 23,
                  lineHeight: 1.1,
                  fontWeight: 900,
                  letterSpacing: "-0.5px",
                }}
              >
                {isGiaIscritto ? "Il mio Percorso Smart" : "I miei percorsi"}
              </h2>

              <p
                style={{
                  margin: "7px 0 0",
                  fontSize: 14,
                  lineHeight: 1.45,
                  color: "rgba(255,255,255,0.86)",
                }}
              >
                {isGiaIscritto
                  ? "Apri il tuo spazio personale per monitorare esami, CFU, avanzamento e prossimi obiettivi."
                  : "Ritrova subito i corsi salvati e continua da quelli più adatti al tuo profilo."}
              </p>
            </div>
          </div>
        </button>
      </section>

      {!isGiaIscritto && <CompatibilitaPercorsoCard />}

      <FeatureCard
        icon={<GraduationCap size={30} />}
        title={
          isGiaIscritto ? "Continua il tuo Percorso Smart" : "Percorso Smart"
        }
        description={
          isGiaIscritto
            ? "Tieni sotto controllo esami, CFU, timeline laurea e prossimi obiettivi di studio."
            : "Se sei già iscritto ti aiuta a monitorare CFU, esami e timeline laurea. Se non sei ancora iscritto, puoi usarlo come simulazione utile per capire tempi e impegno."
        }
        gradient="linear-gradient(135deg, #0F766E 0%, #14B8A6 52%, #0E7490 100%)"
        highlight
        onClick={() => router.push("/dashboard/percorso-smart")}
      />

      <FeatureCard
        icon={<BookOpen size={30} />}
        title={
          isGiaIscritto
            ? "Valuta prossimi step"
            : "Esplora i percorsi consigliati"
        }
        description={
          isGiaIscritto
            ? "Scopri percorsi futuri come magistrali, master o alternative coerenti con il tuo profilo."
            : "Lauree, magistrali e master ordinati in base al tuo profilo."
        }
        gradient="linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 52%, #155487 100%)"
        onClick={() => router.push("/dashboard/percorsi")}
      />

      <FeatureCard
        icon={<TrendingUp size={30} />}
        title="Simula il tuo futuro"
        description="Visualizza come potrebbe crescere il tuo profilo nei prossimi 36 mesi."
        gradient="linear-gradient(135deg, #102033 0%, #1F6FB2 58%, #3AA0FF 100%)"
        onClick={() => router.push("/dashboard/simula-futuro")}
      />

      <FeatureCard
        icon={<CalendarCheck size={30} />}
        title="Il tuo percorso reale"
        description="Scopri se università, lavoro e impegni quotidiani possono stare insieme in modo sostenibile."
        gradient="linear-gradient(135deg, #0B2440 0%, #155487 52%, #1F6FB2 100%)"
        onClick={() => router.push("/dashboard/percorso-reale")}
      />

      <StudentiComeTeCard />

      <FeatureCard
        icon={<CalendarDays size={30} />}
        title="Simula il tuo anno accademico"
        description="Se non sei ancora iscritto, prova a simulare esami, CFU e tempo di studio. Se sei già iscritto, usa Percorso Smart per monitorare il percorso reale."
        gradient="linear-gradient(135deg, #2563EB 0%, #3B82F6 55%, #60A5FA 100%)"
        highlight
        onClick={() => router.push("/dashboard/anno-accademico")}
      />

      <section>
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
              fontSize: 22,
              color: "#FFFFFF",
              fontWeight: 850,
              letterSpacing: "-0.4px",
            }}
          >
            Notifiche recenti
          </h2>

          {notifiche.length > 0 && (
            <span
              style={{
                minWidth: 30,
                height: 30,
                padding: "0 10px",
                borderRadius: 999,
                background: "#3AA0FF",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 800,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 22px rgba(58,160,255,0.32)",
              }}
            >
              {notifiche.length}
            </span>
          )}
        </div>

        {notificheFiltrate.length === 0 ? (
          <DarkCard
            title="Nessun aggiornamento trovato"
            description="Quando saranno pubblicate nuove opportunità, le troverai qui."
          />
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {notificheFiltrate.map((notifica) => (
              <DarkCard
                key={notifica.id}
                title={notifica.titolo}
                description={notifica.messaggio}
                badge={notifica.categoria}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 12,
                    color: "rgba(255,255,255,0.54)",
                    fontSize: 12,
                  }}
                >
                  <Bell size={14} />
                  <span>{notifica.created_at}</span>
                </div>
              </DarkCard>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: 22 }}>
        <DarkCard
          title={
            isGiaIscritto
              ? "Continua a organizzare il tuo studio"
              : "Hai bisogno di aiuto?"
          }
          description={
            isGiaIscritto
              ? "Usa Percorso Smart per monitorare esami, CFU, obiettivi e prossime attività senza perdere di vista il tuo avanzamento."
              : "Un orientatore reale può aiutarti gratuitamente a capire quale percorso scegliere."
          }
          badge={isGiaIscritto ? "Percorso Smart" : "Gratis"}
          onClick={() =>
            router.push(
              isGiaIscritto
                ? "/dashboard/percorso-smart"
                : "/dashboard/contatti"
            )
          }
        >
          <div
            style={{
              marginTop: 16,
              width: "100%",
              minHeight: 52,
              borderRadius: 18,
              background: isGiaIscritto ? "rgba(58,160,255,0.16)" : "#3AA0FF",
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              border: isGiaIscritto
                ? "1px solid rgba(58,160,255,0.28)"
                : "none",
            }}
          >
            {isGiaIscritto ? "Apri Percorso Smart" : "Parla con un orientatore"}
            <span>→</span>
          </div>
        </DarkCard>
      </section>

      <section style={{ marginTop: 18 }}>
        <div
          style={{
            padding: 18,
            borderRadius: 28,
            background:
              "linear-gradient(135deg, rgba(31,111,178,0.22) 0%, rgba(17,32,51,0.94) 100%)",
            border: "1px solid rgba(120,194,255,0.16)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.24)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 13,
              marginBottom: 16,
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
              }}
            >
              <Share2 size={25} />
            </div>

            <div>
              <div
                style={{
                  display: "inline-flex",
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "rgba(58,160,255,0.16)",
                  color: "#78C2FF",
                  fontSize: 11,
                  fontWeight: 900,
                  marginBottom: 8,
                }}
              >
                CONDIVIDI
              </div>

              <h3
                style={{
                  margin: 0,
                  fontSize: 21,
                  lineHeight: 1.12,
                  fontWeight: 900,
                  color: "#FFFFFF",
                  letterSpacing: "-0.5px",
                }}
              >
                Conosci qualcuno che sta cercando la laurea giusta?
              </h3>

              <p
                style={{
                  margin: "9px 0 0",
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                Condividi Laurea Smart con amici, colleghi o familiari: il test
                e l’orientamento sono gratuiti.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShareApp}
            style={{
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
              gap: 10,
              cursor: "pointer",
              boxShadow: "0 14px 30px rgba(58,160,255,0.24)",
            }}
          >
            <Share2 size={19} />
            Condividi con un amico
          </button>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

function DarkCard({
  title,
  description,
  badge,
  children,
  onClick,
}: {
  title: string;
  description: string;
  badge?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <section
      onClick={onClick}
      style={{
        padding: 18,
        borderRadius: 24,
        background: "rgba(17,32,51,0.86)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 14px 34px rgba(0,0,0,0.24)",
        cursor: onClick ? "pointer" : "default",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 17,
            lineHeight: 1.25,
            color: "#FFFFFF",
            fontWeight: 850,
          }}
        >
          {title}
        </h3>

        {badge && (
          <span
            style={{
              padding: "6px 10px",
              borderRadius: 999,
              background: "rgba(58,160,255,0.16)",
              color: "#78C2FF",
              fontSize: 11,
              fontWeight: 850,
              whiteSpace: "nowrap",
            }}
          >
            {badge}
          </span>
        )}
      </div>

      <p
        style={{
          margin: "10px 0 0",
          fontSize: 14,
          lineHeight: 1.5,
          color: "rgba(255,255,255,0.68)",
        }}
      >
        {description}
      </p>

      {children}
    </section>
  );
}
