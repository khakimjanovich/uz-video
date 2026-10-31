import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Right to take payments", "A driving licence", "Earning states", "Know your business", "Real type, fingerprint",
  "Every document checked", "Verified, then contract", "From, to, who, why", "Years later",
  "Next: two people",
];

export const C17LifecycleComposition = createEpisode({
  id: "c-17-lifecycle",
  number: 17,
  part: 4,
  footer: "Earning a licence",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
