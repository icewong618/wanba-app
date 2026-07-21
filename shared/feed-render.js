/* Shared feed rendering shell.
   Each page supplies its own card HTML while loading, retry, and empty states stay consistent. */
(() => {
  const loadingHtml = count => Array.from({ length: count }, () =>
    '<div class="feed-loading-card" aria-label="正在加载笔记"><div class="feed-loading-media"></div><div class="feed-loading-lines"><i></i><i></i></div></div>'
  ).join('');

  const render = ({ element, list, loading, failed, cardHtml, emptyHtml, onRetry }) => {
    if(!element) return { rendered: false, hasItems: false };
    if(!list.length){
      if(loading){
        element.innerHTML = loadingHtml(4);
      } else if(failed){
        element.innerHTML = '<div class="empty" style="grid-column:1/-1;"><span class="display">内容暂时没连上</span>请检查网络后重试<br><button class="feed-retry-btn" style="margin-top:12px;padding:9px 16px;border-radius:999px;border:1px solid var(--sage);background:#fff;color:var(--sage-dark);font-weight:900;">重新加载</button></div>';
        element.querySelector('.feed-retry-btn')?.addEventListener('click', onRetry);
      } else {
        element.innerHTML = emptyHtml;
      }
      return { rendered: true, hasItems: false };
    }
    element.innerHTML = list.map(cardHtml).join('');
    return { rendered: true, hasItems: true };
  };

  window.LeshenghuoFeedRender = { render, loadingHtml };
})();
