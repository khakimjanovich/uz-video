import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "The eighth of March", "Order 1042", "The network hiccups", "Arrived or not?", "Which half was lost?",
  "Lesson 24: a seal", "This lesson: one payment",
  "Send it again", "A second payment", "Two payment pages", "Pay both", "Money back, trust lost",
  "Retrying is right", "Recognise a retry",
  "Idempotency key", "A plain name", "Same on every retry", "The bank remembers",
  "Three things", "Same key, same request", "Nothing created", "The first answer", "An idempotent replay",
  "A different amount", "Refused", "Never safe to guess",
  "The same moment", "Both look new", "Written only once", "One wins", "The winner's answer",
  "The last lesson", "A fresh seal", "Same key, new seal", "Copies by strangers", "Ties the retries", "Opposites",
  "Order 1042 again", "Create with its key", "The answer is lost", "Sealed again", "The answer arrives", "A replay",
  "One payment, not two",
  "Tests the edge", "A different amount", "Key already used", "Still one payment",
  "The simplest rule", "Same key again", "A hard choice", "Pays once",
  "Next: the payment page",
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
