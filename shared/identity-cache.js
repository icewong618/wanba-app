/* Shared profile, avatar and merchant identity cache for 乐生活. */
(() => {
  const create = ({ getSession = () => null, getCurrentUser = () => ({}), getCurrentMerchant = () => null } = {}) => {
    const avatarCache = () => (window._avatarCache = window._avatarCache || {});
    const profileCache = () => (window._profileCache = window._profileCache || {});
    const merchantLogoCache = () => (window._merchantLogoCache = window._merchantLogoCache || {});
    const merchantVerifiedCache = () => (window._merchantVerifiedCache = window._merchantVerifiedCache || {});
    const merchantNameCache = () => (window._merchantNameCache = window._merchantNameCache || {});
    const merchantIdentityCache = () => (window._merchantIdentityCache = window._merchantIdentityCache || {});

    const setMerchantLogo = (userId, logo) => {
      if (userId) merchantLogoCache()[userId] = logo || null;
    };
    const setMerchantIdentity = (userId, merchant) => {
      if (!userId) return;
      const value = merchant || {};
      merchantIdentityCache()[userId] = Object.assign({}, merchantIdentityCache()[userId] || {}, value);
      merchantVerifiedCache()[userId] = !!value.verified;
      if (value.logo !== undefined) setMerchantLogo(userId, value.logo || null);
      if (value.business_name) merchantNameCache()[userId] = value.business_name;
    };
    const setProfile = profile => {
      if (!profile || !profile.user_id) return;
      profileCache()[profile.user_id] = Object.assign({}, profileCache()[profile.user_id] || {}, profile);
      if (profile.avatar !== undefined) avatarCache()[profile.user_id] = profile.avatar || null;
    };
    const cacheAvatar = (userId, avatar) => {
      if (!userId) return;
      avatarCache()[userId] = avatar || null;
      setProfile(Object.assign({}, profileCache()[userId] || {}, { user_id: userId, avatar: avatar || null, updated_at: new Date().toISOString() }));
    };
    const isVerifiedMerchant = userId => {
      if (!userId) return false;
      const session = getSession();
      const merchant = getCurrentMerchant();
      if (session?.user && userId === session.user.id && merchant?.verified) return true;
      return !!merchantVerifiedCache()[userId];
    };
    const resolveAvatar = userId => {
      if (!userId) return null;
      const session = getSession();
      const merchant = getCurrentMerchant();
      const currentUser = getCurrentUser();
      if (session?.user && userId === session.user.id && merchant?.logo) return merchant.logo;
      if (merchantLogoCache()[userId]) return merchantLogoCache()[userId];
      if (session?.user && userId === session.user.id && currentUser?.avatar) return currentUser.avatar;
      return avatarCache()[userId] || null;
    };
    const avatarImageSrc = (userId, url) => {
      const source = String(url || '');
      if (!source || source.startsWith('data:') || source.startsWith('blob:')) return source;
      const session = getSession();
      const currentUser = getCurrentUser();
      const updatedAt = profileCache()[userId]?.updated_at || (session?.user?.id === userId ? currentUser?.avatarUpdatedAt : '');
      if (!updatedAt) return source;
      try {
        const parsed = new URL(source, window.location.href);
        parsed.searchParams.set('avatar_v', String(new Date(updatedAt).getTime() || updatedAt));
        return parsed.toString();
      } catch (error) {
        return source;
      }
    };
    const cachedProfile = (userId, fallbackName) => Object.assign({
      user_id: userId,
      name: fallbackName || '乐生活用户',
      avatar: resolveAvatar(userId),
      bio: '', tags: [], gender: '', birth: '', cover: ''
    }, profileCache()[userId] || {});

    return { setMerchantLogo, setMerchantIdentity, setProfile, cacheAvatar, isVerifiedMerchant, resolveAvatar, avatarImageSrc, cachedProfile };
  };
  window.LeshenghuoIdentityCache = { create };
})();
