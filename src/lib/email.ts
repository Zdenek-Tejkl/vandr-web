import "server-only";
import { site, shareUrl } from "./config";
import { formatNumber } from "./copy";

// Potvrzovací e-mail přes Resend (https://resend.com). Bez RESEND_API_KEY se nic neposílá.

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function confirmationEmail(params: { position: number; code: string; unsubscribeToken: string }) {
  const link = shareUrl(params.code);
  const q = `c=${encodeURIComponent(params.code)}&t=${encodeURIComponent(params.unsubscribeToken)}`;
  const unsubscribe = `${site.url}/odhlasit?${q}`;
  // RFC 8058: poštovní klienti odhlašují jedním klikem přes POST na tuto adresu.
  const oneClick = `${site.url}/api/unsubscribe?${q}`;
  const pos = formatNumber(params.position);
  const subject = `Jsi na seznamu! Tvoje pořadí: #${pos}`;

  const text = [
    `Ahoj, jsi na waiting listu Vandru. Tvoje pořadí: #${pos}.`,
    "",
    "Pozvi 3 kamarády a dostaneš odznak Founding Vandrák.",
    "Každý kamarád tě posune o 10 míst dopředu.",
    "",
    `Tvůj odkaz: ${link}`,
    "",
    "Napíšeme ti, až spustíme. Nic víc.",
    "Kocour Vandr",
    "",
    `Odhlásit se: ${unsubscribe}`,
  ].join("\n");

  const html = `<!doctype html><html lang="cs"><body style="margin:0;background:#F2F4EE;font-family:Figtree,Segoe UI,Arial,sans-serif;color:#1C1E1A">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F4EE;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#1F4D3A;border-radius:20px;color:#F2F4EE">
<tr><td style="padding:28px 28px 8px;font-size:28px;font-weight:800;letter-spacing:-1px">vandr</td></tr>
<tr><td style="padding:8px 28px 0;font-size:26px;font-weight:800;line-height:1.2">Jsi na seznamu!<br><span style="color:#E3A33B">Tvoje pořadí: #${esc(pos)}</span></td></tr>
<tr><td style="padding:16px 28px 0;font-size:16px;line-height:1.5">Pozvi 3 kamarády a dostaneš odznak <b>Founding Vandrák</b>. Každý kamarád tě posune o 10 míst dopředu.</td></tr>
<tr><td style="padding:20px 28px 0"><a href="${esc(link)}" style="display:inline-block;background:#E4572E;color:#1C1E1A;font-weight:700;text-decoration:none;padding:14px 22px;border-radius:99px">Můj odkaz pro kamarády</a></td></tr>
<tr><td style="padding:10px 28px 0;font-size:14px;opacity:.9;word-break:break-all">${esc(link)}</td></tr>
<tr><td style="padding:24px 28px 28px;font-size:14px;line-height:1.5;opacity:.9">Napíšeme ti, až spustíme. Nic víc.<br>Kocour Vandr</td></tr>
</table>
<p style="font-size:12px;color:#4F5A52;max-width:480px;line-height:1.5">Tento e-mail ti přišel, protože ses zapsal(a) na ${esc(site.url.replace(/^https?:\/\//, ""))}. <a href="${esc(unsubscribe)}" style="color:#1F4D3A">Odhlásit se</a></p>
</td></tr></table></body></html>`;

  return { subject, text, html, unsubscribe, oneClick };
}

export async function sendConfirmation(to: string, params: { position: number; code: string; unsubscribeToken: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const mail = confirmationEmail(params);
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
