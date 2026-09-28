import { isVariant } from "@/lib/config";
import { clean } from "@/lib/validate";
import { logView } from "@/lib/waitlist";

const BOT = /bot|crawl|spider|preview|facebookexternalhit|whatsapp|slack|discord|headless/i;

// Návštěva bez cookies: jen varianta nadpisu a UTM, žádné osobní údaje.
export async function POST(request: Request) {
  if (BOT.test(request.headers.get("user-agent") || "")) return new Response(null, { status: 204 });
  try {
    const body = JSON.parse(await request.text()) as Record<string, unknown>;
    await logView({
      variant: isVariant(body.variant) ? body.variant : null,
      utmSource: clean(body.utm_source),
      utmCampaign: clean(body.utm_campaign),
      utmContent: clean(body.utm_content),
      hasRef: Boolean(clean(body.ref, 12)),
    });
  } catch (e) {
    console.error("view log failed", e);
  }
  return new Response(null, { status: 204 });
}
