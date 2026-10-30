import { renderPost } from './buffer-facebook-post-bank.mjs';
import { imageForDate } from './buffer-facebook-images.mjs';

// 7 weekday topics × 4 weekly variants. Each slug is verified against
// the site's published sitemap and the corresponding calculator HTML.
export const FACEBOOK_CALCULATOR_SLUGS = [
  // Monday — savings and household finance
  ['megtakaritasi-cel-kalkulator', 'havi-koltsegvetes-kalkulator', 'vesztartalek-kalkulator', 'havi-koltsegvetes-kalkulator'],
  // Tuesday — fuel economy and driving costs
  ['uzemanyag-koltseg-kalkulator', 'auto-fogyasztas-kalkulator', 'auto-fogyasztas-kalkulator', 'uzemanyag-koltseg-kalkulator'],
  // Wednesday — investment and compounding
  ['szazalekos-valtozas-kalkulator', 'szazalekos-valtozas-kalkulator', 'kamatos-kamat-kalkulator', 'etf-kalkulator'],
  // Thursday — everyday calculations
  ['rezsi-megosztas-kalkulator', 'ar-kedvezmeny-kalkulator', 'egysegar-kalkulator', 'szazalekos-valtozas-kalkulator'],
  // Friday — income, business, price changes and tax examples
  ['szazalek-kalkulator', 'fedezeti-pont-kalkulator', 'szazalekos-valtozas-kalkulator', 'afa-kalkulator'],
  // Saturday — household utilities and DIY
  ['vizfogyasztas-kalkulator', 'villanyfogyasztas-koltseg-kalkulator', 'festek-kalkulator', 'szegolec-kalkulator'],
  // Sunday — percentage myths and travel-time calculations
  ['ar-kedvezmeny-kalkulator', 'szazalekos-valtozas-kalkulator', 'utazasi-ido-kalkulator', 'szazalekos-valtozas-kalkulator'],
];

const CALCULATOR_ORIGIN = 'https://kalkulatorbazis.hu/kalkulatorok/';

export function calculatorForDate(dateISO) {
  const { category, variant } = imageForDate(dateISO);
  const slug = FACEBOOK_CALCULATOR_SLUGS[category]?.[variant - 1];
  if (!slug || !/^[a-z0-9-]+-kalkulator$/.test(slug)) {
    throw new Error('No approved matching calculator for this scheduled Facebook post.');
  }
  return { slug, url: CALCULATOR_ORIGIN + slug };
}

export function renderPostWithCalculator(dateISO) {
  const source = renderPost(dateISO);
  const { url } = calculatorForDate(dateISO);
  // Keep hashtags at the end for a natural Facebook caption, with a clean
  // standalone clickable URL above them, even on image+text posts.
  const hashtagMatch = source.match(/(\s+#[^\s#]+(?:\s+#[^\s#]+)*)$/u);
  if (!hashtagMatch) throw new Error('Facebook caption has no trailing topic hashtag.');
  const body = source.slice(0, -hashtagMatch[0].length).trimEnd();
  const hashtags = hashtagMatch[0].trim();
  const caption = body +
    '\n\n👉 Számolj te is a kapcsolódó kalkulátorral:\n' + url +
    '\n\n' + hashtags;
  if ((caption.match(/https?:\/\//g) || []).length !== 1 ||
      !caption.includes('\n' + url + '\n') || caption.length > 1800) {
    throw new Error('Invalid calculator link or caption length.');
  }
  return caption;
}
