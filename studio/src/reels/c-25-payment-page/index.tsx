import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Nobody else", "A payment created", "The buyer pays", "Never on the shop's site", "No guessable address",
  "Only for the link's holder", "Only for a while", "Exactly what is paid", "Confirm twice", "A hotel key card",
  "One room", "The guest who holds it", "Until checkout", "The same way", "A link", "A page token", "Send the buyer",
  "Not the token", "Only a fingerprint", "The link expires", "The payment page", "Name, order, amount",
  "A live terminal", "A card-entry session", "Only into the frame", "A chosen number", "The payment fails",
  "One small message", "Only from the frame", "Never a card number", "Token to ecom", "This payment's card?",
  "Then the charge", "A page lock", "The buyer's side", "Tap the link", "Secure payment page", "The amount to pay",
  "Card details frame", "Double-click Confirm", "The first click", "The page is busy", "One step runs", "Too long, too many",
  "That attempt ended", "Payment page closed", "The link has expired", "Back to the shop", "What it protects",
  "Guessing addresses", "Live links", "The card number", "Two charges", "The buyer", "The shop",
  "Back to the key card", "Until checkout", "Next: the charge",
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
