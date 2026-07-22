/* Administrator center data access for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const requireOk = async (response, action) => {
      if(!response.ok) throw new Error(`${action} ${response.status}: ${(await response.text()).slice(0, 160)}`);
      return response;
    };
    const readSnapshot = async () => {
      const response = await request(`${supabaseUrl}/rest/v1/rpc/admin_center_snapshot`, {
        method:'POST', body:JSON.stringify({})
      });
      if(!response.ok) return { ok:false, error:await response.text() };
      return { ok:true, data:await response.json() };
    };
    const readFallback = async () => {
      const [users, posts, comments, statuses] = await Promise.all([
        request(`${supabaseUrl}/rest/v1/profiles?select=user_id,name,avatar,updated_at&order=updated_at.desc&limit=120`, { method:'GET' }),
        request(`${supabaseUrl}/rest/v1/posts?select=id,user_id,author,title,content,category,subcategory,community_meta,created_at,likes&order=created_at.desc&limit=80`, { method:'GET' }),
        request(`${supabaseUrl}/rest/v1/comments?select=id,post_id,user_id,name,text,created_at,parent_id,reply_to_name&order=created_at.desc&limit=120`, { method:'GET' }),
        request(`${supabaseUrl}/rest/v1/admin_user_statuses?select=user_id,status,reason,created_at,created_by&order=created_at.desc&limit=120`, { method:'GET' })
      ]);
      await requireOk(users, '管理员用户读取失败');
      await requireOk(posts, '管理员帖子读取失败');
      await requireOk(comments, '管理员评论读取失败');
      return {
        users:await users.json(),
        posts:await posts.json(),
        comments:await comments.json(),
        banned:statuses.ok ? await statuses.json() : []
      };
    };
    const deletePost = async id => {
      const response = await request(`${supabaseUrl}/rest/v1/posts?id=eq.${encodeURIComponent(id)}`, { method:'DELETE' });
      await requireOk(response, '删除帖子失败');
    };
    const deleteComment = async id => {
      const response = await request(`${supabaseUrl}/rest/v1/comments?id=eq.${encodeURIComponent(id)}`, { method:'DELETE' });
      await requireOk(response, '删除评论失败');
    };
    return { readSnapshot, readFallback, deletePost, deleteComment };
  };
  window.LeshenghuoAdminCenterApi = { create };
})();
