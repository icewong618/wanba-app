const origin = (process.env.PUBLIC_BETA_URL || 'https://escoopcity.com').replace(/\/$/, '');
const merchantPath = process.env.PUBLIC_BETA_MERCHANT_PATH || '/sichuan-garden-la';

async function request(path) {
  const url = `${origin}${path}${path.includes('?') ? '&' : '?'}smoke=${Date.now()}`;
  const response = await fetch(url, {
    headers: { 'Cache-Control': 'no-cache', 'User-Agent': 'Scoop-City-Public-Beta-Smoke/1.0' },
    signal: AbortSignal.timeout(15000)
  });
  const text = await response.text();
  if(!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  return { url, text, contentType:response.headers.get('content-type') || '' };
}

async function check(label, path, validate) {
  const result = await request(path);
  validate(result);
  console.log(`PASS ${label}: ${result.url}`);
}

try {
  await check('homepage', '/', result => {
    if(!/乐生活|SCOOP CITY/i.test(result.text)) throw new Error('homepage brand marker missing');
  });
  await check('version manifest', '/version.json', result => {
    const manifest = JSON.parse(result.text);
    if(!/^\d+\.\d+(?:\w+)?$/.test(String(manifest.version || ''))) throw new Error('version manifest is missing a valid version');
  });
  await check('app entry', '/app.html', result => {
    if(!/<iframe/i.test(result.text)) throw new Error('app entry iframe missing');
  });
  await check('merchant share card', merchantPath, result => {
    if(!/<meta\s+property=["']og:title["']/i.test(result.text)) throw new Error('merchant Open Graph title missing');
    if(!/<meta\s+property=["']og:image["']/i.test(result.text)) throw new Error('merchant Open Graph image missing');
  });
  console.log('Public beta smoke check passed.');
} catch(error) {
  console.error(`Public beta smoke check failed: ${error.message}`);
  process.exitCode = 1;
}
