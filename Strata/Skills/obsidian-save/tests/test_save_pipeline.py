#!/usr/bin/env python3

from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
FIXTURES = Path(__file__).parent / "fixtures"
SKILL = ROOT / "SKILL.md"
sys.path.insert(0, str(SCRIPTS))

from commit_note import ensure_owner, ensure_representative, migrate_legacy_save_markers, rename_legacy_agent_heading, replace_agent
from route_capture import routes
from save_common import canonical_identity, file_lock, identity_key
from validate_note import validate


VALID_NOTE = """---
tags:
  - media/test
aliases:
  - Test Work
created: 2026-08-05
url: "https://www.youtube.com/watch?v=abcdefghijk"
cssclasses:
  - banner
  - banner-fade
---

![[test-banner.png|banner]]

> [!media-frame]
> ![[test-image.png|Abstract blue test image]]

## Why This Matters

> Placeholder

## Agent Notes

<!-- agent-save:start -->

### Abstract

Compact account grounded in the [canonical source](https://www.youtube.com/watch?v=abcdefghijk).
<!-- agent-save:end -->
"""
LEGACY_NOTE = VALID_NOTE.replace("## Agent Notes", "## Codex Notes").replace("agent-save", "codex-save")


def run(*args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, text=True, capture_output=True, check=check)


