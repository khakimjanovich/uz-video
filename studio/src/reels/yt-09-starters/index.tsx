import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt09StartersComposition = createEpisode({
  id: "yt-09-starters",
  number: 9,
  part: 1,
  footer: "Extract the platform libraries",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Same code twice?", "Where it lives", "Copies", "Platform libraries", "security", "Rules as config", "Before Boot", "keycloak", "Delegate", "Their own tests", "Unchanged", "Next: commission"],
  map,
  diagram,
  code,
});
