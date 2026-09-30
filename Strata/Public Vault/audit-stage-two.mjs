import path from "node:path";
import { fileURLToPath } from "node:url";

import { VAULT_ROOT } from "./export-public-vault.mjs";
import { auditInstalledPluginData } from "./stage2-public-profile.mjs";

async function main() {
  const records = await auditInstalledPluginData({ vaultRoot: VAULT_ROOT });
  const counts = Object.fromEntries(["allowlisted-preferences", "synthetic-skeleton", "omitted"].map((profile) => [
    profile,
    records.filter((record) => record.profile === profile).length,
  ]));
  const present = records.filter((record) => record.sourceData === "present").length;
  console.log(`Audited ${records.length} exact plugin data paths (${present} present).`);
  console.log(`${counts["allowlisted-preferences"]} preference profiles, ${counts["synthetic-skeleton"]} skeletons, ${counts.omitted} omissions.`);
  for (const record of records.filter((entry) => entry.droppedKeys?.length > 0)) {
    console.log(`${record.id} leaves out: ${record.droppedKeys.join(", ")}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
