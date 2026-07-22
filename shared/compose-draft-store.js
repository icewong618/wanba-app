/* Device-only compose draft storage for 乐生活. */
(() => {
  const create = ({ databaseName = 'leshenghuo_compose_drafts_v1', storeName = 'drafts' } = {}) => {
    let databasePromise = null;
    const open = () => {
      if(databasePromise) return databasePromise;
      databasePromise = new Promise((resolve, reject) => {
        if(!window.indexedDB) return reject(new Error('浏览器不支持设备草稿'));
        const request = window.indexedDB.open(databaseName, 1);
        request.onupgradeneeded = () => {
          const store = request.result.createObjectStore(storeName, { keyPath:'id' });
          store.createIndex('owner', 'owner', { unique:false });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('草稿数据库不可用'));
      });
      return databasePromise;
    };
    const run = async (mode, operation) => {
      const database = await open();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, mode);
        const request = operation(transaction.objectStore(storeName));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('草稿操作失败'));
      });
    };
    const getAll = owner => run('readonly', store => store.index('owner').getAll(owner));
    const put = draft => run('readwrite', store => store.put(draft));
    const remove = draftId => run('readwrite', store => store.delete(draftId));
    return { getAll, put, remove };
  };
  window.LeshenghuoComposeDraftStore = { create };
})();
