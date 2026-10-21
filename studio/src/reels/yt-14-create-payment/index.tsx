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
  titles: ["Really the shop?", "The setup chain", "Create a payment", "The merchant role", "A token is not enough", "RFC 9421 signature", "Signing key in Vault", "Vault down? Refused", "Window + nonce", "Signature first", "Retries", "Same key, same answer", "Two at once", "Fail closed", "One-time link", "Next: hosted page"],
  map,
  diagram,
  code,
});
