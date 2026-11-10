import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Three apps", "Is it really Aziz?", "No face check every time", "How?", "heeyID", "One day",
  "Registration", "Master app", "SMS code", "Through TAF", "Verdict: green", "Password", "One password",
  "Level 1", "Phone, not person",
  "Credit", "Level 2", "Side app", "Consent", "MyID", "Face and passport", "Phone check", "Level 2",
  "Link", "Link", "Trusted device", "Approve", "Own access grant",
  "Next morning", "No face check", "No new code", "Sessions continue", "One proofing",
  "The worry", "SIM swap", "A new phone", "Password guessed", "What stops him?",
  "TAF can say green", "New phone: MyID", "Not his face", "Approve or not", "This was not me",
  "Number on hold", "Web: same request", "New password", "SIM still works?", "New number",
  "The map", "Apps call the API", "MyID and TAF SDKs", "Side apps", "One edge", "The bank's rules", "Keycloak", "Tokens only",
  "One client per app", "No direct calls", "Adapters", "Codes: TAF", "Codes: SMS",
  "Four stores", "Records", "Counters", "Events", "Keys",
  "Bank staff", "Admin gateway", "The bank's perimeter", "One bank", "TAF agent inside", "Outside",
  "Recap", "How many times?", "Once",
  "Next: identity words",
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
  hidePanelBefore: 4,
});
