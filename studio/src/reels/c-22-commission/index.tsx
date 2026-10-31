import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Who decides the fee?", "Tag, sign, offer", "Most specific wins", "The bank's fee", "Most specific rule",
  "Percent plus fixed", "Whole cents", "Never edited in place", "A second admin approves", "Never two at once",
  "Every payment keeps it", "Next: the card machine",
];

export const C22CommissionComposition = createEpisode({
  id: "c-22-commission",
  number: 22,
  part: 5,
  footer: "Price tags",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
