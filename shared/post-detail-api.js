/* Shared post detail access for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', publicHeaders = () => ({}), publicRequest = (...args) => fetch(...args), authRequest = (...args) => fetch(...args) } = {}) => {
    const sharedSelect = ['id','title','content','excerpt','category','subcategory','author','image','image_thumbnail','images','image_thumbnails','youtube','likes','event','tags','user_id','visibility','pinned','created_at','location'].join(',');
    const fetchSharedPost = async postId => {
      const response = await publicRequest(`${supabaseUrl}/rest/v1/posts?id=eq.${encodeURIComponent(postId)}&select=${sharedSelect}&limit=1`, {
        method:'GET', headers:Object.assign({ 'Content-Type':'application/json', 'Accept':'application/json' }, publicHeaders())
      }, 7000);
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      const rows = await response.json();
      return rows && rows[0] ? rows[0] : null;
    };
    const fetchDetailFields = async postId => {
      const select = 'content,images,community_meta,location';
      const response = await publicRequest(`${supabaseUrl}/rest/v1/posts?id=eq.${encodeURIComponent(postId)}&select=${select}&limit=1`, {
        method:'GET', headers:Object.assign({ 'Content-Type':'application/json', 'Accept':'application/json' }, publicHeaders())
      }, 6000);
      if(!response.ok) throw new Error(`详情读取失败 ${response.status}`);
      const rows = await response.json();
      return rows && rows[0] ? rows[0] : null;
    };
    const fetchComments = async postId => {
      const select = 'id,post_id,user_id,name,text,created_at,parent_id,reply_to_user_id,reply_to_name';
      const response = await authRequest(`${supabaseUrl}/rest/v1/comments?post_id=eq.${encodeURIComponent(postId)}&select=${select}&order=created_at.asc`, { method:'GET' });
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    };
    return { fetchSharedPost, fetchDetailFields, fetchComments };
  };

  window.LeshenghuoPostDetailApi = { create };
})();
