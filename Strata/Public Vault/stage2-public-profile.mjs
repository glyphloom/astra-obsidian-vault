import { promises as fs } from "node:fs";
import path from "node:path";

import { VAULT_FILES, validateRelativeFilePath } from "./public-vault.manifest.mjs";

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const utf8 = (value) => Buffer.from(value, "utf8");

// These are the only live snippet files that Stage 2 reads. Their contents are
// copied byte-for-byte after a focused review; the exporter never enumerates
// the snippets directory.
export const PUBLIC_SNIPPET_NAMES = Object.freeze([
  "agent-callouts",
  "content-layout",
  "media-banners",
  "media-callouts",
  "task-metadata",
  "task-statuses",
  "ui-typography",
]);

export const COMMUNITY_PLUGIN_IDS = Object.freeze([
  "custom-sort",
  "obsidian-outliner",
  "obsidian-tasks-plugin",
  "templater-obsidian",
  "omnisearch",
  "recent-files-obsidian",
  "tag-wrangler",
  "dataview",
  "obsidian42-brat",
  "nldates-obsidian",
  "mermaid-tools",
  "iconic",
  "homepage",
  "multi-properties",
  "open-tab-settings",
  "obsidian-kanban",
  "simple-archiver",
  "dataview-serializer",
  "quickadd",
  "buttons",
  "realclaudian",
  "table-editor-obsidian",
  "code-emitter",
  "obsidian-style-settings",
  "metadata-hider",
  "jokertype",
  "obsidian-linter",
  "obsidian-minimal-settings",
  "mcp-tools-istefox",
  "smart-connections",
  "smart-lookup",
  "moods",
  "folder-notes",
  "better-paste",
  "callout-suggestions",
  "chronos",
  "journals",
  "glossary-linker",
  "advanced-canvas",
  "obsidian-link-embed",
  "obsidian-mkdocs-publisher",
  "astra-vault",
  "note-refactor-obsidian",
  "callout-manager",
  "daily-intake",
  "public-vault-export",
]);

// Plugins whose code ships as exact files and is enabled in the export. Every
// other catalogued plugin is installed by the reader.
export const BUNDLED_PLUGIN_FILES = Object.freeze({
  jokertype: Object.freeze(["main.js", "manifest.json", "styles.css"]),
  moods: Object.freeze(["main.js", "manifest.json", "styles.css", "assets/aeonaxsys.png", "assets/codex-pet.png", "assets/claude-crab.png"]),
  "astra-vault": Object.freeze(["main.js", "manifest.json", "styles.css", "README.md"]),
  "daily-intake": Object.freeze(["main.js", "manifest.json", "styles.css", "sql-wasm.wasm"]),
  "public-vault-export": Object.freeze(["main.js", "manifest.json"]),
});

// Keeps entries for the vault root or a top-level folder or file.
const isTopLevel = (vaultPath) => vaultPath === "/" || !vaultPath.includes("/");

// `rules` maps a copied top-level key to a function that narrows its value; it
// also receives the whole source object.
function preference(reason, keys, rules = {}) {
  return Object.freeze({ mode: "allowlisted-preferences", reason, keys: Object.freeze(keys), rules, data: null });
}

function skeleton(reason, data) {
  return Object.freeze({ mode: "synthetic-skeleton", reason, data: Object.freeze(data) });
}

function omitted(reason) {
  return Object.freeze({ mode: "omitted", reason, data: null });
}

