import Link from "next/link";
import { downloadPath, isLive, site, stores } from "@/lib/config";
import { copy } from "@/lib/copy";
import { Logo } from "./Brand";
import { DownloadButton, StickyCta, StoreButtons } from "./Download";
import { CheckIcon, ChevronIcon, PhoneIcon } from "./Icons";
import { InstagramFollow } from "./InstagramFollow";
import { Phone } from "./Phone";
import { Qr } from "./Qr";

// Jedna stránka, jeden cíl: stáhnout aplikaci.
// Hlavní tlačítko je vidět hned, pak znovu nahoře v liště, dole na mobilu a na konci stránky.
export function Landing() {
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
    ...(isLive ? { installUrl: `${site.url}${downloadPath}` } : {}),
    sameAs: [site.instagram, site.tiktok, stores.ios, stores.android].filter(Boolean),
  };

  return (
    <>
      <header className="top">
        <div className="wrap top-in">
          <Link href="/" className="top-logo" aria-label="Vandr">
            <Logo id="cat-top" />
          </Link>
          <DownloadButton place="top" size="sm" />
        </div>
      </header>

      <main>
        {/* 1. Hlavní blok: co to je a tlačítko ke stažení, bez scrollování */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <h1>
                <span>{copy.hero.main}</span> <em>{copy.hero.accent}</em>
              </h1>
              <p className="sub">{copy.hero.sub}</p>
              <div className="cta" id="hero-cta">
                {isLive ? (
                  <>
                    <DownloadButton place="hero" />
                    <StoreButtons place="hero" />
                    <p className="cta-note">
                      <CheckIcon size={16} /> {copy.download.note}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="soon">
                      <PhoneIcon size={20} /> {copy.download.soonTitle}
                    </p>
                    <DownloadButton place="hero" />
                    <p className="cta-note">{copy.download.soonText}</p>
                  </>
                )}
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <Phone screen="profil" alt="" sizes="(min-width: 1024px) 250px, 0px" className="phone-back" />
              <Phone screen="skupina" alt="" sizes="(min-width: 1024px) 280px, 64vw" priority className="phone-front" />
            </div>
            <p className="sr-only">{copy.hero.alt}</p>
          </div>
        </section>

        {/* Tři čísla, která platí */}
        <section className="facts" aria-label="Vandr v číslech">
          <ul className="wrap facts-list">
            {copy.facts.map((f) => (
              <li key={f.label}>
                <b>{f.n}</b>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 2. Jak to funguje: tři kroky, každý s obrazovkou */}
        <section className="steps" aria-labelledby="steps-title">
          <div className="wrap">
            <p className="eyebrow">{copy.steps.eyebrow}</p>
            <h2 id="steps-title">{copy.steps.title}</h2>
            <ol className="steps-list">
              {copy.steps.items.map((s, i) => (
                <li key={s.screen} className="step">
                  <Phone screen={s.screen} alt={`${s.title}: ${s.text}`} sizes="(min-width: 1024px) 250px, 58vw" />
                  <div className="step-text">
                    <span className="step-n" aria-hidden="true">
                      {i + 1}
                    </span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 3. Profil s planetou */}
        <section className="planet" aria-labelledby="planet-title">
          <div className="wrap planet-in">
            <div className="planet-copy">
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
            <Phone screen="profil" alt={copy.planet.alt} sizes="(min-width: 1024px) 280px, 64vw" className="planet-phone" />
          </div>
        </section>

        {/* 4. Další obrazovky */}
        <section className="screens" aria-labelledby="screens-title">
          <div className="wrap">
            <p className="eyebrow">{copy.screens.eyebrow}</p>
            <h2 id="screens-title">{copy.screens.title}</h2>
          </div>
          <ul className="screens-list">
            {copy.screens.items.map((item) => (
              <li key={item.name}>
                <figure>
                  <Phone screen={item.name} alt={`${item.title}: ${item.text}`} sizes="(min-width: 1024px) 210px, 56vw" />
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
                <details key={f.q}>
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
                {isLive ? (
                  <>
                    <DownloadButton place="final" />
                    <StoreButtons place="final" />
                    <p className="cta-note">
                      <CheckIcon size={16} /> {copy.download.note}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="soon">
                      <PhoneIcon size={20} /> {copy.download.soonTitle}
                    </p>
                    <StoreButtons place="final" />
                    <p className="cta-note">{copy.download.soonText}</p>
                  </>
                )}
              </div>
            </div>
            {isLive ? (
              <div className="qr-card">
                <Qr value={`${site.url}${downloadPath}?utm_source=qr`} label={copy.download.qrAlt} />
                <p>
                  <b>{copy.download.qrTitle}</b>
                  {copy.download.qrText}
                </p>
              </div>
            ) : null}
          </div>
          <div className="wrap">
            <InstagramFollow />
          </div>
          <footer className="wrap foot">
            <span className="foot-copy">{copy.footer}</span>
            <Link href="/zasady-ochrany-osobnich-udaju" className="foot-privacy">
              {copy.privacyLink}
            </Link>
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
