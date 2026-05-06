import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import RegisterSW from "./register-sw";
import OneSignalInit from "./onesignal-init";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RegisterSW />
        <OneSignalInit />
        {children}
      </body>
    </html>
  );
}
