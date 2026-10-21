import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt09StartersComposition = createEpisode({
  id: "yt-09-starters",
  number: 9,
  part: 1,
  footer: "Platform libraries",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Shared code?", "Every module", "Copies", "Platform libraries", "security", "Rules as config", "Before Boot", "Module filters", "keycloak", "Timeouts + retry", "Delegate", "Own defaults", "Version catalog", "Next: commission"],
  map,
  diagram,
  code,
});
