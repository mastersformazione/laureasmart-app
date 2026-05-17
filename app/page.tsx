"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import InstallButton from "./install-button";
import { useRouter } from "next/navigation";
import ActionSheet from "@/components/ActionSheet";
import { CheckCircle, Bell, UserCircle2 } from "lucide-react";

declare global {
  interface Window {
    fbq?: (
      action: "track" | "trackCustom",
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

function trackMetaEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, {
      app: "laurea_smart",
      page: "home_app",
      ...params,
    });
  }
}

export default function Home() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [iphoneHelpOpen, setIphoneHelpOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("gps_user");

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    if (storedUser && isStandalone) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleOpenAccessMenu = () => {
    trackMetaEvent("ClickAccediRegistrati", {
      button_text: "Accedi o Registrati",
      position: "home_main_cta",
    });

    setMenuOpen(true);
  };

  const handleIphoneHelpOpen = () => {
    trackMetaEvent("ClickScaricaIphone", {
      button_text: "Scarica su iPhone",
      position: "home_install_cta",
    });

    setIphoneHelpOpen(true);
  };

  const handleAction = (action: string) => {
    setMenuOpen(false);

    if (action === "Accedi") {
      trackMetaEvent("ClickAccediDashboard", {
        action: "Accedi",
        button_text: "Accedi",
        destination: "/dashboard",
      });

      router.push("/dashboard");
    }

    if (action === "Registrati") {
      trackMetaEvent("StartRegistration", {
        action: "Registrati",
        button_text: "Registrati",
        destination: "/register",
      });

      router.push("/register");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        maxWidth: 430,
        margin: "0 auto",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
        background: "#06111F",
        color: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <section
        style={{
          minHeight: "100vh",
          padding: "30px 22px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background:
            "radial-gradient(circle at 50% 10%, #3AA0FF 0%, #1F6FB2 26%, #06111F 62%, #020712 100%)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div
            style={{
              width: 132,
              height: 132,
              margin: "0 auto 22px",
              borderRadius: 34,
              overflow: "hidden",
              background: "transparent",
              boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
            }}
          >
            <img
              src="/icon-512.png"
              alt="Laurea Smart"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                borderRadius: 34,
              }}
            />
          </div>

          <div
            style={{
              display: "inline-flex",
              padding: "8px 13px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.22)",
              fontSize: 13,
              fontWeight: 800,
              marginBottom: 18,
              backdropFilter: "blur(10px)",
            }}
          >
            Orientamento e Percorso Smart
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 38,
              lineHeight: 1.04,
              letterSpacing: "-1.1px",
              fontWeight: 800,
            }}
          >
            Il tuo percorso universitario, più chiaro e organizzato
          </h1>

          <p
            style={{
              margin: "18px auto 0",
              color: "rgba(255,255,255,0.78)",
              fontSize: 16,
              lineHeight: 1.6,
              maxWidth: 350,
            }}
          >
            Che tu debba ancora scegliere o sia già iscritto, Laurea Smart ti
            aiuta a orientarti, organizzare lo studio e pianificare i prossimi
            passi.
          </p>
        </div>

        <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
          <Benefit
            icon={<CheckCircle size={19} />}
            text="Test di orientamento personalizzato"
          />
          <Benefit
            icon={<Bell size={19} />}
            text="Percorso Smart per esami e CFU"
          />
          <Benefit
            icon={<CheckCircle size={19} />}
            text="Consigli utili in base al tuo obiettivo"
          />
        </div>

        <div
          style={{
            marginBottom: 20,
            padding: 18,
            borderRadius: 28,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 18px 46px rgba(0,0,0,0.22)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "6px 11px",
              borderRadius: 999,
              background: "rgba(37,211,102,0.16)",
              border: "1px solid rgba(37,211,102,0.26)",
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 900,
              marginBottom: 12,
              letterSpacing: "0.3px",
            }}
          >
            PER CHI SCEGLIE O È GIÀ ISCRITTO
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 22,
              lineHeight: 1.12,
              fontWeight: 900,
              letterSpacing: "-0.6px",
              color: "#FFFFFF",
            }}
          >
            Una app, due percorsi diversi
          </h2>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: 14,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            Se devi ancora iscriverti, puoi scoprire l’area più adatta e i
            percorsi coerenti con il tuo profilo. Se sei già iscritto, puoi
            usare Percorso Smart per monitorare CFU, esami e obiettivi.
          </p>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gap: 9,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 9,
                fontSize: 13,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              <CheckCircle
                size={17}
                color="#25D366"
                style={{ flexShrink: 0, marginTop: 1 }}
              />
              <span>Scopri percorsi coerenti con il tuo profilo.</span>
            </div>

            <div
              style={{
                display: "flex",
                gap: 9,
                fontSize: 13,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              <CheckCircle
                size={17}
                color="#25D366"
                style={{ flexShrink: 0, marginTop: 1 }}
              />
              <span>Organizza esami, CFU e obiettivi di studio.</span>
            </div>

            <div
              style={{
                display: "flex",
                gap: 9,
                fontSize: 13,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              <CheckCircle
                size={17}
                color="#25D366"
                style={{ flexShrink: 0, marginTop: 1 }}
              />
              <span>Ricevi suggerimenti diversi in base al tuo stato.</span>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 30,
            background: "rgba(255,255,255,0.97)",
            color: "#102033",
            boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
          }}
        >
          <div style={{ display: "grid", gap: 10 }}>
            <InstallButton />

            <button
              type="button"
              onClick={handleIphoneHelpOpen}
              style={{
                width: "100%",
                border: "1px solid rgba(58,160,255,0.22)",
                background:
                  "linear-gradient(135deg, #2F86D1 0%, #1F6FB2 55%, #155487 100%)",
                borderRadius: 22,
                padding: "18px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                textAlign: "left",
                boxShadow: "0 14px 34px rgba(31,111,178,0.22)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  backdropFilter: "blur(8px)",
                }}
              >
                <AppleShareIcon size={29} color="#FFFFFF" />
              </div>

              <div>
                <strong
                  style={{
                    display: "block",
                    fontSize: 19,
                    fontWeight: 850,
                    color: "#FFFFFF",
                    marginBottom: 5,
                    letterSpacing: "-0.3px",
                  }}
                >
                  Scarica su iPhone
                </strong>

                <span
                  style={{
                    display: "block",
                    fontSize: 14,
                    lineHeight: 1.45,
                    color: "rgba(255,255,255,0.82)",
                  }}
                >
                  Premi Condividi e scegli “Aggiungi alla schermata Home”.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleOpenAccessMenu}
              style={{
                width: "100%",
                minHeight: 64,
                border: "1px solid #E4EAF1",
                borderRadius: 22,
                background: "rgba(255,255,255,0.72)",
                color: "#102033",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 11,
                fontSize: 18,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 8px 22px rgba(15,23,42,0.05)",
              }}
            >
              <UserCircle2 size={26} color="#5F6B7A" />
              <span>Accedi o Registrati</span>
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 22,
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.14)",
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 999,
              background: "rgba(37,211,102,0.16)",
              color: "#7DFFAE",
              fontSize: 11,
              fontWeight: 900,
              marginBottom: 10,
            }}
          >
            ACCESSO GRATUITO
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.55,
              color: "#FFFFFF",
              fontWeight: 700,
            }}
          >
            Puoi iniziare gratuitamente: dopo la registrazione ti chiederemo se
            devi ancora scegliere o se sei già iscritto.
          </p>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: 13,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.74)",
            }}
          >
            In base alla risposta vedrai una dashboard diversa: orientamento se
            devi iscriverti, Percorso Smart se stai già studiando.
          </p>
        </div>
      </section>

      {iphoneHelpOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,7,18,0.72)",
            zIndex: 9999,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: 14,
          }}
          onClick={() => setIphoneHelpOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 430,
              background: "#FFFFFF",
              color: "#102033",
              borderRadius: "28px 28px 24px 24px",
              padding: "22px 18px 18px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2
              style={{
                margin: "0 0 8px",
                fontSize: 22,
                lineHeight: 1.2,
                fontWeight: 900,
                letterSpacing: "-0.5px",
              }}
            >
              Come Scaricare Laurea Smart su iPhone
            </h2>

            <p
              style={{
                margin: "0 0 18px",
                fontSize: 14,
                lineHeight: 1.5,
                color: "#5F6B7A",
              }}
            >
              Su iPhone la app si scarica direttamente da Safari e compare tra
              le app del telefono.
            </p>

            <div style={{ display: "grid", gap: 12 }}>
              <InstallStep
                number="1"
                icon={<AppleShareIcon size={27} color="#1F6FB2" />}
                title="Premi Condividi"
                text="Tocca l’icona con il quadrato e la freccia verso l’alto."
              />

              <InstallStep
                number="2"
                emoji="➕"
                title="Premi Aggiungi alla schermata Home"
                text="Scorri il menu e seleziona questa voce."
              />

              <InstallStep
                number="3"
                emoji="✅"
                title="Premi Aggiungi"
                text="Laurea Smart comparirà tra le app del tuo iPhone."
              />
            </div>

            <div
              style={{
                marginTop: 16,
                padding: 13,
                borderRadius: 18,
                background: "#F1F7FF",
                border: "1px solid #D8EAFF",
                fontSize: 13,
                lineHeight: 1.45,
                color: "#24547D",
                fontWeight: 700,
              }}
            >
              Se non vedi “Aggiungi alla schermata Home”, scorri verso il basso
              e premi “Modifica azioni”.
            </div>

            <button
              type="button"
              onClick={() => setIphoneHelpOpen(false)}
              style={{
                width: "100%",
                marginTop: 16,
                minHeight: 56,
                border: "none",
                borderRadius: 18,
                background: "#1F6FB2",
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Ho Capito
            </button>
          </div>
        </div>
      )}

      {menuOpen && (
        <ActionSheet
          title="Cosa vuoi fare?"
          description="Accedi alla dashboard oppure crea il tuo profilo gratuito."
          actions={["Accedi", "Registrati"]}
          onAction={handleAction}
        />
      )}
    </main>
  );
}

