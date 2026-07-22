/* Merchant team workspace requests for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const requireOk = async (response, action) => {
      if(!response.ok) throw new Error(`${action} ${response.status}: ${(await response.text()).slice(0, 160)}`);
      return response;
    };
    const callRpc = async (name, payload = {}) => {
      const response = await request(`${supabaseUrl}/rest/v1/rpc/${name}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
      await requireOk(response, `${name} 调用失败`);
      return response.json();
    };
    const loadState = async userId => {
      const [workspaces, invites] = await Promise.all([
        callRpc('merchant_matrix_my_access'),
        request(`${supabaseUrl}/rest/v1/merchant_team_members?member_user_id=eq.${encodeURIComponent(userId)}&status=eq.pending&select=id,merchant_user_id,role,roles,permissions,invited_at&order=invited_at.desc`, { method:'GET' })
      ]);
      await requireOk(invites, '商家邀请读取失败');
      return { workspaces:Array.isArray(workspaces) ? workspaces : [], invites:await invites.json() };
    };
    const listMembers = async merchantUserId => {
      const response = await request(`${supabaseUrl}/rest/v1/merchant_team_members?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&select=id,member_user_id,role,roles,permissions,status,invited_at,responded_at,updated_at&order=updated_at.desc`, { method:'GET' });
      await requireOk(response, '团队成员读取失败');
      return response.json();
    };
    const respondInvite = (id, accept) => callRpc('merchant_matrix_respond_invite', { p_team_member_id:Number(id), p_accept:!!accept });
    const searchPeople = query => callRpc('merchant_matrix_search_people', { p_query:String(query || '').trim() });
    const invite = ({ userId, roles, permissions }) => callRpc('merchant_matrix_invite_member_v2', { p_member_user_id:userId, p_roles:roles, p_permissions:permissions });
    const revoke = id => callRpc('merchant_matrix_revoke_member', { p_team_member_id:Number(id) });
    const updateAccess = ({ id, roles, permissions }) => callRpc('merchant_matrix_update_member_access', { p_team_member_id:Number(id), p_roles:roles, p_permissions:permissions });
    return { loadState, listMembers, respondInvite, searchPeople, invite, revoke, updateAccess };
  };
  window.LeshenghuoMerchantTeamApi = { create };
})();
