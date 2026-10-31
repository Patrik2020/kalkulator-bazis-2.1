// Real photographic campaign cards (not vector/AI artwork).
// All imagery: Pexels free photos, selected by topic and stored as derived PNGs.
// The original unaltered KB brand logo is loaded from favicon/kb-logo-mark.png.
// Images feature NO calculations, invented banknote amounts, or data overlays.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { categories } from './generate-buffer-editorial-images.mjs';

const require = createRequire('/tmp/buffer-social-render/package.json');
const { Resvg } = require('@resvg/resvg-js');
const OUT = path.resolve('assets/social/facebook/photographic');
fs.mkdirSync(OUT, { recursive: true });

const photoIds = [
  [7111589,6694492], // money, budgeting
  [29370541,20500733], // real cars being refueled
  [8062355,7567556], // investment analysis
  [8250947,8472944], // calculations in real life
  [6694965,6694492], // pay/financial calculations
  [11208978,31493645], // actual faucets
  [8250939,16211537], // everyday maths and shopping
];
const palettes = [
  { ink:'#0B2447', blue:'#1263D9', accent:'#E5A64C', paper:'#FAFAF8', wash:'#EEF3F8' },
  { ink:'#0F2C43', blue:'#126A9E', accent:'#F4AD57', paper:'#FAFAF8', wash:'#E8F2F5' },
  { ink:'#132D44', blue:'#255EB5', accent:'#D79D64', paper:'#FBFCFA', wash:'#EBF0F6' },
  { ink:'#0D2A4B', blue:'#176DA9', accent:'#EBA34C', paper:'#FAFCFC', wash:'#EBF2F7' },
];

function esc(value) {
  return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function text(x,y,size,value,color,weight=700,extra='') {
  return '<text x="'+x+'" y="'+y+'" font-family="DejaVu Sans, Arial, sans-serif" font-size="'+size+
    '" font-weight="'+weight+'" fill="'+color+'" '+extra+'>'+esc(value)+'</text>';
}
async function getPhoto(id) {
  const url = 'https://images.pexels.com/photos/'+id+'/pexels-photo-'+id+
    '.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1100&fit=crop';
  const response = await fetch(url, {
    headers: { 'User-Agent': 'KalkulatorBazisSocialArtwork/1.0' },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error('Pexels photo download failed: '+id+' HTTP '+response.status);
  const type=response.headers.get('content-type') || '';
  if (!type.startsWith('image/')) throw new Error('Not an image from Pexels: '+id+' '+type);
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.length < 5000 || bytes.length > 12_000_000) throw new Error('Unexpected photo length for '+id);
  if(bytes[0]!==0xff || bytes[1]!==0xd8) throw new Error('Unexpected photo type (expected JPEG) '+id);
  return bytes;
}

const logo = fs.readFileSync('favicon/kb-logo-mark.png');
if (logo.subarray(0,8).toString('hex')!=='89504e470d0a1a0a') {
  throw new Error('Canonical KB logo not found or invalid PNG.');
}
const logoData = 'data:image/png;base64,'+logo.toString('base64');
const cache=new Map();
let finished=0;
for(let category=0;category<7;category++){
  for(let variant=0;variant<4;variant++){
    const photoId=photoIds[category][variant%2];
    if(!cache.has(photoId))cache.set(photoId,await getPhoto(photoId));
    const photoData='data:image/jpeg;base64,'+cache.get(photoId).toString('base64');
    const q=palettes[variant],item=categories[category];
    if(!item || !item.headlines?.[variant]) throw new Error('Missing curated title for '+category+'/'+variant);
    const [headline1,headline2]=item.headlines[variant];
    const chars=Math.max(headline1.length,headline2.length);
    const headlineSize=chars>24?61:chars>20?68:chars>16?74:82;
    // Top panel is designed with readable source typography; photo remains real.
    const svg=[
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">',
      '<defs><clipPath id="photo"><rect x="52" y="489" width="976" height="481" rx="21"/></clipPath>',
      '<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffffff" stop-opacity="0.19"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>',
      '</defs>',
      '<rect width="1080" height="1080" fill="'+q.paper+'"/>',
      '<rect x="0" y="0" width="1080" height="482" fill="#ffffff"/>',
      // Brand mark is embedded pixel-for-pixel from the site's REAL logo asset.
      '<image x="62" y="53" width="91" height="91" href="'+logoData+'" preserveAspectRatio="xMidYMid meet"/>',
      '<rect x="169" y="70" width="2" height="58" fill="#CFD8E2"/>',
      text(194,113,29,'KALKULÁTOR BÁZIS',q.ink,750),
      '<rect x="62" y="171" width="136" height="5" rx="2" fill="'+q.accent+'"/>',
      text(62,235,26,item.section,q.blue,800,'letter-spacing="3"'),
      text(58,331,headlineSize,headline1,q.ink,800),
      text(58,418,headlineSize,headline2,q.ink,800),
      '<rect x="52" y="489" width="976" height="481" rx="21" fill="'+q.wash+'"/>',
      '<g clip-path="url(#photo)">',
      '<image x="52" y="489" width="976" height="481" href="'+photoData+'" preserveAspectRatio="xMidYMid slice"/>',
      '<rect x="52" y="489" width="976" height="130" fill="url(#fade)"/>',
      '</g>',
      '<rect x="52" y="985" width="976" height="1" fill="#C8D8E6"/>',
      text(63,1024,20,item.subtitles[variant],q.ink,500),
      text(1020,1024,22,'kalkulatorbazis.hu',q.blue,700,'text-anchor="end"'),
      '</svg>',
    ].join('');
    if (/[0-9]\s*[+÷×=]\s*[0-9]/.test(headline1+headline2)) throw new Error('Arithmetic in headline prohibited');
    const png=new Resvg(svg,{fitTo:{mode:'width',value:1080}}).render().asPng();
    if(png.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw new Error('Invalid rendered PNG');
    const filename=item.slug+'-'+(variant+1)+'.png';
    fs.writeFileSync(path.join(OUT,filename),png);
    console.log(filename+' from Pexels photo '+photoId+' ('+png.length+' bytes)');
    finished++;
  }
}
if(finished!==28)throw new Error('Not all 28 photos rendered');
console.log('SUCCESS: 28 photographic 1080px campaign graphics, real KB logo, no calculations.');
