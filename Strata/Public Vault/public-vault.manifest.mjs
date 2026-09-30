import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export const EXPORT_FORMAT = "public-vault-export/v1";
// The default target is a machine path, so it lives in local-target.txt, which
// the export never publishes; a published copy has no default target.
const LOCAL_TARGET_FILE = new URL("local-target.txt", import.meta.url);
export const DEFAULT_TARGET = existsSync(LOCAL_TARGET_FILE) ? readFileSync(LOCAL_TARGET_FILE, "utf8").trim() : undefined;
export const TARGET_MARKER_FILE = ".public-vault-exporter.json";
export const MANAGED_STATE_FILE = ".public-vault-managed.json";
export const MANAGED_BY = "public-vault-exporter";

// This list is deliberately finite. The exporter never walks the live vault.
export const SELF_EXPORTED_FILES = Object.freeze([
  "README.md",
  "root-README.md",
  "root-gitignore",
  "package.json",
  "plugin-catalog.json",
  "license-profile.mjs",
  "stage2-public-profile.mjs",
  "audit-stage-two.mjs",
  "public-vault.manifest.mjs",
  "export-public-vault.mjs",
  "validate-public-vault.mjs",
  "assets/public-vault-mark.svg",
  "licenses/CC-BY-4.0.txt",
  "licenses/Apache-2.0.txt",
  "licenses/PolyForm-Noncommercial-1.0.0.md",
  "licenses/JokerType-MIT.txt",
  "licenses/sql.js-MIT.txt",
  "licenses/OFL-DMMono.txt",
  "licenses/OFL-GolosText.txt",
  "public-rewrites.json",
  "tests/export-public-vault.test.mjs",
]);

// Invented example notes and their media. Each is read from .public/<path>
// beside this exporter, a dot folder so the live vault's Obsidian never indexes
// it; a public copy reads it back from where it was published.
export const EXAMPLE_FILES = Object.freeze([
  "Continuum/Food/Thursday Herring.md",
  "Continuum/Home/Balcony.md",
  "Continuum/Media/Film/Memento.md",
  "Continuum/Media/Music/The Disintegration Loops.md",
  "Continuum/Media/Reading/Funes the Memorious.md",
  "Continuum/People/Footnote.md",
  "Continuum/People/Jan Oost.md",
  "Continuum/People/Maren Holt.md",
  "Continuum/People/Noor.md",
  "Continuum/People/Receipt.md",
  "Continuum/People/Sergeant Dace.md",
  "Continuum/People/Tomas Brandt.md",
  "Continuum/Time/Daily/2026-09-21.md",
  "Continuum/Time/Daily/2026-09-22.md",
  "Continuum/Time/Daily/2026-09-23.md",
  "Continuum/Time/Daily/2026-09-24.md",
  "Continuum/Time/Daily/2026-09-25.md",
  "Continuum/Time/Daily/2026-09-26.md",
  "Continuum/Time/Daily/2026-09-27.md",
  "Continuum/Time/Monthly/2026-09.md",
  "Continuum/Time/Weekly/2026-W39.md",
  "Entropy/Maintenance.md",
  "Entropy/People and Places.md",
  "Entropy/Public Vault Map.md",
  "Infinity/A Record Is a Vote for a Past.md",
  "Infinity/Black Provenance.md",
  "Infinity/Forgetting Is a Feature.md",
  "Infinity/Sorting Is Never Free.md",
  "Infinity/Sprints Are a Theory of Time.md",
  "Matter/Obsidian/Public Example Guide.md",
  "Matter/Reference/Archive Glossary.md",
  "Matter/Reference/Errata.md",
  "Matter/Reference/Rot Tier Field Card.md",
  "Strata/Attachments/Continuum/Food/Herring recipe card.svg",
  "Strata/Attachments/Continuum/Home/Balcony plant.svg",
  "Strata/Attachments/Continuum/People/Footnote in a jar.svg",
  "Strata/Attachments/Continuum/People/Tomas umbrella.svg",
  "Strata/Attachments/Continuum/Time/Daily/2026-09-22/Lobby plaque Monday.svg",
  "Strata/Attachments/Continuum/Time/Daily/2026-09-22/Lobby plaque Tuesday.svg",
  "Strata/Attachments/Continuum/Time/Daily/2026-09-22/Pay slip August.svg",
  "Strata/Attachments/Continuum/Time/Daily/2026-09-22/Recording 20260922071433.m4a",
  "Strata/Attachments/Continuum/Time/Daily/2026-09-27/Noor balcony photo.svg",
  "Strata/Attachments/Underwork/Archive/Archive seal.svg",
  "Strata/README.md",
  "Underwork/Archive/Analyst Onboarding.md",
  "Underwork/Archive/Archive.md",
  "Underwork/Archive/Clean Cut Board.md",
  "Underwork/Archive/Clean Cut Briefing.md",
  "Underwork/Archive/Clean Cut.md",
  "Underwork/Archive/Diachronic Security.md",
  "Underwork/Archive/Ledger Zero.md",
  "Underwork/Archive/Orrery Rerouting Run.md",
  "Underwork/Archive/Salt Meridian War.md",
  "Underwork/Archive/Varda Zone.canvas",
  "Underwork/Public Vault Seed.md",
  "Underwork/Quiet Ledger/Quiet Ledger.md",
  "Underwork/Quiet Ledger/Varda Parish Register.md",
  "Underwork/Quiet Ledger/Witnessed.base",
]);

