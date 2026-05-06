"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import BottomNav from "@/components/ui/BottomNav";
import type { Percorso } from "@/lib/data/percorsi";

export default function PreferitiPage() {
  const [preferiti, setPreferiti] = useState<Percorso[]>([]);

  useEffect(() => {
    const datiSalvati = localStorage.getItem("percorsi_preferiti");

    if (datiSalvati) {
      try {
        setPreferiti(JSON.parse(datiSalvati));
      } catch {
        setPreferiti([]);
      }
    }
  }, []);

  function rimuoviPreferito(id: string) {
    const nuoviPreferiti = preferiti.filter((item) => item.id !== id);

    setPreferiti(nuoviPreferiti);
    localStorage.setItem("percorsi_preferiti", JSON.stringify(nuoviPreferiti));
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 pb-[120px]">
      <h1 className="text-2xl font-bold mb-2">I miei percorsi</h1>

      <p className="text-gray-600 mb-6">
        Qui trovi i percorsi che hai salvato cliccando su “Mi interessa”.
      </p>

      {preferiti.length === 0 ? (
        <Card
          title="Nessun percorso salvato"
          description="Quando trovi un corso interessante, clicca su “Mi interessa” per salvarlo qui."
          badge="Preferiti"
        />
      ) : (
        <div className="space-y-4">
          {preferiti.map((percorso) => (
            <Card
              key={percorso.id}
              title={percorso.titolo}
              description={`Durata: ${percorso.durata}`}
              badge={percorso.classe}
              icon={percorso.classe.replace("L-", "L")}
            >
              <p className="text-sm text-gray-500 mb-3">
                Area: <strong>{percorso.settore}</strong>
              </p>

              <button
                onClick={() => rimuoviPreferito(percorso.id)}
                className="mt-3 w-full rounded-2xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700"
              >
                Rimuovi dai preferiti
              </button>
            </Card>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
