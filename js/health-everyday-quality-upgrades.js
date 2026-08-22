(() => {
  "use strict";

  const slug = (window.location.pathname.split("/").pop() || "index.html")
    .replace(/\.html?$/i, "")
    .toLowerCase();
  const root = window.KB_PROJECT_ROOT || "";

  const supported = new Set([
    "egeszseg", "mindennapi",
    "bmi-kalkulator", "kaloria-kalkulator", "vizfogyasztas-kalkulator",
    "pulzus-zona-kalkulator", "terhessegi-kalkulator", "idealis-testsuly-kalkulator",
    "testzsir-kalkulator", "makro-kalkulator", "alvasciklus-kalkulator",
    "bmr-kalkulator", "derek-csipo-kalkulator", "feherje-szukseglet-kalkulator",
    "szazalek-kalkulator", "afa-kalkulator", "ar-kedvezmeny-kalkulator",
    "borravalo-kalkulator", "munkaido-kalkulator", "eletkor-kalkulator",
    "datum-kulonbseg-kalkulator", "atlag-kalkulator", "egysegar-kalkulator",
    "rezsi-megosztas-kalkulator", "oraber-kalkulator", "arany-kalkulator",
  ]);
  if (!supported.has(slug)) return;

  const main = document.querySelector("main");
  if (!main || document.querySelector('[data-lifestyle-quality="2026-08"]')) return;

  const nf = new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 2 });
  const money = (value) => Number.isFinite(value)
    ? `${new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 }).format(Math.round(value))} Ft`
    : "–";
  const n = (value, fallback = 0) => {
    const parsed = Number.parseFloat(String(value ?? "").replace(/\s/g, "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const esc = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  const link = (href, label) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;

  const add = (className, html) => {
    const node = document.createElement("section");
    node.className = `lifestyle-quality ${className}`;
    node.dataset.lifestyleQuality = "2026-08";
    node.innerHTML = html;
    main.appendChild(node);
    return node;
  };

  const cards = (items) => `<div class="lq-card-grid">${items.map(({ title, text }) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>`;
  const source = (items, note = "A kalkulátor tájékoztató segédlet; egyedi egészségügyi vagy jogi döntést nem helyettesít.") => `
    <div class="lq-source"><strong>Forrás és ellenőrzési alap</strong><div>${items.map((item) => link(item.href, item.label)).join(" · ")}</div><p>${note}</p></div>`;
  const healthGate = (text) => `<div class="lq-safety"><strong>Egészségügyi határ:</strong> ${text}</div>`;

  function healthHub() {
    add("lq-health-hub", `
      <p class="lq-kicker">Egészségügyi döntési térkép</p>
      <h2>Egy szám helyett négy kérdés</h2>
      <p>Az egészség kalkulátorok akkor hasznosak, ha nem diagnózist keresel bennük, hanem egy mérés vagy becslés helyét akarod megérteni. A kategóriát ezért négy külön nézőpontra bontjuk.</p>
      ${cards([
        { title: "Testméret és testösszetétel", text: `BMI, derék–csípő arány és testzsír. Ezek különböző dolgokat mérnek vagy becsülnek, ezért egyik sem helyettesíti a másikat.` },
        { title: "Energia és tápanyag", text: `BMR, kalória, makró és fehérje. A képletek kiindulópontok; a valós igény aktivitással, egészségi állapottal és idővel változhat.` },
        { title: "Edzés és regeneráció", text: `Pulzuszóna és alvás. A képletből számolt zóna mellé terhelésérzetet, az alvásnál pedig mennyiséget és minőséget is érdemes nézni.` },
        { title: "Külön élethelyzet", text: `Várandósság és folyadékbevitel. Itt a kalkulátor eredménye különösen csak tájékozódási pont, mert az egyéni körülmények nagy súllyal számítanak.` },
      ])}
      <div class="lq-paths">
        <a href="${root}/kalkulatorok/bmi-kalkulator">Testméretből indulok →</a>
        <a href="${root}/kalkulatorok/kaloria-kalkulator">Energiaigényt becsülök →</a>
        <a href="${root}/kalkulatorok/pulzus-zona-kalkulator">Edzést tervezek →</a>
        <a href="${root}/kalkulatorok/alvasciklus-kalkulator">Alvást tervezek →</a>
      </div>
      ${healthGate("Várandósság, gyermekkor, krónikus betegség, gyógyszerszedés vagy panasz esetén ne egy általános kalkulátorból hozz egészségügyi döntést.")}
    `);
  }

  function everydayHub() {
    add("lq-everyday-hub", `
      <p class="lq-kicker">Hétköznapi döntési térkép</p>
      <h2>Előbb tisztázd, mit hasonlítasz össze</h2>
      <p>A legtöbb hétköznapi számolási hiba nem a műveletnél, hanem a kiindulási alapnál történik: más százalékból indulunk, más időt számolunk, vagy nem ugyanarra az egységre vetítjük az árakat.</p>
      ${cards([
        { title: "Ár és vásárlás", text: "Százalék, kedvezmény, ÁFA és egységár. A közös nevező mindig azonos alap vagy azonos egység legyen." },
        { title: "Megosztás", text: "Borravaló és rezsi. Az egyenlő rész nem mindig ugyanaz, mint az igazságos rész; előbb az osztási szabályt érdemes rögzíteni." },
        { title: "Munka és idő", text: "Munkaidő, órabér, életkor és dátumkülönbség. Jelenléti idő, fizetett idő, naptári nap és beleértett kezdőnap külön fogalom." },
        { title: "Matematikai alap", text: "Átlag és arány. Az átlagot szélső értékek torzíthatják, az aránynál pedig nem mindegy, rész–egész vagy rész–rész viszonyról beszélünk." },
      ])}
      <div class="lq-note"><strong>Minőségi elv:</strong> ezek az oldalak nem egyforma „képlet + példa” lapok. Mindegyik egy tipikus félreértést vagy következő döntési lépést kezel.</div>
    `);
  }

  function bmi() {
    add("lq-bmi", `
      <p class="lq-kicker">BMI értelmezési ellenőrző</p>
      <h2>A BMI szűrőmutató, nem testösszetétel-vizsgálat</h2>
      ${cards([
        { title: "Mit tud?", text: "Testsúlyt viszonyít a magasság négyzetéhez, ezért gyors népességi és felnőtt szűrőmutató." },
        { title: "Mit nem tud?", text: "Nem különíti el az izmot és a zsírt, és nem mondja meg, hol helyezkedik el a testzsír." },
        { title: "Mivel egészítsd ki?", text: "Trenddel, derékkörfogattal, testösszetétel-adattal és az egyéni egészségi háttérrel." },
      ])}
      <div class="lq-note"><strong>Különösen fontos:</strong> a felnőtt BMI-kategóriákat gyermekekre nem szabad ugyanúgy alkalmazni; életkor-specifikus értelmezés kell.</div>
      ${source([
        { label: "WHO – Obesity and overweight", href: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" },
        { label: "CDC – Adult BMI Calculator", href: "https://www.cdc.gov/bmi/adult-calculator/index.html" },
      ])}
    `);
  }

  function calories() {
    add("lq-calories", `
      <p class="lq-kicker">Kalóriabecslés bizonytalansági térképe</p>
      <h2>A képlet jó kezdőpont, de nem laboreredmény</h2>
      ${cards([
        { title: "Alapanyagcsere", text: "A becslés életkorból, testméretből és nemből indulhat, de egyéni eltérés mindig marad." },
        { title: "Aktivitási szorzó", text: "A legnagyobb bizonytalanság gyakran az, hogy a napi mozgást melyik aktivitási szint írja le valójában." },
        { title: "Valós visszajelzés", text: "Hosszabb távú testsúlytrend, éhség, teljesítmény és közérzet segít megítélni, mennyire volt jó a kiinduló becslés." },
      ])}
      ${healthGate("A kalkulátor nem személyre szabott fogyókúrás vagy terápiás étrend. Terhesség, szoptatás, 18 év alatti életkor vagy betegség esetén szakemberrel tervezz.")}
      ${source([{ label: "NIH/NIDDK – Body Weight Planner", href: "https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner" }])}
    `);
  }

  function water() {
    const node = add("lq-water", `
      <p class="lq-kicker">Folyadékigény kontextusellenőrző</p>
      <h2>Ne csak a testsúlyt nézd</h2>
      <p>A napi folyadékigényt nem lehet mindenkinél egyetlen testsúlyszorzóval pontosan meghatározni. Jelöld, mely körülmények növelhetik a folyadékvesztést vagy változtathatják az egyéni igényt.</p>
      <div class="lq-checks">
        <label><input type="checkbox" data-water-factor> Meleg környezet / erős izzadás</label>
        <label><input type="checkbox" data-water-factor> Hosszabb vagy intenzív fizikai aktivitás</label>
        <label><input type="checkbox" data-water-factor> Láz, hányás vagy hasmenés</label>
        <label><input type="checkbox" data-water-factor> Várandósság vagy szoptatás</label>
        <label><input type="checkbox" data-water-medical> Olyan betegség/gyógyszer, amely a folyadékháztartást érintheti</label>
      </div>
      <div class="lq-live" data-water-result>Általános becslésként kezeld a fő kalkulátor eredményét.</div>
      <p class="lq-caption">A National Academies „total water” értékei az italokból és ételekből származó vizet együtt értik, és nem minden emberre előírt pontos napi célt jelentenek.</p>
      ${source([{ label: "National Academies – Dietary Reference Intakes for Water", href: "https://www.nationalacademies.org/read/10925/chapter/2" }])}
    `);
    const update = () => {
      const factors = node.querySelectorAll("[data-water-factor]:checked").length;
      const medical = node.querySelector("[data-water-medical]").checked;
      const out = node.querySelector("[data-water-result]");
      out.textContent = medical
        ? "Itt ne automatikusan emeld a folyadékot: egyes betegségek és gyógyszerek miatt személyre szabott orvosi javaslat lehet szükséges."
        : factors > 0
          ? `${factors} olyan körülményt jelöltél, amely miatt a statikus alapbecslés kevésbé lehet pontos. Figyeld a környezetet, terhelést és egyéni visszajelzéseket.`
          : "Nem jelöltél külön módosító körülményt. A fő kalkulátor eredménye továbbra is tájékoztató becslés.";
    };
    node.addEventListener("change", update);
    update();
  }

  function heartRate() {
    add("lq-heart", `
      <p class="lq-kicker">Edzésintenzitás keresztellenőrző</p>
      <h2>A pulzusszám mellé tedd oda a terhelésérzetet is</h2>
      ${cards([
        { title: "Képlet", text: "A becsült maximális pulzusból számolt zónák egyszerű, általános támpontok." },
        { title: "Beszédteszt", text: "Mérsékelt intenzitásnál általában még lehet beszélni, de énekelni már nehezebb; erős intenzitásnál csak néhány szó fér bele megállás nélkül." },
        { title: "Egyéni eltérés", text: "Edzettség, gyógyszerek és keringési állapot miatt ugyanaz a képlet nem mindenkinél írja le jól a terhelést." },
      ])}
      ${healthGate("Mellkasi fájdalom, ájulásérzés, szokatlan légszomj vagy ismert szív-érrendszeri betegség esetén ne a kalkulátor alapján emeld a terhelést.")}
      ${source([{ label: "CDC – What Counts as Physical Activity for Adults", href: "https://www.cdc.gov/physical-activity-basics/adding-adults/what-counts.html" }])}
    `);
  }

  function pregnancy() {
    add("lq-pregnancy", `
      <p class="lq-kicker">Terhességi dátumozás – forráshierarchia</p>
      <h2>A menstruáció alapján számolt dátum csak az első becslés</h2>
      <div class="lq-timeline">
        <div><span>1</span><strong>Utolsó menstruáció</strong><p>Gyors kiindulópont, ha a ciklus és a dátum ismert.</p></div>
        <div><span>2</span><strong>Korai ultrahang</strong><p>Az első trimeszteri ultrahang fontos a terhességi kor megerősítéséhez vagy pontosításához.</p></div>
        <div><span>3</span><strong>Asszisztált reprodukció</strong><p>ART/IVF esetén a beavatkozásból származó terhességi kor alapján határozzák meg a várható időpontot.</p></div>
      </div>
      ${healthGate("A kalkulátor nem terhesgondozási eszköz. Vérzés, erős fájdalom, rosszullét vagy bármilyen aggasztó tünet esetén egészségügyi ellátás szükséges, nem újraszámolás.")}
      ${source([{ label: "ACOG – Methods for Estimating the Due Date", href: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date" }])}
    `);
  }

  function idealWeight() {
    add("lq-ideal-weight", `
      <p class="lq-kicker">„Ideális testsúly” értelmezési korlát</p>
      <h2>A képlet eredménye ne váljon automatikusan célsúllyá</h2>
      ${cards([
        { title: "Történeti képletek", text: "Az ideális testsúly képletek egyszerű testmagasság-alapú becslések; nem mérik az izomtömeget vagy a testzsíreloszlást." },
        { title: "Egészség ≠ egyetlen kilogramm", text: "Két azonos magasságú ember egészséges testösszetétele és testsúlya eltérhet." },
        { title: "Jobb használat", text: "Tájékozódási sávként nézd, majd vesd össze BMI-vel, derékkörfogattal, trenddel és – ha kell – szakmai értékeléssel." },
      ])}
      ${source([{ label: "CDC – BMI as a screening measure", href: "https://www.cdc.gov/bmi/adult-calculator/index.html" }])}
    `);
  }

  function bodyFat() {
    add("lq-body-fat", `
      <p class="lq-kicker">Mérési reprodukálhatóság</p>
      <h2>A becslés pontosságát a mérőszalag is eldönti</h2>
      ${cards([
        { title: "Ugyanaz a pont", text: "Mindig ugyanazon anatómiai pontokon mérj; néhány centiméter eltérés érdemben módosíthatja a becslést." },
        { title: "Ugyanaz a körülmény", text: "Trendkövetéshez hasonló napszakban és hasonló állapotban mérj, ne egyetlen értéket hasonlíts össze tetszőleges korábbi méréssel." },
        { title: "Becslés, nem vizsgálat", text: "Körfogatból számolt testzsírérték nem azonos DEXA-val vagy más műszeres testösszetétel-vizsgálattal." },
      ])}
      <div class="lq-note"><strong>Hasznosabb kérdés:</strong> „azonos módszerrel merre változik a trend?” – nem az, hogy egyetlen tizedesjegy pontos-e.</div>
      ${source([{ label: "WHO – Anthropometry expert report", href: "https://www.who.int/publications/i/item/9241208546" }])}
    `);
  }

  function macros() {
    add("lq-macros", `
      <p class="lq-kicker">Makrótervezési sorrend</p>
      <h2>A százalékok összege csak matematikai ellenőrzés</h2>
      ${cards([
        { title: "1. Energia", text: "Először a teljes napi energia-becslés legyen értelmezhető; a makrók ezt osztják fel." },
        { title: "2. Fehérje és zsír", text: "Ne csak százalékot nézz: a tényleges grammérték, testsúly, élethelyzet és étrendi minta is számít." },
        { title: "3. Szénhidrát", text: "A fennmaradó energia és az aktivitás alapján értelmezhető; nincs egyetlen mindenkire optimális arány." },
        { title: "4. Visszamérés", text: "Teljesítmény, jóllakottság, emésztés és hosszabb távú trend alapján finomíts, ne naponta változtass." },
      ])}
      ${healthGate("Betegség, terhesség, szoptatás, gyermekkor vagy terápiás étrend esetén a makróelosztás szakember feladata lehet.")}
      ${source([
        { label: "National Academies – DRIs for macronutrients", href: "https://www.nationalacademies.org/read/10925/chapter/25" },
        { label: "NIH/NIDDK – Body Weight Planner", href: "https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner" },
      ])}
    `);
  }

  function sleep() {
    add("lq-sleep", `
      <p class="lq-kicker">Alvásciklus – mítoszvédő</p>
      <h2>A 90 perc nem menetrend</h2>
      <p>Az alvásciklus hossza emberenként és az éjszaka során is változhat. A kalkulátor 90 perces ciklusa ezért időzítési játék és tervezési segédlet, nem garancia arra, hogy egy adott percben könnyebb lesz felébredni.</p>
      ${cards([
        { title: "Mennyiség", text: "Felnőtteknél a rendszeres, elegendő alvás fontosabb, mint egy feltételezett ciklushatár pontos eltalálása." },
        { title: "Minőség", text: "Gyakori ébredés, horkolás, légzéskimaradás-gyanú vagy nappali aluszékonyság esetén a ciklusszámítás nem oldja meg az okot." },
        { title: "Rendszeresség", text: "A következetes lefekvési és felkelési idő sokszor használhatóbb cél, mint a percre kiszámolt ciklusvég." },
      ])}
      ${source([{ label: "CDC – About Sleep", href: "https://www.cdc.gov/sleep/about/index.html" }])}
    `);
  }

  function bmr() {
    add("lq-bmr", `
      <p class="lq-kicker">BMR → napi energia létra</p>
      <h2>Az alapanyagcsere nem a napi „ehető kalóriád”</h2>
      <div class="lq-steps">
        <div><strong>BMR</strong><span>Nyugalmi energiaigény matematikai becslése.</span></div>
        <div><strong>+ napi mozgás</strong><span>Munka, séta, házimunka és spontán aktivitás.</span></div>
        <div><strong>+ edzés</strong><span>Tervezett fizikai aktivitás, amely naponta eltérhet.</span></div>
        <div><strong>= napi energiafelhasználás becslése</strong><span>Ez is változó tartomány, nem állandó laborérték.</span></div>
      </div>
      <div class="lq-note"><strong>Ne keverd össze:</strong> BMR, RMR és TDEE rokon, de nem azonos fogalmak. A fő kalkulátor BMR-t becsül; napi étrendhez további feltételezések kellenek.</div>
      ${source([{ label: "NIH/NIDDK – Body Weight Planner", href: "https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner" }])}
    `);
  }

  function waistHip() {
    add("lq-whr", `
      <p class="lq-kicker">Derék–csípő mérési protokoll</p>
      <h2>Az arányszám csak akkor összehasonlítható, ha a mérés is az</h2>
      ${cards([
        { title: "Derék", text: "A mérési pontot következetesen ugyanott válaszd meg, és a szalag ne vágjon a bőrbe." },
        { title: "Csípő", text: "A csípőkörfogat legnagyobb részén végzett mérésnél tartsd a szalagot vízszintesen." },
        { title: "Trend", text: "Az azonos protokollal ismételt mérés többet mond a változásról, mint két eltérő technikával kapott érték." },
      ])}
      <p>A WHO külön szakértői konzultációban foglalkozik a derékkörfogat és derék–csípő arány mérési módszerével, valamint azzal, hogy az értelmezés nem független a nemtől, kortól és etnikai háttértől.</p>
      ${source([{ label: "WHO – Waist circumference and waist-hip ratio", href: "https://www.who.int/publications/i/item/9789241501491" }])}
    `);
  }

  function protein() {
    add("lq-protein", `
      <p class="lq-kicker">Fehérjeigény – kontextuskapu</p>
      <h2>A g/kg érték előtt négy dolgot ellenőrizz</h2>
      ${cards([
        { title: "Milyen testsúllyal számolsz?", text: "A képlet a megadott testsúlyt használja; szélsőséges testösszetételnél egy egyszerű testsúlyszorzó félrevezetőbb lehet." },
        { title: "Mi a cél?", text: "Általános táplálkozás, állóképesség, erősport és energiahiány nem ugyanaz a helyzet." },
        { title: "Mennyi a teljes energia?", text: "A fehérje nem külön életet él: az elégtelen teljes energia és a teljes étrend minősége is számít." },
        { title: "Van egészségügyi korlát?", text: "Vesebetegség, egyes anyagcsere-állapotok, terhesség vagy más speciális helyzet esetén személyre szabott tanács kellhet." },
      ])}
      ${healthGate("A kalkulátor sport- és táplálkozástervezési becslés. Betegség vagy terápiás étrend esetén ne önállóan emeld a fehérjebevitelt egy kalkulált célérték alapján.")}
      ${source([{ label: "National Academies – Dietary Reference Intakes", href: "https://www.nationalacademies.org/read/10925/chapter/25" }])}
    `);
  }

  function percent() {
    add("lq-percent", `
      <p class="lq-kicker">Százalék – alapellenőrző</p>
      <h2>Három hasonló kérdés, három külön művelet</h2>
      ${cards([
        { title: "Mennyi X%-a Y-nak?", text: "A százalékot az alapértékre alkalmazod: Y × X / 100." },
        { title: "Hány százalékkal változott?", text: "A különbséget a kiinduló értékhez viszonyítod, nem a végsőhöz." },
        { title: "Mi volt az eredeti érték?", text: "Fordított százalékszámításnál nem egyszerűen levonod a százalékot a végső értékből." },
      ])}
      <div class="lq-note"><strong>Százalékpont ≠ százalék:</strong> 20%-ról 25%-ra emelkedés +5 százalékpont, miközben relatíve 25%-os növekedés.</div>
    `);
  }

  function vat() {
    add("lq-vat", `
      <p class="lq-kicker">ÁFA – irányellenőrző</p>
      <h2>Nettó → bruttó és bruttó → nettó nem ugyanaz a százalékművelet</h2>
      ${cards([
        { title: "Nettóból bruttó", text: "A nettó az adó alapja; ehhez adódik hozzá a megadott áfamérték." },
        { title: "Bruttóból nettó", text: "A bruttó már tartalmazza az adót, ezért nem helyes egyszerűen ugyanannyi százalékot levonni belőle." },
        { title: "Mérték kiválasztása", text: "A kalkulátor matematikája csak akkor jó, ha az ügylethez valóban a megfelelő áfamértéket választottad." },
      ])}
      <div class="lq-note"><strong>Hivatalos használatnál:</strong> termék, szolgáltatás, teljesítési hely, mentesség vagy speciális adózási szabály módosíthatja az áfakezelést. A kalkulátor nem adójogi minősítő.</div>
      ${source([{ label: "NAV – Általános forgalmi adó", href: "https://nav.gov.hu/ado/afa" }], "Adózási döntéshez az aktuális NAV-tájékoztatás és szükség esetén könyvelő/adószakértő az irányadó.")}
    `);
  }

  function discount() {
    const node = add("lq-discount", `
      <p class="lq-kicker">Kedvezményhalmozás teszt</p>
      <h2>Két kedvezmény nem egyszerűen összeadódik</h2>
      <div class="lq-form-row">
        <label>Eredeti ár (Ft)<input data-price inputmode="decimal" value="20 000"></label>
        <label>Első kedvezmény (%)<input data-d1 inputmode="decimal" value="20"></label>
        <label>Második kedvezmény (%)<input data-d2 inputmode="decimal" value="10"></label>
      </div>
      <div class="lq-metrics">
        <div><span>Végső ár</span><strong data-final>–</strong></div>
        <div><span>Tényleges összkedvezmény</span><strong data-effective>–</strong></div>
        <div><span>Egyszerű összeadás tévesen ezt sugallná</span><strong data-naive>–</strong></div>
      </div>
      <p class="lq-caption">Az első kedvezmény után a második már a csökkentett árra vonatkozik.</p>
    `);
    const update = () => {
      const price = Math.max(0, n(node.querySelector("[data-price]").value));
      const d1 = Math.min(100, Math.max(0, n(node.querySelector("[data-d1]").value)));
      const d2 = Math.min(100, Math.max(0, n(node.querySelector("[data-d2]").value)));
      const final = price * (1 - d1 / 100) * (1 - d2 / 100);
      const effective = price > 0 ? (1 - final / price) * 100 : 0;
      node.querySelector("[data-final]").textContent = money(final);
      node.querySelector("[data-effective]").textContent = `${nf.format(effective)}%`;
      node.querySelector("[data-naive]").textContent = `${nf.format(Math.min(100, d1 + d2))}%`;
    };
    node.addEventListener("input", update);
    update();
  }

  function tip() {
    add("lq-tip", `
      <p class="lq-kicker">Borravaló és szervizdíj</p>
      <h2>Előbb nézd meg, mi van már a számlán</h2>
      ${cards([
        { title: "Szervizdíj", text: "Ha a számla már tartalmaz felszolgálási díjat, az nem ugyanaz, mintha a végösszegre még automatikusan ugyanakkora borravalót számolnál." },
        { title: "Megosztás", text: "Több főnél döntsétek el, egyenlően vagy fogyasztás szerint osztotok; a kalkulátor csak a választott szabályt hajtja végre." },
        { title: "Kerekítés", text: "Készpénzes vagy egyszerűbb elszámolásnál a személyenkénti kerekítés miatt néhány forint eltérés keletkezhet." },
      ])}
      <div class="lq-note"><strong>Gyakorlati sorrend:</strong> számla ellenőrzése → szervizdíj ellenőrzése → kívánt plusz borravaló → megosztási szabály → kerekítés.</div>
    `);
  }

  function workTime() {
    const node = add("lq-worktime", `
      <p class="lq-kicker">Jelenléti idő vs. fizetett idő</p>
      <h2>A műszak hossza nem mindig a fizetett óraszám</h2>
      <div class="lq-form-row">
        <label>Kezdés<input type="time" data-start value="08:00"></label>
        <label>Befejezés<input type="time" data-end value="16:30"></label>
        <label>Nem fizetett szünet (perc)<input data-break inputmode="numeric" value="30"></label>
      </div>
      <div class="lq-metrics">
        <div><span>Jelenléti idő</span><strong data-presence>–</strong></div>
        <div><span>Számolt fizetett idő</span><strong data-paid>–</strong></div>
      </div>
      <p class="lq-caption">Éjfélen átnyúló műszaknál a rendszer következő napi befejezést feltételez. Munkaügyi elszámolásnál a szerződés, kollektív szabály és jogszabály az irányadó.</p>
    `);
    const minutes = (value) => {
      const [h, m] = String(value).split(":").map(Number);
      return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : 0;
    };
    const fmtDuration = (mins) => `${Math.floor(mins / 60)} óra ${Math.round(mins % 60)} perc`;
    const update = () => {
      let diff = minutes(node.querySelector("[data-end]").value) - minutes(node.querySelector("[data-start]").value);
      if (diff < 0) diff += 24 * 60;
      const unpaid = Math.max(0, n(node.querySelector("[data-break]").value));
      node.querySelector("[data-presence]").textContent = fmtDuration(diff);
      node.querySelector("[data-paid]").textContent = fmtDuration(Math.max(0, diff - unpaid));
    };
    node.addEventListener("input", update);
    update();
  }

  function age() {
    add("lq-age", `
      <p class="lq-kicker">Életkor – melyik pontosság kell?</p>
      <h2>Más kérdés a „hány éves vagy?” és a „betöltötte-e már?”</h2>
      ${cards([
        { title: "Hétköznapi életkor", text: "Általában a betöltött teljes évek száma elég." },
        { title: "Pontos időtartam", text: "Évek–hónapok–napok bontásnál a hónapok eltérő hossza miatt naptári számítás kell." },
        { title: "Jogi vagy jogosultsági korhatár", text: "Itt a konkrét szabály dönti el, melyik nap és milyen időpont számít; a kalkulátor önmagában nem jogi állásfoglalás." },
      ])}
      <div class="lq-note"><strong>Február 29-i születésnap:</strong> a naptári életkor matematikája és egy adott jogszabály szerinti korhatár-kezelés nem feltétlenül ugyanaz a kérdés.</div>
    `);
  }

  function dateDiff() {
    const node = add("lq-date", `
      <p class="lq-kicker">Dátumtartomány – határnapok</p>
      <h2>Ugyanaz a két dátum többféle „napok száma” lehet</h2>
      <div class="lq-form-row">
        <label>Kezdőnap<input type="date" data-from></label>
        <label>Zárónap<input type="date" data-to></label>
        <label class="lq-inline-check"><input type="checkbox" data-inclusive> Mindkét határnap beleszámít</label>
      </div>
      <div class="lq-live" data-date-result>Adj meg két dátumot.</div>
      <p class="lq-caption">Határidő, szabadság, szállás vagy jogi időszak esetén mindig ellenőrizd, hogy a szabály beleérti-e a kezdő- és zárónapot.</p>
    `);
    const update = () => {
      const a = node.querySelector("[data-from]").value;
      const b = node.querySelector("[data-to]").value;
      if (!a || !b) return;
      const d1 = new Date(`${a}T00:00:00Z`);
      const d2 = new Date(`${b}T00:00:00Z`);
      const raw = Math.round((d2 - d1) / 86400000);
      const inclusive = node.querySelector("[data-inclusive]").checked ? (raw >= 0 ? 1 : -1) : 0;
      node.querySelector("[data-date-result]").textContent = raw >= 0
        ? `${raw + inclusive} nap a választott számítás szerint.`
        : `A záródátum korábbi a kezdőnapnál (${Math.abs(raw + inclusive)} nap eltérés).`;
    };
    node.addEventListener("input", update);
  }

  function average() {
    const node = add("lq-average", `
      <p class="lq-kicker">Átlag és medián összevetés</p>
      <h2>Egy szélső érték el tudja húzni az átlagot</h2>
      <label class="lq-wide-label">Értékek vesszővel elválasztva<input data-values value="10, 11, 12, 13, 60"></label>
      <div class="lq-metrics">
        <div><span>Számtani átlag</span><strong data-mean>–</strong></div>
        <div><span>Medián</span><strong data-median>–</strong></div>
        <div><span>Minimum – maximum</span><strong data-range>–</strong></div>
      </div>
      <p class="lq-caption">Az oldal fő kalkulátora átlagot számol. Ez a kiegészítés megmutatja, mikor érdemes a középértéket más mutatóval is ellenőrizni.</p>
    `);
    const update = () => {
      const values = String(node.querySelector("[data-values]").value)
        .split(/[;,\s]+/)
        .map((v) => Number.parseFloat(v.replace(",", ".")))
        .filter(Number.isFinite)
        .sort((a, b) => a - b);
      if (!values.length) return;
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const mid = Math.floor(values.length / 2);
      const median = values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
      node.querySelector("[data-mean]").textContent = nf.format(mean);
      node.querySelector("[data-median]").textContent = nf.format(median);
      node.querySelector("[data-range]").textContent = `${nf.format(values[0])} – ${nf.format(values.at(-1))}`;
    };
    node.addEventListener("input", update);
    update();
  }

  function unitPrice() {
    const node = add("lq-unit-price", `
      <p class="lq-kicker">Használható mennyiségre vetített ár</p>
      <h2>A legolcsóbb címke-egységár nem mindig a legolcsóbb felhasználás</h2>
      <div class="lq-form-row">
        <label>Termék ára (Ft)<input data-up-price value="2 400" inputmode="decimal"></label>
        <label>Névleges mennyiség<input data-up-qty value="1000" inputmode="decimal"></label>
        <label>Várható veszteség / nem használt rész (%)<input data-up-waste value="10" inputmode="decimal"></label>
      </div>
      <div class="lq-metrics">
        <div><span>Névleges egységár</span><strong data-up-nominal>–</strong></div>
        <div><span>Használható mennyiség</span><strong data-up-usable>–</strong></div>
        <div><span>Használható egységre jutó ár</span><strong data-up-effective>–</strong></div>
      </div>
      <p class="lq-caption">Élelmiszernél, festéknél, tisztítószernél vagy nagy kiszerelésnél a ténylegesen felhasznált mennyiség is számíthat.</p>
    `);
    const update = () => {
      const price = Math.max(0, n(node.querySelector("[data-up-price]").value));
      const qty = Math.max(0, n(node.querySelector("[data-up-qty]").value));
      const waste = Math.min(99.9, Math.max(0, n(node.querySelector("[data-up-waste]").value)));
      const usable = qty * (1 - waste / 100);
      node.querySelector("[data-up-nominal]").textContent = qty > 0 ? `${nf.format(price / qty)} Ft/egység` : "–";
      node.querySelector("[data-up-usable]").textContent = nf.format(usable);
      node.querySelector("[data-up-effective]").textContent = usable > 0 ? `${nf.format(price / usable)} Ft/egység` : "–";
    };
    node.addEventListener("input", update);
    update();
  }

  function utilitySplit() {
    const node = add("lq-utility", `
      <p class="lq-kicker">Lakónap-alapú költségmegosztás</p>
      <h2>Ha valaki csak a hónap felében lakott ott, az egyenlő harmadolás torzíthat</h2>
      <div class="lq-form-row">
        <label>Megosztandó költség (Ft)<input data-total value="60 000" inputmode="decimal"></label>
        <label>A személy lakónapjai<input data-a value="30" inputmode="numeric"></label>
        <label>B személy lakónapjai<input data-b value="30" inputmode="numeric"></label>
        <label>C személy lakónapjai<input data-c value="15" inputmode="numeric"></label>
      </div>
      <div class="lq-metrics">
        <div><span>A része</span><strong data-ra>–</strong></div>
        <div><span>B része</span><strong data-rb>–</strong></div>
        <div><span>C része</span><strong data-rc>–</strong></div>
      </div>
      <p class="lq-caption">Ez csak egy lehetséges igazságossági szabály. Fogyasztásmérő, szobaméret vagy fix alapdíj esetén más megosztás lehet indokolt.</p>
    `);
    const update = () => {
      const total = Math.max(0, n(node.querySelector("[data-total]").value));
      const weights = ["a", "b", "c"].map((key) => Math.max(0, n(node.querySelector(`[data-${key}]`).value)));
      const sum = weights.reduce((a, b) => a + b, 0);
      ["a", "b", "c"].forEach((key, i) => {
        node.querySelector(`[data-r${key}]`).textContent = sum > 0 ? money(total * weights[i] / sum) : "–";
      });
    };
    node.addEventListener("input", update);
    update();
  }

  function hourlyWage() {
    const node = add("lq-hourly", `
      <p class="lq-kicker">Effektív órabér</p>
      <h2>A fizetett órabér és az idődre vetített órabér eltérhet</h2>
      <div class="lq-form-row">
        <label>Havi nettó vagy bruttó bér (Ft)<input data-salary value="500 000" inputmode="decimal"></label>
        <label>Fizetett havi órák<input data-paid-hours value="168" inputmode="decimal"></label>
        <label>Tényleges jelenléti/utazással együtt vállalt órák<input data-real-hours value="190" inputmode="decimal"></label>
      </div>
      <div class="lq-metrics">
        <div><span>Fizetett órára vetítve</span><strong data-paid-rate>–</strong></div>
        <div><span>Teljes időráfordításra vetítve</span><strong data-real-rate>–</strong></div>
        <div><span>Különbség</span><strong data-rate-diff>–</strong></div>
      </div>
      <p class="lq-caption">A „teljes időráfordítás” nem munkajogi bérfogalom; személyes összehasonlításhoz használható, például két állásajánlat között.</p>
    `);
    const update = () => {
      const salary = Math.max(0, n(node.querySelector("[data-salary]").value));
      const paid = Math.max(0, n(node.querySelector("[data-paid-hours]").value));
      const real = Math.max(0, n(node.querySelector("[data-real-hours]").value));
      const paidRate = paid > 0 ? salary / paid : 0;
      const realRate = real > 0 ? salary / real : 0;
      node.querySelector("[data-paid-rate]").textContent = paid > 0 ? `${money(paidRate)}/óra` : "–";
      node.querySelector("[data-real-rate]").textContent = real > 0 ? `${money(realRate)}/óra` : "–";
      node.querySelector("[data-rate-diff]").textContent = paid > 0 && real > 0 ? `${money(paidRate - realRate)}/óra` : "–";
    };
    node.addEventListener("input", update);
    update();
  }

  function ratio() {
    const node = add("lq-ratio", `
      <p class="lq-kicker">Arány skálázása</p>
      <h2>Rész–rész arányból készíts új mennyiséget</h2>
      <div class="lq-form-row">
        <label>A rész<input data-ratio-a value="2" inputmode="decimal"></label>
        <label>B rész<input data-ratio-b value="3" inputmode="decimal"></label>
        <label>Új teljes mennyiség<input data-ratio-total value="1000" inputmode="decimal"></label>
      </div>
      <div class="lq-metrics">
        <div><span>A új mennyisége</span><strong data-ratio-ra>–</strong></div>
        <div><span>B új mennyisége</span><strong data-ratio-rb>–</strong></div>
        <div><span>A részesedése a teljesből</span><strong data-ratio-share>–</strong></div>
      </div>
      <p class="lq-caption">A 2:3 arány öt összes részre osztja a teljes mennyiséget. Ez más kérdés, mint az, hogy A hány százaléka B-nek.</p>
    `);
    const update = () => {
      const a = Math.max(0, n(node.querySelector("[data-ratio-a]").value));
      const b = Math.max(0, n(node.querySelector("[data-ratio-b]").value));
      const total = Math.max(0, n(node.querySelector("[data-ratio-total]").value));
      const parts = a + b;
      node.querySelector("[data-ratio-ra]").textContent = parts > 0 ? nf.format(total * a / parts) : "–";
      node.querySelector("[data-ratio-rb]").textContent = parts > 0 ? nf.format(total * b / parts) : "–";
      node.querySelector("[data-ratio-share]").textContent = parts > 0 ? `${nf.format(a / parts * 100)}%` : "–";
    };
    node.addEventListener("input", update);
    update();
  }

  const renderers = {
    egeszseg: healthHub,
    mindennapi: everydayHub,
    "bmi-kalkulator": bmi,
    "kaloria-kalkulator": calories,
    "vizfogyasztas-kalkulator": water,
    "pulzus-zona-kalkulator": heartRate,
    "terhessegi-kalkulator": pregnancy,
    "idealis-testsuly-kalkulator": idealWeight,
    "testzsir-kalkulator": bodyFat,
    "makro-kalkulator": macros,
    "alvasciklus-kalkulator": sleep,
    "bmr-kalkulator": bmr,
    "derek-csipo-kalkulator": waistHip,
    "feherje-szukseglet-kalkulator": protein,
    "szazalek-kalkulator": percent,
    "afa-kalkulator": vat,
    "ar-kedvezmeny-kalkulator": discount,
    "borravalo-kalkulator": tip,
    "munkaido-kalkulator": workTime,
    "eletkor-kalkulator": age,
    "datum-kulonbseg-kalkulator": dateDiff,
    "atlag-kalkulator": average,
    "egysegar-kalkulator": unitPrice,
    "rezsi-megosztas-kalkulator": utilitySplit,
    "oraber-kalkulator": hourlyWage,
    "arany-kalkulator": ratio,
  };

  try {
    renderers[slug]?.();
  } catch (error) {
    console.error("Health/everyday quality upgrade failed", error);
  }
})();
