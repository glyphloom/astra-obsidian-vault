# Obsidian Daily contract

## Run scope

- **Journal day.** A day runs from 04:00 local time to just before 04:00 the next morning.
- **What to review.** Everything newly added or changed in daily notes since the prior successful daily run, including Daily Intake content once integrated and audio transcribed in the same run. Use the prior successful run in automation/task history as the boundary, together with daily-note modification time and current note contents. Do not create a separate tracker, ledger, checksum, or irreversible state record. Do not reprocess unchanged older prose; read only the limited surrounding context needed to understand a genuinely new passage or task reference.
- **Branches are independent.** Audio discovery finding nothing, or reporting issues (including exit 2), never gates Daily Intake integration, agent-comment review, or changed-note task review; report the audio issue and continue.
- **Silence.** A run is silent only when there are no recordings, intake blocks, pending `#user/*` items, changed daily-note content needing review, missed days to fill in, or issues requiring attention. Unchanged prior `#agent/unresolved` items after the sweep stay silent. Do not mutate an unchanged daily note merely to restate an old decision.
- **Not input.** The `## Processed Agent Instructions` footer and the managed `agent-review` blocks are agent-authored history. Exclude them from directive, comment, and task-intent processing.
- **Other routines.** Weekly, monthly, and yearly retrospectives belong to `$obsidian-review`; the daily run does not write them.
- **Language.** Everything the agent writes outside transcripts, including new notes, promoted passages, tasks, comments, Agent Review items, and headings, is English by default; write another language only inside a note that was already written in it before the agent edited it. Transcripts stay in their spoken language, and short quoted phrases may keep their original language.
- **Judgment.** Use agent reasoning, not a phrase matcher or deterministic NLP parser, to assess task intent and semantic duplicates. Do not use deterministic code to rewrite transcript language or infer wiki-links; the helper only applies final, reviewed text to one verified embed.

## Transcripts

### Fidelity

Preserve the recording's meaning, wording, order, tense, tone, language switches, incomplete thoughts, and informal language or profanity. Transcribe rather than translate.

Correct evident speech-to-text errors using the audio and established vault terms. Remove non-semantic filler sounds, an immediate abandoned repetition or repair, accidental stutter, and speech parasites aggressively by default, including "well," "yeah," "like," "you know," and their equivalents. Retain one when it materially carries emphasis, hesitation, contrast, or distinctive voice. Preserve a genuine search for a word, revealing self-correction, memorable phrasing, or repetition when it carries humor, emotion, uncertainty, language ability, or other personal texture that may matter on rereading years later; when unsure whether a disfluency is merely parasitic or meaningfully characteristic, preserve it. Do not sanitize or replace profanity. A repeated or abandoned swear may be removed only when it is plainly non-critical and its removal does not soften, change, or misrepresent the thought. Repair punctuation and paragraphing conservatively. The result should remain recognizably spoken, but be pleasant to revisit.

Do not summarize, reorganize, explain, embellish, or complete an unfinished thought. Use `[unclear]` or `[неразборчиво]` where the audio cannot support a confident reading.

### Eligible audio

Automatic discovery is restricted to recordings with strong provenance anywhere in the included vault: the exact Obsidian Recorder basename `Recording YYYYMMDDHHMMSS.m4a`, and Daily Intake names `telegram-voice-<identity>.oga`, `.ogg`, or `.opus`, issued only for authenticated, non-forwarded Telegram `message.voice` submissions. Do not infer speech from an extension: forwarded voice, arbitrary embedded music, generic `.m4a`/`.mp3`/`.oga`/`.ogg`, Telegram `message.audio`, and video are ignored without issue. Discovery also excludes archive, generated (including the `Strata/Public Vault/` export), template, and cheat-sheet material, and refuses an eligible recording embedded in more than one note. Existing managed transcript blocks remain valid regardless of their older filename. An unrecognized but supported file is transcribed only after an explicit, reviewed `transcribe --audio` selection; older generic Telegram `.oga` files stay untouched unless manually selected or renamed to a recognized Daily Intake voice name.

### Transcription

`transcribe` uses FFmpeg to decode an explicitly selected source into a temporary mono 16 kHz WAV outside the vault, then makes one MLX Whisper call at a time. Recordings longer than about 90 seconds are split from the normalized WAV into external temporary chunks near silence, aiming for 30–60 seconds with a hard-ish 90-second maximum and a 1.5-second overlap; output is stitched in time order, removing only an exact or near-exact overlap duplicate. Its JSON preserves segment times, text, model metadata, and review flags for extreme repeated phrases or implausible word density. A flag identifies a segment to check or retry against the recording; it never authorizes invented replacement wording. Source media remains unchanged and all temporary WAVs are removed automatically. Weights and model caches stay outside the vault; a first real transcription may download them there.

