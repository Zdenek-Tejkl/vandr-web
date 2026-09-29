import Link from "next/link";
import { site, type Variant } from "@/lib/config";
import { copy, headlines } from "@/lib/copy";
import { waitlistCount } from "@/lib/waitlist";
import { PhoneGlobe } from "./Art";
import { CatGlobe, Logo } from "./Brand";
import { Counter } from "./Counter";
import { GiftIcon, GlobeIcon, LockIcon, PinIcon, StarIcon } from "./Icons";
import { InstagramFollow } from "./InstagramFollow";
import { JoinProvider } from "./JoinProvider";
import { Screens } from "./Screens";
import { WaitlistForm } from "./WaitlistForm";

async function getCount() {
  try {
    return await waitlistCount();
  } catch (e) {
    console.error("count failed", e);
    return null;
  }
}

const featureIcons = [GlobeIcon, PinIcon, StarIcon];

// invite: kód z odkazu vandr.world/r/KOD. Stránka pak kamaráda přivítá a víc vysvětlí, co je Vandr.
export async function Landing({ variant, invite }: { variant: Variant; invite?: string }) {
  const total = await getCount();
  const h = invite ? copy.invite : headlines[variant];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.png`,
    sameAs: [site.instagram, site.tiktok],
  };

  return (
    <JoinProvider variant={variant} total={total ?? 0} refCode={invite}>
      <main>
        {/* 1. Hlavní blok: vše podstatné bez scrollování */}
        <section className="hero">
          <div className="wrap">
            <Logo id="cat-hero" />
          </div>
          <div className="wrap hero-grid">
            <div className="hero-copy">
              {invite && (
                <p className="invite-badge">
                  <GiftIcon size={18} /> {copy.invite.badge}
                </p>
              )}
              <h1>
                <span>{h.main}</span> <em>{h.accent}</em>
              </h1>
              <p className="sub">{invite ? copy.invite.subtitle : copy.subtitle}</p>
              <WaitlistForm id="email-top" arrow />
              <div className="hero-meta">
                <div className="nospam">
                  <p>
                    <LockIcon /> {copy.noSpam}
                  </p>
                  <p className="gdpr">
                    {copy.gdpr(site.controller.name)}{" "}
                    <Link href="/zasady-ochrany-osobnich-udaju">{copy.privacyLink}</Link>
                  </p>
                </div>
                <Counter total={total ?? 0} />
              </div>
            </div>
            <div className="hero-visual">
              <PhoneGlobe />
            </div>
          </div>
        </section>

        {/* Obrazovky aplikace */}
        <Screens />

        {/* Jen pro pozvané: co je Vandr a jak to funguje */}
        {invite && (
          <section className="about" aria-labelledby="about-title">
            <div className="wrap about-in">
              <div className="about-what">
                <p className="eyebrow">{copy.invite.whatEyebrow}</p>
                <h2 id="about-title">{copy.invite.whatTitle}</h2>
                <p className="about-text">{copy.invite.whatText}</p>
              </div>
              <div className="about-how">
                <h3>{copy.invite.stepsTitle}</h3>
                <ol className="steps">
                  {copy.invite.steps.map((s, i) => (
                    <li key={s.title}>
                      <span className="step-n" aria-hidden="true">
                        {i + 1}
                      </span>
                      <span>
                        <b>{s.title}</b> {s.text}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}

        {/* 2. Co tě čeká */}
        <section className="features" aria-labelledby="features-title">
          <div className="wrap">
            <p className="eyebrow">{copy.featuresEyebrow}</p>
            <h2 id="features-title">{copy.featuresTitle}</h2>
            <ul className="feature-list">
              {copy.features.map((f, i) => {
                const Icon = featureIcons[i];
                return (
                  <li key={f.title} className="feature">
                    <div className="feature-row">
                      <span className="feature-icon">
                        <Icon />
                      </span>
                      <div className="feature-text">
                        <h3>{f.title}</h3>
                        <p>{f.text}</p>
                      </div>
                    </div>
                    {i === 2 && (
                      <ul className="tier-chips" aria-label="Tiery">
                        {copy.tiers.map((t, j) => (
                          <li key={t} className={j === 2 ? "on" : j === 4 ? "top" : ""}>
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="invite">
              <GiftIcon />
              <span>
                <b>{copy.inviteTitle}</b> {copy.inviteText}
              </span>
            </p>
          </div>
        </section>

        {/* 3. Druhá šance */}
        <section className="second" aria-labelledby="second-title">
          <div className="wrap second-in">
            <CatGlobe id="cat-second" size={72} className="second-cat" />
            <h2 id="second-title">{copy.secondTitle}</h2>
            <p className="sub">{copy.secondText}</p>
            <WaitlistForm id="email-bottom" />
            <p className="second-nospam">{copy.noSpam}</p>
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
      {!invite && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}
    </JoinProvider>
  );
}
