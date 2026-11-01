import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Just use my password", "For about a month",
  "Lesson 18: switched on",
  "A shared code store", "Bekzod moves on", "Looks like Malika", "Never as a person",
  "API clients", "No button at all", "Open when you are live", "Active merchants only", "Access tokens",
  "New client", "A machine's login", "Your new API client", "Client id and secret", "The only time", "Stored safely",
  "The window closes", "The new client", "The secret is gone",
  "Never the secret", "Nobody can read it back",
  "To the login server", "A short-lived token", "Only the token", "Machine login only", "Not even Malika's",
  "Thursday", "No panic", "Rotate secret", "Stops immediately", "He confirms", "A new secret, once",
  "Rotation", "Old secret refused", "Malika untouched",
  "A key for each server", "Cut off in one click", "The bank can't leak it",
  "Next: Malika's team",
];

export const C19ApiClientsComposition = createEpisode({
  id: "c-19-api-clients",
  number: 19,
  part: 4,
  footer: "A server's own login",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
