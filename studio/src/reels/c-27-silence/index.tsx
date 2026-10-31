import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Never answers", "Tracking says nothing", "No second parcel", "Ask in person", "An unknown charge",
  "A durable workflow", "Found means paid", "Not found: declined", "The money goes back", "Manual review",
  "Next: the shop hears",
];

export const C27SilenceComposition = createEpisode({
  id: "c-27-silence",
  number: 27,
  part: 6,
  footer: "Silence",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
