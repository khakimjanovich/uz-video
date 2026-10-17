import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 04: sign-up and email proof (PartnerAuthServiceImpl, otp-starter, EmailSender port).
const P1 = { part: 1, current: ["partner", "emailport", "emailsvc"], built: builtBefore(1) } as const;
export const map: BuildMapStep[] = [{ cue: 0, ...P1, current: [...P1.current], built: [...P1.built] }, { cue: 9, ...P1, current: ["partner", "admin"], built: [...P1.built] }];

const BASE = { shop: [0, 1], partner: [1.5, 1], redis: [1.5, 2], mail: [3, 1] } as const;
export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { shop: [0, 1], partner: [1.5, 1] }, edges: [{ from: "shop", to: "partner", label: "register" }], badges: { partner: "unverified" } },
  {
    cue: 2,
    layout: { ...BASE },
    edges: [{ from: "shop", to: "partner" }, { from: "partner", to: "mail" }],
    packets: [{ from: "partner", to: "mail", label: "one-time code", delay: 20 }],
    badges: { partner: "PENDING" },
  },
  { cue: 3, layout: { ...BASE }, edges: [{ from: "shop", to: "partner" }, { from: "partner", to: "mail" }, { from: "partner", to: "redis", label: "code + TTL" }], accent: ["redis"], badges: { redis: "configured lifetime" } },
  { cue: 4, layout: { ...BASE }, edges: [{ from: "shop", to: "partner" }, { from: "partner", to: "mail", label: "email port" }, { from: "partner", to: "redis" }], accent: ["mail"], badges: { mail: "inbox :8025" } },
  {
    cue: 5,
    layout: { ...BASE },
    edges: [{ from: "shop", to: "partner" }, { from: "partner", to: "mail" }, { from: "partner", to: "redis" }],
    packets: [{ from: "shop", to: "partner", label: "code", delay: 15 }],
    accent: ["partner"],
    badges: { partner: "EMAIL VERIFIED" },
  },
  {
    cue: 6,
    layout: { attacker: [0, 1], partner: [1.5, 1], redis: [1.5, 2] },
    edges: [{ from: "attacker", to: "partner" }, { from: "partner", to: "redis" }],
    packets: [0, 1, 2].map((k) => ({ from: "attacker" as const, to: "partner" as const, label: "wrong code", delay: 8 + k * 16, duration: 18, stopAt: 0.85 })),
    danger: ["attacker"],
    badges: { partner: "attempt limit" },
  },
  {
    cue: 7,
    layout: { attacker: [0, 1], partner: [1.5, 1], mail: [3, 1] },
    edges: [{ from: "attacker", to: "partner", label: "resend" }, { from: "partner", to: "mail", broken: true }],
    packets: [{ from: "partner", to: "mail", label: "resend", delay: 20, stopAt: 0.5 }],
    danger: ["attacker"],
    badges: { partner: "resend limit" },
  },
  { cue: 8, layout: { shop: [0, 1], partner: [1.5, 1] }, edges: [{ from: "partner", to: "shop", label: "error" }], packets: [{ from: "partner", to: "shop", label: "OTP_INVALID", delay: 15 }], badges: { partner: "no stack trace" } },
];
