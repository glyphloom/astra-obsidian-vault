#!/usr/bin/env python3
"""Read-only identity, taxonomy, and relevance probe for the save skill."""

from __future__ import annotations

import argparse
import json
import math
import os
import re
from collections import Counter
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path

from save_common import (
    DEFAULT_VAULT,
    SAVE_ROOT,
    canonical_identity,
    budget_guard,
    extract_urls,
    identity_key,
)


PRUNED_DIRS = {".git", ".obsidian", ".trash", ".claudian", "Artifacts"}
CONTENT_PRUNED_PREFIXES = {
    ("Strata",),
    ("Continuum", "Personal"),
    ("Continuum", "Time"),
}
INSTRUCTION_FILENAMES = {"AGENTS.md", "README.md", "SKILL.md"}
WORD_RE = re.compile(r"[^\W_]{3,}", re.UNICODE)
STOP_WORDS = {
    "about", "after", "also", "and", "are", "but", "for", "from", "has", "have",
    "into", "its", "movie", "music", "official", "that", "the", "this", "video",
    "was", "were", "with", "you", "your",
}


@dataclass
class Note:
    path: Path
    relative: str
    text: str
    aliases: list[str]
    tags: list[str]
    body_tokens: list[str]
    title_tokens: list[str]
    alias_tokens: list[str]
    tag_tokens: list[str]


def is_pruned(parts: tuple[str, ...]) -> bool:
    return any(part in PRUNED_DIRS for part in parts)


def is_content_pruned(parts: tuple[str, ...]) -> bool:
    return any(parts[: len(prefix)] == prefix for prefix in CONTENT_PRUNED_PREFIXES)


def markdown_files(vault: Path) -> list[Path]:
    files: list[Path] = []
    for root, dirs, names in os.walk(vault):
        root_path = Path(root)
        relative = root_path.relative_to(vault)
        dirs[:] = [name for name in dirs if not is_pruned(relative.parts + (name,))]
        for name in names:
            if name.endswith(".md"):
                files.append(root_path / name)
    return files


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except (OSError, UnicodeError):
        return ""


def frontmatter(text: str) -> str:
    if not text.startswith("---\n"):
        return ""
    end = text.find("\n---", 4)
    return text[4:end] if end != -1 else ""


def list_property(text: str, property_name: str) -> list[str]:
    yaml_text = frontmatter(text)
    lines = yaml_text.splitlines()
    result: list[str] = []
    active = False
    for line in lines:
        if re.match(rf"^{re.escape(property_name)}\s*:", line):
            active = True
            inline = line.split(":", 1)[1].strip().strip("[]")
            if inline:
                result.extend(part.strip().strip("\"'") for part in inline.split(","))
            continue
        if active and re.match(r"^\s+-\s+", line):
            result.append(re.sub(r"^\s+-\s+", "", line).strip().strip("\"'"))
            continue
        if active and re.match(r"^[A-Za-z][A-Za-z0-9_-]*\s*:", line):
            break
    return [item for item in result if item]


def tokens(value: str) -> list[str]:
    return [token for token in WORD_RE.findall(value.casefold()) if token not in STOP_WORDS]


def build_notes(vault: Path) -> list[Note]:
    notes: list[Note] = []
    for path in markdown_files(vault):
        text = read_text(path)
        if not text:
            continue
        relative = path.relative_to(vault).as_posix()
        aliases = list_property(text, "aliases")
        tags = list_property(text, "tags")
        notes.append(
            Note(
                path=path,
                relative=relative,
                text=text,
                aliases=aliases,
                tags=tags,
                body_tokens=tokens(text),
                title_tokens=tokens(path.stem),
                alias_tokens=tokens(" ".join(aliases)),
                tag_tokens=tokens(" ".join(tags)),
            )
        )
    return notes


def attachment_folder(vault: Path) -> str | None:
    try:
        payload = json.loads((vault / ".obsidian" / "app.json").read_text(encoding="utf-8"))
        value = payload.get("attachmentFolderPath")
        return value if isinstance(value, str) else None
    except (OSError, UnicodeError, json.JSONDecodeError):
        return None


def media_inventory(vault: Path) -> dict[str, int]:
    media = vault / "Continuum" / "Media"
    counts: Counter[str] = Counter()
    if media.is_dir():
        for path in media.rglob("*.md"):
            relative = path.relative_to(media)
            counts[relative.parts[0] if len(relative.parts) > 1 else "."] += 1
    return dict(sorted(counts.items()))


