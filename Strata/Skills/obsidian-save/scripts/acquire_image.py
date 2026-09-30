#!/usr/bin/env python3
"""Acquire and validate a source image in staging before a transactional save."""

from __future__ import annotations

import argparse
import json
import mimetypes
import re
import subprocess
import sys
import shutil
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

from save_common import DEFAULT_VAULT, budget_guard, sha256_file


USER_AGENT = "ObsidianSave/1.0 (+local personal knowledge capture)"
MAX_IMAGE_BYTES = 30 * 1024 * 1024
IMAGE_EXTENSIONS = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/tiff": ".tiff",
    "image/heic": ".heic",
}


def slugify(value: str) -> str:
    folded = value.casefold().replace("’", "'")
    folded = re.sub(r"[^\w\s-]", "", folded, flags=re.UNICODE)
    folded = re.sub(r"[-\s]+", "-", folded).strip("-")
    return folded[:90] or "saved-image"


def dimensions(path: Path) -> tuple[int, int]:
    result = subprocess.run(
        ["/usr/bin/sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)],
        capture_output=True,
        text=True,
        timeout=10,
    )
    if result.returncode != 0:
        raise ValueError(result.stderr.strip() or "sips could not inspect image")
    width_match = re.search(r"pixelWidth:\s*(\d+)", result.stdout)
    height_match = re.search(r"pixelHeight:\s*(\d+)", result.stdout)
    if not width_match or not height_match:
        raise ValueError("image dimensions were not reported")
    return int(width_match.group(1)), int(height_match.group(1))


def candidate_urls(args: argparse.Namespace) -> list[dict[str, str]]:
    values: list[dict[str, str]] = []
    for url in args.candidate_url:
        values.append({"url": url, "source": "explicit-candidate"})
    if args.metadata:
        payload = json.loads(args.metadata.read_text(encoding="utf-8"))
        for item in payload.get("images", []):
            if isinstance(item, dict) and isinstance(item.get("url"), str):
                values.append({"url": item["url"], "source": str(item.get("source") or payload.get("adapter") or "metadata")})
        artwork = payload.get("artwork_url")
        if isinstance(artwork, str) and artwork:
            values.append({"url": artwork, "source": "spotify-artwork"})
    unique: list[dict[str, str]] = []
    seen: set[str] = set()
    for item in values:
        if item["url"] and item["url"] not in seen:
            seen.add(item["url"])
            unique.append(item)
    return unique


def download(url: str, destination: Path) -> str:
    request = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "image/*"})
    with urlopen(request, timeout=15) as response:
        content_type = response.headers.get_content_type().casefold()
        if not content_type.startswith("image/"):
            raise ValueError(f"candidate returned {content_type}, not an image")
        data = response.read(MAX_IMAGE_BYTES + 1)
        if len(data) > MAX_IMAGE_BYTES:
            raise ValueError("candidate exceeds 30 MiB")
        destination.write_bytes(data)
        return content_type


def existing_sha_match(vault: Path, digest: str, folders: list[str]) -> str | None:
    for relative in folders:
        root = vault / relative
        if not root.is_dir():
            continue
        for path in root.rglob("*"):
            if path.is_file():
                try:
                    if sha256_file(path) == digest:
                        return path.relative_to(vault).as_posix()
                except OSError:
                    continue
    return None


def attachment_folder(vault: Path, note: str) -> str:
    """Mirror the owning note's path: start at its top two folders and go one level deeper
    only where that level already exists, was split into subfolders, or would pass 20 files."""
    parents = Path(note).parent.parts
    path = parents + (Path(note).stem,)
    depth = min(2, len(parents))
    folder = lambda d: vault.joinpath("Strata/Attachments", *path[:d])
    while depth < len(path):
        here = [entry for entry in folder(depth).glob("*") if not entry.name.startswith(".")] if folder(depth).is_dir() else []
        files = sum(entry.is_file() for entry in here)
        if not (folder(depth + 1).is_dir() or (here and not files) or files >= 20):
            break
        depth += 1
    return folder(depth).relative_to(vault).as_posix()


def acceptable(kind: str, width: int, height: int) -> tuple[bool, str]:
    if kind == "banner":
        if width < 1200 or height < 675:
            return False, "banner candidate is below 1200x675"
        ratio = width / max(height, 1)
        if not 1.55 <= ratio <= 1.90:
            return False, "banner candidate is not near 16:10 or 16:9"
    elif width < 300 or height < 300:
        return False, "representative image is below 300x300"
    return True, ""


