const path = require("path");
const { spawnSync } = require("child_process");

const scripts = [
  "refine-content.js",
  "refine-metadata.js",
  "normalize-adsense.js",
  "normalize-heads.js",
  "normalize-form-labels.js",
  "generate-sitemap.js",
  "seo-inventory.js",
  "audit-site.js",
  "adsense-quality-audit.js"
];

scripts.forEach((script) => {
  const shouldWrite = script === "audit-site.js" || script === "adsense-quality-audit.js";
  const result = spawnSync(process.execPath, [path.join(__dirname, script), ...(shouldWrite ? ["--write"] : [])], {
    cwd: path.resolve(__dirname, ".."),
    encoding: "utf8",
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
});

console.log("A tartalom, a technikai head-elemek, a sitemap és az audit frissítése elkészült.");
