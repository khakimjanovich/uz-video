import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Thursday, 11 p.m.", "An upgrade", "Malika's Friday", "What runs? How back?",
  "Lesson 39: one install", "The same product", "This lesson: releases",
  "Whatever is newest", "Tuesday", "Wednesday", "The assessor asks", "Nobody can answer", "A moving name", "The dangerous word",
  "Three parts", "Breaking", "Added", "A fix", "How careful to be",
  "A release", "Built from it", "A bill of materials", "How it was built", "An answer",
  "Pinned versions", "A pin", "One line each", "Every environment", "What Bekzod tests",
  "Four steps", "Back up", "Change the line", "Deploy", "Check", "The card zone first", "The release notes",
  "Forward only", "Never steps back", "Restore the backup", "Backup is step one",
  "The list of releases", "Number and notes", "The newest", "Breaking? New value?", "The backup", "One line",
  "Deploy", "In order", "Every service healthy", "Then ecom",
  "A month later", "The bill of materials", "The count", "Trust",
  "Friday night", "No surprises", "Still the same",
  "Next: who does what",
];

export const C37ReleasesComposition = createEpisode({
  id: "c-37-releases",
  number: 40,
  part: 7,
  footer: "Releases",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
