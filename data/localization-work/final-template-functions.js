 // Explicit templates emitted by decision-tools/home-decision-v2. Captures are
 // restricted to their numeric readouts or A/B identifiers, never user prose.
 const templates=[
 ['{0} éves megtakarítási terv','{0}-year savings plan','Sparplan über {0} Jahre'],
 ['{0} éves inflációs feltételezéssel','assuming {0} annual inflation','bei angenommener jährlicher Inflation von {0}'],
 ['{0} Ft/óra','{0} HUF/hour','{0} HUF/Stunde'],
 ['{0} és {1} a megadott fő mutató alapján gyakorlatilag azonos.','{0} and {1} are effectively equal on the main indicator entered.','{0} und {1} sind nach der eingegebenen Hauptkennzahl praktisch gleich.'],
 ['{0} előnye a fő mutatóban {1} a másik forgatókönyvhöz képest.','{0} has an advantage of {1} on the main indicator over the other scenario.','{0} hat bei der Hauptkennzahl einen Vorteil von {1} gegenüber dem anderen Szenario.'],
 ['{0} forgatókönyv becsült teljes visszafizetése alacsonyabb {1} összeggel.','Scenario {0} has an estimated total repayment lower by {1}.','Bei Szenario {0} ist die geschätzte Gesamtrückzahlung um {1} niedriger.'],
 ['{0} forgatókönyv becsült éves költsége alacsonyabb {1} összeggel.','Scenario {0} has estimated annual costs lower by {1}.','Bei Szenario {0} sind die geschätzten Jahreskosten um {1} niedriger.'],
 ['{0} ajánlat effektív nettó órabére magasabb {1} Ft/órával.','Offer {0} has effective net hourly pay higher by {1} HUF/hour.','Angebot {0} hat einen um {1} HUF/Stunde höheren effektiven Nettostundenlohn.'],
 ['{0} havi változás','{0} monthly change','{0} monatliche Änderung'],
 ['{0} éves futamidő','{0}-year term','{0} Jahre Laufzeit'],
 ['Önerő +{0}','Own funds +{0}','Eigenmittel +{0}'],
 ['Hiány: {0}','Shortfall: {0}','Fehlbetrag: {0}'],
 ['{0} hónapnyi teljes havi kiadás','{0} months of total monthly expenses','{0} Monate gesamter monatlicher Ausgaben'],
 ['Kamat {0}%','Interest {0}%','Zins {0}%'],
 ['A becsült törlesztő a megadott nettó jövedelem kb. {0}-a. Tervezési szinten ez több mozgásteret hagyhat más kiadásoknak.','The estimated repayment is about {0} of the net income entered. For planning, this may leave more flexibility for other expenses.','Die geschätzte Rate beträgt etwa {0} des eingegebenen Nettoeinkommens. Für die Planung kann dies mehr Spielraum für andere Ausgaben lassen.'],
 ['A becsült törlesztő a megadott nettó jövedelem kb. {0}-a. Ez már feszesebb havi keretet jelezhet, ezért érdemes vésztartalékkal is számolni.','The estimated repayment is about {0} of the net income entered. This may indicate a tighter monthly budget, so allow for an emergency reserve.','Die geschätzte Rate beträgt etwa {0} des eingegebenen Nettoeinkommens. Dies kann ein knapperes Monatsbudget bedeuten; plane daher auch Notfallrücklagen ein.'],
 ['A becsült törlesztő a megadott nettó jövedelem kb. {0}-a. Ez magas arány, ezért különösen fontos a teljes háztartási költségvetés vizsgálata.','The estimated repayment is about {0} of the net income entered. This is a high share, making a full household budget review especially important.','Die geschätzte Rate beträgt etwa {0} des eingegebenen Nettoeinkommens. Dieser hohe Anteil macht die Prüfung des gesamten Haushaltsbudgets besonders wichtig.']
 ];
 const escapePattern=s=>s.replace(/[.*+?^${}()|[\]\\]/gu,'\\$&');
 const capture='([AB]|[+−-]?[0-9][0-9\\s.,]*(?: ?(?:Ft|HUF|%))?)';
 const compiled=templates.map(([hu,en,de])=>({regex:new RegExp('^'+hu.split(/\{\d+\}/u).map(escapePattern).join(capture)+'$','u'),pair:[en,de]}));
 const normalize=s=>s.replace(/\s+/gu,' ').trim();
 function translate(value,language){
  if(typeof value!=='string'||!['en','de'].includes(language))return null;
  const text=normalize(value),index=language==='en'?0:1;
  if(Object.hasOwn(dictionary,text))return dictionary[text][index];
  for(const {regex,pair}of compiled){const match=regex.exec(text);if(match)return pair[index].replace(/\{(\d+)\}/gu,(_,i)=>match[Number(i)+1]);}
  for(const grade of ['Kockázatosabb','Kényelmesebb','Feszes']){
   if(text.startsWith(grade+': ')){const detail=text.slice(grade.length+2);if(Object.hasOwn(dictionary,detail))return dictionary[grade][index]+': '+dictionary[detail][index];}
  }
  return null;
 }
