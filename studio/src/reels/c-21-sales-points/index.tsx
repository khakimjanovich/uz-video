import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Every website?", "A second website", "All checks for nothing", "Every stall inspected",
  "Websites the same way", "How it works", "A sales point", "Starts as a draft",
  "Back to the shop", "A return address", "Secure, on its own site", "Never somewhere else",
  "Only while a draft", "A site check", "Say what is wrong", "The deal",
  "Which cards", "Per payment, per day", "Switched on", "A terminal and a fee",
  "One question", "Both active", "Watch the product", "Websites",
  "Checked by the bank", "Add website", "Return addresses", "The bank will check it",
  "Somebody else's site", "The server refuses", "The bank admin portal", "This website",
  "Before it takes payments", "Switch on is grey", "Steps 1 to 3", "Record a check",
  "Deal terms", "One card", "Empty means no limit", "Switch on lights up",
  "One click", "No terminal or fee yet", "What does this protect?", "A copycat shop",
  "Strict return addresses", "The site check", "One single question", "Like a market stall",
  "Next: the fee",
];

export const C21SalesPointsComposition = createEpisode({
  id: "c-21-sales-points",
  number: 21,
  part: 4,
  footer: "Stalls at a licensed market",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
