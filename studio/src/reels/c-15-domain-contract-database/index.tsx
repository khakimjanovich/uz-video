import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Where to start?", "The table first", "Any string", "Nobody wrote it down",
  "A board game", "The rules", "The rulebook", "The board, then play", "The same order",
  "State machine", "Allowed moves", "Verified, then live", "Stays closed",
  "The contract", "Can't drift",
  "Its own schema", "Changeset", "A new changeset", "An id only",
  "Play", "Even an error", "Problem detail", "In your language",
  "The rules in code", "Where each may move", "Nowhere", "One entry",
  "Rules, rulebook, board, play", "Next: merchants",
];

export const C15DomainContractDatabaseComposition = createEpisode({
  id: "c-15-domain-contract-database",
  number: 15,
  part: 3,
  footer: "Rules first",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  code,
});
