"use client";

import { useState, type FormEvent } from "react";
import { shareUrl } from "@/lib/config";
import { copy, formatNumber } from "@/lib/copy";
import type { JoinResult } from "@/lib/types";
import { CatGlobe, Logo } from "./Brand";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Starší prohlížeče uvnitř aplikací: záložní cesta přes výběr textu.
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    el.remove();
    return ok;
  }
}

export function ThankYou({ result, onBack }: { result: JoinResult; onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [sending, setSending] = useState(false);

  const pos = result.position ? formatNumber(result.position) : null;
  const link = result.code ? shareUrl(result.code) : null;
  const next = copy.thanks.rewards.find((r) => r.at > result.referrals) ?? copy.thanks.rewards.at(-1)!;
  const progress = Math.min(100, Math.round((result.referrals / next.at) * 100));

  const heading = !pos
    ? copy.thanks.createdNoPos
    : result.status === "exists"
      ? copy.thanks.exists(pos)
      : copy.thanks.created(pos);

  async function onCopy() {
    if (!link) return;
    if (await copyText(link)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  async function onShare() {
    if (!link || !result.code) return;
    const text = `${copy.thanks.shareText} ${link}`;
    try {
      const res = await fetch(`/api/story/${result.code}`);
      if (res.ok) {
        const blob = await res.blob();
        const file = new File([blob], "vandr-story.png", { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], text });
          return;
        }
      }
      if (navigator.share) {
        await navigator.share({ title: "Vandr", text: copy.thanks.shareText, url: link });
        return;
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
    }
    // Bez sdílení: otevřeme obrázek (podržením se uloží) a zkopírujeme odkaz.
    window.open(`/api/story/${result.code}`, "_blank", "noopener");
    void onCopy();
  }

  async function onAnswer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!answer.trim() || !result.code || !result.answerToken) return;
    setSending(true);
    try {
      await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: result.code, token: result.answerToken, answer }),
      });
    } catch {
      // nepovinná otázka, chybu nehlásíme
    }
    setAnswered(true);
    setSending(false);
  }

  return (
    <main className="thanks">
      <div className="thanks-in">
        <Logo id="cat-thanks-logo" className="thanks-logo" />
        <CatGlobe id="cat-thanks" size={88} className="thanks-cat" />
        <h1 className="thanks-title" aria-live="polite">
          {heading}
        </h1>

        {link && (
          <>
            <p className="thanks-lead">
              <b>{copy.thanks.challenge}</b> {copy.thanks.boost}
            </p>

            <div className="ref-box">
              <label htmlFor="ref-link" className="ref-label">
                {copy.thanks.linkLabel}
              </label>
              <input id="ref-link" className="ref-link" value={link} readOnly onFocus={(e) => e.currentTarget.select()} />
              <div className="thanks-actions">
                <button type="button" className="btn" onClick={onCopy}>
                  {copied ? copy.thanks.copied : copy.thanks.copy}
                </button>
                <button type="button" className="btn btn-ghost" onClick={onShare}>
                  {copy.thanks.share}
                </button>
              </div>
            </div>

            <div className="rewards">
              <div className="rewards-top">
                <span>{copy.thanks.invited(result.referrals)}</span>
                <span>
                  {Math.min(result.referrals, next.at)} / {next.at}
                </span>
              </div>
              <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={next.at} aria-valuenow={result.referrals} aria-label={copy.thanks.invited(result.referrals)}>
                <i style={{ width: `${progress}%` }} />
              </div>
              <ul className="rewards-list">
                {copy.thanks.rewards.map((r) => (
                  <li key={r.at} className={result.referrals >= r.at ? "got" : ""}>
                    <b>{r.at}</b> {r.text}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {result.answerToken && (
          <div className="question">
            {answered ? (
              <p className="question-thanks">{copy.thanks.questionThanks}</p>
            ) : (
              <form onSubmit={onAnswer}>
                <label htmlFor="next-trip" className="question-label">
                  {copy.thanks.question}
                </label>
                <span className="question-hint">{copy.thanks.questionHint}</span>
                <div className="join-row">
                  <input
                    id="next-trip"
                    value={answer}
                    maxLength={200}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={copy.thanks.questionPlaceholder}
                    autoComplete="off"
                  />
                  <button type="submit" className="btn btn-ghost" disabled={sending || !answer.trim()}>
                    {copy.thanks.questionSend}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <button type="button" className="link-btn" onClick={onBack}>
          {copy.thanks.back}
        </button>
      </div>
    </main>
  );
}
