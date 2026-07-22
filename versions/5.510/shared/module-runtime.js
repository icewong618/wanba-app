/* Shared runtime for standalone 乐生活 modules.
   Keeps public-key requests, session lookup, and HTML escaping consistent. */
(() => {
  const SUPABASE_URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
  const session = () => {
    try { return JSON.parse(localStorage.getItem('wanba_session') || 'null'); }
    catch(error) { return null; }
  };
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
  }[char]));
  const request = (path, options = {}) => {
    const active = session();
    const headers = Object.assign({
      apikey: SUPABASE_KEY,
      Accept: 'application/json',
      Authorization: `Bearer ${active?.access_token || SUPABASE_KEY}`
    }, options.headers || {});
    if(options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
    // Some older standalone modules still pass an absolute Supabase URL.
    // Accept both forms so the host is never concatenated twice.
    const url = /^https?:\/\//i.test(String(path)) ? String(path) : `${SUPABASE_URL}${path}`;
    return fetch(url, Object.assign({}, options, { headers }));
  };
  const fetchWithTimeout = async (input, options = {}, timeoutMs = 6500) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(input, Object.assign({}, options, { signal: controller.signal }));
    } finally {
      clearTimeout(timer);
    }
  };
  window.LeshenghuoModuleRuntime = { SUPABASE_URL, SUPABASE_KEY, session, esc, request, fetchWithTimeout };
})();