// Every installed plugin is classified explicitly. A preference profile copies
// only the listed keys, or dotted key paths, from the live data.json; anything
// unlisted, including keys added by plugin updates, stays behind. Skeletons are
// hand-authored valid shapes for plugins whose useful state is tied to private
// notes, templates, or paths.
export const PLUGIN_SETTINGS_PROFILES = Object.freeze({
  "custom-sort": preference(
    "All settings. The folder order itself comes from `Strata/Configs/sortspec`.",
    [
      "additionalSortspecFile", "indexNoteNameForFolderNotes", "suspended", "statusBarEntryEnabled",
      "notificationsEnabled", "mobileNotificationsEnabled", "customSortContextSubmenu",
      "automaticBookmarksIntegration", "bookmarksContextMenus",
      "bookmarksGroupToConsumeAsOrderingReference", "delayForInitialApplication",
    ],
  ),
  "obsidian-outliner": omitted("Uses its defaults."),
  "obsidian-tasks-plugin": preference(
    "All settings, including the `#task` filter, query presets, and custom statuses.",
    [
      "presets", "globalQuery", "globalFilter", "removeGlobalFilter", "taskFormat",
      "setCreatedDate", "setDoneDate", "setCancelledDate", "autoSuggestInEditor",
      "autoSuggestMinMatch", "autoSuggestMaxItems", "provideAccessKeys",
      "useFilenameAsScheduledDate", "filenameAsScheduledDateFormat", "filenameAsDateFolders",
      "recurrenceOnNextLine", "removeScheduledDateOnRecurrence", "searchResults", "statusSettings",
      "isShownInEditModal",
    ],
  ),
  "templater-obsidian": preference(
    "Editor settings and a template for each top-level folder.",
    [
      "data_version", "command_timeout", "templates_folder", "trigger_on_file_creation_mode",
      "auto_jump_to_cursor", "jump_to_cursor_after_file_name", "syntax_highlighting",
      "syntax_highlighting_mobile", "intellisense_render", "folder_templates",
    ],
    { folder_templates: (bindings) => bindings.filter((binding) => isTopLevel(binding.folder)) },
  ),
  omnisearch: preference(
    "Ranking, indexing, and display settings.",
    [
      "useCache", "hideExcluded", "recencyBoost", "ignoreDiacritics", "ignoreArabicDiacritics",
      "indexedFileTypes", "indexFilesWithoutExtension", "displayTitle", "PDFIndexing",
      "officeIndexing", "imagesIndexing", "aiImageIndexing", "unsupportedFilesIndexing",
      "splitCamelCase", "vimLikeNavigationShortcut", "ribbonIcon", "showExcerpt", "maxEmbeds",
      "renderLineReturnInExcerpts", "showCreateButton", "highlight", "showPreviousQueryResults",
      "simpleSearch", "tokenizeUrls", "fuzziness", "weightBasename", "weightDirectory", "weightH1",
      "weightH2", "weightH3", "weightUnmarkedTags", "weightCustomProperties", "httpApiEnabled",
      "httpApiNotice", "verboseLogging", "openInNewPane",
    ],
  ),
  "recent-files-obsidian": omitted("Uses its defaults; the original holds file history."),
  "tag-wrangler": omitted("Uses its defaults."),
  dataview: preference(
    "All settings, including JavaScript queries.",
    [
      "renderNullAs", "taskCompletionTracking", "taskCompletionUseEmojiShorthand",
      "taskCompletionText", "taskCompletionDateFormat", "recursiveSubTaskCompletion",
      "warnOnEmptyResult", "refreshEnabled", "refreshInterval", "defaultDateFormat",
      "defaultDateTimeFormat", "maxRecursiveRenderDepth", "tableIdColumnName",
      "tableGroupColumnName", "showResultCount", "allowHtml", "inlineQueryPrefix",
      "inlineJsQueryPrefix", "inlineQueriesInCodeblocks", "enableInlineDataview",
      "enableDataviewJs", "enableInlineDataviewJs", "prettyRenderInlineFields",
      "prettyRenderInlineFieldsInLivePreview", "dataviewJsKeyword",
    ],
  ),
  "obsidian42-brat": omitted("Uses its defaults; the original holds an access token."),
  "nldates-obsidian": omitted("Uses its defaults."),
  "mermaid-tools": skeleton(
    "Starts empty, without saved diagram elements.",
    {
      categoryModifications: {},
      customCategories: [],
      defaultCategorySortOrders: {},
      defaultElementCategoryIds: [],
      elements: [],
      selectedCategoryId: "flowchart",
    },
  ),
  iconic: preference(
    "All icon rules, plus icons for the top-level folders and files.",
    [
      "biggerIcons", "clickableIcons", "showAllFileIcons", "showAllFolderIcons",
      "minimalFolderIcons", "showMarkdownTabIcons", "showTitleIcons", "showTagPillIcons",
      "showMenuActions", "showSuggestionIcons", "showQuickSwitcherIcons", "showMoveFileIcons",
      "showItemName", "useSearchKeywords", "maxSearchResults", "colorPicker1", "colorPicker2",
      "uncolorHover", "uncolorDrag", "uncolorSelect", "uncolorQuick", "maxBackups", "fileIcons",
      "fileRules", "folderRules", "biggerSearchResults", "rememberDeletedItems", "appIcons", "tabIcons",
      "ribbonIcons", "tagIcons", "propertyIcons",
    ],
    {
      fileIcons: (icons, source) => {
        const kept = Object.entries(icons).filter(([vaultPath]) => isTopLevel(vaultPath) || VAULT_FILES.includes(vaultPath));
        // The public LICENSES folder has no private counterpart; it wears the Legal rule's icon.
        const legal = source.fileRules.find((rule) => rule.name === "Legal");
        return Object.fromEntries(legal ? [...kept, ["LICENSES", { icon: legal.icon, color: legal.color }]] : kept);
      },
    },
  ),
  homepage: skeleton(
    "Opens the example map when you ask for the homepage.",
    {
      homepages: {
        "Public Vault Map": {
          alwaysApply: false,
          autoCreate: false,
          autoScroll: false,
          commands: [],
          hideReleaseNotes: false,
          kind: "File",
          manualOpenMode: "Keep open notes",
          openMode: "Keep open notes",
          openOnStartup: false,
          openWhenEmpty: false,
          pin: false,
          refreshDataview: false,
          revertView: true,
          value: "Entropy/Public Vault Map.md",
          view: "Reading view",
        },
      },
      separateMobile: false,
      version: 4,
    },
  ),
  "multi-properties": preference(
    "All settings.",
    [
      "alterProp", "recursive", "delimiter", "defaultPropPath",
    ],
  ),
  "open-tab-settings": preference(
    "All settings.",
    [
      "openInNewTab", "previewTabs", "deduplicateTabs", "deduplicateAcrossTabGroups",
      "newTabPlacement", "newTabTabGroupPlacement", "modClickBehavior",
    ],
  ),
  "obsidian-kanban": omitted("Uses its defaults."),
  "simple-archiver": preference(
    "Archives into `Artifacts` on the same schedule.",
    [
      "archiveFolder", "autoArchiveFrequency", "autoArchiveStartupDelaySeconds",
    ],
  ),
  "dataview-serializer": preference(
    "All settings.",
    [
      "foldersToScan", "ignoredFolders", "disableAutomaticUpdates", "showRefreshButton",
      "foldersToForceUpdate", "showErrorNotifications", "debugLogging", "addTrailingNewline",
      "linkFormat", "enableDataviewJS",
    ],
  ),
  quickadd: omitted("Uses its defaults; the original holds personal capture choices and an AI prompt."),
  buttons: omitted("Uses its defaults."),
  realclaudian: omitted("Uses its defaults."),
  "table-editor-obsidian": preference(
    "All settings.",
    [
      "formatType", "showRibbonIcon", "bindEnter", "bindTab",
    ],
  ),
  "code-emitter": omitted("Uses its defaults."),
  "obsidian-style-settings": preference(
    "All Minimal and banner style settings.",
    [
      "minimal-style@@h1-size", "minimal-style@@h2-size", "minimal-style@@h3-size",
      "minimal-style@@h4-size", "minimal-style@@h5-size", "minimal-style@@h6-size",
      "minimal-style@@inline-title-size", "minimal-style@@blockquote-color@@dark",
      "minimal-style@@blockquote-border-color@@dark", "minimal-style@@blockquote-border-thickness",
      "minimal-style@@h6-font", "minimal-style@@h5-font", "minimal-style@@h4-variant",
      "minimal-style@@h5-variant", "minimal-style@@h6-variant", "minimal-style@@h1-weight",
      "minimal-style@@h2-weight", "minimal-style@@h3-weight", "minimal-style@@h4-weight",
      "minimal-style@@h5-weight", "minimal-style@@h6-weight",
      "minimal-cards-style@@cards-max-width", "minimal-cards-style@@cards-image-height",
      "minimal-style@@tag-radius", "minimal-style@@minimal-unstyled-tags",
      "minimal-style@@tag-color@@dark", "minimal-style@@tag-border-width",
      "minimal-style@@minimal-strike-lists", "minimal-style@@image-muted",
      "minimal-style@@metadata-heading-off", "minimal-style@@list-spacing",
      "minimal-style@@checkbox-shape", "minimal-style@@metadata-add-property-off",
      "minimal-style@@sidebar-tabs-style", "minimal-style@@sidebar-tabs-names",
      "minimal-style@@vault-profile-display", "minimal-style@@hide-help",
      "minimal-style@@ribbon-style", "minimal-style@@tabs-style",
      "css-banner-settings@@banner-height", "css-banner-settings@@banner-title-top",
    ],
  ),
  "metadata-hider": preference(
    "All settings.",
    [
      "autoFold", "hideEmptyEntry", "hideEmptyEntryInSideDock", "propertiesVisible",
      "propertyHideAll", "entries",
    ],
  ),
  jokertype: preference(
    "Effects and sound switches, with the built-in sounds instead of custom recordings.",
    [
      "enabled", "soundEnabled", "volume", "pitchMax", "pitchRiseSteps", "pitchResetMs",
      "visualTheme", "effectIntensity", "textGlyphsEnabled", "enterEffectsEnabled",
      "deleteEffectsEnabled", "glyphLifetimeMs", "cornerBracketsEnabled", "reducedMotion",
      "editorShake", "statusComboEnabled", "throttleLargeChanges", "markdownMomentDeck",
      "markdownMomentEnabled", "preset",
    ],
  ),
  "obsidian-linter": preference(
    "All rules and formatting settings.",
    [
      "ruleConfigs", "lintOnSave", "recordLintOnSaveLogs", "displayChanged",
      "suppressMessageWhenNoChange", "enableDiffPreviewView",
      "suppressLintAllFilesConfirmationModal", "suppressLintAllFilesInFolderConfirmationModal",
      "lintOnFileChange", "displayLintOnFileChangeNotice", "settingsConvertedToConfigKeyValues",
      "foldersToIgnore", "filesToIgnore", "linterLocale", "logLevel", "commonStyles",
    ],
  ),
  "obsidian-minimal-settings": preference(
    "All settings.",
    [
      "lightStyle", "darkStyle", "lightScheme", "darkScheme", "lineHeight", "lineWidth",
      "lineWidthWide", "maxWidth", "textNormal", "textSmall", "imgGrid", "imgWidth", "tableWidth",
      "iframeWidth", "mapWidth", "chartWidth", "colorfulHeadings", "colorfulFrame",
      "colorfulActiveStates", "trimNames", "labeledNav", "fullWidthMedia", "bordersToggle",
      "minimalStatus", "focusMode", "underlineInternal", "underlineExternal", "folding",
      "lineNumbers", "readableLineLength", "editorFont", "devBlockWidth",
    ],
  ),
  "mcp-tools-istefox": omitted("Uses its defaults; the original holds connection tokens."),
  "smart-connections": omitted("Uses its defaults."),
  "smart-lookup": omitted("Uses its defaults."),
  moods: preference(
    "Example moods that recolor the kitchen, the comet city, and the idea notes in built-in color sets, a Reality Structure default for the rest, and the built-in color sets.",
    [
      "schemaVersion", "enabled", "easyMode", "onboardingComplete", "transitionEnabled", "transitionDuration",
      "livePreviewEnabled", "defaultMoodId", "obsidianTheme", "moods", "colors",
    ],
    {
      // The live moods point at private folders, so the export keeps only the
      // Default mood and adds example moods for the example notes; the first
      // matching mood wins, so Default comes last.
      moods: (moods, source) => {
        const defaults = moods.filter((mood) => mood.name === "Default");
        if (defaults.length !== 1) {
          throw new Error("Moods needs one mood named Default.");
        }
        const preset = (builtInId) => {
          const color = source.colors.find((candidate) => candidate.builtInId === builtInId);
          if (!color) {
            throw new Error(`Moods needs the built-in ${builtInId} color set.`);
          }
          return { palette: color.palette, generation: color.generation };
        };
        const inside = (id, folder) => [{
          id: `group-${id}`,
          any: [{ id: `condition-${id}`, type: "path", operator: "inside", value: folder }],
          all: [],
          none: [],
          priorityOverride: false,
        }];
        const example = (id, name, builtInId, folder) => ({
          ...defaults[0], id: `mood-${id}`, name, ...preset(builtInId), activationGroups: inside(id, folder),
        });
        return [
          example("public-kitchen", "Kitchen", "preset-rose-bloom", "Continuum/Food"),
          example("public-archive", "Archive Floor", "preset-the-long-night", "Underwork/Archive"),
          example("public-lab", "Lab Notes", "preset-burning-ocean", "Infinity"),
          { ...defaults[0], ...preset("preset-causal-topology"), activationGroups: inside("public-root", "/") },
        ];
      },
      colors: (colors) => colors.filter((color) => color.builtInId),
    },
  ),
  "folder-notes": preference(
    "All settings.",
    [
      "syncFolderName", "ctrlKey", "altKey", "hideFolderNote", "templatePath", "autoCreate",
      "autoCreateFocusFiles", "autoCreateForAttachmentFolder", "autoCreateForFiles",
      "enableCollapsing", "excludeFolders", "whitelistFolders", "showDeleteConfirmation",
      "underlineFolder", "stopWhitespaceCollapsing", "underlineFolderInPath",
      "openFolderNoteOnClickInPath", "openInNewTab", "focusExistingTab", "oldFolderNoteName",
      "folderNoteName", "folderNoteType", "disableFolderHighlighting", "newFolderNoteName",
      "storageLocation", "syncDelete", "showRenameConfirmation", "defaultOverview", "useSubmenus",
      "syncMove", "frontMatterTitle", "supportedFileTypes", "boldName", "boldNameInPath",
      "cursiveName", "cursiveNameInPath", "disableOpenFolderNoteOnClick", "openByClick",
      "openWithCtrl", "openWithAlt", "excludeFolderDefaultSettings",
      "excludePatternDefaultSettings", "hideCollapsingIcon", "hideCollapsingIconForEmptyFolders",
      "tabManagerEnabled", "ignoreAttachmentFolder", "deleteFilesAction", "openSidebar",
      "highlightFolder", "fvGlobalSettings", "hideFolderNoteNameInPath",
    ],
  ),
  "better-paste": preference(
    "All settings, including the paste cleanup rules.",
    [
      "autoClean", "listNesting", "quoteContinuation", "showReleaseNotes", "fileMode", "imageMode",
      "imageNameTemplate", "imageSizeOptions", "imageClassOptions", "noteProperty",
      "imageSizeProperty", "linkEnabled", "linkTitles", "textTrim", "textInvisible", "textQuotes",
      "textDashes", "textSnippets", "urlSnippets",
    ],
  ),
  "callout-suggestions": omitted("Uses its defaults."),
  chronos: preference(
    "All settings.",
    [
      "selectedLocale", "align", "clickToUse", "roundRanges", "useUtc", "useAI",
      "showChangelogOnUpdate", "enableCaching", "basesPropNames",
    ],
  ),
  journals: preference(
    "The daily, weekly, monthly, and yearly journals, the calendar, and their commands.",
    [
      "calendar", "calendarDisplay", "noteCreation", "decorations", "appearance", "dayNotes",
      "startup", "journals", "shelves", "views", "commands", "version",
    ],
  ),
  "glossary-linker": preference(
    "Linking and suggestion settings, without glossary folders or term lists.",
    [
      "scopeMode", "matchMode", "minTermLength", "smartCase", "enabledLanguages", "languageOrder",
      "aliasHarvestMode", "harvestOnSave", "harvestSingleWordOnly", "harvestMinLength",
      "linkFirstOnly", "linkPrecedence", "linkSuggest", "suggestMinChars", "suggestSkipAfter",
      "suggestPlainText", "aliasCollisionWarnings", "candidateMinNotes", "overviewSort",
      "overviewCandidateSort", "overviewCountLinks", "overviewWholeVault", "overviewTermsCollapsed",
      "overviewCandidatesCollapsed", "showRibbonIcon", "highlightInReading", "editingHighlight",
      "skipHeadings", "statusBar", "statusBarIncludeLinks", "menuTurnInto", "menuCollect",
      "menuOpen", "menuCreateTerm", "menuAddAlias", "menuExclude", "menuUnlink",
    ],
  ),
  "advanced-canvas": preference(
    "All settings except saved node templates and custom styles.",
    [
      "nodeTypeOnDoubleClick", "alignNewNodesToGrid", "defaultTextNodeDimensions",
      "defaultFileNodeDimensions", "minNodeSize", "maxNodeWidth", "disableFontSizeRelativeToZoom",
      "canvasMetadataCompatibilityEnabled", "enableSingleNodeLinks",
      "enableSingleNodePopupReferenceCopy", "combineCustomStylesInDropdown",
      "nodeStylingFeatureEnabled", "defaultTextNodeColor", "defaultTextNodeStyleAttributes",
      "edgesStylingFeatureEnabled", "inheritEdgeColorFromNode", "defaultEdgeColor",
      "defaultEdgeLineDirection", "defaultEdgeStyleAttributes", "edgeStyleUpdateWhileDragging",
      "edgeStyleSquarePathRounded", "edgeStylePathfinderAllowDiagonal",
      "edgeStylePathfinderPathRounded", "variableBreakpointFeatureEnabled",
      "zOrderingControlFeatureEnabled", "zOrderingControlShowOneLayerShiftOptions",
      "aspectRatioControlFeatureEnabled", "commandsFeatureEnabled", "zoomToClonedNode",
      "cloneNodeMargin", "expandNodeStepSize", "nativeFileSearchEnabled",
      "floatingEdgeFeatureEnabled", "allowFloatingEdgeCreation", "newEdgeFromSideFloating",
      "flipEdgeFeatureEnabled", "betterExportFeatureEnabled", "betterReadonlyEnabled",
      "hideBackgroundGridWhenInReadonly", "disableNodePopup", "disableZoom", "disablePan",
      "readingModeFixEnabled", "autoResizeNodeFeatureEnabled", "autoResizeNodeEnabledByDefault",
      "autoResizeNodeMaxHeight", "autoResizeNodeSnapToGrid", "collapsibleGroupsFeatureEnabled",
      "collapsedGroupPreviewOnDrag", "focusModeFeatureEnabled", "presentationFeatureEnabled",
      "showSetStartNodeInPopup", "defaultSlideDimensions", "wrapInSlidePadding",
      "resetViewportOnPresentationEnd", "useArrowKeysToChangeSlides",
      "usePgUpPgDownKeysToChangeSlides", "useDirectionalSlideNavigation",
      "zoomToSlideWithoutPadding", "useUnclampedZoomWhilePresenting",
      "fullscreenPresentationEnabled", "slideTransitionAnimationDuration",
      "slideTransitionAnimationIntensity", "pdfAnnotationFeatureEnabled", "pdfPagesGap",
      "pdfPageSizeFactor", "pdfPageResolution", "canvasEncapsulationEnabled",
      "portalsFeatureEnabled", "autoFileNodeEdgesFeatureEnabled", "autoFileNodeEdgesFrontmatterKey",
      "edgeHighlightEnabled", "highlightIncomingEdges", "edgeSelectionEnabled",
      "selectEdgeByDirection",
    ],
  ),
  "obsidian-link-embed": omitted("Uses its defaults."),
  "obsidian-mkdocs-publisher": omitted("Uses its defaults; the original holds a publishing target and token."),
  "astra-vault": preference(
    "Feature toggles, Journal Graph Links linked to the four journals, and the Vault Cards daily count without its queue or drafts.",
    [
      "features.journalGraphLinks", "features.contextMenuOrganizer", "features.taskClickMenu",
      "features.taskLucideIcons", "features.vaultCards", "journalGraphLinks.dailyJournal",
      "journalGraphLinks.weeklyJournal", "journalGraphLinks.monthlyJournal", "journalGraphLinks.yearlyJournal",
      "vaultCards.cardsPerDay",
    ],
  ),
  "note-refactor-obsidian": preference(
    "All settings except custom folder and template fields.",
    [
      "includeFirstLineAsNoteHeading", "excludeFirstLineInNote", "openNewNote", "headingFormat",
      "newFileLocation", "transcludeByDefault", "normalizeHeaderLevels",
    ],
  ),
  "callout-manager": preference(
    "All settings.",
    [
      "callouts", "calloutDetection",
    ],
  ),
  "daily-intake": omitted("Starts from its defaults; connect your own Telegram bot."),
  "public-vault-export": omitted("Has no settings."),
});

