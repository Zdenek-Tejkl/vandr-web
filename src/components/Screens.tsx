import Image from "next/image";
import { copy } from "@/lib/copy";

// Obrazovky aplikace (demo data). Na mobilu posuvný pás, na počítači čtyři vedle sebe.
export function Screens() {
  const s = copy.screens;
  return (
    <section className="screens" aria-labelledby="screens-title">
      <div className="wrap">
        <p className="eyebrow">{s.eyebrow}</p>
        <h2 id="screens-title">{s.title}</h2>
        <ul className="screens-list">
          {s.items.map((item, i) => (
            <li key={item.name}>
              <figure>
                <div className="screen-phone">
                  <Image
                    src={`/screens/${item.name}.webp`}
                    width={390}
                    height={844}
                    sizes="(min-width: 1024px) 260px, 62vw"
                    alt={`${item.title}: ${item.text}`}
                    priority={i === 0}
                  />
                </div>
                <figcaption>
                  <b>{item.title}</b> {item.text}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="screens-note">{s.note}</p>
      </div>
    </section>
  );
}
