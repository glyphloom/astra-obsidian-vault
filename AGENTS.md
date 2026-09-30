---
tags:
  - type/guide
aliases: []
created: 2026-05-26
---

## AGENTS.md

Operational guide for AI/code agents working in this Obsidian vault.

_Last reviewed: 2026-09-27._

## Prime Directives

1. **Do not touch `Artifacts/` unless the owner explicitly asks.** Treat it as archive/cold storage. Do not scan, summarize, rename, lint, or reorganize it by default.
2. **Use paths appropriate to the operation.** Use absolute paths for filesystem and shell operations. Use vault-relative paths in note content, wiki-links, Obsidian CLI arguments, and user-facing reports.
3. **Preserve Obsidian semantics.** Keep Markdown, YAML frontmatter, wiki-links `[[...]]`, embeds `![[...]]`, block IDs, Dataview blocks, DataviewJS serialization comments, and Templater syntax intact.
4. **Do not perform destructive operations without explicit approval.** No mass deletes, moves, archive actions, global linter runs, or filename normalization unless requested and reviewed.
5. **Minimize noise.** Make targeted edits. Avoid reformatting whole notes unless the user asked for formatting.
6. **Respect private material.** Personal areas under `Continuum/`, daily notes, contact notes, and conversations can contain sensitive personal context. Summarize carefully and avoid exposing unnecessary details.

## Vault Map

- `Entropy/` — vault meta layer: MOCs, dashboards, and maintenance queries. Relevant access-layer MOCs and hubs live here for easier navigation.
- `Continuum/` — life/current-continuity layer.
  - `Continuum/Time/Daily/`, `Weekly/`, `Monthly/`, and `Yearly/` contain journal/periodic notes.
  - Other `Continuum/` folders hold lived interests, personal areas, and reference material.
- `Infinity/` — knowledge, research, ideas, and long-range conceptual material.
- `Matter/` — durable resources, tech notes, Obsidian setup, and media assets.
- `Underwork/` — active work/projects.
- `Strata/` — infrastructure and generated material, not ordinary knowledge content.
  - `Strata/Templates/` contains note templates.
  - `Strata/Attachments/` is the configured attachment destination, organized by owner: each file lives under the path of the note that owns it, starting at that note's top two folders (`Continuum/Media/…`, `Matter/Tech/`, `Underwork/<Project>/`, `Infinity/`). Go one level deeper along the owner's path only where that level already exists, where the folder was already split into subfolders, or where it would pass 20 files; `Continuum/Media/` is split by media kind and daily notes by date (`Continuum/Time/Daily/YYYY-MM-DD/`). The owner is the subject note the file was added for; daily notes, hubs, and canvases that re-embed it do not own it. Nothing stays at the root: whenever an agent touches a root-level or `Unsorted/` file, or adds one, it files it with an Obsidian-aware move. Moves must also update any path-bearing marker Obsidian does not rewrite, such as `audio-transcript` `file=` attributes. `Unsorted/` holds unreferenced files awaiting the owner's review; do not delete them.
    - `Strata/Attachments/Intake/` is a near-immediate consumption queue of images stashed from Telegram by the Daily Intake bot, named `YYYY-MM-DD-HHMMSS-N.ext` by capture time and album position. No note references them yet. When the owner refers to images they just sent, take the newest files here, use them, then move each one with an Obsidian-aware move to its owner's attachment folder and embed it. Do not leave consumed files in `Intake/`.
  - `Strata/Banners/` contains reusable and note-specific banners.
  - `Strata/Bases/` contains reusable Obsidian Bases.
  - `Strata/Save/` contains transactional staging, drafts, manifests, and backups; exclude it from ordinary scans.
  - `Strata/.backups/` holds agent pre-edit copies (`daily-audio/` from the daily helper, `<date>-<task>/` for bulk edits). Obsidian ignores dot folders, so copies there never show up as notes or tasks. Ordinary small edits need no copy; the owner's regular backups cover them.
  - `Strata/Skills/` contains installed agent workflow definitions, references, validators, and tests.
  - `Strata/Public Vault/` contains the exporter that publishes this vault.
  - `Strata/` is exempt from broad content cleanup, but inspect it when a task affects a workflow implemented by its templates, skills, scripts, Bases, or configs.
- `Artifacts/` — protected archive. Excluded by default.

## Knowledge-Organization Philosophy

