import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { renderPost } from './buffer-facebook-post-bank.mjs';
import { imageForDate } from './buffer-facebook-images.mjs';
import { FACEBOOK_CALCULATOR_SLUGS, calculatorForDate, renderPostWithCalculator } from './buffer-facebook-calculator-links.mjs';
import { dueAtEightBudapest, scheduleTomorrow } from './schedule-buffer-facebook.mjs';

const pageId = '1427930577066568';
const runDate = '2026-10-31';
const runNow = new Date('2026-10-30T07:20:00.000Z');
const dueAt = dueAtEightBudapest(runDate);

test('all 28 post links lead to actual calculator HTML pages listed in sitemap', () => {
  const sitemap = fs.readFileSync(path.resolve('sitemap.xml'), 'utf8');
  assert.equal(FACEBOOK_CALCULATOR_SLUGS.length, 7);
  for (let weekday = 0; weekday < 7; weekday++) {
    assert.equal(FACEBOOK_CALCULATOR_SLUGS[weekday].length, 4);
    for (let week = 0; week < 4; week++) {
      const date = new Date(Date.UTC(2026, 9, 26 + weekday + week * 7)).toISOString().slice(0, 10);
      const { slug, url } = calculatorForDate(date);
      assert.equal(slug, FACEBOOK_CALCULATOR_SLUGS[weekday][week]);
      assert.ok(imageForDate(date).category === weekday);
      assert.ok(fs.existsSync(path.resolve('kalkulatorok', slug + '.html')), slug + ' missing');
      assert.ok(sitemap.includes('<loc>' + url + '</loc>'), url + ' missing in sitemap');
      const sourceText = renderPost(date);
      const caption = renderPostWithCalculator(date);
      assert.ok(caption.startsWith(sourceText.slice(0, sourceText.lastIndexOf(' #'))));
      assert.match(caption, /👉 Számolj te is a kapcsolódó kalkulátorral:\nhttps:\/\/kalkulatorbazis\.hu\/kalkulatorok\/[a-z0-9-]+-kalkulator\n\n#[^\n]+$/u);
      assert.equal((caption.match(/https?:\/\//g) || []).length, 1);
      assert.ok(caption.length <= 1800);
    }
  }
});

test('sample topics use relevant specific calculator links, not a generic homepage', () => {
  assert.equal(calculatorForDate('2026-10-30').slug, 'szazalek-kalkulator');
  assert.equal(calculatorForDate('2026-10-31').slug, 'vizfogyasztas-kalkulator');
  assert.equal(calculatorForDate('2026-11-05').slug, 'ar-kedvezmeny-kalkulator');
  assert.equal(calculatorForDate('2026-11-12').slug, 'egysegar-kalkulator');
  assert.equal(calculatorForDate('2026-11-20').slug, 'afa-kalkulator');
  assert.throws(() => calculatorForDate('2026-02-30'));
});

function mockBufferQueue(existing, requests) {
  const imageBytes = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 1]);
  const linkedText = renderPostWithCalculator(runDate);
  const png = imageForDate(runDate);
  return async (url, options) => {
    if (url === png.url) {
      return { ok: true, status: 200,
        headers: new Headers({ 'content-type': 'image/png' }),
        arrayBuffer: async () => imageBytes.buffer };
    }
    assert.equal(url, 'https://api.buffer.com');
    const query = JSON.parse(options.body).query;
    requests.push(query);
    let data;
    if (query.includes('account { organizations')) {
      data = { account: { organizations: [{ id: 'org1' }] } };
    } else if (query.includes('channels(input:')) {
      data = { channels: [{ id: 'ch1', service: 'facebook', serviceId: pageId,
        isDisconnected: false, isLocked: false }] };
    } else if (query.includes('posts(first:')) {
      data = { posts: { edges: existing ? [{ node: existing }] : [], pageInfo: { hasNextPage: false } } };
    } else if (query.includes('editPost(')) {
      data = { editPost: { post: { id: 'queued-1', text: linkedText, dueAt,
        assets: [{ id: 'image-1', mimeType: 'image/png' }] } } };
    } else if (query.includes('createPost(')) {
      data = { createPost: { post: { id: 'new-1', text: linkedText, dueAt,
        assets: [{ id: 'image-1', mimeType: 'image/png' }] } } };
    } else throw new Error('Unexpected Buffer GraphQL query: ' + query);
    return { ok: true, status: 200, json: async () => ({ data }) };
  };
}
async function withFakeBuffer(existing, action) {
  const oldFetch = globalThis.fetch, oldToken = process.env.BUFFER_API_KEY;
  const requests = [];
  try {
    process.env.BUFFER_API_KEY = 'dummy-token-for-test';
    globalThis.fetch = mockBufferQueue(existing, requests);
    const response = await scheduleTomorrow({ dryRun: false, now: runNow });
    action(response, requests);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldToken === undefined) delete process.env.BUFFER_API_KEY;
    else process.env.BUFFER_API_KEY = oldToken;
  }
}

test('queued image+text from earlier release gets calculator URL without duplication', { concurrency: false }, async () => {
  await withFakeBuffer({ id: 'queued-1', dueAt, status: 'scheduled',
    text: renderPost(runDate), assets: [{ id: 'image-1', mimeType: 'image/png' }] },
  (result, requests) => {
    assert.equal(result.upgraded, true);
    assert.equal(result.postId, 'queued-1');
    const edits = requests.filter(query => query.includes('editPost('));
    assert.equal(edits.length, 1);
    assert.equal(requests.filter(query => query.includes('createPost(')).length, 0);
    assert.ok(edits[0].includes('metadata: { facebook: { type: post } }'));
    assert.ok(edits[0].includes('assets: [{ image: { url: '));
    assert.ok(edits[0].includes(calculatorForDate(runDate).url));
  });
});

test('already linked and illustrated queued post never gets a duplicate', { concurrency: false }, async () => {
  await withFakeBuffer({ id: 'queued-1', dueAt, status: 'scheduled',
    text: renderPostWithCalculator(runDate), assets: [{ id: 'image-1', mimeType: 'image/png' }] },
  (result, requests) => {
    assert.equal(result.skipped, true);
    assert.equal(requests.filter(query => query.includes('editPost(') || query.includes('createPost(')).length, 0);
  });
});

test('existing manual Facebook content is never silently overwritten', { concurrency: false }, async () => {
  await withFakeBuffer({ id: 'queued-1', dueAt, status: 'scheduled',
    text: 'Manual editorial post', assets: [{ id: 'image-1', mimeType: 'image/png' }] },
  (result, requests) => {
    assert.equal(result.skipped, true);
    assert.equal(requests.filter(query => query.includes('editPost(') || query.includes('createPost(')).length, 0);
  });
});

test('new Facebook posts include exactly one calculator URL alongside image', { concurrency: false }, async () => {
  await withFakeBuffer(null, (result, requests) => {
    assert.equal(result.postId, 'new-1');
    const create = requests.filter(query => query.includes('createPost('));
    assert.equal(create.length, 1);
    assert.ok(create[0].includes(calculatorForDate(runDate).url));
    assert.ok(create[0].includes('assets: [{ image: { url: '));
    assert.ok(create[0].includes('metadata: { facebook: { type: post } }'));
  });
});
