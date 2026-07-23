/* Shared public-feed data contract for 乐生活 entry pages.
   UI rendering remains in the page; this module owns query shape and row compaction. */
(() => {
  const publicFeedFields = [
    'id', 'title', 'content', 'excerpt', 'category', 'subcategory', 'author',
    'image', 'image_thumbnail', 'image_thumbnails', 'youtube', 'likes', 'event',
    'tags', 'user_id', 'visibility', 'pinned', 'created_at', 'location'
  ];
  const publicFilter = 'or=(visibility.eq.public,visibility.is.null)';

  const buildPublicFeedUrls = ({ baseUrl, limit, fallbackLimit }) => {
    const select = publicFeedFields.join(',');
    const root = `${baseUrl}/rest/v1/posts?select=${select}&${publicFilter}`;
    return {
      url: `${root}&order=created_at.desc,id.desc&limit=${limit}`,
      fallbackUrl: `${root}&order=created_at.desc,id.desc&limit=${fallbackLimit}`
    };
  };

  const compactPost = (raw, { isValidSubcategory, normalizeSubcategory } = {}) => ({
    id: raw.id,
    title: raw.title || '无标题',
    content: raw.content || '',
    excerpt: raw.excerpt || '',
    category: raw.category || '',
    subcategory: typeof normalizeSubcategory === 'function'
      ? normalizeSubcategory(raw.category, raw.subcategory)
      : (typeof isValidSubcategory === 'function' && isValidSubcategory(raw.category, raw.subcategory) ? raw.subcategory : null),
    author: raw.author || '游客',
    image: raw.image || null,
    image_thumbnail: raw.image_thumbnail || null,
    image_thumbnails: raw.image_thumbnails || null,
    images: null,
    youtube: raw.youtube || '',
    youtube_vertical: false,
    tiktok_url: null,
    likes: raw.likes || 0,
    liked: false,
    collected: false,
    event: raw.event,
    tags: raw.tags || [],
    user_id: raw.user_id || null,
    visibility: raw.visibility || 'public',
    pinned: !!raw.pinned,
    time: raw.created_at ? new Date(raw.created_at).toLocaleString('zh-CN') : new Date().toLocaleString('zh-CN'),
    created_at: raw.created_at || null,
    scheduled_at: raw.scheduled_at || null,
    location: raw.location || null,
    comments: []
  });

  window.LeshenghuoFeedData = { publicFeedFields, publicFilter, buildPublicFeedUrls, compactPost };
})();
