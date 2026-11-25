"use client";

import Link from "next/link";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { Logo, Wanderer } from "@/components/Brand";

type State = { kind: "loading" } | { kind: "open"; appUrl: string } | { kind: "expired" } | { kind: "error" };

const SAFE = /^[A-Za-z0-9._~-]{1,512}$/;

const noop = () => () => undefined;

function parse(search: string, rawHash: string): State {
  // Supabase posílá chybu v adrese i za mřížkou, kód jen v adrese.
  const query = new URLSearchParams(search);
  const hash = new URLSearchParams(rawHash.replace(/^#/, ""));
  const code = query.get("code") ?? "";
  if (SAFE.test(code)) {
    const out = new URLSearchParams({ code });
    const flow = query.get("sb_flow_id") ?? "";
    if (SAFE.test(flow)) out.set("sb_flow_id", flow);
    return { kind: "open", appUrl: `vandr:///?${out.toString()}` };
  }
  const errorCode = query.get("error_code") ?? hash.get("error_code") ?? "";
  const error = query.get("error") ?? hash.get("error") ?? "";
  if (errorCode === "otp_expired" || error === "access_denied") return { kind: "expired" };
  return { kind: "error" };
}

export function AuthLanding() {
  // Adresa je známá až v prohlížeči, na serveru se nevykreslí nic.
  const location = useSyncExternalStore(
    noop,
    () => `${window.location.search}\n${window.location.hash}`,
    () => null,
  );
  const state = useMemo<State>(() => {
    if (location === null) return { kind: "loading" };
    const [search, hash] = location.split("\n");
    return parse(search, hash ?? "");
  }, [location]);

  // Zkusíme aplikaci otevřít rovnou. Když to prohlížeč nedovolí, zbývá tlačítko.
  const appUrl = state.kind === "open" ? state.appUrl : null;
  useEffect(() => {
    if (appUrl) window.location.href = appUrl;
  }, [appUrl]);

  return (
    <main className="doc doc-center">
      <div className="doc-in">
        <Link href="/" className="doc-home" aria-label="Zpět na vandr.world">
          <Logo id="cat-auth" />
        </Link>
        {state.kind === "loading" ? null : state.kind === "open" ? (
          <>
            <h1>Skoro tam.</h1>
            <p>Otevři odkaz v aplikaci.</p>
            <p className="doc-back">
              <a href={state.appUrl} className="btn">
                Otevřít Vandr
              </a>
            </p>
          </>
        ) : (
          <>
            <Wanderer className="nf-art" />
            <h1>{state.kind === "expired" ? "Odkaz už neplatí." : "Tohle nevyšlo."}</h1>
            <p>V aplikaci si pošli nový.</p>
            <p className="doc-back">
              <Link href="/" className="btn">
                Na vandr.world
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
