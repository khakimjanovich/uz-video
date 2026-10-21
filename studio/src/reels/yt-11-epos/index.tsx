import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt11EposComposition = createEpisode({
  id: "yt-11-epos",
  number: 11,
  part: 2,
  footer: "e-POS terminals (MID/TID)",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Which e-POS terminal?", "Unknown MID/TID", "The registry", "Per card", "Fail closed", "Kept by the database", "Registered at Uzcard", "Suspend stays ours", "Revoke at Uzcard", "Check at Uzcard", "Audit log", "No e-POS, no debit", "Terminals to reconcile", "Find an e-POS terminal", "Next: card schemes"],
  map,
  diagram,
  code,
});
