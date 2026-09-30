"""Directive styling and carefully backed-up managed-block mutations."""
from __future__ import annotations

import datetime as dt
import hashlib
import os
from pathlib import Path
import re
import tempfile

from .discovery import AGENT_CALLOUT, CALLOUT, MARKER, managed_blocks, marker
from .paths import AUDIO_EXTENSIONS, EMBED, TranscriptError, excluded, notes, resolve_audio

DIRECTIVE = re.compile(r"(?P<address>(?<!\w)(?:Codex|Кодекс|Agent|Агент)(?!\w)\s*[,，،]\s*)(?P<body>[^\n.!?]*[.!?]?)", re.I)
PERIOD_DIRECTIVE = re.compile(r"(?m)(?:^[ \t]*|(?<=[,，،])[ \t]*)(?P<address>(?:Codex|Кодекс|Agent|Агент)(?!\w)\.[ \t]*)(?P<body>[^\n]*)", re.I)
REVIEWED_LINKED_DIRECTIVE = re.compile(r"\*\[\[(?:Codex|Кодекс|Agent|Агент)\]\]\s*[,，،]\s*[^\n.!?]*[.!?]\*", re.I)


def directives(transcript: str) -> list[dict[str, int | str]]:
    found: list[dict[str, int | str]] = []
    matches = list(DIRECTIVE.finditer(transcript)) + list(PERIOD_DIRECTIVE.finditer(transcript))
    for match in sorted(matches, key=lambda item: item.start("address")):
        body = match.group("body"); start = match.start("address")
        if not body.strip() or (found and start < int(found[-1]["end"])):
            continue
        found.append({"text": transcript[start:match.end("body")], "start": start, "end": match.end("body"), "body": body,
                      "body_start": match.start("body"), "body_end": match.end("body")})
    return found


def styled_directives(transcript: str) -> str:
    for directive in reversed(directives(transcript)):
        start, end = int(directive["start"]), int(directive["end"])
        transcript = f'{transcript[:start]}<span class="agent-audio-directive"><em>{transcript[start:end]}</em></span>{transcript[end:]}'
    for match in reversed(list(REVIEWED_LINKED_DIRECTIVE.finditer(transcript))):
        transcript = f'{transcript[:match.start()]}<span class="agent-audio-directive">{match.group()}</span>{transcript[match.end():]}'
    return transcript


def quoted_transcript(transcript: str, newline: bytes) -> bytes:
    text = styled_directives(transcript.strip()).replace("\r\n", "\n").replace("\r", "\n")
    return newline.join(b"> " + line.encode("utf-8") if line else b">" for line in text.split("\n"))


def callout(spoken_for_agent: bool) -> bytes:
    return AGENT_CALLOUT if spoken_for_agent else CALLOUT


def managed_block(audio_rel: str, embed: bytes, transcript: str, newline: bytes, spoken_for_agent: bool = False) -> bytes:
    start, end = marker(audio_rel)
    return newline.join((start, callout(spoken_for_agent), b"> " + embed, b">", quoted_transcript(transcript, newline), end))


def backup(note: Path, backup_dir: Path) -> Path:
    backup_dir.mkdir(parents=True, exist_ok=True)
    stamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    digest = hashlib.sha256(note.read_bytes()).hexdigest()[:12]
    destination = backup_dir / f"{note.stem}-{stamp}-{digest}.md"
    destination.write_bytes(note.read_bytes())
    return destination


def atomic_write(note: Path, data: bytes) -> None:
    with tempfile.NamedTemporaryFile(dir=note.parent, delete=False) as handle:
        handle.write(data); temporary = Path(handle.name)
    os.replace(temporary, note)


def ownership_count(vault: Path, audio: Path) -> int:
    count = 0
    for candidate in notes(vault):
        for embed in EMBED.finditer(candidate.read_bytes()):
            raw = embed.group("target").decode("utf-8", "replace")
            if Path(raw).suffix.lower() not in AUDIO_EXTENSIONS:
                continue
            try:
                count += resolve_audio(vault, candidate, raw) == audio
            except TranscriptError:
                continue
    return count


def unique_embed(vault: Path, note_rel: str, audio_rel: str) -> tuple[Path, re.Match[bytes], bytes]:
    note, audio = (vault / note_rel).resolve(), (vault / audio_rel).resolve()
    if excluded(vault, note) or excluded(vault, audio) or not note.is_file() or not audio.is_file() or audio.suffix.lower() not in AUDIO_EXTENSIONS:
        raise TranscriptError("note or audio is not an included vault item")
    data = note.read_bytes()
    matches = [match for match in EMBED.finditer(data)
               if resolve_audio(vault, note, match.group("target").decode("utf-8", "replace")) == audio]
    if len(matches) != 1 or ownership_count(vault, audio) != 1:
        raise TranscriptError("audio ownership or embed is not uniquely safe to mutate")
    return note, matches[0], data


def find_unique(vault: Path, note_rel: str, audio_rel: str) -> tuple[Path, re.Match[bytes], bytes, dict[int, dict]]:
    note, embed, data = unique_embed(vault, note_rel, audio_rel)
    blocks, errors = managed_blocks(vault, note, data)
    if errors:
        raise TranscriptError("malformed transcript marker or callout; refusing mutation")
    return note, embed, data, blocks


