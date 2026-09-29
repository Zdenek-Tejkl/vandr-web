"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/lib/copy";
import type { JoinError, JoinResult } from "@/lib/types";
import { isValidEmail } from "@/lib/validate";
import { ArrowIcon } from "./Icons";
import { useJoin } from "./JoinProvider";

export function WaitlistForm({ id, arrow = false }: { id: string; arrow?: boolean }) {
  const { visit, done } = useJoin();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
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
        const e = copy.errors;
        setError(
          data.error === "typo" && data.suggestion
            ? e.typo(data.suggestion)
            : data.error === "disposable"
              ? e.disposable
              : data.error === "no_mx"
                ? e.noMx
                : data.error === "rate_limited"
                  ? e.rateLimited
                  : data.error === "server"
                    ? e.server
                    : e.invalid,
        );
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
    <form className="join" onSubmit={submit} noValidate>
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
            if (error) setError(null);
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
