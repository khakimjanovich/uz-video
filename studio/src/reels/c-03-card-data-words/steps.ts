import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 3: what you may keep about a card. One story carries it: your bank on the phone.
// The call and the pasted ticket (cues 0–5), the PAN (6–7), the code on the back (8), the masked number (9),
// the card token (10–11), back to the ticket (12), the close (13–14).
const CARD_ZONE = ["frame", "card", "bin", "adapters", "cardsinfra"] as const;
const CALL = { issuer: [0.6, 1], masked: [2.6, 1] } as const;
const SPREAD = { supportTicket: [0.3, 1], backup: [2.6, 0], searchIndex: [2.6, 1], readers: [2.6, 2] } as const;
const SPREAD_EDGES = (["backup", "searchIndex", "readers"] as const).map((to) => ({ from: "supportTicket" as const, to }));
const COPIES = SPREAD_EDGES.map((e, k) => ({ ...e, label: "card number", delay: 10 + k * 25 }));
const MASK = { pan: [0.4, 1], masked: [2.6, 1] } as const;
const TOKEN = { pan: [0, 1], m01CardZone: [1.5, 1], m01Token: [3, 1] } as const;
const TOKEN_EDGES = [{ from: "pan", to: "m01CardZone" }, { from: "m01CardZone", to: "m01Token", label: "random" }] as const;
const FIXED = { supportTicket: [0, 1], masked: [1.7, 0.2], m01Token: [1.7, 1.8], pan: [3, 1] } as const;
const ROOM = { label: "Card zone", from: [3, 1], to: [3, 1], tone: "wall" } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Your bank on the phone, and the pasted ticket.
  { cue: 0, layout: { pan: [1.5, 1] } },
  { cue: 1, layout: CALL, edges: [{ from: "issuer", to: "masked", label: "says" }], badges: { masked: "card ending 7890" } },
  { cue: 2, layout: { ...CALL, backCode: [1.6, 2] }, edges: [{ from: "issuer", to: "masked", label: "says" }], crossed: ["backCode"], badges: { backCode: "never asked" } },
  { cue: 3, layout: { supportTicket: [1.5, 1] }, danger: ["supportTicket"], badges: { supportTicket: "whole card number" } },
  { cue: 4, layout: SPREAD, edges: SPREAD_EDGES, packets: COPIES, danger: ["supportTicket"] },
  { cue: 5, layout: CALL, edges: [{ from: "issuer", to: "masked", label: "says" }], accent: ["issuer"], badges: { masked: "card ending 7890" } },
  // The PAN lives in one place only.
  { cue: 6, layout: { pan: [1.5, 1] }, accent: ["pan"] },
  // The code on the back, then the masked number.
  { cue: 8, layout: { backCode: [1.5, 1] }, crossed: ["backCode"], badges: { backCode: "never kept" } },
  { cue: 9, layout: MASK, edges: [{ from: "pan", to: "masked", label: "first 6 · last 4" }], accent: ["masked"], badges: { masked: "screens · reports" } },
  // The card token.
  { cue: 10, layout: TOKEN, edges: [...TOKEN_EDGES], packets: [{ from: "m01CardZone", to: "m01Token", label: "random name" }], accent: ["m01Token"] },
  {
    cue: 11,
    layout: { ...TOKEN, attacker: [3, 2.2] },
    edges: [...TOKEN_EDGES],
    packets: [{ from: "m01Token", to: "attacker", label: "?", stopAt: 0.5 }],
    badges: { m01Token: "nothing from the number" },
  },
  // Back to the ticket.
  { cue: 12, layout: FIXED, edges: [{ from: "supportTicket", to: "masked" }, { from: "supportTicket", to: "m01Token" }], accent: ["masked", "m01Token"], crossed: ["pan"] },
  // The close.
  { cue: 13, layout: { masked: [0.4, 0.3], m01Token: [0.4, 1.7], m01CardZone: [3, 1] }, frames: [ROOM], accent: ["masked", "m01Token"], badges: { m01CardZone: "PAN" } },
];

export const map: BuildMapStep[] = [
  { cue: 7, part: 0, current: [...CARD_ZONE], units: { cards: "PAN only here" } },
  { cue: 14, part: 0, current: ["card"], units: { cards: "card numbers" } },
];
