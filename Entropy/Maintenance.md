---
tags:
  - type/MOC
aliases: [Tidy-up dashboard]
created: 2026-09-20
---

## What Needs Tidying

Rewrites leave mess, and so do I. This page lists what an agent or I should look at on the next maintenance pass.

### Notes Nothing Links To

```dataview
LIST
FROM "Continuum" OR "Underwork" OR "Infinity" OR "Matter"
WHERE length(file.inlinks) = 0 AND !contains(file.path, "Time/")
SORT file.name ASC
```

### Notes Without Tags

```dataview
LIST
FROM "Continuum" OR "Underwork" OR "Infinity" OR "Matter"
WHERE length(file.tags) = 0 AND file.extension = "md"
```

### Tasks Waiting on Someone

```tasks
status.name includes Waiting
path does not include Strata/
```

### Tasks Put Aside

```tasks
status.type is ON_HOLD
path does not include Strata/
group by status.name
```

> [!note]
> Kanban boards have no tags on purpose; they hold only their own `kanban-plugin` property.
