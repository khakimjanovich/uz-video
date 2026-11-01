import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "A fair question", "One minute",
  "Lessons 2 and 21",
  "One rate for everyone", "A lower rate", "A tangle",
  "Fee rules", "One price", "Website to whole bank", "Most specific wins", "Website beats merchant", "Merchant beats card", "The bank's default", "The shop next door",
  "Percent plus fixed", "Minimum and maximum", "Whole cents", "Rounded once", "Nothing leaks away",
  "Dilnoza opens Fees", "Most specific wins", "Filters", "New rule", "Applies to", "Empty: bank default", "Needs a card", "Send for approval", "Another admin",
  "Never edited in place", "Four eyes", "Fee changes", "A colleague approves", "In force", "No overlap",
  "Malika's question", "Fee calculator", "Right now", "Shop and website", "The amount", "Calculate", "Malika receives",
  "Kept on every payment", "Last March",
  "Next: e-POS",
];

export const C22CommissionComposition = createEpisode({
  id: "c-22-commission",
  number: 22,
  part: 4,
  footer: "Most specific wins",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
