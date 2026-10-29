// One-time, text-only Facebook publication requested for 2026-10-29.
// A future rerun is deliberately blocked by a Budapest-calendar date guard.
const EXPECTED_DATE = '2026-10-29';
const EXPECTED_PAGE_ID = '1427930577066568';
const POST_TEXT = "🛒 A nagyobb kiszerelés tényleg olcsóbb? Nézzük meg kilónként!\n\nUgyanabból a termékből két csomag van a polcon:\n• 500 gramm: 990 Ft\n• 750 gramm: 1 410 Ft\n\nKilogrammra számolva:\n• 990 ÷ 0,5 = 1 980 Ft/kg\n• 1 410 ÷ 0,75 = 1 880 Ft/kg\n\nHa 1,5 kilogrammra van szükséged, a kisebből 3 csomag 2 970 Ft, a nagyobból 2 csomag 2 820 Ft. A különbség 150 Ft.\n\n💡 Nem a csomag ára, hanem az egységár mutatja meg, melyik a kedvezőbb. Persze csak akkor érdemes többet venni, ha valóban el is használod.\n\n#KalkulátorBázis #TudatosVásárlás";

function budapestDateISO(d = new Date()) {
  const pieces = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Budapest', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(d);
  const parts = Object.fromEntries(pieces.map(({ type, value }) => [type, value]));
  return [parts.year, parts.month, parts.day].join('-');
}

async function queryBuffer(key, query) {
  const response = await fetch('https://api.buffer.com', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error('Buffer API HTTP ' + response.status);
  const json = await response.json();
  if (json.errors?.length) throw new Error(json.errors.map(e => e.message).join('; '));
  if (!json.data) throw new Error('Missing Buffer API data');
  return json.data;
}

async function main() {
  const today = budapestDateISO();
  if (today !== EXPECTED_DATE) {
    throw new Error('One-time 2026-10-29 publish is disabled on ' + today);
  }
  if (process.env.PUBLISH_TODAY !== 'true') {
    console.log('DRY RUN only – no Buffer access or Facebook publishing.');
    console.log(POST_TEXT);
    return;
  }
  const key = process.env.BUFFER_API_KEY;
  if (!key) throw new Error('Missing GitHub secret BUFFER_API_KEY');
  const { account } = await queryBuffer(key, 'query { account { organizations { id } } }');
  let channel;
  let organizationId;
  for (const org of account?.organizations ?? []) {
    const data = await queryBuffer(key, 'query { channels(input: { organizationId: ' +
      JSON.stringify(org.id) + ' }) { id name service serviceId isDisconnected isLocked } }');
    channel = data.channels?.find(c => c.service === 'facebook' && c.serviceId === EXPECTED_PAGE_ID);
    if (channel) { organizationId = org.id; break; }
  }
  if (!channel || channel.isLocked || channel.isDisconnected) {
    throw new Error('Kalkulátor bázis Facebook Page not connected in Buffer.');
  }

  const data = await queryBuffer(key, 'query { posts(first: 100, input: { organizationId: ' +
    JSON.stringify(organizationId) + ', filter: { channelIds: [' + JSON.stringify(channel.id) +
    '], startDate: "2026-10-28T00:00:00.000Z", endDate: "2026-10-31T00:00:00.000Z" } }) {' +
    ' edges { node { id status text dueAt sentAt createdAt } } pageInfo { hasNextPage } } }');
  if (!Array.isArray(data.posts?.edges) || data.posts.pageInfo?.hasNextPage) {
    throw new Error('Buffer history incomplete; publication blocked to avoid duplicates.');
  }
  const todayPosts = data.posts.edges.map(e => e.node).filter(p => p &&
    (p.sentAt || p.dueAt || p.createdAt) &&
    budapestDateISO(new Date(p.sentAt || p.dueAt || p.createdAt)) === EXPECTED_DATE
  );
  if (todayPosts.length) {
    console.log('Not posting: Buffer already records a Facebook post for today: ' +
      todayPosts.map(p => p.id).join(', '));
    return;
  }

  const mutation = 'mutation { createPost(input: { text: ' + JSON.stringify(POST_TEXT) +
    ', channelId: ' + JSON.stringify(channel.id) +
    ', schedulingType: automatic, mode: shareNow, metadata: { facebook: { type: post } } }) {' +
    ' ... on PostActionSuccess { post { id status text assets { id } sentAt externalLink } }' +
    ' ... on MutationError { message } } }';
  const created = (await queryBuffer(key, mutation)).createPost;
  if (!created?.post?.id) {
    throw new Error('Buffer refused publish: ' + (created?.message || 'unknown response'));
  }
  const published = created.post;
  console.log('Buffer shareNow accepted. Post ID: ' + published.id);
  if (published.text !== POST_TEXT || (published.assets?.length ?? -1) !== 0) {
    throw new Error('Unexpected post text or media. Do not retry blindly; check Buffer.');
  }

  for (let i = 0; i < 8; i++) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const check = (await queryBuffer(key, 'query { post(input: { id: ' + JSON.stringify(published.id) +
      ' }) { id status sentAt externalLink } }')).post;
    console.log('Publish state: ' + check?.status +
      (check?.externalLink ? '; Facebook URL: ' + check.externalLink : ''));
    if (check?.status === 'sent') {
      console.log('SUCCESS: Text-only Facebook post published.');
      return;
    }
    if (check?.status === 'error') {
      throw new Error('Buffer reports publishing failure; do not retry without inspection.');
    }
  }
  throw new Error('Buffer accepted the post but Facebook completion is not yet verified. Do not retry blindly.');
}

main().catch(e => { console.error(e.message); process.exitCode = 1; });
