/* Content reporting access for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const readAll = async () => {
      const response = await request(`${supabaseUrl}/rest/v1/content_reports?select=*&order=created_at.desc&limit=120`, { method:'GET' });
      if(!response.ok) throw new Error(`举报读取失败 ${response.status}: ${(await response.text()).slice(0, 120)}`);
      return response.json();
    };
    const submit = async fields => {
      const response = await request(`${supabaseUrl}/rest/v1/content_reports`, { method:'POST', body:JSON.stringify(fields) });
      if(!response.ok) throw new Error(`举报提交失败 ${response.status}: ${(await response.text()).slice(0, 120)}`);
      const rows = await response.json();
      return rows[0] || null;
    };
    const updateStatus = async ({ id, status, handledBy }) => {
      const fields = { status, handled_by:handledBy, resolved_at:['resolved','dismissed'].includes(status) ? new Date().toISOString() : null };
      const response = await request(`${supabaseUrl}/rest/v1/content_reports?id=eq.${encodeURIComponent(id)}`, { method:'PATCH', body:JSON.stringify(fields) });
      if(!response.ok) throw new Error(`举报更新失败 ${response.status}: ${(await response.text()).slice(0, 120)}`);
    };
    return { readAll, submit, updateStatus };
  };
  window.LeshenghuoContentReportApi = { create };
})();
