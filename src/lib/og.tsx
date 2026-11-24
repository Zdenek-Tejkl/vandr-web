/* eslint-disable @next/next/no-img-element -- generátor obrázků (satori) umí jen <img> */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og-fonts";
import { catSvg, colors, dataUri } from "@/lib/svg";

export const ogSize = { width: 1200, height: 630 };

async function screen(name: string) {
  const buf = await readFile(join(process.cwd(), "src/assets/screens", `${name}.jpg`));
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

function Phone({ src, width, style }: { src: string; width: number; style: Record<string, string | number> }) {
  const h = Math.round((width * 844) / 390);
  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        padding: 9,
        borderRadius: 38,
        background: colors.ink,
        boxShadow: "0 24px 48px rgba(0,0,0,0.35)",
        ...style,
      }}
    >
      <img src={src} width={width} height={h} style={{ borderRadius: 30 }} alt="" />
    </div>
  );
}

// Náhled odkazu 1200 × 630: logo, nadpis, krátký text a vpravo tři obrazovky aplikace.
export async function ogImage({ main, accent, line }: { main: string; accent: string; line: string }) {
  const [feed, globus, zeme] = await Promise.all([screen("feed"), screen("globus"), screen("zeme")]);
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
          padding: "0 0 0 72px",
          fontFamily: "Figtree",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 600, gap: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={dataUri(catSvg(colors.paper))} width={64} height={64} alt="" />
            <div style={{ fontFamily: "Bricolage", fontSize: 60, letterSpacing: -3 }}>vandr</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Bricolage", fontSize: 64, lineHeight: 1.04, letterSpacing: -2 }}>
            <span>{main}</span>
            <span style={{ color: colors.ochre }}>{accent}</span>
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.35, opacity: 0.92 }}>{line}</div>
        </div>
        <Phone src={feed} width={200} style={{ left: 690, top: 150, transform: "rotate(-8deg)" }} />
        <Phone src={zeme} width={200} style={{ left: 960, top: 150, transform: "rotate(8deg)" }} />
        <Phone src={globus} width={220} style={{ left: 815, top: 70 }} />
      </div>
    ),
    { ...ogSize, fonts: await ogFonts() },
  );
}
