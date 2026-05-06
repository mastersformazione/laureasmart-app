"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import BottomNav from "@/components/ui/BottomNav";

export default function OrientamentoHubPage() {
  const router = useRouter();

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        paddingBottom: 120,
        maxWidth: 430,
        margin: "0 auto",
        background: "#F8FBFF",
        fontFamily: "var(--font-geist-sans)",
      }}
    >
      <h1
        style={{
          margin: "0 0 8px",
          fontSize: 30,
          lineHeight: 1.1,
          color: "#09090B",
        }}
      >
        Orientamento
      </h1>

      <p
        style={{
          margin: "0 0 22px",
          fontSize: 15,
          lineHeight: 1.6,
          color: "#71717A",
        }}
      >
        Scegli da dove partire: puoi fare il test, valutare il percorso più
        adatto o richiedere informazioni su studio, lavoro e agevolazioni.
      </p>

      <div style={{ display: "grid", gap: 14 }}>
        <Card
          title="🎯 Test di orientamento"
          description="Rispondi a poche domande e ricevi un primo consiglio personalizzato."
          badge="Consigliato"
          onClick={() => router.push("/dashboard/orientamento/test")}
        />

        <Card
          title="📚 Trova il percorso giusto"
          description="Scopri quale laurea o master può essere più coerente con i tuoi obiettivi."
          onClick={() => router.push("/dashboard/orientamento/percorso")}
        />

        <Card
          title="💶 Percorsi agevolati"
          description="Verifica se puoi accedere a valutazioni CFU, abbreviazioni o agevolazioni."
          onClick={() =>
            router.push("/dashboard/orientamento/percorso-agevolato")
          }
        />

        <Card
          title="💼 Studio e lavoro"
          description="Capisci come organizzare un percorso universitario compatibile con i tuoi impegni."
          onClick={() => router.push("/dashboard/orientamento/studio-lavoro")}
        />
      </div>

      <BottomNav />
    </main>
  );
}
