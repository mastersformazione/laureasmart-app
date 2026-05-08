"use client";

import { useEffect, useState } from "react";
import InstallButton from "./install-button";
import { useRouter } from "next/navigation";
import ActionSheet from "@/components/ActionSheet";
import Button from "@/components/ui/Button";
import { Share, CheckCircle, Bell, MessageCircle } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

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
            Orientamento universitario gratuito
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
            text="Supporto di un orientatore dedicato"
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
              style={{
                width: "100%",
                border: "1px solid #D7E7F5",
                background: "#F4F9FD",
                borderRadius: 20,
                padding: "15px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                textAlign: "left",
                cursor: "default",
              }}
            >
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 15,
                  background: "#FFFFFF",
                  border: "1px solid #D8E5F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Share size={20} color="#1F6FB2" />
              </span>

              <span>
                <strong
                  style={{
                    display: "block",
                    fontSize: 15,
                    color: "#102033",
                    marginBottom: 3,
                  }}
                >
                  Installa su iPhone
                </strong>

                <span
                  style={{
                    display: "block",
                    fontSize: 13,
                    lineHeight: 1.4,
                    color: "#5F6B7A",
                  }}
                >
                  Premi Condividi e scegli “Aggiungi alla schermata Home”.
                </span>
              </span>
            </button>

            <div style={{ marginTop: 4 }}>
              <Button
                label="Accedi o Registrati"
                variant="primary"
                onClick={() => setMenuOpen(true)}
              />
            </div>
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
          Puoi registrarti anche senza installare la app.
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
