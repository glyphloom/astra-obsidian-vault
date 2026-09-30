---
name: obsidian-daily
description: Maintain daily notes by integrating Daily Intake, transcribing voice recordings, reconciling tasks, answering Agent Review comments, and carrying durable personal thoughts into subject notes. Use for the nightly daily run, or when the owner asks to process their voice notes, intake, or today's daily note.
---

# Obsidian Daily

Agent-owned scheduled or manual maintenance of daily notes. [The daily contract](references/daily-contract.md) holds every rule; this file is the run order. Read the contract before the first mutation of a run.

## Helper

Run from the vault root with the MLX Whisper environment you install for the skill, never the system Python:

```bash
"<mlx-whisper-venv>/bin/python" Strata/Skills/obsidian-daily/scripts/audio_transcripts.py --vault . <subcommand>
```

Subcommands: `discover`, `agent-comments`, `unresolved`, `vocabulary`, `transcribe --audio`, `directives --transcript-file`, `insert`/`replace`/`migrate`/`restyle` (`--note`, `--audio`, `--transcript-file`, `--spoken-for-agent`), and `backup`. `--note <vault-relative-path>` restricts discovery. `replace`, `migrate`, and `restyle` are explicit-only.

## Run

1. **Discover.** Run `discover`. It is only the audio branch: whatever it finds or reports, continue every later step and report audio issues separately.
2. **Comments.** Run `agent-comments` and apply the owner's clarifications first, then their requests, under the contract's Agent Review section. Sweep prior `#agent/unresolved` items.
3. **Daily Intake.** Find intake blocks in daily notes independently of `discover` and integrate them under the contract's Daily Intake section. Delegate non-routine instructions to subagents.
4. **Audio.** For each intended recording: `vocabulary --note` → `transcribe` with its `prompt` → review under Fidelity → **search the vault both ways** (exact and `search_vault_smart`, with the live-port fallback from the vault guide's Vault Search rule) → at most one improved pass for a suspicious name → add corrected names to the optional local `references/vocabulary.txt` (created when needed; it is not shipped because it holds private names) → `directives` → `insert`. Add the image for recordings over 60 seconds and fulfill safe directives after the block.
5. **Tasks.** Review content new or changed since the prior successful run, including what steps 3–4 produced, under the contract's Tasks section; deduplicate against active tasks using both searches; write the review comment and Task Updates delta; close empty Tasks sections of closed days.
6. **Promote.** Link durable subjects, then promote each reviewed passage under `$obsidian-authoring`'s promotion rules, handing external entities to `$obsidian-save`.
7. **Missed days.** Fill in what the vault shows they did on days whose notes miss it, under the contract's Missed days section.
8. **Record.** Write the Note Updates, messages, and unresolved items under Agent Review; archive handled instructions under Processed Agent Instructions; remove an exhausted Agent Review heading.
9. **Report.** What was transcribed, integrated, changed, and left open, and which searches ran (exact, semantic, or the fallback and why). A run with nothing to do is silent.
