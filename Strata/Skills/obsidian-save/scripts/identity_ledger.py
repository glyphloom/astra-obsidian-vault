#!/usr/bin/env python3
"""Maintain durable canonical-source to vault-note identities for save deduplication."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
from pathlib import Path
from typing import Any

from save_common import (
    DEFAULT_VAULT,
    SAVE_ROOT,
    atomic_write_json,
    canonical_identity,
    file_lock,
    identity_key,
    sha256_file,
)


DEFAULT_LEDGER = SAVE_ROOT / ".state" / "identity-ledger.json"


def load(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(value, dict) and isinstance(value.get("identities"), dict):
            return value
    except (OSError, UnicodeError, json.JSONDecodeError):
        pass
    return {"version": 1, "identities": {}}


def frontmatter_sources(text: str) -> list[str]:
    if not text.startswith("---\n"):
        return []
    end = text.find("\n---", 4)
    if end < 0:
        return []
    yaml_text = text[4:end]
    sources: list[str] = []
    for key in ("url", "canonical_url", "spotify_uri", "doi", "isbn"):
        match = re.search(rf"(?m)^{key}\s*:\s*(.+?)\s*$", yaml_text)
        if match:
            value = match.group(1).strip().strip("\"'")
            if value:
                sources.append(value if key not in {"doi", "isbn"} else f"{key}:{value}")
    return sources


def source_identities(sources: list[str], metadata: Path | None = None) -> list[dict[str, str]]:
    identities = [canonical_identity(source) for source in sources]
    if metadata:
        payload = json.loads(metadata.read_text(encoding="utf-8"))
        for key in ("identity", "related"):
            item = payload.get(key)
            if isinstance(item, dict) and isinstance(item.get("kind"), str) and isinstance(item.get("id"), str):
                identities.append({
                    "kind": item["kind"],
                    "id": item["id"],
                    "canonical_url": str(item.get("canonical_url") or ""),
                })
    unique: dict[str, dict[str, str]] = {}
    for identity in identities:
        unique[identity_key(identity)] = identity
    return list(unique.values())


def check(ledger: dict[str, Any], identities: list[dict[str, str]]) -> dict[str, Any]:
    matches = []
    for identity in identities:
        key = identity_key(identity)
        if key in ledger["identities"]:
            matches.append({"key": key, "identity": identity, **ledger["identities"][key]})
    return {"duplicate": bool(matches), "matches": matches, "checked": [identity_key(item) for item in identities]}


def rebuild(vault: Path, ledger_path: Path) -> dict[str, Any]:
    identities: dict[str, Any] = {}
    notes = 0
    for path in vault.rglob("*.md"):
        relative = path.relative_to(vault)
        if any(part in {"Artifacts", ".obsidian", ".trash", ".claudian", "Strata"} for part in relative.parts):
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError):
            continue
        sources = frontmatter_sources(text)
        if not sources:
            continue
        notes += 1
        for identity in source_identities(sources):
            key = identity_key(identity)
            identities[key] = {
                "note": relative.as_posix(),
                "canonical_url": identity.get("canonical_url", ""),
                "recorded_at": dt.datetime.now(dt.timezone.utc).isoformat(),
                "origin": "vault-rebuild",
                "note_sha256": sha256_file(path),
            }
    value = {"version": 1, "identities": identities}
    with file_lock(ledger_path):
        atomic_write_json(ledger_path, value)
    return {"status": "rebuilt", "notes": notes, "identities": len(identities), "ledger": str(ledger_path)}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ledger", type=Path, default=DEFAULT_LEDGER)
    subparsers = parser.add_subparsers(dest="command", required=True)

    check_parser = subparsers.add_parser("check")
    check_parser.add_argument("--source", action="append", default=[])
    check_parser.add_argument("--metadata", type=Path)

    record_parser = subparsers.add_parser("record")
    record_parser.add_argument("--source", action="append", default=[])
    record_parser.add_argument("--metadata", type=Path)
    record_parser.add_argument("--note", required=True)
    record_parser.add_argument("--vault", type=Path, default=DEFAULT_VAULT)
    record_parser.add_argument("--receipt", default="")

    rebuild_parser = subparsers.add_parser("rebuild")
    rebuild_parser.add_argument("--vault", type=Path, default=DEFAULT_VAULT)

    args = parser.parse_args()
    if args.command == "rebuild":
        print(json.dumps(rebuild(args.vault.expanduser().resolve(), args.ledger), ensure_ascii=False, indent=2))
        return 0

    identities = source_identities(args.source, args.metadata)
    if not identities:
        print(json.dumps({"error": "no canonical identity was supplied"}), file=sys.stderr)
        return 2
    with file_lock(args.ledger):
        ledger = load(args.ledger)
        if args.command == "check":
            result = check(ledger, identities)
            print(json.dumps(result, ensure_ascii=False, indent=2))
            return 3 if result["duplicate"] else 0

        target = (args.vault.expanduser().resolve() / args.note).resolve()
        if not target.is_file():
            print(json.dumps({"error": f"note does not exist: {target}"}), file=sys.stderr)
            return 2
        recorded = []
        for identity in identities:
            key = identity_key(identity)
            ledger["identities"][key] = {
                "note": target.relative_to(args.vault.expanduser().resolve()).as_posix(),
                "canonical_url": identity.get("canonical_url", ""),
                "recorded_at": dt.datetime.now(dt.timezone.utc).isoformat(),
                "origin": "save",
                "receipt": args.receipt,
                "note_sha256": sha256_file(target),
            }
            recorded.append(key)
        atomic_write_json(args.ledger, ledger)
    print(json.dumps({"status": "recorded", "identities": recorded, "note": args.note}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
