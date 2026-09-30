import path from "node:path";
import { fileURLToPath } from "node:url";

import { DEFAULT_TARGET } from "./public-vault.manifest.mjs";
import { exportPublicVault } from "./export-public-vault.mjs";

function parseArguments(argumentsList) {
  if (argumentsList.length === 0) {
    return DEFAULT_TARGET;
  }
  if (argumentsList.length === 2 && argumentsList[0] === "--target") {
    return argumentsList[1];
  }
  throw new Error("Usage: node 'Strata/Public Vault/validate-public-vault.mjs' [--target /absolute/path]");
}

async function main() {
  const target = parseArguments(process.argv.slice(2));
  const result = await exportPublicVault({ target, check: true });
  console.log(`Validated ${result.files} managed files for ${result.target}.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
