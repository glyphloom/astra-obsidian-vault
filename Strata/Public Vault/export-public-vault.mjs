import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  DEFAULT_TARGET,
  EXAMPLE_FILES,
  EXPORT_FORMAT,
  INLINE_EXAMPLE_FILES,
  MANAGED_BY,
  MANAGED_STATE_FILE,
  SELF_EXPORTED_FILES,
  TARGET_MARKER_FILE,
  TEMPLATE_BANNERS,
  VAULT_FILES,
  validateManifest,
  validateRelativeFilePath,
} from "./public-vault.manifest.mjs";
import {
  BUNDLED_PLUGIN_FILES,
  COMMUNITY_PLUGIN_IDS,
  PLUGIN_SETTINGS_PROFILES,
  createStageTwoFiles,
  readExactFile,
  readSourceMode,
} from "./stage2-public-profile.mjs";
import { ROOT_GITIGNORE_SOURCE, createLicenseFiles } from "./license-profile.mjs";

export const MODULE_ROOT = path.dirname(fileURLToPath(import.meta.url));
export const VAULT_ROOT = path.resolve(MODULE_ROOT, "..", "..");
const MARKER_SCHEMA = "public-vault-export-target/v1";
const STATE_SCHEMA = "public-vault-managed-state/v1";

const utf8 = (value) => Buffer.from(value, "utf8");
const sorted = (values) => [...values].sort((left, right) => left.localeCompare(right));

function refusal(message) {
  return new Error(`Public-vault export refused: ${message}`);
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256(contents) {
  return createHash("sha256").update(contents).digest("hex");
}

function isJsonPath(relativePath) {
  return relativePath.endsWith(".json");
}

function canonicalJson(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalJson);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]));
  }
  return value;
}

function jsonSemanticHash(contents) {
  try {
    return sha256(Buffer.from(JSON.stringify(canonicalJson(JSON.parse(contents.toString("utf8")))), "utf8"));
  } catch {
    return null;
  }
}

async function lstatOrNull(candidate) {
  try {
    return await fs.lstat(candidate);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function assertNoSymlinkAncestors(candidate) {
  let current = candidate;
  while (true) {
    const stat = await lstatOrNull(current);
    if (stat?.isSymbolicLink()) {
      throw refusal("the target and every existing parent must not be symlinks.");
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return;
    }
    current = parent;
  }
}

function isInside(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative !== "" && relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

function rootsOverlap(left, right) {
  return left === right || isInside(left, right) || isInside(right, left);
}

async function canonicalCandidate(candidate) {
  const suffix = [];
  let current = candidate;

  while (true) {
    const stat = await lstatOrNull(current);
    if (stat) {
      return path.join(await fs.realpath(current), ...suffix.reverse());
    }

    const parent = path.dirname(current);
    if (parent === current) {
      throw refusal(`cannot resolve an existing parent for ${candidate}.`);
    }
    suffix.push(path.basename(current));
    current = parent;
  }
}

export async function validateTargetPath(rawTarget) {
  if (typeof rawTarget !== "string" || !path.isAbsolute(rawTarget)) {
    throw refusal("the target must be an absolute path.");
  }

  const target = path.resolve(rawTarget);
  if (target !== rawTarget) {
    throw refusal("the target must be a normalized absolute path without parent traversal.");
  }

  await assertNoSymlinkAncestors(target);

  const vaultRealPath = await fs.realpath(VAULT_ROOT);
  const targetRealPath = await canonicalCandidate(target);
  if (rootsOverlap(vaultRealPath, targetRealPath)) {
    throw refusal("the target must be external to the live vault.");
  }

  const parent = path.dirname(target);
  let parentStat;
  try {
    parentStat = await fs.stat(parent);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw refusal("the target parent must already exist as a directory.");
    }
    throw error;
  }
  if (!parentStat.isDirectory()) {
    throw refusal("the target parent must already exist as a directory.");
  }

  return target;
}

function runGit(args) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.error) {
    throw refusal("Git is required to protect the target repository.");
  }
  return result;
}

