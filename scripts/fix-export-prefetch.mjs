/**
 * Post-build fix for `output: "export"` (Next.js 16.3).
 *
 * On some platforms the export writes a nested route's client-navigation
 * payload into a directory:
 *
 *   out/privacy/__next.privacy/__PAGE__.txt
 *
 * while the router asks for it as one flat filename:
 *
 *   out/privacy/__next.privacy.__PAGE__.txt
 *
 * A Node host resolves both; a static host (GitHub Pages) serves files
 * literally, so every prefetch 404s in the background. This copies each payload
 * to the flat name the client requests, leaving the originals in place.
 *
 * Observed on Windows but not on Linux CI, so finding nothing to do is a normal
 * outcome, not a failure — the only hard error here is a missing export, which
 * means the build itself did not produce anything to publish.
 *
 * Runs automatically as npm's `postbuild`.
 */
import { access, copyFile, readdir } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = "out";
/** Static assets, no navigation payloads in here — skip the large tree. */
const SKIP = new Set(["_next", "images", "videos", "sites", "seo"]);

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(path.join(OUT_DIR, "index.html")))) {
  console.error(
    `fix-export-prefetch: ${OUT_DIR}/index.html is missing — the static export did not run.`
  );
  process.exit(1);
}

let aliased = 0;

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
        aliased += 1;
      }
      continue;
    }

    await flattenPayloadDirs(full);
  }
}

await flattenPayloadDirs(OUT_DIR);

/**
 * Reports which sub-pages ended up with a flat payload file, so the log states
 * what is actually on disk instead of assuming the platform behaved. A route
 * without one still works — the router falls back to a full page load — but it
 * means a background 404 on every prefetch, so it is worth seeing.
 */
async function auditRoutes(dir, routes = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || SKIP.has(entry.name) || entry.name.startsWith("__next.")) {
      continue;
    }

    const full = path.join(dir, entry.name);
    // Nothing links to the 404 page, so it is never prefetched; the host serves
    // 404.html directly. Reporting it as missing would be permanent noise.
    if (entry.name !== "404" && (await exists(path.join(full, "index.html")))) {
      const files = await readdir(full, { withFileTypes: true });
      routes.push({
        route: `/${path.relative(OUT_DIR, full).split(path.sep).join("/")}/`,
        hasPayload: files.some((f) => f.isFile() && f.name.startsWith("__next.")),
      });
    }

    await auditRoutes(full, routes);
  }
  return routes;
}

const routes = await auditRoutes(OUT_DIR);
const missing = routes.filter((r) => !r.hasPayload).map((r) => r.route);

console.log(
  aliased > 0
    ? `fix-export-prefetch: aliased ${aliased} navigation payload(s).`
    : "fix-export-prefetch: no nested payload directories found."
);
console.log(
  `fix-export-prefetch: ${routes.length - missing.length}/${routes.length} sub-page(s) have a flat prefetch payload.` +
    (missing.length ? ` Missing: ${missing.join(", ")} (prefetch will 404; navigation still works).` : "")
);
