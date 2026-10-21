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
  titles: ["Where to start?", "Stack, build, one command", "Java + Spring Boot", "Gradle is the pipeline", "Six modules", "A user per schema", "Module boundaries", "Layered", "Contract first", "Same interface, two sides", "Platform", "Composite build", "Version catalog", "One error format", "Separate services", "One command", "Secrets from Vault", "Next: the domain"],
  map,
  diagram,
});
