import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence); a repeated title holds while the beat continues.
const TITLES = [
  "Where cards live", "A shop's orders", "A shop's orders", "The numbers spread", "The numbers spread", "The numbers spread",
  "The numbers spread", "Everything checked", "Everything checked", "One weak laptop", "One weak laptop",
  "The rulebook", "PCI DSS", "Less to check",
  "A coat check", "A coat check", "A coat check", "A coat check", "Tickets, not cards", "Only the room",
  "The card zone", "Shares nothing", "Shares nothing", "Two doors", "Payers' door", "Partner door", "Straight in", "No way in",
  "ecom holds tickets", "ecom holds tickets", "ecom holds tickets", "ecom holds tickets",
  "The honest part", "A smaller check", "A smaller check", "Smaller, not none", "Smaller, not none",
  "Check it", "Check it", "Check it", "Two doors open",
  "One place", "The bank's building", "Room and building", "Next: two units",
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
  code,
});
