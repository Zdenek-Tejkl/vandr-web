// Stažení aplikace: které zařízení, který obchod a jak do odkazu dostat zdroj návštěvy.
// Čistá logika bez závislostí, používá ji stránka i /stahnout. Test: npm test

export type Platform = "ios" | "android" | "other";
export type Stores = { ios: string; android: string };
export type Utm = { source?: string | null; medium?: string | null; campaign?: string | null; content?: string | null };

export function platformOf(userAgent: string | null | undefined): Platform {
  const ua = userAgent ?? "";
  // iPadOS se hlásí jako Macintosh, ale s dotykem (to ví jen prohlížeč, na serveru je to "other").
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

const short = (v: string | null | undefined, max: number) => (v ?? "").trim().replace(/[^\w.\-]+/g, "_").slice(0, max);

export function utmFrom(params: URLSearchParams): Utm {
  return {
    source: params.get("utm_source"),
    medium: params.get("utm_medium"),
    campaign: params.get("utm_campaign"),
    content: params.get("utm_content"),
  };
}

/**
 * Odkaz do obchodu se zdrojem návštěvy.
 *   Google Play: parametr referrer (utm_source=...&utm_campaign=...), čte ho Play Install Referrer.
 *   App Store: parametr ct (campaign token, nejvýš 40 znaků), je vidět v App Analytics.
 * Bez odkazu na obchod vrací null.
 */
export function storeUrl(platform: Exclude<Platform, "other">, stores: Stores, utm: Utm = {}): string | null {
  const base = platform === "ios" ? stores.ios : stores.android;
  if (!base) return null;
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    return null;
  }
  const source = short(utm.source, 40);
  const medium = short(utm.medium, 40);
  const campaign = short(utm.campaign, 40);
  const content = short(utm.content, 40);
  if (platform === "android") {
    const ref = new URLSearchParams();
    ref.set("utm_source", source || "web");
    ref.set("utm_medium", medium || "vandr.world");
    if (campaign) ref.set("utm_campaign", campaign);
    if (content) ref.set("utm_content", content);
    url.searchParams.set("referrer", ref.toString());
  } else {
    const token = [source, campaign || content].filter(Boolean).join("-").slice(0, 40);
    url.searchParams.set("ct", token || "web");
  }
  return url.toString();
}

/** Kam poslat návštěvníka z /stahnout: do jeho obchodu, jinak na stránku k výběru (počítač, obchod chybí). */
export function downloadTarget(userAgent: string | null | undefined, stores: Stores, utm: Utm = {}): string {
  const platform = platformOf(userAgent);
  const direct = platform === "other" ? null : storeUrl(platform, stores, utm);
  return direct ?? "/#stahnout";
}
