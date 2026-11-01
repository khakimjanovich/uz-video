import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 16: sign-up, told through Malika's Sunday night at the kitchen table.
// Sunday night (0), the bridge (1–2), the form and the password (3–7), the code arrives (8–9), why a code (10–13),
// the one-time code and its fingerprints (14–17), the check-your-email page (18–23), verified and first admin (24–25),
// the stranger's lockout (26–30), failing closed (31–35), who it protects (36–39), next (40).
const FORM = { m45Person: [0, 0.3], attacker: [0, 1.9], m45Form: [1.5, 1], m45Inbox: [3, 1] } as const;
const POST = { m45Person: [0, 1.7], m45Bank: [1.5, 0.3], m45Inbox: [3, 1.7] } as const;
const POST_EDGES = [{ from: "m45Person", to: "m45Bank", label: "sign up" }, { from: "m45Bank", to: "m45Inbox" }] as const;
const READ = [...POST_EDGES, { from: "m45Inbox", to: "m45Person", label: "reads" }] as const;
const LOCK = { ...POST, attacker: [0, 0.3] } as const;
const LOCK_EDGES = [...READ, { from: "attacker", to: "m45Bank" }] as const;
const WRONG = [0, 1, 2].map((k) => ({ from: "attacker" as const, to: "m45Bank" as const, label: "wrong", delay: 10 + k * 25, stopAt: 0.7 }));
const PASSWORD = { m45Person: [0, 1], m45Login: [3, 0.2], m45Db: [3, 1.9] } as const;
const PASSWORD_EDGES = [{ from: "m45Person", to: "m45Login", label: "password" }, { from: "m45Person", to: "m45Db", broken: true }] as const;
const STORE = { m45Bank: [0, 1], m45CodeStore: [1.5, 1], m45Fingerprint: [3, 1] } as const;
const DOWN = { m45Person: [0, 1], m45Bank: [1.5, 0.4], m45CodeStore: [1.5, 2.1], m45Inbox: [3, 0.4] } as const;
const DOWN_EDGES = [{ from: "m45Person", to: "m45Bank" }, { from: "m45Bank", to: "m45CodeStore", broken: true }, { from: "m45Bank", to: "m45Inbox", broken: true }] as const;
const WRONG_INBOX = { m45Bank: [0, 1], attacker: [3, 0.3], m45Inbox: [3, 1.9] } as const;
const LET_IN = { attacker: [0, 1], m45Bank: [1.5, 1], shop: [3, 1] } as const;
const FIRST = { m45Person: [0, 1], m45Bank: [1.5, 0.4], shop: [3, 0.4], m45Login: [1.5, 2] } as const;
const FIRST_EDGES = [{ from: "m45Person", to: "m45Bank" }, { from: "m45Bank", to: "shop" }, { from: "m45Bank", to: "m45Login" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Sunday night: Malika signs her shop up.
  { cue: 0, layout: { m45Person: [0.5, 1], m45Form: [2.5, 1] }, edges: [{ from: "m45Person", to: "m45Form", label: "sign up" }], badges: { m45Person: "Malika · Sun night" } },
  // The password goes to the login server; ecom keeps only "pending".
  { cue: 5, layout: PASSWORD, edges: [...PASSWORD_EDGES], packets: [{ from: "m45Person", to: "m45Login", label: "password" }], accent: ["m45Login"] },
  { cue: 6, layout: PASSWORD, edges: [...PASSWORD_EDGES], badges: { m45Db: "no password here" }, shake: { m45Db: 0.3 } },
  {
    cue: 7,
    layout: { m45Bank: [0, 1], m45Db: [2.5, 1] },
    edges: [{ from: "m45Bank", to: "m45Db", label: "save" }],
    packets: [{ from: "m45Bank", to: "m45Db", label: "pending" }],
    badges: { m45Db: "pending, nothing more" },
  },
  // Her phone buzzes: six digits.
  {
    cue: 8,
    layout: { m45Bank: [0, 1], m45Inbox: [2.5, 1] },
    edges: [{ from: "m45Bank", to: "m45Inbox", label: "email" }],
    packets: [{ from: "m45Bank", to: "m45Inbox", label: "482107" }],
  },
  { cue: 9, layout: { m45Bank: [0, 1], m45Inbox: [2.5, 1] }, edges: [{ from: "m45Bank", to: "m45Inbox", label: "email" }], accent: ["m45Inbox"], badges: { m45Inbox: "six digits" } },
  // Why a code: anyone can type anyone's email.
  { cue: 10, layout: { m45Person: [0.5, 1], m45Inbox: [2.5, 1] }, edges: [{ from: "m45Person", to: "m45Inbox", label: "mine?" }], badges: { m45Inbox: "why a code?" } },
  {
    cue: 11,
    layout: FORM,
    edges: [{ from: "m45Person", to: "m45Form" }, { from: "attacker", to: "m45Form" }, { from: "m45Form", to: "m45Inbox" }],
    packets: [{ from: "m45Person", to: "m45Form", label: "my email" }, { from: "attacker", to: "m45Form", label: "your email", delay: 50 }],
  },
  {
    cue: 12,
    layout: WRONG_INBOX,
    edges: [{ from: "m45Bank", to: "attacker" }, { from: "m45Bank", to: "m45Inbox", broken: true }],
    packets: [{ from: "m45Bank", to: "attacker", label: "contracts" }, { from: "m45Bank", to: "attacker", label: "payouts", delay: 50 }],
    danger: ["attacker"],
    badges: { m45Inbox: "Malika's · never asked" },
  },
  { cue: 13, layout: POST, edges: [...READ], accent: ["m45Inbox"], badges: { m45Inbox: "really yours?" } },
  // A one-time code; the store keeps only fingerprints.
  { cue: 14, layout: POST, edges: [...POST_EDGES], packets: [{ from: "m45Bank", to: "m45Inbox", label: "one-time code" }], badges: { m45Inbox: "once · short time" } },
  { cue: 15, layout: POST, edges: [...READ], packets: [{ from: "m45Inbox", to: "m45Person", label: "482107" }], accent: ["m45Person"] },
  {
    cue: 16,
    layout: STORE,
    edges: [{ from: "m45Bank", to: "m45CodeStore" }, { from: "m45CodeStore", to: "m45Fingerprint" }],
    badges: { m45CodeStore: "no code · no email" },
  },
  {
    cue: 17,
    layout: STORE,
    edges: [{ from: "m45Bank", to: "m45CodeStore" }, { from: "m45CodeStore", to: "m45Fingerprint" }],
    packets: [{ from: "m45Bank", to: "m45CodeStore", label: "fingerprint" }],
    accent: ["m45Fingerprint"],
    badges: { m45Fingerprint: "useless if stolen" },
  },
  // Verified, and the first admin.
  {
    cue: 24,
    layout: POST,
    edges: [...READ],
    packets: [{ from: "m45Person", to: "m45Bank", label: "right code" }],
    accent: ["m45Person"],
    badges: { m45Person: "email verified" },
  },
  {
    cue: 25,
    layout: FIRST,
    edges: [...FIRST_EDGES],
    packets: [{ from: "m45Bank", to: "shop", label: "merchant" }, { from: "m45Bank", to: "m45Login", label: "admin role", delay: 50 }],
    accent: ["shop"],
    badges: { m45Person: "Malika · first admin" },
  },
  // The stranger: counted, locked, told when to try again.
  { cue: 26, layout: LOCK, edges: [...LOCK_EDGES], badges: { attacker: "the stranger" } },
  { cue: 27, layout: LOCK, edges: [...LOCK_EDGES], packets: WRONG, badges: { m45Bank: "counted" } },
  { cue: 28, layout: LOCK, edges: [...LOCK_EDGES], packets: WRONG, danger: ["attacker"], badges: { m45Bank: "locked" } },
  { cue: 29, layout: LOCK, edges: [...LOCK_EDGES], danger: ["attacker"], badges: { m45Bank: "lockout" } },
  { cue: 30, layout: LOCK, edges: [...LOCK_EDGES], packets: [{ from: "m45Bank", to: "attacker", label: "try at 10:42" }], badges: { m45Bank: "lockout" } },
  // The code store is down: fail closed, never "just this once".
  { cue: 31, layout: STORE, edges: [{ from: "m45Bank", to: "m45CodeStore" }, { from: "m45CodeStore", to: "m45Fingerprint" }], badges: { m45CodeStore: "one more case" } },
  { cue: 32, layout: DOWN, edges: [...DOWN_EDGES], packets: [{ from: "m45Person", to: "m45Bank", label: "code", stopAt: 0.6 }], danger: ["m45CodeStore"], badges: { m45Bank: "nothing sent" } },
  { cue: 33, layout: DOWN, edges: [...DOWN_EDGES], danger: ["m45CodeStore"], shake: { m45Bank: 0.6 }, badges: { m45Bank: "just this once?" } },
  {
    cue: 34,
    layout: LET_IN,
    edges: [{ from: "attacker", to: "m45Bank" }, { from: "m45Bank", to: "shop" }],
    packets: [{ from: "attacker", to: "shop", label: "unchecked shop" }],
    danger: ["attacker"],
  },
  { cue: 35, layout: DOWN, edges: [...DOWN_EDGES], danger: ["m45CodeStore"], badges: { m45Bank: "fails closed" } },
  // Who it protects; Malika never noticed.
  { cue: 36, layout: POST, edges: [...READ], accent: ["m45Person"], badges: { m45Person: "real owner" } },
  {
    cue: 37,
    layout: POST,
    edges: [...READ],
    packets: [{ from: "m45Bank", to: "m45Inbox", label: "contract" }, { from: "m45Bank", to: "m45Inbox", label: "report", delay: 50 }],
    accent: ["m45Bank"],
  },
  { cue: 38, layout: POST, edges: [...READ], badges: { m45Person: "Malika · never noticed" } },
  { cue: 39, layout: POST, edges: [...READ], packets: [{ from: "m45Inbox", to: "m45Person", label: "482107" }], accent: ["m45Person"], badges: { m45Person: "green tick" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 4, current: ["partner", "admin"], units: { ecom: "the shop's side" } },
  { cue: 2, part: 4, current: ["partner", "emailport", "emailsvc"], units: { ecom: "sign-up" } },
  { cue: 40, part: 4, current: ["partner", "admin"], units: { ecom: "next: take money" } },
];

const DIR = "screens/c-16-registration";
const FORM_REGION = [380, 110, 680, 425] as const;
export const screens: ScreenStep[] = [
  {
    cue: 3,
    src: `${DIR}/signup.png`,
    title: "Merchant portal · Sign up",
    region: [...FORM_REGION],
    focus: [[506, 128, 428, 60]],
    beats: [{ cue: 4, region: [...FORM_REGION], focus: [[539, 240, 362, 230], [539, 490, 362, 36]] }],
  },
  {
    cue: 18,
    src: `${DIR}/verify-wait.png`,
    title: "Merchant portal · Check your email",
    region: [...FORM_REGION],
    focus: [[506, 128, 428, 60]],
    beats: [
      { cue: 19, region: [...FORM_REGION], focus: [[539, 348, 362, 50], [823, 414, 78, 36]] },
      { cue: 20, region: [...FORM_REGION], focus: [[539, 419, 160, 26]] },
    ],
  },
  { cue: 21, src: `${DIR}/verify-six.png`, title: "Merchant portal · Check your email", region: [...FORM_REGION], focus: [[539, 348, 362, 50]], beats: [{ cue: 22, region: [...FORM_REGION], focus: [[823, 414, 78, 36]] }] },
  {
    cue: 23,
    src: `${DIR}/verified.png`,
    title: "Merchant portal · Email verified",
    region: [380, 70, 680, 425],
    focus: [[630, 225, 180, 40], [530, 272, 380, 40]],
  },
];
