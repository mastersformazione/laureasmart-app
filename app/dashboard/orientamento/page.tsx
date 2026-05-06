"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
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
      <section
        style={{
          padding: 24,
          borderRadius: 28,
          background: "linear-gradient(135deg, #1F6FB2 0%, #155487 100%)",
          color: "#FFFFFF",
          boxShadow: "0 18px 40px rgba(31,111,178,0.18)",
          marginBottom: 22,
        }}
      >
        <p style={{ margin: "0 0 8px", fontSize: 14, opacity: 0.9 }}>
          Laurea Smart
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: 34,
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: "-0.6px",
          }}
        >
          Da dove vuoi partire?
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            fontSize: 15,
            lineHeight: 1.6,
            opacity: 0.95,
          }}
        >
          Scegli il servizio più utile per capire quale percorso universitario
          può essere più adatto ai tuoi obiettivi.
        </p>
      </section>

      <div style={{ display: "grid", gap: 14 }}>
        <Card
          title="🎯 Test di orientamento"
          description="Rispondi a poche domande e ricevi un primo consiglio personalizzato."
          badge="Consigliato"
        >
          <Button
            label="Inizia il test"
            variant="primary"
            onClick={() => router.push("/dashboard/orientamento/test")}
          />
        </Card>

        <Card
          title="📚 Trova il percorso giusto"
          description="Scopri quale laurea o master può essere più coerente con i tuoi obiettivi."
        >
          <Button
            label="Scopri il percorso"
            variant="primary"
            onClick={() => router.push("/dashboard/orientamento/percorso")}
          />
        </Card>

        <Card
          title="💶 Percorsi agevolati"
          description="Verifica se puoi accedere a valutazioni CFU, abbreviazioni o agevolazioni."
        >
          <Button
            label="Verifica agevolazioni"
            variant="primary"
            onClick={() =>
              router.push("/dashboard/orientamento/percorso-agevolato")
            }
          />
        </Card>

        <Card
          title="💼 Studio e lavoro"
          description="Organizza un percorso universitario compatibile con lavoro e impegni personali."
        >
          <Button
            label="Crea il tuo piano"
            variant="primary"
            onClick={() => router.push("/dashboard/orientamento/studio-lavoro")}
          />
        </Card>
      </div>

      <BottomNav />
    </main>
  );
}
