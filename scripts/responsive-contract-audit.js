"use strict";

const assert = require("assert");
const {
  calculatorSmokeViewports,
  fullSiteViewports,
  requiredResponsiveWidths,
} = require("./responsive-viewports");

const checks = [];
const check = (label, callback) => {
  callback();
  checks.push(label);
};

check("a viewportnevek egyediek", () => {
  const names = fullSiteViewports.map((viewport) => viewport.name);
  assert.strictEqual(new Set(names).size, names.length);
});

check("minden viewport érvényes, pozitív egész méreteket használ", () => {
  for (const viewport of fullSiteViewports) {
    assert.ok(Number.isInteger(viewport.width) && viewport.width > 0, `${viewport.name}: hibás width`);
    assert.ok(Number.isInteger(viewport.height) && viewport.height > 0, `${viewport.name}: hibás height`);
    assert.strictEqual(viewport.deviceScaleFactor, 1, `${viewport.name}: váratlan deviceScaleFactor`);
    assert.strictEqual(typeof viewport.mobile, "boolean", `${viewport.name}: mobile nem boolean`);
  }
});

check("a kötelező responsive szélességek szerepelnek a teljes mátrixban", () => {
  const widths = new Set(fullSiteViewports.map((viewport) => viewport.width));
  for (const width of requiredResponsiveWidths) {
    assert.ok(widths.has(width), `hiányzó kötelező szélesség: ${width}px`);
  }
});

check("a telefonos portré lefedettség 320–430 px között teljes", () => {
  for (const width of [320, 360, 375, 390, 430]) {
    assert.ok(
      fullSiteViewports.some(
        (viewport) => viewport.mobile && viewport.width === width && viewport.height > viewport.width
      ),
      `hiányzó portré telefon: ${width}px`
    );
  }
});

check("van fekvő mobil, tablet és nagy desktop nézet", () => {
  assert.ok(fullSiteViewports.some((viewport) => viewport.mobile && viewport.width > viewport.height));
  assert.ok(fullSiteViewports.some((viewport) => viewport.width === 768 && viewport.height > viewport.width));
  assert.ok(fullSiteViewports.some((viewport) => viewport.width === 1920));
});

check("a kalkulátor smoke viewportjai a központi mátrixból származnak", () => {
  const fullNames = new Set(fullSiteViewports.map((viewport) => viewport.name));
  for (const viewport of calculatorSmokeViewports) {
    assert.ok(fullNames.has(viewport.name), `ismeretlen smoke viewport: ${viewport.name}`);
  }
});

check("a kalkulátor smoke lefedi a fő kockázati nézeteket", () => {
  assert.ok(calculatorSmokeViewports.some((viewport) => viewport.width === 320));
  assert.ok(calculatorSmokeViewports.some((viewport) => viewport.mobile && viewport.width > viewport.height));
  assert.ok(calculatorSmokeViewports.some((viewport) => viewport.width === 768));
  assert.ok(calculatorSmokeViewports.some((viewport) => viewport.width === 1440));
  assert.ok(calculatorSmokeViewports.some((viewport) => viewport.width === 1920));
});

console.log(`Responsive contract audit OK: ${checks.length}/${checks.length} ellenőrzés.`);
checks.forEach((label, index) => console.log(`${index + 1}. ${label}`));
