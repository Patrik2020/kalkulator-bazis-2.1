(() => {
  const slugFeature = (id, pages, styles, scripts) => ({ id, match: "slug", pages, styles, scripts });
  const fileFeature = (id, pages, styles, scripts) => ({ id, match: "file", pages, styles, scripts });

  window.KB_GLOBAL_HEAD_CONFIG = Object.freeze({
    base: Object.freeze({
      styles: [
        "css/theme.css?v=0f4a295ac440",
        "css/components/accessibility.css?v=73abeeb0ad97",
      ],
      fallbackStyles: [
        "css/layout/footer.css?v=d541ea459cfd",
        "css/components/cookie.css?v=f2f8742f64ed",
      ],
      scripts: [
        "js/theme.js?v=0f4e0c522e48",
        "js/pwa.js?v=fb055828c8f9",
        "js/site-accessibility.js?v=8135c9bdc65a",
      ],
    }),
    home: Object.freeze({
      styles: ["css/pages/calculator-suite.css?v=bd34d7987fdb"],
      scriptsBeforeBase: ["js/calculator-suite.js?v=580d3a5f4460"],
      scriptsAfterFeatures: ["js/home-plugin-fallback.js?v=e1decbc4fbe7"],
    }),
    calculatorPage: Object.freeze({
      styles: [
        "css/pages/calculator-page-v2.css?v=6221842794e1",
        "css/pages/calculator-polish.css?v=5698a292be49",
        "css/components/wise-banner-enhancer.css?v=20260930-1",
      ],
      scripts: [
        "js/calculator-page.js?v=4d5d99919a87",
        "js/calculator-polish.js?v=96ed10d7ffb8",
        "js/wise-banner-enhancer.js?v=20260930-1",
      ],
    }),
    features: Object.freeze([
      fileFeature(
        "wise-banner",
        ["index.html", "penzugyi.html", "atvaltok.html", "wise.html"],
        ["css/components/wise-banner-enhancer.css?v=20260930-1"],
        ["js/wise-banner-enhancer.js?v=20260930-1"]
      ),
      slugFeature(
        "priority-upgrade",
        [
          "hitelkepesseg-kalkulator", "lakas-hitel-onero-kalkulator", "hitel-torleszto-kalkulator",
          "milliomos-kalkulator", "inflacio-kalkulator", "kamatos-kamat-kalkulator",
          "havi-koltsegvetes-kalkulator", "fizetesi-hatarido-kalkulator", "szamla-teljesites-kalkulator",
          "afa-kalkulator", "terhessegi-kalkulator", "pulzus-zona-kalkulator", "vizfogyasztas-kalkulator",
          "testzsir-kalkulator", "derek-csipo-kalkulator", "alvasciklus-kalkulator",
          "idealis-testsuly-kalkulator", "bmi-kalkulator", "kaloria-kalkulator", "bmr-kalkulator",
          "makro-kalkulator", "feherje-szukseglet-kalkulator",
        ],
        ["css/pages/priority-upgrades.css?v=81c0bc5b23c0"],
        ["js/priority-upgrades.js?v=74f2d1b8d30b"]
      ),
      slugFeature(
        "construction-upgrade",
        [
          "gipszkarton-kalkulator", "tapeta-kalkulator", "vakolat-kalkulator", "hoszigeteles-kalkulator",
          "terkovezes-kalkulator", "tetocserep-kalkulator", "fuga-kalkulator", "padlo-burkolat-kalkulator",
        ],
        ["css/pages/construction-upgrades.css?v=f4b8bb01934f"],
        ["js/construction-upgrades.js?v=c6795aa64ca5"]
      ),
      slugFeature(
        "everyday-upgrade",
        [
          "atlag-kalkulator", "munkaido-kalkulator", "oraber-kalkulator", "egysegar-kalkulator",
          "rezsi-megosztas-kalkulator", "ar-kedvezmeny-kalkulator", "borravalo-kalkulator",
          "eletkor-kalkulator", "datum-kulonbseg-kalkulator",
        ],
        ["css/pages/everyday-upgrades.css?v=5cf41f414575"],
        ["js/everyday-upgrades.js?v=8daec853d9e1"]
      ),
      slugFeature(
        "auto-converter-upgrade",
        [
          "eves-auto-koltseg-kalkulator", "auto-ertekvesztes-kalkulator", "kilometerdij-kalkulator",
          "co2-kibocsatas-kalkulator", "gumi-meret-kalkulator", "uzemanyag-koltseg-kalkulator",
          "adatmeret-atvalto-kalkulator", "energia-atvalto-kalkulator", "teljesitmeny-atvalto-kalkulator",
          "hosszusag-atvalto-kalkulator", "tomeg-atvalto-kalkulator", "terulet-atvalto-kalkulator",
          "terfogat-atvalto-kalkulator", "ido-atvalto-kalkulator", "sebesseg-atvalto-kalkulator",
        ],
        ["css/pages/auto-converter-upgrades.css?v=151e8b88ae68"],
        ["js/auto-converter-upgrades.js?v=5972f20bd8cd"]
      ),
      slugFeature(
        "finance-quality",
        [
          "penzugyi", "netto-brutto-kalkulator", "hitel-torleszto-kalkulator", "hitelkepesseg-kalkulator",
          "lakas-hitel-onero-kalkulator", "osztalek-kalkulator", "etf-kalkulator", "milliomos-kalkulator",
          "inflacio-kalkulator", "kamatos-kamat-kalkulator", "havi-koltsegvetes-kalkulator",
          "fizetesi-hatarido-kalkulator", "szamla-teljesites-kalkulator",
        ],
        ["css/pages/finance-quality-upgrades.css?v=1a287df3a970"],
        ["js/finance-quality-upgrades.js?v=7207b5e874b7"]
      ),
      slugFeature(
        "construction-quality",
        [
          "epitoipari", "beton-kalkulator", "csempe-kalkulator", "festek-kalkulator", "tegla-kalkulator",
          "gipszkarton-kalkulator", "tapeta-kalkulator", "vakolat-kalkulator", "hoszigeteles-kalkulator",
          "terkovezes-kalkulator", "tetocserep-kalkulator", "fuga-kalkulator", "padlo-burkolat-kalkulator",
        ],
        ["css/pages/construction-quality-upgrades.css?v=3786bcf552b2"],
        ["js/construction-quality-upgrades.js?v=7c73bd22cd31"]
      ),
      slugFeature(
        "health-everyday-quality",
        [
          "egeszseg", "mindennapi", "bmi-kalkulator", "kaloria-kalkulator", "vizfogyasztas-kalkulator",
          "pulzus-zona-kalkulator", "terhessegi-kalkulator", "idealis-testsuly-kalkulator",
          "testzsir-kalkulator", "makro-kalkulator", "alvasciklus-kalkulator", "bmr-kalkulator",
          "derek-csipo-kalkulator", "feherje-szukseglet-kalkulator", "szazalek-kalkulator", "afa-kalkulator",
          "ar-kedvezmeny-kalkulator", "borravalo-kalkulator", "munkaido-kalkulator", "eletkor-kalkulator",
          "datum-kulonbseg-kalkulator", "atlag-kalkulator", "egysegar-kalkulator", "rezsi-megosztas-kalkulator",
          "oraber-kalkulator", "arany-kalkulator",
        ],
        ["css/pages/health-everyday-quality-upgrades.css?v=e10e7cbe585c"],
        ["js/health-everyday-quality-upgrades.js?v=9265101ffff7"]
      ),
      slugFeature(
        "auto-converter-quality",
        [
          "auto", "atvaltok", "auto-kalkulator", "uzemanyag-koltseg-kalkulator", "auto-fogyasztas-kalkulator",
          "hatotav-kalkulator", "eves-auto-koltseg-kalkulator", "auto-ertekvesztes-kalkulator",
          "kilometerdij-kalkulator", "co2-kibocsatas-kalkulator", "tankolas-kalkulator", "gumi-meret-kalkulator",
          "autopalyadij-kalkulator", "utazasi-ido-kalkulator", "homerseklet-atvalto-kalkulator",
          "hosszusag-atvalto-kalkulator", "tomeg-atvalto-kalkulator", "terulet-atvalto-kalkulator",
          "terfogat-atvalto-kalkulator", "ido-atvalto-kalkulator", "sebesseg-atvalto-kalkulator",
          "adatmeret-atvalto-kalkulator", "deviza-atvalto-kalkulator", "energia-atvalto-kalkulator",
          "nyomas-atvalto-kalkulator", "teljesitmeny-atvalto-kalkulator",
        ],
        ["css/pages/auto-converter-quality-upgrades.css?v=52a3f32da1be"],
        ["js/auto-converter-quality-upgrades.js?v=66e0bafb80ac"]
      ),
    ]),
  });
})();
