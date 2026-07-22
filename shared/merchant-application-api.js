/* Merchant application requests for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const requireOk = async (response, action) => {
      if(!response.ok) throw new Error(`${action} ${response.status}: ${(await response.text()).slice(0, 180)}`);
      return response;
    };
    const listMine = async ({ userId, select }) => {
      const response = await request(`${supabaseUrl}/rest/v1/merchant_applications?user_id=eq.${encodeURIComponent(userId)}&select=${select}&order=created_at.desc&limit=1`, { method:'GET' });
      await requireOk(response, '商家认证申请读取失败');
      return response.json();
    };
    const submit = async payload => {
      const response = await request(`${supabaseUrl}/rest/v1/merchant_applications`, { method:'POST', body:JSON.stringify(payload) });
      await requireOk(response, '商家认证申请提交失败');
      return response.json();
    };
    const listPending = async select => {
      const response = await request(`${supabaseUrl}/rest/v1/merchant_applications?select=${select}&status=eq.pending&order=created_at.asc&limit=50`, { method:'GET' });
      await requireOk(response, '商家审核池读取失败');
      return response.json();
    };
    const approve = async ({ application, merchantPayload, reviewedBy }) => {
      let response = await request(`${supabaseUrl}/rest/v1/merchants?user_id=eq.${encodeURIComponent(application.user_id)}`, { method:'PATCH', body:JSON.stringify(merchantPayload) });
      await requireOk(response, '商家资料更新失败');
      let rows = await response.json();
      if(!Array.isArray(rows) || !rows.length){
        response = await request(`${supabaseUrl}/rest/v1/merchants`, { method:'POST', body:JSON.stringify({ user_id:application.user_id, ...merchantPayload }) });
        await requireOk(response, '商家资料创建失败');
        rows = await response.json();
      }
      const applicationResponse = await request(`${supabaseUrl}/rest/v1/merchant_applications?id=eq.${encodeURIComponent(application.id)}`, {
        method:'PATCH',
        body:JSON.stringify({ status:'approved', review_note:null, reviewed_by:reviewedBy, reviewed_at:new Date().toISOString(), updated_at:new Date().toISOString() })
      });
      await requireOk(applicationResponse, '商家申请审批失败');
      return rows;
    };
    const reject = async ({ id, note, reviewedBy }) => {
      const response = await request(`${supabaseUrl}/rest/v1/merchant_applications?id=eq.${encodeURIComponent(id)}`, {
        method:'PATCH',
        body:JSON.stringify({ status:'rejected', review_note:note, reviewed_by:reviewedBy, reviewed_at:new Date().toISOString(), updated_at:new Date().toISOString() })
      });
      await requireOk(response, '商家申请驳回失败');
    };
    return { listMine, submit, listPending, approve, reject };
  };
  window.LeshenghuoMerchantApplicationApi = { create };
})();
