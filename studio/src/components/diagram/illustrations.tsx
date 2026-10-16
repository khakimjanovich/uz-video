import React from "react";

// Hand-drawn ink line art for diagram nodes (Receipt identity: single colour, no fills).
// Drawn on a 120x80 grid; colour comes from the parent (currentColor), so accent/danger boxes recolour them.
const ART = {
  buyer: (
    <>
      <circle cx="40" cy="20" r="10" />
      <path d="M20 66 Q20 38 40 38 Q60 38 60 66" />
      <rect x="72" y="22" width="24" height="42" rx="4" />
      <path d="M79 56 H89" />
      <path d="M60 50 L72 44" />
    </>
  ),
  store: (
    <>
      <path d="M18 30 L25 14 H95 L102 30 Z" />
      <path d="M18 30 q7 9 14 0 q7 9 14 0 q7 9 14 0 q7 9 14 0 q7 9 14 0 q7 9 14 0" />
      <path d="M24 37 V68 H96 V37" />
      <rect x="52" y="46" width="16" height="22" />
      <rect x="30" y="44" width="15" height="12" />
      <rect x="75" y="44" width="15" height="12" />
    </>
  ),
  bank: (
    <>
      <path d="M14 30 L60 10 L106 30 Z" />
      <path d="M18 35 H102" />
      <path d="M30 39 V60 M50 39 V60 M70 39 V60 M90 39 V60" />
      <path d="M16 64 H104 M12 70 H108" />
    </>
  ),
  processing: (
    <>
      <rect x="30" y="10" width="60" height="18" rx="3" />
      <rect x="30" y="32" width="60" height="18" rx="3" />
      <rect x="30" y="54" width="60" height="18" rx="3" />
      <path d="M38 19 H58 M38 41 H58 M38 63 H58" />
      <circle cx="80" cy="19" r="2.5" />
      <circle cx="80" cy="41" r="2.5" />
      <circle cx="80" cy="63" r="2.5" />
      <path d="M8 41 H30 M90 41 H112" />
    </>
  ),
  admin: (
    <>
      <circle cx="40" cy="20" r="10" />
      <path d="M20 66 Q20 38 40 38 Q60 38 60 66" />
      <rect x="70" y="20" width="30" height="44" rx="3" />
      <rect x="79" y="15" width="12" height="7" rx="2" />
      <path d="M77 42 L83 48 L94 36" />
    </>
  ),
  salespoint: (
    <>
      <rect x="10" y="12" width="72" height="54" rx="4" />
      <path d="M10 24 H82" />
      <circle cx="18" cy="18" r="1.8" />
      <circle cx="25" cy="18" r="1.8" />
      <circle cx="32" cy="18" r="1.8" />
      <path d="M20 36 H60 M20 46 H48" />
      <circle cx="98" cy="54" r="9" />
      <path d="M89 54 H72 M78 54 V61 M84 54 V59" />
    </>
  ),
  attacker: (
    <>
      <path d="M32 70 Q30 22 60 16 Q90 22 88 70" />
      <ellipse cx="60" cy="44" rx="14" ry="16" />
      <path d="M52 42 H57 M63 42 H68" />
    </>
  ),
  // Settlement accounts — one distinct drawing per role.
  transit: (
    <>
      <path d="M16 28 H96 M86 18 L96 28 L86 38" />
      <path d="M104 54 H24 M34 44 L24 54 L34 64" />
      <circle cx="56" cy="28" r="7" />
      <circle cx="64" cy="54" r="7" />
    </>
  ),
  tray: (
    <>
      <path d="M14 46 L26 70 H94 L106 46" />
      <path d="M14 46 H40 L46 56 H74 L80 46 H106" />
      <circle cx="60" cy="18" r="8" />
      <circle cx="44" cy="32" r="6" />
      <circle cx="76" cy="32" r="6" />
    </>
  ),
  fee: (
    <>
      <path d="M20 40 L40 14 H100 V66 H40 Z" />
      <circle cx="34" cy="40" r="4" />
      <circle cx="58" cy="28" r="5" />
      <circle cx="84" cy="52" r="5" />
      <path d="M56 56 L86 24" />
    </>
  ),
  wallet: (
    <>
      <rect x="16" y="22" width="84" height="48" rx="6" />
      <path d="M16 34 H100" />
      <rect x="74" y="42" width="30" height="16" rx="4" />
      <circle cx="84" cy="50" r="3" />
      <path d="M28 22 L44 10 L58 22" />
    </>
  ),
  // Four-eyes: the second admin holds the approval stamp.
  checker: (
    <>
      <circle cx="40" cy="20" r="10" />
      <path d="M20 66 Q20 38 40 38 Q60 38 60 66" />
      <circle cx="89" cy="16" r="6" />
      <path d="M89 22 V34" />
      <rect x="74" y="34" width="30" height="10" rx="2" />
      <path d="M70 56 H108" />
    </>
  ),
  // Four-eyes: a pending request (paper with an hourglass).
  request: (
    <>
      <path d="M22 8 H70 L86 24 V72 H22 Z" />
      <path d="M70 8 V24 H86" />
      <path d="M32 34 H62 M32 44 H56" />
      <path d="M78 46 H104 M78 74 H104 M80 46 Q80 60 91 60 Q102 60 102 46 M80 74 Q80 60 91 60 Q102 60 102 74" />
    </>
  ),
  // A saved payment record: receipt slip with a torn bottom edge.
  receipt: (
    <>
      <path d="M36 8 H84 V66 l-6 6 -6 -6 -6 6 -6 -6 -6 6 -6 -6 -6 6 -6 -6 Z" />
      <path d="M44 22 H76 M44 32 H70 M44 42 H76" />
      <path d="M44 54 H60 M66 54 H76" />
    </>
  ),
  // Token vault: a safe with a dial and handle.
  vault: (
    <>
      <rect x="22" y="8" width="76" height="62" rx="4" />
      <rect x="30" y="16" width="60" height="46" rx="2" />
      <circle cx="56" cy="39" r="11" />
      <path d="M56 28 V32 M56 46 V50 M45 39 H49 M63 39 H67" />
      <path d="M80 30 V48" />
      <path d="M30 70 V75 M90 70 V75" />
    </>
  ),
  // Operation journal: an open log book (two pages and a spine).
  journal: (
    <>
      <path d="M12 16 Q36 8 60 18 Q84 8 108 16 V68 Q84 60 60 70 Q36 60 12 68 Z" />
      <path d="M60 18 V70" />
      <path d="M22 28 Q36 24 50 29 M22 38 Q36 34 50 39 M22 48 Q36 44 50 49" />
      <path d="M70 29 Q84 24 98 28 M70 39 Q84 34 98 38 M70 49 Q84 44 98 48" />
    </>
  ),
} satisfies Record<string, React.ReactNode>;

export type ArtName = keyof typeof ART;

export const NodeArt: React.FC<{ name: ArtName; size?: number }> = ({ name, size = 96 }) => (
  <svg
    viewBox="0 0 120 80"
    width={size}
    height={(size * 80) / 120}
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {ART[name]}
  </svg>
);
