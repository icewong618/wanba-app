/* Shared merchant membership card access for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const requireOk = async (response, action) => {
      if(!response.ok) throw new Error(`${action} ${response.status}: ${(await response.text()).slice(0, 160)}`);
      return response;
    };
    const loadForMerchant = async ({ merchantUserId, select, limit = 80 } = {}) => {
      const response = await request(`${supabaseUrl}/rest/v1/merchant_memberships?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&status=eq.active&select=${select}&order=joined_at.desc&limit=${Number(limit)}`, { method:'GET' });
      await requireOk(response, '商家会员读取失败');
      return response.json();
    };
    const loadForUser = async ({ userId, select, limit = 120 } = {}) => {
      const response = await request(`${supabaseUrl}/rest/v1/merchant_memberships?user_id=eq.${encodeURIComponent(userId)}&status=eq.active&select=${select}&order=updated_at.desc&limit=${Number(limit)}`, { method:'GET' });
      await requireOk(response, '用户会员卡读取失败');
      return response.json();
    };
    const upsert = async payload => {
      const response = await request(`${supabaseUrl}/rest/v1/merchant_memberships?on_conflict=merchant_user_id,user_id`, {
        method:'POST', headers:{ 'Content-Type':'application/json', Prefer:'resolution=merge-duplicates,return=representation' }, body:JSON.stringify(payload)
      });
      await requireOk(response, '加入商家会员失败');
      return response.json();
    };
    const remove = async ({ merchantUserId, userId }) => {
      const response = await request(`${supabaseUrl}/rest/v1/merchant_memberships?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&user_id=eq.${encodeURIComponent(userId)}`, { method:'DELETE' });
      await requireOk(response, '取消商家会员失败');
    };
    const loadMerchants = async ({ ids, select } = {}) => {
      if(!ids?.length) return [];
      const response = await request(`${supabaseUrl}/rest/v1/merchants?user_id=in.(${ids.map(encodeURIComponent).join(',')})&verified=eq.true&select=${select}`, { method:'GET' });
      await requireOk(response, '会员商家资料读取失败');
      return response.json();
    };
    const loadTransactionsForMerchant = async ({ merchantUserId, select, limit = 1000 } = {}) => {
      if(!merchantUserId) return [];
      const response = await request(`${supabaseUrl}/rest/v1/merchant_member_transactions?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&select=${select}&order=created_at.desc&limit=${Math.max(1, Math.min(Number(limit) || 1000, 2000))}`, { method:'GET' });
      await requireOk(response, '商家会员流水读取失败');
      return response.json();
    };
    const loadTransactionsForMembership = async ({ membershipId, select, limit = 1000 } = {}) => {
      if(!membershipId) return [];
      const response = await request(`${supabaseUrl}/rest/v1/merchant_member_transactions?membership_id=eq.${encodeURIComponent(membershipId)}&select=${select}&order=created_at.desc&limit=${Math.max(1, Math.min(Number(limit) || 1000, 2000))}`, { method:'GET' });
      await requireOk(response, '会员卡流水读取失败');
      return response.json();
    };
    return { loadForMerchant, loadForUser, upsert, remove, loadMerchants, loadTransactionsForMerchant, loadTransactionsForMembership };
  };
  window.LeshenghuoMerchantMembershipApi = { create };
})();
