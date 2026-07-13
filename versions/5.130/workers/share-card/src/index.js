const RESERVED_ROOT_PATHS = new Set([
  '', 'app', 'app.html', 'index', 'index.html', '404', '404.html', 'admin',
  'api', 'assets', 'auth', 'deals', 'favicon.ico', 'home', 'message', 'profile',
  'robots.txt', 'search', 'sitemap.xml', 'supabase', 'version.json', 'versions', 'week'
]);

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

function merchantSlugFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length !== 1) return '';
  const slug = decodeURIComponent(parts[0]).trim().toLowerCase();
  if (!slug || RESERVED_ROOT_PATHS.has(slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return '';
  return slug;
}

function absoluteImage(value, env) {
  const image = String(value || '').trim();
  if (/^https?:\/\//i.test(image)) return image;
  return `${env.GITHUB_RAW_ORIGIN}/assets/leshenghuo-logo.png`;
}

function shareMeta({ title, description, image, canonical }) {
  return `
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="乐生活 Scoop City">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(image)}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
  `;
}

async function readMerchant(slug, env) {
  const endpoint = new URL('/rest/v1/merchants', env.SUPABASE_URL);
  endpoint.searchParams.set('slug', `eq.${slug}`);
  endpoint.searchParams.set('verified', 'eq.true');
  endpoint.searchParams.set('select', 'slug,business_name,intro,seo_description,cover_image,logo,category,address,updated_at');
  endpoint.searchParams.set('limit', '1');
  const response = await fetch(endpoint, {
    headers: {
      apikey: env.SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}`
    }
  });
  if (!response.ok) return null;
  const rows = await response.json();
  return rows && rows[0] ? rows[0] : null;
}

function githubRawRequest(request, url, env, merchantPage) {
  const upstream = new URL(env.GITHUB_RAW_ORIGIN);
  const repositoryPath = upstream.pathname.replace(/\/$/, '');
  const requestedPath = merchantPage ? '/index.html' : (url.pathname === '/' ? '/index.html' : url.pathname);
  upstream.pathname = `${repositoryPath}${requestedPath}`;
  // GitHub Raw does not need the browser cache-busting query parameters.
  upstream.search = '';
  return new Request(upstream.toString(), request);
}

function contentTypeForPath(pathname) {
  const extension = pathname.split('.').pop().toLowerCase();
  return ({
    html: 'text/html; charset=utf-8', js: 'application/javascript; charset=utf-8',
    css: 'text/css; charset=utf-8', json: 'application/json; charset=utf-8',
    png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp',
    svg: 'image/svg+xml', ico: 'image/x-icon'
  })[extension] || 'application/octet-stream';
}

function withShareMeta(response, meta, htmlPage) {
  if (!response.ok) return response;
  const headers = new Headers(response.headers);

  // raw.githubusercontent.com returns a restrictive CSP intended for file viewing.
  // Remove those source-only headers before serving the SPA as a real website.
  headers.delete('content-security-policy');
  headers.delete('content-security-policy-report-only');
  headers.delete('x-frame-options');
  headers.delete('content-disposition');
  headers.delete('etag');
  headers.delete('content-length');
  headers.set('Content-Type', contentTypeForPath(htmlPage ? '/index.html' : new URL(meta.canonical).pathname));
  headers.set('X-Content-Type-Options', 'nosniff');
  if (!htmlPage) return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  headers.set('Cache-Control', 'public, max-age=300');
  return new HTMLRewriter()
    .on('head', { element(head) { head.append(shareMeta(meta), { html: true }); } })
    .transform(new Response(response.body, { status: response.status, statusText: response.statusText, headers }));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const slug = merchantSlugFromPath(url.pathname);
    let merchant = null;

    if (slug) {
      try {
        merchant = await readMerchant(slug, env);
      } catch (_) {
        // If Supabase is briefly unavailable, serve the normal page rather than breaking visits.
      }
    }

    const defaultMeta = {
      title: '乐生活 Scoop City - 发现身边的精彩生活',
      description: '北美华人本地生活社区，发现附近美食、活动、优惠和商家服务。',
      image: `${env.GITHUB_RAW_ORIGIN}/assets/leshenghuo-logo.png`,
      canonical: `${env.SITE_ORIGIN}${url.pathname}`
    };
    const merchantMeta = merchant ? {
      title: `${merchant.business_name || '乐生活商家'} - 乐生活 Scoop City`,
      description: merchant.seo_description || merchant.intro || [merchant.category, merchant.address].filter(Boolean).join(' · ') || defaultMeta.description,
      image: absoluteImage(merchant.cover_image || merchant.logo, env),
      canonical: `${env.SITE_ORIGIN}/${encodeURIComponent(merchant.slug)}`
    } : defaultMeta;

    const htmlPage = Boolean(merchant) || url.pathname === '/' || /\.html$/i.test(url.pathname);
    const originResponse = await fetch(githubRawRequest(request, url, env, Boolean(merchant)));
    return withShareMeta(originResponse, merchantMeta, htmlPage);
  }
};
