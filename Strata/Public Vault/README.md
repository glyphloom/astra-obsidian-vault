## Public Vault Exporter

This is a small Node.js-standard-library exporter that publishes an openable UCMA / Zettelkasten vault: invented example notes plus the real configuration, templates, own plugins, agent skills, and guides. It never walks or copies the live vault. Every output file is named in `public-vault.manifest.mjs`, `stage2-public-profile.mjs`, or `public-rewrites.json`, and each is read by its exact path.

Run it from this directory with:

```sh
npm run export
```

Or run the one-command entry point from the vault root with:

```sh
node 'Strata/Public Vault/export-public-vault.mjs'
```

The default target is the absolute path in `local-target.txt` beside this README. The export never publishes that file, so a published copy has no default. `--target` overrides it and must be an absolute path:

```sh
node 'Strata/Public Vault/export-public-vault.mjs' --target /absolute/path/to/public-vault
```

To adopt a pre-existing, clean cloned Git root that has no exporter marker yet, add `--adopt-clean-git-root`. This explicit switch preserves existing tracked files except for the narrowly adopted root README, and accepts no uncommitted or untracked work.

Use `--check` to build and validate a staging copy without changing the target. Use `npm test` to run the clean-export, determinism, configuration, licensing, refusal, managed-stale-removal, unmanaged-preservation, symlink, and secret checks. `npm run audit` reads each reviewed plugin's exact source data path without printing its values, then reports profile counts and the top-level keys each preference profile leaves out.

## Safety contract

- The target must be outside this vault and be the exact Git root.
- A missing or empty directory is initialized as a local Git repository only after staging succeeds. An empty cloned repository is safe to adopt because it contains only `.git`.
- An existing populated target must already have the exporter marker and managed-state record. `--adopt-clean-git-root` is the one explicit exception for a clean cloned Git root; it preserves existing files and writes the strong marker only after staging passes.
- It preserves `.git`, existing remotes, and all unmanaged files. It creates no commit, remote, or push.
- A pre-existing root `README.md` is adopted once only when it is a regular tracked file that byte-matches `HEAD`; otherwise the export refuses rather than replacing it. After adoption, the generated README is a managed file.
- Its managed root `.gitignore` names only local Obsidian runtime files other than the exported `workspace.json`, their workspace-specific conflict variants, `.DS_Store`, the root `.trash/`, local plugin state folders, and everything inside `.obsidian/plugins/` and `.obsidian/themes/`. The export then appends one re-include line per published plugin file, so exported settings and bundled plugins stay tracked while anything a local copy's plugins write beside them, such as a token in a `data.json`, stays out of commits. A workspace file may appear after opening the target locally, but remains Git-ignored and outside staging, managed output, and contamination acceptance.
- It removes only stale file paths recorded by its previous managed-state record, and refuses to remove a stale file if its contents were changed.
- It rejects symlinks, glob or recursive file specifications, undeclared staging outputs, likely credentials, the live vault's root path, the home folder's path, and any note path inside the personal area of `Continuum/`.
- If `gitleaks` is already installed, it scans the staging copy. The exporter does not install it or any other dependency.

## Sanitized Obsidian scaffold

The generated `.obsidian` folder uses exact-file inputs only. It preserves safe app and appearance preferences, including font families and the Minimal theme name (readers install Minimal themselves; no theme files are exported), maps the attachment location to `Strata/Attachments`, drops ignore filters, and enables exactly these reviewed snippets:

- `agent-callouts`, `content-layout`, `media-banners`, `media-callouts`, `task-metadata`, `task-statuses`, and `ui-typography`.

The live vault's `entropy-concept` dashboard snippet stays out; the example homepage is built from core callouts, a Base, and queries instead.

The copied `media-banners` snippet retains its MIT attribution to HandaArchitect and its upstream source notice. No theme binary is exported.

The scaffold also emits a sanitized actual core-plugin map, hotkeys for a fixed list of core and plugin commands, backlink, canvas, page-preview, templates, the daily-note path, every property type, the real graph settings, and a workspace with the live sidebar layout, pinned panels, and ribbon order that opens on the example map. Its panels keep only listed view settings, so no current file, search text, recent history, or unpublished pinned note leaves. Core plugins are enabled exactly as in the live vault.

