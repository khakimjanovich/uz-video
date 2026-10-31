import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Paid?", "A registered letter", "A webhook", "It is signed", "Public internet only", "Tried again",
  "Ask for it again", "Next: without a website",
];

export const C28bWebhooksComposition = createEpisode({
  id: "c-28b-webhooks",
  number: "28b",
  part: 6,
  footer: "Webhooks",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
