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
    return { setReaction, createComment, deleteComment };
  };

  window.LeshenghuoEngagementApi = { create };
})();
