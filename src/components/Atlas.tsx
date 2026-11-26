import { copy } from "@/lib/copy";

// Ukázka aplikace jako tmavá „palubní deska“ nad leteckou mapou (styl z reelu, který poslal majitel
// 26. 11. 2026). Všechno je SVG a CSS přímo ve stránce: žádný obrázek ke stažení, žádná knihovna
// grafů, nic se nepočítá v prohlížeči. Čísla jsou demo data a pod ukázkou to stojí napsané.
// Pro čtečky obrazovky je celá ukázka skrytá a místo ní je jedna věta (sr-only), protože jednotlivé
// popisky grafů by bez obrázku nedávaly smysl.

const a = copy.atlas;

/** Letecký pohled na zátoku: moře, pole s řádky, cesty, stromy a zlatě zvýrazněné místo. */
function AerialMap() {
  const trees: [number, number, number][] = [
    [262, 96, 26], [292, 132, 20], [250, 168, 30], [286, 214, 22], [248, 262, 26], [300, 300, 18],
    [266, 352, 28], [300, 404, 22], [262, 452, 30], [296, 520, 24], [270, 578, 28],
    [548, 300, 22], [578, 322, 18], [612, 304, 24], [742, 300, 20], [770, 322, 26],
    [566, 560, 24], [592, 600, 20],
  ];
  return (
    <svg className="map-svg" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        <pattern id="rows-v" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="#1f4c2b" />
          <rect width="6" height="14" fill="#2f6a39" />
        </pattern>
        <pattern id="rows-d" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <rect width="16" height="16" fill="#1c4528" />
          <rect width="7" height="16" fill="#2b6236" />
        </pattern>
        <pattern id="rows-e" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
          <rect width="12" height="12" fill="#26573a" />
          <rect width="5" height="12" fill="#357248" />
        </pattern>
        <pattern id="rows-g" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="#5a4413" />
          <rect width="7" height="14" fill="#d9a640" />
        </pattern>
        <pattern id="waves" width="40" height="18" patternUnits="userSpaceOnUse">
          <path d="M0 9 Q10 4 20 9 T40 9" fill="none" stroke="#2c6b5c" strokeWidth="1.4" opacity="0.5" />
        </pattern>
        <radialGradient id="tree" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#9fd49a" />
          <stop offset="0.55" stopColor="#3f8a4a" />
          <stop offset="1" stopColor="#1c4a28" />
        </radialGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0d3530" />
          <stop offset="1" stopColor="#14473d" />
        </linearGradient>
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      <rect width="1000" height="620" fill="#173d24" />

      {/* moře a pobřeží */}
      <path d="M0 0 H200 C240 90 205 170 228 250 C252 340 210 430 238 520 C250 570 236 600 240 620 H0 Z" fill="url(#sea)" />
      <path d="M0 0 H200 C240 90 205 170 228 250 C252 340 210 430 238 520 C250 570 236 600 240 620 H0 Z" fill="url(#waves)" />
      <path d="M200 0 C240 90 205 170 228 250 C252 340 210 430 238 520 C250 570 236 600 240 620" fill="none" stroke="#b9d9b0" strokeWidth="3" opacity="0.35" />

      {/* pole */}
      <rect x="322" y="28" width="210" height="246" rx="8" fill="url(#rows-v)" />
      <rect x="792" y="18" width="230" height="270" rx="8" fill="url(#rows-d)" />
      <rect x="322" y="336" width="232" height="300" rx="8" fill="url(#rows-e)" />
      <rect x="618" y="356" width="400" height="280" rx="8" fill="url(#rows-d)" />

      {/* zlatě zvýrazněné místo se září */}
      <rect className="map-glow" x="566" y="48" width="196" height="214" rx="20" fill="#e2b357" opacity="0.45" filter="url(#glow)" />
      <rect x="570" y="52" width="188" height="206" rx="16" fill="url(#rows-g)" />
      <rect x="570" y="52" width="188" height="206" rx="16" fill="none" stroke="#f3d48e" strokeWidth="3" />

      {/* cesty */}
      <path d="M552 -10 C548 120 560 250 580 318 C600 350 700 334 1010 330" fill="none" stroke="#9ec9a3" strokeWidth="16" opacity="0.5" />
      <path d="M776 -10 C772 120 780 240 784 330" fill="none" stroke="#9ec9a3" strokeWidth="12" opacity="0.4" />
      <path d="M580 318 C560 420 600 520 590 630" fill="none" stroke="#9ec9a3" strokeWidth="10" opacity="0.35" />

      {/* stromy se stínem */}
      {trees.map(([x, y, r]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x + 6} cy={y + 8} r={r} fill="#06150c" opacity="0.45" />
          <circle cx={x} cy={y} r={r} fill="url(#tree)" />
        </g>
      ))}

      {/* trasa cesty */}
      <path
        className="map-route"
        d="M380 186 C470 120 560 210 664 156 C760 108 830 96 884 140 M664 156 C640 300 520 420 436 474"
        fill="none"
        stroke="#f3d48e"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="2 12"
      />

      {/* body na mapě */}
      {[
        [380, 186],
        [884, 140],
        [436, 474],
      ].map(([x, y]) => (
        <g key={`p-${x}`}>
          <circle cx={x} cy={y} r="9" fill="#eef2ea" />
          <circle cx={x} cy={y} r="4" fill="#173d24" />
        </g>
      ))}
      <circle className="map-pulse" cx="664" cy="156" r="22" fill="none" stroke="#f3d48e" strokeWidth="2" />
      <circle cx="664" cy="156" r="11" fill="#fff6df" stroke="#e2b357" strokeWidth="4" />
    </svg>
  );
}

