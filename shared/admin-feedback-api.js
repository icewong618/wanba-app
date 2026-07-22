/* Admin public beta feedback access for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const readAll = async () => {
      const response = await request(`${supabaseUrl}/rest/v1/user_feedback?select=*&order=created_at.desc&limit=120`, { method:'GET' });
      if(!response.ok) throw new Error(`管理员反馈读取失败 ${response.status}: ${(await response.text()).slice(0, 120)}`);
      return response.json();
    };
    const updateStatus = async ({ id, status, handledBy }) => {
      const fields = { status, resolved_at:status === 'resolved' ? new Date().toISOString() : null, handled_by:handledBy };
      const response = await request(`${supabaseUrl}/rest/v1/user_feedback?id=eq.${encodeURIComponent(id)}`, { method:'PATCH', body:JSON.stringify(fields) });
      if(!response.ok) throw new Error(`反馈状态更新失败 ${response.status}: ${(await response.text()).slice(0, 120)}`);
    };
    const reply = async ({ id, replyText, status, handledBy }) => {
      const fields = { admin_reply:replyText, replied_at:new Date().toISOString(), status, resolved_at:status === 'resolved' ? new Date().toISOString() : null, handled_by:handledBy };
      const response = await request(`${supabaseUrl}/rest/v1/user_feedback?id=eq.${encodeURIComponent(id)}`, { method:'PATCH', body:JSON.stringify(fields) });
      if(!response.ok) throw new Error(`反馈回复失败 ${response.status}: ${(await response.text()).slice(0, 120)}`);
    };
    return { readAll, updateStatus, reply };
  };
  window.LeshenghuoAdminFeedbackApi = { create };
})();
