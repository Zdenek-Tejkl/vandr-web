"use client";

import { useEffect, useState } from "react";
import { copy, formatNumber, goalFor } from "@/lib/copy";

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

// „Už 1 200 z 2 000 cestovatelů“: cíl je vždy další tisícovka. Číslo krátce doběhne (jediná animace).
export function Counter({ total }: { total: number }) {
  const goal = goalFor(total);
  const [n, setN] = useState(total);

  useEffect(() => {
    if (!total || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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

  const label = copy.counter(formatNumber(total), formatNumber(goal));
  return (
    <div className="counter" aria-label={label}>
      <div className="counter-row">
        <Faces />
        <span aria-hidden="true">
          Už <span className="counter-n">{formatNumber(n)}</span> z {formatNumber(goal)} cestovatelů
        </span>
      </div>
      <div className="counter-bar" aria-hidden="true">
        <i style={{ width: `${Math.max(2, Math.round((total / goal) * 100))}%` }} />
      </div>
      <span className="counter-hint" aria-hidden="true">
        {copy.counterHint(formatNumber(goal - total))}
      </span>
    </div>
  );
}
