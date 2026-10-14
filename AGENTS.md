# Uzbek Tech Reel Video Pipeline (Code-Only & Regeneratable)

This repository contains an automated, code-only pipeline for producing high-retention Uzbek educational fintech & tech reels using Microsoft Edge TTS and Remotion.

Git tracks **only text scripts, subtitles (`.srt`), and React/Remotion code (`.tsx`)**. No heavy binary `.mp4` or `.mp3` files are stored in git. Every video can be generated or rendered on demand with a single CLI command.

---

## 1. Architecture & Directory Structure

```
uz-video/
├── .gitignore                     # Ignores *.mp4, *.mp3, node_modules/, venv/
├── AGENTS.md                      # Pipeline specifications for AI agents
├── GEMINI.md                      # Architecture overview & guidelines
├── manage_reels.py                # Master CLI for listing, voicing, and rendering reels
├── out/                           # Rendered MP4 output folder (git-ignored)
└── studio/
    ├── public/
    │   └── reels/                 # Generated voiceovers (git-ignored)
    │       ├── p2p-transfer/voiceover.mp3
    │       └── card-tokenization/voiceover.mp3
    └── src/
        ├── Root.tsx               # Remotion Root registering all reels
        ├── index.ts               # Entry point
        └── reels/                 # Code-only reel modules (GIT-TRACKED)
            ├── p2p-transfer/
            │   ├── script.txt     # Uzbek voiceover text
            │   ├── subtitles.srt  # Exact cue timings
            │   └── index.tsx      # React Remotion animation component
            └── card-tokenization/
                ├── script.txt
                ├── subtitles.srt
                └── index.tsx
```

---

## 2. CLI Usage (`manage_reels.py`)

### A. List all reels:
```bash
./manage_reels.py list
```
Displays all reels, script previews, duration in seconds, frame counts at 30fps, and audio status.

### B. Generate Voiceover & Subtitles from `script.txt`:
```bash
# Generate voice for a specific reel:
./manage_reels.py voice p2p-transfer

# Generate voice for all reels:
./manage_reels.py voice all
```
Uses `edge-tts` (`uz-UZ-SardorNeural` at `+5%` rate), outputs audio to `studio/public/reels/<name>/voiceover.mp3`, and updates `subtitles.srt`.

### C. Render Final MP4 Video:
```bash
# Render a specific reel to out/<reel-name>.mp4:
./manage_reels.py render p2p-transfer
./manage_reels.py render card-tokenization

# Or render all reels:
./manage_reels.py render all
```

### D. Interactive Preview in Remotion Studio:
```bash
cd studio && npm run dev
```
Both compositions (`p2p-transfer` and `card-tokenization`) appear in the sidebar and can be scrubbed and hot-reloaded side-by-side.

---

## 3. Video Specifications & Standards

- **Dimensions:** 1080 x 1920 (9:16 Vertical Reel)
- **FPS:** 30 fps
- **Duration Formula:**
  $$\text{durationInFrames} = \lceil (\text{Last Subtitle End in seconds} + 1.0\text{s}) \times 30 \rceil$$
- **Styling Guidelines:**
  - Minimalist warm neutral `#F8F9FA` background with subtle grid overlay.
  - Clean white rounded UI cards (`borderRadius: 32 - 36px`, soft shadow).
  - Spring-driven animations (`spring()` from `'remotion'`).
  - Synced subtitle card at the bottom with keyword highlights.
  - Official regulatory authority citation footer at bottom.
  - Zero external UI/icon libraries: inline SVG and inline React styles only.
