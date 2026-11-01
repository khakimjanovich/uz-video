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
├── GEMINI.md                      # Symlink -> AGENTS.md
├── manage_reels.py                # Master CLI for listing, voicing, syncing, and rendering reels
├── out/                           # Rendered MP4 output folder (git-ignored)
└── studio/
    ├── remotion.config.ts         # Rspack + @remotion/tailwind-v4 bundler config
    ├── public/
    │   └── reels/                 # Generated voiceovers (git-ignored)
    │       └── <reel-id>/voiceover.mp3
    └── src/
        ├── index.css              # Tailwind CSS v4 entry point with CSS variables (--bg-canvas, --bg-card)
        ├── themes.ts              # Inter font + the few inline background tokens (dark / light)
        ├── Root.tsx               # Remotion Root registering all reels
        ├── index.ts               # Entry point
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
        │   ├── diagram/           # ArchDiagram, ArchNode, ArchEdge, Packet (see §4)
        │   └── index.ts           # Barrel export
        ├── series/
        │   └── acquiring/nodes.ts # Shared node catalogue for the Acquiring series
        └── reels/                 # Ultra-clean declarative reel compositions (60–80 lines each)
            ├── _playground/       # Studio-only sandbox for diagram primitives ("_" = skipped by manage_reels.py)
            └── <reel-id>/         # Register each reel's composition in Root.tsx
                ├── script.txt     # Uzbek voiceover text
                ├── subtitles.srt  # Exact cue timings
                ├── subtitles.json # Auto-generated frame-based cue metadata & highlights
                ├── scenes/        # Modular 25–40 line scene sub-components
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
./manage_reels.py voice <reel-id>

# Generate voice with female voice:
./manage_reels.py voice <reel-id> --voice madina

# Generate voice for all reels:
./manage_reels.py voice all

# Sync subtitles.srt -> subtitles.json (preserving keyword highlights) without regenerating audio:
./manage_reels.py subtitles all
```
Uses `edge-tts` (`uz-UZ-SardorNeural` or `uz-UZ-MadinaNeural` at `+5%` rate), outputs audio to `studio/public/reels/<name>/voiceover.mp3`, updates `subtitles.srt`, and automatically computes `subtitles.json` with frame-exact timings while preserving existing keyword highlights.

### C. Render Final MP4 Video:
```bash
# Render with default dark theme:
./manage_reels.py render <reel-id>

# Render with clean light theme:
./manage_reels.py render <reel-id> --theme light

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
6. **House rules beat upstream skills:**
   - The `remotion-markup` skill recommends `Interactive.withSchema` and inline `interpolate()` at call sites. This repo deliberately keeps animation math inside components (`MotionBox`, `ArchDiagram`) so reel files stay pure data. When they conflict, this file wins.

---

## 4. Series Format (Software Architecture & Solution Engineering)

**Visual identity: Receipt.** Every video is a thermal payment slip on a dark counter: Archivo Black headlines (one per step), IBM Plex Mono for everything else, ink boxes, rubber-stamp badges (red = problem, green = OK), captions on black tape, a dotted "totals" footer line. Tokens live in `studio/src/index.css`; no emoji in diagram labels.

Products and rules live in [`SERIES.md`](SERIES.md); the programmer series plan in [`SERIES-BUILD.md`](SERIES-BUILD.md). Order of work: **plan → script → voice → stills check**. English first; Uzbek copies only on request. MP4s are rendered only on request; review happens in Studio or on stills.

Every video is **one architecture diagram that evolves with the voiceover**, 1080×1920 (9:16). `captions={false}` on `ReelScaffold` turns the caption tape off.

### A. The four acts
Pass `acts` to `ReelScaffold`. Each value is the **subtitle cue index** where that act starts:

```tsx
acts={{ hook: 0, v1: 1, break: 2, v2: 3, handoff: 5 }}
```

1. **hook** — everyday action + 2–3 hard engineering constraints.
2. **v1** — the naive 3-box flow (`buyer → merchant → bank`).
3. **break** — the real edge case that kills v1 (timeout, race condition, raw card leak). Red glow + red subtitle styling turn on automatically during this act.
4. **v2** — insert the service that fixes it (Gateway, Pre-Check Webhook, Token Vault, Hold/Capture, Split engine).
5. **handoff** — leave **exactly one** node/edge marked `danger` as the open bottleneck. The next episode opens on this exact diagram.

The current act is available to any component via `useSubtitlesContext().act`.

### B. Episode file shape
`reels/<reel-id>/index.tsx` is data only:

```tsx
<ReelScaffold reelId="my-lesson" subtitles={subtitles} acts={acts} title={(cue) => TITLES[cue]} footer={{ label: "Your bank", value: "Own acquiring" }}>
  <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
</ReelScaffold>
```

