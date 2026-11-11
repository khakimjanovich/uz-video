import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 35: notifications. The push in the phoneThief's pocket (0–5); the roads and the codes (6–15); the outbox
// (16–23); security notifications and the number on hold (24–31); what a message may say, push by pull
// (32–43); templates (44–47); the close and the open question (48–53).
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 8, rows: [3, 6], current: ["mobile", "sideapps", "taf", "sms"], dot: "taf", units: { heeyid: "lesson 12: TAF · lesson 26: bank SMS" } },
  { cue: 5, part: 8, rows: [8], current: ["kafka", "workers", "adapters", "sms", "push"], dot: "kafka", units: { heeyid: "every message" } },
  { cue: 19, part: 8, rows: [8], current: ["kafka", "workers", "adapters", "sms", "push"], dot: "workers", units: { heeyid: "relay → Kafka → worker" } },
  { cue: 42, part: 8, rows: [8], current: ["perimeter", "push"], dot: "push", units: { heeyid: "push: outside, no personal data" } },
  { cue: 53, part: 8, rows: [8], dot: "off", units: UNIT },
];

const POCKET = { phoneThief: [0.3, 1], trusted: [1.7, 1], platform: [3, 1] } as const;
const POCKET_EDGES = [{ from: "phoneThief", to: "trusted" }, { from: "platform", to: "trusted" }] as const;
const ROADS = { platform: [0, 1], smsService: [1.6, 0.3], pushService: [1.6, 1.7], aziz: [3.2, 1] } as const;
const ROADS_EDGES = [{ from: "platform", to: "smsService" }, { from: "platform", to: "pushService" }, { from: "smsService", to: "aziz" }, { from: "pushService", to: "aziz" }] as const;
const CODES = { taf: [0, 0.3], smsService: [0, 1.7], mobileBank: [2.4, 0.3], marketplace: [2.4, 1.7] } as const;
const OUTBOX = { platform: [0, 1], outbox: [1, 1], kafka: [2, 1], workers: [3, 1], smsService: [3, 0], pushService: [3, 2] } as const;
const OUTBOX_EDGES = [{ from: "platform", to: "outbox" }, { from: "outbox", to: "kafka" }, { from: "kafka", to: "workers" }, { from: "workers", to: "smsService" }, { from: "workers", to: "pushService" }] as const;
const SESSION = { marketplace: [0, 1], platform: [1.5, 1], mobileBank: [3, 0.3], trusted: [3, 1.7] } as const;
const SESSION_EDGES = [{ from: "marketplace", to: "platform" }, { from: "platform", to: "mobileBank" }, { from: "platform", to: "trusted" }] as const;
const HOLD = { platform: [0, 1], pushService: [1.6, 0.3], smsService: [1.6, 1.7], trusted: [3, 0.3], stranger: [3, 1.7] } as const;
const HOLD_EDGES = [{ from: "platform", to: "pushService" }, { from: "pushService", to: "trusted" }, { from: "platform", to: "smsService" }, { from: "smsService", to: "stranger", broken: true }] as const;
const PULL = { platform: [0, 1], pushService: [1.5, 0.3], trusted: [3, 1] } as const;
const PULL_EDGES = [{ from: "platform", to: "pushService" }, { from: "pushService", to: "trusted" }, { from: "trusted", to: "platform" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // One in the morning: a push that says nothing.
  { cue: 0, layout: POCKET, edges: [...POCKET_EDGES], danger: ["phoneThief"], badges: { trusted: "stolen" } },
  { cue: 1, layout: POCKET, edges: [...POCKET_EDGES], packets: [{ from: "platform", to: "trusted", label: "push" }] },
  { cue: 2, layout: POCKET, edges: [...POCKET_EDGES], danger: ["phoneThief"], badges: { trusted: "nothing to read" } },
  { cue: 3, layout: POCKET, edges: [...POCKET_EDGES], badges: { platform: "little, on purpose" } },
  // The roads: the bank's SMS service and the push service.
  { cue: 6, layout: ROADS, edges: [...ROADS_EDGES] },
  { cue: 7, layout: ROADS, edges: [...ROADS_EDGES], badges: { platform: "no messaging contract" } },
  { cue: 8, layout: ROADS, edges: [...ROADS_EDGES], accent: ["smsService", "pushService"], packets: [{ from: "platform", to: "smsService", label: "SMS" }, { from: "platform", to: "pushService", label: "push", delay: 40 }], badges: { pushService: "bank's Firebase project" } },
  { cue: 9, layout: CODES, edges: [{ from: "taf", to: "mobileBank" }, { from: "smsService", to: "marketplace" }] },
  { cue: 10, layout: CODES, edges: [{ from: "taf", to: "mobileBank" }, { from: "smsService", to: "mobileBank", label: "only while TAF is down" }, { from: "smsService", to: "marketplace" }], accent: ["taf", "mobileBank"], packets: [{ from: "taf", to: "mobileBank", label: "code" }] },
  { cue: 11, layout: CODES, edges: [{ from: "taf", to: "mobileBank" }, { from: "smsService", to: "marketplace" }], accent: ["smsService", "marketplace"], packets: [{ from: "smsService", to: "marketplace", label: "code" }], badges: { marketplace: "phone or web" } },
  { cue: 12, layout: ROADS, edges: [...ROADS_EDGES], badges: { smsService: "code SMS only", pushService: "never a code" } },
  { cue: 14, layout: ROADS, edges: [...ROADS_EDGES], accent: ["smsService"], badges: { smsService: "registration or verified number" } },
  { cue: 15, layout: ROADS, edges: [...ROADS_EDGES], accent: ["pushService"], badges: { pushService: "the customer's devices" } },
  // The outbox: the message is written with the change, or not at all.
  { cue: 16, layout: OUTBOX, edges: [...OUTBOX_EDGES] },
  { cue: 17, layout: OUTBOX, edges: [...OUTBOX_EDGES], accent: ["platform"], badges: { platform: "password change" } },
  { cue: 18, layout: OUTBOX, edges: [...OUTBOX_EDGES], accent: ["outbox"], packets: [{ from: "platform", to: "outbox", label: "password changed" }], badges: { outbox: "one transaction" } },
  { cue: 20, layout: OUTBOX, edges: [...OUTBOX_EDGES], danger: ["platform"], packets: [{ from: "outbox", to: "kafka", label: "sent later" }], badges: { outbox: "row still there" } },
  { cue: 21, layout: OUTBOX, edges: [...OUTBOX_EDGES], crossed: ["outbox"], badges: { platform: "change failed: no row" } },
  { cue: 22, layout: OUTBOX, edges: [...OUTBOX_EDGES], packets: [{ from: "smsService", to: "workers", label: "delivery report" }] },
  { cue: 23, layout: OUTBOX, edges: [...OUTBOX_EDGES], packets: [{ from: "workers", to: "smsService", label: "retry", stopAt: 0.6 }], badges: { workers: "configured retries, then failed" } },
  // Security notifications, and no SMS to a number on hold.
  { cue: 25, layout: SESSION, edges: [...SESSION_EDGES], accent: ["platform"], badges: { platform: "cannot be switched off" } },
  { cue: 26, layout: SESSION, edges: [...SESSION_EDGES], packets: [{ from: "platform", to: "mobileBank", label: "push: new session" }, { from: "platform", to: "trusted", label: "SMS", delay: 40 }], badges: { marketplace: "new session", trusted: "app · model · address · time" } },
  { cue: 27, layout: SESSION, edges: [...SESSION_EDGES], badges: { platform: "new device · password · lock · block" } },
  { cue: 29, layout: HOLD, edges: [...HOLD_EDGES], danger: ["stranger"], badges: { trusted: "This was not me" } },
  { cue: 30, layout: HOLD, edges: [...HOLD_EDGES], danger: ["stranger"], packets: [{ from: "pushService", to: "trusted", label: "number on hold" }], badges: { smsService: "no SMS on hold" } },
  { cue: 31, layout: HOLD, edges: [...HOLD_EDGES], danger: ["stranger"], shake: { stranger: 0.4 }, badges: { stranger: "holds the SIM?" } },
  // What a message may say: a push is a doorbell, the app pulls the words.
  { cue: 32, layout: POCKET, edges: [...POCKET_EDGES], danger: ["phoneThief"] },
  { cue: 33, layout: ROADS, edges: [...ROADS_EDGES], badges: { aziz: "no document data · no ID number" } },
  { cue: 34, layout: ROADS, edges: [...ROADS_EDGES], badges: { aziz: "first name only · no action links" } },
  { cue: 35, layout: ROADS, edges: [...ROADS_EDGES], badges: { smsService: "model · address · time" } },
  { cue: 36, layout: PULL, edges: [...PULL_EDGES], crossed: ["pushService"], badges: { pushService: "no code · no text · no data" } },
  { cue: 37, layout: PULL, edges: [...PULL_EDGES], packets: [{ from: "platform", to: "trusted", label: "type + reference" }] },
  { cue: 38, layout: PULL, edges: [...PULL_EDGES], accent: ["trusted"], packets: [{ from: "trusted", to: "platform", label: "text for this reference?" }] },
  { cue: 39, layout: PULL, edges: [...PULL_EDGES], accent: ["trusted"], packets: [{ from: "platform", to: "trusted", label: "text · language · version" }], badges: { trusted: "a device of the customer" } },
  { cue: 40, layout: POCKET, edges: [...POCKET_EDGES], danger: ["phoneThief"], badges: { trusted: "only the kind of message" } },
  { cue: 41, layout: POCKET, edges: [...POCKET_EDGES], badges: { trusted: "a doorbell, not a letter" } },
  { cue: 43, layout: ROADS, edges: [...ROADS_EDGES.slice(0, 1), ...ROADS_EDGES.slice(2, 3), { from: "platform", to: "pushService", broken: true }], danger: ["pushService"], badges: { smsService: "SMS only" } },
  // The words themselves: four languages, versions, maker-checker.
  { cue: 44, layout: { compliance: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "compliance", to: "platform" }], accent: ["compliance"] },
  { cue: 45, layout: { compliance: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "compliance", to: "platform" }], badges: { platform: "four languages" } },
  { cue: 46, layout: { compliance: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "compliance", to: "platform", label: "maker-checker" }], badges: { platform: "every version kept" } },
  { cue: 47, layout: { platform: [0.5, 1], auditTrail: [2.5, 1] }, edges: [{ from: "platform", to: "auditTrail" }], packets: [{ from: "platform", to: "auditTrail", label: "template version" }] },
  // Recap and the open question.
  { cue: 48, layout: ROADS, edges: [...ROADS_EDGES], accent: ["smsService", "pushService"] },
  { cue: 49, layout: OUTBOX, edges: [...OUTBOX_EDGES], accent: ["outbox"] },
  { cue: 50, layout: { platform: [0.5, 1], auditTrail: [2.5, 1] }, edges: [{ from: "platform", to: "auditTrail" }], accent: ["auditTrail"] },
  { cue: 51, layout: { platform: [0.5, 1], auditTrail: [2.5, 1] }, edges: [{ from: "platform", to: "auditTrail" }], badges: { auditTrail: "that Friday?" } },
  { cue: 52, layout: { platform: [0.5, 1], auditTrail: [2.5, 1] }, edges: [{ from: "platform", to: "auditTrail" }], badges: { auditTrail: "proof nobody changed it?" } },
];