class SavePipelineTests(unittest.TestCase):
    def test_user_content_replaces_placeholder_under_first_h2(self) -> None:
        perspective = "On September 20, I tested the model myself."
        updated = ensure_owner(VALID_NOTE, perspective)
        self.assertNotIn("> Placeholder", updated)
        self.assertIn(f"## Why This Matters\n\n{perspective}\n\n## Agent Notes", updated)
        self.assertEqual(ensure_owner(updated, perspective), updated)

    def test_user_content_stays_in_first_h2_with_later_sections(self) -> None:
        note = "## My View\n\nAn earlier view.\n\n## Technical Notes\n\nKeep this.\n\n## Agent Notes\n"
        updated = ensure_owner(note, "A dated new view.")
        self.assertIn("An earlier view.\n\nA dated new view.\n\n## Technical Notes", updated)
        self.assertIn("## Technical Notes\n\nKeep this.\n\n## Agent Notes", updated)

    def test_structured_user_content_is_idempotent_before_agent_notes(self) -> None:
        note = VALID_NOTE
        perspective = "A first thought.\n\n## What Changed\n\n- A later thought."
        updated = ensure_owner(note, perspective)
        self.assertEqual(ensure_owner(updated, perspective), updated)
        self.assertIn("## What Changed\n\n- A later thought.\n\n## Agent Notes", updated)

    def test_user_content_can_target_existing_later_h2(self) -> None:
        note = "## First View\n\nKeep this.\n\n## Later View\n\nAn earlier thought.\n\n## Agent Notes\n"
        updated = ensure_owner(note, "### Current Questions\n\n- What changed?", "Later View")
        self.assertIn("## First View\n\nKeep this.\n\n## Later View", updated)
        self.assertIn("An earlier thought.\n\n### Current Questions\n\n- What changed?\n\n## Agent Notes", updated)
        self.assertEqual(ensure_owner(updated, "### Current Questions\n\n- What changed?", "Later View"), updated)
        with self.assertRaisesRegex(ValueError, "user section not found"):
            ensure_owner(note, "A thought.", "Missing View")

    def test_save_update_renames_legacy_heading_without_changing_markers(self) -> None:
        updated = rename_legacy_agent_heading(replace_agent(migrate_legacy_save_markers(LEGACY_NOTE), "### Abstract\n\nA revised account."))
        self.assertIn("## Agent Notes", updated)
        self.assertNotIn("## Codex Notes", updated)
        self.assertNotIn("codex-save", updated)
        self.assertEqual(updated.count("<!-- agent-save:start -->"), 1)
        self.assertEqual(updated.count("<!-- agent-save:end -->"), 1)
        self.assertEqual(rename_legacy_agent_heading(migrate_legacy_save_markers(ensure_owner(LEGACY_NOTE, "A new thought."))),
            ensure_owner(VALID_NOTE, "A new thought."))

    def test_new_agent_section_and_legacy_section_both_validate(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            vault = Path(directory)
            (vault / "Strata/Attachments").mkdir(parents=True)
            (vault / "Strata/Banners").mkdir(parents=True)
            (vault / "Strata/Attachments/test-image.png").write_bytes(b"image")
            (vault / "Strata/Banners/test-banner.png").write_bytes(b"banner")
            note = vault / "Test.md"
            for content in (VALID_NOTE, LEGACY_NOTE):
                note.write_text(content, encoding="utf-8")
                args = argparse.Namespace(note=note, vault=vault, standalone=True, require_agent=True, require_banner=True,
                    canonical_url="https://www.youtube.com/watch?v=abcdefghijk", no_duplicate=False,
                    strict_links=False, virtual_embed=[], allow_unresolved=[], min_agent_words=0,
                    min_agent_sections=0, session=None, ignore_note=[])
                self.assertEqual(validate(args)["errors"], [])

    def test_optional_obsidian_mcp_guidance_avoids_a_tool_contract(self) -> None:
        instructions = SKILL.read_text(encoding="utf-8")
        self.assertIn("Prefer a usable Obsidian MCP", instructions)
        self.assertIn("do not assume a server name, tool name, input shape, return shape, or capability set", instructions)
        self.assertIn("Fall back to the deterministic local helpers", instructions)

    def test_file_lock_cleans_up_and_reclaims_a_dead_owner(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "note.md.save"
            lock = target.with_suffix(target.suffix + ".lock")
            with file_lock(target):
                self.assertTrue(lock.is_dir())
            self.assertFalse(lock.exists())
            lock.mkdir()
            (lock / "owner.json").write_text(
                json.dumps({"pid": 1_000_000_000, "started_epoch": time.time() - 120, "token": "dead"}),
                encoding="utf-8",
            )
            with file_lock(target):
                self.assertTrue(lock.is_dir())
            self.assertFalse(lock.exists())

    def test_canonical_identities(self) -> None:
        cases = {
            "https://youtu.be/abcdefghijk?si=noise": "youtube_video:abcdefghijk",
            "https://www.youtube.com/watch?v=abcdefghijk&utm_source=x": "youtube_video:abcdefghijk",
            "spotify:track:4uLU6hMCjMI75M1A2tKUQC": "spotify_track:4uLU6hMCjMI75M1A2tKUQC",
            "https://open.spotify.com/album/6JWc4iAiJ9FjyK0B59ABb4?si=x": "spotify_album:6JWc4iAiJ9FjyK0B59ABb4",
            "https://doi.org/10.1000/TEST": "doi:10.1000/test",
            "https://arxiv.org/pdf/1706.03762.pdf": "arxiv:1706.03762",
            "ISBN 978-0-14-044913-6": "isbn:9780140449136",
            "https://www.imdb.com/title/tt0133093/?ref_=x": "imdb_title:tt0133093",
            "https://reddit.com/r/test/comments/abc123/title/": "reddit_post:abc123",
            "https://github.com/OpenAI/Codex/issues/42": "github_issue:openai/codex#42",
        }
        for source, expected in cases.items():
            self.assertEqual(identity_key(canonical_identity(source)), expected)

    def test_routing_fixtures(self) -> None:
        cases = json.loads((FIXTURES / "routing-cases.json").read_text(encoding="utf-8"))
        for item in cases:
            result = routes(item["metadata"], "", item.get("durable", True), False, False)
            self.assertEqual(result["object_type"], item["expected_type"], item["name"])
            self.assertEqual(result["candidates"][0]["path"], item["expected_first"], item["name"])

    def test_commentary_capture_requires_subject_before_routing(self) -> None:
        metadata = {
            "adapter": "youtube",
            "title": "An Essay About Tidewater Ambient",
            "identity": {"kind": "youtube_video", "id": "abcdefghijk"},
        }
        unresolved = routes(metadata, "Arc", True, False, False)
        self.assertTrue(unresolved["requires_subject_resolution"])
        self.assertEqual(unresolved["candidates"], [])
        self.assertIn("durable subject", unresolved["decision_rule"])

        resolved = routes(
            metadata,
            "Arc",
            True,
            False,
            False,
            subject_title="Tidewater Ambient",
            subject_domain="music",
            capture_relation="the captured essay discusses this musical scene",
        )
        self.assertFalse(resolved["requires_subject_resolution"])
        self.assertEqual(resolved["object_type"], "music")
        self.assertEqual(resolved["candidates"][0]["path"], "Continuum/Media/Music")
        self.assertEqual(resolved["durable_subject"]["title"], "Tidewater Ambient")

        with tempfile.TemporaryDirectory() as directory:
            metadata_path = Path(directory) / "metadata.json"
            metadata_path.write_text(json.dumps(metadata), encoding="utf-8")
            command = run(
                sys.executable,
                str(SCRIPTS / "route_capture.py"),
                "--metadata", str(metadata_path),
                check=False,
            )
            self.assertEqual(command.returncode, 3)
            self.assertTrue(json.loads(command.stdout)["requires_subject_resolution"])

    def test_validator_accepts_contract_and_rejects_marker_and_heading_damage(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            vault = Path(directory)
            (vault / "Strata/Banners").mkdir(parents=True)
            (vault / "Strata/Attachments").mkdir(parents=True)
            (vault / "Strata/Banners/test-banner.png").write_bytes(b"banner")
            (vault / "Strata/Attachments/test-image.png").write_bytes(b"image")
            note = vault / "Continuum/Media/Test Work.md"
            note.parent.mkdir(parents=True)
            note.write_text(VALID_NOTE, encoding="utf-8")
            arguments = argparse.Namespace(
                note=note,
                vault=vault,
                standalone=True,
                require_banner=True,
                require_agent=True,
                canonical_url="https://youtu.be/abcdefghijk",
                no_duplicate=False,
                strict_links=True,
                allow_unresolved=[],
                virtual_embed=[],
                ignore_note=[],
            )
            self.assertTrue(validate(arguments)["valid"])
            (vault / "Underwork/Long/Target.md").parent.mkdir(parents=True)
            (vault / "Underwork/Long/Target.md").write_text("---\ntags: []\n---\n", encoding="utf-8")
            note.write_text(
                VALID_NOTE.replace(
                    "Compact account grounded",
                    "Compact account connected to [[Underwork/Long/Target.md]] and grounded",
                ),
                encoding="utf-8",
            )
            missing_alias = validate(arguments)
            self.assertFalse(missing_alias["valid"])
            self.assertTrue(any("display alias" in error for error in missing_alias["errors"]))
            note.write_text(
                VALID_NOTE.replace(
                    "Compact account grounded",
                    "Compact account connected to [[Underwork/Long/Target.md|Target]] and grounded",
                ),
                encoding="utf-8",
            )
            self.assertTrue(validate(arguments)["valid"])
            note.write_text(VALID_NOTE, encoding="utf-8")
            without_classes = VALID_NOTE.replace("cssclasses:\n  - banner\n  - banner-fade\n", "")
            note.write_text(without_classes, encoding="utf-8")
            missing_classes = validate(arguments)
            self.assertFalse(missing_classes["valid"])
            self.assertTrue(any("cssclasses" in error.casefold() for error in missing_classes["errors"]))
            note.write_text(VALID_NOTE.replace("<!-- agent-save:start -->\n", "").replace("### Abstract", "#### Abstract"), encoding="utf-8")
            result = validate(arguments)
            self.assertFalse(result["valid"])
            self.assertTrue(any("marker" in error.casefold() for error in result["errors"]))
            self.assertTrue(any("heading ladder" in error.casefold() for error in result["errors"]))
            note.write_text(VALID_NOTE.replace("test-image.png|Abstract blue test image", "test-banner.png|Banner reused as body image"), encoding="utf-8")
            reused_banner = validate(arguments)
            self.assertFalse(reused_banner["valid"])
            self.assertTrue(any("distinct assets" in error for error in reused_banner["errors"]))

    def test_representative_replacement_keeps_exactly_one_frame(self) -> None:
        updated = ensure_representative(
            VALID_NOTE,
            "Strata/Attachments/replacement-image.png",
            "Replacement representative image",
        )
        self.assertEqual(updated.count("[!media-frame]"), 1)
        self.assertNotIn("test-image.png", updated)
        self.assertIn("replacement-image.png|Replacement representative image", updated)
        self.assertLess(updated.index("[!media-frame]"), updated.index("## Why This Matters"))

    def test_transactional_create_and_optimistic_update(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            vault = root / "vault"
            vault.mkdir()
            banner = root / "test-banner.png"
            image = root / "test-image.png"
            banner.write_bytes(b"banner")
            image.write_bytes(b"image")
            draft = root / "draft.md"
            draft.write_text(VALID_NOTE.replace("cssclasses:\n  - banner\n  - banner-fade\n", ""), encoding="utf-8")
            target = "Continuum/Media/Test Work.md"
            created = run(
                sys.executable,
                str(SCRIPTS / "commit_note.py"),
                "create",
                "--vault", str(vault),
                "--target", target,
                "--draft", str(draft),
                "--canonical-url", "https://youtu.be/abcdefghijk",
                "--banner", "Strata/Banners/test-banner.png",
                "--representative", "Strata/Attachments/test-image.png",
                "--representative-alt", "Abstract blue test image",
                "--asset", str(banner), "Strata/Banners/test-banner.png",
                "--asset", str(image), "Strata/Attachments/test-image.png",
            )
            self.assertEqual(json.loads(created.stdout)["status"], "created")
            target_path = vault / target
            created_text = target_path.read_text(encoding="utf-8")
            self.assertIn("cssclasses:\n  - banner\n  - banner-fade\n", created_text)
            self.assertEqual(
                created_text.split("---", 2)[2].strip().splitlines()[0],
                "![[test-banner.png|banner]]",
            )
            self.assertLess(created_text.index("[!media-frame]"), created_text.index("## Why This Matters"))
            old_sha = hashlib.sha256(target_path.read_bytes()).hexdigest()
            codex = root / "codex.md"
            codex.write_text("### Abstract\n\nUpdated compact account.\n", encoding="utf-8")
            target_path.write_text(target_path.read_text(encoding="utf-8") + "\nuser concurrent edit\n", encoding="utf-8")
            failed = run(
                sys.executable,
                str(SCRIPTS / "commit_note.py"),
                "update",
                "--vault", str(vault),
                "--target", target,
                "--agent-content", str(codex),
                "--canonical-url", "https://youtu.be/abcdefghijk",
                "--expected-sha256", old_sha,
                check=False,
            )
            self.assertNotEqual(failed.returncode, 0)
            self.assertIn("concurrent", failed.stderr)
            self.assertIn("user concurrent edit", target_path.read_text(encoding="utf-8"))

    def test_transactional_create_rejects_cyrillic_generated_paths_and_reused_image_bytes(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            vault = root / "vault"
            vault.mkdir()
            draft = root / "draft.md"
            draft.write_text(VALID_NOTE, encoding="utf-8")
            image = root / "source.png"
            image.write_bytes(b"same-raster")

            cyrillic = run(
                sys.executable,
                str(SCRIPTS / "commit_note.py"),
                "create",
                "--vault", str(vault),
                "--target", "Continuum/Media/Прибой.md",
                "--draft", str(draft),
                "--canonical-url", "https://youtu.be/abcdefghijk",
                check=False,
            )
            self.assertNotEqual(cyrillic.returncode, 0)
            self.assertIn("Cyrillic", cyrillic.stderr)

            reused = run(
                sys.executable,
                str(SCRIPTS / "commit_note.py"),
                "create",
                "--vault", str(vault),
                "--target", "Continuum/Media/Tidewater Ambient.md",
                "--draft", str(draft),
                "--canonical-url", "https://youtu.be/abcdefghijk",
                "--banner", "Strata/Banners/tidewater-ambient-banner.png",
                "--representative", "Strata/Attachments/tidewater-ambient-image.png",
                "--representative-alt", "Tidewater Ambient imagery",
                "--asset", str(image), "Strata/Banners/tidewater-ambient-banner.png",
                "--asset", str(image), "Strata/Attachments/tidewater-ambient-image.png",
                check=False,
            )
            self.assertNotEqual(reused.returncode, 0)
            self.assertIn("identical bytes", reused.stderr)

    def test_explicit_completeness_scope_requires_atomic_notes_or_reasons(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            vault = root / "vault"
            (vault / "Infinity").mkdir(parents=True)
            (vault / "Infinity/King.md").write_text("---\n---\n", encoding="utf-8")
            manifest = root / "scope.json"
            manifest.write_text(json.dumps({
                "scope": "explicit-completeness",
                "items": [
                    {"title": "King in Yellow", "kind": "book", "disposition": "atomic-note", "note": "Infinity/King.md"},
                    {"title": "One soundtrack credit", "kind": "track", "disposition": "incidental-credit"},
                ],
            }), encoding="utf-8")
            rejected = run(
                sys.executable, str(SCRIPTS / "save_scope_manifest.py"),
                "--manifest", str(manifest), "--vault", str(vault), "--require-committed", check=False,
            )
            self.assertNotEqual(rejected.returncode, 0)
            self.assertIn("needs a reason", rejected.stdout)
            manifest.write_text(json.dumps({
                "scope": "explicit-completeness",
                "items": [
                    {"title": "King in Yellow", "kind": "book", "disposition": "atomic-note", "note": "Infinity/King.md"},
                    {"title": "One soundtrack credit", "kind": "track", "disposition": "incidental-credit", "reason": "listed only as background music"},
                ],
            }), encoding="utf-8")
            accepted = run(
                sys.executable, str(SCRIPTS / "save_scope_manifest.py"),
                "--manifest", str(manifest), "--vault", str(vault), "--require-committed",
            )
            self.assertTrue(json.loads(accepted.stdout)["valid"])

    def test_asset_manifest_rejects_reused_source_and_missing_visual_review(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            first, second = root / "first.jpg", root / "second.jpg"
            first.write_bytes(b"first")
            second.write_bytes(b"second")
            manifest = root / "assets.json"
            manifest.write_text(json.dumps({"visual_reviewed": False, "assets": [
                {"note": "A.md", "role": "banner", "path": str(first), "source_url": "https://example.com/a.jpg", "generated": False},
                {"note": "A.md", "role": "representative", "path": str(second), "source_url": "https://example.com/a.jpg", "generated": False},
            ]}), encoding="utf-8")
            rejected = run(sys.executable, str(SCRIPTS / "asset_manifest.py"), "--manifest", str(manifest), "--require-review", check=False)
            self.assertNotEqual(rejected.returncode, 0)
            self.assertIn("reused", rejected.stdout)
            self.assertIn("visual review", rejected.stdout)
            manifest.write_text(json.dumps({"visual_reviewed": True, "assets": [
                {"note": "A.md", "role": "banner", "path": str(first), "source_url": "https://example.com/a.jpg", "generated": False},
                {"note": "A.md", "role": "representative", "path": str(second), "source_url": "https://example.com/b.jpg", "generated": False},
            ]}), encoding="utf-8")
            accepted = run(sys.executable, str(SCRIPTS / "asset_manifest.py"), "--manifest", str(manifest), "--require-review")
            self.assertTrue(json.loads(accepted.stdout)["valid"])

    def test_depth_gate_rejects_an_atomic_stub(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            vault = Path(directory)
            (vault / "Strata/Banners").mkdir(parents=True)
            (vault / "Strata/Attachments").mkdir(parents=True)
            (vault / "Strata/Banners/test-banner.png").write_bytes(b"banner")
            (vault / "Strata/Attachments/test-image.png").write_bytes(b"image")
            note = vault / "Infinity/Test.md"
            note.parent.mkdir(parents=True)
            note.write_text(VALID_NOTE, encoding="utf-8")
            arguments = argparse.Namespace(
                note=note, vault=vault, standalone=True, require_banner=True, require_agent=True,
                canonical_url="https://youtu.be/abcdefghijk", no_duplicate=False, strict_links=True,
                allow_unresolved=[], virtual_embed=[], ignore_note=[], min_agent_words=120, min_agent_sections=3,
            )
            result = validate(arguments)
            self.assertFalse(result["valid"])
            self.assertTrue(any("too thin" in error or "too few H3" in error for error in result["errors"]))

    def test_update_can_repair_one_legacy_missing_start_marker(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            vault = root / "vault"
            vault.mkdir()
            banner = vault / "Strata/Banners/test-banner.png"
            image = vault / "Strata/Attachments/test-image.png"
            banner.parent.mkdir(parents=True)
            image.parent.mkdir(parents=True)
            banner.write_bytes(b"banner")
            image.write_bytes(b"image")
            note = vault / "Infinity/Legacy.md"
            note.parent.mkdir(parents=True)
            legacy = VALID_NOTE.replace("<!-- agent-save:start -->\n\n", "")
            note.write_text(legacy, encoding="utf-8")
            old_sha = hashlib.sha256(note.read_bytes()).hexdigest()
            codex = root / "codex.md"
            codex.write_text("### Abstract\n\nRepaired account with an [inline source](https://example.com).\n", encoding="utf-8")
            repaired = run(
                sys.executable,
                str(SCRIPTS / "commit_note.py"),
                "update",
                "--vault", str(vault),
                "--target", "Infinity/Legacy.md",
                "--agent-content", str(codex),
                "--canonical-url", "https://youtu.be/abcdefghijk",
                "--expected-sha256", old_sha,
                "--repair-agent-boundary",
            )
            self.assertEqual(json.loads(repaired.stdout)["status"], "updated")
            repaired_text = note.read_text(encoding="utf-8")
            self.assertEqual(repaired_text.count("<!-- agent-save:start -->"), 1)
            self.assertEqual(repaired_text.count("<!-- agent-save:end -->"), 1)

    def test_ledger_rebuild_and_lookup(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            vault = root / "vault"
            note = vault / "Continuum/Media/Test.md"
            note.parent.mkdir(parents=True)
            note.write_text('---\nurl: "https://youtu.be/abcdefghijk"\n---\n', encoding="utf-8")
            ledger = root / "ledger.json"
            run(sys.executable, str(SCRIPTS / "identity_ledger.py"), "--ledger", str(ledger), "rebuild", "--vault", str(vault))
            checked = run(
                sys.executable,
                str(SCRIPTS / "identity_ledger.py"),
                "--ledger", str(ledger),
                "check",
                "--source", "https://www.youtube.com/watch?v=abcdefghijk",
                check=False,
            )
            self.assertEqual(checked.returncode, 3)
            self.assertEqual(json.loads(checked.stdout)["matches"][0]["note"], "Continuum/Media/Test.md")

    def test_probe_ranking_excludes_instructions_and_single_generic_terms(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            vault = Path(directory)
            (vault / "Underwork").mkdir()
            (vault / "Continuum/Travel").mkdir(parents=True)
            (vault / "AGENTS.md").write_text("lantern tide arc hollowreach " * 20, encoding="utf-8")
            (vault / "Underwork/Media References.md").write_text("---\ntags:\n  - art/worldbuilding/hollow-reach/reference\n---\nLantern tide arc editing reference", encoding="utf-8")
            (vault / "Continuum/Travel/Iceland.md").write_text("architecture arc travel", encoding="utf-8")
            result = run(
                sys.executable,
                str(SCRIPTS / "probe_vault.py"),
                "--vault", str(vault),
                "--title", "The Lantern Tide Arc",
                "--keywords", "lantern", "tide", "arc", "hollowreach",
            )
            candidates = [item["path"] for item in json.loads(result.stdout)["connection_candidates"]]
            self.assertEqual(candidates, ["Underwork/Media References.md"])

    def test_session_budget_becomes_unlimited_after_steering(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            session = Path(directory) / "session.json"
            run(sys.executable, str(SCRIPTS / "save_session.py"), "--session", str(session), "begin", "--capture-id", "test")
            marked = run(
                sys.executable,
                str(SCRIPTS / "save_session.py"),
                "--session", str(session),
                "mark", "--phase", "resolve", "--state", "start", "--detail", "fixture",
            )
            marked_state = json.loads(marked.stdout)
            self.assertTrue(any(
                item["kind"] == "phase" and item["phase"] == "resolve" and item["state"] == "start"
                for item in marked_state["events"]
            ))
            state = json.loads(session.read_text(encoding="utf-8"))
            self.assertEqual(state["budget_seconds"], 240)
            state["started_epoch"] -= 300
            session.write_text(json.dumps(state), encoding="utf-8")
            expired = run(sys.executable, str(SCRIPTS / "save_session.py"), "--session", str(session), "check", check=False)
            self.assertEqual(expired.returncode, 4)
            self.assertFalse(json.loads(expired.stdout)["within_budget"])
            metadata = Path(directory) / "metadata.json"
            metadata.write_text(json.dumps({"adapter": "spotify", "identity": {"kind": "spotify_track", "id": "abc"}, "title": "Track"}), encoding="utf-8")
            guarded = run(
                sys.executable,
                str(SCRIPTS / "route_capture.py"),
                "--metadata", str(metadata),
                "--session", str(session),
                check=False,
            )
            self.assertNotEqual(guarded.returncode, 0)
            self.assertIn("budget", guarded.stderr.casefold())
            run(sys.executable, str(SCRIPTS / "save_session.py"), "--session", str(session), "steer", "--reason", "test steering")
            checked = run(sys.executable, str(SCRIPTS / "save_session.py"), "--session", str(session), "check", "--reserve-seconds", "999999")
            result = json.loads(checked.stdout)
            self.assertTrue(result["within_budget"])
            self.assertTrue(result["steered"])
            self.assertIsNone(result["remaining_seconds"])
            unguarded = run(
                sys.executable,
                str(SCRIPTS / "route_capture.py"),
                "--metadata", str(metadata),
                "--session", str(session),
            )
            self.assertEqual(json.loads(unguarded.stdout)["object_type"], "music")

    def test_daily_append_is_concurrency_safe(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            vault = root / "vault"
            daily = vault / "Continuum/Time/Daily/2026-08-05.md"
            daily.parent.mkdir(parents=True)
            daily.write_text(
                "---\ntags:\n  - time/daily\n---\n\n<!-- journal-graph:start -->\n<!-- journal-graph:end -->\n\n"
                "## Tasks\n\n## Notes\n\n## Agent Review\n\n- #agent/message Kept last.\n",
                encoding="utf-8",
            )
            first = root / "first.txt"
            second = root / "second.txt"
            first.write_text("first concurrent capture", encoding="utf-8")
            second.write_text("second concurrent capture", encoding="utf-8")
            commands = [
                [sys.executable, str(SCRIPTS / "append_daily_capture.py"), "--vault", str(vault), "--content", str(first), "--heading", "First Capture", "--date", "2026-08-05"],
                [sys.executable, str(SCRIPTS / "append_daily_capture.py"), "--vault", str(vault), "--content", str(second), "--heading", "Second Capture", "--date", "2026-08-05"],
            ]
            processes = [subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True) for command in commands]
            for process in processes:
                stdout, stderr = process.communicate(timeout=10)
                self.assertEqual(process.returncode, 0, stderr)
            content = daily.read_text(encoding="utf-8")
            notes = content.split("## Notes", 1)[1].split("## Agent Review", 1)[0]
            self.assertIn("first concurrent capture", notes)
            self.assertIn("second concurrent capture", notes)
            self.assertLess(content.index("### First Capture"), content.index("## Agent Review"))
            self.assertLess(content.index("### Second Capture"), content.index("## Agent Review"))
            missing = subprocess.run(
                [sys.executable, str(SCRIPTS / "append_daily_capture.py"), "--vault", str(vault), "--content", str(first), "--heading", "Missing Day", "--date", "2026-08-06"],
                capture_output=True, text=True,
            )
            self.assertNotEqual(missing.returncode, 0)
            self.assertFalse((vault / "Continuum/Time/Daily/2026-08-06.md").exists())

    def test_generalized_steering_changes_the_contract_not_a_ledger(self) -> None:
        skill = SKILL.read_text(encoding="utf-8")
        contract = (ROOT / "references/pipeline-contract.md").read_text(encoding="utf-8")
        policy = skill + contract
        self.assertIn("complete behavioral policy", skill)
        self.assertIn("revise this skill and the directly affected reference contract", skill)
        self.assertIn("Do not keep a calibration file", contract)
        self.assertIn("tests/fixtures/save-contract.json", contract)
        self.assertNotIn("CALIBRATION.md", policy)
        self.assertNotIn("record_calibration.py", policy)

    def test_durable_research_depth_policy_is_regressed(self) -> None:
        cases = json.loads((FIXTURES / "save-contract.json").read_text(encoding="utf-8"))
        case = next(item for item in cases if item["id"] == "durable-research-depth")
        expected = case["expected"]
        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        depth = (ROOT / "references/research-depth.md").read_text(encoding="utf-8")
        profile = (ROOT / "references/vault-profile.md").read_text(encoding="utf-8")
        self.assertTrue(expected["research_beyond_metadata"])
        self.assertIn("adapter metadata as identity evidence, not adequate research", skill)
        self.assertIn("exact entities first, then concepts and relationships", profile)
        self.assertIn("State the relationship in the surrounding sentence", depth)
        self.assertIn("three to six strong sources", depth)
        self.assertNotIn("one to four short paragraphs", skill + profile)

    def test_subject_first_steering_contract_is_regressed(self) -> None:
        cases = json.loads((FIXTURES / "save-contract.json").read_text(encoding="utf-8"))
        case = next(item for item in cases if item["id"] == "subject-first-commentary-routing")
        expected = case["expected"]
        skill = SKILL.read_text(encoding="utf-8")
        profile = (ROOT / "references/vault-profile.md").read_text(encoding="utf-8")
        self.assertEqual(expected["route"], "Continuum/Media/Music")
        self.assertTrue(expected["require_explicit_subject_resolution"])
        self.assertTrue(expected["preserve_captured_work_when_independently_cultural_or_technical"])
        self.assertTrue(expected["forbid_cyrillic_generated_paths"])
        self.assertTrue(expected["forbid_reused_banner_and_representative_source"])
        self.assertIn("captured artifact from its durable subject", skill)
        self.assertIn("formulation, reception, technique, or cultural role", skill)
        self.assertIn("New generated note and asset paths must not contain Cyrillic", skill)
        self.assertIn("banner and representative image must be different source images", skill)
        self.assertIn("not the default home for anything explanatory", profile)

    def test_spoken_durable_subject_routes_through_save(self) -> None:
        cases = json.loads((FIXTURES / "save-contract.json").read_text(encoding="utf-8"))
        case = next(item for item in cases if item["id"] == "spoken-durable-subject-augmentation")
        expected = case["expected"]
        skill = SKILL.read_text(encoding="utf-8")
        contract = (ROOT / "references/pipeline-contract.md").read_text(encoding="utf-8")
        authoring = (ROOT.parent / "obsidian-authoring/SKILL.md").read_text(encoding="utf-8")
        self.assertEqual(expected["handoff"], "save")
        self.assertTrue(expected["preserve_spoken_perspective_under_first_h2"])
        self.assertIn("Complete this full save workflow", skill)
        self.assertIn("audio-originated request for a durable note", contract)
        self.assertIn("do not stop at an authoring-only note", authoring)

    def test_atomic_save_granularity_contract_is_regressed(self) -> None:
        cases = json.loads((FIXTURES / "save-contract.json").read_text(encoding="utf-8"))
        case = next(item for item in cases if item["id"] == "atomic-save-granularity")
        expected = case["expected"]
        skill = SKILL.read_text(encoding="utf-8")
        profile = (ROOT / "references/vault-profile.md").read_text(encoding="utf-8")
        granularity = (ROOT / "references/note-granularity.md").read_text(encoding="utf-8")
        self.assertEqual(expected["keep_parent_when"], "one clear purpose")
        self.assertIn("independent_title", expected["extract_only_if"])
        self.assertTrue(expected["preserve_owner_prose_in_parent"])
        self.assertIn("note-granularity.md", skill)
        self.assertIn("at least two concrete connections or future uses", skill)
        self.assertIn("do not manufacture thin notes", profile)
        self.assertIn("One strong question can justify a standalone article", granularity)

    def test_explicit_related_work_correction_is_regressed(self) -> None:
        cases = json.loads((FIXTURES / "save-contract.json").read_text(encoding="utf-8"))
        case = next(item for item in cases if item["id"] == "explicit-related-work-completeness")
        expected = case["expected"]
        skill = SKILL.read_text(encoding="utf-8")
        depth = (ROOT / "references/research-depth.md").read_text(encoding="utf-8")
        self.assertEqual(expected["scope_manifest"], "required")
        self.assertEqual(expected["minimum_agent_words"], 450)
        self.assertIn("explicit-completeness mode", skill)
        self.assertIn("save_scope_manifest.py", skill)
        self.assertIn("asset_manifest.py", skill)
        self.assertIn("450 useful agent-owned words", depth)

    def test_connections_and_sources_are_integrated_by_default(self) -> None:
        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        depth = (ROOT / "references/research-depth.md").read_text(encoding="utf-8")
        self.assertIn("do not add a standalone `### Connections` section", skill)
        self.assertIn("Do not add a standalone `### Sources` section by default", skill)
        self.assertIn("Integrate each wiki-link into the section", depth)
        self.assertIn("source links inline beside the claims", depth)
        template = skill.split("Use this owned boundary:", 1)[1].split("On an existing note", 1)[0]
        self.assertNotIn("### Connections", template)
        self.assertNotIn("### Sources", template)

    def test_conversational_clipboard_is_lightly_journal_edited(self) -> None:
        cases = json.loads((FIXTURES / "save-contract.json").read_text(encoding="utf-8"))
        case = next(item for item in cases if item["id"] == "clipboard-conversation-normalization")
        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        contract = (ROOT / "references/pipeline-contract.md").read_text(encoding="utf-8")
        expected = case["expected"]
        self.assertEqual(expected["output"], "lightly_copy_edited_journal_entry")
        self.assertIn("conversational clipboard fragments", skill)
        self.assertIn("make only a light journal edit", skill)
        self.assertIn("retain the owner's first-person voice, sequence of thought, attitude, profanity, ambiguity, repetitions, and memorable phrasing", skill)
        self.assertIn("Do not summarize, interpret, sanitize, reorder for argument, or substitute the agent's voice", skill)
        self.assertIn("Keep the words of direct quotations unchanged", skill)
        self.assertIn("light journal edit", contract)
        self.assertIn("Do not summarize, interpret, sanitize, or rewrite it into agent prose", contract)

    def test_media_frame_requires_alt_text_for_visible_caption(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            vault = Path(directory)
            (vault / "Strata/Banners").mkdir(parents=True)
            (vault / "Strata/Attachments").mkdir(parents=True)
            (vault / "Strata/Banners/test-banner.png").write_bytes(b"banner")
            (vault / "Strata/Attachments/test-image.png").write_bytes(b"image")
            note = vault / "Infinity/Test.md"
            note.parent.mkdir(parents=True)
            note.write_text(VALID_NOTE.replace("|Abstract blue test image", ""), encoding="utf-8")
            arguments = argparse.Namespace(
                note=note,
                vault=vault,
                standalone=True,
                require_banner=True,
                require_agent=True,
                canonical_url="https://youtu.be/abcdefghijk",
                no_duplicate=False,
                strict_links=True,
                allow_unresolved=[],
                virtual_embed=[],
                ignore_note=[],
            )
            result = validate(arguments)
            self.assertFalse(result["valid"])
            self.assertTrue(any("visible caption" in error for error in result["errors"]))
            frame = "> [!media-frame]\n> ![[test-image.png|Abstract blue test image]]"
            moved = VALID_NOTE.replace(frame + "\n\n## Why This Matters", "## Why This Matters\n\n" + frame)
            note.write_text(moved, encoding="utf-8")
            misplaced = validate(arguments)
            self.assertFalse(misplaced["valid"])
            self.assertTrue(any("before the first heading" in error for error in misplaced["errors"]))

    def test_banner_geometry_prefers_16_by_9_or_10(self) -> None:
        module_path = SCRIPTS / "acquire_image.py"
        spec = importlib.util.spec_from_file_location("acquire_image_test", module_path)
        module = importlib.util.module_from_spec(spec)
        assert spec and spec.loader
        spec.loader.exec_module(module)
        self.assertTrue(module.acceptable("banner", 1920, 1080)[0])
        self.assertTrue(module.acceptable("banner", 1920, 1200)[0])
        self.assertFalse(module.acceptable("banner", 1920, 640)[0])
        self.assertFalse(module.acceptable("banner", 1000, 800)[0])
        self.assertFalse(module.acceptable("banner", 3000, 1000)[0])
        self.assertTrue(module.derivable_as_banner(1200, 630))
        self.assertTrue(module.derivable_as_banner(1000, 1000))
        self.assertFalse(module.derivable_as_banner(240, 240))
        self.assertFalse(module.derivable_as_banner(2400, 500))

    def test_spotify_next_data_extracts_related_album(self) -> None:
        module_path = SCRIPTS / "resolve_source.py"
        spec = importlib.util.spec_from_file_location("resolve_source_test", module_path)
        module = importlib.util.module_from_spec(spec)
        assert spec and spec.loader
        spec.loader.exec_module(module)
        payload = {"props": {"pageProps": {"state": {"data": {"entity": {"title": "Track", "relatedEntityUri": "spotify:album:album123"}}}}}}
        document = '<script id="__NEXT_DATA__" type="application/json">' + json.dumps(payload) + "</script>"
        parsed = module._next_data(document)
        entity = parsed["props"]["pageProps"]["state"]["data"]["entity"]
        self.assertEqual(identity_key(canonical_identity(entity["relatedEntityUri"])), "spotify_album:album123")
        parser = module.MetadataParser()
        parser.feed('<meta name="music:album" content="https://open.spotify.com/album/album123"><meta name="music:album:track" content="7">')
        self.assertEqual(identity_key(canonical_identity(parser.meta["music:album"])), "spotify_album:album123")
        self.assertEqual(parser.meta["music:album:track"], "7")


if __name__ == "__main__":
    unittest.main(verbosity=2)
