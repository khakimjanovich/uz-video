import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt14CreatePaymentComposition = createEpisode({
  id: "yt-14-create-payment",
  number: 14,
  part: 4,
  footer: "HMAC + idempotency",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Really the shop?", "Create a payment", "A token is not enough", "HMAC signature", "Secret in Vault", "Window + nonce", "Retries", "Same key", "Fail closed", "Payment link", "Next: hosted page"],
  map,
  diagram,
});
