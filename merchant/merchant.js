(() => {
  const URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
  const KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
  const app = document.querySelector('#merchantApp');
  const q = new URLSearchParams(location.search);
  const pathParts = location.pathname.split('/').filter(Boolean);
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  const list = value => Array.isArray(value) ? value : (typeof value === 'string' ? (() => { try { return JSON.parse(value); } catch (error) { return []; } })() : []);
  const imgs = product => list(product.images).length ? list(product.images) : (product.image ? [product.image] : []);
  const money = value => {
    const normalized = String(value ?? '').replace(/[^0-9.-]/g, '');
    const amount = Number(normalized);
    return Number.isFinite(amount) && amount >= 0 ? amount : null;
  };
  const moneyLabel = value => {
    const amount = money(value);
    return amount === null ? '咨询商家' : `$${amount.toFixed(2)}`;
  };
  const publicHeaders = () => ({ apikey: KEY, Authorization: `Bearer ${KEY}` });
  const api = (path, options = {}) => fetch(URL + path, { ...options, headers: { ...publicHeaders(), ...(options.headers || {}) } });
  const getSession = () => { try { return JSON.parse(localStorage.getItem('wanba_session') || 'null'); } catch (error) { return null; } };
  const authRequest = (path, options = {}) => {
    const session = getSession();
    return fetch(URL + path, { ...options, headers: { ...publicHeaders(), Authorization: `Bearer ${session?.access_token || KEY}`, ...(options.headers || {}) } });
  };
  const back = () => history.length > 1 ? history.back() : location.assign('/');
  const market = String(q.get('market') || ((pathParts.length === 3 && pathParts[1] === 'merchant') ? pathParts[0] : 'la')).toLowerCase();
  const slug = String(q.get('merchant') || q.get('m') || ((pathParts.length === 3 && pathParts[1] === 'merchant') ? pathParts[2] : '')).toLowerCase();
  let merchant = null;
  let tab = 'posts';
  let cart = [];
  let inventoryState = new Map();
  let restrictedProducts = new Set();

  const social = item => {
    const raw = item.external_links;
    return raw && typeof raw === 'object' && !Array.isArray(raw) ? Object.entries(raw).filter(([, url]) => url).slice(0, 5) : [];
  };
  const cartKey = () => `scoop_merchant_cart_${merchant?.user_id || slug}`;
  const readCart = () => {
    try { return list(JSON.parse(localStorage.getItem(cartKey()) || '[]')).filter(line => line && line.id && Number(line.quantity) > 0); } catch (error) { return []; }
  };
  const saveCart = () => localStorage.setItem(cartKey(), JSON.stringify(cart));
  const cartCount = () => cart.reduce((total, line) => total + Number(line.quantity || 0), 0);
  const cartTotal = () => cart.reduce((total, line) => total + (Number(line.price || 0) * Number(line.quantity || 0)), 0);
  const isRetail = () => String(merchant?.category || '').includes('零售') || String(merchant?.subcategory || '').includes('零售');
  const stockState = product => inventoryState.get(String(product?.id || ''));
  const isOutOfStock = product => stockState(product)?.in_stock === false;
  const isBuyable = product => money(product.price) !== null && !isOutOfStock(product);
  const openFeature = kind => {
    const base = encodeURIComponent(merchant.slug);
    const paths = { rental:`/rental/?merchant=${base}`, auto_sales:`/autos/?merchant=${base}`, table_order:`/restaurant/?merchant=${base}` };
    location.assign(paths[kind] || '/');
  };

  async function load() {
    if (!slug) { app.innerHTML = '<div class="empty">缺少商家链接。</div>'; return; }
    try {
      const response = await api(`/rest/v1/merchants?market_code=eq.${encodeURIComponent(market)}&slug=eq.${encodeURIComponent(slug)}&verified=eq.true&select=*&limit=1`);
      merchant = (await response.json())[0];
      if (!merchant) throw new Error('not found');
      const controlsResponse = await api('/rest/v1/rpc/marketplace_public_listing_controls', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ p_owner_user_id:merchant.user_id, p_source_type:'merchant_product' })
      });
      const controls = controlsResponse.ok ? await controlsResponse.json() : [];
      restrictedProducts = new Set(list(controls).map(row => String(row.source_id || '')));
      if (isRetail()) {
        const inventoryResponse = await api('/rest/v1/rpc/merchant_retail_public_inventory', {
          method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ p_merchant_user_id:merchant.user_id })
        });
        const inventoryRows = inventoryResponse.ok ? await inventoryResponse.json() : [];
        inventoryState = new Map(list(inventoryRows).map(row => [String(row.product_id), row]));
      }
      cart = readCart();
      render();
    } catch (error) {
      app.innerHTML = '<div class="empty">没有找到这家认证商家，请确认链接是否正确。</div>';
    }
  }

  async function render() {
    const features = new Set(list(merchant.enabled_features));
    const cover = merchant.cover_image ? `style="background-image:url('${esc(merchant.cover_image)}')"` : '';
    const featureCards = [];
    if (features.has('table_order')) featureCards.push(['table_order', '扫码点餐']);
    if (features.has('rental')) featureCards.push(['rental', '租车预约']);
    if (features.has('auto_sales')) featureCards.push(['auto_sales', '二手车买卖']);
    const response = await api(`/rest/v1/posts?user_id=eq.${encodeURIComponent(merchant.user_id)}&visibility=eq.public&select=id,title,excerpt,content,image,created_at&order=created_at.desc&limit=30`);
    const posts = await response.json().catch(() => []);
    const products = list(merchant.products || merchant.store_products).filter(product => product && product.active !== false && !restrictedProducts.has(String(product.id || '')));
    const coupons = list(merchant.coupons).filter(coupon => coupon && coupon.active !== false);
    const body = tab === 'posts'
      ? (posts.length ? posts.map(post => `<article class="post"><h3>${esc(post.title || '商家动态')}</h3><p>${esc(post.excerpt || post.content || '')}</p></article>`).join('') : '<div class="empty">商家暂时还没有发布动态。</div>')
      : tab === 'store'
        ? (products.length ? products.map((product, index) => `<article class="product" onclick="MerchantSite.product(${index})"><div class="product-image">${imgs(product)[0] ? `<img src="${esc(imgs(product)[0])}" alt="" loading="lazy">` : ''}</div><div><h3>${esc(product.name || product.title || '商品')}</h3><p>${esc(product.description || '')}</p><div class="price">${moneyLabel(product.price)}${isOutOfStock(product) ? '<span class="stock-out">暂时缺货</span>' : ''}</div></div></article>`).join('') : '<div class="empty">商家正在整理商品与服务。</div>')
        : (coupons.length ? coupons.map(coupon => `<article class="coupon"><h3>${esc(coupon.title || '店铺优惠')} <b>${esc(coupon.badge || '优惠')}</b></h3><p>${esc(coupon.description || '到店出示使用，具体以商家说明为准。')}</p></article>`).join('') : '<div class="empty">暂时没有可领取的优惠券。</div>');
    const storeTab = isRetail() ? `<button class="${tab === 'store' ? 'on' : ''}" onclick="MerchantSite.tab('store')">店铺</button><button class="cart-tab" onclick="MerchantSite.cart()">购物车${cartCount() ? `<b>${cartCount()}</b>` : ''}</button>` : `<button class="${tab === 'store' ? 'on' : ''}" onclick="MerchantSite.tab('store')">店铺</button>`;
    app.innerHTML = `<header class="top"><button onclick="MerchantSite.back()">‹</button><b>商家微网站</b><button onclick="MerchantSite.share()">⌑</button></header><section class="hero ${merchant.cover_image ? 'cover' : ''}" ${cover}><div class="identity"><div class="logo">${merchant.logo ? `<img src="${esc(merchant.logo)}" alt="">` : esc((merchant.business_name || '商').slice(0, 1))}</div><div><h1>${esc(merchant.business_name || '认证商家')}</h1><small>乐生活认证商家</small></div></div><p class="intro">${esc(merchant.intro || merchant.description || '')}</p></section><section class="info"><div class="meta">${merchant.category ? `<span>${esc(merchant.category)}${merchant.subcategory ? ' · ' + esc(merchant.subcategory) : ''}</span>` : ''}${merchant.business_hours ? `<span>营业时间：${esc(typeof merchant.business_hours === 'string' ? merchant.business_hours : '详见店铺')}</span>` : ''}${merchant.address ? `<span>${esc(merchant.address)}</span>` : ''}</div><div class="actions"><a class="primary" href="tel:${esc(merchant.phone || '')}">联系商家</a><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(merchant.address || merchant.business_name || '')}" target="_blank" rel="noopener">导航</a><button onclick="MerchantSite.copy()">复制链接</button></div>${social(merchant).length ? `<div class="social">${social(merchant).map(([name, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(name)}</a>`).join('')}</div>` : ''}</section>${featureCards.length ? `<section class="features">${featureCards.map(([id, name]) => `<button class="feature" onclick="MerchantSite.feature('${id}')">${esc(name)}</button>`).join('')}</section>` : ''}<nav class="tabs"><button class="${tab === 'posts' ? 'on' : ''}" onclick="MerchantSite.tab('posts')">最新动态</button>${storeTab}<button class="${tab === 'coupons' ? 'on' : ''}" onclick="MerchantSite.tab('coupons')">优惠券</button></nav><section class="content">${body}</section><div class="modal" id="productModal" onclick="if(event.target.id==='productModal')MerchantSite.close()"><div class="sheet" id="productSheet"></div></div>`;
    window._merchantProducts = products;
  }

  function product(index) {
    const product = window._merchantProducts[index];
    if (!product) return;
    const purchasable = isRetail() && isBuyable(product);
    document.querySelector('#productSheet').innerHTML = `<div class="sheet-head"><h2>${esc(product.name || product.title || '商品')}</h2><button class="sheet-close" onclick="MerchantSite.close()">×</button></div>${imgs(product)[0] ? `<img src="${esc(imgs(product)[0])}" class="product-detail-image" alt="">` : ''}<p class="product-detail-copy">${esc(product.description || '请联系商家了解详情。')}</p><h3 class="price">${moneyLabel(product.price)}</h3>${isOutOfStock(product) ? '<p class="stock-notice">该商品暂时缺货，请稍后再试或联系商家。</p>' : purchasable ? `<div class="product-buy-row"><div class="quantity"><button onclick="MerchantSite.productQuantity(${index},-1)">−</button><b id="productQuantity">1</b><button onclick="MerchantSite.productQuantity(${index},1)">＋</button></div><button class="buy-main" onclick="MerchantSite.add(${index})">加入购物车</button></div><button class="buy-secondary" onclick="MerchantSite.buyNow(${index})">线下自取 · 联系商家下单</button><p class="buy-note">订单提交时会先核对库存；商家完成交付后才会扣减库存。</p>` : `<button onclick="location.href='tel:${esc(merchant.phone || '')}'">联系商家</button>`}`;
    document.querySelector('#productSheet').insertAdjacentHTML('beforeend', `<button class="buy-secondary" style="margin-top:10px;color:#876b5a" onclick="MerchantSite.report(${index})">举报此商品</button>`);
    window._merchantQuantity = 1;
    document.querySelector('#productModal').classList.add('open');
  }

  function productQuantity(index, change) {
    window._merchantQuantity = Math.max(1, Math.min(99, Number(window._merchantQuantity || 1) + Number(change || 0)));
    const target = document.getElementById('productQuantity');
    if (target) target.textContent = window._merchantQuantity;
  }

  function add(index, closeAfter = true) {
    const product = window._merchantProducts[index];
    if (!product || !isBuyable(product)) { if (isOutOfStock(product)) alert('该商品暂时缺货。'); return; }
    const quantity = Math.max(1, Number(window._merchantQuantity || 1));
    const found = cart.find(line => String(line.id) === String(product.id));
    if (found) found.quantity = Math.min(99, Number(found.quantity || 0) + quantity);
    else cart.push({ id:String(product.id), name:product.name || product.title || '商品', price:money(product.price), image:imgs(product)[0] || '', quantity });
    saveCart();
    if (closeAfter) { close(); render(); }
  }

  async function report(index) {
    const product = window._merchantProducts[index];
    const session = getSession();
    if (!product) return;
    if (!(session?.access_token && session?.user?.id)) { alert('请先登录乐生活后再举报商品。'); return; }
    const reason = prompt('举报原因：prohibited（禁售品）/ counterfeit（假冒）/ fraud（欺诈）/ unsafe（安全风险）/ stolen（疑似赃物）/ other（其他）', 'other');
    const allowed = ['prohibited', 'counterfeit', 'fraud', 'unsafe', 'stolen', 'privacy', 'other'];
    if (!reason) return;
    if (!allowed.includes(String(reason).trim())) { alert('请填写列表中的英文原因代码。'); return; }
    const detail = prompt('补充说明（可选）', '') || '';
    const response = await authRequest('/rest/v1/rpc/marketplace_report_listing', {
      method:'POST', headers:{ 'Content-Type':'application/json' },
      body:JSON.stringify({ p_owner_user_id:merchant.user_id, p_source_type:'merchant_product', p_source_id:String(product.id || ''), p_listing_title:product.name || product.title || '', p_reason:String(reason).trim(), p_detail:detail })
    });
    if (!response.ok) { alert('举报提交失败，请稍后再试。'); return; }
    alert('已收到举报。平台会审核处理；必要时会暂停该商品展示和购买。');
  }

  function buyNow(index) { add(index, false); cartView(); }
  function changeCart(id, change) {
    const found = cart.find(line => String(line.id) === String(id));
    if (!found) return;
    found.quantity = Number(found.quantity || 0) + Number(change || 0);
    cart = cart.filter(line => Number(line.quantity || 0) > 0);
    saveCart();
    cartView();
  }
  function cartView() {
    const lines = cart.length ? cart.map(line => `<div class="cart-line"><div>${line.image ? `<img src="${esc(line.image)}" alt="">` : ''}</div><div class="cart-copy"><b>${esc(line.name)}</b><small>${moneyLabel(line.price)}</small><div class="quantity small"><button onclick="MerchantSite.changeCart('${esc(line.id)}',-1)">−</button><b>${Number(line.quantity)}</b><button onclick="MerchantSite.changeCart('${esc(line.id)}',1)">＋</button></div></div><strong>${moneyLabel(Number(line.price) * Number(line.quantity))}</strong></div>`).join('') : '<div class="empty compact">购物车还是空的。</div>';
    document.querySelector('#productSheet').innerHTML = `<div class="sheet-head"><h2>购物车</h2><button class="sheet-close" onclick="MerchantSite.close()">×</button></div>${lines}${cart.length ? `<div class="cart-total"><span>商品合计</span><b>${moneyLabel(cartTotal())}</b></div><button class="buy-main" onclick="MerchantSite.pickup()">提交自取订单</button><p class="buy-note">订单提交后，商家会确认库存并安排自取时间；您可在“我的 - Purchase”查看进度。</p>` : ''}`;
    document.querySelector('#productModal').classList.add('open');
  }
  function pickup() {
    if (!cart.length) return;
    const session = getSession();
    if (!(session?.access_token && session?.user?.id)) {
      document.querySelector('#productSheet').innerHTML = `<div class="sheet-head"><h2>请先登录</h2><button class="sheet-close" onclick="MerchantSite.close()">×</button></div><p class="product-detail-copy">登录乐生活后，才能把线下自取订单安全发送给商家。</p><button class="buy-main" onclick="location.assign('/?auth=login')">前往乐生活登录</button>`;
      return;
    }
    const defaultName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || '';
    document.querySelector('#productSheet').innerHTML = `<div class="sheet-head"><h2>线下自取</h2><button class="sheet-close" onclick="MerchantSite.cart()">‹</button></div><p class="product-detail-copy">确认后，商家会安排库存与自取时间，并通过乐生活消息通知您。</p><label class="form-label">联系人</label><input id="pickupName" class="form-input" value="${esc(defaultName)}" maxlength="40" placeholder="填写联系人姓名"><label class="form-label">联系电话</label><input id="pickupPhone" class="form-input" inputmode="tel" maxlength="30" placeholder="填写联系电话"><label class="form-label">备注（可选）</label><textarea id="pickupNote" class="form-input textarea" maxlength="180" placeholder="例如：希望今天傍晚自取"></textarea><div class="cart-total"><span>商品合计</span><b>${moneyLabel(cartTotal())}</b></div><button class="buy-main" onclick="MerchantSite.submitPickup()">确认提交订单</button>`;
  }
  async function submitPickup() {
    const session = getSession();
    const name = document.getElementById('pickupName')?.value.trim();
    const phone = document.getElementById('pickupPhone')?.value.trim();
    const note = document.getElementById('pickupNote')?.value.trim();
    if (!name || !phone) { alert('请填写联系人和联系电话。'); return; }
    if (!(session?.access_token && session?.user?.id)) { pickup(); return; }
    const button = document.querySelector('#productSheet .buy-main');
    if (button) { button.disabled = true; button.textContent = '正在发送…'; }
    try {
      const response = await authRequest('/rest/v1/rpc/merchant_retail_order_create', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ p_merchant_user_id:merchant.user_id, p_items:cart.map(line => ({ product_id:String(line.id), quantity:Math.max(1, Number(line.quantity || 1)) })), p_customer_name:name, p_customer_phone:phone, p_customer_note:note || null }) });
      if (!response.ok) {
        const text = await response.text();
        if (/insufficient_stock/i.test(text)) throw new Error('部分商品库存不足，请刷新后调整购物车。');
        throw new Error(`订单提交失败（${response.status}）`);
      }
      const order = await response.json();
      cart = []; saveCart();
      document.querySelector('#productSheet').innerHTML = `<div class="sheet-head"><h2>订单已提交</h2><button class="sheet-close" onclick="MerchantSite.close()">×</button></div><div class="success">订单号：${esc(order?.order_code || '')}<br>商家会确认库存并安排自取时间。您可在“我的 - Purchase”查看进度。</div><button class="buy-main" onclick="MerchantSite.close();MerchantSite.refresh()">完成</button>`;
    } catch (error) {
      if (button) { button.disabled = false; button.textContent = '重新提交订单'; }
      alert(`订单提交失败，请稍后重试。${error.message || ''}`);
    }
  }

  const close = () => document.querySelector('#productModal')?.classList.remove('open');
  const copy = () => navigator.clipboard?.writeText(location.href).then(() => alert('链接已复制')).catch(() => prompt('复制链接', location.href));
  window.MerchantSite = { back, tab:value => { tab = value; render(); }, feature:openFeature, product, productQuantity, add, report, buyNow, cart:cartView, changeCart, pickup, submitPickup, close, copy, refresh:render, share:() => navigator.share ? navigator.share({ title:merchant.business_name, text:merchant.intro, url:location.href }) : copy() };
  load();
})();
