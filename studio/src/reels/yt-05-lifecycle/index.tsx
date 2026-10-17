import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt05LifecycleComposition = createEpisode({
  id: "yt-05-lifecycle",
  number: 5,
  part: 1,
  footer: "Partner lifecycle",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Straight to active?", "No rules", "Fixed states", "The guard", "Verify + contract", "Status history", "Suspend + terminate", "Is it active?", "Next: four-eyes"],
  map,
  diagram,
});
