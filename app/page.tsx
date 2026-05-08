"use client";

import { useEffect, useState } from "react";
import InstallButton from "./install-button";
import { useRouter } from "next/navigation";
import ActionSheet from "@/components/ActionSheet";
import {
  Share,
  CheckCircle,
  Bell,
  MessageCircle,
  UserCircle2,
} from "lucide-react";

async function trackInstallEvent(eventType: string, platform: string) {
  try {
    const storedUser = localStorage.getItem("gps_user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    await fetch("https://laureasmart.it/api/salva-install-event.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email: user?.email || "",
        event_type: eventType,
        platform,
      }),
    });
  } catch (error) {
    console.error("Errore tracking install:", error);
  }
}

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("gps_user");

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    if (isStandalone) {
      const giaTracciato = localStorage.getItem("standalone_open_tracked");

      if (!giaTracciato) {
        trackInstallEvent("open_standalone", "pwa");
        localStorage.setItem("standalone_open_tracked", "si");
      }
    }

    if (storedUser && isStandalone) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleAction = (action: string) => {
    setMenuOpen(false);

    if (action === "Accedi") router.push("/dashboard");
    if (action === "Registrati") router.push("/register");
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
            Orientamento Universitario Gratuito
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
            La Laurea Giusta, Senza Perdere Tempo
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
            Ricevi notifiche, consigli personalizzati e percorsi online adatti
            al tuo profilo.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <Benefit icon={<CheckCircle size={19} />} text="Test gratuiti" />
          <Benefit icon={<Bell size={19} />} text="Scadenze e promozioni" />
          <Benefit
            icon={<MessageCircle size={19} />}
            text="Supporto Gratuito di un Orientatore Dedicato"
          />
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
          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            <InstallButton />

            <button
              type="button"
              onClick={() => trackInstallEvent("click_scarica_iphone", "ios")}
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
                cursor: "default",
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
                <Share size={25} color="#FFFFFF" />
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
              onClick={() => setMenuOpen(true)}
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

        <p
          style={{
            margin: "14px auto 0",
            fontSize: 12,
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.45,
            maxWidth: 320,
            textAlign: "center",
          }}
        >
          Puoi registrarti anche senza scaricare la app.
        </p>
      </section>

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

function Benefit({ icon, text }: { icon: React.ReactNode; text: string }) {
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

      <span
        style={{
          fontSize: 14,
          fontWeight: 800,
        }}
      >
        {text}
      </span>
    </div>
  );
}