### Vocabulary

Build the prompt with `vocabulary --note <vault-relative-path>` and pass its returned `prompt` unchanged to `transcribe`. Priority is: the optional local vocabulary file `references/vocabulary.txt` first, when the owner has created it (one canonical term per line; `#` lines are comments; it is not shipped because it holds private names); the owning note's stem, aliases, wiki-link targets and display terms next; relevant owning/linked folder names after that; global included-note titles and aliases last. Do not use a naive first-N-character cut. Exclude `Artifacts/`, `.obsidian/`, `Strata/`, generated exports, templates, caches, and transactional staging.

Whenever review corrects a misheard stable name (a person, project, place, product, or the `Agent`/`Агент` address), in an improved pass or by hand, add its canonical spelling to `references/vocabulary.txt` in the same run unless it is already there, creating the file if it does not exist yet. Do not add ordinary words.

### Search and name correction

After each rough transcript, and before settling names, links, topic homes, or task duplicates, search the vault both ways under the vault guide's Vault Search rule: an exact search and `search_vault_smart`, at least once per recording or topic cluster, using its names, people, places, and subjects. Both are mandatory; grep alone does not satisfy this step. When `search_vault_smart` refuses the connection, use the live-port call in that rule before falling back to exact matching alone. Report in the run which searches ran. An exact path, title, or alias match wins; a semantic result is candidate evidence that the spoken context must corroborate.

If a likely name remains suspicious, make at most one improved retranscription pass for the intended whole recording with the candidate term in the prompt, then review and replace only the suspicious span.

### Recording entries

Give every ordinary recording entry one concise descriptive heading at the correct level in its owner note's existing hierarchy; under a daily note's `## Notes`, use `###`. Place the heading before its managed markers. A recording in which the owner speaks about their tasks stays under `## Notes` with its source audio and transcript; its heading may be `### Task Updates` when that describes the recording. The separate agent-authored task delta belongs under `## Tasks` (see Tasks).

Give an ordinary reviewed transcript to `insert` (or explicit `replace` for a requested redo of one recording; automatic work never replaces a managed block). It creates an `agent-audio-transcript` marker pair around `> [!audio-transcript] Spoken`, moves the original embed into that block as its first line with its exact target and alias, and quotes every transcript line. Do not hand-quote or pre-style the reviewed text. An agent-directed recording from a Daily Intake instruction uses `--spoken-for-agent`, which creates or retains the collapsed `> [!audio-transcript]- Spoken for Agent` callout; all such recordings from one bundle share one concise topical `###` heading without queue metadata, followed by their ordered blocks, never separate normal spoken entries. `migrate` performs the corresponding explicit structural conversion for one verified legacy or managed recording, and `restyle` explicitly updates a verified block whose already-reviewed direct address is written `*[[Agent]], …*` or `*[[Агент]], …*`. Both are explicit-only.

The managed audio block is indivisible: never split it or put a heading, fulfillment content, or media inside its markers. Never create companion notes or alter the recorded audio attachment. Every helper mutation makes a backup under `Strata/.backups/daily-audio/` and writes the note atomically.

Every recording longer than 60 seconds should autonomously receive one fitting, preferably fresh internet-sourced image when a concrete discussed subject supports it. Save it as a vault-local attachment and put it in a media-frame with concise factual alt text immediately after the transcript block, outside its markers, and keep its source in the run report. Skip only when no defensible concrete subject exists.

During review, inspect adjacent supplied context such as bare URLs, pasted text, images, and short notes. When it is clearly attached to the recording, use it as transcription or context evidence and integrate it naturally into the relevant spoken text or recording entry, then remove or rehome a dangling duplicate. Preserve context that is unclear or unrelated.

### Directives

Before inserting reviewed text, run `directives --transcript-file <path>`. A direct address to `Agent` or `Агент` in the comma form, or an instruction-led opening with a period, is a directive. Matching is case-insensitive and accepts comma-like punctuation and surrounding whitespace; ordinary mentions of these words remain transcript text. The parser returns exact Unicode offsets, which anchor relative wording such as "here."

