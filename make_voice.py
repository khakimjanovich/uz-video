#!/usr/bin/env python3
"""
Uzbek Tech Reel Audio & Subtitle Generator
Generates voiceover and synced subtitles using edge-tts (uz-UZ-SardorNeural),
copies them to Remotion studio/public, and calculates the exact duration in frames at 30fps.
"""

import os
import sys
import shutil
import re
import math
import subprocess
import argparse
from pathlib import Path


def parse_srt_timestamp(ts: str) -> float:
    """Convert SRT timestamp 'HH:MM:SS,mmm' to seconds."""
    match = re.match(r"(\d+):(\d+):(\d+)[,\.](\d+)", ts.strip())
    if not match:
        raise ValueError(f"Invalid SRT timestamp: {ts}")
    hours, minutes, seconds, milliseconds = match.groups()
    return int(hours) * 3600 + int(minutes) * 60 + int(seconds) + int(milliseconds) / 1000.0


def parse_srt_file(srt_path: Path):
    """Parse SRT file into a list of cues: (index, start_sec, end_sec, text)."""
    content = srt_path.read_text(encoding="utf-8").strip()
    cues = []
    blocks = re.split(r"\n\s*\n", content)
    for block in blocks:
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        if len(lines) >= 3:
            idx = lines[0]
            time_match = re.search(r"(\d\d:\d\d:\d\d[,\.]\d+)\s*-->\s*(\d\d:\d\d:\d\d[,\.]\d+)", lines[1])
            if time_match:
                start_sec = parse_srt_timestamp(time_match.group(1))
                end_sec = parse_srt_timestamp(time_match.group(2))
                text = " ".join(lines[2:])
                cues.append({
                    "index": idx,
                    "start": start_sec,
                    "end": end_sec,
                    "text": text,
                    "start_frame": int(round(start_sec * 30)),
                    "end_frame": int(round(end_sec * 30)),
                })
    return cues


def main():
    parser = argparse.ArgumentParser(description="Generate Uzbek TTS audio and subtitles for Remotion")
    parser.add_argument("text", nargs="?", help="Text script to speak")
    parser.add_argument("--file", "-f", help="Text file containing script")
    parser.add_argument("--voice", default="uz-UZ-SardorNeural", help="TTS voice (default: uz-UZ-SardorNeural)")
    parser.add_argument("--rate", default="+5%", help="Speech rate (default: +5%%)")
    parser.add_argument("--padding", type=float, default=1.0, help="End padding in seconds (default: 1.0s)")
    parser.add_argument("--fps", type=int, default=30, help="Target video FPS (default: 30)")
    parser.add_argument("--public-dir", default="studio/public", help="Destination Remotion public directory")
    parser.add_argument("--parse-only", action="store_true", help="Only parse existing subtitles.srt")

    args = parser.parse_args()

    root_dir = Path(__file__).resolve().parent
    public_dir = root_dir / args.public_dir
    mp3_file = root_dir / "voiceover.mp3"
    srt_file = root_dir / "subtitles.srt"

    if not args.parse_only:
        script_text = ""
        if args.text:
            script_text = args.text
        elif args.file:
            script_text = Path(args.file).read_text(encoding="utf-8").strip()
        else:
            print("Error: Please provide a text script or use --parse-only.", file=sys.stderr)
            sys.exit(1)

        # Locate edge-tts binary
        edge_tts_bin = root_dir / "venv" / "bin" / "edge-tts"
        if not edge_tts_bin.exists():
            edge_tts_bin = shutil.which("edge-tts")
            if not edge_tts_bin:
                print("Error: edge-tts not found in ./venv/bin/edge-tts or PATH.", file=sys.stderr)
                sys.exit(1)
        else:
            edge_tts_bin = str(edge_tts_bin)

        cmd = [
            edge_tts_bin,
            "--voice", args.voice,
            "--rate", args.rate,
            "--text", script_text,
            "--write-media", str(mp3_file),
            "--write-subtitles", str(srt_file),
        ]

        print(f"🎙️ Generating voiceover with voice '{args.voice}' (rate: {args.rate})...")
        res = subprocess.run(cmd, check=True)

    if not srt_file.exists():
        print(f"Error: {srt_file} does not exist.", file=sys.stderr)
        sys.exit(1)

    # Copy files to public dir
    public_dir.mkdir(parents=True, exist_ok=True)
    if mp3_file.exists():
        shutil.copy2(mp3_file, public_dir / "voiceover.mp3")
    shutil.copy2(srt_file, public_dir / "subtitles.srt")
    print(f"📁 Copied voiceover.mp3 and subtitles.srt -> {public_dir}")

    # Parse cues
    cues = parse_srt_file(srt_file)
    if not cues:
        print("Warning: No cues found in subtitles.srt.")
        sys.exit(0)

    last_end = max(c["end"] for c in cues)
    padded_duration = last_end + args.padding
    total_frames = math.ceil(padded_duration * args.fps)

    print("\n" + "=" * 60)
    print("🎬 REMOTION TIMING & SUBTITLES SUMMARY")
    print("=" * 60)
    print(f"Voice:            {args.voice}")
    print(f"Cues count:       {len(cues)}")
    print(f"Last cue ends:    {last_end:.3f}s (frame {int(round(last_end * args.fps))})")
    print(f"Padding added:    {args.padding:.1f}s ({int(args.padding * args.fps)} frames)")
    print(f"Total duration:   {padded_duration:.3f}s")
    print(f"Target FPS:       {args.fps}")
    print(f"⚡ REQUIRED FRAMES: {total_frames} (durationInFrames={total_frames})")
    print("=" * 60)
    print("\n📝 Subtitle Cues Breakdown:")
    for cue in cues:
        print(f" [{cue['index']}] {cue['start']:.2f}s -> {cue['end']:.2f}s "
              f"(Frames {cue['start_frame']} -> {cue['end_frame']}):")
        print(f"     \"{cue['text']}\"")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
