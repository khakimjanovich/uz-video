import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "First setup", "A missing line", "Guess or stop?",
  "Lesson 5", "Who sets the values?",
  "Many systems guess", "A hidden constant", "No default in the code", "Nobody signed it", "Nobody sees it",
  "OpenTofu", "Installation as code", "Policies and texts", "Version 0", "The default mark", "Missing: stop", "First minute",
  "Second gate", "One app with a level", "Not available",
  "Two kinds", "Policies", "Installation keys", "Panel: policies", "Panel: never keys",
  "A change", "Malika", "A proposal", "Current, new, reason", "Not yet", "A second admin", "Maker-checker", "New version", "Rejected: kept", "Earlier version", "Texts: Compliance",
  "Value checks", "Refused values", "No typo policies", "Still default?", "The bank's own decisions",
  "The missing line", "Version 0 complete", "Version 1", "Source, version, owner", "The configured time", "The bank's number",
  "Recap", "OpenTofu, version 0", "Missing: stop", "Maker-checker",
  "Timeouts", "Slow or down?", "Next: adapters",
];

export const H06ConfigurationComposition = createEpisode({
  course: HEEYID,
  id: "h-06-configuration",
  number: 4,
  part: 2,
  footer: "No default in the code",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
