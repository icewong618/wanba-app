(() => {
  const SUPABASE_URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
  const app = document.getElementById('inventoryManageApp');
  const query = new URLSearchParams(location.search);
  const sheetLayer = document.getElementById('inventorySheet');
  const sheet = document.getElementById('inventorySheetContent');
  let merchant = null;
  let products = [];
  let inventory = [];
  let filter = 'all';
  let cameraStream = null;
  let scannerTimer = null;

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  const list = value => Array.isArray(value) ? value : [];
  const session = () => { try { return JSON.parse(localStorage.getItem('wanba_session') || 'null'); } catch (error) { return null; } };
  const api = (path, options = {}) => {
    const current = session();
    return fetch(SUPABASE_URL + path, { ...options, headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${current?.access_token || SUPABASE_KEY}`, 'Content-Type':'application/json', ...(options.headers || {}) } });
  };
  const close = () => history.length > 1 ? history.back() : location.assign('/');
  const top = title => `<header class="top"><button onclick="InventoryAdmin.close()">‹</button><b>${esc(title)}</b><button onclick="InventoryAdmin.close()">×</button></header>`;
  const low = row => row && Number(row.stock_quantity || 0) <= Number(row.low_stock_threshold || 0);
  const productName = id => products.find(product => String(product.id) === String(id))?.name || '未命名商品';
  const productImage = id => products.find(product => String(product.id) === String(id))?.image || '';
  const itemByProduct = id => inventory.find(row => String(row.product_id) === String(id));
  const itemByBarcode = barcode => inventory.find(row => String(row.barcode || '') === String(barcode || '').replace(/\s+/g, ''));
  const cleanBarcode = value => String(value || '').replace(/\s+/g, '');
  const time = value => value ? new Intl.DateTimeFormat('zh-CN',{timeZone:'America/Los_Angeles',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value)) : '未盘点';

  async function load(){
    const slug = query.get('merchant');
    if(!slug){ app.innerHTML = `${top('库存管理')}<div class="empty">缺少商家信息。</div>`; return; }
    if(!session()?.access_token){ app.innerHTML = `${top('库存管理')}<div class="empty">请先登录商家主号后管理库存。</div>`; return; }
    try {
      const merchantResponse = await api(`/rest/v1/merchants?slug=eq.${encodeURIComponent(slug)}&select=user_id,business_name,category,subcategory,products&limit=1`);
      const rows = merchantResponse.ok ? await merchantResponse.json() : [];
      merchant = rows[0];
      if(!merchant?.user_id) throw new Error('merchant_not_found');
      if(!String(merchant.category || '').includes('零售') && !String(merchant.subcategory || '').includes('零售')) {
        app.innerHTML = `${top('库存管理')}<div class="empty">库存管理目前适用于零售好物商家。</div>`; return;
      }
      products = list(merchant.products).filter(product => product && product.active !== false && product.id);
      const inventoryResponse = await api(`/rest/v1/merchant_inventory_items?merchant_user_id=eq.${encodeURIComponent(merchant.user_id)}&select=*&order=updated_at.desc&limit=500`);
      if(!inventoryResponse.ok) throw new Error(await inventoryResponse.text());
      inventory = await inventoryResponse.json();
      render();
    } catch(error) {
      console.warn('库存读取失败', error.message);
      app.innerHTML = `${top('库存管理')}<div class="empty">暂时无法读取库存。请确认当前账号是该零售商家的主号，并已运行 v5.560 数据库更新。</div>`;
    }
  }

  function render(){
    const configured = inventory.length;
    const lowCount = inventory.filter(low).length;
    const total = inventory.reduce((sum,row) => sum + Number(row.stock_quantity || 0), 0);
    const rows = products.filter(product => filter === 'all' || (filter === 'low' ? low(itemByProduct(product.id)) : !itemByProduct(product.id)));
    app.innerHTML = `${top('库存管理')}
      <section class="hero"><small>乐生活商家后台</small><h1>${esc(merchant.business_name || '库存管理')}</h1></section>
      <section class="summary"><div><small>已建库存</small><b>${configured}</b></div><div><small>库存偏低</small><b>${lowCount}</b></div><div><small>现有总库存</small><b>${total}</b></div></section>
      <div class="tool-row"><button onclick="InventoryAdmin.scan()">扫码管理库存</button><button onclick="InventoryAdmin.manual()">手动录入条码</button></div>
      <div class="filters"><button class="${filter==='all'?'on':''}" onclick="InventoryAdmin.filter('all')">全部 ${products.length}</button><button class="${filter==='low'?'on':''}" onclick="InventoryAdmin.filter('low')">库存偏低 ${lowCount}</button><button class="${filter==='unset'?'on':''}" onclick="InventoryAdmin.filter('unset')">未建库存 ${Math.max(products.length-configured,0)}</button></div>
      ${rows.length ? rows.map(productCard).join('') : '<div class="empty">这里没有符合条件的商品。</div>'}
      <div class="hint">先在“店铺与商品”中建立商品，再在这里用条码绑定商品。库存变动会记录在流水中；零售订单在商家完成交付时自动扣减库存。</div>`;
  }

  function productCard(product){
    const item = itemByProduct(product.id);
    const image = product.image ? `<img src="${esc(product.image)}" alt="">` : '▣';
    const badge = !item ? '<span class="badge none">未建库存</span>' : low(item) ? `<span class="badge low">偏低 ${Number(item.stock_quantity || 0)}</span>` : `<span class="badge">库存 ${Number(item.stock_quantity || 0)}</span>`;
    return `<button class="card" onclick="InventoryAdmin.open('${esc(product.id)}')"><div class="thumb">${image}</div><div><div class="name">${esc(product.name || '未命名商品')}</div><div class="meta">${item?.barcode ? `条码：${esc(item.barcode)}` : '尚未绑定条码'}${item ? ` · 阈值 ${Number(item.low_stock_threshold || 0)}` : ''}</div></div>${badge}</button>`;
  }

  function openSheet(content){ sheet.innerHTML = content; sheetLayer.classList.add('open'); sheetLayer.setAttribute('aria-hidden','false'); }
  function closeSheet(){ stopScanner(); sheetLayer.classList.remove('open'); sheetLayer.setAttribute('aria-hidden','true'); sheet.innerHTML = ''; }
  sheetLayer.addEventListener('click', event => { if(event.target === sheetLayer) closeSheet(); });

  function sheetTop(title){ return `<div class="sheet-top"><button onclick="InventoryAdmin.closeSheet()">‹</button><b>${esc(title)}</b><button onclick="InventoryAdmin.closeSheet()">×</button></div>`; }
  function manual(){
    openSheet(`${sheetTop('录入条码')}<p class="hint">可扫描商品包装条码，也可手动输入或粘贴条码。</p><div class="manual-row"><input id="inventoryManualBarcode" inputmode="numeric" autocomplete="off" placeholder="输入商品条码" autofocus><button onclick="InventoryAdmin.lookupManual()">查找</button></div>`);
    document.getElementById('inventoryManualBarcode')?.addEventListener('keydown', event => { if(event.key === 'Enter') lookupManual(); });
  }
  function lookupManual(){ lookup(document.getElementById('inventoryManualBarcode')?.value); }
  function lookup(value){
    const barcode = cleanBarcode(value);
    if(!barcode){ alert('请先输入或扫描条码。'); return; }
    const item = itemByBarcode(barcode);
    if(item) openItem(item.product_id);
    else openBind(barcode);
  }
  async function scan(){
    openSheet(`${sheetTop('扫码管理库存')}<div class="scanner"><video id="inventoryVideo" playsinline muted></video><div id="inventoryScanHint" class="hint">正在打开相机…</div><div class="manual-row"><input id="inventoryScanInput" inputmode="numeric" autocomplete="off" placeholder="无法识别时可手动输入"><button onclick="InventoryAdmin.lookupScan()">查找</button></div></div>`);
    const manualInput = document.getElementById('inventoryScanInput');
    manualInput?.addEventListener('keydown', event => { if(event.key === 'Enter') lookup(manualInput.value); });
    if(!navigator.mediaDevices?.getUserMedia){ document.getElementById('inventoryScanHint').textContent = '当前设备无法打开相机，请手动输入条码。'; return; }
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
      const video = document.getElementById('inventoryVideo');
      if(!video){ stopScanner(); return; }
      video.srcObject = cameraStream;
      await video.play();
      if(!('BarcodeDetector' in window)) { document.getElementById('inventoryScanHint').textContent = '当前浏览器不支持自动条码识别，请手动输入条码。'; return; }
      const detector = new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e','code_128','code_39','qr_code']});
      document.getElementById('inventoryScanHint').textContent = '将条码置于取景框内。';
      scannerTimer = setInterval(async () => {
        try {
          const values = await detector.detect(video);
          const barcode = values[0]?.rawValue;
          if(barcode){ stopScanner(); lookup(barcode); }
        } catch(error) {}
      }, 420);
    } catch(error) { document.getElementById('inventoryScanHint').textContent = '无法打开相机。请允许相机权限，或改用手动输入。'; }
  }
  function stopScanner(){ if(scannerTimer) clearInterval(scannerTimer); scannerTimer = null; if(cameraStream){ cameraStream.getTracks().forEach(track => track.stop()); cameraStream = null; } }
  function lookupScan(){ lookup(document.getElementById('inventoryScanInput')?.value); }

  function openBind(barcode='', productId=''){
    const selected = itemByProduct(productId);
    openSheet(`${sheetTop(selected ? '设置库存' : '绑定商品条码')}<div class="detail"><h2>${selected ? esc(productName(selected.product_id)) : '选择要绑定的商品'}</h2><div class="meta">${selected?.barcode ? `当前条码：${esc(selected.barcode)}` : '绑定条码后，下次可直接扫码找到商品。'}</div></div>
      <div class="field"><label>商品</label><select id="inventoryBindProduct">${products.map(product => `<option value="${esc(product.id)}" ${(productId === product.id || (!productId && itemByBarcode(barcode)?.product_id === product.id)) ? 'selected' : ''}>${esc(product.name || '未命名商品')}</option>`).join('')}</select></div>
      <div class="field"><label>商品条码</label><input id="inventoryBindBarcode" value="${esc(barcode || selected?.barcode || '')}" placeholder="扫描或输入条码"></div>
      <div class="split"><div class="field"><label>当前库存数量</label><input id="inventoryBindQuantity" type="number" min="0" step="1" value="${Number(selected?.stock_quantity || 0)}"></div><div class="field"><label>低库存提醒阈值</label><input id="inventoryBindThreshold" type="number" min="0" step="1" value="${Number(selected?.low_stock_threshold || 0)}"></div></div>
      <button class="primary" style="width:100%;margin-top:8px" onclick="InventoryAdmin.saveBinding()">保存库存设置</button>`);
  }
  async function saveBinding(){
    const productId = document.getElementById('inventoryBindProduct')?.value;
    const barcode = cleanBarcode(document.getElementById('inventoryBindBarcode')?.value);
    const quantity = Number(document.getElementById('inventoryBindQuantity')?.value || 0);
    const threshold = Number(document.getElementById('inventoryBindThreshold')?.value || 0);
    if(!productId){ alert('请选择商品。'); return; }
    if(!Number.isInteger(quantity) || quantity < 0 || !Number.isInteger(threshold) || threshold < 0){ alert('库存数量和提醒阈值必须为非负整数。'); return; }
    try {
      const response = await api('/rest/v1/rpc/merchant_inventory_upsert',{method:'POST',body:JSON.stringify({p_product_id:productId,p_barcode:barcode || null,p_stock_quantity:quantity,p_low_stock_threshold:threshold})});
      if(!response.ok) throw new Error(await response.text());
      const item = await response.json();
      inventory = inventory.filter(row => String(row.id) !== String(item.id)).concat(item);
      closeSheet(); render(); openItem(productId);
    } catch(error) { console.warn('保存库存失败', error.message); alert(error.message.includes('duplicate') ? '该条码已绑定给其他商品。' : '保存库存失败，请稍后重试。'); }
  }

  async function openItem(productId){
    const item = itemByProduct(productId);
    if(!item){ openBind('', productId); return; }
    openSheet(`${sheetTop('库存详情')}<div class="detail"><h2>${esc(productName(productId))}</h2><div class="meta">条码：${esc(item.barcode || '未绑定')} · 低库存阈值：${Number(item.low_stock_threshold || 0)}</div><div class="stock">${Number(item.stock_quantity || 0)} <small>件</small></div></div>
      <div class="split"><div class="field"><label>操作</label><select id="inventoryMoveType"><option value="receive">入库</option><option value="issue">出库</option><option value="count">盘点为</option></select></div><div class="field"><label>数量</label><input id="inventoryMoveQuantity" type="number" min="0" step="1" placeholder="输入数量"></div></div>
      <div class="field"><label>备注（可选）</label><textarea id="inventoryMoveNote" maxlength="500" placeholder="例如：到货、报损、盘点差异"></textarea></div><button class="primary" style="width:100%;margin-top:2px" onclick="InventoryAdmin.adjust('${esc(item.id)}','${esc(productId)}')">保存库存变动</button>
      <div class="tool-row"><button onclick="InventoryAdmin.rebind('${esc(productId)}')">修改条码/阈值</button><button onclick="InventoryAdmin.movements('${esc(productId)}')">查看库存流水</button></div>`);
  }
  async function adjust(itemId, productId){
    const type = document.getElementById('inventoryMoveType')?.value;
    const quantity = Number(document.getElementById('inventoryMoveQuantity')?.value);
    const note = document.getElementById('inventoryMoveNote')?.value.trim() || null;
    if(!Number.isInteger(quantity) || quantity < 0){ alert('请输入有效的非负整数。'); return; }
    try {
      const response = await api('/rest/v1/rpc/merchant_inventory_adjust',{method:'POST',body:JSON.stringify({p_inventory_item_id:itemId,p_movement_type:type,p_quantity:quantity,p_note:note})});
      if(!response.ok) throw new Error(await response.text());
      const updated = await response.json();
      inventory = inventory.map(row => String(row.id) === String(updated.id) ? updated : row);
      render(); openItem(productId);
    } catch(error) { console.warn('库存调整失败', error.message); alert(error.message.includes('insufficient_stock') ? '出库数量不能超过现有库存。' : '库存调整失败，请稍后重试。'); }
  }
  async function movements(productId){
    const item = itemByProduct(productId);
    if(!item) return;
    openSheet(`${sheetTop('库存流水')}<div class="detail"><h2>${esc(productName(productId))}</h2><div class="meta">当前库存 ${Number(item.stock_quantity || 0)} 件</div></div><div id="inventoryMovementRows" class="empty-inline">正在读取库存流水…</div>`);
    try {
      const response = await api(`/rest/v1/merchant_inventory_movements?merchant_user_id=eq.${encodeURIComponent(merchant.user_id)}&product_id=eq.${encodeURIComponent(productId)}&select=*&order=created_at.desc&limit=80`);
      if(!response.ok) throw new Error(await response.text());
      const rows = await response.json();
      const target = document.getElementById('inventoryMovementRows');
      if(target) target.innerHTML = rows.length ? rows.map(row => `<div class="movement"><div><b>${({receive:'入库',issue:'出库',count:'盘点'}[row.movement_type] || row.movement_type)}</b><small>${time(row.created_at)}${row.note ? ` · ${esc(row.note)}` : ''}</small></div><div class="delta ${Number(row.quantity_change) < 0 ? 'minus' : 'plus'}">${Number(row.quantity_change) > 0 ? '+' : ''}${Number(row.quantity_change)}<small>${Number(row.quantity_before)} → ${Number(row.quantity_after)}</small></div></div>`).join('') : '<div class="empty-inline">还没有库存变动记录。</div>';
    } catch(error) { document.getElementById('inventoryMovementRows').textContent = '暂时无法读取库存流水。'; }
  }
  window.InventoryAdmin = {close,load,filter:value => {filter=value;render();},scan,manual,lookupManual,lookupScan,open:openItem,rebind:productId => openBind('', productId),saveBinding,adjust,movements,closeSheet};
  load();
})();
