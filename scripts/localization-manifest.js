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
  { path: "kalkulatorok/osztalek-kalkulator.html", module: "js/penzugyi/dividend-locale.js", key: "osztalek-kalkulator" },
  { path: "kalkulatorok/netto-brutto-kalkulator.html", module: "js/penzugyi/netto-brutto-locale.js", key: "netto-brutto-kalkulator" },
  ...["auto-fogyasztas-kalkulator", "uzemanyag-koltseg-kalkulator"].map(key => ({
    path: `kalkulatorok/${key}.html`, module: "js/autos/fuel-locale.js", key
  })),
  { path: "kalkulatorok/hatotav-kalkulator.html", module: "js/autos/fuel-locale.js", key: "hatotav-kalkulator" },
  { path: "kalkulatorok/tankolas-kalkulator.html", module: "js/autos/fuel-locale.js", key: "tankolas-kalkulator" },
  { path: "kalkulatorok/autopalyadij-kalkulator.html", module: "js/autos/fuel-locale.js", key: "autopalyadij-kalkulator" },
  { path: "kalkulatorok/auto-ertekvesztes-kalkulator.html", module: "js/autos/depreciation-locale.js", key: "auto-ertekvesztes-kalkulator" },
  { path: "kalkulatorok/aljzatkiegyenlito-kalkulator.html", module: "js/autos/floor-level-locale.js", key: "aljzatkiegyenlito-kalkulator" },
  { path: "kalkulatorok/alvasciklus-kalkulator.html", module: "js/altalanos/sleep-cycle-locale.js", key: "alvasciklus-kalkulator" },
  { path: "kalkulatorok/auto-kalkulator.html", module: "js/autos/auto-locale.js", key: "auto-kalkulator" },
  { path: "kalkulatorok/beton-kalkulator.html", module: "js/epitoipari/beton-locale.js", key: "beton-kalkulator" },
  { path: "kalkulatorok/csempe-kalkulator.html", module: "js/epitoipari/csempe-locale.js", key: "csempe-kalkulator" },
  { path: "kalkulatorok/csemperagaszto-kalkulator.html", module: "js/epitoipari/csemperagaszto-locale.js", key: "csemperagaszto-kalkulator" },
  { path: "kalkulatorok/bmi-kalkulator.html", module: "js/egeszseg/bmi-locale.js", key: "bmi-kalkulator" },
  { path: "kalkulatorok/bmr-kalkulator.html", module: "js/egeszseg/bmr-locale.js", key: "bmr-kalkulator" },
  { path: "kalkulatorok/derek-csipo-kalkulator.html", module: "js/egeszseg/derek-csipo-locale.js", key: "derek-csipo-kalkulator" },
  { path: "kalkulatorok/deviza-atvalto-kalkulator.html", module: "js/atvaltok/deviza-locale.js", key: "deviza-atvalto-kalkulator" },
  { path: "kalkulatorok/egyszeri-max-1rm-kalkulator.html", module: "js/egeszseg/one-rep-max-locale.js", key: "egyszeri-max-1rm-kalkulator" },
  { path: "kalkulatorok/co2-kibocsatas-kalkulator.html", module: "js/autos/co2-locale.js", key: "co2-kibocsatas-kalkulator" }
];

module.exports = { detailPages };
