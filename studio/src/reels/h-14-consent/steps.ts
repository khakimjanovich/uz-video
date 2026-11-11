import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 14: the consent gate. The credit offer and the screen (cues 0–3); the bridge (4–6); the four
// parts (7–14); refuse (15–20); accept and the record (21–29); every call (30–32); versions and the race
// (33–44); the map (45–47); the close (48–52).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 3, rows: [3], current: ["custgw", "postgres"], dot: "custgw", units: { heeyid: "password: a digest" } },
  { cue: 5, part: 3, rows: [3], current: ["mobile", "taf"], dot: "mobile", units: { heeyid: "phone ✓ · person ?" } },
  { cue: 6, part: 4, rows: [4], current: ["mobile", "custgw", "myid"], dot: "myid", units: { heeyid: "consent before every MyID call" } },
  { cue: 45, part: 4, current: ["custgw", "postgres"], dot: "postgres", units: { heeyid: "consent step + acceptance records" } },
  { cue: 46, part: 4, current: ["mobile"], dot: "mobile", units: { heeyid: "the app shows and sends" } },
  { cue: 47, part: 4, rows: [4], current: ["mobile", "custgw", "postgres", "myid"], dot: "off", units: { heeyid: "in the bank" } },
  { cue: 52, part: 4, rows: [4], dot: "off", units: { heeyid: "in the bank" } },
];

