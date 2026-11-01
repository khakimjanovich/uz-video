import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Really from ecom?", "An office building", "Every call", "A certificate", "Mutual TLS",
  "An access token", "Roles", "Only what roles allow", "Steal one proof",
  "Its own pass office", "Next: card networks",
];

export const C07IdentityComposition = createEpisode({
  id: "c-07-identity",
  number: 7,
  part: 1,
  footer: "Two proofs",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