`steps: DiagramStep<AcquiringNodeId>[]` — one entry per change, keyed by `cue`:

| Field | Meaning |
|-------|---------|
| `cue` | Subtitle cue index where the step starts |
| `layout` | `{ nodeId: [col, row] }` on a 3×5 grid (fractions allowed). Kept nodes slide, new nodes pop in, missing nodes fade out |
| `edges` | `{ from, to, label?, broken? }` — new edges draw on; `broken` = red dashed + ✕ label |
| `packets` | `{ from, to, label, delay?, duration?, stopAt? }` — chip travelling an edge; `stopAt < 1` stops it red and bounces it back (blocked / timeout) |
| `accent` / `danger` / `crossed` | Node ids to highlight as new / broken / hand-drawn cross-out |
| `badges` | `{ nodeId: "T+1" }` corner status chip |
| `shake` | `{ nodeId: 0.4 }` shake a node at that fraction of the cue (sync to the word that names it); new `danger` nodes shake automatically |

Each step lists the **full** diagram state (not a diff). Copy the previous step and edit it. See `reels/_playground/index.tsx` for a complete v1 → break → v2 → handoff example (`npm run dev` → **Playground**).

### C. Rules
- **Node catalogue:** new actors/services go into `series/acquiring/nodes.ts`, never inline in an episode, so labels and icons stay identical across every video.
- **Diagram safe zone:** `ArchDiagram` positions inside y≈400–1560px, between `ReelHeader` and `SubtitleCard`. Don't place scenes over it.
- **New primitives:** build from `ArchNode`/`ArchEdge` first; extract a new component only when two episodes need it.

### D. Pronunciation glossary
On-screen text stays technical; `script.txt` is spelled so `edge-tts` reads it correctly. Add every new term here before writing a script.

`manage_reels.py voice` reads this table both ways: before voicing, every on-screen form in a script (rows marked **Caption: yes**, whole word, case-sensitive) is turned into its spoken form, so a script may simply write `PAN`; and wherever the voice says a spoken form, the caption shows the on-screen form (`P C I D S S` → `PCI DSS`). Rows marked **no** keep the spoken words in captions (`card token` stays `card token`). "lesson three" is captioned "Lesson 3" by rule. Keep one pair per row, the spoken form exactly as written in scripts. The hyphen in `e-POS` made the voice service hang, so its spoken form is `e POS`.

| On screen | In `script.txt` | Caption |
|-----------|-----------------|---------|
| `T+1` | T plus one | yes |
| `PIN` | P I N | yes |
| `ID` | I D | yes |
| `PCI-DSS` | P C I D S S | yes |
| `OFD` | O F D | yes |
| `9998` | nine nine nine eight | yes |
| `tok_uz_…` | token | no |
| `API` | A P I | yes |
| `e-POS` | e POS | yes |
| `RFC 9421` | R F C ninety-four twenty-one | yes |
| `RFC 9457` | R F C ninety-four fifty-seven | yes |
| `PCI DSS` | P C I D S S | yes |
| `SNI` | S N I | yes |
| `CSR` | C S R | yes |
| `TLS` | T L S | yes |
| `mTLS` | mutual T L S | yes |
| `ctk_…` | card token | no |
| `CDE` | C D E | yes |
| `NSC` | N S C | yes |
| `QSA` | Q S A | yes |
| `CSP` | C S P | yes |
| `v4.0.1` | version four point zero point one | yes |
| `127.0.0.1` | one two seven, zero, zero, one | yes |
| `404` | four oh four | yes |
| `200` | two hundred | yes |
| `8443` | eight four four three | yes |
| `9443` | nine four four three | yes |
| `nginx` | engine X | yes |
| `cards-ingress` | cards ingress | yes |
| `cards-partner` | cards partner | yes |
| `PAN` | P A N | yes |
| `7890` | seven eight nine zero | yes |
| `jshell` | J shell | yes |
| `BIN` | B I N | yes |
| `OTP` | O T P | yes |
| `MID` | M I D | yes |
| `TID` | T I D | yes |
| `KYB` | K Y B | yes |
| `SBOM` | S bom | yes |
| `SMS` | S M S | yes |
| `HTTP` | H T T P | yes |
| `HTTPS` | H T T P S | yes |
| `URL` | U R L | yes |
| `SSRF` | S S R F | yes |
| `HMAC` | H mac | yes |
| `RRN` | R R N | yes |
| `MFA` | M F A | yes |
| `SSO` | S S O | yes |
| `PKI` | P K I | yes |
| `CA` | C A | yes |
| `JSON` | jason | yes |