function runGitBytes(args) {
  const result = spawnSync("git", args, { encoding: null });
  if (result.error) {
    throw refusal("Git is required to protect the target repository.");
  }
  return result;
}

function gitRoot(target) {
  const result = runGit(["-C", target, "rev-parse", "--show-toplevel"]);
  if (result.status !== 0) {
    return null;
  }
  return path.resolve(result.stdout.trim());
}

function isCleanGitWorktree(target) {
  const result = runGit(["-C", target, "status", "--porcelain=v1", "--untracked-files=all"]);
  return result.status === 0 && result.stdout.trim() === "";
}

async function sameRealDirectory(left, right) {
  return (await fs.realpath(left)) === (await fs.realpath(right));
}

function makeMarker() {
  return {
    schema: MARKER_SCHEMA,
    managedBy: MANAGED_BY,
    markerId: randomUUID(),
  };
}

function isMarker(value) {
  return Boolean(
    value
      && value.schema === MARKER_SCHEMA
      && value.managedBy === MANAGED_BY
      && typeof value.markerId === "string"
      && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.markerId),
  );
}

async function readJsonFile(candidate, label) {
  const stat = await lstatOrNull(candidate);
  if (!stat) {
    return null;
  }
  if (!stat.isFile() || stat.isSymbolicLink()) {
    throw refusal(`${label} must be a regular file.`);
  }

  try {
    return JSON.parse(await fs.readFile(candidate, "utf8"));
  } catch (error) {
    throw refusal(`${label} must contain valid JSON.`);
  }
}

async function readMarker(target) {
  const value = await readJsonFile(path.join(target, TARGET_MARKER_FILE), "target marker");
  if (value === null) {
    return null;
  }
  if (!isMarker(value)) {
    throw refusal("the target marker does not belong to this exporter.");
  }
  return value;
}

function validateManagedState(value) {
  if (!value || value.schema !== STATE_SCHEMA || !Array.isArray(value.files)) {
    throw refusal("the managed-state record is invalid.");
  }

  const paths = new Set();
  for (const entry of value.files) {
    if (!entry || typeof entry !== "object" || typeof entry.path !== "string" || typeof entry.sha256 !== "string") {
      throw refusal("the managed-state record has an invalid file entry.");
    }
    validateRelativeFilePath(entry.path, "Managed-state path");
    if (entry.path === TARGET_MARKER_FILE || entry.path === MANAGED_STATE_FILE || !/^[a-f0-9]{64}$/.test(entry.sha256)) {
      throw refusal("the managed-state record has an unsafe file entry.");
    }
    if (entry.jsonSha256 !== undefined && (typeof entry.jsonSha256 !== "string" || !/^[a-f0-9]{64}$/.test(entry.jsonSha256))) {
      throw refusal("the managed-state record has an unsafe JSON semantic hash.");
    }
    if (paths.has(entry.path)) {
      throw refusal("the managed-state record has duplicate file entries.");
    }
    paths.add(entry.path);
  }

  return value;
}

async function readManagedState(target) {
  const value = await readJsonFile(path.join(target, MANAGED_STATE_FILE), "managed-state record");
  return value === null ? null : validateManagedState(value);
}

export async function assertReadmeAdoption(target, previousState) {
  if (previousState?.files.some((entry) => entry.path === "README.md")) {
    return false;
  }

  const candidate = path.join(target, "README.md");
  const stat = await lstatOrNull(candidate);
  if (!stat) {
    return false;
  }
  if (!stat.isFile() || stat.isSymbolicLink()) {
    throw refusal("the existing root README must be a regular file for one-time adoption.");
  }

  const tracked = runGit(["-C", target, "ls-files", "--error-unmatch", "README.md"]);
  if (tracked.status !== 0) {
    throw refusal("the existing root README must be tracked for one-time adoption.");
  }
  const head = runGitBytes(["-C", target, "show", "HEAD:README.md"]);
  if (head.status !== 0 || !Buffer.isBuffer(head.stdout)) {
    throw refusal("the existing root README must exist at HEAD for one-time adoption.");
  }
  const working = await fs.readFile(candidate);
  if (!working.equals(head.stdout)) {
    throw refusal("the existing root README must byte-match HEAD for one-time adoption.");
  }
  return true;
}

