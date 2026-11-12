import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 1: the map. The why (cues 0–4); Aziz's day in the master app and a side app (5–27); the next
// morning (28–32); the stranger with a swapped SIM, the hold and the new number (33–47); the map tour
// (48–71); the close (72–75).
const INSIDE: HeeyMapId[] = ["edge", "custgw", "keycloak", "admingw", "workers", "postgres", "valkey", "kafka", "vault", "adapters"];
const STORES: HeeyMapId[] = ["postgres", "valkey", "kafka", "vault"];
const OUTSIDE: HeeyMapId[] = ["taf", "myid", "sms", "push"];
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 1, rows: [1], current: INSIDE, units: UNIT },
  // Aziz's day.
  { cue: 5, part: 1, current: ["customer"], dot: "customer" },
  { cue: 6, part: 1, current: ["customer", "mobile"], dot: "mobile" },
  { cue: 7, part: 1, current: ["mobile", "taf", "myid"], dot: "mobile", units: { heeyid: "master app: MyID and TAF" } },
  { cue: 8, part: 1, current: ["mobile", "edge", "custgw", "adapters", "taf"], dot: "taf" },
  { cue: 9, part: 1, current: ["custgw", "adapters", "taf"], dot: "taf", units: { heeyid: "code through TAF" } },
  { cue: 10, part: 1, current: ["mobile", "taf"], dot: "taf", units: { heeyid: "verdict: green" } },
  { cue: 11, part: 1, current: ["custgw", "postgres", "valkey"], dot: "custgw" },
  { cue: 12, part: 1, current: ["mobile", "custgw", "postgres"], dot: "postgres", units: { heeyid: "one password, all apps" } },
  { cue: 18, part: 1, current: ["mobile", "custgw", "postgres"], dot: "postgres" },
  { cue: 19, part: 1, current: ["mobile", "custgw", "adapters", "myid"], dot: "myid" },
  { cue: 21, part: 1, current: ["custgw", "adapters", "myid"], dot: "custgw" },
  { cue: 23, part: 1, current: ["custgw", "adapters"], dot: "postgres" },
  { cue: 24, part: 1, current: ["custgw", "postgres"], dot: "postgres" },
  { cue: 27, part: 1, current: ["custgw", "keycloak", "mobile"], dot: "mobile" },
  // The map behind that day: one box per sentence.
  { cue: 48, part: 1, dot: "off", units: UNIT },
  { cue: 49, part: 1, current: ["mobile", "edge", "custgw"], units: { heeyid: "every app calls the API" } },
  { cue: 50, part: 1, current: ["mobile", "taf", "myid"], units: { heeyid: "MyID + TAF SDKs: master app" } },
  { cue: 51, part: 1, current: ["mobile", "sms"], units: { heeyid: "side apps: approval or SMS" } },
  { cue: 52, part: 1, current: ["mobile", "edge", "custgw"], units: UNIT },
  { cue: 53, part: 1, current: ["custgw"], units: UNIT },
  { cue: 54, part: 1, current: ["custgw", "keycloak"], units: UNIT },
  { cue: 55, part: 1, current: ["keycloak"], units: UNIT },
  { cue: 56, part: 1, current: ["keycloak", "mobile"], units: { heeyid: "one client per app" } },
  { cue: 57, part: 1, current: ["custgw", "adapters"], units: UNIT },
  { cue: 58, part: 1, current: ["adapters", ...OUTSIDE], units: UNIT },
  { cue: 59, part: 1, current: ["adapters", "taf"], units: { heeyid: "codes: TAF in the master app" } },
  { cue: 60, part: 1, current: ["adapters", "sms"], units: { heeyid: "codes: SMS in side apps" } },
  { cue: 61, part: 1, current: STORES, units: UNIT },
  { cue: 62, part: 1, current: ["postgres"], units: UNIT },
  { cue: 63, part: 1, current: ["valkey"], units: UNIT },
  { cue: 64, part: 1, current: ["kafka"], units: UNIT },
  { cue: 65, part: 1, current: ["vault"], units: UNIT },
  { cue: 66, part: 1, current: ["staff"], units: UNIT },
  { cue: 67, part: 1, current: ["staff", "admingw"], units: UNIT },
  { cue: 68, part: 1, current: ["perimeter", "customer", "mobile", "staff", ...INSIDE, "taf", "sms"], units: UNIT },
  { cue: 69, part: 1, current: ["perimeter"], units: { heeyid: "one installation, one bank" } },
  { cue: 70, part: 1, current: ["taf"], units: { heeyid: "TAF agent in the bank" } },
  { cue: 71, part: 1, current: ["myid", "push"], units: UNIT },
  // Recap, the question (held 2 s), the answer, and where the course goes next.
  { cue: 72, part: 1, current: ["customer", "mobile", "keycloak"], dot: "mobile", units: UNIT },
  { cue: 73, part: 1, current: ["myid"], dot: "myid", units: UNIT },
  { cue: 75, part: 1, rows: [1], dot: "off", units: UNIT },
];

