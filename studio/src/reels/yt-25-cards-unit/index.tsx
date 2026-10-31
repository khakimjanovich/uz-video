import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt25CardsUnitComposition = createEpisode({
  id: "yt-25-cards-unit",
  number: 25,
  part: 5,
  footer: "The cards unit",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Where cards live", "PCI DSS scope", "One card zone", "Tokens only", "Share nothing", "Callers are inputs", "Another caller", "ecom's inputs", "mTLS + roles", "Two doors", "Payer door", "Sealed envelope", "Partner door", "Passport office", "The application", "Three things back", "Per-caller rules", "Fraud limits", "The cards unit"],
  map,
  diagram,
  code,
});
