import { NextResponse, type NextRequest } from "next/server";
import { stores } from "@/lib/config";
import { downloadTarget, utmFrom } from "@/lib/download";

// vandr.world/stahnout: jeden odkaz do bia, QR kódu a reklam.
// iPhone jde do App Store, Android na Google Play, počítač na stránku s QR kódem.
// Zdroj návštěvy (utm_*) se předá obchodu.
export function GET(request: NextRequest) {
  const target = downloadTarget(request.headers.get("user-agent"), stores, utmFrom(request.nextUrl.searchParams));
  const url = target.startsWith("/") ? new URL(target, request.nextUrl.origin) : new URL(target);
  if (target.startsWith("/")) {
    // Na stránce zůstane zdroj návštěvy kvůli měření.
    request.nextUrl.searchParams.forEach((v, k) => {
      if (k.startsWith("utm_")) url.searchParams.set(k, v);
    });
  }
  const res = NextResponse.redirect(url, 307);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("Vary", "User-Agent");
  return res;
}
