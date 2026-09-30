---
tags:
  - type/MOC
aliases: [Who and where]
created: 2026-09-24
cssclasses:
  - cards
  - cards-cols-3
---

## People

```dataview
TABLE WITHOUT ID file.link AS Name, standing AS Standing, found-in AS "Found in", last-seen AS "Last seen"
FROM "Continuum/People"
SORT last-seen DESC
```

## Places

```dataview
TABLE WITHOUT ID file.link AS Place, file.aliases AS "Also called"
FROM "Continuum/Home" OR #history/varda
WHERE !contains(file.folder, "People")
SORT file.name ASC
```
