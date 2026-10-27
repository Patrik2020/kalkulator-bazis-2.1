"use strict";

// A reviewed detail page is not a claim that metadata, every interaction or the
// entire site is localized. Browser and calculation checks remain separate.
const detailPages = [
  ...["lakas-hitel-onero-kalkulator", "hitel-elotorlesztes-kalkulator"].map(key => ({
    path: `kalkulatorok/${key}.html`, module: "js/penzugyi/mortgage-tools-locale.js", key
  })),
  ...["hitel-torleszto-kalkulator", "hitelkepesseg-kalkulator"].map(key => ({
    path: `kalkulatorok/${key}.html`, module: "js/penzugyi/credit-locale.js", key
  })),
  ...["etf-kalkulator", "inflacio-kalkulator"].map(key => ({
    path: `kalkulatorok/${key}.html`, module: "js/penzugyi/investment-inflation-locale.js", key
  })),
  ...["kamatos-kamat-kalkulator", "milliomos-kalkulator"].map(key => ({
    path: `kalkulatorok/${key}.html`, module: "js/penzugyi/wealth-growth-locale.js", key
  })),
  ...["fizetesi-hatarido-kalkulator", "szamla-teljesites-kalkulator"].map(key => ({
    path: `kalkulatorok/${key}.html`, module: "js/penzugyi/szamlazasi/invoice-date-locale.js", key
  })),
  { path: "kalkulatorok/havi-koltsegvetes-kalkulator.html", module: "js/altalanos/monthly-budget-locale.js", key: "havi-koltsegvetes-kalkulator" },
  ...["ar-kedvezmeny-kalkulator", "egysegar-kalkulator", "atlag-kalkulator",
    "arany-kalkulator", "szazalekos-valtozas-kalkulator", "borravalo-kalkulator",
    "arres-kalkulator", "haszonkulcs-kalkulator", "fedezeti-pont-kalkulator",
    "datum-hozzaadas-kivonas-kalkulator", "eletkor-kalkulator",
    "datum-kulonbseg-kalkulator", "munkaido-kalkulator", "munkanap-kalkulator",
    "tulora-kalkulator", "oraber-kalkulator", "rezsi-megosztas-kalkulator",
    "recept-adag-kalkulator", "villanyfogyasztas-koltseg-kalkulator",
    "vizfogyasztas-koltseg-kalkulator", "megtakaritasi-cel-kalkulator",
    "vesztartalek-kalkulator"].map(slug => ({
    path: `kalkulatorok/${slug}.html`,
    module: "js/altalanos/everyday-locale.js", key: slug
  })),
  ...[["afa", "vat"], ["szazalek", "percent"]].map(([slug, key]) => ({
    path: `kalkulatorok/${slug}-kalkulator.html`,
    module: "js/altalanos/vat-percent-locale.js", key
  })),
  { path: "kalkulatorok/osztalek-kalkulator.html", module: "js/penzugyi/dividend-locale.js", key: "osztalek-kalkulator" }
];

module.exports = { detailPages };
