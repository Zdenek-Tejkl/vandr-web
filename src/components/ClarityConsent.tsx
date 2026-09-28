"use client";

import { useEffect, useState } from "react";

const KEY = "vandr-clarity";
const ID = process.env.NEXT_PUBLIC_CLARITY_ID;

function load(id: string) {
  if (document.getElementById("clarity")) return;
  const s = document.createElement("script");
  s.id = "clarity";
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

// Microsoft Clarity používá cookies, proto se načte až po souhlasu.
// Malý pruh dole, žádné okno přes celou obrazovku.
export function ClarityConsent() {
  const [ask, setAsk] = useState(false);

  useEffect(() => {
    if (!ID) return;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      // bez úložiště se zeptáme znovu
    }
    if (saved === "yes") return load(ID);
    if (saved === "no") return;
    const t = setTimeout(() => setAsk(true), 6000);
    return () => clearTimeout(t);
  }, []);

  if (!ID || !ask) return null;

  const answer = (yes: boolean) => {
    try {
      localStorage.setItem(KEY, yes ? "yes" : "no");
    } catch {
      // nic
    }
    if (yes) load(ID);
    setAsk(false);
  };

  return (
    <div className="consent" role="region" aria-label="Souhlas s měřením">
      <p>Smíme anonymně měřit, jak se web používá? Pomůže nám ho zlepšit.</p>
      <div>
        <button type="button" className="btn btn-sm" onClick={() => answer(true)}>
          Ano
        </button>
        <button type="button" className="btn btn-sm btn-ghost-dark" onClick={() => answer(false)}>
          Ne
        </button>
      </div>
    </div>
  );
}
