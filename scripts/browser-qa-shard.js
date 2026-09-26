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

let transformed = source.replace(
  viewportBlock,
  `  const viewports = ${JSON.stringify(viewports)};`
);

transformed = transformed
  .replace(
    "const { resolve, reject } = pending.get(message.id);",
    "const { resolve, reject, method } = pending.get(message.id);"
  )
  .replace(
    "if (message.error) reject(new Error(message.error.message));",
    "if (message.error) reject(new Error(`[CDP ${method}] ${message.error.message}`));"
  )
  .replace(
    "return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));",
    "return new Promise((resolve, reject) => pending.set(id, { resolve, reject, method }));"
  )
  .replace(
    'await client.send("Page.navigate", { url: `${origin}${pagePath}` });',
    'console.log(`Browser QA navigate: ${pagePath}`);\n    await client.send("Page.navigate", { url: `${origin}${pagePath}` });'
  );

console.log(`Browser QA shard viewportok: ${JSON.stringify(viewports)}`);

const qaModule = new Module(browserQaPath, module);
qaModule.filename = browserQaPath;
qaModule.paths = Module._nodeModulePaths(path.dirname(browserQaPath));
qaModule._compile(transformed, browserQaPath);
