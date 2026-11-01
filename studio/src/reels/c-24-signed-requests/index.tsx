import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Tuesday, 11 p.m.", "A test payment fails", "Token in a log",
  "Lesson 19: a token", "This lesson: not enough",
  "Who you are", "Who wrote this?", "Tokens leak", "A support chat", "Any amount, any address",
  "A second danger", "Sent again tomorrow", "Stop at the token", "The common mistake",
  "Seal every request", "Request signature", "The method", "The full address", "The token",
  "A body fingerprint", "Time and a number", "No longer fits",
  "A signing key", "Only two parties", "The key safe", "Read, never change",
  "A fixed order", "Fresh", "Matches its fingerprint", "The right client", "Seal again, compare",
  "Spend the number", "The nonce", "Can't burn numbers",
  "One more rule", "Her own website",
  "Wednesday morning", "Builds the body", "Seals and sends", "Answer at once", "Payment created",
  "Waiting for the buyer",
  "Plays the attacker", "The same request", "Already used", "A changed amount", "Body no longer matches",
  "Sealed yesterday", "No longer fresh", "List stays the same", "Nothing new",
  "Worth nothing", "A blank cheque", "A thousand times", "Every number", "Against copies", "The key itself",
  "Next: sent twice",
];

export const C24SignedRequestsComposition = createEpisode({
  id: "c-24-signed-requests",
  number: 24,
  part: 5,
  footer: "Signed requests",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
