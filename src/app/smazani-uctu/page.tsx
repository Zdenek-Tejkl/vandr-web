import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Brand";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Smazání účtu · Vandr",
  description:
    "Jak smazat účet v aplikaci Vandr a všechna data k němu, i bez aplikace.",
  alternates: { canonical: "/smazani-uctu" },
};

// Stránka pro Google Play (Bezpečnost dat: odkaz na smazání účtu bez instalace aplikace).
export default function DeleteAccountPage() {
  const subject = encodeURIComponent("Smazání účtu Vandr");
  const body = encodeURIComponent(
    "Prosím o smazání mého účtu ve Vandru a všech dat k němu.\n\nE-mail účtu: \nUživatelské jméno (pokud ho znám): \n",
  );
  return (
    <main className="doc">
      <div className="doc-in">
        <Link href="/" className="doc-home" aria-label="Zpět na vandr.world">
          <Logo id="cat-del" />
        </Link>
        <h1>Smazání účtu</h1>
        <p className="doc-meta">Aplikace Vandr</p>

        <h2>V aplikaci (hned)</h2>
        <ol>
          <li>Otevři Vandr a jdi na Profil.</li>
          <li>Vpravo nahoře otevři Nastavení.</li>
          <li>Dole klepni na Smazat účet a potvrď.</li>
        </ol>
        <p>Účet se smaže hned a nevratně.</p>

        <h2>Bez aplikace</h2>
        <p>
          Napiš nám z e-mailu, se kterým máš účet, na{" "}
          <a
            href={`mailto:${site.contactEmail}?subject=${subject}&body=${body}`}
          >
            {site.contactEmail}
          </a>{" "}
          s předmětem „Smazání účtu Vandr“. Účet smažeme do 30 dní a dáme ti
          vědět. Kvůli ochraně tvého účtu mažeme jen na žádost z e-mailu účtu.
        </p>

        <h2>Co se smaže</h2>
        <ul>
          <li>
            Účet: e-mail, heslo, jméno, uživatelské jméno, profilová fotka a
            popis.
          </li>
          <li>
            Všechno, co jsi vložil(a): fotky a jejich originály, zprávy, texty,
            reporty, plány, hidden gems a recenze, reakce, hlasy, navštívené
            země a body trasy.
          </li>
          <li>Přátelství, žádosti a blokace.</li>
        </ul>

        <h2>Co zůstane</h2>
        <ul>
          <li>
            Ve skupinách cest a výdajích ostatních zůstane bez tvého jména
            záznam o tom, kdo kolik platil, aby jim seděly účty.
          </li>
          <li>
            Záznamy serveru (čas a adresa požadavku) se samy smažou nejpozději
            do 90 dní.
          </li>
        </ul>

        <p>
          Víc v{" "}
          <Link href="/zasady-ochrany-osobnich-udaju">
            zásadách ochrany osobních údajů
          </Link>
          .
        </p>

        <p className="doc-back">
          <Link href="/">Zpět na vandr.world</Link>
        </p>
      </div>
    </main>
  );
}
