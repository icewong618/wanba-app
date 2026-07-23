(() => {
  const URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
  const KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
  const app = document.querySelector('#shopApp');
  const parts = location.pathname.split('/').filter(Boolean);
  const query = new URLSearchParams(location.search);
  const market = String(query.get('market') || ((parts.length === 3 && parts[1] === 'shop') ? parts[0] : 'la')).toLowerCase();
  const slug = String(query.get('shop') || ((parts.length === 3 && parts[1] === 'shop') ? parts[2] : '')).toLowerCase();
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  const getSession = () => { try { return JSON.parse(localStorage.getItem('wanba_session') || 'null'); } catch (_) { return null; } };
  const api = path => fetch(URL + path, { headers:{ apikey:KEY, Authorization:`Bearer ${KEY}` } });
  const authApi = (path, options = {}) => {
    const session = getSession();
    return fetch(URL + path, {
      ...options,
      headers:{ apikey:KEY, Authorization:`Bearer ${session?.access_token || KEY}`, 'Content-Type':'application/json', ...(options.headers || {}) }
    });
  };
  const back = () => history.length > 1 ? history.back() : location.assign('/');
  let data = null;

  function render() {
    const shop = data.shop;
    const products = data.products || [];
    const cover = shop.cover_image ? `style="background-image:url('${esc(shop.cover_image)}')"` : '';
    app.innerHTML = `
      <header class="top"><button onclick="Shop.back()">‹</button><b>个人小店</b><button onclick="Shop.share()">⌑</button></header>
      <section class="hero ${shop.cover_image ? 'has-cover' : ''}" ${cover}>
        <div class="head"><div class="avatar">${shop.avatar ? `<img src="${esc(shop.avatar)}">` : esc((shop.display_name || '店').slice(0, 1))}</div><div><h1>${esc(shop.display_name)}</h1><span class="pill">${shop.shop_type === 'mini_store' ? '个人经营小店' : '闲置二手'}</span></div></div>
        <p>${esc(shop.intro || '来看看这家店正在出售的好物。')}</p>
      </section>
      <section class="grid">${products.length ? products.map((product, index) => `
        <article class="item" onclick="Shop.open(${index})"><div class="image">${product.images?.[0] ? `<img src="${esc(product.images[0])}">` : ''}</div><div class="info"><b>${esc(product.title)}</b><small>${esc(product.item_condition || '二手')} · ${esc(product.fulfillment || '同城自提')}</small><div class="price">$${Number(product.price).toFixed(2)}</div></div></article>
      `).join('') : '<div class="empty" style="grid-column:1/-1">店主正在整理商品。</div>'}</section>
      <div class="sheet" id="sheet" onclick="if(event.target.id==='sheet')Shop.close()"><div id="sheetBody"></div></div>`;
    window._shopProducts = products;
  }

  async function load() {
    if(!slug) { app.innerHTML = '<div class="empty">缺少小店链接。</div>'; return; }
    try {
      const response = await api(`/rest/v1/rpc/personal_shop_public_snapshot?p_market=${encodeURIComponent(market)}&p_slug=${encodeURIComponent(slug)}`);
      data = await response.json();
      if(!response.ok || !data?.shop) throw new Error('not_found');
      render();
    } catch (_) {
      app.innerHTML = '<div class="empty">没有找到这家个人小店。</div>';
    }
  }

  function open(index) {
    const product = window._shopProducts[index];
    const body = document.querySelector('#sheetBody');
    body.innerHTML = `<h2>${esc(product.title)}</h2>${product.images?.[0] ? `<img src="${esc(product.images[0])}" style="width:100%;max-height:300px;object-fit:cover;border-radius:10px">` : ''}<p style="white-space:pre-line;line-height:1.65;color:#77766c">${esc(product.description || '请通过乐生活联系店主。')}</p><b style="color:#ca3f70;font-size:20px">$${Number(product.price).toFixed(2)}</b><button onclick="alert('联系店主功能即将打开私信。')">联系店主</button><button style="margin-top:10px;color:#876b5a" onclick="Shop.report(${index})">举报此商品</button>`;
    document.querySelector('#sheet').classList.add('open');
  }

  async function report(index) {
    const product = window._shopProducts[index];
    const session = getSession();
    if (!product) return;
    if (!(session?.access_token && session?.user?.id)) { alert('请先登录乐生活后再举报商品。'); return; }
    const reason = prompt('举报原因：prohibited（禁售品）/ counterfeit（假冒）/ fraud（欺诈）/ unsafe（安全风险）/ stolen（疑似赃物）/ other（其他）', 'other');
    const allowed = ['prohibited', 'counterfeit', 'fraud', 'unsafe', 'stolen', 'privacy', 'other'];
    if (!reason) return;
    if (!allowed.includes(String(reason).trim())) { alert('请填写列表中的英文原因代码。'); return; }
    const detail = prompt('补充说明（可选）', '') || '';
    const response = await authApi('/rest/v1/rpc/marketplace_report_listing', {
      method:'POST',
      body:JSON.stringify({ p_owner_user_id:data.shop.user_id, p_source_type:'personal_shop_product', p_source_id:String(product.id || ''), p_listing_title:product.title || '', p_reason:String(reason).trim(), p_detail:detail })
    });
    if (!response.ok) { alert('举报提交失败，请稍后再试。'); return; }
    alert('已收到举报。平台会审核处理；必要时会暂停该商品展示和购买。');
  }

  window.Shop = {
    back,
    open,
    report,
    close: () => document.querySelector('#sheet')?.classList.remove('open'),
    share: () => navigator.share ? navigator.share({ title:data?.shop?.display_name || '个人小店', url:location.href }) : navigator.clipboard?.writeText(location.href)
  };
  load();
})();
