import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Monday", "Two empty hosts", "Before Aziz's number", "Lessons 4 and 21", "Into the bank",
  "One host per zone", "One copy of each image", "Compose stack", "In front", "Behind",
  "OpenTofu", "Values and defaults", "Into Vault", "Install script", "Missing: stop",
  "Vault sealed", "Unseal keys", "Two teams",
  "Not open yet", "One active app", "The mobile bank", "Refused until then", "Defaults shown",
  "Stage first", "Aziz is not real", "Test identity", "A known result", "Each night",
  "Test mark", "Not counted", "Production: real people", "No route", "Configuration only", "Data never moves",
  "Production guards", "Test mark refused",
  "On a laptop", "One command", "Simulators: lesson 5", "Never tired",
  "Done list", "Decisions", "Contracts", "Failure paths", "Audit stream", "Reviews", "Guides", "Acceptance in stage", "Sign-off",
  "Test identity in production", "What happens?", "Nothing gets in",
  "The journey", "Level 1", "Money to his mother", "Level 2", "The money phone", "Same phone", "Block, unblock", "The audit",
  "One installation",
  "Prove once, then bind", "Next module: a new phone",
];

export const H39InstallingComposition = createEpisode({
  course: HEEYID,
  id: "h-39-installing",
  number: 22,
  part: 6,
  footer: "Prove once, then bind",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
