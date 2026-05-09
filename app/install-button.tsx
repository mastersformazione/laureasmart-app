"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

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

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    await trackInstallEvent("click_scarica_android", "android");

    if (!deferredPrompt) {
      await trackInstallEvent("prompt_android_non_disponibile", "android");
      setShowHelp(true);
      return;
    }

    await deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      await trackInstallEvent("install_android_accettata", "android");
    } else {
      await trackInstallEvent("install_android_rifiutata", "android");
      setShowHelp(true);
    }

    setDeferredPrompt(null);
  };

  return (
    <>
      <button
        onClick={handleInstall}
        type="button"
        style={{
          width: "100%",
          border: "none",
          background: "linear-gradient(135deg, #1F6FB2 0%, #155487 100%)",
          borderRadius: 22,
          padding: "18px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          textAlign: "left",
          boxShadow: "0 14px 34px rgba(31,111,178,0.22)",
          cursor: "pointer",
          color: "#FFFFFF",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background: "rgba(255,255,255,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Download size={25} color="#FFFFFF" />
        </div>

        <div>
          <strong
            style={{
              display: "block",
              fontSize: 19,
              fontWeight: 850,
              color: "#FFFFFF",
              marginBottom: 5,
            }}
          >
            Scarica su Android
          </strong>

          <span
            style={{
              display: "block",
              fontSize: 14,
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.82)",
            }}
          >
            Installa la app sul tuo telefono.
          </span>
        </div>
      </button>

      {showHelp && (
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
          onClick={() => setShowHelp(false)}
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
              Installa Laurea Smart
            </h2>

            <p
              style={{
                margin: "0 0 18px",
                fontSize: 14,
                lineHeight: 1.5,
                color: "#5F6B7A",
              }}
            >
              Se il download non parte automaticamente, puoi installare la app
              dal menu di Chrome.
            </p>

            <div style={{ display: "grid", gap: 12 }}>
              <InstallStep
                number="1"
                title="Apri il menu di Chrome"
                text="Tocca i tre puntini in alto a destra."
              />

              <InstallStep
                number="2"
                title="Premi Installa app"
                text="Se non la vedi, cerca “Aggiungi alla schermata Home”."
              />

              <InstallStep
                number="3"
                title="Conferma installazione"
                text="Laurea Smart comparirà tra le app del telefono."
              />
            </div>

            <button
              type="button"
              onClick={() => setShowHelp(false)}
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
              Ho capito
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function InstallStep({
  number,
  title,
  text,
}: {
  number: string;
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
          color: "#1F6FB2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 900,
          flexShrink: 0,
        }}
      >
        {number}
      </div>

      <div>
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
