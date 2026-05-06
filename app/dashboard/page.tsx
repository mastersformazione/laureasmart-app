"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
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

    const haFattoTest = localStorage.getItem("ha_fatto_test");

    if (haFattoTest !== "si") {
      router.push("/dashboard/orientamento");
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
        padding: "24px 18px 40px",
        fontFamily: "Arial",
        maxWidth: 560,
        margin: "0 auto",
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 45%)",
      }}
    >
      <section
        style={{
          padding: 22,
          borderRadius: 22,
          background: "linear-gradient(135deg, #111827 0%, #2563eb 100%)",
          color: "white",
          boxShadow: "0 14px 35px rgba(37, 99, 235, 0.22)",
        }}
      >
        <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>
          Benvenuto, {user.nome} 👋
        </p>

        <h1 style={{ margin: "10px 0 10px", fontSize: 30, lineHeight: 1.1 }}>
          Laurea Smart
        </h1>

        <p style={{ margin: 0, lineHeight: 1.55, fontSize: 15 }}>
          Scopri il percorso universitario online più adatto alla tua vita, al
          tuo lavoro e al tuo obiettivo.
        </p>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ marginBottom: 12, fontSize: 22 }}>Strumenti per te</h2>

        <div style={{ display: "grid", gap: 14 }}>
          <Card
            title="Trova la laurea giusta per te"
            description="Rispondi a poche domande e scopri quale percorso universitario online può essere più utile per il tuo futuro."
          >
            <Button
              label="Inizia il test"
              onClick={() => router.push("/dashboard/orientamento")}
              variant="primary"
            />
          </Card>

          <Card
            title="Verifica percorso agevolato"
            description="Hai già un titolo, esami universitari o esperienza lavorativa? Potresti accedere a una valutazione CFU e abbreviare il percorso."
          >
            <Button
              label="Verifica percorso"
              onClick={() => router.push("/dashboard/percorso-agevolato")}
              variant="primary"
            />
          </Card>

          <Card
            title="Studia mentre lavori"
            description="Scopri un piano realistico per studiare online senza stravolgere lavoro, turni e impegni personali."
          >
            <Button
              label="Crea piano studio"
              onClick={() => router.push("/dashboard/studio-lavoro")}
              variant="primary"
            />
          </Card>

          <Card
            title="Il tuo percorso più veloce"
            description="Visualizza il modo più rapido e sostenibile per arrivare al tuo obiettivo."
          >
            <Button
              label="Scopri percorso"
              onClick={() => router.push("/dashboard/percorso")}
              variant="primary"
            />
          </Card>
        </div>
      </section>

      <section style={{ marginTop: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 22 }}>Consigli e aggiornamenti</h2>

          {notifiche.length > 0 && (
            <span
              style={{
                fontSize: 13,
                padding: "5px 10px",
                borderRadius: 999,
                background: "#eef2ff",
                color: "#3730a3",
                fontWeight: 700,
              }}
            >
              {notifiche.length}
            </span>
          )}
        </div>

        {notifiche.length === 0 ? (
          <div
            style={{
              padding: 18,
              borderRadius: 16,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              color: "#555",
            }}
          >
            Nessun aggiornamento disponibile al momento.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {notifiche.map((notifica) => (
              <Card
                key={notifica.id}
                title={notifica.titolo}
                description={notifica.messaggio}
              >
                <small style={{ color: "#6b7280" }}>
                  {notifica.categoria} · {notifica.created_at}
                </small>
              </Card>
            ))}
          </div>
        )}
      </section>
      <BottomNav />
    </main>
  );
}
