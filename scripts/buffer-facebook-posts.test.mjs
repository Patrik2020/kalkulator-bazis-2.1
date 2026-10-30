import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { renderPost, FACEBOOK_POST_BANK } from './buffer-facebook-post-bank.mjs';
import { nextLocalDateISO, dueAtEightBudapest } from './schedule-buffer-facebook.mjs';
import { imageForDate, IMAGE_ORIGIN } from './buffer-facebook-images.mjs';

test('every weekday has four curated unique posts with no media/links', () => {
  assert.equal(FACEBOOK_POST_BANK.length, 7);
  for (const variants of FACEBOOK_POST_BANK) {
    assert.equal(variants.length, 4);
    assert.equal(new Set(variants).size, 4);
    for (const text of variants) {
      assert.ok(text.length >= 80 && text.length <= 1800);
      assert.ok(!/https?:\/\//.test(text));
      assert.ok((text.match(/#/g) || []).length <= 3);
    }
  }
});

test('one weekly category, four-week variant rotation', () => {
  const mondays = ['2026-10-26', '2026-11-02', '2026-11-09', '2026-11-16'];
  assert.equal(new Set(mondays.map(renderPost)).size, 4);
  assert.equal(renderPost('2026-10-30'), FACEBOOK_POST_BANK[4][0]);
  assert.equal(renderPost('2026-11-01'), FACEBOOK_POST_BANK[6][0]);
});

test('invalid dates fail closed', () => {
  assert.throws(() => renderPost('2026-02-30'));
  assert.throws(() => renderPost('oops'));
});

test('08:00 Budapest respects CET and CEST transitions', () => {
  assert.equal(dueAtEightBudapest('2026-10-30'), '2026-10-30T07:00:00.000Z');
  assert.equal(dueAtEightBudapest('2027-03-28'), '2027-03-28T06:00:00.000Z');
  assert.equal(dueAtEightBudapest('2027-01-15'), '2027-01-15T07:00:00.000Z');
});

test('tomorrow uses the Budapest local calendar, not UTC midnight', () => {
  assert.equal(nextLocalDateISO(new Date('2026-10-29T23:30:00Z')), '2026-10-31');
  assert.equal(nextLocalDateISO(new Date('2026-10-29T12:00:00Z')), '2026-10-30');
});

test('each category has four distinctive original PNG illustrations with no numeric overlays', () => {
  const files = new Set();
  for (let weekday = 0; weekday < 7; weekday++) {
    for (let variant = 0; variant < 4; variant++) {
      const date = new Date(Date.UTC(2026, 9, 26 + weekday + variant * 7)).toISOString().slice(0, 10);
      const item = imageForDate(date);
      assert.equal(item.variant, variant + 1);
      assert.equal(item.category, weekday);
      assert.equal(item.url, IMAGE_ORIGIN + item.file);
      assert.match(item.file, /^[a-z-]+-[1-4]\.png$/);
      const buffer = fs.readFileSync(path.resolve('assets/social/facebook/editorial', item.file));
      assert.equal(buffer.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      assert.equal(buffer.readUInt32BE(16), 1080);
      assert.equal(buffer.readUInt32BE(20), 1080);
      files.add(item.file);
    }
  }
  assert.equal(files.size, 28);
});

test('image selection follows the content bank for Sundays and year transitions', () => {
  assert.equal(imageForDate('2026-11-01').file, 'tevhitek-1.png');
  assert.equal(imageForDate('2026-10-30').file, 'gazdasag-1.png');
  assert.equal(imageForDate('2026-11-06').file, 'gazdasag-2.png');
  assert.equal(imageForDate('2026-12-01').file, 'autozas-2.png');
  assert.throws(() => imageForDate('2026-02-30'));
});
