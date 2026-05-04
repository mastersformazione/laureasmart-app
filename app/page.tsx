"use client";

import { useState } from "react";
import InstallButton from "./install-button";
import { useRouter } from "next/navigation";
import ActionSheet from "@/components/ActionSheet";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAction = (action: string) => {
    setMenuOpen(false);

    if (action === "Home") {
      router.push("/");
    }

    if (action === "Accedi") {
      router.push("/dashboard");
    }

    if (action === "Registra") {
      router.push("/register");
    }
  };

  return (
    <main
      style={{
        padding: 20,
        fontFamily: "Arial",
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      <Header
        title="Graduatorie GPS"
        subtitle="Ricevi aggiornamenti su GPS, abilitazioni e percorsi universitari direttamente sul tuo telefono."
      />

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <InstallButton />

        <div style={{ marginTop: 16 }}>
          <Button
            label="Accedi / Registrati"
            variant="secondary"
            onClick={() => setMenuOpen(true)}
          />
        </div>

        <p style={{ marginTop: 20, fontSize: 14 }}>
          Se hai già installato la app, puoi registrarti o accedere alla
          dashboard da questa schermata.
        </p>
      </div>

      {menuOpen && (
        <ActionSheet
          title="Menu"
          description="Scegli cosa fare"
          actions={["Home", "Accedi", "Registra"]}
          onAction={handleAction}
        />
      )}
    </main>
  );
}
