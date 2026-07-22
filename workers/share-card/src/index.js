const RESERVED_ROOT_PATHS = new Set([
  '', 'app', 'app.html', 'index', 'index.html', '404', '404.html', 'admin',
  'api', 'assets', 'auth', 'deals', 'favicon.ico', 'home', 'message', 'profile',
  'robots.txt', 'search', 'sitemap.xml', 'supabase', 'version.json', 'versions', 'week',
  'merchant', 'shop', 'restaurant', 'rental', 'autos', 'messages', 'order'
]);
const MARKET_CODES = new Set(['la', 'sgv', 'oc', 'ie', 'sd', 'sf', 'nyc', 'sea', 'other']);

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

function merchantSlugFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length !== 1) return '';
  const slug = decodeURIComponent(parts[0])
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!slug || RESERVED_ROOT_PATHS.has(slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return '';
  return slug;
}

function regionalRouteFromPath(pathname, type) {
  const parts = pathname.split('/').filter(Boolean).map(part => decodeURIComponent(part));
  if (parts.length !== 3 || !MARKET_CODES.has(parts[0]) || parts[1] !== type) return null;
  const slug = String(parts[2] || '').trim().toLowerCase().normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? { market: parts[0], slug } : null;
}

function shareImageSlugFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length !== 2 || parts[0] !== '__share-image') return '';
  return merchantSlugFromPath(`/${parts[1]}`);
}

function sharePostImageIdFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  return parts.length === 3 && parts[0] === '__share-image' && parts[1] === 'post' && /^\d+$/.test(parts[2]) ? Number(parts[2]) : null;
}

function shareUserImageIdFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  const userId = parts.length === 3 && parts[0] === '__share-image' && parts[1] === 'user' ? decodeURIComponent(parts[2]) : '';
  return /^[0-9a-f-]{8,64}$/i.test(userId) ? userId : '';
}

function sharedPostId(url) {
  const value = url.searchParams.get('post');
  return value && /^\d+$/.test(value) ? Number(value) : null;
}

function sharedUserId(url) {
  const userId = String(url.searchParams.get('user') || '').trim();
  return /^[0-9a-f-]{8,64}$/i.test(userId) ? userId : '';
}

function vinFromPath(pathname) {
  const matched = pathname.match(/^\/api\/vin\/([A-HJ-NPR-Z0-9]{17})$/i);
  return matched ? matched[1].toUpperCase() : '';
}

function vinApiResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=2592000',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders
    }
  });
}

