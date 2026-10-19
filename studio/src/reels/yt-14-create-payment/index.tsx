import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt14CreatePaymentComposition = createEpisode({
  id: "yt-14-create-payment",
  number: 14,
  part: 4,
  footer: "HMAC + idempotency",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Really the shop?", "Create a payment", "The merchant role", "A token is not enough", "HMAC signature", "Signing key in Vault", "Window + nonce", "Signature first", "Retries", "Same key, same answer", "Two at once", "Fail closed", "One-time link", "k6", "Next: hosted page"],
  map,
  diagram,
  code,
});
