# Vault profile

This profile describes the example vault's layout. Re-check relevant paths during every save; the live vault is authoritative.

## Structural model

- `Underwork/`: active projects.
- `Continuum/`: ongoing life, interests, and media objects.
- `Infinity/`: evergreen ideas, research, conceptual atoms, and worldbuilding theory.
- `Matter/`: durable resources, tools, technical references, and media assets.
- `Entropy/`: hubs and maintenance surfaces.
- `Strata/`: templates, configuration, attachments, skills, and save records.
- `Artifacts/`: protected archive; never inspect or alter without explicit permission.

The vault uses a UCMA/Zettelkasten hybrid. Placement follows the role of a note, not an abstractly pure subject taxonomy.

## Current media routing

In the example layout, `Continuum/Media/` has one folder per media kind:

- `Reading/`: books and reading. A `Reading List.md` checklist, where one exists, holds terse recommendations. Create an individual book note when the capture includes substantive notes, research, quotations, or connections; link it from the list only if the list's live structure supports that cleanly.
- `Music/`: tracks, albums, artists, playlists, musical scenes, score analysis, composition, and musical technique. A video essay about music belongs here when the music subject, not the video, is what should be remembered.
- `Film/`: films.

Add a folder for another kind, such as `Shows/`, `Anime/`, or `Games/`, when the first durable note of that kind needs a home; `route_capture.py` proposes these conventional names. Check the live folders first and reuse an existing one rather than creating a synonym.

There is no generic `Videos/` folder. First separate an essay, review, interview, or video from the durable subject it examines, then route that subject. A purpose folder such as `Educational/` is only for an explanatory work that is itself a durable object of recall because its formulation, reception, technique, or cultural role is independently useful—not the default home for anything explanatory. Do not create `Videos/` for a single ambiguous capture.

For Spotify playback, treat the current item and its album or show as separate identities. A music track normally enriches or creates the album note; a standalone single, independently significant track, podcast episode, or audiobook may justify its own note after inspecting neighboring practice. Use Spotify album/show artwork as the representative image, not automatically as a banner. A blurred wide canvas with the square cover still visibly centered is not a satisfactory banner composition. The banner must be a distinct source image from the representative cover or thumbnail.

## Existing media-note pattern

Media item notes commonly use:

```yaml
---
tags:
  - media/video/film
aliases:
  - Canonical Title
created: YYYY-MM-DD
url: "https://canonical.example/item"
---
```

Keep the intrinsic classification from [[Vault Tagging System]], such as `media/video/film`, `media/text/reading`, or a branch under `art/music/*`. A note that serves as a reference for the Chronodaemonia worldbuilding project also carries `art/worldbuilding/chronodaemonia/reference`; a note that is part of that project itself uses `art/worldbuilding/chronodaemonia`. Do not apply Chronodaemonia tags to unrelated items. Use `art/use/reference` only when a generic reusable-reference selection is useful independently of any one project. Search the guide's branches before inventing a new medium tag, and use the smallest defensible set.

## Authorship contract

User material and agent material must remain visibly separate.

- For new standalone saves, order the visible body as a fetched banner, a fetched source-distinct representative image in a media-frame callout, an appropriate first H2, the owner's perspective or `> Placeholder`, then `## Agent Notes`. Omit either visual only after a documented failed web-source pass and the owner’s explicit approval. The first H2 may be the canonical title, a contextual section, or another useful heading; it begins the owner-owned area, so do not add a separate authorship heading for it.
- H1 headings are normally forbidden. Keep an unbroken hierarchy: H2 for major sections, H3 for their direct children, then H4 and deeper as needed. If a section is nested beneath a new parent, demote the section and all descendants together. Use Latin/ASCII or transliterated filenames for newly generated notes and assets; retain original-language text in aliases and prose.
- Always include the owner's perspective directly after the representative image, drawing only from thinking already attributable to them in the working context or relevant vault notes inspected during connection discovery, or use `> Placeholder` when no personal thinking is available. Preserve deliberate prose and direct quotations exactly; otherwise follow the first-person journal-edit rule in `SKILL.md`. Do not label this material with a separate H2.
- Keep the `agent-save` marker-delimited `## Agent Notes` section at the bottom. Accept imported legacy `codex-save` markers or a `## Codex Notes` heading; the save update helper migrates them when it updates the note.
- Do not add a horizontal divider or visible agent-authorship callout; the hidden markers are the editing boundary.
- Treat frontmatter, source identity, and embeds as note infrastructure rather than user prose.
- On later saves, merge or refresh the existing agent block instead of appending multiple assistant sections.
- Never move the user's old prose into the agent block.

