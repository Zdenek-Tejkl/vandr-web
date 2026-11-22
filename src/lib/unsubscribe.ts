import "server-only";
import { createClient } from "@supabase/supabase-js";

// Waiting list už web nesbírá. Zůstává jen odhlášení pro lidi, kteří se zapsali dřív
// (odkaz v e-mailu musí fungovat dál). Databáze: Supabase, schéma "vandr".
// Bez SUPABASE_URL a SUPABASE_SECRET_KEY odhlášení jen potvrdí (vývoj bez databáze).
export async function unsubscribe(code: string, token: string): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return true;
  const client = createClient(url, key, {
    db: { schema: "vandr" },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.rpc("waitlist_unsubscribe", { p_code: code, p_token: token });
  if (error) throw new Error(`waitlist_unsubscribe: ${error.message}`);
  return Boolean(data);
}
