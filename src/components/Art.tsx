// Telefon s globusem podle návrhu webu. Globus je skutečná projekce (Natural Earth).
import { globeGraticule, globeLand, globePins, globeVisited, globeWishlist } from "@/generated/geo";
import { copy } from "@/lib/copy";

// Na mobilu je tip od kamaráda v telefonu, na desktopu plave vedle (řeší CSS).
export function PhoneGlobe() {
  const p = copy.phone;
  return (
    <div className="phone-wrap">
      <figure className="phone" aria-label={p.alt}>
        <div className="phone-screen">
          <div className="ph-head">
            <span className="ph-title">{p.title}</span>
            <span className="chip">{p.tier}</span>
          </div>
          <svg viewBox="0 0 200 200" className="ph-globe" aria-hidden="true" focusable="false">
            <defs>
              <radialGradient id="globe-shade" cx="38%" cy="32%" r="75%">
                <stop offset="0" stopColor="#fff" stopOpacity=".16" />
                <stop offset=".6" stopColor="#fff" stopOpacity="0" />
                <stop offset="1" stopColor="#000" stopOpacity=".28" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="96" fill="#1F4D3A" />
            <path d={globeGraticule} fill="none" stroke="#F2F4EE" strokeOpacity=".14" strokeWidth=".6" />
            <path d={globeLand} fill="#2F6B51" />
            <path d={globeVisited} fill="#E3A33B" />
            <path d={globeWishlist} fill="none" stroke="#F2F4EE" strokeWidth="1.2" strokeDasharray="2.5 2" />
            <circle cx="100" cy="100" r="96" fill="url(#globe-shade)" />
            {globePins.map((pin, i) =>
              pin.kind === "tip" ? (
                <circle key={i} cx={pin.x} cy={pin.y} r="5.5" fill="#E4572E" stroke="#F2F4EE" strokeWidth="2" />
              ) : (
                <circle key={i} cx={pin.x} cy={pin.y} r="5.5" fill="#F2F4EE" stroke="#1F4D3A" strokeWidth="2" />
              ),
            )}
          </svg>
          <div className="ph-stats">
            {p.stats.map((s) => (
              <span key={s.label}>
                <b>{s.n}</b>
                {s.label}
              </span>
            ))}
          </div>
          <div className="ph-note">
            <i />
            <span>
              <b>Petr</b> {p.note}
            </span>
          </div>
        </div>
      </figure>
      <div className="float-note" aria-hidden="true">
        <i />
        <span>
          <b>Petr</b> {p.noteLong}
        </span>
      </div>
      <div className="float-gem" aria-hidden="true">
        {p.gem}
      </div>
    </div>
  );
}
