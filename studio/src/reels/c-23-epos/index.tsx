import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Which machine?", "Lesson 21: its cards", "Lesson 8: adapters", "This lesson: terminals", "A machine on the counter", "No counter online", "Machines it issued",
  "The wrong numbers", "A licence plate", "Never reused", "How it works",
  "A virtual card machine", "A pair of numbers", "The MID and the TID", "One website, one card",
  "One live terminal", "Never registered twice", "Registered with the centre", "Kept if accepted",
  "Refused: nothing saved", "Suspend", "Can be resumed", "Revoking is final",
  "Who, what, why", "The live terminal", "No terminal, no charge", "Watch the product",
  "The website's page", "e-POS terminals", "No cards: grey", "One card: live",
  "Register", "MID, TID, card", "The pair the centre issued", "Registered",
  "Live", "Suspend, Resume, Revoke", "Revoke", "Never comes back",
  "Closed without revoking", "Before it takes payments", "A live e-POS terminal", "Every step done",
  "Ready: taking payments", "What does this protect?", "The wrong pair", "A pair used twice",
  "Exactly one way out", "Stops before it moves", "The bank's books", "Like a licence plate",
  "Next: signed requests",
];

export const C23EposComposition = createEpisode({
  id: "c-23-epos",
  number: 23,
  part: 4,
  footer: "A taxi's licence plate",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