Keep the full directive in its spoken position; the helper wraps the exact words in `<span class="agent-audio-directive"><em>…</em></span>` so the spoken instruction is quiet but visible. The agent may execute a safe, unambiguous instruction explicitly authorized by that directive in the owning note. Public research and a relevant vault-local attachment, source link, or embed are permitted only when requested (the autonomous recording image above excepted). Put every fulfilled result after the closing marker, in directive order; never inside the styled spoken block. `Here` means adjacent after that block. Add only the requested artifact or link, plus only the structural Markdown needed to render it; no explanatory prose, recommendations, captions beyond required factual alt text, or adjacent sources by default. A direct spoken instruction may add a separate vault-local asset when that is what it requests.

When a directive asks for a durable note about a concrete subject and supplies sufficient source or context, create or merge that note; if it loosely offers either a link or a note, do not under-deliver with only a dangling link.

Never automatically execute destructive actions, uploads, external messages or publication, purchases, account changes, scripts outside the requested vault scope, or ambiguous requests; keep the styled directive and report it for confirmation.

## Daily Intake

Daily Intake may append standalone temporary blocks or one mixed bundle beneath `## Notes`, immediately before `## Agent Review` when that section exists. An item belongs to the journal day of its Telegram submission timestamp, even when a queued item is resolved later; a mixed bundle belongs to the day of its earliest submission. There is no `## Intake` heading.

- A standalone ordinary capture is a `> [!daily-intake] Intake · HH:mm` callout paired with an adjacent hidden `<!-- daily-intake:... -->` marker.
- A mixed bundle is one outer `> [!daily-intake] Intake bundle` callout paired with one adjacent marker; its ordered members do not display timestamps, and agent-designated members are nested `agent-inbox` callouts at their ordered positions.
- Treat each standalone marker/callout pair, or a bundle's outer pair, as one temporary block without depending on optional blank lines.

**Ordinary captures.** Integrate each well-formed standalone capture by its `HH:mm` timestamp, and each ordinary bundle member in its existing order, into the owning daily note's existing chronology and sections. Move associated prose, embeds, and other content together, preserving the user's wording. Two or more photos sent together as one Telegram album go, in order, into one `> [!media-gallery]` callout (a horizontally scrolling strip) instead of stacked full-size images. If a destination is ambiguous, the block is malformed, or integration cannot safely complete, preserve the unresolved content with its outer marker/block and report the issue.

**Agent instructions.** An `> [!agent-inbox] Agent inbox · HH:mm #user/inbox` standalone callout, or an `> [!agent-inbox] Agent inbox #user/inbox` callout nested in a bundle, is an instruction block, not journal content; the tag sits on the callout-title line. Fulfill only safe, unambiguous instructions whose effects are confined to the vault and authorized by the block, under the directive safety boundary above. When an instruction has an associated recording, fulfilling it keeps its exact marker attributes, audio embed, transcript, and order beneath one shared bundle heading in collapsed `Spoken for Agent` blocks. Remove a standalone instruction and its marker, or a nested instruction from its bundle, only after successful fulfillment; otherwise preserve it intact and report it. Delegate an instruction whose work is not the daily routine itself (a skill or plugin change, a vault-wide migration, research, a new note that needs `$obsidian-save`) to a subagent with enough context to act alone, running independent subagents in parallel so the daily pass stays small; the daily run keeps transcription, integration, task reconciliation, and each instruction's final disposition. Fulfilled instructions are archived under Processed Agent Instructions.

**Bundle cleanup.** Remove a mixed bundle's outer callout and marker only after every ordinary member and nested instruction has been safely dispositioned. Do not clean up unrelated empty headings.

**Intake presentation.** If the owner comments on how adjacent agent-inbox members look inside an unprocessed bundle, assess that temporary display itself; their later shared heading in processed history is a separate outcome. Preserve distinct member identity and order unless a concrete plugin change is justified, and state the decision about the temporary display when dispositioning the comment.

## Tasks

### Intent

Intent is decisive. Infer a task when new material clearly communicates that the owner wants or needs an actionable thing done, even without a fixed request phrase. "I need to renew my library card" is a task; "I will make this concept true someday" is an aspiration. Do not create a task for vague wishes, speculation, discussion of a topic, or intent that cannot yet be acted on. A concrete actionable item they explicitly set aside with little present commitment may still be kept with a not-now status; this does not make a vague dream actionable. Preserve the source prose and transcript exactly: task extraction is a separate structured edit.

### Placement