// Agents may not write into any Artifacts/ folder of the live vault, so the
// archive example's text lives here instead of under .public/.
export const INLINE_EXAMPLE_FILES = Object.freeze([
  {
    path: "Artifacts/Project Many Happy Returns.md",
    content: `---
tags:
  - type/project
  - job/archive
aliases: [Fictional retired example]
created: 2024-02-12
status: archived
---

## What Was Supposed to Happen

My first project at Archive, February 2024: make everyone remember the chairman's birthday. One modest rewrite, forty thousand witnesses, a cake in every office, a warm feeling nobody could explain.

## What Happened

- Week 1: the rewrite landed, and everyone remembered the birthday.
- Week 2: a second team, working from an older brief, landed the same rewrite for a different date.
- Week 3: everyone remembers both birthdays, clearly and fondly, with cake. The chairman is now two days older every year and has stopped attending either party.

Physics calls this a scar: two versions glued together well enough to last, not cleanly enough to agree. Finance calls it a recurring cost.

## Lessons

Rewrites stack; they don't replace. Always check who else is editing the same week, which is also why this vault's [[AGENTS]] asks agents to read a note before they touch it.

> [!note]
> This whole note is fictional. It shows how \`Artifacts/\` holds finished or abandoned work without deleting it.
`,
  },
]);

// Real vault files published after individual review, copied by exact path.
export const VAULT_FILES = Object.freeze([
  "Strata/Bases/Projects.base",
  "Strata/Configs/sortspec.md",
  "Strata/Fonts/DMMono-Regular.ttf",
  "Strata/Fonts/GolosText-VariableFont_wght.ttf",
  "Strata/Banners/Hubble Veil Nebula.jpg",
  "Strata/Banners/ISS Aurora Borealis.jpg",
  "Strata/Banners/Webb Cosmic Cliffs.jpg",
  "Strata/Banners/Hubble Running Man Nebula.jpg",
  "Strata/Templates/Default Note.md",
  "Strata/Templates/Zettel Note.md",
  "Strata/Templates/Areas/Areas Template.md",
  "Strata/Templates/Areas/People Template.md",
  "Strata/Templates/MOCs/MOCs Template.md",
  "Strata/Templates/Projects/Project Template.md",
  "Strata/Templates/Resources/Resources Template.md",
  "Strata/Templates/Time/Journals/Daily Note.md",
  "Strata/Templates/Time/Journals/Weekly Note.md",
  "Strata/Templates/Time/Journals/Monthly Note.md",
  "Strata/Templates/Time/Journals/Yearly Note.md",
]);

