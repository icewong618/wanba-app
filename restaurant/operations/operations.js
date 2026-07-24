(() => {
  const SUPABASE_URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
  const app = document.getElementById('restaurantOperationsApp');
  const query = new URLSearchParams(location.search);
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const session = () => { try { return JSON.parse(localStorage.getItem('wanba_session') || 'null'); } catch(error) { return null; } };
  const api = (path, options = {}) => {
    const current = session();
    return fetch(SUPABASE_URL + path, { ...options, headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${current?.access_token || SUPABASE_KEY}`, 'Content-Type':'application/json', ...(options.headers || {}) } });
  };
  let merchant = null;
  let snapshot = { permissions:{}, orders:[] };
  let currentFilter = query.get('view') === 'takeout' ? 'takeout' : 'all';
  let reloadTimer = null;
  const close = () => window.LeshenghuoModuleBridge.back(`/restaurant/manage/?merchant=${encodeURIComponent(query.get('merchant') || '')}`);
  const top = () => `<header class="top"><button onclick="RestaurantOperations.close()">‹</button><b>订单工作台</b><button onclick="RestaurantOperations.reload()">↻</button></header>`;
  const toast = message => { document.querySelector('.toast')?.remove(); const node=document.createElement('div'); node.className='toast'; node.textContent=message; document.body.append(node); setTimeout(()=>node.remove(),2600); };
  const friendlyTime = value => { try { return new Intl.DateTimeFormat('zh-CN',{hour:'2-digit',minute:'2-digit'}).format(new Date(value)); } catch(error) { return ''; } };
  const orderLabel = order => order.order_type === 'takeout' ? (order.fulfillment === 'delivery' ? '配送外卖' : '到店自提') : (order.table_name || '堂食订单');
  const filterOrders = () => (snapshot.orders || []).filter(order => currentFilter === 'all' || (currentFilter === 'takeout' ? order.order_type === 'takeout' : order.order_type !== 'takeout'));
  const permissionNotice = () => {
    const p=snapshot.permissions || {};
    const parts=[];
    if(p.kitchen) parts.push('后厨制作'); if(p.serve) parts.push('传菜上桌'); if(p.cashier) parts.push('收银查看');
    return parts.length ? `当前权限：${parts.join('、')}` : '当前账号仅可查看订单。';
  };
  const actionFor = item => {
    const p=snapshot.permissions || {};
    if(item.is_served) return `<span class="stage served">已上菜</span>${p.serve ? `<button class="action undo" onclick="RestaurantOperations.serve(${item.id},false)">撤回</button>` : ''}`;
    if(item.kitchen_done) return `<span class="stage done">待上菜</span>${p.serve ? `<button class="action" onclick="RestaurantOperations.serve(${item.id},true)">上菜</button>` : ''}${p.kitchen ? `<button class="action undo" onclick="RestaurantOperations.kitchen(${item.id},false)">撤销</button>` : ''}`;
    return `<span class="stage red">待制作</span>${p.kitchen ? `<button class="action" onclick="RestaurantOperations.kitchen(${item.id},true)">完成制作</button>` : ''}${p.serve ? `<button class="action" onclick="RestaurantOperations.serve(${item.id},true)">上菜</button>` : ''}`;
  };
  const orderHtml = order => `<article class="order"><div class="order-head"><div><div class="order-title"><b>${esc(orderLabel(order))}</b><span class="badge ${order.order_type === 'takeout' ? 'takeout' : ''}">${order.order_type === 'takeout' ? '外卖' : '堂食'}</span></div><small>${esc(order.order_code || '')} · ${esc(order.customer_name || '扫码顾客')}</small></div><div class="order-meta"><strong>$${Number(order.subtotal || 0).toFixed(2)}</strong><span>${friendlyTime(order.updated_at || order.created_at)} · ${Number(order.item_count || 0)} 件</span></div></div>${order.note ? `<p class="note">备注：${esc(order.note)}</p>` : ''}<div class="items">${(order.items || []).map(item => `<div class="item"><div><b>${esc(item.product_name)} × ${Number(item.quantity || 0)}</b><small>${esc(item.price_label || '')}${Number(item.batch_no || 1) > 1 ? ` · 加菜第 ${Number(item.batch_no)} 批` : ''}</small></div><div class="item-actions">${actionFor(item)}</div></div>`).join('')}</div><div class="cashier"><span><b>${order.payment_status === 'paid' ? '已记录付款' : '待付款结算'}</b>真实支付接入后在这里完成收款与账单。</span><button onclick="RestaurantOperations.cashier()">收银说明</button></div></article>`;
  function render(){
    const orders=filterOrders();
    const all=snapshot.orders || [];
    const kitchen=all.reduce((sum, order)=>sum+(order.items||[]).filter(item=>!item.kitchen_done).length,0);
    const serve=all.reduce((sum, order)=>sum+(order.items||[]).filter(item=>item.kitchen_done&&!item.is_served).length,0);
    app.innerHTML = `${top()}<section class="hero"><h1>${esc(merchant?.business_name || '餐饮订单')}</h1><p>${permissionNotice()}。订单会每 3 分钟自动刷新，也可随时手动刷新。</p></section><div class="chips"><button class="chip ${currentFilter==='all'?'active':''}" onclick="RestaurantOperations.filter('all')">全部 ${all.length}</button><button class="chip ${currentFilter==='dinein'?'active':''}" onclick="RestaurantOperations.filter('dinein')">堂食 ${all.filter(order=>order.order_type!=='takeout').length}</button><button class="chip ${currentFilter==='takeout'?'active':''}" onclick="RestaurantOperations.filter('takeout')">外卖 ${all.filter(order=>order.order_type==='takeout').length}</button></div><section class="summary"><div><span>处理中订单</span><b>${all.length}</b></div><div><span>待制作菜品</span><b>${kitchen}</b></div><div><span>待上菜菜品</span><b>${serve}</b></div><div><span>待收银订单</span><b>${all.filter(order=>order.payment_status!=='paid').length}</b></div></section><p class="notice">${snapshot.permissions?.cashier ? '收银权限已开通。正式支付尚未接入，因此本页不会直接扣款或核销优惠券。' : '收银、优惠券核销和完成订单需由具备收银权限的账号操作。'}</p><section class="orders">${orders.length ? orders.map(orderHtml).join('') : '<div class="empty">当前没有待处理订单。</div>'}</section>`;
  }
  async function load(){
    const slug=query.get('merchant');
    if(!slug){ app.innerHTML=`${top()}<div class="empty">缺少商家信息。</div>`; return; }
    if(!session()?.access_token){ app.innerHTML=`${top()}<div class="empty">请使用商家主号或已授权员工账号登录。</div>`; return; }
    try{
      const merchantResponse=await api(`/rest/v1/merchants?slug=eq.${encodeURIComponent(slug)}&select=user_id,business_name&limit=1`);
      const merchants=merchantResponse.ok ? await merchantResponse.json() : [];
      merchant=merchants[0];
      if(!merchant?.user_id) throw new Error('merchant_not_found');
      const response=await api('/rest/v1/rpc/merchant_restaurant_operations_snapshot',{method:'POST',body:JSON.stringify({p_merchant_user_id:merchant.user_id,p_order_type:'all'})});
      if(!response.ok) throw new Error(await response.text());
      snapshot=await response.json();
      render();
    }catch(error){ app.innerHTML=`${top()}<div class="empty">暂时无法读取订单工作台。请确认已运行 v5.417 数据库脚本，并使用已授权的餐饮商家账号登录。</div>`; }
  }
  async function updateItem(functionName, payload){
    const response=await api(`/rest/v1/rpc/${functionName}`,{method:'POST',body:JSON.stringify(payload)});
    if(!response.ok){ const text=await response.text(); if(text.includes('not_kitchen_staff')) throw new Error('你没有后厨制作权限。'); if(text.includes('not_runner_staff')) throw new Error('你没有上菜权限。'); if(text.includes('kitchen_not_done')) throw new Error('请等待后厨完成制作后再上菜。'); throw new Error('操作没有成功，请稍后重试。'); }
  }
  async function kitchen(itemId, done){ try { await updateItem('merchant_order_set_item_kitchen_done',{p_item_id:itemId,p_done:done}); toast(done?'已标记为制作完成。':'已撤销制作完成。'); await load(); } catch(error) { toast(error.message); } }
  async function serve(itemId, served){ try { await updateItem('merchant_order_set_item_served',{p_item_id:itemId,p_is_served:served}); toast(served?'已标记上菜。':'已撤回上菜状态。'); await load(); } catch(error) { toast(error.message); } }
  function setFilter(filter){ currentFilter=filter; render(); }
  window.RestaurantOperations={close,reload:load,kitchen,serve,filter:setFilter,cashier:()=>toast('真实支付与账单将在支付正式接入后开放。')};
  load();
  reloadTimer=setInterval(load,180000);
  window.addEventListener('pagehide',()=>clearInterval(reloadTimer),{once:true});
})();
