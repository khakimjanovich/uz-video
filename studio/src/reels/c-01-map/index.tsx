import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Behind the Pay button", "One payment", "Pay", "Create a payment", "A link", "The payment page",
  "The card zone", "Straight in", "A token", "Charge by token", "The buyer's bank", "Yes, in seconds", "Paid",
  "End of the day", "Every payment checked",
  "Three kinds of people", "One page", "A portal", "Approve shops, set fees",
  "Two products", "The shop's side", "The locked room", "Share nothing", "Locked room first",
  "Next: between the banks",
];

export const C01MapComposition = createEpisode({
  id: "c-01-map",
  number: 1,
  part: 0,
  footer: "Behind the Pay button",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
