const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const adsenseSrc =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2639795157074812";
const adsenseTag = `<script async src="${adsenseSrc}"
     crossorigin="anonymous"></script>`;

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

let added = 0;
let deduplicated = 0;
let moved = 0;
let unchanged = 0;

publicHtmlFiles.forEach((file) => {
  const original = fs.readFileSync(file, "utf8");
  const scriptPattern = new RegExp(
    `<script\\b[^>]*\\bsrc=["']${adsenseSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>\\s*<\\/script>`,
    "gi"
  );
  const existing = original.match(scriptPattern) || [];
  const headEnd = original.search(/<\/head>/i);
  const firstPosition = original.search(scriptPattern);
  const wasInHead = firstPosition !== -1 && firstPosition < headEnd;
  let updated = original.replace(scriptPattern, "");

  updated = updated.replace(/\s*<\/head>/i, `\n  ${adsenseTag}\n</head>`);

  if (existing.length === 0) added += 1;
  else if (existing.length > 1) deduplicated += 1;
  else if (!wasInHead) moved += 1;
  else if (updated === original) unchanged += 1;

  fs.writeFileSync(file, updated, "utf8");
});

console.log(
  JSON.stringify(
    {
      scanned: publicHtmlFiles.length,
      added,
      alreadyPresent: unchanged,
      deduplicated,
      moved
    },
    null,
    2
  )
);

