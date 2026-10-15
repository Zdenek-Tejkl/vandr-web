# vandr-web

Waiting list web pro **Vandr** (vandr.world). Jedna stránka, jedna akce: zadat e-mail.

## Co umí

- Hlavní blok bez scrollování na mobilu: logo, nadpis, podnadpis, e-mail + tlačítko, počítadlo „Už X z Y cestovatelů“ (cíl je vždy další tisícovka)
- Ukázky aplikace (`public/screens`, pro náhled odkazu `src/assets/screens`): screenshoty z demo režimu aplikace Vandr.world
- Odkaz „Sleduj nás na Instagramu“ dole na stránce i na děkovné obrazovce
- Blok „Co tě čeká“ (globus, tipy kamarádů na mapě, body a tiery) a druhý formulář dole
- Děkovná obrazovka bez vlastní URL: pořadí, WhatsApp, sdílení do stories (obrázek 1080 × 1920), kopírování odkazu, odměny, otázka „Kam jedeš příště?“
- Pozvánky: krátký odkaz `vandr.world/r/KOD` vede na vlastní stránku pro kamarády (co je Vandr, jak to funguje, vlastní náhled odkazu). Každý pozvaný posune o 10 míst, odměny 1 / 3 / 5 / 10 / 25 / 50. Neznámý kód ukáže obyčejný úvod
- Ochrana pozvánek: duplicity podle normalizovaného e-mailu (Gmail bez teček, bez `+štítku`), nepozveš sám sebe (stejný otisk IP), z jedné IP nejvýš 2 pozvánky pro stejného člověka. Odhlášený kamarád se odečte
- Ověření e-mailu bez potvrzovacího mailu: tvar, MX záznam domény, jednorázové schránky, časté překlepy (gmail.con, seznam.cy)
- Duplicitní e-mail neukáže pořadí ani kód (nedá se tak zjistit, kdo je na seznamu), jen znovu pošle uvítací e-mail (nejvýš jednou za hodinu)
- Ochrana: honeypot, limit 10 zápisů a 30 návštěv za 10 minut z jedné IP (jen otisk IP, pokusy se mažou do 24 h, otisk u zápisu po 30 dnech), API přijímá jen JSON z vlastního webu (Origin, Sec-Fetch-Site)
- Formulář funguje i před načtením JavaScriptu (POST a přesměrování zpět, e-mail nikdy v URL)
- UTM (`utm_source`, `utm_content`, `utm_campaign`) se ukládá k zápisu i k návštěvě
- A/B test nadpisu: `?h=b`, `?h=c`, nebo `AB_HEADLINE=on` (varianta se pamatuje ve funkční cookie `vandr-h`, roboti vidí výchozí nadpis, úvod zůstává indexovaný)
- Volitelný uvítací e-mail přes Resend s odkazem pro kamarády a odhlášením jedním klikem
- SEO minimum: title, description, Open Graph 1200 × 630, Twitter card, JSON-LD Organization, robots.txt, sitemap.xml, favicon 32 px a 180 px
- Vercel Web Analytics (bez cookies), Microsoft Clarity až po souhlasu (malý pruh dole, odvolání přes „Nastavení cookies“ v patičce)
- Zásady ochrany osobních údajů (`/zasady-ochrany-osobnich-udaju`) a odhlášení (`/odhlasit`), které záznam smaže

## Spuštění

```bash
npm install
npm run dev        # http://localhost:3000
```

- Bez `SUPABASE_URL` a `SUPABASE_SECRET_KEY` běží při vývoji **demo režim** (data jen v paměti). V ostrém provozu na Vercelu demo režim není, zápis bez databáze vrátí chybu
- `IP_HASH_SECRET` je v ostrém provozu povinný (záložní klíč jen pro vývoj)
- Proměnné: viz `.env.example`

## Databáze

- Projekt Supabase **cesta-dobrodruha** (`xpikyrtjmueeyqrpfoox`)
- Vše pro Vandr je ve schématu **`vandr`**, cesta-dobrodruha zůstává v `public`
- Migrace: `supabase/migrations/*.sql` (první dvě nasazené, `20261015000000_vandr_waitlist_fixes.sql` nasadit před sloučením do main, je zpětně kompatibilní)
- Úklid `vandr.waitlist_purge()`: pokusy po 24 h, návštěvy po 90 dnech, otisk IP u zápisu po 30 dnech. S rozšířením pg_cron běží denně samo (zapnout v Database > Extensions před nasazením migrace)
- Tabulky: `vandr.waitlist`, `vandr.waitlist_views`, `vandr.waitlist_attempts`
- Prohlížeč do DB nesahá. Jen server přes funkce `vandr.waitlist_*` a secret key
- **Jednorázově v Supabase:** Settings > Data API > Exposed schemas > přidat `vandr`

Týdenní přehled (Supabase > SQL editor):

```sql
select * from vandr.waitlist_weekly;      -- návštěvy, zápisy, konverze po týdnech
select * from vandr.waitlist_conversion;  -- podle zdroje, videa a varianty nadpisu
```

## Nasazení na Vercel

1. Importovat repo do Vercelu
2. Nastavit proměnné z `.env.example` (povinné `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `IP_HASH_SECRET`)
3. Doména `vandr.world`
4. Zapnout Web Analytics v projektu

## Checklist před spuštěním

- [ ] Doplnit správce údajů (`NEXT_PUBLIC_CONTROLLER_*`) a nechat zásady zkontrolovat právníkem
- [ ] Resend: ověřit doménu (SPF, DKIM), test doručení do Gmailu a Seznamu
- [ ] Test z odkazu v bio na iPhonu i Androidu (Instagram i TikTok)
- [ ] Načtení do 2,5 s na mobilních datech
- [ ] Náhled odkazu ve WhatsAppu a Messengeru
- [ ] UTM odkazy pro každou platformu, např. `vandr.world/?utm_source=tiktok&utm_content=hiddengem`

## Struktura

- `src/app/page.tsx`: hlavní stránka (statická, obnova po 60 s)
- `src/app/h/[variant]`: varianty nadpisu pro A/B test (proxy je přepíše interně, přímý přístup přesměruje na úvod)
- `src/app/r/[code]`: stránka pro pozvané kamarády
- `src/app/api/*`: zápis, odpověď, návštěva, odhlášení, obrázek do stories
- `src/components/*`: formulář, děkovná obrazovka, ilustrace
- `src/lib/copy.ts`: všechny texty na jednom místě
- `scripts/build-geo.mjs`: globus a mapa Gruzie z Natural Earth (`npm run build:geo`)
- `scripts/build-icons.mjs`: favicony a logo (`npm run build:icons`)

## Licence podkladů

- Písma Bricolage Grotesque a Figtree: SIL Open Font License (`src/assets/fonts`)
- Mapová data: Natural Earth (volné dílo) přes `world-atlas`