function Benefit({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div
      style={{
        padding: "13px 15px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.13)",
        border: "1px solid rgba(255,255,255,0.18)",
        display: "flex",
        alignItems: "center",
        gap: 11,
        color: "#FFFFFF",
        backdropFilter: "blur(10px)",
      }}
    >
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          background: "rgba(255,255,255,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>

      <span style={{ fontSize: 14, fontWeight: 800 }}>{text}</span>
    </div>
  );
}

function InstallStep({
  number,
  emoji,
  icon,
  title,
  text,
}: {
  number: string;
  emoji?: string;
  icon?: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: 13,
        borderRadius: 20,
        background: "#F7FAFD",
        border: "1px solid #E5EDF5",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 15,
          background: "#EAF4FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        {icon || emoji}
      </div>

      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 900,
            color: "#1F6FB2",
            marginBottom: 3,
          }}
        >
          STEP {number}
        </div>

        <strong
          style={{
            display: "block",
            fontSize: 15,
            fontWeight: 900,
            marginBottom: 3,
          }}
        >
          {title}
        </strong>

        <span
          style={{
            display: "block",
            fontSize: 13,
            lineHeight: 1.45,
            color: "#5F6B7A",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}

function AppleShareIcon({
  size = 28,
  color = "#FFFFFF",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 15V3"
        stroke={color}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M7.5 7.5L12 3L16.5 7.5"
        stroke={color}
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 10.5V18.5C6.5 19.6 7.4 20.5 8.5 20.5H15.5C16.6 20.5 17.5 19.6 17.5 18.5V10.5"
        stroke={color}
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
