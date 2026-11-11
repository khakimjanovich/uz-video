import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 19: linking. Two records of one man (cues 0–3); the bridge (4–5); one value out (6–11); five
// answers (12–19); reference, never a copy (20–24); the comparison note (25–28); never by phone (29–37);
// pending (38–45); the operator link (46–48); the close (49–54).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 4, rows: [4], current: ["custgw", "adapters", "taf", "myid"], dot: "custgw", units: { heeyid: "lesson 18: Confirmed" } },
  { cue: 5, part: 4, rows: [4], current: ["custgw", "adapters", "lookup"], dot: "lookup", units: { heeyid: "linking" } },
  { cue: 41, part: 4, current: ["workers", "adapters", "lookup"], dot: "workers", units: { heeyid: "retries: configured interval" } },
  { cue: 49, part: 4, rows: [4], current: ["custgw", "adapters", "lookup", "postgres"], dot: "off", units: { heeyid: "one value out, one identifier in" } },
  { cue: 51, part: 4, rows: [4], dot: "off", units: { heeyid: "in the bank" } },
];

const TWO = { platform: [0.5, 1], records: [2.5, 1] } as const;
const LINK = { aziz: [0, 1], platform: [1.4, 1], records: [3, 1] } as const;
const LINK_EDGES = [{ from: "aziz", to: "platform" }, { from: "platform", to: "records" }] as const;
const CASE = { ...LINK, caseOperator: [1.4, 2.2] } as const;
const CASE_EDGES = [...LINK_EDGES, { from: "platform", to: "caseOperator" }] as const;
const PHONE = { newHolder: [0, 0.3], aziz: [0, 1.7], platform: [1.5, 1], records: [3, 1] } as const;
const PHONE_EDGES = [{ from: "newHolder", to: "platform" }, { from: "aziz", to: "platform" }, { from: "platform", to: "records" }] as const;
const OPERATOR = { caseOperator: [0, 1], platform: [1.5, 1], records: [3, 1] } as const;
const OPERATOR_EDGES = [{ from: "caseOperator", to: "platform" }, { from: "platform", to: "records" }] as const;
const CLOSE = { aziz: [0, 1], trusted: [1.5, 1], mobileBank: [3, 1] } as const;
const CLOSE_EDGES = [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "mobileBank" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  { cue: 0, layout: TWO, edges: [], accent: ["records"], badges: { records: "6 years" } },
  { cue: 1, layout: TWO, edges: [], badges: { records: "salary card · deposit" } },
  { cue: 2, layout: TWO, edges: [], accent: ["platform"], badges: { platform: "1 week", records: "6 years" } },
  { cue: 3, layout: TWO, edges: [{ from: "platform", to: "records", label: "same man?" }], badges: { platform: "Aziz?", records: "Aziz?" } },
  // Two records, one thin thread.
  { cue: 6, layout: TWO, edges: [], badges: { platform: "person", records: "bank customer" } },
  { cue: 7, layout: TWO, edges: [], accent: ["platform"], badges: { platform: "phone · password · level · identity" } },
  { cue: 8, layout: TWO, edges: [], accent: ["records"], badges: { records: "accounts · cards · products" } },
  { cue: 9, layout: TWO, edges: [{ from: "platform", to: "records" }], badges: { platform: "one thin thread" } },
  { cue: 10, layout: LINK, edges: [...LINK_EDGES], packets: [{ from: "platform", to: "records", label: "personal identification number" }] },
  { cue: 11, layout: LINK, edges: [...LINK_EDGES], badges: { platform: "nothing else leaves" } },
  // Five answers.
  { cue: 12, layout: LINK, edges: [...LINK_EDGES], accent: ["records"], badges: { records: "five answers" } },
  { cue: 13, layout: LINK, edges: [...LINK_EDGES], accent: ["platform"], packets: [{ from: "records", to: "platform", label: "bank customer identifier" }], badges: { records: "found, active", platform: "Linked" } },
  { cue: 14, layout: LINK, edges: [...LINK_EDGES], accent: ["aziz"], badges: { aziz: "Linked ✓" } },
  { cue: 15, layout: LINK, edges: [...LINK_EDGES], badges: { records: "not found", platform: "Not linked + event" } },
  { cue: 16, layout: LINK, edges: [...LINK_EDGES], accent: ["records"], badges: { records: "account opening: the bank's" } },
  { cue: 17, layout: CASE, edges: [...CASE_EDGES], accent: ["caseOperator"], badges: { records: "closed or blocked", platform: "Refused", caseOperator: "case" } },
  { cue: 18, layout: CASE, edges: [...CASE_EDGES], accent: ["caseOperator"], badges: { records: "more than one", platform: "Refused", caseOperator: "case" } },
  { cue: 19, layout: LINK, edges: [...LINK_EDGES], packets: [{ from: "platform", to: "records", label: "lookup", stopAt: 0.6 }], badges: { platform: "Pending" } },
  // A reference, never a copy.
  { cue: 20, layout: LINK, edges: [...LINK_EDGES], accent: ["platform"], badges: { platform: "identifier only" } },
  { cue: 21, layout: LINK, edges: [...LINK_EDGES], packets: [{ from: "records", to: "platform", label: "accounts · balances" }], badges: { platform: "deleted first" } },
  { cue: 22, layout: LINK, edges: [...LINK_EDGES], accent: ["platform"], badges: { platform: "a reference, never a copy" } },
  { cue: 24, layout: LINK, edges: [...LINK_EDGES], badges: { platform: "a copy goes old · leaks" } },
  // The comparison note.
  { cue: 25, layout: LINK, edges: [...LINK_EDGES], packets: [{ from: "records", to: "platform", label: "name · date of birth" }], badges: { platform: "compare only" } },
  { cue: 26, layout: LINK, edges: [...LINK_EDGES], badges: { records: "older Latin spelling" } },
  { cue: 27, layout: LINK, edges: [...LINK_EDGES], accent: ["platform"], badges: { platform: "comparison note" } },
  { cue: 28, layout: LINK, edges: [...LINK_EDGES], badges: { platform: "Linked · no stop" } },
  // Never by phone number.
  { cue: 29, layout: PHONE, edges: [...PHONE_EDGES], badges: { platform: "the rule" } },
  { cue: 30, layout: PHONE, edges: [...PHONE_EDGES], packets: [{ from: "platform", to: "records", label: "phone number", stopAt: 0.5 }], badges: { platform: "no such operation" } },
  { cue: 31, layout: PHONE, edges: [...PHONE_EDGES], badges: { platform: "not gateway · panel · operator" } },
  { cue: 32, layout: PHONE, edges: [...PHONE_EDGES], accent: ["records"], badges: { records: "number only" } },
  { cue: 34, layout: PHONE, edges: [...PHONE_EDGES], accent: ["newHolder"], badges: { newHolder: "old numbers reused" } },
  { cue: 35, layout: PHONE, edges: [...PHONE_EDGES], accent: ["newHolder"], badges: { newHolder: "Aziz's old number" } },
  { cue: 36, layout: PHONE, edges: [...PHONE_EDGES], danger: ["newHolder"], shake: { newHolder: 0.5 }, badges: { records: "Aziz's deposit?" } },
  { cue: 37, layout: PHONE, edges: [...PHONE_EDGES], crossed: ["newHolder"], badges: { platform: "phone = contact, not identifier" } },
  // Pending: the lookup is down.
  { cue: 38, layout: LINK, edges: [...LINK_EDGES], danger: ["records"], badges: { records: "down?" } },
  { cue: 39, layout: LINK, edges: [...LINK_EDGES], danger: ["records"], badges: { records: "maintenance" } },
  { cue: 40, layout: LINK, edges: [...LINK_EDGES], danger: ["records"], packets: [{ from: "platform", to: "records", label: "lookup", stopAt: 0.6 }], badges: { platform: "Pending" } },
  { cue: 42, layout: CASE, edges: [...CASE_EDGES], accent: ["caseOperator"], badges: { platform: "Refused: lookup not available", caseOperator: "case" } },
  { cue: 43, layout: LINK, edges: [...LINK_EDGES], accent: ["aziz"], badges: { aziz: "access grant kept" } },
  { cue: 44, layout: LINK, edges: [...LINK_EDGES], badges: { aziz: "level 2", platform: "link: separate" } },
  { cue: 45, layout: { aziz: [0, 1], mobileBank: [1.5, 1], platform: [3, 1] }, edges: [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }], packets: [{ from: "platform", to: "mobileBank", label: "summary: link state" }], badges: { mobileBank: "decides banking functions" } },
  // The operator link.
  { cue: 46, layout: OPERATOR, edges: [...OPERATOR_EDGES], accent: ["caseOperator"], badges: { platform: "Refused" } },
  { cue: 47, layout: OPERATOR, edges: [...OPERATOR_EDGES], packets: [{ from: "caseOperator", to: "platform", label: "checked identifier" }] },
  { cue: 48, layout: OPERATOR, edges: [...OPERATOR_EDGES], accent: ["platform"], badges: { platform: "Linked · set by operator", caseOperator: "who · when · why" } },
  // The close.
  { cue: 50, layout: CLOSE, edges: [...CLOSE_EDGES], accent: ["aziz"], badges: { aziz: "level 2 · linked" } },
  { cue: 52, layout: CLOSE, edges: [...CLOSE_EDGES], accent: ["trusted"], badges: { trusted: "carries it all" } },
  { cue: 53, layout: CLOSE, edges: [...CLOSE_EDGES], accent: ["trusted"], badges: { trusted: "trusted: why?" } },
];
