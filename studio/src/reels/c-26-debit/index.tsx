import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Exactly once", "Pay twice", "Retrying", "Two copies", "Each could charge", "A worse case", "Crashes",
  "Did money move?", "Nobody knows", "A cash desk", "One cashier", "The logbook first", "The same way", "The claim",
  "A single change", "Still card confirmed", "One caller wins", "The others stop", "Two things", "A live terminal",
  "The agreed fee", "Nothing charged", "Operation journal", "The bank's logbook", "Debit, requested",
  "Before any network", "One debit line", "By its token", "Its own id", "Still once", "Processing centre",
  "Hold the money", "Take it at once", "The capture", "Money is taken", "Three answers", "Approved", "Declined",
  "Unknown", "Never declined", "Never unpaid again", "The buyer's side", "Card into the frame", "Taking the payment",
  "Paid", "Too little money", "Payment declined", "The merchant portal", "Paid", "Open it", "The bank fee",
  "Calls to the card scheme", "One debit line", "Still one line", "What it protects", "A double charge", "No record",
  "Charged again", "Pay again", "Charged once", "Paid once", "What, and when", "Back to the cash desk",
  "One slip, one hand", "One charge", "Next: silence",
];

export const C26DebitComposition = createEpisode({
  id: "c-26-debit",
  number: 26,
  part: 6,
  footer: "The charge",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
