import { site } from "@/lib/config";
import { copy } from "@/lib/copy";
import { InstagramIcon } from "./Icons";

// Odkaz na Instagram Vandru. light = na světlém pozadí.
export function InstagramFollow({ light = false }: { light?: boolean }) {
  const t = copy.instagram;
  return (
    <a className={`ig${light ? " ig-light" : ""}`} href={site.instagram} target="_blank" rel="noopener">
      <span className="ig-icon">
        <InstagramIcon size={26} />
      </span>
      <span className="ig-text">
        <b>{t.title}</b>
        <span>{t.text}</span>
      </span>
      <span className="ig-cta">
        {t.cta} {t.handle}
      </span>
    </a>
  );
}
