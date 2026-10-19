import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt13CardVaultComposition = createEpisode({
  id: "yt-13-card-vault",
  number: 13,
  part: 3,
  footer: "BIN registry + card vault",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Which scheme? Where?", "The BIN", "Synced registry", "Idempotent sync", "Longest prefix wins", "Luhn first", "Plain numbers?", "AES-256-GCM", "Key rotation", "A token instead", "Blind index", "The database refuses", "Decrypt only to pay", "The bank's console", "Next: payments"],
  map,
  diagram,
  code,
});
