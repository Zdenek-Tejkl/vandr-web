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

// „Už 1 200 z 2 000 cestovatelů“: cíl je vždy další tisícovka.
// Bez animace čísla, ať neproblikne nižší hodnota. Čtečky dostanou celou větu.
export function Counter({ total }: { total: number }) {
  const goal = goalFor(total);
  const label = copy.counter(formatNumber(total), formatNumber(goal));
  const hint = copy.counterHint(formatNumber(goal - total), formatNumber(goal));
  return (
    <div className="counter">
      <p className="sr-only">
        {label}. {hint}
      </p>
      <div className="counter-row" aria-hidden="true">
        <Faces />
        <span>
          Už <span className="counter-n">{formatNumber(total)}</span> z {formatNumber(goal)} cestovatelů
        </span>
      </div>
      <div className="counter-bar" aria-hidden="true">
        <i style={{ width: `${Math.max(2, Math.round((total / goal) * 100))}%` }} />
      </div>
      <span className="counter-hint" aria-hidden="true">
        {hint}
      </span>
    </div>
  );
}
