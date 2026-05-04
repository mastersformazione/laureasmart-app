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

    const loadNotifiche = () => {
      fetch("https://graduatoriegps.it/api/notifiche.php?t=" + Date.now(), {
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setNotifiche(data.data);
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
      <h1>Dashboard Graduatorie GPS</h1>

      <p>Benvenuto {user.nome} 👋</p>

      <div
        style={{ marginTop: 24, marginBottom: 24, display: "grid", gap: 12 }}
      >
        <Card
          title="Strumenti per te"
          description="Scegli uno strumento utile per orientarti nel mondo della scuola, dei corsi universitari e della crescita professionale."
        >
          <Button
            label="Trova la tua strada"
            onClick={() => router.push("/dashboard/orientamento")}
            variant="secondary"
          />

          <p style={{ margin: "10px 0 0", color: "#555", lineHeight: 1.5 }}>
            Rispondi a poche domande e scopri quale percorso di studio o
            formazione può essere più adatto al tuo obiettivo.
          </p>
        </Card>

        <Card
          title="Il tuo percorso più veloce"
          description="Scopri il modo più rapido e realistico per raggiungere il tuo obiettivo."
          onClick={() => router.push("/dashboard/percorso")}
        />
      </div>

      <h2>Ultimi aggiornamenti</h2>

      {notifiche.length === 0 ? (
        <p>Nessuna notifica disponibile al momento.</p>
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
