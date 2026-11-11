import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 28: address sharing. The bookshelf (cues 0–4); the bridge (5–6, map); the wall (7–14); the request
// (15–31); refuse and no answer (32–35); no standing consent (36–41); deletion (42–45); what it does not do
// (46–50); the close (51–57).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 5, part: 6, rows: [6], current: ["mobile", "sideapps"], dot: "mobile", units: { heeyid: "lesson 27: linked" } },
  { cue: 6, part: 6, current: ["sideapps", "custgw", "vault", "postgres"], dot: "postgres", units: { heeyid: "the verified identity" } },
  { cue: 12, part: 6, current: ["postgres", "vault"], dot: "postgres", units: { heeyid: "protected record" } },
  { cue: 13, part: 6, current: ["vault", "kafka"], dot: "vault", units: { heeyid: "bank's keys · each read audited" } },
  { cue: 57, part: 6, rows: [6, 7], dot: "off", current: ["mobile", "sideapps"], units: { heeyid: "next: sessions and rank" } },
];

const ASK = { marketplace: [0, 1], platform: [1.5, 1], address: [3, 1] } as const;
const ASK_EDGES = [{ from: "marketplace", to: "platform" }, { from: "platform", to: "address" }] as const;
const RUN = { marketplace: [0.4, 0.4], platform: [1.7, 1], mobileBank: [0.4, 1.7], address: [3, 1] } as const;
const RUN_EDGES = [...ASK_EDGES, { from: "platform", to: "mobileBank" }] as const;
const WEB = { marketWeb: [0.4, 0.4], platform: [1.7, 1], mobileBank: [0.4, 1.7], address: [3, 1] } as const;
const WEB_EDGES = [{ from: "marketWeb", to: "platform" }, { from: "platform", to: "address" }, { from: "platform", to: "mobileBank" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The bookshelf and the question.
  { cue: 0, layout: { aziz: [0, 1], marketplace: [1.5, 1] }, edges: [{ from: "aziz", to: "marketplace" }], accent: ["marketplace"], badges: { marketplace: "bookshelf" } },
  { cue: 1, layout: { aziz: [0, 1], marketplace: [1.5, 1] }, edges: [{ from: "aziz", to: "marketplace" }], badges: { marketplace: "Add address" } },
  { cue: 2, layout: ASK, edges: [...ASK_EDGES], accent: ["address"], badges: { address: "from MyID" } },
  { cue: 3, layout: { ...ASK, mobileBank: [1.5, 2.1] }, edges: [...ASK_EDGES], badges: { platform: "same bank", marketplace: "same person" } },
  { cue: 4, layout: ASK, edges: [...ASK_EDGES], danger: ["marketplace"], badges: { marketplace: "why ask?" } },
  // The wall: the summary never holds an address.
  { cue: 7, layout: ASK, edges: [...ASK_EDGES], accent: ["marketplace"] },
  { cue: 8, layout: ASK, edges: [...ASK_EDGES], badges: { marketplace: "own tokens only" } },
  { cue: 10, layout: ASK, edges: [...ASK_EDGES], packets: [{ from: "platform", to: "marketplace", label: "level · phone · name" }], badges: { marketplace: "summary" } },
  { cue: 11, layout: ASK, edges: [{ from: "marketplace", to: "platform" }, { from: "platform", to: "address", broken: true }], badges: { marketplace: "no address" } },
  { cue: 14, layout: RUN, edges: [...RUN_EDGES], accent: ["mobileBank"], badges: { mobileBank: "Aziz approves" } },
  // The sharing request.
  { cue: 16, layout: RUN, edges: [...RUN_EDGES], packets: [{ from: "marketplace", to: "platform", label: "sharing request" }], badges: { marketplace: "marketplace token" } },
  { cue: 17, layout: RUN, edges: [...RUN_EDGES], accent: ["platform"], badges: { platform: "two checks" } },
  { cue: 18, layout: RUN, edges: [...RUN_EDGES], accent: ["platform"], badges: { platform: "level 2?" } },
  { cue: 19, layout: RUN, edges: [...RUN_EDGES], accent: ["platform"], badges: { platform: "level 2? · linked?" } },
  { cue: 20, layout: RUN, edges: [...RUN_EDGES], danger: ["marketplace"], badges: { platform: "no: not asked" } },
  { cue: 21, layout: RUN, edges: [...RUN_EDGES], packets: [{ from: "platform", to: "marketplace", label: "go to the mobile bank" }] },
  { cue: 22, layout: RUN, edges: [...RUN_EDGES], accent: ["platform"], badges: { platform: "level 2 ✓ · linked ✓" } },
  { cue: 23, layout: RUN, edges: [...RUN_EDGES], packets: [{ from: "platform", to: "mobileBank", label: "push signal" }], badges: { platform: "waits: configured time" } },
  { cue: 24, layout: RUN, edges: [...RUN_EDGES], badges: { mobileBank: "request id only" } },
  { cue: 25, layout: RUN, edges: [...RUN_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "pull request" }] },
  { cue: 26, layout: RUN, edges: [...RUN_EDGES], accent: ["mobileBank"], badges: { mobileBank: "Share your address?" } },
  { cue: 27, layout: RUN, edges: [...RUN_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "Share" }], badges: { mobileBank: "Share" } },
  { cue: 28, layout: RUN, edges: [...RUN_EDGES], accent: ["address"], badges: { address: "purpose: address sharing" } },
  { cue: 29, layout: RUN, edges: [...RUN_EDGES], accent: ["platform"], badges: { platform: "audit: reader + purpose" } },
  { cue: 30, layout: RUN, edges: [...RUN_EDGES], packets: [{ from: "platform", to: "marketplace", label: "address, one time" }], badges: { marketplace: "saved" } },
  // Refuse, or no answer.
  { cue: 32, layout: RUN, edges: [...RUN_EDGES] },
  { cue: 33, layout: RUN, edges: [...RUN_EDGES], crossed: ["address"], packets: [{ from: "mobileBank", to: "platform", label: "Refuse" }], badges: { marketplace: "refusal · nothing saved" } },
  { cue: 34, layout: RUN, edges: [...RUN_EDGES], crossed: ["address"], badges: { mobileBank: "no answer", marketplace: "nothing saved" } },
  { cue: 35, layout: RUN, edges: [...RUN_EDGES], crossed: ["address"], accent: ["platform"], badges: { platform: "audit: refused" } },
  // No standing consent: each address, a new question.
  { cue: 36, layout: WEB, edges: [...WEB_EDGES], accent: ["marketWeb"], packets: [{ from: "marketWeb", to: "platform", label: "sharing request" }], badges: { marketWeb: "next month" } },
  { cue: 37, layout: WEB, edges: [...WEB_EDGES], accent: ["mobileBank"], badges: { mobileBank: "asks again" } },
  { cue: 38, layout: WEB, edges: [...WEB_EDGES], badges: { mobileBank: "one answer, one address" } },
  { cue: 39, layout: WEB, edges: [...WEB_EDGES], accent: ["mobileBank"], badges: { mobileBank: "one more tap" } },
  { cue: 40, layout: WEB, edges: [...WEB_EDGES], danger: ["marketWeb"], badges: { marketWeb: "ticked once = forever" } },
  { cue: 41, layout: WEB, edges: [...WEB_EDGES], accent: ["mobileBank"], badges: { mobileBank: "Aziz decides" } },
  // Deletion lives in the marketplace.
  { cue: 42, layout: { aziz: [0, 1], marketplace: [1.5, 1], platform: [3, 1] }, edges: [{ from: "aziz", to: "marketplace" }], accent: ["marketplace"], badges: { aziz: "moves out" } },
  { cue: 43, layout: { aziz: [0, 1], marketplace: [1.5, 1], platform: [3, 1] }, edges: [{ from: "aziz", to: "marketplace" }], accent: ["marketplace"], badges: { marketplace: "delete address" } },
  { cue: 44, layout: { aziz: [0, 1], marketplace: [1.5, 1], platform: [3, 1] }, edges: [{ from: "aziz", to: "marketplace" }], crossed: ["platform"], badges: { platform: "takes no part" } },
  { cue: 45, layout: { aziz: [0, 1], marketplace: [1.5, 1], platform: [3, 1] }, edges: [{ from: "aziz", to: "marketplace" }], badges: { marketplace: "its copy, its delete" } },
  // What the design does not let the marketplace do.
  { cue: 46, layout: RUN, edges: [...RUN_EDGES], accent: ["marketplace"] },
  { cue: 47, layout: RUN, edges: [...RUN_EDGES], badges: { marketplace: "no key" } },
  { cue: 48, layout: RUN, edges: [...RUN_EDGES], badges: { marketplace: "no passport data" } },
  { cue: 49, layout: RUN, edges: [...RUN_EDGES], badges: { marketplace: "not at level 1" } },
  { cue: 50, layout: RUN, edges: [...RUN_EDGES], accent: ["mobileBank"], badges: { marketplace: "cannot skip", mobileBank: "the question lives here" } },
  // Recap and the next question.
  { cue: 51, layout: RUN, edges: [...RUN_EDGES], accent: ["address"], badges: { address: "only by request" } },
  { cue: 52, layout: RUN, edges: [...RUN_EDGES], badges: { platform: "level 2 · linked" } },
  { cue: 53, layout: RUN, edges: [...RUN_EDGES], accent: ["mobileBank"], badges: { mobileBank: "each time", platform: "each read audited" } },
  { cue: 54, layout: { trusted: [0, 1], marketplace: [1.5, 0.4], marketWeb: [1.5, 1.7] }, edges: [{ from: "trusted", to: "marketplace" }, { from: "trusted", to: "marketWeb" }], accent: ["trusted"], badges: { trusted: "mobile bank" } },
  { cue: 55, layout: { trusted: [0, 1], someone: [3, 1], marketWeb: [1.5, 1.7], marketplace: [1.5, 0.4] }, edges: [{ from: "someone", to: "trusted" }], danger: ["someone"], packets: [{ from: "someone", to: "trusted", label: "end this session", stopAt: 0.6 }] },
  { cue: 56, layout: { trusted: [0, 1], someone: [3, 1], marketWeb: [1.5, 1.7], marketplace: [1.5, 0.4] }, edges: [{ from: "someone", to: "trusted" }], danger: ["someone"], badges: { trusted: "who wins?" } },
];
