"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import type { Variant } from "@/lib/config";
import type { JoinResult } from "@/lib/types";
import { ThankYou } from "./ThankYou";

export type Visit = {
  variant: Variant;
  ref: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
};

type Ctx = { visit: RefObject<Visit>; done: (r: JoinResult) => void };

const JoinContext = createContext<Ctx | null>(null);

export function useJoin() {
  const ctx = useContext(JoinContext);
  if (!ctx) throw new Error("useJoin outside JoinProvider");
  return ctx;
}

const REF_KEY = "vandr-ref";

function readVisit(variant: Variant): Visit {
  const q = new URLSearchParams(window.location.search);
  const get = (k: string) => q.get(k)?.slice(0, 64) || null;
  let ref = q.get("ref")?.slice(0, 12) || null;
  try {
    if (ref) sessionStorage.setItem(REF_KEY, ref);
    else ref = sessionStorage.getItem(REF_KEY);
  } catch {
    // prohlížeč uvnitř aplikace může úložiště blokovat
  }
  return {
    variant,
    ref,
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_content: get("utm_content"),
  };
}

// Obaluje celou stránku. Po zápisu ji vymění za děkovnou obrazovku (bez vlastní URL).
export function JoinProvider({ variant, children }: { variant: Variant; children: ReactNode }) {
  const visit = useRef<Visit>({
    variant,
    ref: null,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
  });
  const [result, setResult] = useState<JoinResult | null>(null);

  useEffect(() => {
    visit.current = readVisit(variant);
    // Jedna návštěva za relaci, bez cookies.
    try {
      if (sessionStorage.getItem("vandr-view")) return;
      sessionStorage.setItem("vandr-view", "1");
    } catch {
      // bez úložiště počítáme každé načtení
    }
    const body = JSON.stringify(visit.current);
    if (!navigator.sendBeacon?.("/api/view", body)) {
      fetch("/api/view", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, [variant]);

  const done = useCallback((r: JoinResult) => {
    setResult(r);
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <JoinContext.Provider value={{ visit, done }}>
      {result ? <ThankYou result={result} onBack={() => setResult(null)} /> : children}
    </JoinContext.Provider>
  );
}
