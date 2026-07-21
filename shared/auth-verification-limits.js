/* Browser-side verification email cooldown rules for 乐生活 Auth. */
(() => {
  const create = ({ storageKey = 'wanba_verify_log', cooldownMs = 60 * 1000, windowMs = 30 * 60 * 1000, maxAttempts = 5 } = {}) => {
    const readAll = () => {
      try { return JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch(error) { return {}; }
    };
    const get = email => {
      const value = String(email || '').trim().toLowerCase();
      return Array.isArray(readAll()[value]) ? readAll()[value] : [];
    };
    const record = email => {
      const value = String(email || '').trim().toLowerCase();
      const all = readAll();
      const now = Date.now();
      const attempts = (Array.isArray(all[value]) ? all[value] : []).filter(time => now - Number(time) < windowMs);
      attempts.push(now);
      all[value] = attempts;
      localStorage.setItem(storageKey, JSON.stringify(all));
      return attempts.length;
    };
    const canSend = email => {
      const now = Date.now();
      const attempts = get(email).filter(time => now - Number(time) < windowMs);
      if(attempts.length >= maxAttempts) return { ok:false, reason:'limit' };
      const last = attempts[attempts.length - 1];
      if(last && now - Number(last) < cooldownMs) return { ok:false, reason:'cooldown', wait:Math.ceil((cooldownMs - (now - Number(last))) / 1000) };
      return { ok:true };
    };
    return { get, record, canSend };
  };
  window.LeshenghuoAuthVerificationLimits = { create };
})();
