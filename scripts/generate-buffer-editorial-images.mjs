// Original human-designed editorial artwork for Facebook.
// Each curated caption receives a subject-specific typographic illustration.
// No calculations, hallucinated numerical data, generative-API dependency or stock imagery.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire('/tmp/buffer-social-render/package.json');
const { Resvg } = require('@resvg/resvg-js');
const outDir = path.resolve('assets/social/facebook/editorial');
fs.mkdirSync(outDir, { recursive: true });

export const categories = [
  {
    slug: 'penzugyek', section: 'PÉNZÜGYEK',
    headlines: [
      ['A szokásokból', 'lesz megtakarítás'],
      ['Mennyibe kerül', 'egy előfizetés?'],
      ['Mekkora legyen', 'a vésztartalék?'],
      ['A kis összeg is', 'összeadódik'],
    ],
    subtitles: ['Tervezés kis lépésekben', 'Nézd éves összegben is!', 'Készülj fel a váratlanra!', 'Érdemes számolni vele!'],
  },
  {
    slug: 'autozas', section: 'AUTÓZÁS',
    headlines: [
      ['Mennyibe kerül', 'egy autóút?'],
      ['Egy literrel', 'kevesebb számít'],
      ['A napi utazás', 'is összeadódik'],
      ['Fogyasztásból', 'valódi költség'],
    ],
    subtitles: ['Tervezd meg indulás előtt!', 'Hasonlítsd össze a fogyasztást!', 'Nézd meg a havi távokat!', 'Számold ki a különbséget!'],
  },
  {
    slug: 'befektetes', section: 'BEFEKTETÉS',
    headlines: [
      ['A hozamok', 'nem szimmetrikusak'],
      ['Hogyan térül', 'meg a veszteség?'],
      ['A kamatos kamat', 'ereje'],
      ['Az apró díjak', 'is számítanak'],
    ],
    subtitles: ['Értsd meg a százalékokat!', 'Más alapról indul a növekedés.', 'Az idő is dolgozhat érted.', 'Nézd a teljes költséget!'],
  },
  {
    slug: 'matek', section: 'MINDENNAPI MATEK',
    headlines: [
      ['Hogyan osszuk', 'el igazságosan?'],
      ['Több kedvezmény', 'együtt'],
      ['Melyik csomag', 'éri meg jobban?'],
      ['Százalék vagy', 'százalékpont?'],
    ],
    subtitles: ['Egy egyszerű számolás segít.', 'A sorrend is fontos lehet.', 'Az egységár megmutatja.', 'Hasonló szó, más jelentés.'],
  },
  {
    slug: 'gazdasag', section: 'GAZDASÁG',
    headlines: [
      ['Mennyit ér', 'egy béremelés?'],
      ['Mikor térül meg', 'egy vállalkozás?'],
      ['Árváltozások', 'egymás után'],
      ['Nettó vagy', 'bruttó ár?'],
    ],
    subtitles: ['Számolj a százalékokkal!', 'Ismerd meg a fedezeti pontot!', 'A második emelés más alap.', 'Nézd, miből áll össze!'],
  },
  {
    slug: 'otthon', section: 'OTTHON',
    headlines: [
      ['Kevesebb víz,', 'tudatosabb otthon'],
      ['Mennyit fogyaszt', 'a világítás?'],
      ['Mennyi festék', 'lesz elegendő?'],
      ['Tervezd meg', 'a vágásokat!'],
    ],
    subtitles: ['Apró szokások, mérhető hatás.', 'Nézd meg az energiaigényt!', 'A felület is számít.', 'Az anyagveszteséggel is számolj!'],
  },
  {
    slug: 'tevhitek', section: 'TÉVHITEK',
    headlines: [
      ['A kedvezmények', 'nem adódnak össze'],
      ['Drágulás után', 'olcsóbb lesz?'],
      ['Idő, távolság,', 'sebesség'],
      ['Vissza az', 'eredeti árhoz'],
    ],
    subtitles: ['Egy meglepő százalékos tévhit.', 'Az alap mindig változhat.', 'A viszonyítás a lényeg.', 'Számolj, ne csak tippelj!'],
  },
];

