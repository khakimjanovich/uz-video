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
        ├── index.css              # Tailwind CSS v4 entry point with CSS variables (--bg-canvas, --bg-card)
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
        │   ├── MotionBox.tsx      # Declarative enter/exit animations (zero math in reel files)
        │   ├── ReelBackground.tsx # Radial grid overlay & ambient spotlight glows
        │   ├── ReelHeader.tsx     # Animated topic pill & 52px h1 title
        │   ├── UiCard.tsx         # Standard rounded container (default, danger, accent, middle)
        │   ├── StatusBadge.tsx    # Styled inline status badges & chips
        │   ├── SubtitleCard.tsx   # Synced voiceover caption card with active highlight
        │   ├── RegulatoryFooter.tsx # Bottom legal/regulatory citation
        │   └── index.ts           # Barrel export
        └── reels/                 # Ultra-clean declarative reel compositions (60–80 lines each)
            ├── p2p-transfer/
            │   ├── script.txt     # Uzbek voiceover text
            │   ├── subtitles.srt  # Exact cue timings
            │   ├── subtitles.json # Auto-generated frame-based cue metadata & highlights
            │   ├── scenes/        # Modular 25–40 line scene sub-components
            │   │   ├── SenderReceiverCards.tsx
            │   │   ├── HookScene.tsx
            │   │   ├── RealityScene.tsx
            │   │   └── ClearingScene.tsx
            │   └── index.tsx      # Declarative Remotion Sequence composition (~75 lines)
            └── card-tokenization/
                ├── script.txt
                ├── subtitles.srt
                ├── subtitles.json
                ├── scenes/
                │   ├── DeliveryCheckoutCard.tsx
                │   ├── MisconceptionScene.tsx
                │   ├── DatabaseScanScene.tsx
                │   └── VaultTokenScene.tsx
                └── index.tsx      # Declarative Remotion Sequence composition (~75 lines)
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

## 3. Video Specifications & Pro Remotion Architecture

1. **No `spring()` or `interpolate()` math inside reel files:**
   - `<MotionBox enter="pop" delay={5}>` handles animation physics once. Reel files and scenes remain purely declarative.
2. **Remotion `<Sequence>` per scene (No Giant Ternaries):**
   - Each phase of a video is an isolated 25–40 line sub-component mounted inside `<Sequence from={cue.startFrame} durationInFrames={cue.duration}>`.
   - Reel root files are concise (60–80 lines of declarative data).
3. **Real Tailwind + CSS Variables:**
   - Theme colors (`--bg-canvas`, `--bg-card`, `--border-card`, `--text-primary`, `--text-secondary`) are defined in `index.css`.
   - Native Tailwind classes (`bg-canvas`, `bg-card`, `border-border`, `text-primary`) work seamlessly without if/else inline style hacks.
4. **Deterministic Typography:**
   - Inter loaded via `@remotion/google-fonts/Inter` with zero FOUT across headless CI/OS environments.
5. **Audio Premounting:**
   - `<Audio src={...} premountFor={fps} />` ensures decoders preload 1 second ahead.
