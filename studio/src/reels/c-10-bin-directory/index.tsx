import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Which network?", "Lesson 3: first six", "Lesson 9: sealed", "This lesson: first digits", "A phone number", "The country", "Before anyone answers", "Never who", "A longer code",
  "A card number", "Network and bank", "The BIN", "A list of BINs", "The BIN list", "Copied in", "On a schedule",
  "An empty list", "Keeps its old list", "Better than no list", "A lookup", "The first eight", "Eight, seven, six",
  "Longest match wins", "In memory", "Only eight digits", "Never the whole", "Unknown BIN", "An empty list",
  "Why it matters", "Checks the network", "Some networks", "Refused right there", "No network bothered",
  "No phone buzzes", "Watch the product", "The payment page", "The networks it accepts", "Another network",
  "Doesn't accept", "Doesn't accept", "Nobody's phone", "No network listed", "Starting with those", "Nothing is sent",
  "A card it accepts", "A code arrives", "Types and confirms", "Card accepted", "The masked number", "The first digits alone",
  "Nothing alarming", "A normal refusal", "The lists stop", "What it protects", "The wrong centre", "A phone would buzz",
  "Should never see it", "Stops at first digits", "The number itself", "Only the first eight", "Back to the phone",
  "A country code", "The same", "Never the person", "Next: the card form",
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
