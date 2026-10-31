import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Compliant on its own?", "A brochure", "The assessor asks", "None of them", "Nobody's job",
  "Room and building",
  "A guide", "Three things",
  "Responsibility matrix", "Twelve requirements", "Not a claim", "The network", "Logging", "ecom's own matrix",
  "Known gaps", "Until it is fixed",
  "Not certified", "The assessor",
  "Read the guide", "No compliance claimed", "Section 11", "Physical: the bank's", "Section 12", "Every release",
  "Room and building", "The whole course",
];

export const C38ResponsibilityComposition = createEpisode({
  id: "c-38-responsibility",
  number: 38,
  part: 8,
  footer: "Who does what",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  code,
});
