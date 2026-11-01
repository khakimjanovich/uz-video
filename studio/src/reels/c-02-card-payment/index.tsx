import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Has money moved?", "A tab book", "A line in the book", "End of the week", "The same way",
  "Two banks", "The acquirer", "The issuer",
  "Is it OK?", "Yes or no", "A line, not money",
  "Settlement", "The fee",
  "Giving money back", "A reversal", "A refund", "Loses money",
  "Two pairs", "Next: card data",
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
});
