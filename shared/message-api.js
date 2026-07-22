/* Shared direct message write API for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const send = async ({ fromId, fromName, toId, text }) => {
      const response = await request(`${supabaseUrl}/rest/v1/messages`, {
        method:'POST', body:JSON.stringify({ from_id:fromId, from_name:fromName, to_id:toId, text })
      });
      if(!response.ok) throw new Error(`私信发送失败 ${response.status}`);
      const rows = await response.json();
      return Array.isArray(rows) ? rows[0] || null : null;
    };
    return { send };
  };
  window.LeshenghuoMessageApi = { create };
})();
