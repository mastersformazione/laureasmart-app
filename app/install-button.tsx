"use client";

import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

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

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
  };

  if (!deferredPrompt) return null;

  return (
    <button
      onClick={handleInstall}
      style={{
        width: "100%",
        height: 68,
        border: "none",
        borderRadius: 22,
        background: "linear-gradient(135deg, #2D7CC0 0%, #1F6FB2 100%)",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 18px",
        cursor: "pointer",
        boxShadow: "0 10px 30px rgba(31,111,178,0.18)",
      }}
    >
      <span
        style={{
          width: 46,
          height: 46,
          borderRadius: 16,
          background: "rgba(255,255,255,0.16)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Smartphone size={24} color="#FFFFFF" />
      </span>

      <span
        style={{
          fontSize: 18,
          fontWeight: 800,
          lineHeight: 1.1,
        }}
      >
        Scarica App su Android
      </span>
    </button>
  );
}
