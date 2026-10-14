#!/usr/bin/env python3
"""
Uzbek Tech Reel Manager & Regenerator
Manages code-only, fully regeneratable Remotion tech reels.
Supports swappable voices (sardor / madina) and visual themes (xray / dark / light).
Git tracks only scripts (txt), subtitles (srt), and React/Remotion code (tsx).
Binary audio (mp3) and video (mp4) are generated on-demand.
"""

import os
import sys
import shutil
import re
import math
import json
import subprocess
import argparse
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
STUDIO_DIR = ROOT_DIR / "studio"
REELS_SRC_DIR = STUDIO_DIR / "src" / "reels"
PUBLIC_REELS_DIR = STUDIO_DIR / "public" / "reels"
OUT_DIR = ROOT_DIR / "out"

VOICE_MAP = {
    "sardor": "uz-UZ-SardorNeural",
    "madina": "uz-UZ-MadinaNeural",
}


def resolve_voice(voice: str) -> str:
    return VOICE_MAP.get(voice.lower(), voice)


def get_edge_tts_bin():
    edge_tts = ROOT_DIR / "venv" / "bin" / "edge-tts"
    if edge_tts.exists():
        return str(edge_tts)
    system_edge_tts = shutil.which("edge-tts")
    if system_edge_tts:
        return system_edge_tts
    print("Error: edge-tts not found in ./venv/bin/edge-tts or PATH.", file=sys.stderr)
    sys.exit(1)


def parse_srt_timestamp(ts: str) -> float:
    match = re.match(r"(\d+):(\d+):(\d+)[,\.](\d+)", ts.strip())
    if not match:
        raise ValueError(f"Invalid SRT timestamp: {ts}")
    h, m, s, ms = match.groups()
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000.0


def parse_srt_file(srt_path: Path):
    if not srt_path.exists():
        return []
    content = srt_path.read_text(encoding="utf-8").strip()
    cues = []
    blocks = re.split(r"\n\s*\n", content)
    for block in blocks:
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        if len(lines) >= 3:
            time_match = re.search(r"(\d\d:\d\d:\d\d[,\.]\d+)\s*-->\s*(\d\d:\d\d:\d\d[,\.]\d+)", lines[1])
            if time_match:
                start_sec = parse_srt_timestamp(time_match.group(1))
                end_sec = parse_srt_timestamp(time_match.group(2))
                text = " ".join(lines[2:])
                cues.append({
                    "start": start_sec,
                    "end": end_sec,
                    "text": text,
                })
    return cues


def list_reels():
    print("\n" + "=" * 65)
    print("🎬 AVAILABLE REGENERATABLE REELS")
    print("=" * 65)
    if not REELS_SRC_DIR.exists():
        print("No reels found.")
        return

    reels = sorted([p for p in REELS_SRC_DIR.iterdir() if p.is_dir()])
    if not reels:
        print("No reels found.")
        return

    for reel in reels:
        script_file = reel / "script.txt"
        srt_file = reel / "subtitles.srt"
        code_file = reel / "index.tsx"
        mp3_file = PUBLIC_REELS_DIR / reel.name / "voiceover.mp3"

        script_preview = ""
        if script_file.exists():
            script_text = script_file.read_text(encoding="utf-8").strip()
            script_preview = (script_text[:65] + "...") if len(script_text) > 65 else script_text

        cues = parse_srt_file(srt_file)
        duration_sec = (max(c["end"] for c in cues) + 1.0) if cues else 0.0
        frames_30fps = math.ceil(duration_sec * 30)

        audio_status = "✅ Generated" if mp3_file.exists() else "⚠️ Needs generation"
        code_status = "✅ Ready" if code_file.exists() else "❌ Missing index.tsx"

        print(f"\n📁 Reel ID:     {reel.name}")
        print(f"   Script:      \"{script_preview}\"")
        print(f"   Duration:    {duration_sec:.2f}s ({frames_30fps} frames @ 30fps)")
        print(f"   Code:        {code_status}")
        print(f"   Audio:       {audio_status}")
    print("\n" + "=" * 65 + "\n")


def sync_subtitles_json(reel_name: str, cues=None):
    reel_dir = REELS_SRC_DIR / reel_name
    srt_file = reel_dir / "subtitles.srt"
    json_file = reel_dir / "subtitles.json"

    if cues is None:
        cues = parse_srt_file(srt_file)
    if not cues:
        return None

    existing_by_idx = {}
    existing_by_text = {}
    if json_file.exists():
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                for item in data:
                    if "index" in item:
                        existing_by_idx[item["index"]] = item
                    if "text" in item:
                        existing_by_text[item["text"].strip()] = item
        except Exception:
            pass

    updated_cues = []
    total = len(cues)
    for i, cue in enumerate(cues):
        idx = i + 1
        start_frame = math.floor(cue["start"] * 30)
        # For the final cue, extend to match video padding (+1.0s)
        if i == total - 1:
            end_frame = math.ceil((cue["end"] + 1.0) * 30)
        else:
            end_frame = math.ceil(cue["end"] * 30)

        text = cue["text"].strip()
        prev = existing_by_idx.get(idx) or existing_by_text.get(text) or {}

        highlight = prev.get("highlight", "")
        highlight_color = prev.get("highlightColor")
        highlight_bg = prev.get("highlightBg")

        if highlight and highlight in text:
            parts = text.split(highlight, 1)
            prefix = parts[0]
            suffix = parts[1]
        else:
            prefix = prev.get("prefix", text)
            highlight = prev.get("highlight", "")
            suffix = prev.get("suffix", "")

        cue_obj = {
            "index": idx,
            "startFrame": start_frame,
            "endFrame": end_frame,
            "text": text,
            "prefix": prefix,
            "highlight": highlight,
            "suffix": suffix,
        }
        if highlight_color:
            cue_obj["highlightColor"] = highlight_color
        if highlight_bg:
            cue_obj["highlightBg"] = highlight_bg

        updated_cues.append(cue_obj)

    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(updated_cues, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"📝 Subtitles JSON synced -> {json_file}")
    return updated_cues


