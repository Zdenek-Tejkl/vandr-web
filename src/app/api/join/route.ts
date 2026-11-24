import { after, NextResponse } from "next/server";
import { emailEnabled, isVariant } from "@/lib/config";
import { checkEmail } from "@/lib/email-check";
import { sendWelcome } from "@/lib/email";
import { ipHash } from "@/lib/ip";
import { isForm, isJson, isSameOrigin } from "@/lib/same-origin";
import type { JoinError, JoinResult } from "@/lib/types";
import { clean, isValidEmail, normalizeEmail } from "@/lib/validate";
import { joinWaitlist, markConfirmationSent } from "@/lib/waitlist";

const noStore = { "Cache-Control": "no-store" };

type Outcome =
  | { ok: true; result: JoinResult }
  | { ok: false; error: JoinError["error"]; status: number; suggestion?: string };

const failure = (error: JoinError["error"], status: number, suggestion?: string): Outcome => ({
  ok: false,
  error,
  status,
  suggestion,
});

function sendLater(to: string, params: { position: number; code: string; unsubscribeToken: string }) {
  after(async () => {
    try {
      if (await sendWelcome(to, params)) await markConfirmationSent(params.code);
    } catch (e) {
      console.error("welcome email failed", e);
    }
  });
}

async function join(body: Record<string, unknown>, request: Request): Promise<Outcome> {
  const mailed = emailEnabled();

  // Honeypot: skryté pole vyplní jen robot. Tváříme se, že vše prošlo.
  if (clean(body.website, 200)) {
    return { ok: true, result: { status: "created", position: null, code: null, referrals: 0, total: 0 } };
  }

  const email = normalizeEmail(String(body.email ?? ""));
  if (!isValidEmail(email)) return failure("invalid", 400);

  // Ověření domény (MX), jednorázové schránky a překlepy. Potvrzovací e-mail neposíláme.
  const check = await checkEmail(email);
  if (!check.ok) return failure(check.reason, 400, check.suggestion);

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
      requireConfirm: false,
      resend: mailed,
    });

    if (r.status === "invalid") return failure("invalid", 400);
    if (r.status === "rate_limited") return failure("rate_limited", 429);

    // Už na seznamu: nic neprozradíme, jen znovu pošleme uvítací e-mail (nejvýš jednou za hodinu).
    if (r.status === "exists") {
      if (mailed && r.resend) {
        const { email: to, code, position, unsubscribe_token: unsubscribeToken } = r.resend;
        sendLater(to, { position, code, unsubscribeToken });
      }
      return {
        ok: true,
        result: { status: "exists", position: null, code: null, referrals: 0, total: r.total ?? 0, mailed },
      };
    }
    if (r.status !== "created") return failure("server", 500);

    // Uvítací e-mail jen když je nastavený Resend. Odkaz pro kamarády je hned na webu.
    if (mailed && r.code && r.unsubscribe_token && r.position) {
      sendLater(email, { position: r.position, code: r.code, unsubscribeToken: r.unsubscribe_token });
    }

    return {
      ok: true,
      result: {
        status: "created",
        position: r.position ?? null,
        code: r.code ?? null,
        referrals: r.referrals ?? 0,
        total: r.total ?? 0,
        answerToken: r.answer_token,
        mailed,
      },
    };
  } catch (e) {
    console.error("join failed", e);
    return failure("server", 500);
  }
}

// JSON z formuláře na webu. Bez JavaScriptu (před načtením stránky) přijde klasický POST
// formuláře a odpovíme přesměrováním zpět na úvod. E-mail se nikdy nedostane do URL.
export async function POST(request: Request) {
  const form = isForm(request);
  if ((!form && !isJson(request)) || !isSameOrigin(request)) {
    return NextResponse.json<JoinError>({ error: "invalid" }, { status: 403, headers: noStore });
  }

  let body: Record<string, unknown> | null = null;
  try {
    body = form ? Object.fromEntries(await request.formData()) : await request.json();
  } catch {
    // neplatné tělo
  }
  const out = body && typeof body === "object" ? await join(body, request) : failure("invalid", 400);

  if (form) {
    const url = new URL("/", request.url);
    if (out.ok) {
      url.searchParams.set("joined", out.result.status);
      if (out.result.mailed) url.searchParams.set("mail", "1");
    } else {
      url.searchParams.set("join_error", out.error);
    }
    return NextResponse.redirect(url, { status: 303, headers: noStore });
  }

  if (!out.ok) {
    return NextResponse.json<JoinError>(
      { error: out.error, suggestion: out.suggestion },
      { status: out.status, headers: noStore },
    );
  }
  return NextResponse.json<JoinResult>(out.result, { headers: noStore });
}
