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

export const InstagramIcon = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);

export const DownloadIcon = ({ size = 22, className }: P) => (
  <svg {...base(size)} strokeWidth={2.4} className={className}>
    <path d="M12 4v11" />
    <path d="M7 11l5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
);

export const CheckIcon = ({ size = 20, className }: P) => (
  <svg {...base(size)} strokeWidth={2.6} className={className}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const ChevronIcon = ({ size = 20, className }: P) => (
  <svg {...base(size)} strokeWidth={2.4} className={className}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const PhoneIcon = ({ size = 20, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="7" y="3" width="10" height="18" rx="2.5" />
    <path d="M11 17.5h2" />
  </svg>
);
