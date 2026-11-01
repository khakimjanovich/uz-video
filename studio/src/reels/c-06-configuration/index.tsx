import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "A setting is missing", "Thirty seconds", "In production", "Forty seconds", "The payment failed",
  "The money is gone", "A guessed default",
  "A good cook", "The cook stops", "Never a pinch", "Our services",
  "No default value", "Vault", "Three kinds of value", "The system's own", "Secrets", "Ships none",
  "Only this bank knows", "Typed once",
  "Its own settings", "Names, never values", "Refuses to start", "Every missing one", "Fail fast",
  "Business decisions", "The bank's choices",
  "The card zone's settings", "Callers and roles", "Each caller", "Fraud limits", "Unused cards, keys", "Nightly clean-up",
  "Watch the product", "How it behaves", "The install", "A fraud limit missing", "The install stops",
  "Names the missing value", "Typed in, run again",
  "Nothing set", "It does not start", "Settings are missing", "Every one, by name", "Nothing half-works",
  "Nothing guessed", "The service starts",
  "What does it protect?", "No wrong guess", "No test password", "The bank in charge", "The buyer's money",
  "The cook", "Every ingredient", "From Vault, or not at all", "Next: who is calling",
];

export const C06ConfigurationComposition = createEpisode({
  id: "c-06-configuration",
  number: 6,
  part: 1,
  footer: "No defaults",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
