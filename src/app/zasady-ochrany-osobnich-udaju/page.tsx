import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Brand";
import { ConsentSettings } from "@/components/ClarityConsent";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Zásady ochrany osobních údajů · Vandr",
  description: "Jak Vandr zachází s tvým e-mailem na waiting listu.",
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
        <p className="doc-meta">Platné od 15. 10. 2026</p>

        <h2>Kdo tvoje údaje zpracovává</h2>
        <p>
          Správce: <b>{c.name}</b>
          {c.id && <>, IČO {c.id}</>}
          {c.address && <>, {c.address}</>}. Kontakt: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </p>

        <h2>Co ukládáme a proč</h2>
        <ul>
          <li>
            <b>E-mail</b>: hned po zápisu ti pošleme jeden uvítací e-mail s odkazem pro kamarády a pak už jen zprávu, až
            Vandr spustíme. Když zadáš e-mail, který už na seznamu je, pošleme uvítací e-mail znovu (nejvýš jednou za
            hodinu). K ničemu jinému ho nepoužijeme.
          </li>
          <li><b>Pozvánkový kód a kdo tě pozval</b>: kvůli pořadí ve frontě a odměnám za pozvání.</li>
          <li><b>Odkud přicházíš (UTM parametry odkazu)</b>: abychom věděli, které video funguje. Nejde o osobní profil.</li>
          <li><b>Odpověď „Kam jedeš příště?“</b>: jen pokud ji vyplníš. Pomáhá nám s obsahem.</li>
          <li>
            <b>Otisk IP adresy</b>: jednosměrný otisk, ne samotná adresa. Chrání před spamem a před zneužitím pozvánek
            (třeba když by si někdo zval sám sebe). Záznamy o pokusech mažeme do 24 hodin, otisk u zápisu po 30 dnech.
          </li>
        </ul>

        <h2>Právní základ</h2>
        <p>
          E-mail, pozvánky, UTM a odpověď zpracováváme na základě tvého souhlasu, který dáváš zapsáním e-mailu. Můžeš ho
          kdykoli odvolat odkazem v každém e-mailu nebo napsáním na {site.contactEmail}. Otisk IP adresy zpracováváme z
          oprávněného zájmu na ochraně webu před zneužitím.
        </p>
        <p>Zapsat se můžeš, jen když je ti aspoň 15 let.</p>

        <h2>Jak dlouho</h2>
        <p>
          Do spuštění Vandru a nejdéle 6 měsíců po něm, pak údaje smažeme. Odhlášením se tvůj záznam smaže hned a celý
          (e-mail, pořadí, kód i odpověď). Kamarádi, kteří se zapsali přes tvůj odkaz, na seznamu zůstanou.
        </p>

        <h2>Kdo nám pomáhá</h2>
        <ul>
          <li>Supabase (databáze)</li>
          <li>Vercel (provoz webu a anonymní měření návštěvnosti bez cookies)</li>
          <li>Resend (odeslání e-mailu)</li>
          <li>Microsoft Clarity (záznam průchodu webem, jen když s tím souhlasíš)</li>
        </ul>
        <p>
          Vercel, Resend a Microsoft sídlí v USA, takže se údaje mohou dostat i tam. Předání je chráněné rámcem EU-USA
          Data Privacy Framework, případně standardními smluvními doložkami (SCC) schválenými Evropskou komisí.
        </p>
        <p>Údaje nikomu neprodáváme a nepoužíváme k reklamě.</p>

        <h2 id="cookies">Cookies a úložiště v prohlížeči</h2>
        <ul>
          <li>
            <b>vandr-h</b> (funkční cookie, 30 dní): jen když testujeme dva nadpisy, pamatuje si písmeno varianty, ať
            vidíš pořád stejný. Žádné osobní údaje.
          </li>
          <li>
            <b>Microsoft Clarity</b> (cookies _clck a _clsk a cookies Microsoftu): jen po tvém souhlasu. Nahrává kliknutí a
            posouvání po stránce, abychom web zlepšili.
          </li>
          <li>
            <b>Úložiště prohlížeče</b>: tvoje volba u Clarity, kód pozvánky a značka návštěvy během jedné relace. Nikam se
            neposílá kromě kódu pozvánky při zápisu.
          </li>
        </ul>
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <p>
            Souhlas s Clarity můžeš kdykoli změnit nebo odvolat: <ConsentSettings className="link-btn" />
          </p>
        )}

        <h2>Tvoje práva</h2>
        <p>
          Můžeš chtít přístup ke svým údajům, jejich opravu, výmaz, omezení zpracování nebo přenos k jinému správci
          (přenositelnost). Proti zpracování z oprávněného zájmu můžeš vznést námitku. Souhlas můžeš kdykoli odvolat.
          Pokud nesouhlasíš s tím, jak s údaji zacházíme, můžeš podat stížnost u Úřadu pro ochranu osobních údajů
          (uoou.gov.cz).
        </p>

        <p className="doc-back">
          <Link href="/">Zpět na vandr.world</Link>
        </p>
      </div>
    </main>
  );
}