async function targetEntries(target) {
  return sorted(await fs.readdir(target));
}

function isEmptyGitRoot(entries) {
  return entries.length === 1 && entries[0] === ".git";
}

function isMarkerOnlyGitRoot(entries) {
  return entries.length === 2 && entries.includes(".git") && entries.includes(TARGET_MARKER_FILE);
}

export async function inspectTarget(target, { adopt = false } = {}) {
  const stat = await lstatOrNull(target);
  if (!stat) {
    return { target, marker: makeMarker(), state: null, initializeGit: true };
  }
  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    throw refusal("the target must be a real directory.");
  }

  const root = gitRoot(target);
  if (!root) {
    const entries = await targetEntries(target);
    if (entries.length !== 0) {
      throw refusal("a non-empty target must already be an exact marked Git root.");
    }
    return { target, marker: makeMarker(), state: null, initializeGit: true };
  }
  if (!await sameRealDirectory(root, target)) {
    throw refusal("the target must be the exact Git root, not a subdirectory.");
  }

  const entries = await targetEntries(target);
  const marker = await readMarker(target);
  if (!marker) {
    if (isEmptyGitRoot(entries)) {
      return { target, marker: makeMarker(), state: null, initializeGit: false, adopt: false };
    }
    if (adopt && isCleanGitWorktree(target)) {
      return { target, marker: makeMarker(), state: null, initializeGit: false, adopt: true };
    }
    throw refusal("an existing Git target needs this exporter's strong marker before it can be updated.");
  }

  const state = await readManagedState(target);
  if (!state && !isMarkerOnlyGitRoot(entries)) {
    throw refusal("a marked target with files also needs a managed-state record.");
  }
  return { target, marker, state, initializeGit: false, adopt: false };
}

function createManagedState(files) {
  const entries = sorted(files.keys())
    .filter((relativePath) => relativePath !== TARGET_MARKER_FILE && relativePath !== MANAGED_STATE_FILE)
    .map((relativePath) => {
      const entry = { path: relativePath, sha256: sha256(files.get(relativePath)) };
      if (isJsonPath(relativePath)) {
        const semanticHash = jsonSemanticHash(files.get(relativePath));
        if (!semanticHash) {
          throw refusal(`managed JSON output ${relativePath} is invalid.`);
        }
        entry.jsonSha256 = semanticHash;
      }
      return entry;
    });

  return {
    schema: STATE_SCHEMA,
    format: EXPORT_FORMAT,
    files: entries,
  };
}

function addFile(files, relativePath, contents, { allowReserved = false } = {}) {
  if (allowReserved) {
    if (relativePath !== TARGET_MARKER_FILE && relativePath !== MANAGED_STATE_FILE) {
      throw new Error(`${relativePath} is not an internal safety file.`);
    }
  } else {
    validateRelativeFilePath(relativePath, "Planned output path");
  }
  if (files.has(relativePath)) {
    throw new Error(`Planned output duplicates ${relativePath}.`);
  }
  files.set(relativePath, Buffer.isBuffer(contents) ? contents : utf8(contents));
}

function validatePluginCatalog(contents) {
  let catalog;
  try {
    catalog = JSON.parse(contents.toString("utf8"));
  } catch {
    throw refusal("the public plugin catalog must be valid JSON.");
  }

  if (catalog.schema !== "public-vault-plugin-catalog/v2" || catalog.installation !== "manual-only" || !Array.isArray(catalog.plugins)) {
    throw refusal("the public plugin catalog has an unexpected shape.");
  }
  if ([...Object.keys(catalog)].sort().join(",") !== "installation,plugins,schema,theme" || typeof catalog.theme !== "string") {
    throw refusal("the public plugin catalog contains undeclared fields.");
  }

  const observed = new Set();
  for (const plugin of catalog.plugins) {
    if (
      !plugin
      || typeof plugin !== "object"
      || [...Object.keys(plugin)].sort().join(",") !== "bundled,description,id,name,optional,settingsProfile,version"
      || !COMMUNITY_PLUGIN_IDS.includes(plugin.id)
      || plugin.optional !== true
      || plugin.bundled !== Object.hasOwn(BUNDLED_PLUGIN_FILES, plugin.id)
      || typeof plugin.name !== "string"
      || typeof plugin.version !== "string"
      || typeof plugin.description !== "string"
      || plugin.settingsProfile !== PLUGIN_SETTINGS_PROFILES[plugin.id].mode
    ) {
      throw refusal("the public plugin catalog contains an unsafe plugin entry.");
    }
    observed.add(plugin.id);
  }

  if (observed.size !== COMMUNITY_PLUGIN_IDS.length || COMMUNITY_PLUGIN_IDS.some((id) => !observed.has(id))) {
    throw refusal("the public plugin catalog does not match the inspected safe IDs.");
  }
}

