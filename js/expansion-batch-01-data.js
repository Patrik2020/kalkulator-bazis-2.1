(function (root, factory) {
  const calculators = factory();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = calculators;
  }

  if (!root) return;
  root.KB_EXPANSION_BATCH_01 = calculators;

  let merged = false;
  const mergeIntoSiteData = () => {
    const data = root.KB_DATA;
    if (!data || !Array.isArray(data.calculators)) return false;

    const known = new Set(data.calculators.map((calculator) => calculator.url));
    calculators.forEach((calculator) => {
      if (!known.has(calculator.url)) {
        data.calculators.push({ ...calculator });
        known.add(calculator.url);
      }
    });

    merged = true;
    return true;
  };

  if (typeof document !== "undefined") {
    document.addEventListener("kb:site-data-loaded", () => {
      mergeIntoSiteData();
    });

    if (mergeIntoSiteData()) {
      queueMicrotask(() => {
        document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "01" } }));
      });
    }

    window.setTimeout(() => {
      if (!merged && mergeIntoSiteData()) {
        document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "01" } }));
      }
    }, 0);
  }
})(typeof window !== "undefined" ? window : null, function () {
  return [
    {
      title: "Hármasszabály kalkulátor",
      url: "kalkulatorok/harmasszabaly-kalkulator.html",
      category: "mindennapi",
      group: "matematika",
      description: "Oldj meg egyenes arányossági feladatot három ismert értékből.",
      keywords: "hármasszabály aránypár egyenes arányosság matematika x",
      related: [
        "kalkulatorok/arany-kalkulator.html",
        "kalkulatorok/szazalek-kalkulator.html",
        "kalkulatorok/atlag-kalkulator.html"
      ]
    },
    {
      title: "Százalékos változás kalkulátor",
      url: "kalkulatorok/szazalekos-valtozas-kalkulator.html",
      category: "mindennapi",
      group: "matematika",
      description: "Számold ki két érték közötti növekedést vagy csökkenést százalékban.",
      keywords: "százalékos változás növekedés csökkenés különbség régi új érték",
      related: [
        "kalkulatorok/szazalek-kalkulator.html",
        "kalkulatorok/arany-kalkulator.html",
        "kalkulatorok/ar-kedvezmeny-kalkulator.html"
      ]
    },
    {
      title: "Csemperagasztó kalkulátor",
      url: "kalkulatorok/csemperagaszto-kalkulator.html",
      category: "epitoipari",
      group: "burkolas-feluletek",
      description: "Becsüld meg a szükséges csemperagasztó tömegét és zsákszámát.",
      keywords: "csemperagasztó ragasztó burkolás csempe járólap kg zsák anyagszükséglet",
      related: [
        "kalkulatorok/csempe-kalkulator.html",
        "kalkulatorok/fuga-kalkulator.html",
        "kalkulatorok/padlo-burkolat-kalkulator.html"
      ]
    },
    {
      title: "Elektromos autó töltési költség kalkulátor",
      url: "kalkulatorok/ev-toltesi-koltseg-kalkulator.html",
      category: "auto",
      group: "utazas-uzemanyag",
      description: "Számold ki egy elektromos autó energiaigényét és töltési költségét egy útra.",
      keywords: "elektromos autó ev töltés kwh fogyasztás villany költség út",
      related: [
        "kalkulatorok/uzemanyag-koltseg-kalkulator.html",
        "kalkulatorok/kilometerdij-kalkulator.html",
        "kalkulatorok/hatotav-kalkulator.html"
      ]
    },
    {
      title: "Futótempó kalkulátor",
      url: "kalkulatorok/futotempo-kalkulator.html",
      category: "egeszseg",
      group: "edzes-regeneracio",
      description: "Számold ki a perc/km tempót, az átlagsebességet és az azonos tempójú részidőket.",
      keywords: "futás tempó pace perc kilométer sebesség 5k 10k edzés",
      related: [
        "kalkulatorok/pulzus-zona-kalkulator.html",
        "kalkulatorok/kaloria-kalkulator.html",
        "kalkulatorok/alvasciklus-kalkulator.html"
      ]
    }
  ];
});
