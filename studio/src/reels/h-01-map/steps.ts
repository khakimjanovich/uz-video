import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 1: the map. The question (cues 0–4); registration at level 1 (5–13); the step-up to level 2 and the
// trusted phone (14–26); the stranger with a SIM card of Aziz's number (27–35); the map tour (36–55); the close (56–59).
const INSIDE: HeeyMapId[] = ["edge", "custgw", "keycloak", "admingw", "workers", "postgres", "valkey", "kafka", "vault", "adapters"];
const STORES: HeeyMapId[] = ["postgres", "valkey", "kafka", "vault"];
const OUTSIDE: HeeyMapId[] = ["myid", "sms", "push"];
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 3, part: 1, rows: [1], current: INSIDE, units: UNIT },
  { cue: 4, part: 1, current: ["customer", "mobile"], dot: "customer", units: UNIT },
  // Sunday: registration in the master app.
  { cue: 5, part: 1, current: ["customer", "mobile"], dot: "mobile", units: UNIT },
  { cue: 6, part: 1, current: ["mobile"], dot: "mobile", units: { heeyid: "master app: moves money" } },
  { cue: 7, part: 1, current: ["mobile", "edge", "custgw", "adapters", "taf"], dot: "taf", units: UNIT },
  { cue: 8, part: 1, current: ["adapters", "taf"], dot: "taf", units: { heeyid: "code through TAF" } },
  { cue: 9, part: 1, current: ["mobile", "edge", "custgw"], dot: "custgw", units: UNIT },
  { cue: 10, part: 1, current: ["custgw", "adapters", "taf"], dot: "taf", units: { heeyid: "verdict: green" } },
  { cue: 11, part: 1, current: ["mobile", "custgw", "postgres"], dot: "postgres", units: { heeyid: "password, two times" } },
  // Saturday: the consent is recorded.
  { cue: 16, part: 1, current: ["mobile", "custgw", "postgres"], dot: "postgres", units: { heeyid: "consent recorded" } },
  // The map behind the journey: one box per sentence.
  { cue: 36, part: 1, dot: "off", units: UNIT },
  { cue: 37, part: 1, current: ["mobile", "edge"], units: { heeyid: "the heeyID API" } },
  { cue: 38, part: 1, current: ["edge", "custgw"], units: UNIT },
  { cue: 39, part: 1, current: ["custgw"], units: UNIT },
  { cue: 40, part: 1, current: ["custgw", "keycloak"], units: UNIT },
  { cue: 41, part: 1, current: ["staff"], units: UNIT },
  { cue: 42, part: 1, current: ["staff", "edge", "admingw"], units: UNIT },
  { cue: 43, part: 1, current: STORES, units: UNIT },
  { cue: 44, part: 1, current: ["postgres"], units: UNIT },
  { cue: 45, part: 1, current: ["valkey"], units: UNIT },
  { cue: 46, part: 1, current: ["kafka"], units: UNIT },
  { cue: 47, part: 1, current: ["vault"], units: UNIT },
  { cue: 48, part: 1, current: ["custgw", "adapters"], units: UNIT },
  { cue: 49, part: 1, current: ["adapters", "taf", ...OUTSIDE], units: UNIT },
  { cue: 50, part: 1, current: ["custgw", "workers", "adapters"], units: UNIT },
  { cue: 51, part: 1, current: ["perimeter", "customer", "mobile", "staff", ...INSIDE, "taf"], units: UNIT },
  { cue: 52, part: 1, current: ["perimeter"], units: { heeyid: "one installation, one bank" } },
  { cue: 53, part: 1, current: ["adapters", "taf"], units: { heeyid: "TAF agent in the bank" } },
  { cue: 54, part: 1, current: OUTSIDE, units: UNIT },
  { cue: 55, part: 1, current: ["push"], units: UNIT },
  // The close: one proofing, the question (held 2 s), the answer, and lesson two.
  { cue: 56, part: 1, current: ["customer", "mobile", "myid"], dot: "mobile", units: UNIT },
  { cue: 57, part: 1, current: ["myid"], dot: "myid", units: UNIT },
  { cue: 59, part: 1, rows: [1], dot: "off", units: UNIT },
];

