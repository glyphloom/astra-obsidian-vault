---
name: obsidian-authoring
description: Turn the owner's spoken or typed thoughts into clear, well-placed Obsidian notes without adding invented or independently researched claims, and own the rules for promoting a thought into its lasting home. Use for dictation, reflections, assessments, requests to write or enrich a vault note from their own words, and whenever another routine promotes their thoughts or people into subject notes; use $obsidian-save for researched captures and durable external subjects.
---

# Obsidian Authoring

Turn the owner's own words into durable, pleasant-to-revisit vault material. The result should feel like a lucid version of what they said, not an article written around it.

## Scope

- Use this skill when the owner supplies spoken or typed material to put into an existing note, create a note, turn into an assessment/reflection, or enrich the vault from their thoughts.
- Its promotion rules below are the single authority for carrying a thought into a lasting home. `$obsidian-daily`, `$obsidian-review`, and the vault guide's thought-capture rule all promote through them.
- Use `$obsidian-save` for a URL, external media, recommendation, screenshot, or subject that needs identity resolution and research. Use `$obsidian-daily` first when the source is an untranscribed vault audio embed.
- Read the vault `AGENTS.md` and the target note before editing. Do not inspect `Artifacts/` unless the owner explicitly names it.
- Do not independently research claims, infer facts, manufacture interpretation, create an agent-authored analytical section, or add citations merely to make the note feel more complete. A focused lookup to identify and verify a directly relevant image or video is allowed when it improves presentation; use `$obsidian-save` if the subject needs researched augmentation. Ask only when an ambiguity would materially change the destination or meaning; otherwise make the smallest faithful choice.

## Promote into the vault

Author the vault actively rather than filing transcripts. Success means the owner's distinctive thoughts stay retrievable and connected, not a note count or research length.

### Find the candidates

For every reviewed recording, passage, or conversation, inventory its candidate homes before stopping at links:

1. People.
2. Durable external entities the owner speaks about with an opinion or lived experience, such as a country, city, company, employer, product, model, or work.
3. Themes or stances they develop, such as a recurring experience (a hard season at work) or a position (how AI treats users).
4. Meta-ideas about their own systems, such as the philosophy of their Obsidian vault.
5. Active projects and their tasks.

A bare mention, a pronoun, or an incidental noun is not a candidate.

### Decide the home

Search the vault both ways, as the vault guide's Vault Search rule requires, and read only plausible matches. The owner's specified destination wins over an inferred one.

