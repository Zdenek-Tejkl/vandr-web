import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Plné TTF (včetně české diakritiky) pro generované obrázky. Licence: OFL, viz src/assets/fonts.
const dir = join(process.cwd(), "src/assets/fonts");

export async function ogFonts() {
  const [display, body] = await Promise.all([
    readFile(join(dir, "BricolageGrotesque-ExtraBold.ttf")),
    readFile(join(dir, "Figtree-SemiBold.ttf")),
  ]);
  return [
    { name: "Bricolage", data: display, weight: 800 as const, style: "normal" as const },
    { name: "Figtree", data: body, weight: 600 as const, style: "normal" as const },
  ];
}
