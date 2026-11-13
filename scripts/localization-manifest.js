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
  { path: "kalkulatorok/ev-toltesi-koltseg-kalkulator.html", module: "js/autos/ev-charge-locale.js", key: "ev-toltesi-koltseg-kalkulator" },
  { path: "kalkulatorok/eves-auto-koltseg-kalkulator.html", module: "js/autos/annual-car-cost-locale.js", key: "eves-auto-koltseg-kalkulator" },
  { path: "kalkulatorok/kilometerdij-kalkulator.html", module: "js/autos/kilometre-cost-locale.js", key: "kilometerdij-kalkulator" },
  { path: "kalkulatorok/gumi-meret-kalkulator.html", module: "js/autos/tyre-size-locale.js", key: "gumi-meret-kalkulator" },
  { path: "kalkulatorok/fektav-kalkulator.html", module: "js/autos/braking-distance-locale.js", key: "fektav-kalkulator" },
  { path: "kalkulatorok/utazasi-ido-kalkulator.html", module: "js/autos/travel-time-locale.js", key: "utazasi-ido-kalkulator" },
  { path: "kalkulatorok/uzemanyagar-kulonbseg-kalkulator.html", module: "js/autos/fuel-price-difference-locale.js", key: "uzemanyagar-kulonbseg-kalkulator" },
  { path: "kalkulatorok/feherje-szukseglet-kalkulator.html", module: "js/egeszseg/protein-needs-locale.js", key: "feherje-szukseglet-kalkulator" },
  { path: "kalkulatorok/pulzus-zona-kalkulator.html", module: "js/egeszseg/heart-rate-locale.js", key: "pulzus-zona-kalkulator" },
  { path: "kalkulatorok/festek-kalkulator.html", module: "js/epitoipari/festek-locale.js", key: "festek-kalkulator" },
  { path: "kalkulatorok/fuga-kalkulator.html", module: "js/epitoipari/fuga-locale.js", key: "fuga-kalkulator" },
  { path: "kalkulatorok/futotempo-kalkulator.html", module: "js/egeszseg/running-pace-locale.js", key: "futotempo-kalkulator" },
  { path: "kalkulatorok/gipszkarton-kalkulator.html", module: "js/epitoipari/drywall-locale.js", key: "gipszkarton-kalkulator" },
  { path: "kalkulatorok/harmasszabaly-kalkulator.html", module: "js/altalanos/rule-of-three-locale.js", key: "harmasszabaly-kalkulator" },
  { path: "kalkulatorok/hoszigeteles-kalkulator.html", module: "js/epitoipari/insulation-locale.js", key: "hoszigeteles-kalkulator" },
  { path: "kalkulatorok/idealis-testsuly-kalkulator.html", module: "js/egeszseg/ideal-weight-locale.js", key: "idealis-testsuly-kalkulator" },
  { path: "kalkulatorok/kaloria-kalkulator.html", module: "js/egeszseg/calorie-locale.js", key: "kaloria-kalkulator" },
  { path: "kalkulatorok/kerites-oszlop-kalkulator.html", module: "js/epitoipari/fence-post-locale.js", key: "kerites-oszlop-kalkulator" },
  { path: "kalkulatorok/lepesszam-tavolsag-kalkulator.html", module: "js/egeszseg/step-distance-locale.js", key: "lepesszam-tavolsag-kalkulator" },
  { path: "kalkulatorok/makro-kalkulator.html", module: "js/egeszseg/macro-locale.js", key: "makro-kalkulator" },
  { path: "kalkulatorok/mertekegyseg-atvalto-kalkulator.html", module: "js/atvaltok/unit-converter-locale.js", key: "mertekegyseg-atvalto-kalkulator" },
  { path: "kalkulatorok/zuzottko-kalkulator.html", module: "js/epitoipari/crushed-stone-locale.js", key: "zuzottko-kalkulator" },
  { path: "kalkulatorok/mulcs-kalkulator.html", module: "js/epitoipari/mulch-locale.js", key: "mulcs-kalkulator" },
  { path: "kalkulatorok/padlo-burkolat-kalkulator.html", module: "js/epitoipari/flooring-locale.js", key: "padlo-burkolat-kalkulator" },
  { path: "kalkulatorok/szegolec-kalkulator.html", module: "js/epitoipari/skirting-locale.js", key: "szegolec-kalkulator" },
  { path: "kalkulatorok/tapeta-kalkulator.html", module: "js/epitoipari/wallpaper-locale.js", key: "tapeta-kalkulator" },
  { path: "kalkulatorok/tegla-kalkulator.html", module: "js/epitoipari/tegla-locale.js", key: "tegla-kalkulator" },
  { path: "kalkulatorok/multifunkcios-szamologep.html", module: "js/multifunction-locale.js", key: "multifunkcios-szamologep" },
  { path: "kalkulatorok/co2-kibocsatas-kalkulator.html", module: "js/autos/co2-locale.js", key: "co2-kibocsatas-kalkulator" }
];

module.exports = { detailPages };
