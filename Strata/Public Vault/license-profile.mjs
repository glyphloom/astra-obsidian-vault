import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import { validateRelativeFilePath } from "./public-vault.manifest.mjs";

export const ROOT_README_SOURCE = "root-README.md";
export const ROOT_GITIGNORE_SOURCE = "root-gitignore";

export const LICENSE_TEXT_SPECS = Object.freeze([
  Object.freeze({
    markers: [
      "Creative Commons Attribution 4.0 International Public License",
      "Creative Commons may be contacted at creativecommons.org.",
    ],
    officialUrl: "https://creativecommons.org/licenses/by/4.0/legalcode.txt",
    sha256: "9ba9550ad48438d0836ddab3da480b3b69ffa0aac7b7878b5a0039e7ab429411",
    source: "licenses/CC-BY-4.0.txt",
    target: "LICENSES/CC-BY-4.0.txt",
  }),
  Object.freeze({
    markers: [
      "Apache License",
      "Version 2.0, January 2004",
      "limitations under the License.",
    ],
    officialUrl: "https://www.apache.org/licenses/LICENSE-2.0.txt",
    sha256: "cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30",
    source: "licenses/Apache-2.0.txt",
    target: "LICENSES/Apache-2.0.txt",
  }),
  Object.freeze({
    markers: [
      "# PolyForm Noncommercial License 1.0.0",
      "## Noncommercial Purposes",
    ],
    officialUrl: "https://github.com/polyformproject/polyform-licenses/blob/1.0.0/PolyForm-Noncommercial-1.0.0.md",
    sha256: "c0ea4a896d2c8c394b29f9427589996db826cd501c512279ff0ed3ef48fabbe5",
    source: "licenses/PolyForm-Noncommercial-1.0.0.md",
    target: ".obsidian/plugins/moods/LICENSE.md",
  }),
  Object.freeze({
    markers: [
      "MIT License",
      "Copyright (c) 2026 kannibalk1w1",
    ],
    officialUrl: "https://github.com/glyphloom/jokertype/blob/main/LICENSE",
    sha256: "6ee9d9fffd24bd239be91ed81a52e58fc850dd52a581e04c07721d2f1c70359c",
    source: "licenses/JokerType-MIT.txt",
    target: ".obsidian/plugins/jokertype/LICENSE",
  }),
  Object.freeze({
    markers: [
      "MIT license",
      "Copyright (c) 2017 sql.js authors",
    ],
    officialUrl: "https://github.com/sql-js/sql.js/blob/v1.14.2/LICENSE",
    sha256: "60a3f6e4d7b29b4321359e683b36cf198d24f58e24582070f56e6fa89d5ee2be",
    source: "licenses/sql.js-MIT.txt",
    target: ".obsidian/plugins/daily-intake/sql.js-LICENSE.txt",
  }),
  Object.freeze({
    markers: [
      "Copyright 2020 The DM Mono Project Authors",
      "SIL OPEN FONT LICENSE Version 1.1",
    ],
    officialUrl: "https://github.com/google/fonts/blob/main/ofl/dmmono/OFL.txt",
    sha256: "2bada5ea45c3c63b7f1ea1f88ce9672c9e4f0c42b2c3b7378949084fe55a3066",
    source: "licenses/OFL-DMMono.txt",
    target: "LICENSES/OFL-DMMono.txt",
  }),
  Object.freeze({
    markers: [
      "Copyright 2019 The Golos Text Project Authors",
      "SIL OPEN FONT LICENSE Version 1.1",
    ],
    officialUrl: "https://github.com/google/fonts/blob/main/ofl/golostext/OFL.txt",
    sha256: "ff532f9e8789f09a9fdffc3c0954eedfb0a48be77b2e2eb90f5f82e4f347f50c",
    source: "licenses/OFL-GolosText.txt",
    target: "LICENSES/OFL-GolosText.txt",
  }),
]);

