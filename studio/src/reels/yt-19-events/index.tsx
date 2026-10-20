import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt19EventsComposition = createEpisode({
  id: "yt-19-events",
  number: 19,
  part: 4,
  footer: "Outbox + Kafka",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Who tells the shop?", "Lost in between", "Same transaction", "The payment raises it", "Into the outbox", "Skip locked", "Keyed by payment", "Drop repeats", "One webhook per site", "Standard Webhooks", "Retry, then wait longer", "Dead-letter topic", "Every attempt logged", "Truth vs news", "Next: payment links"],
  map,
  diagram,
  code,
});
