// Ukázky aplikace pro web: snímky z demo režimu aplikace Vandr.world.
//
// 1. V repu aplikace: npx expo export --platform web && npx serve -s dist -l 4173
// 2. Tady: APP_URL=http://localhost:4173 npm run build:screens
//
// Výstup: public/screens/*.webp (stránka) a src/assets/screens/*.jpg (náhled odkazu).
// Po změně grafiky aplikace stačí skript pustit znovu.
// Prohlížeč: CHROME_PATH, jinak Chromium z Playwrightu.
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";
import sharp from "sharp";

const APP_URL = (process.env.APP_URL || "http://localhost:4173").replace(
  /\/$/,
  "",
);
const executablePath =
  process.env.CHROME_PATH ||
  ["/opt/pw-browsers/chromium"].find((p) => existsSync(p));

// Název souboru, cesta v aplikaci a kolik počkat na obrázky.
const SCREENS = [
  { name: "chaty", path: "/" },
  { name: "skupina", path: "/live/lt-albanie" },
  { name: "kontrola", path: "/live/edit/lt-tatry" },
  { name: "report", path: "/trip/t-kavkaz" },
  { name: "planovac", path: "/planner", wait: 5000 },
  { name: "plan", path: "/plan/plan-gruzie" },
  { name: "gem", path: "/post/p-02" },
  { name: "profil", path: "/profile", wait: 5000 },
  // Skupina cesty ve fázi plánování (demo-planning-trip).
  { name: "hlasovani", path: "/live/demo-planning-trip?tab=chat" },
  { name: "souhrn", path: "/live/demo-planning-trip?tab=plan" },
  { name: "vydaje", path: "/live/demo-planning-trip?tab=expenses" },
  {
    name: "rozvrh",
    path: "/live/demo-planning-trip?tab=plan",
    action: async (page) => {
      const b = page
        .getByText("Navrhnout rozvrh")
        .locator("visible=true")
        .first();
      await b.scrollIntoViewIfNeeded();
      await b.click();
    },
  },
];

const browser = await chromium.launch(executablePath ? { executablePath } : {});
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  locale: "cs-CZ",
  // S povolenou polohou je skupina cesty bez nabídky záznamu trasy.
  geolocation: { latitude: 39.8756, longitude: 20.0053 },
  permissions: ["geolocation"],
});
const page = await ctx.newPage();

// Demo režim: přihlášení jakýmkoli e-mailem.
await page.goto(APP_URL + "/");
await page.waitForTimeout(2500);
await page.getByText("Už mám účet").first().click();
await page.waitForTimeout(800);
await page.locator("input").nth(0).fill("eliska@example.com");
await page.locator("input").nth(1).fill("heslo12345");
await page.getByText("Přihlásit se", { exact: true }).last().click();
await page.waitForTimeout(3500);

await mkdir("public/screens", { recursive: true });
await mkdir("src/assets/screens", { recursive: true });
for (const s of SCREENS) {
  if (s.path !== "/") await page.goto(APP_URL + s.path);
  await page.waitForTimeout(s.wait ?? 4000);
  if (s.action) {
    await s.action(page);
    await page.waitForTimeout(2000);
  }
  const png = await page.screenshot();
  await sharp(png)
    .webp({ quality: 82 })
    .toFile(`public/screens/${s.name}.webp`);
  await sharp(png)
    .resize(390)
    .jpeg({ quality: 80 })
    .toFile(`src/assets/screens/${s.name}.jpg`);
  console.log("ok", s.name);
}
await browser.close();
