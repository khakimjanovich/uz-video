import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Tuesday, 10 a.m.", "Payment failed", "All sixteen digits", "Bekzod", "A support ticket", "Lesson 2: enough to pay", "This lesson: the words",
  "Lives in the ticket", "Backups, search, readers", "Never built to guard",
  "Dilnoza", "Last four are enough", "Card ending 7890", "Never the whole number", "The digits on the back",
  "Not a hacked server", "A helpful person",
  "The words", "The PAN", "A thief needs it most", "The card zone",
  "The security code", "Nobody may keep it", "Never even asks",
  "The masked number", "First six, last four", "Which bank", "Your own card", "Cannot be used to pay",
  "A card token", "A random name", "Nothing from the number", "Two tokens", "Tells a thief nothing",
  "Three rules", "The PAN", "May be shown", "May be kept", "Kept by no one",
  "The payment page", "Card details", "Number and date", "No code box", "Types the card", "One short line",
  "Bank admin portal", "A Card column", "A masked number", "No full card number",
  "Never needed the PAN", "Enough to find it", "Nothing to spend", "The PAN, if it leaks", "One room",
  "Deleted from the ticket", "The backups keep it", "Never paste it", "Next: where it lives",
];

export const C03CardDataWordsComposition = createEpisode({
  id: "c-03-card-data-words",
  number: 3,
  part: 1,
  footer: "PAN · masked · token",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
