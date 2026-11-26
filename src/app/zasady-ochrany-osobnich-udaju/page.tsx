import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Brand";
import { ConsentSettings } from "@/components/ClarityConsent";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Zásady ochrany osobních údajů · Vandr",
  description:
    "Jak Vandr zachází s e-mailem na waiting listu pro iPhone a s údaji v aplikaci.",
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

        <h2>Waiting list pro iPhone: co ukládáme a proč</h2>
        <ul>
          <li>
            <b>E-mail</b>: hned po zápisu ti pošleme jeden uvítací e-mail a pak
            už jen zprávu, až bude Vandr v App Storu. Když
            zadáš e-mail, který už na seznamu je, pošleme uvítací e-mail znovu
            (nejvýš jednou za hodinu). K ničemu jinému ho nepoužijeme.
          </li>
          <li>
            <b>Pozvánkový kód a kdo tě pozval</b>: abychom věděli, kdo koho
            přivedl (u zápisů z dřívějška i kvůli pořadí a odměnám).
          </li>
          <li>
            <b>Odkud přicházíš (UTM parametry odkazu) a typ zařízení (iPhone,
            Android, počítač)</b>: abychom věděli, které video funguje a kolik
            lidí čeká na iPhone. Nejde o osobní profil.
          </li>
          <li>
            <b>Odpověď „Kam jedeš příště?“</b>: jen pokud ji vyplníš. Pomáhá nám
            s obsahem.
          </li>
          <li>
            <b>Otisk IP adresy</b>: jednosměrný otisk, ne samotná adresa. Chrání
            před spamem a před zneužitím pozvánek (třeba když by si někdo zval
            sám sebe). Záznamy o pokusech mažeme do 24 hodin, otisk u zápisu po
            30 dnech.
          </li>
        </ul>

        <h2>Právní základ</h2>
        <p>
          E-mail, pozvánky, UTM a odpověď zpracováváme na základě tvého
          souhlasu, který dáváš zapsáním e-mailu. Můžeš ho kdykoli odvolat
          odkazem v každém e-mailu nebo napsáním na {site.contactEmail}. Otisk
          IP adresy zpracováváme z oprávněného zájmu na ochraně webu před
          zneužitím.
        </p>
        <p>Zapsat se můžeš, jen když je ti aspoň 15 let.</p>

        <h2>Jak dlouho</h2>
        <p>
          Do vydání Vandru v App Storu a nejdéle 6 měsíců po něm, pak údaje
          smažeme.
          Odhlášením se tvůj záznam smaže hned a celý (e-mail, pořadí, kód i
          odpověď). Kamarádi, kteří se zapsali přes tvůj odkaz, na seznamu
          zůstanou.
        </p>

        <h2>Kdo nám pomáhá</h2>
        <ul>
          <li>Supabase (databáze, přihlášení a úložiště souborů aplikace)</li>
          <li>
            Vercel (provoz webu a anonymní měření návštěvnosti bez cookies)
          </li>
          <li>Resend (odeslání e-mailu)</li>
          <li>
            Microsoft Clarity (záznam průchodu webem, jen když s tím souhlasíš)
          </li>
        </ul>
        <p>
          Vercel, Resend a Microsoft sídlí v USA, takže se údaje mohou dostat i
          tam. Předání je chráněné rámcem EU-USA Data Privacy Framework,
          případně standardními smluvními doložkami (SCC) schválenými Evropskou
          komisí.
        </p>
        <p>Údaje nikomu neprodáváme a nepoužíváme k reklamě.</p>

        <h2 id="cookies">Cookies a úložiště v prohlížeči</h2>
        <ul>
          <li>
            <b>Microsoft Clarity</b> (cookies _clck a _clsk a cookies
            Microsoftu): jen po tvém souhlasu. Nahrává kliknutí a posouvání po
            stránce, abychom web zlepšili.
          </li>
          <li>
            <b>Úložiště prohlížeče</b>: tvoje volba u Clarity, kód pozvánky a
            značka návštěvy během jedné relace. Nikam se neposílá kromě kódu
            pozvánky při zápisu.
          </li>
        </ul>
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <p>
            Souhlas s Clarity můžeš kdykoli změnit nebo odvolat:{" "}
            <ConsentSettings className="link-btn" />
          </p>
        )}

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

        <h2>Tvoje práva</h2>
        <p>
          Můžeš chtít přístup ke svým údajům, jejich opravu, výmaz, omezení
          zpracování nebo přenos k jinému správci (přenositelnost). Proti
          zpracování z oprávněného zájmu můžeš vznést námitku. Souhlas můžeš
          kdykoli odvolat. Pokud nesouhlasíš s tím, jak s údaji zacházíme, můžeš
          podat stížnost u Úřadu pro ochranu osobních údajů (uoou.gov.cz).
        </p>

        <p className="doc-back">
          <Link href="/">Zpět na vandr.world</Link>
        </p>
      </div>
    </main>
  );
}
