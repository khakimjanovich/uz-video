import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt12AdaptersComposition = createEpisode({
  id: "yt-12-adapters",
  number: 12,
  part: 3,
  footer: "Uzcard + Humo adapters",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Two languages", "JSON-RPC + SOAP", "Knows both?", "Separate services", "One envelope", "Commands + clients", "Status table", "Our decline codes", "Uzcard: one step", "Sent twice?", "Humo: hold + capture", "Humo reconciliation", "Service groups + one port", "Three outcomes", "Timeout ≠ decline", "Next: the card vault"],
  map,
  diagram,
  code,
});
