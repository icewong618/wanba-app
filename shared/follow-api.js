/* Shared follow relationship write API for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const setFollow = async ({ followerId, followeeId, followerName, active }) => {
      const follower = encodeURIComponent(followerId);
      const followee = encodeURIComponent(followeeId);
      const patch = await request(`${supabaseUrl}/rest/v1/follows?follower_id=eq.${follower}&followee_id=eq.${followee}`, {
        method:'PATCH', body:JSON.stringify({ active: !!active, follower_name: followerName })
      });
      let rows = patch.ok ? await patch.json() : [];
      if(!rows.length && active){
        const inserted = await request(`${supabaseUrl}/rest/v1/follows`, {
          method:'POST',
          body:JSON.stringify({ follower_id:followerId, follower_name:followerName, followee_id:followeeId, active:true })
        });
        if(!inserted.ok && inserted.status !== 409) throw new Error(inserted.status);
        rows = inserted.ok ? await inserted.json() : [];
      }
      if(!patch.ok && !active) throw new Error(patch.status);
      return rows;
    };
    return { setFollow };
  };

  window.LeshenghuoFollowApi = { create };
})();
