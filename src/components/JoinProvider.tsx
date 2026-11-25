"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import type { Variant } from "@/lib/config";
import type { JoinError, JoinResult } from "@/lib/types";
import { ThankYou } from "./ThankYou";

export type Visit = {
  variant: Variant;
  ref: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
};

// urlError: chyba z odeslání formuláře bez JavaScriptu (/?join_error=...).
type Ctx = {
  visit: RefObject<Visit>;
  done: (r: JoinResult) => void;
  variant: Variant;
  refCode: string | null;
  urlError: JoinError["error"] | null;
};

const JoinContext = createContext<Ctx | null>(null);

export function useJoin() {
  const ctx = useContext(JoinContext);
  if (!ctx) throw new Error("useJoin outside JoinProvider");
  return ctx;
}

const REF_KEY = "vandr-ref";
const URL_ERRORS: JoinError["error"][] = ["invalid", "disposable", "typo", "no_mx", "rate_limited", "server"];

// Výsledek odeslání formuláře bez JavaScriptu: server přesměroval na /?joined=...
function readRedirect(): { result: JoinResult | null; error: JoinError["error"] | null } {
  const q = new URLSearchParams(window.location.search);
  const joined = q.get("joined");
  const error = q.get("join_error");
  const mailed = q.get("mail") === "1";
  if (!joined && !error) return { result: null, error: null };
  if (joined === "created" || joined === "exists") {
    return { result: { status: joined, position: null, code: null, referrals: 0, total: 0, mailed }, error: null };
  }
  const known = URL_ERRORS.find((e) => e === error);
  return { result: null, error: known ?? "server" };
}

function readVisit(variant: Variant, refCode?: string): Visit {
  const q = new URLSearchParams(window.location.search);
  const get = (k: string) => q.get(k)?.slice(0, 64) || null;
  let ref = refCode || q.get("ref")?.slice(0, 12) || null;
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
export function JoinProvider({
  variant,
  total,
  refCode,
  children,
}: {
  variant: Variant;
  total: number;
  refCode?: string;
  children: ReactNode;
}) {
  const visit = useRef<Visit>({
    variant,
    ref: null,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
  });
  const [result, setResult] = useState<JoinResult | null>(null);
  const [urlError, setUrlError] = useState<JoinError["error"] | null>(null);

  useEffect(() => {
    const r = readRedirect();
    if (!r.result && !r.error) return;
    // Až po hydrataci; parametry z adresy pak uklidíme.
    const t = setTimeout(() => {
      if (r.result) setResult(r.result);
      if (r.error) setUrlError(r.error);
      const url = new URL(window.location.href);
      for (const k of ["joined", "join_error", "mail"]) url.searchParams.delete(k);
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    });
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    visit.current = readVisit(variant, refCode);
    // Jedna návštěva za relaci, bez cookies.
    try {
      if (sessionStorage.getItem("vandr-view")) return;
      sessionStorage.setItem("vandr-view", "1");
    } catch {
      // bez úložiště počítáme každé načtení
    }
    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visit.current),
      keepalive: true,
    }).catch(() => {});
  }, [variant, refCode]);

  const done = useCallback((r: JoinResult) => {
    setResult(r);
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <JoinContext.Provider value={{ visit, done, variant, refCode: refCode ?? null, urlError }}>
      {result ? <ThankYou result={result} total={total} onBack={() => setResult(null)} /> : children}
    </JoinContext.Provider>
  );
}
