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
  titles: ["Total silence", "Unknown, not declined", "Ask again, later", "A workflow", "Status checks only", "Same reference", "Humo: capture is its own step", "Settled", "Not found, too early?", "Page closed → reversal", "Before the cut-off", "Manual review", "Needs review", "An audited decision", "One per payment", "The sweep", "If Temporal is down", "SMS owed", "On the dashboard", "Stuck → alert", "Next: outbox + Kafka"],
  map,
  diagram,
  code,
});
