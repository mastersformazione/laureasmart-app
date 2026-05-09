"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    if (isStandalone) return;

    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const installedHandler = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt || isInstalling) return;

    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();

      await deferredPrompt.userChoice;

      setDeferredPrompt(null);
    } catch (error) {
      console.error("Errore prompt installazione:", error);
    } finally {
      setIsInstalling(false);
    }
  };

  if (!deferredPrompt) return null;

  return (
    <button
      onClick={handleInstall}
      type="button"
      disabled={isInstalling}
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
        cursor: isInstalling ? "not-allowed" : "pointer",
        color: "#FFFFFF",
        opacity: isInstalling ? 0.75 : 1,
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
          {isInstalling ? "Installazione..." : "Scarica su Android"}
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
