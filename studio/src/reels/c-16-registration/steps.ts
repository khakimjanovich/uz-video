import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 16: sign-up. A postcard with a code proves the email (cues 0–6), the password goes to the login server (7),
// no code store, no codes (8), the right code makes the merchant and its first admin (9).
const FORM = { m45Person: [0, 0.3], attacker: [0, 1.9], m45Form: [1.5, 1], m45Inbox: [3, 1] } as const;
const POST = { m45Person: [0, 1.7], m45Bank: [1.5, 0.3], m45Inbox: [3, 1.7] } as const;
const POST_EDGES = [{ from: "m45Person", to: "m45Bank", label: "sign up" }, { from: "m45Bank", to: "m45Inbox" }] as const;
const READ = [...POST_EDGES, { from: "m45Inbox", to: "m45Person", label: "reads" }] as const;
const LOCK = { ...POST, attacker: [0, 0.3] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: { m45Person: [0.5, 1], m45Inbox: [2.5, 1] }, edges: [{ from: "m45Person", to: "m45Inbox", label: "mine?" }], badges: { m45Inbox: "whose?" } },
  {
    cue: 1,
    layout: FORM,
    edges: [{ from: "m45Person", to: "m45Form" }, { from: "attacker", to: "m45Form" }, { from: "m45Form", to: "m45Inbox" }],
    packets: [{ from: "m45Person", to: "m45Form", label: "my email" }, { from: "attacker", to: "m45Form", label: "your email", delay: 50 }],
    danger: ["attacker"],
  },
  { cue: 2, layout: POST, edges: [...POST_EDGES], packets: [{ from: "m45Bank", to: "m45Inbox", label: "code 4821" }], badges: { m45Inbox: "one-time code" } },
  {
    cue: 3,
    layout: POST,
    edges: [...READ],
    packets: [{ from: "m45Inbox", to: "m45Person", label: "4821" }, { from: "m45Person", to: "m45Bank", label: "4821", delay: 50 }],
    accent: ["m45Person"],
  },
  { cue: 5, layout: POST, edges: [...READ], badges: { m45Bank: "short · one sign-up" } },
  {
    cue: 6,
    layout: LOCK,
    edges: [...READ, { from: "attacker", to: "m45Bank" }],
    packets: [0, 1, 2].map((k) => ({ from: "attacker" as const, to: "m45Bank" as const, label: "wrong", delay: 10 + k * 25, stopAt: 0.7 })),
    danger: ["attacker"],
    badges: { m45Bank: "locked" },
  },
  {
    cue: 7,
    layout: { m45Person: [0, 1], m45Login: [3, 0.2], m45Db: [3, 1.9] },
    edges: [{ from: "m45Person", to: "m45Login", label: "password" }, { from: "m45Person", to: "m45Db", broken: true }],
    packets: [{ from: "m45Person", to: "m45Login", label: "password" }],
    accent: ["m45Login"],
  },
  {
    cue: 8,
    layout: { m45Person: [0, 1], m45Bank: [1.5, 0.4], m45CodeStore: [1.5, 2.1], m45Inbox: [3, 0.4] },
    edges: [{ from: "m45Person", to: "m45Bank" }, { from: "m45Bank", to: "m45CodeStore", broken: true }, { from: "m45Bank", to: "m45Inbox", broken: true }],
    packets: [{ from: "m45Person", to: "m45Bank", label: "code", stopAt: 0.6 }],
    danger: ["m45CodeStore"],
    badges: { m45Bank: "nothing sent" },
  },
  {
    cue: 9,
    layout: { m45Person: [0, 1], m45Bank: [1.5, 1], shop: [3, 1] },
    edges: [{ from: "m45Person", to: "m45Bank" }, { from: "m45Bank", to: "shop" }],
    packets: [{ from: "m45Person", to: "m45Bank", label: "right code" }, { from: "m45Bank", to: "shop", label: "create", delay: 50 }],
    accent: ["shop"],
    badges: { m45Person: "first admin" },
  },
];

export const map: BuildMapStep[] = [
  { cue: 4, part: 4, current: ["partner", "emailport", "emailsvc"], units: { ecom: "email check" } },
  { cue: 10, part: 4, current: ["partner", "admin"], units: { ecom: "next: licence" } },
];
