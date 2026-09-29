/* eslint-disable @next/next/no-img-element -- generátor obrázků (satori) umí jen <img> */
import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og-fonts";
import { catSvg, colors, dataUri, globeSvg } from "@/lib/svg";

export const ogSize = { width: 1200, height: 630 };

// Náhled odkazu 1200 × 630: logo, dvouřádkový nadpis, krátký text a globus vpravo.
export async function ogImage({ main, accent, line }: { main: string; accent: string; line: string }) {
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
            <span>{main}</span>
            <span style={{ color: colors.ochre }}>{accent}</span>
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.35, opacity: 0.92 }}>{line}</div>
        </div>
        <div style={{ display: "flex", position: "absolute", right: -70, top: 45 }}>
          <img src={dataUri(globeSvg(540))} width={540} height={540} alt="" />
        </div>
      </div>
    ),
    { ...ogSize, fonts: await ogFonts() },
  );
}
