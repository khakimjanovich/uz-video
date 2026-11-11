import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 30: the password reset. The SIM swap (cues 0–4); the bridge (5–6, map); the checks (7–10); MyID stops
// the stranger (11–16); the waiting reset and who cancels (17–37); the honest case (38–49); side apps (50–58);
// the trail and the close (59–72).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 5, part: 7, rows: [7], current: ["mobile", "custgw", "keycloak"], dot: "custgw", units: { heeyid: "lesson 29: change ends ranks" } },
  { cue: 6, part: 7, current: ["mobile", "custgw", "postgres"], dot: "postgres", units: { heeyid: "the reset: no session" } },
  { cue: 72, part: 7, rows: [7], dot: "off", current: ["mobile", "push"], units: { heeyid: "next: this was not me" } },
];

const SWAP = { stranger: [0, 1], newPhone: [1.4, 1], platform: [2.8, 1] } as const;
const SWAP_EDGES = [{ from: "stranger", to: "newPhone" }, { from: "newPhone", to: "platform" }] as const;
const CHECK = { stranger: [0, 1], newPhone: [1, 1], platform: [2, 1], taf: [3.1, 0.3], myid: [3.1, 1.7] } as const;
const CHECK_EDGES = [...SWAP_EDGES, { from: "platform", to: "taf" }, { from: "platform", to: "myid" }] as const;
const WAIT = { newPhone: [0, 1], passwordReset: [1.5, 1], trusted: [3, 0.3], marketWeb: [3, 1.7] } as const;
const WAIT_EDGES = [{ from: "newPhone", to: "passwordReset" }, { from: "passwordReset", to: "trusted" }, { from: "passwordReset", to: "marketWeb" }] as const;
const OP = { ...WAIT, operator: [1.5, 2.2] } as const;
const OP_EDGES = [...WAIT_EDGES, { from: "operator", to: "passwordReset" }] as const;
const HONEST = { trusted: [0, 1], passwordReset: [1.5, 1], taf: [3, 0.3], myid: [3, 1.7] } as const;
const HONEST_EDGES = [{ from: "trusted", to: "passwordReset" }, { from: "passwordReset", to: "taf" }, { from: "passwordReset", to: "myid" }] as const;
const SIDE = { marketplace: [0.4, 1], passwordReset: [1.8, 0.4], smsService: [3.1, 0.4], mobileBank: [1.8, 1.9] } as const;
const SIDE_EDGES = [{ from: "marketplace", to: "passwordReset" }, { from: "passwordReset", to: "smsService" }, { from: "marketplace", to: "mobileBank" }] as const;
const NOT_ME = { stranger: [0, 0.4], newPhone: [1.4, 0.4], platform: [2.8, 1], trusted: [1.4, 1.7], aziz: [0, 1.7] } as const;
const NOT_ME_EDGES = [...SWAP_EDGES, { from: "platform", to: "trusted" }, { from: "aziz", to: "trusted" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The SIM swap.
  { cue: 0, layout: SWAP, edges: [...SWAP_EDGES], danger: ["stranger"], badges: { stranger: "new SIM" } },
  { cue: 1, layout: SWAP, edges: [...SWAP_EDGES], danger: ["stranger"], badges: { stranger: "Aziz's number" } },
  { cue: 2, layout: SWAP, edges: [...SWAP_EDGES], danger: ["stranger"], packets: [{ from: "newPhone", to: "platform", label: "Forgot password" }] },
  { cue: 3, layout: SWAP, edges: [...SWAP_EDGES], danger: ["stranger"], badges: { newPhone: "every SMS lands here" } },
  { cue: 4, layout: SWAP, edges: [...SWAP_EDGES], danger: ["stranger"], badges: { platform: "enough?" } },
  // The checks of a login, without the password.
  { cue: 7, layout: SWAP, edges: [...SWAP_EDGES], packets: [{ from: "newPhone", to: "platform", label: "phone number" }] },
  { cue: 8, layout: SWAP, edges: [...SWAP_EDGES], accent: ["platform"], badges: { platform: "login checks, no password" } },
  { cue: 9, layout: CHECK, edges: [...CHECK_EDGES], accent: ["taf"], badges: { taf: "known phone: TAF code" } },
  { cue: 10, layout: CHECK, edges: [...CHECK_EDGES], accent: ["taf", "myid"], badges: { taf: "new phone: TAF code", myid: "account check" } },
  // MyID stops the stranger.
  { cue: 12, layout: CHECK, edges: [...CHECK_EDGES], danger: ["stranger"], packets: [{ from: "taf", to: "newPhone", label: "code" }], badges: { newPhone: "code arrives" } },
  { cue: 13, layout: CHECK, edges: [...CHECK_EDGES], danger: ["stranger"], badges: { taf: "can be green" } },
  { cue: 14, layout: CHECK, edges: [...CHECK_EDGES], accent: ["myid"], badges: { taf: "green", myid: "was level 2: MyID" } },
  { cue: 15, layout: CHECK, edges: [...CHECK_EDGES], accent: ["myid"], crossed: ["newPhone"], shake: { newPhone: 0.3 }, badges: { myid: "face ✕" } },
  { cue: 16, layout: CHECK, edges: [...CHECK_EDGES], accent: ["myid"], crossed: ["newPhone"], badges: { myid: "protects Aziz" } },
  // Never at level 2: the reset waits.
  { cue: 17, layout: CHECK, edges: [...CHECK_EDGES], danger: ["myid"], badges: { myid: "never level 2?" } },
  { cue: 18, layout: CHECK, edges: [...CHECK_EDGES], crossed: ["myid"], badges: { myid: "no face on file" } },
  { cue: 19, layout: WAIT, edges: [...WAIT_EDGES], accent: ["passwordReset"], badges: { passwordReset: "time" } },
  { cue: 20, layout: WAIT, edges: [...WAIT_EDGES], accent: ["passwordReset"], badges: { trusted: "active session", passwordReset: "not at once" } },
  { cue: 21, layout: WAIT, edges: [...WAIT_EDGES], accent: ["passwordReset"], badges: { passwordReset: "configured wait" } },
  { cue: 22, layout: WAIT, edges: [...WAIT_EDGES], packets: [{ from: "passwordReset", to: "newPhone", label: "ends at …" }] },
  { cue: 23, layout: WAIT, edges: [...WAIT_EDGES], packets: [{ from: "passwordReset", to: "trusted", label: "reset requested" }, { from: "passwordReset", to: "marketWeb", label: "reset requested", delay: 30 }], badges: { passwordReset: "push + SMS" } },
  { cue: 24, layout: WAIT, edges: [...WAIT_EDGES], accent: ["trusted"], badges: { trusted: "the owner sees it" } },
  // Who can cancel.
  { cue: 25, layout: OP, edges: [...OP_EDGES], badges: { passwordReset: "who can cancel?" } },
  { cue: 26, layout: OP, edges: [...OP_EDGES], accent: ["trusted"], badges: { trusted: "rank 2: Cancel" } },
  { cue: 27, layout: OP, edges: [...OP_EDGES], accent: ["trusted", "operator"], badges: { trusted: "rank 2: Cancel", operator: "with a reason" } },
  { cue: 28, layout: OP, edges: [...OP_EDGES], badges: { trusted: "rank 2: Cancel", marketWeb: "rank 1: no button" } },
  { cue: 30, layout: OP, edges: [...OP_EDGES], accent: ["trusted"], badges: { passwordReset: "strongest check only" } },
  { cue: 31, layout: WAIT, edges: [...WAIT_EDGES], accent: ["trusted"], crossed: ["passwordReset"], packets: [{ from: "trusted", to: "passwordReset", label: "Cancel" }], badges: { trusted: "old password stays" } },
  { cue: 32, layout: WAIT, edges: [...WAIT_EDGES], badges: { passwordReset: "wait ends" } },
  { cue: 33, layout: WAIT, edges: [...WAIT_EDGES], accent: ["newPhone"], badges: { newPhone: "new password · session" } },
  { cue: 34, layout: WAIT, edges: [...WAIT_EDGES], crossed: ["marketWeb"], badges: { marketWeb: "same or lower: ends", newPhone: "probation" } },
  { cue: 35, layout: WAIT, edges: [...WAIT_EDGES], packets: [{ from: "passwordReset", to: "trusted", label: "password changed" }] },
  { cue: 36, layout: SWAP, edges: [...SWAP_EDGES], danger: ["stranger"], badges: { platform: "rule against SIM swap" } },
  { cue: 37, layout: WAIT, edges: [...WAIT_EDGES], accent: ["trusted"], badges: { newPhone: "SMS code alone", trusted: "still in use" } },
  // The honest case: TAF and MyID make it immediate.
  { cue: 39, layout: HONEST, edges: [...HONEST_EDGES], accent: ["trusted"], badges: { trusted: "forgot it" } },
  { cue: 40, layout: HONEST, edges: [...HONEST_EDGES], accent: ["taf"], packets: [{ from: "taf", to: "trusted", label: "code" }], badges: { taf: "green" } },
  { cue: 41, layout: HONEST, edges: [...HONEST_EDGES], accent: ["myid"], badges: { taf: "green", myid: "offered" } },
  { cue: 42, layout: HONEST, edges: [...HONEST_EDGES], accent: ["myid"], badges: { taf: "green", myid: "re-check ✓" } },
  { cue: 43, layout: HONEST, edges: [...HONEST_EDGES], accent: ["passwordReset"], badges: { taf: "green", myid: "re-check ✓", passwordReset: "no wait" } },
  { cue: 44, layout: HONEST, edges: [...HONEST_EDGES], packets: [{ from: "trusted", to: "passwordReset", label: "new password ×2" }], badges: { passwordReset: "no wait" } },
  { cue: 46, layout: HONEST, edges: [...HONEST_EDGES], accent: ["taf", "myid"], badges: { taf: "prove the SIM", myid: "prove the face" } },
  { cue: 47, layout: HONEST, edges: [...HONEST_EDGES], accent: ["myid"], badges: { myid: "never level 2: full check" } },
  { cue: 48, layout: HONEST, edges: [...HONEST_EDGES], crossed: ["myid"], badges: { passwordReset: "waits" } },
  { cue: 49, layout: { newPhone: [0.5, 1], passwordReset: [2.5, 1] }, edges: [{ from: "newPhone", to: "passwordReset" }], accent: ["passwordReset"], badges: { newPhone: "no active session", passwordReset: "no wait" } },
  // Side apps: the SMS reset.
  { cue: 50, layout: SIDE, edges: [...SIDE_EDGES], accent: ["marketplace"] },
  { cue: 51, layout: SIDE, edges: [...SIDE_EDGES], badges: { marketplace: "no TAF · no MyID" } },
  { cue: 52, layout: SIDE, edges: [...SIDE_EDGES], accent: ["smsService"], packets: [{ from: "passwordReset", to: "smsService", label: "SMS code" }] },
  { cue: 53, layout: SIDE, edges: [...SIDE_EDGES], badges: { marketplace: "no master app · never level 2" } },
  { cue: 54, layout: SIDE, edges: [...SIDE_EDGES], accent: ["mobileBank"], packets: [{ from: "marketplace", to: "mobileBank", label: "reset here" }] },
  { cue: 55, layout: SIDE, edges: [...SIDE_EDGES], badges: { passwordReset: "per day · cool-down" } },
  { cue: 56, layout: SIDE, edges: [...SIDE_EDGES], badges: { passwordReset: "still waits" } },
  { cue: 57, layout: SIDE, edges: [...SIDE_EDGES], danger: ["marketplace"], badges: { marketplace: "SIM swap risk" } },
  { cue: 58, layout: SIDE, edges: [...SIDE_EDGES], danger: ["marketplace"], badges: { marketplace: "accepted, written down" } },
  // The trail.
  { cue: 59, layout: OP, edges: [...OP_EDGES], accent: ["passwordReset"] },
  { cue: 60, layout: OP, edges: [...OP_EDGES], badges: { passwordReset: "audit · antifraud · notify" } },
  { cue: 61, layout: OP, edges: [...OP_EDGES], badges: { passwordReset: "counted" } },
  { cue: 62, layout: OP, edges: [...OP_EDGES], accent: ["operator"], badges: { operator: "cancel or approve · reason" } },
  // Recap and the next door.
  { cue: 63, layout: CHECK, edges: [...CHECK_EDGES], badges: { platform: "login checks, no password" } },
  { cue: 64, layout: WAIT, edges: [...WAIT_EDGES], accent: ["trusted"], badges: { passwordReset: "waits", trusted: "rank 2: Cancel" } },
  { cue: 65, layout: HONEST, edges: [...HONEST_EDGES], accent: ["taf", "myid"], badges: { passwordReset: "immediate" } },
  { cue: 66, layout: SIDE, edges: [...SIDE_EDGES], badges: { marketplace: "SMS reset: narrow" } },
  { cue: 67, layout: NOT_ME, edges: [...NOT_ME_EDGES], danger: ["stranger"] },
  { cue: 69, layout: NOT_ME, edges: [...NOT_ME_EDGES], danger: ["stranger"], packets: [{ from: "newPhone", to: "platform", label: "guessed password" }] },
  { cue: 70, layout: NOT_ME, edges: [...NOT_ME_EDGES], accent: ["trusted"], packets: [{ from: "platform", to: "trusted", label: "login request" }], badges: { trusted: "Approve · This was not me" } },
  { cue: 71, layout: NOT_ME, edges: [...NOT_ME_EDGES], accent: ["trusted"], badges: { trusted: "This was not me → ?" } },
];
