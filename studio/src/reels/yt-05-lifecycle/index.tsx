import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt05LifecycleComposition = createEpisode({
  id: "yt-05-lifecycle",
  number: 5,
  part: 1,
  footer: "Partner lifecycle",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Straight to active?", "No rules", "Fixed states", "One table", "The guard", "Email first", "The contract", "Status history", "Never updated", "Suspend + terminate", "Own starting state", "Admin header", "Tests", "Under load", "Next: four-eyes"],
  map,
  diagram,
  code,
});
