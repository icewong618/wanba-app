/* Shared, bounded local snapshot for the public feed.
   Full images stay in object storage; Base64 images are omitted when storage is tight. */
(() => {
  const isDataImage = value => typeof value === 'string' && value.startsWith('data:image/');
  const lightweightPost = post => Object.assign({}, post, {
    image: isDataImage(post.image) ? null : post.image,
    images: Array.isArray(post.images) ? post.images.filter(image => !isDataImage(image)) : post.images
  });

  const save = (key, posts, storage = window.localStorage) => {
    try {
      storage.setItem(key, JSON.stringify(posts));
      return { saved: true, compacted: false };
    } catch(error) {
      if(error?.name !== 'QuotaExceededError') return { saved: false, compacted: false, error };
      try {
        storage.setItem(key, JSON.stringify((posts || []).map(lightweightPost)));
        return { saved: true, compacted: true };
      } catch(compactError) {
        return { saved: false, compacted: true, error: compactError };
      }
    }
  };

  const load = (key, storage = window.localStorage) => {
    try {
      const raw = storage.getItem(key);
      if(!raw) return null;
      const posts = JSON.parse(raw);
      return Array.isArray(posts) ? posts : null;
    } catch(error) {
      return null;
    }
  };

  window.LeshenghuoFeedCache = { save, load, lightweightPost };
})();
