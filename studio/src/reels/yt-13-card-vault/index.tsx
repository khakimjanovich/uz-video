import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt13CardVaultComposition = createEpisode({
  id: "yt-13-card-vault",
  number: 13,
  part: 3,
  footer: "BIN module + card vault",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Where is the number?", "The BIN", "BIN module", "Idempotent sync", "Added by hand", "From memory", "Bank directory", "Luhn, then BIN", "Plain numbers?", "The cards unit", "A token, a role", "Vault Transit", "Key context", "Key rotation", "Blind index", "Fails closed", "The database refuses", "Decrypt only to pay", "Admins: API only", "Next: payments"],
  map,
  diagram,
  code,
});
