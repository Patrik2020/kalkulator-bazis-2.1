(function () {
  const categories = [
    {
      "id": "mindennapi",
      "title": "Mindennapi kalkulátorok",
      "shortTitle": "Mindennapok",
      "url": "mindennapi.html",
      "description": "Vásárlás, közös költségek, egyszerű matematika, munka és dátumok jól elkülönített csoportokban.",
      "seo": "A mindennapi eszközök a vásárlási, háztartási, munkával kapcsolatos, matematikai és dátumszámításokat külön témacsoportokban teszik gyorsan elérhetővé.",
      "metaTitle": "Mindennapi kalkulátorok | Vásárlás, matematika, munka és dátum",
      "metaDescription": "Mindennapi kalkulátorok vásárláshoz, közös költségekhez, százalék- és arányszámításhoz, munkaidőhöz és dátumokhoz.",
      "cardClass": "card-general",
      "groups": [
        {
          "id": "vasarlas-haztartas",
          "title": "Vásárlás és háztartás",
          "description": "Árak, kedvezmények, egységárak és közös kiadások gyors ellenőrzéséhez."
        },
        {
          "id": "munka-jovedelem",
          "title": "Munka és jövedelem",
          "description": "Munkaidő és órabér egyszerű, gyors ellenőrzéséhez."
        },
        {
          "id": "matematika",
          "title": "Matematika",
          "description": "Százalék, arány és átlag a hétköznapi számolásokhoz."
        },
        {
          "id": "ido-datum",
          "title": "Idő és dátum",
          "description": "Életkor és két dátum közötti időtartam kiszámításához."
        }
      ]
    },
    {
      "id": "penzugyi",
      "title": "Pénzügyi kalkulátorok",
      "shortTitle": "Pénzügy",
      "url": "penzugyi.html",
      "description": "Jövedelem, háztartási keret, hitelek, megtakarítás és befektetés átlátható témacsoportokban.",
      "seo": "A pénzügyi eszközök a jövedelem tisztázásától a hitel teherbírásán át a megtakarítás és befektetés forgatókönyveiig támogatják a döntés előkészítését.",
      "metaTitle": "Pénzügyi kalkulátorok | Bér, hitel, megtakarítás és befektetés",
      "metaDescription": "Pénzügyi kalkulátorok nettó bérhez, költségvetéshez, hitelekhez, megtakarításhoz, ETF-hez, osztalékhoz és inflációhoz.",
      "cardClass": "card-finance",
      "groups": [
        {
          "id": "jovedelem-koltsegvetes",
          "title": "Jövedelem és költségvetés",
          "description": "Bér és háztartási pénzügyek áttekintéséhez."
        },
        {
          "id": "hitelek-ingatlan",
          "title": "Hitelek és ingatlan",
          "description": "Törlesztés, hitelképesség és önerő tervezéséhez."
        },
        {
          "id": "megtakaritas-befektetes",
          "title": "Megtakarítás és befektetés",
          "description": "Hosszú távú vagyonépítés, hozam és vásárlóerő modellezéséhez."
        },
        {
          "id": "szamlazas-hataridok",
          "title": "Számlázás és határidők",
          "description": "Számlák teljesítési és fizetési dátumainak gyors ellenőrzéséhez."
        }
      ]
    },
    {
      "id": "epitoipari",
      "title": "Otthon és felújítás kalkulátorok",
      "shortTitle": "Otthon & felújítás",
      "url": "epitoipari.html",
      "description": "Anyagigény, burkolás, felületképzés és szerkezeti becslések felújításhoz vagy építkezéshez.",
      "seo": "Az otthon és felújítás eszközei a helyszíni méretekből, anyagjellemzőkből és ráhagyásból készítenek átlátható beszerzési becslést.",
      "metaTitle": "Otthon és felújítás kalkulátorok | Anyagszükséglet és burkolás",
      "metaDescription": "Felújítási és építőipari kalkulátorok betonhoz, csempéhez, festékhez, gipszkartonhoz, szigeteléshez, burkolathoz és tetőhöz.",
      "cardClass": "card-building",
      "groups": [
        {
          "id": "szerkezet-szigeteles",
          "title": "Szerkezet és szigetelés",
          "description": "Falakhoz, födémhez, tetőhöz és szerkezeti anyagokhoz."
        },
        {
          "id": "burkolas-feluletek",
          "title": "Burkolás és felületek",
          "description": "Csempéhez, padlóhoz, festéshez, tapétához és térkövezéshez."
        }
      ]
    },
    {
      "id": "auto",
      "title": "Autó és közlekedés kalkulátorok",
      "shortTitle": "Autó & közlekedés",
      "url": "auto.html",
      "description": "Utazás, üzemanyag, fenntartási költség, műszaki összehasonlítás és környezeti becslések.",
      "seo": "Az autó és közlekedés eszközei külön kezelik az út tervezését, a mért fogyasztást, a fenntartási költségeket és a jármű műszaki összehasonlítását.",
      "metaTitle": "Autó és közlekedés kalkulátorok | Fogyasztás, költség és hatótáv",
      "metaDescription": "Autós kalkulátorok fogyasztáshoz, üzemanyagköltséghez, hatótávhoz, fenntartáshoz, értékvesztéshez, gumimérethez és utazáshoz.",
      "cardClass": "card-auto",
      "groups": [
        {
          "id": "utazas-uzemanyag",
          "title": "Utazás és üzemanyag",
          "description": "Fogyasztás, tankolás, hatótáv, menetidő és útköltség tervezéséhez."
        },
        {
          "id": "fenntartas-koltseg",
          "title": "Fenntartás és költség",
          "description": "Éves költség, értékvesztés és kilométerenkénti ráfordítás becsléséhez."
        },
        {
          "id": "muszaki-kornyezet",
          "title": "Műszaki és környezeti adatok",
          "description": "Gumiméret-összehasonlításhoz és CO₂-kibocsátási becsléshez."
        }
      ]
    },
    {
      "id": "egeszseg",
      "title": "Egészség és sport kalkulátorok",
      "shortTitle": "Egészség & sport",
      "url": "egeszseg.html",
      "description": "Testösszetétel, táplálkozás, energiaigény, edzés és regeneráció óvatos értelmezéssel.",
      "seo": "Az egészség és sport kalkulátorok a mérhető trendek követését segítik, de nem helyettesítik a diagnózist vagy a személyre szabott szakmai tanácsot.",
      "metaTitle": "Egészség és sport kalkulátorok | BMI, kalória, makró és pulzus",
      "metaDescription": "Egészség- és sportkalkulátorok BMI-hez, testzsírhoz, kalóriához, BMR-hez, makrókhoz, fehérjéhez, pulzushoz és alváshoz.",
      "cardClass": "card-health",
      "groups": [
        {
          "id": "testosszetetel",
          "title": "Testsúly és testösszetétel",
          "description": "Testsúly, BMI, testzsír és testarányok tájékozódó becsléséhez."
        },
        {
          "id": "taplalkozas-energia",
          "title": "Táplálkozás és energia",
          "description": "Kalória-, makró-, fehérje- és folyadékigény becsléséhez."
        },
        {
          "id": "edzes-regeneracio",
          "title": "Edzés és regeneráció",
          "description": "Pulzustartományok és alvási időzítés tervezéséhez."
        },
        {
          "id": "csalad",
          "title": "Család",
          "description": "Családi élethelyzethez kapcsolódó tájékozódó számításokhoz."
        }
      ]
    },
    {
      "id": "atvaltok",
      "title": "Átváltók és mértékegységek",
      "shortTitle": "Átváltók",
      "url": "atvaltok.html",
      "description": "Hétköznapi, műszaki, digitális és pénzügyi egységek gyors átváltása.",
      "seo": "Az átváltók a fizikai mennyiségek mellett az adatméret, energia, nyomás, teljesítmény és deviza értelmezésében is segítenek.",
      "metaTitle": "Átváltók | Mértékegység, energia, adatméret és deviza",
      "metaDescription": "Mértékegység-átváltók hosszúsághoz, tömeghez, területhez, térfogathoz, időhöz, sebességhez, energiához, nyomáshoz, teljesítményhez és devizához.",
      "cardClass": "card-general",
      "groups": [
        {
          "id": "meretek",
          "title": "Hosszúság, terület és térfogat",
          "description": "A leggyakoribb térbeli mértékegységek átváltásához."
        },
        {
          "id": "hetkoznapi-fizikai",
          "title": "Hétköznapi fizikai egységek",
          "description": "Tömeg, hőmérséklet, idő és sebesség átváltásához."
        },
        {
          "id": "muszaki-digitalis",
          "title": "Műszaki és digitális egységek",
          "description": "Energia, nyomás, teljesítmény és adatméret átváltásához."
        },
        {
          "id": "deviza",
          "title": "Deviza",
          "description": "Pénznemek közötti tájékozódó átváltáshoz."
        }
      ]
    }
  ];

  const calculators = [
    {
      title: "Nettó - bruttó kalkulátor",
      url: "kalkulatorok/netto-brutto-kalkulator.html",
      category: "penzugyi",
      group: "jovedelem-koltsegvetes",
      description: "Fizetés nettó vagy bruttó összegének kiszámítása.",
      keywords: "fizetés bér adó járulék nettó bruttó",
      popular: true,
    },
    {
      title: "Hitel törlesztő kalkulátor",
      url: "kalkulatorok/hitel-torleszto-kalkulator.html",
      category: "penzugyi",
      group: "hitelek-ingatlan",
      description: "Havi törlesztőrészlet számítása hitelösszeg és futamidő alapján.",
      keywords: "lakáshitel személyi kölcsön kamat törlesztés",
    },
    {
      title: "Hitelképesség kalkulátor",
      url: "kalkulatorok/hitelkepesseg-kalkulator.html",
      category: "penzugyi",
      group: "hitelek-ingatlan",
      description: "Becsüld meg, mekkora hitel férhet bele a jövedelmedbe.",
      keywords: "jtm hitel jövedelem bank önerő",
    },
    {
      title: "Lakáshitel önerő kalkulátor",
      url: "kalkulatorok/lakas-hitel-onero-kalkulator.html",
      category: "penzugyi",
      group: "hitelek-ingatlan",
      description: "Szükséges önerő kiszámítása lakásvásárláshoz.",
      keywords: "lakás ingatlan önerő lakáshitel",
    },
    {
      title: "Osztalék kalkulátor",
      url: "kalkulatorok/osztalek-kalkulator.html",
      category: "penzugyi",
      group: "megtakaritas-befektetes",
      description: "Osztalékbevétel, céljövedelemhez szükséges tőke és hosszú távú újrabefektetés becslése.",
      keywords: "osztalék részvény hozam passzív jövedelem nettó bevétel újrabefektetés céljövedelem",
      popular: true,
    },
    {
      title: "ETF kalkulátor",
      url: "kalkulatorok/etf-kalkulator.html",
      category: "penzugyi",
      group: "megtakaritas-befektetes",
      description: "ETF befektetés, célösszeg, TER és infláció becslése.",
      keywords: "befektetés tőzsde hozam rendszeres megtakarítás ETF TER infláció célösszeg",
      popular: true,
    },
    {
      title: "Mikor leszek milliomos?",
      url: "kalkulatorok/milliomos-kalkulator.html",
      category: "penzugyi",
      group: "megtakaritas-befektetes",
      description: "Számold ki, mennyi idő kell a célösszeg eléréséhez.",
      keywords: "megtakarítás vagyon célösszeg pénzügyi cél",
    },
    {
      title: "Infláció kalkulátor",
      url: "kalkulatorok/inflacio-kalkulator.html",
      category: "penzugyi",
      group: "megtakaritas-befektetes",
      description: "Pénz vásárlóerejének változása infláció mellett.",
      keywords: "infláció pénzromlás árak vásárlóerő",
    },
    {
      title: "Kamatos kamat kalkulátor",
      url: "kalkulatorok/kamatos-kamat-kalkulator.html",
      category: "penzugyi",
      group: "megtakaritas-befektetes",
      description: "Befektetés növekedése kamatos kamattal.",
      keywords: "kamat megtakarítás befektetés hozam",
    },
    {
      title: "Havi költségvetés kalkulátor",
      url: "kalkulatorok/havi-koltsegvetes-kalkulator.html",
      category: "penzugyi",
      group: "jovedelem-koltsegvetes",
      description: "Tervezd meg a havi bevételeidet, kiadásaidat és megtakarítási arányodat.",
      keywords: "költségvetés bevétel kiadás megtakarítás havi pénzügyi tervezés",
    },
    {
      title: "Fizetési határidő kalkulátor",
      url: "kalkulatorok/fizetesi-hatarido-kalkulator.html",
      category: "penzugyi",
      group: "szamlazas-hataridok",
      description: "Fizetési határidő kiszámítása számlázáshoz.",
      keywords: "számla fizetési határidő vállalkozás",
      popular: true,
    },
    {
      title: "Számla teljesítés kalkulátor",
      url: "kalkulatorok/szamla-teljesites-kalkulator.html",
      category: "penzugyi",
      group: "szamlazas-hataridok",
      description: "Számla teljesítési dátumának kiszámítása.",
      keywords: "számlázás teljesítés dátum vállalkozás",
      popular: true,
    },
    {
      title: "Beton kalkulátor",
      url: "kalkulatorok/beton-kalkulator.html",
      category: "epitoipari",
      group: "szerkezet-szigeteles",
      description: "Szükséges beton mennyiségének kiszámítása.",
      keywords: "beton alap köbméter építkezés",
    },
    {
      title: "Csempe kalkulátor",
      url: "kalkulatorok/csempe-kalkulator.html",
      category: "epitoipari",
      group: "burkolas-feluletek",
      description: "Csempe mennyiség kiszámítása burkoláshoz.",
      keywords: "csempe burkolat járólap négyzetméter",
    },
    {
      title: "Festék kalkulátor",
      url: "kalkulatorok/festek-kalkulator.html",
      category: "epitoipari",
      group: "burkolas-feluletek",
      description: "Festékmennyiség becslése falakhoz és felületekhez.",
      keywords: "festés festék liter fal",
    },
    {
      title: "Tégla kalkulátor",
      url: "kalkulatorok/tegla-kalkulator.html",
      category: "epitoipari",
      group: "szerkezet-szigeteles",
      description: "Tégla mennyiség kiszámítása falazáshoz.",
      keywords: "tégla falazat építkezés darab",
    },
    {
      title: "BMI kalkulátor",
      url: "kalkulatorok/bmi-kalkulator.html",
      category: "egeszseg",
      group: "testosszetetel",
      description: "Testtömegindex kiszámítása testsúly és magasság alapján.",
      keywords: "testtömeg index egészség súly magasság",
    },
    {
      title: "Kalória kalkulátor",
      url: "kalkulatorok/kaloria-kalkulator.html",
      category: "egeszseg",
      group: "taplalkozas-energia",
      description: "Napi kalóriaszükséglet becslése.",
      keywords: "kalória étrend fogyás tömegnövelés",
    },
    {
      title: "Százalék kalkulátor",
      url: "kalkulatorok/szazalek-kalkulator.html",
      category: "mindennapi",
      group: "matematika",
      description: "Gyors százalékszámítás hétköznapi helyzetekhez.",
      keywords: "százalék kedvezmény arány növekedés csökkenés",
    },
    {
      title: "ÁFA kalkulátor",
      url: "kalkulatorok/afa-kalkulator.html",
      category: "mindennapi",
      group: "vasarlas-haztartas",
      description: "ÁFA hozzáadása vagy levonása nettó és bruttó értékből.",
      keywords: "áfa nettó bruttó adó számla",
    },
    {
      title: "Autós út- és hatótáv kalkulátor",
      url: "kalkulatorok/auto-kalkulator.html",
      category: "auto",
      group: "utazas-uzemanyag",
      description: "Fogyasztás, üzemanyagköltség és becsült hatótáv egy összetett eszközben.",
      keywords: "fogyasztás üzemanyag utazás benzin dízel",
      popular: true,
    },
    {
      title: "Hőmérséklet átváltó",
      url: "kalkulatorok/homerseklet-atvalto-kalkulator.html",
      category: "atvaltok",
      group: "hetkoznapi-fizikai",
      description: "Celsius, Fahrenheit és Kelvin átváltása.",
      keywords: "celsius fahrenheit kelvin hőfok",
    },
    {
      title: "Hosszúság átváltó",
      url: "kalkulatorok/hosszusag-atvalto-kalkulator.html",
      category: "atvaltok",
      group: "meretek",
      description: "Milliméter, centiméter, méter, kilométer, inch és mérföld.",
      keywords: "hossz méter inch mérföld",
    },
    {
      title: "Tömeg átváltó",
      url: "kalkulatorok/tomeg-atvalto-kalkulator.html",
      category: "atvaltok",
      group: "hetkoznapi-fizikai",
      description: "Gramm, kilogramm, tonna, font és uncia átváltása.",
      keywords: "súly tömeg kg font uncia",
    },
    {
      title: "Terület átváltó",
      url: "kalkulatorok/terulet-atvalto-kalkulator.html",
      category: "atvaltok",
      group: "meretek",
      description: "Négyzetméter, hektár és négyzetkilométer átváltása.",
      keywords: "terület négyzetméter hektár",
    },
    {
      title: "Térfogat átváltó",
      url: "kalkulatorok/terfogat-atvalto-kalkulator.html",
      category: "atvaltok",
      group: "meretek",
      description: "Milliliter, liter, köbméter és gallon átváltása.",
      keywords: "térfogat liter gallon köbméter",
    },
    {
      title: "Idő átváltó",
      url: "kalkulatorok/ido-atvalto-kalkulator.html",
      category: "atvaltok",
      group: "hetkoznapi-fizikai",
      description: "Másodperc, perc, óra, nap és hét átváltása.",
      keywords: "idő óra perc nap hét",
    },
    {
      title: "Sebesség átváltó",
      url: "kalkulatorok/sebesseg-atvalto-kalkulator.html",
      category: "atvaltok",
      group: "hetkoznapi-fizikai",
      description: "Km/h, mph és m/s közötti átváltás.",
      keywords: "sebesség kmh mph ms",
    },
    {
      title: "Adatmennyiség átváltó",
      url: "kalkulatorok/adatmeret-atvalto-kalkulator.html",
      category: "atvaltok",
      group: "muszaki-digitalis",
      description: "KB, MB, GB és TB átváltása.",
      keywords: "adat tárhely méret byte",
    },
    {
      title: "Deviza átváltó",
      url: "kalkulatorok/deviza-atvalto-kalkulator.html",
      category: "atvaltok",
      group: "deviza",
      description: "Forint, euró, dollár, font és más pénznemek átváltása.",
      keywords: "deviza valuta euró dollár forint",
    },
    {
      title: "Padlóburkolat kalkulátor",
      url: "kalkulatorok/padlo-burkolat-kalkulator.html",
      category: "epitoipari",
      group: "burkolas-feluletek",
      description: "Számold ki a szükséges laminált padló, parketta vagy burkolat mennyiségét.",
      keywords: "padló burkolat laminált parketta alapterület veszteség",
    },
    {
      title: "Gipszkarton kalkulátor",
      url: "kalkulatorok/gipszkarton-kalkulator.html",
      category: "epitoipari",
      group: "szerkezet-szigeteles",
      description: "Becsüld meg, hány gipszkarton lapra lesz szükséged falhoz vagy mennyezethez.",
      keywords: "gipszkarton lap fal mennyezet építés",
    },
    {
      title: "Tapéta kalkulátor",
      url: "kalkulatorok/tapeta-kalkulator.html",
      category: "epitoipari",
      group: "burkolas-feluletek",
      description: "Számold ki, hány tekercs tapétára lehet szükség egy helyiségben.",
      keywords: "tapéta tekercs fal lakásfelújítás",
    },
    {
      title: "Vakolat kalkulátor",
      url: "kalkulatorok/vakolat-kalkulator.html",
      category: "epitoipari",
      group: "szerkezet-szigeteles",
      description: "Becsüld meg a vakolat vagy glettanyag mennyiségét felület és rétegvastagság alapján.",
      keywords: "vakolat glett anyag fal vastagság",
    },
    {
      title: "Hőszigetelés kalkulátor",
      url: "kalkulatorok/hoszigeteles-kalkulator.html",
      category: "epitoipari",
      group: "szerkezet-szigeteles",
      description: "Tervezd meg a homlokzati vagy födémszigetelés lapmennyiségét.",
      keywords: "hőszigetelés homlokzat eps xps kőzetgyapot",
    },
    {
      title: "Térkövezés kalkulátor",
      url: "kalkulatorok/terkovezes-kalkulator.html",
      category: "epitoipari",
      group: "burkolas-feluletek",
      description: "Számold ki térkő, szegélykő és ráhagyás becsült mennyiségét.",
      keywords: "térkő udvar járda kert térkövezés",
    },
    {
      title: "Tetőcserép kalkulátor",
      url: "kalkulatorok/tetocserep-kalkulator.html",
      category: "epitoipari",
      group: "szerkezet-szigeteles",
      description: "Becsüld meg a tetőfedéshez szükséges cserepek számát.",
      keywords: "tető cserép tetőfedés építkezés",
    },
    {
      title: "Fuga kalkulátor",
      url: "kalkulatorok/fuga-kalkulator.html",
      category: "epitoipari",
      group: "burkolas-feluletek",
      description: "Számold ki a várható fugázóanyag-szükségletet burkoláshoz.",
      keywords: "fuga burkolás csempe járólap fugázó",
    },
    {
      title: "Vízfogyasztás kalkulátor",
      url: "kalkulatorok/vizfogyasztas-kalkulator.html",
      category: "egeszseg",
      group: "taplalkozas-energia",
      description: "Becsüld meg a napi ajánlott folyadékbevitelt testsúly és aktivitás alapján.",
      keywords: "vízfogyasztás folyadék testsúly hidratálás",
    },
    {
      title: "Pulzus zóna kalkulátor",
      url: "kalkulatorok/pulzus-zona-kalkulator.html",
      category: "egeszseg",
      group: "edzes-regeneracio",
      description: "Számold ki az edzéshez használható pulzustartományokat.",
      keywords: "pulzus edzés kardió zóna sport",
    },
    {
      title: "Terhességi kalkulátor",
      url: "kalkulatorok/terhessegi-kalkulator.html",
      category: "egeszseg",
      group: "csalad",
      description: "Számold ki a várható szülési dátumot az utolsó menstruáció alapján.",
      keywords: "terhesség szülés dátum kalkulátor",
    },
    {
      title: "Ideális testsúly kalkulátor",
      url: "kalkulatorok/idealis-testsuly-kalkulator.html",
      category: "egeszseg",
      group: "testosszetetel",
      description: "Becsüld meg az ideális testsúlyt magasság és nem alapján.",
      keywords: "ideális testsúly magasság egészség",
    },
    {
      title: "Testzsír százalék kalkulátor",
      url: "kalkulatorok/testzsir-kalkulator.html",
      category: "egeszseg",
      group: "testosszetetel",
      description: "Becsüld meg a testzsírszázalékot derék, nyak, csípő és magasság alapján.",
      keywords: "testzsír százalék derék csípő egészség",
    },
    {
      title: "Makró kalkulátor",
      url: "kalkulatorok/makro-kalkulator.html",
      category: "egeszseg",
      group: "taplalkozas-energia",
      description: "Oszd fel a napi kalóriát fehérje, szénhidrát és zsír között.",
      keywords: "makró fehérje szénhidrát zsír étrend",
    },
    {
      title: "Alvásciklus kalkulátor",
      url: "kalkulatorok/alvasciklus-kalkulator.html",
      category: "egeszseg",
      group: "edzes-regeneracio",
      description: "Tervezd meg, mikor érdemes lefeküdni vagy felkelni 90 perces ciklusokkal.",
      keywords: "alvás ciklus lefekvés felkelés",
    },
    {
      title: "BMR kalkulátor",
      url: "kalkulatorok/bmr-kalkulator.html",
      category: "egeszseg",
      group: "taplalkozas-energia",
      description: "Számold ki az alapanyagcserédet Mifflin-St Jeor képlettel.",
      keywords: "bmr alapanyagcsere kalória",
    },
    {
      title: "Derék-csípő arány kalkulátor",
      url: "kalkulatorok/derek-csipo-kalkulator.html",
      category: "egeszseg",
      group: "testosszetetel",
      description: "Számold ki a derék-csípő arányt, egy egyszerű egészségi mutatót.",
      keywords: "derék csípő arány whr",
    },
    {
      title: "Fehérje szükséglet kalkulátor",
      url: "kalkulatorok/feherje-szukseglet-kalkulator.html",
      category: "egeszseg",
      group: "taplalkozas-energia",
      description: "Becsüld meg a napi fehérjeigényt testsúly és cél alapján.",
      keywords: "fehérje protein edzés fogyás",
    },
    {
      title: "Árkedvezmény kalkulátor",
      url: "kalkulatorok/ar-kedvezmeny-kalkulator.html",
      category: "mindennapi",
      group: "vasarlas-haztartas",
      description: "Számold ki az akciós árat, kedvezményt és megtakarítást.",
      keywords: "kedvezmény akció ár százalék",
    },
    {
      title: "Borravaló kalkulátor",
      url: "kalkulatorok/borravalo-kalkulator.html",
      category: "mindennapi",
      group: "vasarlas-haztartas",
      description: "Oszd el a számlát és számold ki a borravalót több főre.",
      keywords: "borravaló számla étterem",
    },
    {
      title: "Munkaidő kalkulátor",
      url: "kalkulatorok/munkaido-kalkulator.html",
      category: "mindennapi",
      group: "munka-jovedelem",
      description: "Számold ki a heti és havi munkaórát napi óraszám alapján.",
      keywords: "munkaidő óra hét hónap",
    },
    {
      title: "Életkor kalkulátor",
      url: "kalkulatorok/eletkor-kalkulator.html",
      category: "mindennapi",
      group: "ido-datum",
      description: "Számold ki az életkort években, hónapokban és napokban.",
      keywords: "életkor születésnap dátum",
    },
    {
      title: "Dátum különbség kalkulátor",
      url: "kalkulatorok/datum-kulonbseg-kalkulator.html",
      category: "mindennapi",
      group: "ido-datum",
      description: "Számold ki két dátum közötti napok számát egyszerűen.",
      keywords: "dátum különbség napok",
    },
    {
      title: "Átlag kalkulátor",
      url: "kalkulatorok/atlag-kalkulator.html",
      category: "mindennapi",
      group: "matematika",
      description: "Számold ki több érték átlagát darabszám és összeg alapján.",
      keywords: "átlag számítás összeg darab",
    },
    {
      title: "Egységár kalkulátor",
      url: "kalkulatorok/egysegar-kalkulator.html",
      category: "mindennapi",
      group: "vasarlas-haztartas",
      description: "Hasonlítsd össze termékek egységárát kiszerelés alapján.",
      keywords: "egységár ár kiszerelés vásárlás",
    },
    {
      title: "Rezsi megosztás kalkulátor",
      url: "kalkulatorok/rezsi-megosztas-kalkulator.html",
      category: "mindennapi",
      group: "vasarlas-haztartas",
      description: "Oszd szét a közös költségeket lakótársak vagy családtagok között.",
      keywords: "rezsi megosztás lakótárs közös költség",
    },
    {
      title: "Órabér kalkulátor",
      url: "kalkulatorok/oraber-kalkulator.html",
      category: "mindennapi",
      group: "munka-jovedelem",
      description: "Számold ki az órabéred havi bér és munkaóra alapján.",
      keywords: "órabér fizetés munkaóra",
    },
    {
      title: "Arány kalkulátor",
      url: "kalkulatorok/arany-kalkulator.html",
      category: "mindennapi",
      group: "matematika",
      description: "Számold ki egy rész arányát az egészhez képest.",
      keywords: "arány rész egész százalék",
    },
    {
      title: "Üzemanyag költség kalkulátor",
      url: "kalkulatorok/uzemanyag-koltseg-kalkulator.html",
      category: "auto",
      group: "utazas-uzemanyag",
      description: "Számold ki egy út várható üzemanyagköltségét.",
      keywords: "üzemanyag benzin dízel útiköltség",
    },
    {
      title: "Autó fogyasztás kalkulátor",
      url: "kalkulatorok/auto-fogyasztas-kalkulator.html",
      category: "auto",
      group: "utazas-uzemanyag",
      description: "Számold ki a valós fogyasztást tankolás és megtett kilométer alapján.",
      keywords: "fogyasztás tankolás autó liter",
    },
    {
      title: "Hatótáv kalkulátor",
      url: "kalkulatorok/hatotav-kalkulator.html",
      category: "auto",
      group: "utazas-uzemanyag",
      description: "Becsüld meg, hány kilométert tehetsz meg a tankban lévő üzemanyaggal.",
      keywords: "hatótáv tank fogyasztás",
    },
    {
      title: "Éves autóköltség kalkulátor",
      url: "kalkulatorok/eves-auto-koltseg-kalkulator.html",
      category: "auto",
      group: "fenntartas-koltseg",
      description: "Becsüld meg az autó éves fenntartási költségét.",
      keywords: "autó fenntartás éves költség biztosítás szerviz",
    },
    {
      title: "Autó értékvesztés kalkulátor",
      url: "kalkulatorok/auto-ertekvesztes-kalkulator.html",
      category: "auto",
      group: "fenntartas-koltseg",
      description: "Számold ki, mennyit veszíthet az autó az értékéből évente.",
      keywords: "autó amortizáció értékvesztés",
    },
    {
      title: "Kilométerdíj kalkulátor",
      url: "kalkulatorok/kilometerdij-kalkulator.html",
      category: "auto",
      group: "fenntartas-koltseg",
      description: "Számold ki, mennyibe kerül egy kilométer az autóddal.",
      keywords: "kilométerdíj autó költség km",
    },
    {
      title: "CO2 kibocsátás kalkulátor",
      url: "kalkulatorok/co2-kibocsatas-kalkulator.html",
      category: "auto",
      group: "muszaki-kornyezet",
      description: "Becsüld meg az utazás szén-dioxid kibocsátását üzemanyag alapján.",
      keywords: "co2 kibocsátás autó környezet",
    },
    {
      title: "Tankolás kalkulátor",
      url: "kalkulatorok/tankolas-kalkulator.html",
      category: "auto",
      group: "utazas-uzemanyag",
      description: "Számold ki, hány liter üzemanyagot kapsz a megadott tankolási keretből.",
      keywords: "tankolás üzemanyag liter ár",
    },
    {
      title: "Gumiméret váltó kalkulátor",
      url: "kalkulatorok/gumi-meret-kalkulator.html",
      category: "auto",
      group: "muszaki-kornyezet",
      description: "Hasonlíts össze két gumiméretet átmérő és eltérés alapján.",
      keywords: "gumiméret váltó kerék átmérő",
    },
    {
      title: "Autópályadíj kalkulátor",
      url: "kalkulatorok/autopalyadij-kalkulator.html",
      category: "auto",
      group: "utazas-uzemanyag",
      description: "Oszd el az autópályadíjat utasok között.",
      keywords: "autópálya matrica díj utazás",
    },
    {
      title: "Utazási idő kalkulátor",
      url: "kalkulatorok/utazasi-ido-kalkulator.html",
      category: "auto",
      group: "utazas-uzemanyag",
      description: "Számold ki a várható menetidőt távolság és átlagsebesség alapján.",
      keywords: "utazási idő távolság sebesség",
    },
    {
      title: "Energia átváltó kalkulátor",
      url: "kalkulatorok/energia-atvalto-kalkulator.html",
      category: "atvaltok",
      group: "muszaki-digitalis",
      description: "Válts át joule, kilojoule, kalória és kilowattóra között.",
      keywords: "energia joule kalória kwh átváltás",
    },
    {
      title: "Nyomás átváltó kalkulátor",
      url: "kalkulatorok/nyomas-atvalto-kalkulator.html",
      category: "atvaltok",
      group: "muszaki-digitalis",
      description: "Válts át pascal, bar, atmoszféra és PSI között.",
      keywords: "nyomás bar psi pascal átváltás",
    },
    {
      title: "Teljesítmény átváltó kalkulátor",
      url: "kalkulatorok/teljesitmeny-atvalto-kalkulator.html",
      category: "atvaltok",
      group: "muszaki-digitalis",
      description: "Válts át watt, kilowatt és lóerő között.",
      keywords: "teljesítmény watt kilowatt lóerő átváltás",
    },
    {
      title: "Hármasszabály kalkulátor",
      url: "kalkulatorok/harmasszabaly-kalkulator.html",
      category: "mindennapi",
      group: "matematika",
      description: "Egyenes vagy fordított arányosság ismeretlen értékének kiszámítása három ismert adatból.",
      keywords: "hármasszabály aránypár egyenes fordított arányosság matematika százalék",
    },
    {
      title: "Mértani átlag kalkulátor",
      url: "kalkulatorok/mertani-atlag-kalkulator.html",
      category: "mindennapi",
      group: "matematika",
      description: "Pozitív értékek mértani közepének kiszámítása, különösen növekedési szorzók és arányok összevetéséhez.",
      keywords: "mértani átlag geometriai közép hozam növekedés szorzó matematika",
    },
    {
      title: "Csemperagasztó kalkulátor",
      url: "kalkulatorok/csemperagaszto-kalkulator.html",
      category: "epitoipari",
      group: "burkolas-feluletek",
      description: "Csemperagasztó anyagszükséglet és zsákszám becslése felület, gyártói fajlagos fogyás és ráhagyás alapján.",
      keywords: "csemperagasztó burkolás ragasztó kg m2 zsák anyagszükséglet felújítás",
    },
    {
      title: "Elektromos autó töltési költség kalkulátor",
      url: "kalkulatorok/elektromos-auto-toltesi-koltseg-kalkulator.html",
      category: "auto",
      group: "utazas-uzemanyag",
      description: "EV-töltés hálózati energiaigényének, várható költségének és ideális töltési idejének becslése töltési veszteséggel.",
      keywords: "elektromos autó ev töltés kWh villany költség akkumulátor soc töltési veszteség",
    },
    {
      title: "Futótempó kalkulátor",
      url: "kalkulatorok/futotempo-kalkulator.html",
      category: "egeszseg",
      group: "edzes-regeneracio",
      description: "Futótempó, átlagsebesség és becsült célidő számítása távolság és idő vagy megadott perc/km tempó alapján.",
      keywords: "futótempó pace perc km futás célidő átlagsebesség 5k 10k félmaraton maraton",
    },
  ];

  const relatedGroups = [
    [
      "kalkulatorok/netto-brutto-kalkulator.html",
      "kalkulatorok/hitelkepesseg-kalkulator.html",
      "kalkulatorok/hitel-torleszto-kalkulator.html",
      "kalkulatorok/lakas-hitel-onero-kalkulator.html",
      "kalkulatorok/havi-koltsegvetes-kalkulator.html",
    ],
    [
      "kalkulatorok/etf-kalkulator.html",
      "kalkulatorok/kamatos-kamat-kalkulator.html",
      "kalkulatorok/osztalek-kalkulator.html",
      "kalkulatorok/inflacio-kalkulator.html",
      "kalkulatorok/milliomos-kalkulator.html",
    ],
    [
      "kalkulatorok/afa-kalkulator.html",
      "kalkulatorok/szamla-teljesites-kalkulator.html",
      "kalkulatorok/fizetesi-hatarido-kalkulator.html",
      "kalkulatorok/oraber-kalkulator.html",
    ],
    [
      "kalkulatorok/beton-kalkulator.html",
      "kalkulatorok/tegla-kalkulator.html",
      "kalkulatorok/vakolat-kalkulator.html",
      "kalkulatorok/gipszkarton-kalkulator.html",
      "kalkulatorok/hoszigeteles-kalkulator.html",
    ],
    [
      "kalkulatorok/csempe-kalkulator.html",
      "kalkulatorok/fuga-kalkulator.html",
      "kalkulatorok/padlo-burkolat-kalkulator.html",
      "kalkulatorok/terkovezes-kalkulator.html",
      "kalkulatorok/festek-kalkulator.html",
      "kalkulatorok/tapeta-kalkulator.html",
    ],
    [
      "kalkulatorok/tetocserep-kalkulator.html",
      "kalkulatorok/terulet-atvalto-kalkulator.html",
      "kalkulatorok/terfogat-atvalto-kalkulator.html",
      "kalkulatorok/hoszigeteles-kalkulator.html",
    ],
    [
      "kalkulatorok/bmi-kalkulator.html",
      "kalkulatorok/idealis-testsuly-kalkulator.html",
      "kalkulatorok/testzsir-kalkulator.html",
      "kalkulatorok/derek-csipo-kalkulator.html",
      "kalkulatorok/bmr-kalkulator.html",
    ],
    [
      "kalkulatorok/kaloria-kalkulator.html",
      "kalkulatorok/makro-kalkulator.html",
      "kalkulatorok/feherje-szukseglet-kalkulator.html",
      "kalkulatorok/bmr-kalkulator.html",
      "kalkulatorok/vizfogyasztas-kalkulator.html",
    ],
    [
      "kalkulatorok/pulzus-zona-kalkulator.html",
      "kalkulatorok/alvasciklus-kalkulator.html",
      "kalkulatorok/kaloria-kalkulator.html",
      "kalkulatorok/terhessegi-kalkulator.html",
    ],
    [
      "kalkulatorok/szazalek-kalkulator.html",
      "kalkulatorok/arany-kalkulator.html",
      "kalkulatorok/atlag-kalkulator.html",
      "kalkulatorok/ar-kedvezmeny-kalkulator.html",
      "kalkulatorok/egysegar-kalkulator.html",
    ],
    [
      "kalkulatorok/munkaido-kalkulator.html",
      "kalkulatorok/oraber-kalkulator.html",
      "kalkulatorok/datum-kulonbseg-kalkulator.html",
      "kalkulatorok/eletkor-kalkulator.html",
    ],
    [
      "kalkulatorok/borravalo-kalkulator.html",
      "kalkulatorok/rezsi-megosztas-kalkulator.html",
      "kalkulatorok/egysegar-kalkulator.html",
      "kalkulatorok/havi-koltsegvetes-kalkulator.html",
    ],
    [
      "kalkulatorok/auto-kalkulator.html",
      "kalkulatorok/uzemanyag-koltseg-kalkulator.html",
      "kalkulatorok/auto-fogyasztas-kalkulator.html",
      "kalkulatorok/hatotav-kalkulator.html",
      "kalkulatorok/utazasi-ido-kalkulator.html",
    ],
    [
      "kalkulatorok/eves-auto-koltseg-kalkulator.html",
      "kalkulatorok/kilometerdij-kalkulator.html",
      "kalkulatorok/auto-ertekvesztes-kalkulator.html",
      "kalkulatorok/tankolas-kalkulator.html",
      "kalkulatorok/autopalyadij-kalkulator.html",
    ],
    [
      "kalkulatorok/co2-kibocsatas-kalkulator.html",
      "kalkulatorok/auto-fogyasztas-kalkulator.html",
      "kalkulatorok/uzemanyag-koltseg-kalkulator.html",
      "kalkulatorok/hatotav-kalkulator.html",
    ],
    [
      "kalkulatorok/gumi-meret-kalkulator.html",
      "kalkulatorok/sebesseg-atvalto-kalkulator.html",
      "kalkulatorok/hatotav-kalkulator.html",
      "kalkulatorok/kilometerdij-kalkulator.html",
    ],
    [
      "kalkulatorok/hosszusag-atvalto-kalkulator.html",
      "kalkulatorok/terulet-atvalto-kalkulator.html",
      "kalkulatorok/terfogat-atvalto-kalkulator.html",
      "kalkulatorok/tomeg-atvalto-kalkulator.html",
    ],
    [
      "kalkulatorok/homerseklet-atvalto-kalkulator.html",
      "kalkulatorok/energia-atvalto-kalkulator.html",
      "kalkulatorok/teljesitmeny-atvalto-kalkulator.html",
      "kalkulatorok/nyomas-atvalto-kalkulator.html",
    ],
    [
      "kalkulatorok/ido-atvalto-kalkulator.html",
      "kalkulatorok/sebesseg-atvalto-kalkulator.html",
      "kalkulatorok/adatmeret-atvalto-kalkulator.html",
      "kalkulatorok/deviza-atvalto-kalkulator.html",
    ],
  ];

  calculators.forEach((calculator, index) => {
    const group = relatedGroups.find((items) => items.includes(calculator.url)) || [];
    const categoryPeers = calculators.filter(
      (item) => item.category === calculator.category && item.url !== calculator.url
    );
    const ordered = [
      ...group.filter((url) => url !== calculator.url),
      ...categoryPeers
        .slice(index % Math.max(categoryPeers.length, 1))
        .concat(categoryPeers.slice(0, index % Math.max(categoryPeers.length, 1)))
        .map((item) => item.url),
    ];

    calculator.related = [...new Set(ordered)].slice(0, 3);
  });

  window.KB_DATA = {
    categories,
    calculators,
    wise: {
      url: "https://wise.prf.hn/click/camref:1100l5Km25/creativeref:1101l107482",
      image:
        "https://wise-creative.prf.hn/source/camref:1100l5Km25/creativeref:1101l107482",
    },
    adsense: {
      client: "ca-pub-2639795157074812",
      slot: "2032035454",
    },
  };
})();
