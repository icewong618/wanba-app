/* In-App edge gesture history and navigation for 乐生活. */
(() => {
  const create = ({ isEnabled = () => false, getCurrentRoute = () => ({ type:'tab', tab:'home' }), getCurrentTab = () => 'home', navigate = () => {}, onOverlayBack = () => false } = {}) => {
    const edge = 38;
    const minX = 58;
    const maxY = 48;
    let backStack = [];
    let forwardStack = [];
    let restoring = false;
    let startPoint = null;
    const routeKey = route => route ? [route.type, route.tab || '', route.id || '', route.userId || '', route.name || ''].join(':') : '';
    const routeTabFromLocation = () => {
      const tab = new URLSearchParams(window.location.search).get('tab') || '';
      return ['home', 'week', 'deals', 'message', 'profile'].includes(tab) ? tab : '';
    };
    const restore = route => {
      if(!route) return;
      restoring = true;
      navigate(route, () => { restoring = false; });
    };
    const remember = () => {
      if(!isEnabled() || restoring) return;
      const route = getCurrentRoute();
      const key = routeKey(route);
      if(!key || routeKey(backStack[backStack.length - 1]) === key) return;
      backStack.push(route);
      if(backStack.length > 30) backStack.shift();
      forwardStack = [];
    };
    const back = () => {
      if(!isEnabled()) return false;
      if(onOverlayBack()) return true;
      const current = getCurrentRoute();
      const previous = backStack.pop();
      if(previous){
        forwardStack.push(current);
        restore(previous);
        return true;
      }
      if(current.type !== 'tab'){
        forwardStack.push(current);
        restore({ type:'tab', tab:getCurrentTab() || 'home' });
        return true;
      }
      return false;
    };
    const forward = () => {
      if(!isEnabled()) return false;
      const next = forwardStack.pop();
      if(!next) return false;
      backStack.push(getCurrentRoute());
      restore(next);
      return true;
    };
    // A return gesture often starts over a back button or a card at the left
    // edge. Inputs and active media stay protected, but ordinary buttons no
    // longer disable the gesture.
    const interactive = el => !!(el && el.closest && el.closest('input, textarea, select, iframe, video, .avatar-crop-frame, .cover-crop-sheet'));
    const bind = () => {
      if(window.__leshenghuoEdgeGesturesBound) return;
      window.__leshenghuoEdgeGesturesBound = true;
      const start = (event, forceBack = false) => {
        if(!isEnabled() || !event.touches || event.touches.length !== 1) return;
        const touch = event.touches[0];
        const width = window.innerWidth || document.documentElement.clientWidth || 390;
        const fromLeft = forceBack || touch.clientX <= edge;
        const fromRight = touch.clientX >= width - edge;
        if((!fromLeft && !fromRight) || (!forceBack && interactive(event.target))) return;
        startPoint = { x:touch.clientX, y:touch.clientY, dir:fromLeft ? 'back' : 'forward', active:true };
      };
      const move = event => {
        if(!startPoint?.active || !event.touches || event.touches.length !== 1) return;
        const touch = event.touches[0];
        const dx = touch.clientX - startPoint.x;
        const dy = Math.abs(touch.clientY - startPoint.y);
        const rightSwipe = startPoint.dir === 'back' && dx > minX;
        const leftSwipe = startPoint.dir === 'forward' && dx < -minX;
        if(dy > maxY) { startPoint.active = false; return; }
        if(rightSwipe || leftSwipe) event.preventDefault();
      };
      const end = event => {
        if(!startPoint?.active) { startPoint = null; return; }
        const touch = event.changedTouches?.[0] || {};
        const dx = (touch.clientX || 0) - startPoint.x;
        const dy = Math.abs((touch.clientY || 0) - startPoint.y);
        const handled = dy <= maxY && ((startPoint.dir === 'back' && dx > minX && back()) || (startPoint.dir === 'forward' && dx < -minX && forward()));
        if(handled) event.preventDefault();
        startPoint = null;
      };
      document.addEventListener('touchstart', event => start(event), { passive:true, capture:true });
      document.addEventListener('touchmove', move, { passive:false, capture:true });
      document.addEventListener('touchend', end, { passive:false, capture:true });
      document.addEventListener('touchcancel', () => { startPoint = null; }, { passive:true });

      // Native WebViews can hand events to a full-screen layer before the
      // document sees them. This transparent left edge is an explicit target
      // for the return gesture and stays above every feature overlay.
      const zone = document.createElement('div');
      zone.id = 'leshenghuoAppBackGestureZone';
      zone.setAttribute('aria-hidden', 'true');
      zone.style.cssText = 'position:fixed;left:0;top:0;bottom:0;width:24px;z-index:2147483000;touch-action:none;background:transparent;';
      zone.addEventListener('touchstart', event => start(event, true), { passive:true });
      zone.addEventListener('touchmove', move, { passive:false });
      zone.addEventListener('touchend', end, { passive:false });
      zone.addEventListener('touchcancel', () => { startPoint = null; }, { passive:true });
      document.body?.appendChild(zone);
    };
    return { remember, back, forward, bind, routeTabFromLocation, isRestoring:() => restoring };
  };
  window.LeshenghuoAppGestureNavigation = { create };
})();
