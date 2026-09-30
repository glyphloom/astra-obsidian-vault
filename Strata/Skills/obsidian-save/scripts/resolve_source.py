#!/usr/bin/env python3
"""Resolve canonical metadata for common save sources, including Spotify playback."""

from __future__ import annotations

import argparse
import html
import json
import os
import plistlib
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode, urljoin
from urllib.request import Request, urlopen

from save_common import budget_guard, canonical_identity


USER_AGENT = "ObsidianSave/1.0 (+local personal knowledge capture)"
MAX_HTML_BYTES = 8 * 1024 * 1024


class MetadataParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.meta: dict[str, str] = {}
        self.canonical = ""
        self.title_parts: list[str] = []
        self.in_title = False
        self.json_ld: list[Any] = []
        self._json_buffer: list[str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key.casefold(): value or "" for key, value in attrs}
        if tag.casefold() == "title":
            self.in_title = True
        elif tag.casefold() == "meta":
            key = (values.get("property") or values.get("name") or "").casefold()
            if key and values.get("content") and key not in self.meta:
                self.meta[key] = values["content"].strip()
        elif tag.casefold() == "link" and "canonical" in values.get("rel", "").casefold():
            self.canonical = values.get("href", "").strip()
        elif tag.casefold() == "script" and values.get("type", "").casefold() == "application/ld+json":
            self._json_buffer = []

    def handle_endtag(self, tag: str) -> None:
        if tag.casefold() == "title":
            self.in_title = False
        elif tag.casefold() == "script" and self._json_buffer is not None:
            raw = "".join(self._json_buffer).strip()
            self._json_buffer = None
            if raw:
                try:
                    self.json_ld.append(json.loads(raw))
                except json.JSONDecodeError:
                    pass

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data)
        if self._json_buffer is not None:
            self._json_buffer.append(data)


