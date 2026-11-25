import "server-only";
import { createHmac } from "node:crypto";
import { isProduction } from "./env";

// Ukládáme jen HMAC otisk IP adresy (kvůli limitu pokusů), nikdy samotnou IP.
export function ipHash(headers: Headers): string | null {
  const ip =
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null;
  if (!ip) return null;
  // V provozu je IP_HASH_SECRET povinný, záložní klíč jen pro vývoj.
  const secret = process.env.IP_HASH_SECRET;
  if (!secret && isProduction()) throw new Error("IP_HASH_SECRET is not set");
  return createHmac("sha256", secret || "vandr-dev").update(ip).digest("base64url").slice(0, 32);
}
