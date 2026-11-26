import "server-only";
import { site } from "./config";

// Uvítací e-mail přes Resend (https://resend.com). Bez RESEND_API_KEY se nic neposílá.
// Od 26. 11. 2026 je waiting list jen pro iPhone: e-mail jen potvrdí zápis a slíbí jednu
// zprávu, až bude Vandr v App Storu. Pořadí a odkaz pro kamarády v něm už nejsou.

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// position zůstává kvůli volání z /api/join (pořadí se v e-mailu neukazuje).
type MailParams = { position: number; code: string; unsubscribeToken: string };

export function welcomeEmail(params: MailParams) {
  const q = `c=${encodeURIComponent(params.code)}&t=${encodeURIComponent(params.unsubscribeToken)}`;
  const unsubscribe = `${site.url}/odhlasit?${q}`;
  // RFC 8058: poštovní klienti odhlašují jedním klikem přes POST na tuto adresu.
  const oneClick = `${site.url}/api/unsubscribe?${q}`;
  const subject = "Vandr na iPhone: jsi na seznamu";

  const text = [
    "Ahoj, díky! Jsi na seznamu pro Vandr na iPhone.",
    "",
    "Napíšeme ti jednou, až bude v App Storu. Nic víc.",
    "Máš i Android? Ten už Vandr má na Google Play.",
    "",
    "Kocour Vandr",
    "",
    `Odhlásit se: ${unsubscribe}`,
  ].join("\n");

  const html = `<!doctype html><html lang="cs"><body style="margin:0;background:#F2F4EE;font-family:Figtree,Segoe UI,Arial,sans-serif;color:#1C1E1A">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F4EE;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#1F4D3A;border-radius:20px;color:#F2F4EE">
<tr><td style="padding:28px 28px 8px;font-size:28px;font-weight:800;letter-spacing:-1px">vandr</td></tr>
<tr><td style="padding:8px 28px 0;font-size:26px;font-weight:800;line-height:1.2">Jsi na seznamu!<br><span style="color:#E3A33B">Vandr na iPhone chystáme.</span></td></tr>
<tr><td style="padding:16px 28px 0;font-size:16px;line-height:1.5">Napíšeme ti jednou, až bude v App Storu. Nic víc.</td></tr>
<tr><td style="padding:12px 28px 0;font-size:14px;line-height:1.5;opacity:.9">Máš i Android? Ten už Vandr má na <a href="${esc(site.url)}" style="color:#E3A33B">Google Play</a>.</td></tr>
<tr><td style="padding:24px 28px 28px;font-size:14px;line-height:1.5;opacity:.9">Kocour Vandr</td></tr>
</table>
<p style="font-size:12px;color:#4F5A52;max-width:480px;line-height:1.5">Tento e-mail ti přišel kvůli zápisu na waiting list pro iPhone na ${esc(site.url.replace(/^https?:\/\//, ""))}. <a href="${esc(unsubscribe)}" style="color:#1F4D3A">Odhlásit se</a></p>
</td></tr></table></body></html>`;

  return { subject, text, html, unsubscribe, oneClick };
}

export async function sendWelcome(to: string, params: MailParams) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const mail = welcomeEmail(params);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Vandr <ahoj@vandr.world>",
      to: [to],
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      headers: {
        "List-Unsubscribe": `<${mail.oneClick}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return true;
}
