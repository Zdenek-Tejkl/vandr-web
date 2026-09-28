import { after, NextResponse } from "next/server";
import { isVariant } from "@/lib/config";
import { sendConfirmation } from "@/lib/email";
import { ipHash } from "@/lib/ip";
import type { JoinError, JoinResult } from "@/lib/types";
import { clean, isValidEmail, normalizeEmail } from "@/lib/validate";
import { joinWaitlist, markConfirmationSent } from "@/lib/waitlist";

const noStore = { "Cache-Control": "no-store" };

function fail(error: JoinError["error"], status: number) {
  return NextResponse.json<JoinError>({ error }, { status, headers: noStore });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
    if (!body || typeof body !== "object") throw new Error("bad body");
  } catch {
    return fail("invalid", 400);
  }

  // Honeypot: skryté pole vyplní jen robot. Tváříme se, že vše prošlo.
  if (clean(body.website, 200)) {
    return NextResponse.json<JoinResult>(
      { status: "created", position: null, code: null, referrals: 0, total: 0 },
      { headers: noStore },
    );
  }

  const email = normalizeEmail(String(body.email ?? ""));
  if (!isValidEmail(email)) return fail("invalid", 400);

  try {
    const r = await joinWaitlist({
      email,
      ref: clean(body.ref, 12),
      utmSource: clean(body.utm_source),
      utmMedium: clean(body.utm_medium),
      utmCampaign: clean(body.utm_campaign),
      utmContent: clean(body.utm_content),
      variant: isVariant(body.variant) ? body.variant : null,
      ipHash: ipHash(request.headers),
    });

    if (r.status === "invalid") return fail("invalid", 400);
    if (r.status === "rate_limited") return fail("rate_limited", 429);
    if (r.status !== "created" && r.status !== "exists") return fail("server", 500);

    if (r.status === "created" && r.code && r.unsubscribe_token && r.position) {
      const { code, unsubscribe_token: unsubscribeToken, position } = r;
      after(async () => {
        try {
          if (await sendConfirmation(email, { position, code, unsubscribeToken })) {
            await markConfirmationSent(code);
          }
        } catch (e) {
          console.error("confirmation email failed", e);
        }
      });
    }

    return NextResponse.json<JoinResult>(
      {
        status: r.status,
        position: r.position ?? null,
        code: r.code ?? null,
        referrals: r.referrals ?? 0,
        total: r.total ?? 0,
        answerToken: r.status === "created" ? r.answer_token : undefined,
      },
      { headers: noStore },
    );
  } catch (e) {
    console.error("join failed", e);
    return fail("server", 500);
  }
}
