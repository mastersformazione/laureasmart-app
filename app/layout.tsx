import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import RegisterSW from "./register-sw";
import OneSignalInit from "./onesignal-init";
import MetaPixelTracker from "./meta-pixel-tracker";

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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}
            (window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '2224392868096674');
            fbq('track', 'PageView');
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=TUO_PIXEL_ID&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <RegisterSW />
        <OneSignalInit />
        <MetaPixelTracker />

        {children}
      </body>
    </html>
  );
}
