"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalInit() {
  useEffect(() => {
    OneSignal.init({
      appId: "4e27d453-4eac-4bca-8fb8-666a6f4e1459",
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
