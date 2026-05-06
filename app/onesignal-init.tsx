"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

type StoredUser = {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
};

export default function OneSignalInit() {
  useEffect(() => {
    OneSignal.init({
      appId: "0891eab9-f699-4229-aada-2185dfed9412",
      serviceWorkerPath: "/OneSignalSDKWorker.js",
      serviceWorkerParam: {
        scope: "/",
      },
      allowLocalhostAsSecureOrigin: true,
    }).then(async () => {
      const storedUser = localStorage.getItem("gps_user");

      if (!storedUser) return;

      const user = JSON.parse(storedUser) as StoredUser;

      if (user?.email) {
        await OneSignal.login(user.email);

        await OneSignal.User.addTag("email", user.email);
        await OneSignal.User.addTag("nome", user.nome || "");
        await OneSignal.User.addTag("cognome", user.cognome || "");
        await OneSignal.User.addTag("telefono", user.telefono || "");

        console.log("OneSignal login OK:", user.email);
      }

      const profilo = localStorage.getItem("profilo_utente");
      const titoloStudio = localStorage.getItem("titolo_studio");
      const obiettivo = localStorage.getItem("obiettivo");
      const urgenzaObiettivo = localStorage.getItem("urgenza_obiettivo");
      const tempoDisponibile = localStorage.getItem("tempo_disponibile");
      const areaInteresse = localStorage.getItem("area_interesse");

      const segmentoIntento = localStorage.getItem("segmento_intento");
      const segmentoIngresso = localStorage.getItem("segmento_ingresso");
      const segmentoUrgenza = localStorage.getItem("segmento_urgenza");

      if (profilo) {
        await OneSignal.User.addTag("profilo", profilo);
      }

      if (titoloStudio) {
        await OneSignal.User.addTag("titolo_studio", titoloStudio);
      }

      if (obiettivo) {
        await OneSignal.User.addTag("obiettivo", obiettivo);
      }

      if (urgenzaObiettivo) {
        await OneSignal.User.addTag("urgenza_obiettivo", urgenzaObiettivo);
      }

      if (tempoDisponibile) {
        await OneSignal.User.addTag("tempo_disponibile", tempoDisponibile);
      }

      if (areaInteresse) {
        await OneSignal.User.addTag("area_interesse", areaInteresse);
      }

      if (segmentoIntento) {
        await OneSignal.User.addTag("segmento_intento", segmentoIntento);
      }

      if (segmentoIngresso) {
        await OneSignal.User.addTag("segmento_ingresso", segmentoIngresso);
      }

      if (segmentoUrgenza) {
        await OneSignal.User.addTag("segmento_urgenza", segmentoUrgenza);
      }

      console.log("OneSignal tag sincronizzati");
    });
  }, []);

  return null;
}
