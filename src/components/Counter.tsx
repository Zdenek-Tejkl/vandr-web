"use client";

import { useEffect, useState } from "react";
import { copy, formatNumber, travelers } from "@/lib/copy";

function Faces() {
  return (
    <span className="faces" aria-hidden="true">
      <i style={{ background: "#E3A33B" }} />
      <i style={{ background: "#E4572E" }} />
      <i style={{ background: "#8FD0AE" }} />
      <i style={{ background: "#F2F4EE" }} />
    </span>
  );
}

// Počítadlo lidí na seznamu. Jediná animace na stránce: číslo krátce doběhne.
// Dokud je lidí málo, ukazuje se „Buď mezi prvními 1 000“.
export function Counter({ total, label }: { total?: number; label?: string }) {
  const target = total ?? 0;
  const [n, setN] = useState(target);

  useEffect(() => {
    if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const from = Math.max(0, target - 40);
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1100);
      setN(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  if (label || !total) {
    return (
      <p className="counter">
        <Faces />
        <span>{label ?? copy.beFirst}</span>
      </p>
    );
  }

  const { word, verb } = travelers(total);
  const [before, after] = copy.counter("#", word, verb).split("#");
  return (
    <p className="counter" aria-label={copy.counter(formatNumber(total), word, verb)}>
      <Faces />
      <span aria-hidden="true">
        {before}
        <span className="counter-n">{formatNumber(n)}</span>
        {after}
      </span>
    </p>
  );
}
