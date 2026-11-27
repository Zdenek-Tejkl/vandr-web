import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ClarityConsent } from "@/components/ClarityConsent";
import { appStoreId, site } from "@/lib/config";
import { copy } from "@/lib/copy";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: copy.title,
  description: copy.description,
  keywords: [
    "vandr",
    "aplikace na cestování",
    "plánovač cest",
    "cestovní deník",
    "mapa navštívených zemí",
    "skryté poklady",
    "vandr android",
  ],
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: site.name,
    url: "/",
    title: copy.title,
    description: copy.description,
  },
  twitter: { card: "summary_large_image", title: copy.title, description: copy.description },
  formatDetection: { email: false, telephone: false, address: false },
  // Safari na iPhonu ukáže nahoře lištu "Otevřít v App Store" (až bude aplikace v obchodě).
  ...(appStoreId ? { itunes: { appId: appStoreId } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#1F4D3A",
  width: "device-width",
  initialScale: 1,
};

// Zařízení do html[data-os] ještě před vykreslením: iPhone dostane waiting list, Android odznak
// Google Play, počítač oboje a QR kód (třídy os-* v globals.css). Stránka tak zůstane statická
// a nic neproblikne. iPad se hlásí jako Mac, pozná se podle dotyku. Bez skriptu verze pro počítač.
const osScript = `try{var u=navigator.userAgent,d=document.documentElement;d.dataset.os=/iPhone|iPad|iPod/.test(u)||(/Macintosh/.test(u)&&navigator.maxTouchPoints>1)?"ios":/Android/.test(u)?"android":"other"}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: osScript }} />
      </head>
      <body>
        {children}
        <Analytics />
        <ClarityConsent />
      </body>
    </html>
  );
}
