---
name: obsidian-review
description: Hold a conversational weekly, monthly, or yearly retrospective with the owner about their life — how they felt, what they achieved, what hurt, what they wonder about, and what to focus on next — then write a warm, evidence-backed review into the matching periodic note. Use for the scheduled evening reviews (Sunday for the week, the 1st for the month, January 1 for the year) or whenever the owner asks for a review or retro.
---

# Obsidian Review

A review is a conversation first and a note second. The vault supplies the evidence and the prompts; the talk supplies what the vault cannot know — how the period felt, what it cost, what the owner is proud of or chewing on. Then the review is written down so the owner can find this period again later and recognize themselves in it.

Talk with the owner where they can answer you, which is normally the session running this skill. Always speak in English, even when they write or speak another language or mix languages. Write the review in English as well, unless the periodic note was already written in another language before you edited it, as the vault guide's language rule allows; short quotes keep their original language.

## Choose the period

The owner or the scheduled routine may name the period (`week`, `month`, `year`, or an explicit `2026-W39`, `2026-09`, `2026`). Otherwise take the most recently closed period whose periodic note has no `agent-review` block. The Sunday-evening weekly review covers the week ending that day and treats it as complete. When one evening holds several reviews, do them in one conversation, largest period first, each written to its own note. Any other review of an unfinished period is allowed on request; call it "so far" in the review.

Weeks start on Monday, and the Journals plugin names them `YYYY-[W]w`, so a single-digit week has no leading zero (`2026-W6`). Periods close at the journal-day boundary, 04:00 local time.

## Prepare quietly

Do this before saying anything, and do not dump it on the owner.

1. Finish the daily layer first: run `$obsidian-daily` for the period's daily notes (its `discover` step and a check for leftover Daily Intake blocks or agent inbox items), so today's untranscribed recordings and intake are processed before you read them.
2. Run `python3 Strata/Skills/obsidian-review/scripts/period_evidence.py --vault . --start YYYY-MM-DD --end YYYY-MM-DD` from the vault root. It returns the period's daily notes, missing days, recording count, items closed in the period, every open `#task` with its age, notes created, people with mention counts and last-seen dates, projects touched, and other frequently linked notes. These are facts, not conclusions.
3. Read the material at the right altitude:
   - **Week:** every daily note in the period, including transcripts.
   - **Month:** the month's weekly reviews, then skim its daily notes for what they missed.
   - **Year:** the monthly reviews, then the weekly reviews and daily notes wherever the monthly layer is thin or missing.
   - The previous review of the same kind: its focus, bets, and open question are this review's first callbacks.
   - Hubs of the projects the evidence shows as active.
4. Build a private brief:
   - **Moments:** the few vivid things that defined the period, in the owner's own words where possible.
   - **Wins:** anything finished, shipped, learned, repaired, or bravely started.
   - **Stalls and the promises ledger:** things they said they would do, especially ones they postponed more than once ("tomorrow" that never came), and old open tasks that no longer match their life.
   - **State signals:** energy, sleep, mood, health, stress, joy, as they expressed them. Never diagnose.
   - **People:** who was close this period, who went quiet, promises to call or meet.
   - **Wonders:** open questions and ideas they kept returning to.

Thin evidence is normal. Missing days are not failures; never scold the owner for gaps.

## Talk

Open warmly and specifically: two to four sentences that show you actually read the period (a moment, a win, something funny they said), then the first question. Then have a real conversation:

- Ask one or two questions per turn. Follow their thread before moving on; ask the follow-up a good friend would ask.
- Cover, in whatever order the talk allows: how the period felt overall; their energy and state; what they are proud of; what hurt, drained, or annoyed them; what they are wondering about; the promises ledger; people; what they want from the next period. Pick up the previous review's open question and bets.
- Ask about the promises ledger with curiosity, not accusation: is it still wanted, blocked, or quietly dead? Offer to close, set aside as Later `[>]`, Dormant `[z]`, or Fading `[~]`, or reshape tasks accordingly.
- Reflect back what you hear, name patterns across periods, and gently point out when their present account differs from what they said at the time. Disagree when it helps them.
- Be a person: humor, warmth, their register (profanity included) are welcome. No therapist voice, no toxic positivity, no productivity sermons, no unsolicited clinical advice. If they signal real distress, slow down, stay with that, and drop the rest of the agenda.
- Scale the depth: a week is a coffee-length chat; a month goes deeper into trends; a year is a proper sit-down about the arc, changed views, and what they want the next year to be.
- The owner can stop at any time ("that's enough", "write it"). Write the review with what you have.

