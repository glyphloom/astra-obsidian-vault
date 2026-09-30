# astra-obsidian-vault

The structure and configuration of a working Obsidian vault, published by a small exporter. The notes are invented: the vault of a provenance analyst at Archive, a company that sells proof you existed, in a week when history keeps being rewritten around her. The settings, templates, plugins, agent skills, and guides are the real ones, filtered so nothing private leaves the vault.

## About this setup

This vault setup is 4 or so years of me iterating, scraping, moving the notes to new one and constantly improving my setup. With advent of AI most of the stuff is automated now, including the very process of note taking. I prefer to dictate my thoughts, and now I can see them appearing verbatim minus speech parasites in my daily notes, new notes and articles created based on my own thoughts. The sample content is AI generated. I don't think this setup, even though I consider it quite minimal in styling, will suit many. It has a mixed PARA (Called UCMA here because I love to name stuff) / Zettelkasten setup where unorganized notes move to PARA. Best of both worlds for when I was authoring notes myself. Now, I'm not so sure if organization is needed at all, as AI retrieves, reminds, and is a second brain, while Obsidian is a pretty MD reader now. Still, I have love for Obsidian and its extensibility, so it will remain.

## Start here

- [The five-minute tour](Matter/Obsidian/Public%20Example%20Guide.md) walks through the example notes and what each one shows off.
- [AGENTS.md](AGENTS.md) explains the UCMA / Zettelkasten structure and the conventions agents follow.
- [Vault Tagging System](Vault%20Tagging%20System.md) is the tag taxonomy.
- [Plugin Settings Reference](Matter/Obsidian/Plugin%20Settings%20Reference.md) lists every plugin and what its exported settings keep.

## Setup

Open the folder as a vault and trust it when Obsidian asks. The five bundled plugins load, and the Public Vault plugin offers to install the Minimal theme and the other community plugins in [the plugin catalog](Strata/Public%20Vault/plugin-catalog.json); their settings are already in place.

## Agent skills

[AGENTS.md](AGENTS.md) holds the rules agents follow here. `Strata/Skills/` has four skills: `obsidian-authoring`, `obsidian-daily`, `obsidian-review`, and `obsidian-save`. To use one with Claude Code or Codex, link its folder into your skills directory, for example:

```sh
ln -s "$PWD/Strata/Skills/obsidian-save" ~/.claude/skills/obsidian-save
```

## License

This repository uses the mixed licensing described in [LICENSE.md](LICENSE.md). See [NOTICE](NOTICE) for attribution and third-party notices.
