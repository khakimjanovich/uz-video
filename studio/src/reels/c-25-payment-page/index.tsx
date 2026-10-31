import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "And nobody else", "A hotel key card", "The payment page", "A one-time key", "Only a fingerprint", "The page shows",
  "The card frame", "Only a token", "Belongs to this payment", "A double click", "Next: the charge",
];

export const C25PaymentPageComposition = createEpisode({
  id: "c-25-payment-page",
  number: 25,
  part: 6,
  footer: "Payment page",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