Place an ordinary new task at the top of its source daily note under `## Tasks`, before `## Notes`, as `- [ ] <concise faithful task> #task`. Use an existing `## Tasks` section or create it in that position without moving unrelated content. Keep an ordinary list unless meaningful groups genuinely help a long list; then use concise `###` groups. Never carry tasks into a later daily note. When a continuing, specific project or subject note becomes the durable home for an existing daily task, move that task there once, preserving its status and intent, and leave a link to the new home in the source daily note's task-review comment.

### Deduplication

Before adding or changing a task, semantically compare it with active `#task` items across included active notes and daily notes, using both searches. Every configured status except done `[x]` and canceled `[-]` counts as active. Do not duplicate the same underlying intent. When new material clearly expands or refines an active task, update that task in its original note instead of adding another, keeping unrelated wording and metadata. Preserve its status unless new evidence supports a transition. New actionable intent normally starts as `- [ ]`.

### Statuses

Use a configured status only when the new material clearly establishes its meaning:

- `[/]` work actively under way.
- `[s]` Slow: long-running work that keeps advancing gradually with no near finish.
- `[w]` Waiting: blocked on someone else's action or answer. It stays in the main Reminders list and returns to `[ ]` once the blocker clears.
- Not-now statuses, for a task the owner explicitly sets aside without closing it: `[>]` Later when they want it but have no time now, `[z]` Dormant when they intend to return once outside circumstances change, and `[~]` Fading when they probably won't do it but is not ready to make that permanent. They leave the main Reminders list but stay active for deduplication. Never infer one from a mere mention, an aspiration, or a task's age or neglect.
- `- [x] <task> #task ✅ YYYY-MM-DD` when new material clearly says it was completed.
- `- [-] <task> #task ❌ YYYY-MM-DD` when it clearly and finally abandons the intent; hedged wording such as "I don't think I will do that" makes it Fading `[~]` instead.

Use the run date. No other statuses are configured. Do not close, cancel, or alter a task on ambiguous evidence, or infer status from merely discussing its subject.

### Review comment and Task Updates

For each daily note whose new or changed material was reviewed, leave one concise dated Obsidian comment (`%% ... %%`) directly under `## Tasks`, or directly under `## Notes` when the closed day's empty Tasks heading was removed, explaining task decisions and deliberate non-changes. Keep it brief and avoid repeating the visible delta.

When tasks actually changed, add or update `### Task Updates #agent/update` under `## Tasks` after the real task list, listing the concrete added, refined, moved, completed, or canceled `#task` items. Give each delta a compact inline wiki-link to its exact task item: reuse an existing block ID, or add one unique, stable `^block-id` to the task line, and link with `[[vault-relative/path#^block-id|short task name]]`. Keep the real task's status, wording, and metadata intact. Use a Tasks-plugin query only when block links cannot represent the requested view and the query can be scoped without unrelated matches. This is an agent action log, not the owner's task-update transcript, a second task list, or a plan. Do not duplicate earlier deltas on a rerun.

### Closing an empty Tasks section

After a daily note's journal day closes and its intake, audio, and task review are complete, remove `## Tasks` if it holds neither actual task entries, active or completed, nor a nonempty Task Updates delta. Apply the same cleanup to older closed daily notes: remove only empty list placeholders and excess blank lines, moving any task-review comments directly beneath `## Notes`. Keep the heading while the journal day is open, while any task remains, or when a real delta is recorded there.

## Links and promotion

Link named, durable subjects during every review, including places and identified people referred to by a relationship such as "мама." Use an existing note when it plainly represents the spoken subject; otherwise keep a meaningful canonical wiki-link as an unresolved destination. Preserve the spoken display text with a wiki-link alias. Do not link conversational filler, pronouns, or ordinary incidental nouns, and leave genuinely ambiguous references as plain text.

After preserving the daily source, promote every reviewed recording or passage under the promotion rules of `$obsidian-authoring` (`Strata/Skills/obsidian-authoring/SKILL.md`): inventory its candidate homes, promote into existing notes, create atomic entity notes through `$obsidian-save` and theme or meta-idea notes directly, and create or link people. Insert and preserve the transcript first; the daily transcript remains the source, and promoted passages link back to it with an inline dated link. Clearly identified private people follow the person rules there, never public identity research. A private person without a stable name becomes an unresolved item below.

## Missed days

Memory is unreliable, and a daily note should show everything that happened that day, not only what the owner remembered to write. Each run, look for vault evidence of something they did on a day whose daily note does not mention it, covering every day since the prior successful run, including the one that just closed.

