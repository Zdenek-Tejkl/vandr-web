"use client";

import { track } from "@vercel/analytics";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { downloadPath, isLive, site, stores } from "@/lib/config";
import { copy } from "@/lib/copy";
import { platformOf, storeUrl, utmFrom, type Platform, type Utm } from "@/lib/download";
import { DownloadIcon, InstagramIcon } from "./Icons";

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

/** Odkaz ke stažení se zdrojem návštěvy. Bez skriptu vede na /stahnout, které rozhodne na serveru. */
function smartHref(platform: Platform, utm: Utm): string {
  const direct = platform === "other" ? null : storeUrl(platform, stores, utm);
  if (direct) return direct;
  const q = new URLSearchParams();
  for (const [k, val] of Object.entries(utm)) if (val) q.set(`utm_${k}`, val);
  const qs = q.toString();
  return qs ? `${downloadPath}?${qs}` : downloadPath;
}

/** Hlavní tlačítko: na iPhonu vede do App Store, na Androidu na Google Play, jinak na /stahnout. */
export function DownloadButton({
  place,
  size = "lg",
  id,
  utm: fixedUtm,
}: {
  place: Place;
  size?: "lg" | "sm";
  id?: string;
  /** Pevný zdroj návštěvy (pozvánka) místo toho z adresy. */
  utm?: Utm;
}) {
  const visitor = useVisitor();
  const platform = visitor.platform;
  const utm = fixedUtm ?? visitor.utm;
  if (!isLive) {
    return (
      <a
        id={id}
        className={`btn${size === "sm" ? " btn-sm" : " btn-block"}`}
        href={site.instagram}
        target="_blank"
        rel="noopener"
        onClick={() => report("instagram", place)}
      >
        <InstagramIcon size={size === "sm" ? 18 : 22} />
        {size === "sm" ? copy.instagram.cta : `${copy.instagram.cta} ${copy.instagram.handle}`}
      </a>
    );
  }
  const has = platform !== "other" && Boolean(platform === "ios" ? stores.ios : stores.android);
  const label =
    size === "sm"
      ? copy.download.top
      : has
        ? platform === "ios"
          ? copy.download.ios
          : copy.download.android
        : copy.download.primary;
  return (
    <a
      id={id}
      className={`btn${size === "sm" ? " btn-sm" : " btn-block"}`}
      href={smartHref(platform, utm)}
      onClick={() => report(has ? platform : "smart", place)}
    >
      <DownloadIcon size={size === "sm" ? 18 : 22} />
      {label}
    </a>
  );
}

/** Dvě tlačítka obchodů vedle sebe. Obchod bez odkazu ukazuje "Brzy" a nikam nevede. */
export function StoreButtons({ place, light = false, utm: fixedUtm }: { place: Place; light?: boolean; utm?: Utm }) {
  const visitor = useVisitor();
  const utm = fixedUtm ?? visitor.utm;
  const items = [
    { key: "ios" as const, prefix: copy.download.storePrefix, name: copy.download.appStore },
    { key: "android" as const, prefix: copy.download.storePrefixPlay, name: copy.download.googlePlay },
  ];
  return (
    <ul className={`stores${light ? " stores-light" : ""}`}>
      {items.map((it) => {
        const href = storeUrl(it.key, stores, utm);
        const inner = (
          <>
            <span className="store-small">{href ? it.prefix : copy.download.soon}</span>
            <span className="store-name">{it.name}</span>
          </>
        );
        return (
          <li key={it.key}>
            {href ? (
              <a className="store" href={href} onClick={() => report(it.key, place)}>
                {inner}
              </a>
            ) : (
              <span className="store store-soon" aria-disabled="true">
                {inner}
              </span>
            )}
          </li>
        );
      })}
    </ul>
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
      <DownloadButton place="sticky" size="sm" />
    </div>
  );
}
