const origin = (process.env.PUBLIC_BETA_URL || 'https://escoopcity.com').replace(/\/$/, '');
const merchantPath = process.env.PUBLIC_BETA_MERCHANT_PATH || '/sichuan-garden-la';
const expectedVersion = String(process.env.EXPECTED_VERSION || '').trim();

async function request(path) {
  const url = `${origin}${path}${path.includes('?') ? '&' : '?'}smoke=${Date.now()}`;
  let lastError;
  for(let attempt = 1; attempt <= 2; attempt += 1){
    try {
      const response = await fetch(url, {
        headers: { 'Cache-Control': 'no-cache', 'User-Agent': 'Scoop-City-Public-Beta-Smoke/1.1' },
        signal: AbortSignal.timeout(15000)
      });
      const text = await response.text();
      if(!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
      return { url, text, contentType:response.headers.get('content-type') || '' };
    } catch(error) {
      lastError = error;
      if(attempt === 1) await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  throw lastError;
}

async function check(label, path, validate) {
  const result = await request(path);
  validate(result);
  console.log(`PASS ${label}: ${result.url}`);
}

try {
  await check('homepage', '/', result => {
    if(!/乐生活|SCOOP CITY/i.test(result.text)) throw new Error('homepage brand marker missing');
    if(!/shared\/app-shell\.css/i.test(result.text) || !/shared\/app-main\.js/i.test(result.text)) throw new Error('homepage split application assets missing');
  });
  await check('version manifest', '/version.json', result => {
    const manifest = JSON.parse(result.text);
    const version = String(manifest.version || '');
    if(!/^\d+\.\d+(?:\w+)?$/.test(version)) throw new Error('version manifest is missing a valid version');
    if(expectedVersion && version !== expectedVersion) {
      throw new Error(`version manifest is ${version}, expected ${expectedVersion}`);
    }
  });
  await check('app entry', '/app.html', result => {
    if(!/id=["']page-home["']/i.test(result.text)) throw new Error('app home entry missing');
    if(!/shared\/app-main\.js/i.test(result.text)) throw new Error('app main controller missing');
  });
  await check('deals module', '/deals/', result => {
    if(!/id=["']dealsApp["']/i.test(result.text)) throw new Error('deals module root missing');
    if(!/module-runtime\.js\?v=5\.51/i.test(result.text)) throw new Error('deals runtime cache version is stale');
  });
  await check('week module', '/week/', result => {
    if(!/id=["']weekApp["']/i.test(result.text)) throw new Error('week module root missing');
  });
  await check('messages module', '/messages/', result => {
    if(!/id=["']messagesApp["']/i.test(result.text)) throw new Error('messages module root missing');
  });
  await check('retail order manager', '/retail/manage/', result => {
    if(!/id=["']retailManageApp["']/i.test(result.text)) throw new Error('retail order manager root missing');
    if(!/manage\.js\?v=5\.550/i.test(result.text)) throw new Error('retail order manager cache version is stale');
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
