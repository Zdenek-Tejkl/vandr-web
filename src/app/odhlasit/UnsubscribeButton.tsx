"use client";

import { useState } from "react";

export function UnsubscribeButton({ code, token }: { code: string; token: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function go() {
    setState("busy");
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, token }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") return <p role="status">Hotovo, jsi odhlášený(á). Díky, že jsi s námi byl(a).</p>;

  return (
    <div className="doc-actions">
      <button type="button" className="btn" onClick={go} disabled={state === "busy"}>
        {state === "busy" ? "Odhlašuju…" : "Odhlásit"}
      </button>
      {state === "error" && (
        <p role="alert" className="join-error">
          Nepovedlo se to. Zkus to prosím znovu, nebo napiš na ahoj@vandr.world.
        </p>
      )}
    </div>
  );
}
