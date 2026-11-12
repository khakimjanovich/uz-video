import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 13: MyID proofing. The lift (cues 0–4); the bridge (5–6); the root and emulator check (7–13);
// only the mobile bank (14–16); the backend opens the session (17–29); capture and the result code (30–37);
// a copied code (38–42); checks on the result (43–47); plain words (48–52); the limits (53–62);
// the lift again (63–68); the confirmation (69–71); the check (72–74); the close (75–81).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 5, part: 4, rows: [4], current: ["mobile", "custgw", "postgres"], dot: "postgres", units: { heeyid: "one yes, one session" } },
  { cue: 7, part: 4, rows: [4], current: ["mobile"], dot: "mobile", units: { heeyid: "the app checks the phone" } },
  { cue: 22, part: 4, current: ["custgw", "adapters", "vault", "myid"], dot: "myid", units: { heeyid: "credentials stay in the bank" } },
  { cue: 53, part: 4, current: ["custgw", "valkey"], dot: "valkey", units: { heeyid: "attempt counters" } },
  { cue: 75, part: 4, rows: [4], current: ["mobile", "custgw", "adapters", "myid"], dot: "off", units: { heeyid: "in the bank" } },
  { cue: 81, part: 4, rows: [4], dot: "off", units: { heeyid: "in the bank" } },
];

