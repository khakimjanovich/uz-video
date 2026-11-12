import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 7: the API contract. No SDK (0–13); the contract and its error shape (14–20); the SDKs that exist
// (21–26); may keep (27–34); never keeps (35–43); the honest edge (44–48); Jasur's app (49–53);
// the check, the summary and the way to registration (54–61).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 2, current: ["vault"], units: { heeyid: "keys stay in the bank" } },
  { cue: 5, part: 2, rows: [2], current: ["mobile", "edge", "custgw"], units: { heeyid: "what reaches the app" } },
  { cue: 60, part: 3, rows: [3], current: ["customer", "mobile", "custgw"], dot: "customer", units: { heeyid: "registration" } },
  { cue: 61, part: 3, rows: [3], dot: "off" },
];

const TEAM = { appTeam: [0, 1], sdk: [2, 1] } as const;
const GIVES = { appTeam: [0, 1], contract: [1.5, 0.4], guide: [1.5, 1.6], platform: [3, 1] } as const;
const GIVES_EDGES = [{ from: "appTeam", to: "contract" }, { from: "appTeam", to: "guide" }, { from: "contract", to: "platform" }] as const;
const CALL = { mobileBank: [0.4, 1], contract: [1.7, 1], platform: [3, 1] } as const;
const CALL_EDGES = [{ from: "mobileBank", to: "contract" }, { from: "contract", to: "platform" }] as const;
const SDKS = { mobileBank: [0.5, 1], myid: [2.5, 0.2], taf: [2.5, 1], push: [2.5, 1.8] } as const;
const SDK_EDGES = [{ from: "mobileBank", to: "myid" }, { from: "mobileBank", to: "taf" }, { from: "mobileBank", to: "push" }] as const;
const KEEP = { trusted: [0, 1], keychain: [1.5, 0.4], memory: [1.5, 1.6], neverKept: [3, 1] } as const;
const KEEP_EDGES = [{ from: "trusted", to: "keychain" }, { from: "trusted", to: "memory" }] as const;
const NEVER = { trusted: [0.5, 1], neverKept: [2.5, 1] } as const;
const never = (item: string): DiagramStep<HeeyId> => ({ cue: 0, layout: NEVER, edges: [{ from: "trusted", to: "neverKept", broken: true }], danger: ["neverKept"], badges: { neverKept: item } });

