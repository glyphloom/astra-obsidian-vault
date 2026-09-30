# Astra Vault

A small plugin that gathers one vault's specific features. Each one has its own toggle in **Settings → Astra Vault** and loads or unloads immediately.

- **Journal Graph Links** keeps real parent, child, previous, and next wikilinks in Journals notes (described below).
- **Context Menu Organizer** groups crowded file menus into Create and tools submenus and normalizes their punctuation without removing actions.
- **Task Click Menu** makes a left click on a Tasks query checkbox open the Tasks status menu, the same as right-clicking.
- **Task Lucide Icons** replaces the emoji in rendered Tasks fields (recurrence, dates, priority, dependencies) and the edit and postpone buttons with Lucide icons.
- **Vault Cards** keeps flashcards inside notes and serves a few each day in a side panel (described at the end).
- **Embedding Idle Unload** stops the Smart Connections embedding worker (about 0.4 GB with `multilingual-e5-small` on CPU, 2 GB on WebGPU) after 10 idle minutes; Smart Connections starts it again on the next search or re-embed.

## Journal Graph Links

This feature is a companion to the Obsidian **Journals** plugin. Journals remains responsible for dates, note paths, period boundaries, templates, and its native navigation. It only materializes the relationships as ordinary `[[wikilinks]]` in the Markdown files.

It maintains:

- the nearest existing previous and next note in the same journal, skipping gaps;
- the existing parent note one level up;
- all existing child notes one level down;
- the current note and the notes affected by each creation or deletion.

The default hierarchy is **Daily → Weekly → Monthly → Yearly**. No folders, filenames, week numbering, or date formats are hardcoded.

### Install

1. In Obsidian, install and enable **Journals** first.
2. Close Obsidian, or leave it open and plan to reload it after copying the files.
3. Open your vault folder in Finder or Explorer. The plugin directory is:

   ```text
   <your-vault>/.obsidian/plugins/
   ```

   `.obsidian` is hidden. On macOS Finder, press **Command–Shift–.** to show hidden files. On Windows Explorer, enable **View → Show → Hidden items**.
4. Unzip the download directly inside `plugins`. The final layout must be exactly:

   ```text
   <your-vault>/.obsidian/plugins/astra-vault/manifest.json
   <your-vault>/.obsidian/plugins/astra-vault/main.js
   <your-vault>/.obsidian/plugins/astra-vault/styles.css
   ```

   Do not leave an extra nested folder such as `astra-vault/astra-vault/`.
5. Restart Obsidian, or run **Command palette → Reload app without saving**.
6. Open **Settings → Community plugins** and enable **Astra Vault**, then check that the **Journal Graph Links** toggle in its settings is on.

### Configure Journals

In **Settings → Journals**, create or verify four journals. Their names may be anything; the plugin defaults are:

| Level | Journal name | Example note name |
|---|---|---|
| Day | `Daily` | `2026-09-20` |
| Week | `Weekly` | `2026-W38` |
| Month | `Monthly` | `2026-09` |
| Year | `Yearly` | `2026` |

Keep your existing folders, note-name formats, date rules, locale, and week-start settings. The companion reads those facts from Journals instead of duplicating them.

Then open **Settings → Astra Vault** and enter the exact four journal names. Names are case-sensitive.

For each of the four journals, open its **Navigation block** settings and make these choices:

1. Set **Previous and next arrows** to **Jump to the nearest existing note**. This is the Journals-native control that skips missing periods and never creates a note when an arrow is clicked.
2. Use the journal's default navigation lines as the starting point. Daily should include Week, Monthly should include Year, and Weekly should include Month. You can drag related segments onto one line; for example, put Month and Year side by side.
3. Set **Show previous and next periods** to **Never** if you want the narrowest layout. The template override below also enforces that per note.

The native block displays the current period, its arrows, and parent-period segments. The generated wikilink callout supplies the persistent graph edges and the dynamic list of *existing* children: months in a year, weeks in a month, and days in a week.

### Put this in each Journals template

