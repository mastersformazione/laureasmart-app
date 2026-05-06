"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import BottomNav from "@/components/ui/BottomNav";

type GpsUser = {
  nome: string;
  email: string;
  telefono: string;
  interesse: string;
};

type Notifica = {
  id: string;
  titolo: string;
  messaggio: string;
  categoria: string;
  created_at: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<GpsUser | null>(null);
  const [notifiche, setNotifiche] = useState<Notifica[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("gps_user");

    if (!storedUser) {
      router.push("/register");
      return;
    }

    setUser(JSON.parse(storedUser) as GpsUser);

    const aggiornaBadge = (count: number) => {
      if ("setAppBadge" in navigator && count > 0) {
        navigator.setAppBadge(count).catch(console.error);
      }

      if ("clearAppBadge" in navigator && count === 0) {
        navigator.clearAppBadge().catch(console.error);
      }
    };

    const loadNotifiche = () => {
      fetch("https://laureasmart.it/api/notifiche.php?t=" + Date.now(), {
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const lista = data.data || [];
            setNotifiche(lista);
            aggiornaBadge(lista.length);
          }
        })
        .catch((error) => {
          console.error("Errore caricamento notifiche:", error);
        });
    };

    loadNotifiche();
    const interval = setInterval(loadNotifiche, 10000);

    return () => clearInterval(interval);
  }, [router]);

  if (!user) return null;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 18px 120px",
        fontFamily: "var(--font-geist-sans)",
        maxWidth: 430,
        margin: "0 auto",
        background: "#F8FBFF",
      }}
    >
      <section style={{ marginBottom: 22 }}>
        <p
          style={{
            margin: "0 0 6px",
            fontSize: 14,
            color: "#71717A",
          }}
        >
          Ciao, {user.nome} 👋
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: 30,
            lineHeight: 1.1,
            color: "#09090B",
          }}
        >
          Aggiornamenti
        </h1>

        <p
          style={{
            margin: "10px 0 0",
            fontSize: 15,
            lineHeight: 1.6,
            color: "#71717A",
          }}
        >
          Qui trovi i percorsi che hai salvato, novità, scadenze, promozioni e
          opportunità utili per il tuo percorso universitario.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <Card
          title="📌 I miei percorsi"
          description="Rivedi i corsi che hai salvato cliccando su “Mi interessa”. Puoi confrontarli e riprenderli quando vuoi."
          badge="Preferiti"
          onClick={() => router.push("/dashboard/preferiti")}
        />
      </section>

      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              color: "#09090B",
            }}
          >
            Notifiche recenti
          </h2>

          {notifiche.length > 0 && (
            <span
              style={{
                minWidth: 28,
                height: 28,
                padding: "0 10px",
                borderRadius: 999,
                background: "#1F6FB2",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {notifiche.length}
            </span>
          )}
        </div>

        {notifiche.length === 0 ? (
          <div
            style={{
              padding: 20,
              borderRadius: 22,
              background: "#FFFFFF",
              border: "1px solid #E4EAF1",
              boxShadow: "0 8px 28px rgba(15,23,42,0.05)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 15,
                color: "#09090B",
                fontWeight: 600,
              }}
            >
              Nessun aggiornamento disponibile
            </p>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: 14,
                lineHeight: 1.5,
                color: "#71717A",
              }}
            >
              Quando saranno pubblicate nuove opportunità, le troverai qui.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {notifiche.map((notifica) => (
              <Card
                key={notifica.id}
                title={notifica.titolo}
                description={notifica.messaggio}
                badge={notifica.categoria}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "#71717A",
                  }}
                >
                  {notifica.created_at}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: 22 }}>
        <Card
          title="Hai bisogno di aiuto?"
          description="Vai su Orientamento per scegliere il percorso oppure contattaci direttamente su WhatsApp."
          onClick={() => router.push("/dashboard/orientamento")}
        />
      </section>

      <BottomNav />
    </main>
  );
}