const LIFT = { aziz: [0, 1], mobileBank: [1.4, 1], myid: [2.8, 1] } as const;
const LIFT_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "myid" }] as const;
const PHONE = { aziz: [0, 1], mobileBank: [1.4, 1], platform: [2.8, 1] } as const;
const PHONE_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }] as const;
const ONE = { mobileBank: [0.5, 1], myid: [2.5, 1] } as const;
const ONE_EDGES = [{ from: "mobileBank", to: "myid" }] as const;
const OPEN = { mobileBank: [0, 1], platform: [1.5, 1], myid: [3, 1] } as const;
const OPEN_EDGES = [{ from: "mobileBank", to: "platform" }, { from: "platform", to: "myid" }] as const;
const OTHER = { ...OPEN, someone: [1.5, 0] } as const;
const OTHER_EDGES = [...OPEN_EDGES, { from: "someone", to: "platform" }] as const;
const CAPTURE = { aziz: [0, 1.8], mobileBank: [0, 0.5], platform: [1.6, 1.2], myid: [3, 0.5] } as const;
const CAPTURE_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "myid" }, { from: "mobileBank", to: "platform" }, { from: "platform", to: "myid" }] as const;
const REPLAY = { someone: [0, 1.8], mobileBank: [0, 0.5], platform: [1.6, 1.2], myid: [3, 0.5] } as const;
const REPLAY_EDGES = [{ from: "mobileBank", to: "platform" }, { from: "someone", to: "platform" }, { from: "platform", to: "myid" }] as const;
const RESULT = { myid: [0, 1], platform: [1.5, 1], identity: [3, 1] } as const;
const RESULT_EDGES = [{ from: "myid", to: "platform" }, { from: "platform", to: "identity" }] as const;
const CONFIRM = { aziz: [0, 1], mobileBank: [1.5, 1], platform: [3, 1] } as const;
const CONFIRM_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }] as const;
const FAIL = { aziz: [0, 1], mobileBank: [1, 1], platform: [2, 1], myid: [3, 1] } as const;
const FAIL_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }, { from: "platform", to: "myid" }] as const;
const LIMITS = { mobileBank: [0, 1], platform: [1.5, 1], valkey: [3, 0.4], myid: [3, 1.7] } as const;
const LIMITS_EDGES = [{ from: "mobileBank", to: "platform" }, { from: "platform", to: "valkey" }, { from: "platform", to: "myid" }] as const;
const CLOSE = { aziz: [0, 1], mobileBank: [1.4, 1], transfer: [2.8, 1] } as const;
const CLOSE_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "transfer" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The lift: the check finished, the network did not.
  { cue: 0, layout: LIFT, edges: [...LIFT_EDGES], accent: ["aziz"] },
  { cue: 1, layout: LIFT, edges: [...LIFT_EDGES], accent: ["mobileBank"], badges: { mobileBank: "MyID screen open" } },
  { cue: 2, layout: LIFT, edges: [...LIFT_EDGES], danger: ["mobileBank"], badges: { mobileBank: "no network" } },
  { cue: 3, layout: LIFT, edges: [...LIFT_EDGES], accent: ["myid"], packets: [{ from: "myid", to: "mobileBank", label: "face ✓", stopAt: 0.5 }], badges: { myid: "check done" } },
  { cue: 4, layout: LIFT, edges: [...LIFT_EDGES], badges: { mobileBank: "passed or lost?" } },
  // The root and emulator check, in the app.
  { cue: 7, layout: PHONE, edges: [...PHONE_EDGES], accent: ["aziz"], badges: { aziz: "consent ✓" } },
  { cue: 8, layout: PHONE, edges: [...PHONE_EDGES], accent: ["mobileBank"], badges: { mobileBank: "checks the phone" } },
  { cue: 9, layout: PHONE, edges: [...PHONE_EDGES], accent: ["mobileBank"], badges: { mobileBank: "root? emulator?" } },
  { cue: 10, layout: PHONE, edges: [...PHONE_EDGES], danger: ["mobileBank"], packets: [{ from: "mobileBank", to: "platform", label: "session?", stopAt: 0.4 }], badges: { mobileBank: "rooted: no session" } },
  { cue: 11, layout: PHONE, edges: [...PHONE_EDGES], danger: ["mobileBank"], badges: { mobileBank: "not possible on this phone" } },
  { cue: 12, layout: PHONE, edges: [...PHONE_EDGES], badges: { mobileBank: "the app checks", platform: "not the platform" } },
  { cue: 13, layout: PHONE, edges: [...PHONE_EDGES], accent: ["mobileBank"], packets: [{ from: "mobileBank", to: "platform", label: "session?" }], badges: { mobileBank: "clean ✓" } },
  // Only the mobile bank holds the MyID part.
  { cue: 14, layout: ONE, edges: [...ONE_EDGES], accent: ["mobileBank"], badges: { mobileBank: "master app only" } },
  { cue: 15, layout: ONE, edges: [...ONE_EDGES], accent: ["mobileBank"], badges: { mobileBank: "MyID part" } },
  { cue: 16, layout: ONE, edges: [...ONE_EDGES], accent: ["mobileBank", "myid"], badges: { mobileBank: "one camera, one door" } },
  // The backend opens the session.
  { cue: 17, layout: OPEN, edges: [...OPEN_EDGES], accent: ["platform"], badges: { platform: "the backend opens it" } },
  { cue: 18, layout: OPEN, edges: [...OPEN_EDGES], badges: { platform: "his login?" } },
  { cue: 19, layout: OPEN, edges: [...OPEN_EDGES], accent: ["platform"], badges: { platform: "SIM match needed" } },
  { cue: 20, layout: OPEN, edges: [...OPEN_EDGES], badges: { platform: "no match: no call · not counted" } },
  { cue: 21, layout: OPEN, edges: [...OPEN_EDGES], accent: ["platform"], badges: { platform: "SIM match ✓" } },
  { cue: 22, layout: OPEN, edges: [...OPEN_EDGES], packets: [{ from: "platform", to: "myid", label: "credentials of the installation" }] },
  { cue: 23, layout: OPEN, edges: [...OPEN_EDGES], packets: [{ from: "platform", to: "myid", label: "minimum face match" }], badges: { myid: "configured minimum" } },
  { cue: 24, layout: OPEN, edges: [...OPEN_EDGES], packets: [{ from: "myid", to: "platform", label: "session id" }, { from: "platform", to: "mobileBank", label: "start the screen", delay: 55 }] },
  { cue: 25, layout: OPEN, edges: [...OPEN_EDGES], accent: ["platform"], badges: { platform: "proofing session: Open" } },
  { cue: 26, layout: OPEN, edges: [...OPEN_EDGES], accent: ["platform"], badges: { platform: "1 customer · 1 device · step-up" } },
  { cue: 27, layout: OPEN, edges: [...OPEN_EDGES], accent: ["myid"], badges: { myid: "10 min, set by MyID" } },
  { cue: 28, layout: OPEN, edges: [...OPEN_EDGES], accent: ["platform"], badges: { platform: "no second session" } },
  { cue: 29, layout: OTHER, edges: [...OTHER_EDGES], danger: ["someone"], packets: [{ from: "someone", to: "platform", label: "session?", stopAt: 0.6 }], badges: { platform: "same phone: same session" } },
  // Capture, and a one-use result code.
  { cue: 30, layout: CAPTURE, edges: [...CAPTURE_EDGES], packets: [{ from: "aziz", to: "mobileBank", label: "document + face" }, { from: "mobileBank", to: "myid", label: "capture", delay: 45 }] },
  { cue: 31, layout: CAPTURE, edges: [...CAPTURE_EDGES], accent: ["myid"], badges: { myid: "live? state records?" } },
  { cue: 32, layout: CAPTURE, edges: [...CAPTURE_EDGES], packets: [{ from: "myid", to: "mobileBank", label: "result code" }] },
  { cue: 33, layout: CAPTURE, edges: [...CAPTURE_EDGES], accent: ["mobileBank"], badges: { mobileBank: "code ≠ result" } },
  { cue: 34, layout: CAPTURE, edges: [...CAPTURE_EDGES], accent: ["mobileBank"], badges: { mobileBank: "ticket: 5 min · once" } },
  { cue: 35, layout: CAPTURE, edges: [...CAPTURE_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "result code" }] },
  { cue: 36, layout: CAPTURE, edges: [...CAPTURE_EDGES], accent: ["platform"], badges: { platform: "same device · Open · once" } },
  { cue: 37, layout: CAPTURE, edges: [...CAPTURE_EDGES], packets: [{ from: "platform", to: "myid", label: "exchange" }, { from: "myid", to: "platform", label: "result", delay: 55 }] },
  // A copied code from a different phone.
  { cue: 38, layout: REPLAY, edges: [...REPLAY_EDGES], danger: ["someone"], badges: { someone: "copied code" } },
  { cue: 39, layout: REPLAY, edges: [...REPLAY_EDGES], danger: ["someone"], packets: [{ from: "someone", to: "platform", label: "same code", stopAt: 0.7 }] },
  { cue: 40, layout: REPLAY, edges: [...REPLAY_EDGES], danger: ["someone"], crossed: ["someone"], badges: { platform: "wrong device · already used" } },
  { cue: 41, layout: REPLAY, edges: [...REPLAY_EDGES], crossed: ["someone"], badges: { platform: "security event" } },
  { cue: 42, layout: REPLAY, edges: [...REPLAY_EDGES], accent: ["platform"], badges: { platform: "code never stored" } },
  // The checks on the result.
  { cue: 43, layout: RESULT, edges: [...RESULT_EDGES], packets: [{ from: "myid", to: "platform", label: "result" }], badges: { platform: "check every field" } },
  { cue: 44, layout: RESULT, edges: [...RESULT_EDGES], badges: { platform: "number: 14 digits" } },
  { cue: 45, layout: RESULT, edges: [...RESULT_EDGES], badges: { platform: "below the minimum age = level 1, not counted" } },
  { cue: 46, layout: RESULT, edges: [...RESULT_EDGES], badges: { platform: "expired document = failure" } },
  { cue: 47, layout: RESULT, edges: [...RESULT_EDGES], badges: { platform: "below minimum = face not matched" } },
  // Failures in plain words.
  { cue: 48, layout: FAIL, edges: [...FAIL_EDGES], badges: { platform: "plain words" } },
  { cue: 49, layout: FAIL, edges: [...FAIL_EDGES], badges: { aziz: "suppose: glare" } },
  { cue: 50, layout: FAIL, edges: [...FAIL_EDGES], packets: [{ from: "myid", to: "platform", label: "reason code" }, { from: "platform", to: "mobileBank", label: "poor image", delay: 50 }] },
  { cue: 51, layout: FAIL, edges: [...FAIL_EDGES], badges: { mobileBank: "try again now" } },
  { cue: 52, layout: FAIL, edges: [...FAIL_EDGES], badges: { mobileBank: "no code · no provider name" } },
  // The limits.
  { cue: 53, layout: LIMITS, edges: [...LIMITS_EDGES], accent: ["valkey"] },
  { cue: 54, layout: LIMITS, edges: [...LIMITS_EDGES], badges: { valkey: "number · device · ID number" } },
  { cue: 55, layout: LIMITS, edges: [...LIMITS_EDGES], badges: { platform: "person or capture: counted" } },
  { cue: 56, layout: LIMITS, edges: [...LIMITS_EDGES], badges: { platform: "service: not counted" } },
  { cue: 57, layout: LIMITS, edges: [...LIMITS_EDGES], danger: ["myid"], badges: { myid: "down", mobileBank: "temporarily not available" } },
  { cue: 58, layout: LIMITS, edges: [...LIMITS_EDGES], badges: { valkey: "cool-down 1 · cool-down 2" } },
  { cue: 59, layout: LIMITS, edges: [...LIMITS_EDGES], badges: { valkey: "daily cap" } },
  { cue: 60, layout: LIMITS, edges: [...LIMITS_EDGES], badges: { valkey: "configured by the bank" } },
  { cue: 61, layout: LIMITS, edges: [...LIMITS_EDGES], badges: { platform: "reset: second operator approves" } },
  { cue: 62, layout: LIMITS, edges: [...LIMITS_EDGES], badges: { mobileBank: "new try: new yes" } },
  // The lift again: the lost code.
  { cue: 63, layout: CAPTURE, edges: [...CAPTURE_EDGES], badges: { mobileBank: "the lift" } },
  { cue: 64, layout: CAPTURE, edges: [...CAPTURE_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "ended, no code" }] },
  { cue: 65, layout: CAPTURE, edges: [...CAPTURE_EDGES], packets: [{ from: "platform", to: "myid", label: "status?" }] },
  { cue: 66, layout: CAPTURE, edges: [...CAPTURE_EDGES], accent: ["platform"], packets: [{ from: "myid", to: "platform", label: "code found" }], badges: { platform: "exchange continues" } },
  { cue: 67, layout: CAPTURE, edges: [...CAPTURE_EDGES], badges: { myid: "busy: ask after it closes" } },
  { cue: 68, layout: CAPTURE, edges: [...CAPTURE_EDGES], badges: { platform: "no code: not counted" } },
  // The result and the confirmation.
  { cue: 69, layout: RESULT, edges: [...RESULT_EDGES], accent: ["identity"], packets: [{ from: "platform", to: "identity", label: "keep" }], badges: { platform: "Succeeded" } },
  { cue: 70, layout: CONFIRM, edges: [...CONFIRM_EDGES], packets: [{ from: "platform", to: "mobileBank", label: "masked data" }], badges: { mobileBank: "names · birth · document type" } },
  { cue: 71, layout: CONFIRM, edges: [...CONFIRM_EDGES], accent: ["aziz"], packets: [{ from: "aziz", to: "mobileBank", label: "confirm" }] },
  // The check.
  { cue: 72, layout: CAPTURE, edges: [...CAPTURE_EDGES] },
  { cue: 73, layout: CAPTURE, edges: [...CAPTURE_EDGES], badges: { mobileBank: "code lost: attempt lost?" } },
  { cue: 74, layout: CAPTURE, edges: [...CAPTURE_EDGES], accent: ["platform"], badges: { platform: "status → code → continue" } },
  // The close.
  { cue: 75, layout: OPEN, edges: [...OPEN_EDGES], accent: ["mobileBank"], badges: { mobileBank: "root and emulator check" } },
  { cue: 76, layout: OPEN, edges: [...OPEN_EDGES], accent: ["platform"], badges: { platform: "opens the session" } },
  { cue: 77, layout: OPEN, edges: [...OPEN_EDGES], badges: { mobileBank: "one-use result code" } },
  { cue: 78, layout: OPEN, edges: [...OPEN_EDGES], badges: { platform: "plain words · configured limits" } },
  { cue: 79, layout: CLOSE, edges: [...CLOSE_EDGES], badges: { aziz: "level 1 still" } },
  { cue: 80, layout: CLOSE, edges: [...CLOSE_EDGES], accent: ["transfer"], badges: { transfer: "waits: phone check" } },
];
