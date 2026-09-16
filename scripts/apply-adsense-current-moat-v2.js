const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

// Keep current-article document titles within the repository's HTML lint limit.
// This is intentionally part of the editorial transform so newly merged/current
// content cannot reintroduce an overlong <title> during materialization.
const titleFixes = {
  "ksh-keresetek-2026-julius.html": "KSH keresetek 2026. július: bruttó átlag 745 500 Ft | Kalkulátor Bázis"
};

for (const [fileName, title] of Object.entries(titleFixes)) {
  const file = path.join(root, "aktualis", fileName);
  if (!fs.existsSync(file)) throw new Error(`Hiányzó Aktuális-cikk a title javításhoz: ${fileName}`);
  let html = fs.readFileSync(file, "utf8");
  if (!/<title>[\s\S]*?<\/title>/.test(html)) throw new Error(`Hiányzó <title>: ${fileName}`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  fs.writeFileSync(file, html, "utf8");
}

const articles = {
  "ksh-inflacio-2026-augusztus.html": {
    previous: "2026. július: 1,2% éves infláció",
    current: "2026. augusztus: 1,3% éves infláció",
    delta: "+0,1 százalékpont éves alapon; júliushoz képest +0,2% havi árszintváltozás",
    affected: "Háztartási költségtervezés, megtakarítások és pénzösszegek vásárlóerejének értelmezése.",
    calculatorHref: "../kalkulatorok/inflacio-kalkulator",
    calculatorLabel: "Infláció kalkulátor"
  },
  "ksh-uzemanyagarak-2026-augusztus.html": {
    previous: "2026. július: benzin 590 Ft/l, dízel 613 Ft/l",
    current: "2026. augusztus: benzin 589 Ft/l, dízel 672 Ft/l",
    delta: "Benzin −1 Ft/l; dízel +59 Ft/l a havi országos átlagban",
    affected: "Autózási és utazási költségtervezés, különösen magasabb futásteljesítménynél.",
    calculatorHref: "../kalkulatorok/uzemanyag-koltseg-kalkulator",
    calculatorLabel: "Üzemanyagköltség kalkulátor"
  },
  "nav-uzemanyag-elszamolasi-arak-2026-szeptember.html": {
    previous: "2026. augusztus: benzin 580 Ft/l, gázolaj 592 Ft/l NAV-elszámolási ár",
    current: "2026. szeptember: benzin 604 Ft/l, gázolaj 667 Ft/l NAV-elszámolási ár",
    delta: "Benzin +24 Ft/l; gázolaj +75 Ft/l",
    affected: "Azok a magánszemélyek, akik a NAV közzétett árával számolnak el üzemanyagköltséget; ez nem benzinkúti átlagár.",
    calculatorHref: "../kalkulatorok/auto-kalkulator",
    calculatorLabel: "Autós út- és hatótáv kalkulátor"
  }
};

const markerPattern = /<!-- KB_ADSENSE:current-impact:START -->[\s\S]*?<!-- KB_ADSENSE:current-impact:END -->/;

for (const [fileName, item] of Object.entries(articles)) {
  const file = path.join(root, "aktualis", fileName);
  if (!fs.existsSync(file)) throw new Error(`Hiányzó Aktuális-cikk: ${fileName}`);
  let html = fs.readFileSync(file, "utf8");
  const block = `<!-- KB_ADSENSE:current-impact:START -->
<section class="current-impact-summary" aria-labelledby="currentImpactTitle">
  <h2 id="currentImpactTitle">Mi változott, és mit érdemes ebből elvinni?</h2>
  <dl class="current-impact-grid">
    <div><dt>Előző érték</dt><dd>${item.previous}</dd></div>
    <div><dt>Új érték</dt><dd>${item.current}</dd></div>
    <div><dt>Változás</dt><dd>${item.delta}</dd></div>
    <div><dt>Kit érint?</dt><dd>${item.affected}</dd></div>
  </dl>
  <p><strong>Számold ki a saját helyzetedet:</strong> <a href="${item.calculatorHref}">${item.calculatorLabel}</a>.</p>
</section>
<!-- KB_ADSENSE:current-impact:END -->`;

  if (markerPattern.test(html)) {
    html = html.replace(markerPattern, block);
  } else {
    const sourceBox = '<div class="current-source-box">';
    if (!html.includes(sourceBox)) throw new Error(`Hiányzó forrásblokk: ${fileName}`);
    html = html.replace(sourceBox, `${block}\n${sourceBox}`);
  }

  if (!/Szerkesztés: Kovács Patrik/.test(html)) {
    html = html.replace(/(<div class="current-meta">[\s\S]*?<\/div>)/, (match) => match.replace("</div>", "<span>Szerkesztés: Kovács Patrik</span></div>"));
  }
  fs.writeFileSync(file, html, "utf8");
}

const calculatorLinks = {
  "inflacio-kalkulator.html": ["../aktualis/ksh-inflacio-2026-augusztus", "Friss KSH-inflációs összefoglaló: 2026. augusztus"],
  "uzemanyag-koltseg-kalkulator.html": ["../aktualis/ksh-uzemanyagarak-2026-augusztus", "Friss KSH-üzemanyagár összefoglaló: 2026. augusztus"],
  "auto-kalkulator.html": ["../aktualis/nav-uzemanyag-elszamolasi-arak-2026-szeptember", "NAV üzemanyag-elszámolási árak: 2026. szeptember"],
  "uzemanyagar-kulonbseg-kalkulator.html": ["../aktualis/ksh-uzemanyagarak-2026-augusztus", "KSH üzemanyagárak: 2026. augusztus"]
};
const relatedPattern = /<!-- KB_ADSENSE:current-related:START -->[\s\S]*?<!-- KB_ADSENSE:current-related:END -->/;

for (const [fileName, [href, label]] of Object.entries(calculatorLinks)) {
  const file = path.join(root, "kalkulatorok", fileName);
  if (!fs.existsSync(file)) throw new Error(`Hiányzó kapcsolt kalkulátor: ${fileName}`);
  let html = fs.readFileSync(file, "utf8");
  const block = `<!-- KB_ADSENSE:current-related:START -->
<aside class="article current-related-note" aria-label="Kapcsolódó friss adat">
  <h2>Kapcsolódó friss adat</h2>
  <p><a href="${href}">${label}</a> – hivatalos forrásból feldolgozott aktuális adat és gyakorlati értelmezés.</p>
</aside>
<!-- KB_ADSENSE:current-related:END -->`;
  if (relatedPattern.test(html)) html = html.replace(relatedPattern, block);
  else if (html.includes("<!-- KB_STATIC:reliability:START -->")) html = html.replace("<!-- KB_STATIC:reliability:START -->", `${block}\n<!-- KB_STATIC:reliability:START -->`);
  else html = html.replace("</main>", `${block}\n</main>`);
  fs.writeFileSync(file, html, "utf8");
}

console.log(`Strengthened ${Object.keys(articles).length} current articles and ${Object.keys(calculatorLinks).length} calculator back-links; normalized ${Object.keys(titleFixes).length} title.`);
