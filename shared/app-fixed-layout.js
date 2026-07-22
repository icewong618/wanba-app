/* Shared fixed-header and safe-area layout measurements for 乐生活. */
(() => {
  const create = ({ isEmbedded = () => false } = {}) => {
    const update = () => {
      requestAnimationFrame(() => {
        const root = document.documentElement;
        const embedded = !!isEmbedded();
        root.classList.toggle('app-webview-entry', embedded);
        root.classList.toggle('embedded-app-entry', embedded);
        const fixedGap = 3;
        const topHeader = document.querySelector('header.top:not(.is-hidden)');
        const homeTop = topHeader ? Math.ceil(topHeader.getBoundingClientRect().height) + fixedGap : 138;
        root.style.setProperty('--home-fixed-top', `${homeTop}px`);
        const homeFeed = document.querySelector('#page-home .feed');
        if(homeFeed && topHeader){
          // Measure against the rendered fixed bar. This avoids an accumulating
          // desktop/App offset and keeps the first notes close without being covered.
          homeFeed.style.setProperty('margin-top', '0px', 'important');
          const headerBottom = topHeader.getBoundingClientRect().bottom;
          const feedTop = homeFeed.getBoundingClientRect().top;
          const safeGap = embedded ? 18 : 22;
          const feedOffset = Math.max(0, Math.ceil(headerBottom + safeGap - feedTop));
          homeFeed.style.setProperty('margin-top', `${feedOffset}px`, 'important');
        }
        const weekHeader = document.querySelector('#page-week.active .page-header');
        root.style.setProperty('--week-fixed-top', weekHeader ? `${Math.ceil(weekHeader.getBoundingClientRect().height) + 10}px` : '60px');
        const messageHeader = document.querySelector('#page-message.active .page-header');
        const messageCategories = document.querySelector('#page-message.active .msg-cat-row');
        const messageHeaderHeight = messageHeader ? Math.ceil(messageHeader.getBoundingClientRect().height) : 0;
        const messageCategoriesHeight = messageCategories ? Math.ceil(messageCategories.getBoundingClientRect().height) : 0;
        root.style.setProperty('--message-header-height', `${messageHeaderHeight}px`);
        root.style.setProperty('--message-fixed-top', `${messageHeaderHeight + messageCategoriesHeight}px`);
        const dealsHero = document.querySelector('#page-deals.active .deals-hero');
        const dealsTop = dealsHero ? Math.ceil(dealsHero.getBoundingClientRect().height) + fixedGap : 205;
        root.style.setProperty('--deals-fixed-top', `${dealsTop}px`);
        document.querySelectorAll('.deals-meta-row').forEach(row => {
          row.style.marginTop = embedded ? `${Math.max(42, dealsTop - 75)}px` : '';
        });
      });
    };
    const bind = () => {
      if(window.__leshenghuoFixedLayoutBound) return;
      window.__leshenghuoFixedLayoutBound = true;
      window.addEventListener('resize', update);
      window.addEventListener('orientationchange', () => setTimeout(update, 250));
    };
    return { update, bind };
  };
  window.LeshenghuoAppFixedLayout = { create };
})();
