import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Jasur's task", "Looking for an SDK", "There is none", "Then how?",
  "Lesson 6: keys stay", "What reaches the app",
  "Why no SDK", "The bank builds the app", "Extra work", "The contract is the product", "Three things", "1 · REST API", "2 · OpenAPI contract", "3 · Integration guide",
  "The contract", "One call per step", "Correlation and device ids", "One error shape", "One code, one outcome", "No sentence parsing", "Read the code",
  "SDKs that exist", "MyID and TAF SDKs", "Native MyID", "No web view", "Credential stays", "Push SDK",
  "The guide", "May keep", "Device identifier", "Refresh token", "Memory only", "Push token", "PIN hash", "Language",
  "Never keeps", "Password", "MyID credential", "Result code", "Identification number", "Documents, addresses", "Used codes", "Gateway limits", "Biometrics",
  "The honest edge", "Cannot enforce inside", "Out of sight", "Guide and tests", "A client of the contract",
  "Back to Jasur", "Calls and storage", "MyID and TAF only", "One file", "Contract first",
  "Check yourself", "Never the password",
  "No heeyID SDK", "API, contract, guide", "SDKs in the mobile bank", "Keep and never keep",
  "First phone number", "Lesson 8: registration",
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