This vault is a **UCMA / Zettelkasten hybrid**, not a pure folder hierarchy and not a decorative MOC garden.

`Infinity/` is the dedicated **Zettelkasten-style staging folder**: temporary notes, evergreen-ish ideas, research notes, conceptual atoms, and long-range knowledge development awaiting migration into the UCMA structure when their durable role becomes clear. **Infinity must remain flat and must never contain subfolders.** When organizing Infinity notes, propose or create appropriate destinations and links in the UCMA rather than introducing structure inside `Infinity/`.

Everything outside `Infinity/` is closer to the **UCMA** structure, a PARA-like operating system for active life, work, resources, meta-maintenance, and archive boundaries.

- `Underwork` roughly corresponds to active projects.
- `Continuum` holds ongoing life areas, time, personal continuity, hobbies, and lived context.
- `Infinity` holds Zettelkasten-style knowledge, research, ideas, and long-range conceptual material.
- `Matter` holds resources, tooling, technical references, media, and durable setup material.
- `Entropy` holds maps, dashboards, and maintenance surfaces.
- `Strata` is infrastructure/generated material, not normal knowledge content.
- `Artifacts` is archive/cold storage.

MOCs and hubs should be **created only when they are useful**, not because every folder needs a pretty landing page. Do not propose top-level hubs merely for symmetry. Prefer local, need-driven maps around active concepts, projects, or clusters.

## Current Conventions

### Frontmatter

Typical active-content note frontmatter uses:

```yaml
---
tags:
aliases:
created: YYYY-MM-DD
status: active
---
```

Common fields include `tags`, `aliases`, `created`, `status`, `banner`, `url`, `week`, `weight`, and `related`. Publication-controlled notes may also use `share`, `gardens`, and `home`; do not add, remove, or enable those properties during ordinary metadata cleanup because they affect deployment, routing, or publication entry points.

Minimal metadata expectations for active content:

- Active content notes outside `Infinity/`: `tags`, `aliases`, `created`.
- `Infinity/` Zettelkasten notes: `tags`, `created`; add `aliases` or `related` only when useful.
- Project notes tagged `type/project`: also `status`.
- `Strata/` is exempt from ordinary metadata cleanup. However, deliberate taxonomy migrations must inspect relevant templates, configs, and examples so they do not regenerate deprecated tags.
- Prefer hierarchical tags. Avoid orphan bare root tags such as `strategy` or `transcript` when an existing structure can hold them, e.g. `job/strategy` or `physics/source/transcript`.

### Tags

The canonical taxonomy and self-tagging reference is [[Vault Tagging System]]. Agents must follow that guide when creating, changing, or auditing tags.

Core enforcement rules:

- Tags exist for useful retrieval, queries, navigation, workflow, and durable project relationships. Do not build a complete ontology or tag facts already obvious from the title.
- Keep facets distinct: domain tags describe subject or form, project-relation tags describe use, `type/*` describes operational role, and `time/*` identifies periodic-note systems.
- Search for an existing branch before creating a tag. Do not create synonyms or parallel roots.
- Prefer the narrowest useful child and do not assign its parent as well. Nested tags already imply their parents.
- Dense domains normally use a meaningful `root/branch/subject` structure, such as `mathematics/geometry/algebraic`, `physics/theoretical/cosmology`, `media/video/film`, `tech/software/obsidian`, or `art/genre/horror`. Bare domain roots are reserved for hubs.
- Smaller domains may remain shallower until a useful intermediate grouping exists. Never add a meaningless level merely to satisfy a depth target.
- `type/*` is restricted to roles that support actual selection or workflow. Established types include `type/MOC`, `type/hub`, `type/project`, `type/milestone`, `type/checklist`, `type/guide`, `type/stub`, `type/daemon`, and `type/hide`.
- Do not use `type/*` merely to restate what a note represents. Avoid `type/person`, `type/artist`, `type/song`, `type/genre`, and `type/workbook` unless a concrete query or workflow is intentionally introduced.
- Use `time/daily`, `time/weekly`, `time/monthly`, and `time/yearly` for periodic notes. Do not use `time/tasks`; tasks are represented by task syntax and the special inline `#task` marker.
- Use `agent/unresolved` only as a temporary workflow marker for an unresolved entity or interpretation. Keep one deduplicated canonical editable item under the source daily note's `## Agent Review`, following the schema in [[Strata/Skills/obsidian-daily/references/daily-contract.md|Obsidian Daily contract]], and remove it when a later run resolves the item; do not treat it as a durable subject tag.
- The `agent/*` root is agent-owned review history and questions: `agent/update`, `agent/message`, and `agent/unresolved`. The owner's input to agents uses the separate `user/*` root: `user/request` (legacy `user/inbox`, which Daily Intake still emits on agent-inbox callouts) and `user/clarification`. Never write these user tags as `agent/*`; the older `agent/inbox`, `agent/request`, and `agent/clarification` spellings are legacy input only.
- Use `type/hide` for hide/exclusion tagging. Preserve all other `meta/*` tags unless the owner explicitly asks to change them.
- References retain intrinsic classification and may also carry one or more project relationships, such as `art/music/hip-hop` with `art/worldbuilding/chronodaemonia/reference`.
- One to three strong tags is normal. A unique tag is acceptable only when it establishes a meaningful reusable branch, not merely because a phrase can be encoded as a tag.
- During a taxonomy migration, audit active notes, Dataview/query references, and relevant `Strata/` templates, configs, and examples. Do not rewrite historical generated exports or cache/index data.

