// Maps a curated weekday post to its original, calculation-free illustration.
const SLUGS = [
  'penzugyek', 'autozas', 'befektetes', 'matek',
  'gazdasag', 'otthon', 'tevhitek',
];

export const IMAGE_ORIGIN = 'https://raw.githubusercontent.com/Patrik2020/kalkulator-bazis-2.1/main/assets/social/facebook/';

export function imageForDate(dateISO) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) throw new Error('Invalid date format.');
  const day = new Date(dateISO + 'T12:00:00Z');
  if (!Number.isFinite(day.getTime()) || day.toISOString().slice(0, 10) !== dateISO) {
    throw new Error('Invalid date.');
  }
  const monday = Date.UTC(2026, 9, 26);
  const week = Math.max(0, Math.floor((day.getTime() - monday) / (7 * 86400000)));
  const weekday = day.getUTCDay();
  const category = weekday === 0 ? 6 : weekday - 1;
  const variant = (week % 4) + 1;
  const file = SLUGS[category] + '-' + variant + '.png';
  return { category, variant, file, url: IMAGE_ORIGIN + file };
}
