import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "The same payment twice?", "Lesson 24: sealed", "An honest repeat", "This lesson: one payment", "At checkout", "Create a payment", "The network hiccups", "The network hiccups",
  "No answer", "Which half was lost?", "Send it again", "A second payment", "Two payment pages", "Pay both",
  "Give money back", "Retrying is right", "Recognise a retry", "A lift button", "Press it once", "Ten more times",
  "One lift", "The same thing", "The same way", "Idempotency key", "A plain name", "The same on every retry",
  "The bank remembers", "Three things", "Same key, same request", "Nothing created", "The first answer",
  "An idempotent replay", "A different request", "Refused", "Never safe to guess", "The same moment",
  "Both look new", "Written only once", "One wins", "The winner's answer", "The previous lesson", "A fresh seal",
  "The same key", "Copies by strangers", "Ties the retries", "The merchant's server", "Create with its key",
  "The answer is lost", "The same key", "The answer arrives", "Marked as a replay", "One payment, not two",
  "A different amount", "Already used", "Still one payment", "What it protects", "Paying twice",
  "Refunds, angry calls", "Send it again", "A hard choice", "Always safe", "Back to the lift", "Ten times",
  "One payment", "Next: the payment page",
];

export const C24bIdempotencyComposition = createEpisode({
  id: "c-24b-idempotency",
  number: 25,
  part: 5,
  footer: "Idempotency",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
