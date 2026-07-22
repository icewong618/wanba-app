/* Shared comment threading helpers for 乐生活. */
(() => {
  const buildThreads = comments => {
    const rows = Array.isArray(comments) ? comments : [];
    const byId = {};
    rows.forEach(comment => { byId[comment.id] = comment; });
    const rootIdFor = comment => {
      let current = comment;
      let guard = 0;
      while(current.parent_id && byId[current.parent_id] && guard++ < 50) current = byId[current.parent_id];
      return current.id;
    };
    const threads = [];
    const rootIndexes = {};
    rows.forEach(comment => {
      if(!comment.parent_id){
        rootIndexes[comment.id] = threads.length;
        threads.push({ root: comment, replies: [] });
      }
    });
    rows.forEach(comment => {
      if(!comment.parent_id) return;
      const rootId = rootIdFor(comment);
      if(rootIndexes[rootId] === undefined){
        rootIndexes[rootId] = threads.length;
        threads.push({ root: byId[rootId] || comment, replies: [] });
      }
      if(comment.id !== rootId) threads[rootIndexes[rootId]].replies.push(comment);
    });
    return threads;
  };
  const descendantIds = (comments, id) => {
    const rows = Array.isArray(comments) ? comments : [];
    const result = new Set([id]);
    let changed = true;
    while(changed){
      changed = false;
      rows.forEach(comment => {
        if(comment.parent_id != null && result.has(comment.parent_id) && !result.has(comment.id)){
          result.add(comment.id);
          changed = true;
        }
      });
    }
    return result;
  };
  window.LeshenghuoCommentThreading = { buildThreads, descendantIds };
})();
