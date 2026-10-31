import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Has money moved?", "A tab book", "A tab book", "A tab book", "No money yet", "No money yet",
  "Two banks", "The acquirer", "The issuer",
  "Is it OK?", "Yes or no", "A line, not money",
  "Settlement", "The fee", "The fee",
  "Giving back", "Crossed out", "Crossed out", "A refund", "A refund",
  "Two pairs", "Approved, not paid out", "Cancelled, not refunded",
  "In the code", "Given back", "Given back", "Reversed", "Refunded",
  "The tab book", "Next: card data",
];

export const C02CardPaymentComposition = createEpisode({
  id: "c-02-card-payment",
  number: 2,
  part: 0,
  footer: "Approved ≠ paid out",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  code,
});
