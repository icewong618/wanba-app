(() => {
  const URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
  const KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
  const app = document.querySelector('#shopApp');
  const parts = location.pathname.split('/').filter(Boolean);
  const query = new URLSearchParams(location.search);
  const market = String(query.get('market') || ((parts.length === 3 && parts[1] === 'shop') ? parts[0] : 'la')).toLowerCase();
  const slug = String(query.get('shop') || ((parts.length === 3 && parts[1] === 'shop') ? parts[2] : '')).toLowerCase();
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  const api = path => fetch(URL + path, { headers:{ apikey:KEY, Authorization:`Bearer ${KEY}` } });
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
    body.innerHTML = `<h2>${esc(product.title)}</h2>${product.images?.[0] ? `<img src="${esc(product.images[0])}" style="width:100%;max-height:300px;object-fit:cover;border-radius:10px">` : ''}<p style="white-space:pre-line;line-height:1.65;color:#77766c">${esc(product.description || '请通过乐生活联系店主。')}</p><b style="color:#ca3f70;font-size:20px">$${Number(product.price).toFixed(2)}</b><button onclick="alert('联系店主功能即将打开私信。')">联系店主</button>`;
    document.querySelector('#sheet').classList.add('open');
  }

  window.Shop = {
    back,
    open,
    close: () => document.querySelector('#sheet')?.classList.remove('open'),
    share: () => navigator.share ? navigator.share({ title:data?.shop?.display_name || '个人小店', url:location.href }) : navigator.clipboard?.writeText(location.href)
  };
  load();
})();
