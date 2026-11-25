import { ImageResponse } from "next/og";
import { site } from "@/lib/config";
import { formatNumber } from "@/lib/copy";
import { ogFonts } from "@/lib/og-fonts";
import { catSvg, colors, dataUri, globeSvg } from "@/lib/svg";
import { waitlistStatus } from "@/lib/waitlist";

// Obrázek 1080 × 1920 do stories: „Jsem #347 ve frontě na Vandr“.
export async function GET(_request: Request, ctx: RouteContext<"/api/story/[code]">) {
  const { code } = await ctx.params;
  if (!/^[A-Za-z0-9]{4,12}$/.test(code)) return new Response("Not found", { status: 404 });

  const status = await waitlistStatus(code).catch(() => null);
  if (!status?.position) return new Response("Not found", { status: 404 });

  const domain = site.url.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: colors.forest,
          color: colors.paper,
          padding: "140px 96px 150px",
          fontFamily: "Figtree",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUri(catSvg(colors.paper))} width={120} height={120} alt="" />
          <div style={{ fontFamily: "Bricolage", fontSize: 110, letterSpacing: -4 }}>vandr</div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUri(globeSvg(640))} width={640} height={640} alt="" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontFamily: "Bricolage", fontSize: 104, lineHeight: 1.02, letterSpacing: -2 }}>Jsem</div>
          <div style={{ fontFamily: "Bricolage", fontSize: 190, lineHeight: 0.95, color: colors.ochre, letterSpacing: -6 }}>
            {`#${formatNumber(status.position)}`}
          </div>
          <div style={{ fontFamily: "Bricolage", fontSize: 88, lineHeight: 1.05, letterSpacing: -2 }}>ve frontě na Vandr.</div>
          <div style={{ fontSize: 44, lineHeight: 1.35, opacity: 0.9, marginTop: 12 }}>
            {`Sociální síť jen o cestování. Přidej se na ${domain}`}
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
      fonts: await ogFonts(),
      headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
    },
  );
}