def bm25(query: list[str], document: list[str], document_frequency: Counter[str], count: int, average_length: float) -> float:
    if not document or not query:
        return 0.0
    frequencies = Counter(document)
    score = 0.0
    k1, b = 1.35, 0.72
    for term in query:
        frequency = frequencies.get(term, 0)
        if not frequency:
            continue
        df = document_frequency.get(term, 0)
        inverse = math.log(1 + (count - df + 0.5) / (df + 0.5))
        denominator = frequency + k1 * (1 - b + b * len(document) / max(average_length, 1))
        score += inverse * (frequency * (k1 + 1) / denominator)
    return score


def ledger_matches(ledger_path: Path, source_key: str) -> list[dict[str, object]]:
    if not source_key:
        return []
    try:
        payload = json.loads(ledger_path.read_text(encoding="utf-8"))
        item = payload.get("identities", {}).get(source_key)
        return [{"key": source_key, **item}] if isinstance(item, dict) else []
    except (OSError, UnicodeError, json.JSONDecodeError):
        return []


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--vault", type=Path, default=DEFAULT_VAULT)
    parser.add_argument("--source", default="")
    parser.add_argument("--title", default="")
    parser.add_argument("--keywords", nargs="*", default=[])
    parser.add_argument("--current-note", default="")
    parser.add_argument("--limit", type=int, default=12)
    parser.add_argument("--ledger", type=Path, default=SAVE_ROOT / ".state" / "identity-ledger.json")
    parser.add_argument("--session", type=Path)
    args = parser.parse_args()

    try:
        budget_guard(args.session, 90)
    except (ValueError, TimeoutError) as error:
        parser.error(str(error))

    vault = args.vault.expanduser().resolve()
    if not vault.is_dir():
        parser.error(f"vault does not exist: {vault}")
    notes = build_notes(vault)
    identity = canonical_identity(args.source) if args.source else None
    source_key = identity_key(identity) if identity else ""
    exact_matches: list[str] = []
    title_matches: list[dict[str, object]] = []
    query = sorted(set(tokens(" ".join([args.title, *args.keywords]))))

    for note in notes:
        if identity and any(identity_key(canonical_identity(url)) == source_key for url in extract_urls(note.text)):
            exact_matches.append(note.relative)
        if args.title:
            candidates = [note.path.stem, *note.aliases]
            ratio = max(SequenceMatcher(None, args.title.casefold(), candidate.casefold()).ratio() for candidate in candidates)
            if ratio >= 0.68:
                title_matches.append({"path": note.relative, "similarity": round(ratio, 3)})

    searchable = [
        note for note in notes
        if not is_content_pruned(Path(note.relative).parts)
        and Path(note.relative).name not in INSTRUCTION_FILENAMES
        and note.relative != args.current_note
        and note.relative not in exact_matches
    ]
    df: Counter[str] = Counter()
    for note in searchable:
        df.update(set(note.body_tokens))
    average_length = sum(len(note.body_tokens) for note in searchable) / max(len(searchable), 1)
    connections: list[dict[str, object]] = []
    phrase = args.title.casefold().strip()
    for note in searchable:
        body_score = bm25(query, note.body_tokens, df, len(searchable), average_length)
        title_hits = sum(note.title_tokens.count(term) for term in query)
        alias_hits = sum(note.alias_tokens.count(term) for term in query)
        tag_hits = sum(note.tag_tokens.count(term) for term in query)
        exact_phrase = bool(phrase and phrase in note.text.casefold())
        score = body_score + 3.5 * title_hits + 4.5 * alias_hits + 2.0 * tag_hits + (7.0 if exact_phrase else 0.0)
        if score <= 0:
            continue
        matched = sorted(term for term in query if term in set(note.body_tokens + note.title_tokens + note.alias_tokens + note.tag_tokens))
        if len(query) >= 3 and len(matched) < 2 and not exact_phrase:
            continue
        connections.append(
            {
                "path": note.relative,
                "score": round(score, 3),
                "terms": matched,
                "signals": {
                    "bm25": round(body_score, 3),
                    "title_hits": title_hits,
                    "alias_hits": alias_hits,
                    "tag_hits": tag_hits,
                    "exact_phrase": exact_phrase,
                },
            }
        )

    title_matches.sort(key=lambda item: (-float(item["similarity"]), str(item["path"])))
    connections.sort(key=lambda item: (-float(item["score"]), str(item["path"])))
    result = {
        "vault": str(vault),
        "attachment_folder": attachment_folder(vault),
        "media_inventory": media_inventory(vault),
        "identity": identity,
        "identity_ledger_matches": ledger_matches(args.ledger, source_key),
        "exact_url_or_identity_matches": sorted(exact_matches),
        "title_matches": title_matches[: args.limit],
        "connection_candidates": connections[: args.limit],
        "notes_scanned": len(notes),
        "content_search_exclusions": ["/".join(prefix) for prefix in sorted(CONTENT_PRUNED_PREFIXES)],
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
