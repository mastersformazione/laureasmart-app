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
    if (!deferredPrompt) return;

    await trackInstallEvent("click_scarica_android", "android");

    await deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      await trackInstallEvent("install_android_accettata", "android");
    } else {
      await trackInstallEvent("install_android_rifiutata", "android");
    }

    setDeferredPrompt(null);
  };

  if (!deferredPrompt) return null;

  return (
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
  );
}
