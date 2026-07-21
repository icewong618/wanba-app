(() => {
  const SUPABASE_URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
  const app = document.getElementById('autoMineApp');
  const state = { data:{ saved:[], leads:[] }, tab:'saved' };
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const money = value => `$${Number(value || 0).toLocaleString('en-US',{maximumFractionDigits:0})}`;
  const session = () => { try { return JSON.parse(localStorage.getItem('wanba_session') || 'null'); } catch { return null; } };
  const top = title => `<header class="top"><button onclick="AutoMine.back()" aria-label="返回">‹</button><b>${esc(title)}</b><span><button onclick="AutoMine.close()" aria-label="关闭">×</button></span></header>`;
  const exit = () => { if (window.parent !== window) { window.parent.postMessage({type:'leshenghuo-close-auto'}, '*'); return; } history.length > 1 ? history.back() : location.assign('/'); };
  async function refreshSession() {
    const current = session();
    if (!current?.refresh_token) return false;
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, { method:'POST', headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'}, body:JSON.stringify({refresh_token:current.refresh_token}) });
      if (!response.ok) return false;
      const next = await response.json();
      localStorage.setItem('wanba_session', JSON.stringify({...current,...next,user:next.user || current.user}));
      return !!next.access_token;
    } catch { return false; }
  }
  async function api(path, options={}) {
    const request = () => fetch(SUPABASE_URL + path, { ...options, headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session()?.access_token || SUPABASE_KEY}`,'Content-Type':'application/json',...(options.headers || {})} });
    let response = await request();
    if (response.status === 401 && await refreshSession()) response = await request();
    return response;
  }
  function typeText(type) { return type === 'sell_quote' ? '卖车估价' : type === 'test_drive' ? '预约试驾' : '车辆咨询'; }
  function statusText(status) { return ({new:'已提交',contacted:'商家已联系',scheduled:'已安排',reschedule_requested:'已申请改期',cancelled:'已取消',quoted:'等待你确认',quote_accepted:'已接受报价',quote_declined:'已拒绝报价',closed:'已完成',archived:'已归档'})[status] || status; }
  function openMerchant(slug) { location.assign(`/autos/?merchant=${encodeURIComponent(slug)}&auto_v=5.401`); }
  function openListing(slug) { location.assign(`/autos/?merchant=${encodeURIComponent(slug)}&auto_v=5.401`); }
  function savedHtml() {
    const saved = state.data.saved || [];
    return saved.length ? saved.map(car => `<article class="mine-card"><button style="all:unset;display:contents;cursor:pointer" onclick="AutoMine.openListing('${esc(car.merchant_slug)}')">${Array.isArray(car.photos) && car.photos[0] ? `<img src="${esc(car.photos[0])}" alt="">` : '<div class="placeholder">🚘</div>'}<div><span class="chip">${esc(car.vehicle_type || '车辆')}</span><h2>${esc(car.title)}</h2><p>${esc([car.year,car.mileage ? `${Number(car.mileage).toLocaleString()} mi` : '',car.fuel_type,car.transmission].filter(Boolean).join(' · '))}</p><strong>${money(car.price)}</strong><p class="merchant">${esc(car.merchant_name)}</p></div></button><div class="buttons"><button class="outline" onclick="AutoMine.openListing('${esc(car.merchant_slug)}')">查看车辆</button><button class="primary" onclick="AutoMine.openMerchant('${esc(car.merchant_slug)}')">联系商家</button></div></article>`).join('') : '<div class="empty">还没有收藏车辆。浏览车辆时点爱心，即可在这里统一查看。</div>';
  }
  function leadsHtml() {
    const leads = state.data.leads || [];
    return leads.length ? leads.map(lead => {
      const vehicle = lead.lead_type === 'sell_quote' ? [lead.vehicle_data?.year,lead.vehicle_data?.make,lead.vehicle_data?.model].filter(Boolean).join(' ') || '车辆估价' : lead.listing_title || '车辆咨询';
      const schedule = lead.lead_type === 'test_drive' ? (lead.confirmed_at ? `确认试驾：${new Date(lead.confirmed_at).toLocaleString('zh-CN')}${lead.appointment_location ? ` · ${lead.appointment_location}` : ''}` : lead.preferred_at ? `希望时间：${new Date(lead.preferred_at).toLocaleString('zh-CN')}` : '等待商家安排时间。') : '';
      const quote = lead.lead_type === 'sell_quote' && lead.quoted_amount !== null && lead.quoted_amount !== undefined ? `商家报价：${money(lead.quoted_amount)}` : '';
      return `<article class="mine-card"><div class="placeholder">${lead.lead_type === 'test_drive' ? '🗓' : lead.lead_type === 'sell_quote' ? '🚘' : '💬'}</div><div><span class="chip">${typeText(lead.lead_type)}</span><span class="chip">${statusText(lead.status)}</span><h2>${esc(vehicle)}</h2><p class="merchant">${esc(lead.merchant_name)}</p>${schedule ? `<p>${esc(schedule)}</p>` : ''}${quote ? `<strong>${esc(quote)}</strong>` : ''}${lead.merchant_note ? `<p>${esc(lead.merchant_note)}</p>` : ''}</div><div class="buttons"><button class="outline" onclick="AutoMine.openMerchant('${esc(lead.merchant_slug)}')">查看商家</button><button class="primary" onclick="AutoMine.openListing('${esc(lead.merchant_slug)}')">查看车辆</button></div></article>`;
    }).join('') : '<div class="empty">还没有估价、试驾或车辆咨询记录。</div>';
  }
  function render() {
    const saved = state.data.saved || [], leads = state.data.leads || [], quotes = leads.filter(item => item.lead_type === 'sell_quote').length;
    app.innerHTML = `${top('我的车辆')}<section class="hero"><h1>车辆与进度</h1><p>集中查看所有二手车商家的收藏、卖车估价、试驾和咨询，不必返回每一家店铺查找。</p></section><section class="mine-summary"><div><b>${saved.length}</b><span>收藏车辆</span></div><div><b>${leads.filter(item => item.lead_type === 'test_drive').length}</b><span>试驾记录</span></div><div><b>${quotes}</b><span>估价记录</span></div></section><div class="tabs mine-tabs"><button class="${state.tab === 'saved' ? 'on' : ''}" onclick="AutoMine.tab('saved')">收藏</button><button class="${state.tab === 'leads' ? 'on' : ''}" onclick="AutoMine.tab('leads')">估价与试驾</button><button class="${state.tab === 'all' ? 'on' : ''}" onclick="AutoMine.tab('all')">全部动态</button></div><section>${state.tab === 'saved' ? savedHtml() : state.tab === 'leads' ? leadsHtml() : `${savedHtml()}${leadsHtml()}`}</section><p class="mine-note">车辆价格与库存会以商家当前页面为准。需要确认车况、试驾或报价时，请直接联系对应商家。</p>`;
  }
  async function load() {
    if (!session()?.user) { app.innerHTML = `${top('我的车辆')}<div class="empty">请先登录后查看自己的车辆收藏与记录。</div>`; return; }
    try {
      const response = await api('/rest/v1/rpc/merchant_auto_customer_center', {method:'POST',body:'{}'});
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || 'load_failed');
      state.data = { saved:Array.isArray(data?.saved) ? data.saved : [], leads:Array.isArray(data?.leads) ? data.leads : [], sales:Array.isArray(data?.sales) ? data.sales : [] };
      render();
    } catch (error) { app.innerHTML = `${top('我的车辆')}<div class="empty">暂时无法读取你的车辆记录，请稍后刷新重试。</div>`; }
  }
  const renderAutoMineWithSales = render;
  render = function(){renderAutoMineWithSales();const sales=state.data.sales||[],note=app.querySelector('.mine-note');if(!note||!sales.length)return;note.insertAdjacentHTML('beforebegin',`<section class="mine-sales"><h2>购车收据</h2>${sales.map(sale=>`<article class="mine-card"><div class="placeholder">✓</div><div><span class="chip">已成交</span><h2>${esc(sale.listing_title||'车辆成交')}</h2><p class="merchant">${esc(sale.merchant_name)}</p><p>收据编号：${esc(sale.receipt_number)}</p><strong>${money(sale.sale_amount)}</strong><p>${esc(new Date(sale.completed_at).toLocaleString('zh-CN'))}</p></div></article>`).join('')}</section>`);};
  window.AutoMine = { tab(tab){state.tab=tab;render()}, openMerchant, openListing, back:exit, close:exit };
  load();
})();
