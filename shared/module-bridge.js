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
    if(route('home')) return true;
    if(window.history.length > 1){
      window.history.back();
      return true;
    }
    window.location.assign(fallback);
    return true;
  };
  document.addEventListener('click', event => {
    const link = event.target.closest?.('.module-bottom-nav a');
    if(!link || !isEmbedded()) return;
    event.preventDefault();
    route(routeFromPath(link.href));
  });
  window.LeshenghuoModuleBridge = { isEmbedded, route, routeFromPath, back };
})();
