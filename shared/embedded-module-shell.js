/* Shared embedded-module host for the native App shell.
   Owns iframe creation, same-origin route messages and close messages. */
(() => {
  const syncImmersiveState = () => {
    const active = !!document.querySelector('.internal-module-host, .merchant-fullscreen-sheet.open');
    document.documentElement.classList.toggle('immersive-module-open', active);
    document.body.classList.toggle('immersive-module-open', active);
  };

  const create = ({ isEmbedded, getAppVersion, onRoute, hostId = 'internalModuleHost', hostClass = 'internal-module-host' } = {}) => {
    const close = () => {
      document.getElementById(hostId)?.remove();
      syncImmersiveState();
    };

    const open = (path, moduleVersion, params = {}) => {
      const target = new URL(path, window.location.origin);
      Object.entries(params).forEach(([key, value]) => {
        if(value !== undefined && value !== null && value !== '') target.searchParams.set(key, String(value));
      });
      target.searchParams.set('module_v', moduleVersion);
      target.searchParams.set('app_v', getAppVersion?.() || '');
      target.searchParams.set('embedded_entry', '1');
      if(!isEmbedded?.()){
        window.location.assign(target.href);
        return;
      }
      let host = document.getElementById(hostId);
      if(!host){
        host = document.createElement('div');
        host.id = hostId;
        host.className = hostClass;
        document.body.appendChild(host);
      }
      host.innerHTML = '';
      const frame = document.createElement('iframe');
      frame.title = '乐生活功能页面';
      frame.src = target.href;
      host.appendChild(frame);
      syncImmersiveState();
    };

    const receive = event => {
      if(event.origin !== window.location.origin || !event.data) return;
      if(event.data.type === 'leshenghuo-module-close'){
        close();
        return;
      }
      if(event.data.type === 'leshenghuo-navigation-back'){
        onRoute?.({ type:'leshenghuo-navigation-back' }, { close, open });
        return;
      }
      if(event.data.type === 'leshenghuo-module-route') onRoute?.(event.data, { close, open });
    };

    window.addEventListener('message', receive);
    return { open, close, receive };
  };

  window.LeshenghuoEmbeddedModuleShell = { create };
  window.LeshenghuoSyncImmersiveModuleState = syncImmersiveState;
})();
