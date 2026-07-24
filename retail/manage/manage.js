(() => {
  const SUPABASE_URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
  const app = document.getElementById('retailManageApp');
  const query = new URLSearchParams(location.search);
  let merchant = null;
  let orders = [];
  let selectedId = '';
  let filter = 'active';
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  const list = value => Array.isArray(value) ? value : [];
  const session = () => { try { return JSON.parse(localStorage.getItem('wanba_session') || 'null'); } catch (error) { return null; } };
  const api = (path, options = {}) => { const current = session(); return fetch(SUPABASE_URL + path, { ...options, headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${current?.access_token || SUPABASE_KEY}`, 'Content-Type':'application/json', ...(options.headers || {}) } }); };
  const money = value => `$${Number(value || 0).toFixed(2)}`;
  const time = value => value ? new Intl.DateTimeFormat('zh-CN',{timeZone:'America/Los_Angeles',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value)) : '未安排';
  const statusText = status => ({pending:'待确认',confirmed:'已确认',preparing:'备货中',ready_for_pickup:'待自取',completed:'已完成',cancelled:'已取消'})[status] || status;
  const close = () => window.LeshenghuoModuleBridge.back('/');
  const top = title => `<header class="top"><button onclick="RetailAdmin.close()">‹</button><b>${esc(title)}</b><button onclick="RetailAdmin.close()">×</button></header>`;
  const active = row => !['completed','cancelled'].includes(row.status);
  const filtered = () => orders.filter(row => filter === 'active' ? active(row) : row.status === filter);

  async function load(){
    const slug = query.get('merchant');
    if(!slug){ app.innerHTML = `${top('零售订单')}<div class="empty">缺少商家信息。</div>`; return; }
    if(!session()?.access_token){ app.innerHTML = `${top('零售订单')}<div class="empty">请先登录商家主号后查看零售订单。</div>`; return; }
    try {
      const response = await api(`/rest/v1/merchants?slug=eq.${encodeURIComponent(slug)}&select=user_id,business_name,category,subcategory&limit=1`);
      merchant = (await response.json())[0];
      if(!merchant?.user_id) throw new Error('merchant_not_found');
      const orderResponse = await api(`/rest/v1/merchant_retail_orders?merchant_user_id=eq.${encodeURIComponent(merchant.user_id)}&select=*&order=updated_at.desc&limit=200`);
      if(!orderResponse.ok) throw new Error(await orderResponse.text());
      orders = await orderResponse.json();
      selectedId ? renderDetail(selectedId) : renderList();
    } catch(error) {
      console.warn('零售订单读取失败', error.message);
      app.innerHTML = `${top('零售订单')}<div class="empty">暂时无法读取零售订单。请确认当前账号是该商家的主号，并已运行 v5.550 数据库更新。</div>`;
    }
  }
  function renderList(){
    selectedId = '';
    const rows = filtered();
    const tabs = [['active','处理中'],['pending','待确认'],['preparing','备货中'],['ready_for_pickup','待自取'],['completed','已完成']];
    app.innerHTML = `${top('零售订单')}
      <section class="hero"><small>乐生活商家后台</small><h1>${esc(merchant?.business_name || '零售订单')}</h1></section>
      <div class="tabs">${tabs.map(([id,label]) => `<button class="${filter===id?'on':''}" onclick="RetailAdmin.filter('${id}')">${label} ${id==='active'?orders.filter(active).length:orders.filter(row=>row.status===id).length}</button>`).join('')}<button class="${filter==='cancelled'?'on':''}" onclick="RetailAdmin.filter('cancelled')">已取消 ${orders.filter(row=>row.status==='cancelled').length}</button></div>
      ${rows.length ? rows.map(orderCard).join('') : '<div class="empty">这里还没有对应的零售自取订单。</div>'}`;
  }
  function orderCard(order){
    const itemNames = list(order.items).slice(0,3).map(item => `${item.name || '商品'} ×${Number(item.quantity || 0)}`).join('、');
    const itemCount = list(order.items).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    return `<button class="card" style="display:block;width:100%;text-align:left;cursor:pointer;" onclick="RetailAdmin.detail('${esc(order.id)}')"><div class="card-head"><div><b>${esc(order.order_code)}</b><div class="meta">${esc(order.customer_name)} · ${esc(order.customer_phone)} · ${time(order.created_at)}</div></div><span class="status">${esc(statusText(order.status))}</span></div><div class="lines">${esc(itemNames || '商品明细')}</div><div class="total"><span>${itemCount} 件商品</span><b>${money(order.subtotal)}</b></div></button>`;
  }
  function renderDetail(id){
    selectedId = id;
    const order = orders.find(row => String(row.id) === String(id));
    if(!order){ renderList(); return; }
    const terminal = ['completed','cancelled'].includes(order.status);
    const items = list(order.items).map(item => `<div class="detail-line"><span>${esc(item.name || '商品')} × ${Number(item.quantity || 0)}</span><span>${money(item.line_total ?? Number(item.unit_price || 0) * Number(item.quantity || 0))}</span></div>`).join('');
    const action = (status, label, primary = true) => `<button ${primary ? 'class="primary"' : ''} onclick="RetailAdmin.update('${esc(id)}','${status}')">${label}</button>`;
    const controls = [];
    if(order.status === 'pending') controls.push(action('confirmed', '确认订单'));
    if(['confirmed','preparing'].includes(order.status)) controls.push(action('preparing', '标记备货中'));
    if(['confirmed','preparing'].includes(order.status)) controls.push(action('ready_for_pickup', '通知可自取'));
    if(order.status === 'ready_for_pickup') controls.push(action('completed', '完成交付'));
    if(!terminal) controls.push(action('cancelled', '取消订单', false));
    const actions = controls.length ? `<div class="actions">${controls.join('')}</div>` : '';
    app.innerHTML = `${top('订单详情')}<button class="back-list" onclick="RetailAdmin.list()">‹ 返回零售订单</button>
      <section class="card"><div class="card-head"><div><b>${esc(order.order_code)}</b><div class="meta">${time(order.created_at)}</div></div><span class="status">${esc(statusText(order.status))}</span></div>
      <div class="detail-lines">${items}</div><div class="total"><span>订单合计</span><b>${money(order.subtotal)}</b></div>
      <div class="note"><b>顾客信息</b><br>${esc(order.customer_name)} · ${esc(order.customer_phone)}${order.customer_note ? `<br>备注：${esc(order.customer_note)}` : ''}</div>
      ${order.pickup_at ? `<div class="note"><b>自取时间</b><br>${time(order.pickup_at)}</div>` : ''}${order.merchant_note ? `<div class="note"><b>已发送给顾客</b><br>${esc(order.merchant_note)}</div>` : ''}
      ${terminal ? '' : `<div class="editor"><label>安排自取时间（可选）<input id="retailPickupAt" type="datetime-local" value="${inputDateValue(order.pickup_at)}"></label><label>给顾客的留言（可选）<textarea id="retailMerchantNote" maxlength="500" placeholder="例如：今天 18:00 后可到店自取">${esc(order.merchant_note || '')}</textarea></label><button class="save" onclick="RetailAdmin.saveNote('${esc(id)}')">保存自取安排</button></div>`}
      ${actions}</section>`;
  }
  function inputDateValue(value){
    if(!value) return '';
    const date = new Date(value);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0,16);
  }
  async function update(id,status){
    const pickup = document.getElementById('retailPickupAt')?.value || null;
    const note = document.getElementById('retailMerchantNote')?.value.trim() || null;
    try {
      const response = await api('/rest/v1/rpc/merchant_retail_order_update',{method:'POST',body:JSON.stringify({p_order_id:id,p_status:status,p_pickup_at:pickup ? new Date(pickup).toISOString() : null,p_merchant_note:note})});
      if(!response.ok) throw new Error(await response.text());
      const updated = await response.json();
      orders = orders.map(row => String(row.id) === String(id) ? updated : row);
      renderDetail(id);
    } catch(error) {
      const message = String(error.message || '');
      alert(message.includes('insufficient_stock_at_completion') ? '库存不足，暂时不能完成交付。请先到“扫码库存”补货后再试。' : '更新订单失败，请稍后重试。');
      console.warn(error);
    }
  }
  const saveNote = id => update(id, orders.find(row => String(row.id) === String(id))?.status || 'confirmed');
  window.RetailAdmin = {close, load, list:renderList, detail:renderDetail, filter:value => { filter=value; renderList(); }, update, saveNote};
  load();
})();
