import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt07KeycloakComposition = createEpisode({
  id: "yt-07-keycloak",
  number: 7,
  part: 1,
  footer: "Logins and API clients",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Where do secrets live?", "Our own passwords?", "Keycloak", "A client per site", "Shown once", "Vault for config", "Every endpoint", "Next: sales points"],
  map,
  diagram,
});
