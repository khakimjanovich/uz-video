import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 3: what you may keep about a card. One story carries it: your bank on the phone.
// The call and the pasted ticket (cues 0–6), the PAN and the code on the back (7–10), the masked number (11–13),
// the card token (14–17), back to the ticket (18–19), the check (20–26), the close (27–28).
const SPREAD = { supportTicket: [0.3, 1], backup: [2.6, 0], searchIndex: [2.6, 1], readers: [2.6, 2] } as const;
const SPREAD_EDGES = (["backup", "searchIndex", "readers"] as const).map((to) => ({ from: "supportTicket" as const, to }));
const COPIES = SPREAD_EDGES.map((e, k) => ({ ...e, label: "card number", delay: 10 + k * 25 }));
const MASK = { pan: [0.4, 1], masked: [2.6, 1] } as const;
const TOKEN = { pan: [0, 1], card: [1.5, 1], token: [3, 1] } as const;
const TOKEN_EDGES = [{ from: "pan", to: "card" }, { from: "card", to: "token", label: "random" }] as const;
const FIXED = { supportTicket: [0, 1], masked: [1.7, 0.2], token: [1.7, 1.8], pan: [3, 1] } as const;
const ROOM = { label: "Card vault", from: [3, 1], to: [3, 1], tone: "wall" } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Your bank on the phone, and the pasted ticket.
  { cue: 0, layout: { pan: [1.5, 1] } },
  { cue: 1, layout: { issuer: [0.6, 1], masked: [2.6, 1] }, edges: [{ from: "issuer", to: "masked", label: "says" }], badges: { masked: "card ending 7890" } },
  { cue: 2, layout: { issuer: [0.6, 1], masked: [2.6, 1], backCode: [1.6, 2] }, edges: [{ from: "issuer", to: "masked", label: "says" }], crossed: ["backCode"] },
  { cue: 3, layout: { supportTicket: [1.5, 1] }, danger: ["supportTicket"], badges: { supportTicket: "full card number" } },
  { cue: 4, layout: SPREAD, edges: SPREAD_EDGES, packets: COPIES },
  { cue: 5, layout: SPREAD, edges: SPREAD_EDGES, danger: ["supportTicket", "backup", "searchIndex", "readers"] },
  // The PAN and the code on the back.
  { cue: 7, layout: { pan: [1.5, 1] }, accent: ["pan"] },
  { cue: 8, layout: { pan: [0.4, 1], card: [2.6, 1] }, edges: [{ from: "pan", to: "card" }], frames: [{ ...ROOM, from: [2.6, 1], to: [2.6, 1] }], badges: { card: "only here" } },
  { cue: 9, layout: { backCode: [1.5, 1] }, crossed: ["backCode"], badges: { backCode: "never kept" } },
  { cue: 10, layout: { backCode: [1.5, 1] }, crossed: ["backCode"], badges: { backCode: "never asked" } },
  // The masked number.
  { cue: 11, layout: MASK, edges: [{ from: "pan", to: "masked", label: "first 6 · last 4" }], accent: ["masked"] },
  { cue: 12, layout: MASK, edges: [{ from: "pan", to: "masked", label: "first 6 · last 4" }], badges: { masked: "card ending 7890" } },
  { cue: 13, layout: { masked: [0.4, 1], issuer: [2.6, 1] }, edges: [{ from: "masked", to: "issuer", label: "first digits" }], badges: { issuer: "Lesson 10" } },
  // The card token.
  { cue: 14, layout: TOKEN, edges: [...TOKEN_EDGES], accent: ["token"] },
  { cue: 15, layout: TOKEN, edges: [...TOKEN_EDGES], packets: [{ from: "card", to: "token", label: "random name" }] },
  { cue: 16, layout: TOKEN, edges: [...TOKEN_EDGES], badges: { token: "nothing from the number" } },
  { cue: 17, layout: TOKEN, edges: [...TOKEN_EDGES], badges: { token: "coat-check ticket" } },
  // Back to the ticket.
  { cue: 18, layout: { supportTicket: [1.5, 1] }, danger: ["supportTicket"] },
  {
    cue: 19,
    layout: FIXED,
    edges: [{ from: "supportTicket", to: "masked" }, { from: "supportTicket", to: "token" }],
    accent: ["masked", "token"],
    crossed: ["pan"],
  },
  // The close.
  { cue: 27, layout: { masked: [0.4, 0.3], token: [0.4, 1.7], card: [3, 1] }, frames: [ROOM], accent: ["masked", "token"], badges: { card: "PAN" } },
];

export const map: BuildMapStep[] = [{ cue: 28, part: 0, current: ["card"], units: { cards: "card numbers" } }];

// The lines the check copies, then the check itself: a masked number and a token by hand. The number is made up.
export const code: CodeStep[] = [
  {
    cue: 21,
    file: "cards/modules/card/…/card/constant/CardConstants.java",
    lines: [
      "  /** PCI DSS lets the first six and the last four digits be shown; nothing in between. */",
      "  public static final int SHOWN_FIRST = 6;",
      "",
      "  public static final int SHOWN_LAST = 4;",
    ],
    at: 43,
    highlight: [2, 4],
  },
  {
    cue: 22,
    file: "cards/modules/card/…/card/entity/Card.java",
    lines: [
      "    var bytes = new byte[CardConstants.TOKEN_BYTES];",
      "    RANDOM.nextBytes(bytes);",
      "    card.token = CardConstants.TOKEN_PREFIX + HexFormat.of().formatHex(bytes);",
    ],
    at: 54,
    small: true,
    highlight: [3],
  },
  {
    cue: 23,
    file: "terminal · jshell",
    lines: [
      "$ jshell -q",
      "jshell> var n = \"1234560000007890\"",
      "jshell> n.substring(0, 6) + \"******\" + n.substring(12)",
      "$2 ==> \"123456******7890\"",
      "jshell> var b = new byte[16]",
      "jshell> new java.security.SecureRandom().nextBytes(b)",
      "jshell> \"ctk_\" + java.util.HexFormat.of().formatHex(b)",
      "$5 ==> \"ctk_4e097ee6ff0c35bb7a5026324246f6c3\"",
      "jshell> new java.security.SecureRandom().nextBytes(b)",
      "jshell> \"ctk_\" + java.util.HexFormat.of().formatHex(b)",
      "$7 ==> \"ctk_d04628d9d4284031602f4ce4f5ad842e\"",
    ],
    small: true,
    upTo: 2,
    beats: [{ cue: 24, upTo: 4, highlight: [4] }, { cue: 25, upTo: 8, highlight: [8] }, { cue: 26, highlight: [8, 11] }],
  },
];
