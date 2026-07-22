/* Shared profile database access for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', getCurrentUserId = () => null, request = (...args) => fetch(...args) } = {}) => {
    const currentUserId = () => getCurrentUserId() || '';
    const profilePath = suffix => `${supabaseUrl}/rest/v1/profiles${suffix || ''}`;
    const write = async payload => {
      const userId = currentUserId();
      if(!userId) throw new Error('未登录');
      let response = await request(profilePath(`?user_id=eq.${encodeURIComponent(userId)}`), {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      let rows = response.ok ? await response.json() : [];
      if(response.ok && !rows.length){
        response = await request(profilePath(), {
          method: 'POST',
          body: JSON.stringify(Object.assign({ user_id: userId }, payload))
        });
      }
      return response;
    };
    const fetchCurrent = async () => {
      const userId = currentUserId();
      if(!userId) return null;
      return getByUserId({ userId, select:'name,avatar,bio,tags,gender,birth,cover,ip_location,updated_at' });
    };
    const getByUserId = async ({ userId, select = 'user_id,name,avatar,bio,tags,gender,birth,cover,ip_location,updated_at' } = {}) => {
      if(!userId) return null;
      let response = await request(profilePath(`?user_id=eq.${encodeURIComponent(userId)}&select=${select}&limit=1`), { method:'GET' });
      if(!response.ok){
        response = await request(profilePath(`?user_id=eq.${encodeURIComponent(userId)}&select=user_id,name,avatar&limit=1`), { method:'GET' });
      }
      if(!response.ok) return null;
      const rows = await response.json();
      return rows && rows[0] ? rows[0] : null;
    };
    const searchByName = async ({ keyword, limit = 20 } = {}) => {
      const name = String(keyword || '').trim();
      if(!name) return [];
      const response = await request(profilePath(`?name=ilike.*${encodeURIComponent(name)}*&select=user_id,name,avatar&limit=${Math.max(1, Math.min(Number(limit) || 20, 50))}`), { method:'GET' });
      if(!response.ok) throw new Error(`用户搜索失败 ${response.status}`);
      const rows = await response.json();
      return Array.isArray(rows) ? rows : [];
    };
    return { write, fetchCurrent, getByUserId, searchByName };
  };

  window.LeshenghuoProfileApi = { create };
})();
