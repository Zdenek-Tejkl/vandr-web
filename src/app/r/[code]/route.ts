import { NextResponse } from "next/server";

// Krátký odkaz pro kamarády vandr.world/r/KOD vede na hlavní stránku s pozvánkou.
export async function GET(request: Request, ctx: RouteContext<"/r/[code]">) {
  const { code } = await ctx.params;
  const url = new URL("/", request.url);
  if (/^[A-Za-z0-9]{4,12}$/.test(code)) url.searchParams.set("ref", code.toUpperCase());
  return NextResponse.redirect(url, 307);
}
