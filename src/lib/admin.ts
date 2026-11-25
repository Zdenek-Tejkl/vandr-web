import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "node:crypto";

// Administrace webu (/admin). Přihlášení přes Supabase Auth (stejný účet jako v aplikaci),
// pustí se jen účty v tabulce public.admini. Relace je vlastní podepsaná cookie (12 hodin),
// data čte server tajným klíčem, prohlížeč k databázi přístup nemá.

export const ADMIN_COOKIE = "vandr_admin";
const SESSION_HOURS = 12;
// Publikovatelný klíč je veřejný (je i v aplikaci), slouží jen k přihlášení.
const PUBLISHABLE =
  process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_l9O6G5ldcwcYixVOn1Xq9w_kJjdgCsg";

const url = () => process.env.SUPABASE_URL || "";
const secret = () => process.env.SUPABASE_SECRET_KEY || "";

const service = (schema: "vandr" | "public") =>
  createClient(url(), secret(), { db: { schema }, auth: { persistSession: false, autoRefreshToken: false } });

export const adminConfigured = () => Boolean(url() && secret());

const sign = (payload: string) => createHmac("sha256", `vandr-admin:${secret()}`).update(payload).digest("base64url");

export function makeSession(userId: string) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_HOURS * 3600;
  const payload = `${userId}.${exp}`;
  return { value: `${payload}.${sign(payload)}`, maxAge: SESSION_HOURS * 3600 };
}

function readSession(value: string | undefined): string | null {
  if (!value || !secret()) return null;
  const [userId, exp, sig] = value.split(".");
  if (!userId || !exp || !sig) return null;
  const good = Buffer.from(sign(`${userId}.${exp}`));
  const got = Buffer.from(sig);
  if (good.length !== got.length || !timingSafeEqual(good, got)) return null;
  if (Number(exp) < Date.now() / 1000) return null;
  return userId;
}

async function isAdmin(userId: string) {
  const { data, error } = await service("public").from("admini").select("user_id").eq("user_id", userId).maybeSingle();
  if (error) throw new Error(`admini: ${error.message}`);
  return Boolean(data);
}

/** Přihlášení e-mailem a heslem. Vrací id uživatele, jen když je admin. */
export async function signIn(email: string, password: string): Promise<string | null> {
  if (!adminConfigured()) return null;
  const auth = createClient(url(), PUBLISHABLE, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await auth.auth.signInWithPassword({ email, password });
  if (error || !data.user) return null;
  void auth.auth.signOut();
  return (await isAdmin(data.user.id)) ? data.user.id : null;
}

/** Id admina z cookie, nebo null. Admin práva se ověřují při každém načtení. */
export async function currentAdmin(cookie: string | undefined) {
  const userId = readSession(cookie);
  if (!userId) return null;
  return (await isAdmin(userId)) ? userId : null;
}

export type WaitlistRow = {
  email: string;
  created_at: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  referral_count: number | null;
  utm_source: string | null;
  variant: string | null;
  next_destination: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function count(table: string, filter?: (q: any) => any) {
  let q = service("vandr").from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count: n, error } = await q;
  if (error) return null;
  return n ?? 0;
}

export async function overview() {
  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
  const [users, usersWeek, userPosts, vandrGems, wikidata, trips, plans, messages, waitlist] = await Promise.all([
    count("profiles", (q) => q.eq("is_official", false)),
    count("profiles", (q) => q.eq("is_official", false).gte("created_at", weekAgo)),
    count("posts", (q) => q.is("source", null)),
    count("posts", (q) => q.eq("source", "vandr")),
    count("posts", (q) => q.eq("source", "wikidata")),
    count("trips"),
    count("plans"),
    count("messages"),
    service("vandr")
      .from("waitlist")
      .select("email,created_at,confirmed_at,unsubscribed_at,referral_count,utm_source,variant,next_destination")
      .order("created_at", { ascending: false })
      .limit(500),
  ]);
  return {
    stats: { users, usersWeek, userPosts, vandrGems, wikidata, trips, plans, messages },
    waitlist: (waitlist.data ?? []) as WaitlistRow[],
    waitlistError: waitlist.error?.message ?? null,
  };
}
