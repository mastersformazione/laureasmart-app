"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalInit() {
  useEffect(() => {
    const initOneSignal = async () => {
      await OneSignal.init({
        appId: "0891eab9-f699-4229-aada-2185dfed9412",
        serviceWorkerPath: "/OneSignalSDKWorker.js",
        serviceWorkerParam: {
          scope: "/",
        },
        allowLocalhostAsSecureOrigin: true,
      });

      const storedUser = localStorage.getItem("gps_user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user?.email) {
        console.log("OneSignal: utente non presente");
        return;
      }

      // 🔥 STEP 1: IDENTIFICAZIONE UTENTE (FONDAMENTALE)
      await OneSignal.login(user.email);

      // 🔥 STEP 2: INVIO TAG COMPLETI
      await OneSignal.User.addTags({
        email: user.email,
        nome: user.nome || "",
        cognome: user.cognome || "",
        telefono: user.telefono || "",

        profilo: localStorage.getItem("profilo_utente") || "",
        titolo_studio: localStorage.getItem("titolo_studio") || "",
        obiettivo: localStorage.getItem("obiettivo") || "",
        area_interesse: localStorage.getItem("area_interesse") || "",

        segmento_intento: localStorage.getItem("segmento_intento") || "",
        segmento_ingresso: localStorage.getItem("segmento_ingresso") || "",
        segmento_urgenza: localStorage.getItem("segmento_urgenza") || "",
      });

      console.log("✅ OneSignal sincronizzato correttamente");
    };

    initOneSignal();
  }, []);

  return null;
}
