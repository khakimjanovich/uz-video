import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 19: the operator panel, a Friday months later. The lost phone and the question (0–5); the bridge (6–8);
// staff identity and roles (9–15); the four actions (16–23); Friday's block and what it does (24–40);
// Sunday's unblock by two operators (41–55); the check (56–57); summary and hand-off (58–63).
const UNIT = { heeyid: "operator panel" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 0, part: 6, rows: [6], current: ["customer", "mobile"], dot: "mobile" },
  { cue: 6, part: 6, rows: [5], current: ["mobile", "custgw", "keycloak"], dot: "custgw", units: { heeyid: "lesson 18: same phone" } },
  { cue: 7, part: 6, rows: [4], current: ["staff", "admingw"], dot: "admingw", units: { heeyid: "lesson 15: phone review" } },
  { cue: 8, part: 6, rows: [6], current: ["staff", "edge", "admingw"], dot: "admingw", units: UNIT },
  { cue: 10, part: 6, rows: [6], current: ["staff", "edge", "admingw", "keycloak"], dot: "staff", units: { heeyid: "staff sign-in" } },
  { cue: 16, part: 6, rows: [6], current: ["staff", "admingw", "postgres"], dot: "admingw", units: { heeyid: "four actions" } },
  { cue: 24, part: 6, rows: [6], current: ["staff", "admingw", "postgres"], dot: "postgres", units: { heeyid: "block: one operator" } },
  { cue: 27, part: 6, rows: [6], current: ["mobile", "custgw", "keycloak", "valkey"], dot: "valkey", units: { heeyid: "grants end at the next request" } },
  { cue: 35, part: 6, rows: [6], current: ["kafka", "adapters", "sms", "push"], dot: "push", units: { heeyid: "account blocked" } },
  { cue: 41, part: 6, rows: [6], current: ["customer", "mobile"], dot: "mobile", units: UNIT },
  { cue: 44, part: 6, rows: [6], current: ["staff", "admingw", "postgres"], dot: "admingw", units: { heeyid: "unblock: two operators" } },
  { cue: 53, part: 6, rows: [6], current: ["kafka", "adapters", "sms", "push"], dot: "push", units: { heeyid: "account unblocked" } },
  { cue: 58, part: 6, rows: [6], current: ["staff", "edge", "admingw"], dot: "off", units: UNIT },
  { cue: 63, part: 6, rows: [6], current: ["kafka", "adapters", "push"], dot: "push", units: { heeyid: "lesson 20: notifications" } },
];

