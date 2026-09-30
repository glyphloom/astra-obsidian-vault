#!/usr/bin/env python3
"""Shared identity and filesystem primitives for the save skill."""

from __future__ import annotations

import contextlib
import hashlib
import json
import os
import re
import secrets
import shutil
import tempfile
import time
from pathlib import Path
from typing import Any, Iterator
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit


DEFAULT_VAULT = Path(__file__).resolve().parents[4]
SAVE_ROOT = DEFAULT_VAULT / "Strata" / "Save"

GENERIC_TRACKING_KEYS = {
    "fbclid",
    "gclid",
    "igshid",
    "mc_cid",
    "mc_eid",
    "utm_campaign",
    "utm_content",
    "utm_medium",
    "utm_source",
    "utm_term",
}

URL_RE = re.compile(r"https?://[^\s<>\]\[\}\{\"']+")
SPOTIFY_URI_RE = re.compile(
    r"^spotify:(track|album|artist|playlist|episode|show|audiobook):([A-Za-z0-9]+)$",
    re.IGNORECASE,
)
ISBN_RE = re.compile(r"^(?:isbn(?:-1[03])?:?\s*)?([0-9Xx][0-9Xx\s-]{8,20})$", re.IGNORECASE)


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _clean_url(raw: str) -> str:
    value = raw.strip().rstrip(".,;:`")
    while value.endswith(")") and value.count("(") < value.count(")"):
        value = value[:-1]
    return value


def _spotify_identity(raw: str) -> dict[str, str] | None:
    match = SPOTIFY_URI_RE.match(raw.strip())
    if match:
        kind, object_id = match.groups()
        kind = kind.lower()
        return {
            "kind": f"spotify_{kind}",
            "id": object_id,
            "canonical_url": f"https://open.spotify.com/{kind}/{object_id}",
        }
    return None


def canonical_identity(raw: str) -> dict[str, str]:
    """Return a stable source identity without discarding semantic query data."""

    value = _clean_url(raw)
    spotify = _spotify_identity(value)
    if spotify:
        return spotify

    isbn_match = ISBN_RE.match(value)
    if isbn_match and not value.lower().startswith(("http://", "https://")):
        isbn = re.sub(r"[^0-9Xx]", "", isbn_match.group(1)).upper()
        if len(isbn) in {10, 13}:
            return {
                "kind": "isbn",
                "id": isbn,
                "canonical_url": f"https://openlibrary.org/isbn/{isbn}",
            }

    parts = urlsplit(value)
    if parts.scheme.lower() not in {"http", "https"} or not parts.hostname:
        digest = sha256_bytes(value.encode("utf-8"))
        return {"kind": "text", "id": digest, "canonical_url": ""}

    host = parts.hostname.lower().removeprefix("www.")
    segments = [segment for segment in parts.path.split("/") if segment]
    query = dict(parse_qsl(parts.query, keep_blank_values=True))

    if host in {"youtu.be", "youtube.com", "m.youtube.com", "music.youtube.com"}:
        video_id = ""
        if host == "youtu.be" and segments:
            video_id = segments[0]
        elif parts.path == "/watch":
            video_id = query.get("v", "")
        elif len(segments) >= 2 and segments[0] in {"embed", "shorts", "live"}:
            video_id = segments[1]
        if video_id:
            return {
                "kind": "youtube_video",
                "id": video_id,
                "canonical_url": f"https://www.youtube.com/watch?v={video_id}",
            }

    if host in {"open.spotify.com", "play.spotify.com"} and len(segments) >= 2:
        spotify = _spotify_identity(f"spotify:{segments[0]}:{segments[1]}")
        if spotify:
            return spotify

    if host == "doi.org" and segments:
        doi = "/".join(segments).casefold()
        return {"kind": "doi", "id": doi, "canonical_url": f"https://doi.org/{doi}"}

    if host.endswith("arxiv.org") and len(segments) >= 2 and segments[0] in {"abs", "pdf"}:
        arxiv_id = segments[1].removesuffix(".pdf")
        return {
            "kind": "arxiv",
            "id": arxiv_id,
            "canonical_url": f"https://arxiv.org/abs/{arxiv_id}",
        }

    if host == "imdb.com":
        title_id = next((segment for segment in segments if re.fullmatch(r"tt\d+", segment)), "")
        if title_id:
            return {
                "kind": "imdb_title",
                "id": title_id,
                "canonical_url": f"https://www.imdb.com/title/{title_id}/",
            }

    if host == "themoviedb.org" and len(segments) >= 2 and segments[0] in {"movie", "tv"}:
        object_id = segments[1].split("-", 1)[0]
        if object_id.isdigit():
            return {
                "kind": f"tmdb_{segments[0]}",
                "id": object_id,
                "canonical_url": f"https://www.themoviedb.org/{segments[0]}/{object_id}",
            }

    if host.endswith("reddit.com"):
        try:
            comments_index = segments.index("comments")
        except ValueError:
            comments_index = -1
        if comments_index >= 0 and len(segments) > comments_index + 1:
            post_id = segments[comments_index + 1].casefold()
            return {
                "kind": "reddit_post",
                "id": post_id,
                "canonical_url": f"https://www.reddit.com/comments/{post_id}/",
            }

    if host == "github.com" and len(segments) >= 2:
        owner, repository = segments[0].casefold(), segments[1].removesuffix(".git").casefold()
        if len(segments) >= 4 and segments[2] in {"issues", "pull"} and segments[3].isdigit():
            object_kind = "issue" if segments[2] == "issues" else "pull"
            return {
                "kind": f"github_{object_kind}",
                "id": f"{owner}/{repository}#{segments[3]}",
                "canonical_url": f"https://github.com/{owner}/{repository}/{segments[2]}/{segments[3]}",
            }
        return {
            "kind": "github_repository",
            "id": f"{owner}/{repository}",
            "canonical_url": f"https://github.com/{owner}/{repository}",
        }

    if host == "openlibrary.org" and len(segments) >= 2 and segments[0].casefold() == "isbn":
        isbn = re.sub(r"[^0-9Xx]", "", segments[1]).upper()
        return {
            "kind": "isbn",
            "id": isbn,
            "canonical_url": f"https://openlibrary.org/isbn/{isbn}",
        }

    try:
        port = parts.port
    except ValueError:
        port = None
    default_port = (parts.scheme.lower() == "http" and port == 80) or (
        parts.scheme.lower() == "https" and port == 443
    )
    netloc = host if port is None or default_port else f"{host}:{port}"
    path = re.sub(r"/{2,}", "/", parts.path or "/")
    if path != "/":
        path = path.rstrip("/")
    query_items = [
        (key, item)
        for key, item in parse_qsl(parts.query, keep_blank_values=True)
        if key.casefold() not in GENERIC_TRACKING_KEYS and not key.casefold().startswith("utm_")
    ]
    canonical = urlunsplit((parts.scheme.lower(), netloc, path, urlencode(sorted(query_items)), ""))
    return {"kind": "url", "id": canonical, "canonical_url": canonical}