const APP_BOOLEAN_KEYS = Object.freeze([
  "alwaysUpdateLinks",
  "focusNewTab",
  "livePreview",
  "promptDelete",
  "readableLineLength",
  "showLineNumber",
  "showUnsupportedFiles",
]);

const CORE_PLUGIN_IDS = Object.freeze([
  "file-explorer",
  "global-search",
  "switcher",
  "graph",
  "backlink",
  "canvas",
  "outgoing-link",
  "tag-pane",
  "properties",
  "page-preview",
  "daily-notes",
  "templates",
  "note-composer",
  "command-palette",
  "slash-command",
  "editor-status",
  "bookmarks",
  "markdown-importer",
  "zk-prefixer",
  "random-note",
  "outline",
  "word-count",
  "slides",
  "audio-recorder",
  "workspaces",
  "file-recovery",
  "publish",
  "sync",
  "webviewer",
  "footnotes",
  "bases",
]);

const PUBLIC_HOTKEY_COMMANDS = Object.freeze([
  "app:toggle-left-sidebar",
  "app:toggle-right-sidebar",
  "editor:delete-paragraph",
  "editor:insert-wikilink",
  "obsidian-outliner:fold",
  "obsidian-outliner:unfold",
  "omnisearch:show-modal",
  "templater-obsidian:insert-templater",
  "audio-recorder:start",
  "audio-recorder:stop",
]);

