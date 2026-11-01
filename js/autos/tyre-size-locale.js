/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "gumi-meret-kalkulator";
  const main = doc.querySelector('main[data-simple-calc="gumi-meret-kalkulator"]');
  if (!main) return;
  let language = "hu", rendering = false;
  const textState = new WeakMap(), attrState = new WeakMap(), originals = new Map();
  function render() {
    if (rendering) return;
    rendering = true;
    try {
      const walker = doc.createTreeWalker(main, root.NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        if (node.parentElement?.closest("script,style,textarea,pre,code,[contenteditable],[translate='no']")) continue;
        const current = node.nodeValue, old = textState.get(node), source = old?.rendered === current ? old.source : current;
        const parts = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source);
        if (!parts?.[2]) continue;
        const translated = api.translate(page, parts[2], language);
        const value = parts[1] + (translated ?? parts[2]) + parts[3];
        if (value !== current) node.nodeValue = value;
        if (translated !== null || old) textState.set(node, { source, rendered: value });
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach(element => {
        let state = attrState.get(element);
        if (!state) { state = new Map(); attrState.set(element, state); }
        for (const name of ["aria-label", "placeholder", "title"]) if (element.hasAttribute(name)) {
          const current = element.getAttribute(name), old = state.get(name);
          const source = old?.rendered === current ? old.source : current;
          const value = api.translate(page, source, language) ?? source;
          if (value !== current) element.setAttribute(name, value);
          state.set(name, { source, rendered: value });
        }
      });
      const errorLink = main.querySelector('a[href^="mailto:"][href*="subject="]');
      if (errorLink) {
        const source = originals.has("errorHref") ? originals.get("errorHref") : errorLink.getAttribute("href");
        originals.set("errorHref", source);
        errorLink.setAttribute("href", api.reportHref(source, language));
      }
      const structured = doc.getElementById("kb-structured-data");
      if (structured) {
        if (!originals.has("jsonld")) originals.set("jsonld", structured.textContent);
        try { structured.textContent = JSON.stringify(localize(JSON.parse(originals.get("jsonld")))); } catch { /* Retain source data. */ }
      }
      for (const selector of ["title", 'meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector); if (!element) continue;
        const source = originals.has(selector) ? originals.get(selector) : (selector === "title" ? element.textContent : element.content);
        originals.set(selector, source);
        const value = api.translate(page, source, language) ?? source;
        if (selector === "title") element.textContent = value; else element.content = value;
      }
    } finally { rendering = false; }
  }
  function localize(value) {
    if (typeof value === "string") return api.translate(page, value, language) ?? value;
    if (Array.isArray(value)) return value.map(localize);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item)]));
    return value;
  }
  function choose(next) { language = api.supported.includes(next) ? next : "hu"; render(); }
  doc.addEventListener("kb:language-changed", event => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get?.() || "hu");
  new root.MutationObserver(changes => { if (changes.some(change => change.type === "childList" || change.type === "characterData")) render(); }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const page = "gumi-meret-kalkulator";
  const entries = [
    ["hu-HU","en-GB","de-DE"],
    ["Gumiméret váltó kalkulátor – váltóméret és kerékátmérő","Tyre Size Calculator – Alternative Sizes and Wheel Diameter","Reifengrößenrechner – Alternativgrößen und Raddurchmesser"],
    ["Gumiméret váltó kalkulátor két abroncsméret összehasonlításához. Nézd meg a kerékátmérőt, oldalfalat, százalékos eltérést és becsült sebességhatást.","Compare two tyre sizes by wheel diameter, sidewall height, percentage difference and estimated speedometer effect.","Vergleiche zwei Reifengrößen anhand von Raddurchmesser, Flankenhöhe, prozentualer Abweichung und geschätzter Tachoänderung."],
    ["Gumiméret váltó kalkulátor","Tyre Size Calculator","Reifengrößenrechner"],
    ["Hasonlíts össze két gumiméretet átmérő és eltérés alapján.","Compare two tyre sizes by diameter and difference.","Vergleiche zwei Reifengrößen anhand von Durchmesser und Abweichung."],
    ["Autó és közlekedés kalkulátorok","Car and transport calculators","Rechner für Auto und Verkehr"],
    ["Főoldal","Home","Startseite"],["Autó & közlekedés","Cars & transport","Auto & Verkehr"],["Hirdetés","Advertisement","Anzeige"],
    ["Hasonlíts össze két gumiméretet, és ellenőrizd a kerékátmérő és a sebesség becsült eltérését.","Compare two tyre sizes and check the estimated difference in wheel diameter and road speed.","Vergleiche zwei Reifengrößen und prüfe die geschätzte Abweichung bei Raddurchmesser und Fahrgeschwindigkeit."],
    ["Gumiméret-váltó és sebességeltérés","Tyre size and speed difference","Reifengröße und Geschwindigkeitsabweichung"],
    ["A mezők tájékoztató tervezésre valók; hivatalos, gyártói vagy szolgáltatói adat esetén mindig azt használd.","These fields are for planning estimates. Use official, manufacturer or provider figures when available.","Diese Eingaben dienen der Planung. Nutze verfügbare offizielle Angaben sowie Daten des Herstellers oder Anbieters."],
    ["Régi szélesség (mm)","Current tyre width (mm)","Breite des bisherigen Reifens (mm)"],["Régi oldalfal (%)","Current aspect ratio (%)","Querschnitt des bisherigen Reifens (%)"],["Régi felni (inch)","Current rim diameter (inches)","Bisheriger Felgendurchmesser (Zoll)"],
    ["Új szélesség (mm)","New tyre width (mm)","Breite des neuen Reifens (mm)"],["Új oldalfal (%)","New aspect ratio (%)","Querschnitt des neuen Reifens (%)"],["Új felni (inch)","New rim diameter (inches)","Neuer Felgendurchmesser (Zoll)"],
    ["Műszer szerinti sebesség","Indicated speed","Angezeigte Geschwindigkeit"],["Számítás","Calculate","Berechnen"],
    ["Régi átmérő","Current diameter","Bisheriger Durchmesser"],["Új átmérő","New diameter","Neuer Durchmesser"],["Átmérőeltérés","Diameter difference","Durchmesserabweichung"],["Elméleti sebesség a geometriai arány alapján","Estimated actual speed from the geometric ratio","Geschätzte tatsächliche Geschwindigkeit nach dem geometrischen Verhältnis"],["Méreteltérés jelzés","Size difference assessment","Bewertung der Größenabweichung"],
    ["kis geometriai eltérés; a gyártói engedélyezést ettől még ellenőrizd","small geometric difference; still check the manufacturer's approved sizes","geringe geometrische Abweichung; prüfe trotzdem die vom Hersteller freigegebenen Größen"],
    ["nagyobb geometriai eltérés; ellenőrizd a gyártói engedélyezést","larger geometric difference; check the manufacturer's approved sizes","größere geometrische Abweichung; prüfe die vom Hersteller freigegebenen Größen"],
    ["Add meg az adatokat.","Enter the values.","Gib die Werte ein."],["Ellenőrizd a kötelező mezőket és az értékhatárokat.","Check the required fields and allowed ranges.","Prüfe die Pflichtfelder und zulässigen Wertebereiche."],["A megadott adatokból nem számítható véges eredmény.","These values do not produce a finite result.","Aus diesen Werten lässt sich kein endliches Ergebnis berechnen."],["Hibás adat.","Invalid input.","Ungültige Eingabe."],
    ["Hasznos volt ez a kalkulátor?","Was this calculator useful?","War dieser Rechner hilfreich?"],["Ne keresd újra. Mentsd le. Használd.","Don't search again. Save it. Use it.","Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.","Save Kalkulátor Bázis to return to this calculation in one click — or share it with someone who might find it useful.","Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren – oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek","Bookmarking, installation and sharing actions","Aktionen zum Speichern, Installieren und Teilen"],["Könyvjelzőzöm","Bookmark","Lesezeichen"],["Telepítem","Install","Installieren"],["Megosztom","Share","Teilen"],["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.","Open your browser menu and look for Bookmark, Favorites or Save.","Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],["Másold ki ezt a hivatkozást, és küldd tovább.","Copy this link and share it.","Kopiere diesen Link und teile ihn."],
    ["Mit számol a gumiméret-váltó?","What does the tyre size calculator calculate?","Was berechnet der Reifengrößenrechner?"],
    ["A kalkulátor két abroncsméret elméleti külső átmérőjét hasonlítja össze, és százalékban megmutatja az eltérést. Ez segít felmérni, hogyan változhat a gördülési kerület, a hasmagasság és a sebességmérő jelzése egy másik méretre váltáskor.","The calculator compares the theoretical outer diameters of two tyre sizes and shows the percentage difference. This helps estimate changes in rolling circumference, ground clearance and the speedometer reading when switching sizes.","Der Rechner vergleicht die theoretischen Außendurchmesser zweier Reifengrößen und zeigt die prozentuale Abweichung. So lassen sich Änderungen bei Abrollumfang, Bodenfreiheit und Tachoanzeige beim Größenwechsel abschätzen."],
    ["Az eredmény önmagában nem jelenti azt, hogy az új méret felszerelhető, biztonságos vagy jogszerű. A jármű gyártói méretlistája és műszaki előírásai az elsődlegesek.","The result alone does not mean that the new size can be fitted safely or legally. The vehicle manufacturer's approved sizes and technical specifications take priority.","Das Ergebnis allein bedeutet nicht, dass die neue Größe montiert werden darf, sicher oder zulässig ist. Maßgeblich sind die freigegebenen Größen und technischen Vorgaben des Fahrzeugherstellers."],
    ["Hogyan olvasd a 205/55 R16 jelölést?","How do you read 205/55 R16?","Wie liest man die Angabe 205/55 R16?"], [": a gumi névleges szélessége milliméterben;",": nominal tyre width in millimetres;",": nominelle Reifenbreite in Millimetern;"],[": az oldalfal magassága a szélesség százalékában;",": sidewall height as a percentage of the width;",": Flankenhöhe als Prozentsatz der Breite;"],["R","R","R"],[": radiál szerkezet;",": radial construction;",": Radialbauweise;"],[": a felni átmérője collban.",": rim diameter in inches.",": Felgendurchmesser in Zoll."],
    ["Az elméleti oldalfalmagasság 205 × 0,55 = 112,75 mm. A teljes kerékátmérő ehhez hozzáadja a 16 colos felni 406,4 mm-es átmérőjét és a két oldalfalat.","The theoretical sidewall height is 205 × 0.55 = 112.75 mm. The total wheel diameter adds both sidewalls and the 406.4 mm diameter of the 16-inch rim.","Die theoretische Flankenhöhe beträgt 205 × 0,55 = 112,75 mm. Zum gesamten Raddurchmesser kommen beide Flanken und der Durchmesser der 16-Zoll-Felge von 406,4 mm hinzu."],
    ["Példa","Example","Beispiel"],["A 205/55 R16 elméleti átmérője körülbelül 631,9 mm. A 225/45 R17 méreté körülbelül 634,3 mm, vagyis az eltérés nagyjából +0,38%.","The theoretical diameter of 205/55 R16 is about 631.9 mm. For 225/45 R17 it is about 634.3 mm, a difference of roughly +0.38%.","Der theoretische Durchmesser von 205/55 R16 beträgt etwa 631,9 mm. Bei 225/45 R17 sind es etwa 634,3 mm, also rund +0,38 % Abweichung."],
    ["Mit jelent az átmérő eltérése?","What does the diameter difference mean?","Was bedeutet die Durchmesserabweichung?"],["Nagyobb külső átmérőnél egy kerékfordulat alatt nagyobb távolságot tesz meg az autó. Emiatt módosulhat a sebességmérő és a kilométer-számláló eltérése. Kisebb átmérőnél az ellenkező irányú hatás várható.","With a larger outer diameter, the car travels farther per wheel revolution. This can change the speedometer and odometer readings. A smaller diameter has the opposite effect.","Mit einem größeren Außendurchmesser legt das Auto pro Radumdrehung eine längere Strecke zurück. Dadurch können sich Tacho- und Kilometerzähleranzeige verändern. Bei kleinerem Durchmesser ist der gegenteilige Effekt zu erwarten."],
    ["Miért nem elég csak a százalékot nézni?","Why is the percentage alone not enough?","Warum reicht die Prozentabweichung allein nicht aus?"],["A valódi kompatibilitást más méretek is meghatározzák. A felni szélessége és ET-száma befolyásolja, mennyire kerül beljebb vagy kijjebb a kerék; a túl széles gumi beleérhet a futóműbe vagy a kerékjáratba. A terhelési és sebességindexnek szintén meg kell felelnie az autó követelményeinek.","Other dimensions also determine compatibility. Rim width and offset affect how far inward or outward the wheel sits, and an overly wide tyre may contact the suspension or wheel arch. Load and speed ratings must also meet the vehicle's requirements.","Weitere Maße bestimmen die tatsächliche Kompatibilität. Felgenbreite und Einpresstiefe beeinflussen, wie weit das Rad innen oder außen steht; ein zu breiter Reifen kann Fahrwerk oder Radhaus berühren. Auch Tragfähigkeits- und Geschwindigkeitsindex müssen den Fahrzeuganforderungen entsprechen."],
    ["Felniátmérő és oldalfal kapcsolata","Rim diameter and sidewall height","Zusammenhang zwischen Felgendurchmesser und Flankenhöhe"],["Nagyobb felninél gyakran alacsonyabb profilú abronccsal tartják közel az eredeti külső átmérőt. Ez változtathat a komforton és a sérülékenységen is: a kisebb oldalfal általában kevesebbet tud elnyelni az úthibákból.","A lower-profile tyre is often used with a larger rim to keep the original outer diameter. This can affect comfort and vulnerability to damage because a shorter sidewall usually absorbs less of the road's unevenness.","Bei einer größeren Felge hält ein Reifen mit niedrigerem Querschnitt den ursprünglichen Außendurchmesser oft annähernd ein. Das kann Komfort und Beschädigungsrisiko verändern, da eine niedrigere Flanke Fahrbahnunebenheiten meist weniger abfedert."],
    ["Valós méret és elméleti méret","Actual size and theoretical size","Tatsächliche und theoretische Größe"],["Két azonos névleges méretű gumi valós átmérője sem feltétlenül teljesen azonos. Gyártási különbség, mintázat, kopottság, guminyomás és terhelés is okozhat eltérést. A kalkulátor ezért geometriai becslést ad.","Even tyres with the same nominal size may have slightly different actual diameters. Manufacturing differences, tread pattern, wear, pressure and load can all affect the result, so the calculator provides a geometric estimate.","Auch Reifen derselben Nenngröße müssen nicht exakt denselben tatsächlichen Durchmesser haben. Fertigung, Profil, Verschleiß, Reifendruck und Belastung können Abweichungen verursachen. Der Rechner liefert daher eine geometrische Schätzung."],
    ["Mit ellenőrizz csere előtt?","What should you check before changing sizes?","Was solltest du vor einem Größenwechsel prüfen?"],["a jármű kézikönyvében vagy gyártói dokumentációban engedélyezett méreteket;","sizes approved in the vehicle manual or manufacturer documentation;","die im Fahrzeughandbuch oder in Herstellerunterlagen freigegebenen Größen;"],["felni szélességet és ET-számot;","rim width and offset;","Felgenbreite und Einpresstiefe;"],["terhelési indexet;","load index;","Tragfähigkeitsindex;"],["sebességindexet;","speed rating;","Geschwindigkeitsindex;"],["féknyereg és kerékjárat helyigényét;","clearance around the brake caliper and wheel arch;","Freiraum an Bremssattel und Radhaus;"],["az adott ország műszaki és hatósági előírásait.","the applicable technical and legal requirements in your country.","die technischen und behördlichen Vorschriften des jeweiligen Landes."],
    ["Gyakori hibák","Common mistakes","Häufige Fehler"],["a profilértéket milliméternek tekintik százalék helyett;","treating the aspect ratio as millimetres instead of a percentage;","den Querschnittswert als Millimeter statt als Prozentwert zu lesen;"],["a felni collértékét milliméterként adják meg;","entering the rim size in millimetres instead of inches;","den Zollwert der Felge als Millimeter einzugeben;"],["csak a külső átmérőt nézik;","checking only the outer diameter;","nur den Außendurchmesser zu prüfen;"],["figyelmen kívül hagyják a terhelési és sebességindexet;","ignoring the load and speed ratings;","Tragfähigkeits- und Geschwindigkeitsindex zu ignorieren;"],["a kalkulátor eredményét automatikus engedélynek tekintik.","treating the calculator result as automatic approval.","das Rechnerergebnis als automatische Freigabe zu verstehen."],
    ["Gyakori kérdések","Frequently asked questions","Häufige Fragen"],["Mekkora eltérés elfogadható?","What difference is acceptable?","Welche Abweichung ist zulässig?"],["Erre nem érdemes általános internetes ökölszabályt hivatalos határként használni. Elsőként mindig a jármű gyártója által engedélyezett méreteket ellenőrizd.","Do not treat a general rule of thumb from the internet as an official limit. Always check the sizes approved by the vehicle manufacturer first.","Eine allgemeine Faustregel aus dem Internet ist keine offizielle Grenze. Prüfe immer zuerst die vom Fahrzeughersteller freigegebenen Größen."],
    ["Az ET-számot is vizsgálja?","Does it check wheel offset?","Prüft der Rechner auch die Einpresstiefe?"],["Nem. A kalkulátor az abroncs külső átmérőjével foglalkozik, a felni pozícióját nem számolja.","No. The calculator covers the tyre's outer diameter and does not calculate the wheel's position.","Nein. Der Rechner betrachtet den Außendurchmesser des Reifens und berechnet nicht die Position der Felge."],
    ["A sebességmérő pontos hibáját megkapom?","Does it give the exact speedometer error?","Erhalte ich die genaue Tachoabweichung?"],["Csak közelítő geometriai hatást. A műszer saját gyári eltérése és a gumi valós gördülési sugara is számít.","It gives only an approximate geometric effect. The speedometer's factory tolerance and the tyre's actual rolling radius also matter.","Nur eine näherungsweise geometrische Auswirkung. Auch die werkseitige Tachoabweichung und der tatsächliche Abrollradius des Reifens spielen eine Rolle."],
    ["Téli és nyári méretet is összehasonlíthatok?","Can I compare winter and summer tyre sizes?","Kann ich Winter- und Sommerreifengrößen vergleichen?"],["Igen, de mindkettőnél külön ellenőrizd, hogy az autóhoz engedélyezett-e.","Yes, but check separately that each size is approved for the car.","Ja, aber prüfe für beide Größen separat, ob sie für das Fahrzeug freigegeben sind."],
    ["Szélesebb gumi mindig jobb tapadást ad?","Does a wider tyre always provide more grip?","Bietet ein breiterer Reifen immer mehr Grip?"],["Nem feltétlenül. Útfelület, keverék, hőmérséklet, mintázat és terhelés is számít, ezért pusztán a szélességből nem lehet biztos következtetést levonni.","Not necessarily. Road surface, compound, temperature, tread and load also matter, so width alone does not determine grip.","Nicht unbedingt. Fahrbahn, Mischung, Temperatur, Profil und Belastung spielen ebenfalls eine Rolle; aus der Breite allein lässt sich der Grip nicht sicher ableiten."],
    ["Kapcsolódó kalkulátorok","Related calculators","Verwandte Rechner"],["Sebesség átváltó","Speed Converter","Geschwindigkeitsumrechner"],["Autófogyasztás","Fuel Consumption","Kraftstoffverbrauch"],["Hatótáv","Driving Range","Reichweite"],["Éves autóköltség","Annual Car Costs","Jährliche Autokosten"],["Utolsó tartalmi frissítés:","Content last reviewed:","Inhalt zuletzt geprüft:"],["2026. augusztus 8.","8 August 2026","8. August 2026"],
    ["Hitelesség és számítási korlátok","Reliability and calculation limits","Verlässlichkeit und Grenzen der Berechnung"],["Az eredmény a megadott fogyasztási, ár- és útadatokból készülő becslés. A tényleges értéket a vezetési körülmények, a jármű állapota és a díjak változása is módosíthatja.","The result is an estimate based on the values entered. Actual tyre dimensions, vehicle geometry, loading and approved specifications can change whether a size is suitable.","Das Ergebnis ist eine Schätzung anhand der eingegebenen Werte. Tatsächliche Reifenmaße, Fahrzeuggeometrie, Belastung und Freigaben bestimmen mit, ob eine Größe geeignet ist."],["A számítások módszertana és minőségbiztosítása","Calculation methods and quality assurance","Berechnungsmethoden und Qualitätssicherung"],["Hibát találtál? Jelezd nekünk.","Found an error? Let us know.","Fehler gefunden? Melde ihn uns."],
    ["Geometria után jön a kompatibilitás","Geometry is only the first compatibility check","Nach der Geometrie folgt die Kompatibilitätsprüfung"],["A hasonló külső átmérő még nem jelenti azt, hogy a kerék megfelelő","A similar outer diameter does not guarantee that the wheel is suitable","Ein ähnlicher Außendurchmesser bedeutet noch nicht, dass das Rad geeignet ist"],["Felni szélessége és ET","Rim width and offset","Felgenbreite und Einpresstiefe"],["A gumi és kerék helyzete a futóműhöz és sárvédőhöz képest nem derül ki pusztán az átmérőből.","Diameter alone does not show how the tyre and wheel sit relative to the suspension and bodywork.","Der Durchmesser allein zeigt nicht, wie Reifen und Rad zu Fahrwerk und Karosserie stehen."],["Terhelési és sebességindex","Load and speed ratings","Tragfähigkeits- und Geschwindigkeitsindex"],["A geometriailag hasonló abroncs terhelhetősége vagy sebességbesorolása eltérhet az előírttól.","A geometrically similar tyre may have a load capacity or speed rating that does not meet the specification.","Ein geometrisch ähnlicher Reifen kann bei Tragfähigkeit oder Geschwindigkeitsfreigabe von der Vorgabe abweichen."],["Kerékjárati hely","Wheel-arch clearance","Freiraum im Radhaus"],["Kormányelfordításnál, rugózásnál és terhelésnél is maradnia kell megfelelő helynek.","There must be sufficient clearance when steering, during suspension travel and under load.","Beim Lenken, Einfedern und unter Last muss genügend Freiraum bleiben."],["Gyártói engedélyezés","Manufacturer approval","Herstellerfreigabe"],["A jármű kézikönyve, adattáblája és jóváhagyott méretei elsődlegesek; a kalkulátor csak geometriai összevetést ad.","The vehicle manual, data plate and approved sizes take priority; the calculator provides only a geometric comparison.","Fahrzeughandbuch, Typenschild und freigegebene Größen sind maßgeblich; der Rechner liefert nur einen geometrischen Vergleich."],
    ["Hogyan hasonlítja össze a két gumiméretet?","How does the calculator compare the two tyre sizes?","Wie vergleicht der Rechner die beiden Reifengrößen?"],["A szélességből, oldalfal-arányból és felniátmérőből kiszámolja mindkét kerék közelítő külső átmérőjét és gördülési kerületét, majd százalékosan összeveti őket. A megadott műszer szerinti sebességből a geometriai eltérés alapján korrigált értéket is becsül.","It uses width, aspect ratio and rim diameter to estimate each wheel's outer diameter and rolling circumference, then compares them as a percentage. It also adjusts the entered indicated speed using the geometric difference.","Aus Breite, Querschnitt und Felgendurchmesser schätzt der Rechner Außendurchmesser und Abrollumfang beider Räder und vergleicht sie prozentual. Aus der eingegebenen Tachoanzeige schätzt er außerdem einen anhand der Geometrie korrigierten Wert."],["Ellenőrzési alap:","Check before fitting:","Vor der Montage prüfen:"],["A geometriai egyezés nem jelent automatikus műszaki megfelelőséget. Csak a jármű gyártója, jóváhagyási dokumentuma vagy hiteles műszaki adat alapján engedélyezett méretet használj.","A geometric match does not automatically mean technical compatibility. Use only a size approved by the vehicle manufacturer, approval documents or reliable technical data.","Eine geometrische Übereinstimmung bedeutet nicht automatisch technische Eignung. Verwende nur Größen, die laut Fahrzeughersteller, Genehmigungsunterlagen oder verlässlichen technischen Daten freigegeben sind."],["Utolsó módszertani ellenőrzés:","Methodology last reviewed:","Methodik zuletzt geprüft:"],["2026. szeptember 16.","16 September 2026","16. September 2026"]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)];
    if (pair) return pair[language === "en" ? 0 : 1];
    const match = /^(-?\d[\d\s\u00a0]*(?:,\d+)?)\s?(mm|km\/h|%)$/u.exec(normalized);
    if (match) {
      const number = Number(match[1].replace(/[\s\u00a0]/gu, "").replace(",", "."));
      const formatted = new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", { maximumFractionDigits: 2 }).format(number);
      if (match[2] === "%") return formatted + (language === "de" ? " %" : "%");
      return formatted + " " + match[2];
    }
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", language === "en" ? "Error report – Tyre Size Calculator" : "Fehlermeldung – Reifengrößenrechner");
    if (url.searchParams.has("body")) url.searchParams.set("body", language === "en"
      ? "Calculator: Tyre Size Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/gumi-meret-kalkulator.html\n\nBrief description of the issue:\n"
      : "Rechner: Reifengrößenrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/gumi-meret-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});