const MOODS_NOTICE = `Moods
Required Notice: Copyright 2026 Pavel Mironenko (glyphloom)

This copy of the Moods plugin is licensed under the PolyForm Noncommercial License 1.0.0 in LICENSE.md, not under this repository's Apache License 2.0. You may use, study, and change it for noncommercial purposes, but not for commercial ones.

Later versions of Moods may be released under different terms, including a paid license. Those terms will not change the license of this copy.

The mascot images are not covered by this license: assets/codex-pet.png is the Codex mascot by OpenAI, and assets/claude-crab.png is a pixel rendition of the Claude mascot by Anthropic. They credit the tools that helped build Moods and remain their owners' marks.
`;

const LICENSE_MARKDOWN = `# Licensing

## Simply said

Just use it wherever, for anything, for free, as is. If you publish a derivative or re-publish this thing, attribute me and this repo. The one exception is the Moods plugin: you may use and change it, but never commercially. More technical and specific wording below.

## Scope

This repository is a mixed-license project. Its original material is licensed by category, subject to the override rules below.

### CC BY 4.0 — original vault content

The Creative Commons Attribution 4.0 International license applies to original vault content, including notes, documentation, Markdown templates, authored text, Canvas files, original images and media, and the original organization and arrangement of that material. The complete legal code is in [LICENSES/CC-BY-4.0.txt](LICENSES/CC-BY-4.0.txt).

### Apache License 2.0 — original technical material

The Apache License 2.0 applies to original technical material, including Obsidian configuration, CSS, scripts, utilities, JavaScript, TypeScript, custom plugins, build or deploy material, and other code-like files. The complete license is in [LICENSES/Apache-2.0.txt](LICENSES/Apache-2.0.txt).

## Overrides and third-party material

An attached, file-specific, or directory-specific notice overrides this category mapping. Third-party material is excluded from this project's two original-material licenses and remains governed by its own notice or license.

The .obsidian/snippets/media-banners.css snippet is third-party material. Its embedded MIT header and HandaArchitect / obsidian-banner-snippet provenance are retained in the file and override this repository mapping.

The bundled plugins Daily Intake, Astra Vault, and Public Vault are original technical material under the Apache License 2.0. These bundled files and folders carry their own terms instead:

- .obsidian/plugins/moods/ is the Moods plugin, licensed under the PolyForm Noncommercial License 1.0.0 in that folder's LICENSE.md, with its required notice in that folder's NOTICE. Later versions of Moods may be released under different terms.
- .obsidian/plugins/moods/assets/codex-pet.png is the Codex mascot by OpenAI, and .obsidian/plugins/moods/assets/claude-crab.png is a pixel rendition of the Claude mascot by Anthropic. Moods shows them to credit the tools that helped build it; they remain their owners' marks and are not licensed by this repository. The same pixel crab is embedded in .obsidian/snippets/agent-callouts.css as the icon of the \`claude\` callout, under the same terms.
- .obsidian/plugins/jokertype/ is the JokerType plugin by kannibalk1w1, licensed under the MIT License in that folder's LICENSE.
- .obsidian/plugins/daily-intake/sql-wasm.wasm is sql.js 1.14.2 by the sql.js authors, licensed under the MIT License in sql.js-LICENSE.txt beside it.

The fonts in Strata/Fonts/, also embedded in .obsidian/snippets/vault-fonts.css, are DM Mono by the DM Mono Project Authors and Golos Text by the Golos Text Project Authors, both licensed under the SIL Open Font License 1.1 in LICENSES/OFL-DMMono.txt and LICENSES/OFL-GolosText.txt.

The banner images in Strata/Banners/ are NASA-hosted space images, resized for this vault. NASA material is generally not subject to copyright in the United States, and ESA/Webb releases are also licensed under CC BY 4.0; keep each credit with its image:

- Hubble Veil Nebula.jpg: NASA, ESA, Hubble Heritage Project.
- Hubble Running Man Nebula.jpg: NASA, ESA, and J. Bally (University of Colorado at Boulder); processing: Gladys Kober (NASA/Catholic University of America).
- Webb Cosmic Cliffs.jpg: NASA, ESA, CSA, STScI.
- ISS Aurora Borealis.jpg: NASA.

## Preferred attribution

> Astra Obsidian Vault
> Pavel Mironenko (glyphloom)
> https://github.com/glyphloom/astra-obsidian-vault
> Changes were made.
`;

