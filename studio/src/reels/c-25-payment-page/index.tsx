import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Sunday, 9:15", "At a bus stop", "No card on her site", "A link",
  "Lessons 25 and 5", "This lesson: the page",
  "Never touch a card", "No guessable address", "Only for its holder", "Only for a while", "Exactly what is paid", "Confirm twice",
  "The link", "A page token", "Not the token", "Only a fingerprint", "The link expires",
  "The page loads", "Name, order, amount", "A live terminal", "A card entry session", "Only into the frame",
  "A chosen number", "The payment fails", "One small message", "Only from the frame", "Never a card number",
  "Token to ecom", "This payment's card?", "Then the charge", "A page lock",
  "The buyer's phone", "Secure payment page", "Valid until", "Card details frame",
  "Double-click Confirm", "The first click", "The page is busy", "One step runs",
  "Too long, too many", "Enter the card again", "Closed, no money", "The link has expired", "Back to the shop",
  "Every rule, a door", "Guessing addresses", "Live links", "The card number", "Two charges",
  "Simple advice", "A number to count up", "Never touches a card",
  "Next: the charge",
];

export const C25PaymentPageComposition = createEpisode({
  id: "c-25-payment-page",
  number: 26,
  part: 5,
  footer: "Payment page",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