def identity_key(identity: dict[str, str]) -> str:
    return f"{identity['kind']}:{identity['id']}"


def extract_urls(text: str) -> list[str]:
    return list(dict.fromkeys(URL_RE.findall(text)))


def atomic_write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary_name = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    temporary = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as handle:
            handle.write(content)
            handle.flush()
            os.fsync(handle.fileno())
        temporary.replace(path)
    except Exception:
        temporary.unlink(missing_ok=True)
        raise


def atomic_write_json(path: Path, value: Any) -> None:
    atomic_write_text(path, json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n")


@contextlib.contextmanager
def file_lock(path: Path) -> Iterator[None]:
    """Acquire a cleanup-safe filesystem mutex beside ``path``.

    A lock directory gives acquisition atomicity without leaving permanent
    zero-byte files in an Obsidian vault. Dead owners older than one minute are
    reclaimed; live contenders wait until the current owner removes the
    directory in ``finally``.
    """
    lock_path = path.with_suffix(path.suffix + ".lock")
    lock_path.parent.mkdir(parents=True, exist_ok=True)
    token = secrets.token_hex(16)
    owner_path = lock_path / "owner.json"
    while True:
        try:
            lock_path.mkdir()
        except FileExistsError:
            if lock_path.is_file():
                raise RuntimeError(f"legacy lock file blocks acquisition: {lock_path}")
            try:
                owner = json.loads(owner_path.read_text(encoding="utf-8"))
            except (OSError, UnicodeError, json.JSONDecodeError):
                owner = {}
            pid = owner.get("pid")
            started = owner.get("started_epoch")
            alive = isinstance(pid, int) and pid > 0
            if isinstance(pid, int) and pid > 0:
                try:
                    os.kill(pid, 0)
                except ProcessLookupError:
                    alive = False
                except PermissionError:
                    alive = True
            try:
                fallback_started = lock_path.stat().st_mtime
            except FileNotFoundError:
                continue
            age = time.time() - (
                float(started) if isinstance(started, (int, float)) else fallback_started
            )
            if not alive and age >= 60.0:
                try:
                    shutil.rmtree(lock_path)
                except FileNotFoundError:
                    pass
                continue
            time.sleep(0.05)
            continue
        try:
            owner_path.write_text(
                json.dumps({"pid": os.getpid(), "started_epoch": time.time(), "token": token}),
                encoding="utf-8",
            )
        except Exception:
            try:
                lock_path.rmdir()
            except OSError:
                pass
            raise
        break
    try:
        yield
    finally:
        try:
            owner = json.loads(owner_path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, json.JSONDecodeError):
            owner = {}
        if owner.get("token") == token:
            owner_path.unlink(missing_ok=True)
            try:
                lock_path.rmdir()
            except FileNotFoundError:
                pass


def budget_guard(session: Path | None, reserve_seconds: float = 0.0) -> None:
    """Refuse to begin a phase that cannot fit an unsteered session budget."""

    if session is None:
        return
    try:
        state = json.loads(session.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise ValueError(f"save session is unreadable: {error}") from error
    if state.get("steered") is True:
        return
    started = state.get("started_epoch")
    budget = state.get("budget_seconds")
    if not isinstance(started, (int, float)) or not isinstance(budget, (int, float)):
        raise ValueError("save session has not begun or has no budget")
    remaining = float(budget) - (time.time() - float(started))
    if remaining < reserve_seconds:
        raise TimeoutError(
            f"unattended save budget exhausted: {remaining:.1f}s remain, "
            f"{reserve_seconds:.1f}s reserved for this phase"
        )
