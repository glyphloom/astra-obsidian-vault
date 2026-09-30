"""FFmpeg normalization, segmentation, and MLX Whisper orchestration."""
from __future__ import annotations

from collections.abc import Iterable
from difflib import SequenceMatcher
from pathlib import Path
import re
import subprocess
import tempfile

from .paths import TranscriptError

FFMPEG = "/opt/homebrew/bin/ffmpeg"
FFPROBE = "/opt/homebrew/bin/ffprobe"
SEGMENT_TARGET_SECONDS = 60.0
SEGMENT_MAX_SECONDS = 90.0
SEGMENT_MIN_SECONDS = 30.0
SEGMENT_OVERLAP_SECONDS = 1.5


def run_tool(command: list[str], label: str) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(command, text=True, capture_output=True)
    if result.returncode:
        detail = (result.stderr or result.stdout).strip()
        raise TranscriptError(f"{label} failed" + (f": {detail}" if detail else ""))
    return result


def has_audio_stream(media: Path) -> bool:
    result = run_tool([FFPROBE, "-v", "error", "-select_streams", "a", "-show_entries", "stream=index",
                       "-of", "csv=p=0", str(media)], "ffprobe audio-stream detection")
    return bool(result.stdout.strip())


def normalize_audio(audio: Path, destination: Path) -> None:
    run_tool([FFMPEG, "-y", "-hide_banner", "-loglevel", "error", "-i", str(audio), "-vn", "-ac", "1", "-ar", "16000",
              "-c:a", "pcm_s16le", str(destination)], "ffmpeg audio normalization")


def audio_duration(audio: Path) -> float:
    result = run_tool([FFPROBE, "-v", "error", "-show_entries", "format=duration", "-of",
                       "default=noprint_wrappers=1:nokey=1", str(audio)], "ffprobe")
    try:
        duration = float(result.stdout.strip())
    except ValueError as exc:
        raise TranscriptError("ffprobe returned no usable audio duration") from exc
    if duration <= 0:
        raise TranscriptError("audio duration must be positive")
    return duration


def silence_boundaries(audio: Path) -> list[float]:
    result = run_tool([FFMPEG, "-hide_banner", "-i", str(audio), "-af", "silencedetect=noise=-35dB:d=0.6", "-f", "null", "-"],
                      "ffmpeg silence detection")
    starts: list[float] = []
    boundaries: list[float] = []
    for line in result.stderr.splitlines():
        start = re.search(r"silence_start:\s*([0-9.]+)", line)
        if start:
            starts.append(float(start.group(1)))
            continue
        end = re.search(r"silence_end:\s*([0-9.]+)", line)
        if end and starts:
            boundaries.append((starts.pop(0) + float(end.group(1))) / 2)
    return boundaries


def segment_ranges(duration: float, boundaries: Iterable[float]) -> list[tuple[float, float]]:
    pauses = sorted(boundary for boundary in boundaries if 0 < boundary < duration)
    ranges: list[tuple[float, float]] = []
    start = 0.0
    while duration - start > SEGMENT_MAX_SECONDS:
        maximum = min(start + SEGMENT_MAX_SECONDS, duration - SEGMENT_MIN_SECONDS)
        candidates = [pause for pause in pauses if start + SEGMENT_MIN_SECONDS <= pause <= maximum]
        end = min(candidates, key=lambda pause: abs(pause - (start + SEGMENT_TARGET_SECONDS))) if candidates else min(start + SEGMENT_TARGET_SECONDS, duration - SEGMENT_MIN_SECONDS)
        ranges.append((start, end))
        start = end
    ranges.append((start, duration))
    return ranges


def extract_segment(audio: Path, destination: Path, start: float, end: float) -> None:
    run_tool([FFMPEG, "-y", "-hide_banner", "-loglevel", "error", "-ss", f"{start:.3f}", "-i", str(audio),
              "-t", f"{end - start:.3f}", "-vn", "-c:a", "pcm_s16le", str(destination)], "ffmpeg segment extraction")


def word_key(word: str) -> str:
    return re.sub(r"^\W+|\W+$", "", word, flags=re.UNICODE).casefold()


