#!/usr/bin/env python3

import argparse
import datetime as dt
import json
import re
import subprocess
import time
from pathlib import Path

from save_common import atomic_write_text, file_lock


DAILY_DIR = "Continuum/Time/Daily"
NOTES_HEADER = "## Notes"
# The journal day runs from 04:00 to just before 04:00 the next morning.
DAY_BOUNDARY_HOUR = 4


def journal_day(now: dt.datetime) -> dt.date:
    return (now - dt.timedelta(hours=DAY_BOUNDARY_HOUR)).date()


def create_through_journals(vault: Path, target: Path, timeout: float = 15.0) -> None:
    # The Journals plugin owns daily-note creation, its template, and its
    # frontmatter; ask it to open today's note rather than building one here.
    opened = subprocess.run(
        ["obsidian", "command", "id=journals:default-open-today"],
        cwd=vault,
        check=False,
        text=True,
        capture_output=True,
    )
    if opened.returncode:
        detail = (opened.stderr or opened.stdout).strip()
        raise RuntimeError("Journals could not open today's note: {}".format(detail))
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        try:
            content = target.read_text(encoding="utf-8")
            if NOTES_HEADER in content and "<%" not in content:
                return
        except (OSError, UnicodeDecodeError):
            pass
        time.sleep(0.2)
    raise TimeoutError("Journals did not finish creating today's daily note")


def append_capture(path: Path, heading: str, text: str) -> bool:
    entry = "### {}\n\n{}".format(heading.strip(), text.strip())
    content = path.read_text(encoding="utf-8")
    match = re.search(r"(?m)^{}\s*$".format(re.escape(NOTES_HEADER)), content)
    if match is None:
        raise ValueError("daily note has no {} section".format(NOTES_HEADER))

    # Notes ends at the next H2 (Agent Review or Processed Agent Instructions),
    # which must stay after it.
    following = re.search(r"(?m)^##\s+", content[match.end() :])
    end = len(content) if following is None else match.end() + following.start()
    body = content[match.end() : end]
    if entry in body:
        return False
    existing = body.strip()
    new_body = entry if not existing else existing + "\n\n" + entry
    suffix = content[end:].lstrip("\n")
    updated = content[: match.end()].rstrip() + "\n\n" + new_body.rstrip() + "\n"
    if suffix:
        updated += "\n" + suffix
    atomic_write_text(path, updated)
    return True


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Append one fleeting capture to the current journal day's ## Notes."
    )
    parser.add_argument("--vault", required=True, type=Path)
    parser.add_argument("--content", required=True, type=Path)
    parser.add_argument("--heading", required=True, help="concise descriptive ### heading for the capture")
    parser.add_argument("--date", help="YYYY-MM-DD; defaults to the current journal day")
    args = parser.parse_args()

    vault = args.vault.expanduser().resolve()
    today = journal_day(dt.datetime.now())
    day = dt.date.fromisoformat(args.date) if args.date else today
    text = args.content.read_text(encoding="utf-8")
    if not text.strip():
        raise SystemExit("clipboard content is empty")

    target = vault / DAILY_DIR / "{}.md".format(day.isoformat())
    with file_lock(target.with_suffix(target.suffix + ".save")):
        created = not target.exists()
        if created:
            if day != dt.date.today():
                raise ValueError("Journals can only create the calendar day's note; {} is missing".format(target.name))
            create_through_journals(vault, target)
        elif "<%" in target.read_text(encoding="utf-8"):
            raise ValueError("existing daily note still contains unrendered Templater syntax")

        appended = append_capture(target, args.heading, text)
    print(
        json.dumps(
            {
                "path": str(target.relative_to(vault)),
                "created": created,
                "appended": appended,
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
