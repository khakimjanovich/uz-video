import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "A stolen database", "Sealed bags", "That machine: Vault", "Only the sealed value",
  "Tied to its own card", "A blind index", "Refuses the unsealed",
  "Fails closed", "Opened only to send", "Removed", "Just noise", "Next: first digits",
];

export const C09CardVaultComposition = createEpisode({
  id: "c-09-card-vault",
  number: 9,
  part: 2,
  footer: "Card vault",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
