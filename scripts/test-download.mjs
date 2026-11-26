// Test logiky stažení (src/lib/download.ts). Spuštění: npm test
import assert from "node:assert/strict";
import { test } from "node:test";

import { downloadTarget, platformOf, storeUrl, utmFrom } from "../src/lib/download.ts";

const stores = {
  ios: "https://apps.apple.com/cz/app/vandr/id1234567890",
  android: "https://play.google.com/store/apps/details?id=world.vandr.app",
};
const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1";
const INSTAGRAM_ANDROID = "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36 Instagram 350.0";
const DESKTOP = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0 Safari/537.36";

test("zařízení se pozná i v prohlížeči Instagramu", () => {
  assert.equal(platformOf(IPHONE), "ios");
  assert.equal(platformOf(INSTAGRAM_ANDROID), "android");
  assert.equal(platformOf(DESKTOP), "other");
  assert.equal(platformOf(null), "other");
});

test("iPhone jde do App Store, Android na Google Play, počítač na stránku s QR kódem", () => {
  assert.ok(downloadTarget(IPHONE, stores).startsWith("https://apps.apple.com/"));
  assert.ok(downloadTarget(INSTAGRAM_ANDROID, stores).startsWith("https://play.google.com/"));
  assert.equal(downloadTarget(DESKTOP, stores), "/#stahnout");
});

test("bez odkazu na obchod se nikam mimo web neposílá", () => {
  assert.equal(downloadTarget(IPHONE, { ios: "", android: stores.android }), "/#stahnout");
  assert.equal(storeUrl("android", { ios: "", android: "" }), null);
  assert.equal(storeUrl("ios", { ios: "tohle neni adresa", android: "" }), null);
});

test("Google Play dostane zdroj návštěvy v parametru referrer", () => {
  const utm = utmFrom(new URLSearchParams("utm_source=tiktok&utm_campaign=hidden gems&utm_content=video12"));
  const url = new URL(storeUrl("android", stores, utm));
  assert.equal(url.searchParams.get("id"), "world.vandr.app");
  const ref = new URLSearchParams(url.searchParams.get("referrer"));
  assert.equal(ref.get("utm_source"), "tiktok");
  assert.equal(ref.get("utm_campaign"), "hidden_gems");
  assert.equal(ref.get("utm_content"), "video12");
});

test("App Store dostane zdroj návštěvy v parametru ct, nejvýš 40 znaků", () => {
  const url = new URL(storeUrl("ios", stores, { source: "instagram", campaign: "bio" }));
  assert.equal(url.searchParams.get("ct"), "instagram-bio");
  const long = new URL(storeUrl("ios", stores, { source: "x".repeat(60), campaign: "y".repeat(60) }));
  assert.ok(long.searchParams.get("ct").length <= 40);
});

test("bez zdroje je návštěva z webu", () => {
  assert.equal(new URL(storeUrl("ios", stores)).searchParams.get("ct"), "web");
  const ref = new URLSearchParams(new URL(storeUrl("android", stores)).searchParams.get("referrer"));
  assert.equal(ref.get("utm_source"), "web");
});

// ---- Pozvánka do skupiny (src/lib/invite.ts) ----

const { INVITE_ALPHABET, inviteAppLink, inviteUtm, normalizeInviteCode } = await import("../src/lib/invite.ts");

test("kód pozvánky: jednotný tvar bez ohledu na to, jak přišel", () => {
  assert.equal(normalizeInviteCode("K7M2-XQ9D"), "K7M2-XQ9D");
  assert.equal(normalizeInviteCode("k7m2xq9d"), "K7M2-XQ9D");
  assert.equal(normalizeInviteCode(" k7m2 xq9d "), "K7M2-XQ9D");
});

test("kód pozvánky: co kód není, vrátí null", () => {
  assert.equal(normalizeInviteCode("K7M2-XQ9"), null, "krátký");
  assert.equal(normalizeInviteCode("K7M2-XQ9DD"), null, "dlouhý");
  // Zaměnitelné znaky v abecedě nejsou: 0, O, 1, I, L, U.
  for (const ch of "0O1ILU") {
    assert.equal(INVITE_ALPHABET.includes(ch), false, ch);
    assert.equal(normalizeInviteCode(`K7M2XQ9${ch}`), null, ch);
  }
  assert.equal(normalizeInviteCode(""), null);
  assert.equal(normalizeInviteCode(null), null);
  assert.equal(normalizeInviteCode("<script>"), null);
});

test("pozvánka: odkaz do aplikace a zdroj návštěvy do obchodů", () => {
  assert.equal(inviteAppLink("K7M2-XQ9D"), "vandr://p/K7M2-XQ9D");
  const url = new URL(storeUrl("android", stores, inviteUtm("K7M2-XQ9D")));
  const ref = new URLSearchParams(url.searchParams.get("referrer"));
  assert.equal(ref.get("utm_source"), "invite");
  assert.equal(ref.get("utm_campaign"), "K7M2XQ9D");
  assert.equal(new URL(storeUrl("ios", stores, inviteUtm("K7M2-XQ9D"))).searchParams.get("ct"), "invite-K7M2XQ9D");
});
