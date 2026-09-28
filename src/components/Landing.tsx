import Link from "next/link";
import { site, type Variant } from "@/lib/config";
import { copy, headlines } from "@/lib/copy";
import { waitlistCount } from "@/lib/waitlist";
import { ArtFriendsMap, ArtGlobe, ArtTiers, GlobeSymbol, PhoneProfile } from "./Art";
import { InstagramIcon, Logo, TikTokIcon, Wanderer } from "./Brand";
import { Counter } from "./Counter";
import { JoinProvider } from "./JoinProvider";
import { WaitlistForm } from "./WaitlistForm";

async function getCount() {
  try {
    return await waitlistCount();
  } catch (e) {
    console.error("count failed", e);
    return null;
  }
}

function Legal() {
  return (
    <p className="legal">
      {copy.noSpam} {copy.gdpr(site.controller.name)}{" "}
      <Link href="/zasady-ochrany-osobnich-udaju">{copy.privacyLink}</Link>
    </p>
  );
}

export async function Landing({ variant }: { variant: Variant }) {
  const total = await getCount();
  const h = headlines[variant];
  const [f1, f2, f3] = copy.features;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.png`,
    sameAs: [site.instagram, site.tiktok],
  };

  return (
    <JoinProvider variant={variant}>
      <GlobeSymbol />
      <main>
        {/* 1. Hlavní blok: vše podstatné bez scrollování */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <Logo id="cat-hero" />
              <h1>
                {h.main} <em>{h.accent}</em>
              </h1>
              <p className="sub">{copy.subtitle}</p>
              <WaitlistForm id="email-top" />
              <Legal />
              {total !== null && total >= site.counterMin && <Counter total={total} />}
            </div>
            <div className="hero-visual">
              <PhoneProfile />
            </div>
          </div>
        </section>

        {/* 2. Co tě čeká */}
        <section className="features" aria-labelledby="features-title">
          <div className="wrap">
            <p className="eyebrow">{copy.featuresEyebrow}</p>
            <h2 id="features-title">{copy.featuresTitle}</h2>
            <ul className="feature-list">
              <li className="feature">
                <ArtGlobe label={f1.alt} />
                <h3>{f1.title}</h3>
                <p>{f1.text}</p>
              </li>
              <li className="feature">
                <ArtFriendsMap label={f2.alt} />
                <h3>{f2.title}</h3>
                <p>{f2.text}</p>
              </li>
              <li className="feature">
                <ArtTiers label={f3.alt} />
                <h3>{f3.title}</h3>
                <p>{f3.text}</p>
              </li>
            </ul>
          </div>
        </section>

        {/* 3. Druhá šance */}
        <section className="second" aria-labelledby="second-title">
          <div className="wrap second-in">
            <Wanderer className="second-art" />
            <h2 id="second-title">{copy.secondTitle}</h2>
            <p className="sub">{copy.secondText}</p>
            <WaitlistForm id="email-bottom" />
            <Legal />
          </div>
          <footer className="wrap foot">
            <span>{copy.footer}</span>
            <Link href="/zasady-ochrany-osobnich-udaju">{copy.privacyLink}</Link>
            <span className="socials">
              <a href={site.instagram} aria-label="Vandr na Instagramu" rel="noopener" target="_blank">
                <InstagramIcon />
              </a>
              <a href={site.tiktok} aria-label="Vandr na TikToku" rel="noopener" target="_blank">
                <TikTokIcon />
              </a>
            </span>
          </footer>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </JoinProvider>
  );
}
