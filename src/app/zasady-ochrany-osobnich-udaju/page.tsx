import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Brand";
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
        <p className="doc-meta">Platné od 28. 9. 2026</p>

        <h2>Kdo tvoje údaje zpracovává</h2>
        <p>
          Správce: <b>{c.name}</b>
          {c.id && <>, IČO {c.id}</>}
          {c.address && <>, {c.address}</>}. Kontakt: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </p>

        <h2>Co ukládáme a proč</h2>
        <ul>
          <li><b>E-mail</b>: abychom ti napsali, až Vandr spustíme. Na nic jiného ho nepoužijeme.</li>
          <li><b>Pozvánkový kód a kdo tě pozval</b>: kvůli pořadí ve frontě a odměnám za pozvání.</li>
          <li><b>Odkud přicházíš (UTM parametry odkazu)</b>: abychom věděli, které video funguje. Nejde o osobní profil.</li>
          <li><b>Odpověď „Kam jedeš příště?“</b>: jen pokud ji vyplníš. Pomáhá nám s obsahem.</li>
          <li><b>Otisk IP adresy</b>: jednosměrný otisk, ne samotná adresa, na ochranu proti spamu. Mažeme ho do 24 hodin.</li>
        </ul>

        <h2>Právní základ</h2>
        <p>Tvůj souhlas, který dáváš zapsáním e-mailu. Můžeš ho kdykoli odvolat odkazem v každém e-mailu nebo napsáním na {site.contactEmail}.</p>

        <h2>Jak dlouho</h2>
        <p>Do spuštění Vandru a nejdéle 6 měsíců po něm, nebo do odhlášení. Pak údaje smažeme.</p>

        <h2>Kdo nám pomáhá</h2>
        <ul>
          <li>Supabase (databáze)</li>
          <li>Vercel (provoz webu a anonymní měření návštěvnosti bez cookies)</li>
          <li>Resend (odeslání e-mailu)</li>
          <li>Microsoft Clarity (záznam průchodu webem, jen když s tím souhlasíš)</li>
        </ul>
        <p>Údaje nikomu neprodáváme a nepoužíváme k reklamě.</p>

        <h2>Tvoje práva</h2>
        <p>
          Můžeš chtít přístup ke svým údajům, jejich opravu, výmaz nebo omezení zpracování a můžeš odvolat souhlas.
          Pokud nesouhlasíš s tím, jak s údaji zacházíme, můžeš podat stížnost u Úřadu pro ochranu osobních údajů (uoou.gov.cz).
        </p>

        <p className="doc-back">
          <Link href="/">Zpět na vandr.world</Link>
        </p>
      </div>
    </main>
  );
}
