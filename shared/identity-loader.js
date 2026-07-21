/* Shared identity loading for profiles and verified merchants. */
(() => {
  const create = ({ supabaseUrl = '', authedFetch = async () => null, setProfile = () => {}, setMerchantIdentity = () => {}, hasAvatar = () => false, hasMerchantLogo = () => false, markAvatarMissing = () => {}, markMerchantLogoMissing = () => {}, warn = () => {} } = {}) => {
    const uniqueIds = userIds => [...new Set((userIds || []).filter(Boolean))];
    const loadProfiles = async userIds => {
      const ids = uniqueIds(userIds);
      if (!ids.length) return [];
      try {
        const response = await authedFetch(`${supabaseUrl}/rest/v1/profiles?user_id=in.(${ids.map(encodeURIComponent).join(',')})&select=user_id,name,avatar,bio,tags,gender,birth,cover,updated_at`, { method: 'GET' });
        if (!response?.ok) throw new Error(response ? await response.text() : 'request failed');
        const rows = await response.json();
        rows.forEach(setProfile);
        return rows;
      } catch (error) {
        warn('用户资料读取失败:', error.message);
        return [];
      }
    };
    const ensureAvatars = async (userIds, forceRefresh = false) => {
      const ids = uniqueIds(userIds);
      const profilesNeeded = forceRefresh ? ids : ids.filter(id => !hasAvatar(id));
      const merchantsNeeded = ids.filter(id => !hasMerchantLogo(id));
      if (!profilesNeeded.length && !merchantsNeeded.length) return false;
      try {
        if (profilesNeeded.length) {
          const response = await authedFetch(`${supabaseUrl}/rest/v1/profiles?user_id=in.(${profilesNeeded.map(encodeURIComponent).join(',')})&select=user_id,name,avatar,updated_at`);
          if (response?.ok) (await response.json()).forEach(setProfile);
          profilesNeeded.forEach(id => { if (!hasAvatar(id)) markAvatarMissing(id); });
        }
        if (merchantsNeeded.length) {
          const response = await authedFetch(`${supabaseUrl}/rest/v1/merchants?user_id=in.(${merchantsNeeded.map(encodeURIComponent).join(',')})&verified=eq.true&select=user_id,logo,business_name,verified`);
          if (response?.ok) (await response.json()).forEach(row => setMerchantIdentity(row.user_id, row));
          merchantsNeeded.forEach(id => { if (!hasMerchantLogo(id)) markMerchantLogoMissing(id); });
        }
        return true;
      } catch (error) {
        warn('头像批量获取失败:', error.message);
        return false;
      }
    };
    return { loadProfiles, ensureAvatars };
  };
  window.LeshenghuoIdentityLoader = { create };
})();
