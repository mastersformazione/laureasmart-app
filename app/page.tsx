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
              fontSize: 41,
              lineHeight: 1.02,
              letterSpacing: "-1.4px",
              fontWeight: 850,
            }}
          >
            La laurea giusta, senza perdere tempo
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
          <Benefit icon={<CheckCircle size={19} />} text="Test gratuito" />

          <Benefit icon={<Bell size={19} />} text="Scadenze e promozioni" />

          <Benefit
            icon={<MessageCircle size={19} />}
            text="Supporto WhatsApp"
          />
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 28,
            background: "rgba(255,255,255,0.96)",
            color: "#102033",
            boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
          }}
        >
          <InstallButton />

          <div
            style={{
              marginTop: 12,
              padding: "13px 14px",
              borderRadius: 18,
              background: "#F4F9FD",
              border: "1px solid #D7E7F5",
              textAlign: "left",
            }}
          >
            <strong
              style={{
                display: "block",
                fontSize: 14,
                marginBottom: 6,
              }}
            >
              📱 Su iPhone
            </strong>

            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#5F6B7A",
                lineHeight: 1.55,
              }}
            >
              Premi{" "}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 25,
                  height: 25,
                  borderRadius: 8,
                  background: "#FFFFFF",
                  border: "1px solid #D8E5F0",
                  verticalAlign: "middle",
                  margin: "0 4px",
                }}
              >
                <Share size={15} color="#1F6FB2" />
              </span>
              in Safari e seleziona{" "}
              <strong>“Aggiungi alla schermata Home”</strong>.
            </p>
          </div>

          <div style={{ marginTop: 12 }}>
            <Button
              label="Accedi o Registrati"
              variant="secondary"
              onClick={() => setMenuOpen(true)}
            />
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
