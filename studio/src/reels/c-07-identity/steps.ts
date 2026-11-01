import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 7: two proofs on every call. The office building (cues 0–2), the certificate (3–4),
// the access token and its roles (5–7), one proof is not enough (8), its own pass office (9), the close (10).
const CALL = { m01Ecom: [0, 1.6], partnerdoor: [1.5, 1.6], m01CardZone: [3, 1.6] } as const;
const CALL_EDGES = [{ from: "m01Ecom", to: "partnerdoor" }, { from: "partnerdoor", to: "m01CardZone" }] as const;
const OFFICE = { m01Visitor: [0, 1], m01PassOffice: [1.7, 0], m01Reception: [1.7, 2] } as const;
const OFFICE_EDGES = [{ from: "m01PassOffice", to: "m01Visitor" }, { from: "m01Reception", to: "m01Visitor" }] as const;
const CERT = { ...CALL, m01PassOffice: [1.5, 0] } as const;
const CERT_EDGES = [...CALL_EDGES, { from: "m01PassOffice", to: "m01Ecom" }, { from: "m01PassOffice", to: "m01CardZone" }] as const;
const LOGIN = { ...CALL, m01Login: [1.5, 0] } as const;
const LOGIN_EDGES = [...CALL_EDGES, { from: "m01Login", to: "m01Ecom" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Does this call really come from ecom?
  { cue: 0, layout: { m01Ecom: [0.3, 1], m01CardZone: [2.7, 1] }, edges: [{ from: "m01Ecom", to: "m01CardZone" }], packets: [{ from: "m01Ecom", to: "m01CardZone", label: "call" }], badges: { m01CardZone: "really ecom?" } },
  // The office building.
  {
    cue: 1,
    layout: OFFICE,
    edges: [...OFFICE_EDGES],
    packets: [{ from: "m01PassOffice", to: "m01Visitor", label: "ID card" }, { from: "m01Reception", to: "m01Visitor", label: "day pass", delay: 70 }],
    badges: { m01Reception: "floors 2 · 5" },
  },
  { cue: 2, layout: CALL, edges: [...CALL_EDGES], packets: [{ from: "m01Ecom", to: "partnerdoor", label: "call" }], badges: { partnerdoor: "two proofs" } },
  // The first proof: a certificate, shown by both sides.
  { cue: 3, layout: CERT, edges: [...CERT_EDGES], packets: [{ from: "m01PassOffice", to: "m01Ecom", label: "certificate" }], badges: { m01PassOffice: "the card zone's" } },
  {
    cue: 4,
    layout: CERT,
    edges: [...CERT_EDGES],
    packets: [{ from: "m01Ecom", to: "partnerdoor", label: "certificate" }, { from: "partnerdoor", to: "m01Ecom", label: "certificate", delay: 50 }],
    badges: { partnerdoor: "mutual TLS" },
  },
  // The second proof: an access token with roles.
  { cue: 5, layout: LOGIN, edges: [...LOGIN_EDGES], packets: [{ from: "m01Login", to: "m01Ecom", label: "access token" }], badges: { m01Login: "the card zone's" } },
  { cue: 6, layout: { m01AccessToken: [1.5, 1] }, accent: ["m01AccessToken"], badges: { m01AccessToken: "roles = floors" } },
  {
    cue: 7,
    layout: CALL,
    edges: [...CALL_EDGES],
    packets: [{ from: "m01Ecom", to: "partnerdoor", label: "charge" }, { from: "m01Ecom", to: "partnerdoor", label: "other", delay: 60, stopAt: 0.75 }],
    badges: { m01Ecom: "bind · read · charge" },
  },
  // One proof is not enough.
  {
    cue: 8,
    layout: { attacker: [0, 1.6], partnerdoor: [1.5, 1.6], m01CardZone: [3, 1.6] },
    edges: [{ from: "attacker", to: "partnerdoor" }, { from: "partnerdoor", to: "m01CardZone" }],
    packets: [{ from: "attacker", to: "partnerdoor", label: "one proof", stopAt: 0.6 }],
    badges: { attacker: "nothing" },
  },
];

export const map: BuildMapStep[] = [
  { cue: 9, part: 1, current: ["cardsinfra", "keycloak", "vault"], units: { cards: "own passes", ecom: "own logins" } },
  { cue: 10, part: 1, current: ["adapters", "procsvc"], units: { cards: "card networks" } },
];
