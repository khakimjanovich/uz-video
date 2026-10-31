import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "A server's login", "A portal password", "In git", "The owner's login", "Looks like the owner",
  "The cleaner's key", "A key of their own",
  "API client", "Active merchants only", "Client secret", "Never the secret", "A token", "Merchant role only",
  "Rotation", "Stops at once",
  "What ecom keeps", "No secret column", "Shown once", "Stops immediately",
  "Check it", "Bearer", "Rotate", "Refused",
  "The cleaner's key", "Next: merchant users",
];

export const C19ApiClientsComposition = createEpisode({
  id: "c-19-api-clients",
  number: 19,
  part: 4,
  footer: "API clients",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  code,
});
