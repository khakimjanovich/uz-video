import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Money to his mother", "Really Aziz", "No face check every time?", "heeyID", "One journey",
  "Sunday", "Master app", "SMS code", "Through TAF", "The code", "Verdict: green", "Password, two times",
  "Level 1", "Phone, not person",
  "Saturday", "Money needs level 2", "Consent", "MyID", "Face and passport",
  "Phone check", "MyID number first", "TAF: who owns it", "Level 2", "Trusted phone", "Transfer goes",
  "No face check", "Same phone: password + code",
  "The worry", "SIM of Aziz's number", "Leaked password", "His own phone", "Not the trusted phone",
  "Face + SIM", "Not Aziz's face", "No money moves", "Only the trusted phone",
  "The map", "One edge", "Customer gateway", "The bank's rules", "Keycloak: tokens",
  "Bank staff", "Admin gateway", "Four stores", "Records", "Counters", "Events", "Keys",
  "No direct calls", "Adapters", "Gateway and workers",
  "The bank's perimeter", "One bank", "TAF agent inside", "Three outside", "No personal data",
  "Proved once", "How many times?", "Once",
  "Lesson 2: identity words",
];

export const H01MapComposition = createEpisode({
  course: HEEYID,
  id: "h-01-map",
  number: 1,
  part: 1,
  footer: "Prove once, then bind",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
  hidePanelBefore: 3,
});
