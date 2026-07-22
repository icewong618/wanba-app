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
      let response = await request(profilePath(`?user_id=eq.${encodeURIComponent(userId)}&select=name,avatar,bio,tags,gender,birth,cover,ip_location,updated_at`), { method:'GET' });
      if(!response.ok){
        response = await request(profilePath(`?user_id=eq.${encodeURIComponent(userId)}&select=name,avatar`), { method:'GET' });
      }
      if(!response.ok) return null;
      const rows = await response.json();
      return rows && rows[0] ? rows[0] : null;
    };
    return { write, fetchCurrent };
  };

  window.LeshenghuoProfileApi = { create };
})();
