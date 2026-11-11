import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "My orders", "The kettle", "Level 1", "Say no?",
  "Lesson 21: the grant", "This lesson: step-up",
  "The apps", "Name, kind, level", "Mobile bank", "Marketplace", "Credit service", "Required level", "Go-live rule",
  "Required level 1", "Usable at once",
  "The rule", "Personal data: level 2", "No guessing", "From the summary", "Too low",
  "Teams get this wrong", "Refuse?", "Never refuses", "Step-up", "Three parts", "Current: 1", "Required: 2", "The checks",
  "Not no", "The way up",
  "Side app", "No MyID", "Continue in the mobile bank", "Proofing refused", "Master app only", "One button", "Mobile bank",
  "The checks", "Consent", "Accepted", "MyID", "Confirm the data", "Phone check", "Confirmed",
  "Three changes", "Level 2", "Trusted", "New token",
  "Not what happened", "No app", "No approval, no operator", "Only MyID", "Hard rule", "Person's level",
  "Session level", "Trusted device", "Other phone: 1", "Side app: approval", "Lesson 26", "Marketplace",
  "My view", "Proves once", "Borrows the proof",
  "Recap", "Required level", "Never refuses", "Level and checks", "Master app only",
  "Tonight", "No session", "Back in?", "Next: known-device login",
];

export const H22StepUpComposition = createEpisode({
  course: HEEYID,
  id: "h-22-step-up",
  number: 22,
  part: 5,
  footer: "Never no, always the way up",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
  hidePanelBefore: 4,
});
