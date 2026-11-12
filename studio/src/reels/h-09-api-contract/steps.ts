import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 9: the API contract. No SDK (0–14); the contract and its error shape (15–21); the SDKs that exist
// (22–27); may keep (28–36); never keeps (37–45); limits and the honest edge (46–54); Jasur on Wednesday
// (55–58); recap and the way to registration (59–66).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 5, part: 2, current: ["vault"], units: { heeyid: "keys stay in the bank" } },
  { cue: 6, part: 2, rows: [2], current: ["mobile", "edge", "custgw"], units: { heeyid: "what reaches the apps" } },
  { cue: 64, part: 3, rows: [3], current: ["customer", "mobile", "custgw"], dot: "customer", units: { heeyid: "next: registration" } },
  { cue: 66, part: 3, rows: [3], dot: "off" },
];

const TEAM = { appTeam: [0, 1], sdk: [2, 1] } as const;
const GIVES = { appTeam: [0, 1], contract: [1.5, 0.4], guide: [1.5, 1.6], platform: [3, 1] } as const;
const GIVES_EDGES = [{ from: "appTeam", to: "contract" }, { from: "appTeam", to: "guide" }, { from: "contract", to: "platform" }] as const;
const CALL = { mobileBank: [0.4, 1], contract: [1.7, 1], platform: [3, 1] } as const;
const CALL_EDGES = [{ from: "mobileBank", to: "contract" }, { from: "contract", to: "platform" }] as const;
const SDKS = { mobileBank: [0.5, 0.4], myid: [2, 0.2], taf: [3, 0.6], marketplace: [0.5, 1.8], push: [2.5, 1.8] } as const;
const SDK_EDGES = [{ from: "mobileBank", to: "myid" }, { from: "mobileBank", to: "taf" }, { from: "mobileBank", to: "push" }, { from: "marketplace", to: "push" }] as const;
const KEEP = { trusted: [0, 1], keychain: [1.5, 0.4], memory: [1.5, 1.6], neverKept: [3, 1] } as const;
const KEEP_EDGES = [{ from: "trusted", to: "keychain" }, { from: "trusted", to: "memory" }] as const;
const NEVER = { trusted: [0.5, 1], neverKept: [2.5, 1] } as const;
const never = (item: string): DiagramStep<HeeyId> => ({ cue: 0, layout: NEVER, edges: [{ from: "trusted", to: "neverKept", broken: true }], danger: ["neverKept"], badges: { neverKept: item } });

