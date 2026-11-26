# vandr-web

Web **Vandr** (vandr.world). Jedna stránka, jeden cíl: stáhnout aplikaci.

**Stav (26. 11. 2026):** Android stahuje z Google Play (odznak Google Play), iPhone dostane
místo tlačítka **waiting list** (Vandr v App Storu zatím není). Majitel: „waiting list
potřebujeme jen pro Apple aplikace, jinak ke stažení na Google Play dej tak odkaz.“

## Co umí

- Hlavní blok bez scrollování: nadpis, jedna věta, tlačítko ke stažení a obrazovka aplikace
- Stránka pozná zařízení (skript v `layout.tsx` nastaví `html[data-os]` ještě před vykreslením, třídy `os-*` v `globals.css`, stránka zůstává statická):
  - **Android**: oficiální odznak Google Play (`public/badges/google-play-cs.png`, česká verze od Googlu, beze změn)
  - **iPhone a iPad**: věta „Na iPhone chystáme. Nech nám e-mail, ozveme se.“ a formulář waiting listu
  - **Počítač** (i bez JavaScriptu): odznak Google Play, QR kód a dole waiting list pro iPhone
- `vandr.world/stahnout`: jeden odkaz do bia, QR kódu a reklam. Android přesměruje na Google Play, iPhone (bez App Storu) a počítač na `/#stahnout`
- Tlačítko ke stažení je vidět pořád: v horní liště, v liště dole na mobilu (po odjetí hlavního tlačítka) a na konci stránky
- `vandr.world/p/<kód>`: pozvánka do skupiny cesty. Kdo aplikaci nemá, stáhne si ji (iPhone dostane waiting list) (zdroj `invite` a kód jdou do obchodu), kdo ji má, otevře pozvánku rovnou v ní (`vandr://p/<kód>`). Ukazuje jen název cesty a kdo zve (funkce `get_invite_public` v databázi), bez databáze obecný text. Na počítači QR kód s odkazem, stránky nejsou pro vyhledávače
- Zdroj návštěvy (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`) se předá obchodu: Google Play v parametru `referrer`, App Store v `ct`
- Měření kliknutí: Vercel Web Analytics, událost `download_click` s obchodem a místem na stránce, u pozvánky `invite_click` (bez cookies)
- Obsah: tři čísla, příběh z Balkánu, tři hlavní věci (plánovač, skryté poklady, chat se skupinou a report), čtyři kroky, profil s globusem (země, kde jsi byl i žil, odznaky, úrovně Turista až Světoběžník), obrazovky aplikace, krátké otázky a odpovědi
- Na počítači QR kód (kreslí se na serveru), v Safari na iPhonu lišta Otevřít v App Store (až bude odkaz)
- SEO: title, description, Open Graph 1200 × 630, Twitter card, JSON-LD `MobileApplication`, robots.txt, sitemap.xml
- Microsoft Clarity až po souhlasu (malý pruh dole)
- Zásady ochrany osobních údajů (`/zasady-ochrany-osobnich-udaju`)

## Odkazy do obchodů

```bash
NEXT_PUBLIC_GOOGLE_PLAY_URL=https://play.google.com/store/apps/details?id=world.vandr.app
NEXT_PUBLIC_APP_STORE_URL=
```

- `NEXT_PUBLIC_GOOGLE_PLAY_URL` je nepovinná: bez ní platí výchozí odkaz `https://play.google.com/store/apps/details?id=world.vandr.app` (`src/lib/config.ts`). K odkazu se vždy přidá `referrer` se zdrojem návštěvy
- Výpis na Google Play je pro veřejnost vidět až po vydání do produkce (nebo otevřeného testování). Do té doby odkaz ukáže „nenalezeno“
- `NEXT_PUBLIC_APP_STORE_URL`: dokud je prázdná, iPhone dostane waiting list. Po vyplnění dostane iPhone odkaz do App Storu (pak doplnit oficiální odznak Applu a upravit texty o iPhonu v `copy.ts`); číslo aplikace pro lištu v Safari se vezme z odkazu (`id0000000000`)
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

## Waiting list pro iPhone

- Formulář (`WaitlistForm`, `JoinProvider`), `POST /api/join`, databáze a ochrany jsou ty z dřívějšího waiting listu: ověření e-mailu (MX, jednorázové schránky, překlepy), honeypot, limit na IP, funguje i bez JavaScriptu
- Nabízí se jen iPhonům (a na počítači v sekci „Máš iPhone?“). Android ho nevidí
- Každý nový zápis má ve sloupci `vandr.waitlist.variant` hodnotu `ios` (sloupec dřív nesl písmeno A/B testu nadpisu, ten skončil; staré zápisy mají `a`, `b`, `c` nebo nic). Návštěvy (`waitlist_views.variant`) nesou zařízení `ios`, `android` nebo `other`. Vlastní sloupec pro zařízení tabulka nemá
- Děkovná obrazovka: jen potvrzení, nepovinná otázka „Kam jedeš příště?“ a Instagram. Pořadí, odměny a sdílení odkazu tu už nejsou
- Uvítací e-mail (Resend, volitelný): potvrdí zápis a slíbí jednu zprávu, až bude Vandr v App Storu
- `/odhlasit`, `POST /api/unsubscribe` a `/potvrdit` fungují dál (odkazy z e-mailů)
- Staré odkazy `/r/KOD` vedou na úvod s `?ref=KOD` (zápis se kamarádovi připíše), `/h/varianta` na úvod
- `/admin`: přehled a čtení waiting listu (přihlášení účtem Vandru, jen admini)
- Proměnné: `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `IP_HASH_SECRET` (povinné v ostrém provozu), volitelně `RESEND_API_KEY`, `EMAIL_FROM`. Bez Supabase běží při vývoji demo režim (data v paměti)

## Databáze

- Projekt Supabase **cesta-dobrodruha**, vše pro Vandr ve schématu **`vandr`**
- Nové soubory v `supabase/migrations` se po pushi na main samy pustí do živé databáze (GitHub Actions, `.github/workflows/db-migrate.yml`, secret `SUPABASE_DB_URL`). Přidávat jen zpětně kompatibilní migrace

## Nasazení na Vercel

1. Importovat repo do Vercelu
2. Nastavit proměnné z `.env.example` (Supabase a `IP_HASH_SECRET` povinně, odkazy do obchodů podle potřeby)
3. Doména `vandr.world`
4. Zapnout Web Analytics v projektu

## Checklist před spuštěním

- [ ] Vydat appku na Google Play do produkce (do té doby odkaz z webu veřejně nefunguje)
- [ ] Až bude appka v App Storu: vyplnit `NEXT_PUBLIC_APP_STORE_URL`, oficiální odznak Applu, rozhodnout o e-mailu lidem z waiting listu
- [ ] Doplnit správce údajů (`NEXT_PUBLIC_CONTROLLER_*`) a nechat zásady zkontrolovat právníkem
- [ ] Test z odkazu v bio na iPhonu i Androidu (Instagram i TikTok): `vandr.world/stahnout?utm_source=instagram`
- [ ] Načtení do 2,5 s na mobilních datech
- [ ] Náhled odkazu ve WhatsAppu a Messengeru

## Struktura

- `src/app/page.tsx`: hlavní stránka (statická)
- `src/app/stahnout/route.ts`: chytrý odkaz ke stažení
- `src/components/Landing.tsx`: celá stránka, `Download.tsx`: odznak Google Play, waiting list pro iPhone, lišta dole, `Phone.tsx`, `Qr.tsx`
- `src/components/JoinProvider.tsx`, `WaitlistForm.tsx`, `ThankYou.tsx`, `src/app/api/*`, `src/lib/waitlist.ts`: waiting list pro iPhone
- `src/app/admin`, `src/app/auth` (odkazy z e-mailů aplikace), `src/app/smazani-uctu`, `src/app/zasady-ochrany-osobnich-udaju`
- `src/lib/copy.ts`: všechny texty, `config.ts`: adresy a odkazy do obchodů, `download.ts`: logika stažení
- `scripts/build-screens.mjs`: ukázky aplikace, `build-icons.mjs`: favicony a logo, `test-download.mjs`: testy

## Licence podkladů

- Písma Bricolage Grotesque a Figtree: SIL Open Font License (`src/assets/fonts`)
- Odznak Google Play: oficiální obrázek od Googlu (play.google.com/intl/.../badges), používá se beze změn podle jejich pravidel, v patičce je věta o ochranných známkách
