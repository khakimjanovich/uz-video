import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Saturday market", "Pays by card", "The bank's reader", "Only a receipt", "Lesson 4: tokens only", "This lesson: the reader on the web",
  "The obvious design", "Through ecom", "One hop", "The full check", "Copy the stall", "Six steps",
  "Never talk freely", "Every question, written", "A contract", "Only what it allows",
  "A card entry session", "One card, one payment", "An address",
  "A frame", "The card zone's window", "On ecom's counter",
  "Types the card", "Straight to the card zone", "Not on the way", "A receipt", "Never the number",
  "Charge by token", "This payment's session",
  "Sunday evening", "Secure payment page", "The amount to pay", "Card details",
  "Number and date", "One short line", "Type the code", "Taking the payment", "Paid",
  "Making tea", "Too many tries", "The attempt ended", "Short-lived", "Used up",
  "A masked number", "All ecom holds",
  "Never through ecom", "No card leaks", "Malika never touches it", "One small room",
  "The token still matters", "Guarded with care", "A smaller check",
  "On the table", "Inside the page", "Receipts, never cards", "Next: settings",
];

export const C05TwoUnitsComposition = createEpisode({
  id: "c-05-two-units",
  number: 5,
  part: 2,
  footer: "The bank's card reader",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