export const diagram: DiagramStep<HeeyId>[] = [
  // Jasur looks for an SDK.
  { cue: 0, layout: { appTeam: [1.5, 1] }, accent: ["appTeam"], badges: { appTeam: "mobile bank team" } },
  { cue: 1, layout: { appTeam: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "appTeam", to: "platform" }], badges: { appTeam: "Jasur · iOS" } },
  { cue: 2, layout: TEAM, edges: [{ from: "appTeam", to: "sdk" }], badges: { appTeam: "Jasur · iOS", sdk: "one line?" } },
  { cue: 3, layout: TEAM, edges: [{ from: "appTeam", to: "sdk", broken: true }], crossed: ["sdk"] },
  { cue: 4, layout: TEAM, edges: [{ from: "appTeam", to: "sdk", broken: true }], crossed: ["sdk"], badges: { appTeam: "then how?" } },
  // Why no SDK.
  { cue: 8, layout: { appTeam: [0.5, 1], mobileBank: [2.5, 0.4], marketplace: [2.5, 1.6] }, edges: [{ from: "appTeam", to: "mobileBank" }, { from: "appTeam", to: "marketplace" }], badges: { appTeam: "the bank builds" } },
  { cue: 9, layout: TEAM, edges: [{ from: "appTeam", to: "sdk", broken: true }], crossed: ["sdk"], badges: { sdk: "+ work · + release train" } },
  { cue: 10, layout: { appTeam: [0.5, 1], contract: [2.5, 1] }, edges: [{ from: "appTeam", to: "contract" }], accent: ["contract"], badges: { contract: "the product" } },
  { cue: 11, layout: GIVES, edges: [...GIVES_EDGES], accent: ["contract", "guide", "platform"] },
  { cue: 12, layout: GIVES, edges: [...GIVES_EDGES], accent: ["platform"], badges: { platform: "1 · REST API" } },
  { cue: 13, layout: GIVES, edges: [...GIVES_EDGES], accent: ["contract"], badges: { platform: "1 · REST API", contract: "2 · describes it" } },
  { cue: 14, layout: GIVES, edges: [...GIVES_EDGES], accent: ["guide"], badges: { platform: "1 · REST API", contract: "2 · describes it", guide: "3 · rules" } },
  // The contract.
  { cue: 15, layout: CALL, edges: [...CALL_EDGES], badges: { contract: "path · request · answer · errors" } },
  { cue: 16, layout: CALL, edges: [...CALL_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "start registration" }, { from: "mobileBank", to: "platform", label: "verify code", delay: 50 }], badges: { contract: "one call per step" } },
  { cue: 17, layout: CALL, edges: [...CALL_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "correlation id · device id" }] },
  { cue: 18, layout: CALL, edges: [...CALL_EDGES], packets: [{ from: "platform", to: "mobileBank", label: "error" }], badges: { contract: "code · reason · message · retry" } },
  { cue: 19, layout: CALL, edges: [...CALL_EDGES], badges: { contract: "codes = error outcomes" } },
  { cue: 20, layout: CALL, edges: [...CALL_EDGES], badges: { mobileBank: "no sentence parsing" } },
  { cue: 21, layout: CALL, edges: [...CALL_EDGES], accent: ["mobileBank"], badges: { mobileBank: "reads code, shows message" } },
  // The SDKs that exist.
  { cue: 22, layout: SDKS, edges: [...SDK_EDGES], accent: ["myid", "taf", "push"] },
  { cue: 23, layout: SDKS, edges: [...SDK_EDGES], accent: ["myid", "taf"], badges: { myid: "SDK", taf: "SDK", marketplace: "no MyID · no TAF" } },
  { cue: 24, layout: { mobileBank: [0.5, 1], myid: [2.5, 1] }, edges: [{ from: "mobileBank", to: "myid" }], accent: ["myid"], badges: { myid: "native, in the app" } },
  { cue: 25, layout: { mobileBank: [0, 1], platform: [1.5, 0.3], myid: [3, 1] }, edges: [{ from: "platform", to: "myid", label: "opens session" }, { from: "mobileBank", to: "myid" }], badges: { mobileBank: "no web view" } },
  { cue: 26, layout: { mobileBank: [0, 1], vault: [1.5, 1], myid: [3, 1] }, edges: [{ from: "vault", to: "myid" }, { from: "vault", to: "mobileBank", broken: true }], badges: { vault: "credential stays" } },
  { cue: 27, layout: SDKS, edges: [...SDK_EDGES], accent: ["push"], badges: { push: "push SDK: each app" } },
  // What an app may keep.
  { cue: 29, layout: KEEP, edges: [...KEEP_EDGES, { from: "trusted", to: "neverKept" }], accent: ["keychain", "memory", "neverKept"] },
  { cue: 30, layout: KEEP, edges: [...KEEP_EDGES], accent: ["keychain"], badges: { keychain: "device identifier" } },
  { cue: 31, layout: KEEP, edges: [...KEEP_EDGES], accent: ["keychain"], badges: { keychain: "device id · refresh token" } },
  { cue: 32, layout: KEEP, edges: [...KEEP_EDGES], accent: ["memory"], badges: { keychain: "device id · refresh token", memory: "access token · summary" } },
  { cue: 33, layout: KEEP, edges: [...KEEP_EDGES], badges: { keychain: "device id · refresh token", memory: "+ approval request" } },
  { cue: 34, layout: KEEP, edges: [...KEEP_EDGES], badges: { keychain: "device id · refresh token", memory: "+ approval request", trusted: "push token" } },
  { cue: 35, layout: KEEP, edges: [...KEEP_EDGES], badges: { keychain: "+ PIN: slow salted hash", memory: "+ approval request", trusted: "push token" } },
  { cue: 36, layout: KEEP, edges: [...KEEP_EDGES], badges: { keychain: "+ PIN: slow salted hash", memory: "+ approval request", trusted: "push token · language" } },
  // What an app never keeps.
  { ...never("never"), cue: 37 },
  { ...never("password ✕"), cue: 38 },
  { ...never("MyID credential ✕"), cue: 39 },
  { ...never("result code ✕"), cue: 40 },
  { ...never("identification number ✕"), cue: 41 },
  { ...never("document · address · image ✕"), cue: 42 },
  { ...never("used one-time code ✕"), cue: 43 },
  { ...never("gateway limit ✕"), cue: 44 },
  { ...never("biometric data ✕"), cue: 45 },
  // Limits live on the server.
  { cue: 46, layout: { trusted: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "trusted", to: "platform" }], badges: { trusted: "limits?" } },
  { cue: 47, layout: { trusted: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "trusted", to: "platform" }], badges: { trusted: "counter: comfort" } },
  { cue: 48, layout: { trusted: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "trusted", to: "platform" }], accent: ["platform"], badges: { trusted: "counter: comfort", platform: "every limit: here" } },
  { cue: 49, layout: { trusted: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "trusted", to: "platform" }], badges: { trusted: "convenience", platform: "control" } },
  // The honest edge.
  { cue: 51, layout: { platform: [0.5, 1], keychain: [2.5, 1] }, edges: [{ from: "platform", to: "keychain", broken: true }], badges: { platform: "cannot enforce inside" } },
  { cue: 52, layout: { platform: [0.5, 1], keychain: [2.5, 1] }, edges: [{ from: "platform", to: "keychain", broken: true }], crossed: ["keychain"], badges: { keychain: "out of sight" } },
  { cue: 53, layout: { guide: [0, 0.4], tests: [0, 1.7], mobileBank: [2, 1] }, edges: [{ from: "guide", to: "mobileBank" }, { from: "tests", to: "mobileBank" }], accent: ["guide", "tests"], badges: { mobileBank: "kept correct" } },
  { cue: 54, layout: CALL, edges: [...CALL_EDGES], badges: { mobileBank: "a client, nothing more" } },
  // Jasur on Wednesday.
  { cue: 55, layout: { appTeam: [0.5, 1], mobileBank: [2.5, 1] }, edges: [{ from: "appTeam", to: "mobileBank" }], badges: { appTeam: "Jasur" } },
  { cue: 56, layout: { ...CALL, keychain: [0, 2.1] }, edges: [...CALL_EDGES, { from: "mobileBank", to: "keychain" }], accent: ["mobileBank"], packets: [{ from: "mobileBank", to: "platform", label: "call" }], badges: { keychain: "device id", mobileBank: "token in memory" } },
  { cue: 57, layout: { ...SDKS, sdk: [0.5, 1.8] }, edges: [{ from: "mobileBank", to: "myid" }, { from: "mobileBank", to: "taf" }], crossed: ["sdk"], accent: ["myid", "taf"] },
  { cue: 58, layout: CALL, edges: [...CALL_EDGES], accent: ["contract"], badges: { contract: "changes show here first" } },
  // Recap.
  { cue: 59, layout: TEAM, edges: [{ from: "appTeam", to: "sdk", broken: true }], crossed: ["sdk"] },
  { cue: 60, layout: GIVES, edges: [...GIVES_EDGES], accent: ["contract", "guide", "platform"] },
  { cue: 61, layout: SDKS, edges: [...SDK_EDGES], accent: ["myid", "taf"], badges: { mobileBank: "master app only" } },
  { cue: 62, layout: KEEP, edges: [...KEEP_EDGES, { from: "trusted", to: "neverKept", broken: true }], badges: { keychain: "may keep", memory: "may keep", neverKept: "never" } },
  { cue: 63, layout: { trusted: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "trusted", to: "platform" }], accent: ["platform"], badges: { platform: "every limit: here" } },
];
