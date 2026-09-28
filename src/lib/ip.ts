import "server-only";
import { createHmac } from "node:crypto";

// Ukládáme jen HMAC otisk IP adresy (kvůli limitu pokusů), nikdy samotnou IP.
export function ipHash(headers: Headers): string | null {
  const ip =
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null;
  if (!ip) return null;
  const secret = process.env.IP_HASH_SECRET || process.env.SUPABASE_SECRET_KEY || "vandr-dev";
  return createHmac("sha256", secret).update(ip).digest("base64url").slice(0, 32);
}
