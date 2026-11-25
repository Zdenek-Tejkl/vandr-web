// SVG jako text: pro generované obrázky (Open Graph, story) a favicony.
import { globeGraticule, globeLand, globeVisited, globeWishlist } from "@/generated/geo";

export const colors = {
  forest: "#1F4D3A",
  ember: "#E4572E",
  ochre: "#E3A33B",
  paper: "#F2F4EE",
  ink: "#1C1E1A",
  land: "#2E6A51",
};

// Kocour Globus: hlava kocoura je zeměkoule, poledníky jsou vyříznuté.
export const catPaths = {
  earLeft: "M19 50 L22 12 L46 30 Z",
  earRight: "M81 50 L78 12 L54 30 Z",
  cut: [
    '<ellipse cx="50" cy="60" rx="13" ry="29"/>',
    '<path d="M22 60 H78"/>',
    '<path d="M27 45 Q50 52 73 45"/>',
    '<path d="M27 75 Q50 68 73 75"/>',
  ].join(""),
};

export function catSvg(color: string, size = 100) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100"><defs><mask id="c" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><g fill="none" stroke="#000" stroke-width="4.5" stroke-linecap="round">${catPaths.cut}</g></mask></defs><g fill="${color}" mask="url(#c)"><path d="${catPaths.earLeft}"/><path d="${catPaths.earRight}"/><circle cx="50" cy="60" r="32"/></g></svg>`;
}

export function globeSvg(size = 200) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 200 200"><defs><radialGradient id="s" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient></defs><circle cx="100" cy="100" r="96" fill="${colors.forest}"/><path d="${globeGraticule}" fill="none" stroke="${colors.paper}" stroke-opacity=".12" stroke-width=".6"/><path d="${globeLand}" fill="${colors.land}"/><path d="${globeVisited}" fill="${colors.ochre}"/><path d="${globeWishlist}" fill="none" stroke="${colors.paper}" stroke-width="1.2" stroke-dasharray="2.5 2"/><circle cx="100" cy="100" r="96" fill="url(#s)"/></svg>`;
}

export const dataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
