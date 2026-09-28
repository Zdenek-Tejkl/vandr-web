import { NextResponse, type NextRequest } from "next/server";
import { defaultVariant, isVariant, variants } from "@/lib/config";

// A/B test nadpisu bez cookies.
// ?h=b nebo ?h=c vynutí variantu (např. odkaz z videí o globusu).
// AB_HEADLINE=on rozdělí ostatní návštěvy náhodně mezi a, b, c.
export function proxy(request: NextRequest) {
  const forced = request.nextUrl.searchParams.get("h");
  let variant = isVariant(forced) ? forced : null;
  if (!variant && process.env.AB_HEADLINE === "on") {
    variant = variants[Math.floor(Math.random() * variants.length)];
  }
  if (!variant || variant === defaultVariant) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/h/${variant}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/",
};
