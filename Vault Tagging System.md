---
tags:
  - tech/software/obsidian
  - type/guide
aliases:
  - Tagging System
  - Vault Tagging Guide
created: 2026-09-16
---

## Purpose

Tags exist to create useful selections across folders. They are not a complete ontology, a substitute for note titles, or a way to encode every fact about a note.

A tag earns its place when it supports at least one of these uses:

- Finding a meaningful group of notes.
- Driving a Dataview query, dashboard, or workflow.
- Marking a durable relationship to a project or domain.
- Distinguishing a note role that cannot be inferred reliably from its folder or title.

If a tag would only describe one obvious fact about one note and is unlikely to support selection, omit it.

## Core Model

The taxonomy has four primary facets.

| Facet | Purpose | Examples |
| --- | --- | --- |
| Domain | What the note is substantively about | `physics/theoretical/cosmology`, `art/music/hip-hop` |
| Relationship | Where the note is used | `art/worldbuilding/chronodaemonia/reference` |
| Operational type | What workflow or navigation role the note serves | `type/project`, `type/MOC`, `type/milestone` |
| Period | Which periodic-note system owns the note | `time/daily`, `time/weekly` |

A note may combine facets when each supports a useful selection. For example, a hip-hop track used as a reference for a worldbuilding project called Chronodaemonia can carry both `art/music/hip-hop` and `art/worldbuilding/chronodaemonia/reference`.

## General Rules

1. **Tag for retrieval, not description.** Do not reproduce the title, filename, author, or obvious object class unless a query needs it.
2. **Prefer an existing branch.** Search the tag inventory before creating a synonym or parallel hierarchy.
3. **Use enough depth to disambiguate.** Dense domains normally use at least three components: `root/branch/subject`.
4. **Do not add both a parent and its child.** `physics/theoretical/cosmology` already belongs beneath `physics` and `physics/theoretical`.
5. **Keep facets separate.** An intrinsic classification and a project relationship answer different questions and may coexist.
6. **Avoid one-note taxonomy for its own sake.** A unique tag is acceptable when it establishes a reusable branch, but not merely because a phrase can be converted into a tag.
7. **Use few strong tags.** One to three tags is normal. Add more only when they represent genuinely independent retrieval paths.
8. **Bare domain roots belong on hubs.** Tags such as `art`, `media`, `physics`, and `tech` are appropriate on their domain hubs, not ordinary content notes.

## Canonical Domain Branches

### Art

`art/*` describes creative form, genre, practice, or creative-project context.

- `art/games/<project>`
- `art/genre/<genre>`
- `art/interactive/roleplay[/<system-or-function>]`
- `art/music/<genre-or-musical-aspect>`
- `art/use/reference`
- `art/visual/<practice>`
- `art/worldbuilding/<project>[/<relationship-or-subdomain>]`
- `art/writing/poetry[/<theme>]`
- `art/writing/prose[/<form>]`

Examples include `art/genre/horror`, `art/music/electronic`, `art/visual/drawing`, and `art/writing/prose/blog`.

### Media

`media/*` describes the medium, consumption format, platform, or media-management role. Music belongs under `art/music/*`; do not recreate `media/music/*`.

- `media/audio/<format>`
- `media/culture/<phenomenon>`
- `media/interactive/<format>[/<franchise>]`
- `media/list/<list-kind>`
- `media/platform/<platform>`
- `media/text/<activity-or-format>`
- `media/video/<format>`

Examples include `media/audio/podcast`, `media/interactive/games`, `media/platform/youtube`, `media/text/reading`, and `media/video/film`.

### Mathematics

`mathematics/*` uses a broad field followed by the actual subject.

- `mathematics/foundations/<subject>`
- `mathematics/geometry/<subject>`
- `mathematics/topology/<subject>`

Examples include `mathematics/foundations/category-theory`, `mathematics/geometry/algebraic`, `mathematics/geometry/sheaf-theory`, and `mathematics/topology/knot-theory`.

### Physics

`physics/*` separates subject matter from source and research context.

- `physics/context/<context>`
- `physics/experimental/<subject>`
- `physics/observational/<subject>`
- `physics/research/<artifact>`
- `physics/source/<source-kind-or-source>`
- `physics/speculative/<subject>`
- `physics/statistical/<subject>`
- `physics/theoretical/<subject>`

Examples include `physics/experimental/muon-g-2`, `physics/source/transcript`, `physics/statistical/thermodynamics`, and `physics/theoretical/relativity`.

### Technology

`tech/*` distinguishes technical subject, software, platform, and project context.

- `tech/ai/<subject-or-tool>`
- `tech/os/<platform>[/<version>]`
- `tech/programming/<language-or-subject>`
- `tech/project/<project>`
- `tech/software/<application-or-subject>`

Examples include `tech/ai/codex`, `tech/os/macos/26`, `tech/programming/go`, `tech/project/public-vault`, and `tech/software/obsidian`.