async function readDeclaredSourceFile(moduleRoot, relativePath) {
  validateRelativeFilePath(relativePath, "Self-exported source path");
  const candidate = path.resolve(moduleRoot, relativePath);
  if (!isInside(moduleRoot, candidate)) {
    throw refusal(`declared source ${relativePath} escapes the exporter directory.`);
  }

  const stat = await lstatOrNull(candidate);
  if (!stat?.isFile() || stat.isSymbolicLink()) {
    throw refusal(`declared source ${relativePath} must be a regular, non-symlinked file.`);
  }
  return fs.readFile(candidate);
}

function withPublicBanner(relativePath, contents) {
  if (!relativePath.endsWith(".md")) {
    return contents;
  }
  const text = contents.toString("utf8");
  const banners = text.match(/^!\[\[[^\]]+\|banner\]\]$/gm) ?? [];
  const banner = TEMPLATE_BANNERS[relativePath];
  if (banners.length === 0) {
    if (banner) {
      throw refusal(`${relativePath} no longer embeds the banner its mapping replaces.`);
    }
    return contents;
  }
  if (banners.length !== 1) {
    throw refusal(`${relativePath} must embed exactly one banner.`);
  }
  if (banner) {
    return utf8(text.replace(banners[0], `![[${banner}|banner]]`));
  }
  // No public image yet: drop the banner and its CSS classes rather than
  // publish a third-party wallpaper's name.
  return utf8(text
    .replace(/^!\[\[[^\]]+\|banner\]\]\n+/m, "")
    .replace("cssclasses:\n  - banner\n  - banner-fade\n", ""));
}

// Public rewrites of private vault files: each records the upstream file and
// the SHA-256 it was last reviewed against.
async function readRewrites(moduleRoot) {
  const manifest = JSON.parse((await readDeclaredSourceFile(moduleRoot, "public-rewrites.json")).toString("utf8"));
  if (manifest.schema !== "public-vault-rewrites/v1" || !Array.isArray(manifest.files)) {
    throw refusal("public-rewrites.json has an unexpected shape.");
  }
  for (const rewrite of manifest.files) {
    validateRelativeFilePath(rewrite.path, "Rewrite path");
    validateRelativeFilePath(rewrite.upstream, "Rewrite upstream path");
    if (!/^[a-f0-9]{64}$/.test(rewrite.reviewedSha256)) {
      throw refusal(`rewrite ${rewrite.path} needs a reviewed SHA-256.`);
    }
  }
  return manifest.files;
}

// Lists rewrites whose private upstream changed since its public copy was reviewed.
export async function upstreamChanges({ moduleRoot = MODULE_ROOT, vaultRoot = VAULT_ROOT } = {}) {
  if (await readSourceMode(vaultRoot) === "public") {
    return [];
  }
  const changed = [];
  for (const rewrite of await readRewrites(moduleRoot)) {
    const upstream = await readExactFile(vaultRoot, rewrite.upstream, { optional: true });
    const currentSha256 = upstream === null ? null : sha256(upstream);
    if (currentSha256 !== rewrite.reviewedSha256) {
      changed.push({ ...rewrite, currentSha256 });
    }
  }
  return changed;
}

