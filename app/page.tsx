"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Bell, UserCircle2, GraduationCap } from "lucide-react";

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

  useEffect(() => {
    const storedUser = localStorage.getItem("gps_user");

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true ||
      document.referrer.startsWith("android-app://");

    if (storedUser && isStandalone) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleStart = () => {
    trackMetaEvent("ClickIniziaGratis", {
      button_text: "Inizia",
      position: "home_main_cta",
      destination: "/dashboard",
    });

    router.push("/dashboard");
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
          padding: "32px 22px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 50% 8%, #3AA0FF 0%, #1F6FB2 28%, #06111F 64%, #020712 100%)",
        }}
      >
        <div />

        <div>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div
              style={{
                width: 128,
                height: 128,
                margin: "0 auto 22px",
                borderRadius: 32,
                overflow: "hidden",
                background: "#FFFFFF",
                boxShadow: "0 18px 45px rgba(0,0,0,0.30)",
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
                gap: 8,
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
              <GraduationCap size={17} />
              Orientamento universitario smart
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 38,
                lineHeight: 1.04,
                letterSpacing: "-1.1px",
                fontWeight: 900,
              }}
            >
              Benvenuto in Laurea Smart
            </h1>

            <p
              style={{
                margin: "18px auto 0",
                color: "rgba(255,255,255,0.80)",
                fontSize: 16,
                lineHeight: 1.6,
                maxWidth: 350,
              }}
            >
              L’app ti aiuta a capire quale percorso universitario può essere
              più adatto a te e a organizzare meglio i prossimi passi.
            </p>
          </div>

          <div
            style={{
              marginBottom: 22,
              padding: 18,
              borderRadius: 28,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 18px 46px rgba(0,0,0,0.22)",
              backdropFilter: "blur(14px)",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                lineHeight: 1.15,
                fontWeight: 900,
                letterSpacing: "-0.6px",
                color: "#FFFFFF",
              }}
            >
              Cosa puoi fare nell’app
            </h2>

            <p
              style={{
                margin: "10px 0 16px",
                fontSize: 14,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Puoi iniziare subito. Ti verrà chiesto solo di indicare se devi
              ancora scegliere il tuo percorso o se sei già iscritto.
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              <Benefit
                icon={<CheckCircle size={19} />}
                text="Fai un test di orientamento semplice e guidato"
              />
              <Benefit
                icon={<GraduationCap size={19} />}
                text="Scopri percorsi coerenti con il tuo profilo"
              />
              <Benefit
                icon={<Bell size={19} />}
                text="Organizza esami, CFU e obiettivi di studio"
              />
            </div>
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 28,
              background:
                "linear-gradient(145deg, rgba(6,17,31,0.96), rgba(13,48,82,0.86))",
              border: "1px solid rgba(186,230,253,0.18)",
              boxShadow: "0 24px 70px rgba(0,0,0,0.34)",
              backdropFilter: "blur(14px)",
            }}
          >
            <button
              type="button"
              onClick={handleStart}
              style={{
                width: "100%",
                minHeight: 64,
                border: "1px solid rgba(186,230,253,0.28)",
                borderRadius: 22,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(224,242,254,0.92))",
                color: "#102033",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 11,
                fontSize: 18,
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: "0 14px 32px rgba(15,23,42,0.18)",
              }}
            >
              <UserCircle2 size={26} color="#1F6FB2" />
              <span>Inizia gratis</span>
            </button>

            <p
              style={{
                margin: "13px 4px 0",
                textAlign: "center",
                fontSize: 13,
                lineHeight: 1.5,
                color: "rgba(255,255,255,0.70)",
              }}
            >
              Nessun accesso obbligatorio all’avvio. Il profilo ti verrà
              richiesto solo quando servirà salvare o personalizzare il
              percorso.
            </p>
          </div>
        </div>

        <p
          style={{
            margin: "18px 0 0",
            textAlign: "center",
            fontSize: 12,
            lineHeight: 1.45,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Laurea Smart offre strumenti informativi e di orientamento. Le scelte
          finali restano sempre personali e possono essere approfondite con un
          orientatore.
        </p>
      </section>
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

      <span style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.35 }}>
        {text}
      </span>
    </div>
  );
}
