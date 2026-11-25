import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin";
import { isSameOrigin } from "@/lib/same-origin";

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/admin", request.url), 303);
  if (isSameOrigin(request)) res.cookies.set(ADMIN_COOKIE, "", { path: "/admin", maxAge: 0 });
  return res;
}
