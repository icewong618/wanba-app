/* Shared router for independent in-App 乐生活 modules. */
(() => {
  const create = ({ isEmbedded = () => false, getAppVersion = () => '', onRootRoute = () => {} } = {}) => {
    let shell = null;
    const close = () => shell?.close();
    const open = (path, moduleVersion, params = {}) => shell?.open(path, moduleVersion, params);
    const handleRoute = detail => {
      close();
      if(!detail?.route) return;
      onRootRoute(detail, { open, close });
    };
    shell = window.LeshenghuoEmbeddedModuleShell?.create({ isEmbedded, getAppVersion, onRoute:handleRoute });
    return { open, close, handleRoute };
  };
  window.LeshenghuoAppModuleRouter = { create };
})();
