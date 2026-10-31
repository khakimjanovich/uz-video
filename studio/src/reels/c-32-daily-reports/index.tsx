import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "What the merchant gets",
  "Counting the till",
  "Every night",
  "The business day",
  "Paid, fee, payout",
  "A negative payout",
  "Count again",
  "Every line",
  "Next: I never bought this",
];

export const C32DailyReportsComposition = createEpisode({
  id: "c-32-daily-reports",
  number: 32,
  part: 7,
  footer: "The merchant's day",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
