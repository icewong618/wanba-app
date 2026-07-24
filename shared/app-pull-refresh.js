/* Shared App pull-to-refresh interaction for 乐生活 entry pages. */
(() => {
  const create = ({ isEnabled = () => false, refresh = async () => {} } = {}) => {
    const threshold = 72;
    let startY = 0;
    let distance = 0;
    let tracking = false;
    let busy = false;
    const indicator = (state = 'hidden', label = '下拉刷新') => {
      const element = document.getElementById('pullRefreshIndicator');
      const text = document.getElementById('pullRefreshLabel');
      if(!element || !text) return;
      text.textContent = label;
      element.classList.toggle('show', state !== 'hidden');
      element.classList.toggle('ready', state === 'ready');
      element.classList.toggle('loading', state === 'loading');
    };
    const blocked = target => !!(target?.closest && target.closest('input,textarea,select,button,a,iframe,video,.image-carousel,.yt-wrap,.share-sheet,.overlay.open,.feedback-overlay.open,.content-report-overlay.open,.my-feedback-overlay.open,.beta-info-overlay.open,.policy-overlay.open'));
    const atTop = target => {
      if((window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0) > 3) return false;
      let node = target?.nodeType === 1 ? target : null;
      while(node && node !== document.body){
        const style = window.getComputedStyle(node);
        if(/auto|scroll/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 2 && node.scrollTop > 3) return false;
        node = node.parentElement;
      }
      return true;
    };
    const bind = () => {
      if(window.__leshenghuoPullRefreshBound) return;
      window.__leshenghuoPullRefreshBound = true;
      document.addEventListener('touchstart', event => {
        if(!isEnabled() || busy || event.touches.length !== 1 || blocked(event.target) || !atTop(event.target)) return;
        tracking = true;
        startY = event.touches[0].clientY;
        distance = 0;
      }, { passive:true });
      document.addEventListener('touchmove', event => {
        if(!tracking || busy || event.touches.length !== 1) return;
        const nextDistance = Math.max(0, event.touches[0].clientY - startY);
        if(nextDistance <= 0){ tracking = false; indicator(); return; }
        distance = Math.min(nextDistance, threshold + 34);
        if(nextDistance > 8 && event.cancelable) event.preventDefault();
        indicator(distance >= threshold ? 'ready' : 'pulling', distance >= threshold ? '松开刷新' : '下拉刷新');
      }, { passive:false });
      document.addEventListener('touchend', async () => {
        if(!tracking) return;
        const shouldRefresh = distance >= threshold;
        tracking = false;
        distance = 0;
        if(!shouldRefresh){ indicator(); return; }
        busy = true;
        indicator('loading', '正在刷新');
        try {
          await refresh();
          indicator('loading', '刷新完成');
          setTimeout(() => indicator(), 500);
        } catch(error) {
          console.warn('下拉刷新失败:', error.message);
          indicator('loading', '刷新失败，请重试');
          setTimeout(() => indicator(), 900);
        } finally { busy = false; }
      }, { passive:true });
      document.addEventListener('touchcancel', () => { tracking = false; distance = 0; if(!busy) indicator(); }, { passive:true });
    };
    return { indicator, bind, atTop, blocked };
  };
  window.LeshenghuoAppPullRefresh = { create };
})();
