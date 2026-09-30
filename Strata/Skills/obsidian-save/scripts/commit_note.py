#!/usr/bin/env python3
"""Transactionally create or update a save note while preserving user material."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import tempfile
import sys
from pathlib import Path

from save_common import DEFAULT_VAULT, budget_guard, file_lock, sha256_file
from validate_note import END_MARKER, LEGACY_END_MARKER, LEGACY_START_MARKER, START_MARKER, WIKI_RE, resolve_note, validate


CYRILLIC_RE = re.compile(r"[\u0400-\u052f]")


def inside(vault: Path, value: str) -> Path:
    candidate = (vault / value.strip("/")).resolve()
    if os.path.commonpath((str(vault.resolve()), str(candidate))) != str(vault.resolve()):
        raise ValueError("target escapes the vault")
    return candidate


def require_non_cyrillic_generated_path(value: str, role: str) -> None:
    if CYRILLIC_RE.search(value):
        raise ValueError(f"{role} contains Cyrillic characters; use a Latin/ASCII generated filename")


def asset_digest_for_destination(vault: Path, destination: str, assets: list[list[str]]) -> str:
    normalized = destination.strip("/")
    for source_value, relative_value in assets:
        if relative_value.strip("/") == normalized:
            return sha256_file(Path(source_value).resolve())
    existing = vault / normalized
    return sha256_file(existing) if existing.is_file() else ""


def reject_reused_banner_source(vault: Path, banner: str, representative: str, assets: list[list[str]]) -> None:
    if not banner or not representative:
        return
    if banner.strip("/") == representative.strip("/"):
        raise ValueError("banner and representative image must use distinct assets")
    banner_digest = asset_digest_for_destination(vault, banner, assets)
    representative_digest = asset_digest_for_destination(vault, representative, assets)
    if banner_digest and representative_digest and banner_digest == representative_digest:
        raise ValueError("banner and representative image use identical bytes; choose distinct imagery")


def split_note(text: str) -> tuple[list[str], str]:
    if not text.startswith("---\n"):
        raise ValueError("note must begin with frontmatter")
    lines = text.splitlines(keepends=True)
    for index in range(1, len(lines)):
        if lines[index].strip() == "---":
            return lines[: index + 1], "".join(lines[index + 1 :])
    raise ValueError("frontmatter closing fence is missing")


def ensure_frontmatter(text: str, url: str, banner: str) -> str:
    frontmatter, body = split_note(text)
    content = "".join(frontmatter)
    insertions: list[str] = []
    if url and not re.search(r"(?m)^url\s*:", content):
        insertions.append(f'url: "{url.replace(chr(34), chr(92) + chr(34))}"\n')
    if banner:
        css_match = re.search(r"(?m)^cssclasses[ \t]*:[ \t]*(.*)$", content)
        if not css_match:
            insertions.extend(["cssclasses:\n", "  - banner\n", "  - banner-fade\n"])
        elif css_match.group(1).strip().startswith("["):
            raw = css_match.group(1).strip().strip("[]")
            values = [part.strip().strip("\"'") for part in raw.split(",") if part.strip()]
            for needed in ("banner", "banner-fade"):
                if needed not in values:
                    values.append(needed)
            replacement = "cssclasses: [" + ", ".join(values) + "]"
            content = content[: css_match.start()] + replacement + content[css_match.end() :]
        else:
            lines = content.splitlines(keepends=True)
            start = next(index for index, line in enumerate(lines) if re.match(r"^cssclasses\s*:", line))
            end = start + 1
            while end < len(lines) and (lines[end].startswith((" ", "\t")) or not lines[end].strip()):
                end += 1
            block = "".join(lines[start:end])
            missing = [needed for needed in ("banner", "banner-fade") if not re.search(rf"(?m)^\s*-\s*{re.escape(needed)}\s*$", block)]
            if missing:
                lines[end:end] = [f"  - {needed}\n" for needed in missing]
                content = "".join(lines)
    if insertions:
        closing = content.rfind("---")
        content = content[:closing] + "".join(insertions) + content[closing:]
    return content + body


def ensure_banner(text: str, banner: str, replace: bool) -> str:
    if not banner:
        return text
    frontmatter, body = split_note(text)
    desired = f"![[{Path(banner).name}|banner]]"
    lines = body.splitlines()
    first = next((index for index, line in enumerate(lines) if line.strip()), None)
    banner_embed = r"!\[\[[^\]|#]+\|banner(?::\s*[^\]\n]+)?\]\]"
    if first is not None and re.fullmatch(banner_embed, lines[first].strip()):
        if replace or lines[first].strip() != desired:
            lines[first] = desired
    else:
        lines = ["", desired, "", *lines]
    return "".join(frontmatter) + "\n".join(lines).rstrip() + "\n"


def ensure_owner(text: str, user_content: str, user_section: str = "") -> str:
    if not user_content:
        return text
    sections = [match for match in re.finditer(r"(?m)^## [^\n]+[ \t]*$", text) if match.group().strip() not in {"## Codex Notes", "## Agent Notes"}]
    section = next((match for match in sections if match.group().removeprefix("## ").strip() == user_section), None) if user_section else next(iter(sections), None)
    if user_section and section is None:
        raise ValueError(f"user section not found: {user_section}")
    if not section:
        codex = re.search(r"(?m)^## (?:Codex|Agent) Notes[ \t]*$", text)
        insertion = f"{user_content.rstrip()}\n\n"
        return text[: codex.start()] + insertion + text[codex.start() :] if codex else text.rstrip() + "\n\n" + insertion
    next_h2 = re.search(r"(?m)^##\s+", text[section.end() :])
    end = len(text) if next_h2 is None else section.end() + next_h2.start()
    body = text[section.end() : end]
    owned_end = re.search(r"(?m)^## (?:Codex|Agent) Notes[ \t]*$", text)
    if user_content.strip() in text[section.end() : owned_end.start() if owned_end else len(text)]:
        return text
    placeholder = re.search(r"(?m)^> Placeholder[ \t]*$", body)
    if placeholder:
        absolute_start = section.end() + placeholder.start()
        absolute_end = section.end() + placeholder.end()
        return text[:absolute_start] + user_content.rstrip() + text[absolute_end:]
    updated = body.rstrip() + "\n\n" + user_content.rstrip() + "\n\n"
    return text[: section.end()] + updated + text[end:].lstrip("\n")


def strip_owner_heading(text: str) -> str:
    """Remove the legacy save-owned heading without altering its contents."""
    return re.sub(r"(?m)^## Owner Notes\s*\n\s*", "", text, count=1)


def rename_legacy_agent_heading(text: str) -> str:
    if START_MARKER not in text:
        return text
    prefix = text[: text.index(START_MARKER)]
    headings = list(re.finditer(r"(?m)^## ([^\n]+)[ \t]*$", prefix))
    if not headings or headings[-1].group(1).strip() != "Codex Notes":
        return text
    heading = headings[-1]
    return text[: heading.start()] + "## Agent Notes" + text[heading.end() :]


def migrate_legacy_save_markers(text: str) -> str:
    if text.count(LEGACY_START_MARKER) == text.count(LEGACY_END_MARKER) == 1 and START_MARKER not in text and END_MARKER not in text:
        return text.replace(LEGACY_START_MARKER, START_MARKER).replace(LEGACY_END_MARKER, END_MARKER)
    return text


def replace_agent(text: str, agent_content: str | None, repair_boundary: bool = False) -> str:
    if agent_content is None:
        return text
    inner = agent_content.strip()
    for start_marker, end_marker in ((START_MARKER, END_MARKER), (LEGACY_START_MARKER, LEGACY_END_MARKER)):
        if start_marker in inner and end_marker in inner:
            inner = inner.split(start_marker, 1)[1].split(end_marker, 1)[0].strip()
    starts, ends = text.count(START_MARKER), text.count(END_MARKER)
    block = f"{START_MARKER}\n\n{inner}\n{END_MARKER}"
    if starts == 1 and ends == 1:
        start = text.index(START_MARKER)
        end = text.index(END_MARKER, start) + len(END_MARKER)
        return text[:start] + block + text[end:]
    repair_end = END_MARKER if ends == 1 else LEGACY_END_MARKER if text.count(LEGACY_END_MARKER) == 1 else None
    if repair_boundary and starts == 0 and repair_end:
        heading = re.search(r"(?m)^## (?:Codex|Agent) Notes[ \t]*$", text)
        end = text.index(repair_end)
        if not heading or heading.end() > end:
            raise ValueError("cannot safely repair the agent-save marker boundary")
        if text[end + len(repair_end) :].strip():
            raise ValueError("cannot repair an agent-save boundary with trailing note content")
        return text[: heading.end()].rstrip() + "\n\n" + block + "\n"
    if starts or ends or LEGACY_START_MARKER in text or LEGACY_END_MARKER in text:
        raise ValueError("existing note has a malformed agent-save marker boundary")
    if re.search(r"(?m)^## (?:Codex|Agent) Notes[ \t]*$", text):
        raise ValueError("existing Agent Notes section has no safe marker boundary")
    return text.rstrip() + f"\n\n## Agent Notes\n\n{block}\n"


def ensure_representative(text: str, representative: str, representative_alt: str) -> str:
    if not representative:
        return text
    filename = Path(representative).name
    description = representative_alt.strip()
    if not description:
        raise ValueError("--representative-alt is required when --representative is supplied")
    if any(character in description for character in ("\n", "\r", "|", "[", "]")):
        raise ValueError("representative alt text contains unsupported Markdown delimiter characters")
    desired_embed = f"![[{filename}|{description}]]"
    frontmatter, body = split_note(text)
    first_heading = re.search(r"(?m)^##\s+.+?[ \t]*$", body)
    if not first_heading:
        raise ValueError("cannot place representative image without a visible H2")
    prefix = body[: first_heading.start()]
    remainder = body[first_heading.start() :]
    framed = re.compile(
        r"(?m)^>[ \t]*\[!media-frame\][ \t]*\n(?:>[ \t]*\n)?>[ \t]*!\[\[[^\]]+\]\][ \t]*\n?"
    )
    raw = re.compile(r"(?m)^!\[\[[^\]]+\]\][ \t]*\n?")
    prefix = framed.sub("", prefix)
    prefix = raw.sub(lambda match: match.group(0) if "|banner" in match.group(0) else "", prefix)
    block = f"> [!media-frame]\n> {desired_embed}"
    before = prefix.rstrip()
    after = remainder.lstrip("\n")
    return "".join(frontmatter) + before + "\n\n" + block + "\n\n" + after


def validate_new_links(vault: Path, text: str, allowed: set[str]) -> None:
    unresolved = []
    for target in WIKI_RE.findall(text):
        if target.casefold() not in allowed and not resolve_note(vault, target):
            unresolved.append(target)
    if unresolved:
        raise ValueError("new unresolved wiki-links were not declared intentional: " + ", ".join(sorted(set(unresolved))))


def materialize_assets(vault: Path, assets: list[list[str]], note_text: str) -> tuple[str, list[tuple[Path, Path]], list[str]]:
    staged: list[tuple[Path, Path]] = []
    virtual: list[str] = []
    content = note_text
    for source_value, relative_value in assets:
        source = Path(source_value).resolve()
        if not source.is_file():
            raise ValueError(f"asset source does not exist: {source}")
        destination = inside(vault, relative_value)
        final_destination = destination
        digest = sha256_file(source)
        if destination.exists():
            if sha256_file(destination) == digest:
                virtual.append(destination.relative_to(vault).as_posix())
                continue
            final_destination = destination.with_name(f"{destination.stem}-{digest[:8]}{destination.suffix}")
            if final_destination.exists() and sha256_file(final_destination) != digest:
                raise ValueError(f"collision-safe asset destination also conflicts: {final_destination}")
            old_relative = destination.relative_to(vault).as_posix()
            new_relative = final_destination.relative_to(vault).as_posix()
            content = content.replace(old_relative, new_relative).replace(destination.name, final_destination.name)
        virtual.append(final_destination.relative_to(vault).as_posix())
        if not final_destination.exists():
            final_destination.parent.mkdir(parents=True, exist_ok=True)
            descriptor, temporary_name = tempfile.mkstemp(prefix=f".{final_destination.name}.", dir=final_destination.parent)
            os.close(descriptor)
            temporary = Path(temporary_name)
            temporary.write_bytes(source.read_bytes())
            staged.append((temporary, final_destination))
    return content, staged, virtual


def validation_namespace(
    note: Path,
    vault: Path,
    canonical_url: str,
    virtual: list[str],
    allowed: list[str],
    target: Path,
    strict_links: bool,
) -> argparse.Namespace:
    return argparse.Namespace(
        note=note,
        vault=vault,
        standalone=True,
        require_banner=True,
        require_agent=True,
        min_agent_words=0,
        min_agent_sections=0,
        canonical_url=canonical_url,
        no_duplicate=bool(canonical_url),
        strict_links=strict_links,
        allow_unresolved=allowed,
        virtual_embed=virtual,
        ignore_note=[target],
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=("create", "update"))
    parser.add_argument("--vault", type=Path, default=DEFAULT_VAULT)
    parser.add_argument("--target", required=True, help="Vault-relative Markdown path")
    parser.add_argument("--draft", type=Path)
    parser.add_argument("--agent-content", "--codex-content", dest="agent_content", type=Path)
    parser.add_argument("--user-content", type=Path)
    parser.add_argument("--canonical-url", default="")
    parser.add_argument("--banner", default="", help="Vault-relative banner destination")
    parser.add_argument("--replace-banner", action="store_true")
    parser.add_argument("--representative", default="", help="Vault-relative representative image")
    parser.add_argument("--representative-alt", default="", help="Factual alt text displayed as the representative image caption")
    parser.add_argument("--asset", nargs=2, action="append", default=[], metavar=("SOURCE", "VAULT_RELATIVE"))
    parser.add_argument("--expected-sha256", default="")
    parser.add_argument("--strip-owner-heading", action="store_true")
    parser.add_argument("--user-section", default="", help="Existing H2 to receive --user-content; default is the first user H2")
    parser.add_argument("--repair-agent-boundary", "--repair-codex-boundary", dest="repair_agent_boundary", action="store_true")
    parser.add_argument("--allow-unresolved", action="append", default=[])
    parser.add_argument("--session", type=Path)
    args = parser.parse_args()

    vault = args.vault.expanduser().resolve()
    target = inside(vault, args.target)
    if target.suffix.casefold() != ".md":
        raise SystemExit("target must be a Markdown file")
    if args.mode == "create":
        require_non_cyrillic_generated_path(args.target, "new note target")
    for _, relative_value in args.asset:
        require_non_cyrillic_generated_path(relative_value, "generated asset path")
    reject_reused_banner_source(vault, args.banner, args.representative, args.asset)
    lock_target = target.with_suffix(target.suffix + ".save")
    moved_assets: list[Path] = []
    temporary_note: Path | None = None
    try:
        budget_guard(args.session, 20)
        with file_lock(lock_target):
            exists = target.exists()
            if args.mode == "create" and exists:
                raise ValueError("create target already exists")
            if args.mode == "update" and not exists:
                raise ValueError("update target does not exist")
            if args.expected_sha256 and sha256_file(target) != args.expected_sha256:
                raise ValueError("target changed after it was inspected; refusing to overwrite concurrent edits")

            if args.mode == "create":
                if not args.draft:
                    raise ValueError("create mode requires --draft")
                content = args.draft.read_text(encoding="utf-8")
                content = ensure_frontmatter(content, args.canonical_url, args.banner)
                content = ensure_banner(content, args.banner, args.replace_banner)
                content = ensure_representative(content, args.representative, args.representative_alt)
            else:
                content = target.read_text(encoding="utf-8")
                agent = args.agent_content.read_text(encoding="utf-8") if args.agent_content else None
                user = args.user_content.read_text(encoding="utf-8").strip() if args.user_content else ""
                if agent is not None:
                    validate_new_links(vault, agent, {item.casefold() for item in args.allow_unresolved})
                content = ensure_frontmatter(content, args.canonical_url, args.banner)
                content = ensure_banner(content, args.banner, args.replace_banner)
                content = ensure_representative(content, args.representative, args.representative_alt)
                content = ensure_owner(content, user, args.user_section)
                if args.strip_owner_heading:
                    content = strip_owner_heading(content)
                content = replace_agent(migrate_legacy_save_markers(content), agent, args.repair_agent_boundary)

            content = rename_legacy_agent_heading(migrate_legacy_save_markers(content))
            content, staged_assets, virtual = materialize_assets(vault, args.asset, content)
            target.parent.mkdir(parents=True, exist_ok=True)
            descriptor, temporary_name = tempfile.mkstemp(prefix=f".{target.name}.", suffix=".draft", dir=target.parent)
            os.close(descriptor)
            temporary_note = Path(temporary_name)
            temporary_note.write_text(content.rstrip() + "\n", encoding="utf-8")
            validation = validate(validation_namespace(temporary_note, vault, args.canonical_url, virtual, args.allow_unresolved, target, args.mode == "create"))
            if not validation["valid"]:
                raise ValueError("note validation failed: " + "; ".join(validation["errors"]))
            for temporary, destination in staged_assets:
                temporary.replace(destination)
                moved_assets.append(destination)
            temporary_note.replace(target)
            temporary_note = None
            result = {
                "status": "created" if args.mode == "create" else "updated",
                "path": target.relative_to(vault).as_posix(),
                "sha256": sha256_file(target),
                "assets": [path.relative_to(vault).as_posix() for path in moved_assets],
                "validation": validation,
            }
            print(json.dumps(result, ensure_ascii=False, indent=2))
            return 0
    except (OSError, UnicodeError, ValueError, TimeoutError) as error:
        for path in moved_assets:
            path.unlink(missing_ok=True)
        if temporary_note:
            temporary_note.unlink(missing_ok=True)
        print(json.dumps({"status": "failed", "error": str(error)}, ensure_ascii=False), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