export const diagram: DiagramStep<HeeyId>[] = [
  // Jasur looks for an SDK.
  { cue: 0, layout: { appTeam: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "appTeam", to: "platform" }], accent: ["appTeam"], badges: { appTeam: "Jasur · iOS" } },
  { cue: 1, layout: TEAM, edges: [{ from: "appTeam", to: "sdk" }], badges: { appTeam: "Jasur · iOS", sdk: "one line?" } },
  { cue: 2, layout: TEAM, edges: [{ from: "appTeam", to: "sdk", broken: true }], crossed: ["sdk"] },
  { cue: 3, layout: TEAM, edges: [{ from: "appTeam", to: "sdk", broken: true }], crossed: ["sdk"], badges: { appTeam: "then how?" } },
  // Why no SDK.
  { cue: 7, layout: { appTeam: [0.5, 1], mobileBank: [2.5, 1] }, edges: [{ from: "appTeam", to: "mobileBank" }], badges: { appTeam: "the bank builds" } },
  { cue: 8, layout: TEAM, edges: [{ from: "appTeam", to: "sdk", broken: true }], crossed: ["sdk"], badges: { sdk: "+ work · + release train" } },
  { cue: 9, layout: { appTeam: [0.5, 1], contract: [2.5, 1] }, edges: [{ from: "appTeam", to: "contract" }], accent: ["contract"], badges: { contract: "the product" } },
  { cue: 10, layout: GIVES, edges: [...GIVES_EDGES], accent: ["contract", "guide", "platform"] },
  { cue: 11, layout: GIVES, edges: [...GIVES_EDGES], accent: ["platform"], badges: { platform: "1 · REST API" } },
  { cue: 12, layout: GIVES, edges: [...GIVES_EDGES], accent: ["contract"], badges: { platform: "1 · REST API", contract: "2 · describes it" } },
  { cue: 13, layout: GIVES, edges: [...GIVES_EDGES], accent: ["guide"], badges: { platform: "1 · REST API", contract: "2 · describes it", guide: "3 · rules" } },
  // The contract.
  { cue: 14, layout: CALL, edges: [...CALL_EDGES], badges: { contract: "path · request · answer · errors" } },
  { cue: 15, layout: CALL, edges: [...CALL_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "start registration" }, { from: "mobileBank", to: "platform", label: "verify code", delay: 50 }], badges: { contract: "one call per step" } },
  { cue: 16, layout: CALL, edges: [...CALL_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "correlation id · device id" }] },
  { cue: 17, layout: CALL, edges: [...CALL_EDGES], packets: [{ from: "platform", to: "mobileBank", label: "error" }], badges: { contract: "code · reason · message · retry" } },
  { cue: 18, layout: CALL, edges: [...CALL_EDGES], badges: { contract: "one code, one outcome" } },
  { cue: 19, layout: CALL, edges: [...CALL_EDGES], badges: { mobileBank: "no sentence parsing" } },
  { cue: 20, layout: CALL, edges: [...CALL_EDGES], accent: ["mobileBank"], badges: { mobileBank: "reads code, shows message" } },
  // The SDKs that exist.
  { cue: 21, layout: SDKS, edges: [...SDK_EDGES], accent: ["myid", "taf", "push"] },
  { cue: 22, layout: SDKS, edges: [...SDK_EDGES], accent: ["myid", "taf"], badges: { myid: "SDK", taf: "SDK" } },
  { cue: 23, layout: { mobileBank: [0.5, 1], myid: [2.5, 1] }, edges: [{ from: "mobileBank", to: "myid" }], accent: ["myid"], badges: { myid: "native, in the app" } },
  { cue: 24, layout: { mobileBank: [0, 1], platform: [1.5, 0.3], myid: [3, 1] }, edges: [{ from: "platform", to: "myid", label: "opens session" }, { from: "mobileBank", to: "myid" }], badges: { mobileBank: "no web view" } },
  { cue: 25, layout: { mobileBank: [0, 1], vault: [1.5, 1], myid: [3, 1] }, edges: [{ from: "vault", to: "myid" }, { from: "vault", to: "mobileBank", broken: true }], badges: { vault: "credential stays" } },
  { cue: 26, layout: SDKS, edges: [...SDK_EDGES], accent: ["push"], badges: { push: "push SDK" } },
  // What the app may keep.
  { cue: 28, layout: KEEP, edges: [...KEEP_EDGES, { from: "trusted", to: "neverKept" }], accent: ["keychain", "memory", "neverKept"] },
  { cue: 29, layout: KEEP, edges: [...KEEP_EDGES], accent: ["keychain"], badges: { keychain: "device id · journey id" } },
  { cue: 30, layout: KEEP, edges: [...KEEP_EDGES], accent: ["keychain"], badges: { keychain: "device id · refresh token" } },
  { cue: 31, layout: KEEP, edges: [...KEEP_EDGES], accent: ["memory"], badges: { keychain: "device id · refresh token", memory: "access token · summary" } },
  { cue: 32, layout: KEEP, edges: [...KEEP_EDGES], badges: { keychain: "device id · refresh token", memory: "access token · summary", trusted: "push token" } },
  { cue: 33, layout: KEEP, edges: [...KEEP_EDGES], badges: { keychain: "+ PIN: slow salted hash", memory: "access token · summary", trusted: "push token" } },
  { cue: 34, layout: KEEP, edges: [...KEEP_EDGES], badges: { keychain: "+ PIN: slow salted hash", memory: "access token · summary", trusted: "push token · language" } },
  // What the app never keeps.
  { ...never("never"), cue: 35 },
  { ...never("password ✕"), cue: 36 },
  { ...never("MyID credential ✕"), cue: 37 },
  { ...never("result code ✕"), cue: 38 },
  { ...never("identification number ✕"), cue: 39 },
  { ...never("document · address · image ✕"), cue: 40 },
  { ...never("used one-time code ✕"), cue: 41 },
  { ...never("gateway limit ✕"), cue: 42, badges: { neverKept: "gateway limit ✕", trusted: "counter: comfort only" } },
  { ...never("biometric data ✕"), cue: 43 },
  // The honest edge.
  { cue: 45, layout: { platform: [0.5, 1], keychain: [2.5, 1] }, edges: [{ from: "platform", to: "keychain", broken: true }], badges: { platform: "cannot enforce inside" } },
  { cue: 46, layout: { platform: [0.5, 1], keychain: [2.5, 1] }, edges: [{ from: "platform", to: "keychain", broken: true }], crossed: ["keychain"], badges: { keychain: "out of sight" } },
  { cue: 47, layout: { guide: [0, 0.4], tests: [0, 1.7], mobileBank: [2, 1] }, edges: [{ from: "guide", to: "mobileBank" }, { from: "tests", to: "mobileBank" }], accent: ["guide", "tests"], badges: { mobileBank: "kept correct" } },
  { cue: 48, layout: CALL, edges: [...CALL_EDGES], badges: { mobileBank: "a client, nothing more" } },
  // Jasur's app.
  { cue: 49, layout: { appTeam: [0.5, 1], mobileBank: [2.5, 1] }, edges: [{ from: "appTeam", to: "mobileBank" }], badges: { appTeam: "Jasur" } },
  { cue: 50, layout: { ...CALL, keychain: [0, 2.1] }, edges: [...CALL_EDGES, { from: "mobileBank", to: "keychain" }], accent: ["mobileBank"], packets: [{ from: "mobileBank", to: "platform", label: "call" }], badges: { keychain: "device id", mobileBank: "token in memory" } },
  { cue: 51, layout: { ...SDKS, sdk: [0.5, 2.1] }, edges: [{ from: "mobileBank", to: "myid" }, { from: "mobileBank", to: "taf" }], crossed: ["sdk"], accent: ["myid", "taf"] },
  { cue: 52, layout: CALL, edges: [...CALL_EDGES], accent: ["contract"], badges: { contract: "one file, every team" } },
  { cue: 53, layout: CALL, edges: [...CALL_EDGES], accent: ["contract"], badges: { contract: "changes show here first" } },
  // The check.
  { cue: 54, layout: NEVER, edges: [{ from: "trusted", to: "neverKept" }], badges: { trusted: "keep the password?" } },
  { ...never("password ✕"), cue: 55, badges: { neverKept: "password ✕", trusted: "send once, forget" } },
  // Summary.
  { cue: 56, layout: TEAM, edges: [{ from: "appTeam", to: "sdk", broken: true }], crossed: ["sdk"] },
  { cue: 57, layout: GIVES, edges: [...GIVES_EDGES], accent: ["contract", "guide", "platform"] },
  { cue: 58, layout: SDKS, edges: [...SDK_EDGES], accent: ["myid", "taf"], badges: { mobileBank: "MyID · TAF SDKs" } },
  { cue: 59, layout: KEEP, edges: [...KEEP_EDGES, { from: "trusted", to: "neverKept", broken: true }], badges: { keychain: "may keep", memory: "may keep", neverKept: "never" } },
];