async function decodeVin(vin) {
  const upstream = new URL(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(vin)}`);
  upstream.searchParams.set('format', 'json');
  const response = await fetch(upstream.toString(), { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`nhtsa_${response.status}`);
  const payload = await response.json();
  const item = Array.isArray(payload?.Results) ? payload.Results[0] : null;
  if (!item || Number(item.ErrorCode || 0) !== 0) throw new Error(item?.ErrorText || 'vin_not_found');
  return {
    Make: String(item.Make || '').trim(),
    Model: String(item.Model || '').trim(),
    ModelYear: String(item.ModelYear || '').trim(),
    BodyClass: String(item.BodyClass || '').trim(),
    FuelTypePrimary: String(item.FuelTypePrimary || '').trim(),
    TransmissionStyle: String(item.TransmissionStyle || '').trim(),
    DriveType: String(item.DriveType || '').trim()
  };
}

async function vinDecodeResponse(request, url) {
  if (request.method !== 'GET') return vinApiResponse({ error: 'method_not_allowed' }, 405, { Allow: 'GET' });
  const vin = vinFromPath(url.pathname);
  if (!vin) return vinApiResponse({ error: 'invalid_vin' }, 400);
  const cache = caches.default;
  const cacheKey = new Request(`${url.origin}/__cache/vin/${vin}`, { method: 'GET' });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  try {
    const response = vinApiResponse({ data: await decodeVin(vin) });
    await cache.put(cacheKey, response.clone());
    return response;
  } catch (error) {
    return vinApiResponse({ error: 'decode_unavailable' }, 503, { 'Cache-Control': 'no-store' });
  }
}

function cleanShareText(value) {
  return String(value || '')
    .replace(/\[\[[^\]]+\]\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function shortenShareText(value, limit) {
  const text = cleanShareText(value);
  const chars = Array.from(text);
  return chars.length > limit ? `${chars.slice(0, limit).join('')}…` : text;
}

function absoluteImage(value, env) {
  const image = String(value || '').trim();
  if (/^https?:\/\//i.test(image)) return image;
  return `${env.CONTENT_ORIGIN}/assets/leshenghuo-logo.png`;
}

function inlineImageResponse(value) {
  const matched = String(value || '').match(/^data:(image\/(?:png|jpeg|webp));base64,([a-z0-9+/=\s]+)$/i);
  if (!matched) return null;
  const binary = atob(matched[2].replace(/\s/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Response(bytes, {
    headers: {
      'Content-Type': matched[1].toLowerCase(),
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

async function merchantShareImageResponse(slug, env) {
  const merchant = await readMerchant(slug, env);
  if (!merchant) return new Response('Not found', { status: 404 });
  // 商家主页的分享缩略图优先使用头像；封面图只作为没有头像时的兜底。
  const image = merchant.logo || merchant.cover_image;
  const inlineResponse = inlineImageResponse(image);
  if (inlineResponse) return inlineResponse;
  return Response.redirect(absoluteImage(image, env), 302);
}

function postImage(post) {
  return Array.isArray(post && post.images) && post.images[0] ? post.images[0] : (post && post.image) || '';
}

async function postShareImageResponse(id, env) {
  const post = await readPublicPost(id, env);
  if (!post) return new Response('Not found', { status: 404 });
  const image = postImage(post);
  const inlineResponse = inlineImageResponse(image);
  if (inlineResponse) return inlineResponse;
  return Response.redirect(absoluteImage(image, env), 302);
}

async function userShareImageResponse(userId, env) {
  const profile = await readPublicProfile(userId, env);
  if (!profile) return new Response('Not found', { status: 404 });
  const inlineResponse = inlineImageResponse(profile.avatar);
  if (inlineResponse) return inlineResponse;
  return Response.redirect(absoluteImage(profile.avatar, env), 302);
}

function shareMeta({ title, description, image, imageAlt, canonical }) {
  return `
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="乐生活 Scoop City">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta property="og:image:alt" content="${escapeHtml(imageAlt || title)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(image)}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
  `;
}

async function readMerchant(slug, env, market = '') {
  const endpoint = new URL('/rest/v1/merchants', env.SUPABASE_URL);
  endpoint.searchParams.set('slug', `eq.${slug}`);
  if (market) endpoint.searchParams.set('market_code', `eq.${market}`);
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

async function readPublicPost(id, env) {
  const endpoint = new URL('/rest/v1/posts', env.SUPABASE_URL);
  endpoint.searchParams.set('id', `eq.${id}`);
  endpoint.searchParams.set('or', '(visibility.eq.public,visibility.is.null)');
  endpoint.searchParams.set('select', 'id,title,excerpt,content,author,image,images,created_at');
  endpoint.searchParams.set('limit', '1');
  const response = await fetch(endpoint, { headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}` } });
  if (!response.ok) return null;
  const rows = await response.json();
  return rows && rows[0] ? rows[0] : null;
}

