// Generates favicon.ico (32 px), apple-icon.png (180 px), icon.svg and public/logo.png (512 px).
// Run: node scripts/build-icons.mjs
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const FOREST = "#1F4D3A";
const PAPER = "#F2F4EE";

const cat = (color) =>
  `<defs><mask id="c" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><g fill="none" stroke="#000" stroke-width="4.5" stroke-linecap="round"><ellipse cx="50" cy="60" rx="13" ry="29"/><path d="M22 60 H78"/><path d="M27 45 Q50 52 73 45"/><path d="M27 75 Q50 68 73 75"/></g></mask></defs><g fill="${color}" mask="url(#c)"><path d="M19 50 L22 12 L46 30 Z"/><path d="M81 50 L78 12 L54 30 Z"/><circle cx="50" cy="60" r="32"/></g>`;

// Kocour Globus na Lese, se zaoblenými rohy (favicon, ikona).
const icon = (radius) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="${radius}" fill="${FOREST}"/><g transform="translate(9 6) scale(.82)">${cat(PAPER)}</g></svg>`;

const out = (p) => new URL(`../${p}`, import.meta.url);

writeFileSync(out("src/app/icon.svg"), icon(22));

const png = (svg, size) => sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toBuffer();

// iOS si rohy zaobluje sám, proto plný čtverec.
writeFileSync(out("src/app/apple-icon.png"), await png(icon(0), 180));
writeFileSync(out("public/logo.png"), await png(icon(0), 512));

// ICO s jedním PNG obrázkem 32 x 32.
const p32 = await png(icon(22), 32);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt8(0, 8);
header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(p32.length, 14);
header.writeUInt32LE(22, 18);
writeFileSync(out("src/app/favicon.ico"), Buffer.concat([header, p32]));

console.log("icons done");
