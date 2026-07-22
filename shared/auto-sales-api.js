/* Shared authenticated request transport for 乐生活 auto sales modules. */
(() => {
  const create = ({ supabaseUrl = '', supabaseKey = '', sessionKey = 'wanba_session' } = {}) => {
    const getSession = () => {
      try { return JSON.parse(localStorage.getItem(sessionKey) || 'null'); } catch(error) { return null; }
    };
    let refreshInFlight = null;
    const refreshSession = async () => {
      const current = getSession();
      if(!current?.refresh_token) return false;
      if(!refreshInFlight) refreshInFlight = fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
        method:'POST',
        headers:{apikey:supabaseKey,'Content-Type':'application/json'},
        body:JSON.stringify({refresh_token:current.refresh_token})
      }).then(async response => {
        if(!response.ok) return false;
        const next = await response.json();
        if(!next?.access_token) return false;
        localStorage.setItem(sessionKey, JSON.stringify({...current,...next,user:next.user || current.user}));
        return true;
      }).catch(() => false).finally(() => { refreshInFlight = null; });
      return refreshInFlight;
    };
    const request = async (path, options = {}) => {
      const send = () => fetch(supabaseUrl + path, {
        ...options,
        headers:{apikey:supabaseKey,Authorization:`Bearer ${getSession()?.access_token || supabaseKey}`,'Content-Type':'application/json',...(options.headers || {})}
      });
      let response = await send();
      if(response.status === 401 && await refreshSession()) response = await send();
      return response;
    };
    return { request, getSession, refreshSession };
  };
  window.LeshenghuoAutoSalesApi = { create };
})();
