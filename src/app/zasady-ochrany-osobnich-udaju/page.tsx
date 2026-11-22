import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Brand";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Zásady ochrany osobních údajů · Vandr",
  description: "Jaké údaje zpracovává web vandr.world a co platí pro aplikaci Vandr.",
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
        <p className="doc-meta">Platné od 22. 11. 2026</p>

        <h2>Kdo tvoje údaje zpracovává</h2>
        <p>
          Správce: <b>{c.name}</b>
          {c.id && <>, IČO {c.id}</>}
          {c.address && <>, {c.address}</>}. Kontakt: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </p>

        <h2>Tenhle web</h2>
        <p>Web vandr.world po tobě nic nechce. Nezakládáš tu účet a nezadáváš e-mail.</p>
        <ul>
          <li>
            <b>Měření návštěvnosti</b>: anonymní, bez cookies (Vercel Web Analytics). Počítáme návštěvy a kliknutí na
            tlačítka ke stažení, ne lidi.
          </li>
          <li>
            <b>Odkud přicházíš</b>: parametry odkazu (utm) předáme obchodu s aplikacemi, abychom věděli, které video
            nebo příspěvek funguje. Nejde o osobní profil.
          </li>
          <li>
            <b>Microsoft Clarity</b>: záznam průchodu webem, jen když s tím dole na stránce souhlasíš. Souhlas můžeš
            kdykoli vzít zpět smazáním dat webu v prohlížeči.
          </li>
        </ul>

        <h2>Dřívější waiting list</h2>
        <p>
          Kdo se před spuštěním zapsal e-mailem na waiting list, toho e-mail máme jen kvůli zprávě o spuštění. Smažeme
          ho nejpozději 6 měsíců po spuštění, nebo hned po odhlášení odkazem v e-mailu či napsáním na{" "}
          {site.contactEmail}. Právním základem je souhlas daný při zápisu.
        </p>

        <h2>Aplikace Vandr</h2>
        <p>
          V aplikaci ukládáme jen to, co do ní vložíš: e-mail, profil, fotky, texty, místa a polohu v přesnosti, kterou
          si zvolíš. Polohu aplikace nabízí, ale nevyžaduje. Účet i se všemi daty smažeš v aplikaci v Nastavení, hned a
          nevratně. Podrobnosti jsou v podmínkách přímo v aplikaci.
        </p>

        <h2>Kdo nám pomáhá</h2>
        <ul>
          <li>Supabase (databáze a soubory)</li>
          <li>Vercel (provoz webu a anonymní měření návštěvnosti bez cookies)</li>
          <li>Microsoft Clarity (jen s tvým souhlasem)</li>
        </ul>
        <p>Údaje nikomu neprodáváme a nepoužíváme k reklamě.</p>

        <h2>Tvoje práva</h2>
        <p>
          Můžeš chtít přístup ke svým údajům, jejich opravu, výmaz nebo omezení zpracování a můžeš odvolat souhlas.
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