### Other Domains

Smaller domains may remain shallower until they become crowded. Extend them only when a useful intermediate grouping emerges.

- `history/<period-or-place>`
- `job/<project-or-function>[/<subproject>]`
- `learning/<program-or-subject>[/<artifact>]`
- `life/<area>[/<specific>]`
- `philosophy/<field-or-method>`

Do not add a third level merely to satisfy a number. Depth must express a meaningful grouping.

## Project References

Classify a reference by both its intrinsic nature and the project relationship when useful.

```yaml
tags:
  - art/music/hip-hop
  - art/worldbuilding/chronodaemonia/reference
```

A reference may serve more than one project and can therefore carry more than one relationship tag. Use `art/use/reference` only when a generic reusable-reference selection is useful independently of any one project.

Do not replace intrinsic classification with a generic reference tag. A film remains `media/video/film`; a song remains under `art/music/*`; a game remains under `media/interactive/games`.

## Operational Types

`type/*` is reserved for roles that support navigation, maintenance, or workflow.

Current useful types are:

- `type/MOC`
- `type/hub`
- `type/project`
- `type/milestone`
- `type/checklist`
- `type/guide`
- `type/stub`
- `type/daemon`
- `type/hide`

Do not use `type/*` merely to identify what a note depicts. Tags such as `type/person`, `type/artist`, `type/song`, `type/genre`, and `type/workbook` usually add no useful selection beyond the domain category, title, or folder.

Before introducing a new type, identify the query, dashboard, or workflow that will select it. If none exists or is reasonably planned, do not create the type.

## Time, Tasks, and Meta Tags

- Use `time/daily`, `time/weekly`, `time/monthly`, and `time/yearly` for periodic notes.
- Do not use `time/tasks`. Tasks are represented by Obsidian task syntax and the special inline `#task` marker.
- Use `agent/unresolved` only as a temporary workflow marker for an entity or interpretation that needs a later agent pass. Keep one deduplicated canonical editable item under the source daily note's `## Agent Review`, following the schema in [[Strata/Skills/obsidian-daily/references/daily-contract.md|Obsidian Daily contract]]; remove it when resolved. It is not a durable subject taxonomy.
- Keep agent and user workflow tags on separate roots. `agent/update`, `agent/message`, and `agent/unresolved` are written by agents; `user/request` (legacy `user/inbox`) and `user/clarification` are the owner's instructions and answers to agents, following the same [[Strata/Skills/obsidian-daily/references/daily-contract.md|Obsidian Daily contract]]. The spellings `agent/inbox`, `agent/request`, and `agent/clarification` are retired.
- Treat `#task` as workflow syntax, not ordinary taxonomy.
- Use `type/hide` for hidden or excluded notes.
- Preserve other `meta/*` tags as reserved infrastructure unless a deliberate migration is requested.

## Self-Tagging Checklist

When tagging a note, ask these questions in order.

1. What durable domain selection should find this note?
2. Does that domain already have an appropriate branch?
3. Is the tag deep enough to avoid mixing unrelated subjects?
4. Is this note related to a project in a way worth querying?
5. Does it have an operational role such as project, milestone, guide, or MOC?
6. Am I adding a tag that merely repeats the title or object class?
7. Have I added both a parent and child unnecessarily?
8. Would I realistically search, query, or browse this tag again?

If the final answer is no, remove the tag.

## Examples

| Avoid | Prefer | Reason |
| --- | --- | --- |
| `physics/cosmology` | `physics/theoretical/cosmology` | Separates theoretical subject matter from sources and observations |
| `mathematics/algebraic-geometry` | `mathematics/geometry/algebraic` | Groups related geometry branches |
| `media/film` | `media/video/film` | Places film beneath its medium |
| `tech/obsidian` | `tech/software/obsidian` | Distinguishes software from projects, operating systems, and programming |
| `art/horror` | `art/genre/horror` | Distinguishes genre from medium or practice |
| `type/song` | `art/music/hip-hop` | The useful selection is musical category, not the obvious object class |
| `type/person` | A relevant domain tag | A person's relevance matters more than the fact that they are a person |
| `time/tasks` | Task syntax or `#task` | Tasks are workflow items, not a time domain |
| Parent and child together | The narrowest useful child | Obsidian's nested tags already imply the parent |

## Maintenance

When changing the taxonomy:

1. Search for all assignments and Dataview references to the old tag.
2. Inspect relevant `Strata/` templates, configs, and examples so they do not regenerate deprecated tags.
3. Exclude historical generated exports and plugin cache or index data from textual migration.
4. Migrate the smallest coherent branch rather than performing speculative global normalization.
5. Update source queries and serialized query definitions when applicable.
6. Verify that no active note is left untagged or with malformed frontmatter.
7. Update this guide and the concise agent rules in [[AGENTS.md]] when the convention itself changes.
