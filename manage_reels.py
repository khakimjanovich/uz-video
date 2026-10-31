#!/usr/bin/env python3
"""
Uzbek Tech Reel Manager & Regenerator
Manages code-only, fully regeneratable Remotion tech reels.
Supports swappable voices (sardor / madina) and visual themes (dark / light).
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
    "andrew": "en-US-AndrewMultilingualNeural",
    "ava": "en-US-AvaMultilingualNeural",
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


def reel_dirs():
    # Folders starting with "_" are Studio-only sandboxes (no voice, never rendered).
    return sorted(p for p in REELS_SRC_DIR.iterdir() if p.is_dir() and not p.name.startswith("_"))


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

    reels = reel_dirs()
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
            prefix, suffix = text.split(highlight, 1)
        else:
            # Old highlight no longer fits the new text: show the new text plain.
            prefix, highlight, suffix = text, "", ""
            highlight_color = highlight_bg = None

        cue_obj = {
            "index": idx,
            "startFrame": start_frame,
            "endFrame": end_frame,
            "text": text,
            "prefix": prefix,
            "highlight": highlight,
            "suffix": suffix,
        }
        # Phrases come from the voice; a plain subtitles sync keeps them while the text is unchanged.
        cue_phrases = cue.get("phrases") or (prev.get("phrases") if prev.get("text") == text else None)
        if cue_phrases:
            cue_obj["phrases"] = cue_phrases
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


def srt_time(seconds: float) -> str:
    ms = int(round(seconds * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


# Runs under edge-tts's own Python: writes the audio and prints the word boundaries as [[seconds, word], ...].
SPEAK_PY = """
import asyncio, json, sys, edge_tts
async def main(text, voice, rate, dest):
    words = []
    c = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
    with open(dest, "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append([ch["offset"] / 1e7, ch["text"]])
    print(json.dumps(words))
asyncio.run(main(*sys.argv[1:]))
"""


def speak(text: str, dest: Path, voice: str, rate: str):
    """One sentence to MP3; returns its word boundaries. The voice service sometimes never answers
    and edge-tts has no timeout: each try gets a minute, three tries in all."""
    python = Path(get_edge_tts_bin()).read_text(encoding="utf-8").splitlines()[0].removeprefix("#!").strip()
    cmd = [python, "-c", SPEAK_PY, text, voice, rate, str(dest)]
    for attempt in range(1, 4):
        try:
            return json.loads(subprocess.run(cmd, check=True, timeout=60, capture_output=True, text=True).stdout)
        except (subprocess.TimeoutExpired, subprocess.CalledProcessError):
            print(f"   no answer for: {text[:50]}… (try {attempt} of 3)")
    sys.exit("Error: the voice service didn't answer.")


# Captions show what is said in its written form, a short phrase at a time, timed by the voice's word boundaries.
NUMBERS = {w: n for n, w in enumerate("zero one two three four five six seven eight nine ten eleven twelve thirteen "
                                      "fourteen fifteen sixteen seventeen eighteen nineteen".split())}
NUMBERS.update({"twenty": 20, "thirty": 30, "forty": 40})
PHRASE_MIN, PHRASE_MAX, PHRASE_CHARS = 4, 8, 48
LITTLE_WORDS = {"a", "an", "the", "to", "of", "and", "or", "in", "on", "by", "for", "its", "with"}


def norm(text: str):
    return re.findall(r"\w+(?:'\w+)*", text.lower())


def caption_glossary():
    """Spoken → written pairs from AGENTS.md's pronunciation glossary (rows marked Caption: yes), longest first."""
    section = (ROOT_DIR / "AGENTS.md").read_text(encoding="utf-8").split("### D. Pronunciation glossary", 1)[1]
    pairs = [(norm(m.group(2)), m.group(1))
             for m in re.finditer(r"^\|\s*`([^`]+)`\s*\|\s*(.+?)\s*\|\s*yes\s*\|", section, re.M)]
    return sorted(pairs, key=lambda p: -len(p[0]))


def caption_tokens(sentence: str, boundaries, glossary):
    """The sentence's words with start times, spoken forms replaced by written ones."""
    words = sentence.split()
    flat = [(n, i) for i, w in enumerate(words) for n in norm(w)]
    starts = [None] * len(words)
    k = 0
    for t, said in boundaries:
        for n in norm(said):
            j = next((j for j in range(k, min(k + 6, len(flat))) if flat[j][0] == n), None)
            if j is None:
                continue
            if starts[flat[j][1]] is None:
                starts[flat[j][1]] = t
            k = j + 1
    for i in range(len(words)):  # a word the boundaries missed starts with the one before it
        starts[i] = starts[i] if starts[i] is not None else (starts[i - 1] if i else 0.0)

    tokens, i = [], 0
    while i < len(words):
        rest = [n for w in words[i:] for n in norm(w)]
        hit = None
        for spoken, written in glossary:
            if rest[:len(spoken)] == spoken:
                # the match must end on a word edge
                count, used = 0, 0
                while used < len(spoken):
                    used += len(norm(words[i + count]))
                    count += 1
                if used == len(spoken):
                    hit = (written, count)
                    break
        if hit is None and rest and rest[0] == "lesson" and len(rest) > 1 and rest[1] in NUMBERS:
            n, count = NUMBERS[rest[1]], 2
            if len(rest) > 2 and rest[2] in NUMBERS and NUMBERS[rest[1]] >= 20 and NUMBERS[rest[2]] < 10:
                n += NUMBERS[rest[2]]
                count = 2 if "-" in words[i + 1] else 3
            hit = (f"Lesson {n}", count)
        if hit:
            written, count = hit
            punct = re.search(r"[^\w']*$", words[i + count - 1]).group()
            tokens.append({"text": written + punct, "start": starts[i]})
            i += count
        else:
            tokens.append({"text": words[i], "start": starts[i]})
            i += 1
    return tokens


def caption_phrases(tokens, fps=30):
    """Short phrases (up to 8 words, split after punctuation once 3 words are in), each with its words' start frames."""
    phrases, cur = [], []
    for t in tokens:
        cur.append(t)
        chars = len(" ".join(x["text"] for x in cur))
        if len(cur) >= 3 and t["text"][-1] in ",;:.?!":
            phrases.append(cur)
            cur = []
        elif len(cur) >= PHRASE_MAX or chars >= PHRASE_CHARS:
            # never end a phrase on a little word ("a", "the"): it starts the next one
            carry = [cur.pop()] if cur[-1]["text"].lower() in LITTLE_WORDS and len(cur) > PHRASE_MIN else []
            phrases.append(cur)
            cur = carry
    if cur:
        if phrases and len(cur) < 3 and len(phrases[-1]) + len(cur) <= PHRASE_MAX + 2:
            phrases[-1] += cur
        else:
            phrases.append(cur)
    return [{"startFrame": math.floor(p[0]["start"] * fps),
             "words": [{"text": t["text"], "startFrame": math.floor(t["start"] * fps)} for t in p]} for p in phrases]


def generate_voice(reel_name: str, voice_raw="andrew", rate="+5%"):
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

    print(f"🎙️ Generating voice for '{reel_name}' (voice: {voice}, rate: {rate})...")
    # One request per sentence, joined afterwards: the voice service drops long requests, and
    # each sentence is one subtitle cue anyway.
    sentences = [x for x in re.split(r"(?<=[.?!])\s+", script_file.read_text(encoding="utf-8").strip()) if x]
    work = dest_audio_dir / "parts"
    shutil.rmtree(work, ignore_errors=True)
    work.mkdir()
    glossary = caption_glossary()
    srt_blocks, phrases, offset = [], [], 0.0
    for i, sentence in enumerate(sentences, 1):
        part = work / f"{i:03d}.mp3"
        boundaries = speak(sentence, part, voice, rate)
        duration = float(subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(part)],
            check=True, capture_output=True, text=True).stdout.strip())
        tokens = caption_tokens(sentence, [(offset + t, w) for t, w in boundaries], glossary)
        written = " ".join(t["text"] for t in tokens)
        srt_blocks.append(f"{i}\n{srt_time(offset + 0.05)} --> {srt_time(offset + duration)}\n{written}\n")
        phrases.append(caption_phrases(tokens))
        offset += duration
    (work / "list.txt").write_text("".join(f"file '{p.name}'\n" for p in sorted(work.glob("*.mp3"))))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(work / "list.txt"),
                    "-c", "copy", str(dest_mp3)], check=True)
    shutil.rmtree(work)
    dest_srt.write_text("\n".join(srt_blocks), encoding="utf-8")

    cues = parse_srt_file(dest_srt)
    for cue, cue_phrases in zip(cues, phrases):
        cue["phrases"] = cue_phrases
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
    parser.add_argument("--voice", default="andrew",
                        help="TTS voice: andrew, ava, sardor, madina, or full voice name (default: andrew)")
    parser.add_argument("--rate", default="+5%",
                        help="TTS speech rate (default: +5%%)")
    parser.add_argument("--theme", choices=["dark", "light"], default="dark",
                        help="Visual theme: dark or light (default: dark)")

    args = parser.parse_args()

    if args.command == "list":
        list_reels()
    elif args.command == "voice":
        if args.reel == "all":
            reels = [p.name for p in reel_dirs()]
            for r in reels:
                generate_voice(r, args.voice, args.rate)
        else:
            generate_voice(args.reel, args.voice, args.rate)
    elif args.command == "subtitles":
        if args.reel == "all":
            reels = [p.name for p in reel_dirs()]
            for r in reels:
                sync_subtitles_json(r)
        else:
            sync_subtitles_json(args.reel)
    elif args.command in ["render", "build"]:
        if args.reel == "all":
            reels = [p.name for p in reel_dirs()]
            for r in reels:
                render_video(r, args.theme)
        else:
            render_video(args.reel, args.theme)



if __name__ == "__main__":
    main()
