import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Never losing the news", "Save, then tell", "A crash in between", "Swap the order", "An outbox tray",
  "Both or neither", "A relay", "Twice, never zero", "Its own id", "Next: delivering",
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
});
