(() => {
  const routeInAppShell = (route, payload={}) => window.LeshenghuoModuleBridge?.route(route, payload) || false;
  const { esc, session, request } = window.LeshenghuoModuleRuntime;
  const dealsApi = window.LeshenghuoDealsApi?.create({
    supabaseUrl:'https://ptxdxepmggmjcndgukjk.supabase.co',
    request
  });
  const app = document.getElementById('dealsApp');
  const sheet = document.getElementById('dealSheet');
  const state = { rows: [], rankingRows: [], filter: 'today', loading: null };
  const cacheKey = 'leshenghuo_deals_module_cache_v1';
  const cacheTtl = 3 * 60 * 1000;
  const readCache = () => { try { const value=JSON.parse(localStorage.getItem(cacheKey)||'null'); return value?.rows ? value : null; } catch(e) { return null; } };
  const writeCache = () => { try { localStorage.setItem(cacheKey,JSON.stringify({at:Date.now(),rows:state.rows,rankingRows:state.rankingRows})); } catch(e) {} };
  const retailers = [
    ['today','今日最新'],['costco','Costco'],['samsclub',"Sam's Club"],['walmart','Walmart'],['target','Target'],['aldi','ALDI'],['99ranch','99大华'],['gw','GW超市'],['bestbuy','Best Buy'],['tjmaxx','TJ Maxx'],['macys',"Macy's"],['clearance','清仓']
  ];
  const translations = [['鸡胸肉','chicken breast'],['大米','rice'],['鸡蛋','eggs'],['牛奶','milk'],['鸡肉','chicken'],['牛肉','beef'],['猪肉','pork'],['海鲜','seafood'],['水果','fruit'],['蔬菜','vegetables'],['面粉','flour'],['食用油','cooking oil'],['纸巾','paper towels'],['洗衣液','laundry detergent'],['行李箱','luggage'],['耳机','headphones'],['电视','tv'],['电脑','laptop']];
  const money = value => Number(value || 0) > 0 ? `$${Number(value).toFixed(Number(value) % 1 ? 2 : 0)}` : '官网核对';
  const dateText = value => value ? new Date(value).toLocaleDateString('zh-CN',{month:'numeric',day:'numeric'}) : '今日';
  const sourceLabel = value => ({weekly_ad_page:'官方周广告',daily_deals_page:'官方限时优惠',product_page:'固定商品页',public_page:'公开页面',manual:'人工维护',user_report:'用户爆料',merchant_submit:'商家提交'}[value] || '每日缓存');
  const isLanding = row => ['weekly_ad_page','daily_deals_page'].includes(String(row.source_type || ''));
  const dealName = row => row.product_name_cn || row.product_name || '未命名优惠';
  const dealStore = row => row.retailer_name || row.retailer_key || '商家';
  const dealSource = row => String(row?.source_url || '').trim();
  const findRow = id => [...state.rows, ...state.rankingRows].find(item => String(item.id) === String(id));
  const favoriteKey = 'leshenghuo_deals_favorites';
  const favorites = () => { try { return JSON.parse(localStorage.getItem(favoriteKey) || '{}'); } catch(e) { return {}; } };
  const saveFavorites = value => localStorage.setItem(favoriteKey, JSON.stringify(value));
  const normalize = raw => {
    let value = String(raw || '').trim().toLowerCase();
    translations.forEach(([cn,en]) => { value = value.replaceAll(cn, ` ${en} `); });
    return value.replace(/\s+/g,' ').trim();
  };
  const filtered = () => {
    const keyword = String(document.getElementById('dealSearch')?.value || '').trim().toLowerCase();
    return state.rows.filter(row => {
      if(state.filter !== 'today' && String(row.retailer_key || '').toLowerCase() !== state.filter && !(state.filter === 'clearance' && /clearance|清仓/.test(`${row.category || ''} ${row.product_name || ''}`.toLowerCase()))) return false;
      if(!keyword) return true;
      const q = normalize(keyword);
      const text = `${row.product_name || ''} ${row.product_name_cn || ''} ${row.category || ''} ${row.retailer_name || ''} ${row.retailer_key || ''}`.toLowerCase();
      return keyword.split(/\s+/).some(word => text.includes(word)) || q.split(/\s+/).some(word => word.length > 1 && text.includes(word));
    }).sort((a,b) => Number(b.is_hot === true) - Number(a.is_hot === true) || Number(b.is_food_low_price === true) - Number(a.is_food_low_price === true) || Number(b.percent_off || 0) - Number(a.percent_off || 0) || new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
  };
  const openUrl = (url, id) => {
    if(!url) return toast('这条记录暂未提供来源链接');
    window.open(url, '_blank', 'noopener');
    if(id) record(id, 'click');
  };
  const record = async (id, type) => {
    try { await dealsApi.recordInteraction({deal_id:id,event_type:type,user_id:session()?.user?.id || null,session_key:localStorage.getItem('leshenghuo_deal_session_key') || `deal_${Date.now()}`}); } catch(e) {}
  };
  const toast = text => { document.querySelector('.toast')?.remove(); const node=document.createElement('div'); node.className='toast'; node.textContent=text; document.body.appendChild(node); setTimeout(()=>node.remove(),2200); };
  const closeSheet = () => { sheet.classList.remove('open'); sheet.innerHTML=''; };
  const openSheet = html => { sheet.innerHTML=html; sheet.classList.add('open'); };
  const top = () => `<header class="module-top"><button onclick="Deals.back()" aria-label="返回">‹</button><b>今日省钱</b><span class="module-top-actions"><button class="module-language" onclick="window.LeshenghuoI18n&&window.LeshenghuoI18n.openPicker()" aria-label="语言" title="语言">文</button><button onclick="Deals.refresh()" aria-label="刷新">↻</button></span></header>`;
  const cards = rows => rows.length ? rows.map((row,index) => {
    const liked = !!favorites()[row.id]; const landing=isLanding(row); const price=landing ? (row.source_type === 'weekly_ad_page' ? '本周优惠' : '限时优惠') : money(row.current_price);
    return `<article class="deal-card ${row.is_hot ? 'hot' : ''}"><div class="deal-card-head"><h3>${index + 1}. ${esc(dealName(row))}</h3>${row.is_hot ? '<span class="badge">热门</span>' : ''}</div><div class="deal-meta">${esc(dealStore(row))} · ${esc(row.location || '网购 / 门店')} · ${esc(sourceLabel(row.source_type))} · ${dateText(row.updated_at || row.deal_date)}</div><div class="price-row"><b>${esc(price)}</b>${Number(row.original_price || 0) > 0 ? `<del>${money(row.original_price)}</del>` : ''}${Number(row.percent_off || 0) > 0 ? `<span class="discount">省 ${Number(row.percent_off)}%</span>` : ''}</div><div class="deal-note">${esc(row.ai_summary_cn || row.price_note || '价格以官网最终页面和门店库存为准。')}</div><div class="deal-actions"><button onclick="Deals.favorite('${esc(row.id)}')">${liked ? '已收藏' : '收藏'}</button><button onclick="Deals.share('${esc(row.id)}')">分享</button><button class="primary" onclick="Deals.open('${esc(row.id)}')">官网核对</button></div></article>`;
  }).join('') : '<div class="empty">目前没有符合条件的优惠记录。可切换商家、清除关键词或稍后下拉刷新。</div>';
  const foodCards = rows => rows.length ? rows.slice(0,8).map(row => `<article class="food-card"><h3>${esc(dealName(row))}</h3><div class="price"><b>${money(row.current_price)}</b><span>${esc(row.unit || '')}</span></div><p>${esc(dealStore(row))} · ${esc(row.ai_summary_cn || row.price_note || '每日价格以官网最终显示为准')}</p><button onclick="Deals.open('${esc(row.id)}')">查看哪里买</button></article>`).join('') : '<div class="empty">暂未收录食品低价。</div>';
  const render = () => {
    const list=filtered(); const hot=list.filter(row=>row.is_hot).slice(0,6); const food=list.filter(row=>row.is_food_low_price);
    app.innerHTML=`${top()}<section class="deals-hero"><div class="deals-head"><div><h1>今日省钱</h1><p>超市、百货、电器与本地优惠集中看</p></div><div class="deals-refresh"><b>今日已刷新</b><span>缓存更新 ${new Date().toLocaleDateString('zh-CN')}</span></div></div><div class="retailer-tabs">${retailers.map(([key,label])=>`<button class="${state.filter===key?'active':''}" onclick="Deals.filter('${key}')">${label}</button>`).join('')}</div><div class="deal-search-row"><input id="dealSearch" type="search" inputmode="search" placeholder="搜索鸡蛋、牛奶、大米、耳机..." oninput="Deals.render()" onkeydown="if(event.key==='Enter')Deals.search()"><button onclick="Deals.search()">全网找</button></div><div class="action-row"><button class="primary" onclick="Deals.report('user_report')">用户爆料</button><button onclick="Deals.report('merchant_submit')">商家优惠</button><button onclick="Deals.rankings()">实时热榜</button></div></section><section class="section"><div class="section-title">今日爆款 <small>${hot.length || list.length} 条可核对</small></div><div class="hot-scroll">${(hot.length?hot:list.slice(0,6)).map(row=>`<article class="hot-card"><small>${esc(dealStore(row))}</small><h3>${esc(dealName(row))}</h3><div class="hot-price"><b>${isLanding(row)?(row.source_type==='weekly_ad_page'?'本周优惠':'限时优惠'):money(row.current_price)}</b><small>${Number(row.percent_off||0)?`省 ${Number(row.percent_off)}%`:esc(row.unit||'')}</small></div><button onclick="Deals.open('${esc(row.id)}')">去核对</button></article>`).join('') || '<div class="empty">暂无热门优惠</div>'}</div></section><section class="section"><div class="section-title">每日食品低价 <small>鸡蛋、牛奶、大米等</small></div><div class="food-grid">${foodCards(food)}</div></section><section class="section"><div class="section-title">今日降价 TOP 10 <small>共 ${list.length} 条</small></div><div class="deal-list">${cards(list.slice(0,10))}</div></section>`;
  };
  const load = async (force=false) => {
    const cached=readCache();
    if(cached?.rows?.length){ state.rows=cached.rows; state.rankingRows=cached.rankingRows||[]; render(); if(!force && Date.now()-Number(cached.at||0)<cacheTtl) return; }
    if(state.loading) return state.loading;
    if(!cached?.rows?.length) app.innerHTML=`${top()}<div class="module-loading">正在读取每日价格缓存...</div>`;
    state.loading=(async()=>{
    const select='id,deal_date,retailer_key,retailer_name,category,product_name,product_name_cn,original_price,current_price,unit,percent_off,save_amount,location,source_url,is_hot,is_food_low_price,stock_status,price_note,ai_summary_cn,source_type,review_status,display_status,updated_at,expires_at';
    try { const rows=await dealsApi.loadCurrentPrices({select,limit:120}); state.rows=rows.filter(row=>row.display_status!=='hidden'); writeCache(); render(); }
    catch(e) { console.warn('省钱模块加载失败:',e.message); if(state.rows.length) render(); else app.innerHTML=`${top()}<div class="empty">暂时无法读取优惠数据。请稍后刷新再试。</div>`; }
    })();
    try { return await state.loading; } finally { state.loading=null; }
  };
  const search = () => { const value=document.getElementById('dealSearch')?.value.trim(); if(!value) return toast('请输入商品或商家名称'); const rows=filtered(); openSheet(`<section class="sheet-card"><div class="sheet-head"><h2>站内统一搜索</h2><button onclick="Deals.closeSheet()">×</button></div><p class="sheet-note">结果只来自乐生活每日价格缓存，不实时抓取外部网站；价格以官网最终显示为准。</p><div class="deal-list">${cards(rows.slice(0,20))}</div></section>`); };
  const report = type => {
    const merchant=type==='merchant_submit';
    openSheet(`<section class="sheet-card"><div class="sheet-head"><h2>${merchant?'商家提交优惠':'用户爆料'}</h2><button onclick="Deals.closeSheet()">×</button></div><p class="sheet-note">提交后进入审核；审核通过才会展示到今日省钱。</p><div class="form-grid"><label class="form-field"><span>商家名称</span><input id="reportRetailer" placeholder="例如 Walmart / ALDI"></label><label class="form-field"><span>分类</span><select id="reportCategory"><option value="food">食品刚需</option><option value="household">日用品</option><option value="electronics">电器数码</option><option value="home">家居百货</option><option value="clearance">清仓折扣</option></select></label><label class="form-field full"><span>商品名称</span><input id="reportProduct" placeholder="例如 Great Value Long Grain Rice 20 lb"></label><label class="form-field"><span>中文名称</span><input id="reportProductCn" placeholder="例如 长粒米 20磅"></label><label class="form-field"><span>现价</span><input id="reportPrice" type="number" step="0.01" inputmode="decimal" placeholder="12.98"></label><label class="form-field"><span>原价（可选）</span><input id="reportOriginal" type="number" step="0.01" inputmode="decimal"></label><label class="form-field"><span>单位</span><input id="reportUnit" placeholder="20 lb / 12枚"></label><label class="form-field"><span>地区/门店</span><input id="reportLocation" placeholder="网购 / LA周边"></label><label class="form-field full"><span>来源链接</span><input id="reportUrl" type="url" placeholder="官网商品页或周广告链接"></label><label class="form-field full"><span>补充说明</span><textarea id="reportNote" placeholder="会员价、时效、库存或优惠码等"></textarea></label></div><div class="sheet-actions"><button onclick="Deals.closeSheet()">取消</button><button class="primary" onclick="Deals.submitReport('${type}')">提交审核</button></div></section>`);
  };
  const submitReport = async type => {
    const get=id=>document.getElementById(id)?.value.trim()||''; const retailer=get('reportRetailer'),product=get('reportProduct'),price=get('reportPrice'),url=get('reportUrl');
    if(!retailer||!product||!price||!url) return toast('请填写商家、商品、现价和来源链接');
    const active=session(); const payload={report_type:type,status:'pending',user_id:active?.user?.id||null,user_name:active?.user?.user_metadata?.display_name||active?.user?.email?.split('@')[0]||null,retailer_key:retailer.toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,30)||null,retailer_name:retailer,category:get('reportCategory')||'general',product_name:product,product_name_cn:get('reportProductCn')||null,original_price:get('reportOriginal')||null,current_price:price,unit:get('reportUnit')||null,location:get('reportLocation')||'网购 / 门店',source_url:url,price_note:get('reportNote')||'提交后待乐生活核对',submit_note:type==='merchant_submit'?'商家后台提交优惠':'用户爆料'};
    try { await dealsApi.createReport(payload); closeSheet(); toast('已提交，审核后展示'); } catch(e) { console.warn('提交优惠失败:',e.message); toast('提交失败，请稍后重试'); }
  };
  const rankings = async () => {
    openSheet('<section class="sheet-card"><div class="sheet-head"><h2>实时热榜</h2><button onclick="Deals.closeSheet()">×</button></div><div class="module-loading">正在读取热榜...</div></section>');
    try { const select='id,deal_date,retailer_key,retailer_name,category,product_name,product_name_cn,original_price,current_price,unit,percent_off,save_amount,location,source_url,is_hot,is_food_low_price,stock_status,price_note,ai_summary_cn,source_type,updated_at,hot_score'; const rows=await dealsApi.loadRankings({select,limit:20}); state.rankingRows=rows; openSheet(`<section class="sheet-card"><div class="sheet-head"><h2>实时热榜</h2><button onclick="Deals.closeSheet()">×</button></div><p class="sheet-note">按热门标记、食品低价和近期互动排序。</p><div class="deal-list">${cards(rows)}</div></section>`); } catch(e) { openSheet(`<section class="sheet-card"><div class="sheet-head"><h2>实时热榜</h2><button onclick="Deals.closeSheet()">×</button></div><div class="empty">热榜暂时不可用，请稍后再试。</div></section>`); }
  };
  window.Deals = { back:()=>window.LeshenghuoModuleBridge?.back('/') || (history.length>1?history.back():location.assign('/')),refresh:()=>load(true),render,filter:key=>{state.filter=key;render();},search,open:id=>{const row=findRow(id);if(row)openUrl(dealSource(row),id);},favorite:id=>{const all=favorites();all[id]=!all[id];saveFavorites(all);render();},share:async id=>{const row=findRow(id);if(!row)return;const text=`${dealName(row)}｜${dealStore(row)}｜${isLanding(row)?'官网优惠':money(row.current_price)}｜${dealSource(row)}`;try{if(navigator.share)await navigator.share({title:dealName(row),text,url:dealSource(row)});else await navigator.clipboard.writeText(text);record(id,'copy');toast('优惠信息已复制');}catch(e){}},report,submitReport,rankings,closeSheet };
  sheet.addEventListener('click',event=>{if(event.target===sheet)closeSheet();});
  load();
})();
