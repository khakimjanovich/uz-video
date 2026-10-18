import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt03MethodComposition = createEpisode({
  id: "yt-03-method",
  number: 3,
  part: 0,
  footer: "Domain → contract → database",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Where to start?", "The domain", "One-page sketch", "IDs, not FKs", "The contract", "Generated jar", "The database", "Its own data source", "The layers", "Not found", "Two tests", "Swagger UI", "Under load", "Every episode", "The repositories", "Next: sign-up"],
  map,
  diagram,
  code,
});
