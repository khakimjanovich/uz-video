import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "The server's login", "Lesson 18: switched on", "Lesson 1: the server", "This lesson: its own login", "The owner's password", "A shared code store", "The developer leaves",
  "Looks like the owner", "Never your house keys", "A key of their own", "The server gets the same",
  "How it works", "An API client", "An id and a secret", "Shown exactly once",
  "Never the secret", "Nobody can read it back", "To the login server", "A short-lived token",
  "Only the token", "Machine login only", "People's logins cannot", "The secret leaked",
  "Rotation", "Owner's login untouched", "Active merchants only", "Watch the product",
  "Not switched on yet", "No button at all", "Open when you are live", "An active merchant",
  "Access tokens", "New client", "Your new API client", "Client id and secret",
  "The only time", "Stored safely", "The new client", "The secret is gone",
  "The token works", "Rotate secret", "Stops immediately", "Confirms",
  "A new secret, once", "Old secret refused", "What does this protect?", "A password leaks",
  "A key for each server", "Cut off in one click", "The bank can't leak it", "Like the cleaner's key",
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
  screens,
});
