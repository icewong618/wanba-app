/* Native App deep-link routing for independent 乐生活 modules. */
(() => {
  const create = ({ getAppVersion = () => '', isEmbedded = () => false } = {}) => {
    const targetFor = rawUrl => {
      if(!rawUrl) return null;
      try {
        const source = new URL(String(rawUrl), window.location.origin);
        if(!['escoopcity.com', 'www.escoopcity.com'].includes(source.hostname)) return null;
        const path = source.pathname.replace(/\/+$/, '') || '/';
        const targetPath = {
          '/restaurant/order':'/restaurant/order/',
          '/restaurant/order/index.html':'/restaurant/order/',
          '/order':'/restaurant/order/',
          '/order/index.html':'/restaurant/order/',
          '/restaurant/queue':'/restaurant/queue/',
          '/restaurant/queue/index.html':'/restaurant/queue/',
          '/week':'/week/',
          '/week/index.html':'/week/',
          '/deals':'/deals/',
          '/deals/index.html':'/deals/',
          '/messages':'/messages/',
          '/messages/index.html':'/messages/'
        }[path];
        if(!targetPath || (targetPath.startsWith('/restaurant/') && !source.searchParams.get('merchant'))) return null;
        source.pathname = targetPath;
        source.searchParams.set('embedded_app', '1');
        source.searchParams.set('app_v', getAppVersion() || '');
        source.searchParams.set('native_link', '1');
        return source.href;
      } catch(error) {
        return null;
      }
    };
    const open = payload => {
      const target = targetFor(typeof payload === 'string' ? payload : payload?.url);
      if(!target) return false;
      try { sessionStorage.setItem('leshenghuo_embedded_app_entry', '1'); } catch(error) {}
      if(window.location.href !== target) window.location.replace(target);
      return true;
    };
    const bind = () => {
      const appPlugin = window.Capacitor?.Plugins?.App;
      if(appPlugin?.addListener){
        try { appPlugin.addListener('appUrlOpen', open); } catch(error) { console.warn('App 深链监听未启用:', error.message); }
      }
      if(appPlugin?.getLaunchUrl) Promise.resolve(appPlugin.getLaunchUrl()).then(open).catch(() => {});
      window.addEventListener('message', event => open(event?.data));
    };
    return { targetFor, open, bind, isEmbedded };
  };

  window.LeshenghuoNativeDeepLinks = { create };
})();
