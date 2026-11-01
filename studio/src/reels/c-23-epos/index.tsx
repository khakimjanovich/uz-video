import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Wednesday", "One step left",
  "Lessons 21 and 8",
  "A card machine", "Which machine?", "Machines it issued", "The wrong numbers",
  "A virtual card machine", "A pair of numbers", "The MID and the TID",
  "The website's page", "e-POS terminals", "No cards: grey", "One card: live", "Dilnoza clicks it", "MID, TID, card", "The pair the centre issued",
  "One website, one card", "One way out", "Registered with the centre", "Kept if accepted", "Refused: nothing saved", "It accepts",
  "Registered", "Live", "Suspend, Resume, Revoke", "Can be resumed", "Revoking is final", "Revoke", "Never comes back", "Closed without revoking",
  "Who, what, why",
  "Never registered twice", "A licence plate", "Reuse an old pair?", "Histories mixed",
  "Before it takes payments", "A live e-POS terminal", "Every step done", "Ready: taking payments",
  "The live terminal", "No terminal, no charge", "Saturday",
  "Next: signed requests",
];

export const C23EposComposition = createEpisode({
  id: "c-23-epos",
  number: 23,
  part: 4,
  footer: "One pair, never reused",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
