import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminConfigured, currentAdmin, overview } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Administrace · Vandr",
  robots: { index: false, follow: false },
};

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("cs-CZ", { timeZone: "Europe/Prague", dateStyle: "short", timeStyle: "short" }) : "";

const n = (v: number | null) => (v == null ? "?" : v.toLocaleString("cs-CZ"));

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const q = await searchParams;
  const jar = await cookies();
  let admin: string | null = null;
  try {
    admin = await currentAdmin(jar.get(ADMIN_COOKIE)?.value);
  } catch (e) {
    console.error("admin check failed", e);
  }

  if (!admin) {
    return (
      <main className="doc">
        <div className="doc-in admin">
          <h1>Administrace</h1>
          {!adminConfigured() ? <p>Web nemá nastavenou databázi.</p> : null}
          {q.e ? <p className="admin-err">Přihlášení se nepovedlo.</p> : null}
          <form method="post" action="/admin/login" className="admin-form">
            <label>
              E-mail
              <input name="email" type="email" autoComplete="username" required />
            </label>
            <label>
              Heslo
              <input name="password" type="password" autoComplete="current-password" required />
            </label>
            <button type="submit">Přihlásit</button>
          </form>
        </div>
      </main>
    );
  }

  const { stats, waitlist, waitlistError } = await overview();
  const tiles: [string, number | null][] = [
    ["Uživatelé aplikace", stats.users],
    ["Noví za 7 dní", stats.usersWeek],
    ["Příspěvky uživatelů", stats.userPosts],
    ["Cesty", stats.trips],
    ["Plány", stats.plans],
    ["Zprávy", stats.messages],
    ["Skrytá místa od Vandru", stats.vandrGems],
    ["Místa z Wikidat", stats.wikidata],
    ["Waiting list", waitlist.length],
  ];

  return (
    <main className="doc">
      <div className="doc-in admin admin-wide">
        <div className="admin-head">
          <h1>Administrace</h1>
          <form method="post" action="/admin/logout">
            <button type="submit">Odhlásit</button>
          </form>
        </div>
        <div className="admin-tiles">
          {tiles.map(([label, value]) => (
            <div key={label} className="admin-tile">
              <b>{n(value)}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <h2>Waiting list</h2>
        {waitlistError ? <p className="admin-err">Nejde načíst: {waitlistError}</p> : null}
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>E-mail</th>
                <th>Zapsán</th>
                <th>Potvrzen</th>
                <th>Pozvaní</th>
                <th>Zdroj</th>
                <th>Kam dál</th>
              </tr>
            </thead>
            <tbody>
              {waitlist.map((r) => (
                <tr key={r.email + r.created_at} className={r.unsubscribed_at ? "admin-off" : undefined}>
                  <td>{r.email}</td>
                  <td>{fmt(r.created_at)}</td>
                  <td>{r.confirmed_at ? fmt(r.confirmed_at) : "ne"}</td>
                  <td>{r.referral_count ?? 0}</td>
                  <td>{[r.utm_source, r.variant].filter(Boolean).join(", ")}</td>
                  <td>{r.next_destination ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
