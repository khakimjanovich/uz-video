import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Really written?", "A token", "A wax seal", "Signing key", "Fresh, matches, right", "Spend the serial",
  "A changed amount", "An old request", "A copied request", "Next: twice on purpose",
];

export const C24SignedRequestsComposition = createEpisode({
  id: "c-24-signed-requests",
  number: 24,
  part: 6,
  footer: "Signed requests",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
