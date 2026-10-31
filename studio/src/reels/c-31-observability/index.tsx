import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Follow one payment",
  "Still spinning",
  "The payment crossed",
  "Four places",
  "The wristband",
  "One trace number",
  "Every log line",
  "Cleaned first",
  "Own monitoring",
  "Dashboards and alerts",
  "Next: each day",
];

export const C31ObservabilityComposition = createEpisode({
  id: "c-31-observability",
  number: 31,
  part: 7,
  footer: "One trace number",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
