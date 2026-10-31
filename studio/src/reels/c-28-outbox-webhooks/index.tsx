import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Never lost, never invented", "Save, then tell", "Never told", "Goods for free",
  "An outbox tray", "One motion",
  "Outbox", "Same transaction", "Both or neither",
  "Relay", "Never the same row", "Keyed by payment",
  "Marked after Kafka", "At-least-once delivery", "Repeats dropped", "Truth and news",
  "In the code", "Same transaction", "One event row", "Skip locked", "Marked published",
  "The outbox tray", "Next: webhooks",
];

export const C28OutboxWebhooksComposition = createEpisode({
  id: "c-28-outbox-webhooks",
  number: 28,
  part: 6,
  footer: "Outbox",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  code,
});
