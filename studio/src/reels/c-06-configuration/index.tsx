import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "A setting is missing", "A good cook", "Our services", "No default value", "Wrong in production",
  "Vault", "Typed in once", "Generated, never typed",
  "Exactly its own settings", "Refuses to start", "Fail fast",
  "The bank's decisions", "Next: who is calling",
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
