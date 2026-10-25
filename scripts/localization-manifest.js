"use strict";

// A reviewed detail page is not a claim that metadata, every interaction or the
// entire site is localized. Browser and calculation checks remain separate.
const detailPages = [
  ...["ar-kedvezmeny-kalkulator", "egysegar-kalkulator", "atlag-kalkulator",
    "arany-kalkulator", "szazalekos-valtozas-kalkulator", "borravalo-kalkulator",
    "arres-kalkulator", "haszonkulcs-kalkulator", "fedezeti-pont-kalkulator",
    "datum-hozzaadas-kivonas-kalkulator", "eletkor-kalkulator",
    "datum-kulonbseg-kalkulator", "munkaido-kalkulator", "munkanap-kalkulator",
    "tulora-kalkulator", "oraber-kalkulator", "rezsi-megosztas-kalkulator",
    "recept-adag-kalkulator"].map(slug => ({
    path: `kalkulatorok/${slug}.html`,
    module: "js/altalanos/everyday-locale.js", key: slug
  })),
  ...[["afa", "vat"], ["szazalek", "percent"]].map(([slug, key]) => ({
    path: `kalkulatorok/${slug}-kalkulator.html`,
    module: "js/altalanos/vat-percent-locale.js", key
  }))
];

module.exports = { detailPages };
