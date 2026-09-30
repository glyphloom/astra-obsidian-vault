---
tags:
  - type/MOC
aliases: [Fourth Floor Vault, Home]
created: 2026-09-22
status: active
cssclasses:
  - banner
  - banner-fade
---

![[Webb Cosmic Cliffs.jpg|banner]]

> [!abstract] Fourth floor vault · public copy
> The made-up vault of a provenance analyst at Archive, the company that sells proof you existed, during a week in which history keeps changing under her desk. The notes are invented. The settings, templates, plugins, snippets, and agent skills around them are the ones the real vault runs on.

## Start Here

- **Today:** [[Continuum/Time/Daily/2026-09-27|Sunday 27 September]], with an intake still waiting for the nightly run.
- **The week:** [[Continuum/Time/Weekly/2026-W39|Week 39 review]], written by the review agent.
- **Work:** [[Archive]] and its biggest project, [[Clean Cut]].
- **After hours:** the [[Quiet Ledger]].
- **This copy:** [[Public Vault Seed|how it was published]].
- **How this vault works:** the [[Public Example Guide|five-minute tour]], [[AGENTS|rules for agents]], and the [[Vault Tagging System|tag guide]].

```button
name Open the Reminders Panel
type link
action obsidian://open?file=Strata%2FPanels%2FReminders%20Panel
color purple
```

## Projects

![[Strata/Bases/Projects.base]]

## Due Soon

```tasks
not done
due before 2026-10-05
path does not include Strata/
sort by due
```

## Recently Written

<!-- QueryToSerialize: LIST FROM "Infinity" OR "Continuum/Media" OR "Continuum/People" SORT created DESC LIMIT 6 -->
<!-- SerializedQuery: LIST FROM "Infinity" OR "Continuum/Media" OR "Continuum/People" SORT created DESC LIMIT 6 -->
- [[Noor]]
- [[Forgetting Is a Feature]]
- [[Receipt]]
- [[Sergeant Dace]]
- [[Sprints Are a Theory of Time]]
- [[The Disintegration Loops]]
<!-- SerializedQuery END -->

## The Vault in Numbers

```dataviewjs
const folders = ["Continuum", "Underwork", "Infinity", "Matter", "Entropy"];
dv.table(["Area", "Notes", "Open tasks"], folders.map((folder) => {
  const pages = dv.pages(`"${folder}"`);
  return [folder, pages.length, pages.file.tasks.where((task) => !task.completed).length];
}));
```

## Elsewhere

- [[People and Places]]: everyone and everywhere, as cards.
- [[Maintenance]]: what needs tidying.
- [[Artifacts/Project Many Happy Returns|Artifacts]]: where ambitious plans go to rest, and stay rested.
