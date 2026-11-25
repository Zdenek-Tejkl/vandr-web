import { NextResponse } from "next/server";
import { ADMIN_COOKIE, makeSession, signIn } from "@/lib/admin";
import { isForm, isSameOrigin } from "@/lib/same-origin";

// Přihlášení do /admin (formulář). Chyba vrací zpět na /admin?e=1, bez rozlišení proč (nic neprozradí).
export async function POST(request: Request) {
  const back = (q = "") => NextResponse.redirect(new URL(`/admin${q}`, request.url), 303);
  if (!isForm(request) || !isSameOrigin(request)) return back("?e=1");
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const password = String(form.get("password") ?? "").slice(0, 200);
  if (!email || !password) return back("?e=1");
  let userId: string | null = null;
  try {
    userId = await signIn(email, password);
  } catch (e) {
    console.error("admin login failed", e);
  }
  if (!userId) return back("?e=1");
  const session = makeSession(userId);
  const res = back();
  res.cookies.set(ADMIN_COOKIE, session.value, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/admin",
    maxAge: session.maxAge,
  });
  return res;
}
