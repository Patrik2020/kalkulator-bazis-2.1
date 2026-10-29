// Original, number-free evergreen Facebook illustrations for Kalkulátor Bázis.
// The artwork is deterministic and does not rely on an image-generation API key.
// Render only during a one-time asset-building job; the daily publisher uses fixed PNG URLs.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire('/tmp/buffer-social-render/package.json');
const { Resvg } = require('@resvg/resvg-js');

const outputDir = path.resolve('assets/social/facebook');
fs.mkdirSync(outputDir, { recursive: true });

const palettes = [
  { bg: '#eaf5ff', bg2: '#d6ebff', primary: '#126be5', light: '#b7ddff', dark: '#082b58', accent: '#ffbe58', leaf: '#20a77b' },
  { bg: '#f1f7ff', bg2: '#e5e8ff', primary: '#4d60d5', light: '#d6defe', dark: '#1c2554', accent: '#ffb85c', leaf: '#32af97' },
  { bg: '#e9fcfa', bg2: '#d5f5f1', primary: '#137e99', light: '#ade9df', dark: '#0c4059', accent: '#fbbd62', leaf: '#44aa78' },
  { bg: '#fcf3ed', bg2: '#ffebdd', primary: '#b85e43', light: '#ffcdb4', dark: '#45283b', accent: '#f5b655', leaf: '#249b9e' },
];

function rr(x, y, w, h, r, fill, more = '') {
  return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
    '" rx="' + r + '" fill="' + fill + '" ' + more + '/>';
}
function c(x, y, r, fill, more = '') {
  return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '" ' + more + '/>';
}
function pth(d, fill, more = '') {
  return '<path d="' + d + '" fill="' + fill + '" ' + more + '/>';
}
function stroke(d, color, width = 20) {
  return pth(d, 'none', 'stroke="' + color + '" stroke-width="' + width +
    '" stroke-linecap="round" stroke-linejoin="round"');
}
function tx(x, y, size, value, fill, weight = 700, anchor = 'middle') {
  return '<text x="' + x + '" y="' + y +
    '" font-family="DejaVu Sans, Arial, sans-serif" font-size="' + size +
    '" font-weight="' + weight + '" text-anchor="' + anchor +
    '" fill="' + fill + '">' + value + '</text>';
}

const subjects = [
  {
    slug: 'penzugyek', title: 'PÉNZÜGYEK',
    draw: q => [
      c(330, 525, 90, q.light), c(750, 765, 108, q.light),
      rr(270, 520, 530, 267, 52, q.primary),
      rr(310, 555, 490, 205, 34, q.dark),
      rr(408, 605, 450, 100, 32, q.light),
      rr(550, 620, 270, 75, 26, '#ffffff'),
      c(740, 658, 27, q.accent),
      c(315, 773, 55, q.accent), c(380, 745, 45, q.accent),
      c(790, 524, 42, q.accent),
      stroke('M 292 772 L 340 772', '#ffffff', 10),
    ].join(''),
  },
  {
    slug: 'autozas', title: 'AUTÓZÁS',
    draw: q => [
      rr(195, 729, 690, 24, 12, q.light),
      pth('M 247 640 L 295 538 Q 313 511 358 511 L 676 511 Q 712 511 735 548 L 798 623 L 838 637 Q 859 644 859 668 L 859 711 Q 858 732 833 732 L 235 732 Q 211 728 210 704 L 210 669 Q 215 646 247 640 Z', q.primary),
      pth('M 368 544 L 640 544 Q 675 544 700 577 L 730 618 L 310 618 Z', q.light),
      stroke('M 510 555 L 510 615', '#ffffff', 13),
      rr(258, 655, 100, 22, 11, q.accent),
      rr(753, 655, 61, 22, 11, q.accent),
      c(351, 715, 75, q.dark), c(717, 715, 75, q.dark),
      c(351, 715, 34, '#ffffff'), c(717, 715, 34, '#ffffff'),
      stroke('M 178 579 L 258 579 M 147 633 L 212 633', q.primary, 19),
    ].join(''),
  },
  {
    slug: 'befektetes', title: 'BEFEKTETÉSEK',
    draw: q => [
      rr(230, 677, 96, 128, 20, q.light),
      rr(363, 603, 96, 202, 20, q.primary),
      rr(496, 536, 96, 269, 20, q.light),
      rr(629, 467, 96, 338, 20, q.primary),
      stroke('M 238 672 L 385 582 L 521 627 L 690 452 L 816 486', q.dark, 24),
      pth('M 791 428 L 848 483 L 768 503 Z', q.accent),
      c(243, 673, 24, q.accent), c(388, 583, 24, q.accent),
      c(520, 627, 24, q.accent), c(688, 452, 24, q.accent),
      stroke('M 215 832 L 825 832', q.dark, 12),
    ].join(''),
  },
  {
    slug: 'matek', title: 'MINDENNAPI MATEK',
    draw: q => {
      const buttons = [];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          buttons.push(rr(396 + col * 103, 613 + row * 90, 73, 61, 17,
            (row + col) % 3 === 0 ? q.accent : q.light));
        }
      }
      return [
        rr(335, 425, 425, 445, 54, q.dark),
        rr(382, 478, 331, 110, 23, '#ffffff'),
        rr(410, 512, 242, 20, 9, q.light),
        ...buttons,
        c(282, 505, 44, q.accent),
        c(800, 753, 49, q.accent),
        stroke('M 275 506 L 290 506 M 282 497 L 282 515', '#ffffff', 10),
      ].join('');
    },
  },
  {
    slug: 'gazdasag', title: 'GAZDASÁG',
    draw: q => [
      rr(240, 554, 600, 280, 33, q.dark),
      rr(300, 472, 482, 340, 25, q.primary),
      rr(380, 430, 318, 60, 20, q.accent),
      rr(403, 444, 274, 37, 16, q.dark),
      rr(317, 580, 129, 171, 15, q.light),
      rr(472, 533, 129, 218, 15, '#ffffff'),
      rr(626, 490, 129, 261, 15, q.light),
      stroke('M 273 813 L 818 813', q.accent, 16),
      c(269, 476, 35, q.accent),
      c(822, 476, 35, q.accent),
    ].join(''),
  },
  {
    slug: 'otthon', title: 'OTTHON ÉS FELÚJÍTÁS',
    draw: q => [
      pth('M 210 575 L 540 356 L 870 575 Z', q.primary),
      rr(292, 558, 497, 278, 23, q.light),
      rr(464, 641, 150, 195, 18, q.dark),
      c(577, 739, 11, q.accent),
      rr(331, 611, 100, 99, 15, '#ffffff'),
      rr(659, 611, 100, 99, 15, '#ffffff'),
      stroke('M 381 614 L 381 710 M 330 660 L 431 660', q.primary, 10),
      stroke('M 710 614 L 710 710 M 659 660 L 759 660', q.primary, 10),
      pth('M 718 474 L 755 436 Q 793 474 771 506 Q 739 521 718 474', q.leaf),
      pth('M 780 497 L 815 466 Q 839 495 827 530 Q 790 531 780 497', q.leaf),
    ].join(''),
  },
  {
    slug: 'tevhitek', title: 'TÉVHITEK',
    draw: q => [
      c(506, 590, 185, q.light),
      c(506, 590, 151, '#ffffff'),
      c(506, 590, 128, q.primary),
      stroke('M 608 698 L 776 829', q.dark, 57),
      stroke('M 608 698 L 776 829', q.accent, 24),
      stroke('M 450 551 C 450 468 572 469 572 551 C 572 594 506 611 506 654', '#ffffff', 37),
      c(507, 716, 22, '#ffffff'),
      c(311, 430, 29, q.accent), c(767, 443, 36, q.accent),
      stroke('M 272 709 L 331 745', q.leaf, 19),
    ].join(''),
  },
];

