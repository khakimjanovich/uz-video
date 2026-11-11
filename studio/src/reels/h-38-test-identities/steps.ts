import { BuildMapStep, DiagramFrame, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 38: test identities. Aziz is not real (0–5); two zones (6–13); test identities (14–19); the test
// flag (20–25); the guards (26–29); the simulators (30–34); Aziz in three places (35–38); the close (39–43).
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 9, rows: [2, 9], current: ["adapters", "staff", "admingw"], dot: "adapters", units: { heeyid: "lesson 7: simulators · lesson 37: maker-checker" } },
  { cue: 5, part: 9, rows: [9], current: ["perimeter", "myid"], dot: "myid", units: { heeyid: "two zones, a test identity" } },
  { cue: 43, part: 9, rows: [9], dot: "off", units: UNIT },
];

const ZONES = { stage: [0.5, 0.4], myidTest: [0.5, 1.6], production: [2.5, 0.4], myid: [2.5, 1.6] } as const;
const ZONE_EDGES = [{ from: "stage", to: "myidTest" }, { from: "production", to: "myid" }] as const;
const FRAMES: DiagramFrame[] = [
  { label: "Test zone", from: [0.5, 0.4], to: [0.5, 1.6] },
  { label: "Production zone", from: [2.5, 0.4], to: [2.5, 1.6], tone: "wall" },
];
const IDS = { stage: [0, 1], myidTest: [1.5, 1], testId: [3, 1] } as const;
const IDS_EDGES = [{ from: "stage", to: "myidTest" }, { from: "myidTest", to: "testId" }] as const;
const FLAG = { aziz: [0.5, 1], stage: [2.5, 1] } as const;
const SIMS = { platform: [0.5, 1], simulators: [2.5, 1] } as const;
const THREE = { stage: [0, 0.3], simulators: [1.5, 0.3], production: [3, 0.3], testId: [0, 1.7], aziz: [1.5, 1.7], myid: [3, 1.7] } as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Aziz is not real, and MyID only proves real people.
  { cue: 0, layout: { aziz: [1.5, 1] }, accent: ["aziz"], badges: { aziz: "not a real person" } },
  { cue: 1, layout: { aziz: [1.5, 1] }, badges: { aziz: "registered · proved · blocked · refreshed" } },
  { cue: 2, layout: { aziz: [0.5, 1], myid: [2.5, 1] }, edges: [{ from: "aziz", to: "myid" }], accent: ["myid"], badges: { myid: "real people only" } },
  { cue: 3, layout: { aziz: [0.5, 1], myid: [2.5, 1] }, edges: [{ from: "aziz", to: "myid", broken: true }], badges: { aziz: "how?" } },
  // Two zones, two installations, no route between them.
  { cue: 6, layout: ZONES, edges: [...ZONE_EDGES], frames: FRAMES },
  { cue: 7, layout: ZONES, edges: [...ZONE_EDGES], frames: FRAMES, accent: ["stage", "production"] },
  { cue: 9, layout: ZONES, edges: [...ZONE_EDGES], frames: FRAMES, badges: { stage: "own credentials · own data", production: "own credentials · own data" } },
  { cue: 10, layout: ZONES, edges: [...ZONE_EDGES], frames: FRAMES, accent: ["myidTest", "myid"] },
  { cue: 11, layout: ZONES, edges: [...ZONE_EDGES, { from: "stage", to: "myid", broken: true }, { from: "production", to: "myidTest", broken: true }], frames: FRAMES, badges: { stage: "no route" } },
  { cue: 12, layout: ZONES, edges: [...ZONE_EDGES, { from: "stage", to: "production" }], frames: FRAMES, packets: [{ from: "stage", to: "production", label: "configuration only" }] },
  { cue: 13, layout: ZONES, edges: [...ZONE_EDGES, { from: "stage", to: "production" }], frames: FRAMES, packets: [{ from: "stage", to: "production", label: "customers", stopAt: 0.5 }], badges: { production: "nothing else moves" } },
  // Test identities: registered at MyID, listed in stage, each with an expected result.
  { cue: 15, layout: IDS, edges: [...IDS_EDGES], accent: ["myidTest", "testId"] },
  { cue: 16, layout: IDS, edges: [...IDS_EDGES], accent: ["stage"], badges: { stage: "lists them" } },
  { cue: 17, layout: IDS, edges: [...IDS_EDGES], badges: { testId: "ID number → expected result" } },
  { cue: 18, layout: IDS, edges: [...IDS_EDGES], badges: { testId: "success · face ✕ · document expired" } },
  { cue: 19, layout: IDS, edges: [...IDS_EDGES], accent: ["stage"], badges: { stage: "same journey, same result" } },
  // The test flag.
  { cue: 21, layout: FLAG, edges: [{ from: "aziz", to: "stage" }], accent: ["aziz"], badges: { aziz: "test flag" } },
  { cue: 22, layout: FLAG, edges: [{ from: "aziz", to: "stage" }], badges: { aziz: "test flag", stage: "limits and reports ignore it" } },
  { cue: 23, layout: { myid: [0.5, 1], production: [2.5, 1] }, edges: [{ from: "myid", to: "production" }], accent: ["production"], badges: { production: "real, proved people only" } },
  { cue: 24, layout: { myid: [0.5, 1], production: [2.5, 1] }, edges: [{ from: "myid", to: "production" }], badges: { production: "the bank's own checks: normal customers" } },
  { cue: 25, layout: { myid: [0.5, 1], production: [2.5, 1] }, edges: [{ from: "myid", to: "production" }], accent: ["production"], badges: { production: "no back door called test" } },
  // The guards.
  { cue: 27, layout: { myidTest: [0.5, 1], production: [2.5, 1] }, edges: [{ from: "production", to: "myidTest", broken: true }], danger: ["production"], badges: { production: "test host: does not start" } },
  { cue: 28, layout: { aziz: [0.5, 1], postgres: [2.5, 1] }, edges: [{ from: "aziz", to: "postgres", broken: true }], crossed: ["aziz"], badges: { postgres: "production: test flag refused" } },
  { cue: 29, layout: { stage: [0, 1], helm: [1.5, 1], production: [3, 1] }, edges: [{ from: "stage", to: "helm" }, { from: "helm", to: "production" }], accent: ["helm"], badges: { helm: "values difference · second person" } },
  // The simulators.
  { cue: 31, layout: SIMS, edges: [{ from: "platform", to: "simulators" }], accent: ["simulators"], badges: { simulators: "MyID · SMS · push · lookup · antifraud" } },
  { cue: 32, layout: SIMS, edges: [{ from: "platform", to: "simulators" }], packets: [{ from: "simulators", to: "platform", label: "each reason code" }] },
  { cue: 33, layout: SIMS, edges: [{ from: "platform", to: "simulators" }], badges: { platform: "on a laptop · no internet" } },
  { cue: 34, layout: { simulators: [0.5, 1], myidTest: [2.5, 1] }, edges: [{ from: "simulators", to: "myidTest" }], accent: ["myidTest"], badges: { myidTest: "each night" } },
  // Aziz in three places.
  { cue: 35, layout: THREE, edges: [{ from: "stage", to: "testId" }, { from: "simulators", to: "aziz" }, { from: "production", to: "myid" }] },
  { cue: 36, layout: THREE, edges: [{ from: "stage", to: "testId" }, { from: "simulators", to: "aziz" }, { from: "production", to: "myid" }], accent: ["testId"], badges: { testId: "known result" } },
  { cue: 37, layout: THREE, edges: [{ from: "stage", to: "testId" }, { from: "simulators", to: "aziz" }, { from: "production", to: "myid" }], accent: ["simulators"], badges: { simulators: "never tired" } },
  { cue: 38, layout: { ...THREE, production: [3, 0.3] }, edges: [{ from: "stage", to: "testId" }, { from: "simulators", to: "aziz" }], crossed: ["myid"], badges: { production: "no Aziz" } },
  // Recap and the open question.
  { cue: 39, layout: ZONES, edges: [...ZONE_EDGES], frames: FRAMES, accent: ["stage", "production"] },
  { cue: 40, layout: IDS, edges: [...IDS_EDGES], accent: ["testId"] },
  { cue: 42, layout: { stage: [0.5, 1], production: [2.5, 1] }, badges: { stage: "who builds?", production: "when is it done?" } },
];
