#!/usr/bin/env python3
"""Track an unattended save budget and machine-readable phase telemetry."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import sys
import time
from pathlib import Path
from typing import Any

from save_common import SAVE_ROOT, atomic_write_json, file_lock


CONFIG_PATH = SAVE_ROOT / "SAVE_CONFIG.json"


def config() -> dict[str, Any]:
    try:
        value = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
        return value if isinstance(value, dict) else {}
    except (OSError, UnicodeError, json.JSONDecodeError):
        return {}


def load(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
        return value if isinstance(value, dict) else {}
    except (OSError, UnicodeError, json.JSONDecodeError):
        return {}


def now_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat()


def elapsed(state: dict[str, Any]) -> float:
    started = state.get("started_epoch")
    return max(0.0, time.time() - float(started)) if started else 0.0


def event(session: dict[str, Any], kind: str, **values: Any) -> None:
    session.setdefault("events", []).append(
        {"at": now_iso(), "elapsed_seconds": round(elapsed(session), 3), "kind": kind, **values}
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--session", required=True, type=Path)
    subparsers = parser.add_subparsers(dest="command", required=True)
    begin = subparsers.add_parser("begin")
    begin.add_argument("--capture-id", default="")
    mark = subparsers.add_parser("mark")
    mark.add_argument("--phase", required=True)
    mark.add_argument("--state", choices=("start", "end", "note"), default="note")
    mark.add_argument("--detail", default="")
    check = subparsers.add_parser("check")
    check.add_argument("--reserve-seconds", type=float, default=0.0)
    steer = subparsers.add_parser("steer")
    steer.add_argument("--reason", default="direct user steering")
    finish = subparsers.add_parser("finish")
    finish.add_argument("--status", choices=("completed", "failed", "paused"), required=True)
    finish.add_argument("--note", default="")
    finish.add_argument("--receipt", default="")
    subparsers.add_parser("show")
    args = parser.parse_args()

    args.session.parent.mkdir(parents=True, exist_ok=True)
    with file_lock(args.session):
        state = load(args.session)
        if args.command == "begin":
            if not state.get("started_epoch"):
                budget = int(config().get("unattended_budget_seconds", 240))
                state.update(
                    {
                        "version": 1,
                        "capture_id": args.capture_id or state.get("capture_id", args.session.stem),
                        "started_at": now_iso(),
                        "started_epoch": time.time(),
                        "budget_seconds": budget,
                        "steered": False,
                        "status": "running",
                        "events": [],
                    }
                )
                event(state, "session-began", budget_seconds=budget)
            atomic_write_json(args.session, state)
        elif args.command == "steer":
            if not state.get("started_epoch"):
                raise SystemExit("session has not begun")
            state["steered"] = True
            state["steered_at"] = now_iso()
            event(state, "steered", reason=args.reason)
            atomic_write_json(args.session, state)
        elif args.command == "mark":
            if not state.get("started_epoch"):
                raise SystemExit("session has not begun")
            event(state, "phase", phase=args.phase, state=args.state, detail=args.detail)
            atomic_write_json(args.session, state)
        elif args.command == "check":
            if not state.get("started_epoch"):
                raise SystemExit("session has not begun")
            remaining = None if state.get("steered") else float(state.get("budget_seconds", 240)) - elapsed(state)
            result = {
                "within_budget": remaining is None or remaining >= args.reserve_seconds,
                "steered": bool(state.get("steered")),
                "elapsed_seconds": round(elapsed(state), 3),
                "remaining_seconds": None if remaining is None else round(remaining, 3),
                "reserve_seconds": args.reserve_seconds,
            }
            event(state, "budget-check", **result)
            atomic_write_json(args.session, state)
            print(json.dumps(result, ensure_ascii=False, indent=2))
            return 0 if result["within_budget"] else 4
        elif args.command == "finish":
            if not state.get("started_epoch"):
                raise SystemExit("session has not begun")
            state.update(
                {
                    "status": args.status,
                    "finished_at": now_iso(),
                    "elapsed_seconds": round(elapsed(state), 3),
                    "note": args.note,
                    "receipt": args.receipt,
                }
            )
            event(state, "session-finished", status=args.status, note=args.note)
            atomic_write_json(args.session, state)
        elif args.command == "show":
            pass
    print(json.dumps(state, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