- **Only dated evidence counts:** a note whose `created` frontmatter is that day, or an entry inside a note that names the day itself (a dated heading or list item, or an inline link to that day's note). A modification time alone never counts, since it cannot say what happened or when.
- **Skip** daily and periodic notes, `Strata/`, `Artifacts/`, agent bookkeeping (Note Updates and review blocks), maintenance edits, and anything the daily note's own entries already link or mention. A Note Updates record does not count as a mention: it is a log, and the note still deserves its entry.
- **Write it** into that day's daily note under `## Notes`, one `###` heading per topic (a combined heading is fine when two threads belong together), each followed by a `> [!claude] From Claude` callout of one or two plain sentences in the second person saying what they did and linking the note with a wiki-link, so the note is tied to its day. State only what the evidence shows; never invent how they felt or why.
- Rerun safely: a day's note already linking the evidence gets nothing new.

## Agent Review

Add `## Agent Review` when the affected daily note needs a short record of an ambiguous task interpretation, a failed pipeline procedure, a concrete improvement suggestion, an unresolved entity, actual note changes made from that day's material, or an agent message. Keep review items separate from `## Tasks` and source prose; use compact bullets and merge or replace matching duplicates. When nothing actionable remains (no comments, unresolved items, failures, improvement notes, update records, or messages), remove the heading and its surrounding blank lines; never keep an empty section as scaffolding.

**Agent-owned items** are history or questions, never instructions or future task input; preserve the owner's edits to them.

- `- #agent/update **Note Updates (YYYY-MM-DD):**`, one top-level item with nested `Created:` and `Updated:` entries for the non-daily notes actually created or updated from that day's material. Link them through Obsidian URIs (`[Name](obsidian://open?file=<URL-encoded path without .md>)`), not wiki-links, so the log adds no graph edges. Record completed changes only, exclude the source daily note, and amend the same dated item if a correction changes the delta.
- `- #agent/message ` for an agent's explanation, disposition, or comment about the work, concise, nesting details only when helpful.
- `#agent/unresolved` for an unresolved entity or interpretation (below).

**The owner's items** use the `#user/*` root, top-level or nested beneath any agent item: `- #user/request ` asks for an action, a content fix, or a procedure change, and `- #user/clarification ` supplies an authoritative answer or context for the item it is attached to. Inspect them every run through `agent-comments`, which reports each with its `kind`. Apply a clarification to the item it qualifies (for example, correct a name everywhere it was used) before other work. Treat a request that points at a missed or unsatisfying result as a reflection on the routine: fix that content, generalize the cause into this contract or the relevant skill in the same run, and fix the same pattern in that day's other material. Keep unresolved or unhandled items here; archive handled ones under Processed Agent Instructions.

### Unresolved entities

Record each unresolved human reference or interpretation once, as this canonical editable item:

```markdown
- #agent/unresolved **Person: mother**
  - Source: [[#A Long Walk to the Harbour]]
  - Agent note: No stable name is available yet.
  - Your clarification:
```

Replace the label and source with the actual reference. Each item owns its own `Your clarification:` line; text the owner adds after it is authoritative and must never be overwritten. Every run sweeps prior items: inspect any filled clarification before semantic search, retry unresolved references against later vault context and semantic evidence, and when the clarification and corroborating context are sufficient, resolve, link, or create the person note, update the original mention, and remove the full item. Leave still-unresolved items unchanged and do not repeat them elsewhere. Deduplicate only when that does not erase a clarification.

## Processed Agent Instructions

Once an instruction (a Daily Intake agent-inbox block, a spoken agent-directed recording, or a top-level review request) has been fulfilled or explicitly dispositioned, keep it under the final `## Processed Agent Instructions` section, after Agent Review when that remains. This footer is history, never input.

- Remove the `#user/*` tag from a written record and put it in a collapsed `> [!agent-instruction]- Processed instruction` callout.
- Move a spoken instruction's complete, already-collapsed managed block without altering its markers, embed, or transcript.
- Records from one Daily Intake bundle share one `###` heading named for the instruction topic; keep queue numbers, bundle IDs, and other processing metadata out of the visible heading. The markers retain provenance.
- Every archived record stays collapsed by default.

## Legacy input

Older spellings stay readable but are never written:

- `#user/inbox` is the legacy form of `#user/request`; Daily Intake still emits it on agent-inbox callouts.
- Before 2026-09-27, the owner's tags were `#agent/request`, `#agent/clarification`, and `#agent/inbox`; `agent-comments` still reads them as input, and archiving removes them like `#user/*` tags.
- Imported `codex-audio-transcript` marker pairs, `codex-audio-directive` spans, and direct addresses to `Codex` or `Кодекс` remain valid and are treated like their `agent` forms.
