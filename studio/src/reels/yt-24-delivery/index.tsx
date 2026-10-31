import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt24DeliveryComposition = createEpisode({
  id: "yt-24-delivery",
  number: 24,
  part: 5,
  footer: "Delivery",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Into a bank", "Two units", "Compose per unit", "Settings in Vault", "No defaults", "Opening Vault", "The root token", "Vault as code", "One procedure", "First admins", "Releases", "The bank's state", "The safe, not the room", "Implementation guide", "Next: the cards unit"],
  map,
  diagram,
  code,
});
