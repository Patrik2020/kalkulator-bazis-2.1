/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "testzsir-kalkulator", main = doc.querySelector('main[data-simple-calc="testzsir-kalkulator"]');
  if (!main) return;
  let language = "hu", rendering = false;
  const textState = new WeakMap(), attrState = new WeakMap(), originals = new Map();
  function localize(value) {
    if (typeof value === "string") return api.translate(page, value, language) ?? value;
    if (Array.isArray(value)) return value.map(localize);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item)]));
    return value;
  }
  function render() {
    if (rendering) return; rendering = true;
    try {
      const walker = doc.createTreeWalker(main, root.NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        if (node.parentElement?.closest("script,style,textarea,pre,code,[contenteditable],[translate='no']")) continue;
        const current = node.nodeValue, old = textState.get(node), source = old?.rendered === current ? old.source : current;
        const parts = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source); if (!parts?.[2]) continue;
        const translated = api.translate(page, parts[2], language), value = parts[1] + (translated ?? parts[2]) + parts[3];
        if (value !== current) node.nodeValue = value;
        if (translated !== null || old) textState.set(node, { source, rendered: value });
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach(element => {
        let state = attrState.get(element); if (!state) { state = new Map(); attrState.set(element, state); }
        for (const name of ["aria-label", "placeholder", "title"]) if (element.hasAttribute(name)) {
          const current = element.getAttribute(name), old = state.get(name), source = old?.rendered === current ? old.source : current;
          const value = api.translate(page, source, language) ?? source; if (value !== current) element.setAttribute(name, value);
          state.set(name, { source, rendered: value });
        }
      });
      const errorLink = main.querySelector('a[href^="mailto:"][href*="subject="]');
      if (errorLink) { const source = originals.get("errorHref") || errorLink.getAttribute("href"); originals.set("errorHref", source); errorLink.setAttribute("href", api.reportHref(source, language)); }
      const structured = doc.getElementById("kb-structured-data");
      if (structured) { if (!originals.has("jsonld")) originals.set("jsonld", structured.textContent); try { structured.textContent = JSON.stringify(localize(JSON.parse(originals.get("jsonld")))); } catch { /* Keep source data. */ } }
      for (const selector of ["title", 'meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector); if (!element) continue;
        const source = originals.get(selector) || (selector === "title" ? element.textContent : element.content); originals.set(selector, source);
        const value = api.translate(page, source, language) ?? source; if (selector === "title") element.textContent = value; else element.content = value;
      }
    } finally { rendering = false; }
  }
  function choose(next) { language = api.supported.includes(next) ? next : "hu"; render(); }
  doc.addEventListener("kb:language-changed", event => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get?.() || "hu");
  new root.MutationObserver(changes => { if (changes.some(change => change.type === "childList" || change.type === "characterData")) render(); }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const page = "testzsir-kalkulator";
  const entries = [
    ["Nem", "Sex", "Geschlecht"],
    ["Nő", "Female", "Weiblich"],
    ["Férfi", "Male", "Männlich"],
    ["Magasság (cm)", "Height (cm)", "Größe (cm)"],
    ["Eredmény:", "Result:", "Ergebnis:"],
    ["Az értékek legyenek nagyobbak nullánál", "All values must be greater than zero.", "Alle Werte müssen größer als null sein."],
    ["Hasznos volt ez a kalkulátor?", "Was this calculator useful?", "War dieser Rechner hilfreich?"],
    ["Ne keresd újra. Mentsd le. Használd.", "Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.", "Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who may find it useful.", "Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehren kannst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek", "Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"],
    ["Könyvjelzőzöm", "Bookmark", "Lesezeichen"],
    ["Telepítem", "Install", "Installieren"],
    ["Megosztom", "Share", "Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.", "Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    ["Másold ki ezt a hivatkozást, és küldd tovább.", "Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    ["Milyen képletet használunk?", "Which equation do we use?", "Welche Formel verwenden wir?"],
    ["Mire nem alkalmas?", "What is it not suitable for?", "Wofür ist die Schätzung nicht geeignet?"],
    ["Gyakori hibák", "Common mistakes", "Häufige Fehler"],
    ["Gyakori kérdések", "Frequently asked questions", "Häufige Fragen"],
    ["Kapcsolódó kalkulátorok", "Related calculators", "Verwandte Rechner"],
    ["BMI kalkulátor", "BMI Calculator", "BMI-Rechner"],
    ["Derék–csípő arány", "Waist-to-Hip Ratio", "Taille-Hüft-Verhältnis"],
    ["Utolsó tartalmi frissítés:", "Last content update:", "Letzte inhaltliche Aktualisierung:"],
    ["2026. augusztus 8.", "8 August 2026", "8. August 2026"],
    ["Hitelesség és számítási korlátok", "Reliability and calculation limitations", "Verlässlichkeit und Berechnungsgrenzen"],
    ["Az eredmény általános tájékoztatást ad, nem diagnózis és nem helyettesít orvosi vizsgálatot vagy személyre szabott kezelési javaslatot.", "The result is for general information only. It is not a diagnosis and does not replace a medical examination or personalised treatment advice.", "Das Ergebnis dient der allgemeinen Information. Es ist keine Diagnose und ersetzt weder eine ärztliche Untersuchung noch eine individuelle Behandlungsempfehlung."],
    ["A számítások módszertana és minőségbiztosítása", "Calculation methodology and quality assurance", "Berechnungsmethodik und Qualitätssicherung"],
    ["Hibát találtál? Jelezd nekünk.", "Found an issue? Let us know.", "Einen Fehler gefunden? Sag uns Bescheid."],
    ["Forrás és ellenőrzési alap", "Sources and review basis", "Quellen und Prüfgrundlage"],
    ["A kalkulátor tájékoztató segédlet; egyedi egészségügyi vagy jogi döntést nem helyettesít.", "This calculator is an informational aid; it does not replace individual health or legal advice.", "Dieser Rechner dient der Information und ersetzt keine individuelle medizinische oder rechtliche Beratung."],
    ["Források és módszertani ellenőrzés", "Sources and methodology review", "Quellen und methodische Prüfung"],
    ["Az oldal tájékoztató kalkulátor; egyedi döntéshez szakember vagy hivatalos szerv adata szükséges.", "This is an informational calculator; consult a professional or official source for individual decisions.", "Dieser Rechner dient der Information. Für individuelle Entscheidungen sind Fachleute oder offizielle Stellen heranzuziehen."],
    ["Módszertani frissítés:", "Methodology updated:", "Methodisch aktualisiert:"],
    ["2026. július 15.", "15 July 2026", "15. Juli 2026"],
    ["Egészség és sport kalkulátorok", "Health and fitness calculators", "Rechner für Gesundheit und Fitness"],
    ["Főoldal", "Home", "Startseite"],
    ["Egészség & sport", "Health & fitness", "Gesundheit & Fitness"],
    ["Hirdetés", "Advertisement", "Anzeige"],
    ["Hozzáadás a Főképernyőhöz", "Add to Home Screen", "Zum Startbildschirm hinzufügen"],
    ["Nyisd meg a Safari Megosztás menüjét, válaszd a Hozzáadás a Főképernyőhöz lehetőséget, majd koppints a Hozzáadás gombra.", "Open Safari’s Share menu, choose Add to Home Screen, then tap Add.", "Öffne das Teilen-Menü von Safari, wähle Zum Startbildschirm hinzufügen und tippe anschließend auf Hinzufügen."],
    ["A Főképernyőhöz adás iPhone-on és iPaden Safariból végezhető el a legegyértelműbben. Nyisd meg ott az oldalt, majd használd a Megosztás menüt.", "On iPhone and iPad, the clearest way to add this page to your Home Screen is through Safari. Open the page in Safari and use the Share menu.", "Auf iPhone und iPad lässt sich die Seite am einfachsten über Safari zum Startbildschirm hinzufügen. Öffne die Seite in Safari und verwende das Teilen-Menü."],
    ["A natív megosztás nem sikerült, megpróbáljuk a linket másolni.", "Native sharing failed, so we’ll try copying the link instead.", "Das Teilen über die Systemfunktion ist fehlgeschlagen. Wir versuchen stattdessen, den Link zu kopieren."],
    ["A telepítési művelet nem sikerült.", "The installation action failed.", "Die Installation konnte nicht ausgeführt werden."],
    ["Ezt a kalkulátort a Kalkulátor Bázison találtam.", "I found this calculator on Kalkulátor Bázis.", "Ich habe diesen Rechner auf Kalkulátor Bázis gefunden."],
    ["A megtartó CTA komponens nem tölthető be.", "The save-and-share panel could not be loaded.", "Das Speichern-und-Teilen-Element konnte nicht geladen werden."],
    ["Kövesd az útmutatót a könyvjelző mentéséhez.", "Follow the instructions to save this page as a bookmark.", "Folge der Anleitung, um diese Seite als Lesezeichen zu speichern."],
    ["Nyisd meg a Megosztás menüt, majd válaszd a Hozzáadás a Kedvencekhez lehetőséget.", "Open the Share menu, then choose Add to Favourites.", "Öffne das Teilen-Menü und wähle Zu Favoriten hinzufügen."],
    ["Nyomd meg a ⌘ + D billentyűkombinációt, majd mentsd el az oldalt a könyvjelzőid közé.", "Press ⌘ + D, then save the page to your bookmarks.", "Drücke ⌘ + D und speichere die Seite als Lesezeichen."],
    ["Nyisd meg a böngésző menüjét, majd válaszd a Könyvjelző hozzáadása vagy a csillag ikont.", "Open your browser menu and choose Add bookmark or the star icon.", "Öffne das Browsermenü und wähle Lesezeichen hinzufügen oder das Sternsymbol."],
    ["Nyomd meg a Ctrl + D billentyűkombinációt, majd mentsd el az oldalt a könyvjelzőid közé.", "Press Ctrl + D, then save the page to your bookmarks.", "Drücke Ctrl + D und speichere die Seite als Lesezeichen."],
    ["Kövesd az útmutatót a főképernyős hozzáadáshoz.", "Follow the instructions to add the page to your home screen.", "Folge der Anleitung, um die Seite zum Startbildschirm hinzuzufügen."],
    ["Telepítési lehetőség megnyitása...", "Opening installation options...", "Installationsoptionen werden geöffnet..."],
    ["A telepítés elindult.", "Installation has started.", "Die Installation wurde gestartet."],
    ["A telepítést most nem indítottad el.", "You chose not to start the installation.", "Du hast die Installation nicht gestartet."],
    ["A telepítési lehetőség jelenleg nem érhető el.", "The installation option is currently unavailable.", "Die Installationsoption ist derzeit nicht verfügbar."],
    ["Megosztási felület megnyitva.", "Share options opened.", "Freigabeoptionen geöffnet."],
    ["A megosztást megszakítottad.", "You cancelled sharing.", "Du hast das Teilen abgebrochen."],
    ["A linket a vágólapra másoltuk.", "The link has been copied to the clipboard.", "Der Link wurde in die Zwischenablage kopiert."],
    ["hu-HU", "en-GB", "de-DE"],
    ["Testzsír százalék kalkulátor", "Body Fat Percentage Calculator", "Körperfett-Rechner"],
    ["Becsüld meg a testzsírszázalékot derék, nyak, csípő és magasság alapján.", "Estimate body fat percentage from waist, neck and hip circumferences and height.", "Schätze den Körperfettanteil anhand von Taillen-, Hals- und Hüftumfang sowie Körpergröße."],
    ["Derék (cm)", "Waist (cm)", "Taillenumfang (cm)"],
    ["Nyak (cm)", "Neck (cm)", "Halsumfang (cm)"],
    ["Csípő (cm, férfinál 0)", "Hips (cm, enter 0 for men)", "Hüftumfang (cm, bei Männern 0)"],
    ["Mit becsül a testzsír kalkulátor?", "What does the body fat calculator estimate?", "Was schätzt der Körperfett-Rechner?"],
    ["A kalkulátor a nem, magasság, derék-, nyak- és nőknél csípőkörfogat alapján ad testzsírszázalék-becslést. A módszer mérőszalagos, ezért otthon is használható, de nem azonos a laboratóriumi vagy képalkotó testösszetétel-méréssel.", "The calculator estimates body fat percentage from sex, height, waist and neck circumferences, and hip circumference for women. It uses tape measurements, so it can be used at home, but it is not equivalent to laboratory or imaging-based body composition measurements.", "Der Rechner schätzt den Körperfettanteil anhand von Geschlecht, Körpergröße, Taillen- und Halsumfang sowie bei Frauen zusätzlich dem Hüftumfang. Die Maßbandmethode lässt sich zu Hause anwenden, ist aber nicht mit einer labor- oder bildgebungsgestützten Körperzusammensetzungsmessung gleichzusetzen."],
    ["Az eredmény érzékeny a mérési helyre, a mérőszalag feszességére és a testalkatra. Emiatt egyetlen mérés helyett sokszor hasznosabb az azonos körülmények között követett trend.", "The result is sensitive to the measurement site, tape tension and body shape. Tracking a trend under consistent conditions is therefore often more useful than a single measurement.", "Das Ergebnis reagiert empfindlich auf Messstelle, Maßbandspannung und Körperbau. Daher ist es oft hilfreicher, einen Trend unter gleichen Bedingungen zu verfolgen, als eine einzelne Messung zu betrachten."],
    ["A program egy klasszikus, körméretek logaritmusát használó, gyakran „US Navy” néven említett becslőképletet alkalmaz. Férfiaknál derék, nyak és magasság; nőknél derék, csípő, nyak és magasság szerepel a számításban. Ez nem azonos a U.S. Navy jelenlegi Body Composition Assessment eljárásával, ezért az eredményt általános körfogat-alapú becslésként kezeld.", "The program uses a classic estimation formula based on logarithms of body circumferences, often referred to as the “US Navy” method. For men, the calculation uses waist, neck and height; for women, it uses waist, hips, neck and height. This is not the U.S. Navy’s current Body Composition Assessment procedure, so treat the result as a general circumference-based estimate.", "Das Programm verwendet eine klassische Schätzformel mit Logarithmen der Körperumfänge, die häufig als „US Navy“-Methode bezeichnet wird. Bei Männern gehen Taille, Hals und Körpergröße ein, bei Frauen Taille, Hüfte, Hals und Körpergröße. Dies ist nicht das aktuelle Body-Composition-Assessment-Verfahren der U.S. Navy; betrachte das Ergebnis daher als allgemeine umfangsbasierte Schätzung."],
    ["Helyes mérés röviden", "Correct measurement in brief", "Richtig messen – kurz erklärt"],
    ["A derekat nyugodt kilégzés után, a nyakat vízszintesen, a csípőt pedig a legszélesebb ponton mérd. A mérőszalag simuljon a testhez, de ne vágjon be.", "Measure your waist after a relaxed exhalation, your neck with the tape level, and your hips at the widest point. The tape should lie against the body without digging into the skin.", "Miss die Taille nach ruhigem Ausatmen, den Hals mit waagerechtem Maßband und die Hüfte an der breitesten Stelle. Das Maßband soll am Körper anliegen, ohne einzuschneiden."],
    ["Miért lehet eltérés két mérés között?", "Why can two measurements differ?", "Warum können sich zwei Messungen unterscheiden?"],
    ["Már néhány centiméteres mérési különbség is látható eltérést okozhat a becslésben. Étkezés, napszak, hidratáltság, testtartás és az is számít, pontosan hol fut a mérőszalag.", "A difference of just a few centimetres can noticeably change the estimate. Meals, time of day, hydration, posture and the exact position of the tape all matter.", "Schon wenige Zentimeter Messunterschied können die Schätzung sichtbar verändern. Mahlzeiten, Tageszeit, Flüssigkeitshaushalt, Körperhaltung und die genaue Lage des Maßbands spielen eine Rolle."],
    ["Testzsírszázalék és BMI nem ugyanaz", "Body fat percentage and BMI are different measures", "Körperfettanteil und BMI sind unterschiedliche Größen"],
    ["A BMI testsúlyt viszonyít a magassághoz, míg ez a kalkulátor körméretekből próbál testösszetételt becsülni. Egy izmos ember BMI-je lehet magas, miközben testzsírszázaléka alacsonyabb; ugyanakkor a mérőszalagos módszernek is vannak korlátai.", "BMI relates body weight to height, whereas this calculator estimates body composition from circumferences. A muscular person may have a high BMI but a lower body fat percentage; the tape-measure method also has limitations.", "Der BMI setzt Körpergewicht und Körpergröße ins Verhältnis, während dieser Rechner die Körperzusammensetzung aus Umfängen schätzt. Eine muskulöse Person kann einen hohen BMI und dennoch einen niedrigeren Körperfettanteil haben; auch die Maßbandmethode hat jedoch Grenzen."],
    ["Hogyan érdemes követni a változást?", "How should you track changes?", "Wie solltest du Veränderungen verfolgen?"],
    ["mindig hasonló napszakban mérj;", "measure at a similar time of day;", "miss immer zu einer ähnlichen Tageszeit;"],
    ["ugyanazt a mérőszalagot és mérési pontokat használd;", "use the same tape and measurement sites;", "verwende dasselbe Maßband und dieselben Messstellen;"],
    ["ne egyetlen napi értékből vonj le következtetést;", "do not draw conclusions from a single day’s value;", "ziehe keine Schlüsse aus einem einzelnen Tageswert;"],
    ["a testsúly, derékkörfogat és teljesítmény változását együtt is érdemes nézni.", "consider changes in body weight, waist circumference and performance together.", "betrachte auch Veränderungen von Körpergewicht, Taillenumfang und Leistungsfähigkeit gemeinsam."],
    ["Nem diagnosztizál egészségi állapotot, és nem helyettesít professzionális testösszetétel-vizsgálatot. Gyermekeknél, várandósság alatt, jelentős ödéma vagy speciális egészségi állapot esetén a kapott érték félrevezető lehet.", "It does not diagnose health conditions or replace a professional body composition assessment. Results can be misleading for children, during pregnancy, with significant oedema or in certain medical conditions.", "Der Rechner diagnostiziert keine Erkrankungen und ersetzt keine professionelle Untersuchung der Körperzusammensetzung. Bei Kindern, während der Schwangerschaft, bei ausgeprägten Ödemen oder besonderen gesundheitlichen Umständen kann das Ergebnis irreführend sein."],
    ["Nem ugyanazon a ponton mérnek minden alkalommal.", "Measuring at different sites each time.", "Es wird nicht jedes Mal an derselben Stelle gemessen."],
    ["Behúzott hassal vagy eltérő testtartással történik a mérés.", "Measuring with the stomach pulled in or in a different posture.", "Es wird mit eingezogenem Bauch oder in unterschiedlicher Körperhaltung gemessen."],
    ["A mérőszalagot túl szorosra húzzák.", "Pulling the tape too tight.", "Das Maßband wird zu straff gezogen."],
    ["Egyetlen mérésből messzemenő egészségügyi következtetést vonnak le.", "Drawing far-reaching health conclusions from one measurement.", "Aus einer einzelnen Messung werden weitreichende gesundheitliche Schlüsse gezogen."],
    ["A BMI-t és a testzsírszázalékot ugyanannak tekintik.", "Treating BMI and body fat percentage as the same measure.", "BMI und Körperfettanteil werden gleichgesetzt."],
    ["Pontosabb a BMI-nél?", "Is it more accurate than BMI?", "Ist die Schätzung genauer als der BMI?"],
    ["Más információt ad, de ez is becslés és mérési hibára érzékeny.", "It provides different information, but it is also an estimate and is sensitive to measurement error.", "Sie liefert andere Informationen, bleibt aber eine Schätzung und ist anfällig für Messfehler."],
    ["Mikor mérjek?", "When should I measure?", "Wann sollte ich messen?"],
    ["Lehetőleg azonos napszakban, hasonló hidratáltság és testhelyzet mellett.", "Preferably at the same time of day, with similar hydration and posture.", "Möglichst zur gleichen Tageszeit, bei ähnlichem Flüssigkeitshaushalt und gleicher Körperhaltung."],
    ["Sportolóknál használható?", "Can athletes use it?", "Ist die Methode für Sportler geeignet?"],
    ["Trendkövetésre használható lehet, de egyéni testalkatnál a képlet eltérhet a valós értéktől.", "It may be useful for tracking trends, but the formula can differ from the actual value for individual body shapes.", "Sie kann zur Trendbeobachtung nützlich sein; je nach individuellem Körperbau kann die Formel jedoch vom tatsächlichen Wert abweichen."],
    ["Gyermekeknél megfelelő?", "Is it suitable for children?", "Ist die Methode für Kinder geeignet?"],
    ["Nem általános gyermekértékelésre készült; ehhez életkor-specifikus szakmai módszer szükséges.", "It is not intended for general assessment of children; age-specific professional methods are needed.", "Sie ist nicht für die allgemeine Beurteilung von Kindern vorgesehen; dafür sind altersbezogene fachliche Methoden erforderlich."],
    ["Miért változik az eredmény, ha csak 1–2 cm-t mérek másként?", "Why does measuring just 1–2 cm differently change the result?", "Warum verändert schon ein Messunterschied von 1–2 cm das Ergebnis?"],
    ["A képlet közvetlenül használja a körméreteket, ezért a mérési pontosság erősen befolyásolja a becslést.", "The formula uses circumferences directly, so measurement accuracy strongly affects the estimate.", "Die Formel verwendet die Körperumfänge direkt; die Messgenauigkeit beeinflusst die Schätzung daher stark."],
    ["Módszertan és korlátok", "Methodology and limitations", "Methodik und Grenzen"],
    ["A kalkulátor antropometriai becslést ad körméretekből. Az eredmény tájékoztató jellegű; egészségügyi döntéshez vagy pontos testösszetétel-meghatározáshoz szakmai mérés lehet indokolt.", "The calculator gives an anthropometric estimate from circumferences. The result is for information only; professional measurement may be appropriate for health decisions or an accurate body composition assessment.", "Der Rechner liefert eine anthropometrische Schätzung aus Körperumfängen. Das Ergebnis dient der Orientierung; für gesundheitliche Entscheidungen oder eine genaue Bestimmung der Körperzusammensetzung kann eine fachliche Messung sinnvoll sein."],
    ["Testsúlytartomány", "Body weight range", "Körpergewichtsbereich"],
    ["Mérési reprodukálhatóság", "Measurement reproducibility", "Reproduzierbarkeit der Messung"],
    ["A becslés pontosságát a mérőszalag is eldönti", "Tape measurements also determine the accuracy of the estimate", "Auch das Maßband bestimmt die Genauigkeit der Schätzung"],
    ["Ugyanaz a pont", "The same site", "Dieselbe Messstelle"],
    ["Mindig ugyanazon anatómiai pontokon mérj; néhány centiméter eltérés érdemben módosíthatja a becslést.", "Always measure at the same anatomical sites; a difference of a few centimetres can materially change the estimate.", "Miss immer an denselben anatomischen Stellen; wenige Zentimeter Abweichung können die Schätzung erheblich verändern."],
    ["Ugyanaz a körülmény", "The same conditions", "Dieselben Bedingungen"],
    ["Trendkövetéshez hasonló napszakban és hasonló állapotban mérj, ne egyetlen értéket hasonlíts össze tetszőleges korábbi méréssel.", "To track trends, measure at similar times and under similar conditions rather than comparing one value with an arbitrary earlier measurement.", "Miss zur Trendbeobachtung zu ähnlichen Tageszeiten und unter ähnlichen Bedingungen, statt einen einzelnen Wert mit einer beliebigen früheren Messung zu vergleichen."],
    ["Becslés, nem vizsgálat", "An estimate, not a clinical assessment", "Eine Schätzung, keine Untersuchung"],
    ["Körfogatból számolt testzsírérték nem azonos DEXA-val vagy más műszeres testösszetétel-vizsgálattal.", "A body fat value calculated from circumferences is not equivalent to DEXA or another instrument-based body composition assessment.", "Ein aus Umfängen berechneter Körperfettwert ist nicht mit DEXA oder einer anderen apparativen Untersuchung der Körperzusammensetzung gleichzusetzen."],
    ["Hasznosabb kérdés:", "A more useful question:", "Die hilfreichere Frage:"],
    ["„azonos módszerrel merre változik a trend?” – nem az, hogy egyetlen tizedesjegy pontos-e.", "“Which way is the trend moving when measured consistently?” rather than whether a single decimal place is accurate.", "„Wie verändert sich der Trend bei gleichbleibender Methode?“ – und nicht, ob eine einzelne Nachkommastelle exakt ist."],
    ["Klasszikus körfogat-alapú testzsírbecslés – mérési pontok és hibahatár", "Classic circumference-based body fat estimate – measurement sites and uncertainty", "Klassische umfangsbasierte Körperfettschätzung – Messstellen und Unsicherheit"],
    ["A nyak/derék/csípő logaritmikus körfogatmodell trendkövetésre használható becslés, de nem azonos a U.S. Navy jelenlegi Body Composition Assessment eljárásával. A jelenlegi Navy útmutató más mérési/értékelési táblákat használ.", "The logarithmic neck/waist/hip circumference model provides an estimate that can be used to track trends, but it is not the U.S. Navy’s current Body Composition Assessment procedure. The current Navy guide uses different measurement and assessment tables.", "Das logarithmische Umfangsmodell mit Hals, Taille und Hüfte liefert eine Schätzung zur Trendbeobachtung, ist aber nicht das aktuelle Body-Composition-Assessment-Verfahren der U.S. Navy. Der aktuelle Navy-Leitfaden verwendet andere Mess- und Bewertungstabellen."],
    ["Mérési pontok sematikus ábrája", "Schematic measurement sites", "Schematische Darstellung der Messstellen"],
    ["Nyak: vízszintesen, az ádámcsutka alatt", "Neck: level, below Adam’s apple", "Hals: waagrecht unter Adamsapfel"],
    ["Derék: az előírt mérési ponton, nyugodt kilégzésnél", "Waist: specified site, relaxed exhale", "Taille: Messpunkt, ruhig ausatmen"],
    ["Csípő: nőknél a legszélesebb ponton", "Hips: widest point (women)", "Hüfte: breiteste Stelle (Frauen)"],
    ["Mindig azonos napszakban és azonos mérési ponton mérj.", "Always measure at the same time of day and at the same sites.", "Miss immer zur gleichen Tageszeit und an denselben Stellen."],
    ["A szalag simuljon, de ne vágjon a bőrbe.", "The tape should lie flat without digging into the skin.", "Das Maßband soll anliegen, ohne in die Haut einzuschneiden."],
    ["Az eredményt inkább több mérés trendjeként értelmezd.", "Interpret the result as a trend across several measurements.", "Betrachte das Ergebnis eher als Trend über mehrere Messungen."],
    ["Laboratóriumi vagy klinikai testösszetétel-vizsgálat eltérhet.", "A laboratory or clinical body composition assessment may give a different result.", "Eine labor- oder klinikgestützte Untersuchung der Körperzusammensetzung kann abweichen."],
    ["A kalkulátor klasszikus körfogat-alapú becslést ad; nem a jelenlegi Navy BCA minősítésére szolgál, és nem gyermekek, várandósság vagy speciális testalkat klinikai értékelésére készült.", "The calculator gives a classic circumference-based estimate; it is not intended for current Navy BCA classification or clinical assessment of children, pregnancy or atypical body shapes.", "Der Rechner liefert eine klassische umfangsbasierte Schätzung; er dient weder der aktuellen Navy-BCA-Einstufung noch der klinischen Beurteilung von Kindern, Schwangerschaften oder besonderen Körperformen."],
    ["Becsült testzsír", "Estimated body fat", "Geschätzter Körperfettanteil"],
    ["A körfogatok kombinációja nem lehet nulla vagy negatív", "The combined circumference must be greater than zero.", "Die kombinierte Umfangsgröße muss größer als null sein."],
    ["A megadott körfogatokból nem adható életszerű becslés", "The entered circumferences do not produce a plausible estimate.", "Die eingegebenen Umfänge ergeben keine plausible Schätzung."],
    ["Minden mezőben érvényes szám szerepeljen", "Enter a valid number in every field.", "Gib in jedem Feld eine gültige Zahl ein."],
    ["WHO – Anthropometry expert report", "WHO – Anthropometry expert report", "WHO – Anthropometry expert report"],
    ["MyNavy HR – current Body Composition Assessment Guide", "MyNavy HR – current Body Composition Assessment Guide", "MyNavy HR – current Body Composition Assessment Guide"],
    ["CDC – Healthy Weight and Growth", "CDC – Healthy Weight and Growth", "CDC – Healthy Weight and Growth"]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  function format(raw, language) {
    const value = Number(raw.replace(/\s/gu, "").replace(",", "."));
    const digits = raw.includes(",") ? raw.split(",")[1].length : 0;
    return new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
  }
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)]; if (pair) return pair[language === "en" ? 0 : 1];
    if (normalized.endsWith(":")) {
      const source = normalized.slice(0, -1);
      const base = dictionary[source] || dictionary[reverse.get(source)];
      if (base) return base[language === "en" ? 0 : 1] + ":";
    }
    const match = /^(\d+(?:,\d+)?)%$/u.exec(normalized);
    if (match) return format(match[1], language) + "%";
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source); url.searchParams.set("subject", language === "en" ? "Error report – Body Fat Percentage Calculator" : "Fehlermeldung – Körperfett-Rechner");
    if (url.searchParams.has("body")) url.searchParams.set("body", language === "en" ? "Calculator: Body Fat Percentage Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/testzsir-kalkulator.html\n\nBrief description of the issue:\n" : "Rechner: Körperfett-Rechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/testzsir-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});