const looks = [
  { paper: '#F6F7F3', ink: '#0C2849', blue: '#155FD0', paleblue: '#D8E7F8', tangerine: '#F2A747', cream: '#FFF5E4', line: '#D5E0E9' },
  { paper: '#F7F8FB', ink: '#11243F', blue: '#3468BE', paleblue: '#E0EBF6', tangerine: '#D89056', cream: '#FBF0E4', line: '#CBD8E6' },
  { paper: '#F2F7F6', ink: '#0B394B', blue: '#187BA2', paleblue: '#DBEEEC', tangerine: '#E8A95E', cream: '#FFF3E5', line: '#CBDEDC' },
  { paper: '#FAF7F1', ink: '#172E4B', blue: '#3467B0', paleblue: '#E1EAF4', tangerine: '#E9A657', cream: '#FFF1DC', line: '#D9DDDE' },
];

function rect(x,y,w,h,r,fill,attr=''){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+fill+'" '+attr+'/>';}
function circ(x,y,r,fill,attr=''){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" '+attr+'/>';}
function pathEl(d,fill,attr=''){return '<path d="'+d+'" fill="'+fill+'" '+attr+'/>';}
function line(d,color,width=12){return pathEl(d,'none','stroke="'+color+'" stroke-width="'+width+'" stroke-linecap="round" stroke-linejoin="round"');}
function text(x,y,size,label,color,weight=600,anchor='start'){return '<text x="'+x+'" y="'+y+'" font-family="DejaVu Sans, Arial, sans-serif" font-size="'+size+'" font-weight="'+weight+'" text-anchor="'+anchor+'" fill="'+color+'">'+label+'</text>';}
function objFor(index, q, v) {
  const navy=q.ink, blue=q.blue, warm=q.tangerine, soft=q.paleblue, white='#FFF';
  const shift = v % 2 === 0 ? 0 : 16;
  if(index===0) return [
    rect(316,618,460,220,32,navy),rect(343,643,407,160,18,blue),
    rect(415,691,348,72,18,white),rect(482,718,196,11,5,soft),
    circ(339,819,56,warm),circ(413,817,44,warm),circ(459,811,38,warm),
    circ(714,656,37,warm),line('M 329 820 l 20 0',white,8),
    line('M 546 620 l 0 -26',blue,12),
  ].join('');
  if(index===1) return [
    line('M 244 825 L 853 825',navy,10),
    pathEl('M 278 733 L 344 635 Q 368 603 408 603 L 680 603 Q 713 603 735 632 L 802 726 Q 841 733 842 764 L 842 790 L 264 790 L 264 759 Q 264 743 278 733',blue),
    pathEl('M 391 632 L 651 632 Q 685 632 703 655 L 741 712 L 334 712 Z',soft),
    line('M 529 642 L 529 705',white,10),
    rect(274,736,86,20,9,warm),rect(763,736,57,18,8,warm),
    circ(393,788,62,navy),circ(717,788,62,navy),
    circ(393,788,28,white),circ(717,788,28,white),
    line('M 239 667 L 304 667 M 211 715 L 267 715',warm,12),
  ].join('');
  if(index===2) return [
    rect(330,754,78,117,13,soft),rect(439,700,78,171,13,blue),
    rect(548,646,78,225,13,soft),rect(657,575,78,296,13,blue),
    line('M 334 713 L 479 632 L 567 679 L 730 531',navy,17),
    circ(334,713,19,warm),circ(479,632,19,warm),circ(567,679,19,warm),
    pathEl('M 693 520 L 768 519 L 745 590 Z',warm),
    line('M 310 889 L 784 889',navy,9),
  ].join('');
  if(index===3) return [
    rect(354,577,405,319,42,navy),rect(392,619,329,77,15,white),
    rect(419,647,253,12,6,soft),
    ...Array.from({length:9},(_,k)=>rect(399+(k%3)*102,719+Math.floor(k/3)*57,74,43,12,(k%4===0?warm:soft))),
    rect(268,635,94,127,18,warm),rect(281,658,65,10,4,white),
    rect(281,687,60,10,4,white),rect(281,717,43,10,4,white),
    circ(804,752,37,blue),
  ].join('');
  if(index===4) return [
    rect(303,678,476,205,22,navy),
    rect(326,649,433,203,16,blue),
    rect(379,604,323,63,14,warm),
    rect(388,615,305,31,8,navy),
    rect(369,700,103,100,10,soft),
    rect(494,700,103,100,10,white),
    rect(618,700,103,100,10,soft),
    line('M 302 883 L 793 883',warm,12),
    circ(305,635,28,warm),circ(770,635,28,warm),
  ].join('');
  if(index===5) return [
    pathEl('M 280 691 L 551 507 L 823 691 Z',blue),
    rect(356,673,398,200,16,soft),rect(512,744,97,129,12,navy),
    rect(391,719,75,82,10,white),rect(643,719,75,82,10,white),
    line('M 429 719 L 429 801 M 391 760 L 466 760',blue,6),
    line('M 681 719 L 681 801 M 643 760 L 718 760',blue,6),
    circ(584,809,8,warm),
    pathEl('M 773 581 C 746 536 769 515 787 480 C 836 535 823 566 773 581 Z',warm),
    line('M 786 531 L 787 598',navy,5),
  ].join('');
  return [
    circ(549,722,173,white,'stroke="'+blue+'" stroke-width="29"'),
    text(545,791,206,'?',navy,800,'middle'),
    circ(328,602,53,warm),circ(769,810,41,warm),
    line('M 678 845 L 800 933',navy,38),
    line('M 678 845 L 800 933',warm,15),
    line('M 314 818 L 365 853',blue,12),
  ].join('');
}
function imageSvg(cat, variant) {
  const q=looks[variant], subj=categories[cat], ink=q.ink, blue=q.blue;
  const topPattern=variant===0
    ? circ(970,135,108,q.paleblue,'opacity=".65"')
    : variant===1
      ? pathEl('M 874 52 L 1028 52 L 1028 248 Z',q.paleblue)
      : variant===2
        ? rect(890,94,96,96,21,q.paleblue,'transform="rotate(11 938 142)"')
        : circ(968,149,85,q.cream);
  const panelColor= variant===3 ? q.cream : q.paleblue;
  const title1=subj.headlines[variant][0];
  const title2=subj.headlines[variant][1];
  const titleSize= Math.max(56, 71-Math.max(title1.length,title2.length)-5);
  const art= objFor(cat,q,variant);
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">',
    rect(0,0,1080,1080,0,q.paper),
    topPattern,
    rect(65,64,950,950,34,'#ffffff'),
    rect(98,102,86,67,16,blue),
    text(141,149,34,'KB','#ffffff',800,'middle'),
    text(205,143,29,'KALKULÁTOR BÁZIS',ink,700),
    rect(97,198,132,6,3,q.tangerine),
    text(98,263,25,subj.section,blue,800),
    text(97,361,titleSize,title1,ink,800),
    text(97,440,titleSize,title2,ink,800),
    text(98,506,28,subj.subtitles[variant],ink,400),
    rect(99,552,882,374,28,panelColor),
    // Offset panel and differentiated hand-composed graphic elements
    circ(865,603,70,variant%2===0?q.cream:'#ffffff','opacity=".78"'),
    circ(261,832,51,variant===2?q.tangerine:'#ffffff','opacity=".65"'),
    art,
    line('M 99 955 L 981 955',q.line,2),
    text(101,991,21,'A TÉMÁHOZ KALKULÁTOR IS TARTOZIK',ink,600),
    text(982,991,18,'kalkulatorbazis.hu',blue,700,'end'),
    '</svg>'
  ].join('');
}
if (process.argv[1]?.endsWith('/generate-buffer-editorial-images.mjs')) {
let count=0;
for(let cat=0;cat<categories.length;cat++){
  for(let variant=0;variant<4;variant++){
    const svg=imageSvg(cat,variant);
    if (/[0-9]\s*[×÷=]\s*[0-9]/u.test(svg)) throw new Error('A calculation slipped into image');
    const png = new Resvg(svg, {fitTo:{mode:'width',value:1080}}).render().asPng();
    if(png.subarray(0,8).toString('hex') !== '89504e470d0a1a0a') throw new Error('Invalid PNG');
    const filename=categories[cat].slug+'-'+(variant+1)+'.png';
    fs.writeFileSync(path.join(outDir,filename),png);
    console.log(filename+' '+png.length+' bytes');
    count++;
  }
}
if(count!==28) throw new Error('Expected 28 images, got '+count);
console.log('Finished 28 original editorial PNGs without calculations.');

}
