import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt19EventsComposition = createEpisode({
  id: "yt-19-events",
  number: 19,
  part: 4,
  footer: "Outbox + Kafka",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Who else needs to know?", "Lost in between", "Same transaction", "The relay", "Crash-safe", "Merchant webhook", "Truth vs news", "Next: payment links"],
  map,
  diagram,
});
