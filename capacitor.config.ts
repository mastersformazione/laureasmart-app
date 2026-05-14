import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "it.laureasmart.app",
  appName: "Laurea Smart",
  webDir: "public",
  server: {
    url: "https://app.laureasmart.it",
    cleartext: false,
  },
};

export default config;