// Re-includes exactly the published plugin files (and any nested folder they
// sit in), so whatever a local copy's plugins write beside them stays ignored.
async function rootGitignore(moduleRoot, files) {
  const lines = new Set();
  for (const relativePath of sorted(files.keys()).filter((candidate) => candidate.startsWith(".obsidian/plugins/"))) {
    const parts = relativePath.split("/");
    for (let depth = 4; depth < parts.length; depth += 1) {
      lines.add(`!${parts.slice(0, depth).join("/")}/`);
    }
    lines.add(`!${relativePath}`);
  }
  const base = (await readDeclaredSourceFile(moduleRoot, ROOT_GITIGNORE_SOURCE)).toString("utf8");
  return `${base}${[...lines].map((line) => `${line}\n`).join("")}`;
}

export async function createPlannedFiles({ moduleRoot = MODULE_ROOT, vaultRoot = VAULT_ROOT, marker }) {
  validateManifest();
  if (!isMarker(marker)) {
    throw new Error("A valid target marker is required to create an export plan.");
  }

  const files = new Map();
  // A public copy re-running its own exporter reads each example and rewrite
  // from where it was published; the private vault keeps them in .public/ here.
  const publicCopy = await readSourceMode(vaultRoot) === "public";
  const readPublicFile = (relativePath) => publicCopy
    ? readExactFile(vaultRoot, relativePath)
    : readDeclaredSourceFile(moduleRoot, `.public/${relativePath}`);
  for (const relativePath of EXAMPLE_FILES) {
    addFile(files, relativePath, await readPublicFile(relativePath));
  }
  for (const specification of INLINE_EXAMPLE_FILES) {
    addFile(files, specification.path, specification.content);
  }

  const catalog = JSON.parse((await readDeclaredSourceFile(moduleRoot, "plugin-catalog.json")).toString("utf8"));
  const pluginNames = Object.fromEntries(catalog.plugins.map((plugin) => [plugin.id, plugin.name]));
  const stageTwoFiles = await createStageTwoFiles({ vaultRoot, pluginNames });
  for (const [relativePath, contents] of stageTwoFiles) {
    addFile(files, relativePath, contents);
  }

  for (const relativePath of VAULT_FILES) {
    addFile(files, relativePath, withPublicBanner(relativePath, await readExactFile(vaultRoot, relativePath)));
  }

  for (const rewrite of await readRewrites(moduleRoot)) {
    addFile(files, rewrite.path, await readPublicFile(rewrite.path));
  }

  const licenseFiles = await createLicenseFiles({ moduleRoot });
  for (const [relativePath, contents] of licenseFiles) {
    addFile(files, relativePath, contents);
  }

  for (const sourcePath of SELF_EXPORTED_FILES) {
    const contents = await readDeclaredSourceFile(moduleRoot, sourcePath);
    if (sourcePath === "plugin-catalog.json") {
      validatePluginCatalog(contents);
    }
    addFile(files, `Strata/Public Vault/${sourcePath}`, contents);
  }

  addFile(files, ".gitignore", await rootGitignore(moduleRoot, files));
  addFile(files, TARGET_MARKER_FILE, formatJson(marker), { allowReserved: true });
  addFile(files, MANAGED_STATE_FILE, formatJson(createManagedState(files)), { allowReserved: true });
  return files;
}

function expectedDirectories(files) {
  const directories = new Set();
  for (const relativePath of files.keys()) {
    let current = path.posix.dirname(relativePath);
    while (current !== ".") {
      directories.add(current);
      current = path.posix.dirname(current);
    }
  }
  return directories;
}

async function walkTree(root, relativePath = "") {
  const entries = [];
  const directory = path.join(root, relativePath);
  const children = sorted(await fs.readdir(directory));

  for (const child of children) {
    const childRelativePath = relativePath ? `${relativePath}/${child}` : child;
    const childPath = path.join(root, childRelativePath);
    const stat = await fs.lstat(childPath);
    if (stat.isSymbolicLink()) {
      entries.push({ path: childRelativePath, kind: "symlink" });
    } else if (stat.isDirectory()) {
      entries.push({ path: childRelativePath, kind: "directory" });
      entries.push(...await walkTree(root, childRelativePath));
    } else if (stat.isFile()) {
      entries.push({ path: childRelativePath, kind: "file" });
    } else {
      entries.push({ path: childRelativePath, kind: "other" });
    }
  }
  return entries;
}

