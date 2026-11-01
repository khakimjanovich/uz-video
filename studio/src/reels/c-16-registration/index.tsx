import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Sunday night", "Lesson 15: card zone", "Her first five minutes",
  "Create a merchant account", "Create account", "Straight to login", "Never in ecom", "Saved as pending",
  "Her phone buzzed", "Six digits",
  "Why a code?", "Anyone's email", "A stranger", "Really yours?",
  "A one-time code", "Only the inbox reader", "Never the code itself", "Only fingerprints",
  "Check your email", "Verify stays grey", "Send a new code", "Verify lit up", "One click", "Email verified",
  "Email verification", "The first admin",
  "And the stranger?", "Wrong guesses counted", "Locked until it ends", "A lockout", "When to try again",
  "One more case", "Code store down", "Just this once", "An unchecked shop", "Fails closed",
  "The real owner", "The bank too", "Malika never noticed", "A green tick",
  "Next: take money",
];

export const C16RegistrationComposition = createEpisode({
  id: "c-16-registration",
  number: 16,
  part: 4,
  footer: "Is this inbox really yours?",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