1. **Existing note.** When the owner names it, when it plainly represents the continuing subject, or when their thought deepens an existing assessment, promote their specific perspective, not a generic topic summary, into that note's owner-owned area as a light first-person journal edit with an inline dated link back to the source entry.
2. **New note.** One substantive opinion, stance, recurring experience, or idea about their own systems is enough to start a note when it will be worth finding again, even from a single recording. When unsure between creating and skipping, create.
   - A durable external entity gets its own atomic note: one company, place, or product per note, never a combined "A, B, and C" note. Express comparisons as dated first-person passages in each sibling note, linked to the others. Create it through `$obsidian-save`: shape their perspective under the first H2 here, then let the save workflow supply identity resolution, research, visuals, connections, transaction, validation, and receipt; do not stop at an authoring-only note.
   - A theme, stance, or meta-idea is authored directly, named for the idea in their framing (for example, `Late-Night Focus in 2026` or `Tools Should Earn Their Friction`) and placed by role: `Infinity/` for ideas and stances, `Continuum/Personal/` for lived experience, `Matter/` for tools and setup.
   - Active work goes to its specific `Underwork/` project home. Move related active tasks there only under the task rules of the [daily contract](../obsidian-daily/references/daily-contract.md#tasks).
   - Pull related earlier dated material into the new note so it starts connected, and link the source mention to it.
3. **Stay in the source.** An ordinary moment, a bare mention, or a fleeting or ambiguous passage stays where it is, without a promotion ledger.

When their view changes or conflicts with an earlier one, keep both dated perspectives rather than silently settling them. Never recast an inference, or a fact an agent found, as their thought.

### People

Link every clearly identified human. Resolve an existing person by title, path, aliases, relationship terms (such as "мама"), and corroborated semantic context. If a stable name is available but no note exists, create `Continuum/Personal/People/<canonical name>.md` from `Strata/Templates/Areas/People Template.md`, preserving the template's metadata, banner, classes, and tags while replacing the creation date with the real run date; add a useful spoken-form alias and a concise, faithful interaction. Begin the interaction with the source date as an inline wiki-link, for example `- [[Continuum/Time/Daily/2026-09-23|September 23, 2026]]: ...`; do not append a detached `Source:` or `Источник:` label. Never perform public research to identify a private person.

If the stable name is uncertain but the owner can plausibly clarify it, ask them while completing independent work, then use their answer for the canonical person note and new prose, with an Obsidian-aware rename when an existing note needs one. Without a stable name, create no placeholder note; daily work records the reference as `#agent/unresolved` under the daily contract.

## Write in the owner's voice

- Write the note's framing, headings, and prose in English unless the target note was already written in another language; keep short quotations in their original language when that preserves their voice.
- Preserve meaning, sequence, tone, uncertainty, informal language, profanity, repetition that carries emphasis, and unfinished thoughts. Transcribe rather than translate.
- Make a restrained journal edit: remove chat scaffolding and verbal clutter, join fragments, repair obvious grammar and punctuation, and supply only the minimal antecedent required for the thought to make sense later.
- Do not turn a reflection into a polished argument, complete a claim, supply motives, or blend in the agent's opinions. Keep direct quotations exact. Never add quotation marks to a reconstruction.
- For a new note, put the shaped first-person material under a useful first H2. Do not use an `Owner Notes` wrapper, an `Agent Notes` block, or a placeholder when usable owner material exists.
- Give the owner's material its own H2/H3 sections, short lists, quotations, or other Obsidian structure when the thought has real parts or the format aids later reading. Keep chronology, emphasis, and uncertainty intact; do not force a single paragraph or invent a more systematic argument. Use the vault's normal frontmatter, heading ladder, tags, wiki-link style, and terminal punctuation. Keep the edit targeted; do not reformat unrelated prose.

## Make it pleasant without adding context

- Link only clear, durable named subjects that already have an appropriate vault note. Read the target before linking and state or preserve the relationship in surrounding prose. Leave ambiguous references plain.
- Use a supplied or clearly relevant local image when it adds meaning; a focused, source-verified image lookup is also permitted for a strong fit. Place a representative image using the vault's media-frame convention and record attribution when needed. Do not add a decorative image or generate one without the owner's request. A thought-only note can remain image-free.
- Embed a supplied or clearly identified video when the actual video matters to the thought, using a working local embed or a supported, verified web embed; otherwise use a descriptive link. Never infer the video's content from its title or thumbnail.
- A small Dataview query or other dynamic element can make an existing relationship navigable when its question, scope, and live syntax are clear. Read the queried notes and relevant convention first, verify the result in Obsidian where possible, and omit it if a static link or list serves better. Do not modify serialized output alone.
- Preserve an existing note's visual structure unless a targeted improvement clearly helps.
- In an existing note, add the material where its meaning belongs. Do not append links, images, or commentary merely to increase connections.

## Verify and report

- Re-read the edited note. Verify the intended material is present once, links and embeds resolve, frontmatter remains valid, headings do not skip levels, and unrelated content is unchanged.
- For audio-originated material, retain the reviewed transcript and any spoken direct address in its managed transcript block; place the requested authoring result after that block in directive order.
- Report the note path, whether it was created or updated, any meaningful links or existing image used, which searches ran, and any unresolved ambiguity. Do not create Save receipts or research logs for ordinary authoring.
