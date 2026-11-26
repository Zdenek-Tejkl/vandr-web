"use client";

import { track } from "@vercel/analytics";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { downloadPath, iosWaitlist, stores } from "@/lib/config";
import { copy } from "@/lib/copy";
import { platformOf, storeUrl, utmFrom, type Platform, type Utm } from "@/lib/download";
import { DownloadIcon, PhoneIcon } from "./Icons";
import { WaitlistForm } from "./WaitlistForm";

type Place = "hero" | "top" | "sticky" | "final" | "invite";

const noop = () => () => {};
// Zařízení a adresa se za života stránky nemění, stačí je přečíst jednou po načtení.
const readVisitor = () => `${navigator.userAgent}\n${navigator.maxTouchPoints}\n${window.location.search}`;

/** Zařízení a zdroj návštěvy (až v prohlížeči, na serveru je to obecné tlačítko). */
function useVisitor(): { platform: Platform; utm: Utm } {
  const key = useSyncExternalStore(noop, readVisitor, () => "");
  return useMemo(() => {
    if (!key) return { platform: "other", utm: {} };
    const [ua, touch, search] = key.split("\n");
    let platform = platformOf(ua);
    // iPad se hlásí jako Mac, pozná se podle dotyku.
    if (platform === "other" && /Macintosh/.test(ua) && Number(touch) > 1) platform = "ios";
    return { platform, utm: utmFrom(new URLSearchParams(search)) };
  }, [key]);
}

function report(store: string, place: Place) {
  try {
    track("download_click", { store, place });
  } catch {
    // měření nesmí rozbít odkaz
  }
}

/**
 * Oficiální odznak Google Play (česká verze z play.google.com/intl/.../badges, beze změn).
 * Vede na výpis aplikace se zdrojem návštěvy v parametru referrer (Play Install Referrer).
 * Pravidla Googlu: odznak neměnit, jen škálovat, a vždy vést na Google Play.
 */
export function PlayBadge({ place, utm: fixedUtm }: { place: Place; utm?: Utm }) {
  const visitor = useVisitor();
  const href = storeUrl("android", stores, fixedUtm ?? visitor.utm) ?? stores.android;
  return (
    <a className="play-badge" href={href} onClick={() => report("android", place)} aria-label={copy.download.android}>
      {/* eslint-disable-next-line @next/next/no-img-element -- malý statický odznak, optimalizace netřeba */}
      <img src="/badges/google-play-cs.png" width={646} height={250} alt={copy.download.android} />
    </a>
  );
}

/**
 * Waiting list pro iPhone: jedna věta a formulář. Dokud není Vandr v App Storu.
 * Musí být uvnitř JoinProvider. id formuláře musí být na stránce jedinečné.
 */
export function IphoneWaitlist({ id, primary = false, ask = false }: { id: string; primary?: boolean; ask?: boolean }) {
  const visitor = useVisitor();
  if (!iosWaitlist) {
    // Až bude NEXT_PUBLIC_APP_STORE_URL vyplněná, iPhone dostane místo formuláře odkaz do App Storu.
    // Pak sem patří oficiální odznak Applu (Download on the App Store) a úprava textů.
    const href = storeUrl("ios", stores, visitor.utm) ?? stores.ios;
    return (
      <a className="btn btn-block" href={href} onClick={() => report("ios", "hero")}>
        <DownloadIcon size={22} />
        {copy.download.appStore}
      </a>
    );
  }
  return (
    <div className="iphone-wait">
      <p className="iphone-line">
        <PhoneIcon size={22} /> {ask ? `${copy.download.iphoneAsk} ${copy.download.iphone}` : copy.download.iphone}
      </p>
      <WaitlistForm id={id} primary={primary} />
      <p className="cta-note">{copy.download.iphoneNote}</p>
    </div>
  );
}

/** Odkaz ke stažení se zdrojem návštěvy. Bez skriptu vede na /stahnout, které rozhodne na serveru. */
function smartHref(platform: Platform, utm: Utm): string {
  const direct = platform === "other" ? null : storeUrl(platform, stores, utm);
  if (direct) return direct;
  const q = new URLSearchParams();
  for (const [k, val] of Object.entries(utm)) if (val) q.set(`utm_${k}`, val);
  const qs = q.toString();
  return qs ? `${downloadPath}?${qs}` : downloadPath;
}

/**
 * Malé tlačítko v horní a spodní liště. Android jde rovnou na Google Play, počítač na /stahnout
 * (stránka s QR kódem), iPhone bez App Storu k formuláři waiting listu.
 */
export function DownloadButton({ place, utm: fixedUtm }: { place: Place; utm?: Utm }) {
  const visitor = useVisitor();
  const utm = fixedUtm ?? visitor.utm;
  if (visitor.platform === "ios" && iosWaitlist) {
    return (
      <a className="btn btn-sm" href="#iphone" onClick={() => report("ios_waitlist", place)}>
        <PhoneIcon size={18} />
        {copy.download.topIos}
      </a>
    );
  }
  return (
    <a
      className="btn btn-sm"
      href={smartHref(visitor.platform, utm)}
      onClick={() => report(visitor.platform === "other" ? "smart" : visitor.platform, place)}
    >
      <DownloadIcon size={18} />
      {copy.download.top}
    </a>
  );
}

/** Lišta dole na mobilu: objeví se, až hlavní tlačítko odjede z obrazovky, a zmizí u spodní výzvy. */
export function StickyCta({ watch, hideAt }: { watch: string; hideAt: string }) {
  const [show, setShow] = useState(false);
  const state = useRef({ heroGone: false, finalSeen: false });
  useEffect(() => {
    const hero = document.getElementById(watch);
    const end = document.getElementById(hideAt);
    if (!hero || !("IntersectionObserver" in window)) return;
    const update = () => setShow(state.current.heroGone && !state.current.finalSeen);
    const a = new IntersectionObserver(([e]) => {
      state.current.heroGone = !e.isIntersecting && e.boundingClientRect.top < 0;
      update();
    });
    const b = new IntersectionObserver(([e]) => {
      state.current.finalSeen = e.isIntersecting;
      update();
    });
    a.observe(hero);
    if (end) b.observe(end);
    return () => {
      a.disconnect();
      b.disconnect();
    };
  }, [watch, hideAt]);
  return (
    <div className={`sticky${show ? " sticky-on" : ""}`} inert={!show}>
      <span className="sticky-text">
        <b>Vandr</b> {copy.hero.main} {copy.hero.accent}
      </span>
      <DownloadButton place="sticky" />
    </div>
  );
}
