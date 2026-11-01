import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Who decides the fee?", "One rate for everyone", "A lower rate", "A special offer",
  "A card costs more", "A tangle", "Changed in place", "Item beats aisle",
  "Most specific wins", "The bank's fee", "How it works", "A fee rule",
  "Website to whole bank", "Most specific wins", "Website beats merchant", "Merchant beats card",
  "The bank's default", "Percent plus fixed", "Minimum and maximum", "Whole cents",
  "Rounded once", "Never edited in place", "Proposed and approved", "No overlap",
  "Kept on every payment", "Last month explained", "Watch the product", "Fees",
  "Most specific wins", "Filters", "New rule", "Applies to",
  "Empty: bank default", "Needs a card", "Send for approval", "Another admin approves",
  "Fee changes", "Approve", "In force", "Fee calculator",
  "Right now", "Merchant and website", "The amount", "Calculate",
  "Merchant receives", "What does this protect?", "A change to the code", "Without four eyes",
  "Without whole cents", "Why they paid", "Merchants, bank, auditors", "Like price tags",
  "Next: e-POS",
];

export const C22CommissionComposition = createEpisode({
  id: "c-22-commission",
  number: 22,
  part: 4,
  footer: "Price tags",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
