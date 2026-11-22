# vandr-web

Web **Vandr** (vandr.world). Jedna stránka, jeden cíl: stáhnout aplikaci. Pozice: Instagram pro cestovatele.

## Co umí

- Hlavní blok bez scrollování: nadpis, jedna věta, tlačítko ke stažení a obrazovka aplikace
- Tlačítko pozná zařízení: na iPhonu vede do App Store, na Androidu na Google Play, jinak na `/stahnout`
- `vandr.world/stahnout`: jeden odkaz do bia, QR kódu a reklam. Podle zařízení přesměruje do správného obchodu, na počítači na stránku s QR kódem
- Tlačítko ke stažení je vidět pořád: v horní liště, v liště dole na mobilu (po odjetí hlavního tlačítka) a na konci stránky
- Zdroj návštěvy (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`) se předá obchodu: Google Play v parametru `referrer`, App Store v `ct`
- Měření kliknutí: Vercel Web Analytics, událost `download_click` s obchodem a místem na stránce (bez cookies)
- Obsah: tři čísla, jak to funguje ve třech krocích, profil s planetou, obrazovky aplikace, krátké otázky a odpovědi
- Na počítači QR kód (kreslí se na serveru), v Safari na iPhonu lišta Otevřít v App Store (až bude odkaz)
- SEO: title, description, Open Graph 1200 × 630, Twitter card, JSON-LD `MobileApplication`, robots.txt, sitemap.xml
- Microsoft Clarity až po souhlasu (malý pruh dole)
- Zásady ochrany osobních údajů (`/zasady-ochrany-osobnich-udaju`)

## Odkazy do obchodů

Dokud nejsou vyplněné, stránka ukazuje **Už brzy v App Store a na Google Play** a hlavní tlačítko vede na Instagram.

```bash
NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/cz/app/vandr/id0000000000
NEXT_PUBLIC_GOOGLE_PLAY_URL=https://play.google.com/store/apps/details?id=world.vandr.app
```

- Stačí jeden z nich, druhý obchod pak ukazuje Brzy
- Číslo aplikace pro lištu v Safari se vezme z odkazu do App Store (`id0000000000`)
- Proměnné jsou `NEXT_PUBLIC_*`, po změně je potřeba nové nasazení

## Spuštění

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # logika stažení (zařízení, obchod, zdroj návštěvy)
npm run typecheck
npm run lint
```

## Ukázky aplikace

Obrazovky v `public/screens` (stránka) a `src/assets/screens` (náhled odkazu) jsou snímky z demo režimu aplikace.
Po změně grafiky aplikace se vygenerují znovu:

```bash
# v repu aplikace (Vandr.world)
npx expo export --platform web && npx serve -s dist -l 4173
# tady
APP_URL=http://localhost:4173 npm run build:screens
```

## Co zbylo z waiting listu

Waiting list web už nesbírá. Zůstalo jen to, co musí fungovat dál:

- `/odhlasit` a `POST /api/unsubscribe`: odhlášení pro lidi, kteří se zapsali dřív (odkaz v e-mailu). Potřebuje `SUPABASE_URL` a `SUPABASE_SECRET_KEY`
- Staré odkazy `/r/KOD`, `/h/varianta` a `/potvrdit` vedou na úvod
- Tabulky `vandr.waitlist*` v Supabase zůstaly beze změny (web je nemaže ani nečte, jen odhlašuje)

## Nasazení na Vercel

1. Importovat repo do Vercelu
2. Nastavit proměnné z `.env.example` (hlavně odkazy do obchodů)
3. Doména `vandr.world`
4. Zapnout Web Analytics v projektu

## Checklist před spuštěním

- [ ] Vyplnit `NEXT_PUBLIC_APP_STORE_URL` a `NEXT_PUBLIC_GOOGLE_PLAY_URL`
- [ ] Doplnit správce údajů (`NEXT_PUBLIC_CONTROLLER_*`) a nechat zásady zkontrolovat právníkem
- [ ] Nadpis používá název Instagram jako přirovnání. Ověřit s právníkem a nepoužívat ho v názvu a popisu aplikace v obchodech
- [ ] Vyměnit tlačítka obchodů za oficiální odznaky App Store a Google Play (podle jejich pravidel)
- [ ] Test z odkazu v bio na iPhonu i Androidu (Instagram i TikTok): `vandr.world/stahnout?utm_source=instagram`
- [ ] Načtení do 2,5 s na mobilních datech
- [ ] Náhled odkazu ve WhatsAppu a Messengeru

## Struktura

- `src/app/page.tsx`: hlavní stránka (statická)
- `src/app/stahnout/route.ts`: chytrý odkaz ke stažení
- `src/components/Landing.tsx`: celá stránka, `Download.tsx`: tlačítka a lišta dole, `Phone.tsx`, `Qr.tsx`
- `src/lib/copy.ts`: všechny texty, `config.ts`: adresy a odkazy do obchodů, `download.ts`: logika stažení
- `scripts/build-screens.mjs`: ukázky aplikace, `build-icons.mjs`: favicony a logo, `test-download.mjs`: testy

## Licence podkladů

- Písma Bricolage Grotesque a Figtree: SIL Open Font License (`src/assets/fonts`)
