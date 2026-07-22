/* Shared merchant profile, public page and store data access for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const requireOk = async (response, action) => {
      if(!response.ok) throw new Error(`${action} ${response.status}: ${(await response.text()).slice(0, 160)}`);
      return response;
    };
    const getByUserId = async ({ userId, select = '*', verified = true } = {}) => {
      const verifiedFilter = verified ? '&verified=eq.true' : '';
      const response = await request(`${supabaseUrl}/rest/v1/merchants?user_id=eq.${encodeURIComponent(userId)}${verifiedFilter}&select=${select}&limit=1`, { method:'GET' });
      await requireOk(response, '商家资料读取失败');
      const rows = await response.json();
      return Array.isArray(rows) ? rows[0] || null : null;
    };
    const getBySlug = async ({ slug, select = '*', verified = true } = {}) => {
      const verifiedFilter = verified ? '&verified=eq.true' : '';
      const response = await request(`${supabaseUrl}/rest/v1/merchants?slug=eq.${encodeURIComponent(slug)}${verifiedFilter}&select=${select}&limit=1`, { method:'GET' });
      await requireOk(response, '商家微网站读取失败');
      const rows = await response.json();
      return Array.isArray(rows) ? rows[0] || null : null;
    };
    const patch = async ({ userId, payload }) => {
      const response = await request(`${supabaseUrl}/rest/v1/merchants?user_id=eq.${encodeURIComponent(userId)}`, { method:'PATCH', body:JSON.stringify(payload) });
      await requireOk(response, '商家资料更新失败');
    };
    const upsert = async ({ userId, payload }) => {
      const response = await request(`${supabaseUrl}/rest/v1/merchants?on_conflict=user_id`, {
        method:'POST', headers:{ 'Content-Type':'application/json', Prefer:'resolution=merge-duplicates,return=representation' }, body:JSON.stringify(Object.assign({ user_id:userId }, payload))
      });
      await requireOk(response, '商家资料保存失败');
      const rows = await response.json().catch(() => []);
      return Array.isArray(rows) ? rows : [];
    };
    const loadStats = async merchantId => {
      const [followers, likes] = await Promise.all([
        request(`${supabaseUrl}/rest/v1/merchant_follows?merchant_id=eq.${encodeURIComponent(merchantId)}&select=follower_id`),
        request(`${supabaseUrl}/rest/v1/merchant_likes?merchant_id=eq.${encodeURIComponent(merchantId)}&select=user_id`)
      ]);
      await Promise.all([requireOk(followers, '商家关注统计读取失败'), requireOk(likes, '商家点赞统计读取失败')]);
      const [followerRows, likeRows] = await Promise.all([followers.json(), likes.json()]);
      return { followers:Array.isArray(followerRows) ? followerRows : [], likes:Array.isArray(likeRows) ? likeRows : [] };
    };
    const loadDeals = async ({ merchantId, businessName, select, limit = 8 } = {}) => {
      const filters = [];
      if(merchantId) filters.push(`merchant_id.eq.${encodeURIComponent(merchantId)}`);
      const name = String(businessName || '').replace(/,/g, ' ').trim();
      if(name) filters.push(`retailer_name.ilike.*${encodeURIComponent(name)}*`);
      if(!filters.length) return [];
      const response = await request(`${supabaseUrl}/rest/v1/deals?select=${select}&or=(${filters.join(',')})&order=updated_at.desc&limit=${Number(limit)}`, { method:'GET' });
      await requireOk(response, '商家优惠读取失败');
      return response.json();
    };
    return { getByUserId, getBySlug, patch, upsert, loadStats, loadDeals };
  };
  window.LeshenghuoMerchantPublicApi = { create };
})();