### Links and Embeds

- Prefer wiki-links for internal notes. When the target needs a vault-relative folder path, keep the path in the target but use a concise natural display alias in prose: `[[folder/Long Note Name.md|Long Note Name]]`. Do not expose raw folder paths as rendered sentence text.
- Prefer Obsidian embeds for local assets: `![[image.png]]`.
- Attachments follow the owner-folder rule under `Strata/Attachments/` described in the Vault Map, and banners live in `Strata/Banners/`. Preserve basename-only embeds when Obsidian resolves them correctly; do not relocate media merely to make paths explicit.
- A body banner is one invariant: frontmatter contains both `banner` and `banner-fade` in `cssclasses`, and `![[image.ext|banner]]` is the first body element. The `banner` alias is a structural CSS hook, not descriptive alt text. Existing property-based banners may remain; do not normalize them in unrelated work.
- When a note has a representative body image, put it before the first visible heading in the enabled media-frame callout and give the embed concise factual alt text: `> [!media-frame]` followed by `> ![[image.ext|Visible description]]`. The alias serves as image alt text and is displayed as a centered caption in Reading View and Live Preview. Omit the image cleanly when no defensible representative exists.
- When Claude speaks in its own voice about the note itself (how it was written, what evidence it rests on, what is still open), it uses a `> [!claude] From Claude` callout, drawn by the `agent-callouts` snippet in orange with a pixel-crab icon. The callout is Claude's alone; another agent that wants one gets its own callout type rather than borrowing this one. Use it for meta remarks only, not for ordinary agent-authored content, which follows the ownership rules below.
- Agent bookkeeping links through Obsidian URIs (`[Name](obsidian://open?file=<URL-encoded path without .md>)`, with no `vault` parameter so the link opens in whichever copy of the vault is current), not wiki-links: `#agent/update` note-change records. They stay clickable but add no graph edges, so the graph shows real relationships, not agent logs. Task Updates keep their exact block wiki-links, and review blocks link only to their child periodic notes, as the review skill describes.
- Be careful with serialized Dataview output: update source Dataview code when possible, not only serialized tables/lists.

### Markdown Structure

- Do not introduce H1 headings in ordinary active notes. Use H2 for the first and other major sections, H3 for their children, and continue without skipped levels.
- The first H2 can be any useful section heading. Do not require it to repeat the note title or filename.
- End every prose sentence in paragraphs with terminal punctuation, normally a period (`.`), question mark (`?`), or exclamation mark (`!`); intentional ellipses may remain. When terminal punctuation is missing, add a period. Do not enforce this rule in list items or tasks. Do not alter table cells, captions/alt text, frontmatter, code/query blocks, metadata/navigation lines, or verbatim source/transcript text.
- When moving a section beneath another heading, demote all descendants together so the heading ladder remains intact.
- Let the vault show time passing: do not retrofit old notes' content, prose, style, or organization to a newer paradigm merely because it is clearer; the owner updates an old note when they need it again. Simple mechanical changes that keep notes working with automated systems, such as a shared heading, marker, tag, or link-target rename, may be applied vault-wide when a task calls for them, provided they change nothing else.
- Write everything agent-authored in English by default, including new notes, promoted passages, tasks, comments, and review items; write another language only inside a note that was already written in it before the agent edited it. Preserve the owner's original-language source text and transcripts.
- When agent-authored note text speaks about the owner in the third person, name them plainly and unlinked, by the name they like best, rather than with a bare pronoun; a pronoun may follow within the same sentence. A `[!claude]` callout, where Claude addresses the owner directly, keeps "you".