def fetch(url: str, timeout: float = 12.0, max_bytes: int = MAX_HTML_BYTES) -> tuple[bytes, str, str]:
    request = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/json,*/*;q=0.5"})
    with urlopen(request, timeout=timeout) as response:
        data = response.read(max_bytes + 1)
        if len(data) > max_bytes:
            raise ValueError(f"response exceeds {max_bytes} bytes")
        return data, response.geturl(), response.headers.get("Content-Type", "")


def image_values(value: Any) -> list[str]:
    images: list[str] = []
    if isinstance(value, str):
        images.append(value)
    elif isinstance(value, dict):
        for key in ("url", "contentUrl", "thumbnailUrl"):
            if isinstance(value.get(key), str):
                images.append(value[key])
    elif isinstance(value, list):
        for item in value:
            images.extend(image_values(item))
    return images


def flatten_json_ld(value: Any) -> list[dict[str, Any]]:
    objects: list[dict[str, Any]] = []
    if isinstance(value, dict):
        objects.append(value)
        graph = value.get("@graph")
        if isinstance(graph, list):
            objects.extend(item for item in graph if isinstance(item, dict))
    elif isinstance(value, list):
        objects.extend(item for item in value if isinstance(item, dict))
    return objects


def generic_metadata(url: str) -> dict[str, Any]:
    body, final_url, content_type = fetch(url)
    decoded = body.decode("utf-8", errors="replace")
    parser = MetadataParser()
    parser.feed(decoded)
    canonical_candidate = urljoin(final_url, parser.canonical) if parser.canonical else final_url
    identity = canonical_identity(canonical_candidate)
    title = parser.meta.get("og:title") or parser.meta.get("twitter:title") or "".join(parser.title_parts).strip()
    description = parser.meta.get("og:description") or parser.meta.get("description") or parser.meta.get("twitter:description") or ""
    author = parser.meta.get("author") or parser.meta.get("article:author") or ""
    published = parser.meta.get("article:published_time") or ""
    images: list[dict[str, Any]] = []
    for key in ("og:image", "og:image:secure_url", "twitter:image"):
        candidate = parser.meta.get(key)
        if candidate:
            images.append({"url": urljoin(final_url, candidate), "source": key})
    json_objects: list[dict[str, Any]] = []
    for value in parser.json_ld:
        json_objects.extend(flatten_json_ld(value))
    for item in json_objects:
        title = title or str(item.get("headline") or item.get("name") or "")
        description = description or str(item.get("description") or "")
        published = published or str(item.get("datePublished") or "")
        author_value = item.get("author")
        if not author and isinstance(author_value, dict):
            author = str(author_value.get("name") or "")
        for candidate in image_values(item.get("image")):
            images.append({"url": urljoin(final_url, candidate), "source": "json-ld"})
    unique_images: list[dict[str, Any]] = []
    seen: set[str] = set()
    for item in images:
        if item["url"] not in seen:
            seen.add(item["url"])
            unique_images.append(item)
    return {
        "adapter": "web",
        "identity": identity,
        "canonical_url": identity["canonical_url"] or final_url,
        "fetched_url": final_url,
        "content_type": content_type,
        "title": html.unescape(title).strip(),
        "description": html.unescape(description).strip(),
        "author": html.unescape(author).strip(),
        "published": published,
        "images": unique_images,
    }


def youtube_metadata(url: str, identity: dict[str, str]) -> dict[str, Any]:
    endpoint = "https://www.youtube.com/oembed?" + urlencode({"url": identity["canonical_url"], "format": "json"})
    body, _, _ = fetch(endpoint)
    payload = json.loads(body.decode("utf-8"))
    return {
        "adapter": "youtube",
        "identity": identity,
        "canonical_url": identity["canonical_url"],
        "title": payload.get("title", ""),
        "author": payload.get("author_name", ""),
        "author_url": payload.get("author_url", ""),
        "images": [
            {
                "url": f"https://i.ytimg.com/vi/{identity['id']}/maxresdefault.jpg",
                "source": "youtube-maxres",
            },
            {"url": payload.get("thumbnail_url", ""), "source": "youtube-oembed"},
        ],
    }


def _next_data(document: str) -> dict[str, Any]:
    match = re.search(
        r'<script[^>]+id=["\']__NEXT_DATA__["\'][^>]*>(.*?)</script>',
        document,
        re.DOTALL | re.IGNORECASE,
    )
    if not match:
        return {}
    try:
        loaded = json.loads(html.unescape(match.group(1)))
        return loaded if isinstance(loaded, dict) else {}
    except json.JSONDecodeError:
        return {}


def spotify_metadata(url: str, identity: dict[str, str]) -> dict[str, Any]:
    kind = identity["kind"].removeprefix("spotify_")
    embed_url = f"https://open.spotify.com/embed/{kind}/{identity['id']}"
    body, _, _ = fetch(embed_url)
    document = body.decode("utf-8", errors="replace")
    payload = _next_data(document)
    entity = (
        payload.get("props", {})
        .get("pageProps", {})
        .get("state", {})
        .get("data", {})
        .get("entity", {})
    )
    if not isinstance(entity, dict):
        entity = {}
    related_uri = entity.get("relatedEntityUri", "")
    related = canonical_identity(related_uri) if isinstance(related_uri, str) and related_uri else None
    album: dict[str, Any] | None = None
    artist = ""
    if kind == "track":
        try:
            page_body, _, _ = fetch(identity["canonical_url"])
            page_parser = MetadataParser()
            page_parser.feed(page_body.decode("utf-8", errors="replace"))
            album_url = page_parser.meta.get("music:album", "")
            description_parts = [part.strip() for part in page_parser.meta.get("og:description", "").split("·")]
            if album_url:
                album_identity = canonical_identity(album_url)
                album = {
                    "title": description_parts[1] if len(description_parts) >= 2 else "",
                    "identity": album_identity,
                    "canonical_url": album_identity["canonical_url"],
                    "track_number": page_parser.meta.get("music:album:track", ""),
                }
                related = album_identity
            artist = page_parser.meta.get("music:musician_description", "") or (description_parts[0] if description_parts else "")
        except (HTTPError, URLError, TimeoutError, ValueError):
            pass
    images = []
    visual = entity.get("visualIdentity", {})
    if isinstance(visual, dict):
        for image in visual.get("image", []):
            if isinstance(image, dict) and image.get("url"):
                images.append({
                    "url": image["url"],
                    "width": image.get("maxWidth"),
                    "height": image.get("maxHeight"),
                    "source": "spotify-embed",
                })
    return {
        "adapter": "spotify",
        "identity": identity,
        "canonical_url": identity["canonical_url"],
        "title": entity.get("title") or entity.get("name") or "",
        "subtitle": entity.get("subtitle", ""),
        "artist": artist,
        "album": album,
        "release_date": (entity.get("releaseDate") or {}).get("isoString", "") if isinstance(entity.get("releaseDate"), dict) else "",
        "duration_ms": entity.get("duration"),
        "explicit": entity.get("isExplicit"),
        "related": related,
        "images": images,
    }


def spotify_current() -> dict[str, Any]:
    running = subprocess.run(["/usr/bin/pgrep", "-x", "Spotify"], capture_output=True, text=True)
    if running.returncode != 0:
        raise RuntimeError("Spotify is not running")
    script = '''
const spotify = Application("Spotify");
const state = String(spotify.playerState());
if (state === "stopped") {
  JSON.stringify({player_state: state});
} else {
  const item = spotify.currentTrack();
  JSON.stringify({
    player_state: state,
    title: item.name() || "",
    artist: item.artist() || "",
    album: item.album() || "",
    album_artist: item.albumArtist() || "",
    spotify_uri: item.spotifyUrl() || "",
    artwork_url: item.artworkUrl() || "",
    duration_ms: item.duration() || 0,
    position_seconds: spotify.playerPosition() || 0
  });
}
'''
    result = subprocess.run(
        ["/usr/bin/osascript", "-l", "JavaScript", "-e", script],
        capture_output=True,
        text=True,
        timeout=8,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "Spotify AppleScript query failed")
    player = json.loads(result.stdout)
    if player.get("player_state") == "stopped":
        return {"adapter": "spotify-current", "player_state": "stopped"}
    identity = canonical_identity(str(player.get("spotify_uri") or ""))
    resolved = spotify_metadata(identity["canonical_url"], identity)
    resolved.update(
        {
            "adapter": "spotify-current",
            "player_state": player.get("player_state"),
            "title": player.get("title") or resolved.get("title", ""),
            "artist": player.get("artist") or resolved.get("artist", ""),
            "album_title": player.get("album") or ((resolved.get("album") or {}).get("title") if isinstance(resolved.get("album"), dict) else ""),
            "album_artist": player.get("album_artist", ""),
            "spotify_uri": player.get("spotify_uri", ""),
            "artwork_url": player.get("artwork_url", ""),
            "duration_ms": player.get("duration_ms"),
            "position_seconds": player.get("position_seconds"),
        }
    )
    return resolved


def doi_metadata(identity: dict[str, str]) -> dict[str, Any]:
    endpoint = "https://api.crossref.org/works/" + quote(identity["id"], safe="")
    body, _, _ = fetch(endpoint)
    message = json.loads(body.decode("utf-8")).get("message", {})
    titles = message.get("title") or []
    authors = []
    for author in message.get("author") or []:
        if isinstance(author, dict):
            name = " ".join(filter(None, [author.get("given", ""), author.get("family", "")])).strip()
            if name:
                authors.append(name)
    published = message.get("published-print") or message.get("published-online") or message.get("created") or {}
    date_parts = published.get("date-parts") if isinstance(published, dict) else None
    return {
        "adapter": "crossref",
        "identity": identity,
        "canonical_url": identity["canonical_url"],
        "title": titles[0] if titles else "",
        "authors": authors,
        "published": date_parts[0] if isinstance(date_parts, list) and date_parts else "",
        "publisher": message.get("publisher", ""),
        "container_title": (message.get("container-title") or [""])[0],
        "abstract": message.get("abstract", ""),
        "type": message.get("type", ""),
        "images": [],
    }


def arxiv_metadata(identity: dict[str, str]) -> dict[str, Any]:
    endpoint = "https://export.arxiv.org/api/query?" + urlencode({"id_list": identity["id"]})
    body, _, _ = fetch(endpoint)
    root = ET.fromstring(body)
    namespace = {"atom": "http://www.w3.org/2005/Atom", "arxiv": "http://arxiv.org/schemas/atom"}
    entry = root.find("atom:entry", namespace)
    if entry is None:
        raise ValueError("arXiv returned no matching entry")
    return {
        "adapter": "arxiv",
        "identity": identity,
        "canonical_url": identity["canonical_url"],
        "title": " ".join((entry.findtext("atom:title", default="", namespaces=namespace)).split()),
        "authors": [item.findtext("atom:name", default="", namespaces=namespace) for item in entry.findall("atom:author", namespace)],
        "published": entry.findtext("atom:published", default="", namespaces=namespace),
        "updated": entry.findtext("atom:updated", default="", namespaces=namespace),
        "abstract": " ".join((entry.findtext("atom:summary", default="", namespaces=namespace)).split()),
        "categories": [item.attrib.get("term", "") for item in entry.findall("atom:category", namespace)],
        "images": [],
    }


def isbn_metadata(identity: dict[str, str]) -> dict[str, Any]:
    endpoint = f"https://openlibrary.org/api/books?bibkeys=ISBN:{identity['id']}&jscmd=data&format=json"
    body, _, _ = fetch(endpoint)
    item = json.loads(body.decode("utf-8")).get(f"ISBN:{identity['id']}", {})
    cover = item.get("cover") if isinstance(item.get("cover"), dict) else {}
    return {
        "adapter": "openlibrary",
        "identity": identity,
        "canonical_url": identity["canonical_url"],
        "title": item.get("title", ""),
        "subtitle": item.get("subtitle", ""),
        "authors": [author.get("name", "") for author in item.get("authors", []) if isinstance(author, dict)],
        "publish_date": item.get("publish_date", ""),
        "publishers": [publisher.get("name", "") for publisher in item.get("publishers", []) if isinstance(publisher, dict)],
        "number_of_pages": item.get("number_of_pages"),
        "images": [{"url": url, "source": "openlibrary-cover"} for url in [cover.get("large"), cover.get("medium")] if url],
    }


def reddit_metadata(identity: dict[str, str]) -> dict[str, Any]:
    endpoint = identity["canonical_url"].rstrip("/") + ".json?raw_json=1"
    body, _, _ = fetch(endpoint)
    payload = json.loads(body.decode("utf-8"))
    listing = payload[0] if isinstance(payload, list) and payload else payload
    children = listing.get("data", {}).get("children", []) if isinstance(listing, dict) else []
    post = children[0].get("data", {}) if children else {}
    return {
        "adapter": "reddit",
        "identity": identity,
        "canonical_url": identity["canonical_url"],
        "title": post.get("title", ""),
        "author": post.get("author", ""),
        "subreddit": post.get("subreddit_name_prefixed", ""),
        "created_utc": post.get("created_utc"),
        "body": post.get("selftext", ""),
        "is_self": post.get("is_self"),
        "images": [],
    }


def resolve(value: str) -> dict[str, Any]:
    identity = canonical_identity(value)
    if identity["kind"] == "youtube_video":
        return youtube_metadata(value, identity)
    if identity["kind"].startswith("spotify_"):
        return spotify_metadata(value, identity)
    if identity["kind"] == "doi":
        return doi_metadata(identity)
    if identity["kind"] == "arxiv":
        return arxiv_metadata(identity)
    if identity["kind"] == "isbn":
        return isbn_metadata(identity)
    if identity["kind"] == "reddit_post":
        try:
            return reddit_metadata(identity)
        except (HTTPError, URLError, TimeoutError, ValueError, json.JSONDecodeError) as error:
            return {
                "adapter": "reddit",
                "identity": identity,
                "canonical_url": identity["canonical_url"],
                "title": "",
                "images": [],
                "partial": True,
                "fetch_error": str(error),
                "next_step": "Use the browser/web retrieval path for content; retain this stable Reddit post identity.",
            }
    return generic_metadata(identity["canonical_url"] or value)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--url")
    group.add_argument("--spotify-current", action="store_true")
    parser.add_argument("--output", type=Path)
    parser.add_argument("--session", type=Path)
    args = parser.parse_args()
    try:
        budget_guard(args.session, 120)
        result = spotify_current() if args.spotify_current else resolve(args.url)
    except (HTTPError, URLError, TimeoutError, ValueError, RuntimeError, json.JSONDecodeError, ET.ParseError, subprocess.TimeoutExpired) as error:
        print(json.dumps({"error": str(error), "adapter": "spotify-current" if args.spotify_current else "source"}), file=sys.stderr)
        return 2
    rendered = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
    else:
        sys.stdout.write(rendered)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