function svgFor(subject, palette, variant) {
  const q = palette;
  const decor = variant % 2 === 0
    ? c(125, 905, 86, q.bg2) + c(938, 200, 63, q.bg2)
    : c(932, 907, 106, q.bg2) + c(114, 272, 55, q.bg2);
  const dots = [0, 1, 2, 3, 4].map((k) =>
    c(145 + k * 38, 862, 8, k % 2 ? q.accent : q.primary)).join('');
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">',
    '<defs>',
    '<linearGradient id="back" x1="0" y1="0" x2="1" y2="1"><stop stop-color="' + q.bg +
      '"/><stop offset="1" stop-color="' + q.bg2 + '"/></linearGradient>',
    '<filter id="shade" x="-15%" y="-15%" width="130%" height="150%"><feGaussianBlur stdDeviation="22"/></filter>',
    '</defs>',
    rr(0, 0, 1080, 1080, 0, 'url(#back)'),
    decor,
    rr(82, 130, 916, 838, 63, q.dark, 'opacity="0.14" transform="translate(0 20)" filter="url(#shade)"'),
    rr(82, 118, 916, 838, 63, '#ffffff'),
    rr(125, 158, 112, 58, 20, q.primary),
    tx(181, 198, 35, 'KB', '#ffffff', 800),
    tx(256, 197, 27, 'KALKULÁTOR BÁZIS', q.dark, 700, 'start'),
    rr(127, 261, 826, 8, 4, q.accent),
    tx(540, 355, subject.title.length > 17 ? 49 : 64, subject.title, q.dark, 800),
    c(540, 621, 250, q.bg2, 'opacity="0.6"'),
    subject.draw(q),
    dots,
    tx(540, 921, 29, 'EGYSZERŰEN, ÉRTHETŐEN', q.dark, 700),
    '</svg>',
  ].join('');
}

let total = 0;
for (const subject of subjects) {
  for (let variant = 0; variant < palettes.length; variant++) {
    const svg = svgFor(subject, palettes[variant], variant);
    if (/[0-9]\s*[×÷=]\s*[0-9]/u.test(svg)) throw new Error('Calculation text in image');
    const renderer = new Resvg(svg, { fitTo: { mode: 'width', value: 1080 } });
    const image = renderer.render().asPng();
    if (image.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
      throw new Error('Invalid PNG produced');
    }
    const filename = subject.slug + '-' + (variant + 1) + '.png';
    fs.writeFileSync(path.join(outputDir, filename), image);
    console.log(filename + ': ' + image.length + ' bytes');
    total++;
  }
}
console.log('Created ' + total + ' number-free illustrations.');
