import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 15: MyID proofing. The lift (cues 0–2); the bridge (3–4); the side app and the master app
// (5–14); the backend opens the session (15–22); capture and the result code (23–30); a copied code
// (31–35); checks on the result (36–41); failures (42–49); the lift again (50–54); the close (55–59).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 3, part: 4, rows: [4], current: ["mobile", "custgw", "postgres"], dot: "postgres", units: { heeyid: "one acceptance, one session" } },
  { cue: 4, part: 4, rows: [4], current: ["mobile", "custgw", "adapters", "myid"], dot: "myid", units: { heeyid: "in the bank" } },
  { cue: 16, part: 4, current: ["custgw", "adapters", "vault", "myid"], dot: "myid", units: { heeyid: "credentials stay in the bank" } },
  { cue: 55, part: 4, rows: [4], current: ["mobile", "custgw", "adapters", "myid"], dot: "off", units: { heeyid: "in the bank" } },
  { cue: 59, part: 4, rows: [4], dot: "off", units: { heeyid: "in the bank" } },
];

const LIFT = { aziz: [0, 1], mobileBank: [1.4, 1], myid: [2.8, 1] } as const;
const LIFT_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "myid" }] as const;
const SIDE = { aziz: [0, 1], marketplace: [1.2, 0.4], platform: [2.8, 0.4], mobileBank: [1.2, 1.7] } as const;
const SIDE_EDGES = [{ from: "aziz", to: "marketplace" }, { from: "marketplace", to: "platform" }, { from: "aziz", to: "mobileBank" }] as const;
const MASTER = { ...SIDE, myid: [2.8, 1.7] } as const;
const MASTER_EDGES = [...SIDE_EDGES, { from: "mobileBank", to: "myid" }] as const;
const OPEN = { mobileBank: [0, 1], platform: [1.5, 1], myid: [3, 1] } as const;
const OPEN_EDGES = [{ from: "mobileBank", to: "platform" }, { from: "platform", to: "myid" }] as const;
const CAPTURE = { aziz: [0, 1.8], mobileBank: [0, 0.5], platform: [1.6, 1.2], myid: [3, 0.5] } as const;
const CAPTURE_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "myid" }, { from: "mobileBank", to: "platform" }, { from: "platform", to: "myid" }] as const;
const REPLAY = { newPhone: [0, 1.8], mobileBank: [0, 0.5], platform: [1.6, 1.2], myid: [3, 0.5] } as const;
const REPLAY_EDGES = [{ from: "mobileBank", to: "platform" }, { from: "newPhone", to: "platform" }, { from: "platform", to: "myid" }] as const;
const RESULT = { myid: [0, 1], platform: [1.5, 1], identity: [3, 1] } as const;
const RESULT_EDGES = [{ from: "myid", to: "platform" }, { from: "platform", to: "identity" }] as const;
const CONFIRM = { aziz: [0, 1], mobileBank: [1.5, 1], platform: [3, 1] } as const;
const CONFIRM_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }] as const;
const FAIL = { aziz: [0, 1], mobileBank: [1, 1], platform: [2, 1], myid: [3, 1] } as const;
const FAIL_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }, { from: "platform", to: "myid" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The lift: the check finished, the network did not.
  { cue: 0, layout: LIFT, edges: [...LIFT_EDGES], accent: ["aziz"], badges: { mobileBank: "no network" } },
  { cue: 1, layout: LIFT, edges: [...LIFT_EDGES], accent: ["myid"], packets: [{ from: "myid", to: "mobileBank", label: "face ✓", stopAt: 0.5 }], badges: { myid: "check done" } },
  { cue: 2, layout: LIFT, edges: [...LIFT_EDGES], badges: { mobileBank: "passed or lost?" } },
  // A side app asks; the answer is the master app.
  { cue: 5, layout: SIDE, edges: [...SIDE_EDGES], accent: ["marketplace"] },
  { cue: 6, layout: SIDE, edges: [...SIDE_EDGES], accent: ["marketplace"], badges: { marketplace: "instalments: level 2" } },
  { cue: 7, layout: SIDE, edges: [...SIDE_EDGES], packets: [{ from: "marketplace", to: "platform", label: "step-up" }] },
  { cue: 8, layout: SIDE, edges: [...SIDE_EDGES, { from: "marketplace", to: "mobileBank" }], accent: ["mobileBank"], packets: [{ from: "platform", to: "marketplace", label: "continue in the mobile bank" }] },
  { cue: 9, layout: SIDE, edges: [...SIDE_EDGES], danger: ["marketplace"], packets: [{ from: "marketplace", to: "platform", label: "proofing?", stopAt: 0.6 }], badges: { platform: "E-APP-01", marketplace: "no session" } },
  { cue: 11, layout: MASTER, edges: [...MASTER_EDGES], accent: ["mobileBank"], badges: { mobileBank: "master app: MyID package" } },
  { cue: 12, layout: MASTER, edges: [...MASTER_EDGES], accent: ["mobileBank", "myid"], badges: { mobileBank: "one camera, one door" } },
  { cue: 13, layout: MASTER, edges: [...MASTER_EDGES], accent: ["aziz"], badges: { aziz: "one more tap" } },
  { cue: 14, layout: MASTER, edges: [...MASTER_EDGES], accent: ["mobileBank"], packets: [{ from: "aziz", to: "mobileBank", label: "consent ✓" }] },
  // The backend opens the session.
  { cue: 15, layout: OPEN, edges: [...OPEN_EDGES], accent: ["platform"], badges: { platform: "the backend opens it" } },
  { cue: 17, layout: OPEN, edges: [...OPEN_EDGES], packets: [{ from: "platform", to: "myid", label: "threshold" }], badges: { myid: "minimum match" } },
  { cue: 18, layout: OPEN, edges: [...OPEN_EDGES], packets: [{ from: "myid", to: "platform", label: "session id" }, { from: "platform", to: "mobileBank", label: "handle", delay: 55 }] },
  { cue: 19, layout: OPEN, edges: [...OPEN_EDGES], accent: ["platform"], badges: { platform: "session: Open" } },
  { cue: 20, layout: OPEN, edges: [...OPEN_EDGES], accent: ["platform"], badges: { platform: "1 customer · 1 device · step-up · full" } },
  { cue: 21, layout: OPEN, edges: [...OPEN_EDGES], accent: ["myid"], badges: { myid: "10 min, set by MyID" } },
  { cue: 22, layout: OPEN, edges: [...OPEN_EDGES], accent: ["platform"], badges: { platform: "no second session" } },
  // Capture, and a one-use result code.
  { cue: 23, layout: CAPTURE, edges: [...CAPTURE_EDGES], packets: [{ from: "aziz", to: "mobileBank", label: "document + face" }, { from: "mobileBank", to: "myid", label: "capture", delay: 45 }] },
  { cue: 24, layout: CAPTURE, edges: [...CAPTURE_EDGES], accent: ["myid"], badges: { myid: "live? state records?" } },
  { cue: 25, layout: CAPTURE, edges: [...CAPTURE_EDGES], packets: [{ from: "myid", to: "mobileBank", label: "result code" }] },
  { cue: 26, layout: CAPTURE, edges: [...CAPTURE_EDGES], accent: ["mobileBank"], badges: { mobileBank: "code ≠ result" } },
  { cue: 27, layout: CAPTURE, edges: [...CAPTURE_EDGES], accent: ["mobileBank"], badges: { mobileBank: "ticket: 5 min · once" } },
  { cue: 28, layout: CAPTURE, edges: [...CAPTURE_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "code + session id" }] },
  { cue: 29, layout: CAPTURE, edges: [...CAPTURE_EDGES], accent: ["platform"], badges: { platform: "same device · Open · once" } },
  { cue: 30, layout: CAPTURE, edges: [...CAPTURE_EDGES], packets: [{ from: "platform", to: "myid", label: "exchange" }, { from: "myid", to: "platform", label: "result", delay: 55 }] },
  // A copied code from another phone.
  { cue: 31, layout: REPLAY, edges: [...REPLAY_EDGES], danger: ["newPhone"], badges: { newPhone: "copied code" } },
  { cue: 32, layout: REPLAY, edges: [...REPLAY_EDGES], danger: ["newPhone"], packets: [{ from: "newPhone", to: "platform", label: "same code", stopAt: 0.7 }] },
  { cue: 33, layout: REPLAY, edges: [...REPLAY_EDGES], danger: ["newPhone"], crossed: ["newPhone"], badges: { platform: "wrong device · already used" } },
  { cue: 34, layout: REPLAY, edges: [...REPLAY_EDGES], crossed: ["newPhone"], badges: { platform: "security event" } },
  { cue: 35, layout: REPLAY, edges: [...REPLAY_EDGES], accent: ["platform"], badges: { platform: "code never stored" } },
  // The checks on the result, then the confirmation.
  { cue: 36, layout: RESULT, edges: [...RESULT_EDGES], packets: [{ from: "myid", to: "platform", label: "result" }], badges: { platform: "check every field" } },
  { cue: 37, layout: RESULT, edges: [...RESULT_EDGES], badges: { platform: "number: 14 digits" } },
  { cue: 38, layout: RESULT, edges: [...RESULT_EDGES], badges: { platform: "expired document = failure" } },
  { cue: 39, layout: RESULT, edges: [...RESULT_EDGES], badges: { platform: "below minimum = face not matched" } },
  { cue: 40, layout: RESULT, edges: [...RESULT_EDGES], accent: ["identity"], packets: [{ from: "platform", to: "identity", label: "keep" }], badges: { platform: "Succeeded" } },
  { cue: 41, layout: CONFIRM, edges: [...CONFIRM_EDGES], accent: ["aziz"], packets: [{ from: "platform", to: "mobileBank", label: "masked data" }, { from: "aziz", to: "mobileBank", label: "confirm", delay: 60 }] },
  // Failures in plain words.
  { cue: 42, layout: FAIL, edges: [...FAIL_EDGES], badges: { platform: "plain words" } },
  { cue: 43, layout: FAIL, edges: [...FAIL_EDGES], badges: { aziz: "glare" } },
  { cue: 44, layout: FAIL, edges: [...FAIL_EDGES], packets: [{ from: "myid", to: "platform", label: "reason code" }, { from: "platform", to: "mobileBank", label: "poor image: try again now", delay: 50 }] },
  { cue: 45, layout: FAIL, edges: [...FAIL_EDGES], badges: { mobileBank: "no code · no provider name" } },
  { cue: 46, layout: FAIL, edges: [...FAIL_EDGES], badges: { platform: "person or capture: counted" } },
  { cue: 47, layout: FAIL, edges: [...FAIL_EDGES], badges: { platform: "service: not counted" } },
  { cue: 48, layout: FAIL, edges: [...FAIL_EDGES], danger: ["myid"], badges: { myid: "down", mobileBank: "temporarily not available", aziz: "level unchanged" } },
  { cue: 49, layout: FAIL, edges: [...FAIL_EDGES], danger: ["myid"], badges: { platform: "no deferred proofing" } },
  // The lift again: the lost code.
  { cue: 50, layout: CAPTURE, edges: [...CAPTURE_EDGES], badges: { mobileBank: "the lift" } },
  { cue: 51, layout: CAPTURE, edges: [...CAPTURE_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "complete, no code" }] },
  { cue: 52, layout: CAPTURE, edges: [...CAPTURE_EDGES], packets: [{ from: "platform", to: "myid", label: "status?" }], badges: { myid: "session closed" } },
  { cue: 53, layout: CAPTURE, edges: [...CAPTURE_EDGES], accent: ["platform"], packets: [{ from: "myid", to: "platform", label: "code found" }], badges: { platform: "exchange continues" } },
  { cue: 54, layout: CAPTURE, edges: [...CAPTURE_EDGES], badges: { platform: "no code: not counted" } },
  // The close.
  { cue: 56, layout: { aziz: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "aziz", to: "platform" }], accent: ["aziz"], badges: { aziz: "level 2" } },
  { cue: 57, layout: { aziz: [0, 1], newPhone: [1.5, 1], myid: [3, 1] }, edges: [{ from: "aziz", to: "newPhone" }, { from: "newPhone", to: "myid" }], accent: ["newPhone"], badges: { newPhone: "next year" } },
  { cue: 58, layout: { aziz: [0, 1], newPhone: [1.5, 1], myid: [3, 1] }, edges: [{ from: "aziz", to: "newPhone" }, { from: "newPhone", to: "myid" }], accent: ["myid"], badges: { myid: "passport again?" } },
];
