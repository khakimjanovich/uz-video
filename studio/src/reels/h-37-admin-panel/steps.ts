import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 37: the administrator panel. One button, a lot of power (0–5); the door and the admin gateway
// (6–11); four roles (12–20); the operator's screen (21–29); maker-checker (30–40); the close (41–46).
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 9, rows: [8], current: ["staff", "postgres", "kafka"], dot: "kafka", units: { heeyid: "lesson 36: every action an event" } },
  { cue: 5, part: 9, rows: [9], current: ["staff", "admingw"], dot: "staff", units: { heeyid: "the administrator panel" } },
  { cue: 10, part: 9, rows: [9], current: ["staff", "edge", "admingw", "keycloak"], dot: "admingw", units: UNIT },
  { cue: 11, part: 9, rows: [9], current: ["admingw", "custgw"], dot: "admingw", units: { heeyid: "one domain, two gateways" } },
  { cue: 46, part: 9, rows: [9], dot: "off", units: UNIT },
];

const POWER = { operator: [0.3, 1], platform: [1.7, 1], mobileBank: [3, 0.3], marketplace: [3, 1.7] } as const;
const POWER_EDGES = [{ from: "operator", to: "platform" }, { from: "platform", to: "mobileBank" }, { from: "platform", to: "marketplace" }] as const;
const DOOR = { operator: [0, 1], staffId: [1.5, 1], adminGw: [3, 1] } as const;
const DOOR_EDGES = [{ from: "operator", to: "staffId" }, { from: "staffId", to: "adminGw" }] as const;
const ROLES = { viewer: [0, 0.3], operator: [0, 1.7], secAdmin: [3, 0.3], compliance: [3, 1.7], adminGw: [1.5, 1] } as const;
const ROLES_EDGES = [{ from: "viewer", to: "adminGw" }, { from: "operator", to: "adminGw" }, { from: "secAdmin", to: "adminGw" }, { from: "compliance", to: "adminGw" }] as const;
const SCREEN = { operator: [0.3, 1], adminGw: [1.7, 1], aziz: [3, 1] } as const;
const SCREEN_EDGES = [{ from: "operator", to: "adminGw" }, { from: "adminGw", to: "aziz" }] as const;
const MC = { secAdmin: [0, 0.3], proposal: [1.5, 1], secAdmin2: [3, 0.3], versions: [3, 1.7] } as const;
const MC_EDGES = [{ from: "secAdmin", to: "proposal" }, { from: "secAdmin2", to: "proposal" }, { from: "proposal", to: "versions" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // One button, a lot of power.
  { cue: 0, layout: POWER, edges: [...POWER_EDGES], accent: ["operator"] },
  { cue: 1, layout: POWER, edges: [...POWER_EDGES], crossed: ["mobileBank", "marketplace"], packets: [{ from: "operator", to: "platform", label: "block" }] },
  { cue: 2, layout: POWER, edges: [...POWER_EDGES], badges: { operator: "one screen" } },
  { cue: 3, layout: POWER, edges: [...POWER_EDGES], badges: { operator: "who watches?" } },
  // The door: the bank's staff identity.
  { cue: 6, layout: DOOR, edges: [...DOOR_EDGES], accent: ["staffId"] },
  { cue: 7, layout: DOOR, edges: [...DOOR_EDGES], packets: [{ from: "operator", to: "staffId", label: "sign in + MFA" }] },
  { cue: 8, layout: DOOR, edges: [...DOOR_EDGES], badges: { adminGw: "no staff passwords" } },
  { cue: 9, layout: DOOR, edges: [...DOOR_EDGES], badges: { operator: "inactivity · lifetime" } },
  // Four roles, one each, checked on the server.
  { cue: 12, layout: ROLES, edges: [...ROLES_EDGES], badges: { adminGw: "one role each" } },
  { cue: 13, layout: { ...ROLES, staffId: [1.5, 2] }, edges: [...ROLES_EDGES, { from: "staffId", to: "adminGw" }], accent: ["staffId"], badges: { staffId: "or the staff-role table" } },
  { cue: 14, layout: ROLES, edges: [...ROLES_EDGES], accent: ["viewer"], badges: { viewer: "sees only" } },
  { cue: 15, layout: ROLES, edges: [...ROLES_EDGES], accent: ["operator"], badges: { operator: "acts on customers" } },
  { cue: 16, layout: ROLES, edges: [...ROLES_EDGES], accent: ["operator"], badges: { operator: "resets · closed accounts" } },
  { cue: 17, layout: ROLES, edges: [...ROLES_EDGES], accent: ["secAdmin"], badges: { secAdmin: "policies · providers · roles" } },
  { cue: 18, layout: ROLES, edges: [...ROLES_EDGES], accent: ["compliance"], badges: { compliance: "texts · exports" } },
  { cue: 19, layout: ROLES, edges: [...ROLES_EDGES], badges: { secAdmin: "cannot block", operator: "no policies" } },
  { cue: 20, layout: ROLES, edges: [...ROLES_EDGES], accent: ["adminGw"], badges: { adminGw: "role checked at each call" } },
  // The operator's screen: exact search, masked values, a reason for every action.
  { cue: 21, layout: SCREEN, edges: [...SCREEN_EDGES], accent: ["adminGw"] },
  { cue: 22, layout: SCREEN, edges: [...SCREEN_EDGES], packets: [{ from: "operator", to: "adminGw", label: "exact phone · exact ID number" }] },
  { cue: 23, layout: SCREEN, edges: [...SCREEN_EDGES], badges: { adminGw: "no search by name" } },
  { cue: 24, layout: SCREEN, edges: [...SCREEN_EDGES], badges: { aziz: "state · level · devices · sessions" } },
  { cue: 25, layout: SCREEN, edges: [...SCREEN_EDGES], badges: { aziz: "ID number: 2 + 2 · document: last 4" } },
  { cue: 26, layout: SCREEN, edges: [...SCREEN_EDGES], badges: { aziz: "no documents · addresses · images" } },
  { cue: 27, layout: SCREEN, edges: [...SCREEN_EDGES], accent: ["operator"], badges: { operator: "a written reason" } },
  { cue: 28, layout: { ...SCREEN, auditTrail: [1.7, 2] }, edges: [...SCREEN_EDGES, { from: "adminGw", to: "auditTrail" }], packets: [{ from: "adminGw", to: "auditTrail", label: "operator · action · reason" }, { from: "adminGw", to: "aziz", label: "notification", delay: 40 }] },
  { cue: 29, layout: { operator: [0.3, 1], caseFile: [2.4, 0.3], records: [2.4, 1.7] }, edges: [{ from: "operator", to: "caseFile" }, { from: "operator", to: "records" }], badges: { caseFile: "cases", records: "phone reviews" } },
  // Maker-checker: two people for every rule change.
  { cue: 30, layout: MC, edges: [...MC_EDGES], accent: ["proposal"] },
  { cue: 31, layout: { secAdmin: [0.5, 1], proposal: [2.5, 1] }, edges: [{ from: "secAdmin", to: "proposal" }], accent: ["secAdmin"], badges: { secAdmin: "shorter code lifetime" } },
  { cue: 32, layout: { secAdmin: [0.5, 1], proposal: [2.5, 1] }, edges: [{ from: "secAdmin", to: "proposal" }], badges: { proposal: "not yet" } },
  { cue: 33, layout: { secAdmin: [0.5, 1], proposal: [2.5, 1] }, edges: [{ from: "secAdmin", to: "proposal" }], accent: ["proposal"], badges: { proposal: "current · proposed" } },
  { cue: 34, layout: MC, edges: [...MC_EDGES.slice(0, 2)], accent: ["secAdmin2"] },
  { cue: 35, layout: MC, edges: [...MC_EDGES.slice(0, 2), { from: "proposal", to: "secAdmin", label: "approve own", broken: true }], crossed: ["secAdmin"], badges: { secAdmin2: "same role, other person" } },
  { cue: 36, layout: MC, edges: [...MC_EDGES], accent: ["secAdmin2"], packets: [{ from: "secAdmin2", to: "proposal", label: "approve" }] },
  { cue: 37, layout: MC, edges: [...MC_EDGES], accent: ["versions"], badges: { versions: "proposer · approver · times · reason" } },
  { cue: 38, layout: MC, edges: [...MC_EDGES], badges: { proposal: "rejected: kept", versions: "earlier version again" } },
  { cue: 39, layout: MC, edges: [...MC_EDGES], badges: { proposal: "providers · texts · templates · roles" } },
  { cue: 40, layout: { secAdmin: [0.5, 1], proposal: [2.5, 1] }, edges: [{ from: "secAdmin", to: "proposal", broken: true }], danger: ["secAdmin"], badges: { secAdmin: "tired or stolen", proposal: "alone: no" } },
  // Recap and the open question.
  { cue: 41, layout: DOOR, edges: [...DOOR_EDGES], accent: ["staffId"] },
  { cue: 42, layout: ROLES, edges: [...ROLES_EDGES], accent: ["viewer", "operator", "secAdmin", "compliance"] },
  { cue: 43, layout: MC, edges: [...MC_EDGES], accent: ["secAdmin", "secAdmin2"] },
  { cue: 44, layout: SCREEN, edges: [...SCREEN_EDGES], accent: ["aziz"], badges: { aziz: "real customers" } },
  { cue: 45, layout: { aziz: [1.5, 1] }, badges: { aziz: "without a real identity?" } },
];
