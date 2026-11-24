"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/lib/copy";
import type { JoinError, JoinResult } from "@/lib/types";
import { isValidEmail } from "@/lib/validate";
import { ArrowIcon } from "./Icons";
import { useJoin } from "./JoinProvider";

function errorText(error: JoinError["error"], suggestion?: string) {
  const e = copy.errors;
  if (error === "typo") return suggestion ? e.typo(suggestion) : e.typoGeneric;
  if (error === "disposable") return e.disposable;
  if (error === "no_mx") return e.noMx;
  if (error === "rate_limited") return e.rateLimited;
  if (error === "server") return e.server;
  return e.invalid;
}

// primary: hlavní formulář nahoře, ukáže i chybu z odeslání bez JavaScriptu.
// Bez JavaScriptu se formulář odešle klasicky (POST) a server přesměruje zpět.
export function WaitlistForm({ id, arrow = false, primary = false }: { id: string; arrow?: boolean; primary?: boolean }) {
  const { visit, done, variant, refCode, urlError } = useJoin();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [ownError, setError] = useState<string | null>(null);
  const [urlSeen, setUrlSeen] = useState(false);
  const error = ownError ?? (primary && urlError && !urlSeen ? errorText(urlError) : null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setUrlSeen(true);
    const form = new FormData(e.currentTarget);
    if (!isValidEmail(email)) {
      setError(copy.errors.invalid);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...visit.current, email, website: form.get("website") }),
      });
      const data = (await res.json()) as JoinResult | JoinError;
      if ("error" in data) {
        setError(errorText(data.error, data.suggestion));
        return;
      }
      done(data);
    } catch {
      setError(copy.errors.server);
    } finally {
      setBusy(false);
    }
  }

  const errId = `${id}-error`;

  return (
    <form className="join" method="post" action="/api/join" onSubmit={submit} noValidate>
      <input type="hidden" name="variant" value={variant} />
      {refCode && <input type="hidden" name="ref" value={refCode} />}
      <label htmlFor={id} className="sr-only">
        {copy.emailLabel}
      </label>
      <div className="join-box">
        <input
          id={id}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          placeholder={copy.placeholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) {
              setError(null);
              setUrlSeen(true);
            }
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          required
        />
        <button type="submit" className="btn" disabled={busy}>
          {busy ? copy.buttonBusy : copy.button}
          {arrow && !busy && <ArrowIcon />}
        </button>
      </div>
      {/* Honeypot: lidé ho nevidí, roboti ho vyplní. */}
      <div className="hp" aria-hidden="true">
        <label>
          Web
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p id={errId} className="join-error" role="alert" hidden={!error}>
        <span className="join-error-icon" aria-hidden="true">
          !
        </span>
        <span>{error}</span>
      </p>
    </form>
  );
}
