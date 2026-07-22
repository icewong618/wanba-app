/* Shared startup, offline and version-refresh manager for 乐生活 entry pages. */
(() => {
  const create = ({ version, cacheVersionKey, reloadVersionKey, manifestPath = 'version.json', isEmbedded = () => false } = {}) => {
    const setLaunchStatus = text => {
      const el = document.getElementById('launchStatus');
      if(el) el.textContent = text;
    };
    const updateOfflineOverlay = () => {
      const overlay = document.getElementById('networkOfflineOverlay');
      if(!overlay) return;
      const offline = navigator.onLine === false;
      overlay.classList.toggle('open', offline);
      overlay.setAttribute('aria-hidden', offline ? 'false' : 'true');
    };
    const retryNetwork = () => {
      updateOfflineOverlay();
      if(navigator.onLine) window.location.reload();
    };
    const bindNetwork = () => {
      window.addEventListener('offline', updateOfflineOverlay);
      window.addEventListener('online', updateOfflineOverlay);
    };
    const syncVisibleVersion = () => {
      document.querySelectorAll('[data-app-version]').forEach(el => { el.textContent = `v${version}`; });
    };
    const clearOldVersionCache = () => {
      const last = localStorage.getItem(cacheVersionKey);
      if(last === version) return;
      // 版本更新只清理可再生的内容缓存。登录态和个人资料属于用户数据，
      // 不应因网页更新而被清空；资料会在后台自行同步最新值。
      ['wanba_posts'].forEach(key => localStorage.removeItem(key));
      localStorage.setItem(cacheVersionKey, version);
    };
    const clearRuntimeCaches = async () => {
      try {
        if('serviceWorker' in navigator){
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map(registration => registration.unregister()));
        }
      } catch(error) { console.warn('Service Worker 清理失败:', error.message); }
      try {
        if('caches' in window){
          const keys = await caches.keys();
          await Promise.all(keys.map(key => caches.delete(key)));
        }
      } catch(error) { console.warn('Cache Storage 清理失败:', error.message); }
    };
    const manifestUrl = () => {
      const url = new URL(manifestPath, window.location.href);
      url.searchParams.set('t', String(Date.now()));
      return url.href;
    };
    const replaceDocument = async remoteVersion => {
      const target = new URL('index.html', window.location.href);
      target.searchParams.set('app_v', remoteVersion || version);
      if(isEmbedded()) target.searchParams.set('embedded_app', '1');
      target.searchParams.set('refresh_t', String(Date.now()));
      if(isEmbedded()){
        try { sessionStorage.setItem('leshenghuo_embedded_app_entry', '1'); } catch(error) {}
      }
      const response = await fetch(target.href, { cache:'no-store', headers:{'Cache-Control':'no-cache'} });
      if(!response.ok) throw new Error(`index http ${response.status}`);
      const html = await response.text();
      document.open();
      document.write(html);
      document.close();
    };
    const checkRemoteVersion = async () => {
      if(window.location.protocol === 'file:') return false;
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 1400) : null;
      try {
        setLaunchStatus('正在检查最新版本…');
        const response = await fetch(manifestUrl(), {
          method:'GET', cache:'no-store', headers:{'Cache-Control':'no-cache'}, signal:controller?.signal
        });
        if(!response.ok) return false;
        const manifest = await response.json();
        const remoteVersion = String(manifest.version || '').trim();
        if(!remoteVersion || remoteVersion === version) return false;
        setLaunchStatus(manifest.message || '检测到新版本，正在更新…');
        await clearRuntimeCaches();
        const reloadKey = `${version}->${remoteVersion}`;
        if(sessionStorage.getItem(reloadVersionKey) === reloadKey){
          console.warn(`已尝试更新到 v${remoteVersion}，本次不再重复刷新`);
          return false;
        }
        sessionStorage.setItem(reloadVersionKey, reloadKey);
        await replaceDocument(remoteVersion);
        return true;
      } catch(error) {
        console.warn('版本检查失败，继续使用当前页面:', error.message);
        return false;
      } finally {
        if(timeoutId) clearTimeout(timeoutId);
      }
    };
    const hideLaunch = () => {
      const el = document.getElementById('launchScreen');
      if(!el) return;
      el.classList.add('done');
      setTimeout(() => el.remove(), 520);
    };
    const notifyReady = () => {
      try {
        if(isEmbedded() && window.parent && window.parent !== window){
          window.parent.postMessage({ type:'leshenghuo_app_ready', version }, '*');
        }
      } catch(error) {}
    };
    return { setLaunchStatus, updateOfflineOverlay, retryNetwork, bindNetwork, syncVisibleVersion, clearOldVersionCache, clearRuntimeCaches, manifestUrl, replaceDocument, checkRemoteVersion, hideLaunch, notifyReady };
  };

  window.LeshenghuoAppUpdateManager = { create };
})();
