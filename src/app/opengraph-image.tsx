import { ImageResponse } from "next/og";
import { headlines } from "@/lib/copy";
import { defaultVariant } from "@/lib/config";
import { ogFonts } from "@/lib/og-fonts";
import { catSvg, colors, dataUri, globeSvg } from "@/lib/svg";

export const alt = "Vandr: globus navštívených zemí a tipy od kamarádů";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const h = headlines[defaultVariant];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: colors.forest,
          color: colors.paper,
          padding: "0 0 0 80px",
          fontFamily: "Figtree",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 640, gap: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img src={dataUri(catSvg(colors.paper))} width={78} height={78} alt="" />
            <div style={{ fontFamily: "Bricolage", fontSize: 72, letterSpacing: -3 }}>vandr</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Bricolage", fontSize: 70, lineHeight: 1.04, letterSpacing: -2 }}>
            <span>{h.main}</span>
            <span style={{ color: colors.ochre }}>{h.accent}</span>
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.35, opacity: 0.92 }}>
            Sociální síť jen o cestování. Zapiš se na waiting list.
          </div>
        </div>
        <div style={{ display: "flex", position: "absolute", right: -70, top: 45 }}>
          <img src={dataUri(globeSvg(540))} width={540} height={540} alt="" />
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
