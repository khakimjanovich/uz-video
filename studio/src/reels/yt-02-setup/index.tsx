import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt02SetupComposition = createEpisode({
  id: "yt-02-setup",
  number: 2,
  part: 0,
  footer: "Setup",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Where to start?", "Builds + runs", "The stack", "Five modules", "Boundary test", "Platform", "Version catalog", "Error starter", "Contracts", "Same layers", "Infra repo", "Tools arrive later", "ECS logs + health", "One command", "Three kinds of tests", "Next: the domain"],
  map,
  diagram,
  code,
});
