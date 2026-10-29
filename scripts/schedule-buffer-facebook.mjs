import { renderPost } from './buffer-facebook-post-bank.mjs';

const TIME_ZONE = 'Europe/Budapest';
const PAGE_ID = '1427930577066568';
const ENDPOINT = 'https://api.buffer.com';

export function localDateISO(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return p.year + '-' + p.month + '-' + p.day;
}

export function nextLocalDateISO(now = new Date()) {
  const [y, m, d] = localDateISO(now).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
}

export function dueAtEightBudapest(dateISO) {
  const [y, m, d] = dateISO.split('-').map(Number);
  const probe = new Date(Date.UTC(y, m - 1, d, 7, 0, 0));
  const hour = Number(new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE, hour: '2-digit', hourCycle: 'h23',
  }).format(probe));
  if (hour !== 8 && hour !== 9) throw new Error('Unexpected Budapest UTC offset.');
  return new Date(Date.UTC(y, m - 1, d, 15 - hour, 0, 0)).toISOString();
}

async function bufferQuery(token, query) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error('Buffer API HTTP ' + res.status);
  const payload = await res.json();
  if (payload.errors?.length) throw new Error(payload.errors.map(e => e.message).join('; '));
  if (!payload.data) throw new Error('Buffer API response lacks data.');
  return payload.data;
}

async function getConnectedFacebook(token) {
  const orgData = await bufferQuery(token, 'query { account { organizations { id } } }');
  for (const org of orgData.account?.organizations || []) {
    const channels = await bufferQuery(token, 'query { channels(input: { organizationId: ' +
      JSON.stringify(org.id) + ' }) { id name service serviceId isDisconnected isLocked } }');
    const channel = channels.channels?.find(c => c.service === 'facebook' && c.serviceId === PAGE_ID);
    if (channel) {
      if (channel.isDisconnected || channel.isLocked) throw new Error('Facebook channel disconnected or locked.');
      return { organizationId: org.id, channelId: channel.id };
    }
  }
  throw new Error('Expected Facebook Page not found in Buffer account.');
}

function gq(value) {
  return JSON.stringify(value);
}

async function existingPostsForDay(token, organizationId, channelId, dateISO) {
  // Ask for the current queue and recently created posts. Fail closed if pagination hides data.
  const before = new Date(dateISO + 'T00:00:00Z');
  before.setUTCDate(before.getUTCDate() - 1);
  const after = new Date(dateISO + 'T00:00:00Z');
  after.setUTCDate(after.getUTCDate() + 2);
  const query = 'query { posts(first: 100, input: { organizationId: ' + gq(organizationId) +
    ', filter: {channelIds: [' + gq(channelId) + '], startDate: ' + gq(before.toISOString()) +
    ', endDate: ' + gq(after.toISOString()) +
    '} }) { edges { node { id dueAt status text } } pageInfo { hasNextPage } } }';
  const result = await bufferQuery(token, query);
  if (result.posts?.pageInfo?.hasNextPage) throw new Error('Post history paginated: unsafe to schedule without reviewing all results.');
  if (!Array.isArray(result.posts?.edges)) throw new Error('Could not read Buffer post history.');
  return result.posts.edges.map(e => e.node).filter(p => p && p.dueAt &&
    localDateISO(new Date(p.dueAt)) === dateISO);
}

export async function scheduleTomorrow({ dryRun = true, now = new Date() } = {}) {
  const dateISO = nextLocalDateISO(now);
  const dueAt = dueAtEightBudapest(dateISO);
  const text = renderPost(dateISO);
  if (text.length < 80 || text.length > 1800 || /https?:\/\//.test(text)) {
    throw new Error('Post content validation failed.');
  }
  if (new Date(dueAt).getTime() <= now.getTime() + 60_000) throw new Error('Target time is not safely in the future.');
  console.log('Target: ' + dateISO + ' 08:00 Europe/Budapest / ' + dueAt);
  if (dryRun) {
    console.log('[DRY RUN] No Buffer write. Content:\n' + text);
    return { dateISO, dueAt, text, dryRun: true };
  }

  const token = process.env.BUFFER_API_KEY;
  if (!token) throw new Error('Missing BUFFER_API_KEY GitHub secret.');
  const { organizationId, channelId } = await getConnectedFacebook(token);
  const existing = await existingPostsForDay(token, organizationId, channelId, dateISO);
  if (existing.length > 0) {
    console.log('Skipping: existing Facebook post for the target local calendar date. Post count: ' + existing.length);
    return { dateISO, skipped: true };
  }

  const mutation = 'mutation { createPost(input: { text: ' + gq(text) +
    ', channelId: ' + gq(channelId) +
    ', schedulingType: automatic, mode: customScheduled, metadata: { facebook: { type: post } }, dueAt: ' + gq(dueAt) +
    ' }) { ... on PostActionSuccess { post { id dueAt text assets { id } } } ' +
    '... on MutationError { message } } }';
  const response = await bufferQuery(token, mutation);
  if (!response.createPost?.post?.id) {
    throw new Error('Buffer did not confirm scheduling: ' +
      (response.createPost?.message || 'unknown error. Check Buffer before retrying.'));
  }
  const post = response.createPost.post;
  if (new Date(post.dueAt).getTime() !== new Date(dueAt).getTime() || post.text !== text || (post.assets?.length ?? -1) !== 0) {
    throw new Error('Buffer returned an unexpected schedule/text/media. Review the Buffer queue before retrying.');
  }
  console.log('Scheduled text-only post ID: ' + post.id + '; local date ' + dateISO);
  return { dateISO, postId: post.id, dueAt };
}

if (process.argv[1]?.endsWith('/schedule-buffer-facebook.mjs')) {
  const dryRun = process.env.ALLOW_BUFFER_POSTING !== 'true';
  scheduleTomorrow({ dryRun }).catch(error => {
    console.error('Buffer scheduling failed: ' + error.message);
    process.exitCode = 1;
  });
}
