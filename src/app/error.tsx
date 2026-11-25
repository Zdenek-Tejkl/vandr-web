"use client";

import { Wanderer } from "@/components/Brand";

// Neočekávaná chyba na kterékoli stránce: ve stejném kabátě jako zbytek webu.
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="doc doc-center">
      <div className="doc-in">
        <Wanderer className="nf-art" />
        <h1>Něco se pokazilo.</h1>
        <p>Chyba je na naší straně. Zkus to znovu.</p>
        <p className="doc-back">
          <button type="button" className="btn" onClick={reset}>
            Zkusit znovu
          </button>
        </p>
      </div>
    </main>
  );
}
