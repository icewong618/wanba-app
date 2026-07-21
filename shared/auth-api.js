/* Shared Auth HTTP helpers for 乐生活. UI messages stay in the page layer. */
(() => {
  const create = ({ supabaseUrl = '', supabaseKey = '', timeoutMs = 45000, fetchImpl = (...args) => fetch(...args) } = {}) => {
    const request = async (pathOrUrl, options = {}, customTimeoutMs = timeoutMs) => {
      const url = /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${supabaseUrl}${pathOrUrl}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), customTimeoutMs);
      try {
        const headers = Object.assign({ apikey: supabaseKey }, options.headers || {});
        const response = await fetchImpl(url, Object.assign({}, options, { headers, signal: controller.signal }));
        const raw = await response.text();
        let data = {};
        try { data = raw ? JSON.parse(raw) : {}; } catch (error) { data = { message: raw }; }
        return { res: response, data };
      } catch (error) {
        if (error && error.name === 'AbortError') throw new Error('邮件服务响应超时，请稍后再试');
        throw error;
      } finally {
        clearTimeout(timer);
      }
    };

    const resendSignupVerification = email => request('/auth/v1/resend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'signup', email })
    });

    return { request, resendSignupVerification };
  };
  window.LeshenghuoAuthApi = { create };
})();
