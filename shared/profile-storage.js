/* Shared local profile state for 乐生活. */
(() => {
  const create = ({ getSession = () => null, storage = window.localStorage } = {}) => {
    const currentSession = () => getSession() || null;
    const uidToNumericId = uuid => {
      let hash = 0;
      const value = String(uuid || '');
      for(let index = 0; index < value.length; index++) hash = (hash * 131 + value.charCodeAt(index)) >>> 0;
      return String(10000000 + (hash % 90000000));
    };
    const calcAge = birth => {
      if(!birth) return null;
      const [year, month] = String(birth).split('-').map(Number);
      if(!year) return null;
      const now = new Date();
      let age = now.getFullYear() - year;
      if(now.getMonth() + 1 < (month || 1)) age--;
      return age >= 0 && age < 150 ? age : null;
    };
    const defaultProfile = () => {
      const session = currentSession();
      const user = session && session.user;
      const emailName = user && user.email ? user.email.split('@')[0] : '用户';
      const nick = user ? ((user.user_metadata && user.user_metadata.name) || emailName) : '未登录用户';
      return {
        name: nick,
        bio: user ? '还没有介绍呢' : '登录后可编辑个人资料',
        gender: user ? '🚹' : '',
        birth: '', age: null, location: '', market_code: 'la', tags: [],
        id: user ? uidToNumericId(user.id) : '', cover: ''
      };
    };
    const normalize = raw => {
      const session = currentSession();
      const base = defaultProfile();
      const profile = raw && typeof raw === 'object' ? raw : {};
      const merged = Object.assign({}, base, profile);
      merged.id = session && session.user ? uidToNumericId(session.user.id) : (merged.id || '');
      merged.tags = Array.isArray(merged.tags) ? merged.tags.filter(Boolean).slice(0, 3) : [];
      merged.bio = merged.bio || base.bio;
      merged.gender = merged.gender || base.gender;
      merged.birth = merged.birth || '';
      merged.age = calcAge(merged.birth) ?? merged.age ?? null;
      merged.cover = merged.cover || '';
      merged.market_code = String(merged.market_code || 'la').toLowerCase();
      return merged;
    };
    const key = () => {
      const session = currentSession();
      return session && session.user ? `userProfile_${session.user.id}` : 'userProfile_guest';
    };
    const load = () => {
      const session = currentSession();
      if(!(session && session.user)) return defaultProfile();
      storage.removeItem('userProfile');
      const saved = storage.getItem(key());
      let profile = defaultProfile();
      if(saved){
        try { profile = normalize(JSON.parse(saved)); } catch(error) { profile = defaultProfile(); }
      }
      if(!profile.name) profile.name = defaultProfile().name;
      profile.id = uidToNumericId(session.user.id);
      return profile;
    };
    const save = profile => {
      const session = currentSession();
      if(!(session && session.user)) return null;
      const normalized = normalize(profile);
      storage.setItem(key(), JSON.stringify(normalized));
      return normalized;
    };
    return { calcAge, uidToNumericId, defaultProfile, normalize, key, load, save };
  };

  window.LeshenghuoProfileStorage = { create };
})();
