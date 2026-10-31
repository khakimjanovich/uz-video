import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Who owns the email?", "Anyone can type it", "A one-time code", "Type it back", "Email verification",
  "Short time, one sign-up", "Too many wrong codes", "Straight to login", "Code store down", "The first admin",
  "Next: take money",
];

export const C16RegistrationComposition = createEpisode({
  id: "c-16-registration",
  number: 16,
  part: 4,
  footer: "A postcard with a code",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
