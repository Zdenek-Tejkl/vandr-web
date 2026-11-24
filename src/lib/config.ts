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

// Odkazy na obchody. Dokud nejsou vyplněné, tlačítka ukazují "Brzy" a nikam nevedou.
//   NEXT_PUBLIC_APP_STORE_URL    https://apps.apple.com/cz/app/vandr/id0000000000
//   NEXT_PUBLIC_GOOGLE_PLAY_URL  https://play.google.com/store/apps/details?id=world.vandr.app
export const stores = {
  ios: httpsUrl(process.env.NEXT_PUBLIC_APP_STORE_URL),
  android: httpsUrl(process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL),
};

// Číslo aplikace v App Store (z odkazu .../id0000000000) pro lištu "Otevřít v App Store" v Safari.
export const appStoreId = (stores.ios.match(/\/id(\d+)/)?.[1] ?? "").slice(0, 20);

/** Aplikace jde stáhnout aspoň v jednom obchodě. */
export const isLive = Boolean(stores.ios || stores.android);

// Krátký odkaz ke stažení: podle zařízení přesměruje do správného obchodu (bio, QR kód, reklamy).
export const downloadPath = "/stahnout";
