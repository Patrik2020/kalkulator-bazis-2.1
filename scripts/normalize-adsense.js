const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const adsenseSrc =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2639795157074812";

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });

const publicHtmlFiles = walk(root).filter((file) => {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  return (
    relative.endsWith(".html") &&
    !relative.startsWith("components/") &&
    !relative.startsWith("docs/")
  );
});

const scriptPattern = new RegExp(
  `\\s*<script\\b[^>]*\\bsrc=["']${adsenseSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>\\s*<\\/script>`,
  "gi"
);

let removed = 0;
let changedFiles = 0;

publicHtmlFiles.forEach((file) => {
  const original = fs.readFileSync(file, "utf8");
  const matches = original.match(scriptPattern) || [];
  const updated = original.replace(scriptPattern, "");

  if (updated !== original) {
    fs.writeFileSync(file, updated, "utf8");
    removed += matches.length;
    changedFiles += 1;
  }
});

console.log(
  JSON.stringify(
    {
      scanned: publicHtmlFiles.length,
      changedFiles,
      removedStaticAdsenseLoaders: removed,
      mode: "consent-gated-via-site-ui",
    },
    null,
    2
  )
);
