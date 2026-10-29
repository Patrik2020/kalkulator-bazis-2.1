/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, pageKey = "alvasciklus-kalkulator";
  const main = doc.querySelector('main[data-simple-calc="alvasciklus-kalkulator"]');
  if (!main) return;
  let language = "hu", rendering = false;
  const nodeStates = new WeakMap(), attributeStates = new WeakMap(), originals = new Map();
  function changeText(node) {
    const current=node.nodeValue, state=nodeStates.get(node);
    const source=state&&state.rendered===current?state.source:current;
    const parts=/^(\s*)([\s\S]*?)(\s*)$/u.exec(source);
    if(!parts||!parts[2])return;
    const value=api.translate(pageKey,parts[2],language);
    const rendered=parts[1]+(value??parts[2])+parts[3];
    if(rendered!==current)node.nodeValue=rendered;
    if(rendered!==source||state)nodeStates.set(node,{source,rendered});
  }
  function render(){
    if(rendering)return;
    rendering=true;
    try{
      const walker=doc.createTreeWalker(main,root.NodeFilter.SHOW_TEXT),nodes=[];
      while(walker.nextNode())nodes.push(walker.currentNode);
      for(const node of nodes){
        if(node.parentElement?.closest("script,style,textarea,pre,code,[contenteditable],[translate='no']"))continue;
        changeText(node);
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach(element=>{
        if(element.closest("[contenteditable],[translate='no']"))return;
        let state=attributeStates.get(element);if(!state){state=new Map();attributeStates.set(element,state);}
        for(const name of ["aria-label","placeholder","title"]){
          if(!element.hasAttribute(name))continue;
          const current=element.getAttribute(name),previous=state.get(name);
          const source=previous&&previous.rendered===current?previous.source:current;
          const value=api.translate(pageKey,source,language)??source;
          if(value!==current)element.setAttribute(name,value);
          state.set(name,{source,rendered:value});
        }
      });
      for(const selector of ["title",'meta[name="description"]','meta[property="og:title"]','meta[property="og:description"]','meta[name="twitter:title"]','meta[name="twitter:description"]']){
        const element=doc.querySelector(selector);if(!element)continue;
        const key=selector==="title"?"title":selector+":"+(element.getAttribute("name")||element.getAttribute("property")||"");
        if(!originals.has(key))originals.set(key,selector==="title"?element.textContent:element.getAttribute("content"));
        const source=originals.get(key),value=api.translate(pageKey,source,language)??source;
        if(selector==="title")element.textContent=value;else element.setAttribute("content",value);
      }
    }finally{rendering=false;}
  }
  doc.addEventListener("kb:language-changed",event=>{language=api.supported.includes(event.detail?.language)?event.detail.language:"hu";render();});
  language=api.supported.includes(root.KB_SITE_LANGUAGE?.get?.())?root.KB_SITE_LANGUAGE.get():"hu";
  render();
  new root.MutationObserver(changes=>{if(changes.some(change=>change.type==="childList"||change.type==="characterData"))render();}).observe(main,{childList:true,characterData:true,subtree:true});
})(typeof window==="undefined"?null:window,function(){
  "use strict";
  const pageKey="alvasciklus-kalkulator";
  const dictionary=Object.freeze({
    "Alvásciklus kalkulátor":["Sleep Cycle Calculator","Schlafzyklus-Rechner"],
    "Alvásciklus kalkulátor | Lefekvési és ébredési idő":["Sleep Cycle Calculator | Bedtime and Wake-up Time","Schlafzyklus-Rechner | Schlafens- und Aufwachzeit"],
    "Alvásciklus kalkulátor tervezett lefekvéshez vagy ébredéshez. Számolj 90 perces ciklusokkal és becsült elalvási idővel.":["Explore possible bedtimes or wake-up times using 90-minute example cycles and an estimated time to fall asleep.","Finde mögliche Schlafens- oder Aufwachzeiten anhand von 90-minütigen Beispielzyklen und einer geschätzten Einschlafzeit."],
    "Nézz meg 90 perces időzítési példaforgatókönyveket; a ciklushossz nem rögzített biológiai menetrend.":["Explore timing examples based on 90-minute cycles; cycle length is not a fixed biological schedule.","Sieh dir Zeitbeispiele mit 90-minütigen Zyklen an. Die Zyklusdauer ist kein fester biologischer Zeitplan."],
    "Felkelés órája":["Wake-up hour","Stunde des Aufwachens"],
    "Felkelés perce":["Wake-up minute","Minute des Aufwachens"],
    "Eredmény:":["Result:","Ergebnis:"],
    "Példa: 6 × 90 perc + 15 perc elalvás:":["Example: 6 × 90 minutes + 15 minutes to fall asleep:","Beispiel: 6 × 90 Minuten + 15 Minuten zum Einschlafen:"],
    "Példa: 5 × 90 perc + 15 perc elalvás:":["Example: 5 × 90 minutes + 15 minutes to fall asleep:","Beispiel: 5 × 90 Minuten + 15 Minuten zum Einschlafen:"],
    "Rövid példa: 4 × 90 perc + 15 perc elalvás:":["Short example: 4 × 90 minutes + 15 minutes to fall asleep:","Kurzes Beispiel: 4 × 90 Minuten + 15 Minuten zum Einschlafen:"],
    "Alvásidő-megjegyzés:":["Sleep-duration note:","Hinweis zur Schlafdauer:"],
    "A 4 × 90 perces példa 6 óra alvás, ami a legtöbb felnőtt számára az általános ajánlott időtartam alatt van.":["The 4 × 90-minute example provides 6 hours of sleep, below the general recommendation for most adults.","Das Beispiel mit 4 × 90 Minuten ergibt 6 Stunden Schlaf und liegt damit unter der allgemeinen Empfehlung für die meisten Erwachsenen."],
    "Hasznos volt ez a kalkulátor?":["Was this calculator useful?","War dieser Rechner hilfreich?"],
    "Ne keresd újra. Mentsd le. Használd.":["Don't search again. Save it. Use it.","Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.":["Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who might find it useful.","Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    "Mentési, telepítési és megosztási műveletek":["Bookmark, install and sharing options","Optionen zum Speichern, Installieren und Teilen"],
    "Könyvjelzőzöm":["Bookmark","Lesezeichen"],"Telepítem":["Install","Installieren"],"Megosztom":["Share","Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.":["Open your browser menu and look for Bookmark, Favorites or Save.","Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    "Másold ki ezt a hivatkozást, és küldd tovább.":["Copy this link and share it.","Kopiere diesen Link und teile ihn."],
    "Mit számol az alvásciklus kalkulátor?":["What does the sleep cycle calculator estimate?","Was schätzt der Schlafzyklus-Rechner?"],
    "A kalkulátor a tervezett ébredési időből visszafelé számol négy, öt vagy hat":["The calculator counts back from your planned wake-up time using four, five or six","Der Rechner zählt von deiner geplanten Aufwachzeit aus vier, fünf oder sechs"],
    "90 perces példaciklust":["90-minute example cycles","90-minütige Beispielzyklen"],
    ", és 15 perc becsült elalvási időt is hozzáad. A négyciklusos példa 6 óra alvást jelent, ami a legtöbb felnőtt általános alvásidő-ajánlása alatt van; ezért ez nem ajánlás, csak időzítési példa.":[", and adds an estimated 15 minutes to fall asleep. The four-cycle example provides 6 hours of sleep, below the general recommendation for most adults; it is a timing example, not a recommendation.",", und addiert geschätzte 15 Minuten zum Einschlafen. Das Beispiel mit vier Zyklen ergibt 6 Stunden Schlaf und liegt unter der allgemeinen Empfehlung für die meisten Erwachsenen. Es ist ein Zeitbeispiel, keine Empfehlung."],
    "Fontos, hogy a 90 perc nem biológiai szabály. Az NHLBI/NIH összefoglalója szerint az alvási ciklus jellemzően 80–100 percenként indul újra, és a ciklusok ugyanazon éjszakán belül is változhatnak. A kalkulátor ezért nem azt mondja meg, mikor fogsz biztosan könnyen felébredni, hanem egy egyszerű időtervezési modellt ad.":["A 90-minute cycle is not a biological rule. The NHLBI/NIH explains that sleep cycles typically restart every 80–100 minutes and can vary during the same night. The calculator therefore cannot tell you when you will definitely wake up easily; it offers a simple timing model.", "90 Minuten sind keine biologische Regel. Laut NHLBI/NIH beginnt ein Schlafzyklus typischerweise alle 80–100 Minuten neu; außerdem können die Zyklen innerhalb derselben Nacht variieren. Der Rechner sagt daher nicht voraus, wann du sicher leicht aufwachst, sondern bietet ein einfaches Zeitplanungsmodell."],
    "Hogyan működik a számítás?":["How does the calculation work?","Wie funktioniert die Berechnung?"],
    "Lefekvés = ébredés − ciklusok × 90 perc − 15 perc.":["Bedtime = wake-up time − cycles × 90 minutes − 15 minutes.","Schlafenszeit = Aufwachzeit − Zyklen × 90 Minuten − 15 Minuten."],
    "Hat ciklus 9 óra ciklusidőt, öt ciklus 7,5 órát, négy ciklus 6 órát jelent, ehhez jön a feltételezett elalvási idő.":["Six cycles amount to 9 hours, five to 7.5 hours and four to 6 hours, plus the assumed time to fall asleep.","Sechs Zyklen entsprechen 9 Stunden, fünf 7,5 Stunden und vier 6 Stunden; hinzu kommt die angenommene Einschlafzeit."],
    "Példa 7:00-s ébredéshez":["Example for a 7:00 wake-up","Beispiel für ein Aufwachen um 7:00 Uhr"],
    "Hat ciklushoz körülbelül 21:45, öt ciklushoz 23:15, négy ciklushoz 00:45 lefekvési idő adódik. Ha nálad az elalvás rendszeresen 30–40 perc, a kalkulátor eredményét ehhez érdemes igazítani.":["For six cycles, the suggested bedtime is about 21:45; for five, 23:15; and for four, 00:45. If you regularly take 30–40 minutes to fall asleep, adjust the result accordingly.","Bei sechs Zyklen ergibt sich eine Schlafenszeit von etwa 21:45 Uhr, bei fünf 23:15 Uhr und bei vier 00:45 Uhr. Wenn du regelmäßig 30–40 Minuten zum Einschlafen brauchst, solltest du das Ergebnis entsprechend anpassen."],
    "Mi történik egy alvásciklus alatt?":["What happens during a sleep cycle?","Was geschieht während eines Schlafzyklus?"],
    "Az alvás több szakaszból épül fel, és az éjszaka során a könnyebb, mélyebb és REM-szakaszok aránya folyamatosan változik. Emiatt nem minden ciklus ugyanolyan hosszú, és nem minden ébredés lesz ugyanolyan könnyű még akkor sem, ha papíron „ciklushatárra” esik.":["Sleep consists of several stages, and the balance of light, deep and REM sleep changes throughout the night. That is why cycles do not all last the same amount of time, and waking is not always equally easy—even if the time falls on a theoretical cycle boundary.","Der Schlaf besteht aus mehreren Phasen. Das Verhältnis von Leicht-, Tief- und REM-Schlaf verändert sich im Laufe der Nacht. Deshalb dauern nicht alle Zyklen gleich lang und das Aufwachen fällt nicht immer gleich leicht – selbst wenn die Uhrzeit rechnerisch auf eine Zyklusgrenze fällt."],
    "Mi fontosabb a ciklusoknál?":["What matters more than cycles?","Was ist wichtiger als die Zyklen?"],
    "A megfelelő alvásmennyiség, a rendszeres lefekvési és ébredési idő, a sötét és csendes környezet, valamint az esti stimulánsok és erős fény csökkentése általában többet számít, mint az, hogy percre pontosan egy 90 perces blokk végére időzítsd az ébresztőt. A kalkulátor nem használható tartós alváshiány „optimalizálására”.":["Getting enough sleep, keeping regular bedtimes and wake-up times, sleeping in a dark and quiet environment, and reducing evening stimulants and bright light generally matter more than timing an alarm to the exact end of a 90-minute block. Do not use this calculator to “optimise” chronic sleep deprivation.","Ausreichend Schlaf, regelmäßige Schlafens- und Aufwachzeiten, eine dunkle und ruhige Umgebung sowie weniger anregende Stoffe und helles Licht am Abend sind meist wichtiger, als den Wecker genau auf das Ende eines 90-Minuten-Blocks zu legen. Dieser Rechner eignet sich nicht dazu, chronischen Schlafmangel zu „optimieren“."],
    "Mikor lehet hasznos?":["When might it be useful?","Wann kann der Rechner hilfreich sein?"],
    "ha egy fix ébredési időhöz szeretnél több lehetséges lefekvési időt látni;":["if you want to compare possible bedtimes for a fixed wake-up time;","wenn du mögliche Schlafenszeiten für eine feste Aufwachzeit vergleichen möchtest;"],
    "ha összehasonlítanád, mennyit jelent 4, 5 vagy 6 ciklus időben;":["if you want to compare how much time 4, 5 or 6 cycles represent;","wenn du vergleichen möchtest, wie viel Zeit 4, 5 oder 6 Zyklen bedeuten;"],
    "ha műszak vagy korai kelés előtt szeretnéd tudatosabban megtervezni az estét;":["if you want to plan your evening more deliberately before a shift or an early start;","wenn du deinen Abend vor einer Schicht oder einem frühen Start bewusster planen möchtest;"],
    "ha szeretnéd elkerülni, hogy a „majd valamikor lefekszem” helyett konkrét időpontod legyen.":["if you would rather choose a specific bedtime than leave it at “I'll go to bed sometime”.","wenn du statt „ich gehe irgendwann schlafen“ lieber eine konkrete Schlafenszeit festlegen möchtest."],
    "Mire nem alkalmas?":["What is it not suitable for?","Wofür ist der Rechner nicht geeignet?"],
    "Nem diagnosztizál alvászavart, nem méri az alvásminőséget, és nem tudja figyelembe venni az egyéni ciklushosszt. Tartós nappali álmosság, erős horkolás, légzéskimaradás, gyakori éjszakai ébredés vagy elhúzódó elalvási probléma esetén érdemes egészségügyi szakemberhez fordulni.":["It does not diagnose sleep disorders, measure sleep quality or account for your individual cycle length. If you experience persistent daytime sleepiness, loud snoring, pauses in breathing, frequent night waking or prolonged difficulty falling asleep, consider speaking with a healthcare professional.","Der Rechner diagnostiziert keine Schlafstörungen, misst nicht die Schlafqualität und berücksichtigt nicht deine individuelle Zyklusdauer. Bei anhaltender Tagesmüdigkeit, starkem Schnarchen, Atemaussetzern, häufigem nächtlichem Aufwachen oder anhaltenden Einschlafproblemen solltest du dich an eine medizinische Fachperson wenden."],
    "Gyakori hibák":["Common mistakes","Häufige Fehler"],
    "A számított időpontot percre pontos biológiai szabálynak tekintik.":["Treating the calculated time as a biologically exact rule.","Die berechnete Uhrzeit als biologisch exakte Regel zu betrachten."],
    "Nem számolnak a saját hosszabb elalvási idővel.":["Not allowing for their own longer time to fall asleep.","Die eigene längere Einschlafzeit nicht einzuplanen."],
    "A négy ciklust rendszeresen elegendőnek gondolják.":["Assuming four cycles are regularly enough.","Regelmäßig anzunehmen, vier Zyklen seien ausreichend."],
    "Hétköznap és hétvégén teljesen eltérő alvásritmust tartanak.":["Keeping completely different sleep schedules on weekdays and weekends.","Unter der Woche und am Wochenende völlig unterschiedliche Schlafrhythmen zu haben."],
    "Alvászavar tünetei mellett csak kalkulátorra hagyatkoznak.":["Relying on a calculator alone despite symptoms of a sleep disorder.","Sich trotz möglicher Symptome einer Schlafstörung allein auf einen Rechner zu verlassen."],
    "Gyakori kérdések":["Frequently asked questions","Häufige Fragen"],
    "Valóban 90 perc egy ciklus?":["Does a cycle really last 90 minutes?","Dauert ein Zyklus tatsächlich 90 Minuten?"],
    "Ez átlagos közelítés; egyéni és éjszakán belüli eltérés is lehet.":["It is an approximate average; individual cycles and cycles during one night can vary.","Das ist ein Näherungswert. Individuelle Zyklen und Zyklen innerhalb einer Nacht können abweichen."],
    "Gyerekekre is jó?":["Is it suitable for children too?","Ist der Rechner auch für Kinder geeignet?"],
    "A gyermekek alvásigénye életkorfüggő, ezért a felnőtt ciklusbecslés nem megfelelő irányelv.":["Children's sleep needs depend on age, so an adult cycle estimate is not an appropriate guideline for them.","Der Schlafbedarf von Kindern hängt vom Alter ab. Eine Schätzung für Erwachsene ist daher keine geeignete Orientierung für Kinder."],
    "Miért vagyok fáradt nyolc óra után?":["Why am I tired after eight hours?","Warum bin ich nach acht Stunden noch müde?"],
    "Az alvásminőség, stressz, betegségek, gyógyszerek vagy alvászavarok is okozhatják; az óraszám önmagában nem magyaráz mindent.":["Sleep quality, stress, illness, medication or sleep disorders can all play a part; the number of hours alone does not explain everything.","Schlafqualität, Stress, Erkrankungen, Medikamente oder Schlafstörungen können eine Rolle spielen. Die Stundenzahl allein erklärt nicht alles."],
    "Szundításhoz használható?":["Can I use it for a nap?","Kann ich den Rechner für einen Mittagsschlaf verwenden?"],
    "Tájékozódásra igen, de a rövid nappali alvás célja és hatása eltér az éjszakai alvástól.":["For general orientation, yes, but a short daytime nap has a different purpose and effect from a full night's sleep.","Zur Orientierung ja, aber ein kurzer Tagschlaf hat einen anderen Zweck und eine andere Wirkung als der Nachtschlaf."],
    "Mit tegyek, ha rendszeresen sokáig tart elaludni?":["What if it regularly takes me a long time to fall asleep?","Was kann ich tun, wenn ich regelmäßig lange zum Einschlafen brauche?"],
    "A számított 15 percet kezeld csak kiindulópontként, és a saját tapasztalatod szerint igazítsd. Tartós probléma esetén szakmai segítség indokolt lehet.":["Treat the estimated 15 minutes as a starting point and adjust it based on your experience. If the problem persists, professional support may be appropriate.","Betrachte die geschätzten 15 Minuten nur als Ausgangspunkt und passe sie an deine Erfahrung an. Bei anhaltenden Problemen kann fachliche Unterstützung sinnvoll sein."],
    "Forrás és módszertan":["Sources and methodology","Quellen und Methodik"],
    "A kalkulátor egyszerű 90 perces tervezési modellt használ, nem alvásdiagnosztikai algoritmust. A magyarázó tartalom általános alvásélettani ismeretekre és közegészségügyi alváshigiénés ajánlásokra épül.":["The calculator uses a simple 90-minute planning model, not a sleep-diagnostic algorithm. The explanatory content draws on general sleep science and public-health sleep-hygiene guidance.","Der Rechner verwendet ein einfaches 90-Minuten-Planungsmodell und keinen schlafdiagnostischen Algorithmus. Die Erläuterungen beruhen auf allgemeinen schlafphysiologischen Erkenntnissen und Empfehlungen zur Schlafhygiene im öffentlichen Gesundheitswesen."],
    "Kapcsolódó kalkulátorok":["Related calculators","Verwandte Rechner"],
    "BMR kalkulátor":["BMR calculator","BMR-Rechner"],"Pulzuszóna":["Heart rate zones","Pulszonen"],"Idő átváltó":["Time converter","Zeiteinheiten-Umrechner"],
    "Utolsó tartalmi frissítés:":["Last content update:","Letzte inhaltliche Aktualisierung:"],
    "2026. augusztus 8.":["8 August 2026","8. August 2026"],
    "Hitelesség és számítási korlátok":["Reliability and calculation limits","Zuverlässigkeit und Grenzen der Berechnung"],
    "Az eredmény általános tájékoztatást ad, nem diagnózis és nem helyettesít orvosi vizsgálatot vagy személyre szabott kezelési javaslatot.":["This result is for general information only. It is not a diagnosis and does not replace medical assessment or personalised treatment advice.","Das Ergebnis dient der allgemeinen Information. Es ist keine Diagnose und ersetzt weder eine ärztliche Untersuchung noch eine individuelle Behandlungsempfehlung."],
    "A számítások módszertana és minőségbiztosítása":["Calculation methodology and quality assurance","Berechnungsmethodik und Qualitätssicherung"],
    "Hibát találtál? Jelezd nekünk.":["Found an issue? Let us know.","Einen Fehler gefunden? Sag uns Bescheid."],
    "Alvásciklus – mítoszvédő":["Sleep-cycle reality check","Schlafzyklus-Mythencheck"],
    "A 90 perc nem menetrend":["90 minutes is not a schedule","90 Minuten sind kein fester Zeitplan"],
    "Az alvásciklus hossza emberenként és az éjszaka során is változhat. A kalkulátor 90 perces ciklusa ezért időzítési játék és tervezési segédlet, nem garancia arra, hogy egy adott percben könnyebb lesz felébredni.":["Sleep-cycle length varies from person to person and throughout the night. The calculator's 90-minute cycle is a timing exercise and planning aid, not a guarantee that waking at a particular minute will be easier.","Die Dauer eines Schlafzyklus variiert von Person zu Person und im Laufe der Nacht. Der 90-Minuten-Zyklus des Rechners ist deshalb ein Zeitbeispiel und eine Planungshilfe, keine Garantie dafür, dass das Aufwachen zu einer bestimmten Minute leichter fällt."],
    "Mennyiség":["Quantity","Dauer"],"Minőség":["Quality","Qualität"],"Rendszeresség":["Regularity","Regelmäßigkeit"],
    "Felnőtteknél a rendszeres, elegendő alvás fontosabb, mint egy feltételezett ciklushatár pontos eltalálása.":["For adults, regular and sufficient sleep matters more than hitting an assumed cycle boundary exactly.","Für Erwachsene ist regelmäßiger und ausreichender Schlaf wichtiger, als eine vermutete Zyklusgrenze genau zu treffen."],
    "Gyakori ébredés, horkolás, légzéskimaradás-gyanú vagy nappali aluszékonyság esetén a ciklusszámítás nem oldja meg az okot.":["Cycle calculations will not address the cause of frequent waking, snoring, possible breathing pauses or daytime sleepiness.","Bei häufigem Aufwachen, Schnarchen, möglicher Atemaussetzer oder Tagesmüdigkeit löst die Zyklusrechnung nicht die Ursache."],
    "A következetes lefekvési és felkelési idő sokszor használhatóbb cél, mint a percre kiszámolt ciklusvég.":["A consistent bedtime and wake-up time is often a more useful goal than calculating a cycle endpoint to the minute.","Eine gleichbleibende Schlafens- und Aufwachzeit ist oft ein sinnvolleres Ziel als das Ende eines Zyklus minutengenau zu berechnen."],
    "Forrás és ellenőrzési alap":["Sources and basis for review","Quellen und Grundlage der Prüfung"],
    "CDC – About Sleep":["CDC – About Sleep","CDC – About Sleep"],
    "A kalkulátor tájékoztató segédlet; egyedi egészségügyi vagy jogi döntést nem helyettesít.":["This calculator is an informational aid; it does not replace individual medical or legal advice.","Dieser Rechner ist eine Orientierungshilfe und ersetzt keine individuelle medizinische oder rechtliche Beratung."],
    "Alvásciklus helyett elsőként a megfelelő alvásidő":["Prioritise enough sleep over cycle timing","Ausreichende Schlafdauer zuerst, Zyklus-Timing danach"],
    "A 90 perces ciklus csak egyszerű példaforgatókönyv. Az NHLBI/NIH szerint az alvási ciklus jellemzően 80–100 percenként indul újra, és éjszakán belül is változhat.":["The 90-minute cycle is only a simple example. According to the NHLBI/NIH, sleep cycles typically restart every 80–100 minutes and can vary during the night.","Der 90-Minuten-Zyklus ist nur ein einfaches Beispiel. Laut NHLBI/NIH beginnt ein Schlafzyklus typischerweise alle 80–100 Minuten neu und kann im Laufe der Nacht variieren."],
    "Életkor":["Age","Alter"],"Általános napi ajánlott alvásidő":["General recommended daily sleep duration","Allgemein empfohlene tägliche Schlafdauer"],
    "6–12 év":["6–12 years","6–12 Jahre"],"9–12 óra":["9–12 hours","9–12 Stunden"],
    "13–17 év":["13–17 years","13–17 Jahre"],"8–10 óra":["8–10 hours","8–10 Stunden"],
    "18–60 év":["18–60 years","18–60 Jahre"],"legalább 7 óra":["at least 7 hours","mindestens 7 Stunden"],
    "61–64 év":["61–64 years","61–64 Jahre"],"7–9 óra":["7–9 hours","7–9 Stunden"],
    "65 év felett":["65 and over","ab 65 Jahren"],"7–8 óra":["7–8 hours","7–8 Stunden"],
    "Rendszeres hangos horkolás, légzéskimaradás, tartós nappali álmosság vagy elalvás közlekedés közben kivizsgálást igényelhet.":["Regular loud snoring, breathing pauses, persistent daytime sleepiness or falling asleep while travelling may require medical assessment.","Regelmäßiges lautes Schnarchen, Atemaussetzer, anhaltende Tagesmüdigkeit oder Einschlafen im Straßenverkehr können medizinisch abgeklärt werden müssen."],
    "Források és módszertani ellenőrzés":["Sources and methodology review","Quellen und methodische Prüfung"],
    "CDC – How Much Sleep Do I Need?":["CDC – How Much Sleep Do I Need?","CDC – Wie viel Schlaf brauche ich?"],
    "NHLBI/NIH – Sleep Phases and Stages":["NHLBI/NIH – Sleep Phases and Stages","NHLBI/NIH – Sleep Phases and Stages"],
    "American Academy of Sleep Medicine – sleep duration recommendations":["American Academy of Sleep Medicine – sleep duration recommendations","American Academy of Sleep Medicine – sleep duration recommendations"],
    "Az oldal tájékoztató kalkulátor; egyedi döntéshez szakember vagy hivatalos szerv adata szükséges.":["This is an informational calculator; consult a professional or an official source for decisions about your individual situation.","Dieser Rechner dient der Information. Für Entscheidungen in deiner individuellen Situation solltest du eine Fachperson oder offizielle Quelle heranziehen."],
    "Módszertani frissítés:":["Methodology updated:","Methodik aktualisiert:"],
    "2026. július 15.":["15 July 2026","15. Juli 2026"],
    "Adj meg érvényes adatokat.":["Enter valid values.","Gib gültige Werte ein."],
    "Az időpont egész óra- és percértékből álljon":["Enter the time as a whole number of hours and minutes.","Gib die Uhrzeit in ganzen Stunden und Minuten ein."],
    "Hirdetés":["Advertisement","Anzeige"],
    "Reggel":["Morning","Morgen"],
    "Négy":["Four","Vier"]
  });
  const resultLabels=Object.freeze({
    "Példa: 6 × 90 perc + 15 perc elalvás":["Example: 6 × 90 minutes + 15 minutes to fall asleep","Beispiel: 6 × 90 Minuten + 15 Minuten zum Einschlafen"],
    "Példa: 5 × 90 perc + 15 perc elalvás":["Example: 5 × 90 minutes + 15 minutes to fall asleep","Beispiel: 5 × 90 Minuten + 15 Minuten zum Einschlafen"],
    "Rövid példa: 4 × 90 perc + 15 perc elalvás":["Short example: 4 × 90 minutes + 15 minutes to fall asleep","Kurzes Beispiel: 4 × 90 Minuten + 15 Minuten zum Einschlafen"],
    "Alvásidő-megjegyzés":["Sleep-duration note","Hinweis zur Schlafdauer"]
  });
  const supported=Object.freeze(["hu","en","de"]);
  function translate(page,value,language){
    if(page!==pageKey||typeof value!=="string"||!supported.includes(language)||language==="hu")return null;
    const normalized=value.trim().replace(/\s+/gu," ");
    const result=resultLabels[normalized];
    if(result)return result[language==="en"?0:1];
    const pair=dictionary[normalized];
    return pair?pair[language==="en"?0:1]:null;
  }
  const dictionaries=Object.freeze({[pageKey]:dictionary});
  return {pages:Object.freeze([pageKey]),dictionaries,dictionary,resultLabels,supported,translate};
});
