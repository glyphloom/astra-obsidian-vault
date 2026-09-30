---
tags:
  - tech/software/obsidian
  - type/guide
aliases: [Portable vault guide, Tour]
created: 2026-09-22
status: active
cssclasses:
  - banner
  - banner-fade
---

![[Hubble Veil Nebula.jpg|banner]]

## A Five-Minute Tour

The notes are invented. They belong to a provenance analyst at Archive, a company that sells subscriptions to having existed, during a week in which history keeps being rewritten around her. The setting borrows from the owner's Chronodaemonia universe, where the past can be rebuilt and only records, witnesses, and memory resist it. The Obsidian settings, templates, plugins, snippets, and agent skills are the real ones, filtered so that history, private notes, and credentials stay behind. [[Matter/Obsidian/Plugin Settings Reference|Plugin Settings Reference]] shows what each plugin keeps.

1. **The homepage.** [[Entropy/Public Vault Map|The map]] has a banner, a Base of every project, a Tasks query, a serialized Dataview list, a DataviewJS table, and a button.
2. **The week, day by day.** Read [[Continuum/Time/Daily/2026-09-21|Monday]] to [[Continuum/Time/Daily/2026-09-27|Sunday]] in order. A colleague disappears, the company gets 336 years older, and a balcony appears. Along the way:
   - Tuesday has a transcribed voice memo and an `## Agent Review` in which the daily agent flags a fact that changed.
   - Thursday has the daily agent's task comment, `### Task Updates` with block links, a `From Claude` callout, and a processed agent instruction.
   - Friday has a framed photo and finds [[Footnote]], an [[Errata|erratum]] wearing a missing man's name. Tuesday has a photo strip of the lobby plaque changing.
   - Sunday still has raw Daily Intake captures, one with a nested agent instruction, waiting for the nightly run.
3. **The reviews.** The [[Continuum/Time/Weekly/2026-W39|Week 39 review]] was written by the review skill, and it links up to [[Continuum/Time/Monthly/2026-09|September]].
4. **The work.** Start at [[Archive]], which has Mermaid and a Chronos timeline. Then open [[Clean Cut]], its [[Underwork/Archive/Clean Cut Board|Kanban board]], its [[Underwork/Archive/Varda Zone.canvas|zone canvas]], and the [[Clean Cut Briefing|steering deck]]: run **Start presentation** on it to see core Slides. [[Orrery Rerouting Run]] has a code block you can run in place.
5. **After hours.** The [[Quiet Ledger]] embeds a Base of every person note. Switch its view to see them as cards. [[People and Places]] shows the same people as Minimal cards.
6. **Tasks.** The [[Strata/Panels/Reminders Panel|Reminders Panel]] collects every `#task` and parks Later, Fading, and Dormant tasks under "Not now". Left-click a checkbox there to pick a status. [[Analyst Onboarding]] uses most of the statuses, and [[Maintenance]] groups the rest.
7. **Cards.** Open **Today's cards** from the ribbon and answer the cards in [[Black Provenance]], [[Sorting Is Never Free]], and the [[Rot Tier Field Card]]; each one sits as a small icon beside the line it asks about.

## What Each Snippet Draws

| Look for | Where | Snippet |
| --- | --- | --- |
| Banner with a fade into the page | [[Archive]], and most notes | `media-banners` |
| Banner shifted up the image | [[Balcony]] | `media-banners` (`banner-y30`) |
| Banner shifted to a different part of the image | [[Varda Parish Register]] | `media-banners` (`banner-y70`) |
| Framed image with a caption | [[Tomas Brandt]], [[Thursday Herring]] | `media-callouts` (`media-frame`) |
| Scrolling photo strip | [[Continuum/Time/Daily/2026-09-22#Afternoon\|Tuesday]] | `media-callouts` (`media-gallery`) |
| Voice memo, agent inbox, and Claude's own remarks | [[Continuum/Time/Daily/2026-09-22\|Tuesday]], [[Continuum/Time/Daily/2026-09-24\|Thursday]], [[Continuum/Time/Daily/2026-09-27\|Sunday]] | `agent-callouts` |
| Task status icons | [[Analyst Onboarding]] | `task-statuses` |
| Task dates as pills | [[Strata/Panels/Reminders Panel\|Reminders Panel]] | `task-metadata` |
| Reading width, tables, and properties | Everywhere | `content-layout`, `ui-typography` |

## Where Things Go

| Folder | Holds | Example |
| --- | --- | --- |
| `Entropy/` | Maps and dashboards | [[Entropy/Public Vault Map\|The map]] |
| `Continuum/` | Life, days, people, home, media, food | [[Tomas Brandt]] |
| `Infinity/` | Flat idea notes | [[A Record Is a Vote for a Past]] |
| `Underwork/` | Active projects | [[Quiet Ledger]] |
| `Matter/` | Reference material | [[Archive Glossary]] |
| `Artifacts/` | Finished or abandoned work | [[Project Many Happy Returns]] |
| `Strata/` | Templates, skills, and the exporter | [[Strata/README\|Strata]] |
