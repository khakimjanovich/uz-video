import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Sunday, 9:20", "The screen freezes", "Press again", "Charged exactly once", "Token, fee, terminal", "This lesson: the charge",
  "Only the start", "Retrying", "Two copies", "Each could charge", "A worse case", "Crashes", "Did money move?", "Nobody knows",
  "My rule", "Decide, write, act", "The claim", "A single change", "Still card confirmed", "One caller wins", "The others stop",
  "Two things", "A live terminal", "The agreed fee", "Nothing charged", "Operation journal", "The bank's logbook",
  "Debit, requested", "Before any network", "One debit line", "By its token", "Its own id", "Still once", "Timur's card zone",
  "Hold the money", "Take it at once", "The capture", "Money is taken", "Three answers", "Approved", "Declined", "Unknown",
  "Never declined", "Never unpaid again", "Taking the payment", "Paid", "Too little money", "Payment declined",
  "The merchant portal", "Tulips: paid", "She opens it", "The bank fee", "Calls to the card scheme", "One debit line",
  "Still one line", "Take away a step", "A double charge", "No record", "Charged again", "Pay again", "Charged once",
  "Paid once", "What, and when", "Next: silence",
];

export const C26DebitComposition = createEpisode({
  id: "c-26-debit",
  number: 27,
  part: 5,
  footer: "The charge",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
