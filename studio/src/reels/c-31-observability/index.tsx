import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Follow one payment", "Spinning", "Four machines", "Guesswork", "A card number in the logs?",
  "A wristband", "One number",
  "Trace", "X-Request-Id", "Quote it to support", "Every log line",
  "Log masking", "First six, last four",
  "Its own Grafana", "How payments end", "Alert rules",
  "In the code", "Before security", "Into the response", "Stars in the middle", "Thirteen to nineteen digits",
  "One wristband", "Next: daily reports",
];

export const C31ObservabilityComposition = createEpisode({
  id: "c-31-observability",
  number: 31,
  part: 7,
  footer: "Observability",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  code,
});
