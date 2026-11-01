import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Tuesday, 11 a.m.", "A wilted bouquet", "Nothing goes wrong",
  "Lessons 2 and 27", "This lesson: giving back",
  "Without care", "Give back twice", "Again, by phone", "Six months later", "Too much, too late",
  "The day decides", "Reversed", "A refund", "The bank's time zone", "The whole amount",
  "The refund cap", "The largest amount", "The refund window", "Working days", "Two bank admins",
  "Like the charge", "One claim", "The logbook first", "By token, with an id", "Approved is final", "Refused stays paid", "No answer: ask later",
  "Not alone", "The bank does it", "Refund by application", "Writes to the bank", "A second admin",
  "How it gives back", "The wilted bouquet",
  "The paid payment", "Refundable until", "Give back", "Give the money back?", "Reversed or refunded", "A reason", "Confirm",
  "Giving the money back", "Reversed", "A reversal line", "Money returned",
  "A hotel's large order", "No give back button", "Above the refund limit", "From the spring", "The window has closed", "Only views",
  "Writes to the bank", "Refund by application", "Application number", "Send for approval", "A second admin",
  "No double refunds", "Every refund explained", "Large or late", "Two admins", "Next: one payment",
];

export const C30RefundsComposition = createEpisode({
  id: "c-30-refunds",
  number: 32,
  part: 5,
  footer: "Refunds",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
