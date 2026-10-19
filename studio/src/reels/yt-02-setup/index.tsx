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
  titles: ["Where to start?", "Builds + runs", "The stack", "Six modules", "Module boundaries", "Platform", "Version catalog", "One error format", "Contracts", "Same layers", "Separate services", "Infra repo", "ECS logs + health", "One command", "Four repositories", "Next: the domain"],
  map,
  diagram,
  code,
});
