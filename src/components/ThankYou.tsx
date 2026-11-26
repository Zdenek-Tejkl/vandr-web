"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/lib/copy";
import type { JoinResult } from "@/lib/types";
import { CatGlobe, Logo } from "./Brand";
import { InstagramFollow } from "./InstagramFollow";

// Děkovná obrazovka po zápisu na waiting list pro iPhone.
// Pořadí, odměny a sdílení odkazu tu od 26. 11. 2026 nejsou: seznam je jen na to,
// abychom dali vědět, až bude Vandr v App Storu. Nepovinná otázka zůstává.
export function ThankYou({ result, onBack }: { result: JoinResult; onBack: () => void }) {
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [sending, setSending] = useState(false);
  const t = copy.thanks;

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
      <section className="thanks-top">
        <div className="wrap">
          <Logo id="cat-thanks-logo" />
          <div className="thanks-hero">
            <span className="thanks-cat">
              <CatGlobe id="cat-thanks" size={60} />
            </span>
            <h1 aria-live="polite">{result.status === "exists" ? t.exists : t.created}</h1>
            <p className="thanks-lede">{t.text}</p>
          </div>
        </div>
      </section>

      <section className="thanks-body">
        <div className="wrap thanks-in">
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
