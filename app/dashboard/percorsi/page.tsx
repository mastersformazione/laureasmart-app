"use client";

import { useEffect, useState } from "react";
import { getPercorsiVisibili, Percorso } from "@/lib/data/percorsi";

type InteresseStorage = {
  settori: Record<string, number>;
  tags: Record<string, number>;
  percorsi: Record<string, number>;
};

const nomiSettori: Record<string, string> = {
  tutti: "Tutti",
  giuridico: "Giuridica",
  politico_sociale: "Politico-sociale",
  psicologia: "Psicologia",
  scienze_motorie: "Scienze motorie",
  comunicazione: "Comunicazione",
  educazione: "Educazione",
  turismo: "Turismo",
  biologia: "Biologia",
  lingue: "Lingue",
  lettere_arte_spettacolo: "Lettere, arte e spettacolo",
  informatica_ingegneria: "Informatica",
  ingegneria_industriale: "Ingegneria industriale",
  ingegneria_civile: "Ingegneria civile",
  economia: "Economia",
  design_moda: "Design e moda",
};

export default function PercorsiPage() {
  const [titoloStudio, setTitoloStudio] = useState("diploma");
  const [messaggio, setMessaggio] = useState("");
  const [settoreAttivo, setSettoreAttivo] = useState("tutti");
  const [interessi, setInteressi] = useState<InteresseStorage>({
    settori: {},
    tags: {},
    percorsi: {},
  });

  useEffect(() => {
    const profiloSalvato = localStorage.getItem("profilo_utente");

    if (profiloSalvato) {
      try {
        const profilo = JSON.parse(profiloSalvato);

        if (profilo.titoloStudio) {
          setTitoloStudio(profilo.titoloStudio);
        }
      } catch {
        setTitoloStudio("diploma");
      }
    }

    const datiSalvati = localStorage.getItem("interessi_percorsi");

    if (datiSalvati) {
      try {
        setInteressi(JSON.parse(datiSalvati));
      } catch {
        setInteressi({
          settori: {},
          tags: {},
          percorsi: {},
        });
      }
    }
  }, []);

  const percorsi = getPercorsiVisibili(titoloStudio);

  const settoriDisponibili = [
    "tutti",
    ...Array.from(new Set(percorsi.map((percorso) => percorso.settore))),
  ];

  const percorsiFiltrati =
    settoreAttivo === "tutti"
      ? percorsi
      : percorsi.filter((percorso) => percorso.settore === settoreAttivo);

  const percorsiOrdinati = [...percorsiFiltrati].sort((a, b) => {
    const scoreSettoreA = interessi.settori[a.settore] || 0;
    const scoreSettoreB = interessi.settori[b.settore] || 0;

    const scorePercorsoA = interessi.percorsi[a.id] || 0;
    const scorePercorsoB = interessi.percorsi[b.id] || 0;

    const scoreA = scoreSettoreA + scorePercorsoA + a.prioritaCommerciale;
    const scoreB = scoreSettoreB + scorePercorsoB + b.prioritaCommerciale;

    return scoreB - scoreA;
  });

  function getPercorsiSimili(percorsoCorrente: Percorso) {
    return percorsi
      .filter((altroPercorso) => altroPercorso.id !== percorsoCorrente.id)
      .map((altroPercorso) => {
        const stessoSettore =
          altroPercorso.settore === percorsoCorrente.settore ? 3 : 0;

        const tagInComune = altroPercorso.tags.filter((tag) =>
          percorsoCorrente.tags.includes(tag)
        ).length;

        const score = stessoSettore + tagInComune;

        return {
          percorso: altroPercorso,
          score,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.percorso);
  }

  function inviaInteresseAlBackend(percorso: Percorso) {
    try {
      const profiloSalvato = localStorage.getItem("gps_user");
      const profilo = profiloSalvato ? JSON.parse(profiloSalvato) : null;

      fetch("https://laureasmart.it/api/salva-interesse-percorso.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: profilo?.email || null,
          percorso_id: percorso.id,
          percorso_titolo: percorso.titolo,
          settore: percorso.settore,
          tags: percorso.tags,
          action_type: "click",
        }),
      }).catch((error) => {
        console.error("Errore salvataggio interesse percorso:", error);
      });
    } catch (error) {
      console.error("Errore preparazione salvataggio interesse:", error);
    }
  }

  function registraInteresse(percorso: Percorso) {
    const nuoviInteressi: InteresseStorage = {
      settori: { ...interessi.settori },
      tags: { ...interessi.tags },
      percorsi: { ...interessi.percorsi },
    };

    nuoviInteressi.settori[percorso.settore] =
      (nuoviInteressi.settori[percorso.settore] || 0) + 1;

    nuoviInteressi.percorsi[percorso.id] =
      (nuoviInteressi.percorsi[percorso.id] || 0) + 1;

    percorso.tags.forEach((tag) => {
      nuoviInteressi.tags[tag] = (nuoviInteressi.tags[tag] || 0) + 1;
    });

    localStorage.setItem("interessi_percorsi", JSON.stringify(nuoviInteressi));

    setInteressi(nuoviInteressi);
    setMessaggio(`Interesse registrato per ${percorso.titolo}`);

    inviaInteresseAlBackend(percorso);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-2">Percorsi consigliati</h1>

      <p className="text-gray-600 mb-2">
        In base al tuo titolo di studio, questi sono i percorsi più adatti da
        valutare.
      </p>

      <p className="text-sm text-gray-500 mb-4">
        Titolo rilevato: <strong>{titoloStudio}</strong>
      </p>

      <div className="mb-5 overflow-x-auto">
        <div className="flex gap-2 pb-1">
          {settoriDisponibili.map((settore) => (
            <button
              key={settore}
              onClick={() => setSettoreAttivo(settore)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm ${
                settoreAttivo === settore
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {nomiSettori[settore] || settore}
            </button>
          ))}
        </div>
      </div>

      {messaggio && (
        <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-700">
          {messaggio}
        </div>
      )}

      <div className="mb-4 text-sm text-gray-500">
        Percorsi mostrati: <strong>{percorsiOrdinati.length}</strong>
      </div>

      <div className="space-y-4">
        {percorsiOrdinati.map((percorso) => {
          const percorsiSimili = getPercorsiSimili(percorso);

          return (
            <div
              key={percorso.id}
              className="rounded-2xl bg-white p-4 shadow-sm border"
            >
              <p className="text-sm text-gray-500">{percorso.classe}</p>

              <h2 className="text-lg font-semibold">{percorso.titolo}</h2>

              <p className="text-sm text-gray-600 mt-1">
                Durata: {percorso.durata}
              </p>

              <div className="mt-3">
                <h3 className="font-medium">Sbocchi principali</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  {percorso.sbocchi.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3">
                <h3 className="font-medium">Se vuoi proseguire</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  {percorso.prosecuzione.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              {percorsiSimili.length > 0 && (
                <div className="mt-4 rounded-xl bg-gray-50 p-3">
                  <h3 className="text-sm font-semibold mb-2">
                    Percorsi simili
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {percorsiSimili.map((simile) => (
                      <button
                        key={simile.id}
                        onClick={() => registraInteresse(simile)}
                        className="rounded-full bg-white border px-3 py-2 text-xs text-gray-700"
                      >
                        {simile.titolo}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => registraInteresse(percorso)}
                className="mt-4 w-full rounded-xl bg-black text-white py-3"
              >
                Mi interessa
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