Five plugins ship as exact files and are enabled in `community-plugins.json`: Daily Intake, Moods, Astra Vault (Journal Graph Links, Context Menu Organizer, Task Click Menu, and Task Lucide Icons, each with its own toggle), JokerType, and Public Vault (`BUNDLED_PLUGIN_FILES`). In the source vault, Public Vault's commands run this exporter from Obsidian. In a copy, it offers to install the catalogued community plugins and the Minimal theme, then restores the published ribbon order and visibility, which Obsidian loses for plugins that were not installed when the copy first opened. Their local state, such as Daily Intake's queue, never ships. `plugin-catalog.json` documents all 46 reviewed IDs with manifest name, version, description, whether the plugin is bundled, and its settings profile; readers install the other 41 from the community store.

Twenty-nine `.obsidian/plugins/<id>/data.json` files are emitted. Twenty-seven copy an explicit list of keys, or dotted key paths, from the live settings file; everything unlisted stays behind, including keys that a plugin update adds later. A profile may also narrow a copied list or map with a rule; Templater and Iconic keep only entries for top-level folders and files, and Moods keeps its Default mood in the built-in Reality Structure colors, adds three example moods that recolor `Continuum/Food`, `Underwork/Archive`, and `Infinity` with built-in color sets, and keeps only the built-in color sets. A listed key that disappears stops the export until its profile is reviewed, and so does a filled value under any key named like a token, secret, password, or API key. Two plugins get hand-written skeletons because their useful state points at private notes. The other 17 IDs have no data output. To publish another setting, add its key to that plugin's list in `stage2-public-profile.mjs`. [[Matter/Obsidian/Plugin Settings Reference|Plugin Settings Reference]] tells readers, in plain words, which plugins ship with the vault and what each one's settings include.

The output intentionally omits community-store plugin code, workspace and bookmark state, recent files, histories, caches, statistics, backups, account identifiers, credentials, publication targets, personal prompts, live commands, real recordings, private note paths, and machine-local state.

## Example notes, vault files, and public rewrites

`EXAMPLE_FILES` names the invented example notes and their images, canvas, Base, and placeholder recording. Each lives under `.public/` here at its published path; the dot keeps the live vault's Obsidian and its plugins from indexing the examples, so their tags, tasks, and journal entries never mix with the real ones. They are the vault's showcase, one invented week at Archive: a dashboard homepage, a full week of daily notes and its review written the way the agent skills write them, people notes behind a Base, a slide deck, a canvas, flashcards, and projects that exercise every published snippet and most plugins. The one archive example is written inline in `INLINE_EXAMPLE_FILES`, because agents may not write into any `Artifacts/` folder of the live vault.

`VAULT_FILES` names real vault files published as they are: the Projects base, the custom-sort `sortspec`, the two interface fonts, four NASA banners, and the generic templates. Templates embed third-party wallpapers as banners, so `TEMPLATE_BANNERS` swaps each for a public-domain image that is published alongside; a template without a mapped image loses its banner line and banner CSS classes.

`public-rewrites.json` lists files published from a reviewed public version instead: `AGENTS.md` and the Vault Tagging System (both at the public root), the Reminders Panel, and the agent skills. Each public version lives in `.public/` here, beside the SHA-256 of the private upstream it was reviewed against. When an upstream file changes, the export prints a warning naming it; update its public version, then record the new hash the warning prints.

## Licensing

The export generates its root `LICENSE.md` and `NOTICE`, plus complete official texts in `LICENSES/`: CC BY 4.0, Apache-2.0, and the SIL Open Font License for DM Mono and Golos Text. `LICENSE.md` maps original vault content to CC BY 4.0 and original technical material to Apache-2.0; attached or third-party notices take precedence. Moods carries the PolyForm Noncommercial License 1.0.0 in its own folder, JokerType and the bundled sql.js carry their MIT licenses beside them, the retained `media-banners.css` snippet keeps its own MIT provenance, and the NASA banners are credited in `LICENSE.md`.

## Running it from a copy

The target contains `Strata/Public Vault/` with this exporter, its manifest, profiles, tests, license texts, and this README, so readers can see exactly how the copy was made and adapt the exporter to their own vault. It does not run inside a copy: it reads the source vault's live settings, the public versions in the unpublished `.public/` folder, and the private upstreams of each rewrite, none of which ship. Run from a copy, it refuses at its first missing input, and `npm test` fails the same way. The Public Vault plugin therefore offers its export commands only in the source vault.