Keep automatic templating enabled. In each of the four template files configured in Journals, include this block near the top:

````markdown
```journal-nav
adjacent: false
```

<!-- journal-graph:start -->
<!-- journal-graph:end -->
````

If your template already contains a `journal-nav` block, keep it and add only the two marker comments immediately after it. Everything outside those comments remains yours. The plugin owns and replaces only the text between them.

`adjacent: false` keeps the native block compact by hiding the full previous/current/next columns while retaining its arrows. The arrow behavior itself comes from **Jump to the nearest existing note** in the journal's Navigation block settings. The generated callout underneath contains the actual persistent wikilinks used by Graph View and backlinks.

Example daily template:

````markdown
# {{date:dddd, D MMMM YYYY}}

```journal-nav
adjacent: false
```

<!-- journal-graph:start -->
<!-- journal-graph:end -->

## Notes

````

Use the same navigation-and-marker block in Weekly, Monthly, and Yearly templates; only your title and body need to differ.

### Build the existing links once

After enabling the plugin and setting the four names:

1. Open the Command Palette.
2. Run **Astra Vault: Rebuild all journal links**.
3. Wait for the notice reporting how many notes were updated.

You only need the full rebuild once, or after changing the configured journal names. Afterwards, Journals events keep the affected notes current automatically.

### What happens on creation

Suppose Daily notes exist for September 18 and September 22. Creating September 20 causes the companion to update:

- September 20 with links to September 18, its existing week, and September 22;
- September 18 so its next link becomes September 20;
- September 22 so its previous link becomes September 20;
- the existing weekly note so its child list includes September 20.

If the weekly parent does not exist, no parent wikilink is written. When that weekly note is later created, its existing Daily children are updated to point to it. The same rule applies at every level.

Deleting a Journals note repairs the surrounding existing notes in the same way.

### Verify it

Create a test note through Journals, then switch to Source mode. You should see a managed section like:

```markdown
<!-- journal-graph:start -->
> [!journal-graph]
> [[Continuum/Time/Daily/2026-09-18|← 2026-09-18]] · [[Continuum/Time/Weekly/2026-W38|↑ 2026-W38]] · **2026-09-20** · [[Continuum/Time/Daily/2026-09-22|2026-09-22 →]]
<!-- journal-graph:end -->
```

Those are ordinary Obsidian wikilinks, so they appear in outgoing links, backlinks, Local Graph, and Graph View. The `journal-nav` block remains the native Journals interface directly above them.

### Important operating rules

- Create, rename, and delete dated notes through Journals or inside the journal paths Journals watches.
- Do not manually edit inside the two marker comments; the next sync replaces it.
- If you bulk-move notes, change a journal definition, or suspect missed events, run **Rebuild all journal links**.
- If Journals is disabled or reloaded, reload Obsidian after re-enabling it so the event subscription is restored.
- The plugin uses Journals' public API. It does not scan hardcoded folders or calculate ISO weeks itself.

## Vault Cards

A card is a ```` ```card ```` YAML block placed directly above the line it asks about:

````markdown
```card
id: pleiades-subaru
q: Which car logo is secretly a star cluster?
a: Subaru is the Japanese name for the Pleiades, and its six-star logo shows them.
topic: astronomy/pleiades
created: 2026-09-29
```
The paragraph the card is about.
````

In every view the block collapses to a small icon in the margin of that line; clicking it shows the card, its schedule, and its answer history, and in editing views lets you edit it. The **Today's cards** panel (ribbon icon or command) holds a set number of cards a day, due cards first. Your answers are appended to the card's `history` with `score: pending`. Something else, such as an agent, scores them from 1 (Again) to 4 (Easy), and the next review is replayed from those scores with FSRS. A card retires once its first score is 4 or its last two are; `retired: true` or `false` in the card overrides that. The panel shows a card's answer only after it has been scored.

## Build

The source lives in `~/Repositories/Knowledge/Obsidian/astra-vault`: `npm test`, `npx tsc --noEmit`, `npm run build`, then `node scripts/install.mjs` copies the plugin into the vault.
