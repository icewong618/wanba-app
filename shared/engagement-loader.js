/* Shared public engagement loading and aggregation for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', supabaseKey = '', getCurrentUserId = () => null, fetchImpl = (...args) => fetch(...args) } = {}) => {
    const publicRead = url => fetchImpl(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
    });
    const load = async () => {
      const [likesResponse, favoritesResponse, commentsResponse, followsResponse] = await Promise.all([
        publicRead(`${supabaseUrl}/rest/v1/likes?select=post_id,user_id,name,created_at`),
        publicRead(`${supabaseUrl}/rest/v1/favorites?select=post_id,user_id,name,created_at`),
        publicRead(`${supabaseUrl}/rest/v1/comments?select=post_id,user_id,name,text,created_at,parent_id,reply_to_user_id,reply_to_name`),
        publicRead(`${supabaseUrl}/rest/v1/follows?select=*`)
      ]);
      const [likes, favorites, comments, follows] = await Promise.all([
        likesResponse.ok ? likesResponse.json() : null,
        favoritesResponse.ok ? favoritesResponse.json() : null,
        commentsResponse.ok ? commentsResponse.json() : null,
        followsResponse.ok ? followsResponse.json() : null
      ]);
      const me = getCurrentUserId();
      const likeCount = {}, favoriteCount = {}, commentCount = {};
      const myLikes = new Set(), myFavorites = new Set();
      (likes || []).forEach(row => {
        likeCount[row.post_id] = (likeCount[row.post_id] || 0) + 1;
        if (row.user_id === me) myLikes.add(row.post_id);
      });
      (favorites || []).forEach(row => {
        favoriteCount[row.post_id] = (favoriteCount[row.post_id] || 0) + 1;
        if (row.user_id === me) myFavorites.add(row.post_id);
      });
      (comments || []).forEach(row => { commentCount[row.post_id] = (commentCount[row.post_id] || 0) + 1; });
      return {
        likes, favorites, comments, follows,
        likeCount, favoriteCount, commentCount, myLikes, myFavorites,
        partialFailure: !likesResponse.ok || !favoritesResponse.ok || !commentsResponse.ok || !followsResponse.ok
      };
    };
    return { load };
  };
  window.LeshenghuoEngagementLoader = { create };
})();
