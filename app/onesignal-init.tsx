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

        console.log("OneSignal inizializzato");

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

        const hasPermission = OneSignal.Notifications.permission === true;

        if (!hasPermission) {
          console.log(
            "OneSignal: permesso notifiche non ancora concesso. Login rimandato."
          );
          return;
        }

        await OneSignal.login(user.email.toLowerCase().trim());

        console.log("OneSignal login OK:", user.email);
      } catch (error) {
        console.error("Errore OneSignal init/login:", error);
      }
    };

    initOneSignal();
  }, []);

  return null;
}
