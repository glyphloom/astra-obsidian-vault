#!/usr/bin/env python3
"""Validate and write paired machine-readable and compact Markdown save receipts."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

from save_common import atomic_write_json, atomic_write_text, budget_guard


REQUIRED = {
    "status": str,
    "action": str,
    "note": str,
    "selected_object": str,
    "route_reason": str,
    "source_basis": list,
    "assets": list,
    "validation": bool,
}


def phase_timings(session: dict[str, Any]) -> dict[str, float]:
    starts: dict[str, float] = {}
    result: dict[str, float] = {}
    for item in session.get("events", []):
        if not isinstance(item, dict) or item.get("kind") != "phase":
            continue
        phase = str(item.get("phase") or "")
        at = float(item.get("elapsed_seconds") or 0)
        if item.get("state") == "start":
            starts[phase] = at
        elif item.get("state") == "end" and phase in starts:
            result[phase] = round(max(0.0, at - starts[phase]), 3)
    return result


def validate_result(value: dict[str, Any]) -> None:
    errors = []
    for key, expected in REQUIRED.items():
        if key not in value:
            errors.append(f"missing {key}")
        elif not isinstance(value[key], expected):
            errors.append(f"{key} must be {expected.__name__}")
    if value.get("status") != "completed":
        errors.append("successful receipt status must be completed")
    if value.get("action") not in {"created", "updated", "daily-appended", "list-appended"}:
        errors.append("action is not recognized")
    if value.get("validation") is not True:
        errors.append("validation must be true")
    if errors:
        raise ValueError("; ".join(errors))


def markdown(value: dict[str, Any]) -> str:
    sources = ", ".join(str(item) for item in value.get("source_basis", [])) or "none"
    assets = ", ".join(str(item) for item in value.get("assets", [])) or "none"
    uncertainty = str(value.get("uncertainty") or "none material")
    elapsed = value.get("timing", {}).get("elapsed_seconds")
    budget = "unlimited after steering" if value.get("timing", {}).get("steered") else "four-minute unattended budget"
    lines = [
        "# Save receipt",
        "",
        f"- Status: {value['status']}",
        f"- Result: {value['action']} `{value['note']}`",
        f"- Object: {value['selected_object']}",
        f"- Route: {value['route_reason']}",
        f"- Assets: {assets}",
        f"- Source basis: {sources}",
        f"- Validation: passed",
        f"- Timing: {elapsed}s; {budget}",
        f"- Uncertainty: {uncertainty}",
        "",
    ]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--result", required=True, type=Path)
    parser.add_argument("--session", required=True, type=Path)
    parser.add_argument("--markdown", required=True, type=Path)
    parser.add_argument("--json", type=Path)
    args = parser.parse_args()
    try:
        budget_guard(args.session, 3)
        value = json.loads(args.result.read_text(encoding="utf-8"))
        session = json.loads(args.session.read_text(encoding="utf-8"))
        if not isinstance(value, dict) or not isinstance(session, dict):
            raise ValueError("result and session must be JSON objects")
        validate_result(value)
        value["timing"] = {
            "elapsed_seconds": round(float(session.get("elapsed_seconds") or (session.get("events") or [{}])[-1].get("elapsed_seconds") or 0), 3),
            "budget_seconds": session.get("budget_seconds"),
            "steered": bool(session.get("steered")),
            "phases": phase_timings(session),
        }
        value["session"] = str(args.session)
        json_path = args.json or args.markdown.with_suffix(".json")
        atomic_write_json(json_path, value)
        atomic_write_text(args.markdown, markdown(value))
        print(json.dumps({"markdown": str(args.markdown), "json": str(json_path), "timing": value["timing"]}, ensure_ascii=False, indent=2))
        return 0
    except (OSError, UnicodeError, json.JSONDecodeError, ValueError, IndexError) as error:
        print(json.dumps({"error": str(error)}, ensure_ascii=False), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
