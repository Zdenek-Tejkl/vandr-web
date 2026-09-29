"use client";

import { useState, type FormEvent } from "react";
import { shareUrl } from "@/lib/config";
import { copy, formatNumber, goalFor } from "@/lib/copy";
import type { JoinResult } from "@/lib/types";
import { CatGlobe, Logo } from "./Brand";
import { StoriesIcon, WhatsAppIcon } from "./Icons";
import { InstagramFollow } from "./InstagramFollow";

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

export function ThankYou({ result, total, onBack }: { result: JoinResult; total: number; onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [sending, setSending] = useState(false);

  const t = copy.thanks;
  const link = result.code ? shareUrl(result.code) : null;
  const shortLink = link?.replace(/^https?:\/\//, "") ?? "";
  const totalShown = Math.max(total, result.total, result.position ?? 0);
  const refs = result.referrals;

  // Cíl: 3 kamarádi (odznak). Pak vždy další odměna.
  const badge = t.rewards[1];
  const next = t.rewards.find((r) => r.at > refs);
  const goal = refs < badge.at ? badge : next;
  const progressText = !goal
    ? t.allDone
    : goal === badge
      ? t.toBadge(badge.at - refs)
      : t.toNext(goal.at - refs, goal.text);
  const progress = goal ? Math.round((Math.min(refs, goal.at) / goal.at) * 100) : 100;

  async function onCopy() {
    if (!link) return;
    if (await copyText(link)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  async function onStories() {
    if (!link || !result.code) return;
    const text = `${t.shareText} ${link}`;
    try {
      const res = await fetch(`/api/story/${result.code}`);
      if (res.ok) {
        const file = new File([await res.blob()], "vandr-story.png", { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], text });
          return;
        }
      }
      if (navigator.share) {
        await navigator.share({ title: "Vandr", text: t.shareText, url: link });
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

  const whatsapp = link ? `https://wa.me/?text=${encodeURIComponent(`${t.shareText} ${link}`)}` : null;

  return (
    <main className="thanks">
      <section className="thanks-top">
        <div className="wrap">
          <Logo id="cat-thanks-logo" />
          <div className="thanks-hero">
            <span className="thanks-cat">
              <CatGlobe id="cat-thanks" size={60} />
            </span>
            <h1 aria-live="polite">{result.status === "exists" ? t.exists : t.created}</h1>
            {result.position && (
              <>
                <span className="eyebrow eyebrow-light">{t.positionLabel}</span>
                <span className="thanks-pos">#{formatNumber(result.position)}</span>
                <span className="thanks-of">{t.of(formatNumber(totalShown), formatNumber(goalFor(totalShown)))}</span>
                <span className="counter-bar counter-bar-dark" aria-hidden="true">
                  <i style={{ width: `${Math.max(2, Math.round((totalShown / goalFor(totalShown)) * 100))}%` }} />
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="thanks-body">
        <div className="wrap thanks-in">
          {link && (
            <>
              <h2>{t.inviteTitle}</h2>
              <p className="thanks-lead">{t.inviteText}</p>

              <div className="card progress-card">
                <div className="progress-top">
                  <span>
                    {progressText}
                    {goal === badge && (
                      <>
                        {" "}
                        <b>{t.badge}</b>
                      </>
                    )}
                  </span>
                  {goal && (
                    <span className="progress-n">
                      {Math.min(refs, goal.at)}/{goal.at}
                    </span>
                  )}
                </div>
                <div
                  className="bar"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={goal?.at ?? refs}
                  aria-valuenow={Math.min(refs, goal?.at ?? refs)}
                  aria-label={progressText}
                >
                  <i style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="thanks-actions">
                {whatsapp && (
                  <a href={whatsapp} className="btn btn-block" target="_blank" rel="noopener">
                    <WhatsAppIcon /> {t.whatsapp}
                  </a>
                )}
                <button type="button" className="btn btn-block btn-forest" onClick={onStories}>
                  <StoriesIcon /> {t.stories}
                </button>
                <div className="link-row">
                  <label htmlFor="ref-link" className="sr-only">
                    {t.linkLabel}
                  </label>
                  <input id="ref-link" className="ref-link" value={shortLink} readOnly onFocus={(e) => e.currentTarget.select()} />
                  <button type="button" className="btn btn-ochre" onClick={onCopy}>
                    {copied ? t.copied : t.copy}
                  </button>
                </div>
              </div>

              <div className="card rewards">
                <div className="rewards-head">{t.rewardsTitle}</div>
                <ol className="rewards-list">
                  {t.rewards.map((r) => (
                    <li key={r.at} className={refs >= r.at ? "got" : r === goal ? "next" : ""}>
                      <b>{r.at}</b>
                      <span>{r.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}

          {result.answerToken && (
            <div className="question">
              {answered ? (
                <p className="question-thanks">{t.questionThanks}</p>
              ) : (
                <form onSubmit={onAnswer}>
                  <label htmlFor="next-trip" className="question-label">
                    {t.question} <small>{t.questionOptional}</small>
                  </label>
                  <div className="question-row">
                    <input
                      id="next-trip"
                      value={answer}
                      maxLength={200}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder={t.questionPlaceholder}
                      autoComplete="off"
                    />
                    <button type="submit" className="btn btn-outline" disabled={sending || !answer.trim()}>
                      {t.questionSend}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <InstagramFollow light />

          <button type="button" className="link-btn" onClick={onBack}>
            {t.back}
          </button>
        </div>
      </section>
    </main>
  );
}
