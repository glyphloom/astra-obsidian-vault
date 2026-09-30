# Deterministic save pipeline

Use these helpers instead of rewriting their logic in a task. Core operations use the macOS/Python runtime; optional cover-derived banners use the installed `ffmpeg` binary.

## Session, retention, and budget

Keep persistent save records under `Strata/Save/<capture-id>/`: sessions, paired receipts, manifests, and recoverable capture evidence. This is infrastructure, so do not place it under `Underwork`; transient staging files may share the capture directory only until their transaction completes. The identity ledger defaults to `Strata/Save/.state/identity-ledger.json`, and an optional `Strata/Save/SAVE_CONFIG.json` can set `unattended_budget_seconds` (default 240).

Begin the session when the save starts, then check it at phase boundaries:

```bash
python3 scripts/save_session.py --session "$SESSION" begin --capture-id "$CAPTURE_ID"
python3 scripts/save_session.py --session "$SESSION" check --reserve-seconds 120
python3 scripts/save_session.py --session "$SESSION" mark --phase resolve --state end
```

On any direct follow-up, correction, or steering from the owner, remove the deadline before doing more work:

```bash
python3 scripts/save_session.py --session "$SESSION" steer --reason "the owner steered the save"
```

Finish the session with `finish --status completed|failed --note ... --receipt ...`. A steered session retains telemetry but has no time limit.

The budget is a per-note pacing mechanism, not a terminal condition. Multi-note work must give each durable note its own allowance rather than treating the entire batch as one clock. When a helper raises a budget guard, reduce optional research breadth and continue in a steered continuation session until the requested transaction reaches a valid completion. Do not report a budget guard as the reason a save was left incomplete.

## Resolve and deduplicate

Resolve a URL or the live Spotify player:

```bash
python3 scripts/resolve_source.py --session "$SESSION" --url "$URL" --output "$METADATA"
python3 scripts/resolve_source.py --session "$SESSION" --spotify-current --output "$METADATA"
```

The resolver has explicit adapters for YouTube, Spotify, DOI/Crossref, arXiv, ISBN/Open Library, and Reddit, plus canonical identities for IMDb, TMDB, and GitHub. Spotify playback returns the current item and its related album or show identity when Spotify exposes it.

Check durable identity before research, then record it only after a verified commit:

```bash
python3 scripts/identity_ledger.py check --source "$URL" --metadata "$METADATA"
python3 scripts/identity_ledger.py record --source "$URL" --metadata "$METADATA" --note "$NOTE" --receipt "$RECEIPT"
```

Exit status `3` from `check` means an existing mapping was found; update that note unless live evidence disproves the mapping.

## Probe and route

Run `probe_vault.py --session "$SESSION"` once with the canonical URL, title, and discriminating concepts. It uses canonical identities and BM25-style field-weighted ranking, excludes instructions and protected areas, and reports durable-ledger matches. Use `--current-note` when refreshing an existing note.

For commentary-like web captures, identify the durable subject before calling the router: a review, essay, interview, or explainer is usually evidence about something else. Pass that resolved title, domain, and relation explicitly:

```bash
python3 scripts/route_capture.py --session "$SESSION" --metadata "$METADATA" --source-app "$APP" \
  --subject-title "$SUBJECT" --subject-domain music --capture-relation "the captured essay discusses this musical scene"
```

The accepted subject domains include `music`, `book`, `film`, `show`, `anime`, `game`, `research`, `idea`, `tool`, and `service`. The helper returns status `3` rather than emitting an arbitrary artifact route when a web video, post, or article still lacks a subject decision. Use `--capture-is-subject` when the work itself has independent cultural, technical, or recall value. Confirm the resulting subject route against neighboring notes.

## Images

Resolve source metadata first, then perform and record a web-source pass for one representative image and one banner candidate. New durable standalone notes require both source-distinct assets unless the owner explicitly approves a documented image-less exception:

```bash
python3 scripts/acquire_image.py --session "$SESSION" --metadata "$METADATA" --subject "$TITLE" --kind representative --note "$NOTE" --staging-dir "$STAGING"
python3 scripts/acquire_image.py --session "$SESSION" --metadata "$METADATA" --subject "$TITLE" --kind banner --staging-dir "$STAGING"
```

Pass `--candidate-url` for a canonical, official, Wikimedia, or otherwise defensibly sourced image found during the web pass. Record every selected page and direct-image URL in the asset manifest. Direct banner candidates must be at least 1200x675 with an intrinsic aspect ratio from 1.55 through 1.90, covering the useful range around 16:10 and 16:9. Search exact-object imagery first, then images of creators, settings, events, techniques, or other concrete topics materially covered by the note. Exit status `4` means continue the web-source pass or ask the owner for an image-less exception; it never authorizes generated art or a banner-only commit.

Keep Spotify and other square cover art as the representative image. After a defensible exact-object or note-topic image fails the direct banner geometry gate, `--derive-banner` can make a last-resort 1920x1080 full-bleed crop from usable official art in staging. It accepts square through near-wide compositions but rejects tiny inputs and extreme panoramas. Inspect the result for destroyed text, faces, and focal points before commit. It preserves the original source URL. Do not use generated imagery without the owner’s explicit approval after the web-source pass is documented as exhausted.

