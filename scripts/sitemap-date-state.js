"use strict";

// A build on an unchanged source tree must not rewrite generatedAt just
// because today's UTC date changed; content hashes track real page differences.
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

function stableGeneratedAt({ previous, contentChanged, today }) {
  if (!ISO_DAY.test(today)) throw new Error("Invalid build day");
  if (contentChanged || !ISO_DAY.test(previous || "")) return today;
  return previous;
}

module.exports = { ISO_DAY, stableGeneratedAt };
