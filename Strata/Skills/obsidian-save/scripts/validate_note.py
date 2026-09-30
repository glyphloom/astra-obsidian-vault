#!/usr/bin/env python3
"""Deterministically validate a save note before or after commit."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

from save_common import DEFAULT_VAULT, budget_guard, canonical_identity, extract_urls, identity_key


EMBED_RE = re.compile(r"!\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]")
WIKI_RE = re.compile(r"(?<!!)\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]")
WIKI_DETAIL_RE = re.compile(r"(?<!!)\[\[([^\]|#]+)(?:#[^|\]]*)?(?:\|([^\]]+))?\]\]")
BANNER_RE = re.compile(r"!\[\[([^\]|#]+)\|banner\]\]")
MEDIA_FRAME_RE = re.compile(
    r"(?m)^>[ \t]*\[!media-frame\][ \t]*\n(?:>[ \t]*\n)?>[ \t]*!\[\[([^\]|#]+)(?:\|([^\]]+))?\]\][ \t]*$"
)
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
START_MARKER = "<!-- agent-save:start -->"
END_MARKER = "<!-- agent-save:end -->"
LEGACY_START_MARKER = "<!-- codex-save:start -->"
LEGACY_END_MARKER = "<!-- codex-save:end -->"
WORD_RE = re.compile(r"[\w][\w'’.-]*", re.UNICODE)


def split_frontmatter(text: str) -> tuple[str, str, int]:
    if not text.startswith("---\n"):
        raise ValueError("note does not begin with YAML frontmatter")
    lines = text.splitlines(keepends=True)
    for index in range(1, len(lines)):
        if lines[index].strip() == "---":
            yaml_text = "".join(lines[: index + 1])
            body = "".join(lines[index + 1 :])
            return yaml_text, body, index + 1
    raise ValueError("frontmatter closing fence is missing")


def frontmatter_url(yaml_text: str) -> str:
    match = re.search(r"(?m)^url\s*:\s*(.+?)\s*$", yaml_text)
    return match.group(1).strip().strip("\"'") if match else ""


def frontmatter_cssclasses(yaml_text: str) -> set[str]:
    match = re.search(r"(?m)^cssclasses[ \t]*:[ \t]*(.*)$", yaml_text)
    if not match:
        return set()
    value = match.group(1).strip()
    if value.startswith("[") and value.endswith("]"):
        return {
            item.strip().strip("\"'")
            for item in value[1:-1].split(",")
            if item.strip()
        }
    if value:
        return {value.strip("\"'")}
    tail = yaml_text[match.end() :]
    values: set[str] = set()
    for line in tail.splitlines():
        if not line.strip():
            continue
        item = re.fullmatch(r"\s+-\s*(.+?)\s*", line)
        if not item:
            break
        values.add(item.group(1).strip().strip("\"'"))
    return values


def yaml_error(yaml_text: str) -> str | None:
    result = subprocess.run(
        ["/usr/bin/ruby", "-e", 'require "yaml"; YAML.parse(STDIN.read)'],
        input=yaml_text,
        text=True,
        capture_output=True,
        timeout=5,
    )
    return None if result.returncode == 0 else (result.stderr.strip() or "Ruby YAML parser rejected frontmatter")


def markdown_headings(body: str) -> list[tuple[int, int, str]]:
    headings: list[tuple[int, int, str]] = []
    fence = ""
    in_comment = False
    for number, line in enumerate(body.splitlines(), start=1):
        stripped = line.lstrip()
        if in_comment:
            if "-->" in stripped:
                in_comment = False
            continue
        if stripped.startswith("<!--") and "-->" not in stripped:
            in_comment = True
            continue
        if stripped.startswith(("```", "~~~")):
            marker = stripped[:3]
            if not fence:
                fence = marker
            elif fence == marker:
                fence = ""
            continue
        if fence:
            continue
        match = HEADING_RE.match(line)
        if match:
            headings.append((number, len(match.group(1)), match.group(2)))
    return headings


def resolve_asset(vault: Path, target: str, virtual: set[str]) -> list[str]:
    normalized = target.strip("/")
    if normalized in virtual:
        return [normalized]
    direct = vault / normalized
    if direct.is_file():
        return [normalized]
    name = Path(normalized).name
    matches = [path.relative_to(vault).as_posix() for path in vault.rglob(name) if path.is_file()]
    matches.extend(item for item in virtual if Path(item).name == name)
    return sorted(set(matches))


def resolve_note(vault: Path, target: str) -> list[str]:
    normalized = target.strip("/")
    direct = vault / (normalized if normalized.endswith(".md") else normalized + ".md")
    if direct.is_file():
        return [direct.relative_to(vault).as_posix()]
    stem = Path(normalized).name.removesuffix(".md")
    return sorted(
        path.relative_to(vault).as_posix()
        for path in vault.rglob("*.md")
        if path.stem.casefold() == stem.casefold()
    )


def duplicate_identity_notes(vault: Path, canonical_url: str, ignored: list[Path]) -> list[str]:
    wanted = identity_key(canonical_identity(canonical_url))
    matches: list[str] = []
    for path in vault.rglob("*.md"):
        relative = path.relative_to(vault)
        if any(part in {"Artifacts", ".obsidian", ".trash", ".claudian"} for part in relative.parts):
            continue
        try:
            content = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError):
            continue
        try:
            yaml_text, _, _ = split_frontmatter(content)
        except ValueError:
            yaml_text = ""
        primary = frontmatter_url(yaml_text)
        if primary and identity_key(canonical_identity(primary)) == wanted:
            if all(path.resolve() != item.resolve() for item in ignored):
                matches.append(relative.as_posix())
    return sorted(matches)


def validate(args: argparse.Namespace) -> dict[str, object]:
    errors: list[str] = []
    warnings: list[str] = []
    text = args.note.read_text(encoding="utf-8")
    try:
        yaml_text, body, frontmatter_lines = split_frontmatter(text)
        problem = yaml_error(yaml_text)
        if problem:
            errors.append(f"invalid YAML: {problem}")
    except ValueError as error:
        errors.append(str(error))
        yaml_text, body, frontmatter_lines = "", text, 0

    headings = markdown_headings(body)
    if args.standalone:
        h1 = [(line, title) for line, level, title in headings if level == 1]
        if h1:
            errors.append("H1 headings are forbidden: " + ", ".join(f"body line {line} ({title})" for line, title in h1))
        if not headings or headings[0][1] != 2:
            errors.append("the first visible heading must be H2")
        previous_level = 0
        for line, level, title in headings:
            if previous_level and level > previous_level + 1:
                errors.append(f"heading ladder skips H{previous_level} to H{level} at body line {line} ({title})")
            previous_level = level

    agent_body = ""
    if getattr(args, "require_agent", getattr(args, "require_codex", False)):
        pairs = ((START_MARKER, END_MARKER), (LEGACY_START_MARKER, LEGACY_END_MARKER))
        start_count = sum(text.count(start) for start, _ in pairs)
        end_count = sum(text.count(end) for _, end in pairs)
        active_pair = next(((start, end) for start, end in pairs if text.count(start) == text.count(end) == 1), None)
        if start_count != 1 or end_count != 1 or active_pair is None:
            errors.append(f"expected exactly one matching agent-save marker pair; found start={start_count}, end={end_count}")
        else:
            start_marker, end_marker = active_pair
            start_at, end_at = text.index(start_marker), text.index(end_marker)
            if start_at > end_at:
                errors.append("agent-save markers are reversed")
            else:
                agent_body = text[start_at + len(start_marker) : end_at]
            prefix = text[:start_at]
            owner_headings = list(re.finditer(r"(?m)^## ([^\n]+)[ \t]*$", prefix))
            if not owner_headings or owner_headings[-1].group(1).strip() not in {"Agent Notes", "Codex Notes"}:
                errors.append("save marker block is not under an H2 Agent Notes section (legacy Codex Notes is accepted)")
            if text[end_at + len(end_marker) :].strip():
                errors.append("agent block is not the final note content")

    min_agent_words = getattr(args, "min_agent_words", getattr(args, "min_codex_words", 0))
    min_agent_sections = getattr(args, "min_agent_sections", getattr(args, "min_codex_sections", 0))
    if min_agent_words:
        if not agent_body:
            errors.append("cannot measure agent word depth without a valid agent-save marker block")
        else:
            agent_words = len(WORD_RE.findall(re.sub(r"!?(?:\[[^\]]*\])?\([^)]*\)", "", agent_body)))
            if agent_words < min_agent_words:
                errors.append(
                    f"agent-owned account is too thin: {agent_words} words, need at least {min_agent_words}"
                )
    if min_agent_sections:
        if not agent_body:
            errors.append("cannot measure agent section depth without a valid agent-save marker block")
        else:
            agent_sections = sum(1 for _, level, _ in markdown_headings(agent_body) if level == 3)
            if agent_sections < min_agent_sections:
                errors.append(
                    f"agent-owned account has too few H3 sections: {agent_sections}, need at least {min_agent_sections}"
                )

    virtual = {item.strip("/") for item in args.virtual_embed}
    embeds = EMBED_RE.findall(body)
    if args.require_banner:
        missing_classes = {"banner", "banner-fade"} - frontmatter_cssclasses(yaml_text)
        if missing_classes:
            errors.append("banner frontmatter is missing cssclasses: " + ", ".join(sorted(missing_classes)))
        first = next((line.strip() for line in body.splitlines() if line.strip()), "")
        match = BANNER_RE.fullmatch(first)
        if not match:
            errors.append("the first body element is not a |banner embed")
        elif not resolve_asset(args.vault, match.group(1), virtual):
            errors.append(f"banner embed does not resolve: {match.group(1)}")
    frame_count = len(re.findall(r"(?m)^>[ \t]*\[!media-frame\][ \t]*$", body))
    framed_images = list(MEDIA_FRAME_RE.finditer(body))
    if frame_count != len(framed_images):
        errors.append("each media-frame callout must contain exactly one image embed on the next quoted line")
    first_heading_line = headings[0][0] if headings else None
    for frame in framed_images:
        caption = (frame.group(2) or "").strip()
        if not caption or re.fullmatch(r"\d+(?:x\d+)?", caption):
            errors.append(f"media-frame image is missing factual alt text and a visible caption: {frame.group(1)}")
        frame_line = body.count("\n", 0, frame.start()) + 1
        if first_heading_line is not None and frame_line > first_heading_line:
            errors.append(f"representative media-frame must appear before the first heading: {frame.group(1)}")
    if args.require_banner and (banner_match := BANNER_RE.fullmatch(next((line.strip() for line in body.splitlines() if line.strip()), ""))):
        banner_asset = set(resolve_asset(args.vault, banner_match.group(1), virtual))
        for frame in framed_images:
            if banner_asset.intersection(resolve_asset(args.vault, frame.group(1), virtual)):
                errors.append("banner and representative image must use distinct assets")
    for embed in embeds:
        matches = resolve_asset(args.vault, embed, virtual)
        if not matches:
            errors.append(f"embed does not resolve: {embed}")
        elif len(matches) > 1 and "/" not in embed:
            warnings.append(f"embed is ambiguous by basename: {embed} -> {matches}")

    if args.canonical_url:
        wanted = identity_key(canonical_identity(args.canonical_url))
        primary = frontmatter_url(yaml_text)
        if not primary or identity_key(canonical_identity(primary)) != wanted:
            errors.append("canonical source identity is absent from the frontmatter url")
        if args.no_duplicate:
            ignored = [args.note, *args.ignore_note]
            duplicates = duplicate_identity_notes(args.vault, args.canonical_url, ignored)
            if duplicates:
                errors.append("canonical source identity also occurs in: " + ", ".join(duplicates))

    allowed = {item.casefold() for item in args.allow_unresolved}
    for match in WIKI_DETAIL_RE.finditer(agent_body):
        target = match.group(1).strip("/")
        alias = (match.group(2) or "").strip()
        if "/" in target and not alias:
            errors.append(
                "path-qualified wiki-link in agent-owned content must use a concise display alias: "
                + match.group(0)
            )
    for target in WIKI_RE.findall(body):
        if target.casefold() in allowed:
            continue
        matches = resolve_note(args.vault, target)
        if not matches:
            message = f"wiki-link is unresolved and was not declared intentional: {target}"
            (errors if args.strict_links else warnings).append(message)
        elif len(matches) > 1 and "/" not in target:
            warnings.append(f"wiki-link is ambiguous by basename: {target} -> {matches}")

    return {
        "valid": not errors,
        "note": str(args.note),
        "frontmatter_lines": frontmatter_lines,
        "headings": len(headings),
        "embeds": len(embeds),
        "media_frames": len(framed_images),
        "agent_words": len(WORD_RE.findall(agent_body)) if agent_body else 0,
        "agent_sections": sum(1 for _, level, _ in markdown_headings(agent_body) if level == 3),
        "errors": errors,
        "warnings": warnings,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--note", required=True, type=Path)
    parser.add_argument("--vault", type=Path, default=DEFAULT_VAULT)
    parser.add_argument("--standalone", action="store_true")
    parser.add_argument("--require-banner", action="store_true")
    parser.add_argument("--require-agent", "--require-codex", dest="require_agent", action="store_true")
    parser.add_argument("--min-agent-words", "--min-codex-words", dest="min_agent_words", type=int, default=0)
    parser.add_argument("--min-agent-sections", "--min-codex-sections", dest="min_agent_sections", type=int, default=0)
    parser.add_argument("--canonical-url", default="")
    parser.add_argument("--no-duplicate", action="store_true")
    parser.add_argument("--strict-links", action="store_true")
    parser.add_argument("--allow-unresolved", action="append", default=[])
    parser.add_argument("--virtual-embed", action="append", default=[])
    parser.add_argument("--ignore-note", action="append", type=Path, default=[])
    parser.add_argument("--session", type=Path)
    args = parser.parse_args()
    try:
        budget_guard(args.session, 8)
        result = validate(args)
    except (OSError, UnicodeError, ValueError, TimeoutError, subprocess.TimeoutExpired) as error:
        result = {"valid": False, "note": str(args.note), "errors": [str(error)], "warnings": []}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["valid"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
