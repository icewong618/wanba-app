/* Shared authenticated Supabase requests for 乐生活 browser modules. */
(() => {
  const create = ({ supabaseKey = '', getSession = () => null, refreshSession = async () => false, onSessionExpired = () => {}, fetchImpl = (...args) => fetch(...args) } = {}) => {
    const headers = (extra = {}) => {
      const current = getSession();
      const token = current?.access_token || supabaseKey;
      return Object.assign({
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${token}`,
        Prefer: 'return=representation'
      }, extra);
    };

    const anonymousHeaders = () => ({
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    });

    const authedFetch = async (url, options = {}) => {
      const original = Object.assign({}, options);
      const extraHeaders = original.headers || {};
      let request = Object.assign({}, original, { headers: headers(extraHeaders) });
      let response = await fetchImpl(url, request);
      if (response.status !== 401 || !getSession()) return response;

      const refreshed = await refreshSession();
      if (refreshed) {
        request = Object.assign({}, original, { headers: headers(extraHeaders) });
        return fetchImpl(url, request);
      }

      const isRead = (original.method || 'GET').toUpperCase() === 'GET';
      if (isRead) {
        request = Object.assign({}, original, { headers: anonymousHeaders() });
        response = await fetchImpl(url, request);
        onSessionExpired({ isRead: true });
        return response;
      }

      onSessionExpired({ isRead: false });
      return response;
    };

    return { headers, authedFetch };
  };
  window.LeshenghuoSupabaseClient = { create };
})();
