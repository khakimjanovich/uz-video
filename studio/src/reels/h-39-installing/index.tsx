import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Monday", "Two clusters", "Until Aziz's first number", "OpenTofu, two zones", "Install it", "One bank", "No call home",
  "Configuration", "OpenTofu", "Version 0", "Missing: stop",
  "The units", "Helm chart", "In front", "Behind", "Keys", "One realm",
  "The gate", "One app with a level", "Defaults shown", "Stage first", "Then production",
  "On a laptop", "One command", "Simulators and seed", "No internet",
  "When is it done?", "Checkable lines", "Decisions", "API contracts", "Every failure path", "Audit stream", "Reviews", "Docs", "Sign-off",
  "The road", "Level 1", "Level 2, once", "Linked and trusted", "Side apps", "Rank and refusal", "Lifecycle and trail", "Operations", "One installation",
  "Prove once, then bind", "heeyID",
];

export const H39InstallingComposition = createEpisode({
  course: HEEYID,
  id: "h-39-installing",
  number: 39,
  part: 9,
  footer: "Prove once, then bind",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
