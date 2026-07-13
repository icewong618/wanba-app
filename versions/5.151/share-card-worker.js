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

function shareImageSlugFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length !== 2 || parts[0] !== '__share-image') return '';
  return merchantSlugFromPath(`/${parts[1]}`);
}

function sharePostImageIdFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  return parts.length === 3 && parts[0] === '__share-image' && parts[1] === 'post' && /^\d+$/.test(parts[2]) ? Number(parts[2]) : null;
}

function sharedPostId(url) {
  const value = url.searchParams.get('post');
  return value && /^\d+$/.test(value) ? Number(value) : null;
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
  const image = merchant.cover_image || merchant.logo;
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

function githubRawRequest(request, url, env, merchantPage) {
  const upstream = new URL(env.CONTENT_ORIGIN);
  const repositoryPath = upstream.pathname.replace(/\/$/, '');
  const requestedPath = merchantPage ? '/index.html' : (url.pathname === '/' ? '/index.html' : url.pathname);
  upstream.pathname = `${repositoryPath}${requestedPath}`;
  // Keep browser cache-busting parameters out of the source URL, but use a
  // Worker revision token so newly committed static files do not inherit an old 404.
  upstream.search = 'worker_revision=5.151';
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

  // raw.githubusercontent.com returns a restrictive CSP intended for file viewing.
  // Remove those source-only headers before serving the SPA as a real website.
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
    if (postImageId != null) {
      try { return await postShareImageResponse(postImageId, env); }
      catch (_) { return new Response('Image unavailable', { status: 503 }); }
    }
    if (imageSlug) {
      try {
        return await merchantShareImageResponse(imageSlug, env);
      } catch (_) {
        return new Response('Image unavailable', { status: 503 });
      }
    }
    const slug = merchantSlugFromPath(url.pathname);
    const postId = sharedPostId(url);
    const canCacheStatic = request.method === 'GET' && !slug && postId == null;
    const cacheKey = canCacheStatic ? staticCacheRequest(url, env) : null;
    const cache = caches.default;

    if (cacheKey) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }
    let merchant = null;
    let post = null;

    if (slug) {
      try {
        merchant = await readMerchant(slug, env);
      } catch (_) {
        // If Supabase is briefly unavailable, serve the normal page rather than breaking visits.
      }
    }
    if (postId != null) {
      try { post = await readPublicPost(postId, env); } catch (_) {}
    }

    const defaultMeta = {
      title: '乐生活 Scoop City - 发现身边的精彩生活',
      description: '北美华人本地生活社区，发现附近美食、活动、优惠和商家服务。',
      image: `${env.CONTENT_ORIGIN}/assets/leshenghuo-logo.png`,
      canonical: `${env.SITE_ORIGIN}${url.pathname}`
    };
    const merchantMeta = merchant ? {
      title: `${merchant.business_name || '乐生活商家'} - 乐生活 Scoop City`,
      description: merchant.seo_description || merchant.intro || [merchant.category, merchant.address].filter(Boolean).join(' · ') || defaultMeta.description,
      image: `${env.SITE_ORIGIN}/__share-image/${encodeURIComponent(merchant.slug)}`,
      canonical: `${env.SITE_ORIGIN}/${encodeURIComponent(merchant.slug)}`
    } : defaultMeta;
    const postMeta = post ? {
      title: `${post.title || '乐生活笔记'} - 乐生活 Scoop City`,
      description: post.excerpt || post.content || `来自 ${post.author || '乐生活用户'} 的精彩分享。`,
      image: `${env.SITE_ORIGIN}/__share-image/post/${post.id}`,
      canonical: `${env.SITE_ORIGIN}/?post=${post.id}`
    } : merchantMeta;

    const htmlPage = Boolean(merchant || post) || url.pathname === '/' || /\.html$/i.test(url.pathname);
    try {
      const originResponse = await fetch(githubRawRequest(request, url, env, Boolean(merchant || post)));
      if (!originResponse.ok && cacheKey) {
        const stale = await cache.match(cacheKey);
        if (stale) return stale;
      }
      const response = withShareMeta(originResponse, postMeta, htmlPage);
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
