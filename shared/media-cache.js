/* Shared bounded Cache Storage helper for R2 media.
   Browser storage can be smaller than the configured target; failures remain non-blocking. */
(() => {
  const create = ({ publicOrigin, cacheName, metaKey, maxBytes, maxEntries, cacheVersion = '2' } = {}) => {
    const pending = new Set();
    const isMediaUrl = value => typeof value === 'string' && value.startsWith(`${publicOrigin}/`);
    const readMeta = () => {
      try { return JSON.parse(localStorage.getItem(metaKey) || '{}'); } catch(error) { return {}; }
    };
    const writeMeta = meta => {
      try { localStorage.setItem(metaKey, JSON.stringify(meta)); } catch(error) {}
    };

    const warm = async url => {
      if(!isMediaUrl(url) || !('caches' in window) || pending.has(url)) return;
      pending.add(url);
      try {
        const cache = await caches.open(cacheName);
        const cacheUrl = new URL(url);
        cacheUrl.searchParams.set('media_cache_v', cacheVersion);
        const cacheKey = cacheUrl.toString();
        const existing = await cache.match(cacheKey);
        const meta = readMeta();
        if(existing){
          meta[cacheKey] = Object.assign({}, meta[cacheKey], { touchedAt:Date.now() });
          writeMeta(meta);
          return;
        }
        const response = await fetch(cacheKey, { mode:'cors', cache:'force-cache' });
        if(!response.ok) return;
        const size = Number(response.headers.get('content-length')) || (await response.clone().blob()).size || 0;
        await cache.put(cacheKey, response);
        meta[cacheKey] = { size, touchedAt:Date.now() };
        const entries = Object.entries(meta).sort((a,b) => Number(a[1].touchedAt || 0) - Number(b[1].touchedAt || 0));
        let total = entries.reduce((sum, [,item]) => sum + Number(item.size || 0), 0);
        while((total > maxBytes || entries.length > maxEntries) && entries.length){
          const [oldUrl, item] = entries.shift();
          await cache.delete(oldUrl);
          delete meta[oldUrl];
          total -= Number(item.size || 0);
        }
        writeMeta(meta);
      } catch(error) {
        console.info('媒体本地缓存跳过:', error.message);
      } finally {
        pending.delete(url);
      }
    };

    const warmPosts = (list, detail=false) => {
      const urls = [];
      (list || []).forEach(post => {
        if(detail && Array.isArray(post.images)) urls.push(...post.images);
        else urls.push(post.image_thumbnail || post.image);
      });
      [...new Set(urls.filter(Boolean))].slice(0, detail ? 20 : 12).forEach(warm);
    };

    return { isMediaUrl, warm, warmPosts, readMeta };
  };

  window.LeshenghuoMediaCache = { create };
})();
