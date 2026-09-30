#!/usr/bin/env python3
"""Produce explicit evidence-based routing candidates for a resolved save object."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from save_common import budget_guard


SUBJECT_ROUTES: dict[str, tuple[str, str]] = {
    "music": ("music", "Continuum/Media/Music"),
    "book": ("book", "Continuum/Media/Reading"),
    "reading": ("book", "Continuum/Media/Reading"),
    "film": ("film", "Continuum/Media/Film"),
    "movie": ("film", "Continuum/Media/Film"),
    "show": ("show", "Continuum/Media/Shows"),
    "series": ("show", "Continuum/Media/Shows"),
    "anime": ("anime", "Continuum/Media/Anime"),
    "game": ("game", "Continuum/Media/Games"),
    "visual-novel": ("visual-novel", "Continuum/Media/Visual Novels"),
    "writing": ("writing", "Continuum/Media/Writing"),
    "poetry": ("poetry", "Continuum/Media/Poetry"),
    "meme": ("meme", "Continuum/Media/Memes"),
    "roleplay": ("roleplay", "Continuum/Media/Roleplay"),
    "research": ("research", "Infinity"),
    "idea": ("research", "Infinity"),
    "concept": ("research", "Infinity"),
    "tool": ("reference", "Matter"),
    "service": ("reference", "Matter"),
    "reference": ("reference", "Matter"),
}


def candidate(path: str, confidence: float, reason: str) -> dict[str, Any]:
    return {"path": path, "confidence": confidence, "reason": reason}


def normalized_domain(value: str) -> str:
    return value.strip().casefold().replace("_", "-").replace(" ", "-")


def routes(
    metadata: dict[str, Any],
    source_app: str,
    durable: bool,
    personal: bool,
    project: bool,
    subject_title: str = "",
    subject_domain: str = "",
    capture_relation: str = "",
    capture_is_subject: bool = False,
) -> dict[str, Any]:
    identity = metadata.get("identity") if isinstance(metadata.get("identity"), dict) else {}
    kind = str(identity.get("kind") or "")
    adapter = str(metadata.get("adapter") or "")
    title = str(metadata.get("title") or "")
    values: list[dict[str, Any]] = []
    object_type = "unknown"
    subject_title = subject_title.strip()
    subject_domain = normalized_domain(subject_domain)
    subject: dict[str, str] | None = None
    requires_subject_resolution = False

    if subject_domain and subject_domain not in SUBJECT_ROUTES:
        raise ValueError("unsupported subject domain: " + subject_domain)
    if subject_domain and not subject_title:
        raise ValueError("--subject-title is required when --subject-domain is supplied")

    if personal:
        object_type = "personal-note"
        values.append(candidate("Continuum/Personal/<existing-specific-note>", 0.75, "capture was explicitly classified as personal material"))
    elif project:
        object_type = "project-evidence"
        values.append(candidate("Underwork/<matching-active-project>", 0.8, "capture was explicitly classified as active-project evidence"))
    elif subject_domain:
        object_type, folder = SUBJECT_ROUTES[subject_domain]
        relation = capture_relation.strip() or "captured work is evidence about the durable subject"
        subject = {"title": subject_title, "domain": subject_domain, "capture_relation": relation}
        values.append(candidate(folder, 0.99, f"selected durable subject {subject_title!r} is {subject_domain}; {relation}"))
    elif kind.startswith("spotify_"):
        subtype = kind.removeprefix("spotify_")
        object_type = "music" if subtype in {"track", "album", "artist", "playlist"} else "spoken-audio"
        folder = "Continuum/Media/Music" if object_type == "music" else "Continuum/Media/References"
        values.append(candidate(folder, 0.95 if object_type == "music" else 0.7, f"Spotify {subtype} identity"))
    elif kind == "youtube_video":
        object_type = "web-video"
        if capture_is_subject:
            subject = {"title": title, "domain": "captured-work", "capture_relation": "the captured work is itself the durable subject"}
            values.extend(
                [
                    candidate("Continuum/Media/Educational", 0.62, "use only after deciding the instructional video itself is the durable subject"),
                    candidate("Continuum/Media/Film", 0.58, "use when the captured work itself is valued chiefly for editing, direction, or atmosphere"),
                    candidate("Continuum/Media/References", 0.5, "conservative captured-work fallback"),
                ]
            )
        else:
            requires_subject_resolution = True
    elif kind == "isbn":
        object_type = "book"
        values.append(candidate("Continuum/Media/Reading", 0.96, "ISBN identifies a book"))
    elif kind in {"imdb_title", "tmdb_movie"}:
        object_type = "film"
        values.append(candidate("Continuum/Media/Film", 0.94, "film database identity"))
    elif kind == "tmdb_tv":
        object_type = "show"
        values.append(candidate("Continuum/Media/Shows", 0.94, "television database identity"))
    elif kind in {"doi", "arxiv"}:
        object_type = "paper"
        values.append(candidate("Infinity", 0.9, "scholarly identity normally represents evergreen research"))
    elif kind.startswith("github_"):
        object_type = "software-reference"
        values.extend(
            [
                candidate("Matter", 0.74, "durable software or tooling reference"),
                candidate("Underwork/<matching-active-project>", 0.55, "prefer only when the repository or issue directly serves an active project"),
            ]
        )
    elif kind == "reddit_post":
        object_type = "web-post"
        if capture_is_subject:
            subject = {"title": title, "domain": "captured-work", "capture_relation": "the captured work is itself the durable subject"}
            values.extend(
                [
                    candidate("Continuum/Media/Writing", 0.72, "use when the post itself is a literary work or story"),
                    candidate("Infinity", 0.55, "use when the post itself is the enduring idea"),
                ]
            )
        else:
            requires_subject_resolution = True
    elif durable:
        object_type = "web-source"
        if capture_is_subject:
            subject = {"title": title, "domain": "captured-work", "capture_relation": "the captured work is itself the durable subject"}
            values.extend(
                [
                    candidate("Infinity", 0.65, "use when the article itself is the enduring idea"),
                    candidate("Matter", 0.55, "use when the article itself is the durable reference"),
                ]
            )
        else:
            requires_subject_resolution = True
    else:
        object_type = "fleeting"
        values.append(candidate("Continuum/Time/Daily/<today>#Notes", 0.9, "no durable subject or established specific home"))

    if source_app.casefold() == "spotify" and not kind:
        values.insert(0, candidate("Continuum/Media/Music", 0.7, "Spotify capture should first resolve the current track and related album"))
    return {
        "object_type": object_type,
        "title": title,
        "adapter": adapter,
        "identity_kind": kind,
        "durable_subject": subject,
        "requires_subject_resolution": requires_subject_resolution,
        "candidates": sorted(values, key=lambda item: -item["confidence"]),
        "decision_rule": (
            "Choose and name the durable subject before routing commentary, reviews, essays, interviews, or explanatory captures. "
            "Pass its title, domain, and relation to the capture; use --capture-is-subject when the work itself has independent cultural, technical, or recall value."
            if requires_subject_resolution
            else "Choose the highest-confidence candidate whose stated condition is supported by the durable subject and neighboring notes."
        ),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--metadata", required=True, type=Path)
    parser.add_argument("--source-app", default="")
    parser.add_argument("--durable", action=argparse.BooleanOptionalAction, default=True)
    parser.add_argument("--personal", action="store_true")
    parser.add_argument("--project", action="store_true")
    parser.add_argument("--subject-title", default="")
    parser.add_argument("--subject-domain", default="")
    parser.add_argument("--capture-relation", default="")
    parser.add_argument("--capture-is-subject", action="store_true")
    parser.add_argument("--session", type=Path)
    args = parser.parse_args()
    budget_guard(args.session, 75)
    payload = json.loads(args.metadata.read_text(encoding="utf-8"))
    result = routes(
        payload,
        args.source_app,
        args.durable,
        args.personal,
        args.project,
        args.subject_title,
        args.subject_domain,
        args.capture_relation,
        args.capture_is_subject,
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 3 if result["requires_subject_resolution"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
