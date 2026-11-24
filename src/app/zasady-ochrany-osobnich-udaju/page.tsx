import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Brand";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Zásady ochrany osobních údajů · Vandr",
  description:
    "Jaké údaje zpracovává aplikace Vandr a web vandr.world, kdo je vidí a jak účet smazat.",
  alternates: { canonical: "/zasady-ochrany-osobnich-udaju" },
};

// Návrh textu. Před spuštěním nechat zkontrolovat právníkem (viz README).
export default function PrivacyPage() {
  const c = site.controller;
  return (
    <main className="doc">
      <div className="doc-in">
        <Link href="/" className="doc-home" aria-label="Zpět na vandr.world">
          <Logo id="cat-doc" />
        </Link>
        <h1>Zásady ochrany osobních údajů</h1>
        <p className="doc-meta">Platné od 24. 11. 2026</p>

        <h2>Kdo tvoje údaje zpracovává</h2>
        <p>
          Správce: <b>{c.name}</b>
          {c.id && <>, IČO {c.id}</>}
          {c.address && <>, {c.address}</>}. Kontakt:{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </p>

        <h2>Aplikace Vandr</h2>
        <p>
          V aplikaci zpracováváme jen to, co do ní vložíš, a jen kvůli tomu, aby
          fungovala.
        </p>
        <ul>
          <li>
            <b>Účet</b>: e-mail, heslo (jen jako otisk, ne čitelně), jméno,
            uživatelské jméno, profilová fotka, krátký popis a domovská země.
          </li>
          <li>
            <b>Obsah</b>: zprávy, fotky a texty ve skupinách cest, reakce,
            hlasování, plány cest, výdaje skupiny, reporty, hidden gems a
            recenze, navštívené a vysněné země.
          </li>
          <li>
            <b>Poloha</b>: jen když ji povolíš. Aplikace ji nabídne, ale
            nevyžaduje a funguje i bez ní. Ukládá se v přesnosti, kterou si
            zvolíš (přesný bod, město, nebo jen země). Trasu cesty zapisuje jen
            během cesty, kterou jedeš, a se zamčeným telefonem jen tehdy, když
            to výslovně povolíš. Záznam jde kdykoli vypnout v aplikaci v
            Soukromí.
          </li>
          <li>
            <b>Fotky v plné kvalitě</b>: do skupiny se posílá zmenšená fotka.
            Originál zůstává v tvém telefonu. Do našeho úložiště se nahraje jen
            dočasně (14 dní po odeslání, nebo 3 dny po žádosti někoho z party) a
            pak se smaže. Originál může obsahovat datum a místo pořízení, proto
            ho vidí jen ti, kdo s tebou jedou. Sdílení originálů jde vypnout v
            Soukromí. Aplikace čte jen fotky, které vybereš, a originály fotek,
            které jsi do skupiny poslal(a).
          </li>
          <li>
            <b>Technické údaje</b>: přihlašovací údaje relace a záznamy serveru
            (čas a adresa požadavku), kvůli bezpečnosti. Aplikace neobsahuje
            reklamy ani reklamní a sledovací nástroje.
          </li>
        </ul>

        <h2>Kdo co vidí</h2>
        <ul>
          <li>
            Profil, reporty a hidden gems vidí všichni, nebo jen přátelé, když
            máš profil nastavený jako soukromý.
          </li>
          <li>
            Ve skupině cesty vidí plán, hlasování, výdaje a zprávy pro partu jen
            ti, kdo jedou. Co pošleš všem, vidí i ti, kdo cestu sledují.
          </li>
          <li>Report z cesty se ukáže na profilu, až ho sám(a) zveřejníš.</li>
        </ul>

        <h2>Proč a jak dlouho</h2>
        <p>
          Údaje zpracováváme, abychom ti mohli poskytovat aplikaci (plnění
          smlouvy, tedy podmínek používání). Polohu a přístup k fotkám jen s
          tvým souhlasem v telefonu, který můžeš kdykoli vzít zpět. Údaje
          držíme, dokud máš účet. Originály fotek nejvýš po dobu uvedenou výše,
          záznamy serveru nejvýš 90 dní.
        </p>

        <h2>Smazání účtu</h2>
        <p>
          Účet i se všemi daty smažeš přímo v aplikaci v Nastavení, hned a
          nevratně. Bez aplikace o smazání požádáš podle návodu na stránce{" "}
          <Link href="/smazani-uctu">Smazání účtu</Link>.
        </p>

        <h2 id="cookies">Tenhle web</h2>
        <p>
          Web vandr.world po tobě nic nechce. Nezakládáš tu účet a nezadáváš
          e-mail.
        </p>
        <ul>
          <li>
            <b>Měření návštěvnosti</b>: anonymní, bez cookies (Vercel Web
            Analytics). Počítáme návštěvy a kliknutí na tlačítka ke stažení, ne
            lidi.
          </li>
          <li>
            <b>Odkud přicházíš</b>: parametry odkazu (utm) předáme obchodu s
            aplikacemi, abychom věděli, které video nebo příspěvek funguje.
            Nejde o osobní profil.
          </li>
          <li>
            <b>Microsoft Clarity</b>: záznam průchodu webem, jen když s tím dole
            na stránce souhlasíš. Souhlas můžeš kdykoli vzít zpět smazáním dat
            webu v prohlížeči.
          </li>
          <li>
            <b>Pozvánka do skupiny</b>: stránka pozvánky ukáže jen název cesty,
            jméno toho, kdo zve, a počet lidí ve skupině.
          </li>
        </ul>

        <h2>Dřívější waiting list</h2>
        <p>
          Kdo se před spuštěním zapsal e-mailem na waiting list, toho e-mail
          máme jen kvůli zprávě o spuštění. Smažeme ho nejpozději 6 měsíců po
          spuštění, nebo hned po odhlášení odkazem v e-mailu či napsáním na{" "}
          {site.contactEmail}. Právním základem je souhlas daný při zápisu.
        </p>

        <h2>Kdo nám pomáhá</h2>
        <ul>
          <li>Supabase (databáze, přihlášení a úložiště souborů aplikace)</li>
          <li>
            Vercel (provoz webu a anonymní měření návštěvnosti bez cookies)
          </li>
          <li>Microsoft Clarity (jen na webu a jen s tvým souhlasem)</li>
        </ul>
        <p>
          Údaje nikomu neprodáváme a nepoužíváme k reklamě. Aplikace je pro lidi
          od 18 let.
        </p>

        <h2>Tvoje práva</h2>
        <p>
          Můžeš chtít kopii svých údajů, přístup k nim, jejich opravu, výmaz
          nebo omezení zpracování a můžeš odvolat souhlas. Pokud nesouhlasíš s
          tím, jak s údaji zacházíme, můžeš podat stížnost u Úřadu pro ochranu
          osobních údajů (uoou.gov.cz).
        </p>

        <p className="doc-back">
          <Link href="/">Zpět na vandr.world</Link>
        </p>
      </div>
    </main>
  );
}
