import "server-only";
import { resolve4, resolveMx } from "node:dns/promises";

// Ověření, že e-mail může existovat: správný tvar, ne jednorázová schránka,
// a doména umí přijímat poštu (má MX nebo aspoň A záznam).

const DISPOSABLE = new Set([
  "mailinator.com", "10minutemail.com", "10minutemail.net", "guerrillamail.com", "guerrillamail.net",
  "sharklasers.com", "yopmail.com", "yopmail.fr", "temp-mail.org", "tempmail.com", "tempmail.net",
  "throwawaymail.com", "trashmail.com", "trashmail.me", "getnada.com", "dispostable.com",
  "mailnesia.com", "maildrop.cc", "fakeinbox.com", "mohmal.com", "emailondeck.com", "mintemail.com",
  "tempr.email", "discard.email", "spamgourmet.com", "mailcatch.com", "jetable.org", "burnermail.io",
  "tempmailo.com", "moakt.com", "inboxkitten.com", "crazymailing.com", "tmpmail.org", "tmpmail.net",
]);

// Časté překlepy domén, ať nezapisujeme e-mail, který nikdy nedojde.
const TYPOS: Record<string, string> = {
  "gmail.cz": "gmail.com", "gmial.com": "gmail.com", "gmal.com": "gmail.com", "gamil.com": "gmail.com",
  "gmail.con": "gmail.com", "gmail.co": "gmail.com", "gmaill.com": "gmail.com", "gmail.comm": "gmail.com",
  "seznam.cy": "seznam.cz", "seznam.cz.cz": "seznam.cz", "sezam.cz": "seznam.cz", "seznma.cz": "seznam.cz",
  "senam.cz": "seznam.cz", "seznam.com": "seznam.cz", "email.cy": "email.cz", "centrum.cy": "centrum.cz",
  "hotmail.con": "hotmail.com", "hotmial.com": "hotmail.com", "outlook.con": "outlook.com", "icloud.con": "icloud.com",
};

export type EmailCheck = { ok: true } | { ok: false; reason: "invalid" | "disposable" | "typo" | "no_mx"; suggestion?: string };

const cache = new Map<string, { ok: boolean; until: number }>();

async function domainAcceptsMail(domain: string): Promise<boolean> {
  const hit = cache.get(domain);
  if (hit && hit.until > Date.now()) return hit.ok;
  let ok = false;
  try {
    const mx = await Promise.race([resolveMx(domain), new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 3000))]);
    ok = mx.length > 0 && mx.some((m) => m.exchange && m.exchange !== ".");
  } catch {
    try {
      const a = await Promise.race([resolve4(domain), new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 3000))]);
      ok = a.length > 0;
    } catch {
      ok = false;
    }
  }
  cache.set(domain, { ok, until: Date.now() + (ok ? 6 : 1) * 60 * 60 * 1000 });
  return ok;
}

export async function checkEmail(email: string): Promise<EmailCheck> {
  const at = email.lastIndexOf("@");
  if (at < 1) return { ok: false, reason: "invalid" };
  const domain = email.slice(at + 1).toLowerCase();
  if (TYPOS[domain]) return { ok: false, reason: "typo", suggestion: `${email.slice(0, at)}@${TYPOS[domain]}` };
  if (DISPOSABLE.has(domain)) return { ok: false, reason: "disposable" };
  // Když DNS selže (výpadek), zápis raději pustíme, než abychom ztratili člověka.
  try {
    if (!(await domainAcceptsMail(domain))) return { ok: false, reason: "no_mx" };
  } catch {
    return { ok: true };
  }
  return { ok: true };
}
