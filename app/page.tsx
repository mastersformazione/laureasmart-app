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
        padding: "24px 20px 34px",
        maxWidth: 430,
        margin: "0 auto",
        fontFamily: "var(--font-geist-sans)",
        background:
          "radial-gradient(circle at top, #D9EDFF 0%, #F8FBFF 42%, #FFFFFF 100%)",
        color: "#102033",
      }}
    >
      <section style={{ textAlign: "center" }}>
        <div
          style={{
            width: 118,
            height: 118,
            margin: "16px auto 18px",
            borderRadius: 32,
            overflow: "hidden",
            boxShadow: "0 22px 50px rgba(31,111,178,0.28)",
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
            }}
          />
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 12px",
            borderRadius: 999,
            background: "#EAF4FC",
            color: "#1F6FB2",
            fontSize: 13,
            fontWeight: 800,
            marginBottom: 14,
          }}
        >
          Gratis · Orientamento universitario
        </div>

        <h1
          style={{
            margin: "0 auto",
            fontSize: 37,
            lineHeight: 1.03,
            letterSpacing: "-1.2px",
            fontWeight: 850,
            maxWidth: 370,
            color: "#0B1B2E",
          }}
        >
          Trova la laurea giusta senza perdere tempo
        </h1>

        <p
          style={{
            margin: "16px auto 24px",
            color: "#5F6B7A",
            fontSize: 17,
            lineHeight: 1.55,
            maxWidth: 355,
          }}
        >
          Installa la app, ricevi notifiche utili e scopri percorsi universitari
          online, master e agevolazioni adatti al tuo profilo.
        </p>

        <div
          style={{
            display: "grid",
            gap: 10,
            marginBottom: 22,
          }}
        >
          <Benefit
            icon={<CheckCircle size={20} />}
            text="Test gratuito e consigli personalizzati"
          />
          <Benefit
            icon={<Bell size={20} />}
            text="Notifiche su scadenze, promozioni e opportunità"
          />
          <Benefit
            icon={<MessageCircle size={20} />}
            text="Supporto diretto su WhatsApp"
          />
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 24,
            background: "#FFFFFF",
            border: "1px solid #D7E7F5",
            boxShadow: "0 16px 40px rgba(31,111,178,0.12)",
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 14,
              color: "#1F6FB2",
              fontWeight: 800,
            }}
          >
            Scarica subito la app
          </p>

          <InstallButton />

          <div
            style={{
              marginTop: 14,
              padding: "14px 15px",
              borderRadius: 18,
              background: "#F4F9FD",
              border: "1px solid #D7E7F5",
              textAlign: "left",
            }}
          >
            <strong
              style={{
                display: "block",
                fontSize: 15,
                color: "#102033",
                marginBottom: 8,
              }}
            >
              📱 Su iPhone
            </strong>

            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#5F6B7A",
                lineHeight: 1.6,
              }}
            >
              Premi{" "}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 26,
                  height: 26,
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
        </div>

        <div style={{ marginTop: 18 }}>
          <Button
            label="Accedi o Registrati"
            variant="secondary"
            onClick={() => setMenuOpen(true)}
          />
        </div>

        <p
          style={{
            margin: "14px auto 0",
            fontSize: 12,
            color: "#7A8594",
            lineHeight: 1.45,
            maxWidth: 320,
          }}
        >
          Anche senza installare la app puoi registrarti e ricevere supporto
          personalizzato.
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
        padding: "14px 15px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.9)",
        border: "1px solid #DDEAF5",
        display: "flex",
        alignItems: "center",
        gap: 12,
        textAlign: "left",
        boxShadow: "0 10px 28px rgba(16,32,51,0.05)",
      }}
    >
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          background: "#EAF4FC",
          color: "#1F6FB2",
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
          fontSize: 15,
          lineHeight: 1.35,
          fontWeight: 700,
          color: "#102033",
        }}
      >
        {text}
      </span>
    </div>
  );
}
