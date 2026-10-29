// Buffer kapcsolat ellenőrzése; szándékosan nem hoz létre posztot.
const key = process.env.BUFFER_API_KEY;
const expectedFacebookPageId = '1427930577066568';

if (!key) {
  console.error('Hiányzik a GitHub Actions BUFFER_API_KEY titok.');
  process.exit(1);
}

async function queryBuffer(query) {
  const response = await fetch('https://api.buffer.com', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Buffer API HTTP ${response.status}`);
  }

  const result = await response.json();
  if (result.errors?.length) {
    throw new Error(result.errors.map(({ message }) => message).join('; '));
  }
  return result.data;
}

try {
  const { account } = await queryBuffer(
    'query { account { organizations { id name } } }',
  );
  const organizations = account?.organizations ?? [];
  if (!organizations.length) {
    throw new Error('A Buffer-fiókban nem található szervezet.');
  }

  let channel;
  for (const org of organizations) {
    const data = await queryBuffer(`query {
      channels(input: { organizationId: ${JSON.stringify(org.id)} }) {
        id
        name
        service
        serviceId
        isDisconnected
        isLocked
      }
    }`);
    channel = data.channels?.find(
      (item) => item.service === 'facebook' &&
        item.serviceId === expectedFacebookPageId,
    );
    if (channel) break;
  }

  if (!channel) {
    throw new Error(
      'Nem található a Kalkulátor bázis Facebook-oldal (1427930577066568) a Bufferben.',
    );
  }
  if (channel.isDisconnected || channel.isLocked) {
    throw new Error('A megfelelő Facebook-csatorna le van választva vagy zárolva.');
  }

  console.log('Buffer API-kapcsolat sikeres.');
  console.log(`Ellenőrzött Facebook-oldal: ${channel.name}`);
  console.log(`Buffer channel ID: ${channel.id}`);
  console.log('Nem történt posztküldés vagy időzítés.');
} catch (error) {
  console.error(`Buffer-kapcsolat ellenőrzése sikertelen: ${error.message}`);
  process.exitCode = 1;
}
