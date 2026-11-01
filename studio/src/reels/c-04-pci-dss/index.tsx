import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Where may it live?", "An orders table", "The numbers spread", "A report", "A backup", "Every laptop",
  "Each one checked", "One weak laptop",
  "One rulebook", "PCI DSS", "Less to check",
  "A coat check", "A ticket", "Worth nothing to a thief", "Card numbers, same way",
  "The card zone", "Shares none of them", "Two doors", "Straight through",
  "ecom holds tickets", "A smaller check", "Smaller, not none",
  "The bank's network", "The bank owns the building",
  "Next: how they talk",
];

export const C04PciDssComposition = createEpisode({
  id: "c-04-pci-dss",
  number: 4,
  part: 1,
  footer: "PCI DSS scope",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
