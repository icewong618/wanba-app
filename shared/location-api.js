/* Saved post locations access for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const search = async keyword => {
      const match = String(keyword || '').trim();
      const params = new URLSearchParams({
        select:'id,name,name_en,name_zh,use_count',
        or:`(name.ilike.*${match}*,name_en.ilike.*${match}*,name_zh.ilike.*${match}*)`,
        order:'use_count.desc',
        limit:'16'
      });
      const response = await request(`${supabaseUrl}/rest/v1/locations?${params.toString()}`);
      const rows = response.ok ? await response.json() : [];
      const unique = new Map();
      rows.forEach(row => {
        const key = String(row.name_en || row.name || '').trim().toLowerCase();
        if(key && !unique.has(key)) unique.set(key, row);
      });
      return [...unique.values()].slice(0, 8);
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
