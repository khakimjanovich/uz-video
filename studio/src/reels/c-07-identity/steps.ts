import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 7: two proofs on every call. One story carries it: a Friday-night call to Timur's card zone that only says "I am ecom".
// The claim (cues 0–4), the bridge from lesson 6 (5–6), Timur's way into the bank (7–10), the certificate (11–16),
// the access token and its roles (17–28), why one proof is not enough (29–30), Timur's log (31–43), three refusals (44–48),
// its own pass office (49–50), what it protects (51–54), Saturday's log (55), next (56).
const CALL = { m01Ecom: [0, 1.6], partnerdoor: [1.5, 1.6], m01CardZone: [3, 1.6] } as const;
const CALL_EDGES = [{ from: "m01Ecom", to: "partnerdoor" }, { from: "partnerdoor", to: "m01CardZone" }] as const;
const OFFICE = { m01Visitor: [0, 1], m01PassOffice: [1.7, 0], m01Reception: [1.7, 2] } as const;
const OFFICE_EDGES = [{ from: "m01PassOffice", to: "m01Visitor" }, { from: "m01Reception", to: "m01Visitor" }] as const;
const CERT = { ...CALL, m01PassOffice: [1.5, 0] } as const;
const CERT_EDGES = [...CALL_EDGES, { from: "m01PassOffice", to: "m01Ecom" }, { from: "m01PassOffice", to: "m01CardZone" }] as const;
const LOGIN = { ...CALL, m01Login: [1.5, 0] } as const;
const LOGIN_EDGES = [...CALL_EDGES, { from: "m01Login", to: "m01Ecom" }] as const;
const OTHER = { ...LOGIN, m01OtherLogin: [0, 0] } as const;
const ROLES = { m01AccessToken: [0.3, 1], m01RoleBind: [2.6, 0], m01RoleRead: [2.6, 1], m01RoleCharge: [2.6, 2] } as const;
const ROLE_EDGES = (["m01RoleBind", "m01RoleRead", "m01RoleCharge"] as const).map((to) => ({ from: "m01AccessToken" as const, to }));
const KNOCK = { m01Caller: [0, 1.6], partnerdoor: [1.5, 1.6], m01CardZone: [3, 1.6] } as const;
const KNOCK_EDGES = [{ from: "m01Caller", to: "partnerdoor" }, { from: "partnerdoor", to: "m01CardZone" }] as const;
const WRONG_PASS = { ...KNOCK, m01OtherLogin: [0, 0] } as const;
const WRONG_EDGES = [...KNOCK_EDGES, { from: "m01OtherLogin", to: "m01Caller", label: "pass" }] as const;
const STEAL = { attacker: [0, 1.6], partnerdoor: [1.5, 1.6], m01CardZone: [3, 1.6] } as const;
const STEAL_EDGES = [{ from: "attacker", to: "partnerdoor" }, { from: "partnerdoor", to: "m01CardZone" }] as const;
const THREE = { m01NoConn: [0, 0.6], m01Unauth: [1.5, 0.6], m01Forbidden: [3, 0.6] } as const;
const ZONE_WALL = { label: "Card zone", from: [1.5, 1.6], to: [3, 1.6], tone: "wall" } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Friday night: a call that only says who it is.
  { cue: 0, layout: { m01Claim: [0.4, 1], m01CardZone: [2.6, 1] }, edges: [{ from: "m01Claim", to: "m01CardZone" }], badges: { m01CardZone: "Timur's · Fri 23:00" } },
  { cue: 1, layout: { m01Claim: [0.4, 1], m01CardZone: [2.6, 1] }, edges: [{ from: "m01Claim", to: "m01CardZone" }], packets: [{ from: "m01Claim", to: "m01CardZone", label: "call" }] },
  { cue: 2, layout: { m01Claim: [0.4, 1], m01CardZone: [2.6, 1] }, edges: [{ from: "m01Claim", to: "m01CardZone" }], packets: [{ from: "m01Claim", to: "m01CardZone", label: "I am ecom" }], badges: { m01CardZone: "really ecom?" } },
  { cue: 3, layout: { attacker: [0.4, 1], m01Claim: [2.6, 1] }, edges: [{ from: "attacker", to: "m01Claim" }], packets: [{ from: "attacker", to: "m01Claim", label: "I am ecom" }], badges: { attacker: "anyone" } },
  { cue: 4, layout: { m01HomeBadge: [1.5, 1] }, crossed: ["m01HomeBadge"], badges: { m01HomeBadge: "proves nothing" } },
  // How Timur gets into the bank.
  { cue: 7, layout: OFFICE, badges: { m01Visitor: "Timur" } },
  { cue: 8, layout: OFFICE, edges: [...OFFICE_EDGES], packets: [{ from: "m01PassOffice", to: "m01Visitor", label: "ID card" }], badges: { m01Visitor: "Timur", m01PassOffice: "the building's own" } },
  {
    cue: 9,
    layout: { m01Visitor: [0, 1], m01PassOffice: [1.5, 0], m01Reception: [1.5, 2], m01Lift: [3, 1] },
    edges: [...OFFICE_EDGES, { from: "m01Visitor", to: "m01Lift" }],
    packets: [{ from: "m01Reception", to: "m01Visitor", label: "day pass" }],
    badges: { m01Visitor: "Timur", m01Lift: "only his floors" },
  },
  { cue: 10, layout: CALL, edges: [...CALL_EDGES], packets: [{ from: "m01Ecom", to: "partnerdoor", label: "call" }], badges: { partnerdoor: "two proofs" } },
  // The first proof: a certificate, shown by both sides.
  { cue: 11, layout: CERT, edges: [...CERT_EDGES], packets: [{ from: "m01PassOffice", to: "m01Ecom", label: "certificate" }], badges: { m01PassOffice: "the card zone's" } },
  { cue: 12, layout: CERT, edges: [...CERT_EDGES], packets: [{ from: "m01Ecom", to: "partnerdoor", label: "certificate" }] },
  { cue: 13, layout: CERT, edges: [...CERT_EDGES], packets: [{ from: "partnerdoor", to: "m01Ecom", label: "certificate" }] },
  { cue: 14, layout: CERT, edges: [...CERT_EDGES], accent: ["m01Ecom", "m01CardZone"] },
  { cue: 15, layout: CERT, edges: [...CERT_EDGES], accent: ["m01Ecom", "m01CardZone"], badges: { partnerdoor: "mutual TLS" } },
  { cue: 16, layout: STEAL, edges: [...STEAL_EDGES], packets: [{ from: "attacker", to: "partnerdoor", label: "no certificate", stopAt: 0.6 }], badges: { partnerdoor: "refused unread" } },
  // The second proof: an access token, with roles.
  { cue: 17, layout: { m01AccessToken: [1.5, 1] }, accent: ["m01AccessToken"], badges: { m01AccessToken: "the day pass" } },
  {
    cue: 18,
    layout: LOGIN,
    edges: [...LOGIN_EDGES],
    packets: [{ from: "m01Ecom", to: "m01Login", label: "own secret" }, { from: "m01Login", to: "m01Ecom", label: "access token", delay: 55 }],
    badges: { m01Login: "the card zone's" },
  },
  { cue: 19, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["m01Login"], badges: { m01Login: "the only one trusted" } },
  { cue: 20, layout: OTHER, edges: [...LOGIN_EDGES], crossed: ["m01OtherLogin"], badges: { m01OtherLogin: "worth nothing" } },
  { cue: 21, layout: { m01AccessToken: [1.5, 1] }, badges: { m01AccessToken: "who · roles" } },
  { cue: 22, layout: { m01AccessToken: [1.5, 1] }, badges: { m01AccessToken: "role = a floor" } },
  { cue: 23, layout: { m01AccessToken: ROLES.m01AccessToken, m01RoleBind: ROLES.m01RoleBind }, edges: [ROLE_EDGES[0]], accent: ["m01RoleBind"] },
  { cue: 24, layout: { m01AccessToken: ROLES.m01AccessToken, m01RoleBind: ROLES.m01RoleBind, m01RoleRead: ROLES.m01RoleRead }, edges: ROLE_EDGES.slice(0, 2), accent: ["m01RoleRead"] },
  { cue: 25, layout: ROLES, edges: ROLE_EDGES, accent: ["m01RoleCharge"] },
  {
    cue: 26,
    layout: CALL,
    edges: [...CALL_EDGES],
    packets: [{ from: "m01Ecom", to: "partnerdoor", label: "charge" }, { from: "m01Ecom", to: "partnerdoor", label: "not listed", delay: 60, stopAt: 0.75 }],
    badges: { partnerdoor: "a role each" },
  },
  { cue: 27, layout: CALL, edges: [...CALL_EDGES], badges: { m01Ecom: "bind · read · charge" } },
  { cue: 28, layout: { m01RoleAdmin: [1.5, 1] }, crossed: ["m01RoleAdmin"], badges: { m01RoleAdmin: "no caller holds it" } },
  // Why one proof is never enough.
  { cue: 29, layout: CERT, edges: [...CERT_EDGES], badges: { partnerdoor: "one proof only?" } },
  {
    cue: 30,
    layout: STEAL,
    edges: [...STEAL_EDGES],
    packets: [{ from: "attacker", to: "partnerdoor", label: "one stolen file" }, { from: "partnerdoor", to: "m01CardZone", label: "in", delay: 50 }],
    danger: ["m01CardZone"],
    badges: { attacker: "one proof: in" },
  },
  // Timur's log for Friday night.
  { cue: 31, layout: CALL, edges: [...CALL_EDGES], frames: [ZONE_WALL], badges: { m01CardZone: "Timur's log" } },
  { cue: 32, layout: KNOCK, edges: [...KNOCK_EDGES], frames: [ZONE_WALL], packets: [{ from: "m01Caller", to: "partnerdoor", label: "no certificate", stopAt: 0.7 }] },
  { cue: 33, layout: KNOCK, edges: [{ from: "m01Caller", to: "partnerdoor", broken: true }, KNOCK_EDGES[1]], frames: [ZONE_WALL], badges: { partnerdoor: "closed at once" } },
  { cue: 34, layout: KNOCK, edges: [{ from: "m01Caller", to: "partnerdoor", broken: true }, KNOCK_EDGES[1]], frames: [ZONE_WALL], badges: { m01CardZone: "nothing answered" } },
  { cue: 35, layout: WRONG_PASS, edges: [...WRONG_EDGES], frames: [ZONE_WALL], packets: [{ from: "m01Caller", to: "partnerdoor", label: "certificate · pass" }] },
  { cue: 36, layout: WRONG_PASS, edges: [...WRONG_EDGES], frames: [ZONE_WALL], packets: [{ from: "partnerdoor", to: "m01Caller", label: "unauthorized" }], danger: ["m01Caller"] },
  { cue: 37, layout: WRONG_PASS, edges: [...WRONG_EDGES], frames: [ZONE_WALL], crossed: ["m01OtherLogin"], badges: { m01OtherLogin: "counts for nothing" } },
  { cue: 38, layout: CALL, edges: [...CALL_EDGES], frames: [ZONE_WALL], badges: { m01Ecom: "both proofs" } },
  { cue: 39, layout: CALL, edges: [...CALL_EDGES], frames: [ZONE_WALL], packets: [{ from: "m01Ecom", to: "partnerdoor", label: "charge: token" }], badges: { m01Ecom: "Malika's shop" } },
  { cue: 40, layout: CALL, edges: [...CALL_EDGES], frames: [ZONE_WALL], packets: [{ from: "partnerdoor", to: "m01CardZone", label: "charge" }], accent: ["m01CardZone"], badges: { m01CardZone: "role: charge" } },
  { cue: 41, layout: CALL, edges: [...CALL_EDGES], frames: [ZONE_WALL], packets: [{ from: "m01Ecom", to: "partnerdoor", label: "search cards" }] },
  { cue: 42, layout: CALL, edges: [...CALL_EDGES], frames: [ZONE_WALL], badges: { partnerdoor: "both proofs pass" } },
  {
    cue: 43,
    layout: CALL,
    edges: [...CALL_EDGES],
    frames: [ZONE_WALL],
    packets: [{ from: "partnerdoor", to: "m01CardZone", label: "search cards", stopAt: 0.6 }, { from: "partnerdoor", to: "m01Ecom", label: "forbidden", delay: 50 }],
    badges: { m01CardZone: "no admin role" },
  },
  // Three refusals, three reasons.
  { cue: 44, layout: THREE },
  { cue: 45, layout: THREE, accent: ["m01NoConn"], badges: { m01NoConn: "no certificate" } },
  { cue: 46, layout: THREE, accent: ["m01Unauth"], badges: { m01NoConn: "no certificate", m01Unauth: "a bad pass" } },
  { cue: 47, layout: THREE, accent: ["m01Forbidden"], badges: { m01NoConn: "no certificate", m01Unauth: "a bad pass", m01Forbidden: "a missing role" } },
  {
    cue: 48,
    layout: { ...THREE, m01Operator: [1.5, 2.1] },
    edges: [{ from: "m01NoConn", to: "m01Operator" }, { from: "m01Unauth", to: "m01Operator" }, { from: "m01Forbidden", to: "m01Operator" }],
    badges: { m01Operator: "Timur: which check" },
  },
  // Its own pass office and login server.
  {
    cue: 50,
    layout: { m01Ecom: [0.3, 1], m01PassOffice: [2.7, 0.3], m01Login: [2.7, 1.8] },
    frames: [{ label: "Card zone", from: [2.7, 0.3], to: [2.7, 1.8], tone: "wall" }],
    badges: { m01Ecom: "hands out no passes" },
  },
  // What it protects.
  { cue: 51, layout: STEAL, edges: [...STEAL_EDGES], frames: [ZONE_WALL], packets: [{ from: "attacker", to: "partnerdoor", label: "certificate only", stopAt: 0.75 }], badges: { attacker: "no pass" } },
  { cue: 52, layout: STEAL, edges: [...STEAL_EDGES], frames: [ZONE_WALL], packets: [{ from: "attacker", to: "partnerdoor", label: "pass only", stopAt: 0.4 }], badges: { attacker: "cannot connect" } },
  {
    cue: 53,
    layout: { attacker: [0.3, 1], m01RoleCharge: [2.6, 0.3], m01RoleAdmin: [2.6, 1.8] },
    edges: [{ from: "attacker", to: "m01RoleCharge" }, { from: "attacker", to: "m01RoleAdmin", broken: true }],
    badges: { attacker: "both, from ecom", m01RoleCharge: "ecom's floors" },
  },
  { cue: 54, layout: { m01Ecom: [0.3, 1], m01CardZone: [2.7, 1] }, edges: [{ from: "m01CardZone", to: "m01Ecom", label: "roles" }], accent: ["m01CardZone"], badges: { m01CardZone: "only it grants roles" } },
  // Saturday: Timur reads the log.
  {
    cue: 55,
    layout: { ...THREE, m01Operator: [1.5, 2.1] },
    edges: [{ from: "m01NoConn", to: "m01Operator" }, { from: "m01Unauth", to: "m01Operator" }, { from: "m01Forbidden", to: "m01Operator" }],
    accent: ["m01NoConn", "m01Unauth", "m01Forbidden"],
    badges: { m01Operator: "Timur · Sat", m01NoConn: "no certificate", m01Unauth: "a bad pass", m01Forbidden: "a missing role" },
  },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the one before.
  { cue: 5, part: 2, current: ["vault", "cardsinfra"] },
  { cue: 6, part: 2, current: ["payment", "card", "cardsinfra"] },
  { cue: 49, part: 2, current: ["cardsinfra", "keycloak", "vault"], units: { cards: "own passes", ecom: "a caller" } },
  { cue: 56, part: 2, current: ["adapters", "procsvc"], units: { cards: "card networks" } },
];