def same_word(left: str, right: str) -> bool:
    return left == right or (len(left) >= 4 and len(right) >= 4 and SequenceMatcher(None, left, right).ratio() >= 0.92)


def overlap_word_count(previous: str, following: str) -> int:
    before = [word_key(match.group()) for match in re.finditer(r"\S+", previous)]
    after = [word_key(match.group()) for match in re.finditer(r"\S+", following)]
    for count in range(min(12, len(before), len(after)), 0, -1):
        left, right = before[-count:], after[:count]
        if all(left) and all(right) and all(same_word(one, two) for one, two in zip(left, right)) and (count > 1 or len(left[0]) >= 6):
            return count
    return 0


def stitch_segments(texts: Iterable[str]) -> str:
    stitched = ""
    for text in texts:
        text = text.strip()
        if not text:
            continue
        if stitched and (count := overlap_word_count(stitched, text)):
            words = list(re.finditer(r"\S+", text))
            text = text[words[count - 1].end():].lstrip()
        stitched = f"{stitched} {text}".strip() if text else stitched
    return stitched


def review_flags(text: str, duration: float) -> list[dict[str, object]]:
    tokens = [match.group() for match in re.finditer(r"\S+", text)]
    words = [word_key(token) for token in tokens if word_key(token)]
    flags: list[dict[str, object]] = []
    for values, kind, minimum, key in ((tokens, "repeated_punctuation", 5, "token"), (words, "repeated_word", 6, "word")):
        start = 0
        while start < len(values):
            if kind == "repeated_punctuation" and not re.fullmatch(r"[^\w\s]+", values[start], re.UNICODE):
                start += 1; continue
            end = start + 1
            while end < len(values) and values[end] == values[start]:
                end += 1
            if end - start >= minimum:
                flags.append({"kind": kind, key: values[start], "repetitions": end - start}); break
            start = end
    if not flags:
        for width in range(min(6, len(words) // 3), 1, -1):
            for start in range(len(words) - width * 3 + 1):
                phrase = words[start:start + width]; repeats = 1
                while words[start + repeats * width:start + (repeats + 1) * width] == phrase:
                    repeats += 1
                if repeats >= 3:
                    flags.append({"kind": "repeated_phrase", "phrase": " ".join(phrase), "repetitions": repeats}); break
            if flags:
                break
    if duration >= 20:
        words_per_minute = round(len(words) * 60 / duration, 1)
        if words_per_minute < 8 or words_per_minute > 360:
            flags.append({"kind": "abnormal_compression", "words": len(words), "words_per_minute": words_per_minute})
    return flags


def transcribe_audio(audio: Path, prompt: str, transcribe) -> dict:
    options = {"path_or_hf_repo": "mlx-community/whisper-large-v3-mlx", "task": "transcribe", "initial_prompt": prompt}
    with tempfile.TemporaryDirectory(prefix="agent-audio-transcript-") as temporary:
        temp_dir = Path(temporary); normalized = temp_dir / "normalized.wav"
        normalize_audio(audio, normalized)
        duration = audio_duration(normalized)
        if duration <= SEGMENT_MAX_SECONDS:
            return transcribe(str(normalized), **options)
        reviewed: list[dict[str, object]] = []
        for index, (start, end) in enumerate(segment_ranges(duration, silence_boundaries(normalized))):
            source_start = max(0.0, start - SEGMENT_OVERLAP_SECONDS if index else start)
            chunk = temp_dir / f"segment-{index:03d}.wav"
            extract_segment(normalized, chunk, source_start, end)
            result = transcribe(str(chunk), **options); text = str(result.get("text", "")).strip()
            reviewed.append({"index": index, "start": start, "end": end, "source_start": source_start, "source_end": end,
                             "text": text, "model_segments": result.get("segments", []),
                             "metadata": {key: value for key, value in result.items() if key not in {"text", "segments"}},
                             "review_flags": review_flags(text, end - start)})
    flags = [{"segment": item["index"], **flag} for item in reviewed for flag in item["review_flags"]]
    return {"text": stitch_segments(item["text"] for item in reviewed), "segments": reviewed,
            "transcription_metadata": {"segmented": True, "duration_seconds": duration,
                                         "overlap_seconds": SEGMENT_OVERLAP_SECONDS, "review_flags": flags}}
