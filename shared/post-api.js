/* Shared post write access for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', authRequest = (...args) => fetch(...args) } = {}) => {
    const request = async (path, options, errorPrefix) => {
      const response = await authRequest(`${supabaseUrl}/rest/v1/posts${path}`, options);
      if(!response.ok){
        const text = await response.text();
        throw new Error(`${errorPrefix} ${response.status}: ${text.slice(0,120)}`);
      }
      return response;
    };
    const createPost = async fields => {
      const response = await request('', { method:'POST', body:JSON.stringify(fields) }, '插入失败');
      const rows = await response.json();
      return rows[0] || null;
    };
    const updatePost = async (postId, fields) => {
      const response = await request(
        `?id=eq.${encodeURIComponent(postId)}`,
        { method:'PATCH', headers:{ Prefer:'return=representation' }, body:JSON.stringify(fields) },
        '更新失败'
      );
      const rows = await response.json().catch(() => []);
      // RLS 未匹配时，PostgREST 可能返回成功状态却没有实际更新任何行。
      if(!Array.isArray(rows) || rows.length === 0){
        throw new Error('更新未生效：未找到可编辑的笔记');
      }
      return rows[0];
    };
    const deletePost = async postId => {
      await request(`?id=eq.${encodeURIComponent(postId)}`, { method:'DELETE' }, '删除失败');
    };
    return { createPost, updatePost, deletePost };
  };
  window.LeshenghuoPostApi = { create };
})();
