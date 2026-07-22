/* Administrator access and moderation requests for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const requireOk = async (response, action) => {
      if(!response.ok) throw new Error(`${action} ${response.status}: ${(await response.text()).slice(0, 160)}`);
      return response;
    };
    const isAdmin = async userId => {
      const response = await request(`${supabaseUrl}/rest/v1/deal_admins?user_id=eq.${encodeURIComponent(userId)}&select=user_id&limit=1`, { method:'GET' });
      await requireOk(response, '管理员权限检查失败');
      const rows = await response.json();
      return Array.isArray(rows) && rows.length > 0;
    };
    const moderateUser = async ({ userId, action, reason, note, days }) => {
      const response = await request(`${supabaseUrl}/rest/v1/rpc/admin_moderate_user`, {
        method:'POST',
        body:JSON.stringify({ p_user_id:userId, p_action_type:action, p_reason_code:reason, p_note:note, p_duration_days:days })
      });
      await requireOk(response, '用户处理失败');
    };
    const setLegacyBan = async ({ userId, reason, createdBy }) => {
      const fields = { status:'banned', reason:reason || '', created_by:createdBy, updated_at:new Date().toISOString() };
      let response = await request(`${supabaseUrl}/rest/v1/admin_user_statuses?user_id=eq.${encodeURIComponent(userId)}`, { method:'PATCH', body:JSON.stringify(fields) });
      await requireOk(response, '封禁状态更新失败');
      const rows = await response.json();
      if(Array.isArray(rows) && rows.length) return;
      response = await request(`${supabaseUrl}/rest/v1/admin_user_statuses`, { method:'POST', body:JSON.stringify({ user_id:userId, ...fields }) });
      await requireOk(response, '封禁状态创建失败');
    };
    return { isAdmin, moderateUser, setLegacyBan };
  };
  window.LeshenghuoAdminAccessApi = { create };
})();
