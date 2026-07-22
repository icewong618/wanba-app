/* Shared deal data access for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const requireOk = async (response, action) => {
      if(!response.ok) throw new Error(`${action} ${response.status}: ${(await response.text()).slice(0, 160)}`);
      return response;
    };
    const loadCurrentPrices = async ({ select, limit = 120 } = {}) => {
      const response = await request(`${supabaseUrl}/rest/v1/deal_current_prices?select=${select}&order=is_food_low_price.desc&order=is_hot.desc&order=updated_at.desc&limit=${Number(limit)}`);
      await requireOk(response, '优惠缓存读取失败');
      return response.json();
    };
    const loadRankings = async ({ select, limit = 20 } = {}) => {
      const response = await request(`${supabaseUrl}/rest/v1/deal_rankings?select=${select}&order=hot_score.desc&limit=${Number(limit)}`);
      await requireOk(response, '优惠热榜读取失败');
      return response.json();
    };
    const createReport = async payload => {
      const response = await request(`${supabaseUrl}/rest/v1/deal_reports`, {
        method:'POST', headers:{ Prefer:'return=minimal' }, body:JSON.stringify(payload)
      });
      await requireOk(response, '优惠提交失败');
    };
    const recordInteraction = async payload => {
      const response = await request(`${supabaseUrl}/rest/v1/deal_interactions`, {
        method:'POST', headers:{ Prefer:'return=minimal' }, body:JSON.stringify(payload)
      });
      await requireOk(response, '优惠互动记录失败');
    };
    return { loadCurrentPrices, loadRankings, createReport, recordInteraction };
  };
  window.LeshenghuoDealsApi = { create };
})();
