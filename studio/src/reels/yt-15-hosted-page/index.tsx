import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt15HostedPageComposition = createEpisode({
  id: "yt-15-hosted-page",
  number: 15,
  part: 4,
  footer: "The payment page",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Whose page?", "Shops with cards", "The bank's page", "Token = credential", "Reading changes nothing", "Scheme first", "Expiry as MM/YY", "Code from the scheme", "Scheme checks the card", "One code each", "Waiting for the code", "Card confirmed", "Every attempt counts", "Configured limits", "The page closes", "One at a time", "Next: the debit"],
  map,
  diagram,
  code,
});