function assertSamePathSet(actual, expected, label) {
  if (actual.size !== expected.size || [...actual].some((entry) => !expected.has(entry))) {
    throw refusal(`staging contains undeclared or missing ${label}.`);
  }
}

// Naming the personal folder is fine; a path to a note inside it is not.
const PRIVATE_NOTE_PATH = new RegExp(`${["Continuum", "Personal"].join("/")}/[^\\n\`'"<>|\\]]{0,120}?\\.md`);

// The home folder's path names the local account, so no published file may carry it.
function privatePathFragments(sourceRoot) {
  return [
    sourceRoot,
    os.homedir(),
    ["Library", "Mobile Documents", "iCloud~md~obsidian", "Documents", "Vault"].join("/"),
  ];
}

const likelySecretPatterns = [
  /-----BEGIN(?: [A-Z]+)* PRIVATE KEY-----/i,
  /\b(?:ghp|github_pat|sk)-[A-Za-z0-9_-]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /(?:api[_-]?key|access[_-]?token|secret|password)\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{16,}/i,
];

export function assertNoLikelySecrets(files, sourceRoot = VAULT_ROOT) {
  for (const [relativePath, contents] of files) {
    const text = contents.toString("utf8");
    for (const fragment of privatePathFragments(sourceRoot)) {
      if (text.includes(fragment)) {
        throw refusal(`${relativePath} contains a private source-root or note-path fragment.`);
      }
    }
    if (PRIVATE_NOTE_PATH.test(text)) {
      throw refusal(`${relativePath} contains a private note path.`);
    }
    for (const pattern of likelySecretPatterns) {
      if (pattern.test(text)) {
        throw refusal(`${relativePath} appears to contain a credential.`);
      }
    }
  }
}

function runOptionalGitleaks(stageRoot) {
  const version = spawnSync("gitleaks", ["version"], { encoding: "utf8" });
  if (version.error?.code === "ENOENT") {
    return { available: false };
  }
  if (version.error || version.status !== 0) {
    throw refusal("gitleaks is installed but could not be run safely.");
  }

  const result = spawnSync("gitleaks", ["detect", "--no-git", "--source", stageRoot, "--redact"], { encoding: "utf8" });
  if (result.error || result.status !== 0) {
    throw refusal("gitleaks found a possible credential in the staging copy.");
  }
  return { available: true };
}

export async function validateStagedTree(stageRoot, files, { runGitleaks = true, sourceRoot = VAULT_ROOT } = {}) {
  const entries = await walkTree(stageRoot);
  const symlink = entries.find((entry) => entry.kind === "symlink");
  if (symlink) {
    throw refusal(`staging contains a symlink at ${symlink.path}.`);
  }
  const unusual = entries.find((entry) => entry.kind === "other");
  if (unusual) {
    throw refusal(`staging contains an unsupported entry at ${unusual.path}.`);
  }

  assertSamePathSet(
    new Set(entries.filter((entry) => entry.kind === "file").map((entry) => entry.path)),
    new Set(files.keys()),
    "files",
  );
  assertSamePathSet(
    new Set(entries.filter((entry) => entry.kind === "directory").map((entry) => entry.path)),
    expectedDirectories(files),
    "directories",
  );

  for (const relativePath of files.keys()) {
    const stagedContents = await fs.readFile(path.join(stageRoot, relativePath));
    if (!stagedContents.equals(files.get(relativePath))) {
      throw refusal(`staging changed ${relativePath} after it was planned.`);
    }
  }

  assertNoLikelySecrets(files, sourceRoot);
  return runGitleaks ? runOptionalGitleaks(stageRoot) : { available: false };
}

async function writeStagedTree(stageRoot, files) {
  for (const relativePath of sorted(files.keys())) {
    const destination = path.join(stageRoot, relativePath);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, files.get(relativePath));
  }
}

