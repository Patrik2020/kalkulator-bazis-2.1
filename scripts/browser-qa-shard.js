const fs = require("fs");
const path = require("path");
const Module = require("module");

const browserQaPath = path.join(__dirname, "browser-qa.js");
const rawViewports = process.env.KB_QA_VIEWPORTS;

if (!rawViewports) {
  throw new Error("Hiányzik a KB_QA_VIEWPORTS környezeti változó.");
}

let viewports;
try {
  viewports = JSON.parse(rawViewports);
} catch (error) {
  throw new Error(`Érvénytelen KB_QA_VIEWPORTS JSON: ${error.message}`);
}

if (
  !Array.isArray(viewports) ||
  viewports.length === 0 ||
  viewports.some(
    (item) =>
      !Array.isArray(item) ||
      item.length !== 2 ||
      !Number.isInteger(item[0]) ||
      !Number.isInteger(item[1])
  )
) {
  throw new Error("A KB_QA_VIEWPORTS értéke [[szélesség,magasság], ...] tömb legyen.");
}

const source = fs.readFileSync(browserQaPath, "utf8");
const viewportBlock = /  const viewports = \[[\s\S]*?\n  \];/;

if (!viewportBlock.test(source)) {
  throw new Error("Nem található a browser-qa.js viewports blokkja.");
}

const transformed = source.replace(
  viewportBlock,
  `  const viewports = ${JSON.stringify(viewports)};`
);

console.log(`Browser QA shard viewportok: ${JSON.stringify(viewports)}`);

const qaModule = new Module(browserQaPath, module);
qaModule.filename = browserQaPath;
qaModule.paths = Module._nodeModulePaths(path.dirname(browserQaPath));
qaModule._compile(transformed, browserQaPath);