// A copied key named like a credential may only hold a switch or an empty
// value; a filled one stops the export instead of being published.
const CREDENTIAL_KEY = /token|secret|passw|api[-_]?key|credential|auth(?!or)|bearer|cookie|private[-_]?key/i;

function failure(message) {
  return new Error(`Public-vault profile refused: ${message}`);
}

function isInert(value) {
  return value === null || value === "" || typeof value === "boolean"
    || (typeof value === "object" && Object.keys(value).length === 0);
}

function assertNoCredentialValues(id, value, keyPath) {
  if (!value || typeof value !== "object") {
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    const childPath = keyPath ? `${keyPath}.${key}` : key;
    if (CREDENTIAL_KEY.test(key) && !isInert(child)) {
      throw failure(`${id} setting ${childPath} looks like a credential.`);
    }
    assertNoCredentialValues(id, child, childPath);
  }
}

// Copies each allowlisted key, or dotted key path, from a live plugin data
// object. A listed key that no longer exists stops the export so the profile
// is reviewed again after a plugin update.
export function allowlistedSettings(id, source, keys, rules = {}) {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw failure(`${id} data.json must contain a JSON object.`);
  }
  const output = {};
  for (const keyPath of keys) {
    const parts = keyPath.split(".");
    let from = source;
    let to = output;
    for (const [index, part] of parts.entries()) {
      if (!from || typeof from !== "object" || Array.isArray(from) || !Object.hasOwn(from, part)) {
        throw failure(`${id} settings no longer contain the allowlisted key ${keyPath}.`);
      }
      if (index === parts.length - 1) {
        to[part] = structuredClone(from[part]);
      } else {
        from = from[part];
        to = (to[part] ??= {});
      }
    }
  }
  for (const [key, rule] of Object.entries(rules)) {
    output[key] = rule(output[key], source);
  }
  assertNoCredentialValues(id, output, "");
  return output;
}

