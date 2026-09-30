#!/usr/bin/env python3
"""Validate an explicit-completeness save inventory before its receipt is written."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from save_common import DEFAULT_VAULT


ALLOWED = {"atomic-note", "incidental-credit", "out-of-scope"}


def validate(manifest: Path, vault: Path, require_committed: bool) -> dict[str, object]:
    raw = json.loads(manifest.read_text(encoding="utf-8"))
    errors: list[str] = []
    if not isinstance(raw, dict) or raw.get("scope") != "explicit-completeness":
        errors.append("manifest scope must be explicit-completeness")
        items = []
    else:
        items = raw.get("items")
        if not isinstance(items, list) or not items:
            errors.append("manifest must contain a non-empty items list")
            items = []
    seen: set[str] = set()
    for index, item in enumerate(items, start=1):
        if not isinstance(item, dict):
            errors.append(f"item {index} is not an object")
            continue
        title = str(item.get("title", "")).strip()
        disposition = str(item.get("disposition", "")).strip()
        key = title.casefold()
        if not title:
            errors.append(f"item {index} has no title")
        elif key in seen:
            errors.append(f"item {index} duplicates {title!r}")
        seen.add(key)
        if disposition not in ALLOWED:
            errors.append(f"item {index} has invalid disposition {disposition!r}")
            continue
        if disposition == "atomic-note":
            note = str(item.get("note", "")).strip().strip("/")
            if not note:
                errors.append(f"atomic item {title!r} has no note path")
            elif require_committed and not (vault / note).is_file():
                errors.append(f"atomic item {title!r} was not committed: {note}")
        else:
            reason = str(item.get("reason", "")).strip()
            if not reason:
                errors.append(f"{disposition} item {title!r} needs a reason")
    return {"valid": not errors, "manifest": str(manifest), "items": len(items), "errors": errors}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--vault", type=Path, default=DEFAULT_VAULT)
    parser.add_argument("--require-committed", action="store_true")
    args = parser.parse_args()
    try:
        result = validate(args.manifest, args.vault, args.require_committed)
    except (OSError, UnicodeError, ValueError, json.JSONDecodeError) as error:
        result = {"valid": False, "manifest": str(args.manifest), "errors": [str(error)]}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["valid"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
