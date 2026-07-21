/* Shared browser session persistence and Supabase token refresh for 乐生活. */
(() => {
  const create = ({ storageKey = 'wanba_session', supabaseUrl = '', supabaseKey = '', fetchImpl = (...args) => fetch(...args) } = {}) => {
    const read = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : null;
      } catch (error) {
        return null;
      }
    };
    const write = value => {
      if (!value) return clear();
      localStorage.setItem(storageKey, JSON.stringify(value));
      return value;
    };
    const clear = () => localStorage.removeItem(storageKey);
    const accessTokenExpiresSoon = (token, bufferMs = 60 * 1000) => {
      if (!token) return true;
      try {
        const encoded = token.split('.')[1];
        if (!encoded) return true;
        const payload = JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')));
        return !payload.exp || (Number(payload.exp) * 1000) <= Date.now() + bufferMs;
      } catch (error) {
        return true;
      }
    };
    const refresh = async currentSession => {
      if (!currentSession || !currentSession.refresh_token || !supabaseUrl || !supabaseKey) return null;
      try {
        const response = await fetchImpl(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: supabaseKey },
          body: JSON.stringify({ refresh_token: currentSession.refresh_token })
        });
        if (!response.ok) return null;
        const data = await response.json();
        if (!data.access_token || !data.refresh_token) return null;
        return { access_token: data.access_token, refresh_token: data.refresh_token, user: data.user || currentSession.user };
      } catch (error) {
        return null;
      }
    };
    return { read, write, clear, accessTokenExpiresSoon, refresh };
  };
  window.LeshenghuoAuthSession = { create };
})();
