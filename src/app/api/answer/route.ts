import { NextResponse } from "next/server";
import { clean } from "@/lib/validate";
import { saveAnswer } from "@/lib/waitlist";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const code = clean(body.code, 12);
  const token = clean(body.token, 36);
  const answer = clean(body.answer, 200);
  if (!code || !token || !UUID.test(token) || !answer) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  try {
    const ok = await saveAnswer(code, token, answer);
    return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
  } catch (e) {
    console.error("answer failed", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
