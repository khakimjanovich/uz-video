import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 13: card testing and the velocity limit. One story carries it: a thief with a bag of keys.
// The bag of keys (cues 0–4), card testing (5–7), new sessions (8–9), written down first (10–13),
// the velocity limit (14–17), the alert (18), the rules in code (19–23), the close (24–25).
const DOORS = { attacker: [0, 1], session: [1.5, 0.3], session2: [1.5, 1.7] } as const;
const DOOR_EDGES = [{ from: "attacker", to: "session" }, { from: "attacker", to: "session2" }] as const;
const TESTING = { attacker: [0, 1], frame: [1, 1], card: [2, 1], network: [3, 1], buyer: [3, 2.2] } as const;
const TESTING_EDGES = [{ from: "attacker", to: "frame" }, { from: "frame", to: "card" }, { from: "card", to: "network" }] as const;
const TRIES = ["card 1", "card 2", "card 3"].map((label, k) => ({ from: "attacker" as const, to: "frame" as const, label, delay: k * 25 }));
const FIRST = { attacker: [0, 1], card: [1.4, 1], attempts: [1.4, 2.2], network: [3, 1] } as const;
const FIRST_EDGES = [{ from: "attacker", to: "card" }, { from: "card", to: "attempts" }, { from: "card", to: "network" }] as const;
const COUNTERS = { ctCard: [0.7, 0.3], ctBin: [2.3, 0.3], ctAddress: [0.7, 1.7], ctShop: [2.3, 1.7] } as const;
const ALERT_EDGES = [{ from: "card", to: "grafana" }, { from: "grafana", to: "mail" }] as const;
const ZONE = { label: "Card zone", from: [3, 1], to: [3, 1], tone: "wall" } as const;
const STOPPED_EDGES = [...DOOR_EDGES, { from: "session", to: "card" }, { from: "session2", to: "card" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // The bag of keys.
  { cue: 0, layout: { attacker: [1.5, 1] } },
  { cue: 1, layout: { attacker: [1.5, 1] }, badges: { attacker: "bag of keys" } },
  { cue: 2, layout: DOORS, edges: [{ from: "attacker", to: "session" }], packets: ["key 1", "key 2", "key 3"].map((label, k) => ({ from: "attacker", to: "session", label, delay: k * 20 })) },
  {
    cue: 3,
    layout: DOORS,
    edges: [...DOOR_EDGES],
    crossed: ["session"],
    packets: [{ from: "attacker", to: "session2", label: "key 4", delay: 30 }],
    badges: { session: "locked" },
  },
  { cue: 4, layout: DOORS, edges: [...DOOR_EDGES], badges: { attacker: "stolen cards", session: "door", session2: "door" } },
  // Card testing.
  { cue: 5, layout: TESTING, edges: [...TESTING_EDGES], packets: TRIES, badges: { attacker: "10,000 cards" } },
  { cue: 6, layout: TESTING, edges: [...TESTING_EDGES], packets: TRIES, danger: ["attacker"], badges: { attacker: "card testing" } },
  {
    cue: 7,
    layout: TESTING,
    edges: [...TESTING_EDGES, { from: "network", to: "buyer" }],
    packets: [{ from: "card", to: "network", label: "try" }, { from: "network", to: "buyer", label: "code", delay: 40 }],
    badges: { buyer: "real person" },
  },
  // A new session is one click away.
  { cue: 8, layout: DOORS, edges: [...DOOR_EDGES], crossed: ["session"], badges: { session: "a few tries" } },
  { cue: 9, layout: DOORS, edges: [...DOOR_EDGES], crossed: ["session"], accent: ["session2"], packets: TRIES.map((p) => ({ ...p, to: "session2" as const })) },
  // Written down first.
  {
    cue: 10,
    layout: FIRST,
    edges: [...FIRST_EDGES],
    packets: [{ from: "card", to: "attempts", label: "attempt" }, { from: "card", to: "network", label: "?", delay: 60 }],
    accent: ["attempts"],
  },
  { cue: 11, layout: FIRST, edges: [...FIRST_EDGES], badges: { attempts: "fingerprint · first digits" } },
  { cue: 12, layout: FIRST, edges: [...FIRST_EDGES], badges: { attempts: "+ address · shop" } },
  { cue: 13, layout: COUNTERS, accent: ["ctCard", "ctBin", "ctAddress", "ctShop"] },
  // The velocity limit.
  { cue: 14, layout: COUNTERS, badges: { ctCard: "limit / window", ctBin: "limit / window", ctAddress: "limit / window", ctShop: "limit / window" } },
  { cue: 15, layout: COUNTERS, danger: ["ctAddress"], shake: { ctAddress: 0.4 }, badges: { ctAddress: "refused" } },
  { cue: 16, layout: { ctCard: [0.6, 1], network: [2.6, 1] }, badges: { ctCard: "wrong code: counts" } },
  { cue: 17, layout: { ctCard: [0.6, 1], network: [2.6, 1] }, crossed: ["network"], badges: { ctCard: "wrong code: counts", network: "down: not counted" } },
  // The alert.
  {
    cue: 18,
    layout: { card: [0.3, 1], grafana: [1.7, 1], mail: [3, 1] },
    edges: [...ALERT_EDGES],
    packets: [{ from: "card", to: "grafana", label: "refused" }, { from: "grafana", to: "mail", label: "alert", delay: 45 }],
  },
  // Count the keys, not the doors.
  { cue: 24, layout: { ...DOORS, card: [3, 1] }, edges: [...STOPPED_EDGES], frames: [ZONE], accent: ["card"], badges: { card: "counts the keys" } },
];

export const map: BuildMapStep[] = [{ cue: 25, part: 3, current: ["partner", "commission", "epos", "payment", "reconciliation"], units: { ecom: "next" } }];

// The one check (the laptop demo needs a running stack; the brief's fallback is this card): the rules, as written.
export const code: CodeStep[] = [
  {
    cue: 19,
    file: "cards/modules/card/…/card/service/impl/VelocityRules.java",
    lines: [
      " * The fraud limits (card testing): attempts in flight, codes sent and not",
      "    confirmed, and refusals",
      " * are counted per card, per BIN, per payer address and per the caller's",
      "    riskReference, and past the",
      " * caller's limit within its window a new one is refused before any scheme is",
      "    asked",
      " * (VELOCITY_LIMITED, with Retry-After), until the oldest leave the window.",
      "    Every limit and window",
      " * is the caller's setting. …",
    ],
    at: [27, null, 28, null, 29, null, 30, null, 31],
    small: true,
    beats: [{ cue: 20, highlight: [1, 2, 3, 4] }, { cue: 21, highlight: [5, 6, 7, 8] }],
  },
  {
    cue: 22,
    file: "cards/modules/card/…/card/service/impl/VelocityRules.java",
    lines: [
      "  /** What says nothing about the card or the payer: our own state or our own",
      "     unavailability. */",
      "  private static final Set<CardExceptionStatus> NOT_COUNTED =",
      "      EnumSet.of(",
      "          CardExceptionStatus.SESSION_INVALID,",
      "          CardExceptionStatus.SESSION_ATTEMPTS_EXCEEDED,",
      "          CardExceptionStatus.CARD_PROCESSOR_UNAVAILABLE,",
      "          CardExceptionStatus.VELOCITY_LIMITED);",
      "…",
      "  /** A new session for this riskReference: refused while it is past the",
      "     caller's limit. */",
      "  void checkReference(Caller caller, @Nullable String riskReference) {",
      "    …",
      "      throw refused(caller, \"reference\", rule);",
    ],
    at: [39, null, 40, 41, 42, 43, 44, 45, null, 53, null, 54, null, 60],
    small: true,
    highlight: [1, 2, 3, 7],
    beats: [{ cue: 23, highlight: [10, 11, 14] }],
  },
];