async function ensureExactGitRoot(target, initializeGit) {
  if (initializeGit) {
    const result = runGit(["init", "--quiet", target]);
    if (result.status !== 0) {
      throw refusal("the target could not be initialized as a local Git repository.");
    }
  }

  const root = gitRoot(target);
  if (!root || !await sameRealDirectory(root, target)) {
    throw refusal("the target is not the exact Git root after safety checks.");
  }
}

async function assertSafeDestinationComponents(target, relativePath) {
  let current = target;
  const parts = relativePath.split("/");
  for (let index = 0; index < parts.length; index += 1) {
    current = path.join(current, parts[index]);
    const stat = await lstatOrNull(current);
    if (!stat) {
      return;
    }
    if (stat.isSymbolicLink()) {
      throw refusal(`target path ${relativePath} crosses a symlink.`);
    }
    if (index < parts.length - 1 && !stat.isDirectory()) {
      throw refusal(`target path ${relativePath} crosses a non-directory.`);
    }
  }
}

async function fileHash(candidate) {
  return sha256(await fs.readFile(candidate));
}

async function matchesManagedJsonSemantics(relativePath, destination, plannedContents, previousEntry) {
  if (!isJsonPath(relativePath)) {
    return false;
  }
  const currentHash = jsonSemanticHash(await fs.readFile(destination));
  const plannedHash = jsonSemanticHash(plannedContents);
  return Boolean(
    currentHash
    && plannedHash
    && (currentHash === plannedHash || currentHash === previousEntry.jsonSha256),
  );
}

export async function preflightManagedUpdate(target, files, previousState, { adopt = false, adoptReadme = false } = {}) {
  const previousEntries = new Map((previousState?.files ?? []).map((entry) => [entry.path, entry]));
  if (!previousState && !adopt) {
    const allowed = new Set([".git", TARGET_MARKER_FILE]);
    const foreign = (await targetEntries(target)).find((entry) => !allowed.has(entry));
    if (foreign) {
      throw refusal(`unmanaged target entry ${foreign} prevents first installation.`);
    }
  }

  for (const relativePath of files.keys()) {
    await assertSafeDestinationComponents(target, relativePath);
    const destination = path.join(target, relativePath);
    const stat = await lstatOrNull(destination);
    if (!stat) {
      continue;
    }
    if (!stat.isFile() || stat.isSymbolicLink()) {
      throw refusal(`target entry ${relativePath} is not a regular file.`);
    }

    if (relativePath === TARGET_MARKER_FILE || relativePath === MANAGED_STATE_FILE) {
      continue;
    }
    const previousEntry = previousEntries.get(relativePath);
    if (!previousEntry) {
      if (adoptReadme && relativePath === "README.md") {
        continue;
      }
      throw refusal(`unmanaged file conflict at ${relativePath}.`);
    }
    const currentHash = await fileHash(destination);
    const plannedHash = sha256(files.get(relativePath));
    if (
      currentHash !== previousEntry.sha256
      && currentHash !== plannedHash
      && !await matchesManagedJsonSemantics(relativePath, destination, files.get(relativePath), previousEntry)
    ) {
      throw refusal(`managed file ${relativePath} was changed outside this exporter.`);
    }
  }

  const stalePaths = [];
  for (const [relativePath, previousEntry] of previousEntries) {
    if (files.has(relativePath)) {
      continue;
    }
    await assertSafeDestinationComponents(target, relativePath);
    const destination = path.join(target, relativePath);
    const stat = await lstatOrNull(destination);
    if (!stat) {
      continue;
    }
    if (!stat.isFile() || stat.isSymbolicLink() || await fileHash(destination) !== previousEntry.sha256) {
      throw refusal(`stale managed file ${relativePath} was changed and will not be removed.`);
    }
    stalePaths.push(relativePath);
  }
  return stalePaths;
}

async function copyAtomically(source, destination) {
  await fs.mkdir(path.dirname(destination), { recursive: true });
  const temporary = path.join(path.dirname(destination), `.${path.basename(destination)}.${randomUUID()}.tmp`);
  try {
    await fs.copyFile(source, temporary);
    await fs.rename(temporary, destination);
  } finally {
    await fs.rm(temporary, { force: true });
  }
}

