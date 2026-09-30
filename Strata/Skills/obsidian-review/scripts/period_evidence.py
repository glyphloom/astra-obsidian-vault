#!/usr/bin/env python3
"""Collect read-only vault evidence for a date range as JSON.

Used by $obsidian-review. It gathers facts only;
the agent does all interpretation.
"""
import argparse
import datetime as dt
import json
import re
from collections import Counter
from pathlib import Path

DAILY = "Continuum/Time/Daily"
PEOPLE = "Continuum/Personal/People/"
TASK = re.compile(r"^\s*[-*] \[(.)\] (.*)$")
CLOSED = re.compile(r"(✅|❌) ?(\d{4}-\d{2}-\d{2})")
DATE = re.compile(r"(\d{4})-?(\d{2})-?(\d{2})")
LINK = re.compile(r"!?\[\[([^\]|#^]+)")
CREATED = re.compile(r"^created:\s*['\"]?(\d{4}-\d{2}-\d{2})", re.M)
TRANSCRIPT = re.compile(r"<!-- (?:agent|codex)-audio-transcript:start")


def day(s):
    return dt.date.fromisoformat(s)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--vault", default=".")
    p.add_argument("--start", required=True, type=day)
    p.add_argument("--end", required=True, type=day)
    a = p.parse_args()
    vault = Path(a.vault).resolve()
    in_range = lambda d: d is not None and a.start <= d <= a.end

    # Active content: everything outside Artifacts/, Strata/, and hidden app or trash folders.
    notes = {
        f.relative_to(vault).as_posix()[:-3]: f.read_text(errors="replace")
        for f in vault.rglob("*.md")
        if f.relative_to(vault).parts[0] not in ("Artifacts", "Strata")
        and not any(part.startswith(".") for part in f.relative_to(vault).parts)
    }
    by_stem = {Path(n).name: n for n in notes}

    def resolve(target):
        target = target.strip().removesuffix(".md")
        return target if target in notes else by_stem.get(Path(target).name)

    def daily_date(path):
        if path.startswith(DAILY + "/"):
            try:
                return day(Path(path).name)
            except ValueError:
                return None

    open_tasks, closed = [], []
    for path, text in notes.items():
        m = CREATED.search(text[:600])
        born = daily_date(path) or (day(m.group(1)) if m else None)
        for n, line in enumerate(text.split("\n")):
            t = TASK.match(line)
            if not t:
                continue
            status, body = t.groups()
            c = CLOSED.search(body)
            if c and in_range(day(c.group(2))):
                closed.append({"path": path, "line": n, "status": status, "date": c.group(2), "text": body})
            elif status not in "x-" and "#task" in body:
                block = re.search(r"\^\S*?(\d{8})\b", body)
                since = day("{}-{}-{}".format(*DATE.search(block.group(1)).groups())) if block else born
                open_tasks.append({
                    "path": path, "line": n, "status": status, "text": body,
                    "since": since and since.isoformat(),
                    "age_days": since and (a.end - since).days,
                })

    dailies = sorted(p for p in notes if daily_date(p))
    period = [p for p in dailies if in_range(daily_date(p))]
    linked, last_seen = Counter(), {}
    for path in dailies:
        targets = {resolve(t) for t in LINK.findall(notes[path])} - {None, path}
        for target in targets:
            last_seen[target] = max(last_seen.get(target, ""), Path(path).name)
            if path in period:
                linked[target] += 1

    all_days = [a.start + dt.timedelta(n) for n in range((a.end - a.start).days + 1)]
    have = {daily_date(p) for p in period}
    print(json.dumps({
        "period": {"start": a.start.isoformat(), "end": a.end.isoformat()},
        "daily_notes": period,
        "days_without_note": [d.isoformat() for d in all_days if d not in have],
        "recordings": sum(len(TRANSCRIPT.findall(notes[p])) for p in period),
        "closed_in_period": closed,
        "open_tasks": sorted(open_tasks, key=lambda t: t["since"] or ""),
        "notes_created": sorted(
            p for p, text in notes.items()
            if not p.startswith("Continuum/Time/") and (m := CREATED.search(text[:600])) and in_range(day(m.group(1)))
        ),
        "people": sorted(
            ({"note": p, "mentions": linked[p], "last_seen": last_seen.get(p)} for p in notes if p.startswith(PEOPLE)),
            key=lambda x: (-x["mentions"], x["last_seen"] or ""),
        ),
        "projects": dict(Counter(
            "/".join(p.split("/")[:2]) for p in linked.elements() if p.startswith("Underwork/")
        ).most_common()),
        "other_links": [p for p, _ in linked.most_common(25) if not p.startswith((PEOPLE, "Underwork/", "Continuum/Time/"))],
    }, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
