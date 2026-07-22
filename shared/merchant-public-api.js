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
    const getBySlug = async ({ slug, marketCode = '', select = '*', verified = true } = {}) => {
      const verifiedFilter = verified ? '&verified=eq.true' : '';
      const marketFilter = marketCode ? `&market_code=eq.${encodeURIComponent(marketCode)}` : '';
      const response = await request(`${supabaseUrl}/rest/v1/merchants?slug=eq.${encodeURIComponent(slug)}${marketFilter}${verifiedFilter}&select=${select}&limit=1`, { method:'GET' });
      await requireOk(response, '商家微网站读取失败');
      const rows = await response.json();
      return Array.isArray(rows) ? rows[0] || null : null;
    };
    const listByUserIds = async ({ userIds = [], select = 'user_id,business_name,logo', verified = false } = {}) => {
      const ids = [...new Set((userIds || []).filter(Boolean).map(value => String(value)))];
      if(!ids.length) return [];
      const verifiedFilter = verified ? '&verified=eq.true' : '';
      const response = await request(`${supabaseUrl}/rest/v1/merchants?user_id=in.(${ids.map(encodeURIComponent).join(',')})${verifiedFilter}&select=${select}`, { method:'GET' });
      await requireOk(response, '商家资料批量读取失败');
      const rows = await response.json();
      return Array.isArray(rows) ? rows : [];
    };
    const isSlugTaken = async ({ slug, marketCode = '', excludeUserId = '' } = {}) => {
      const normalizedSlug = String(slug || '').trim();
      if(!normalizedSlug) return false;
      const excludeFilter = excludeUserId ? `&user_id=neq.${encodeURIComponent(excludeUserId)}` : '';
      const marketFilter = marketCode ? `&market_code=eq.${encodeURIComponent(marketCode)}` : '';
      const response = await request(`${supabaseUrl}/rest/v1/merchants?slug=eq.${encodeURIComponent(normalizedSlug)}${marketFilter}${excludeFilter}&select=user_id&limit=1`, { method:'GET' });
      await requireOk(response, '商家链接检查失败');
      const rows = await response.json();
      return Array.isArray(rows) && rows.length > 0;
    };
    const isBusinessNameTaken = async ({ businessName, marketCode = '', excludeUserId = '' } = {}) => {
      const normalizedName = String(businessName || '').trim();
      if(!normalizedName) return false;
      const marketFilter = marketCode ? `&market_code=eq.${encodeURIComponent(marketCode)}` : '';
      const excludeFilter = excludeUserId ? `&user_id=neq.${encodeURIComponent(excludeUserId)}` : '';
      const response = await request(`${supabaseUrl}/rest/v1/merchants?business_name=ilike.${encodeURIComponent(normalizedName)}${marketFilter}${excludeFilter}&select=user_id&limit=1`, { method:'GET' });
      await requireOk(response, '商家名称检查失败');
      const rows = await response.json();
      return Array.isArray(rows) && rows.length > 0;
    };
    const searchVerified = async ({ keyword, limit = 20 } = {}) => {
      const value = String(keyword || '').trim();
      if(!value) return [];
      const safeLimit = Math.max(1, Math.min(Number(limit) || 20, 50));
      const encoded = encodeURIComponent(value);
      const response = await request(`${supabaseUrl}/rest/v1/merchants?verified=eq.true&or=(business_name.ilike.*${encoded}*,address.ilike.*${encoded}*,slug.ilike.*${encoded}*)&select=user_id,slug,business_name,category,address,logo,subcategory&limit=${safeLimit}`, { method:'GET' });
      await requireOk(response, '商家地点搜索失败');
      const rows = await response.json();
      return Array.isArray(rows) ? rows : [];
    };
    const patch = async ({ userId, payload, returnRepresentation = false } = {}) => {
      const headers = returnRepresentation ? { Prefer:'return=representation' } : undefined;
      const response = await request(`${supabaseUrl}/rest/v1/merchants?user_id=eq.${encodeURIComponent(userId)}`, { method:'PATCH', headers, body:JSON.stringify(payload) });
      await requireOk(response, '商家资料更新失败');
      if(!returnRepresentation) return [];
      const rows = await response.json().catch(() => []);
      return Array.isArray(rows) ? rows : [];
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
    return { getByUserId, getBySlug, listByUserIds, isSlugTaken, isBusinessNameTaken, searchVerified, patch, upsert, loadStats, loadDeals };
  };
  window.LeshenghuoMerchantPublicApi = { create };
})();
