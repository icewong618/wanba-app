/* Restaurant order requests for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const requireOk = async (response, action) => {
      if(!response.ok) throw new Error(`${action} ${response.status}: ${(await response.text()).slice(0, 200)}`);
      return response;
    };
    const rpc = async (name, payload = {}) => {
      const response = await request(`${supabaseUrl}/rest/v1/rpc/${name}`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload)
      });
      await requireOk(response, `${name} 调用失败`);
      return response.json();
    };
    const createDineInOrder = ({ merchantUserId, tableCode, items, note = '', existingOrderId = null }) => rpc('merchant_order_create', {
      p_merchant_user_id:merchantUserId,
      p_table_code:tableCode,
      p_items:items,
      p_note:note,
      p_existing_order_id:existingOrderId
    });
    const createTakeoutOrder = ({ merchantUserId, items, customerName, customerPhone, fulfillment, deliveryAddress = '', deliveryAt = null }) => rpc('merchant_takeout_order_create', {
      p_merchant_user_id:merchantUserId,
      p_items:items,
      p_customer_name:customerName,
      p_customer_phone:customerPhone,
      p_fulfillment:fulfillment,
      p_delivery_address:deliveryAddress,
      p_delivery_at:deliveryAt
    });
    const setOrderStatus = (orderId, status) => rpc('merchant_order_set_status', { p_order_id:orderId, p_status:status });
    const setItemServed = (itemId, isServed) => rpc('merchant_order_set_item_served', { p_item_id:Number(itemId), p_is_served:!!isServed });
    const setItemKitchenDone = (itemId, done) => rpc('merchant_order_set_item_kitchen_done', { p_item_id:Number(itemId), p_done:!!done });
    const remindOrder = orderId => rpc('merchant_order_remind', { p_order_id:orderId });
    const completeWithBill = ({ orderId, paymentMethod, tipAmount = 0, discountAmount = 0, couponClaimIds = [] }) => rpc('merchant_order_complete_with_bill', {
      p_order_id:orderId,
      p_payment_method:paymentMethod,
      p_tip_amount:tipAmount,
      p_discount_amount:discountAmount,
      p_coupon_claim_ids:couponClaimIds
    });
    const addTable = async ({ merchantUserId, tableName, tableCode }) => {
      const response = await request(`${supabaseUrl}/rest/v1/merchant_order_tables`, {
        method:'POST',
        headers:{'Content-Type':'application/json','Prefer':'return=representation'},
        body:JSON.stringify({ merchant_user_id:merchantUserId, table_name:tableName, table_code:tableCode, is_active:true })
      });
      await requireOk(response, '新增餐桌失败');
      return response.json();
    };
    const deleteTable = id => rpc('merchant_order_delete_table', { p_table_id:Number(id) });
    return { createDineInOrder, createTakeoutOrder, setOrderStatus, setItemServed, setItemKitchenDone, remindOrder, completeWithBill, addTable, deleteTable };
  };
  window.LeshenghuoRestaurantOrderApi = { create };
})();
