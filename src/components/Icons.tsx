// Ikony podle návrhu webu (tahy 2 px, zakulacené konce).
type P = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
});

export const ArrowIcon = ({ size = 22, className }: P) => (
  <svg {...base(size)} strokeWidth={2.4} className={className}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

export const LockIcon = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export const GlobeIcon = ({ size = 30, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <ellipse cx="12" cy="12" rx="4" ry="9" />
    <path d="M3 12h18" />
  </svg>
);

export const PinIcon = ({ size = 30, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z" />
    <circle cx="12" cy="10" r="2.2" />
  </svg>
);

export const StarIcon = ({ size = 30, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.8z" />
  </svg>
);

export const GiftIcon = ({ size = 34, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M12 8v13" />
    <path d="M3 12h18" />
    <path d="M12 8c-2-4-6-4-6-1.5S9 8 12 8c3 0 6 0 6-1.5S14 4 12 8z" />
  </svg>
);

export const WhatsAppIcon = ({ size = 22, className }: P) => (
  <svg {...base(size)} strokeWidth={2.2} className={className}>
    <path d="M21 12a9 9 0 0 1-13.5 7.8L3 21l1.2-4.4A9 9 0 1 1 21 12z" />
  </svg>
);

export const StoriesIcon = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);
