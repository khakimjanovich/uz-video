import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Never lose the news", "Save, then tell", "The shop never hears", "Paid for nothing", "Swap the order",
  "Tell, then crash", "Goods for nothing", "Split by a crash", "An outbox tray", "In one motion", "A postman",
  "In the tray, or open", "Nothing half done", "The same way", "Written to the outbox", "Inside the records",
  "Saved together", "Both or neither", "Never one alone", "The relay", "The postman", "The message stream",
  "Several copies", "Different letters", "Labelled with its payment", "One line, in order", "Never overtakes",
  "Marked after confirming", "The worst moment", "Sent once more", "At-least-once delivery", "Never zero times",
  "Its own id", "Drop the second", "One more rule", "Records are the truth", "The stream carries news",
  "Watch the product", "A buyer pays", "Paid", "Webhooks", "Stop the app", "Start it again", "Still paid",
  "Nothing missing", "Arrives twice", "The same id", "Keep the first", "What it protects", "Waiting forever",
  "Shipping goods", "The order of events", "The shop always hears", "Its own records", "Back to the tray",
  "One motion", "Knock twice, not zero", "Next: delivering news",
];

export const C28OutboxWebhooksComposition = createEpisode({
  id: "c-28-outbox-webhooks",
  number: 29,
  part: 5,
  footer: "The outbox",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
