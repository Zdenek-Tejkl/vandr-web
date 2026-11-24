// Stejné pravidlo jako v databázi (vandr.waitlist_join).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

// Klíč pro hledání duplicit, stejně jako vandr.waitlist_email_key: Gmail bez teček, bez +štítku.
export function emailKey(value: string) {
  const email = normalizeEmail(value);
  const at = email.lastIndexOf("@");
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const base = local.split("+")[0] || local;
  if (domain === "gmail.com" || domain === "googlemail.com") return `${base.replaceAll(".", "")}@gmail.com`;
  return `${base}@${domain}`;
}

export function isValidEmail(value: string) {
  const email = normalizeEmail(value);
  return email.length <= 254 && EMAIL_RE.test(email);
}

export function clean(value: unknown, max = 64): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim().slice(0, max);
  return v === "" ? null : v;
}
