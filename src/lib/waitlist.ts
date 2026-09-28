import "server-only";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

// Databáze: Supabase, schéma "vandr" (oddělené od ostatních projektů).
// Bez SUPABASE_URL a SUPABASE_SECRET_KEY běží web v demo režimu s daty v paměti.

type RawJoin = {
  status: "created" | "exists" | "invalid" | "rate_limited" | "error";
  position?: number;
  code?: string;
  referrals?: number;
  total?: number;
  answer_token?: string;
  unsubscribe_token?: string;
};

export type JoinInput = {
  email: string;
  ref: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  variant: string | null;
  ipHash: string | null;
};

export type ViewInput = {
  variant: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  hasRef: boolean;
};

const makeClient = (url: string, key: string) =>
  createClient(url, key, {
    db: { schema: "vandr" },
    auth: { persistSession: false, autoRefreshToken: false },
  });

let client: ReturnType<typeof makeClient> | null = null;

function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  client ??= makeClient(url, key);
  return client;
}

export const isDemo = () => db() === null;

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const c = db();
  if (!c) throw new Error("Supabase is not configured");
  const { data, error } = await c.rpc(fn, args);
  if (error) throw new Error(`${fn}: ${error.message}`);
  return data as T;
}

// ---- Demo režim ---------------------------------------------------------

type DemoRow = {
  id: number;
  email: string;
  code: string;
  referrals: number;
  answerToken: string;
  unsubscribeToken: string;
  answer?: string;
};
const demo = { rows: [] as DemoRow[], seq: 1240, views: 0 };
const DEMO_BOOST = 10;

function demoPosition(row: DemoRow) {
  // V demu stojí před prvním skutečným zápisem 1240 smyšlených lidí.
  const rank = demo.rows.indexOf(row) + 1;
  return Math.max(1, 1240 + rank - row.referrals * DEMO_BOOST);
}

function demoCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => a[Math.floor(Math.random() * a.length)]).join("");
}

function demoPayload(row: DemoRow, status: "created" | "exists"): RawJoin {
  return {
    status,
    position: demoPosition(row),
    code: row.code,
    referrals: row.referrals,
    total: 1240 + demo.rows.length,
  };
}

function demoJoin(input: JoinInput): RawJoin {
  const existing = demo.rows.find((r) => r.email === input.email);
  if (existing) return demoPayload(existing, "exists");
  const row: DemoRow = {
    id: ++demo.seq,
    email: input.email,
    code: demoCode(),
    referrals: 0,
    answerToken: randomUUID(),
    unsubscribeToken: randomUUID(),
  };
  demo.rows.push(row);
  const referrer = input.ref ? demo.rows.find((r) => r.code === input.ref?.toUpperCase()) : undefined;
  if (referrer) referrer.referrals += 1;
  return { ...demoPayload(row, "created"), answer_token: row.answerToken, unsubscribe_token: row.unsubscribeToken };
}

// ---- API ----------------------------------------------------------------

export async function joinWaitlist(input: JoinInput): Promise<RawJoin> {
  if (isDemo()) return demoJoin(input);
  return rpc<RawJoin>("waitlist_join", {
    p_email: input.email,
    p_ref: input.ref,
    p_utm_source: input.utmSource,
    p_utm_medium: input.utmMedium,
    p_utm_campaign: input.utmCampaign,
    p_utm_content: input.utmContent,
    p_variant: input.variant,
    p_ip_hash: input.ipHash,
  });
}

export async function waitlistCount(): Promise<number> {
  if (isDemo()) return 1240 + demo.rows.length;
  return rpc<number>("waitlist_count", {});
}

export async function waitlistStatus(code: string): Promise<RawJoin | null> {
  if (isDemo()) {
    const row = demo.rows.find((r) => r.code === code.toUpperCase());
    return row ? demoPayload(row, "exists") : { status: "exists", position: 347, code, referrals: 0, total: 1240 };
  }
  return rpc<RawJoin | null>("waitlist_status", { p_code: code });
}

export async function saveAnswer(code: string, token: string, answer: string): Promise<boolean> {
  if (isDemo()) {
    const row = demo.rows.find((r) => r.code === code.toUpperCase() && r.answerToken === token);
    if (row) row.answer = answer;
    return Boolean(row);
  }
  return rpc<boolean>("waitlist_answer", { p_code: code, p_token: token, p_answer: answer });
}

export async function unsubscribe(code: string, token: string): Promise<boolean> {
  if (isDemo()) {
    const i = demo.rows.findIndex((r) => r.code === code.toUpperCase() && r.unsubscribeToken === token);
    if (i >= 0) demo.rows.splice(i, 1);
    return i >= 0;
  }
  return rpc<boolean>("waitlist_unsubscribe", { p_code: code, p_token: token });
}

export async function markConfirmationSent(code: string): Promise<void> {
  if (isDemo()) return;
  await rpc("waitlist_mark_confirmation_sent", { p_code: code });
}

export async function logView(input: ViewInput): Promise<void> {
  if (isDemo()) {
    demo.views += 1;
    return;
  }
  await rpc("waitlist_log_view", {
    p_variant: input.variant,
    p_utm_source: input.utmSource,
    p_utm_campaign: input.utmCampaign,
    p_utm_content: input.utmContent,
    p_has_ref: input.hasRef,
  });
}
