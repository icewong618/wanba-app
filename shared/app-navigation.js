/* Single navigation authority for Scoop City.
   Owns route history, bottom navigation and App edge gestures. */
(() => {
  const routeKey = route => {
    if(!route) return '';
    return [
      route.type || 'tab',
      route.tab || '',
      route.id ?? '',
      route.userId || '',
      route.slug || '',
      route.name || ''
    ].join(':');
  };

  const create = ({
    getCurrentRoute = () => ({ type:'tab', tab:'home' }),
    renderRoute = () => {},
    closeTransient = () => false,
    isGestureEnabled = () => false,
    onRouteChange = () => {}
  } = {}) => {
    const backStack = [];
    const forwardStack = [];
    let restoring = false;
    let bound = false;
    let gesture = null;

    const cloneRoute = route => route ? { ...route } : null;
    const current = () => cloneRoute(getCurrentRoute()) || { type:'tab', tab:'home' };
    const pushUnique = (stack, route) => {
      const copy = cloneRoute(route);
      if(!copy || !routeKey(copy) || routeKey(stack[stack.length - 1]) === routeKey(copy)) return;
      stack.push(copy);
      if(stack.length > 40) stack.shift();
    };
    const notify = route => {
      try { onRouteChange(cloneRoute(route)); } catch(error){ console.warn('导航状态更新失败:', error); }
    };
    const restore = route => {
      if(!route) return false;
      restoring = true;
      try {
        renderRoute(cloneRoute(route));
        notify(route);
      } finally {
        queueMicrotask(() => { restoring = false; });
      }
      return true;
    };
    const enter = (route, { replace = false } = {}) => {
      const next = cloneRoute(route);
      if(!next) return false;
      const active = current();
      if(routeKey(active) === routeKey(next)){
        notify(next);
        return false;
      }
      if(!restoring){
        if(replace && backStack.length) backStack[backStack.length - 1] = active;
        else pushUnique(backStack, active);
        forwardStack.length = 0;
      }
      notify(next);
      return true;
    };
    const back = () => {
      if(closeTransient()) return true;
      const active = current();
      const previous = backStack.pop();
      if(previous){
        pushUnique(forwardStack, active);
        return restore(previous);
      }
      if(active.type !== 'tab' || active.tab !== 'home'){
        pushUnique(forwardStack, active);
        return restore({ type:'tab', tab:'home' });
      }
      return false;
    };
    const forward = () => {
      if(closeTransient()) return true;
      const next = forwardStack.pop();
      if(!next) return false;
      pushUnique(backStack, current());
      return restore(next);
    };
    const navigate = route => {
      enter(route);
      renderRoute(cloneRoute(route));
      notify(route);
      return true;
    };
    const reset = route => {
      backStack.length = 0;
      forwardStack.length = 0;
      return restore(route || { type:'tab', tab:'home' });
    };

    const rootTabFromLocation = () => {
      const tab = new URLSearchParams(window.location.search).get('tab') || '';
      return ['home','week','deals','message','profile'].includes(tab) ? tab : '';
    };
    const bindBottomNavigation = () => {
      document.addEventListener('click', event => {
        const button = event.target?.closest?.('.bottom-nav .nav-btn[data-tab]');
        if(!button) return;
        event.preventDefault();
        event.stopPropagation();
        navigate({ type:'tab', tab:button.dataset.tab || 'home' });
      }, true);
    };
    const bindEdgeGesture = () => {
      document.addEventListener('touchstart', event => {
        if(!isGestureEnabled() || event.touches?.length !== 1) return;
        const touch = event.touches[0];
        const width = window.innerWidth || document.documentElement.clientWidth || 390;
        const fromLeft = touch.clientX <= 30;
        const fromRight = touch.clientX >= width - 30;
        if(!fromLeft && !fromRight) return;
        if(event.target?.closest?.('input,textarea,select,iframe,video,[contenteditable="true"],.avatar-crop-frame,.cover-crop-sheet')) return;
        gesture = { x:touch.clientX, y:touch.clientY, direction:fromLeft ? 'back' : 'forward' };
      }, { passive:true, capture:true });
      document.addEventListener('touchmove', event => {
        if(!gesture || event.touches?.length !== 1) return;
        const touch = event.touches[0];
        const dx = Math.abs(touch.clientX - gesture.x);
        const dy = Math.abs(touch.clientY - gesture.y);
        // Vertical scrolling always wins. Stop tracking immediately so Android
        // WebView never treats a page scroll as a pending back gesture.
        if(dy > 10 && dy > dx) gesture = null;
      }, { passive:true, capture:true });
      document.addEventListener('touchend', event => {
        if(!gesture) return;
        const touch = event.changedTouches?.[0];
        const dx = (touch?.clientX || 0) - gesture.x;
        const dy = Math.abs((touch?.clientY || 0) - gesture.y);
        const action = gesture.direction;
        gesture = null;
        if(dy > 54) return;
        if(action === 'back' && dx >= 72) back();
        if(action === 'forward' && dx <= -72) forward();
      }, { passive:true, capture:true });
      document.addEventListener('touchcancel', () => { gesture = null; }, { passive:true, capture:true });
    };
    const bind = () => {
      if(bound) return;
      bound = true;
      bindBottomNavigation();
      bindEdgeGesture();
    };

    return {
      back,
      bind,
      current,
      enter,
      forward,
      isRestoring:() => restoring,
      navigate,
      reset,
      rootTabFromLocation
    };
  };

  window.LeshenghuoAppNavigation = { create };
})();
