(() => {
  const URL='https://ptxdxepmggmjcndgukjk.supabase.co',KEY='sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-',app=document.getElementById('merchantManageApp'),q=new URLSearchParams(location.search);let merchant=null;
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const session=()=>{try{return JSON.parse(localStorage.getItem('wanba_session')||'null')}catch{return null}};
  const api=(path,opts={})=>{const s=session();return fetch(URL+path,{...opts,headers:{apikey:KEY,Authorization:`Bearer ${s?.access_token||KEY}`,'Content-Type':'application/json',...(opts.headers||{})}})};
  const close=()=>history.length>1?history.back():location.assign('/');
  const top=t=>`<header class="top"><button onclick="MerchantAdmin.close()">‹</button><b>${esc(t)}</b><button onclick="MerchantAdmin.close()">×</button></header>`;
  const go=action=>{if(!merchant)return;location.assign(`/?merchant_admin=${encodeURIComponent(action)}&merchant_id=${encodeURIComponent(merchant.user_id)}&from=merchant_manage`)};
  async function count(path){try{const r=await api(path);return r.ok?(await r.json()).length:0}catch{return 0}}
  async function load(){
    const slug=q.get('merchant');if(!slug){app.innerHTML=`${top('商家管理后台')}<div class="empty">缺少商家信息。</div>`;return}
    if(!session()?.access_token){app.innerHTML=`${top('商家管理后台')}<div class="empty">请先登录商家主号或已授权的员工账号。</div>`;return}
    try{
      const r=await api(`/rest/v1/merchants?slug=eq.${encodeURIComponent(slug)}&select=user_id,business_name,logo,address,enabled_features,verified&limit=1`);merchant=(await r.json())[0];if(!r.ok||!merchant?.user_id)throw new Error('merchant');
      const id=encodeURIComponent(merchant.user_id);const [orders,members,posts,claims]=await Promise.all([
        count(`/rest/v1/merchant_orders?merchant_user_id=eq.${id}&status=not.in.(completed,cancelled)&select=id`),
        count(`/rest/v1/merchant_memberships?merchant_user_id=eq.${id}&select=id`),
        count(`/rest/v1/posts?user_id=eq.${id}&select=id`),
        count(`/rest/v1/merchant_coupon_claims?merchant_user_id=eq.${id}&status=eq.claimed&select=id`)
      ]);render({orders,members,posts,claims});
    }catch(e){app.innerHTML=`${top('商家管理后台')}<div class="empty">暂时无法读取后台。请确认当前账号拥有该商家的管理权限。</div>`}
  }
  function entry(icon,title,text,action,hot=false){return `<button class="entry ${hot?'highlight':''}" onclick="MerchantAdmin.go('${action}')"><i>${icon}</i><strong>${title}</strong><small>${text}</small><em>›</em></button>`}
  function render(data){
    app.innerHTML=`${top('商家管理后台')}<section class="hero"><div class="eyebrow">乐生活商家</div><h1>${esc(merchant.business_name||'我的店铺')}</h1><p>${esc(merchant.address||'完成店铺资料后，顾客可以从地图和主页找到你。')}</p></section><section class="stats"><div class="stat"><span>处理中订单</span><b>${data.orders}</b></div><div class="stat"><span>会员人数</span><b>${data.members}</b></div><div class="stat"><span>已发布内容</span><b>${data.posts}</b></div><div class="stat"><span>待核销优惠券</span><b>${data.claims}</b></div></section><div class="section-head"><b>经营入口</b><span>已有功能集中管理</span></div><div class="grid">${entry('🧾','点餐后台','订单、后厨、上菜和收银','orders',data.orders>0)}${entry('◉','会员与优惠券','会员、积分、奖励和核销','members',data.claims>0)}${entry('✦','内容运营','AI 发文、动态和优惠发布','content')}${entry('▣','店铺与商品','编辑店铺资料、商品与服务','store')}${entry('♟','团队权限','店长、员工与矩阵账号','team')}${entry('⚙','功能中心','查看和开通商家功能','features')}</div><div class="section-head"><b>业务模块</b><span>按已开通功能显示</span></div><div class="grid">${entry('▤','外卖与排队','外卖订单、桌位二维码与排队','takeout')}${entry('▱','租车管理','车辆、附加服务、保险服务','rental')}${entry('⌁','商家主页','查看顾客看到的店铺页面','public')}</div><div class="tip">第一版先统一后台入口和实时概览。租车运营的收款、押金、损坏/违章、改期与金额统计，会在第二版单独接入。</div><div class="section-head"><b>快捷操作</b></div><div class="row"><span><b>查看商家主页</b><small>确认顾客端展示是否完整</small></span><button onclick="MerchantAdmin.go('public')">打开</button></div><div class="row"><span><b>刷新经营数据</b><small>重新读取订单、会员和优惠券统计</small></span><button onclick="MerchantAdmin.reload()">刷新</button></div>`;
  }
  window.MerchantAdmin={close,go,reload:load};load();
})();
