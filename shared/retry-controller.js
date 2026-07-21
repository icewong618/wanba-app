/* Shared exponential retry controller for data modules.
   The caller decides what to load; this module only owns retry timing. */
(() => {
  const create = ({ initialDelay = 6000, maxDelay = 60000, canRetry = () => navigator.onLine, onRetry } = {}) => {
    let timer = null;
    let delay = initialDelay;
    let nextAt = 0;

    const schedule = () => {
      if(timer || !canRetry()) return false;
      const currentDelay = delay;
      nextAt = Date.now() + currentDelay;
      delay = Math.min(delay * 2, maxDelay);
      timer = setTimeout(() => {
        timer = null;
        nextAt = 0;
        onRetry?.();
      }, currentDelay);
      return true;
    };

    const clear = () => {
      if(timer) clearTimeout(timer);
      timer = null;
      nextAt = 0;
      delay = initialDelay;
    };

    return {
      schedule,
      clear,
      get delay(){ return delay; },
      get nextAt(){ return nextAt; },
      get scheduled(){ return !!timer; }
    };
  };

  window.LeshenghuoRetryController = { create };
})();
