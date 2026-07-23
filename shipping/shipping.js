(() => {
  const runtime = window.LeshenghuoModuleRuntime;
  const app = document.getElementById('shippingApp');
  const state = { dashboard:null, tab:'home', scanner:null };
  const esc = runtime?.esc || (value => String(value ?? ''));
  const sessionUser = () => runtime?.session?.()?.user || null;
  const money = cents => `$${(Number(cents || 0) / 100).toFixed(2)}`;
  const dateText = value => value ? new Intl.DateTimeFormat('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'America/Los_Angeles'}).format(new Date(value)) : '';
  const stageText = stage => ({new:'新卖家',standard_1:'个人标准 1',standard_2:'个人标准 2',professional_1:'个人专业卖家 1',professional_2:'个人专业卖家 2',professional_3:'个人专业卖家 3',merchant:'认证商家'}[stage] || '新卖家');
  const statusText = status => ({draft:'面单草稿',label_created:'已录入面单',in_transit:'运输中',delivered:'已送达',dispute_window:'售后观察期',settled:'已结算',adjustment_due:'待补邮资',void:'已作废',failed:'失败'}[status] || status || '处理中');
  const statusClass = status => status === 'adjustment_due' || status === 'failed' ? 'danger' : ['draft','in_transit','dispute_window'].includes(status) ? 'warn' : '';
  const rpc = async (name, payload = {}) => {
    if(!sessionUser()?.id) throw new Error('请先登录后使用物流中心');
    const response = await runtime.request(`/rest/v1/rpc/${name}`, { method:'POST', body:JSON.stringify(payload) });
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (_) { data = text; }
    if(!response.ok) throw new Error(data?.message || data?.hint || text || '请求失败');
    return data;
  };
  const toast = text => {
    const old = document.getElementById('shippingToast'); old?.remove();
    const node = document.createElement('div'); node.id='shippingToast'; node.textContent=text;
    Object.assign(node.style,{position:'fixed',left:'50%',bottom:'92px',transform:'translateX(-50%)',zIndex:'80',maxWidth:'min(88vw,420px)',padding:'10px 14px',borderRadius:'12px',background:'#243327',color:'#fff',fontSize:'13px',boxShadow:'0 8px 22px rgba(0,0,0,.18)'});
    document.body.appendChild(node); setTimeout(()=>node.remove(),2600);
  };
  const back = () => {
    if(state.scanner){ stopScanner(); return; }
    if(state.tab !== 'home'){ state.tab='home'; render(); return; }
    if(window.LeshenghuoModuleBridge?.back('/')) return;
    location.assign('/');
  };
  const top = title => `<header class="top"><button class="back" onclick="Shipping.back()" aria-label="返回">‹</button><b>${esc(title)}</b><span class="top-actions"><button class="language" onclick="window.LeshenghuoI18n?.openPicker()" aria-label="语言">文</button><button class="refresh" onclick="Shipping.refresh()" aria-label="刷新">↻</button></span></header>`;
  const nav = () => `<nav class="module-bottom-nav"><a href="/" data-route="home"><span>⌂</span>首页</a><a href="/week/" data-route="week"><span>▣</span>本周</a><a href="/deals/" data-route="deals"><span>▤</span>省钱</a><a href="/messages/" data-route="message"><span>□</span>消息</a><a href="/" data-route="profile" class="on"><span>♙</span>我</a></nav>`;
  const shell = content => `${top(state.tab === 'home' ? '物流中心' : state.tab === 'platform' ? '乐生活面单' : state.tab === 'self' ? '录入自购面单' : '扫码录入')}${content}${nav()}`;
  const renderHome = () => {
    const d = state.dashboard, p=d?.profile || {}, u=d?.usage || {};
    const restriction = d?.restriction_reason;
    const labels = Array.isArray(d?.labels) ? d.labels.slice(0,4) : [];
    const scans = Array.isArray(d?.scans) ? d.scans.slice(0,4) : [];
    app.innerHTML = shell(`<section class="hero"><small>乐生活发货服务</small><h1>${esc(stageText(p.seller_stage))}</h1><p>平台面单额度只计算乐生活购买的面单；自购面单与线下交易可正常录入，不占平台额度。</p></section><div class="pad">${restriction ? `<div class="notice ${p.pending_postage_cents > 0 ? 'danger' : ''}">${esc(restriction)}</div>` : `<div class="notice">承运商会按实际重量、尺寸和服务重新计费，可能补费、延迟、拒收或退回。乐生活仅提供估算与记录，不核算最终承运商费用。</div>`}<div class="stats"><div class="stat"><small>本月乐生活面单</small><b>${Number(u.month_count || 0)} / ${Number(p.monthly_platform_label_limit || 0)}</b><strong>今日 ${Number(u.day_count || 0)} / ${Number(p.daily_platform_label_limit || 0)}</strong></div><div class="stat"><small>已完成无异常订单</small><b>${Number(p.clean_order_count || 0)}</b><strong>${esc(stageText(p.seller_stage))}</strong></div><div class="stat"><small>邮资风险准备金</small><b>${money(p.shipping_reserve_cents)}</b><strong>${p.pending_postage_cents > 0 ? `待补 ${money(p.pending_postage_cents)}` : '当前无待补邮资'}</strong></div></div></div><section class="section"><h2>发货操作</h2><div class="entry-grid"><button class="entry primary" onclick="Shipping.open('platform')"><i>▤</i><b>创建乐生活面单草稿</b><small>先做额度与包裹预检，承运商面单接入后可直接购买。</small></button><button class="entry" onclick="Shipping.open('self')"><i>⌁</i><b>录入自购面单</b><small>扫描或填写可追踪运单号，不占平台面单额度。</small></button><button class="entry" onclick="Shipping.open('product')"><i>▥</i><b>扫描商品包装码</b><small>扫码记录 UPC、EAN 或商品条码，便于后续发货核对。</small></button><button class="entry" onclick="Shipping.open('tracking')"><i>▦</i><b>扫描物流运单</b><small>用相机扫描自己的物流面单号，再补充承运商信息。</small></button></div></section><section class="section"><h2>最近发货记录 <small>仅自己可见</small></h2><div class="list">${labels.length ? labels.map(row=>`<article class="record"><div class="record-row"><b>${esc(row.tracking_number || row.external_order_ref || '乐生活面单草稿')}</b><span class="status ${statusClass(row.status)}">${esc(statusText(row.status))}</span></div><small>${row.label_source === 'self' ? '自购面单' : '乐生活面单'}${row.carrier ? ` · ${esc(row.carrier)}` : ''}${row.estimated_postage_cents ? ` · 预估 ${money(row.estimated_postage_cents)}` : ''}<br>${esc(dateText(row.created_at))}</small></article>`).join('') : '<div class="empty-mini">还没有发货记录。</div>'}</div></section><section class="section"><h2>最近扫码记录</h2><div class="list">${scans.length ? scans.map(row=>`<article class="record"><div class="record-row"><b>${esc(row.barcode_value)}</b><span class="status">${row.scan_kind === 'product' ? '商品包装码' : '物流运单'}</span></div><small>${esc(row.product_name || row.barcode_format || '已录入') } · ${esc(dateText(row.created_at))}</small></article>`).join('') : '<div class="empty-mini">还没有扫码记录。</div>'}</div></section>`);
  };
  const renderPlatform = () => {
    const p=state.dashboard?.profile || {}, can=state.dashboard?.can_create_platform_label;
    app.innerHTML=shell(`<section class="hero"><small>额度与风险预检</small><h1>乐生活面单</h1><p>此页仅创建发货草稿，不会扣款或生成承运商面单。接入 Shippo 或 EasyPost 后，确认报价才会购买面单。</p></section><section class="section"><div class="form"><div class="field"><label>订单编号（选填）</label><input id="platformOrderRef" maxlength="80" placeholder="例如：SCOOP-20260722-001"></div><div class="split"><div class="field"><label>商品金额（美元）</label><input id="platformItemValue" inputmode="decimal" placeholder="0.00"></div><div class="field"><label>预估邮资（美元）</label><input id="platformEstimate" inputmode="decimal" placeholder="0.00"></div></div><div class="split"><div class="field"><label>重量（oz）</label><input id="platformWeight" inputmode="decimal" placeholder="例如：18"></div><div class="field"><label>尺寸（长×宽×高 in）</label><input id="platformSize" placeholder="例如：12×9×4"></div></div><div class="field"><label>发货备注（选填）</label><textarea id="platformNote" maxlength="500" placeholder="商品类型、易碎提示或其他发货说明"></textarea></div><div class="notice">${can ? '当前额度可创建草稿。首单卖家创建后，需要订单完成且无争议，才能使用下一张乐生活面单。' : esc(state.dashboard?.restriction_reason || '当前不能创建乐生活面单草稿。')}</div><div class="actions"><button onclick="Shipping.back()">取消</button><button class="primary" ${can ? '' : 'disabled'} onclick="Shipping.createPlatformDraft()">创建草稿</button></div></div></section>`);
  };
  const renderSelf = () => {
    app.innerHTML=shell(`<section class="hero"><small>自购面单 / 商家自有物流</small><h1>录入物流运单</h1><p>录入后可保存在物流中心。请使用承运商真实、可追踪的运单号。</p></section><section class="section"><div class="form"><div class="field"><label>运单号码</label><div class="split" style="grid-template-columns:1fr auto"><input id="selfTracking" maxlength="160" placeholder="扫描或输入运单号"><button onclick="Shipping.scanToField('tracking','selfTracking')">扫码</button></div></div><div class="field"><label>承运商</label><select id="selfCarrier"><option value="">请选择（可选）</option><option>USPS</option><option>UPS</option><option>FedEx</option><option>DHL</option><option>其他</option></select></div><div class="field"><label>订单编号（选填）</label><input id="selfOrderRef" maxlength="80" placeholder="例如：SCOOP-20260722-001"></div><div class="field"><label>备注（选填）</label><textarea id="selfNote" maxlength="500" placeholder="例如：已由商家自有物流系统购买"></textarea></div><div class="actions"><button onclick="Shipping.back()">取消</button><button class="primary" onclick="Shipping.saveSelfTracking()">保存运单</button></div></div></section>`);
  };
  const renderScan = kind => {
    const isProduct=kind==='product'; state.tab=kind;
    app.innerHTML=shell(`<section class="hero"><small>相机或手动输入</small><h1>${isProduct?'扫描商品包装条码':'扫描物流运单'}</h1><p>${isProduct?'商品包装条码会保存到自己的物流记录中，可用于后续包裹核对。':'扫描到运单后，可直接保存为自购面单或只先记录号码。'}</p></section><section class="section"><div class="form"><div class="field"><label>${isProduct?'商品条码':'号码'}</label><div class="split" style="grid-template-columns:1fr auto"><input id="scanValue" maxlength="160" placeholder="点击右侧扫码，或手动输入"><button onclick="Shipping.scanToField('${kind}','scanValue')">扫码</button></div></div>${isProduct?'<div class="field"><label>商品名称（选填）</label><input id="scanProductName" maxlength="120" placeholder="例如：无线耳机"></div>':'<div class="field"><label>承运商（选填）</label><select id="scanCarrier"><option value="">请选择</option><option>USPS</option><option>UPS</option><option>FedEx</option><option>DHL</option><option>其他</option></select></div>'}<div class="notice">相机权限只会在点击“扫码”后申请。无法使用相机时，可以直接手动输入编号。</div><div class="actions"><button onclick="Shipping.back()">取消</button><button class="primary" onclick="Shipping.saveScan('${kind}')">保存记录</button></div></div></section>`);
  };
  const render = () => { if(state.tab==='home') renderHome(); else if(state.tab==='platform') renderPlatform(); else if(state.tab==='self') renderSelf(); else renderScan(state.tab); window.LeshenghuoI18n?.apply?.(); };
  const refresh = async () => {
    if(!sessionUser()?.id){ app.innerHTML=shell('<div class="empty">请先登录后使用物流中心。</div>'); return; }
    try { state.dashboard=await rpc('shipping_seller_dashboard'); render(); }
    catch(error){ app.innerHTML=shell(`<div class="empty">物流中心暂时无法读取。<br><small>${esc(error.message || '')}</small><br><br><button onclick="Shipping.refresh()">重新尝试</button></div>`); }
  };
  const open = tab => { state.tab=tab; render(); };
  const dollarToCents = id => Math.round(Math.max(0,Number(document.getElementById(id)?.value || 0))*100);
  const createPlatformDraft = async () => {
    try { const row=await rpc('shipping_create_label_draft',{p_order_ref:document.getElementById('platformOrderRef')?.value || null,p_item_value_cents:dollarToCents('platformItemValue'),p_estimated_postage_cents:dollarToCents('platformEstimate'),p_parcel:{weight_oz:Number(document.getElementById('platformWeight')?.value || 0),dimensions:String(document.getElementById('platformSize')?.value || '').trim()},p_note:document.getElementById('platformNote')?.value || null}); toast(`已创建发货草稿 ${String(row.id).slice(0,8)}`); state.tab='home'; await refresh(); }
    catch(error){ const map={monthly_label_limit:'本月乐生活面单额度已用完。',daily_label_limit:'今日乐生活面单额度已用完。',first_order_not_completed:'首单尚未完成，暂时不能创建下一张面单。',postage_balance_due:'请先补足待结算邮资。',item_value_limit:'商品金额超过当前卖家额度。'}; toast(map[error.message] || '创建失败，请检查额度与填写内容。'); }
  };
  const saveSelfTracking = async () => { try { await rpc('shipping_record_self_tracking',{p_order_ref:document.getElementById('selfOrderRef')?.value || null,p_tracking_number:document.getElementById('selfTracking')?.value || '',p_carrier:document.getElementById('selfCarrier')?.value || null,p_note:document.getElementById('selfNote')?.value || null}); toast('运单已录入'); state.tab='home'; await refresh(); } catch(error){ toast(error.message === 'tracking_number_required' ? '请填写至少 5 位的运单号码。' : '保存失败，请检查运单号码。'); } };
  const saveScan = async kind => { const value=document.getElementById('scanValue')?.value || ''; try { await rpc('shipping_record_barcode_scan',{p_scan_kind:kind,p_barcode_value:value,p_barcode_format:'manual_or_camera',p_product_name:document.getElementById('scanProductName')?.value || null}); toast('扫码记录已保存'); state.tab='home'; await refresh(); } catch(error){ toast(error.message === 'barcode_required' ? '请填写至少 3 位的编号。' : '保存失败，请检查编号。'); } };
  const stopScanner = () => { const s=state.scanner; if(!s) return; clearInterval(s.timer); s.stream?.getTracks?.().forEach(track=>track.stop()); s.node?.remove(); state.scanner=null; };
  const scanToField = async (kind, inputId) => {
    if(!('BarcodeDetector' in window) || !navigator.mediaDevices?.getUserMedia){ toast('此设备暂不支持网页扫码，请手动输入号码。'); return; }
    try { const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false}); const node=document.createElement('section'); node.className='scanner'; node.innerHTML='<header><b>对准条码或运单号</b><button aria-label="关闭">×</button></header><video autoplay muted playsinline></video><p>识别成功后会自动填入。请保持条码清晰、避免反光。</p>'; document.body.appendChild(node); const video=node.querySelector('video'); video.srcObject=stream; const detector=new BarcodeDetector(); const finish=async result=>{ document.getElementById(inputId).value=result.rawValue; stopScanner(); toast('已识别并填入'); }; const timer=setInterval(async()=>{ try { const rows=await detector.detect(video); if(rows?.[0]?.rawValue) finish(rows[0]); } catch(_){} },450); state.scanner={node,stream,timer}; node.querySelector('button').onclick=stopScanner; }
    catch(error){ console.warn('barcode camera',error); toast('无法打开相机，请在系统设置中允许相机权限，或手动输入。'); }
  };
  window.Shipping={back,refresh,open,createPlatformDraft,saveSelfTracking,saveScan,scanToField};
  document.addEventListener('click', event=>{ const link=event.target.closest?.('.module-bottom-nav a'); if(!link || window.parent===window) return; event.preventDefault(); window.LeshenghuoModuleBridge?.route(window.LeshenghuoModuleBridge.routeFromPath(link.href)); });
  refresh();
})();
