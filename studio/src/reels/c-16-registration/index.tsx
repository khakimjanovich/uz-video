import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Who owns the email?", "Lesson 15: room done", "Lesson 1: the portal", "This lesson: sign-up", "Anyone can type it", "A stranger signs up", "Contracts and reports",
  "A postcard with a code", "Only who gets the post", "How it works", "The sign-up form",
  "Straight to login", "Never in ecom", "Saved as pending", "A one-time code",
  "Works once, short time", "Only the inbox reader", "Never the code itself", "Only fingerprints",
  "Email verification", "Wrong guesses counted", "Locked until it ends", "A lockout",
  "When to try again", "Code store down", "Fails closed", "Watch the product",
  "Sign up", "Create a merchant account", "Create account", "The test inbox",
  "A six-digit code", "Check your email", "Verify stays grey", "Send a new code",
  "Six digits", "One click", "Email verified", "Check their documents",
  "The first admin", "What does this protect?", "Someone else's name", "An address never seen",
  "The real owner", "The bank too", "The lockout", "Failing closed",
  "Only the owner gets in", "Next: take money",
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
  screens,
});
