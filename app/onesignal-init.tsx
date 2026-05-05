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
    }).then(async () => {
      const storedUser = localStorage.getItem("gps_user");

      if (!storedUser) return;

      const user = JSON.parse(storedUser);

      if (user?.email) {
        // 🔴 QUESTO È IL PASSAGGIO CRITICO
        await OneSignal.login(user.email);

        console.log("OneSignal login OK:", user.email);
      }

      const profilo = localStorage.getItem("profilo_utente");

      if (profilo) {
        OneSignal.User.addTag("profilo", profilo);
      }
    });
  }, []);

  return null;
}
