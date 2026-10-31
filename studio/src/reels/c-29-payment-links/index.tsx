import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "No website", "In a messenger", "A payment link", "Made in the portal", "An ordinary payment", "Shown once",
  "The same bank page", "Closed", "Next: money back",
];

export const C29PaymentLinksComposition = createEpisode({
  id: "c-29-payment-links",
  number: 29,
  part: 6,
  footer: "Payment links",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
