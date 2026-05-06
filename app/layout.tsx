import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import RegisterSW from "./register-sw";
import OneSignalInit from "./onesignal-init";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Laurea Smart",
  description: "Trova la laurea giusta senza perdere tempo.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon-512.png",
    apple: "/icon-512.png",
  },
  other: {
    "theme-color": "#1F6FB2",
  },
  appleWebApp: {
    capable: true,
    title: "Laurea Smart",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={`${sora.variable} antialiased`}>
        <RegisterSW />
        <OneSignalInit />
        {children}
      </body>
    </html>
  );
}