def legacy_block(data: bytes, embed: re.Match[bytes], audio_rel: str) -> tuple[int, int, bytes] | None:
    marks = list(MARKER.finditer(data)); start, end = marker(audio_rel)
    pairs = ((start, end), (start.replace(b"agent-", b"codex-", 1), end.replace(b"agent-", b"codex-", 1)))
    if len(marks) != 2 or (marks[0].group(0), marks[1].group(0)) not in pairs:
        return None
    between = data[embed.end():marks[0].start()]
    if not re.fullmatch(br"(?:[ \t]*\r?\n){1,2}", between):
        return None
    newline = b"\r\n" if data[marks[0].end():].startswith(b"\r\n") else b"\n"
    transcript = data[marks[0].end():marks[1].start()]
    if not transcript.startswith(newline) or not transcript.endswith(newline):
        return None
    return marks[0].start(), marks[1].end(), transcript[len(newline):-len(newline)]


def quoted_bytes(transcript: bytes, newline: bytes) -> bytes:
    if not transcript:
        raise TranscriptError("legacy transcript must contain text")
    return newline.join(b"> " + line if line else b">" for line in transcript.split(newline))


def migrate(vault: Path, note_rel: str, audio_rel: str, backup_dir: Path, spoken_for_agent: bool = False) -> Path:
    note, embed, data = unique_embed(vault, note_rel, audio_rel)
    blocks, errors = managed_blocks(vault, note, data)
    existing = blocks.get(embed.start())
    if existing:
        if errors:
            raise TranscriptError("malformed transcript marker or callout; refusing mutation")
        if not spoken_for_agent:
            raise TranscriptError("managed transcript is already migrated; use --spoken-for-agent only for an agent-directed recording")
        if existing["callout"] == AGENT_CALLOUT:
            raise TranscriptError("managed transcript is already Spoken for Agent")
        newline = b"\r\n" if data[existing["marker_end"]:].startswith(b"\r\n") else b"\n"
        title_start = existing["marker_end"] + len(newline)
        saved = backup(note, backup_dir)
        atomic_write(note, data[:title_start] + AGENT_CALLOUT + data[title_start + len(CALLOUT):])
        return saved
    found = legacy_block(data, embed, audio_rel)
    if not found:
        raise TranscriptError("migrate requires one exact legacy transcript block for this audio")
    _, end_at, transcript = found; newline = b"\r\n" if b"\r\n" in data else b"\n"
    try:
        transcript = styled_directives(transcript.decode("utf-8")).encode("utf-8")
    except UnicodeError as exc:
        raise TranscriptError("legacy transcript is not valid UTF-8") from exc
    start, end = marker(audio_rel)
    block = newline.join((start, callout(spoken_for_agent), b"> " + embed.group(0), b">", quoted_bytes(transcript, newline), end))
    saved = backup(note, backup_dir); atomic_write(note, data[:embed.start()] + block + data[end_at:])
    return saved


def managed_transcript(data: bytes, block: dict, newline: bytes) -> bytes:
    region = data[block["marker_end"]:block["end_marker_start"]]
    if not region.startswith(newline) or not region.endswith(newline):
        raise TranscriptError("managed transcript callout has an unexpected shape")
    lines = region[len(newline):-len(newline)].split(newline)
    if len(lines) < 4 or lines[:3] != [block["callout"], b"> " + block["embed"].group(0), b">"]:
        raise TranscriptError("managed transcript callout has an unexpected shape")
    quoted = lines[3:]
    if any(line != b">" and not line.startswith(b"> ") for line in quoted):
        raise TranscriptError("managed transcript has an unquoted line")
    return newline.join(line[2:] if line.startswith(b"> ") else b"" for line in quoted)


def restyle(vault: Path, note_rel: str, audio_rel: str, backup_dir: Path) -> Path:
    note, embed, data, blocks = find_unique(vault, note_rel, audio_rel)
    block = blocks.get(embed.start())
    if not block:
        raise TranscriptError("restyle requires an existing managed transcript block")
    newline = b"\r\n" if b"\r\n" in data else b"\n"
    try:
        transcript = styled_directives(managed_transcript(data, block, newline).decode("utf-8"))
    except UnicodeError as exc:
        raise TranscriptError("managed transcript is not valid UTF-8") from exc
    start, end = marker(audio_rel)
    replacement = newline.join((start, block["callout"], b"> " + embed.group(0), b">", quoted_bytes(transcript.encode("utf-8"), newline), end))
    if replacement == data[block["start"]:block["end"]]:
        raise TranscriptError("managed transcript has no directives to restyle")
    saved = backup(note, backup_dir); atomic_write(note, data[:block["start"]] + replacement + data[block["end"]:])
    return saved


def mutate(vault: Path, note_rel: str, audio_rel: str, transcript: str, backup_dir: Path, replace: bool, spoken_for_agent: bool = False) -> Path:
    note, embed, data, blocks = find_unique(vault, note_rel, audio_rel)
    existing = blocks.get(embed.start())
    if replace and not existing:
        raise TranscriptError("replace requires an existing managed transcript block")
    if not replace and existing:
        raise TranscriptError("embed already has a managed transcript block; use explicit replace")
    if existing and existing["callout"] != callout(spoken_for_agent):
        raise TranscriptError("replace must explicitly retain the recording's spoken type")
    if not transcript.strip():
        raise TranscriptError("transcript must contain text")
    newline = b"\r\n" if b"\r\n" in data else b"\n"; block = managed_block(audio_rel, embed.group(0), transcript, newline, spoken_for_agent)
    result = data[:existing["start"]] + block + data[existing["end"]:] if existing else data[:embed.start()] + block + data[embed.end():]
    saved = backup(note, backup_dir); atomic_write(note, result)
    return saved