def generate_voice(reel_name: str, voice_raw="sardor", rate="+5%"):
    voice = resolve_voice(voice_raw)
    reel_dir = REELS_SRC_DIR / reel_name
    if not reel_dir.exists():
        print(f"Error: Reel '{reel_name}' does not exist in {REELS_SRC_DIR}", file=sys.stderr)
        return False

    script_file = reel_dir / "script.txt"
    if not script_file.exists():
        print(f"Error: {script_file} does not exist.", file=sys.stderr)
        return False

    dest_audio_dir = PUBLIC_REELS_DIR / reel_name
    dest_audio_dir.mkdir(parents=True, exist_ok=True)
    dest_mp3 = dest_audio_dir / "voiceover.mp3"
    dest_srt = reel_dir / "subtitles.srt"

    edge_tts = get_edge_tts_bin()
    cmd = [
        edge_tts,
        "--voice", voice,
        "--rate", rate,
        "--file", str(script_file),
        "--write-media", str(dest_mp3),
        "--write-subtitles", str(dest_srt),
    ]

    print(f"🎙️ Generating voice for '{reel_name}' (voice: {voice}, rate: {rate})...")
    subprocess.run(cmd, check=True)

    cues = parse_srt_file(dest_srt)
    sync_subtitles_json(reel_name, cues)
    last_end = max(c["end"] for c in cues) if cues else 0.0
    total_frames = math.ceil((last_end + 1.0) * 30)

    print(f"✅ Voice generated -> {dest_mp3}")
    print(f"✅ Subtitles saved -> {dest_srt}")
    print(f"⚡ Recommended durationInFrames: {total_frames} ({last_end + 1.0:.2f}s @ 30fps)\n")
    return True



def render_video(reel_name: str, theme="dark"):
    reel_dir = REELS_SRC_DIR / reel_name
    if not reel_dir.exists():
        print(f"Error: Reel '{reel_name}' not found.", file=sys.stderr)
        return False

    # Ensure voiceover is generated
    mp3_file = PUBLIC_REELS_DIR / reel_name / "voiceover.mp3"
    if not mp3_file.exists():
        print(f"ℹ️ Audio missing for '{reel_name}'. Generating voiceover first...")
        generate_voice(reel_name)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_file = OUT_DIR / f"{reel_name}-{theme}.mp4"
    props_arg = json.dumps({"theme": theme})

    print(f"🎬 Rendering reel '{reel_name}' [Theme: {theme}] -> {out_file}...")
    cmd = [
        "npx", "remotion", "render",
        reel_name,
        str(out_file),
        f"--props={props_arg}",
    ]
    subprocess.run(cmd, cwd=str(STUDIO_DIR), check=True)
    print(f"🎉 Render finished! Video ready at: {out_file}\n")
    return True


def main():
    parser = argparse.ArgumentParser(description="Manage code-only regeneratable Uzbek Tech Reels with themes & voices")
    parser.add_argument("command", choices=["list", "voice", "render", "build", "subtitles"], nargs="?", default="list",
                        help="Action to perform (default: list)")
    parser.add_argument("reel", nargs="?", default="all",
                        help="Reel ID name or 'all'")
    parser.add_argument("--voice", default="sardor",
                        help="TTS voice: sardor, madina, or full voice name (default: sardor)")
    parser.add_argument("--rate", default="+5%",
                        help="TTS speech rate (default: +5%%)")
    parser.add_argument("--theme", choices=["dark", "light", "xray"], default="dark",
                        help="Visual theme: dark or light (default: dark)")

    args = parser.parse_args()

    if args.command == "list":
        list_reels()
    elif args.command == "voice":
        if args.reel == "all":
            reels = sorted([p.name for p in REELS_SRC_DIR.iterdir() if p.is_dir()])
            for r in reels:
                generate_voice(r, args.voice, args.rate)
        else:
            generate_voice(args.reel, args.voice, args.rate)
    elif args.command == "subtitles":
        if args.reel == "all":
            reels = sorted([p.name for p in REELS_SRC_DIR.iterdir() if p.is_dir()])
            for r in reels:
                sync_subtitles_json(r)
        else:
            sync_subtitles_json(args.reel)
    elif args.command in ["render", "build"]:
        if args.reel == "all":
            reels = sorted([p.name for p in REELS_SRC_DIR.iterdir() if p.is_dir()])
            for r in reels:
                render_video(r, args.theme)
        else:
            render_video(args.reel, args.theme)



if __name__ == "__main__":
    main()
