const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_KINDS = new Set(['posts', 'avatars', 'covers', 'merchant-logos', 'merchant-covers', 'text-covers', 'coupons', 'products']);

function response(body, status, request) {
  const origin = request.headers.get('Origin') || '';
  const allowed = new Set(['https://escoopcity.com', 'capacitor://localhost', 'http://localhost']);
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-methods': 'POST, DELETE, OPTIONS',
    'access-control-allow-headers': 'authorization, content-type, x-media-kind, x-media-migration-key, x-media-owner',
    'access-control-max-age': '86400',
    'vary': 'Origin'
  };
  if (allowed.has(origin)) headers['access-control-allow-origin'] = origin;
  return new Response(status === 204 ? null : JSON.stringify(body), { status, headers });
}

function cleanKind(value) {
  const kind = String(value || '').trim().toLowerCase();
  return ALLOWED_KINDS.has(kind) ? kind : '';
}

function extensionFor(contentType) {
  if (contentType === 'image/png') return 'png';
  if (contentType === 'image/webp') return 'webp';
  return 'jpg';
}

async function authenticatedUser(request, env) {
  const authorization = request.headers.get('Authorization') || '';
  if (!authorization.startsWith('Bearer ')) return null;
  const result = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: env.SUPABASE_PUBLISHABLE_KEY,
      Authorization: authorization
    }
  });
  if (!result.ok) return null;
  const user = await result.json();
  return user && user.id ? user : null;
}

async function saveImage(request, env, ownerId, kind) {
  const contentType = String(request.headers.get('content-type') || '').split(';')[0].toLowerCase();
  const length = Number(request.headers.get('content-length') || 0);
  if (!ALLOWED_TYPES.has(contentType)) return { error: 'Only JPEG, PNG, and WebP images are supported.', status: 415 };
  if (length && length > MAX_UPLOAD_BYTES) return { error: 'Image is larger than 5 MB.', status: 413 };
  const body = await request.arrayBuffer();
  if (!body.byteLength || body.byteLength > MAX_UPLOAD_BYTES) return { error: 'Image is empty or larger than 5 MB.', status: 413 };
  const key = `${kind}/${ownerId}/${Date.now()}-${crypto.randomUUID()}.${extensionFor(contentType)}`;
  await env.MEDIA_BUCKET.put(key, body, {
    httpMetadata: { contentType, cacheControl: 'public, max-age=31536000, immutable' },
    customMetadata: { ownerId, kind }
  });
  return { key, url: `${env.MEDIA_PUBLIC_ORIGIN}/${key}` };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return response({ ok: true }, 204, request);
    if (url.pathname === '/health') return response({ ok: true, service: 'leshenghuo-media-api' }, 200, request);

    if (url.pathname === '/upload' && request.method === 'POST') {
      const user = await authenticatedUser(request, env);
      const kind = cleanKind(request.headers.get('x-media-kind'));
      if (!user) return response({ error: 'Authentication required.' }, 401, request);
      if (!kind) return response({ error: 'Unsupported media kind.' }, 400, request);
      const saved = await saveImage(request, env, user.id, kind);
      return response(saved.error ? { error: saved.error } : saved, saved.status || 201, request);
    }

    if (url.pathname === '/migrate' && request.method === 'POST') {
      const migrationKey = request.headers.get('x-media-migration-key') || '';
      const ownerId = String(request.headers.get('x-media-owner') || '').trim();
      const kind = cleanKind(request.headers.get('x-media-kind'));
      if (!env.MIGRATION_KEY || migrationKey !== env.MIGRATION_KEY) return response({ error: 'Migration authorization required.' }, 401, request);
      if (!/^[0-9a-f-]{36}$/i.test(ownerId) || !kind) return response({ error: 'Invalid migration target.' }, 400, request);
      const saved = await saveImage(request, env, ownerId, kind);
      return response(saved.error ? { error: saved.error } : saved, saved.status || 201, request);
    }

    if (url.pathname === '/upload' && request.method === 'DELETE') {
      const user = await authenticatedUser(request, env);
      const key = String(url.searchParams.get('key') || '');
      if (!user) return response({ error: 'Authentication required.' }, 401, request);
      const match = key.match(/^([a-z-]+)\/([0-9a-f-]{36})\/[^/]+\.(?:jpg|png|webp)$/i);
      if (!match || !ALLOWED_KINDS.has(match[1]) || match[2].toLowerCase() !== String(user.id).toLowerCase()) {
        return response({ error: 'You can only delete your own media.' }, 403, request);
      }
      await env.MEDIA_BUCKET.delete(key);
      return response({ ok: true }, 200, request);
    }
    return response({ error: 'Not found.' }, 404, request);
  }
};
