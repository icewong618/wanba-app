/* Public beta feedback access for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const listMine = async userId => {
      const url = `${supabaseUrl}/rest/v1/user_feedback?user_id=eq.${encodeURIComponent(userId)}&select=*&order=created_at.desc&limit=80`;
      const response = await request(url, { method:'GET' });
      if(!response.ok) throw new Error(`反馈读取失败 ${response.status}: ${(await response.text()).slice(0, 120)}`);
      return response.json();
    };
    const createFeedback = async fields => {
      const response = await request(`${supabaseUrl}/rest/v1/user_feedback`, {
        method:'POST',
        body:JSON.stringify(fields)
      });
      if(!response.ok) throw new Error(`反馈提交失败 ${response.status}: ${(await response.text()).slice(0, 120)}`);
      const rows = await response.json();
      return rows[0] || null;
    };
    return { listMine, createFeedback };
  };
  window.LeshenghuoFeedbackApi = { create };
})();
