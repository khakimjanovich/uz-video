import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 27: the account link. Two doors (cues 0–4); the bridge (5–6, map); why the mark (7–10); the same
// number in the mobile bank and the TAF check (11–19); the question and Yes (20–28); No, then Continue (29–48);
// the reset when the password is not his (49–60); the trail and the close (61–72).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 5, part: 6, rows: [6], current: ["sideapps", "sms"], dot: "sideapps", units: { heeyid: "lesson 26: not confirmed" } },
  { cue: 6, part: 6, current: ["mobile", "taf"], dot: "taf", units: { heeyid: "after the TAF check" } },
  { cue: 72, part: 6, rows: [6], dot: "off", current: ["sideapps", "mobile"], units: { heeyid: "next: address sharing" } },
];

const DOORS = { marketWeb: [0.3, 0.4], mobileBank: [0.3, 1.7], platform: [2.2, 1] } as const;
const DOOR_EDGES = [{ from: "marketWeb", to: "platform" }, { from: "mobileBank", to: "platform" }] as const;
const TAF = { ...DOORS, taf: [3.1, 1.7] } as const;
const TAF_EDGES = [...DOOR_EDGES, { from: "platform", to: "taf" }] as const;
const NO = { someone: [0, 0.4], marketWeb: [1.3, 0.4], mobileBank: [1.3, 1.7], platform: [2.8, 1] } as const;
const NO_EDGES = [{ from: "someone", to: "marketWeb" }, ...DOOR_EDGES] as const;
const REOPEN = { ...NO, operator: [2.8, 2.2] } as const;
const RESET = { mobileBank: [0, 1], passwordReset: [1.4, 1], taf: [2.8, 0.4], myid: [2.8, 1.7] } as const;
const RESET_EDGES = [{ from: "mobileBank", to: "passwordReset" }, { from: "passwordReset", to: "taf" }, { from: "passwordReset", to: "myid" }] as const;
const RANK = { mobileBank: [0.3, 1.7], marketWeb: [0.3, 0.4], platform: [2.2, 1], someone: [3.1, 0.4] } as const;
const RANK_EDGES = [...DOOR_EDGES, { from: "someone", to: "marketWeb" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Two doors for one number.
  { cue: 0, layout: { aziz: [0, 1], marketWeb: [2, 1] }, edges: [{ from: "aziz", to: "marketWeb" }], accent: ["marketWeb"], badges: { marketWeb: "last spring" } },
  { cue: 1, layout: { aziz: [0, 1], marketWeb: [2, 1] }, edges: [{ from: "aziz", to: "marketWeb" }], packets: [{ from: "aziz", to: "marketWeb", label: "SMS code + password" }] },
  { cue: 2, layout: { aziz: [0, 1], marketWeb: [2, 0.4], mobileBank: [2, 1.7] }, edges: [{ from: "aziz", to: "marketWeb" }, { from: "aziz", to: "mobileBank" }], accent: ["mobileBank"], badges: { mobileBank: "first time" } },
  { cue: 3, layout: DOORS, edges: [...DOOR_EDGES], badges: { marketWeb: "SMS only", mobileBank: "checks the SIM" } },
  { cue: 4, layout: DOORS, edges: [...DOOR_EDGES], danger: ["marketWeb"], badges: { marketWeb: "trust it?" } },
  // Why the mark exists.
  { cue: 7, layout: DOORS, edges: [...DOOR_EDGES], danger: ["marketWeb"], badges: { marketWeb: "not confirmed" } },
  { cue: 8, layout: DOORS, edges: [...DOOR_EDGES], danger: ["marketWeb"], badges: { marketWeb: "someone read an SMS" } },
  { cue: 9, layout: DOORS, edges: [...DOOR_EDGES], danger: ["marketWeb"], badges: { marketWeb: "phone? SIM? who?" } },
  { cue: 10, layout: { ...DOORS, taf: [3.1, 0.4] }, edges: [...DOOR_EDGES], crossed: ["taf"], badges: { taf: "not in a browser" } },
  // The same number arrives in the mobile bank.
  { cue: 11, layout: DOORS, edges: [...DOOR_EDGES], accent: ["mobileBank"], packets: [{ from: "mobileBank", to: "platform", label: "phone number" }] },
  { cue: 12, layout: DOORS, edges: [...DOOR_EDGES], accent: ["platform"], badges: { platform: "number known" } },
  { cue: 13, layout: DOORS, edges: [...DOOR_EDGES], badges: { platform: "one customer" } },
  { cue: 14, layout: DOORS, edges: [...DOOR_EDGES], badges: { mobileBank: "same password" } },
  { cue: 15, layout: DOORS, edges: [...DOOR_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "password" }] },
  { cue: 16, layout: TAF, edges: [...TAF_EDGES], accent: ["taf"], packets: [{ from: "taf", to: "mobileBank", label: "one-time code" }] },
  { cue: 17, layout: TAF, edges: [...TAF_EDGES], accent: ["taf"], badges: { taf: "green" } },
  { cue: 18, layout: TAF, edges: [...TAF_EDGES], badges: { taf: "green", platform: "now look" } },
  { cue: 19, layout: TAF, edges: [...TAF_EDGES], danger: ["marketWeb"], badges: { marketWeb: "not confirmed" } },
  // The question, and Yes.
  { cue: 20, layout: DOORS, edges: [...DOOR_EDGES], accent: ["mobileBank"], badges: { mobileBank: "one question" } },
  { cue: 21, layout: DOORS, edges: [...DOOR_EDGES], accent: ["mobileBank"], badges: { mobileBank: "Is it yours? Link it?" } },
  { cue: 24, layout: DOORS, edges: [...DOOR_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "Yes" }], badges: { mobileBank: "Yes" } },
  { cue: 25, layout: DOORS, edges: [...DOOR_EDGES], accent: ["marketWeb"], badges: { marketWeb: "stays" } },
  { cue: 26, layout: DOORS, edges: [...DOOR_EDGES], accent: ["marketWeb"], badges: { marketWeb: "linked · via mobile bank" } },
  { cue: 27, layout: DOORS, edges: [...DOOR_EDGES], accent: ["marketWeb", "mobileBank"], badges: { platform: "level of the person", marketWeb: "same level" } },
  // No: someone else made the web account.
  { cue: 29, layout: NO, edges: [...NO_EDGES], danger: ["someone"], badges: { mobileBank: "Aziz" } },
  { cue: 30, layout: NO, edges: [...NO_EDGES], danger: ["someone"], packets: [{ from: "someone", to: "marketWeb", label: "Aziz's number" }] },
  { cue: 31, layout: NO, edges: [...NO_EDGES], danger: ["someone"], badges: { someone: "SMS code + password" } },
  { cue: 32, layout: NO, edges: [...NO_EDGES], danger: ["someone"], packets: [{ from: "mobileBank", to: "platform", label: "No" }], badges: { mobileBank: "No" } },
  { cue: 33, layout: NO, edges: [...NO_EDGES], badges: { mobileBank: "not yet" } },
  { cue: 34, layout: NO, edges: [...NO_EDGES], accent: ["mobileBank"], badges: { mobileBank: "ends sessions · closes · Continue?" } },
  { cue: 36, layout: NO, edges: [...NO_EDGES], accent: ["mobileBank"], badges: { mobileBank: "Back · Continue" } },
  { cue: 37, layout: NO, edges: [...NO_EDGES], badges: { mobileBank: "Back: no change" } },
  { cue: 38, layout: NO, edges: [...NO_EDGES], accent: ["mobileBank"], badges: { mobileBank: "asked twice" } },
  { cue: 40, layout: NO, edges: [...NO_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "Continue" }] },
  { cue: 41, layout: NO, edges: [...NO_EDGES], crossed: ["marketWeb"], shake: { marketWeb: 0.3 }, badges: { marketWeb: "all sessions end" } },
  { cue: 42, layout: NO, edges: [...NO_EDGES], crossed: ["marketWeb"], badges: { marketWeb: "closed" } },
  { cue: 43, layout: NO, edges: [...NO_EDGES], crossed: ["marketWeb"], badges: { marketWeb: "closed, not deleted" } },
  { cue: 44, layout: REOPEN, edges: [...NO_EDGES, { from: "operator", to: "platform" }], accent: ["operator"], badges: { operator: "reopen, with a reason" } },
  { cue: 45, layout: NO, edges: [...NO_EDGES], badges: { marketWeb: "next login: new account" } },
  { cue: 46, layout: NO, edges: [...NO_EDGES], accent: ["mobileBank"], badges: { mobileBank: "change password now" } },
  { cue: 48, layout: NO, edges: [...NO_EDGES], danger: ["someone"], badges: { someone: "may know it" } },
  // The password is not his: the reset with TAF and MyID.
  { cue: 50, layout: NO, edges: [...NO_EDGES], danger: ["someone"], badges: { someone: "his password", mobileBank: "Aziz: does not know it" } },
  { cue: 51, layout: NO, edges: [...NO_EDGES], crossed: ["mobileBank"], badges: { mobileBank: "stuck at step 1" } },
  { cue: 53, layout: RESET, edges: [...RESET_EDGES], accent: ["passwordReset"] },
  { cue: 54, layout: RESET, edges: [...RESET_EDGES], accent: ["taf", "myid"], badges: { taf: "same TAF check", myid: "offered" } },
  { cue: 55, layout: RESET, edges: [...RESET_EDGES], accent: ["myid"], badges: { myid: "full check · consent" } },
  { cue: 56, layout: RESET, edges: [...RESET_EDGES], accent: ["passwordReset"], badges: { passwordReset: "does not wait", taf: "green", myid: "MyID ✓" } },
  { cue: 58, layout: RANK, edges: [...RANK_EDGES], accent: ["mobileBank"], badges: { mobileBank: "outranks", marketWeb: "lower" } },
  { cue: 59, layout: RANK, edges: [...RANK_EDGES], crossed: ["marketWeb"], danger: ["someone"], shake: { marketWeb: 0.3 }, badges: { marketWeb: "sessions end" } },
  // The trail and the recap.
  { cue: 61, layout: DOORS, edges: [...DOOR_EDGES], accent: ["platform"], badges: { platform: "audit + antifraud event" } },
  { cue: 63, layout: DOORS, edges: [...DOOR_EDGES], danger: ["marketWeb"], badges: { marketWeb: "not confirmed" } },
  { cue: 64, layout: TAF, edges: [...TAF_EDGES], badges: { taf: "code + green", mobileBank: "one question" } },
  { cue: 65, layout: DOORS, edges: [...DOOR_EDGES], accent: ["marketWeb"], badges: { marketWeb: "Yes: linked" } },
  { cue: 66, layout: DOORS, edges: [...DOOR_EDGES], crossed: ["marketWeb"], badges: { marketWeb: "No: closed", mobileBank: "new password" } },
  // Next: the address.
  { cue: 67, layout: DOORS, edges: [...DOOR_EDGES], accent: ["marketWeb"], badges: { marketWeb: "linked", mobileBank: "level 2" } },
  { cue: 69, layout: { marketplace: [0, 1], platform: [1.5, 1], address: [3, 1] }, edges: [{ from: "marketplace", to: "platform" }, { from: "platform", to: "address" }], accent: ["marketplace"], badges: { marketplace: "delivery" } },
  { cue: 70, layout: { marketplace: [0, 1], platform: [1.5, 1], address: [3, 1] }, edges: [{ from: "marketplace", to: "platform" }, { from: "platform", to: "address" }], accent: ["address"] },
  { cue: 71, layout: { marketplace: [0, 1], platform: [1.5, 1], address: [3, 1] }, edges: [{ from: "marketplace", to: "platform" }, { from: "platform", to: "address" }], danger: ["marketplace"], badges: { marketplace: "just read it?" } },
];
