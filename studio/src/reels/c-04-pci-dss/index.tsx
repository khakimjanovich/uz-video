import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence); a repeated title holds while the beat continues.
const TITLES = [
  "Where cards live", "A flat network", "A flat network", "Everywhere", "The cost", "The cost", "The way out", "The way out",
  "PCI DSS", "The CDE", "Connected = inside", "Security-impacting", "All in scope", "Segmentation", "Smaller scope", "Out of scope",
  "The card zone", "The card zone", "Shares nothing", "Shares nothing", "Two doors", "Payers' door", "Callers' door", "No way in",
  "ecom: not the CDE", "ecom: still in scope", "ecom: still in scope", "Twelve requirements", "Twelve requirements",
  "Who does what", "Product", "The bank", "Shared", "The assessor", "No certificate",
  "Check it", "The flow list", "Flows in", "Flows out", "Two doors published", "Consoles on loopback", "No database port",
  "Six routes", "Six routes", "What is published", "What is published", "Ask the door", "200 and 404", "Install check",
  "Who does what", "Checked", "Next: two units",
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
