(() => {
  const SUPABASE_URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
  const app = document.getElementById('merchantManageApp');
  const query = new URLSearchParams(location.search);
  let merchant = null;

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
  }[char]));
  const session = () => {
    try { return JSON.parse(localStorage.getItem('wanba_session') || 'null'); }
    catch(error) { return null; }
  };
  const api = (path, options = {}) => {
    const current = session();
    return fetch(SUPABASE_URL + path, {
      ...options,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${current?.access_token || SUPABASE_KEY}`,
        'Content-Type':'application/json',
        ...(options.headers || {})
      }
    });
  };
  const close = () => history.length > 1 ? history.back() : location.assign('/');
  const top = title => `<header class="top"><button onclick="MerchantAdmin.close()">‹</button><b>${esc(title)}</b><button onclick="MerchantAdmin.close()">×</button></header>`;
  const go = action => {
    if(!merchant) return;
    if(action === 'auto_sales') return location.assign(`/autos/manage/?merchant=${encodeURIComponent(query.get('merchant') || '')}`);
    if(action === 'retail') return location.assign(`/retail/manage/?merchant=${encodeURIComponent(query.get('merchant') || '')}`);
    location.assign(`/?merchant_admin=${encodeURIComponent(action)}&merchant_id=${encodeURIComponent(merchant.user_id)}&from=merchant_manage`);
  };
  const count = async path => {
    try {
      const response = await api(path);
      return response.ok ? (await response.json()).length : 0;
    } catch(error) { return 0; }
  };
  const features = () => new Set(Array.isArray(merchant?.enabled_features) ? merchant.enabled_features : []);
  const isRestaurant = () => {
    const active = features();
    return merchant?.category === '餐饮饮品' || (!merchant?.category && ['table_order','takeout_order','queue'].some(key => active.has(key)));
  };
  const isRental = () => merchant?.category === '住宿旅游' || (!merchant?.category && features().has('rental'));
  const isAutoSales = () => features().has('auto_sales');
  const isRetail = () => String(merchant?.category || '').includes('零售') || String(merchant?.subcategory || '').includes('零售');

  async function load(){
    const slug = query.get('merchant');
    if(!slug){
      app.innerHTML = `${top('商家管理后台')}<div class="empty">缺少商家信息。</div>`;
      return;
    }
    if(!session()?.access_token){
      app.innerHTML = `${top('商家管理后台')}<div class="empty">请先登录商家主号或已授权的员工账号。</div>`;
      return;
    }
    try {
      const response = await api(`/rest/v1/merchants?slug=eq.${encodeURIComponent(slug)}&select=user_id,business_name,logo,address,category,subcategory,enabled_features,verified&limit=1`);
      const rows = response.ok ? await response.json() : [];
      merchant = rows[0];
      if(!merchant?.user_id) throw new Error('merchant_not_found');

      const id = encodeURIComponent(merchant.user_id);
      const requests = [
        count(`/rest/v1/merchant_memberships?merchant_user_id=eq.${id}&select=id`),
        count(`/rest/v1/posts?user_id=eq.${id}&select=id`),
        count(`/rest/v1/merchant_coupon_claims?merchant_user_id=eq.${id}&status=eq.claimed&select=id`)
      ];
      if(isRestaurant()){
        requests.unshift(count(`/rest/v1/merchant_orders?merchant_user_id=eq.${id}&status=not.in.(completed,cancelled)&select=id`));
      } else {
        requests.unshift(Promise.resolve(0));
      }
      if(isRetail()) requests.push(count(`/rest/v1/merchant_retail_orders?merchant_user_id=eq.${id}&status=not.in.(completed,cancelled)&select=id`));
      else requests.push(Promise.resolve(0));
      const [orders, members, posts, claims, retailOrders] = await Promise.all(requests);
      render({orders, members, posts, claims, retailOrders});
    } catch(error) {
      app.innerHTML = `${top('商家管理后台')}<div class="empty">暂时无法读取后台。请确认当前账号拥有该商家的管理权限。</div>`;
    }
  }

  function entry(icon, title, description, action, highlight = false){
    return `<button class="entry ${highlight ? 'highlight' : ''}" onclick="MerchantAdmin.go('${action}')"><i>${icon}</i><strong>${title}</strong><small>${description}</small><em>›</em></button>`;
  }

  function render(data){
    const restaurantEntries = isRestaurant()
      ? [
          entry('🧾', '点餐后台', '餐桌订单、后厨、上菜和收银', 'orders', data.orders > 0),
          entry('▤', '外卖订单', '外卖订单、取餐与配送状态', 'takeout'),
          entry('⌁', '扫码排队', '排队取号、预点菜和安排入座', 'queue')
        ].join('')
      : '';
    const rentalEntries = isRental()
      ? entry('▱', '租车管理', '车辆、预约、增值服务与保险服务', 'rental')
      : '';
    const autoEntries = isAutoSales()
      ? entry('▱', '二手车管理', '车辆库存、试驾预约与卖车估价线索', 'auto_sales')
      : '';
    const retailEntries = isRetail()
      ? entry('▣', '零售订单', '确认自取、安排时间和完成交付', 'retail', data.retailOrders > 0)
      : '';
    const businessEntries = restaurantEntries || rentalEntries || autoEntries || retailEntries
      ? `<div class="section-head"><b>行业功能</b><span>只显示适用于本店的功能</span></div><div class="grid">${restaurantEntries}${rentalEntries}${autoEntries}${retailEntries}</div>`
      : '';

    app.innerHTML = `${top('商家管理后台')}
      <section class="hero"><div class="eyebrow">乐生活商家</div><h1>${esc(merchant.business_name || '我的店铺')}</h1><p>${esc(merchant.address || '完成店铺资料后，顾客可以从地图和主页找到你。')}</p></section>
      <section class="stats">
        ${isRestaurant() ? `<div class="stat"><span>处理中订单</span><b>${data.orders}</b></div>` : ''}
        ${isRetail() ? `<div class="stat"><span>待处理零售订单</span><b>${data.retailOrders}</b></div>` : ''}
        <div class="stat"><span>会员人数</span><b>${data.members}</b></div>
        <div class="stat"><span>已发布内容</span><b>${data.posts}</b></div>
        <div class="stat"><span>待核销优惠券</span><b>${data.claims}</b></div>
      </section>
      <div class="section-head"><b>基础运营</b><span>开通商家即有</span></div>
      <div class="grid">
        ${entry('◉', '会员与优惠券', '会员、积分、奖励和核销', 'members', data.claims > 0)}
        ${entry('✦', '内容运营', 'AI 发文、动态和优惠发布', 'content')}
        ${entry('▣', '店铺与商品', '编辑店铺资料、商品与服务', 'store')}
        ${entry('♟', '团队权限', '店长、员工与矩阵账号', 'team')}
        ${entry('⚙', '功能中心', '查看和开通商家功能', 'features')}
        ${entry('⌂', '商家主页', '查看顾客看到的店铺页面', 'public')}
      </div>
      ${businessEntries}
      <div class="section-head"><b>快捷操作</b></div>
      <div class="row"><span><b>查看商家主页</b><small>确认顾客端展示是否完整</small></span><button onclick="MerchantAdmin.go('public')">打开</button></div>
      <div class="row"><span><b>刷新经营数据</b><small>重新读取店铺经营概览</small></span><button onclick="MerchantAdmin.reload()">刷新</button></div>`;
  }

  window.MerchantAdmin = { close, go, reload:load };
  load();
})();
