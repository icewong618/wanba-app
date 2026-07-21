/* Shared message data access for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', getCurrentUserId = () => null, request = (...args) => fetch(...args) } = {}) => {
    const requireUserId = () => getCurrentUserId() || null;
    const requestRows = async (path, options = { method: 'GET' }) => {
      const response = await request(`${supabaseUrl}/rest/v1/${path}`, options);
      if(!response.ok) throw new Error(`消息读取失败 ${response.status}`);
      return response.json();
    };

    const loadDirectMessages = async () => {
      const userId = requireUserId();
      if(!userId) return [];
      const encodedId = encodeURIComponent(userId);
      return requestRows(`messages?or=(to_id.eq.${encodedId},from_id.eq.${encodedId})&order=created_at.asc`);
    };

    const loadMemberActivities = async () => {
      const userId = requireUserId();
      if(!userId) return [];
      return requestRows(`member_activity_notifications?user_id=eq.${encodeURIComponent(userId)}&select=*&order=created_at.desc&limit=100`);
    };

    const loadModerationNotices = async () => {
      const userId = requireUserId();
      if(!userId) return [];
      return requestRows(`user_moderation_notices?user_id=eq.${encodeURIComponent(userId)}&select=*&order=created_at.desc&limit=30`);
    };

    const markMemberActivitiesRead = async (rows) => {
      const ids = (rows || []).filter(row => !row.read_at).map(row => row.id).filter(Boolean);
      if(!ids.length) return rows || [];
      const readAt = new Date().toISOString();
      const response = await request(`${supabaseUrl}/rest/v1/member_activity_notifications?id=in.(${ids.join(',')})`, {
        method: 'PATCH',
        body: JSON.stringify({ read_at: readAt })
      });
      if(!response.ok) throw new Error(`消息更新失败 ${response.status}`);
      return (rows || []).map(row => ids.includes(row.id) ? Object.assign({}, row, { read_at: readAt }) : row);
    };

    return { loadDirectMessages, loadMemberActivities, loadModerationNotices, markMemberActivitiesRead };
  };

  window.LeshenghuoMessageData = { create };
})();
