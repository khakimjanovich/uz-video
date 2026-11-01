import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Give money back", "A pair of shoes", "Three things wrong", "Refund twice", "Again, by phone", "Six months later",
  "Too much, too late", "The tab book", "Cross the line out", "A reversal", "Hand the money back", "A refund",
  "The day decides", "The bank's time zone", "The whole amount", "The refund cap", "The largest amount",
  "The refund window", "Working days", "Two bank admins", "Like the charge", "One claim", "The logbook first",
  "By token, with an id", "Approved is final", "Refused stays paid", "No answer: ask later", "Not alone",
  "The bank does it", "Refund by application", "Writes to the bank", "A second admin", "Watch the product",
  "A paid payment", "Refundable until", "Give back", "Give the money back?", "Reversed or refunded", "A reason",
  "Confirm", "Giving the money back", "Reversed", "A reversal line", "Money returned", "Above the cap",
  "No give back button", "Above the refund limit", "An old payment", "The window has closed", "Only views",
  "The admin portal", "Refund by application", "Application number", "Send for approval", "A second admin",
  "What it protects", "No double refunds", "Every refund explained", "Large or late", "Two admins",
  "Back to the tab book", "Today, or later", "Once, written first", "Next: one payment",
];

export const C30RefundsComposition = createEpisode({
  id: "c-30-refunds",
  number: 30,
  part: 6,
  footer: "Refunds",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
