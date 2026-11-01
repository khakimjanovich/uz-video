import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Has money moved?", "A tab book", "One line", "No cash yet", "End of the week", "The same way",
  "Two banks", "The acquirer", "Builds its system", "The issuer", "The buyer's money", "The card network",
  "May this card pay?", "The issuer checks", "Yes or no", "A promise", "Not money",
  "The money moves later", "One batch", "Settlement", "The fee", "Two moments",
  "Giving money back", "Before settlement", "Crossed out", "A reversal", "After settlement", "A new movement", "A refund",
  "Watch the product", "Pay", "Taking the payment", "Paid", "The issuer's yes",
  "Merchant portal", "Payments", "The paid one", "Every call", "Refundable until", "Give back",
  "Reversed or Refunded", "Never one word", "Daily reports",
  "What does it protect?", "The yes as money", "Money it never got", "Mixed up", "Never comes back", "Paid twice", "Someone loses money",
  "Two pairs", "Approved ≠ paid out", "Reversal ≠ refund",
  "The tab book", "In seconds", "End of the week", "Cross out, hand back", "Next: card data",
];

export const C02CardPaymentComposition = createEpisode({
  id: "c-02-card-payment",
  number: 2,
  part: 0,
  footer: "Approved ≠ paid out",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
