// Stejné pravidlo jako v databázi (vandr.waitlist_join).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
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
