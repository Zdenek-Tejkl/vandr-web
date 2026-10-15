import { NextResponse, type NextRequest } from "next/server";
import { defaultVariant, isVariant, variants, type Variant } from "@/lib/config";

// A/B test nadpisu.
// ?h=b nebo ?h=c vynutí variantu (např. odkaz z videí o globusu).
// AB_HEADLINE=on rozdělí ostatní návštěvy náhodně mezi a, b, c a variantu si zapamatuje
// v cookie vandr-h (jen písmeno varianty, 30 dní). Roboti vždy dostanou výchozí nadpis.
const COOKIE = "vandr-h";
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|slack|discord|headless|lighthouse/i;

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // /h/b napřímo nevedeme: varianty existují jen jako interní přepis úvodu.
  if (pathname.startsWith("/h/")) {
    const url = request.nextUrl.clone();
    const v = pathname.slice(3);
    url.pathname = "/";
    if (isVariant(v) && v !== defaultVariant) url.searchParams.set("h", v);
    return NextResponse.redirect(url, 308);
  }

  const ab = process.env.AB_HEADLINE === "on" && !BOT.test(request.headers.get("user-agent") || "");
  const saved = request.cookies.get(COOKIE)?.value;
  const forced = searchParams.get("h");
  let variant: Variant | null = isVariant(forced) ? forced : null;
  if (!variant && ab) {
    variant = isVariant(saved) ? saved : variants[Math.floor(Math.random() * variants.length)];
  }

  let res = NextResponse.next();
  if (variant && variant !== defaultVariant) {
    const url = request.nextUrl.clone();
    url.pathname = `/h/${variant}`;
    res = NextResponse.rewrite(url);
  }
  if (ab && variant && variant !== saved) {
    res.cookies.set(COOKIE, variant, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }
  return res;
}

export const config = {
  matcher: ["/", "/h/:path*"],
};
