const { FileSystemAdapter, Modal, Notice, Plugin, Setting, requestUrl } = require("obsidian");
const { execFile } = require("child_process");
const path = require("path");

const CATALOG = "Strata/Public Vault/plugin-catalog.json";
const DIRECTORY = "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/HEAD";

// Exports this vault's public copy, and in a copy of it offers to install the
// catalogued community plugins and theme that Obsidian does not install itself.
module.exports = class PublicVaultPlugin extends Plugin {
  async onload() {
    this.addCommand({ id: "install-missing", name: "Install missing plugins and theme", callback: () => this.offerInstall(true) });
    // Only the exported copy carries the target marker. The exporter reads the
    // source vault's private inputs, so only the source vault can run it, and
    // only the copy offers to install.
    if (!(await this.app.vault.adapter.exists(".public-vault-exporter.json"))) {
      this.addCommand({ id: "export", name: "Export public vault", callback: () => this.runExporter([]) });
      this.addCommand({ id: "check", name: "Check public vault export", callback: () => this.runExporter(["--check"]) });
      return;
    }
    // Obsidian drops the ribbon places of plugins that are not installed yet the
    // first time it saves the layout, so keep the published ribbon before that.
    const workspace = `${this.app.vault.configDir}/workspace.json`;
    if (!(await this.loadData())?.ribbon && (await this.app.vault.adapter.exists(workspace))) {
      const ribbon = JSON.parse(await this.app.vault.adapter.read(workspace))["left-ribbon"];
      if (ribbon) await this.saveData({ ribbon });
    }
    this.app.workspace.onLayoutReady(() => this.offerInstall(false));
  }

  // Obsidian started from the Dock has no shell PATH, so node is found through
  // the user's login shell.
  runExporter(args) {
    const adapter = this.app.vault.adapter;
    if (!(adapter instanceof FileSystemAdapter)) {
      new Notice("Public vault export needs Obsidian on desktop.");
      return;
    }
    const script = path.join(adapter.getBasePath(), "Strata", "Public Vault", "export-public-vault.mjs");
    const progress = new Notice("Public vault: running…", 0);
    const shell = process.env.SHELL || "/bin/zsh";
    execFile(shell, ["-lic", 'node "$@"', "node", script, ...args], { timeout: 300000 }, (error, stdout, stderr) => {
      progress.hide();
      const output = [stderr.trim(), stdout.trim()].filter(Boolean).join("\n");
      new Notice(`Public vault: ${output || error?.message || "done"}`, error ? 0 : 10000);
    });
  }

  async missing() {
    if (!(await this.app.vault.adapter.exists(CATALOG))) {
      return { plugins: [], theme: null };
    }
    const catalog = JSON.parse(await this.app.vault.adapter.read(CATALOG));
    const plugins = catalog.plugins.filter((plugin) => !plugin.bundled && !this.app.plugins.manifests[plugin.id]);
    const theme = catalog.theme;
    return { plugins, theme: theme && !this.app.customCss.themes[theme] ? theme : null };
  }

  async offerInstall(manual) {
    const { plugins, theme } = await this.missing();
    if (plugins.length === 0 && !theme) {
      if (manual) {
        new Notice("Every catalogued plugin and the theme are installed.");
      }
      return;
    }
    new InstallModal(this.app, plugins, theme, () => this.install(plugins, theme)).open();
  }

  async install(plugins, theme) {
    const failed = [];
    const progress = new Notice("Installing…", 0);
    if (plugins.length > 0) {
      const repos = Object.fromEntries((await requestUrl(`${DIRECTORY}/community-plugins.json`).json).map((entry) => [entry.id, entry.repo]));
      for (const [index, plugin] of plugins.entries()) {
        progress.setMessage(`Installing ${plugin.name} (${index + 1} of ${plugins.length})…`);
        try {
          await this.download(repos[plugin.id], `${this.app.vault.configDir}/plugins/${plugin.id}`, ["main.js", "manifest.json"], ["styles.css"]);
        } catch (error) {
          failed.push(`${plugin.name}: ${error.message}`);
        }
      }
      await this.app.plugins.loadManifests();
      for (const plugin of plugins) {
        if (this.app.plugins.manifests[plugin.id]) {
          await this.app.plugins.enablePluginAndSave(plugin.id);
        }
      }
      // Newly enabled plugins append their ribbon buttons; restore the published order and visibility.
      const ribbon = (await this.loadData())?.ribbon;
      if (ribbon) {
        this.app.workspace.leftRibbon.load(ribbon);
        this.app.workspace.requestSaveLayout();
      }
    }
    if (theme) {
      progress.setMessage(`Installing the ${theme} theme…`);
      try {
        const entry = (await requestUrl(`${DIRECTORY}/community-css-themes.json`).json).find((candidate) => candidate.name === theme);
        await this.download(entry?.repo, `${this.app.vault.configDir}/themes/${theme}`, ["theme.css", "manifest.json"], []);
        await this.app.customCss.readThemes();
        this.app.customCss.setTheme(theme);
      } catch (error) {
        failed.push(`${theme} theme: ${error.message}`);
      }
    }
    progress.hide();
    new Notice(failed.length === 0 ? "Installed everything this vault uses." : `Some installs failed:\n${failed.join("\n")}`, failed.length === 0 ? 8000 : 0);
  }

  async download(repo, folder, required, optional) {
    if (!repo) {
      throw new Error("not found in the community directory");
    }
    const adapter = this.app.vault.adapter;
    if (!(await adapter.exists(folder))) {
      await adapter.mkdir(folder);
    }
    for (const file of [...required, ...optional]) {
      const response = await requestUrl({ url: `https://github.com/${repo}/releases/latest/download/${file}`, throw: false });
      if (response.status === 200) {
        await adapter.write(`${folder}/${file}`, response.text);
      } else if (required.includes(file)) {
        throw new Error(`${file} returned HTTP ${response.status}`);
      }
    }
  }
};

class InstallModal extends Modal {
  constructor(app, plugins, theme, onInstall) {
    super(app);
    this.plugins = plugins;
    this.theme = theme;
    this.onInstall = onInstall;
  }

  onOpen() {
    this.titleEl.setText("Install what this vault uses");
    const parts = [];
    if (this.plugins.length > 0) {
      parts.push(`${this.plugins.length} community plugins`);
    }
    if (this.theme) {
      parts.push(`the ${this.theme} theme`);
    }
    this.contentEl.createEl("p", {
      text: `This vault is set up for ${parts.join(" and ")}, downloaded from their authors' GitHub releases through Obsidian's community directory. Their settings are already in place.`,
    });
    const list = this.contentEl.createEl("ul");
    for (const plugin of this.plugins) {
      list.createEl("li", { text: plugin.name });
    }
    if (this.theme) {
      list.createEl("li", { text: `${this.theme} (theme)` });
    }
    new Setting(this.contentEl)
      .addButton((button) => button.setButtonText("Not now").onClick(() => this.close()))
      .addButton((button) => button.setButtonText("Install and enable").setCta().onClick(() => {
        this.close();
        this.onInstall();
      }));
  }

  onClose() {
    this.contentEl.empty();
  }
}
