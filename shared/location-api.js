/* Saved post locations access for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const search = async keyword => {
      const response = await request(`${supabaseUrl}/rest/v1/locations?name=ilike.*${encodeURIComponent(keyword)}*&select=id,name,use_count&order=use_count.desc&limit=8`);
      return response.ok ? response.json() : [];
    };
    const ensure = async ({ name, userId }) => {
      const response = await request(`${supabaseUrl}/rest/v1/locations?name=eq.${encodeURIComponent(name)}&select=id,use_count`);
      const rows = response.ok ? await response.json() : [];
      if(rows.length) return { created:false, row:rows[0] };
      const created = await request(`${supabaseUrl}/rest/v1/locations`, {
        method:'POST', body:JSON.stringify({ name, use_count:1, created_by:userId })
      });
      if(!created.ok) throw new Error(`地点保存失败 ${created.status}`);
      return { created:true };
    };
    return { search, ensure };
  };
  window.LeshenghuoLocationApi = { create };
})();
