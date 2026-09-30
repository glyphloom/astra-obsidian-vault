#!/usr/bin/env python3
"""Safely discover and place local-audio transcripts in one Obsidian vault."""
from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path
import sys

# This stable command-line and import surface deliberately stays thin. Its
# cohesive siblings prevent vocabulary, media, and mutation work from crowding.
SCRIPT_DIR = str(Path(__file__).parent)
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)
from daily_audio.context import agent_comments, aliases_for, daily_notes, folder_terms, prompt_for, unresolved, vocabulary
from daily_audio.discovery import CALLOUT, MARKER, managed_blocks, marker, scan
from daily_audio.media import (SEGMENT_MAX_SECONDS, SEGMENT_MIN_SECONDS, SEGMENT_OVERLAP_SECONDS, SEGMENT_TARGET_SECONDS,
                               audio_duration, extract_segment, has_audio_stream, normalize_audio, overlap_word_count,
                               review_flags, run_tool, same_word, segment_ranges, silence_boundaries, stitch_segments,
                               transcribe_audio, word_key)
from daily_audio.mutations import (DIRECTIVE, PERIOD_DIRECTIVE, REVIEWED_LINKED_DIRECTIVE, atomic_write, backup, directives,
                                   find_unique, legacy_block, managed_block, managed_transcript, migrate, mutate,
                                   ownership_count, quoted_bytes, quoted_transcript, restyle, styled_directives, unique_embed)
from daily_audio.paths import (AUDIO_EXTENSIONS, CHEATSHEET, DAILY_NOTES, EMBED, EXCLUDED_PARTS, EXCLUDED_PREFIXES,
                               TranscriptError, excluded, notes, relative, resolve_audio, vault_path)


def cli() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--vault", required=True, help="vault root")
    sub = parser.add_subparsers(dest="command", required=True)
    discover = sub.add_parser("discover"); discover.add_argument("--note")
    vocabulary_cmd = sub.add_parser("vocabulary"); vocabulary_cmd.add_argument("--note")
    unresolved_cmd = sub.add_parser("unresolved"); unresolved_cmd.add_argument("--note")
    comments_cmd = sub.add_parser("agent-comments"); comments_cmd.add_argument("--note")
    directive = sub.add_parser("directives"); directive.add_argument("--transcript-file", required=True)
    transcribe = sub.add_parser("transcribe"); transcribe.add_argument("--audio", required=True); transcribe.add_argument("--prompt", default="")
    backup_cmd = sub.add_parser("backup"); backup_cmd.add_argument("--note", required=True); backup_cmd.add_argument("--backup-dir")
    migrate_cmd = sub.add_parser("migrate"); migrate_cmd.add_argument("--note", required=True); migrate_cmd.add_argument("--audio", required=True); migrate_cmd.add_argument("--spoken-for-agent", action="store_true"); migrate_cmd.add_argument("--backup-dir")
    restyle_cmd = sub.add_parser("restyle"); restyle_cmd.add_argument("--note", required=True); restyle_cmd.add_argument("--audio", required=True); restyle_cmd.add_argument("--backup-dir")
    for name in ("insert", "replace"):
        command = sub.add_parser(name); command.add_argument("--note", required=True); command.add_argument("--audio", required=True)
        command.add_argument("--transcript-file", required=True); command.add_argument("--spoken-for-agent", action="store_true"); command.add_argument("--backup-dir")
    return parser


def backup_dir(vault: Path, value: str | None) -> Path:
    return Path(value).expanduser() if value else vault / "Strata/.backups/daily-audio"


def main(argv: list[str] | None = None) -> int:
    args = cli().parse_args(argv)
    vault = vault_path(args.vault)
    try:
        if args.command == "discover":
            pending, issues = scan(vault, args.note)
            print(json.dumps({"pending": pending, "issues": issues}, ensure_ascii=False)); return 2 if issues else 0
        if args.command == "vocabulary":
            terms = vocabulary(vault, args.note)
            print(json.dumps({"terms": terms, "prompt": prompt_for(terms)}, ensure_ascii=False)); return 0
        if args.command == "unresolved":
            print(json.dumps({"unresolved": unresolved(vault, args.note)}, ensure_ascii=False)); return 0
        if args.command == "agent-comments":
            print(json.dumps({"comments": agent_comments(vault, args.note)}, ensure_ascii=False)); return 0
        if args.command == "directives":
            print(json.dumps({"directives": directives(Path(args.transcript_file).read_text(encoding="utf-8"))}, ensure_ascii=False)); return 0
        if args.command == "transcribe":
            audio = (vault / args.audio).resolve()
            if excluded(vault, audio) or not audio.is_file() or audio.suffix.lower() not in AUDIO_EXTENSIONS:
                raise TranscriptError("audio must be a vault-relative supported audio file")
            if importlib.util.find_spec("mlx_whisper") is None:
                raise TranscriptError("mlx_whisper is not installed; install it locally with its MLX Whisper dependencies")
            from mlx_whisper import transcribe
            print(json.dumps(transcribe_audio(audio, args.prompt, transcribe), ensure_ascii=False)); return 0
        if args.command == "backup":
            note = (vault / args.note).resolve()
            if excluded(vault, note) or not note.is_file():
                raise TranscriptError("note must be an included vault-relative Markdown file")
            print(json.dumps({"backup": str(backup(note, backup_dir(vault, args.backup_dir)))})); return 0
        if args.command == "migrate":
            location = migrate(vault, args.note, args.audio, backup_dir(vault, args.backup_dir), args.spoken_for_agent)
        elif args.command == "restyle":
            location = restyle(vault, args.note, args.audio, backup_dir(vault, args.backup_dir))
        else:
            transcript = Path(args.transcript_file).read_text(encoding="utf-8")
            location = mutate(vault, args.note, args.audio, transcript, backup_dir(vault, args.backup_dir), args.command == "replace", args.spoken_for_agent)
        print(json.dumps({"backup": str(location), "note": args.note, "audio": args.audio})); return 0
    except (TranscriptError, OSError, UnicodeError) as exc:
        print(json.dumps({"error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
