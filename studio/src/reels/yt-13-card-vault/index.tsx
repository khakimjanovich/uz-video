import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt13CardVaultComposition = createEpisode({
  id: "yt-13-card-vault",
  number: 13,
  part: 3,
  footer: "BIN registry + card vault",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Which scheme?", "The BIN", "Synced registry", "Plain numbers?", "Encrypt + token", "Only the vault reveals", "Audit trail", "Nothing to steal", "Next: payments"],
  map,
  diagram,
});
