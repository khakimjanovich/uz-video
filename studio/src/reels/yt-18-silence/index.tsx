import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt18SilenceComposition = createEpisode({
  id: "yt-18-silence",
  number: 18,
  part: 4,
  footer: "When processing goes silent",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Total silence", "Unknown, not declined", "Ask again, later", "A workflow", "Waits that grow", "Same reference", "Settled", "Manual review", "One per payment", "The sweep", "If Temporal is down", "The page keeps checking", "On the dashboard", "Next: outbox + Kafka"],
  map,
  diagram,
  code,
});
