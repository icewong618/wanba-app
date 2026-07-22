/* Restaurant order read API for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const requireOk = async (response, action) => {
      if(!response.ok) throw new Error(`${action} ${response.status}: ${(await response.text()).slice(0, 200)}`);
      return response;
    };
    const readRows = async (path, action) => {
      const response = await request(`${supabaseUrl}/rest/v1/${path}`, { method:'GET' });
      await requireOk(response, action);
      const rows = await response.json();
      return Array.isArray(rows) ? rows : [];
    };
    const listTables = ({ merchantUserId, includeInactive = false } = {}) => {
      if(!merchantUserId) return Promise.resolve([]);
      const activeFilter = includeInactive ? '' : '&is_active=eq.true';
      return readRows(`merchant_order_tables?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&deleted_at=is.null${activeFilter}&select=*&order=table_name.asc`, '餐桌读取失败');
    };
    const listOrders = ({ merchantUserId, statuses = [], limit = 100, order = 'updated_at.desc', select = '*' } = {}) => {
      if(!merchantUserId) return Promise.resolve([]);
      const statusFilter = Array.isArray(statuses) && statuses.length ? `&status=in.(${statuses.map(encodeURIComponent).join(',')})` : '';
      return readRows(`merchant_orders?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}${statusFilter}&select=${encodeURIComponent(select)}&order=${encodeURIComponent(order)}&limit=${Math.max(1, Math.min(Number(limit) || 100, 500))}`, '订单读取失败');
    };
    const getOrder = async ({ orderId, select = '*' } = {}) => {
      if(!orderId) return null;
      const rows = await readRows(`merchant_orders?id=eq.${encodeURIComponent(orderId)}&select=${encodeURIComponent(select)}&limit=1`, '订单读取失败');
      return rows[0] || null;
    };
    const listOrderItems = ({ orderIds = [], order = 'batch_no.asc,created_at.asc', select = '*' } = {}) => {
      const ids = [...new Set(orderIds.filter(Boolean).map(String))];
      if(!ids.length) return Promise.resolve([]);
      return readRows(`merchant_order_items?order_id=in.(${ids.map(encodeURIComponent).join(',')})&select=${encodeURIComponent(select)}&order=${encodeURIComponent(order)}`, '菜品明细读取失败');
    };
    const listBills = ({ userId, limit = 200 } = {}) => {
      if(!userId) return Promise.resolve([]);
      return readRows(`merchant_order_bills?user_id=eq.${encodeURIComponent(userId)}&select=*&order=created_at.desc&limit=${Math.max(1, Math.min(Number(limit) || 200, 500))}`, '账单读取失败');
    };
    const getBillByOrder = async ({ orderId } = {}) => {
      if(!orderId) return null;
      const rows = await readRows(`merchant_order_bills?order_id=eq.${encodeURIComponent(orderId)}&select=*&limit=1`, '账单读取失败');
      return rows[0] || null;
    };
    return { listTables, listOrders, getOrder, listOrderItems, listBills, getBillByOrder };
  };
  window.LeshenghuoRestaurantDataApi = { create };
})();