const SEND = { aziz: [0, 1], trusted: [1.5, 1], platform: [3, 1] } as const;
const SEND_EDGES = [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "platform" }] as const;
const LEVEL = { aziz: [0.5, 1], platform: [2.5, 1] } as const;
const WANT = { aziz: [0, 1], mobileBank: [1.5, 1], platform: [3, 1] } as const;
const WANT_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }] as const;
const PROOF = { aziz: [0, 1], mobileBank: [1.5, 1], platform: [3, 0.4], myid: [3, 1.6] } as const;
const PROOF_EDGES = [...WANT_EDGES, { from: "mobileBank", to: "myid" }] as const;
const PHONE = { myid: [0, 1], platform: [1.5, 1], taf: [3, 1] } as const;
const PHONE_EDGES = [{ from: "platform", to: "myid" }, { from: "platform", to: "taf" }] as const;
const THREAT = { stranger: [0, 0.4], newPhone: [1.5, 0.4], platform: [3, 1], trusted: [1.5, 1.7], aziz: [0, 1.7] } as const;
const THREAT_EDGES = [{ from: "stranger", to: "newPhone" }, { from: "newPhone", to: "platform" }, { from: "aziz", to: "trusted" }, { from: "trusted", to: "platform" }] as const;
const TRUST = { aziz: [0, 1], trusted: [1.5, 1], myid: [3, 0.4], taf: [3, 1.6] } as const;
const TRUST_EDGES = [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "myid" }, { from: "trusted", to: "taf" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Today: money to his mother, and no face check.
  { cue: 0, layout: SEND, edges: [...SEND_EDGES], accent: ["aziz"], packets: [{ from: "trusted", to: "platform", label: "money to mother" }] },
  { cue: 1, layout: SEND, edges: [...SEND_EDGES], accent: ["platform"], badges: { platform: "really Aziz ✓" } },
  { cue: 2, layout: { aziz: [0, 0.6], trusted: [1.5, 0.6], platform: [3, 0.6], myid: [1.5, 1.9] }, edges: [...SEND_EDGES], danger: ["myid"], badges: { myid: "every time?" } },
  // Level 1: the phone, not the person.
  { cue: 12, layout: LEVEL, edges: [{ from: "aziz", to: "platform" }], accent: ["aziz"], badges: { aziz: "level 1" } },
  { cue: 13, layout: LEVEL, edges: [{ from: "aziz", to: "platform" }], badges: { aziz: "level 1", platform: "phone ✓ · person ?" } },
  // Saturday: money needs level 2.
  { cue: 14, layout: WANT, edges: [...WANT_EDGES], accent: ["aziz"], packets: [{ from: "mobileBank", to: "platform", label: "money to mother" }], badges: { aziz: "level 1" } },
  { cue: 15, layout: WANT, edges: [...WANT_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "money", stopAt: 0.5 }], badges: { aziz: "level 1", platform: "needs level 2" } },
  { cue: 17, layout: PROOF, edges: [...PROOF_EDGES], accent: ["myid"], badges: { mobileBank: "consent ✓" } },
  { cue: 18, layout: PROOF, edges: [...PROOF_EDGES], accent: ["myid"], packets: [{ from: "mobileBank", to: "myid", label: "face" }, { from: "mobileBank", to: "myid", label: "passport", delay: 40 }] },
  // The phone check: MyID's number first, TAF when it differs.
  { cue: 19, layout: PHONE, edges: [...PHONE_EDGES], accent: ["platform"], badges: { platform: "number his?" } },
  { cue: 20, layout: PHONE, edges: [...PHONE_EDGES], accent: ["myid"], packets: [{ from: "myid", to: "platform", label: "number on record" }] },
  { cue: 21, layout: PHONE, edges: [...PHONE_EDGES], accent: ["taf"], packets: [{ from: "platform", to: "taf", label: "who owns it?" }], badges: { taf: "owner ✓" } },
  { cue: 22, layout: LEVEL, edges: [{ from: "aziz", to: "platform" }], accent: ["aziz"], badges: { aziz: "level 2" } },
  { cue: 23, layout: { aziz: [0.5, 1], trusted: [2.5, 1] }, edges: [{ from: "aziz", to: "trusted" }], accent: ["trusted"], badges: { aziz: "level 2", trusted: "moves money" } },
  { cue: 24, layout: SEND, edges: [...SEND_EDGES], accent: ["trusted"], packets: [{ from: "trusted", to: "platform", label: "money to mother" }], badges: { platform: "level 2 ✓" } },
  // Daily use on the same phone.
  { cue: 25, layout: { trusted: [0, 1], mobileBank: [1.5, 1], myid: [3, 1] }, edges: [{ from: "trusted", to: "mobileBank" }], crossed: ["myid"], badges: { mobileBank: "no face check" } },
  { cue: 26, layout: { trusted: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "trusted", to: "platform" }], packets: [{ from: "trusted", to: "platform", label: "password" }, { from: "trusted", to: "platform", label: "code", delay: 40 }], badges: { trusted: "same phone" } },
  // The worry: a SIM card of Aziz's number and a leaked password.
  { cue: 27, layout: { stranger: [1.5, 1] }, danger: ["stranger"] },
  { cue: 28, layout: { stranger: [1.5, 1] }, danger: ["stranger"], badges: { stranger: "SIM of Aziz's number" } },
  { cue: 29, layout: { stranger: [1.5, 1] }, danger: ["stranger"], badges: { stranger: "leaked password" } },
  { cue: 30, layout: THREAT, edges: [...THREAT_EDGES], danger: ["stranger"], badges: { newPhone: "mobile bank" } },
  { cue: 31, layout: THREAT, edges: [...THREAT_EDGES], accent: ["trusted"], badges: { newPhone: "number ✓ · password ✓", trusted: "trusted" } },
  { cue: 32, layout: TRUST, edges: [...TRUST_EDGES], accent: ["trusted"], badges: { myid: "Aziz's face ✓", taf: "SIM ✓" } },
  { cue: 33, layout: { stranger: [0, 1], newPhone: [1.5, 1], myid: [3, 1] }, edges: [{ from: "stranger", to: "newPhone" }, { from: "newPhone", to: "myid", broken: true }], danger: ["stranger"], badges: { myid: "Aziz's face" } },
  { cue: 34, layout: THREAT, edges: [...THREAT_EDGES], danger: ["newPhone"], packets: [{ from: "newPhone", to: "platform", label: "move money", stopAt: 0.5 }], badges: { newPhone: "not trusted" } },
  { cue: 35, layout: THREAT, edges: [...THREAT_EDGES], accent: ["trusted"], crossed: ["newPhone"], badges: { trusted: "moves money" } },
];
