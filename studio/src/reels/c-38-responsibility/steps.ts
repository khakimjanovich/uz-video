import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 38: the room and the building. The brochure (cues 0–1), what the assessor asks (2–3), the room and the building (4),
// the guide (5–6), doors and keys (7–8), honest gaps (9), the building judged (10–11), the close (12).
const ASKED = { m78Firewall: [2, 0.2], m78LoginLogs: [3.1, 0.2], m78KeyPeople: [2, 1.8], m78Cameras: [3.1, 1.8] } as const;
const BUILDING = { lockedRoom: [1.5, 1], bank: [0.2, 0.2], assessor: [2.8, 0.2] } as const;
const BUILDING_FRAMES = [
  { label: "Locked room", from: [1.5, 1], to: [1.5, 1], tone: "wall" },
  { label: "The bank's building", from: [0.2, 0.2], to: [2.8, 1.8] },
] as const;
const GUIDE = (a: BuildId, b: BuildId, c: BuildId) => ({
  layout: { m78Guide: [0.4, 1], [a]: [2.6, 0], [b]: [2.6, 1], [c]: [2.6, 2] } as Partial<Record<BuildId, [number, number]>>,
  edges: [a, b, c].map((to) => ({ from: "m78Guide" as const, to })),
});

export const map: BuildMapStep[] = [
  { cue: 0, part: 8, units: { ecom: "product", cards: "product" } },
  { cue: 12, part: 8, units: { ecom: "the shop", cards: "locked room" } },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The brochure.
  { cue: 1, layout: { bank: [0.4, 1], m78Product: [2.6, 1] }, edges: [{ from: "bank", to: "m78Product", label: "buys" }], badges: { m78Product: "compliant?" } },
  // What the assessor asks for, and what the vendor has.
  {
    cue: 2,
    layout: { assessor: [0, 1], ...ASKED },
    badges: { assessor: "show me" },
    accent: ["assessor"],
  },
  {
    cue: 3,
    layout: { m78Vendor: [0, 1], ...ASKED },
    frames: [{ label: "The bank's building", from: [2, 0.2], to: [3.1, 1.8] }],
    badges: { m78Vendor: "none of them" },
  },
  // The room and the building.
  { cue: 4, layout: BUILDING, frames: [...BUILDING_FRAMES] },
  // The guide.
  { cue: 5, ...GUIDE("m78Provide", "m78Install", "m78WhoDoes"), accent: ["m78Guide"] },
  {
    cue: 6,
    layout: { m78Twelve: [0.4, 1], m78ProductDoes: [2.6, 0], m78BanksPart: [2.6, 1], m78Shared: [2.6, 2] },
    edges: [{ from: "m78Twelve", to: "m78ProductDoes" }, { from: "m78Twelve", to: "m78BanksPart" }, { from: "m78Twelve", to: "m78Shared" }],
  },
  // Doors and keys.
  {
    cue: 7,
    layout: { ingress: [0.2, 0.3], partnerdoor: [0.2, 1.8], lockedRoom: [1.6, 1], m78Firewalls: [3, 1] },
    edges: [{ from: "ingress", to: "lockedRoom" }, { from: "partnerdoor", to: "lockedRoom" }],
    badges: { lockedRoom: "two doors only" },
    accent: ["m78Firewalls"],
  },
  {
    cue: 8,
    layout: { bank: [0.4, 1], keyholders: [2.6, 1] },
    edges: [{ from: "bank", to: "keyholders", label: "chooses" }],
    badges: { keyholders: "3 of 5" },
  },
  // Honest gaps.
  {
    cue: 9,
    layout: { m78Guide: [0.4, 1], m78Gap: [2.6, 0.3], m78Meanwhile: [2.6, 1.8] },
    edges: [{ from: "m78Guide", to: "m78Gap" }, { from: "m78Gap", to: "m78Meanwhile" }],
    danger: ["m78Gap"],
  },
  // The whole building is judged.
  { cue: 10, layout: BUILDING, frames: [...BUILDING_FRAMES], badges: { assessor: "the whole building" }, accent: ["assessor"] },
  { cue: 11, layout: BUILDING, frames: [...BUILDING_FRAMES], badges: { lockedRoom: "we deliver", bank: "owns it" } },
];
