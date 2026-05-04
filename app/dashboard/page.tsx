"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

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
      fetch("https://graduatoriegps.it/api/notifiche.php?t=" + Date.now(), {
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
        padding: 20,
        fontFamily: "Arial",
        maxWidth: 500,
        margin: "0 auto",
      }}
    >
      <h1>Laurea Smart</h1>

      <p style={{ lineHeight: 1.5 }}>
        Ciao {user.nome} 👋
        <br />
        Scopri il percorso universitario online più adatto alla tua vita, al tuo
        lavoro e al tuo obiettivo.
      </p>

      <div
        style={{ marginTop: 24, marginBottom: 24, display: "grid", gap: 12 }}
      >
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
          onClick={() => router.push("/dashboard/percorso-agevolato")}
        />

        <Card
          title="Studia mentre lavori"
          description="Scopri un piano realistico per studiare online senza stravolgere lavoro, turni e impegni personali."
          onClick={() => router.push("/dashboard/studio-lavoro")}
        />

        <Card
          title="Il tuo percorso più veloce"
          description="Visualizza il modo più rapido e sostenibile per arrivare al tuo obiettivo."
          onClick={() => router.push("/dashboard/percorso")}
        />
      </div>

      <h2>Consigli e aggiornamenti per te</h2>

      {notifiche.length === 0 ? (
        <p>Nessun aggiornamento disponibile al momento.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {notifiche.map((notifica) => (
            <Card
              key={notifica.id}
              title={notifica.titolo}
              description={notifica.messaggio}
            >
              <small>
                {notifica.categoria} · {notifica.created_at}
              </small>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
