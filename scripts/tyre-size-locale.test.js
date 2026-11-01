"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/autos/tyre-size-locale");
const page = "gumi-meret-kalkulator";

test("tyre size copy distinguishes geometry from vehicle approval", () => {
  assert.equal(translate(page, "Gumiméret váltó kalkulátor", "en"), "Tyre Size Calculator");
  assert.equal(translate(page, "Gyártói engedélyezés", "de"), "Herstellerfreigabe");
  assert.ok(translate(page, "Az eredmény önmagában nem jelenti azt, hogy az új méret felszerelhető, biztonságos vagy jogszerű. A jármű gyártói méretlistája és műszaki előírásai az elsődlegesek.", "en").includes("does not mean"));
  assert.ok(translate(page, "A geometriai egyezés nem jelent automatikus műszaki megfelelőséget. Csak a jármű gyártója, jóváhagyási dokumentuma vagy hiteles műszaki adat alapján engedélyezett méretet használj.", "de").includes("technische Eignung"));
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Hirdetés", "en"), "Advertisement");
  assert.equal(translate(page, "Tyre Size Calculator", "hu"), "Gumiméret váltó kalkulátor");
});

test("dynamic geometry, validation, report link and units are localized", () => {
  for (const source of ["Régi átmérő", "Új átmérő", "Átmérőeltérés",
    "Elméleti sebesség a geometriai arány alapján", "Méreteltérés jelzés",
    "kis geometriai eltérés; a gyártói engedélyezést ettől még ellenőrizd",
    "nagyobb geometriai eltérés; ellenőrizd a gyártói engedélyezést",
    "Ellenőrizd a kötelező mezőket és az értékhatárokat."]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "595,5 mm", "en"), "595.5 mm");
  assert.equal(translate(page, "-1,24%", "en"), "-1.24%");
  assert.equal(translate(page, "-1,24%", "de"), "-1,24 %");
  const original = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Kalkul%C3%A1tor";
  const de = new URL(reportHref(original, "de"));
  assert.equal(de.searchParams.get("subject"), "Fehlermeldung – Reifengrößenrechner");
  assert.ok(de.searchParams.get("body").includes("Kurze Beschreibung des Fehlers"));
  assert.equal(reportHref(original, "hu"), original);
});
