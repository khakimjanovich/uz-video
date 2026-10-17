import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt24KubernetesComposition = createEpisode({
  id: "yt-24-kubernetes",
  number: 24,
  part: 5,
  footer: "Deploy to Kubernetes",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Laptop to production", "Container image", "Helm + replicas", "Probes", "Secrets from Vault", "Jobs run once", "Kill a pod", "Next: extraction"],
  map,
  diagram,
});
