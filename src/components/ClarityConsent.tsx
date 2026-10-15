"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "vandr-clarity";
const ID = process.env.NEXT_PUBLIC_CLARITY_ID;
// Odkaz „Nastavení cookies“ znovu otevře lištu se souhlasem.
const OPEN = "vandr-consent-open";

function load(id: string) {
  if (document.getElementById("clarity")) return;
  const s = document.createElement("script");
  s.id = "clarity";
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

// Odvolání souhlasu: smažeme cookies Clarity na naší doméně a stránku načteme znovu (bez skriptu).
function unload() {
  const w = window as Window & { clarity?: (...args: unknown[]) => void };
  try {
    w.clarity?.("consent", false);
  } catch {
    // nic
  }
  const host = window.location.hostname;
  const domains = ["", `; domain=${host}`, `; domain=.${host.split(".").slice(-2).join(".")}`];
  for (const name of ["_clck", "_clsk"]) {
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d}`;
  }
  window.location.reload();
}

// Microsoft Clarity nahrává průchod webem a používá cookies, proto se načte až po souhlasu.
// Malý pruh dole, žádné okno přes celou obrazovku.
export function ClarityConsent() {
  const [ask, setAsk] = useState(false);

  useEffect(() => {
    if (!ID) return;
    const open = () => setAsk(true);
    window.addEventListener(OPEN, open);
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      // bez úložiště se zeptáme znovu
    }
    if (saved === "yes") load(ID);
    if (saved) return () => window.removeEventListener(OPEN, open);
    const t = setTimeout(open, 6000);
    return () => {
      clearTimeout(t);
      window.removeEventListener(OPEN, open);
    };
  }, []);

  if (!ID || !ask) return null;

  const answer = (yes: boolean) => {
    let before: string | null = null;
    try {
      before = localStorage.getItem(KEY);
      localStorage.setItem(KEY, yes ? "yes" : "no");
    } catch {
      // nic
    }
    setAsk(false);
    if (yes) load(ID);
    else if (before === "yes" || document.getElementById("clarity")) unload();
  };

  return (
    <div className="consent" role="region" aria-label="Souhlas s Microsoft Clarity">
      <p>
        Smíme zapnout Microsoft Clarity? Nahrává, jak se web používá (kliknutí, posouvání), a ukládá k tomu cookies.
        Pomůže nám web zlepšit. <Link href="/zasady-ochrany-osobnich-udaju#cookies">Víc v zásadách</Link>
      </p>
      <div>
        <button type="button" className="btn btn-sm" onClick={() => answer(true)}>
          Povolit
        </button>
        <button type="button" className="btn btn-sm btn-ghost-dark" onClick={() => answer(false)}>
          Odmítnout
        </button>
      </div>
    </div>
  );
}

// Odkaz v patičce a v zásadách: souhlas se dá kdykoli změnit nebo odvolat.
export function ConsentSettings({ className }: { className?: string }) {
  if (!ID) return null;
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN))}>
      Nastavení cookies
    </button>
  );
}
