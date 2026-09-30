"""Read-only managed-block validation and pending-audio discovery."""
from __future__ import annotations

from pathlib import Path
import re

from .media import has_audio_stream
from .paths import AUDIO_EXTENSIONS, EMBED, TranscriptError, auto_transcript_recording, notes, relative, resolve_audio

MARKER = re.compile(br'<!-- (?P<namespace>agent|codex)-audio-transcript:(?P<kind>start|end) file="(?P<audio>[^"]*)" -->')
CALLOUT = b"> [!audio-transcript] Spoken"
AGENT_CALLOUT = b"> [!audio-transcript]- Spoken for Agent"
CALLOUTS = frozenset((CALLOUT, AGENT_CALLOUT))


def marker(audio_rel: str) -> tuple[bytes, bytes]:
    safe = audio_rel.replace('"', "&quot;")
    return (f'<!-- agent-audio-transcript:start file="{safe}" -->'.encode(),
            f'<!-- agent-audio-transcript:end file="{safe}" -->'.encode())


def managed_blocks(vault: Path, note: Path, data: bytes) -> tuple[dict[int, dict], list[str]]:
    """Return valid blocks keyed by embedded-audio offset, plus shape errors."""
    marks = list(MARKER.finditer(data))
    blocks: dict[int, dict] = {}
    errors: list[str] = []
    index = 0
    while index < len(marks):
        start = marks[index]
        if start.group("kind") != b"start":
            errors.append("stray transcript end marker")
            index += 1
            continue
        if index + 1 == len(marks) or marks[index + 1].group("kind") != b"end":
            errors.append("transcript start marker is missing its matching end marker")
            index += 1
            continue
        end = marks[index + 1]
        index += 2
        if start.group("namespace") != end.group("namespace"):
            errors.append("transcript marker namespaces do not match")
            continue
        declared = start.group("audio").decode("utf-8", "replace").replace("&quot;", '"')
        ended = end.group("audio").decode("utf-8", "replace").replace("&quot;", '"')
        if declared != ended:
            errors.append("transcript marker audio does not match")
            continue
        region = data[start.end():end.start()]
        lines = region.splitlines()
        if len(lines) < 5 or lines[0] or lines[1] not in CALLOUTS or not lines[2].startswith(b"> ") or lines[3] != b">":
            errors.append("transcript markers must wrap an audio-transcript callout")
            continue
        embed = EMBED.fullmatch(lines[2][2:])
        if not embed:
            errors.append("audio-transcript callout is missing its audio embed")
            continue
        if any(line and line != b">" and not line.startswith(b"> ") for line in lines[4:]):
            errors.append("audio-transcript callout contains an unquoted transcript line")
            continue
        raw = embed.group("target").decode("utf-8", "replace")
        if Path(raw).suffix.lower() not in AUDIO_EXTENSIONS:
            errors.append("audio-transcript callout embed is not audio")
            continue
        try:
            audio = resolve_audio(vault, note, raw)
        except TranscriptError as exc:
            errors.append(str(exc))
            continue
        if audio is None:
            errors.append(f"audio attachment not found: {raw}")
            continue
        if relative(vault, audio) != declared:
            errors.append("transcript marker audio does not match its embedded audio")
            continue
        offset = start.end() + region.find(lines[2][2:])
        blocks[offset] = {"start": start.start(), "marker_end": start.end(), "end_marker_start": end.start(),
                          "end": end.end(), "embed": embed, "callout": lines[1]}
    return blocks, errors


def scan(vault: Path, one_note: str | None = None) -> tuple[list[dict], list[str]]:
    occurrences: dict[Path, list[dict]] = {}
    issues: list[str] = []
    for note in notes(vault, one_note):
        data = note.read_bytes()
        blocks, block_errors = managed_blocks(vault, note, data)
        issues.extend(f"{relative(vault, note)}: {error}" for error in block_errors)
        for match in EMBED.finditer(data):
            raw = match.group("target").decode("utf-8", "replace")
            if Path(raw).suffix.lower() not in AUDIO_EXTENSIONS:
                continue
            if not auto_transcript_recording(Path(raw)):
                continue
            try:
                audio = resolve_audio(vault, note, raw)
            except TranscriptError as exc:
                issues.append(f"{relative(vault, note)}: {exc}")
                continue
            if audio is None:
                issues.append(f"{relative(vault, note)}: audio attachment not found: {raw}")
                continue
            occurrences.setdefault(audio, []).append({"note": relative(vault, note), "audio": relative(vault, audio),
                                                       "managed": match.start() in blocks})
    pending: list[dict] = []
    for audio, entries in occurrences.items():
        if len(entries) != 1 or len({entry["note"] for entry in entries}) != 1:
            issues.append(f"{relative(vault, audio)}: embedded {len(entries)} times; refusing ambiguous ownership")
        elif not entries[0]["managed"]:
            pending.append({key: entries[0][key] for key in ("note", "audio")})
    return pending, sorted(set(issues))
