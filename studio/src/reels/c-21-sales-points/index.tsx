import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "April", "Wedding flowers", "It does not", "Lessons 18 and 20", "A brand's copy", "Checks for nothing",
  "Malika opens Websites", "Checked by the bank", "Add website", "Return addresses",
  "A sales point", "The return address", "Secure, on its own site", "Most underrated field", "A fake thank-you page",
  "Bekzod tests it", "The server refuses", "The bank will check it", "Starts as a draft", "Only while a draft",
  "At the bank", "Before it takes payments", "Switch on is grey", "What switching on needs",
  "Record a check", "Say what is wrong", "Deal terms", "Per payment, per day",
  "One card", "Empty means no limit", "Switch on lights up", "One click", "No terminal or fee yet",
  "Not the end", "A terminal and a fee", "One question", "Both active", "Suspend either one",
  "Every website checked", "Next: the fee",
];

export const C21SalesPointsComposition = createEpisode({
  id: "c-21-sales-points",
  number: 21,
  part: 4,
  footer: "Each website checked",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
