"""Vault boundaries and audio-attachment resolution."""
from __future__ import annotations

from pathlib import Path
import re

AUDIO_EXTENSIONS = {
    ".aac", ".aif", ".aiff", ".caf", ".flac", ".m4a", ".mp3", ".oga", ".ogg", ".opus", ".wav", ".wma",
    ".3gp", ".m4v", ".mkv", ".mov", ".mp4", ".webm",
}
OBSIDIAN_RECORDING = re.compile(r"Recording \d{14}\.m4a\Z", re.I)
DAILY_INTAKE_VOICE = re.compile(r"telegram-voice-[A-Za-z0-9][A-Za-z0-9_-]*\.(?:oga|ogg|opus)\Z", re.I)
VIDEO_EXTENSIONS = {".3gp", ".m4v", ".mkv", ".mov", ".mp4"}
EXCLUDED_PARTS = {"Artifacts", ".obsidian", ".trash", ".claudian"}
EXCLUDED_PREFIXES = (Path("Strata/Copilot"), Path("Strata/Templates"), Path("Strata/Save"), Path("Strata/Public Vault"),
                     Path("Strata/.backups"))
CHEATSHEET = Path("Matter/Obsidian/Obsidian Markdown Cheatsheet.md")
DAILY_NOTES = Path("Continuum/Time/Daily")
EMBED = re.compile(br"!\[\[(?P<target>[^\]|]+)(?:\|[^\]]*)?\]\]", re.I)
WIKILINK = re.compile(r"(?<!!)\[\[(?P<content>[^\]]+)\]\]")


class TranscriptError(ValueError):
    pass


def vault_path(value: str) -> Path:
    return Path(value).expanduser().resolve()


def relative(vault: Path, path: Path) -> str:
    return path.resolve().relative_to(vault).as_posix()


def excluded(vault: Path, path: Path) -> bool:
    try:
        rel = path.resolve().relative_to(vault)
    except ValueError:
        return True
    return bool(set(rel.parts) & EXCLUDED_PARTS) or any(rel.is_relative_to(prefix) for prefix in EXCLUDED_PREFIXES) or rel == CHEATSHEET


def notes(vault: Path, one_note: str | None = None) -> list[Path]:
    if one_note:
        note = (vault / one_note).resolve()
        if not note.is_file() or note.suffix.lower() != ".md" or excluded(vault, note):
            raise TranscriptError("manual note must be an included vault-relative Markdown file")
        return [note]
    return sorted(path for path in vault.rglob("*.md") if not excluded(vault, path))


def resolve_audio(vault: Path, note: Path, target: str) -> Path | None:
    target = target.strip().replace("\\", "/")
    requested = Path(target.lstrip("/"))
    candidates = [vault / requested, note.parent / requested]
    found = [path.resolve() for path in candidates
             if path.is_file() and not excluded(vault, path) and path.suffix.lower() in AUDIO_EXTENSIONS]
    if not found and requested.parent == Path("."):
        found = [path.resolve() for path in vault.rglob(requested.name)
                 if path.is_file() and not excluded(vault, path) and path.suffix.lower() in AUDIO_EXTENSIONS]
    unique = sorted(set(found))
    if len(unique) > 1:
        raise TranscriptError(f"audio embed target is ambiguous: {target}")
    return unique[0] if unique else None


def auto_transcript_recording(path: Path) -> bool:
    """Whether a filename has strong enough provenance for automatic discovery."""
    return bool(OBSIDIAN_RECORDING.fullmatch(path.name) or DAILY_INTAKE_VOICE.fullmatch(path.name))
