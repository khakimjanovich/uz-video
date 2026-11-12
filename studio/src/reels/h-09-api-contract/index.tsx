import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Monday morning", "Jasur's task", "Looking for an SDK", "There is none", "Then how?",
  "Lesson 8", "What reaches the apps",
  "Why no SDK", "The bank builds apps", "Extra work", "The contract is the product", "Three things", "1 · REST API", "2 · OpenAPI contract", "3 · Integration guide",
  "The contract", "One call per step", "Correlation and device ids", "One error shape", "Codes = outcomes", "No sentence parsing", "Read the code",
  "SDKs that exist", "MyID and TAF: master app", "Native MyID", "No web view", "Credential stays", "Push SDK",
  "The guide", "May keep", "Device identifier", "Refresh token", "Memory only", "Approval request", "Push token", "PIN hash", "Language",
  "Never keeps", "Password", "MyID credential", "Result code", "Identification number", "Documents, addresses", "Used codes", "Gateway limits", "Biometrics",
  "Limits", "Comfort counter", "Server applies limits", "Convenience, not control",
  "The honest edge", "Cannot enforce inside", "Out of sight", "Guide and tests", "A client of the contract",
  "Jasur, Wednesday", "Calls and storage", "MyID and TAF only", "Contract first",
  "Recap", "API, contract, guide", "Master app SDKs", "Keep and never keep", "Server limits",
  "First phone number", "Number to level 1?", "Next: registration",
];

export const H09ApiContractComposition = createEpisode({
  course: HEEYID,
  id: "h-09-api-contract",
  number: 7,
  part: 2,
  footer: "The contract is the product",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
