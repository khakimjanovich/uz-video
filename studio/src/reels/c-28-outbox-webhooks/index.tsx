import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Monday, 8:15 a.m.", "The app restarts", "Ships only on paid", "Will the news arrive?", "Paid, declined, told",
  "This lesson: the news", "Two steps", "Save, then tell", "The shop never hears", "Paid for nothing", "Swap the order",
  "Tell, then crash", "Peonies for nothing", "Split by a crash", "Until one restart", "Written to the outbox",
  "Inside the records", "Saved together", "Both or neither", "Never one alone", "The relay", "The message stream",
  "Several copies", "Different news", "Labelled by payment", "One line, in order", "Never overtakes",
  "Marked after confirming", "The worst moment", "Sent once more", "At least once", "Never zero times", "Its own id",
  "Drop the second", "One more rule", "Records are the truth", "The stream carries news", "An ordinary day",
  "A buyer pays", "Paid", "Webhooks", "Monday's restart", "Stopped at paid", "A minute later", "Still paid",
  "Nothing missing", "Bekzod's server", "The same id", "Keep the first", "Never waits forever", "No ghost payments",
  "Paid before refunded", "Its own records", "Next: delivering news",
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