async function readPublicProfile(userId, env) {
  const endpoint = new URL('/rest/v1/profiles', env.SUPABASE_URL);
  endpoint.searchParams.set('user_id', `eq.${userId}`);
  endpoint.searchParams.set('select', 'user_id,name,avatar,bio,updated_at');
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

function githubRawRequest(request, url, env, entryPath = '') {
  const upstream = new URL(env.CONTENT_ORIGIN);
  const repositoryPath = upstream.pathname.replace(/\/$/, '');
  // jsDelivr serves a repository directory listing for paths such as /order/.
  // Resolve directory URLs to their actual entry document before proxying.
  const requestedPath = entryPath
    ? entryPath
    : (url.pathname === '/' || url.pathname.endsWith('/') ? `${url.pathname}index.html` : url.pathname);
  upstream.pathname = `${repositoryPath}${requestedPath}`;
  // Keep browser cache-busting parameters out of the source URL, but use a
  // Worker revision token so newly committed static files do not inherit an old 404.
  upstream.search = 'worker_revision=5.526';
  return new Request(upstream.toString(), request);
}

function staticCacheRequest(url, env) {
  const key = new URL(url.origin + url.pathname);
  key.searchParams.set('content_origin', env.CONTENT_ORIGIN);
  return new Request(key.toString(), { method: 'GET' });
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

  // Upstream CDNs may return source-viewer headers. Remove them before serving the SPA.
  headers.delete('content-security-policy');
  headers.delete('content-security-policy-report-only');
  headers.delete('x-frame-options');
  headers.delete('content-disposition');
  headers.delete('etag');
  headers.delete('content-length');
  const responsePath = htmlPage ? '/index.html' : new URL(meta.canonical).pathname;
  headers.set('Content-Type', contentTypeForPath(responsePath));
  headers.set('X-Content-Type-Options', 'nosniff');
  if (responsePath.endsWith('/version.json') || responsePath === 'version.json') {
    headers.set('Cache-Control', 'public, max-age=60');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
  if (!htmlPage) return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  headers.set('Cache-Control', 'public, max-age=300');
  return new HTMLRewriter()
    .on('head', { element(head) { head.append(shareMeta(meta), { html: true }); } })
    .transform(new Response(response.body, { status: response.status, statusText: response.statusText, headers }));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/vin/')) return vinDecodeResponse(request, url);
    if (request.method === 'GET' && url.pathname === '/version.json' && env.APP_VERSION) {
      return new Response(JSON.stringify({
        version: env.APP_VERSION,
        updated_at: env.APP_UPDATED_AT || '',
        message: '正在进入乐生活'
      }), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=60',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    }
    const imageSlug = shareImageSlugFromPath(url.pathname);
    const postImageId = sharePostImageIdFromPath(url.pathname);
    const userImageId = shareUserImageIdFromPath(url.pathname);
    if (postImageId != null) {
      try { return await postShareImageResponse(postImageId, env); }
      catch (_) { return new Response('Image unavailable', { status: 503 }); }
    }
    if (userImageId) {
      try { return await userShareImageResponse(userImageId, env); }
      catch (_) { return new Response('Image unavailable', { status: 503 }); }
    }
    if (imageSlug) {
      try {
        return await merchantShareImageResponse(imageSlug, env);
      } catch (_) {
        return new Response('Image unavailable', { status: 503 });
      }
    }
    const merchantRoute = regionalRouteFromPath(url.pathname, 'merchant');
    const shopRoute = regionalRouteFromPath(url.pathname, 'shop');
    const slug = merchantRoute ? merchantRoute.slug : merchantSlugFromPath(url.pathname);
    const postId = sharedPostId(url);
    const userId = sharedUserId(url);
    const canCacheStatic = request.method === 'GET' && !slug && !shopRoute && postId == null && !userId;
    const cacheKey = canCacheStatic ? staticCacheRequest(url, env) : null;
    const cache = caches.default;

    if (cacheKey) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }
    let merchant = null;
    let shop = null;
    let post = null;
    let user = null;

    if (slug) {
      try {
        merchant = await readMerchant(slug, env, merchantRoute?.market || '');
      } catch (_) {
        // If Supabase is briefly unavailable, serve the normal page rather than breaking visits.
      }
    }
    if (shopRoute) {
      try {
        const endpoint = new URL('/rest/v1/personal_shops', env.SUPABASE_URL);
        endpoint.searchParams.set('market_code', `eq.${shopRoute.market}`);
        endpoint.searchParams.set('slug', `eq.${shopRoute.slug}`);
        endpoint.searchParams.set('status', 'eq.active');
        endpoint.searchParams.set('select', 'slug,market_code,display_name,intro,avatar,cover_image,updated_at');
        endpoint.searchParams.set('limit', '1');
        const response = await fetch(endpoint, { headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}` } });
        const rows = response.ok ? await response.json() : [];
        shop = rows && rows[0] ? rows[0] : null;
      } catch (_) {}
    }
    if (postId != null) {
      try { post = await readPublicPost(postId, env); } catch (_) {}
    }
    if (userId) {
      try { user = await readPublicProfile(userId, env); } catch (_) {}
    }

    const defaultMeta = {
      title: '乐生活 Scoop City - 发现身边的精彩生活',
      description: '北美华人本地生活社区，发现附近美食、活动、优惠和商家服务。',
      image: `${env.CONTENT_ORIGIN}/assets/leshenghuo-logo.png`,
      imageAlt: '乐生活 Scoop City',
      canonical: `${env.SITE_ORIGIN}${url.pathname}`
    };
    const merchantMeta = merchant ? {
      title: `${shortenShareText(merchant.business_name || '乐生活商家', 90)} - 乐生活 Scoop City`,
      description: shortenShareText(merchant.seo_description || merchant.intro || [merchant.category, merchant.address].filter(Boolean).join(' · ') || defaultMeta.description, 220),
      image: `${env.SITE_ORIGIN}/__share-image/${encodeURIComponent(merchant.slug)}`,
      imageAlt: merchant.business_name || '乐生活商家',
      canonical: merchantRoute ? `${env.SITE_ORIGIN}/${encodeURIComponent(merchantRoute.market)}/merchant/${encodeURIComponent(merchant.slug)}` : `${env.SITE_ORIGIN}/${encodeURIComponent(merchant.slug)}`
    } : defaultMeta;
    const shopMeta = shop ? {
      title: `${shortenShareText(shop.display_name || '个人小店', 90)} - 乐生活 Scoop City`,
      description: shortenShareText(shop.intro || '来看看这家个人小店正在出售的好物。', 220),
      image: absoluteImage(shop.avatar || shop.cover_image, env),
      imageAlt: shop.display_name || '个人小店',
      canonical: `${env.SITE_ORIGIN}/${encodeURIComponent(shop.market_code || shopRoute?.market || 'la')}/shop/${encodeURIComponent(shop.slug)}`
    } : merchantMeta;
    const postMeta = post ? {
      title: `${shortenShareText(post.title || '乐生活笔记', 90)} - 乐生活 Scoop City`,
      description: shortenShareText(post.content || post.excerpt || `来自 ${post.author || '乐生活用户'} 的精彩分享。`, 220),
      image: `${env.SITE_ORIGIN}/__share-image/post/${post.id}`,
      imageAlt: post.title || '乐生活笔记',
      canonical: `${env.SITE_ORIGIN}/?post=${post.id}`
    } : shopMeta;
    const userMeta = user ? {
      title: `${shortenShareText(user.name || '乐生活用户', 90)} - 乐生活 Scoop City`,
      description: shortenShareText(user.bio || '这个用户正在乐生活分享身边的精彩生活。', 220),
      image: `${env.SITE_ORIGIN}/__share-image/user/${encodeURIComponent(user.user_id)}`,
      imageAlt: user.name || '乐生活用户',
      canonical: `${env.SITE_ORIGIN}/?user=${encodeURIComponent(user.user_id)}`
    } : postMeta;

    const htmlPage = Boolean(merchant || shop || post || user) || url.pathname === '/' || url.pathname.endsWith('/') || /\.html$/i.test(url.pathname);
    try {
      const entryPath = merchantRoute ? '/merchant/index.html' : shopRoute ? '/shop/index.html' : (merchant || post || user ? '/index.html' : '');
      const originResponse = await fetch(githubRawRequest(request, url, env, entryPath));
      if (!originResponse.ok && cacheKey) {
        const stale = await cache.match(cacheKey);
        if (stale) return stale;
      }
      const response = withShareMeta(originResponse, userMeta, htmlPage);
      if (cacheKey && response.ok) {
        await cache.put(cacheKey, response.clone());
      }
      return response;
    } catch (error) {
      if (cacheKey) {
        const stale = await cache.match(cacheKey);
        if (stale) return stale;
      }
      return new Response('内容暂时不可用，请稍后重试。', { status: 503 });
    }
  }
};