## Default depth

The skill is for both jogging memory and building a connected knowledge base. Keep fleeting captures and terse recommendations compact, but research durable media and knowledge subjects beyond their resolver metadata. Give standalone subjects enough structured content to recover their context, substance, development, significance, and limitations later. Follow `research-depth.md` for source and connection targets; do not pad a note merely to reach a length.

## Granularity and abstraction

Source works, media objects, personal entries, projects, and topic notes may remain substantial when their material serves one clear purpose. When research exposes a separate concept, argument, mechanism, lineage, technique, or question that can be titled, explained, and linked independently, extract it into the existing role-appropriate home: `Infinity/` for evergreen ideas, `Matter/` for durable references/tools, `Continuum/Media/` for media subjects, and `Underwork/` for active-project knowledge. Keep the source/work note as the access point and explain the relationship inline. Never split the owner's prose merely for neatness, do not manufacture thin notes or one-paragraph stubs, and do not create a new MOC unless several child notes need an actual navigational home.

## Daily fallback

The Journals plugin is the periodic-note authority; the core Daily Notes plugin is disabled. Journals creates `Continuum/Time/Daily/YYYY-MM-DD.md` from `Strata/Templates/Time/Journals/Daily Note.md`: a banner embed, a generated `<!-- journal-graph:start -->` / `<!-- journal-graph:end -->` region, then `## Tasks`, `## Notes`, and the optional `## Agent Review` and `## Processed Agent Instructions`. Use `scripts/append_daily_capture.py` for fleeting clipboard material: it adds the exact capture as a `###` entry at the end of `## Notes`, asking Journals to create today's note when it is missing. This is a last routing option, not a substitute for resolving a durable subject or an existing personal/project home.

## Attachment behavior

The observed Obsidian setting is:

```json
{"attachmentFolderPath": "Strata/Attachments"}
```

Assets are filed in subfolders mirroring their owning note's path, as the vault guide's attachment rule describes; use the `suggested_relative_path` from `acquire_image.py --note`. Use descriptive lowercase filenames such as `harbour-lighthouse-at-dusk.jpg` or `album-cover-front.png`. Do not rename existing assets to match.

## Banner composition

Prefer wide source compositions near 16:9 (1.78:1) or 16:10 (1.6:1), normally at least 1200 pixels wide and 675 pixels high. Favor images whose meaningful subject matter survives a banner crop; reject square art placed inside wide padding, extreme panoramas, and layouts whose essential text or face will be cut off.

Use this semantic fallback order:

1. Official or canonical wide imagery for the exact work or subject.
2. Creator portraits, production stills, locations, historical events, techniques, artifacts, or other concrete topics materially covered by the note.
3. Defensibly sourced thematic imagery whose relationship is explained by the note.
4. As a last resort, a banner derived with `--derive-banner` from usable official art, inspected before commit, with its original source recorded.
5. Generated imagery only after the web-source pass is documented as exhausted and the owner explicitly approves the exception; declare it as generated.

Do not choose generic mood art merely because its colors fit the vault. A banner should help identify the note after the title has faded from memory.

## Connection search

Search these active areas by default:

- `Continuum/Media/` for related works and lists.
- `Infinity/` for developed ideas and research.
- `Underwork/` for live projects that actually use the source.
- `Matter/` for durable technical/reference relationships.
- `Entropy/` for an existing purpose-built hub.

Exclude `Continuum/Personal/`, journals, `Strata/`, and the archive unless the user explicitly makes them relevant. Read a candidate before linking it. A filename match is evidence of vocabulary, not of meaning.

For durable subjects, make two distinct passes: exact entities first, then concepts and relationships discovered during research. Inspect relevant neighboring notes even when their filenames do not resemble the captured title. Every added link should explain a concrete relationship; a backlink count is not evidence of a knowledge graph.
