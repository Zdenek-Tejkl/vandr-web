// NEXT_PUBLIC_CONTROLLER="Název | IČO | adresa" jedním řádkem, nebo tři samostatné proměnné níže.
const controllerLine = (process.env.NEXT_PUBLIC_CONTROLLER || "").split("|").map((s) => s.trim());

export const site = {
  name: "Vandr",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://vandr.world").replace(/\/$/, ""),
  instagram: "https://www.instagram.com/vandr.world/",
  tiktok: "https://www.tiktok.com/@vandr.world",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "ahoj@vandr.world",
  // Správce osobních údajů. Před spuštěním doplnit název firmy, IČO a adresu (viz README).
  controller: {
    name: controllerLine[0] || process.env.NEXT_PUBLIC_CONTROLLER_NAME || "tým Vandr",
    id: controllerLine[1] || process.env.NEXT_PUBLIC_CONTROLLER_ID || "",
    address: controllerLine.slice(2).join(", ") || process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS || "",
  },
};

const httpsUrl = (v: string | undefined) => (v && /^https:\/\/\S+$/.test(v.trim()) ? v.trim() : "");

// Výpis aplikace na Google Play (applicationId world.vandr.app). Platí, i když proměnná chybí.
export const googlePlayDefault = "https://play.google.com/store/apps/details?id=world.vandr.app";

// Odkazy na obchody.
//   NEXT_PUBLIC_GOOGLE_PLAY_URL  jiný odkaz na Google Play (nepovinné, výchozí je googlePlayDefault)
//   NEXT_PUBLIC_APP_STORE_URL    https://apps.apple.com/cz/app/vandr/id0000000000
// Dokud App Store prázdný, dostane iPhone místo tlačítka waiting list (majitel 26. 11. 2026:
// „waiting list potřebujeme jen pro Apple aplikace“).
export const stores = {
  ios: httpsUrl(process.env.NEXT_PUBLIC_APP_STORE_URL),
  android: httpsUrl(process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL) || googlePlayDefault,
};

// Číslo aplikace v App Store (z odkazu .../id0000000000) pro lištu "Otevřít v App Store" v Safari.
export const appStoreId = (stores.ios.match(/\/id(\d+)/)?.[1] ?? "").slice(0, 20);

/** Aplikace jde stáhnout aspoň v jednom obchodě. */
export const isLive = Boolean(stores.ios || stores.android);

/** iPhone zatím nemá kde stáhnout: místo App Store nabízíme waiting list. */
export const iosWaitlist = !stores.ios;

// Krátký odkaz ke stažení: podle zařízení přesměruje do správného obchodu (bio, QR kód, reklamy).
export const downloadPath = "/stahnout";

// Zařízení návštěvy. Ukládá se k návštěvě a k zápisu na waiting list (sloupec variant,
// dřív písmeno A/B testu nadpisu). Zápis na waiting list je vždy "ios".
export const platforms = ["ios", "android", "other"] as const;
export type VisitPlatform = (typeof platforms)[number];

export function isPlatform(v: unknown): v is VisitPlatform {
  return typeof v === "string" && (platforms as readonly string[]).includes(v);
}

// Potvrzovací e-maily se posílají jen s nastaveným Resendem (jen na serveru).
export const emailEnabled = () => Boolean(process.env.RESEND_API_KEY);
