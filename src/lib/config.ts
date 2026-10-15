// NEXT_PUBLIC_CONTROLLER="Název | IČO | adresa" jedním řádkem, nebo tři samostatné proměnné níže.
const controllerLine = (process.env.NEXT_PUBLIC_CONTROLLER || "").split("|").map((s) => s.trim());

export const site = {
  name: "Vandr",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://vandr.world").replace(/\/$/, ""),
  instagram: "https://www.instagram.com/vandr.world/",
  tiktok: "https://www.tiktok.com/@vandr.world",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "ahoj@vandr.world",
  // Správce osobních údajů. Do spuštění doplnit název firmy, IČO a adresu (viz README).
  controller: {
    name: controllerLine[0] || process.env.NEXT_PUBLIC_CONTROLLER_NAME || "tým Vandr",
    id: controllerLine[1] || process.env.NEXT_PUBLIC_CONTROLLER_ID || "",
    address: controllerLine.slice(2).join(", ") || process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS || "",
  },
};

export const variants = ["a", "b", "c"] as const;
export type Variant = (typeof variants)[number];

export function isVariant(v: unknown): v is Variant {
  return typeof v === "string" && (variants as readonly string[]).includes(v);
}

export const defaultVariant: Variant = isVariant(process.env.NEXT_PUBLIC_HEADLINE)
  ? process.env.NEXT_PUBLIC_HEADLINE
  : "a";

// Krátký odkaz pro kamarády: vandr.world/r/KOD
export function shareUrl(code: string) {
  return `${site.url}/r/${encodeURIComponent(code)}`;
}

// Potvrzovací e-maily se posílají jen s nastaveným Resendem (jen na serveru).
export const emailEnabled = () => Boolean(process.env.RESEND_API_KEY);