/** Kruhový ukazatel z několika soustředných oblouků (jako „Varietal Mix“ v reelu). */
function ContinentRings() {
  const rings = [
    { r: 66, color: "var(--gold)" },
    { r: 52, color: "var(--leaf)" },
    { r: 38, color: "var(--text-2)" },
  ];
  return (
    <svg className="rings" viewBox="0 0 160 160" focusable="false">
      {rings.map(({ r, color }, i) => {
        const c = 2 * Math.PI * r;
        const arc = 0.75 * c;
        const value = (arc * a.continents.items[i].pct) / 100;
        return (
          <g key={r} transform="rotate(135 80 80)">
            <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(236,242,232,0.08)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${arc} ${c}`} />
            <circle
              className="ring-value"
              cx="80"
              cy="80"
              r={r}
              fill="none"
              stroke={color}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={`${value} ${c}`}
            />
          </g>
        );
      })}
      <text x="80" y="88" textAnchor="middle" className="rings-total">
        {a.continents.total}
      </text>
      <text x="80" y="106" textAnchor="middle" className="rings-unit">
        {a.continents.unit.toUpperCase()}
      </text>
    </svg>
  );
}

/** Malá plocha pod číslem (kilometry), zlatý přechod do ztracena. */
function Spark() {
  return (
    <svg className="spark" viewBox="0 0 200 60" preserveAspectRatio="none" focusable="false">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2b357" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e2b357" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 56 C30 52 50 46 80 38 S140 22 170 16 L200 12 V60 H0 Z" fill="url(#spark-fill)" />
      <path d="M0 56 C30 52 50 46 80 38 S140 22 170 16 L200 12" fill="none" stroke="#e2b357" strokeWidth="2" />
    </svg>
  );
}

/** Lízátka (poklady za poslední týdny), jedno zlaté. */
function Pins() {
  const h = [22, 34, 30, 18, 44, 36, 40];
  return (
    <svg className="spark" viewBox="0 0 200 60" preserveAspectRatio="xMidYMax meet" focusable="false">
      <line x1="0" y1="12" x2="200" y2="12" stroke="rgba(236,242,232,0.25)" strokeDasharray="3 5" />
      {h.map((v, i) => {
        const x = 16 + i * 28;
        const gold = i === 4;
        return (
          <g key={x}>
            <line x1={x} y1="60" x2={x} y2={56 - v} stroke={gold ? "#e2b357" : "#d7ded3"} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={x} cy={56 - v} r={gold ? 6 : 4} fill={gold ? "#e2b357" : "#eef2ea"} />
          </g>
        );
      })}
    </svg>
  );
}

/** Tečkovaná mřížka a vlnka (fotky). */
function Wave() {
  return (
    <svg className="spark spark-dots" viewBox="0 0 200 60" preserveAspectRatio="none" focusable="false">
      <path d="M4 50 C30 44 40 36 64 40 S100 30 118 22 S150 10 170 20" fill="none" stroke="#e2b357" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** Půlkruhový ukazatel s ryskami (úroveň), jako „Vintage progress“ v reelu. */
function Gauge({ value }: { value: number }) {
  const ticks = Array.from({ length: 25 }, (_, i) => {
    const t = Math.PI + (i / 24) * Math.PI;
    return [100 + 78 * Math.cos(t), 92 + 78 * Math.sin(t), 100 + 70 * Math.cos(t), 92 + 70 * Math.sin(t)];
  });
  return (
    <svg className="gauge" viewBox="0 0 200 104" focusable="false">
      {ticks.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(236,242,232,0.3)" strokeWidth={i % 6 === 0 ? 1.6 : 1} />
      ))}
      <path d="M38 92 A62 62 0 0 1 162 92" fill="none" stroke="rgba(236,242,232,0.1)" strokeWidth="10" strokeLinecap="round" pathLength={100} />
      <path
        className="gauge-value"
        d="M38 92 A62 62 0 0 1 162 92"
        fill="none"
        stroke="#e2b357"
        strokeWidth="10"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={`${value} 100`}
      />
      <text x="100" y="88" textAnchor="middle" className="gauge-num">
        {value} %
      </text>
    </svg>
  );
}

export function Atlas() {
  const y = a.year;
  const m = a.months;
  return (
    <section className="atlas" aria-labelledby="atlas-title">
      <div className="wrap atlas-head reveal">
        <p className="eyebrow">{a.eyebrow}</p>
        <h2 id="atlas-title">{a.title}</h2>
        <p className="atlas-sub">{a.text}</p>
      </div>

      <div className="wrap">
        <div className="device reveal-zoom">
          <p className="sr-only">
            {a.title} {a.text} {a.note}
          </p>
          <div className="device-grid" aria-hidden="true">
            {/* mapa jako hlavní plocha */}
            <div className="glass map">
              <AerialMap />
              <div className="map-search">
                <svg viewBox="0 0 24 24" width="16" height="16" focusable="false">
                  <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 16l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {a.search}
              </div>
              <span className="pill pill-gold" style={{ left: "66.4%", top: "25.2%" }}>
                <b>{a.places.gem.name}</b> {a.places.gem.tag}
              </span>
              <span className="pill" style={{ left: "38%", top: "30%" }}>
                <i /> <b>{a.places.day.name}</b> {a.places.day.tag}
              </span>
              <span className="pill pill-wide pill-end" style={{ left: "88.4%", top: "22.6%" }}>
                <i /> <b>{a.places.fort.name}</b> {a.places.fort.tag}
              </span>
              <span className="pill pill-wide" style={{ left: "43.6%", top: "76.4%" }}>
                <i /> <b>{a.places.tip.name}</b> {a.places.tip.tag}
              </span>
              <ul className="map-layers">
                {a.layers.map((l, i) => (
                  <li key={l} className={i === 0 ? "on" : undefined}>
                    {l}
                  </li>
                ))}
              </ul>
              <span className="map-scale">{a.scale}</span>
            </div>

            {/* rok v číslech: mřížka 2x2 */}
            <div className="glass year">
              <h3>{y.title}</h3>
              <div className="tiles">
                <div className="tile">
                  <span className="tile-label">{y.km.label}</span>
                  <span className="tile-row">
                    <b className="big">{y.km.value}</b>
                    <small>{y.km.unit}</small>
                    <em className="tag">{y.km.tag}</em>
                  </span>
                  <Spark />
                </div>
                <div className="tile">
                  <span className="tile-label">{y.gems.label}</span>
                  <span className="tile-row">
                    <b className="big">{y.gems.value}</b>
                    <em className="tag">{y.gems.tag}</em>
                  </span>
                  <Pins />
                </div>
                <div className="tile">
                  <span className="tile-label">{y.photos.label}</span>
                  <span className="tile-row">
                    <b className="big">{y.photos.value}</b>
                    <em className="tag">{y.photos.tag}</em>
                  </span>
                  <Wave />
                </div>
                <div className="tile tile-gauge">
                  <span className="tile-label">{y.level.label}</span>
                  <Gauge value={y.level.value} />
                  <em className="tag tag-center">{y.level.tag}</em>
                </div>
              </div>
            </div>

            {/* země podle kontinentů */}
            <div className="glass continents">
              <h3>{a.continents.title}</h3>
              <p className="card-sub">{a.continents.sub}</p>
              <div className="continents-body">
                <ContinentRings />
                <ul className="legend">
                  {a.continents.items.map((it, i) => (
                    <li key={it.name}>
                      <span className={`dot dot-${i}`} />
                      {it.name}
                      <b>{it.pct} %</b>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* sloupcový graf po měsících */}
            <div className="glass months">
              <div className="months-head">
                <div>
                  <h3>{m.title}</h3>
                  <p className="card-sub">{m.sub}</p>
                </div>
                <span className="chip-ghost">2026</span>
              </div>
              <div className="bars">
                <ul className="bars-axis">
                  {[20, 15, 10, 5, 0].map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
                <ol className="bars-list">
                  {m.values.map((v, i) => (
                    <li key={m.labels[i]} className={i === m.highlight ? "hi" : undefined}>
                      <span className="bar-track">
                        <span className="bar" style={{ height: `${Math.max(4, (v / m.max) * 100)}%` }} />
                      </span>
                      <span className="bar-label">{m.labels[i]}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
        <p className="atlas-note">{a.note}</p>
      </div>
    </section>
  );
}
