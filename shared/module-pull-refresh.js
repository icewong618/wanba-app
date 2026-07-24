/* Pull-to-refresh for standalone modules embedded in the native App shell. */
(() => {
  const bind = ({ refresh, getScroller = () => document.scrollingElement } = {}) => {
    if (typeof refresh !== 'function' || window.__leshenghuoModulePullRefreshBound) return;
    window.__leshenghuoModulePullRefreshBound = true;
    let startY = 0;
    let active = false;
    let refreshing = false;
    const canUse = () => window.parent !== window && !refreshing;
    document.addEventListener('touchstart', event => {
      if (!canUse() || event.touches?.length !== 1) return;
      if ((getScroller()?.scrollTop || 0) > 2) return;
      startY = event.touches[0].clientY;
      active = true;
    }, { passive: true });
    document.addEventListener('touchend', async event => {
      if (!active) return;
      active = false;
      if ((event.changedTouches?.[0]?.clientY || startY) - startY < 72 || !canUse()) return;
      refreshing = true;
      try { await refresh(); } finally { refreshing = false; }
    }, { passive: true });
    document.addEventListener('touchcancel', () => { active = false; }, { passive: true });
  };
  window.LeshenghuoModulePullRefresh = { bind };
})();