function isInside(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

export async function readExactFile(vaultRoot, relativePath, { optional = false } = {}) {
  validateRelativeFilePath(relativePath, "Profile source path");
  if (typeof vaultRoot !== "string" || !path.isAbsolute(vaultRoot)) {
    throw failure("the profile vault root must be absolute.");
  }
  const root = path.resolve(vaultRoot);
  const candidate = path.resolve(root, relativePath);
  if (!isInside(root, candidate)) {
    throw failure(`${relativePath} escapes the vault root.`);
  }

  const parts = relativePath.split("/");
  let current = root;
  for (let index = -1; index < parts.length; index += 1) {
    if (index >= 0) {
      current = path.join(current, parts[index]);
    }
    let stat;
    try {
      stat = await fs.lstat(current);
    } catch (error) {
      if (optional && error.code === "ENOENT") {
        return null;
      }
      if (error.code === "ENOENT") {
        throw failure(`missing required profile source ${relativePath}.`);
      }
      throw error;
    }
    if (stat.isSymbolicLink()) {
      throw failure(`${relativePath} crosses a symlinked source component.`);
    }
    if (index < parts.length - 1 && !stat.isDirectory()) {
      throw failure(`${relativePath} crosses a non-directory source component.`);
    }
    if (index === parts.length - 1 && !stat.isFile()) {
      throw failure(`${relativePath} must be a regular source file.`);
    }
  }
  return fs.readFile(candidate);
}

async function readExactJson(vaultRoot, relativePath) {
  const contents = await readExactFile(vaultRoot, relativePath);
  try {
    return JSON.parse(contents.toString("utf8"));
  } catch {
    throw failure(`${relativePath} must contain valid JSON.`);
  }
}

function boolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}

