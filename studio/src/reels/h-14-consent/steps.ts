import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 12: the required level, the step-up and the consent gate. The transfer that waits (0–4); the bridge (5–8);
// the required level (9–14); the step-up (15–24); the gate and its four parts (25–33); versions (34–38);
// refuse (39–44); accept and the record (45–54); the old version (55–60); the map (61–62); the check (63–65);
// the summary and the way to MyID (66–71).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 6, part: 3, rows: [3], current: ["mobile", "taf"], dot: "mobile", units: { heeyid: "phone ✓ · person ?" } },
  { cue: 8, part: 4, rows: [4], current: ["mobile", "custgw", "myid"], dot: "myid", units: { heeyid: "the way to level 2" } },
  { cue: 61, part: 4, current: ["custgw", "postgres"], dot: "postgres", units: { heeyid: "consent gate + answer records" } },
  { cue: 62, part: 4, current: ["mobile"], dot: "mobile", units: { heeyid: "the app shows and sends" } },
  { cue: 63, part: 4, rows: [4], dot: "off", units: { heeyid: "in the bank" } },
  { cue: 71, part: 4, rows: [4], current: ["myid"], dot: "myid", units: { heeyid: "the MyID check" } },
];

const START = { aziz: [0, 1], mobileBank: [1.5, 1], transfer: [3, 1] } as const;
const START_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "transfer" }] as const;
const SCREEN = { aziz: [0, 1], mobileBank: [1, 1], consent: [2, 1], transfer: [3, 1] } as const;
const SCREEN_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "consent" }, { from: "consent", to: "transfer", broken: true }] as const;
const LEVELS = { level1: [0.5, 1], level2: [2.5, 1] } as const;
const APPS = { apps: [0, 1], mobileBank: [1.5, 1], transfer: [3, 1] } as const;
const APPS_EDGES = [{ from: "apps", to: "mobileBank" }, { from: "mobileBank", to: "transfer" }] as const;
const STEP = { mobileBank: [0, 1], platform: [1.5, 1], level2: [3, 1] } as const;
const STEP_EDGES = [{ from: "mobileBank", to: "platform" }, { from: "platform", to: "level2", label: "step-up" }] as const;
const CHECKS = { consent: [0, 1], myid: [1.5, 1], azizPhone: [3, 1] } as const;
const CHECK_EDGES = [{ from: "consent", to: "myid" }, { from: "myid", to: "azizPhone", label: "phone check" }] as const;
const GATE = { aziz: [0, 1], mobileBank: [1, 1], consent: [2, 1], myid: [3, 1] } as const;
const GATE_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "consent" }, { from: "consent", to: "myid" }] as const;
const READERS = { consent: [0.5, 1], taf: [2.5, 1] } as const;
const VERSIONS = { staff: [0, 1], texts: [1.5, 1], consent: [3, 1] } as const;
const VERSION_EDGES = [{ from: "staff", to: "texts" }, { from: "texts", to: "consent" }] as const;
const ACCEPT = { ...GATE, acceptance: [2, 2] } as const;
const ACCEPT_EDGES = [...GATE_EDGES, { from: "consent", to: "acceptance" }, { from: "acceptance", to: "myid" }] as const;
const RACE = { staff: [0, 0.3], aziz: [0, 1.7], consent: [1.5, 1], platform: [3, 1] } as const;
const RACE_EDGES = [{ from: "staff", to: "consent" }, { from: "aziz", to: "consent" }, { from: "consent", to: "platform" }] as const;
const RECORD = { consent: [0.5, 1], acceptance: [2.5, 1] } as const;
const CLOSE = { aziz: [0, 1], consent: [1, 1], myid: [2, 1], transfer: [3, 1] } as const;
const CLOSE_EDGES = [{ from: "aziz", to: "consent" }, { from: "consent", to: "myid" }, { from: "myid", to: "transfer" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Saturday: the transfer to his mother, and a screen of text instead.
  { cue: 0, layout: START, edges: [...START_EDGES], accent: ["transfer"], badges: { aziz: "level 1" } },
  { cue: 1, layout: START, edges: [...START_EDGES], packets: [{ from: "mobileBank", to: "transfer", label: "Send" }] },
  { cue: 2, layout: START, edges: [START_EDGES[0], { from: "mobileBank", to: "transfer", broken: true }], badges: { transfer: "waits · no error" } },
  { cue: 3, layout: SCREEN, edges: [...SCREEN_EDGES], accent: ["consent"], badges: { consent: "a screen of text" } },
  { cue: 4, layout: SCREEN, edges: [...SCREEN_EDGES], accent: ["consent"], badges: { consent: "why?" } },
  // The bridge: level 1 since Sunday.
  { cue: 5, layout: LEVELS, accent: ["level1"], badges: { level1: "since Sunday" } },
  { cue: 6, layout: LEVELS, accent: ["level1"], badges: { level1: "number · code · password" } },
  { cue: 7, layout: LEVELS, accent: ["level1"], badges: { level1: "phone ✓ · person ?" } },
  { cue: 8, layout: LEVELS, edges: [{ from: "level1", to: "level2", label: "this screen first" }], accent: ["level2"] },
  // The required level of each app.
  { cue: 9, layout: APPS, edges: [...APPS_EDGES], accent: ["apps"], badges: { apps: "name · kind · required level" } },
  { cue: 10, layout: APPS, edges: [...APPS_EDGES], accent: ["apps"], badges: { apps: "required level = lowest asked" } },
  { cue: 11, layout: APPS, edges: [...APPS_EDGES], accent: ["mobileBank"], badges: { mobileBank: "required level 1" } },
  { cue: 12, layout: APPS, edges: [...APPS_EDGES], accent: ["mobileBank"], badges: { mobileBank: "own data: level 1" } },
  { cue: 13, layout: APPS, edges: [...APPS_EDGES], accent: ["transfer"], badges: { mobileBank: "own data: level 1", transfer: "money · verified data: 2" } },
  { cue: 14, layout: APPS, edges: [APPS_EDGES[0], { from: "mobileBank", to: "transfer", broken: true }], accent: ["transfer"], badges: { transfer: "needs level 2" } },
  // The step-up: never a refusal, always the way up.
  { cue: 15, layout: STEP, edges: [STEP_EDGES[0]], badges: { platform: "not allowed?" } },
  { cue: 16, layout: STEP, edges: [STEP_EDGES[0]], accent: ["platform"], badges: { platform: "never refuses" } },
  { cue: 17, layout: STEP, edges: [...STEP_EDGES], accent: ["platform"], packets: [{ from: "mobileBank", to: "platform", label: "step-up" }] },
  { cue: 18, layout: STEP, edges: [...STEP_EDGES], accent: ["platform"], badges: { platform: "3 parts" } },
  { cue: 19, layout: STEP, edges: [...STEP_EDGES], accent: ["mobileBank"], badges: { mobileBank: "current: 1" } },
  { cue: 20, layout: STEP, edges: [...STEP_EDGES], accent: ["level2"], badges: { mobileBank: "current: 1", level2: "required: 2" } },
  { cue: 21, layout: CHECKS, edges: [...CHECK_EDGES], accent: ["consent", "myid", "azizPhone"], badges: { azizPhone: "in the mobile bank" } },
  { cue: 22, layout: CHECKS, edges: [...CHECK_EDGES], accent: ["myid"], badges: { myid: "only this gives level 2" } },
  { cue: 23, layout: { ...CHECKS, caseOperator: [1.5, 2.1] }, edges: [...CHECK_EDGES, { from: "caseOperator", to: "myid", broken: true }], crossed: ["caseOperator"], badges: { myid: "no app · no operator · no setting" } },
  { cue: 24, layout: STEP, edges: [...STEP_EDGES], accent: ["level2"], badges: { platform: "the way up" } },
  // The consent gate and its four fixed parts.
  { cue: 25, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "consent gate" } },
  { cue: 26, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { myid: "only through the gate" } },
  { cue: 27, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "4 fixed parts" } },
  { cue: 28, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "1 · the data", myid: "state records" } },
  { cue: 29, layout: GATE, edges: [...GATE_EDGES], accent: ["consent", "myid"], badges: { consent: "2 · the provider", myid: "MyID" } },
  { cue: 30, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "3 · purpose: this bank" } },
  { cue: 31, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "4 · who reads later", mobileBank: "channels · operators" } },
  { cue: 32, layout: READERS, edges: [{ from: "consent", to: "taf", label: "ID number only" }], accent: ["taf"], badges: { taf: "2 checks after MyID" } },
  { cue: 33, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "bank's words · no part removed" } },
  // The words come in versions.
  { cue: 34, layout: VERSIONS, edges: [...VERSION_EDGES], accent: ["texts"], badges: { texts: "versions" } },
  { cue: 35, layout: VERSIONS, edges: [...VERSION_EDGES], accent: ["texts"], badges: { texts: "consent + terms · 4 languages" } },
  { cue: 36, layout: VERSIONS, edges: [...VERSION_EDGES], accent: ["staff"], badges: { staff: "proposer ≠ approver" } },
  { cue: 37, layout: VERSIONS, edges: [...VERSION_EDGES], accent: ["texts"], badges: { texts: "default · changed · all kept" } },
  { cue: 38, layout: VERSIONS, edges: [...VERSION_EDGES], accent: ["consent"], badges: { consent: "published now · his language" } },
  // Refuse: nothing at MyID.
  { cue: 39, layout: GATE, edges: [...GATE_EDGES], packets: [{ from: "mobileBank", to: "consent", label: "Refuse" }], badges: { consent: "Refuse" } },
  { cue: 40, layout: GATE, edges: [...GATE_EDGES], crossed: ["myid"], badges: { myid: "no session" } },
  { cue: 41, layout: GATE, edges: [...GATE_EDGES], crossed: ["myid"], badges: { aziz: "level 1", myid: "no attempt" } },
  { cue: 42, layout: GATE, edges: [...GATE_EDGES], crossed: ["myid"], badges: { consent: "event: refused" } },
  { cue: 43, layout: GATE, edges: [...GATE_EDGES], accent: ["aziz"], badges: { aziz: "no costs nothing" } },
  { cue: 44, layout: GATE, edges: [...GATE_EDGES], accent: ["aziz"], badges: { aziz: "a real choice" } },
  // Accept: the record first, one session for each yes.
  { cue: 45, layout: START, edges: [...START_EDGES], accent: ["transfer"], badges: { transfer: "rent due Monday" } },
  { cue: 46, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "again" } },
  { cue: 47, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "nothing selected" } },
  { cue: 48, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "no earlier yes" } },
  { cue: 49, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], packets: [{ from: "mobileBank", to: "consent", label: "Accept" }], badges: { consent: "Accept" } },
  { cue: 50, layout: ACCEPT, edges: [...ACCEPT_EDGES], accent: ["acceptance"], packets: [{ from: "consent", to: "acceptance", label: "record first" }] },
  { cue: 51, layout: ACCEPT, edges: [...ACCEPT_EDGES], accent: ["acceptance"], badges: { acceptance: "+ language · purpose" } },
  { cue: 52, layout: ACCEPT, edges: [...ACCEPT_EDGES], accent: ["myid"], packets: [{ from: "acceptance", to: "myid", label: "open session" }] },
  { cue: 53, layout: ACCEPT, edges: [...ACCEPT_EDGES], accent: ["acceptance"], badges: { acceptance: "1 yes = 1 session" } },
  { cue: 54, layout: ACCEPT, edges: [...ACCEPT_EDGES], accent: ["acceptance"], badges: { acceptance: "→ this session only" } },
  // An answer to an old version.
  { cue: 55, layout: RACE, edges: [...RACE_EDGES], badges: { consent: "v1" } },
  { cue: 56, layout: RACE, edges: [...RACE_EDGES], accent: ["aziz"], badges: { consent: "v1", aziz: "reading v1" } },
  { cue: 57, layout: RACE, edges: [...RACE_EDGES], accent: ["staff"], packets: [{ from: "staff", to: "consent", label: "v2" }], badges: { consent: "v2 published", aziz: "reading v1" } },
  { cue: 58, layout: RACE, edges: [...RACE_EDGES], packets: [{ from: "aziz", to: "consent", label: "Accept v1" }, { from: "consent", to: "platform", label: "Accept v1", delay: 50 }], badges: { consent: "v2 published" } },
  { cue: 59, layout: RACE, edges: [...RACE_EDGES], danger: ["platform"], packets: [{ from: "platform", to: "consent", label: "show v2" }], badges: { platform: "answer refused" } },
  { cue: 60, layout: RECORD, edges: [{ from: "consent", to: "acceptance" }], accent: ["acceptance", "consent"], badges: { acceptance: "the version he saw", consent: "word for word" } },
  // The check.
  { cue: 63, layout: GATE, edges: [...GATE_EDGES] },
  { cue: 64, layout: GATE, edges: [...GATE_EDGES], packets: [{ from: "mobileBank", to: "consent", label: "Refuse" }], badges: { myid: "attempts?" } },
  { cue: 65, layout: GATE, edges: [...GATE_EDGES], crossed: ["myid"], badges: { myid: "none" } },
  // The summary, and the way to MyID.
  { cue: 66, layout: APPS, edges: [...APPS_EDGES], accent: ["apps", "transfer"], badges: { apps: "required level", transfer: "money: level 2" } },
  { cue: 67, layout: STEP, edges: [...STEP_EDGES], accent: ["platform"], badges: { platform: "level + checks" } },
  { cue: 68, layout: GATE, edges: [...GATE_EDGES], accent: ["consent"], badges: { consent: "4 parts · published version" } },
  { cue: 69, layout: ACCEPT, edges: [...ACCEPT_EDGES], accent: ["acceptance"], badges: { acceptance: "1 yes = 1 session", aziz: "no = no cost" } },
  { cue: 70, layout: CLOSE, edges: [...CLOSE_EDGES], accent: ["consent"], badges: { consent: "yes ✓", transfer: "waits" } },
  { cue: 71, layout: CLOSE, edges: [...CLOSE_EDGES], accent: ["myid"], badges: { consent: "yes ✓", myid: "lesson 13" } },
];