### Thought Capture in Conversation

In any session working in this vault, when the owner voices a developed opinion, tells a story at length, or says something they evidently mean to keep, hand it to a background agent that promotes it into the vault under the promotion rules of [[Strata/Skills/obsidian-authoring/SKILL.md|Obsidian Authoring]], linking back to that day's daily note, while the conversation continues. Give the agent their words closely, with their hedges. Passing mentions, one-line reactions, and task talk are not captured. The main session keeps ownership of the daily note and records the resulting `#agent/update` Note Updates.

### Vault Search

Whenever an agent looks for something already in the vault (a topic home, a person, a link target, a duplicate note or task), it runs both searches, because each finds what the other misses: an exact search (`rg`, title, path, and alias lookups, or a skill's own probe helper) and the Obsidian MCP `search_vault_smart` over active content, with `excludeFolders` set to `Artifacts`, `Strata`, `.obsidian`, and `.trash`. An exact title, path, or alias match wins; a semantic hit is a candidate to read and corroborate, never an answer by itself. Say in the report which searches ran.

Load `search_vault_smart` through tool search when it is deferred. `ECONNREFUSED` on port 27200 usually means the `mcp-tools-istefox` plugin started on a fallback port (27201–27205). A running session does not reconnect, so call the live port directly from the vault root:

```bash
D=.obsidian/plugins/mcp-tools-istefox/data.json
curl -s "http://127.0.0.1:$(jq -r .mcpTransport.livePort $D)/mcp" \
  -H "Authorization: Bearer $(jq -r .mcpTransport.bearerToken $D)" \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_vault_smart","arguments":{"query":"…","filter":{"excludeFolders":["Artifacts","Strata",".obsidian",".trash"]}}}}'
```

`obsidian plugin:reload id=mcp-tools-istefox` moves the plugin back to 27200 once that port is free. Only when both the tool and the direct call fail may a search rely on exact matching alone; report that, and never fail a routine over it.

### Agent-authored Save Material

- The installed `$obsidian-save` skill is the behavioral authority for capture routing, research, deduplication, images, and transactional validation. Its canonical source is `Strata/Skills/obsidian-save/`. Keep this vault guide limited to shared Markdown conventions rather than duplicating that workflow.
- Preserve owner-authored content in place. For save-generated standalone notes, put agent-authored material in the final `## Agent Notes` section bounded by exactly one `<!-- agent-save:start -->` / `<!-- agent-save:end -->` pair. Imported legacy `codex-save` markers and `## Codex Notes` headings remain readable; migrate them on update.
- The first H2 begins the implicit owner-owned area. Put supplied wording or `> Placeholder` beneath it; do not invent an owner-notes wrapper heading. Owner-owned and agent-owned material may each use meaningful H2/H3 structure, lists, relevant images or videos, and useful Dataview views without confusing authorship or changing verbatim transcripts. Verify media and query targets; avoid decoration and redundant dynamic views.
- Integrate justified internal connections into the relevant prose and place descriptive external source links beside the claims they support. Do not add standalone `### Connections` or `### Sources` sections by default.
- Keep a note whole when it has one clear purpose, even if it is substantial. Split a separate concept, argument, mechanism, lineage, technique, or question only when it can be clearly titled, substantively explained, and reused outside the parent; preserve the owner's prose in the original note, explain the parent/child relationship inline, and do not manufacture thin stubs or decorative MOCs.

### Templates and Generated Syntax

- Do not "fix" Templater placeholders like `<% tp.file.creation_date(...) %>` or `<% moment(...) %>` as if they were broken links.
- Dataview serializer comments such as `<!-- QueryToSerialize: ... -->`, `<!-- SerializedQuery: ... -->`, and `<!-- SerializedDataviewJS -->` are meaningful.
- The Journals plugin is the periodic-note authority. It creates daily, weekly, monthly, and yearly notes in `Continuum/Time/` from `Strata/Templates/Time/Journals/`.
- Preserve Journals frontmatter and `<!-- journal-graph:start -->` / `<!-- journal-graph:end -->` regions. Their contents are generated by the Journal Graph Links feature of the Astra Vault plugin; do not edit them manually.
- A ```` ```card ```` block is a Vault Cards flashcard about the next line with content below it; Astra Vault's Vault Cards feature draws it as a small margin icon on that line and serves a few cards a day in its panel. Fields: `id` (unique kebab slug), `q`, `a`, `topic` (a `domain/subject` path), `created`, optional `retired` (the owner's manual override; a card also retires by itself when its first score is 4 or its last two are), and `history`, a list of `at`, `answer`, `score`, and optional one-line `feedback`. The plugin appends each answer with `score: pending`; an agent later replaces that with 1 (Again: wrong or blank), 2 (Hard: partly right or close), 3 (Good: the key fact), or 4 (Easy: complete and confident), judging the fact rather than the wording, and adds `feedback`. FSRS scheduling is replayed from those scores, so never edit `at` or `answer` and never schedule by hand. Put a card directly above its line with no blank line between; several cards about one line stack. Keep cards out of daily notes, transcripts, code, and tables; the plugin ignores `Artifacts/` and `Strata/`.
- `$obsidian-review` owns weekly, monthly, and yearly retrospectives (`<!-- agent-review:start/end period=... -->` under a periodic note's `## Overview`). Preserve those markers and their attributes.
- The installed `$obsidian-daily` skill is the authority for daily-note intake, embedded recordings, and task reconciliation. Preserve `<!-- agent-audio-transcript:start ... -->` / `<!-- agent-audio-transcript:end ... -->` markers, their file attributes, `audio-transcript` callouts, audio embeds, directive spans, and source prose. Imported legacy `codex-audio-transcript` blocks remain valid. Do not rewrite verbatim spoken transcripts during ordinary prose cleanup.

### Folder Notes, Bases, and Canvases

- A note whose filename matches its containing folder may be a Folder Notes control note. Do not classify it as redundant or orphaned solely from graph statistics. Preserve the folder/note name pairing and use Obsidian-aware renames for either component.
- Treat `.base` files as executable query/configuration surfaces. When changing queried tags, statuses, properties, or folder paths, audit relevant Bases alongside Dataview queries.
- Treat `.canvas` files as structured JSON. Preserve node IDs, edge IDs, coordinates, colors, groups, and unknown fields; do not pretty-print or reorder them without a task-specific reason.

## Maintenance Scanning Defaults

For ordinary maintenance, **active content** means everything outside `Artifacts/` and `Strata/`. Also exclude Obsidian app state, trash, agent state, plugin caches and indexes, generated exports, and `Strata/Save/`.

Recommended scan categories:

1. Broken internal links and missing embeds, resolving both Markdown files and media assets.
2. Orphans: active notes with no inlinks and few/no outlinks.
3. Metadata gaps: missing `tags`, `aliases`, `created`, or `status` where appropriate, **excluding `Strata/` unless the owner explicitly asks**.
4. Empty or stub notes outside templates and outside `Strata/`.
5. Tag taxonomy drift where it affects Dataview behavior, especially `project` vs `type/project`.
6. Periodic-note path drift if it reappears; the intended location is `Continuum/Time/...`.
7. Large notes that may need indexes/section extraction, but only after user confirmation.

## Safe Edit Policy

Before editing:

1. Read the target note and any directly related templates/MOCs.
2. State the intended change if it affects many files or conventions.
3. Prefer one small batch at a time.
4. After editing, verify with `rg`, `find`, or a focused script.
5. Report changed files as clickable links. Chat replies render Markdown, not wiki-links: use `[Public Vault Map](Entropy/Public%20Vault%20Map.md)` with a vault-relative, URL-encoded path. Wiki-links belong only inside notes.

## Known Caution Zones

- `Artifacts/` — do not touch by default.
- `Strata/` — infrastructure/generated material. Ignore for broad metadata cleanup and content-quality work unless explicitly requested, but inspect relevant infrastructure for workflow changes.
- `Strata/Save/` — transactional staging, drafts, manifests, and backups; exclude from ordinary maintenance.
- `Continuum/Time/Daily/` — daily notes intentionally contain many fleeting/unresolved links.
- `Underwork/` MOCs may intentionally reference archived projects in `Artifacts/`; this is allowed. Do not remove archive references from active project maps merely because `Artifacts/` is excluded from scans.
- Serialized Dataview tables in MOCs may mention archived notes from `Artifacts/`; do not delete those references without checking intent.
