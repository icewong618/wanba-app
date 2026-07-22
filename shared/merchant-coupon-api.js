/* Shared merchant coupon claim lifecycle API for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const requireOk = async (response, action) => {
      if(!response.ok) throw new Error(`${action} ${response.status}: ${(await response.text()).slice(0, 200)}`);
      return response;
    };
    const rpc = async (name, payload = {}) => {
      const response = await request(`${supabaseUrl}/rest/v1/rpc/${name}`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify(payload)
      });
      await requireOk(response, `${name} 调用失败`);
      return response.json();
    };
    const listClaims = async ({ userId, limit = 500 } = {}) => {
      const response = await request(`${supabaseUrl}/rest/v1/merchant_coupon_claims?user_id=eq.${encodeURIComponent(userId)}&select=*&order=claimed_at.desc&limit=${Math.max(1, Math.min(Number(limit) || 500, 1000))}`, { method:'GET' });
      await requireOk(response, '优惠券读取失败');
      const rows = await response.json();
      return Array.isArray(rows) ? rows : [];
    };
    const getClaim = async ({ claimId, merchantUserId } = {}) => {
      const response = await request(`${supabaseUrl}/rest/v1/merchant_coupon_claims?id=eq.${encodeURIComponent(claimId)}&merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&select=*&limit=1`, { method:'GET' });
      await requireOk(response, '优惠券核对失败');
      const rows = await response.json();
      return Array.isArray(rows) ? rows[0] || null : null;
    };
    const claim = ({ merchantUserId, couponId }) => rpc('claim_merchant_coupon', {
      p_merchant_user_id:merchantUserId,
      p_coupon_id:couponId
    });
    const remove = claimId => rpc('delete_merchant_coupon_claim', { p_claim_id:Number(claimId) });
    const redeem = claimId => rpc('redeem_merchant_coupon_claim', { p_claim_id:Number(claimId) });
    return { listClaims, getClaim, claim, remove, redeem };
  };
  window.LeshenghuoMerchantCouponApi = { create };
})();
