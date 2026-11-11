import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 23: login on a known device. The question (cues 0–6); when a login is needed (7–10); the password
// first (11–23); why first (24–29); the code through TAF and the verdict (30–42); the phone's face check
// (43–49); the new grant (50–58); the close (59–67).
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 5, part: 5, rows: [5], current: ["mobile", "custgw", "taf", "keycloak"], units: UNIT },
  { cue: 14, part: 5, current: ["custgw", "postgres"], dot: "postgres", units: { heeyid: "password digest" } },
  { cue: 31, part: 5, current: ["custgw", "adapters", "taf", "sms"], dot: "taf", units: { heeyid: "code: TAF, else bank SMS" } },
  { cue: 56, part: 5, current: ["custgw", "postgres", "kafka"], dot: "kafka", units: { heeyid: "audit + antifraud event" } },
  { cue: 67, part: 5, rows: [5], dot: "off", units: UNIT },
];

const MORNING = { aziz: [0, 1], trusted: [1.5, 1], mobileBank: [3, 1] } as const;
const MORNING_EDGES = [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "mobileBank" }] as const;
const LOGIN = { aziz: [0, 1], trusted: [1, 1], platform: [2, 1], taf: [3, 0.3], keycloak: [3, 1.7] } as const;
const LOGIN_EDGES = [
  { from: "aziz", to: "trusted" }, { from: "trusted", to: "platform" }, { from: "platform", to: "taf" }, { from: "platform", to: "keycloak" },
] as const;
const PROBE = { stranger: [0, 0.4], platform: [2, 1], aziz: [0, 1.7], trusted: [1, 1.7] } as const;
const PROBE_EDGES = [{ from: "stranger", to: "platform" }, { from: "aziz", to: "trusted" }, { from: "trusted", to: "platform" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Monday morning: same phone, no session.
  { cue: 0, layout: MORNING, edges: [...MORNING_EDGES], accent: ["aziz"], badges: { aziz: "Monday, 07:00" } },
  { cue: 1, layout: MORNING, edges: [...MORNING_EDGES], badges: { mobileBank: "logged out" } },
  { cue: 2, layout: MORNING, edges: [...MORNING_EDGES], badges: { mobileBank: "bus pass" } },
  { cue: 3, layout: MORNING, edges: [...MORNING_EDGES], danger: ["mobileBank"], badges: { trusted: "same phone", mobileBank: "no session" } },
  { cue: 4, layout: MORNING, edges: [...MORNING_EDGES], badges: { trusted: "show what? in which order?" } },
  // When a login is needed.
  { cue: 7, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["platform"] },
  { cue: 8, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { platform: "logout · renewal failed" } },
  { cue: 9, layout: LOGIN, edges: [...LOGIN_EDGES], packets: [{ from: "trusted", to: "platform", label: "renew" }], badges: { trusted: "valid: renewal" } },
  { cue: 10, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { trusted: "logged out: login" } },
  // The password first.
  { cue: 11, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["aziz"], badges: { aziz: "number · password" } },
  { cue: 12, layout: LOGIN, edges: [...LOGIN_EDGES], packets: [{ from: "trusted", to: "platform", label: "number · password · device" }] },
  { cue: 13, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["platform"], badges: { platform: "1. password" } },
  { cue: 15, layout: PROBE, edges: [...PROBE_EDGES], danger: ["stranger"], packets: [{ from: "stranger", to: "platform", label: "unknown number" }], badges: { platform: "dummy check" } },
  { cue: 16, layout: PROBE, edges: [...PROBE_EDGES], badges: { platform: "same answer · same time" } },
  { cue: 17, layout: PROBE, edges: [...PROBE_EDGES], crossed: ["stranger"], badges: { stranger: "learns nothing" } },
  { cue: 18, layout: LOGIN, edges: [...LOGIN_EDGES], danger: ["trusted"], badges: { trusted: "wrong password" } },
  { cue: 19, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { platform: "count +1 · events" } },
  { cue: 20, layout: LOGIN, edges: [...LOGIN_EDGES], danger: ["platform"], badges: { platform: "locked: configured time" } },
  { cue: 21, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { platform: "lock ≠ block" } },
  { cue: 22, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { platform: "no session ends" } },
  { cue: 23, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["platform"], badges: { platform: "password ✓" } },
  // Why the password comes first.
  { cue: 24, layout: PROBE, edges: [...PROBE_EDGES], badges: { platform: "why first?" } },
  { cue: 26, layout: PROBE, edges: [...PROBE_EDGES], badges: { trusted: "a code: cost, a real phone" } },
  { cue: 27, layout: PROBE, edges: [...PROBE_EDGES], danger: ["stranger"], packets: [{ from: "platform", to: "trusted", label: "code" }, { from: "platform", to: "trusted", label: "code", delay: 35 }, { from: "platform", to: "trusted", label: "code", delay: 50 }], badges: { stranger: "only the number" } },
  { cue: 28, layout: PROBE, edges: [...PROBE_EDGES], accent: ["platform"], badges: { platform: "code after password" } },
  { cue: 29, layout: PROBE, edges: [...PROBE_EDGES], crossed: ["stranger"], packets: [{ from: "stranger", to: "platform", label: "number", stopAt: 0.5 }] },
  // The code through TAF, then the verdict.
  { cue: 30, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["taf"] },
  { cue: 32, layout: LOGIN, edges: [...LOGIN_EDGES], packets: [{ from: "platform", to: "taf", label: "send code" }, { from: "taf", to: "trusted", label: "SMS code", delay: 50 }] },
  { cue: 33, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { taf: "login · device model" } },
  { cue: 34, layout: LOGIN, edges: [...LOGIN_EDGES], danger: ["taf"], badges: { taf: "down: bank SMS" } },
  { cue: 35, layout: LOGIN, edges: [...LOGIN_EDGES], danger: ["taf"], badges: { taf: "not scored" } },
  { cue: 36, layout: LOGIN, edges: [...LOGIN_EDGES], packets: [{ from: "trusted", to: "platform", label: "code" }, { from: "platform", to: "taf", label: "verdict?", delay: 50 }] },
  { cue: 37, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["taf"], badges: { taf: "Green: continue" } },
  { cue: 38, layout: LOGIN, edges: [...LOGIN_EDGES], danger: ["taf"], badges: { taf: "Red: refused" } },
  { cue: 39, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { taf: "Yellow: MyID re-check" } },
  { cue: 40, layout: LOGIN, edges: [...LOGIN_EDGES], danger: ["trusted"], badges: { taf: "device ≠ SIM" } },
  { cue: 41, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { trusted: "mobile network, not Wi-Fi" } },
  { cue: 42, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["taf"], badges: { taf: "Green" } },
  // The phone's own face check, then the face confirmation to TAF.
  { cue: 43, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { aziz: "level 2" } },
  { cue: 44, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["trusted"], badges: { trusted: "phone's face check" } },
  { cue: 45, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { trusted: "not MyID · no level" } },
  { cue: 46, layout: LOGIN, edges: [...LOGIN_EDGES], danger: ["trusted"], badges: { trusted: "fails: login stops" } },
  { cue: 47, layout: LOGIN, edges: [...LOGIN_EDGES], packets: [{ from: "platform", to: "taf", label: "face confirmation" }], badges: { trusted: "face ✓" } },
  { cue: 48, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { trusted: "never sees the ID number" } },
  { cue: 49, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { taf: "no answer: next login" } },
  // The new grant.
  { cue: 50, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["platform"], badges: { platform: "satisfied" } },
  { cue: 51, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["keycloak"], packets: [{ from: "platform", to: "keycloak", label: "signed note" }, { from: "keycloak", to: "trusted", label: "new grant", delay: 50 }] },
  { cue: 52, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { trusted: "level 2 · Trusted" } },
  { cue: 53, layout: { ...LOGIN, myid: [2, 0] }, edges: [...LOGIN_EDGES], crossed: ["myid"], badges: { trusted: "level 2 · Trusted" } },
  { cue: 55, layout: { ...LOGIN, myid: [2, 0] }, edges: [...LOGIN_EDGES], badges: { myid: "only on Yellow" } },
  { cue: 57, layout: MORNING, edges: [...MORNING_EDGES], accent: ["mobileBank"], badges: { mobileBank: "bus pass ✓" } },
  // Recap and the open question.
  { cue: 59, layout: LOGIN, edges: [...LOGIN_EDGES] },
  { cue: 60, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["platform"], badges: { platform: "1. password" } },
  { cue: 61, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["taf"], badges: { taf: "2. code: the SIM" } },
  { cue: 62, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { taf: "3. verdict" } },
  { cue: 63, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["trusted"], badges: { trusted: "4. phone's face" } },
  { cue: 64, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["keycloak"], badges: { keycloak: "5. new grant" } },
  { cue: 65, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { trusted: "known phone" } },
  { cue: 66, layout: { aziz: [0, 1], newPhone: [1.5, 1], platform: [3, 1] }, edges: [{ from: "aziz", to: "newPhone" }, { from: "newPhone", to: "platform" }], accent: ["newPhone"], badges: { newPhone: "number ✓ · password ✓" } },
];
