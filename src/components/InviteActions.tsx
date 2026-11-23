"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";
import { copy } from "@/lib/copy";

function report(action: string) {
  try {
    track("invite_click", { action });
  } catch {
    // měření nesmí rozbít odkaz
  }
}

/** Odkaz, který otevře pozvánku v nainstalované aplikaci. */
export function OpenInApp({ href }: { href: string }) {
  return (
    <a className="btn btn-ghost-dark btn-block" href={href} onClick={() => report("open_app")}>
      {copy.invite.open}
    </a>
  );
}

/** Kód pozvánky s tlačítkem na zkopírování (pro ruční zadání v aplikaci po instalaci). */
export function InviteCode({ code }: { code: string }) {
  const [done, setDone] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setDone(true);
      report("copy_code");
      setTimeout(() => setDone(false), 2500);
    } catch {
      // schránka nemusí být dostupná, kód je vidět a jde opsat
    }
  };
  return (
    <div className="invite-code">
      <span className="invite-code-label">{copy.invite.codeLabel}</span>
      <code className="invite-code-value">{code}</code>
      <button type="button" className="btn btn-ochre" onClick={onCopy} aria-live="polite">
        {done ? copy.invite.copied : copy.invite.copy}
      </button>
    </div>
  );
}