function finiteNumber(value, fallback, minimum, maximum) {
  return Number.isFinite(value) && value >= minimum && value <= maximum ? value : fallback;
}

function oneOf(value, accepted, fallback) {
  return accepted.includes(value) ? value : fallback;
}

function addFile(files, relativePath, contents) {
  validateRelativeFilePath(relativePath, "Stage 2 output path");
  if (files.has(relativePath)) {
    throw failure(`duplicate Stage 2 output ${relativePath}.`);
  }
  files.set(relativePath, Buffer.isBuffer(contents) ? contents : utf8(contents));
}

// The enabled plugins of an exported vault, in catalog order.
export const ENABLED_BUNDLED_PLUGIN_IDS = Object.freeze(COMMUNITY_PLUGIN_IDS.filter((id) => Object.hasOwn(BUNDLED_PLUGIN_FILES, id)));

// "reviewed" is the private vault; "public" is an exported copy re-running the
// exporter it contains.
export function sourceMode(value) {
  if (!Array.isArray(value) || value.some((id) => typeof id !== "string")) {
    throw failure("community-plugins.json must be an array of plugin IDs.");
  }
  if (JSON.stringify(value) === JSON.stringify(ENABLED_BUNDLED_PLUGIN_IDS)) {
    return "public";
  }
  const observed = new Set(value);
  if (
    observed.size !== COMMUNITY_PLUGIN_IDS.length
    || observed.size !== value.length
    || COMMUNITY_PLUGIN_IDS.some((id) => !observed.has(id))
  ) {
    throw failure(`community-plugins.json does not match the reviewed ${COMMUNITY_PLUGIN_IDS.length}-plugin list.`);
  }
  return "reviewed";
}

function publicApp(source) {
  const profile = {
    attachmentFolderPath: "Strata/Attachments",
    defaultViewMode: oneOf(source.defaultViewMode, ["preview", "source", "live"], "preview"),
    newFileLocation: oneOf(source.newFileLocation, ["current", "root"], "current"),
    openBehavior: oneOf(source.openBehavior, ["", "new-tab", "split", "tab"], ""),
    propertiesInDocument: oneOf(source.propertiesInDocument, ["hidden", "source", "visible"], "source"),
    trashOption: oneOf(source.trashOption, ["local", "system"], "local"),
  };
  for (const key of APP_BOOLEAN_KEYS) {
    profile[key] = boolean(source[key], false);
  }
  return profile;
}

