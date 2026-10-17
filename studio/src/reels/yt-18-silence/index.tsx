import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt18SilenceComposition = createEpisode({
  id: "yt-18-silence",
  number: 18,
  part: 4,
  footer: "When processing goes silent",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Taken or not?", "Timeout ≠ failure", "No blind retry", "Unknown + workflow", "Ask, with backoff", "Capture or reverse", "Manual review", "Sweep", "Next: events"],
  map,
  diagram,
});
