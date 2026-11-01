import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "11:10 p.m.", "Another network", "The phone stays dark", "Answers at once", "How did it know?", "Lesson 3: first six", "Tonight's digits",
  "Network and bank", "The BIN", "A list of BINs", "The BIN list", "Copied in", "On a schedule", "An empty list",
  "Keeps its old list", "Better than no list", "A longer code", "The first eight", "Eight, seven, six", "Longest match wins",
  "In memory", "Only eight digits", "Never the whole", "Not an error", "An empty list", "The order",
  "Checks the network", "Refused right there", "No network bothered", "No phone buzzes", "The request never sent",
  "The wrong centre", "A phone buzzes", "Should never see it", "Tonight's buyer", "The networks it accepts",
  "Another network", "Doesn't accept", "Nothing sent", "No listed network", "Starting with those", "Nothing sent",
  "A card it accepts", "A code arrives", "Card accepted", "The masked number", "The first digits alone",
  "Nobody woken", "A normal refusal", "The lists stop", "Never the person", "Next: the card form",
];

export const C10BinDirectoryComposition = createEpisode({
  id: "c-10-bin-directory",
  number: 10,
  part: 3,
  footer: "First digits",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
