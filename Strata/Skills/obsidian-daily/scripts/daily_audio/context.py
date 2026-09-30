"""Vocabulary and unresolved-review discovery for daily notes."""
from __future__ import annotations

from collections.abc import Iterable
from pathlib import Path
import re

from .paths import DAILY_NOTES, WIKILINK, TranscriptError, excluded, notes, relative

VOCABULARY_CONFIG = Path(__file__).parents[2] / "references" / "vocabulary.txt"
UNRESOLVED_TAG = "#agent/unresolved"
# User-owned Agent Review tags; #user/inbox is the legacy form of #user/request.
# The pre-2026-09-27 #agent/ prefix for these kinds is still read as legacy input.
USER_TAG_KINDS = ("inbox", "request", "clarification")
PROCESSED_INSTRUCTIONS_HEADING = re.compile(r"^##\s+Processed Agent Instructions\s*$", re.I)


def active_daily_lines(note: Path) -> list[str]:
    """Return daily-note lines before its final processed-instruction history."""
    lines = note.read_text(encoding="utf-8").splitlines()
    starts = [index for index, line in enumerate(lines) if PROCESSED_INSTRUCTIONS_HEADING.match(line)]
    return lines[:starts[-1]] if starts else lines


def normalized_term(value: str) -> str:
    return " ".join(value.split()).strip("\"'")


def aliases_for(note: Path) -> list[str]:
    """Return only aliases declared in a note's frontmatter."""
    lines = note.read_text(encoding="utf-8").splitlines()
    if lines[:1] != ["---"]:
        return []
    try:
        end = lines.index("---", 1)
    except ValueError:
        return []
    header = lines[1:end]
    aliases: list[str] = []
    for index, line in enumerate(header):
        match = re.match(r"aliases:\s*(.*)$", line, re.I)
        if not match:
            continue
        value = match.group(1).strip()
        if value.startswith("[") and value.endswith("]"):
            aliases.extend(part.strip().strip("\"'") for part in value[1:-1].split(","))
        elif value:
            aliases.append(value.strip("\"'"))
        else:
            for child in header[index + 1:]:
                child_match = re.match(r"\s+-\s+(.+)$", child)
                if not child_match:
                    break
                aliases.append(child_match.group(1).strip().strip("\"'"))
    return aliases


def wiki_terms(note: Path) -> tuple[list[str], list[str]]:
    terms: list[str] = []
    folders: list[str] = []
    for match in WIKILINK.finditer(note.read_text(encoding="utf-8")):
        target, _, display = match.group("content").partition("|")
        target = target.partition("#")[0].strip()
        if target:
            terms.append(Path(target).stem)
            folders.extend(Path(target).parent.parts if "/" in target else ())
        if display.strip():
            terms.append(display.strip())
    return terms, folders


def folder_terms(vault: Path, note: Path) -> list[str]:
    """Return the owning note's vault-relative folders in order."""
    return relative(vault, note).split("/")[:-1]


def configured_terms() -> list[str]:
    path = VOCABULARY_CONFIG
    if not path.is_file():
        return []
    return [line.strip() for line in path.read_text(encoding="utf-8").splitlines()
            if line.strip() and not line.lstrip().startswith("#")]


def ordered_terms(groups: Iterable[Iterable[str]]) -> list[str]:
    terms: dict[str, str] = {}
    for group in groups:
        for candidate in group:
            term = normalized_term(candidate)
            if term and term.casefold() not in terms:
                terms[term.casefold()] = term
    return list(terms.values())


def vocabulary(vault: Path, one_note: str | None = None) -> list[str]:
    included = [note for note in notes(vault) if not relative(vault, note).startswith("Strata/")]
    global_terms = ([note.stem, *aliases_for(note)] for note in included)
    if one_note is None:
        return ordered_terms([configured_terms(), *global_terms])
    note = notes(vault, one_note)[0]
    local_wiki, linked_folders = wiki_terms(note)
    local_terms = [note.stem, *aliases_for(note), *local_wiki]
    folders = [*folder_terms(vault, note), *linked_folders]
    return ordered_terms([configured_terms(), local_terms, folders, *global_terms])


def prompt_for(terms: Iterable[str], limit: int = 2000) -> str:
    selected: list[str] = []
    size = 0
    for term in terms:
        addition = len(term) + (2 if selected else 0)
        if size + addition > limit:
            break
        selected.append(term)
        size += addition
    return ", ".join(selected)


def daily_notes(vault: Path, one_note: str | None = None) -> list[Path]:
    if one_note:
        note = notes(vault, one_note)[0]
        if not Path(relative(vault, note)).is_relative_to(DAILY_NOTES):
            raise TranscriptError("manual note must be an included daily note")
        return [note]
    root = vault / DAILY_NOTES
    if not root.is_dir():
        return []
    return sorted(path for path in root.rglob("*.md") if not excluded(vault, path))


def unresolved(vault: Path, one_note: str | None = None) -> list[dict[str, int | str]]:
    """Return tagged review bullets, including their indented clarification space."""
    found: list[dict[str, int | str]] = []
    tag = re.compile(rf"(?:^|\s){re.escape(UNRESOLVED_TAG)}(?![\w/-])", re.I)
    bullet = re.compile(r"^[ \t]*[-*+]\s+")
    clarification = re.compile(r"^[ \t]+(?:[-*+]\s+)?Your clarification:\s*(.*)$", re.I)
    for note in daily_notes(vault, one_note):
        lines = active_daily_lines(note)
        for index, line in enumerate(lines):
            if not bullet.match(line) or not tag.search(line):
                continue
            item: dict[str, int | str] = {"note": relative(vault, note), "line": index + 1, "text": line.strip()}
            end = index + 1
            details: list[str] = []
            answer = None
            while end < len(lines) and (not lines[end].strip() or lines[end].startswith((" ", "\t"))):
                detail = lines[end].strip()
                match = clarification.match(lines[end])
                if match:
                    answer = match.group(1)
                if detail:
                    details.append(detail)
                end += 1
            if details or answer is not None:
                item["context"] = "\n".join(details)
                item["clarification"] = answer if answer is not None else ""
            found.append(item)
    return found


def agent_comments(vault: Path, one_note: str | None = None) -> list[dict[str, int | str]]:
    """Return user requests and clarifications from the final Agent Review section only.

    Top-level and nested bullets count, so a clarification or request may be attached
    beneath an agent message; `kind` names the tag without its prefix.
    """
    found: list[dict[str, int | str]] = []
    heading = re.compile(r"^##\s+Agent Review\s*$", re.I)
    next_section = re.compile(r"^#{1,2}\s+")
    kinds = "|".join(USER_TAG_KINDS)
    comment = re.compile(rf"^\s*-\s+#(?:user|agent)/({kinds})(?![\w/-])", re.I)
    for note in daily_notes(vault, one_note):
        lines = active_daily_lines(note)
        starts = [index for index, line in enumerate(lines) if heading.match(line)]
        if not starts:
            continue
        start = starts[-1] + 1
        end = next((index for index in range(start, len(lines)) if next_section.match(lines[index])), len(lines))
        for index in range(start, end):
            match = comment.match(lines[index])
            if match:
                found.append({
                    "note": relative(vault, note), "line": index + 1, "text": lines[index],
                    "kind": match.group(1).lower(),
                })
    return found
