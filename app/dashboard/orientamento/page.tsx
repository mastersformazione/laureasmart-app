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
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
      }}
    >
      <section
        style={{
          padding: 26,
          borderRadius: 30,
          background: "linear-gradient(135deg, #1F6FB2 0%, #155487 100%)",
          color: "#FFFFFF",
          boxShadow: "0 18px 40px rgba(31,111,178,0.18)",
          marginBottom: 22,
        }}
      >
        <p style={{ margin: "0 0 8px", fontSize: 14, opacity: 0.9 }}>
          Orientamento Laurea Smart
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: 35,
            lineHeight: 1.05,
            fontWeight: 850,
            letterSpacing: "-0.8px",
          }}
        >
          Capisci da dove partire
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            fontSize: 15,
            lineHeight: 1.6,
            opacity: 0.95,
          }}
        >
          Fai il test gratuito e scopri quale percorso universitario può essere
          più adatto al tuo profilo, al tuo lavoro e ai tuoi obiettivi.
        </p>
      </section>

      <div style={{ display: "grid", gap: 16 }}>
        <Card
          title="🎯 Test di orientamento"
          description="Rispondi a poche domande e ricevi un primo consiglio personalizzato su area, percorso e priorità."
          badge="Consigliato"
        >
          <Button
            label="Inizia il test gratuito"
            variant="primary"
            onClick={() => router.push("/dashboard/orientamento/test")}
          />
        </Card>

        <Card
          title="📚 Percorsi consigliati"
          description="Esplora lauree e percorsi coerenti con il tuo titolo di studio. Più interagisci, più i consigli diventano personalizzati in base ai tuoi interessi."
          badge="Nuovo"
        >
          <Button
            label="Vedi i percorsi consigliati"
            variant="primary"
            onClick={() => router.push("/dashboard/percorsi")}
          />
        </Card>

        <section
          style={{
            padding: 22,
            borderRadius: 26,
            background: "#FFFFFF",
            border: "1px solid #D7E7F5",
            boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "7px 11px",
              borderRadius: 999,
              background: "#EAF4FC",
              color: "#1F6FB2",
              fontSize: 12,
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            Possibile abbreviazione percorso
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 24,
              lineHeight: 1.15,
              fontWeight: 850,
              color: "#09090B",
              letterSpacing: "-0.5px",
            }}
          >
            Hai già esami, titoli o esperienza lavorativa?
          </h2>

          <p
            style={{
              margin: "12px 0 0",
              fontSize: 15,
              lineHeight: 1.6,
              color: "#5F6B7A",
            }}
          >
            In alcuni casi è possibile richiedere una valutazione del pregresso:
            esami universitari già sostenuti, titoli precedenti, certificazioni
            o competenze documentabili da CV possono aiutarti a costruire un
            percorso più rapido.
          </p>

          <div
            style={{
              display: "grid",
              gap: 9,
              marginTop: 16,
              color: "#102033",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            <div>✅ Esami universitari già sostenuti</div>
            <div>✅ Titoli, master o percorsi precedenti</div>
            <div>✅ Esperienze e competenze documentabili</div>
          </div>

          <div style={{ marginTop: 18 }}>
            <Button
              label="Verifica il percorso agevolato"
              variant="primary"
              onClick={() =>
                router.push("/dashboard/orientamento/percorso-agevolato")
              }
            />
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
