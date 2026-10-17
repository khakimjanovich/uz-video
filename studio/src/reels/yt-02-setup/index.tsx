import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt02SetupComposition = createEpisode({
  id: "yt-02-setup",
  number: 2,
  part: 0,
  footer: "Setup",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Where to start?", "Builds + runs", "The stack", "Five modules", "Boundary test", "Pinned versions", "Docker Compose", "Tools arrive later", "Logs + health", "One command", "Next: the domain"],
  map,
  diagram,
});