For a multi-note capture, create a JSON asset manifest before committing. It has `visual_reviewed: true` only after a human visual pass, and each entry records `note`, `role` (`banner` or `representative`), `path`, `source_url`, and `generated`. Source URLs and bytes must be unique across the batch; re-encoded or cropped copies do not satisfy the source-distinct rule.

```bash
python3 scripts/asset_manifest.py --manifest "$ASSET_MANIFEST" --require-review
python3 scripts/asset_manifest.py --manifest "$ASSET_MANIFEST" --require-review --no-generated
```

When the owner asks for all referenced items, make a companion scope manifest with `scope: "explicit-completeness"` and an `items` array. Each item has `title`, `kind`, and a `disposition` of `atomic-note`, `incidental-credit`, or `out-of-scope`; atomic entries also name their vault-relative `note`, while the latter two require a reason. Validate it after commits:

```bash
python3 scripts/save_scope_manifest.py --manifest "$SCOPE_MANIFEST" --vault "$VAULT" --require-committed
```

## Transactional notes

An audio-originated request for a durable note about an external media or knowledge subject uses the same transaction as any other save. Shape the attributable spoken material into the first-H2 owner-owned area, then use `commit_note.py` for the researched agent block, canonical identity, and assets. Do not substitute an authoring-only filesystem write merely because the source began as a transcript.

For a new standalone note, draft the complete Markdown in staging, then commit the note and assets together:

```bash
python3 scripts/commit_note.py create --session "$SESSION" --vault "$VAULT" --target "$NOTE" --draft "$DRAFT" \
  --canonical-url "$URL" --banner "Strata/Banners/banner.jpg" \
  --representative "$REPRESENTATIVE_PATH" --representative-alt "$REPRESENTATIVE_ALT" \
  --asset "$STAGED_BANNER" "Strata/Banners/banner.jpg" \
  --asset "$STAGED_IMAGE" "$REPRESENTATIVE_PATH"
```

For an existing note, hash it immediately after inspection and update only structured regions:

```bash
python3 scripts/commit_note.py update --session "$SESSION" --vault "$VAULT" --target "$NOTE" \
  --expected-sha256 "$SHA" --agent-content "$AGENT_FRAGMENT" \
  --user-content "$OWNER_FRAGMENT" --canonical-url "$URL"
```

The update helper preserves unrelated text, replaces only marker-owned agent material, and refuses concurrent edits. It adds `--user-content` to the first owner-owned H2 by default; pass `--user-section "Existing H2 title"` when another owner-owned H2 is the intended home. The fragment can use H3s, lists, and verified media. Before supplying it, apply the authorship and first-person journal-edit rule in `SKILL.md`; eligible user material may come from the working context or relevant vault notes inspected during connection discovery, not only the clipboard capture. For conversational fragments, make a light journal edit that preserves the first-person voice and memorable wording. Do not summarize, interpret, sanitize, or rewrite it into agent prose, and keep direct quotations unchanged. New saves use `## Agent Notes` with `agent-save` markers; imported legacy `codex-save` markers and `## Codex Notes` headings remain valid and are migrated on update. The helper validates the note before committing, refuses Cyrillic in newly generated note and asset paths, rejects reused banner/representative images, and never overwrites a different asset. Declare intentionally unresolved new links with repeated `--allow-unresolved` arguments.

Run `validate_note.py --session "$SESSION"` on the committed target as a read-back check. In explicit-completeness mode, add `--min-agent-words 450 --min-agent-sections 3` for every durable atomic note. It validates YAML syntax, heading order, marker boundaries, final-section ownership, canonical identity, embeds, banners, duplicate identities, unresolved-link declarations, and requested content depth.

## Receipt

Write a small result JSON containing `status`, `action`, `note`, `selected_object`, `route_reason`, `source_basis`, `assets`, `validation`, and optional `uncertainty`, `identity`, `banner_provenance`, and rejected candidates. Pass it with the session to `write_receipt.py`. The helper writes matching `.receipt.md` and `.receipt.json` files and derives phase timings from the session. The resolver, probe, route, image, commit, validation, and receipt helpers also enforce their phase reserves from this same session; a steered session bypasses those guards.

## Steering changes

Apply a direct correction to the active save, then revise `SKILL.md` and the directly affected reference contract in the same task when it generalizes. Do not keep a calibration file, a preference ledger, or a helper that writes one. Add or refine a small deterministic case in `tests/fixtures/save-contract.json` when the behavior has a stable input and expectation; the fixture verifies the contract and never replaces it. Do not place private captured content, secrets, or one-off item facts in the contract or fixture.

## Daily fallback

```bash
python3 scripts/append_daily_capture.py --vault "$VAULT" --content "$CAPTURE" --heading "Short Descriptive Heading"
```

It targets the current journal day (04:00 boundary), locks the read-modify-write sequence, and appends the exact capture as a `###` entry at the end of `## Notes`, before `## Agent Review` and `## Processed Agent Instructions`. A missing note for today is created through the Journals plugin's open-today command. It exits non-zero without writing when another day's note is missing, the note still contains unrendered Templater syntax, or it has no `## Notes` section. Do not construct a dated note directly.
