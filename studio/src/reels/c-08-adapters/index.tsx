import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Thursday, 6 p.m.", "Roses", "The bank says yes", "Forty seconds quiet", "What now?", "Timur's rule",
  "Lesson 7: agreed", "This lesson: the centre", "Processing centre", "Its own protocol", "Its own yes", "Every centre's language",
  "Change rarely", "One adapter per centre", "A separate service", "The centre's language", "One plain language",
  "Three requests", "Charge a card", "Give money back", "What happened?", "Behind the adapter",
  "The answers", "Three outcomes", "Approved", "Declined", "Unknown", "A timeout", "Unreadable answer",
  "Never declined", "Most teams", "Silence as no", "Pays twice", "Our own payment id", "Ask about it",
  "Asking moves no money", "It only reads", "What the buyer saw", "Taking the payment", "A few seconds",
  "The adapter at work", "A yes", "Paid", "Declined, then silence", "Not declined", "Confirming",
  "Within minutes", "An alert", "Could not reach", "Fail or unknown", "A new network", "One adapter",
  "Paid exactly once", "Next: keep it safe",
];

export const C08AdaptersComposition = createEpisode({
  id: "c-08-adapters",
  number: 8,
  part: 3,
  footer: "Adapters",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
