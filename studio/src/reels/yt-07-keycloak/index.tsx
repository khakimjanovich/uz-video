import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt07KeycloakComposition = createEpisode({
  id: "yt-07-keycloak",
  number: 7,
  part: 1,
  footer: "Logins and API clients",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Who is calling?", "Just a header", "Keycloak", "Three roles", "Password to Keycloak", "Partner role", "Every request", "Route rules", "Name from token", "API clients", "Rotation", "Next: sales points"],
  map,
  diagram,
  code,
});
