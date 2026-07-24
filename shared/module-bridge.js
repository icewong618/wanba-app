/* Thin navigation adapter for independently deployed Scoop City modules. */
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
      window.parent.postMessage({ type:'leshenghuo-navigation-back' }, window.location.origin);
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
  document.addEventListener('click', event => {
    const link = event.target.closest?.('.module-bottom-nav a');
    if(!link || !isEmbedded()) return;
    event.preventDefault();
    route(routeFromPath(link.href));
  });
  window.LeshenghuoModuleBridge = { isEmbedded, route, routeFromPath, back, handleBack, setBackHandler };
})();
