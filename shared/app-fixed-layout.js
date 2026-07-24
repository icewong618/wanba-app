/* Shared fixed-header and safe-area layout measurements for 乐生活. */
(() => {
  const create = ({ isEmbedded = () => false } = {}) => {
    const update = () => {
      requestAnimationFrame(() => {
        const root = document.documentElement;
        const embedded = !!isEmbedded();
        root.classList.toggle('app-webview-entry', embedded);
        root.classList.toggle('embedded-app-entry', embedded);
        // One source of truth for the distance below the fixed home header.
        // The header is fixed, so the feed needs exactly its visible bottom edge
        // plus a small breathing gap. Never measure the already shifted feed.
      const fixedGap = 0;
        const topHeader = document.querySelector('header.top:not(.is-hidden)');
        const headerBottom = topHeader ? Math.ceil(topHeader.getBoundingClientRect().bottom) : 134;
        root.style.setProperty('--home-fixed-top', `${Math.max(fixedGap, headerBottom + fixedGap)}px`);
        // A prior release wrote an inline margin here. Remove it so all entries
        // use the CSS variable above and resume/orientation cannot leave a gap.
        document.querySelector('#page-home .feed')?.style.removeProperty('margin-top');
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