def derivable_as_banner(width: int, height: int) -> bool:
    """Return whether official art can survive a controlled 16:9 full-bleed crop."""
    return width >= 300 and height >= 300 and 0.8 <= width / max(height, 1) <= 2.10


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--subject", required=True)
    parser.add_argument("--kind", choices=("banner", "representative"), required=True)
    parser.add_argument("--staging-dir", required=True, type=Path)
    parser.add_argument("--vault", type=Path, default=DEFAULT_VAULT)
    parser.add_argument("--metadata", type=Path)
    parser.add_argument("--candidate-url", action="append", default=[])
    parser.add_argument("--license", default="")
    parser.add_argument("--attribution", default="")
    parser.add_argument(
        "--derive-banner",
        action="store_true",
        help="Build a last-resort 16:9 full-bleed crop from usable official artwork",
    )
    parser.add_argument("--session", type=Path)
    parser.add_argument("--note", help="Vault-relative target note; required for representative images")
    args = parser.parse_args()
    if args.kind == "representative" and not args.note:
        parser.error("--note is required for representative images")

    try:
        budget_guard(args.session, 55)
    except (ValueError, TimeoutError) as error:
        print(json.dumps({"status": "budget-exhausted", "error": str(error)}, ensure_ascii=False), file=sys.stderr)
        return 4

    args.staging_dir.mkdir(parents=True, exist_ok=True)
    errors: list[dict[str, str]] = []
    best_square: tuple[int, Path, dict[str, str], str] | None = None
    for index, item in enumerate(candidate_urls(args), start=1):
        provisional = args.staging_dir / f"candidate-{index}.image"
        try:
            content_type = download(item["url"], provisional)
            width, height = dimensions(provisional)
            okay, reason = acceptable(args.kind, width, height)
            if not okay:
                if (
                    args.kind == "banner"
                    and args.derive_banner
                    and derivable_as_banner(width, height)
                ):
                    square = args.staging_dir / f"square-source-{index}.image"
                    provisional.replace(square)
                    area = width * height
                    if best_square is None or area > best_square[0]:
                        if best_square is not None:
                            best_square[1].unlink(missing_ok=True)
                        best_square = (area, square, item, content_type)
                    else:
                        square.unlink(missing_ok=True)
                errors.append({"url": item["url"], "reason": reason})
                provisional.unlink(missing_ok=True)
                continue
            extension = IMAGE_EXTENSIONS.get(content_type)
            if not extension:
                extension = Path(urlsplit(item["url"]).path).suffix.casefold()
            if extension not in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".tif", ".tiff", ".heic"}:
                extension = mimetypes.guess_extension(content_type) or ".image"
            suffix = "banner" if args.kind == "banner" else "image"
            filename = f"{slugify(args.subject)}-{suffix}{extension}"
            staged = args.staging_dir / filename
            provisional.replace(staged)
            digest = sha256_file(staged)
            duplicate = existing_sha_match(args.vault, digest, ["Strata/Banners", "Strata/Attachments", "Matter/Obsidian/Banners"])
            relative_folder = "Strata/Banners" if args.kind == "banner" else attachment_folder(args.vault, args.note)
            result = {
                "status": "existing-identical" if duplicate else "acquired",
                "kind": args.kind,
                "subject": args.subject,
                "staged_path": str(staged),
                "suggested_relative_path": duplicate or f"{relative_folder}/{filename}",
                "source_url": item["url"],
                "source_kind": item["source"],
                "license": args.license or None,
                "attribution": args.attribution or None,
                "width": width,
                "height": height,
                "sha256": digest,
                "duplicate_relative_path": duplicate,
                "rejections": errors,
            }
            print(json.dumps(result, ensure_ascii=False, indent=2))
            return 0
        except (HTTPError, URLError, TimeoutError, ValueError, OSError, subprocess.TimeoutExpired) as error:
            errors.append({"url": item["url"], "reason": str(error)})
            provisional.unlink(missing_ok=True)

    if args.kind == "banner" and args.derive_banner and best_square is not None:
        _, square, item, _ = best_square
        staged = args.staging_dir / f"{slugify(args.subject)}-banner.jpg"
        ffmpeg = shutil.which("ffmpeg")
        if ffmpeg:
            result = subprocess.run(
                [
                    ffmpeg, "-y", "-loglevel", "error", "-i", str(square),
                    "-filter_complex",
                    "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080",
                    "-frames:v", "1", str(staged),
                ],
                capture_output=True,
                text=True,
                timeout=30,
            )
            square.unlink(missing_ok=True)
            if result.returncode == 0 and staged.is_file():
                width, height = dimensions(staged)
                digest = sha256_file(staged)
                duplicate = existing_sha_match(args.vault, digest, ["Strata/Banners", "Matter/Obsidian/Banners"])
                print(json.dumps({
                    "status": "existing-identical" if duplicate else "acquired-derived",
                    "kind": "banner",
                    "subject": args.subject,
                    "staged_path": str(staged),
                    "suggested_relative_path": duplicate or f"Strata/Banners/{staged.name}",
                    "source_url": item["url"],
                    "source_kind": "derived-full-bleed-from-official-artwork",
                    "license": args.license or None,
                    "attribution": args.attribution or None,
                    "width": width,
                    "height": height,
                    "sha256": digest,
                    "duplicate_relative_path": duplicate,
                    "rejections": errors,
                }, ensure_ascii=False, indent=2))
                return 0
            errors.append({"url": item["url"], "reason": result.stderr.strip() or "ffmpeg banner derivation failed"})
        else:
            errors.append({"url": item["url"], "reason": "ffmpeg is unavailable for banner derivation"})
    print(
        json.dumps(
            {
                "status": "no-defensible-candidate",
                "kind": args.kind,
                "subject": args.subject,
                "rejections": errors,
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    return 4


if __name__ == "__main__":
    raise SystemExit(main())
