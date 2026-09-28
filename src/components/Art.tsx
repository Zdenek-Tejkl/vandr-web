// Ilustrace aplikace podle návrhu obrazovek (Profil, Stránka země, Body a tiery).
import { georgiaGems, georgiaOutline, georgiaPins, globeGraticule, globeLand, globeVisited, globeWishlist } from "@/generated/geo";
import { CatGlobe } from "./Brand";

const avatarColors: Record<string, string> = { PN: "#34546E", AK: "#8A4A2F", KM: "#6B4E31", TH: "#2F5D48" };

// Globus se vykreslí jednou, další výskyty ho jen použijí přes <use>.
export function GlobeSymbol() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="globe-shade" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity=".16" />
          <stop offset=".6" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".28" />
        </radialGradient>
        <symbol id="vandr-globe" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="96" fill="#1F4D3A" />
          <path d={globeGraticule} fill="none" stroke="#F2F4EE" strokeOpacity=".12" strokeWidth=".6" />
          <path d={globeLand} fill="#2E6A51" />
          <path d={globeVisited} fill="#E3A33B" />
          <path d={globeWishlist} fill="none" stroke="#F2F4EE" strokeWidth="1.2" strokeDasharray="2.5 2" />
          <circle cx="100" cy="100" r="96" fill="url(#globe-shade)" />
          <circle cx="100" cy="100" r="96" fill="none" stroke="#F2F4EE" strokeOpacity=".25" />
        </symbol>
      </defs>
    </svg>
  );
}

export function Globe({ size, label }: { size: number; label: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" role="img" aria-label={label} className="globe">
      <use href="#vandr-globe" />
    </svg>
  );
}

// Hlavní obrázek: telefon s profilem a globusem.
export function PhoneProfile() {
  return (
    <figure className="phone" aria-label="Profil v aplikaci Vandr: globus navštívených zemí a statistiky">
      <div className="phone-screen">
        <div className="pp-head">
          <span className="av av-lg" style={{ background: "#1F4D3A" }}>KM</span>
          <span className="pp-name">
            <b>Klára Malá</b>
            <span className="chip">Vandrák · 1 240 bodů</span>
          </span>
        </div>
        <div className="pp-globe">
          <Globe size={210} label="Globus: 23 navštívených zemí, 3 na wishlistu" />
          <span className="pp-legend">
            <span><i className="lg-visited" />Navštíveno</span>
            <span><i className="lg-wish" />Wishlist</span>
          </span>
        </div>
        <div className="pp-stats">
          <span><b>23</b>zemí</span>
          <span><b>12 %</b>světa</span>
          <span><b>4</b>kontinenty</span>
          <span><b>61</b>měst</span>
        </div>
        <span className="pp-share">Sdílet globus</span>
        <span className="pp-tabs">
          <b>Příspěvky</b>
          <span>Wishlist</span>
        </span>
        <span className="pp-grid">
          <i style={{ background: "#2F5D48" }} />
          <i style={{ background: "#8A4A2F" }} />
          <i style={{ background: "#34546E" }} />
        </span>
      </div>
    </figure>
  );
}

export function ArtGlobe({ label }: { label: string }) {
  return (
    <div className="art art-globe" role="img" aria-label={label}>
      <Globe size={150} label="" />
      <div className="art-globe-stats" aria-hidden="true">
        <span><b>23</b> zemí</span>
        <span><b>12 %</b> světa</span>
        <span className="art-progress"><i style={{ width: "12%" }} /></span>
        <span className="art-note">+3 země z fotek z galerie</span>
      </div>
    </div>
  );
}

export function ArtFriendsMap({ label }: { label: string }) {
  // Trasa jednoho kamaráda: Batumi, Mestia, Kazbegi, Tbilisi.
  const pts = ["batumi", "mestia", "kazbegi", "tbilisi"].flatMap((id) => georgiaPins.filter((p) => p.id === id));
  return (
    <div className="art art-map" role="img" aria-label={label}>
      <svg viewBox="0 0 320 180" aria-hidden="true" focusable="false">
        <rect width="320" height="180" fill="#E4EADF" />
        <path d={georgiaOutline} fill="#F7F8F4" stroke="#CBD3C8" strokeWidth="2" strokeLinejoin="round" />
        <polyline
          points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="#1F4D3A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 7"
        />
        {georgiaGems.map(([x, y], i) => (
          <path key={i} d={`M${x - 6} ${y + 5} l6 -11 6 11 z`} fill="#E3A33B" stroke="#1C1E1A" strokeWidth="1.5" strokeLinejoin="round" />
        ))}
        {georgiaPins.map((p) => (
          <g key={p.id}>
            <circle cx={p.x} cy={p.y} r="14" fill={avatarColors[p.who]} stroke="#fff" strokeWidth="2.5" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="var(--font-body), sans-serif">
              {p.who}
            </text>
          </g>
        ))}
      </svg>
      <div className="art-tip" aria-hidden="true">
        <span className="av" style={{ background: avatarColors.AK }}>AK</span>
        <span>
          <b>Kazbegi</b> <span className="chip chip-sm">Hidden gem</span>
          <span className="art-tip-text">Maršrutka z Tbilisi za 20 lari, 3 h.</span>
        </span>
      </div>
    </div>
  );
}

const tiers = ["Turista", "Tulák", "Vandrák", "Průzkumník", "Legenda"];

export function ArtTiers({ label }: { label: string }) {
  return (
    <div className="art art-tiers" role="img" aria-label={label}>
      <div className="tier-card" aria-hidden="true">
        <div className="tier-top">
          <CatGlobe id="cat-tier" size={34} className="tier-cat" />
          <span>
            <b>Vandrák</b>
            <span className="tier-pts">1 240 bodů</span>
          </span>
        </div>
        <span className="art-progress"><i style={{ width: "62%" }} /></span>
        <span className="art-note">760 bodů do tieru Průzkumník</span>
      </div>
      <ol className="tier-ladder" aria-hidden="true">
        {tiers.map((t, i) => (
          <li key={t} className={i === 2 ? "on" : i < 2 ? "done" : ""}>{t}</li>
        ))}
      </ol>
      <div className="tier-events" aria-hidden="true">
        <span><b>+10</b> Tip z Theth</span>
        <span><b>+5</b> Hidden gem</span>
      </div>
    </div>
  );
}
