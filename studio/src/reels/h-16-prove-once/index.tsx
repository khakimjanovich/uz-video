import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "How often?", "Once",
  "Lesson 15", "What it keeps",
  "What MyID gave", "Reusable identifier", "Valid to a date", "Kept in the bank", "Never on the phone",
  "The river", "Still valid", "A new phone", "Code through TAF", "No approval", "Level 2 before",
  "Not everything", "Re-check", "Consent again", "Identifier preset", "Straight to the camera", "Face only", "No profile", "Identity unchanged", "Trusted", "One look",
  "Which kind?", "Purpose and identifier", "Step-up: full", "Refresh: full", "New device: re-check", "Expired: full", "Yellow: re-check",
  "The rule", "Nobody can start it", "The rule matters", "Every call costs", "Prove once, then bind", "No face engine", "MyID checks liveness",
  "Side apps?", "Marketplace", "No MyID at login", "Approve in the mobile bank",
  "One journey", "App closed", "Same result", "Own purpose only",
  "Recap", "The identity", "Most sensitive", "Who reads it?",
  "Next: the verified identity",
];

export const H16ProveOnceComposition = createEpisode({
  course: HEEYID,
  id: "h-16-prove-once",
  number: 16,
  part: 4,
  footer: "Prove once, then bind",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
