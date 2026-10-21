"use strict";

// Live calculators evaluate dates in the user's browser. The crawler-facing
// HTML fallback must not freeze the date computed by headless Chrome at build time.
const dateDependentResults = new Map([
  ["kalkulatorok/fizetesi-hatarido-kalkulator.html", "Számított határnap"],
  ["kalkulatorok/szamla-teljesites-kalkulator.html", "Becsült teljesítési időpont"],
  ["kalkulatorok/terhessegi-kalkulator.html", "Becsült terminus"],
]);

const NEUTRAL_RESULT = "Az oldal megnyitásakor frissül";

function stablePriorityDateFallback(pagePath, fragment) {
  const label = dateDependentResults.get(pagePath);
  if (!label) return fragment;
  if (typeof fragment !== "string") throw new Error(pagePath + ": missing priority fallback");

  // This changes only the displayed date result. All editable fields, legal
  // explanations and other calculated values remain untouched.
  const escaped = label.replace(/[.*+?^$\{\}()|[\]\\]/g, "\\$&");
  const expression = new RegExp(`(<span>\\s*${escaped}\\s*<\\/span>\\s*<strong>)[^<]*(<\\/strong>)`, "gi");
  let occurrences = 0;
  const normalized = fragment.replace(expression, (_matched, opening, closing) => {
    occurrences += 1;
    return opening + NEUTRAL_RESULT + closing;
  });
  if (occurrences !== 1) {
    throw new Error(`${pagePath}: expected one date-dependent result, got ${occurrences}`);
  }
  return normalized;
}

module.exports = { stablePriorityDateFallback, NEUTRAL_RESULT, dateDependentResults };
