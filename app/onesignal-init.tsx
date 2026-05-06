"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

type StoredUser = {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function OneSignalInit() {
  useEffect(() => {
    const initOneSignal = async () => {
      try {
        await OneSignal.init({
          appId: "0891eab9-f699-4229-aada-2185dfed9412",
          serviceWorkerPath: "/OneSignalSDKWorker.js",
          serviceWorkerParam: {
            scope: "/",
          },
          allowLocalhostAsSecureOrigin: true,
        });

        const storedUser = localStorage.getItem("gps_user");

        if (!storedUser) {
          console.log("OneSignal: nessun utente in localStorage");
          return;
        }

        const user = JSON.parse(storedUser) as StoredUser;

        if (!user?.email) {
          console.log("OneSignal: email utente mancante");
          return;
        }

        await OneSignal.login(user.email);

        console.log("OneSignal login OK:", user.email);

        await wait(1500);

        const tags: Record<string, string> = {
          email: user.email,
          nome: user.nome || "",
          cognome: user.cognome || "",
          telefono: user.telefono || "",

          profilo: localStorage.getItem("profilo_utente") || "",
          titolo_studio: localStorage.getItem("titolo_studio") || "",
          obiettivo: localStorage.getItem("obiettivo") || "",
          urgenza_obiettivo: localStorage.getItem("urgenza_obiettivo") || "",
          tempo_disponibile: localStorage.getItem("tempo_disponibile") || "",
          area_interesse: localStorage.getItem("area_interesse") || "",

          segmento_intento: localStorage.getItem("segmento_intento") || "",
          segmento_ingresso: localStorage.getItem("segmento_ingresso") || "",
          segmento_urgenza: localStorage.getItem("segmento_urgenza") || "",
        };

        Object.entries(tags).forEach(([key, value]) => {
          console.log("TAG DA INVIARE:", key, value);
        });

        await OneSignal.User.addTags(tags);

        console.log("OneSignal tag sincronizzati:", tags);
      } catch (error) {
        console.error("Errore OneSignal init/tag:", error);
      }
    };

    initOneSignal();
  }, []);

  return null;
}
