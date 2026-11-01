import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "A different language", "A plug adapter", "Every socket differs", "Plug never changes", "Never rewire",
  "The right adapter", "The same problem", "Processing centre", "Its own protocol", "Its own protocol", "Every centre's language",
  "Change rarely", "One adapter per centre", "A separate service", "The centre's language", "One plain language",
  "One plug shape", "Charge a card", "Give money back", "What happened?", "The same questions", "Behind the plug",
  "The answers", "Hundreds of ways", "Three outcomes", "Approved", "Declined", "Unknown", "A timeout", "Unreadable answer",
  "Never declined", "A lost yes", "Pay twice", "Our own payment id", "The centre keeps it", "Ask about it",
  "Asking moves no money", "Asking moves no money", "Watch the product", "Pressed Pay", "Taking the payment",
  "A few seconds", "The plug at work", "A yes", "Paid", "Payment declined", "Not declined", "Confirming",
  "Within minutes", "An alert", "Could not reach", "Fail or unknown", "What it protects", "Odd error codes",
  "A lost yes", "Every centre's quirks", "The buyer's money", "A new adapter", "The travel plug", "A fourth adapter",
  "The laptop stays", "Silence is never no", "Next: keep it safe",
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
