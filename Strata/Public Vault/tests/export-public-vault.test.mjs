import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  MANAGED_STATE_FILE,
  TARGET_MARKER_FILE,
  INLINE_EXAMPLE_FILES,
  TEMPLATE_BANNERS,
  validateManifest,
  validateRelativeFilePath,
} from "../public-vault.manifest.mjs";
import {
  VAULT_ROOT,
  assertNoLikelySecrets,
  assertReadmeAdoption,
  createPlannedFiles,
  exportPublicVault,
  upstreamChanges,
  validateStagedTree,
} from "../export-public-vault.mjs";
import {
  BUNDLED_PLUGIN_FILES,
  COMMUNITY_PLUGIN_IDS,
  ENABLED_BUNDLED_PLUGIN_IDS,
  PLUGIN_SETTINGS_PROFILES,
  PUBLIC_SNIPPET_NAMES,
  allowlistedSettings,
  auditInstalledPluginData,
} from "../stage2-public-profile.mjs";
import { LICENSE_TEXT_SPECS, ROOT_GITIGNORE_SOURCE, ROOT_README_SOURCE } from "../license-profile.mjs";

async function withTemporaryDirectory(run) {
  const directory = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), "public-vault-export-test-")));
  try {
    return await run(directory);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
}

async function exists(candidate) {
  try {
    await fs.lstat(candidate);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function readManagedState(target) {
  return JSON.parse(await fs.readFile(path.join(target, MANAGED_STATE_FILE), "utf8"));
}

async function managedFingerprint(target) {
  const state = await readManagedState(target);
  const paths = [TARGET_MARKER_FILE, MANAGED_STATE_FILE, ...state.files.map((entry) => entry.path)].sort();
  const hash = createHash("sha256");
  for (const relativePath of paths) {
    hash.update(relativePath);
    hash.update(await fs.readFile(path.join(target, relativePath)));
  }
  return hash.digest("hex");
}

function initializeGit(directory) {
  const result = spawnSync("git", ["init", "--quiet", directory], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
}

function commitFixture(directory) {
  const result = spawnSync(
    "git",
    ["-C", directory, "-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "--quiet", "-am", "Fixture"],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
}

test("exports a clean, openable synthetic vault", async () => {
  await withTemporaryDirectory(async (directory) => {
    const target = path.join(directory, "public-vault");
    const result = await exportPublicVault({ target, runGitleaks: false });

    assert.equal(result.initializedGit, true);
    assert.equal(await exists(path.join(target, ".git")), true);
    assert.equal(await exists(path.join(target, "Entropy", "Public Vault Map.md")), true);
    assert.equal(await exists(path.join(target, "Artifacts", "Project Many Happy Returns.md")), true);
    assert.equal(await exists(path.join(target, "Strata", "Public Vault", "export-public-vault.mjs")), true);
    assert.deepEqual(JSON.parse(await fs.readFile(path.join(target, ".obsidian", "community-plugins.json"), "utf8")), ENABLED_BUNDLED_PLUGIN_IDS);

    const infinity = await fs.readdir(path.join(target, "Infinity"), { withFileTypes: true });
    assert.equal(infinity.some((entry) => entry.isDirectory()), false);
  });
});

test("is deterministic on a second export", async () => {
  await withTemporaryDirectory(async (directory) => {
    const target = path.join(directory, "public-vault");
    await exportPublicVault({ target, runGitleaks: false });
    const first = await managedFingerprint(target);

    await exportPublicVault({ target, runGitleaks: false });
    const second = await managedFingerprint(target);
    assert.equal(second, first);
  });
});

test("keeps only local Obsidian runtime state ignored and unmanaged", async () => {
  await withTemporaryDirectory(async (directory) => {
    const target = path.join(directory, "public-vault");
    await exportPublicVault({ target, runGitleaks: false });

    const expected = await fs.readFile(path.join(VAULT_ROOT, "Strata", "Public Vault", ROOT_GITIGNORE_SOURCE), "utf8");
    assert.equal((await fs.readFile(path.join(target, ".gitignore"), "utf8")).startsWith(expected), true);
    assert.equal(await fs.readFile(path.join(target, "Strata", "Public Vault", ROOT_GITIGNORE_SOURCE), "utf8"), expected);
    for (const pattern of [
      ".obsidian/workspace-mobile.json",
      ".obsidian/workspaces.json",
      ".obsidian/workspace.json.*",
      ".obsidian/workspace-mobile.json.*",
      ".obsidian/workspaces.json.*",
      ".DS_Store",
      "/.trash/",
    ]) {
      assert.equal(expected.includes(pattern), true);
    }
    assert.equal(expected.includes("*.json"), false);

    const workspace = path.join(target, ".obsidian", "workspace-mobile.json");
    await fs.writeFile(workspace, "{}\n");
    const ignored = spawnSync("git", ["-C", target, "check-ignore", "--quiet", ".obsidian/workspace-mobile.json"], { encoding: "utf8" });
    assert.equal(ignored.status, 0, ignored.stderr);
    await exportPublicVault({ target, runGitleaks: false });
    assert.equal(await fs.readFile(workspace, "utf8"), "{}\n");
    assert.equal((await readManagedState(target)).files.some((entry) => entry.path === ".obsidian/workspace-mobile.json"), false);

    const ignoredStatus = (relativePath) => spawnSync("git", ["-C", target, "check-ignore", "--quiet", relativePath]).status;
    assert.equal(ignoredStatus(".obsidian/plugins/dataview/main.js"), 0, "installed community plugin code must be ignored");
    for (const entry of (await readManagedState(target)).files.filter((file) => file.path.startsWith(".obsidian/plugins/"))) {
      assert.equal(ignoredStatus(entry.path), 1, `${entry.path} must stay tracked`);
    }
    for (const local of [".obsidian/plugins/mcp-tools-istefox/data.json", ".obsidian/plugins/daily-intake/data.json", ".obsidian/plugins/moods/data.json.backup"]) {
      assert.equal(ignoredStatus(local), 0, `${local} is local state and must be ignored`);
    }
  });
});

test("normalizes managed JSON formatting and key order without accepting data changes", async () => {
  await withTemporaryDirectory(async (directory) => {
    const target = path.join(directory, "public-vault");
    await exportPublicVault({ target, runGitleaks: false });

    const appPath = path.join(target, ".obsidian", "app.json");
    const app = JSON.parse(await fs.readFile(appPath, "utf8"));
    const reordered = Object.fromEntries(Object.entries(app).reverse());
    await fs.writeFile(appPath, JSON.stringify(reordered, null, 4));

    await exportPublicVault({ target, runGitleaks: false });
    const normalized = await fs.readFile(appPath);
    assert.equal(normalized.at(-1), 10);
    assert.deepEqual(JSON.parse(normalized), app);
    const stateEntry = (await readManagedState(target)).files.find((entry) => entry.path === ".obsidian/app.json");
    assert.match(stateEntry.jsonSha256, /^[a-f0-9]{64}$/);

    app.attachmentFolderPath = "Other attachments";
    await fs.writeFile(appPath, `${JSON.stringify(app, null, 2)}\n`);
    await assert.rejects(
      exportPublicVault({ target, runGitleaks: false }),
      /managed file \.obsidian\/app\.json was changed/,
    );
  });
});

test("refuses reordered arrays in a managed JSON file", async () => {
  await withTemporaryDirectory(async (directory) => {
    const target = path.join(directory, "public-vault");
    await exportPublicVault({ target, runGitleaks: false });

    const catalogPath = path.join(target, "Strata", "Public Vault", "plugin-catalog.json");
    const catalog = JSON.parse(await fs.readFile(catalogPath, "utf8"));
    catalog.plugins.reverse();
    await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);

    await assert.rejects(
      exportPublicVault({ target, runGitleaks: false }),
      /managed file Strata\/Public Vault\/plugin-catalog\.json was changed/,
    );
  });
});

test("exports the reviewed snippets, bundled plugin list, and complete catalog", async () => {
  await withTemporaryDirectory(async (directory) => {
    const target = path.join(directory, "public-vault");
    await exportPublicVault({ target, runGitleaks: false });

    const appearance = JSON.parse(await fs.readFile(path.join(target, ".obsidian", "appearance.json"), "utf8"));
    const snippets = (await fs.readdir(path.join(target, ".obsidian", "snippets")))
      .map((entry) => path.basename(entry, ".css"))
      .sort();
    assert.deepEqual(appearance.enabledCssSnippets, [...PUBLIC_SNIPPET_NAMES, "vault-fonts"]);
    assert.deepEqual(snippets, [...PUBLIC_SNIPPET_NAMES, "vault-fonts"].sort());
    const fonts = await fs.readFile(path.join(target, ".obsidian", "snippets", "vault-fonts.css"), "utf8");
    for (const family of [appearance.textFontFamily, appearance.monospaceFontFamily]) {
      assert.equal(fonts.includes(`font-family: "${family}";`), true, `${family} must be embedded.`);
    }
    assert.deepEqual(JSON.parse(await fs.readFile(path.join(target, ".obsidian", "community-plugins.json"), "utf8")), ENABLED_BUNDLED_PLUGIN_IDS);
    const corePlugins = JSON.parse(await fs.readFile(path.join(target, ".obsidian", "core-plugins.json"), "utf8"));
    const hotkeys = JSON.parse(await fs.readFile(path.join(target, ".obsidian", "hotkeys.json"), "utf8"));
    const sourceCorePlugins = JSON.parse(await fs.readFile(path.join(VAULT_ROOT, ".obsidian", "core-plugins.json"), "utf8"));
    assert.deepEqual(Object.entries(corePlugins).filter(([, enabled]) => enabled), Object.entries(sourceCorePlugins).filter(([, enabled]) => enabled));
    assert.equal(Object.hasOwn(hotkeys, "audio-recorder:start"), true);

    const workspace = JSON.parse(await fs.readFile(path.join(target, ".obsidian", "workspace.json"), "utf8"));
    const sourceWorkspace = JSON.parse(await fs.readFile(path.join(VAULT_ROOT, ".obsidian", "workspace.json"), "utf8"));
    assert.deepEqual(workspace["left-ribbon"], sourceWorkspace["left-ribbon"]);
    assert.deepEqual(workspace.lastOpenFiles, []);
    const leaves = (node) => (node.type === "leaf" ? [node] : node.children.flatMap(leaves));
    for (const leaf of [...leaves(workspace.left), ...leaves(workspace.right)]) {
      const file = leaf.state.state.file;
      assert.equal(file === undefined || await exists(path.join(target, file)), true, `${leaf.state.type} must not point at an unpublished note.`);
      assert.equal(Object.hasOwn(leaf.state.state, "query") || Object.hasOwn(leaf.state.state, "searchQuery"), false);
    }
    // Note panels drop out when their note is unpublished; every other sidebar panel is kept.
    const panels = (node) => leaves(node).map((leaf) => leaf.state.type).filter((type) => type !== "markdown");
    assert.deepEqual(panels(workspace.left), panels(sourceWorkspace.left));

    for (const name of PUBLIC_SNIPPET_NAMES) {
      const source = await fs.readFile(path.join(VAULT_ROOT, ".obsidian", "snippets", `${name}.css`));
      const exported = await fs.readFile(path.join(target, ".obsidian", "snippets", `${name}.css`));
      assert.deepEqual(exported, source);
    }

    const catalog = JSON.parse(await fs.readFile(path.join(target, "Strata", "Public Vault", "plugin-catalog.json"), "utf8"));
    assert.equal(catalog.plugins.length, COMMUNITY_PLUGIN_IDS.length);
    assert.deepEqual(catalog.plugins.map((plugin) => plugin.id), COMMUNITY_PLUGIN_IDS);
    assert.equal(catalog.plugins.every((plugin) => plugin.bundled === Object.hasOwn(BUNDLED_PLUGIN_FILES, plugin.id)), true);
  });
});

test("generates complete mixed-license files with the required scope and attribution", async () => {
  const marker = {
    schema: "public-vault-export-target/v1",
    managedBy: "public-vault-exporter",
    markerId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
  };
  const files = await createPlannedFiles({ marker });
  for (const specification of LICENSE_TEXT_SPECS) {
    const contents = files.get(specification.target);
    assert.equal(createHash("sha256").update(contents).digest("hex"), specification.sha256);
    assert.equal(specification.markers.every((markerText) => contents.toString("utf8").includes(markerText)), true);
    assert.deepEqual(files.get(`Strata/Public Vault/${specification.source}`), contents);
  }

  const license = files.get("LICENSE.md").toString("utf8");
  const notice = files.get("NOTICE").toString("utf8");
  const readme = files.get("README.md").toString("utf8");
  assert.equal(license.includes("CC BY 4.0 — original vault content"), true);
  assert.equal(license.includes("Apache License 2.0 — original technical material"), true);
  assert.equal(license.includes("original organization and arrangement"), true);
  assert.equal(license.includes("file-specific, or directory-specific notice overrides"), true);
  assert.equal(license.includes("media-banners.css"), true);
  for (const value of [
    "Astra Obsidian Vault",
    "Pavel Mironenko (glyphloom)",
    "https://github.com/glyphloom/astra-obsidian-vault",
    "Changes were made.",
  ]) {
    assert.equal(license.includes(value), true);
  }
  assert.equal(notice.includes("Copyright 2026 Pavel Mironenko (glyphloom)"), true);
  assert.equal(notice.includes("Astra Obsidian Vault"), true);
  assert.equal(notice.includes("https://github.com/glyphloom/astra-obsidian-vault"), true);
  assert.equal(notice.includes("[yyyy]"), false);
  assert.equal(readme.includes("## License"), true);
  assert.equal(readme.includes("[LICENSE.md](LICENSE.md)"), true);
  assert.equal(readme.includes("[NOTICE](NOTICE)"), true);
  assert.equal(files.get(".obsidian/snippets/media-banners.css").toString("utf8").includes("MIT License"), true);
  assert.equal(files.get(".obsidian/snippets/media-banners.css").toString("utf8").includes("HandaArchitect"), true);
});

test("profiles every reviewed plugin data file without exporting sensitive profiles", async () => {
  const records = await auditInstalledPluginData({ vaultRoot: VAULT_ROOT });
  const sourcePluginList = JSON.parse(await fs.readFile(path.join(VAULT_ROOT, ".obsidian", "community-plugins.json"), "utf8"));
  assert.equal(records.length, COMMUNITY_PLUGIN_IDS.length);
  if (sourcePluginList.length === COMMUNITY_PLUGIN_IDS.length) {
    assert.equal(records.filter((record) => record.sourceData === "present").length, 38);
    assert.equal(records.filter((record) => record.sourceData === "absent").length, 8);
  } else {
    assert.deepEqual(sourcePluginList, ENABLED_BUNDLED_PLUGIN_IDS);
    assert.equal(records.filter((record) => record.sourceData === "present").length, 29);
    assert.equal(records.filter((record) => record.sourceData === "absent").length, 17);
  }
  assert.equal(records.every((record) => record.profile === PLUGIN_SETTINGS_PROFILES[record.id].mode), true);

  const marker = {
    schema: "public-vault-export-target/v1",
    managedBy: "public-vault-exporter",
    markerId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  };
  const files = await createPlannedFiles({ marker });
  const valueAt = (object, keyPath) => keyPath.split(".").reduce((value, part) => value[part], object);
  for (const id of COMMUNITY_PLUGIN_IDS) {
    const profile = PLUGIN_SETTINGS_PROFILES[id];
    const output = `.obsidian/plugins/${id}/data.json`;
    if (profile.mode === "omitted") {
      assert.equal(files.has(output), false, `${id} must not emit plugin data.`);
      continue;
    }
    assert.equal(files.has(output), true, `${id} must emit its profile.`);
    const emitted = JSON.parse(files.get(output).toString("utf8"));
    if (!profile.keys) {
      assert.deepEqual(emitted, profile.data);
      continue;
    }
    const source = JSON.parse(await fs.readFile(path.join(VAULT_ROOT, output), "utf8"));
    const expected = {};
    for (const keyPath of profile.keys) {
      const parts = keyPath.split(".");
      let branch = expected;
      for (const part of parts.slice(0, -1)) {
        branch = (branch[part] ??= {});
      }
      branch[parts.at(-1)] = valueAt(source, keyPath);
    }
    for (const [key, rule] of Object.entries(profile.rules)) {
      expected[key] = rule(expected[key], source);
    }
    assert.deepEqual(emitted, expected, `${id} must emit exactly its allowlisted live keys.`);
  }

  for (const id of ["daily-intake", "mcp-tools-istefox", "obsidian-mkdocs-publisher", "obsidian42-brat", "recent-files-obsidian", "realclaudian"]) {
    assert.equal(files.has(`.obsidian/plugins/${id}/data.json`), false, `${id} must remain omitted.`);
  }
  const astraVault = JSON.parse(files.get(".obsidian/plugins/astra-vault/data.json").toString("utf8"));
  assert.equal(Object.hasOwn(astraVault.vaultCards, "queue") || Object.hasOwn(astraVault.vaultCards, "drafts"), false, "Vault Cards must not emit its queue or drafts.");
  const templater = JSON.parse(files.get(".obsidian/plugins/templater-obsidian/data.json").toString("utf8"));
  assert.equal(templater.folder_templates.every((binding) => !binding.folder.includes("/") || binding.folder === "/"), true);
  const jokertype = JSON.parse(files.get(".obsidian/plugins/jokertype/data.json").toString("utf8"));
  assert.equal(Object.keys(jokertype).some((key) => key.startsWith("custom") || key === "soundStyle"), false);

  const moods = JSON.parse(files.get(".obsidian/plugins/moods/data.json").toString("utf8"));
  assert.deepEqual(moods.moods.map((mood) => mood.name), ["Kitchen", "Archive Floor", "Lab Notes", "Default"]);
  assert.equal(moods.moods.at(-1).id, moods.defaultMoodId);
  assert.deepEqual(
    moods.moods.map((mood) => mood.activationGroups.map((group) => group.any.map((condition) => condition.value))),
    [[["Continuum/Food"]], [["Underwork/Archive"]], [["Infinity"]], [["/"]]],
  );
  assert.equal(moods.colors.every((color) => color.builtInId), true);
  const causalTopology = moods.colors.find((color) => color.builtInId === "preset-causal-topology");
  assert.deepEqual([moods.moods.at(-1).palette, moods.moods.at(-1).generation], [causalTopology.palette, causalTopology.generation]);
  assert.equal(files.has(".obsidian/plugins/daily-intake/data.json"), false);
});

test("bundles the reviewed plugin files and publishes reviewed rewrites", async () => {
  const marker = {
    schema: "public-vault-export-target/v1",
    managedBy: "public-vault-exporter",
    markerId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  };
  const files = await createPlannedFiles({ marker });
  for (const [id, pluginFiles] of Object.entries(BUNDLED_PLUGIN_FILES)) {
    for (const file of pluginFiles) {
      const relativePath = `.obsidian/plugins/${id}/${file}`;
      assert.deepEqual(files.get(relativePath), await fs.readFile(path.join(VAULT_ROOT, relativePath)), relativePath);
    }
  }
  for (const relativePath of [".obsidian/plugins/daily-intake/queue.sqlite"]) {
    assert.equal(files.has(relativePath), false, `${relativePath} must never be bundled.`);
  }
  for (const [template, banner] of Object.entries(TEMPLATE_BANNERS)) {
    assert.equal(files.get(template).toString("utf8").includes(`![[${banner}|banner]]`), true, template);
    assert.equal(files.has(`Strata/Banners/${banner}`), true, banner);
  }
  assert.equal(files.get(".obsidian/plugins/moods/NOTICE").toString("utf8").includes("Required Notice: Copyright 2026 Pavel Mironenko (glyphloom)"), true);

  const rewrites = JSON.parse(await fs.readFile(path.join(VAULT_ROOT, "Strata", "Public Vault", "public-rewrites.json"), "utf8")).files;
  for (const rewrite of rewrites) {
    assert.equal(files.has(rewrite.path), true, rewrite.path);
  }
  assert.deepEqual(await upstreamChanges(), []);

  await withTemporaryDirectory(async (directory) => {
    await fs.mkdir(path.join(directory, ".obsidian"));
    await fs.writeFile(path.join(directory, ".obsidian", "community-plugins.json"), JSON.stringify(COMMUNITY_PLUGIN_IDS));
    const changes = await upstreamChanges({ vaultRoot: directory });
    assert.equal(changes.length, rewrites.length);
    assert.equal(changes.every((change) => change.currentSha256 === null), true);
  });
});

test("copies only allowlisted settings and refuses filled credential keys", () => {
  const source = {
    theme: "dark",
    nested: { keep: 1, drop: 2 },
    tokenizeUrls: false,
    personalAccessToken: "",
    github: { token: "abc123" },
  };
  assert.deepEqual(
    allowlistedSettings("fixture", source, ["theme", "nested.keep", "tokenizeUrls", "personalAccessToken"]),
    { theme: "dark", nested: { keep: 1 }, tokenizeUrls: false, personalAccessToken: "" },
  );
  assert.throws(() => allowlistedSettings("fixture", source, ["github"]), /github\.token looks like a credential/);
  assert.throws(
    () => allowlistedSettings("fixture", { ...source, personalAccessToken: "abc" }, ["personalAccessToken"]),
    /personalAccessToken looks like a credential/,
  );
  assert.throws(() => allowlistedSettings("fixture", source, ["missing"]), /no longer contain the allowlisted key missing/);
  assert.throws(() => allowlistedSettings("fixture", source, ["theme.inner"]), /no longer contain the allowlisted key theme\.inner/);
});

test("rejects a symlinked parent of an exact plugin-data source", async () => {
  await withTemporaryDirectory(async (directory) => {
    const vault = path.join(directory, "profile-vault");
    const outside = path.join(directory, "outside");
    await fs.mkdir(path.join(vault, ".obsidian"), { recursive: true });
    await fs.mkdir(outside);
    await fs.writeFile(
      path.join(vault, ".obsidian", "community-plugins.json"),
      `${JSON.stringify(COMMUNITY_PLUGIN_IDS, null, 2)}\n`,
    );
    await fs.symlink(outside, path.join(vault, ".obsidian", "plugins"));

    await assert.rejects(
      auditInstalledPluginData({ vaultRoot: vault }),
      /symlinked source component/,
    );
  });
});

test("stage-two configuration contains no source-root fragments or volatile state", async () => {
  const marker = {
    schema: "public-vault-export-target/v1",
    managedBy: "public-vault-exporter",
    markerId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  };
  const files = await createPlannedFiles({ marker });
  assert.doesNotThrow(() => assertNoLikelySecrets(files, VAULT_ROOT));

  const forbiddenPaths = [
    ".obsidian/bookmarks.json",
    ".obsidian/workspace-mobile.json",
    ".obsidian/recent-files-obsidian.json",
  ];
  for (const forbiddenPath of forbiddenPaths) {
    assert.equal(files.has(forbiddenPath), false);
  }
  const privateNotePath = new RegExp(`${["Continuum", "Personal"].join("/")}/[^\\n\`'"<>|\\]]{0,120}?\\.md`);
  for (const [relativePath, contents] of files) {
    assert.equal(contents.toString("utf8").includes(VAULT_ROOT), false, `${relativePath} contains the live vault root.`);
    assert.equal(privateNotePath.test(contents.toString("utf8")), false, `${relativePath} contains a private note path.`);
  }
});

test("refuses unsafe targets and recursive manifest specifications", async () => {
  await withTemporaryDirectory(async (directory) => {
    await assert.rejects(exportPublicVault({ target: "relative-target", runGitleaks: false }), /absolute path/);
    await assert.rejects(exportPublicVault({ target: VAULT_ROOT, runGitleaks: false }), /external to the live vault/);

    const foreign = path.join(directory, "foreign");
    await fs.mkdir(foreign);
    await fs.writeFile(path.join(foreign, "README.md"), "Unmanaged work.\n");
    await assert.rejects(exportPublicVault({ target: foreign, runGitleaks: false }), /non-empty target/);

    const repository = path.join(directory, "repository");
    initializeGit(repository);
    const nested = path.join(repository, "nested");
    await fs.mkdir(nested);
    await assert.rejects(exportPublicVault({ target: nested, runGitleaks: false }), /exact Git root/);
  });

  assert.throws(
    () => validateManifest({ selfFiles: ["recursive/**/*.mjs"], exampleFiles: [] }),
    /recursive or glob spec/,
  );
  assert.throws(
    () => validateManifest({ selfFiles: [], exampleFiles: ["Infinity/*.md"] }),
    /recursive or glob spec/,
  );
  assert.throws(
    () => validateRelativeFilePath("Entropy/.git/config.md"),
    /reserved/,
  );
});

test("refuses a missing target beneath a symlinked parent", async () => {
  await withTemporaryDirectory(async (directory) => {
    const realParent = path.join(directory, "real-parent");
    const linkedParent = path.join(directory, "linked-parent");
    const target = path.join(linkedParent, "public-vault");
    await fs.mkdir(realParent);
    await fs.symlink(realParent, linkedParent);

    await assert.rejects(exportPublicVault({ target, runGitleaks: false }), /existing parent.*symlink/);
    assert.equal(await exists(path.join(realParent, "public-vault")), false);
  });
});

test("refuses an unmanaged file at a planned output path", async () => {
  await withTemporaryDirectory(async (directory) => {
    const target = path.join(directory, "cloned-vault");
    const collision = path.join(target, "Entropy", "Public Vault Map.md");
    initializeGit(target);
    await fs.mkdir(path.dirname(collision), { recursive: true });
    await fs.writeFile(collision, "## Existing file\n");
    const add = spawnSync("git", ["-C", target, "add", "Entropy/Public Vault Map.md"], { encoding: "utf8" });
    assert.equal(add.status, 0, add.stderr);
    commitFixture(target);

    await assert.rejects(
      exportPublicVault({ target, adopt: true, runGitleaks: false }),
      /unmanaged file conflict at Entropy\/Public Vault Map\.md/,
    );
    assert.equal(await fs.readFile(collision, "utf8"), "## Existing file\n");
  });
});

test("removes only a previously recorded stale managed file", async () => {
  await withTemporaryDirectory(async (directory) => {
    const target = path.join(directory, "public-vault");
    await exportPublicVault({ target, runGitleaks: false });

    const stalePath = "Strata/Retired Export/Stale Managed Note.md";
    const staleContents = Buffer.from("## Retired synthetic note\n\nThis was managed.\n", "utf8");
    await fs.mkdir(path.dirname(path.join(target, stalePath)), { recursive: true });
    await fs.writeFile(path.join(target, stalePath), staleContents);
    const state = await readManagedState(target);
    state.files.push({
      path: stalePath,
      sha256: createHash("sha256").update(staleContents).digest("hex"),
    });
    state.files.sort((left, right) => left.path.localeCompare(right.path));
    await fs.writeFile(path.join(target, MANAGED_STATE_FILE), `${JSON.stringify(state, null, 2)}\n`);

    await fs.writeFile(path.join(target, stalePath), "## Changed stale note\n");
    await assert.rejects(
      exportPublicVault({ target, runGitleaks: false }),
      /stale managed file .*changed/,
    );
    await fs.writeFile(path.join(target, stalePath), staleContents);

    const result = await exportPublicVault({ target, runGitleaks: false });
    assert.deepEqual(result.removed, [stalePath]);
    assert.equal(await exists(path.join(target, stalePath)), false);
    assert.equal(await exists(path.join(target, "Strata", "Retired Export")), false);
  });
});

test("preserves unmanaged files and the Git directory", async () => {
  await withTemporaryDirectory(async (directory) => {
    const target = path.join(directory, "public-vault");
    await exportPublicVault({ target, runGitleaks: false });

    const unmanaged = path.join(target, "Unmanaged.md");
    const gitHead = path.join(target, ".git", "HEAD");
    const before = await fs.readFile(gitHead, "utf8");
    await fs.writeFile(unmanaged, "## Leave this alone\n\nThis is not managed.\n");

    await exportPublicVault({ target, runGitleaks: false });
    assert.equal(await fs.readFile(unmanaged, "utf8"), "## Leave this alone\n\nThis is not managed.\n");
    assert.equal(await fs.readFile(gitHead, "utf8"), before);
  });
});

test("adopts a clean tracked root README only with the explicit Git-root switch", async () => {
  await withTemporaryDirectory(async (directory) => {
    const target = path.join(directory, "cloned-vault");
    initializeGit(target);
    await fs.writeFile(path.join(target, "README.md"), "# Existing repository\n");
    const add = spawnSync("git", ["-C", target, "add", "README.md"], { encoding: "utf8" });
    assert.equal(add.status, 0, add.stderr);
    commitFixture(target);

    await assert.rejects(exportPublicVault({ target, runGitleaks: false }), /strong marker/);
    const result = await exportPublicVault({ target, adopt: true, runGitleaks: false });
    const expectedReadme = await fs.readFile(
      path.join(VAULT_ROOT, "Strata", "Public Vault", ROOT_README_SOURCE),
      "utf8",
    );
    assert.equal(result.readmeAdopted, true);
    assert.equal(await fs.readFile(path.join(target, "README.md"), "utf8"), expectedReadme);
    assert.equal((await readManagedState(target)).files.some((entry) => entry.path === "README.md"), true);
    assert.equal(await exists(path.join(target, TARGET_MARKER_FILE)), true);
  });
});

test("refuses to adopt a root README that differs from HEAD", async () => {
  await withTemporaryDirectory(async (directory) => {
    const target = path.join(directory, "dirty-cloned-vault");
    initializeGit(target);
    await fs.writeFile(path.join(target, "README.md"), "# Existing repository\n");
    const add = spawnSync("git", ["-C", target, "add", "README.md"], { encoding: "utf8" });
    assert.equal(add.status, 0, add.stderr);
    commitFixture(target);
    await fs.writeFile(path.join(target, "README.md"), "# Local changes\n");

    await assert.rejects(assertReadmeAdoption(target, null), /root README must byte-match HEAD/);
    assert.equal(await fs.readFile(path.join(target, "README.md"), "utf8"), "# Local changes\n");
    assert.equal(await exists(path.join(target, TARGET_MARKER_FILE)), false);
  });
});

test("rejects symlinks and likely credentials while retaining no source-root fragments", async () => {
  await withTemporaryDirectory(async (directory) => {
    const stage = path.join(directory, "stage");
    await fs.mkdir(stage);
    await fs.writeFile(path.join(stage, "Example.md"), "## Example\n\nSafe text.\n");
    await fs.symlink(path.join(directory, "outside"), path.join(stage, "linked"));
    await assert.rejects(
      validateStagedTree(stage, new Map([["Example.md", Buffer.from("## Example\n\nSafe text.\n")]]), { runGitleaks: false }),
      /symlink/,
    );

    const key = ["api", "key"].join("_");
    const candidate = `${key}: ${"x".repeat(24)}`;
    assert.throws(
      () => assertNoLikelySecrets(new Map([["Example.md", Buffer.from(candidate)]]), VAULT_ROOT),
      /credential/,
    );
    assert.throws(
      () => assertNoLikelySecrets(new Map([["README.md", Buffer.from(`target: ${path.join(os.homedir(), "public-vault")}`)]]), VAULT_ROOT),
      /private source-root/,
    );
  });

  assert.equal(INLINE_EXAMPLE_FILES.some((specification) => specification.content.includes(VAULT_ROOT)), false);
});
