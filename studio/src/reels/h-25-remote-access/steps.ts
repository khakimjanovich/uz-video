import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 25: the remote-access event. The call (cues 0–7); every check passes (8–16); the master app watches
// (17–25); the event (26–29); what the platform does and does not do (30–36); why not block (37–49);
// the end of the call (50–54); the module recap (55–60); the close (61–68).
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 6, part: 5, rows: [5], current: ["mobile", "custgw", "kafka"], units: UNIT },
  { cue: 17, part: 5, current: ["mobile"], dot: "mobile", units: { heeyid: "the guard is on the phone" } },
  { cue: 26, part: 5, current: ["mobile", "edge", "custgw"], dot: "custgw", units: { heeyid: "remote-access event" } },
  { cue: 31, part: 5, current: ["custgw", "postgres", "kafka"], dot: "kafka", units: { heeyid: "audit + antifraud event" } },
  { cue: 55, part: 5, rows: [5], dot: "off", units: UNIT },
  { cue: 68, part: 5, rows: [5, 6], dot: "off", units: UNIT },
];

const CALL = { scamCaller: [0, 0.3], aziz: [0, 1.7], trusted: [1.5, 1.7], mobileBank: [3, 1.7] } as const;
const CALL_EDGES = [{ from: "scamCaller", to: "aziz", label: "phone call" }, { from: "aziz", to: "trusted" }, { from: "trusted", to: "mobileBank" }] as const;
const CHECKS = { scamCaller: [0, 0.3], aziz: [0, 1.7], trusted: [1.3, 1.7], platform: [3, 1] } as const;
const CHECK_EDGES = [{ from: "scamCaller", to: "aziz" }, { from: "aziz", to: "trusted" }, { from: "trusted", to: "platform" }] as const;
const GUARD = { scamCaller: [0, 0.3], mobileBank: [1.4, 1], marketplace: [1.4, 2], platform: [3, 1] } as const;
const GUARD_EDGES = [{ from: "scamCaller", to: "mobileBank", label: "screen sharing" }, { from: "mobileBank", to: "platform" }] as const;
const EVENT = { mobileBank: [0, 1], platform: [1.5, 1], antifraud: [3, 1] } as const;
const EVENT_EDGES = [{ from: "mobileBank", to: "platform" }, { from: "platform", to: "antifraud" }] as const;
const MODULE = { trusted: [0, 1], keycloak: [1, 0.2], credit: [1, 1.8], platform: [2, 1], newPhone: [3, 0.2], mobileBank: [3, 1.8] } as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // A calm voice on the phone asks Aziz to install one small app.
  { cue: 0, layout: { aziz: [0, 1.7], trusted: [1.5, 1.7] }, edges: [{ from: "aziz", to: "trusted" }], badges: { aziz: "Thursday, 16:30" } },
  { cue: 1, layout: CALL, edges: [...CALL_EDGES], danger: ["scamCaller"], badges: { scamCaller: "\"the bank's security\"" } },
  { cue: 2, layout: CALL, edges: [...CALL_EDGES], danger: ["scamCaller"], badges: { scamCaller: "install this app" } },
  { cue: 3, layout: CALL, edges: [...CALL_EDGES], danger: ["scamCaller"], badges: { trusted: "screen shared" } },
  { cue: 4, layout: CALL, edges: [...CALL_EDGES], accent: ["trusted"], badges: { trusted: "Trusted · valid · his face" } },
  { cue: 5, layout: CALL, edges: [...CALL_EDGES], danger: ["scamCaller"], badges: { mobileBank: "what can go wrong?" } },
  // Every check passes: the request is real.
  { cue: 8, layout: CHECKS, edges: [...CHECK_EDGES], accent: ["platform"] },
  { cue: 9, layout: CHECKS, edges: [...CHECK_EDGES], badges: { trusted: "Trusted ✓" } },
  { cue: 10, layout: CHECKS, edges: [...CHECK_EDGES], badges: { trusted: "grant ✓" } },
  { cue: 11, layout: CHECKS, edges: [...CHECK_EDGES], packets: [{ from: "trusted", to: "platform", label: "real device" }], badges: { platform: "binding ✓" } },
  { cue: 12, layout: CHECKS, edges: [...CHECK_EDGES], badges: { aziz: "face ✓" } },
  { cue: 13, layout: CHECKS, edges: [...CHECK_EDGES], accent: ["platform"], badges: { platform: "all perfect" } },
  { cue: 14, layout: CHECKS, edges: [...CHECK_EDGES], badges: { platform: "request: fine" } },
  { cue: 15, layout: CHECKS, edges: [...CHECK_EDGES], danger: ["scamCaller"], shake: { scamCaller: 0.4 }, badges: { scamCaller: "the hands" } },
  { cue: 16, layout: CHECKS, edges: [...CHECK_EDGES], accent: ["trusted"], badges: { trusted: "guard: here", platform: "not here" } },
  // The master app watches; side apps do not.
  { cue: 18, layout: GUARD, edges: [...GUARD_EDGES], accent: ["mobileBank"], badges: { mobileBank: "remote access · calls" } },
  { cue: 19, layout: GUARD, edges: [...GUARD_EDGES], badges: { mobileBank: "master app only" } },
  { cue: 20, layout: GUARD, edges: [...GUARD_EDGES], badges: { mobileBank: "moves money: self-protection" } },
  { cue: 21, layout: GUARD, edges: [...GUARD_EDGES], badges: { marketplace: "no detection" } },
  { cue: 22, layout: GUARD, edges: [...GUARD_EDGES], danger: ["scamCaller"], packets: [{ from: "scamCaller", to: "mobileBank", label: "screen sharing" }] },
  { cue: 23, layout: GUARD, edges: [...GUARD_EDGES], accent: ["mobileBank"], shake: { mobileBank: 0.3 }, badges: { mobileBank: "found it" } },
  { cue: 24, layout: GUARD, edges: [...GUARD_EDGES], accent: ["mobileBank"], badges: { mobileBank: "screen blocked" } },
  { cue: 25, layout: GUARD, edges: [...GUARD_EDGES], crossed: ["scamCaller"], badges: { mobileBank: "screen blocked" } },
  // The event: device, time, type.
  { cue: 27, layout: EVENT, edges: [...EVENT_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "remote-access event" }] },
  { cue: 28, layout: EVENT, edges: [...EVENT_EDGES], badges: { platform: "device · time · type" } },
  { cue: 29, layout: EVENT, edges: [...EVENT_EDGES], badges: { platform: "software or phone call" } },
  // What the platform does, and does not do.
  { cue: 30, layout: EVENT, edges: [...EVENT_EDGES], accent: ["platform"] },
  { cue: 32, layout: EVENT, edges: [...EVENT_EDGES], accent: ["antifraud"], packets: [{ from: "platform", to: "antifraud", label: "event" }], badges: { platform: "audit event" } },
  { cue: 33, layout: EVENT, edges: [...EVENT_EDGES], badges: { platform: "that is all" } },
  { cue: 34, layout: EVENT, edges: [...EVENT_EDGES], badges: { platform: "no block" } },
  { cue: 35, layout: EVENT, edges: [...EVENT_EDGES], badges: { platform: "record · device · grant: same" } },
  { cue: 36, layout: CHECKS, edges: [...CHECK_EDGES], accent: ["trusted"], badges: { trusted: "Trusted · valid" } },
  // Why not block: a call is not a crime.
  { cue: 37, layout: EVENT, edges: [...EVENT_EDGES], badges: { platform: "too soft?" } },
  { cue: 38, layout: CALL, edges: [...CALL_EDGES], danger: ["scamCaller"], badges: { mobileBank: "lock everything?" } },
  { cue: 40, layout: { aziz: [0, 1], trusted: [1.5, 1] }, edges: [{ from: "aziz", to: "trusted", label: "phone call" }], badges: { trusted: "a call ≠ a crime" } },
  { cue: 41, layout: { aziz: [0, 1], trusted: [1.5, 1] }, edges: [{ from: "aziz", to: "trusted", label: "phone call" }], badges: { aziz: "calls his mother" } },
  { cue: 42, layout: { aziz: [0, 1], trusted: [1.5, 1] }, edges: [{ from: "aziz", to: "trusted" }], danger: ["aziz"], badges: { aziz: "locked out?" } },
  { cue: 43, layout: CALL, edges: [...CALL_EDGES], danger: ["scamCaller"], badges: { aziz: "not his fault" } },
  { cue: 44, layout: EVENT, edges: [...EVENT_EDGES], accent: ["mobileBank", "platform", "antifraud"] },
  { cue: 45, layout: EVENT, edges: [...EVENT_EDGES], accent: ["mobileBank"], badges: { mobileBank: "protects the screen" } },
  { cue: 46, layout: EVENT, edges: [...EVENT_EDGES], accent: ["platform"], badges: { platform: "honest record" } },
  { cue: 47, layout: EVENT, edges: [...EVENT_EDGES], accent: ["antifraud"], badges: { antifraud: "sees the pattern" } },
  { cue: 48, layout: EVENT, edges: [...EVENT_EDGES], badges: { antifraud: "events only" } },
  { cue: 49, layout: EVENT, edges: [...EVENT_EDGES], badges: { platform: "never waits" } },
  // The end of the call.
  { cue: 50, layout: CALL, edges: [...CALL_EDGES], badges: { mobileBank: "screen blocked" } },
  { cue: 51, layout: CALL, edges: [...CALL_EDGES], danger: ["scamCaller"], badges: { scamCaller: "angry" } },
  { cue: 53, layout: { scamCaller: [0, 0.3], aziz: [0, 1.7], trusted: [1.5, 1.7], mobileBank: [3, 1.7] }, edges: [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "mobileBank" }], crossed: ["scamCaller"], badges: { aziz: "hangs up" } },
  { cue: 54, layout: { aziz: [0, 1.7], trusted: [1.5, 1.7], mobileBank: [3, 1.7] }, edges: [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "mobileBank" }], accent: ["mobileBank"], badges: { mobileBank: "the real bank" } },
  // Module 5 in one picture.
  { cue: 56, layout: MODULE, accent: ["trusted"], badges: { trusted: "20: record" } },
  { cue: 57, layout: MODULE, accent: ["keycloak"], badges: { trusted: "20: record", keycloak: "21: grant" } },
  { cue: 58, layout: MODULE, accent: ["credit"], badges: { trusted: "20: record", keycloak: "21: grant", credit: "22: step-up" } },
  { cue: 59, layout: MODULE, accent: ["platform", "newPhone"], badges: { trusted: "20: record", keycloak: "21: grant", credit: "22: step-up", platform: "23: known", newPhone: "24: new" } },
  { cue: 60, layout: MODULE, accent: ["mobileBank"], badges: { trusted: "20: record", keycloak: "21: grant", credit: "22: step-up", platform: "23: known", newPhone: "24: new", mobileBank: "25: the hands" } },
  // Recap and the open question.
  { cue: 61, layout: EVENT, edges: [...EVENT_EDGES] },
  { cue: 62, layout: EVENT, edges: [...EVENT_EDGES], accent: ["mobileBank"], badges: { mobileBank: "detects" } },
  { cue: 63, layout: EVENT, edges: [...EVENT_EDGES], badges: { mobileBank: "blocks its screen" } },
  { cue: 64, layout: EVENT, edges: [...EVENT_EDGES], accent: ["platform"], badges: { platform: "records · forwards" } },
  { cue: 65, layout: { aziz: [0, 1], marketplace: [1.5, 1], platform: [3, 1] }, edges: [{ from: "aziz", to: "marketplace" }, { from: "marketplace", to: "platform" }], accent: ["marketplace"] },
  { cue: 66, layout: { aziz: [0, 1], marketplace: [1.5, 1], platform: [3, 1] }, edges: [{ from: "aziz", to: "marketplace" }, { from: "marketplace", to: "platform" }], badges: { marketplace: "no MyID · no TAF · no guard" } },
  { cue: 67, layout: { aziz: [0, 1], marketplace: [1.5, 0.3], mobileBank: [1.5, 1.7], platform: [3, 1] }, edges: [{ from: "aziz", to: "marketplace" }, { from: "marketplace", to: "platform" }, { from: "mobileBank", to: "platform" }], accent: ["mobileBank"], badges: { marketplace: "web login?", mobileBank: "vouches?" } },
];