const GATE = { aziz: [0, 1], mobileBank: [1, 1], consent: [2, 1], myid: [3, 1] } as const;
const GATE_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "consent" }, { from: "consent", to: "myid" }] as const;
const ACCEPT = { ...GATE, acceptance: [2, 2] } as const;
const ACCEPT_EDGES = [...GATE_EDGES, { from: "consent", to: "acceptance" }, { from: "acceptance", to: "myid" }] as const;
const NEW_PHONE = { aziz: [0, 1], newPhone: [1, 1], consent: [2, 1], myid: [3, 1] } as const;
const VERSIONS = { staff: [0, 1], consent: [1.5, 1], acceptance: [3, 1] } as const;
const VERSION_EDGES = [{ from: "staff", to: "consent" }, { from: "consent", to: "acceptance" }] as const;
const RACE = { staff: [0, 0.3], aziz: [0, 1.7], consent: [1.5, 1], platform: [3, 1] } as const;
const RACE_EDGES = [{ from: "staff", to: "consent" }, { from: "aziz", to: "consent" }, { from: "consent", to: "platform" }] as const;
const CLOSE = { aziz: [0, 1], mobileBank: [1.5, 0.4], marketplace: [1.5, 1.6], myid: [3, 1] } as const;
const CLOSE_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "aziz", to: "marketplace" }, { from: "mobileBank", to: "myid" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The credit offer, and a screen before the camera.
  { cue: 0, layout: { aziz: [0, 1], mobileBank: [1.5, 1], credit: [3, 1] }, edges: [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "credit" }], accent: ["credit"], badges: { aziz: "level 1", credit: "needs level 2" } },
  { cue: 1, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { myid: "not yet" } },
  { cue: 2, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "what the bank reads", myid: "camera waits" } },
  { cue: 3, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "why first?" } },
  // The four fixed parts.
  { cue: 7, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"] },
  { cue: 8, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "4 fixed parts" } },
  { cue: 9, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "1 · the data", myid: "state records" } },
  { cue: 10, layout: GATE, edges: [...GATE_EDGES], accent: ["consent", "myid"], badges: { consent: "2 · the provider", myid: "MyID" } },
  { cue: 11, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "3 · purpose: this bank" } },
  { cue: 12, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "4 · who reads later" } },
  { cue: 13, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "bank's words · no part removed" } },
  { cue: 14, layout: GATE, edges: [...GATE_EDGES], accent: ["aziz"], badges: { aziz: "phone verified ✓" } },
  // Refuse: nothing at MyID.
  { cue: 15, layout: GATE, edges: [...GATE_EDGES], packets: [{ from: "mobileBank", to: "consent", label: "Refuse" }], badges: { consent: "Refuse" } },
  { cue: 17, layout: GATE, edges: [...GATE_EDGES], crossed: ["myid"], badges: { consent: "Refuse", myid: "nothing" } },
  { cue: 18, layout: GATE, edges: [...GATE_EDGES], crossed: ["myid"], badges: { aziz: "level 1", myid: "no session · no attempt" } },
  { cue: 19, layout: GATE, edges: [...GATE_EDGES], crossed: ["myid"], badges: { consent: "event: refused" } },
  { cue: 20, layout: GATE, edges: [...GATE_EDGES], accent: ["aziz"], badges: { aziz: "no = no cost" } },
  // Accept: the record first, one session per yes.
  { cue: 21, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { aziz: "again" } },
  { cue: 23, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "nothing pre-selected" } },
  { cue: 24, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], packets: [{ from: "mobileBank", to: "consent", label: "Accept" }], badges: { consent: "Accept" } },
  { cue: 25, layout: ACCEPT, edges: [...ACCEPT_EDGES], accent: ["acceptance"], packets: [{ from: "consent", to: "acceptance", label: "record first" }] },
  { cue: 26, layout: ACCEPT, edges: [...ACCEPT_EDGES], accent: ["acceptance"], badges: { acceptance: "texts + versions · language · time · device" } },
  { cue: 27, layout: ACCEPT, edges: [...ACCEPT_EDGES], accent: ["myid"], packets: [{ from: "acceptance", to: "myid", label: "open session" }] },
  { cue: 28, layout: ACCEPT, edges: [...ACCEPT_EDGES], accent: ["acceptance"], badges: { acceptance: "1 yes = 1 session" } },
  { cue: 29, layout: ACCEPT, edges: [...ACCEPT_EDGES], accent: ["acceptance"], badges: { acceptance: "→ this session only" } },
  // Before every call to MyID.
  { cue: 30, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "not just registration" } },
  { cue: 31, layout: GATE, edges: [...GATE_EDGES], accent: ["myid"], badges: { myid: "step-up · new device · dormant · refresh" } },
  { cue: 32, layout: NEW_PHONE, edges: [{ from: "aziz", to: "newPhone" }, { from: "newPhone", to: "consent" }, { from: "consent", to: "myid" }], accent: ["consent"], badges: { newPhone: "next year", consent: "again" } },
  // Versions, then the race between a new text and an old answer.
  { cue: 33, layout: VERSIONS, edges: [...VERSION_EDGES], accent: ["staff"] },
  { cue: 34, layout: VERSIONS, edges: [...VERSION_EDGES], accent: ["consent"], badges: { consent: "4 languages" } },
  { cue: 35, layout: VERSIONS, edges: [...VERSION_EDGES], accent: ["staff"], badges: { staff: "proposer ≠ approver" } },
  { cue: 36, layout: VERSIONS, edges: [...VERSION_EDGES], accent: ["consent"], badges: { consent: "every version kept" } },
  { cue: 37, layout: RACE, edges: [...RACE_EDGES], badges: { consent: "v1" } },
  { cue: 38, layout: RACE, edges: [...RACE_EDGES], accent: ["aziz"], badges: { consent: "v1", aziz: "reading v1" } },
  { cue: 39, layout: RACE, edges: [...RACE_EDGES], accent: ["staff"], packets: [{ from: "staff", to: "consent", label: "v2" }], badges: { consent: "v2 published", aziz: "reading v1" } },
  { cue: 40, layout: RACE, edges: [...RACE_EDGES], packets: [{ from: "aziz", to: "consent", label: "Accept v1" }, { from: "consent", to: "platform", label: "Accept v1", delay: 50 }], badges: { consent: "v2 published" } },
  { cue: 41, layout: RACE, edges: [...RACE_EDGES], danger: ["platform"], packets: [{ from: "platform", to: "consent", label: "show v2" }], badges: { platform: "answer refused" } },
  { cue: 43, layout: VERSIONS, edges: [...VERSION_EDGES], accent: ["acceptance"], badges: { acceptance: "the version he saw" } },
  { cue: 44, layout: VERSIONS, edges: [...VERSION_EDGES], accent: ["acceptance", "consent"], badges: { acceptance: "record = text", consent: "word for word" } },
  // The close: the camera can open, but who opens it?
  { cue: 48, layout: CLOSE, edges: [...CLOSE_EDGES], accent: ["aziz"], badges: { aziz: "yes" } },
  { cue: 49, layout: CLOSE, edges: [...CLOSE_EDGES], accent: ["myid"], badges: { myid: "camera" } },
  { cue: 50, layout: CLOSE, edges: [...CLOSE_EDGES], accent: ["mobileBank"], badges: { mobileBank: "opens it?", myid: "camera" } },
  { cue: 51, layout: CLOSE, edges: [...CLOSE_EDGES], accent: ["marketplace"], badges: { marketplace: "asks too?" } },
];
