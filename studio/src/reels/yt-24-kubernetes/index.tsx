import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt24KubernetesComposition = createEpisode({
  id: "yt-24-kubernetes",
  number: 24,
  part: 5,
  footer: "Deploy to Kubernetes",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Laptop to production", "Replicas", "The image", "Probes", "Rolling update", "Graceful shutdown", "Config and secrets", "Jobs on every replica", "Autoscaling", "Lose a pod", "A local cluster", "Next: extraction"],
  map,
  diagram,
  code,
});
