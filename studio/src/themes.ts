import { loadFont as loadDisplay } from "@remotion/google-fonts/ArchivoBlack";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

// Receipt identity: Archivo Black headlines + stamps, IBM Plex Mono for everything else.
export const fonts = {
  display: loadDisplay("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  mono: loadMono("normal", { weights: ["400", "600", "700"], subsets: ["latin"] }).fontFamily,
};

// Kept for the render CLI (--theme); the receipt look is currently the only theme.
export type ThemeName = "dark" | "light";

export interface ReelProps extends Record<string, unknown> {
  theme?: ThemeName;
}