If the session cannot receive their replies (for example an unattended scheduled run), write an evidence-only review, say so in your own meta callout as its first element (Claude uses `> [!claude] From Claude`; see AGENTS.md), and leave the questions in it for the next conversation to raise.

## Write the review

**Target note.** `Continuum/Time/Weekly/YYYY-[W]w.md`, `Continuum/Time/Monthly/YYYY-MM.md`, or `Continuum/Time/Yearly/YYYY.md`. Create it when missing: copy `Strata/Templates/Time/Journals/<Weekly|Monthly|Yearly> Note.md`, resolve the Templater `created` placeholder to today, and add the Journals frontmatter that the latest sibling note of that kind carries (`journal`, `date`, `start-date`, `end-date`, with this period's values); for the first note of its kind, use `journal: Personal <Weekly|Monthly|Yearly>`, `date` as the period's first day, and `start-date`/`end-date` as its bounds. Keep the template's journal-graph region untouched; its plugin fills it.

**Placement.** Under `## Overview`, after any prose the owner wrote there, inside one managed block:

```markdown
<!-- agent-review:start period=2026-W39 surprise=haiku -->
### The One Where the Garden Finally Grew
...
<!-- agent-review:end period=2026-W39 -->
```

`surprise` records the surprise kind used, or `none`. One block per period: a rerun updates it in place and keeps any edits the owner made inside it. If an older agent reflection for the same period sits under `## Overview` outside a block, fold it into the block.

**Shape.** The `###` heading is the period's episode title. Then use `####` sections, dropping any that would be empty or forced:

- An opening paragraph: the period in a few human sentences.
- `#### How It Felt`: their state and feelings in their words, with short quotes kept in their original language, and your observations marked as yours.
- `#### What Moved`: achievements and progress with inline links to the evidence in the period's own notes.
- `#### What Hurt`: pains, drains, and frictions, honestly and without drama.
- `#### Wonders`: questions and ideas they are carrying.
- `#### Promises`: the ledger and what was decided about each item.
- `#### People`: who mattered this period, and anyone they want to reach.
- `#### Next`: one to three focus items with the reason for each, plus your bets.
- `#### Surprise`, when one was drawn.
- A closing line of small stats in italics: days journaled, recordings, items closed, notes born.

Write it to the owner in the second person ("you"), as a friend who was paying attention. Keep their statements and your inferences visibly distinct; never present a guess as their view. Link only one level down the periodic ladder: a week links to its days, a month to its weeks, a year to its months. Point a link at the relevant section when that helps, such as `[[Continuum/Time/Daily/2026-09-22#A Voice Memo from the Pier|the pier]]`, and reach people, projects, and subjects through the day or section where they happened, never by linking their notes directly. The periodic notes are already linked to each other, so this adds nothing to the graph; direct links would make every review the densest hub in the vault. Never use `obsidian://` links in a review; those belong to agent bookkeeping such as `#agent/update` records. It is a review, not a diary replay: do not restate each day.

**Consequences in the vault.**

- Concrete actions agreed in the talk become or update tasks in today's daily note under the task rules of `Strata/Skills/obsidian-daily/references/daily-contract.md` (semantic dedup against active `#task` items, updating originals, status transitions, closures with today's date, the `### Task Updates #agent/update` delta, and the dated `%% %%` comment). Focus items are not tasks unless they make them so.
- A durable thought they voice about a subject (a hard season at work, a project, a person, an idea) is promoted into that subject's note under `$obsidian-authoring`'s promotion rules, with an inline dated link to the review.

## Make it fun

Every review has an episode title, one quote of the period (verbatim, from a transcript or the talk), and the stats line. Also:

- **Bets:** make one or two small, checkable predictions in `#### Next`; score the previous review's bets honestly in this one.
- **Month:** name the month's theme or soundtrack when the vault supports one.
- **Year:** hand out a few awards ("Most Dramatic Migration"), collect the best quotes, and close with a letter to the owner's next-year self.

**Surprise.** Roll with `python3 -c "import random; print(random.random() < 0.3)"`. On `True`, add a surprise whose kind differs from the `surprise=` kinds in the last four review blocks (find them with `rg -o 'surprise=\S+' Continuum/Time`). Some kinds: a haiku about the period; an "on this day" callback to a year ago, or as far back as the vault goes; a forgotten note resurfaced with a new connection to now; a letter from the owner's past self assembled from their own earlier words; the period explained as a math problem; a fitting vault-local image in a `> [!media-frame]` callout; a question they would never expect. Inventing a new kind is encouraged. A surprise may also land in the conversation instead of the note. Surprises are never at the expense of accuracy or of something that hurt.

## Finish

Report in a few lines: the note written or created, tasks and subject notes changed, and whether the review came from a conversation or from evidence alone.
