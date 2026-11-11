import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Not a real person", "Needed every day", "MyID: real people", "How?", "Simulators, maker-checker", "Two zones",
  "The zones", "Two installations", "Stage, production", "Own everything", "Two MyID environments", "No route", "Only configuration", "Nothing else moves",
  "Test identity", "MyID test", "Listed in stage", "Expected result", "For example", "Same results",
  "Test flag", "Every stage customer", "Not counted", "Production: real", "No exceptions", "No back door",
  "Guards", "Will not start", "Database refuses", "Promotion",
  "Simulators", "No outside service", "Every answer", "On a laptop", "Each night",
  "Back to Aziz", "In stage", "On a laptop", "In production",
  "Recap", "Test identities", "One question", "Who builds it?", "Next: installing",
];

export const H38TestIdentitiesComposition = createEpisode({
  course: HEEYID,
  id: "h-38-test-identities",
  number: 38,
  part: 9,
  footer: "Two zones that never touch",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
