/* Shared navigation bridge for independently deployed 乐生活 modules.
   When a module is embedded by the native App shell, navigation returns a
   small route message to the parent instead of leaving the WebView. */
(() => {
  const isEmbedded = () => window.parent !== window;
  const route = (name, payload = {}) => {
    if(!isEmbedded()) return false;
    window.parent.postMessage({ type:'leshenghuo-module-route', route:name, ...payload }, window.location.origin);
    return true;
  };
  const routeFromPath = href => {
    const path = new URL(href, window.location.origin).pathname.replace(/\/+$/, '') || '/';
    if(path === '/') return 'home';
    if(path === '/week') return 'week';
    if(path === '/deals') return 'deals';
    if(path === '/messages') return 'message';
    return 'profile';
  };
  const back = (fallback = '/') => {
    if(isEmbedded()){
      window.parent.postMessage({ type:'leshenghuo-module-close' }, window.location.origin);
      return true;
    }
    if(window.history.length > 1){
      window.history.back();
      return true;
    }
    window.location.assign(fallback);
    return true;
  };
  let moduleBackHandler = null;
  const setBackHandler = handler => { moduleBackHandler = typeof handler === 'function' ? handler : null; };
  const handleBack = () => moduleBackHandler ? moduleBackHandler() : back('/');
  let lastBackTouchAt = 0;
  document.addEventListener('touchend', event => {
    const button = event.target?.closest?.('.module-top > button:first-child');
    if(!button) return;
    lastBackTouchAt = Date.now();
    event.preventDefault();
    event.stopPropagation();
    handleBack();
  }, { passive:false, capture:true });
  document.addEventListener('click', event => {
    const button = event.target?.closest?.('.module-top > button:first-child');
    if(!button || Date.now() - lastBackTouchAt > 500) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
  document.addEventListener('click', event => {
    const link = event.target.closest?.('.module-bottom-nav a');
    if(!link || !isEmbedded()) return;
    event.preventDefault();
    route(routeFromPath(link.href));
  });
  const bindEdgeBackGesture = () => {
    if(window.__leshenghuoModuleEdgeBackBound) return;
    window.__leshenghuoModuleEdgeBackBound = true;
    let start = null;
    document.addEventListener('touchstart', event => {
      if(!isEmbedded() || event.touches?.length !== 1) return;
      const touch = event.touches[0];
      if(touch.clientX > 28) return;
      start = { x:touch.clientX, y:touch.clientY };
    }, { passive:true });
    document.addEventListener('touchend', event => {
      if(!start) return;
      const touch = event.changedTouches?.[0];
      const dx = (touch?.clientX || 0) - start.x;
      const dy = Math.abs((touch?.clientY || 0) - start.y);
      start = null;
      if(dx >= 74 && dy <= 48) handleBack();
    }, { passive:true });
    document.addEventListener('touchcancel', () => { start = null; }, { passive:true });
  };
  bindEdgeBackGesture();
  window.LeshenghuoModuleBridge = { isEmbedded, route, routeFromPath, back, setBackHandler };
})();
