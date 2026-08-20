// Downloads real assets for the awrs.me/en clone into public/sites/awrs-me-f38a6f68/en-7a4ba3ba/images
// Run: node scripts/download-assets-awrs-me-f38a6f68-en-7a4ba3ba.mjs
import fs from "node:fs";
import path from "node:path";

const ORIGIN = "https://awrs.me";
const OUT_DIR = path.resolve("public/sites/awrs-me-f38a6f68/en-7a4ba3ba/images");

const ASSETS = [
  // Logo + favicon + OG
  "/logo.svg",
  "/icon.svg",
  "/og-image.png",
  // Project company logos
  "/projects/huda/logo_huda.png",
  "/projects/manara/icon.png",
  "/projects/navix/logo.png",
  "/projects/healog/logo.png",
  "/projects/sire/logo_sire.png",
  // Project screenshots (3 phone-mockup layers each)
  "/projects/huda/1.png",
  "/projects/huda/2.png",
  "/projects/huda/3.png",
  "/projects/manara/1.png",
  "/projects/manara/2.png",
  "/projects/manara/3.png",
  "/projects/navix/flutter_01.png",
  "/projects/navix/flutter_02.png",
  "/projects/navix/flutter_03.png",
  "/projects/healog/flutter_01.png",
  "/projects/healog/flutter_02.png",
  "/projects/healog/flutter_03.png",
  "/projects/sire/screenshots/user/flutter_01.png",
  "/projects/sire/screenshots/user/flutter_02.png",
  "/projects/sire/screenshots/user/flutter_03.png",
  // Misc sticker wall
  "/misc/maki.png",
  "/misc/aizen.png",
  "/misc/flutter.png",
  "/misc/gwen.png",
  "/misc/tung.png",
  "/misc/itachi.png",
  "/misc/mikasa.png",
  "/misc/sawako.png",
  "/misc/mikey.png",
  "/misc/yuta.png",
  "/misc/android.png",
  "/misc/kora.png",
  "/misc/hutao.png",
];

async function downloadOne(urlPath) {
  const url = ORIGIN + urlPath;
  const destRel = urlPath.replace(/^\//, "");
  const dest = path.join(OUT_DIR, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`FAIL ${res.status} ${url}`);
      return;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`OK   ${urlPath} (${buf.length} bytes)`);
  } catch (err) {
    console.error(`ERR  ${url}: ${err.message}`);
  }
}

async function run() {
  const batchSize = 4;
  for (let i = 0; i < ASSETS.length; i += batchSize) {
    const batch = ASSETS.slice(i, i + batchSize);
    await Promise.all(batch.map(downloadOne));
  }
  console.log("Done.");
}

run();