const APPS = { aziz: [0, 1], mobileBank: [2, 0], marketplace: [2, 1], credit: [2, 2] } as const;
const APP_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "aziz", to: "marketplace" }, { from: "aziz", to: "credit" }] as const;
const LEVEL = { aziz: [0.5, 1], platform: [2.5, 1] } as const;
const STEP_UP = { aziz: [0, 1], marketplace: [1.5, 0.4], credit: [3, 0.4] } as const;
const SENT = { ...STEP_UP, mobileBank: [1.5, 1.8] } as const;
const MASTER = { ...SENT, myid: [3, 1.8] } as const;
const MASTER_EDGES = [{ from: "aziz", to: "marketplace" }, { from: "marketplace", to: "credit" }, { from: "marketplace", to: "mobileBank" }] as const;
const GRANTS = { trusted: [0, 1], mobileBank: [2, 0], marketplace: [2, 1], credit: [2, 2] } as const;
const GRANT_EDGES = [{ from: "trusted", to: "mobileBank" }, { from: "trusted", to: "marketplace" }, { from: "trusted", to: "credit" }] as const;
const MORNING = { trusted: [0, 1], marketplace: [2, 0.4], mobileBank: [2, 1.6], myid: [3, 1] } as const;
const THREAT = { stranger: [0, 0.4], newPhone: [1.2, 0.4], platform: [2.4, 1], trusted: [1.2, 1.7], aziz: [0, 1.7] } as const;
const VERDICT = { ...THREAT, platform: [2.1, 1], taf: [3, 0.4] } as const;
const RECHECK = { ...VERDICT, myid: [3, 1.7] } as const;
const WEB = { stranger: [0, 0.4], marketplace: [1.2, 0.4], platform: [2.4, 1], trusted: [1.2, 1.7], aziz: [0, 1.7] } as const;
const THREAT_EDGES = [{ from: "stranger", to: "newPhone" }, { from: "newPhone", to: "platform" }, { from: "platform", to: "trusted" }, { from: "aziz", to: "trusted" }] as const;
const WEB_EDGES = [{ from: "stranger", to: "marketplace" }, { from: "marketplace", to: "platform" }, { from: "platform", to: "trusted" }, { from: "aziz", to: "trusted" }] as const;
const AFTER = { aziz: [0, 1], trusted: [1.5, 1], platform: [3, 1] } as const;
const AFTER_EDGES = [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "platform" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The why: three apps, one person, no face check every time.
  { cue: 0, layout: APPS, edges: [...APP_EDGES], accent: ["aziz"] },
  { cue: 1, layout: APPS, edges: [...APP_EDGES], badges: { mobileBank: "Aziz?", marketplace: "Aziz?", credit: "Aziz?" } },
  { cue: 2, layout: { ...APPS, myid: [3, 1] }, edges: [...APP_EDGES], danger: ["myid"], badges: { myid: "every time?" } },
  // Level 1, then the need for level 2.
  { cue: 13, layout: LEVEL, edges: [{ from: "aziz", to: "platform" }], accent: ["aziz"], badges: { aziz: "level 1" } },
  { cue: 14, layout: LEVEL, edges: [{ from: "aziz", to: "platform" }], badges: { aziz: "level 1", platform: "phone ✓ · person ?" } },
  { cue: 15, layout: STEP_UP, edges: [{ from: "aziz", to: "marketplace" }, { from: "marketplace", to: "credit" }], accent: ["marketplace"], badges: { aziz: "level 1" } },
  { cue: 16, layout: STEP_UP, edges: [{ from: "aziz", to: "marketplace" }, { from: "marketplace", to: "credit" }], accent: ["credit"], badges: { aziz: "level 1", credit: "needs level 2" } },
  // The side app sends Aziz to the master app; MyID runs only there.
  { cue: 17, layout: SENT, edges: [...MASTER_EDGES], accent: ["mobileBank"], packets: [{ from: "marketplace", to: "mobileBank", label: "go to the mobile bank" }], badges: { marketplace: "no face check" } },
  { cue: 19, layout: MASTER, edges: [...MASTER_EDGES, { from: "mobileBank", to: "myid" }], accent: ["myid"] },
  { cue: 20, layout: MASTER, edges: [...MASTER_EDGES, { from: "mobileBank", to: "myid" }], packets: [{ from: "mobileBank", to: "myid", label: "face" }, { from: "mobileBank", to: "myid", label: "passport", delay: 40 }], accent: ["myid"] },
  { cue: 22, layout: MASTER, edges: [...MASTER_EDGES, { from: "mobileBank", to: "myid" }], accent: ["aziz"], badges: { aziz: "level 2" } },
  { cue: 25, layout: { aziz: [0.5, 1], trusted: [2.5, 1] }, edges: [{ from: "aziz", to: "trusted" }], accent: ["trusted"], badges: { aziz: "level 2", trusted: "trusted" } },
  { cue: 26, layout: SENT, edges: [...MASTER_EDGES], accent: ["marketplace", "credit"], packets: [{ from: "mobileBank", to: "marketplace", label: "Approve" }], badges: { marketplace: "level 2", credit: "level 2 ✓" } },
  // Next morning: the sessions continue, no MyID.
  { cue: 28, layout: MORNING, edges: [{ from: "trusted", to: "marketplace" }, { from: "trusted", to: "mobileBank" }], accent: ["trusted"] },
  { cue: 29, layout: MORNING, edges: [{ from: "trusted", to: "marketplace" }, { from: "trusted", to: "mobileBank" }], crossed: ["myid"] },
  { cue: 30, layout: MORNING, edges: [{ from: "trusted", to: "marketplace" }, { from: "trusted", to: "mobileBank" }], crossed: ["myid"], badges: { trusted: "no new code" } },
  { cue: 31, layout: MORNING, edges: [{ from: "trusted", to: "marketplace" }, { from: "trusted", to: "mobileBank" }], crossed: ["myid"], accent: ["trusted"], badges: { trusted: "sessions continue" } },
  { cue: 32, layout: GRANTS, edges: [...GRANT_EDGES], accent: ["mobileBank", "marketplace", "credit"], badges: { trusted: "one proofing" } },
  // The worry: a stranger with Aziz's number on a new SIM.
  { cue: 33, layout: { stranger: [0, 0.4], aziz: [0, 1.7] }, danger: ["stranger"] },
  { cue: 34, layout: { stranger: [0, 0.4], aziz: [0, 1.7] }, danger: ["stranger"], badges: { stranger: "new SIM" } },
  { cue: 35, layout: THREAT, edges: [...THREAT_EDGES], danger: ["stranger"], packets: [{ from: "newPhone", to: "platform", label: "log in as Aziz" }] },
  { cue: 36, layout: THREAT, edges: [...THREAT_EDGES], danger: ["stranger"], badges: { newPhone: "password ✓" } },
  // The guards, one per sentence: TAF can say green, MyID on a new phone, Aziz's own phone.
  { cue: 38, layout: VERDICT, edges: [...THREAT_EDGES, { from: "platform", to: "taf" }], danger: ["stranger"], packets: [{ from: "platform", to: "newPhone", label: "SMS code" }], badges: { taf: "SIM matches: green", newPhone: "code ✓" } },
  { cue: 39, layout: RECHECK, edges: [...THREAT_EDGES, { from: "platform", to: "taf" }, { from: "platform", to: "myid" }], accent: ["myid"], badges: { newPhone: "new phone", myid: "MyID required" } },
  { cue: 40, layout: RECHECK, edges: [...THREAT_EDGES, { from: "platform", to: "taf" }, { from: "platform", to: "myid" }], accent: ["myid"], shake: { newPhone: 0.4 }, badges: { myid: "face ✕" } },
  { cue: 41, layout: THREAT, edges: [...THREAT_EDGES], accent: ["trusted"], packets: [{ from: "platform", to: "trusted", label: "login request" }], badges: { trusted: "Approve · This was not me" } },
  { cue: 42, layout: THREAT, edges: [...THREAT_EDGES], accent: ["aziz", "trusted"], crossed: ["newPhone"], shake: { trusted: 0.3 }, packets: [{ from: "platform", to: "newPhone", label: "access", stopAt: 0.5 }], badges: { trusted: "This was not me" } },
  // The hold, the side-app door, and the way back to a working number.
  { cue: 43, layout: THREAT, edges: [...THREAT_EDGES], crossed: ["newPhone"], danger: ["stranger"], badges: { stranger: "number on hold", trusted: "push only" } },
  { cue: 44, layout: WEB, edges: [...WEB_EDGES], danger: ["stranger"], packets: [{ from: "platform", to: "trusted", label: "login request" }], badges: { marketplace: "web", trusted: "This was not me" } },
  { cue: 45, layout: AFTER, edges: [...AFTER_EDGES], accent: ["aziz"], packets: [{ from: "trusted", to: "platform", label: "new password" }] },
  { cue: 46, layout: AFTER, edges: [...AFTER_EDGES], accent: ["trusted"], badges: { trusted: "SIM still works?" } },
  { cue: 47, layout: { ...AFTER, myid: [1.5, 1.9] }, edges: [...AFTER_EDGES, { from: "trusted", to: "myid" }], accent: ["myid", "trusted"], packets: [{ from: "trusted", to: "myid", label: "face" }], badges: { myid: "MyID ✓", trusted: "new number" } },
];