async function removeEmptyStaleParents(target, stalePaths) {
  const directories = new Set();
  for (const relativePath of stalePaths) {
    let directory = path.dirname(path.join(target, relativePath));
    while (directory !== target) {
      directories.add(directory);
      directory = path.dirname(directory);
    }
  }

  for (const directory of [...directories].sort((left, right) => right.length - left.length)) {
    try {
      await fs.rmdir(directory);
    } catch (error) {
      if (error.code !== "ENOTEMPTY" && error.code !== "ENOENT") {
        throw error;
      }
    }
  }
}

async function installStagedTree(stageRoot, target, files, stalePaths) {
  const paths = sorted(files.keys());
  const stateIndex = paths.indexOf(MANAGED_STATE_FILE);
  if (stateIndex >= 0) {
    paths.splice(stateIndex, 1);
  }

  for (const relativePath of paths) {
    await copyAtomically(path.join(stageRoot, relativePath), path.join(target, relativePath));
  }
  for (const relativePath of stalePaths) {
    await fs.unlink(path.join(target, relativePath));
  }
  await removeEmptyStaleParents(target, stalePaths);
  await copyAtomically(path.join(stageRoot, MANAGED_STATE_FILE), path.join(target, MANAGED_STATE_FILE));
}

export async function exportPublicVault({ target: requestedTarget = DEFAULT_TARGET, check = false, adopt = false, runGitleaks = true } = {}) {
  const target = await validateTargetPath(requestedTarget);
  const targetInfo = await inspectTarget(target, { adopt });
  const readmeAdopted = await assertReadmeAdoption(target, targetInfo.state);
  const stageRoot = await fs.mkdtemp(path.join(path.dirname(target), ".public-vault-stage-"));

  try {
    const files = await createPlannedFiles({ marker: targetInfo.marker });
    await writeStagedTree(stageRoot, files);
    const validation = await validateStagedTree(stageRoot, files, { runGitleaks });

    if (check) {
      return { target, checked: true, files: files.size, validation };
    }

    await ensureExactGitRoot(target, targetInfo.initializeGit);
    const stalePaths = await preflightManagedUpdate(target, files, targetInfo.state, {
      adopt: targetInfo.adopt,
      adoptReadme: readmeAdopted,
    });
    await installStagedTree(stageRoot, target, files, stalePaths);
    return {
      target,
      checked: false,
      files: files.size,
      removed: stalePaths,
      initializedGit: targetInfo.initializeGit,
      readmeAdopted,
      validation,
    };
  } finally {
    await fs.rm(stageRoot, { recursive: true, force: true });
  }
}

function parseArguments(argumentsList) {
  const options = { target: DEFAULT_TARGET, check: false, adopt: false, help: false };
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--check") {
      options.check = true;
    } else if (argument === "--adopt-clean-git-root") {
      options.adopt = true;
    } else if (argument === "--target") {
      const target = argumentsList[index + 1];
      if (!target) {
        throw refusal("--target requires an absolute path.");
      }
      options.target = target;
      index += 1;
    } else if (argument === "--help" || argument === "-h") {
      options.help = true;
    } else {
      throw refusal(`unknown argument ${argument}.`);
    }
  }
  return options;
}

function printHelp() {
  console.log("Usage: node 'Strata/Public Vault/export-public-vault.mjs' [--check] [--adopt-clean-git-root] [--target /absolute/path]");
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }
  for (const change of await upstreamChanges()) {
    const next = change.currentSha256 ? `then set its reviewedSha256 to ${change.currentSha256}` : "the upstream file is gone";
    console.warn(`Warning: ${change.upstream} changed since its public copy was reviewed. Update .public/${change.path}; ${next}.`);
  }
  const result = await exportPublicVault(options);
  const action = result.checked ? "Validated staging for" : "Exported";
  const gitleaks = result.validation.available ? "gitleaks checked" : "gitleaks unavailable";
  console.log(`${action} ${result.files} managed files at ${result.target} (${gitleaks}).`);
  if (!result.checked && result.removed.length > 0) {
    console.log(`Removed ${result.removed.length} previously managed stale files.`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
