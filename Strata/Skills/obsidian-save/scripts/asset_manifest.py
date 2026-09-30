#!/usr/bin/env python3
"""Validate image provenance and visual-review declarations for one save batch."""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path


ROLES = {"banner", "representative"}


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def validate(manifest: Path, no_generated: bool, require_review: bool) -> dict[str, object]:
    raw = json.loads(manifest.read_text(encoding="utf-8"))
    errors: list[str] = []
    if not isinstance(raw, dict) or not isinstance(raw.get("assets"), list):
        errors.append("manifest must contain an assets list")
        assets: list[object] = []
    else:
        assets = raw["assets"]
    source_claims: dict[str, str] = {}
    byte_claims: dict[str, str] = {}
    note_roles: dict[str, set[str]] = {}
    for index, item in enumerate(assets, start=1):
        if not isinstance(item, dict):
            errors.append(f"asset {index} is not an object")
            continue
        note, role = str(item.get("note", "")).strip(), str(item.get("role", "")).strip()
        source = str(item.get("source_url", "")).strip()
        path = Path(str(item.get("path", ""))).expanduser()
        if not note or role not in ROLES or not source or not path.is_file():
            errors.append(f"asset {index} needs note, banner/representative role, source_url, and a readable path")
            continue
        if no_generated and item.get("generated"):
            errors.append(f"asset {index} is generated although this batch forbids generated images")
        label = f"{note} ({role})"
        if source in source_claims:
            errors.append(f"source image is reused by {label} and {source_claims[source]}")
        source_claims[source] = label
        content = digest(path)
        if content in byte_claims:
            errors.append(f"identical image bytes are reused by {label} and {byte_claims[content]}")
        byte_claims[content] = label
        note_roles.setdefault(note, set()).add(role)
    for note, roles in note_roles.items():
        if roles != ROLES:
            errors.append(f"{note} lacks a complete banner/representative pair")
    if require_review and raw.get("visual_reviewed") is not True:
        errors.append("batch visual review was not explicitly recorded")
    return {"valid": not errors, "manifest": str(manifest), "assets": len(assets), "errors": errors}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--no-generated", action="store_true")
    parser.add_argument("--require-review", action="store_true")
    args = parser.parse_args()
    try:
        result = validate(args.manifest, args.no_generated, args.require_review)
    except (OSError, UnicodeError, ValueError, json.JSONDecodeError) as error:
        result = {"valid": False, "manifest": str(args.manifest), "errors": [str(error)]}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["valid"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
