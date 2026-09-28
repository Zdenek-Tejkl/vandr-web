"use client";

import { useEffect, useState } from "react";
import { copy, formatNumber, travelers } from "@/lib/copy";

// Jediná animace na stránce: číslo krátce doběhne na skutečnou hodnotu.
export function Counter({ total }: { total: number }) {
  const [n, setN] = useState(total);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const from = Math.max(0, total - 40);
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1100);
      setN(Math.round(from + (total - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [total]);

  const { word, verb } = travelers(total);
  const [before, after] = copy.counter("#", word, verb).split("#");
  return (
    <p className="counter" aria-label={copy.counter(formatNumber(total), word, verb)}>
      <span className="counter-faces" aria-hidden="true">
        <span className="av" style={{ background: "#34546E" }}>PN</span>
        <span className="av" style={{ background: "#8A4A2F" }}>AK</span>
        <span className="av" style={{ background: "#6B4E31" }}>KM</span>
      </span>
      <span aria-hidden="true">
        {before}
        <b className="counter-n">{formatNumber(n)}</b>
        {after}
      </span>
    </p>
  );
}
