export const site = {
  name: "Vandr",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://vandr.world").replace(/\/$/, ""),
  instagram: "https://www.instagram.com/vandr.world/",
  tiktok: "https://www.tiktok.com/@vandr.world",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "ahoj@vandr.world",
  // Správce osobních údajů. Do spuštění doplnit název firmy, IČO a adresu (viz README).
  controller: {
    name: process.env.NEXT_PUBLIC_CONTROLLER_NAME || "tým Vandr",
    id: process.env.NEXT_PUBLIC_CONTROLLER_ID || "",
    address: process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS || "",
  },
  // Počítadlo se ukáže až od tohoto počtu lidí na seznamu.
  counterMin: Number(process.env.NEXT_PUBLIC_COUNTER_MIN || 50),
};

export const variants = ["a", "b", "c"] as const;
export type Variant = (typeof variants)[number];

export function isVariant(v: unknown): v is Variant {
  return typeof v === "string" && (variants as readonly string[]).includes(v);
}

export const defaultVariant: Variant = isVariant(process.env.NEXT_PUBLIC_HEADLINE)
  ? process.env.NEXT_PUBLIC_HEADLINE
  : "a";

export function shareUrl(code: string) {
  return `${site.url}/?ref=${encodeURIComponent(code)}`;
}
