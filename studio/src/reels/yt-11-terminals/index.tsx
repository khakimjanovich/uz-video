import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt11TerminalsComposition = createEpisode({
  id: "yt-11-terminals",
  number: 11,
  part: 2,
  footer: "Terminals (MID/TID)",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Which terminal?", "Unknown terminal", "The registry", "Per scheme", "Resolve first", "Fail closed", "Audit log", "Next: card schemes"],
  map,
  diagram,
});
