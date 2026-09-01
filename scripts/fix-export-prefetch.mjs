/**
 * Post-build fix for `output: "export"` (Next.js 16.3).
 *
 * For a nested route, the export writes the client-navigation payload to a
 * directory:
 *
 *   out/privacy/__next.privacy/__PAGE__.txt
 *
 * but the router asks for it as one flat filename:
 *
 *   out/privacy/__next.privacy.__PAGE__.txt
 *
 * On a Node host the server resolves both; a static host (GitHub Pages) serves
 * files literally, so every prefetch 404s in the background. This copies each
 * payload to the flat name the client actually requests, leaving the originals
 * in place. Runs automatically as npm's `postbuild`.
 *
 * Safe to delete once Next emits the flat name itself — the check at the bottom
 * fails the build if there is nothing left to fix, so it cannot rot silently.
 */
import { copyFile, readdir } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = "out";
/** Static assets, no navigation payloads in here — skip the large tree. */
const SKIP = new Set(["_next", "images", "videos", "sites", "seo"]);

let copied = 0;

async function flattenPayloadDirs(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || SKIP.has(entry.name)) continue;

    const full = path.join(dir, entry.name);

    if (entry.name.startsWith("__next.")) {
      for (const file of await readdir(full, { withFileTypes: true })) {
        if (!file.isFile()) continue;
        await copyFile(
          path.join(full, file.name),
          path.join(dir, `${entry.name}.${file.name}`)
        );
        copied += 1;
      }
      continue;
    }

    await flattenPayloadDirs(full);
  }
}

await flattenPayloadDirs(OUT_DIR);

if (copied === 0) {
  console.error(
    "fix-export-prefetch: found no __next.* payload directories in out/. " +
      "Either the export layout changed (check whether this script is still " +
      "needed) or the build did not run."
  );
  process.exit(1);
}

console.log(`fix-export-prefetch: aliased ${copied} navigation payload(s).`);