function publicAppearance(source) {
  const accentColor = typeof source.accentColor === "string" && /^#[0-9a-f]{6}$/i.test(source.accentColor)
    ? source.accentColor
    : "#8a5df4";
  const fontName = (value) => (typeof value === "string" && /^[\p{L}\p{N} ,'"-]{0,120}$/u.test(value) ? value : "");
  return {
    accentColor,
    baseFontSize: finiteNumber(source.baseFontSize, 16, 10, 32),
    baseFontSizeAction: boolean(source.baseFontSizeAction, false),
    cssTheme: oneOf(source.cssTheme, ["Minimal"], ""),
    enabledCssSnippets: [...PUBLIC_SNIPPET_NAMES, "vault-fonts"],
    interfaceFontFamily: fontName(source.interfaceFontFamily),
    monospaceFontFamily: fontName(source.monospaceFontFamily),
    textFontFamily: fontName(source.textFontFamily),
    theme: oneOf(source.theme, ["obsidian", "moonstone"], "obsidian"),
    translucency: boolean(source.translucency, false),
  };
}

function publicCorePlugins(source) {
  return Object.fromEntries(CORE_PLUGIN_IDS.map((id) => [id, boolean(source[id], false)]));
}

// Sidebar panels the workspace keeps, with the view-state keys each may keep.
// Panels that follow the open file or hold a search lose that state, a pinned
// note survives only when it is published, and unknown panels are dropped.
const WORKSPACE_PANELS = Object.freeze({
  "all-properties": ["sortOrder"],
  backlink: ["collapseAll", "extraContext", "sortOrder", "backlinkCollapsed", "unlinkedCollapsed"],
  bookmarks: [],
  "claudian-view": [],
  "file-explorer": ["sortOrder", "autoReveal"],
  "file-properties": [],
  "journal-view": ["shelf"],
  "keep-the-rhythm": [],
  localgraph: ["options"],
  markdown: ["file", "mode", "source", "backlinks"],
  "mermaid-toolbar-view": [],
  outline: ["followCursor"],
  "outgoing-link": ["linksCollapsed", "unlinkedCollapsed"],
  "recent-files": [],
  "review-queue-list-view": [],
  search: ["matchingCase", "explainSearch", "collapseAll", "extraContext", "sortOrder"],
  tag: ["sortOrder", "useHierarchy"],
});

function publicPanel(leaf) {
  const { type, state = {}, ...view } = leaf.state;
  const allowed = WORKSPACE_PANELS[type.split(":")[0]];
  if (!allowed || (type === "markdown" && !VAULT_FILES.includes(state.file))) {
    return null;
  }
  const kept = Object.fromEntries(allowed.filter((key) => Object.hasOwn(state, key)).map((key) => [key, state[key]]));
  return { ...leaf, state: { ...view, type, state: kept } };
}

function publicSidebar(node) {
  if (node.type === "leaf") {
    return publicPanel(node);
  }
  const children = [];
  let currentTab = node.currentTab;
  node.children.forEach((child, index) => {
    const kept = publicSidebar(child);
    if (kept) {
      children.push(kept);
    } else if (currentTab !== undefined && index < node.currentTab) {
      currentTab -= 1;
    }
  });
  return currentTab === undefined ? { ...node, children } : { ...node, children, currentTab: Math.max(0, Math.min(currentTab, children.length - 1)) };
}

// The live layout, ribbon order, and pinned panels, opening on the example map
// with no recent-file history.
function publicWorkspace(source) {
  const leaf = "public-vault-map";
  return {
    main: {
      id: "public-vault-main",
      type: "split",
      direction: "vertical",
      children: [{
        id: "public-vault-tabs",
        type: "tabs",
        children: [{
          id: leaf,
          type: "leaf",
          state: { type: "markdown", state: { file: "Entropy/Public Vault Map.md", mode: "preview", source: false }, icon: "lucide-file", title: "Public Vault Map" },
        }],
      }],
    },
    left: publicSidebar(source.left),
    right: publicSidebar(source.right),
    "left-ribbon": source["left-ribbon"],
    active: leaf,
    lastOpenFiles: [],
  };
}

function validHotkeyBindings(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((binding) => (
    binding
    && typeof binding === "object"
    && typeof binding.key === "string"
    && /^[A-Za-z0-9\[\]]$/.test(binding.key)
    && Array.isArray(binding.modifiers)
    && binding.modifiers.every((modifier) => ["Alt", "Mod", "Shift"].includes(modifier))
  )).map((binding) => ({ key: binding.key, modifiers: [...binding.modifiers] }));
}

function publicHotkeys(source) {
  return Object.fromEntries(PUBLIC_HOTKEY_COMMANDS.map((command) => [command, validHotkeyBindings(source[command]) ]));
}

const PROPERTY_TYPES = Object.freeze(["aliases", "checkbox", "date", "datetime", "multitext", "number", "tags", "text"]);

function publicTypes(source) {
  const types = source?.types && typeof source.types === "object" ? source.types : {};
  return { types: Object.fromEntries(Object.entries(types).filter(([, type]) => PROPERTY_TYPES.includes(type))) };
}

const GRAPH_KEYS = Object.freeze([
  "collapse-filter", "search", "showTags", "showAttachments", "hideUnresolved", "showOrphans",
  "collapse-color-groups", "colorGroups", "collapse-display", "showArrow", "textFadeMultiplier",
  "nodeSizeMultiplier", "lineSizeMultiplier", "collapse-forces", "centerStrength", "repelStrength",
  "linkStrength", "linkDistance", "scale", "close",
]);

function profileReference(pluginNames) {
  const rows = COMMUNITY_PLUGIN_IDS.map((id) => {
    const bundled = Object.hasOwn(BUNDLED_PLUGIN_FILES, id) ? "Yes" : "Offered on first open";
    return `| ${pluginNames[id] ?? id} | ${bundled} | ${PLUGIN_SETTINGS_PROFILES[id].reason} |`;
  });
  return `---
tags:
  - tech/software/obsidian
  - type/guide
aliases: [Public plugin settings]
created: 2026-09-22
status: active
cssclasses:
  - banner
  - banner-fade
---

![[Hubble Veil Nebula.jpg|banner]]

## Plugin Settings

This vault uses ${COMMUNITY_PLUGIN_IDS.length} community plugins and the Minimal theme. Five plugins come with it; the first time you open the vault, the Public Vault plugin offers to install the others and the theme from the community directory. Their settings are copied from the original vault, leaving out anything private such as tokens, file history, and personal notes.

| Plugin | Comes with the vault | Settings |
| --- | --- | --- |
${rows.join("\n")}
`;
}

// The appearance fonts are installed system-wide in the private vault; a public
// copy gets them embedded in a snippet so it looks the same on any machine.
const VAULT_FONTS = Object.freeze([
  { family: "DM Mono", weight: "400", file: "Strata/Fonts/DMMono-Regular.ttf" },
  { family: "Golos Text", weight: "400 900", file: "Strata/Fonts/GolosText-VariableFont_wght.ttf" },
]);

async function fontSnippet(vaultRoot) {
  const faces = [];
  for (const font of VAULT_FONTS) {
    const data = (await readExactFile(vaultRoot, font.file)).toString("base64");
    faces.push(`@font-face {\n  font-family: "${font.family}";\n  font-style: normal;\n  font-weight: ${font.weight};\n  src: url(data:font/ttf;base64,${data}) format("truetype");\n}`);
  }
  return `/* DM Mono and Golos Text, embedded so the vault looks the same on any machine.\n   Both are licensed under the SIL Open Font License 1.1; see LICENSES/. */\n${faces.join("\n")}\n`;
}

export async function readSourceMode(vaultRoot) {
  return sourceMode(await readExactJson(vaultRoot, ".obsidian/community-plugins.json"));
}

export async function auditInstalledPluginData({ vaultRoot }) {
  const installed = await readExactJson(vaultRoot, ".obsidian/community-plugins.json");
  sourceMode(installed);

  const records = [];
  for (const id of COMMUNITY_PLUGIN_IDS) {
    const profile = PLUGIN_SETTINGS_PROFILES[id];
    const relativePath = `.obsidian/plugins/${id}/data.json`;
    const contents = await readExactFile(vaultRoot, relativePath, { optional: true });
    const record = { id, profile: profile.mode, sourceData: contents === null ? "absent" : "present" };
    if (contents !== null) {
      let parsed = null;
      try {
        parsed = JSON.parse(contents.toString("utf8"));
      } catch {}
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw failure(`${relativePath} must contain a JSON object when present.`);
      }
      if (profile.keys) {
        const kept = new Set(profile.keys.map((keyPath) => keyPath.split(".")[0]));
        record.droppedKeys = Object.keys(parsed).filter((key) => !kept.has(key));
      }
    }
    records.push(record);
  }
  return records;
}

export async function createStageTwoFiles({ vaultRoot, pluginNames = {} }) {
  const [
    app,
    appearance,
    backlink,
    canvas,
    communityPlugins,
    corePlugins,
    graph,
    hotkeys,
    pagePreview,
    types,
    workspace,
  ] = await Promise.all([
    readExactJson(vaultRoot, ".obsidian/app.json"),
    readExactJson(vaultRoot, ".obsidian/appearance.json"),
    readExactJson(vaultRoot, ".obsidian/backlink.json"),
    readExactJson(vaultRoot, ".obsidian/canvas.json"),
    readExactJson(vaultRoot, ".obsidian/community-plugins.json"),
    readExactJson(vaultRoot, ".obsidian/core-plugins.json"),
    readExactJson(vaultRoot, ".obsidian/graph.json"),
    readExactJson(vaultRoot, ".obsidian/hotkeys.json"),
    readExactJson(vaultRoot, ".obsidian/page-preview.json"),
    readExactJson(vaultRoot, ".obsidian/types.json"),
    readExactJson(vaultRoot, ".obsidian/workspace.json"),
  ]);
  sourceMode(communityPlugins);

  const files = new Map();
  addFile(files, ".obsidian/app.json", json(publicApp(app)));
  addFile(files, ".obsidian/appearance.json", json(publicAppearance(appearance)));
  addFile(files, ".obsidian/backlink.json", json({ backlinkInDocument: boolean(backlink.backlinkInDocument, false) }));
  addFile(files, ".obsidian/canvas.json", json({
    newFileLocation: oneOf(canvas.newFileLocation, ["current", "root"], "current"),
    snapToGrid: boolean(canvas.snapToGrid, false),
    snapToObjects: boolean(canvas.snapToObjects, true),
    zoomBreakpoint: finiteNumber(canvas.zoomBreakpoint, 1.5, 0.5, 4),
  }));
  addFile(files, ".obsidian/community-plugins.json", json(ENABLED_BUNDLED_PLUGIN_IDS));
  addFile(files, ".obsidian/core-plugins.json", json(publicCorePlugins(corePlugins)));
  addFile(files, ".obsidian/daily-notes.json", json({
    folder: "Continuum/Time/Daily",
    template: "Strata/Templates/Time/Journals/Daily Note.md",
  }));
  addFile(files, ".obsidian/graph.json", json(allowlistedSettings("graph", graph, GRAPH_KEYS)));
  addFile(files, ".obsidian/hotkeys.json", json(publicHotkeys(hotkeys)));
  addFile(files, ".obsidian/page-preview.json", json({
    bases: boolean(pagePreview.bases, false),
    outline: boolean(pagePreview.outline, false),
    search: boolean(pagePreview.search, false),
  }));
  addFile(files, ".obsidian/templates.json", json({ folder: "Strata/Templates" }));
  addFile(files, ".obsidian/types.json", json(publicTypes(types)));
  addFile(files, ".obsidian/workspace.json", json(publicWorkspace(workspace)));

  for (const name of PUBLIC_SNIPPET_NAMES) {
    addFile(files, `.obsidian/snippets/${name}.css`, await readExactFile(vaultRoot, `.obsidian/snippets/${name}.css`));
  }
  addFile(files, ".obsidian/snippets/vault-fonts.css", await fontSnippet(vaultRoot));
  for (const id of COMMUNITY_PLUGIN_IDS) {
    const profile = PLUGIN_SETTINGS_PROFILES[id];
    const data = profile.keys
      ? allowlistedSettings(id, await readExactJson(vaultRoot, `.obsidian/plugins/${id}/data.json`), profile.keys, profile.rules)
      : profile.data;
    if (data !== null) {
      addFile(files, `.obsidian/plugins/${id}/data.json`, json(data));
    }
  }
  for (const [id, pluginFiles] of Object.entries(BUNDLED_PLUGIN_FILES)) {
    for (const file of pluginFiles) {
      const relativePath = `.obsidian/plugins/${id}/${file}`;
      addFile(files, relativePath, await readExactFile(vaultRoot, relativePath));
    }
  }
  addFile(files, "Matter/Obsidian/Plugin Settings Reference.md", profileReference(pluginNames));
  return files;
}