const NOTICE_TEXT = `Astra Obsidian Vault
https://github.com/glyphloom/astra-obsidian-vault
Copyright 2026 Pavel Mironenko (glyphloom)

Original vault content is licensed under CC BY 4.0. Original technical material is licensed under Apache License 2.0. See LICENSE.md and LICENSES/ for the complete texts and category mapping.

Third-party material is excluded from this mixed-license notice. File, directory, and embedded notices override it. In particular, .obsidian/snippets/media-banners.css retains its embedded MIT header and HandaArchitect / obsidian-banner-snippet provenance. The bundled Moods plugin is licensed under the PolyForm Noncommercial License 1.0.0, the bundled JokerType plugin and sql.js file under the MIT License. The Codex mascot in the Moods credits belongs to OpenAI and the Claude mascot to Anthropic; see LICENSE.md.
`;

function failure(message) {
  return new Error(`Public-vault license profile refused: ${message}`);
}

function sha256(contents) {
  return createHash("sha256").update(contents).digest("hex");
}

function isInside(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

async function readDeclaredFile(moduleRoot, relativePath) {
  if (typeof moduleRoot !== "string" || !path.isAbsolute(moduleRoot)) {
    throw failure("the exporter module root must be absolute.");
  }
  validateRelativeFilePath(relativePath, "License source path");
  const root = path.resolve(moduleRoot);
  const candidate = path.resolve(root, relativePath);
  if (!isInside(root, candidate)) {
    throw failure(`${relativePath} escapes the exporter directory.`);
  }

  let current = root;
  for (const part of relativePath.split("/")) {
    current = path.join(current, part);
    let stat;
    try {
      stat = await fs.lstat(current);
    } catch (error) {
      if (error.code === "ENOENT") {
        throw failure(`missing license source ${relativePath}.`);
      }
      throw error;
    }
    if (stat.isSymbolicLink()) {
      throw failure(`${relativePath} crosses a symlinked source component.`);
    }
    if (current !== candidate && !stat.isDirectory()) {
      throw failure(`${relativePath} crosses a non-directory source component.`);
    }
    if (current === candidate && !stat.isFile()) {
      throw failure(`${relativePath} must be a regular source file.`);
    }
  }
  return fs.readFile(candidate);
}

function assertCompleteText(specification, contents) {
  if (sha256(contents) !== specification.sha256) {
    throw failure(`${specification.source} does not match the verified official text hash.`);
  }
  const text = contents.toString("utf8");
  if (specification.markers.some((marker) => !text.includes(marker))) {
    throw failure(`${specification.source} is missing an official-text marker.`);
  }
}

export async function createLicenseFiles({ moduleRoot }) {
  const files = new Map();
  const readme = await readDeclaredFile(moduleRoot, ROOT_README_SOURCE);
  files.set("README.md", readme);
  files.set("LICENSE.md", Buffer.from(LICENSE_MARKDOWN, "utf8"));
  files.set("NOTICE", Buffer.from(NOTICE_TEXT, "utf8"));
  files.set(".obsidian/plugins/moods/NOTICE", Buffer.from(MOODS_NOTICE, "utf8"));

  for (const specification of LICENSE_TEXT_SPECS) {
    const contents = await readDeclaredFile(moduleRoot, specification.source);
    assertCompleteText(specification, contents);
    files.set(specification.target, contents);
  }
  return files;
}
