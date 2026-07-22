/* Shared engagement write API for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const tableName = value => ['likes', 'favorites', 'comments'].includes(value) ? value : '';
    const setReaction = async ({ table, postId, userId, name, active }) => {
      const target = tableName(table);
      if(!target) throw new Error('不支持的互动类型');
      if(active){
        return request(`${supabaseUrl}/rest/v1/${target}`, {
          method:'POST',
          body: JSON.stringify({ post_id: postId, user_id: userId, name })
        });
      }
      return request(`${supabaseUrl}/rest/v1/${target}?post_id=eq.${encodeURIComponent(postId)}&user_id=eq.${encodeURIComponent(userId)}`, { method:'DELETE' });
    };
    const createComment = payload => request(`${supabaseUrl}/rest/v1/comments`, {
      method:'POST', body: JSON.stringify(payload)
    });
    const deleteComment = id => request(`${supabaseUrl}/rest/v1/comments?id=eq.${encodeURIComponent(id)}`, { method:'DELETE' });
    const loadPostStats = async postId => {
      if(postId === null || postId === undefined || postId === '') return { views:0, likes:0, comments:0, favorites:0 };
      const encodedId = encodeURIComponent(postId);
      const responses = await Promise.all([
        request(`${supabaseUrl}/rest/v1/post_views?post_id=eq.${encodedId}&select=id`, { method:'GET' }),
        request(`${supabaseUrl}/rest/v1/likes?post_id=eq.${encodedId}&select=user_id`, { method:'GET' }),
        request(`${supabaseUrl}/rest/v1/comments?post_id=eq.${encodedId}&select=id`, { method:'GET' }),
        request(`${supabaseUrl}/rest/v1/favorites?post_id=eq.${encodedId}&select=user_id`, { method:'GET' })
      ]);
      const values = await Promise.all(responses.map(async response => response.ok ? response.json() : []));
      return { views:values[0].length, likes:values[1].length, comments:values[2].length, favorites:values[3].length };
    };
    return { setReaction, createComment, deleteComment, loadPostStats };
  };

  window.LeshenghuoEngagementApi = { create };
})();
