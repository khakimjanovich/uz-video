import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "The server's login", "Never your own keys", "A key of their own", "An API client", "Active merchants only",
  "Secret shown once", "A short-lived token", "Rotate the secret", "Owner's login untouched",
  "Next: the team",
];

export const C19ApiClientsComposition = createEpisode({
  id: "c-19-api-clients",
  number: 19,
  part: 4,
  footer: "The cleaner's own key",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
