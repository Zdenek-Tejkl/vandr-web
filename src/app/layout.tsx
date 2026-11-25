import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ClarityConsent } from "@/components/ClarityConsent";
import { site } from "@/lib/config";
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
    "sociální síť pro cestovatele",
    "aplikace na cestování",
    "mapa navštívených zemí",
    "tipy na cestování od kamarádů",
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
};

export const viewport: Viewport = {
  themeColor: "#1F4D3A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs" className={`${display.variable} ${body.variable}`}>
      <body>
        {children}
        <Analytics />
        <ClarityConsent />
      </body>
    </html>
  );
}
