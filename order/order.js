(() => {
  const SUPABASE_URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
  const app = document.getElementById('orderApp');
  const query = new URLSearchParams(location.search);
  const state = {
    merchant: null, products: [], category: '全部', cart: {}, claims: [], recentOrders: [], screen: 'menu',
    mode: query.get('mode') === 'takeout' ? 'takeout' : 'dinein',
    dinein: { tableCode: String(query.get('table') || '').trim().toLowerCase(), tableName: '', note: '' },
    takeout: { fulfillment: 'delivery', speed: 'standard', name: '', phone: '', address: '', note: '', scheduledAt: '', couponId: null, payment: 'apple_pay', tipPercent: 0, customTip: '' }
  };

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  const money = value => `$${Number(value || 0).toFixed(2)}`;
  const price = value => Number(String(value || '').match(/\d+(?:\.\d{1,2})?/)?.[0] || 0);
  const user = () => JSON.parse(localStorage.getItem('wanba_session') || 'null')?.user || null;
  const api = async (path, options = {}) => {
    const session = JSON.parse(localStorage.getItem('wanba_session') || 'null');
    const headers = Object.assign({ apikey: SUPABASE_KEY, 'Content-Type': 'application/json' }, options.headers || {});
    headers.Authorization = `Bearer ${session?.access_token || SUPABASE_KEY}`;
    return fetch(`${SUPABASE_URL}${path}`, Object.assign({}, options, { headers }));
  };
  const products = () => state.products.filter(product => product.active !== false && product.orderable !== false);
  const isTakeout = () => state.mode === 'takeout';
  const cartRows = () => state.products.filter(product => Number(state.cart[product.id] || 0) > 0).map(product => Object.assign({}, product, { quantity: Number(state.cart[product.id]) }));
  const subtotal = () => cartRows().reduce((sum, product) => sum + price(product.price) * product.quantity, 0);
  const categories = () => ['全部', ...new Set(products().flatMap(product => Array.isArray(product.categories) ? product.categories : (product.category ? [product.category] : [])).filter(Boolean))];
  const settings = () => {
    const raw = state.merchant?.order_checkout_settings || {};
    return { priorityFee: Number(raw.takeout_priority_fee ?? 3.99), standardMinutes: Number(raw.takeout_standard_minutes ?? 40), pickupMinutes: Number(raw.takeout_pickup_minutes ?? 20) };
  };
  const formatTime = value => value ? new Intl.DateTimeFormat('zh-CN', { month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:false, timeZone:'America/Los_Angeles' }).format(new Date(value)) : '等待商家确认';
  const nav = screen => { state.screen = screen; render(); window.scrollTo(0, 0); };
  const persistFields = () => {
    const get = id => document.getElementById(id)?.value;
    state.takeout.name = (get('customerName') ?? state.takeout.name).trim();
    state.takeout.phone = (get('customerPhone') ?? state.takeout.phone).trim();
    state.takeout.address = (get('deliveryAddress') ?? state.takeout.address).trim();
    state.takeout.note = (get('deliveryNote') ?? state.takeout.note).trim();
    state.takeout.scheduledAt = get('scheduledAt') ?? state.takeout.scheduledAt;
    state.dinein.note = (get('dineinNote') ?? state.dinein.note).trim();
  };
  const close = () => {
    if (window.parent !== window) window.parent.postMessage({ type: 'leshenghuo-close-takeout' }, '*');
    else if (history.length > 1) history.back();
    else location.assign('/');
  };
  const back = () => {
    if (state.screen === 'cart') nav('menu');
    else if (state.screen === 'details') nav('cart');
    else if (state.screen === 'orders' || state.screen === 'success') nav('menu');
    else close();
  };
  const top = title => `<header class="top"><button class="back" onclick="Order.back()" aria-label="返回">‹</button><b>${esc(title)}</b><button class="close" onclick="Order.close()" aria-label="关闭">×</button></header>`;
  const hero = () => `<section class="hero"><h1>${esc(state.merchant?.business_name || '乐生活点餐')}</h1><p>${isTakeout() ? esc(state.merchant?.address || '') : `当前餐桌：${esc(state.dinein.tableName || '扫码点餐')}`}</p></section>`;
  const productCategories = product => Array.isArray(product.categories) ? product.categories : (product.category ? [product.category] : []);
  const fulfillmentLabel = () => state.takeout.fulfillment === 'delivery' ? '派送' : '到店自取';
  const tipAmount = () => {
    const base = Math.max(0, subtotal() - discountAmount() + deliveryFee());
    return state.takeout.customTip !== '' ? Math.max(0, Number(state.takeout.customTip) || 0) : base * Number(state.takeout.tipPercent || 0) / 100;
  };
  const deliveryFee = () => state.takeout.fulfillment === 'delivery' && state.takeout.speed === 'priority' ? settings().priorityFee : 0;
  const selectedClaim = () => state.claims.find(claim => Number(claim.id) === Number(state.takeout.couponId));
  const couponRule = claim => claim?.coupon_snapshot?.pricing_rule || {};
  const couponDiscount = (claim, total) => {
    const rule = couponRule(claim), type = String(rule.type || ''), amount = Math.max(0, Number(rule.value || 0)), threshold = Math.max(0, Number(rule.min_spend || 0));
    if (type === 'whole_percent') return total * Math.min(amount, 100) / 100;
    if (type === 'whole_fixed') return amount;
    if (total < threshold) return 0;
    if (type === 'percent') return total * Math.min(amount, 100) / 100;
    if (type === 'tiered_fixed') return amount * (rule.repeat && threshold > 0 ? Math.floor(total / threshold) : 1);
    if (type === 'fixed') return amount;
    return 0;
  };
  const paymentAllowed = claim => {
    const methods = claim?.coupon_snapshot?.payment_methods;
    if (!Array.isArray(methods) || !methods.length) return true;
    return methods.some(method => ['online', 'card'].includes(String(method)));
  };
  const usableClaim = claim => paymentAllowed(claim) && couponDiscount(claim, subtotal()) > 0;
  const discountAmount = () => Math.min(subtotal(), couponDiscount(selectedClaim(), subtotal()));
  const totalAmount = () => Math.max(0, subtotal() - discountAmount() + deliveryFee() + tipAmount());

  function renderMenu() {
    const rows = products().filter(product => state.category === '全部' || productCategories(product).includes(state.category));
    const count = cartRows().reduce((sum, product) => sum + product.quantity, 0);
    const ordered = state.recentOrders.filter(order => !['completed', 'cancelled'].includes(order.status)).length;
    const activeOrder = isTakeout() && ordered ? `<button class="active-order" onclick="Order.orders()"><span><b>已点外卖</b><small>${ordered} 笔订单正在处理中</small></span><strong>查看详情 ›</strong></button>` : '';
    app.innerHTML = `${top(isTakeout() ? '外卖点单' : '扫码点餐')}${hero()}${activeOrder}<div class="tabs">${categories().map(category => `<button class="${state.category === category ? 'on' : ''}" onclick="Order.category('${esc(category)}')">${esc(category)}</button>`).join('')}</div><div class="list">${rows.length ? rows.map(product => `<article class="product">${product.image ? `<img src="${esc(product.image)}" alt="">` : '<div class="product-placeholder"></div>'}<div class="product-main"><b>${esc(product.name || '未命名商品')}</b>${product.description ? `<p>${esc(product.description)}</p>` : ''}<span class="price">${esc(product.price || '到店咨询')}</span></div><div class="qty"><button onclick="Order.qty('${esc(product.id)}',-1)" ${Number(state.cart[product.id] || 0) ? '' : 'disabled'}>−</button><span>${Number(state.cart[product.id] || 0)}</span><button onclick="Order.qty('${esc(product.id)}',1)">+</button></div></article>`).join('') : '<div class="empty">商家暂时没有可点菜品。</div>'}</div><div class="bar"><div><b>${money(subtotal())}</b><span>${count ? `已选 ${count} 件` : '请选择菜品'}</span></div><button class="primary" ${count ? '' : 'disabled'} onclick="Order.cart()">加入购物车</button></div>`;
  }

  function renderCart() {
    const rows = cartRows();
    app.innerHTML = `${top('购物车')}${hero()}<section class="section"><h2>确认已选内容</h2>${rows.map(product => `<div class="summary-line"><span>${esc(product.name)} × ${product.quantity}</span><b>${money(price(product.price) * product.quantity)}</b></div>`).join('')}<div class="summary-line total"><span>菜品小计</span><b>${money(subtotal())}</b></div></section><div class="actions"><button class="choice" onclick="Order.menu()">继续点菜</button><button class="primary" onclick="Order.details()">${isTakeout() ? '转到订单详情' : '确认餐桌订单'}</button></div>`;
  }

  function renderDineinDetails() {
    const loggedIn = Boolean(user()?.id);
    const couponBlock = loggedIn
      ? '<p class="muted">优惠券请在乐生活 App 的商家页面领取并使用。</p>'
      : '<button class="coupon" onclick="Order.appCoupon()"><span><b>领取并使用优惠券</b><small>优惠券仅限乐生活 App 内领取和核销</small></span><strong>打开 App ›</strong></button>';
    app.innerHTML = `${top('确认餐桌订单')}${hero()}<section class="section"><h2>${esc(state.dinein.tableName || '当前餐桌')}</h2><p class="muted">无需登录即可提交点餐。订单会直接发送给商家后厨。</p><label>备注</label><textarea id="dineinNote" maxlength="240" placeholder="例如：少辣、不要香菜或其他要求">${esc(state.dinein.note)}</textarea></section><section class="section"><h2>优惠券</h2>${couponBlock}</section><section class="section"><h2>订单信息汇总</h2>${cartRows().map(product => `<div class="summary-line"><span>${esc(product.name)} × ${product.quantity}</span><b>${money(price(product.price) * product.quantity)}</b></div>`).join('')}<div class="summary-line total"><span>菜品小计</span><b>${money(subtotal())}</b></div></section><button class="primary submit" onclick="Order.submit()">提交订单</button>`;
  }

  function renderDetails() {
    if (!isTakeout()) { renderDineinDetails(); return; }
    const delivery = state.takeout.fulfillment === 'delivery';
    const cfg = settings();
    const minimum = new Date(Date.now() + cfg.standardMinutes * 60000).toISOString().slice(0, 16);
    const eligible = state.claims.filter(usableClaim);
    if (state.takeout.couponId && !eligible.some(claim => Number(claim.id) === Number(state.takeout.couponId))) state.takeout.couponId = null;
    const couponHtml = eligible.length ? eligible.map(claim => { const snapshot = claim.coupon_snapshot || {}; const active = Number(state.takeout.couponId) === Number(claim.id); return `<button class="coupon ${active ? 'on' : ''}" onclick="Order.coupon(${Number(claim.id)})"><span><b>${esc(snapshot.title || '优惠券')}</b><small>${esc(snapshot.description || '下单时可使用')}</small></span><strong>-${money(couponDiscount(claim, subtotal()))}</strong></button>`; }).join('') : '<p class="muted">当前没有可用于这笔外卖订单的优惠券。</p>';
    app.innerHTML = `${top('订单详情')}${hero()}<section class="fulfillment"><button class="${delivery ? 'on' : ''}" onclick="Order.fulfillment('delivery')"><b>派送</b><span>送餐上门</span></button><button class="${!delivery ? 'on' : ''}" onclick="Order.fulfillment('pickup')"><b>到店自取</b><span>到店取餐</span></button></section><section class="section"><h2>联系人</h2><label>姓名</label><input id="customerName" maxlength="40" value="${esc(state.takeout.name || user()?.user_metadata?.display_name || user()?.user_metadata?.name || '')}" placeholder="姓名（必填）"><label>电话</label><input id="customerPhone" inputmode="tel" maxlength="32" value="${esc(state.takeout.phone)}" placeholder="电话（必填）">${delivery ? `<label>配送地址</label><div class="address-input"><textarea id="deliveryAddress" maxlength="240" placeholder="请输入完整配送地址（必填）">${esc(state.takeout.address)}</textarea><button onclick="Order.lookupAddress()">查找地址</button></div><div id="addressMatches"></div><label>备注</label><textarea id="deliveryNote" maxlength="240" placeholder="例如：门铃号、楼层或特殊要求">${esc(state.takeout.note)}</textarea>` : `<div class="address-card"><b>自取地点</b><br>${esc(state.merchant?.address || '请向商家确认地址')}<br>预计 ${cfg.pickupMinutes} 分钟可取餐</div><label>备注</label><textarea id="deliveryNote" maxlength="240" placeholder="例如：取餐人姓名或特殊要求">${esc(state.takeout.note)}</textarea>`}</section><section class="section"><h2>${delivery ? '派送时间' : '取餐时间'}</h2><div class="choice-grid">${delivery ? `<button class="choice ${state.takeout.speed === 'priority' ? 'on' : ''}" onclick="Order.speed('priority')"><b>优先派送</b><span>优先处理 +${money(cfg.priorityFee)}</span></button>` : ''}<button class="choice ${state.takeout.speed === 'standard' ? 'on' : ''}" onclick="Order.speed('standard')"><b>标准${delivery ? '派送' : '自取'}</b><span>${delivery ? `约 ${cfg.standardMinutes}-${cfg.standardMinutes + 15} 分钟` : `约 ${cfg.pickupMinutes} 分钟`}</span></button><button class="choice ${state.takeout.speed === 'scheduled' ? 'on' : ''}" onclick="Order.speed('scheduled')"><b>预约时间</b><span>选择指定时间</span></button></div>${state.takeout.speed === 'scheduled' ? `<label>预约时间</label><input id="scheduledAt" type="datetime-local" min="${minimum}" value="${esc(state.takeout.scheduledAt)}">` : ''}</section><section class="section"><h2>使用优惠券</h2>${couponHtml}<div class="tip"><b>小费</b><div class="tip-buttons">${[0, 15, 18, 20].map(percent => `<button class="${state.takeout.customTip === '' && Number(state.takeout.tipPercent) === percent ? 'on' : ''}" onclick="Order.tip(${percent})">${percent ? `${percent}%` : '不加小费'}</button>`).join('')}<button class="${state.takeout.customTip !== '' ? 'on' : ''}" onclick="Order.customTip()">自定</button></div>${state.takeout.customTip !== '' ? `<input id="customTip" inputmode="decimal" value="${esc(state.takeout.customTip)}" placeholder="输入小费金额" onchange="Order.setCustomTip(this.value)">` : ''}</div></section><section class="section"><h2>订单信息汇总</h2>${cartRows().map(product => `<div class="summary-line"><span>${esc(product.name)} × ${product.quantity}</span><b>${money(price(product.price) * product.quantity)}</b></div>`).join('')}<div class="summary-line"><span>菜品小计</span><b>${money(subtotal())}</b></div>${deliveryFee() ? `<div class="summary-line"><span>优先派送费</span><b>${money(deliveryFee())}</b></div>` : ''}<div class="summary-line"><span>优惠券优惠</span><b class="danger">-${money(discountAmount())}</b></div><div class="summary-line"><span>小费</span><b>${money(tipAmount())}</b></div><div class="summary-line total"><span>应付合计</span><b>${money(totalAmount())}</b></div></section><section class="section"><h2>在线支付方式</h2><div class="payment">${[['apple_pay','Apple Pay'],['google_pay','Google Pay'],['card','信用卡'],['gift_card','商家礼品卡']].map(([id,label]) => `<button class="${state.takeout.payment === id ? 'on' : ''}" onclick="Order.payment('${id}')">${label}</button>`).join('')}</div><div class="notice">支付服务即将接入。提交后商家会收到订单；优惠和金额会在正式付款前再次确认。</div></section><button class="primary submit" onclick="Order.submit()">提交订单并前往支付</button>`;
  }

  function renderOrders() {
    const orders = state.recentOrders;
    app.innerHTML = `${top('已点外卖')}${orders.length ? `<div class="order-history">${orders.map(order => `<article class="history-card"><div class="history-heading"><span><b>${esc(order.order_code || '外卖订单')}</b><small>${formatTime(order.created_at)} 下单</small></span><em>${esc(order.status === 'completed' ? '已完成' : order.status === 'cancelled' ? '已取消' : '处理中')}</em></div><p><b>${order.fulfillment === 'delivery' ? '派送地址' : '到店自取'}</b>　${esc(order.delivery_address || state.merchant?.address || '')}</p><p><b>预计${order.fulfillment === 'delivery' ? '送达' : '取餐'}</b>　${formatTime(order.estimated_at || order.delivery_at || new Date(new Date(order.created_at).getTime() + settings().standardMinutes * 60000).toISOString())}</p><div class="summary-line"><span>订单金额</span><b>${money(order.subtotal)}</b></div><button class="contact-driver" disabled>联系外卖员（即将开放）</button></article>`).join('')}</div>` : '<div class="empty">暂时没有进行中的外卖订单。</div>'}`;
  }

  function renderSuccess() {
    const dinein = !isTakeout();
    app.innerHTML = `${top('订单已提交')}<div class="success"><i>✓</i><h1>${dinein ? '餐桌订单已提交' : '外卖订单已提交'}</h1><p class="muted">${dinein ? '订单已发送给商家，请留意上菜情况。' : `订单已发送给商家。预计${state.takeout.fulfillment === 'delivery' ? '送达' : '取餐'}时间可在“已点外卖”中查看。`}</p>${dinein ? '' : '<button class="primary" onclick="Order.orders()">查看已点外卖</button>'}<button class="link" onclick="Order.menu()">继续浏览菜单</button></div>`;
  }

  function renderTakeoutAppOnly() {
    const ua = navigator.userAgent || '';
    const device = /iPhone|iPad|iPod/i.test(ua) ? 'iPhone / iPad' : /Android/i.test(ua) ? 'Android' : '手机';
    app.innerHTML = `${top('外卖点单')}<div class="success"><i>↓</i><h1>请下载乐生活 App 使用</h1><p class="muted">外卖点单、在线结算与优惠券仅在乐生活 App 内开放。已在网页登录的用户可继续使用网页外卖点单。</p><button class="primary" onclick="Order.downloadApp()">下载 ${esc(device)} 版 App</button><button class="link" onclick="Order.close()">返回商家主页</button></div>`;
  }

  function render() {
    try {
      if (!state.merchant) return;
      if (state.screen === 'cart') renderCart();
      else if (state.screen === 'details') renderDetails();
      else if (state.screen === 'orders') renderOrders();
      else if (state.screen === 'success') renderSuccess();
      else renderMenu();
    } catch (error) {
      console.error(error);
      app.innerHTML = '<div class="empty">点餐页面暂时无法打开，请稍后再试。</div>';
    }
  }

  async function loadClaims() {
    const currentUser = user();
    if (!currentUser?.id) return [];
    const response = await api(`/rest/v1/merchant_coupon_claims?merchant_user_id=eq.${encodeURIComponent(state.merchant.user_id)}&user_id=eq.${encodeURIComponent(currentUser.id)}&status=eq.claimed&select=*&order=claimed_at.desc`);
    return response.ok ? response.json() : [];
  }
  async function loadRecentOrders() {
    const currentUser = user();
    if (!currentUser?.id) return [];
    const response = await api(`/rest/v1/merchant_orders?merchant_user_id=eq.${encodeURIComponent(state.merchant.user_id)}&user_id=eq.${encodeURIComponent(currentUser.id)}&order_type=eq.takeout&select=*&order=created_at.desc&limit=20`);
    return response.ok ? response.json() : [];
  }
  async function lookupAddress() {
    persistFields();
    if (state.takeout.address.length < 5) { alert('请先输入完整配送地址。'); return; }
    const matches = document.getElementById('addressMatches');
    if (matches) matches.innerHTML = '<p class="muted">正在查找地址...</p>';
    try {
      const response = await api('/functions/v1/merchant-geocode', { method:'POST', body:JSON.stringify({ address: state.takeout.address }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || '地址查询失败');
      const rows = Array.isArray(data.results) ? data.results : [];
      if (!rows.length) { if (matches) matches.innerHTML = '<p class="muted">没有找到匹配地址，请检查后手动填写。</p>'; return; }
      if (matches) matches.innerHTML = `<div class="address-results">${rows.map((row, index) => `<button onclick="Order.useAddress(${index})">${esc(row.formatted_address)}</button>`).join('')}</div>`;
      state.addressResults = rows;
    } catch (error) { if (matches) matches.innerHTML = `<p class="muted">${esc(error.message || '地址查询失败，请稍后再试。')}</p>`; }
  }
  async function submit() {
    persistFields();
    const rows = cartRows();
    if (!isTakeout()) {
      if (!rows.length) { alert('请先选择菜品。'); return; }
      const response = await api('/rest/v1/rpc/merchant_dinein_guest_order_create', { method:'POST', body:JSON.stringify({
        p_merchant_user_id: state.merchant.user_id,
        p_table_code: state.dinein.tableCode,
        p_items: rows.map(product => ({ product_id: product.id, quantity: product.quantity })),
        p_note: state.dinein.note
      }) });
      if (!response.ok) { console.warn(await response.text()); alert('订单提交失败，请确认桌号后重试。'); return; }
      state.orderId = await response.json(); state.cart = {}; nav('success'); return;
    }
    const delivery = state.takeout.fulfillment === 'delivery';
    if (!rows.length) { alert('请先选择菜品。'); return; }
    if (!state.takeout.name || !state.takeout.phone || (delivery && !state.takeout.address)) { alert('请填写姓名、电话以及配送地址。'); return; }
    if (state.takeout.speed === 'scheduled' && !state.takeout.scheduledAt) { alert('请选择预约时间。'); return; }
    const now = new Date();
    const estimateMinutes = state.takeout.speed === 'priority' ? Math.max(15, settings().standardMinutes - 15) : (delivery ? settings().standardMinutes : settings().pickupMinutes);
    const estimateAt = state.takeout.speed === 'scheduled' ? new Date(state.takeout.scheduledAt).toISOString() : new Date(now.getTime() + estimateMinutes * 60000).toISOString();
    const response = await api('/rest/v1/rpc/merchant_takeout_order_submit', { method:'POST', body:JSON.stringify({
      p_merchant_user_id: state.merchant.user_id,
      p_items: rows.map(product => ({ product_id: product.id, quantity: product.quantity })),
      p_customer_name: state.takeout.name,
      p_customer_phone: state.takeout.phone,
      p_fulfillment: delivery ? 'delivery' : 'pickup',
      p_delivery_address: delivery ? state.takeout.address : '',
      p_delivery_at: state.takeout.speed === 'scheduled' ? new Date(state.takeout.scheduledAt).toISOString() : null,
      p_customer_note: state.takeout.note,
      p_estimated_at: estimateAt,
      p_requested_payment_method: state.takeout.payment,
      p_tip_amount: Number(tipAmount().toFixed(2)),
      p_quoted_discount_amount: Number(discountAmount().toFixed(2)),
      p_coupon_claim_ids: selectedClaim() ? [Number(selectedClaim().id)] : []
    }) });
    if (!response.ok) { console.warn(await response.text()); alert('订单提交失败，请稍后再试。'); return; }
    state.orderId = await response.json();
    state.cart = {}; state.recentOrders = await loadRecentOrders(); nav('success');
  }

  window.Order = {
    back, close, menu: () => nav('menu'), cart: () => nav('cart'), details: async () => { if (isTakeout()) state.claims = await loadClaims(); nav('details'); }, orders: async () => { state.recentOrders = await loadRecentOrders(); nav('orders'); },
    category: value => { state.category = value; render(); }, qty: (id, delta) => { const next = Math.max(0, Math.min(99, Number(state.cart[id] || 0) + Number(delta))); if (next) state.cart[id] = next; else delete state.cart[id]; render(); },
    fulfillment: value => { persistFields(); state.takeout.fulfillment = value; state.takeout.speed = 'standard'; render(); }, speed: value => { persistFields(); state.takeout.speed = value; render(); },
    coupon: id => { persistFields(); state.takeout.couponId = Number(state.takeout.couponId) === id ? null : id; render(); }, payment: value => { persistFields(); state.takeout.payment = value; render(); },
    tip: value => { persistFields(); state.takeout.tipPercent = value; state.takeout.customTip = ''; render(); }, customTip: () => { persistFields(); state.takeout.customTip = state.takeout.customTip || '0'; render(); }, setCustomTip: value => { persistFields(); state.takeout.customTip = value; render(); },
    lookupAddress, useAddress: index => { const row = state.addressResults?.[index]; if (!row) return; state.takeout.address = row.formatted_address; state.takeout.note = ''; render(); },
    appCoupon: () => alert('优惠券仅限乐生活 App 内领取和使用。请下载或打开乐生活 App 后再试。'),
    downloadApp: () => alert('乐生活 App 的下载入口将在正式上架后按你的设备自动启用。'), submit
  };

  (async () => {
    const slug = query.get('merchant');
    if (!slug) { app.innerHTML = '<div class="empty">缺少商家信息。</div>'; return; }
    if (isTakeout() && !user()?.id) { renderTakeoutAppOnly(); return; }
    if (!isTakeout() && !state.dinein.tableCode) { app.innerHTML = '<div class="empty">缺少餐桌信息，请重新扫描餐桌二维码。</div>'; return; }
    const merchantResponse = await api(`/rest/v1/merchants?slug=eq.${encodeURIComponent(slug)}&verified=eq.true&select=*&limit=1`);
    const merchants = merchantResponse.ok ? await merchantResponse.json() : [];
    state.merchant = merchants[0];
    if (!state.merchant) { app.innerHTML = '<div class="empty">未找到可点餐商家。</div>'; return; }
    if (!isTakeout()) {
      const contextResponse = await api('/rest/v1/rpc/merchant_dinein_guest_context', { method:'POST', body:JSON.stringify({ p_merchant_slug: slug, p_table_code: state.dinein.tableCode }) });
      const context = contextResponse.ok ? await contextResponse.json() : null;
      if (!context || context.merchant_user_id !== state.merchant.user_id) { app.innerHTML = '<div class="empty">该餐桌二维码已失效，请联系商家。</div>'; return; }
      state.dinein.tableName = context.table_name || '扫码点餐';
    }
    state.products = Array.isArray(state.merchant.products) ? state.merchant.products : [];
    if (isTakeout()) state.recentOrders = await loadRecentOrders();
    render();
  })().catch(error => { console.error(error); app.innerHTML = '<div class="empty">点餐页面暂时无法打开，请稍后再试。</div>'; });
})();
