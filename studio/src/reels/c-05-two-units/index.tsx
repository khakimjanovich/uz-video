import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Never see the card", "Lesson 4: tickets only", "Lesson 1: straight in", "This lesson: page and room", "A real shop", "The card reader", "The bank's reader", "Only a receipt",
  "The obvious design", "Through ecom", "One hop", "The full check", "The bank's reader on ecom",
  "Step by step", "Never talk freely", "Every question, written", "A contract", "Only what it allows",
  "A card-entry session", "One card, one payment", "An address",
  "A frame", "The card zone's window", "On ecom's counter",
  "Types the card", "Straight to the card zone", "Not on the way", "A receipt", "Never the number",
  "Charge by token", "This payment's session",
  "Watch the product", "The payment page", "Secure payment page", "The amount to pay", "Card details",
  "Number and date", "One short line", "Type the code", "Taking the payment", "Paid",
  "The wrong way", "Too long, too many", "The attempt ended", "Short-lived", "Used up",
  "A masked number", "All ecom holds",
  "What does it protect?", "Never through ecom", "No card leaks", "The shop never touches it", "One small room",
  "The token still matters", "A ticket for a coat", "A smaller check",
  "The counter", "Faces the buyer", "Receipts, never cards", "Next: settings",
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