const PHONE = { aziz: [0.5, 1], trusted: [2.5, 1] } as const;
const PHONE_EDGES = [{ from: "aziz", to: "trusted" }] as const;
const CALL = { aziz: [0, 1.7], trusted: [0, 0.3], panelOperator: [3, 1.7] } as const;
const CALL_EDGES = [{ from: "aziz", to: "panelOperator", label: "lock everything" }] as const;
const DOOR = { panelOperator: [0, 1], staffId: [1.5, 1], adminGw: [3, 1] } as const;
const DOOR_EDGES = [{ from: "panelOperator", to: "staffId" }, { from: "staffId", to: "adminGw" }] as const;
const SCREEN = { panelOperator: [0, 1], adminGw: [1.5, 1], aziz: [3, 1] } as const;
const SCREEN_EDGES = [{ from: "panelOperator", to: "adminGw" }, { from: "adminGw", to: "aziz" }] as const;
const ACT = { panelOperator: [0, 1], adminGw: [1.5, 1], phoneReview: [3, 0.3], valkey: [3, 1.7] } as const;
const ACT_EDGES = [{ from: "panelOperator", to: "adminGw" }, { from: "adminGw", to: "phoneReview" }, { from: "adminGw", to: "valkey" }] as const;
const TRAIL1 = { panelOperator: [0, 1], adminGw: [1.5, 1], auditTrail: [3, 1] } as const;
const TRAIL1_EDGES = [{ from: "panelOperator", to: "adminGw" }, { from: "adminGw", to: "auditTrail" }] as const;
const GRANTS = { platform: [0, 1.7], revocation: [0, 0.3], keycloak: [1.5, 1], trusted: [3, 1] } as const;
const GRANTS_EDGES = [{ from: "platform", to: "revocation" }, { from: "platform", to: "keycloak" }, { from: "keycloak", to: "trusted" }] as const;
const REFUSE = { trusted: [0.5, 1], platform: [2.5, 1] } as const;
const REFUSE_EDGES = [{ from: "trusted", to: "platform" }] as const;
const KEPT = { platform: [0.5, 1], trusted: [2.5, 0.3], identity: [2.5, 1.7] } as const;
const KEPT_EDGES = [{ from: "platform", to: "trusted" }, { from: "platform", to: "identity" }] as const;
const NOTIFY = { platform: [0.3, 1], smsService: [2.5, 0.3], pushService: [2.5, 1.7] } as const;
const NOTIFY_EDGES = [{ from: "platform", to: "smsService" }, { from: "platform", to: "pushService" }] as const;
const TRAIL = { platform: [0.3, 1], auditTrail: [2.5, 0.3], antifraud: [2.5, 1.7] } as const;
const TRAIL_EDGES = [{ from: "platform", to: "auditTrail" }, { from: "platform", to: "antifraud" }] as const;
const WHO = { panelOperator: [0.8, 1], platform: [2.4, 1] } as const;
const BACK = { finder: [0, 1], trusted: [1.5, 1], aziz: [3, 1] } as const;
const BACK_EDGES = [{ from: "finder", to: "trusted" }, { from: "trusted", to: "aziz" }] as const;
const MC = { panelOperator: [0, 1.6], proposal: [1.5, 1], secondOperator: [3, 1.6], platform: [3, 0.3] } as const;
const MC_EDGES = [{ from: "panelOperator", to: "proposal" }, { from: "secondOperator", to: "proposal" }, { from: "proposal", to: "platform" }] as const;
const BOTH = { secondOperator: [0.5, 1], phoneReview: [2.5, 0.3], valkey: [2.5, 1.7] } as const;
const BOTH_EDGES = [{ from: "secondOperator", to: "phoneReview" }, { from: "secondOperator", to: "valkey" }] as const;
const CHECK = { panelOperator: [0, 1], adminGw: [1.5, 1], secondOperator: [3, 1] } as const;
const CHECK_EDGES = [{ from: "panelOperator", to: "adminGw" }, { from: "secondOperator", to: "adminGw" }] as const;
const LAST = { pushService: [0, 1], trusted: [1.5, 1], finder: [3, 1] } as const;
const LAST_EDGES = [{ from: "pushService", to: "trusted" }, { from: "finder", to: "trusted" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // A Friday at the bazaar: the phone is gone.
  { cue: 0, layout: PHONE, edges: [...PHONE_EDGES], accent: ["trusted"], badges: { trusted: "money phone" } },
  { cue: 1, layout: PHONE, edges: [...PHONE_EDGES], badges: { aziz: "the bazaar", trusted: "money phone" } },
  { cue: 2, layout: PHONE, edges: [...PHONE_EDGES], danger: ["trusted"], badges: { trusted: "gone" } },
  { cue: 3, layout: PHONE, edges: [...PHONE_EDGES], danger: ["trusted"], badges: { trusted: "mobile bank on it" } },
  { cue: 4, layout: CALL, edges: [...CALL_EDGES], danger: ["trusted"], accent: ["panelOperator"], packets: [{ from: "aziz", to: "panelOperator", label: "sister's phone" }], badges: { trusted: "lost" } },
  { cue: 5, layout: CALL, edges: [...CALL_EDGES], danger: ["trusted"], badges: { trusted: "lost", panelOperator: "who may?" } },
  // The bridge: lesson 18's logins, lesson 15's phone review.
  { cue: 6, layout: { aziz: [0, 1], trusted: [1.5, 1], platform: [3, 1] }, edges: [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "platform" }], badges: { trusted: "password · code" } },
  { cue: 7, layout: { phoneReview: [0.5, 1], panelOperator: [2.5, 1] }, edges: [{ from: "phoneReview", to: "panelOperator" }], accent: ["phoneReview"], badges: { phoneReview: "lesson 15" } },
  { cue: 8, layout: SCREEN, edges: [...SCREEN_EDGES], accent: ["adminGw"], badges: { adminGw: "4 actions" } },
  // Staff identity and one role each.
  { cue: 9, layout: DOOR, edges: [...DOOR_EDGES], accent: ["panelOperator"] },
  { cue: 10, layout: DOOR, edges: [...DOOR_EDGES], accent: ["staffId"], packets: [{ from: "panelOperator", to: "staffId", label: "sign in + second factor" }] },
  { cue: 11, layout: DOOR, edges: [...DOOR_EDGES], badges: { adminGw: "no staff passwords" } },
  { cue: 12, layout: DOOR, edges: [...DOOR_EDGES], badges: { panelOperator: "quiet time · lifetime" } },
  { cue: 13, layout: DOOR, edges: [...DOOR_EDGES], badges: { panelOperator: "one role: operator" } },
  { cue: 14, layout: DOOR, edges: [...DOOR_EDGES], accent: ["adminGw"], badges: { adminGw: "role checked at each action" } },
  { cue: 15, layout: SCREEN, edges: [...SCREEN_EDGES], badges: { adminGw: "exact phone number", aziz: "no name search" } },
  // The four actions.
  { cue: 16, layout: ACT, edges: [...ACT_EDGES], accent: ["adminGw"], badges: { adminGw: "4 actions" } },
  { cue: 17, layout: ACT, edges: [...ACT_EDGES], accent: ["phoneReview"], badges: { adminGw: "1. phone review" } },
  { cue: 18, layout: ACT, edges: [...ACT_EDGES], badges: { phoneReview: "approve: level 2" } },
  { cue: 19, layout: ACT, edges: [...ACT_EDGES], badges: { phoneReview: "reject: level 1 closed · SMS" } },
  { cue: 20, layout: ACT, edges: [...ACT_EDGES], badges: { adminGw: "2. block" } },
  { cue: 21, layout: ACT, edges: [...ACT_EDGES], badges: { adminGw: "3. unblock" } },
  { cue: 22, layout: ACT, edges: [...ACT_EDGES], accent: ["valkey"], badges: { adminGw: "4. reset", valkey: "counters · no-check mark" } },
  { cue: 23, layout: TRAIL1, edges: [...TRAIL1_EDGES], accent: ["auditTrail"], packets: [{ from: "panelOperator", to: "adminGw", label: "written reason" }], badges: { auditTrail: "operator's identity" } },
  // Friday: one operator blocks, at once.
  { cue: 24, layout: SCREEN, edges: [...SCREEN_EDGES], badges: { aziz: "Friday" } },
  { cue: 25, layout: SCREEN, edges: [...SCREEN_EDGES], accent: ["panelOperator"], packets: [{ from: "panelOperator", to: "adminGw", label: "block: phone lost" }] },
  { cue: 26, layout: SCREEN, edges: [...SCREEN_EDGES], danger: ["aziz"], badges: { panelOperator: "one operator · at once", aziz: "blocked" } },
  // What one block does.
  { cue: 27, layout: GRANTS, edges: [...GRANTS_EDGES], danger: ["trusted"], badges: { platform: "blocked", trusted: "lost" } },
  { cue: 28, layout: GRANTS, edges: [...GRANTS_EDGES], accent: ["revocation"], danger: ["trusted"], packets: [{ from: "keycloak", to: "trusted", label: "next request", stopAt: 0.6 }], badges: { trusted: "grant ended" } },
  { cue: 29, layout: GRANTS, edges: [...GRANTS_EDGES], crossed: ["trusted"], badges: { trusted: "no money · no balance" } },
  { cue: 30, layout: REFUSE, edges: [...REFUSE_EDGES], packets: [{ from: "trusted", to: "platform", label: "request", stopAt: 0.6 }], badges: { platform: "refused" } },
  { cue: 31, layout: { mobileBank: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "mobileBank", to: "platform" }], packets: [{ from: "mobileBank", to: "platform", label: "login: right password", stopAt: 0.6 }], badges: { platform: "refused" } },
  { cue: 32, layout: { platform: [0.5, 1], myid: [2.5, 1] }, edges: [{ from: "platform", to: "myid", broken: true }], badges: { myid: "open check stops" } },
  { cue: 33, layout: KEPT, edges: [...KEPT_EDGES], accent: ["trusted", "identity"], badges: { trusted: "kept", identity: "kept" } },
  { cue: 34, layout: KEPT, edges: [...KEPT_EDGES], badges: { platform: "a pause, not an end" } },
  { cue: 35, layout: NOTIFY, edges: [...NOTIFY_EDGES], packets: [{ from: "platform", to: "smsService", label: "account blocked" }, { from: "platform", to: "pushService", label: "account blocked", delay: 30 }] },
  { cue: 36, layout: TRAIL, edges: [...TRAIL_EDGES], packets: [{ from: "platform", to: "auditTrail", label: "blocked" }, { from: "platform", to: "antifraud", label: "event", delay: 30 }] },
  // A block is not the password lock; who may block.
  { cue: 37, layout: { aziz: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "aziz", to: "platform" }], badges: { platform: "block ≠ lock" } },
  { cue: 38, layout: { aziz: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "aziz", to: "platform" }], badges: { aziz: "lock: ends by itself", platform: "block: operators lift it" } },
  { cue: 39, layout: WHO, edges: [{ from: "panelOperator", to: "platform" }], accent: ["panelOperator"], badges: { panelOperator: "only an operator · a reason" } },
  { cue: 40, layout: WHO, edges: [{ from: "panelOperator", to: "platform" }], badges: { platform: "never by itself" } },
  // Sunday: the phone comes back.
  { cue: 41, layout: { finder: [0.5, 1], trusted: [2.5, 1] }, edges: [{ from: "finder", to: "trusted" }], badges: { finder: "Saturday" } },
  { cue: 42, layout: BACK, edges: [...BACK_EDGES], accent: ["aziz"], packets: [{ from: "trusted", to: "aziz", label: "handed in" }], badges: { finder: "Sunday" } },
  { cue: 43, layout: CALL, edges: [{ from: "aziz", to: "panelOperator", label: "unblock, please" }], accent: ["trusted"], badges: { trusted: "back" } },
  // The unblock: maker-checker.
  { cue: 44, layout: MC, edges: [...MC_EDGES], accent: ["panelOperator"], packets: [{ from: "panelOperator", to: "proposal", label: "unblock + reason" }] },
  { cue: 45, layout: MC, edges: [...MC_EDGES], accent: ["proposal"], badges: { proposal: "waits", platform: "nothing yet" } },
  { cue: 46, layout: MC, edges: [...MC_EDGES], accent: ["secondOperator"], packets: [{ from: "secondOperator", to: "proposal", label: "approve" }] },
  { cue: 47, layout: MC, edges: [...MC_EDGES], badges: { panelOperator: "cannot approve own" } },
  { cue: 48, layout: MC, edges: [...MC_EDGES], accent: ["proposal"], badges: { proposal: "maker-checker" } },
  { cue: 49, layout: MC, edges: [...MC_EDGES], badges: { panelOperator: "maker", secondOperator: "checker" } },
  { cue: 50, layout: MC, edges: [...MC_EDGES], accent: ["platform"], packets: [{ from: "proposal", to: "platform", label: "unblock" }] },
  { cue: 51, layout: { platform: [0.5, 1], trusted: [2.5, 1] }, edges: [{ from: "platform", to: "trusted" }], accent: ["trusted"], badges: { trusted: "state from before" } },
  { cue: 52, layout: { platform: [0.5, 1], trusted: [2.5, 1] }, edges: [{ from: "platform", to: "trusted" }], accent: ["trusted"], badges: { trusted: "money phone · no MyID" } },
  { cue: 53, layout: NOTIFY, edges: [...NOTIFY_EDGES], packets: [{ from: "platform", to: "smsService", label: "account unblocked" }, { from: "platform", to: "pushService", label: "account unblocked", delay: 30 }] },
  { cue: 54, layout: BOTH, edges: [...BOTH_EDGES], accent: ["secondOperator"], badges: { phoneReview: "approval: two", valkey: "reset: two" } },
  { cue: 55, layout: { panelOperator: [0.5, 1], phoneReview: [2.5, 1] }, edges: [{ from: "panelOperator", to: "phoneReview" }], badges: { phoneReview: "reject: one operator" } },
  // The check.
  { cue: 56, layout: CHECK, edges: [...CHECK_EDGES], badges: { panelOperator: "block: one", secondOperator: "unblock: two", adminGw: "why?" } },
  { cue: 57, layout: CHECK, edges: [...CHECK_EDGES], accent: ["secondOperator"], badges: { panelOperator: "takes access away", secondOperator: "gives it back" } },
  // Summary and hand-off.
  { cue: 58, layout: DOOR, edges: [...DOOR_EDGES], accent: ["staffId"], badges: { staffId: "second factor · one role" } },
  { cue: 59, layout: ACT, edges: [...ACT_EDGES], accent: ["adminGw"], badges: { adminGw: "review · block · unblock · reset" } },
  { cue: 60, layout: CHECK, edges: [...CHECK_EDGES], badges: { panelOperator: "block: at once", secondOperator: "access back: approves" } },
  { cue: 61, layout: TRAIL1, edges: [...TRAIL1_EDGES], accent: ["auditTrail"], badges: { auditTrail: "reason · audit event" } },
  { cue: 62, layout: LAST, edges: [...LAST_EDGES], packets: [{ from: "pushService", to: "trusted", label: "account blocked" }], badges: { finder: "one night" } },
  { cue: 63, layout: LAST, edges: [...LAST_EDGES], accent: ["pushService"], badges: { pushService: "lesson 20" } },
];