// The live templates embed third-party wallpapers as banners. The export swaps
// each for a public-domain image from Strata/Banners, which it also publishes;
// a template without a mapped image loses its banner instead.
export const TEMPLATE_BANNERS = Object.freeze({
  "Strata/Templates/Time/Journals/Daily Note.md": "Webb Cosmic Cliffs.jpg",
  "Strata/Templates/Projects/Project Template.md": "Webb Cosmic Cliffs.jpg",
  "Strata/Templates/Time/Journals/Weekly Note.md": "Hubble Running Man Nebula.jpg",
  "Strata/Templates/MOCs/MOCs Template.md": "Hubble Running Man Nebula.jpg",
  "Strata/Templates/Zettel Note.md": "Hubble Running Man Nebula.jpg",
  "Strata/Templates/Time/Journals/Monthly Note.md": "Hubble Veil Nebula.jpg",
  "Strata/Templates/Resources/Resources Template.md": "Hubble Veil Nebula.jpg",
  "Strata/Templates/Default Note.md": "Hubble Veil Nebula.jpg",
  "Strata/Templates/Time/Journals/Yearly Note.md": "ISS Aurora Borealis.jpg",
  "Strata/Templates/Areas/Areas Template.md": "ISS Aurora Borealis.jpg",
  "Strata/Templates/Areas/People Template.md": "ISS Aurora Borealis.jpg",
});

export function validateRelativeFilePath(relativePath, label = "file path") {
  if (typeof relativePath !== "string" || relativePath.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  if (path.posix.isAbsolute(relativePath) || relativePath.includes("\\")) {
    throw new Error(`${label} must be a portable relative path.`);
  }

  if (/[*?\[\]{}]/.test(relativePath)) {
    throw new Error(`${label} must name one exact file, not a recursive or glob spec.`);
  }

  const parts = relativePath.split("/");
  if (parts.some((part) => part.length === 0 || part === "." || part === "..")) {
    throw new Error(`${label} must not contain empty, current, or parent path segments.`);
  }

  if (parts.includes(".git") || relativePath === TARGET_MARKER_FILE || relativePath === MANAGED_STATE_FILE) {
    throw new Error(`${label} is reserved for target safety metadata.`);
  }

  return relativePath;
}

export function validateManifest({ selfFiles = SELF_EXPORTED_FILES, exampleFiles = EXAMPLE_FILES, inlineExampleFiles = INLINE_EXAMPLE_FILES } = {}) {
  const paths = new Set();
  const claim = (targetPath, label) => {
    validateRelativeFilePath(targetPath, label);
    if (paths.has(targetPath)) {
      throw new Error(`Manifest duplicates ${targetPath}.`);
    }
    paths.add(targetPath);
  };

  for (const sourcePath of selfFiles) {
    validateRelativeFilePath(sourcePath, "Self-exported source path");
    claim(`Strata/Public Vault/${sourcePath}`, "Self-exported output path");
  }
  for (const examplePath of exampleFiles) {
    claim(examplePath, "Example output path");
  }
  for (const specification of inlineExampleFiles) {
    if (!specification || typeof specification !== "object" || typeof specification.content !== "string") {
      throw new Error("Each inline example must be an object with text content.");
    }
    claim(specification.path, "Example output path");
  }

  for (const vaultPath of VAULT_FILES) {
    validateRelativeFilePath(vaultPath, "Vault file path");
  }
  for (const [template, banner] of Object.entries(TEMPLATE_BANNERS)) {
    if (!VAULT_FILES.includes(template) || !VAULT_FILES.includes(`Strata/Banners/${banner}`)) {
      throw new Error(`Banner mapping for ${template} must name exported vault files.`);
    }
  }

  return true;
}
