import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Co o pozvánce smí vědět web: název cesty a kdo zve. Nic dalšího ze skupiny. */
export type InviteInfo = {
  status: "ok" | "expired" | "not_found";
  title: string | null;
  ownerName: string | null;
  membersCount: number;
};

const text = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

/**
 * Náhled pozvánky z databáze (Supabase, schéma "vandr", funkce get_invite_public).
 * Bez SUPABASE_URL a SUPABASE_SECRET_KEY, při chybě nebo když databáze neodpoví do 2,5 s vrací null:
 * stránka pak ukáže obecnou pozvánku a stažení funguje dál.
 */
export async function inviteInfo(code: string): Promise<InviteInfo | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  try {
    const client = createClient(url, key, {
      db: { schema: "vandr" },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await client.rpc("get_invite_public", { p_code: code }).abortSignal(AbortSignal.timeout(2500));
    if (error || !data) return null;
    const row = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | undefined;
    if (!row) return null;
    const status = row.status === "ok" || row.status === "expired" ? row.status : "not_found";
    return {
      status,
      title: text(row.title, 80),
      ownerName: text(row.owner_name, 60),
      membersCount: typeof row.members_count === "number" && row.members_count > 0 ? Math.floor(row.members_count) : 0,
    };
  } catch {
    return null;
  }
}
