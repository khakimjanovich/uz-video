import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Friday, 9 p.m.", "Forty bouquets", "Paid ×40", "Saturday morning", "Nothing there", "Nothing went wrong", "Paid = ?",
  "Lesson 1: one word", "This lesson: the yes",
  "Two banks", "The acquirer", "The issuer", "May this card pay?", "About two seconds",
  "A promise", "Money set aside", "Nothing moved",
  "Later, in bulk", "One batch", "Settlement", "The fee", "Monday",
  "Approved ≠ paid out", "Paid on a yes", "The bank covers it",
  "Cancel my order", "Settled yet?", "Today", "Cancel the promise", "A reversal", "Friday's payment", "A new movement", "A refund",
  "Mix them up", "Never back", "Paid twice", "Two words",
  "The product", "A code", "Paid", "The issuer's yes", "Malika's portal", "Refundable until", "Give back", "Reversed or Refunded",
  "Monday morning", "Daily reports",
  "Promised", "Yours", "Next: card data",
];

export const C02CardPaymentComposition = createEpisode({
  id: "c-02-card-payment",
  number: 2,
  part: 1,
  footer: "Approved ≠ paid out",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
