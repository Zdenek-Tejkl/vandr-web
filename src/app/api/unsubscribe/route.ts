import { NextResponse } from "next/server";
import { clean } from "@/lib/validate";
import { unsubscribe } from "@/lib/waitlist";

// POST z tlačítka na /odhlasit i jedním klikem z poštovního klienta (RFC 8058).
export async function POST(request: Request) {
  const url = new URL(request.url);
  let code = clean(url.searchParams.get("c"), 12);
  let token = clean(url.searchParams.get("t"), 36);

  if (!code || !token) {
    try {
      const body = (await request.json()) as Record<string, unknown>;
      code = clean(body.code, 12);
      token = clean(body.token, 36);
    } catch {
      // bez těla
    }
  }
  if (!code || !token || !/^[0-9a-f-]{36}$/i.test(token)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  try {
    const ok = await unsubscribe(code, token);
    return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
  } catch (e) {
    console.error("unsubscribe failed", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
