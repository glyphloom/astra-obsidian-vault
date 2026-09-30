from __future__ import annotations

import json
import importlib.util
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).parents[1] / "scripts" / "audio_transcripts.py"
CSS = Path(__file__).parents[4] / ".obsidian/snippets/agent-callouts.css"
SPEC = importlib.util.spec_from_file_location("audio_transcripts", SCRIPT)
audio_transcripts = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(audio_transcripts)
from daily_audio import context, discovery, media


class AudioTranscriptTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.vault = Path(self.temp.name) / "vault"; self.vault.mkdir()
        self.backups = Path(self.temp.name) / "backups"
        (self.vault / "Strata/Attachments").mkdir(parents=True)

    def tearDown(self): self.temp.cleanup()

    def write(self, rel, value):
        path = self.vault / rel; path.parent.mkdir(parents=True, exist_ok=True); path.write_bytes(value if isinstance(value, bytes) else value.encode()); return path

    def audio(self, name="Recording 20260922000000.m4a"):
        path = self.vault / "Strata/Attachments" / name; path.write_bytes(b"audio bytes"); return path

    def invoke(self, *args, ok=True):
        result = subprocess.run([sys.executable, str(SCRIPT), "--vault", str(self.vault), *args], text=True, capture_output=True)
        if ok: self.assertEqual(result.returncode, 0, result.stderr)
        return result

    def discover(self): return json.loads(self.invoke("discover").stdout)

    def test_discovery_exclusions_vocabulary_and_noop(self):
        self.write("Empty.md", "No audio.\n")
        self.write("Named.md", "---\naliases:\n  - Alias One\n  - Alias Two\n---\n")
        self.write("Strata/Templates/Template.md", "![[voice.m4a]]\n")
        self.write("Strata/Skills/Noise.md", "---\naliases: [Noisy Alias]\n---\n")
        self.write("Matter/Obsidian/Obsidian Markdown Cheatsheet.md", "![[voice.m4a]]\n")
        self.write("Artifacts/Old.md", "![[voice.m4a]]\n")
        self.audio()
        self.assertEqual(self.discover(), {"pending": [], "issues": []})
        vocab = json.loads(self.invoke("vocabulary").stdout)
        self.assertIn("Named", vocab["terms"]); self.assertIn("Alias One", vocab["terms"])
        self.assertNotIn("Template", vocab["terms"]); self.assertNotIn("Old", vocab["terms"])
        self.assertNotIn("Noise", vocab["terms"]); self.assertNotIn("Noisy Alias", vocab["terms"])

    def test_vocabulary_keeps_explicit_terms_first_when_global_terms_exceed_budget(self):
        config = self.write("vocabulary.txt", "# Daily names\nNorthwind\nSam\n")
        for number in range(80):
            self.write(f"Matter/Global {number:02d} {'word ' * 8}.md", "")

        with patch.object(context, "VOCABULARY_CONFIG", config):
            terms = context.vocabulary(self.vault.resolve())
        vocabulary = {"terms": terms, "prompt": context.prompt_for(terms)}
        self.assertEqual(vocabulary["terms"][:2], ["Northwind", "Sam"])
        self.assertTrue(vocabulary["prompt"].startswith("Northwind, Sam, "))
        self.assertLessEqual(len(vocabulary["prompt"]), 2000)
        self.assertNotIn(vocabulary["terms"][-1], vocabulary["prompt"])
        prompt_terms = vocabulary["prompt"].split(", ")
        self.assertEqual(prompt_terms, vocabulary["terms"][:len(prompt_terms)])

    def test_vocabulary_note_context_prioritizes_local_links_and_project_folder(self):
        config = self.write("vocabulary.txt", "Northwind\n")
        self.write("Underwork/Northwind/Launch Checklist.md", (
            "---\naliases: [Launch List]\n---\n"
            "Work from [[Underwork/Northwind/Brand Guide|the brand guide]].\n"
        ))
        self.write("Matter/Unrelated Global.md", "")

        with patch.object(context, "VOCABULARY_CONFIG", config):
            terms = context.vocabulary(self.vault.resolve(), "Underwork/Northwind/Launch Checklist.md")
        self.assertEqual(terms[:2], ["Northwind", "Launch Checklist"])
        self.assertLess(terms.index("Launch List"), terms.index("Unrelated Global"))
        self.assertLess(terms.index("Brand Guide"), terms.index("Unrelated Global"))
        self.assertLess(terms.index("Northwind"), terms.index("Unrelated Global"))

    def test_unresolved_reports_only_daily_agent_bullets_deterministically(self):
        self.write("Continuum/Time/Daily/2026-09-20.md", (
            "## Agent Review\n"
            "- Ask who Sam is before creating a person note. #agent/unresolved\n"
            "- #agent/unresolved-follow-up is a different tag.\n"
        ))
        self.write("Continuum/Time/Daily/2026-09-21.md", "- Resolve this. #agent/unresolved\n")
        self.write("Underwork/Not Daily.md", "- Do not report this. #agent/unresolved\n")
        self.write("Artifacts/Old Daily.md", "- Do not report this. #agent/unresolved\n")

        result = json.loads(self.invoke("unresolved").stdout)
        self.assertEqual(result, {"unresolved": [
            {"note": "Continuum/Time/Daily/2026-09-20.md", "line": 2,
             "text": "- Ask who Sam is before creating a person note. #agent/unresolved"},
            {"note": "Continuum/Time/Daily/2026-09-21.md", "line": 1,
             "text": "- Resolve this. #agent/unresolved"},
        ]})
        scoped = json.loads(self.invoke("unresolved", "--note", "Continuum/Time/Daily/2026-09-21.md").stdout)
        self.assertEqual(scoped, {"unresolved": [result["unresolved"][1]]})

    def test_unresolved_keeps_structured_review_context_and_clarification_space(self):
        self.write("Continuum/Time/Daily/2026-09-22.md", (
            "## Agent Review\n"
            "- Identify the unnamed colleague. #agent/unresolved\n"
            "  Heard during the Northwind discussion.\n"
            "  - Your clarification:\n"
            "- Identify the other person. #agent/unresolved\n"
            "  - Your clarification: It is Alex.\n"
        ))
        unresolved = json.loads(self.invoke("unresolved").stdout)["unresolved"]
        self.assertEqual(unresolved[0]["text"], "- Identify the unnamed colleague. #agent/unresolved")
        self.assertEqual(unresolved[0]["context"], "Heard during the Northwind discussion.\n- Your clarification:")
        self.assertEqual(unresolved[0]["clarification"], "")
        self.assertEqual(unresolved[1]["context"], "- Your clarification: It is Alex.")
        self.assertEqual(unresolved[1]["clarification"], "It is Alex.")

    def test_agent_comments_reads_user_tags_at_any_depth_in_final_agent_review(self):
        self.write("Continuum/Time/Daily/2026-09-22.md", (
            "## Agent Review\n"
            "- #user/inbox Fix the first thing.\n"
            "## Notes\n"
            "- #user/request Not in the final review section.\n"
            "## Agent Review\n"
            "- #agent/unresolved Separate workflow item.\n"
            "- #user/inbox Handle this final comment.\n"
            "- #agent/message Agent history.\n"
            "\t- #user/clarification The surname is different.\n"
            "  - #user/request Split that note.\n"
            "- #user/requested is not a user tag.\n"
            "- #agent/request Legacy prefix is still input.\n"
        ))
        result = json.loads(self.invoke("agent-comments").stdout)
        note = "Continuum/Time/Daily/2026-09-22.md"
        self.assertEqual(result, {"comments": [
            {"note": note, "line": 7, "text": "- #user/inbox Handle this final comment.", "kind": "inbox"},
            {"note": note, "line": 9, "text": "\t- #user/clarification The surname is different.", "kind": "clarification"},
            {"note": note, "line": 10, "text": "  - #user/request Split that note.", "kind": "request"},
            {"note": note, "line": 12, "text": "- #agent/request Legacy prefix is still input.", "kind": "request"},
        ]})

    def test_processed_instruction_footer_is_excluded_from_active_review_parsing(self):
        self.write("Continuum/Time/Daily/2026-09-22.md", (
            "## Agent Review\n"
            "- #user/inbox Still pending.\n"
            "- #agent/unresolved **Person: active**\n"
            "  - Your clarification:\n"
            "\n## Processed Agent Instructions\n"
            "### Earlier Daily Intake\n"
            "> [!agent-instruction]- Processed instruction\n"
            "> #user/inbox This is history, not pending.\n"
            "- #agent/unresolved **Person: archived**\n"
        ))
        self.assertEqual(json.loads(self.invoke("agent-comments").stdout)["comments"], [{
            "note": "Continuum/Time/Daily/2026-09-22.md", "line": 2,
            "text": "- #user/inbox Still pending.", "kind": "inbox",
        }])
        self.assertEqual(json.loads(self.invoke("unresolved").stdout)["unresolved"], [{
            "note": "Continuum/Time/Daily/2026-09-22.md", "line": 3,
            "text": "- #agent/unresolved **Person: active**",
            "context": "- Your clarification:",
            "clarification": "",
        }])

    def test_entrypoint_reexports_workflow_surface_and_preserves_commands(self):
        self.assertIs(audio_transcripts.scan, discovery.scan)
        self.assertIs(audio_transcripts.transcribe_audio, media.transcribe_audio)
        parsed = audio_transcripts.cli().parse_args(["--vault", str(self.vault), "unresolved"])
        self.assertEqual(parsed.command, "unresolved")

    def test_discovery_uses_only_recognized_voice_filenames(self):
        self.audio("telegram-voice-unique.oga")
        silent_video = self.audio("silent.mp4")
        self.write("Note.md", "![[telegram-voice-unique.oga]]\n![[silent.mp4]]\n")
        with patch.object(discovery, "has_audio_stream", return_value=False) as probe:
            pending, issues = audio_transcripts.scan(self.vault.resolve())
        self.assertEqual(pending, [{"note": "Note.md", "audio": "Strata/Attachments/telegram-voice-unique.oga"}])
        self.assertEqual(issues, [])
        probe.assert_not_called()

    def test_discovery_ignores_ambiguous_media_but_keeps_legacy_managed_audio_valid(self):
        self.audio("music.mp3")
        self.audio("AgADQx7AAm9LbWt-example1.oga")
        self.audio("Recording 20260922123456.m4a")
        self.audio("telegram-voice-unique.ogg")
        self.audio("forwarded-voice.ogg")
        self.write("Note.md", (
            "![[music.mp3]]\n"
            "![[AgADQx7AAm9LbWt-example1.oga|Telegram audio]]\n"
            "![[Recording 20260922123456.m4a]]\n"
            "![[telegram-voice-unique.ogg]]\n"
            "![[forwarded-voice.ogg]]\n"
        ))
        self.assertEqual(self.discover(), {"pending": [
            {"note": "Note.md", "audio": "Strata/Attachments/Recording 20260922123456.m4a"},
            {"note": "Note.md", "audio": "Strata/Attachments/telegram-voice-unique.ogg"},
        ], "issues": []})
        self.write("Managed.md", (
            '<!-- agent-audio-transcript:start file="Strata/Attachments/AgADQx7AAm9LbWt-example1.oga" -->\n'
            '> [!audio-transcript] Spoken\n> ![[AgADQx7AAm9LbWt-example1.oga|Telegram audio]]\n>\n> Reviewed.\n'
            '<!-- agent-audio-transcript:end file="Strata/Attachments/AgADQx7AAm9LbWt-example1.oga" -->\n'
        ))
        pending, issues = audio_transcripts.scan(self.vault.resolve())
        self.assertEqual(issues, [])
        self.assertEqual(len(pending), 2)

    def test_insert_wraps_audio_and_quoted_transcript_then_second_discovery_is_noop(self):
        audio = self.audio(); note = self.write("Note.md", b"before\r\n![[Recording 20260922000000.m4a|Recorded locally]]\r\nafter\r\n")
        old = note.read_bytes(); transcript = self.write("final.txt", "Hello, world.\n\nSecond paragraph.")
        item = self.discover()["pending"][0]
        result = self.invoke("insert", "--note", item["note"], "--audio", item["audio"], "--transcript-file", str(transcript), "--backup-dir", str(self.backups))
        backup = Path(json.loads(result.stdout)["backup"]); self.assertEqual(backup.read_bytes(), old)
        data = note.read_bytes(); self.assertTrue(data.startswith(
            b'before\r\n<!-- agent-audio-transcript:start file="Strata/Attachments/Recording 20260922000000.m4a" -->\r\n'
            b'> [!audio-transcript] Spoken\r\n> ![[Recording 20260922000000.m4a|Recorded locally]]\r\n>\r\n'
            b'> Hello, world.\r\n>\r\n> Second paragraph.\r\n'
        ))
        self.assertTrue(data.endswith(b"-->\r\nafter\r\n")); self.assertEqual(audio.read_bytes(), b"audio bytes")
        self.assertEqual(data.count(b"![[Recording 20260922000000.m4a|Recorded locally]]"), 1)
        self.assertEqual(self.discover(), {"pending": [], "issues": []})

    def test_imported_legacy_audio_markers_remain_managed(self):
        self.audio()
        note = self.write("Note.md", (
            '<!-- codex-audio-transcript:start file="Strata/Attachments/Recording 20260922000000.m4a" -->\n'
            '> [!audio-transcript] Spoken\n> ![[Recording 20260922000000.m4a]]\n>\n> Reviewed.\n'
            '<!-- codex-audio-transcript:end file="Strata/Attachments/Recording 20260922000000.m4a" -->\n'
        ))
        self.assertEqual(self.discover(), {"pending": [], "issues": []})
        self.write("redo.txt", "Revised.")
        self.invoke("replace", "--note", "Note.md", "--audio", "Strata/Attachments/Recording 20260922000000.m4a",
                    "--transcript-file", str(self.vault / "redo.txt"), "--backup-dir", str(self.backups))
        self.assertIn(b"<!-- agent-audio-transcript:start", note.read_bytes())
        self.assertNotIn(b"<!-- codex-audio-transcript:start", note.read_bytes())

    def test_multiple_embeds_redo_and_ambiguity_refusal(self):
        self.audio("telegram-voice-one.ogg"); self.audio("telegram-voice-two.ogg")
        note = self.write("Note.md", "![[telegram-voice-one.ogg|Original player]]\ntext\n![[telegram-voice-two.ogg]]\n")
        self.assertEqual(len(self.discover()["pending"]), 2)
        first = self.discover()["pending"][0]; self.write("first.txt", "First.")
        self.invoke("insert", "--note", first["note"], "--audio", first["audio"], "--transcript-file", str(self.vault / "first.txt"), "--backup-dir", str(self.backups))
        self.write("redo.txt", "Revised.")
        before_redo = note.read_bytes()
        redo = self.invoke("replace", "--note", first["note"], "--audio", first["audio"], "--transcript-file", str(self.vault / "redo.txt"), "--backup-dir", str(self.backups))
        after_redo = note.read_bytes()
        self.assertEqual(Path(json.loads(redo.stdout)["backup"]).read_bytes(), before_redo)
        start = b'<!-- agent-audio-transcript:start file="Strata/Attachments/telegram-voice-one.ogg" -->'
        end = b'<!-- agent-audio-transcript:end file="Strata/Attachments/telegram-voice-one.ogg" -->'
        self.assertEqual(after_redo.split(start)[0], before_redo.split(start)[0])
        self.assertEqual(after_redo.split(end)[1], before_redo.split(end)[1])
        self.assertIn(b"> Revised.", after_redo); self.assertNotIn(b"First.", after_redo)
        self.assertEqual(after_redo.count(b"![[telegram-voice-one.ogg|Original player]]"), 1)
        self.assertIn(b"![[telegram-voice-two.ogg]]", after_redo)
        self.write("Other.md", "![[telegram-voice-two.ogg]]\n")
        result = self.invoke("discover", ok=False); self.assertEqual(result.returncode, 2); self.assertIn("ambiguous ownership", result.stdout)
        self.write("Duplicate.md", "![[telegram-voice-one.ogg]]\n")
        before = note.read_bytes(); result = self.invoke("replace", "--note", first["note"], "--audio", first["audio"], "--transcript-file", str(self.vault / "redo.txt"), "--backup-dir", str(self.backups), ok=False)
        self.assertEqual(result.returncode, 2); self.assertEqual(note.read_bytes(), before)

    def test_save_backups_do_not_own_audio_but_live_duplicates_still_do(self):
        self.audio()
        self.write("Owner.md", "![[Recording 20260922000000.m4a]]\n")
        self.write("Strata/Save/2026-09-20-audio-directives/backups/Owner-before.md", "![[Recording 20260922000000.m4a]]\n")
        item = self.discover()["pending"]
        self.assertEqual(item, [{"note": "Owner.md", "audio": "Strata/Attachments/Recording 20260922000000.m4a"}])
        transcript = self.write("final.txt", "Safe owner.")
        self.invoke("insert", "--note", "Owner.md", "--audio", "Strata/Attachments/Recording 20260922000000.m4a", "--transcript-file", str(transcript), "--backup-dir", str(self.backups))

        self.write("Other.md", "![[Recording 20260922000000.m4a]]\n")
        result = self.invoke("replace", "--note", "Owner.md", "--audio", "Strata/Attachments/Recording 20260922000000.m4a", "--transcript-file", str(transcript), "--backup-dir", str(self.backups), ok=False)
        self.assertEqual(result.returncode, 2)
        self.assertIn("ownership or embed is not uniquely safe", result.stderr)

    def test_missing_and_outside_audio_are_refused(self):
        self.write("Note.md", "![[missing.mp3]]\n")
        transcript = self.write("final.txt", "No change.")
        result = self.invoke("insert", "--note", "Note.md", "--audio", "Strata/Attachments/missing.mp3", "--transcript-file", str(transcript), "--backup-dir", str(self.backups), ok=False)
        self.assertEqual(result.returncode, 2)
        outside = Path(self.temp.name) / "outside.mp3"; outside.write_bytes(b"outside")
        result = self.invoke("transcribe", "--audio", "../outside.mp3", ok=False)
        self.assertEqual(result.returncode, 2); self.assertIn("vault-relative", result.stderr)

    def test_outside_embed_is_a_discovery_issue_not_an_escape(self):
        outside = Path(self.temp.name) / "Recording 20260922123456.m4a"; outside.write_bytes(b"outside")
        self.write("Note.md", "![[../Recording 20260922123456.m4a]]\n")
        result = self.invoke("discover", ok=False)
        self.assertEqual(result.returncode, 2)
        self.assertIn("audio attachment not found", result.stdout)

    def test_unrelated_broken_embed_does_not_block_unique_insert(self):
        self.audio()
        self.write("Owner.md", "![[Recording 20260922000000.m4a]]\n")
        self.write("Unrelated.md", "![[missing.mp3]]\n")
        transcript = self.write("final.txt", "Still safe.")
        result = self.invoke("insert", "--note", "Owner.md", "--audio", "Strata/Attachments/Recording 20260922000000.m4a", "--transcript-file", str(transcript), "--backup-dir", str(self.backups))
        self.assertEqual(result.returncode, 0)

    def test_malformed_markers_are_discovery_issues_and_refuse_mutation(self):
        self.audio()
        transcript = self.write("final.txt", "No change.")
        forms = {
            "stray": b'<!-- agent-audio-transcript:end file="Strata/Attachments/voice.m4a" -->\n![[voice.m4a]]\n',
            "mismatch": b'<!-- agent-audio-transcript:start file="Strata/Attachments/voice.m4a" -->\n> [!audio-transcript] Spoken\n> ![[voice.m4a]]\n>\n> Text.\n<!-- agent-audio-transcript:end file="Strata/Attachments/other.m4a" -->\n',
            "no_callout": b'<!-- agent-audio-transcript:start file="Strata/Attachments/voice.m4a" -->\n![[voice.m4a]]\n<!-- agent-audio-transcript:end file="Strata/Attachments/voice.m4a" -->\n',
            "mixed_namespace": b'<!-- agent-audio-transcript:start file="Strata/Attachments/voice.m4a" -->\n> [!audio-transcript] Spoken\n> ![[voice.m4a]]\n>\n> Text.\n<!-- codex-audio-transcript:end file="Strata/Attachments/voice.m4a" -->\n',
        }
        for name, content in forms.items():
            with self.subTest(name=name):
                note = self.write("Note.md", content)
                before = note.read_bytes()
                result = self.invoke("discover", ok=False)
                self.assertEqual(result.returncode, 2)
                self.assertTrue(json.loads(result.stdout)["issues"])
                result = self.invoke("insert", "--note", "Note.md", "--audio", "Strata/Attachments/voice.m4a", "--transcript-file", str(transcript), "--backup-dir", str(self.backups), ok=False)
                self.assertEqual(result.returncode, 2)
                self.assertEqual(note.read_bytes(), before)

    def test_migrate_legacy_block_preserves_embed_content_and_directive_words(self):
        self.audio()
        old = (
            b'before\n![[Recording 20260922000000.m4a|Exact player]]\n\n'
            b'<!-- agent-audio-transcript:start file="Strata/Attachments/Recording 20260922000000.m4a" -->\n'
            b'Keep [[A durable link]].\nCodex, add an image here.\n'
            b'<!-- agent-audio-transcript:end file="Strata/Attachments/Recording 20260922000000.m4a" -->\n'
            b'after\n'
        )
        note = self.write("Note.md", old)
        result = self.invoke("migrate", "--note", "Note.md", "--audio", "Strata/Attachments/Recording 20260922000000.m4a", "--backup-dir", str(self.backups))
        self.assertEqual(Path(json.loads(result.stdout)["backup"]).read_bytes(), old)
        data = note.read_bytes()
        self.assertEqual(data.count(b"![[Recording 20260922000000.m4a|Exact player]]"), 1)
        self.assertIn(b"> Keep [[A durable link]].", data)
        self.assertIn(b'<span class="agent-audio-directive"><em>Codex, add an image here.</em></span>', data)
        self.assertEqual(self.discover(), {"pending": [], "issues": []})

    def test_agent_spoken_insert_and_explicit_migration_preserve_audio_and_transcript(self):
        self.audio("voice-first.oga"); self.audio("voice-second.oga")
        note = self.write("Continuum/Time/Daily/2026-09-22.md", (
            b"### One bundle\n\n![[voice-first.oga|First player]]\n\n"
            b'<!-- agent-audio-transcript:start file="Strata/Attachments/voice-second.oga" -->\n'
            b"> [!audio-transcript] Spoken\n> ![[voice-second.oga|Second player]]\n>\n> Already reviewed.\n"
            b'<!-- agent-audio-transcript:end file="Strata/Attachments/voice-second.oga" -->\n'
        ))
        transcript = self.write("first.txt", "For the agent.")
        self.invoke("insert", "--note", "Continuum/Time/Daily/2026-09-22.md", "--audio", "Strata/Attachments/voice-first.oga", "--transcript-file", str(transcript), "--spoken-for-agent", "--backup-dir", str(self.backups))
        before_migration = note.read_bytes()
        result = self.invoke("migrate", "--note", "Continuum/Time/Daily/2026-09-22.md", "--audio", "Strata/Attachments/voice-second.oga", "--spoken-for-agent", "--backup-dir", str(self.backups))
        self.assertEqual(Path(json.loads(result.stdout)["backup"]).read_bytes(), before_migration)
        data = note.read_bytes()
        self.assertEqual(data.count(b"> [!audio-transcript]- Spoken for Agent"), 2)
        self.assertIn(b"> ![[voice-first.oga|First player]]", data)
        self.assertIn(b"> ![[voice-second.oga|Second player]]", data)
        self.assertIn(b"> Already reviewed.", data)
        self.assertEqual(self.discover(), {"pending": [], "issues": []})

    def test_insert_styles_only_direct_spoken_directives(self):
        self.audio()
        self.write("Note.md", "![[Recording 20260922000000.m4a]]\n")
        transcript = self.write("final.txt", "Ask Codex to help.\nCodex, insert an image here.")
        item = self.discover()["pending"][0]
        self.invoke("insert", "--note", item["note"], "--audio", item["audio"], "--transcript-file", str(transcript), "--backup-dir", str(self.backups))
        data = (self.vault / "Note.md").read_bytes()
        self.assertIn(b"> Ask Codex to help.", data)
        self.assertIn(b'> <span class="agent-audio-directive"><em>Codex, insert an image here.</em></span>', data)

    def test_restyle_wraps_only_the_reviewed_linked_direct_address(self):
        self.audio()
        note = self.write("Note.md", (
            b'<!-- agent-audio-transcript:start file="Strata/Attachments/Recording 20260922000000.m4a" -->\n'
            b'> [!audio-transcript] Spoken\n> ![[Recording 20260922000000.m4a|Exact player]]\n>\n'
            b'> *[[Codex]], is this working?*\n> *[[Codex]] is mentioned normally.*\n'
            b'<!-- agent-audio-transcript:end file="Strata/Attachments/Recording 20260922000000.m4a" -->\n'
        ))
        old = note.read_bytes()
        result = self.invoke("restyle", "--note", "Note.md", "--audio", "Strata/Attachments/Recording 20260922000000.m4a", "--backup-dir", str(self.backups))
        self.assertEqual(Path(json.loads(result.stdout)["backup"]).read_bytes(), old)
        data = note.read_bytes()
        self.assertIn(b'<span class="agent-audio-directive">*[[Codex]], is this working?*</span>', data)
        self.assertNotIn(b'<span class="agent-audio-directive">*[[Codex]] is mentioned normally.*</span>', data)
        self.assertEqual(data.count(b"![[Recording 20260922000000.m4a|Exact player]]"), 1)
        self.assertEqual(self.discover(), {"pending": [], "issues": []})

    def test_restyle_preserves_spoken_for_agent_callout(self):
        self.audio()
        note = self.write("Note.md", (
            b'<!-- agent-audio-transcript:start file="Strata/Attachments/Recording 20260922000000.m4a" -->\n'
            b'> [!audio-transcript]- Spoken for Agent\n> ![[Recording 20260922000000.m4a|Exact player]]\n>\n'
            b'> *[[Codex]], keep this private instruction.*\n'
            b'<!-- agent-audio-transcript:end file="Strata/Attachments/Recording 20260922000000.m4a" -->\n'
        ))
        self.invoke("restyle", "--note", "Note.md", "--audio", "Strata/Attachments/Recording 20260922000000.m4a", "--backup-dir", str(self.backups))
        data = note.read_bytes()
        self.assertIn(b"> [!audio-transcript]- Spoken for Agent", data)
        self.assertNotIn(b"> [!audio-transcript] Spoken", data)
        self.assertIn(b'<span class="agent-audio-directive">*[[Codex]], keep this private instruction.*</span>', data)

    def test_audio_css_is_scoped_muted_and_compact(self):
        css = CSS.read_text(encoding="utf-8")
        agent_selector = '.callout[data-callout="audio-transcript"].is-collapsible'
        self.assertIn('.callout[data-callout="audio-transcript"] {', css)
        self.assertRegex(
            css,
            r'\.callout\[data-callout="audio-transcript"\] \.callout-title\s*\{[^}]*\balign-items: center;',
        )
        self.assertIn("margin: 0 !important;", css)
        self.assertIn("margin-block: 0.35rem !important;", css)
        self.assertIn(".agent-audio-directive", css)
        self.assertIn("color: var(--text-muted);", css)
        self.assertNotIn("--text-muted-rgb", css)
        self.assertIn(f"{agent_selector} {{", css)
        self.assertIn("--callout-icon: lucide-bot;", css)
        self.assertIn("border-left-color: rgba(33, 157, 255, .62);", css)
        self.assertIn(f"{agent_selector} .callout-fold", css)
        self.assertIn(f"{agent_selector} > .callout-content {{\n  background: transparent !important;\n}}", css)
        self.assertNotIn('.callout[data-callout="audio-transcript"]:not(.is-collapsible)', css)

    def test_directives_detect_direct_address_with_offsets(self):
        english = "Before. cOdEx ，   insert an image here. After."
        english_file = self.write("english.txt", english)
        result = json.loads(self.invoke("directives", "--transcript-file", str(english_file)).stdout)["directives"]
        self.assertEqual(len(result), 1)
        directive = result[0]
        self.assertEqual(directive["text"], "cOdEx ，   insert an image here.")
        self.assertEqual(english[directive["start"]:directive["end"]], directive["text"])
        self.assertEqual(english[directive["body_start"]:directive["body_end"]], "insert an image here.")

        russian = "КОДЕКС ،   добавь изображение сюда!\nДальше."
        russian_file = self.write("russian.txt", russian)
        result = json.loads(self.invoke("directives", "--transcript-file", str(russian_file)).stdout)["directives"]
        self.assertEqual(len(result), 1)
        directive = result[0]
        self.assertEqual(directive["text"], "КОДЕКС ،   добавь изображение сюда!")
        self.assertEqual(russian[directive["start"]:directive["end"]], directive["text"])
        self.assertEqual(russian[directive["body_start"]:directive["body_end"]], "добавь изображение сюда!")

        for spoken in ("Agent, add a link here.", "Агент, добавь ссылку сюда."):
            source = self.write("agent-address.txt", spoken)
            result = json.loads(self.invoke("directives", "--transcript-file", str(source)).stdout)["directives"]
            self.assertEqual([item["text"] for item in result], [spoken])
            self.assertIn('<span class="agent-audio-directive">', audio_transcripts.styled_directives(spoken))

    def test_directives_ignore_ordinary_mentions_without_direct_address_comma(self):
        transcript = self.write("ordinary.txt", "Ask Codex to insert an image. Кодекс говорит привет. Codex instruction: no. The agent returned. Агент ответил.")
        result = json.loads(self.invoke("directives", "--transcript-file", str(transcript)).stdout)
        self.assertEqual(result, {"directives": []})

    def test_directives_accept_period_address_context_through_the_line(self):
        direct = "Codex. Insert an image here."
        direct_file = self.write("period-directive.txt", direct)
        result = json.loads(self.invoke("directives", "--transcript-file", str(direct_file)).stdout)["directives"]
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["text"], direct)
        self.assertEqual(direct[result[0]["body_start"]:result[0]["body_end"]], "Insert an image here.")

        for spoken in ("Agent. Add a link here.", "Агент. Добавь ссылку сюда."):
            source = self.write("agent-period.txt", spoken)
            result = json.loads(self.invoke("directives", "--transcript-file", str(source)).stdout)["directives"]
            self.assertEqual([item["text"] for item in result], [spoken])

        english = "So, yeah, Codex. I'm not sure what to say. You can put a link here."
        english_file = self.write("period-vocative-en.txt", english)
        result = json.loads(self.invoke("directives", "--transcript-file", str(english_file)).stdout)["directives"]
        self.assertEqual(len(result), 1)
        directive = result[0]
        self.assertEqual(directive["text"], "Codex. I'm not sure what to say. You can put a link here.")
        self.assertEqual(english[directive["start"]:directive["end"]], directive["text"])
        self.assertEqual(audio_transcripts.styled_directives(english),
                         "So, yeah, <span class=\"agent-audio-directive\"><em>Codex. I'm not sure what to say. You can put a link here.</em></span>")

        russian = "Ну, Кодекс. Я не уверен, что сказать. Ты можешь добавить ссылку сюда."
        russian_file = self.write("period-vocative-ru.txt", russian)
        result = json.loads(self.invoke("directives", "--transcript-file", str(russian_file)).stdout)["directives"]
        self.assertEqual(len(result), 1)
        directive = result[0]
        self.assertEqual(directive["text"], "Кодекс. Я не уверен, что сказать. Ты можешь добавить ссылку сюда.")
        self.assertEqual(russian[directive["start"]:directive["end"]], directive["text"])

        ordinary = self.write("period-ordinary.txt", "We discussed Codex. It was only a normal mention.")
        self.assertEqual(json.loads(self.invoke("directives", "--transcript-file", str(ordinary)).stdout), {"directives": []})

    def test_directives_discard_contained_ranges_but_keep_separate_lines(self):
        overlapping = "That's for you, Codex. So, yeah, Codex, I'm not sure..."
        overlap_file = self.write("overlapping-directives.txt", overlapping)
        result = json.loads(self.invoke("directives", "--transcript-file", str(overlap_file)).stdout)["directives"]
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["text"], "Codex. So, yeah, Codex, I'm not sure...")
        self.assertEqual(overlapping[result[0]["start"]:result[0]["end"]], result[0]["text"])
        styled = audio_transcripts.styled_directives(overlapping)
        self.assertEqual(styled.count('class="agent-audio-directive"'), 1)

        separate = "Codex. Add a link here.\nКодекс, добавь изображение сюда."
        separate_file = self.write("separate-directives.txt", separate)
        result = json.loads(self.invoke("directives", "--transcript-file", str(separate_file)).stdout)["directives"]
        self.assertEqual(len(result), 2)
        self.assertEqual(audio_transcripts.styled_directives(separate).count('class="agent-audio-directive"'), 2)

    def test_review_flags_detect_six_or_more_repeated_words_only(self):
        flagged = audio_transcripts.review_flags("yeah, yeah yeah yeah yeah yeah", 30)
        self.assertEqual(flagged, [{"kind": "repeated_word", "word": "yeah", "repetitions": 6}])
        self.assertEqual(audio_transcripts.review_flags("yeah yeah yeah yeah yeah", 30), [])

    def test_review_flags_detect_only_extreme_contiguous_punctuation_runs(self):
        self.assertEqual(audio_transcripts.review_flags("... ... ... ...", 1), [])
        self.assertEqual(audio_transcripts.review_flags("... ... ... ... ...", 1),
                         [{"kind": "repeated_punctuation", "token": "...", "repetitions": 5}])
        self.assertEqual(audio_transcripts.review_flags("I think ... this is ordinary prose ... and it continues.", 30), [])

    def test_segment_ranges_choose_one_pause_near_each_target(self):
        ranges = audio_transcripts.segment_ranges(205, [31, 59, 83, 119, 151, 179])
        self.assertEqual(ranges, [(0.0, 59), (59, 119), (119, 205)])
        self.assertEqual(audio_transcripts.segment_ranges(130, []), [(0.0, 60.0), (60.0, 130)])

    def test_segmented_transcription_is_sequential_stitched_and_flagged(self):
        audio = self.audio()
        calls = []

        def fake_normalize(source, destination):
            self.assertEqual(source, audio)
            destination.write_bytes(b"normalized")

        def fake_extract(source, destination, start, end):
            calls.append((source, destination.name, start, end))

        def fake_transcribe(path, **options):
            index = len([call for call in calls if call[1].endswith(".wav")]) - 1
            texts = [
                "We discuss a concrete subject today.",
                "subject today. Then the next idea follows.",
                "repeat phrase repeat phrase repeat phrase repeat phrase.",
            ]
            return {"text": texts[index], "segments": [{"id": index}], "language": "en"}

        with patch.object(media, "audio_duration", return_value=185), \
             patch.object(media, "silence_boundaries", return_value=[60, 120]), \
             patch.object(media, "normalize_audio", side_effect=fake_normalize), \
             patch.object(media, "extract_segment", side_effect=fake_extract):
            result = audio_transcripts.transcribe_audio(audio, "vault terms", fake_transcribe)

        self.assertEqual([call[1] for call in calls], ["segment-000.wav", "segment-001.wav", "segment-002.wav"])
        self.assertEqual(calls[1][2], 58.5)
        self.assertEqual(result["text"], "We discuss a concrete subject today. Then the next idea follows. repeat phrase repeat phrase repeat phrase repeat phrase.")
        self.assertEqual([segment["start"] for segment in result["segments"]], [0.0, 60, 120])
        self.assertEqual(result["segments"][1]["metadata"], {"language": "en"})
        self.assertTrue(any(flag["kind"] == "repeated_phrase" for flag in result["transcription_metadata"]["review_flags"]))

    def test_short_transcription_normalizes_then_keeps_one_model_call(self):
        audio = self.audio()
        calls = []

        def fake_normalize(source, destination):
            self.assertEqual(source, audio)
            destination.write_bytes(b"normalized")

        def fake_transcribe(path, **options):
            calls.append(Path(path))
            self.assertTrue(Path(path).is_file())
            return {"text": "Short."}

        with patch.object(media, "audio_duration", return_value=20), \
             patch.object(media, "normalize_audio", side_effect=fake_normalize):
            result = audio_transcripts.transcribe_audio(audio, "terms", fake_transcribe)
        self.assertEqual(result, {"text": "Short."})
        self.assertEqual([path.name for path in calls], ["normalized.wav"])
        self.assertEqual(audio.read_bytes(), b"audio bytes")


if __name__ == "__main__": unittest.main()
