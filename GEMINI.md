# Uzbek Tech Reel Video Pipeline (Code-Only & Regeneratable)

This repository contains an automated, code-only pipeline for producing high-retention Uzbek educational fintech & tech reels using Microsoft Edge TTS and Remotion.

Git tracks **only text scripts, subtitles (`.srt` & `.json`), and React/Remotion code (`.tsx`)**. No heavy binary `.mp4` or `.mp3` files are stored in git. Every video can be generated or rendered on demand with a single CLI command.

---

## 1. Architecture & Directory Structure

```
uz-video/
├── .agents/skills/                # Remotion official agent skills (remotion-markup, etc.)
├── .gitignore                     # Ignores *.mp4, *.mp3, node_modules/, venv/
├── AGENTS.md                      # Pipeline specifications for AI agents
├── GEMINI.md                      # Architecture overview & guidelines
├── manage_reels.py                # Master CLI for listing, voicing, syncing, and rendering reels
├── out/                           # Rendered MP4 output folder (git-ignored)
└── studio/
    ├── remotion.config.ts         # Rspack + @remotion/tailwind-v4 bundler config
    ├── public/
    │   └── reels/                 # Generated voiceovers (git-ignored)
    │       ├── p2p-transfer/voiceover.mp3
    │       └── card-tokenization/voiceover.mp3
    └── src/
        ├── index.css              # Tailwind CSS v4 entry point (@import "tailwindcss")
        ├── themes.ts              # Continuous Theme Token System (dark / light) & font bundling
        ├── Root.tsx               # Remotion Root registering all reels
        ├── index.ts               # Entry point
        ├── context/               # React Context
        │   ├── ThemeContext.tsx   # ThemeProvider & useTheme / useThemeTokens
        │   └── index.ts
        ├── hooks/                 # Custom Remotion hooks
        │   ├── useSubtitles.ts    # Cue-driven boundaries (cueIndex, cueStartFrame, cueProgress)
        │   └── index.ts
        ├── utils/                 # Composition factories & helpers
        │   └── createReelComposition.tsx # Standardized 1080x1920 @ 30fps factory
        ├── components/            # Reusable UI component library (Tailwind + Remotion)
        │   ├── ReelScaffold.tsx   # Unifies Audio, Background, Header, Subtitles, Footer & Theme
        │   ├── ReelBackground.tsx # Radial grid overlay & ambient spotlight glows
        │   ├── ReelHeader.tsx     # Animated topic pill & 52px h1 title
        │   ├── UiCard.tsx         # Standard rounded container (default, danger, accent, middle)
        │   ├── StatusBadge.tsx    # Styled inline status badges & chips
        │   ├── SubtitleCard.tsx   # Synced voiceover caption card with active highlight
        │   ├── RegulatoryFooter.tsx # Bottom legal/regulatory citation
        │   └── index.ts           # Barrel export
        └── reels/                 # Modular, lightweight reel compositions (~150-250 lines)
            ├── p2p-transfer/
            │   ├── script.txt     # Uzbek voiceover text
            │   ├── subtitles.srt  # Exact cue timings
            │   ├── subtitles.json # Auto-generated frame-based cue metadata & highlights
            │   └── index.tsx      # React Remotion animation component
            └── card-tokenization/
                ├── script.txt
                ├── subtitles.srt
                ├── subtitles.json
                └── index.tsx
```

---

## 2. CLI Usage (`manage_reels.py`)

### A. List all reels:
```bash
./manage_reels.py list
```
Displays all reels, script previews, duration in seconds, frame counts at 30fps, and audio status.

### B. Generate Voiceover & Auto-Sync Subtitles from `script.txt`:
```bash
# Generate voice for a specific reel:
./manage_reels.py voice p2p-transfer

# Generate voice with female voice:
./manage_reels.py voice card-tokenization --voice madina

# Generate voice for all reels:
./manage_reels.py voice all

# Sync subtitles.srt -> subtitles.json (preserving keyword highlights) without regenerating audio:
./manage_reels.py subtitles all
```
Uses `edge-tts` (`uz-UZ-SardorNeural` or `uz-UZ-MadinaNeural` at `+5%` rate), outputs audio to `studio/public/reels/<name>/voiceover.mp3`, updates `subtitles.srt`, and automatically computes `subtitles.json` with frame-exact timings while preserving existing keyword highlights.

### C. Render Final MP4 Video:
```bash
# Render with default dark theme:
./manage_reels.py render p2p-transfer
./manage_reels.py render card-tokenization

# Render with clean light theme:
./manage_reels.py render card-tokenization --theme light

# Or render all reels:
./manage_reels.py render all --theme dark
```

### D. Interactive Preview in Remotion Studio:
```bash
cd studio && npm run dev
```

---

## 3. Video Specifications & Best Practices

- **Dimensions:** 1080 x 1920 (9:16 Vertical Reel)
- **FPS:** 30 fps
- **Typography:** Deterministic `@remotion/google-fonts/Inter` with zero FOUT across headless CI and OS environments.
- **Audio Premounting:** `<Audio src={...} premountFor={fps} />` ensures decoders preload 1 second ahead.
- **Cue-Driven Animations:** All reel stages (`isPhase1`, `isPhase2`, `isPhase3`) and animations derive directly from `useSubtitles(subtitles)`. If voiceover duration changes, animations never desync.
- **Transform Shorthands:** Modern CSS transform properties (`scale`, `translate: "0px ...px"`) instead of concatenated `transform` strings.
- **Clamped Interpolations:** Clamped with `{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }` on all `interpolate()` calls.
- **Scaffold Architecture:** `ReelScaffold` encapsulates the chrome, audio, theme tokens, and subtitle synchronization, keeping individual reel compositions concise and focused purely on content.
