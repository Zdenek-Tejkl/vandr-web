import { catPaths } from "@/lib/svg";

// Kocour Globus. `id` musí být na stránce unikátní (maska poledníků).
export function CatGlobe({ id, size = 40, className }: { id: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect width="100" height="100" fill="#fff" />
          <g fill="none" stroke="#000" strokeWidth="4.5" strokeLinecap="round" dangerouslySetInnerHTML={{ __html: catPaths.cut }} />
        </mask>
      </defs>
      <g fill="currentColor" mask={`url(#${id})`}>
        <path d={catPaths.earLeft} />
        <path d={catPaths.earRight} />
        <circle cx="50" cy="60" r="32" />
      </g>
    </svg>
  );
}

export function Logo({ id, className }: { id: string; className?: string }) {
  return (
    <span className={`logo ${className ?? ""}`}>
      <CatGlobe id={id} size={40} />
      <span className="logo-word">vandr</span>
    </span>
  );
}

// Tulák s trasou: ocas se mění v trasu k připínáčku. Jen pro ilustrace.
export function Wanderer({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <path d="M22 30 L24 8 L36 20 Z" />
        <path d="M46 30 L44 8 L32 20 Z" />
        <circle cx="34" cy="32" r="14" />
        <path d="M16 94 C14 66 22 48 34 46 C46 48 54 66 52 94 Z" />
        <path
          d="M100 18 a12 12 0 0 1 12 12 c0 10 -12 22 -12 22 s-12 -12 -12 -22 a12 12 0 0 1 12 -12 z M100 25 a5 5 0 1 0 0.01 0 z"
          fillRule="evenodd"
        />
      </g>
      <path d="M52 88 C74 94 78 70 90 62" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 9" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M16.6 3c.3 2.2 1.6 3.7 3.9 3.9v3.1c-1.4.1-2.7-.3-3.9-1v6.1c0 3.9-3.2 6.4-6.7 5.8-2.6-.5-4.4-2.8-4.2-5.5.2-3.2 3.2-5.4 6.4-4.8v3.3c-.4-.1-.8-.2-1.2-.1-1.2.1-2.1 1.2-1.9 2.4.2 1.1 1.2 1.9 2.4 1.7 1.1-.1 1.9-1.1 1.9-2.2V3h3.3z" />
    </svg>
  );
}
