import Link from "next/link";
import { downloadPath, iosWaitlist, site, stores } from "@/lib/config";
import { copy } from "@/lib/copy";
import { Atlas } from "./Atlas";
import { Logo } from "./Brand";
import { DownloadButton, IphoneWaitlist, PlayBadge, StickyCta } from "./Download";
import { CheckIcon, ChevronIcon } from "./Icons";
import { InstagramFollow } from "./InstagramFollow";
import { JoinProvider } from "./JoinProvider";
import { Phone } from "./Phone";
import { Qr } from "./Qr";

// Jedna stránka, jeden cíl: stáhnout aplikaci.
// Android: odznak Google Play hned nahoře, pak v liště, dole na mobilu a na konci stránky.
// iPhone: Vandr v App Storu zatím není, proto místo tlačítka waiting list (majitel 26. 11. 2026).
// Počítač: odznak Google Play, QR kód a pod ním waiting list pro iPhone.
// Co se komu ukáže, řídí třídy os-* podle html[data-os] (skript v layout.tsx), takže stránka
// zůstává statická a nic neproblikne. Bez skriptu se ukáže verze pro počítač.
export function Landing({ refCode }: { refCode?: string } = {}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: site.name,
    url: site.url,
    image: `${site.url}/logo.png`,
    description: copy.description,
    applicationCategory: "TravelApplication",
    operatingSystem: "iOS, Android",
    offers: { "@type": "Offer", price: "0", priceCurrency: "CZK" },
    installUrl: `${site.url}${downloadPath}`,
    sameAs: [site.instagram, site.tiktok, stores.ios, stores.android].filter(
      Boolean,
    ),
  };

  return (
    <JoinProvider refCode={refCode}>
      <header className="top">
        <div className="wrap top-in">
          <Link href="/" className="top-logo" aria-label="Vandr">
            <Logo id="cat-top" />
          </Link>
          <DownloadButton place="top" />
        </div>
      </header>

      <main>
        {/* 1. Hlavní blok: co to je a tlačítko ke stažení, bez scrollování.
            Šalvějové rozmazané pozadí a telefon jako zařízení na prezentační ploše (styl z reelu). */}
        <section className="hero">
          <span className="hero-mark" aria-hidden="true">
            vandr
          </span>
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <h1>
                <span>{copy.hero.main}</span> <em>{copy.hero.accent}</em>
              </h1>
              <p className="sub">{copy.hero.sub}</p>
              <div className="cta" id="hero-cta">
                <div className="os-hide-ios">
                  <PlayBadge place="hero" />
                  <p className="cta-note">
                    <CheckIcon size={16} /> {copy.download.note}
                  </p>
                  {iosWaitlist && (
                    <a className="iphone-link os-only-desktop" href="#iphone">
                      {copy.download.iphoneLink}
                    </a>
                  )}
                </div>
                <div className="os-only-ios">
                  <IphoneWaitlist id="email-hero" primary />
                </div>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <Phone
                screen="skupina"
                alt=""
                sizes="(min-width: 1024px) 250px, 0px"
                className="phone-back"
              />
              <Phone
                screen="souhrn"
                alt=""
                sizes="(min-width: 1024px) 290px, 64vw"
                priority
                className="phone-front"
              />
              <span className="float float-a">
                <i /> {copy.atlas.places.gem.name}
                <b>{copy.atlas.places.gem.tag}</b>
              </span>
              <span className="float float-b">
                <b>{copy.atlas.continents.total}</b>
                <small>{copy.atlas.continents.unit}</small>
              </span>
            </div>
            <p className="sr-only">{copy.hero.alt}</p>
          </div>
        </section>

        <Atlas />

        {/* Tři čísla, která platí */}
        <section className="facts" aria-label="Vandr v číslech">
          <ul className="wrap facts-list reveal">
            {copy.facts.map((f) => (
              <li key={f.label}>
                <b>{f.n}</b>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 2. Příběh: proč Vandr vznikl */}
        <section className="story" aria-labelledby="story-title">
          <div className="wrap story-in">
            <div className="story-copy reveal">
              <p className="eyebrow">{copy.story.eyebrow}</p>
              <h2 id="story-title">{copy.story.title}</h2>
              {copy.story.paragraphs.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
            <div className="story-chat glass reveal" aria-hidden="true">
              <div className="story-photo">
                <span>📍 Kotor, Černá Hora</span>
              </div>
              {copy.story.bubbles.map((b, i) => (
                <div
                  key={b.text}
                  className={`bubble${i === 0 ? " bubble-me" : ""}`}
                >
                  <b>{b.who}</b>
                  {b.text}
                </div>
              ))}
              <div className="story-reacts">❤️ 12 · 😍 7 · 🔥 4</div>
            </div>
          </div>
        </section>

        {/* 3. Tři hlavní věci: plánování, hidden gems, reporty */}
        <section className="pillars" aria-labelledby="pillars-title">
          <div className="wrap">
            <p className="eyebrow">{copy.pillars.eyebrow}</p>
            <h2 id="pillars-title">{copy.pillars.title}</h2>
            <ol className="pillars-list">
              {copy.pillars.items.map((s, i) => (
                <li key={s.screen} className="pillar reveal">
                  <Phone
                    screen={s.screen}
                    alt={`${s.title} ${s.text}`}
                    sizes="(min-width: 1024px) 270px, 62vw"
                  />
                  <div className="pillar-text glass">
                    <span className="step-n" aria-hidden="true">
                      {i + 1}
                    </span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    <ul className="ticks">
                      {s.points.map((pt) => (
                        <li key={pt}>
                          <CheckIcon size={18} /> {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 4. Jak to jde: čtyři kroky bez obrázků */}
        <section className="flow" aria-labelledby="flow-title">
          <div className="wrap">
            <p className="eyebrow eyebrow-light">{copy.steps.eyebrow}</p>
            <h2 id="flow-title">{copy.steps.title}</h2>
            <ol className="flow-list">
              {copy.steps.items.map((s, i) => (
                <li key={s.title} className="glass reveal">
                  <span className="flow-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <b>{s.title}</b>
                  <span>{s.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5. Profil s planetou */}
        <section className="planet" aria-labelledby="planet-title">
          <div className="wrap planet-in">
            <div className="planet-copy reveal">
              <p className="eyebrow eyebrow-light">{copy.planet.eyebrow}</p>
              <h2 id="planet-title">{copy.planet.title}</h2>
              <p className="sub">{copy.planet.text}</p>
              <ul className="ticks">
                {copy.planet.points.map((p) => (
                  <li key={p}>
                    <CheckIcon size={18} /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <Phone
              screen="profil"
              alt={copy.planet.alt}
              sizes="(min-width: 1024px) 280px, 64vw"
              className="planet-phone reveal-zoom"
            />
          </div>
        </section>

        {/* 6. Další obrazovky */}
        <section className="screens" aria-labelledby="screens-title">
          <div className="wrap">
            <p className="eyebrow">{copy.screens.eyebrow}</p>
            <h2 id="screens-title">{copy.screens.title}</h2>
          </div>
          <ul className="screens-list">
            {copy.screens.items.map((item) => (
              <li key={item.name}>
                <figure>
                  <Phone
                    screen={item.name}
                    alt={`${item.title}: ${item.text}`}
                    sizes="(min-width: 1024px) 210px, 56vw"
                  />
                  <figcaption>
                    <b>{item.title}</b> {item.text}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="wrap screens-note">{copy.screens.note}</p>
        </section>

        {/* 5. Otázky, které brzdí stažení */}
        <section className="faq" aria-labelledby="faq-title">
          <div className="wrap faq-in">
            <h2 id="faq-title">{copy.faq.title}</h2>
            <div className="faq-list">
              {copy.faq.items.map((f) => (
                <details key={f.q} className="glass">
                  <summary>
                    {f.q} <ChevronIcon />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Poslední výzva: tlačítka a na počítači QR kód */}
        <section className="final" id="stahnout" aria-labelledby="final-title">
          <div className="wrap final-in">
            <div className="final-copy">
              <h2 id="final-title">{copy.final.title}</h2>
              <p className="sub">{copy.final.text}</p>
              <div className="cta" id="final-cta">
                <div className="os-hide-ios">
                  <PlayBadge place="final" />
                  <p className="cta-note">
                    <CheckIcon size={16} /> {copy.download.note}
                  </p>
                </div>
              </div>
            </div>
            <div className="qr-card glass os-only-desktop">
              <Qr value={`${site.url}${downloadPath}?utm_source=qr`} label={copy.download.qrAlt} />
              <p>
                <b>{copy.download.qrTitle}</b>
                {copy.download.qrText}
              </p>
            </div>
          </div>
          {/* Waiting list pro iPhone: na iPhonu i na počítači, na Androidu ne. */}
          <div className="wrap os-hide-android" id="iphone">
            <div className="iphone-card glass">
              <IphoneWaitlist id="email-final" ask />
            </div>
          </div>
          <div className="wrap">
            <InstagramFollow />
          </div>
          <footer className="wrap foot">
            <span className="foot-copy">{copy.footer}</span>
            <Link
              href="/zasady-ochrany-osobnich-udaju"
              className="foot-privacy"
            >
              {copy.privacyLink}
            </Link>
            <Link href="/smazani-uctu" className="foot-privacy">
              Smazání účtu
            </Link>
            <span className="foot-tm">{copy.download.trademark}</span>
            <span className="socials">
              <a href={site.instagram} rel="noopener" target="_blank">
                Instagram
              </a>
              <a href={site.tiktok} rel="noopener" target="_blank">
                TikTok
              </a>
            </span>
          </footer>
        </section>
      </main>

      <StickyCta watch="hero-cta" hideAt="final-cta" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </JoinProvider>
  );
}
