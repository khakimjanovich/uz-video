import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "A tangle", "One Spring Boot app", "Quicker", "A fee change breaks refunds", "Many small services",
  "An apartment building", "Walled flats",
  "Modular monolith", "Walls", "The build fails",
  "The door", "Internal contract", "In-process", "Over HTTP",
  "Written by hand first", "The plumbing", "Platform library",
  "The wall in the build", "Contracts, never code", "Architecture rules", "Own walls", "Controllers call services",
  "Break the wall", "Import the repository", "It fails", "Whole again",
  "Walled flats", "Next: rules to database",
];

export const C14ProjectSetupComposition = createEpisode({
  id: "c-14-project-setup",
  number: 14,
  part: 3,
  footer: "Modular monolith",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  code,
});
