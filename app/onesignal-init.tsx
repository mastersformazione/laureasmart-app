"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalInit() {
  useEffect(() => {
    OneSignal.init({
      appId: "0891eab9-f699-4229-aada-2185dfed9412",
      serviceWorkerPath: "/OneSignalSDKWorker.js",
      serviceWorkerParam: {
        scope: "/",
      },
      allowLocalhostAsSecureOrigin: true,
    }).then(() => {
      // 👉 quando OneSignal è pronto
      const profilo = localStorage.getItem("profilo_utente");

      if (profilo) {
        OneSignal.User.addTag("profilo", profilo);
        console.log("Tag OneSignal salvato:", profilo);
      }
    });
  }, []);

  return null;
}
