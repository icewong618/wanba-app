/* Merchant dashboard analytics data API for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const readRows = async path => {
      const response = await request(`${supabaseUrl}/rest/v1/${path}`, { method:'GET' });
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      const rows = await response.json();
      return Array.isArray(rows) ? rows : [];
    };
    const loadDashboard = async ({ merchantUserId, since } = {}) => {
      if(!merchantUserId) return { ownPosts:[], data:{}, unavailable:[] };
      const ownPosts = await readRows(`posts?user_id=eq.${encodeURIComponent(merchantUserId)}&select=id,title,image,created_at&order=created_at.desc&limit=200`);
      const postIds = ownPosts.map(post => Number(post.id)).filter(Number.isFinite);
      const postFilter = postIds.length ? `post_id=in.(${postIds.join(',')})&` : '';
      const sinceValue = encodeURIComponent(since || new Date(0).toISOString());
      const requests = {
        views: postIds.length ? readRows(`post_views?${postFilter}created_at=gte.${sinceValue}&select=post_id,created_at`) : Promise.resolve([]),
        likes: postIds.length ? readRows(`likes?${postFilter}created_at=gte.${sinceValue}&select=post_id,created_at`) : Promise.resolve([]),
        comments: postIds.length ? readRows(`comments?${postFilter}created_at=gte.${sinceValue}&select=post_id,created_at`) : Promise.resolve([]),
        favorites: postIds.length ? readRows(`favorites?${postFilter}created_at=gte.${sinceValue}&select=post_id,created_at`) : Promise.resolve([]),
        claims: readRows(`merchant_coupon_claims?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&claimed_at=gte.${sinceValue}&select=id,claimed_at,status`),
        redeemed: readRows(`merchant_coupon_claims?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&redeemed_at=gte.${sinceValue}&select=id,redeemed_at,status`),
        newMembers: readRows(`merchant_memberships?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&joined_at=gte.${sinceValue}&select=id,joined_at`),
        activeMembers: readRows(`merchant_memberships?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&status=eq.active&select=id`),
        checkins: readRows(`merchant_member_transactions?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&created_at=gte.${sinceValue}&transaction_kind=eq.stamp_checkin&select=id,created_at`)
      };
      const keys = Object.keys(requests);
      const settled = await Promise.allSettled(Object.values(requests));
      const data = Object.fromEntries(keys.map((key, index) => [key, settled[index].status === 'fulfilled' ? settled[index].value : null]));
      const unavailable = keys.filter((key, index) => settled[index].status === 'rejected');
      return { ownPosts, data, unavailable };
    };
    return { loadDashboard };
  };
  window.LeshenghuoMerchantAnalyticsApi = { create };
})();
