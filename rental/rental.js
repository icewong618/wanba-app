(() => {
  const SUPABASE_URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
  const app = document.getElementById('rentalApp');
  const query = new URLSearchParams(location.search);
  const state = { merchant:null, vehicles:[], bookings:[], selected:null, booking:null, quote:null, screen:'list', startsAt:'', endsAt:'', name:'', phone:'', email:'', note:'', selectedAddons:[], paymentMethod:'apple_pay', editingBookingId:'', error:'', filters:{seats:'',fuel:'',type:''} };
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const money = value => `$${Number(value || 0).toFixed(2)}`;
  const user = () => JSON.parse(localStorage.getItem('wanba_session') || 'null')?.user || null;
  const api = async (path, options={}) => { const session=JSON.parse(localStorage.getItem('wanba_session') || 'null'); const headers=Object.assign({apikey:SUPABASE_KEY,'Content-Type':'application/json'},options.headers||{}); headers.Authorization=`Bearer ${session?.access_token||SUPABASE_KEY}`; return fetch(`${SUPABASE_URL}${path}`,Object.assign({},options,{headers})); };
  const close = () => { if(window.parent!==window) window.parent.postMessage({type:'leshenghuo-close-rental'},'*'); else if(history.length>1) history.back(); else location.assign('/'); };
  const top = title => `<header class="top"><button onclick="Rental.back()" aria-label="返回">‹</button><b>${esc(title)}</b><button class="close" onclick="Rental.close()" aria-label="关闭">×</button></header>`;
  const toLocalInput = value => { const date=value?new Date(value):new Date(Date.now()+3600000); date.setMinutes(date.getMinutes()-date.getTimezoneOffset()); return date.toISOString().slice(0,16); };
  const displayDate = value => value ? new Intl.DateTimeFormat('zh-CN',{month:'numeric',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'America/Los_Angeles'}).format(new Date(value)) : '';
  const rate = vehicle => vehicle.pricing_mode === 'hour' ? `${money(vehicle.hourly_rate)}/小时` : vehicle.pricing_mode === 'both' ? `${money(vehicle.daily_rate)}/天 · ${money(vehicle.hourly_rate)}/小时` : `${money(vehicle.daily_rate)}/天`;
  const photo = vehicle => Array.isArray(vehicle.photos)&&vehicle.photos[0] ? `<img src="${esc(vehicle.photos[0])}" alt="">` : '<div class="placeholder">🚗</div>';
  const fuel = value => ({'纯电':'电动','电动':'电动','柴油':'柴油','混动':'混动','汽油':'汽油'}[String(value||'')] || '汽油');
  const addons = () => Array.isArray(state.selected?.addons) ? state.selected.addons.filter(item => item.service_type !== 'fixed') : [];
  const requiredServices = () => Array.isArray(state.selected?.addons) ? state.selected.addons.filter(item => item.service_type === 'fixed') : [];
  const selectedAddonRows = () => addons().filter(item => state.selectedAddons.includes(String(item.id)));
  const bookingStatus = value => ({ pending:'等待商家确认', confirmed:'已确认', active:'租用中', overdue:'逾期未还', returned:'已完成', cancelled:'已取消', rejected:'未获确认' }[String(value || '')] || '等待商家确认');
  const canChangeBooking = booking => ['pending','confirmed'].includes(String(booking?.status || '')) && new Date(booking?.starts_at || 0).getTime() > Date.now();
  const formTimes = () => { const start=document.getElementById('rentalStart')?.value, end=document.getElementById('rentalEnd')?.value; if(start) state.startsAt=new Date(start).toISOString(); if(end) state.endsAt=new Date(end).toISOString(); };
  const address = () => state.selected?.pickup_address || state.merchant?.address || '由商家确认取还车地点';
  const map = () => `<div class="rental-map"><span>取还车地点</span><b>${esc(address())}</b><i>●</i></div>`;
  const specIcon = type => ({
    person:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"></circle><path d="M5.5 20c.7-4 2.8-6 6.5-6s5.8 2 6.5 6"></path></svg>',
    luggage:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="14" rx="2"></rect><path d="M9 6V4h6v2M9 10h6M9 20v1M15 20v1"></path></svg>',
    wheel:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="2"></circle><path d="M12 4v6M4.8 14l5.3-1.2M19.2 14l-5.3-1.2"></path></svg>',
    fuel:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"></path><path d="M5 12h8M15 7h2l2 2v7a2 2 0 0 1-4 0v-3"></path></svg>',
    battery:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="15" height="10" rx="2"></rect><path d="M20 10v4M10 5l-2 6h4l-2 8 6-8h-4l2-6"></path></svg>'
  }[type] || '');
  const infoIcon = (icon,label,value) => `<div class="spec"><span>${specIcon(icon)}</span><b>${esc(value)}</b><small>${esc(label)}</small></div>`;
  const summary = () => state.quote ? (() => { const rows=Array.isArray(state.quote.addons)?state.quote.addons:[]; return `<section class="price-card"><div><span>车辆租金</span><b>${money(state.quote.base_amount)}</b></div>${rows.map(item=>`<div><span>${esc(item.name || (item.required ? '税费或服务费' : '可选服务'))}</span><b>${money(item.amount)}</b></div>`).join('')}<div><span>押金（取车时处理）</span><b>${money(state.quote.deposit_amount)}</b></div><div class="total"><span>预估总额</span><b>${money(state.quote.total_amount)}</b></div></section>`; })() : '';
  function renderList(){
    const start=state.startsAt?toLocalInput(state.startsAt):toLocalInput(); const end=state.endsAt?toLocalInput(state.endsAt):toLocalInput(new Date(Date.now()+25*3600000));
    app.innerHTML=`${top('租车预约')}<section class="rental-hero"><div class="rental-hero-row"><div><h1>${esc(state.merchant?.business_name||'乐生活租车')}</h1><p>${esc(state.merchant?.address||'请选择取还时间后查看可预约车辆')}</p></div>${user()?'<button onclick="Rental.bookings()">我的预约</button>':''}</div></section><section class="time-filter"><label>取车时间<input id="rentalStart" type="datetime-local" value="${esc(start)}" min="${toLocalInput()}"></label><label>还车时间<input id="rentalEnd" type="datetime-local" value="${esc(end)}" min="${toLocalInput(new Date(Date.now()+3600000))}"></label><button onclick="Rental.refreshList()">查询车辆</button></section><div class="vehicle-list">${state.vehicles.length?state.vehicles.map(vehicle=>`<article class="vehicle">${photo(vehicle)}<div class="vehicle-main"><div class="vehicle-head"><div><h2>${esc(vehicle.name)}</h2><p>${esc([vehicle.year,vehicle.make,vehicle.model].filter(Boolean).join(' '))}</p></div><b>${rate(vehicle)}</b></div><div class="chips"><span>${esc(vehicle.vehicle_type||'车辆')}</span><span>${vehicle.seats||5} 座</span><span>${esc(vehicle.transmission||'自动挡')}</span><span>${esc(fuel(vehicle.fuel_type))}</span></div><button onclick="Rental.select('${esc(vehicle.id)}')">查看车辆</button></div></article>`).join(''):'<div class="empty">这家商家还没有发布可预约车辆。</div>'}</div>`;
  }

  function renderBookings(){
    const active = state.bookings.filter(booking => !['returned','cancelled','rejected'].includes(String(booking.status || '')));
    const history = state.bookings.filter(booking => ['returned','cancelled','rejected'].includes(String(booking.status || '')));
    const card = booking => `<button class="booking-card" onclick="Rental.booking('${esc(booking.id)}')"><div><span class="booking-status ${esc(booking.status || 'pending')}">${esc(bookingStatus(booking.status))}</span><b>${esc(booking.vehicle?.name || '租车预约')}</b><small>${esc(booking.merchant?.business_name || '')} · ${displayDate(booking.starts_at)}</small></div><strong>${money(booking.total_amount)}</strong><em>›</em></button>`;
    app.innerHTML=`${top('我的预约')}<section class="rental-hero"><h1>我的租车预约</h1><p>预约修改后会重新计算金额，并等待商家再次确认。</p></section><div class="section-title">进行中</div>${active.length?active.map(card).join(''):'<div class="empty compact">暂无进行中的租车预约。</div>'}<div class="section-title">历史预约</div>${history.length?history.map(card).join(''):'<div class="empty compact">暂无历史预约。</div>'}`;
  }

  function renderBookingDetail(){
    const booking = state.booking;
    if(!booking) return renderBookings();
    const vehicle = booking.vehicle || {};
    const extras = Array.isArray(booking.rental_addons) ? booking.rental_addons : [];
    const editable = canChangeBooking(booking);
    app.innerHTML=`${top('预约详情')}<section class="review-head"><div>${photo(vehicle)}</div><p><b>${esc(vehicle.name || '租车预约')}</b><span>${esc(booking.merchant?.business_name || '')}</span></p><span class="booking-status ${esc(booking.status || 'pending')}">${esc(bookingStatus(booking.status))}</span></section><section class="rental-section"><h2>${esc(booking.booking_code || '')}</h2><p class="detail-line">▣ ${displayDate(booking.starts_at)}<small>至 ${displayDate(booking.ends_at)}</small></p><p class="detail-line">⌖ ${esc(vehicle.pickup_address || booking.merchant?.address || '由商家确认取还车地点')}</p></section><section class="rental-section"><h2>金额明细</h2><div class="price-card"><div><span>车辆租金</span><b>${money(booking.base_amount)}</b></div>${extras.map(item=>`<div><span>${esc(item.name || '附加服务')}</span><b>${money(item.amount ?? item.price)}</b></div>`).join('')}<div><span>押金</span><b>${money(booking.deposit_amount)}</b></div><div class="total"><span>预估总额</span><b>${money(booking.total_amount)}</b></div></div><p class="payment-note">支付方式：${esc(({apple_pay:'Apple Pay',google_pay:'Google Pay',card:'信用卡',gift:'商家礼品卡'})[booking.payment_method] || '等待商家确认')}</p></section><section class="help-list"><button onclick="Rental.help()">☎ 寻求帮助 <span>›</span></button><button onclick="Rental.faq()">ⓘ 常见问题 <span>›</span></button></section>${editable?`<div class="action-grid"><button class="danger" onclick="Rental.cancelBooking('${esc(booking.id)}')">取消预约</button><button class="secondary" onclick="Rental.editBooking('${esc(booking.id)}')">修改预约</button></div>`:''}`;
  }
  function renderVehicle(){
    const v=state.selected; if(!v) return renderList();
    const start=state.startsAt?toLocalInput(state.startsAt):toLocalInput(); const end=state.endsAt?toLocalInput(state.endsAt):toLocalInput(new Date(Date.now()+25*3600000));
    const options=addons();
    app.innerHTML=`${top('车辆详细信息')}<section class="vehicle-hero">${photo(v)}<span class="cancel-tag">✓ 免费取消</span></section><div class="vehicle-title"><div><p>${esc([v.year,v.make,v.model].filter(Boolean).join(' ') || v.vehicle_type || '可预约车辆')}</p><h1>${esc(v.name)}</h1></div><b>${rate(v)}<small>含税费以确认页为准</small></b></div><div class="spec-row">${infoIcon('person','座位',`${v.seats||5}`)}${infoIcon('luggage','行李',`${v.luggage_count ?? 2}`)}${infoIcon('wheel','档位',v.transmission||'自动挡')}${infoIcon(fuel(v.fuel_type)==='电动'?'battery':'fuel','燃油',fuel(v.fuel_type))}</div><section class="rental-section"><h2>预约时间</h2><label>取车时间<input id="rentalStart" type="datetime-local" value="${esc(start)}" min="${toLocalInput()}"></label><label>还车时间<input id="rentalEnd" type="datetime-local" value="${esc(end)}" min="${toLocalInput(new Date(Date.now()+3600000))}"></label><button class="outline" onclick="Rental.quote()">更新价格与可用性</button>${state.error?`<p class="warning">${esc(state.error)}</p>`:''}</section>${state.quote?`<section class="rental-section"><h2>租车附加服务</h2>${options.length?options.map(item=>`<label class="addon"><span><b>${esc(item.name)}</b><small>${esc(item.description||'租车附加服务')}</small><em>+${money(item.price)}${item.unit==='day'?'/天':''}</em></span><input type="checkbox" ${state.selectedAddons.includes(String(item.id))?'checked':''} onchange="Rental.toggleAddon('${esc(item.id)}',this.checked)"><i></i></label>`).join(''):`<p class="muted">商家暂未设置附加服务。</p>`}</section>${summary()}<section class="rental-section place-section"><h2>取车和还车</h2>${map()}<p><b>${esc(address())}</b><small>到店取车并原地归还；具体流程以商家确认信息为准。</small></p></section><section class="help-list"><button onclick="Rental.help()">☎ 寻求帮助 <span>›</span></button><button onclick="Rental.faq()">ⓘ 常见问题 <span>›</span></button></section><button class="primary sticky-action" onclick="Rental.contact()">继续查看附加项</button>`:`<button class="primary sticky-action" onclick="Rental.quote()">计算租金与可用性</button>`}`;
  }
  const summaryV2 = () => {
    if(!state.quote) return '';
    const rows = Array.isArray(state.quote.addons) ? state.quote.addons : [];
    const optional = rows.filter(item => !item.required);
    const required = rows.filter(item => item.required);
    return `<section class="price-card"><div><span>车辆租金</span><b>${money(state.quote.base_amount)}</b></div>${optional.map(item=>`<div><span>${esc(item.name || '可选服务')}</span><b>${money(item.amount)}</b></div>`).join('')}${required.map(item=>`<div><span>${esc(item.name || (item.charge_kind === 'tax' ? '税费' : '服务费'))}</span><b>${money(item.amount)}</b></div>`).join('')}<div><span>押金（取车时处理）</span><b>${money(state.quote.deposit_amount)}</b></div><div class="total"><span>预估总额</span><b>${money(state.quote.total_amount)}</b></div></section>`;
  };
  function renderVehicle(){
    const v=state.selected; if(!v) return renderList();
    const start=state.startsAt?toLocalInput(state.startsAt):toLocalInput(); const end=state.endsAt?toLocalInput(state.endsAt):toLocalInput(new Date(Date.now()+25*3600000));
    const options=addons(); const fixed=requiredServices();
    app.innerHTML=`${top('车辆详细信息')}<section class="vehicle-hero">${photo(v)}<span class="cancel-tag">✓ 免费取消</span></section><div class="vehicle-title"><div><p>${esc([v.year,v.make,v.model].filter(Boolean).join(' ') || v.vehicle_type || '可预约车辆')}</p><h1>${esc(v.name)}</h1></div><b>${rate(v)}<small>最终金额以确认页为准</small></b></div><div class="spec-row">${infoIcon('person','座位',`${v.seats||5}`)}${infoIcon('luggage','行李',`${v.luggage_count ?? 2}`)}${infoIcon('wheel','档位',v.transmission||'自动挡')}${infoIcon(fuel(v.fuel_type)==='电动'?'battery':'fuel','燃油',fuel(v.fuel_type))}</div><section class="rental-section"><h2>预约时间</h2><label>取车时间<input id="rentalStart" type="datetime-local" value="${esc(start)}" min="${toLocalInput()}"></label><label>还车时间<input id="rentalEnd" type="datetime-local" value="${esc(end)}" min="${toLocalInput(new Date(Date.now()+3600000))}"></label><button class="outline" onclick="Rental.quote()">更新价格与可用性</button>${state.error?`<p class="warning">${esc(state.error)}</p>`:''}</section>${state.quote?`<section class="rental-section"><h2>可选服务与保险</h2>${options.length?options.map(item=>`<label class="addon"><span><b>${esc(item.name)}</b><small>${esc(item.description|| (item.service_type==='insurance'?'可选保险服务':'租车附加服务'))}</small><em>+${money(item.price)}${item.unit==='day'?'/天':''}</em></span><input type="checkbox" ${state.selectedAddons.includes(String(item.id))?'checked':''} onchange="Rental.toggleAddon('${esc(item.id)}',this.checked)"><i></i></label>`).join(''):`<p class="muted">商家暂未设置可选服务。</p>`}</section>${fixed.length?`<section class="rental-section"><h2>必收税费与服务费</h2>${fixed.map(item=>`<div class="addon required-addon"><span><b>${esc(item.name)}</b><small>${esc(item.description||'商家规定必须计入')}</small><em>将自动加入金额</em></span><i>✓</i></div>`).join('')}</section>`:''}${summary()}<section class="rental-section place-section"><h2>取车和还车</h2>${map()}<p><b>${esc(address())}</b><small>到店取车并原地归还；具体流程以商家确认信息为准。</small></p></section><section class="help-list"><button onclick="Rental.help()">☎ 寻求帮助 <span>›</span></button><button onclick="Rental.faq()">ⓘ 常见问题 <span>›</span></button></section><button class="primary sticky-action" onclick="Rental.contact()">继续查看附加项</button>`:`<button class="primary sticky-action" onclick="Rental.quote()">计算租金与可用性</button>`}`;
  }
  function renderBookingDetail(){
    const booking=state.booking; if(!booking) return renderBookings();
    const vehicle=booking.vehicle||{}; const extras=Array.isArray(booking.rental_addons)?booking.rental_addons:[]; const editable=canChangeBooking(booking);
    app.innerHTML=`${top('预约详情')}<section class="review-head"><div>${photo(vehicle)}</div><p><b>${esc(vehicle.name||'租车预约')}</b><span>${esc(booking.merchant?.business_name||'')}</span></p><span class="booking-status ${esc(booking.status||'pending')}">${esc(bookingStatus(booking.status))}</span></section><section class="rental-section"><h2>${esc(booking.booking_code||'')}</h2><p class="detail-line">▣ ${displayDate(booking.starts_at)}<small>至 ${displayDate(booking.ends_at)}</small></p><p class="detail-line">⌖ ${esc(vehicle.pickup_address||booking.merchant?.address||'由商家确认取还车地点')}</p></section><section class="rental-section"><h2>金额明细</h2><div class="price-card"><div><span>车辆租金</span><b>${money(booking.base_amount)}</b></div>${extras.map(item=>`<div><span>${esc(item.name||'附加服务')}</span><b>${money(item.amount??item.price)}</b></div>`).join('')}<div><span>押金</span><b>${money(booking.deposit_amount)}</b></div><div class="total"><span>预估总额</span><b>${money(booking.total_amount)}</b></div></div><p class="payment-note">支付状态：${esc(({pending:'待付款',paid:'已付款，等待商家确认',refunded:'已退款'})[booking.payment_status]||booking.payment_status||'待付款')}</p></section>${booking.refund_reason?`<section class="rental-section"><h2>取消与退款说明</h2><p class="detail-line">${esc(booking.refund_reason)}<small>退款金额：${money(booking.refund_amount)}</small></p></section>`:''}<section class="help-list"><button onclick="Rental.help()">☎ 寻求帮助 <span>›</span></button><button onclick="Rental.faq()">ⓘ 常见问题 <span>›</span></button></section>${editable?`<div class="action-grid"><button class="danger" onclick="Rental.cancelBooking('${esc(booking.id)}')">取消预约</button><button class="secondary" onclick="Rental.editBooking('${esc(booking.id)}')">修改预约</button></div><p class="payment-note">取车前 48 小时以上取消，已付款预约可自动退款。</p>`:''}`;
  }
  // 5.357: required taxes and service fees are informational, not customer toggles.
  function renderVehicle(){
    const v=state.selected; if(!v) return renderList();
    const start=state.startsAt?toLocalInput(state.startsAt):toLocalInput(); const end=state.endsAt?toLocalInput(state.endsAt):toLocalInput(new Date(Date.now()+25*3600000));
    const options=addons(); const fixed=requiredServices();
    app.innerHTML=`${top('车辆详细信息')}<section class="vehicle-hero">${photo(v)}<span class="cancel-tag">✓ 免费取消</span></section><div class="vehicle-title"><div><p>${esc([v.year,v.make,v.model].filter(Boolean).join(' ') || v.vehicle_type || '可预约车辆')}</p><h1>${esc(v.name)}</h1></div><b>${rate(v)}<small>最终金额以确认页为准</small></b></div><div class="spec-row">${infoIcon('person','座位',`${v.seats||5}`)}${infoIcon('luggage','行李',`${v.luggage_count ?? 2}`)}${infoIcon('wheel','档位',v.transmission||'自动挡')}${infoIcon(fuel(v.fuel_type)==='电动'?'battery':'fuel','燃油',fuel(v.fuel_type))}</div><section class="rental-section"><h2>预约时间</h2><label>取车时间<input id="rentalStart" type="datetime-local" value="${esc(start)}" min="${toLocalInput()}"></label><label>还车时间<input id="rentalEnd" type="datetime-local" value="${esc(end)}" min="${toLocalInput(new Date(Date.now()+3600000))}"></label><button class="outline" onclick="Rental.quote()">更新价格与可用性</button>${state.error?`<p class="warning">${esc(state.error)}</p>`:''}</section>${state.quote?`<section class="rental-section"><h2>可选服务与保险</h2>${options.length?options.map(item=>`<label class="addon"><span><b>${esc(item.name)}</b><small>${esc(item.description|| (item.service_type==='insurance'?'可选保险服务':'租车附加服务'))}</small><em>+${money(item.price)}${item.unit==='day'?'/天':''}</em></span><input type="checkbox" ${state.selectedAddons.includes(String(item.id))?'checked':''} onchange="Rental.toggleAddon('${esc(item.id)}',this.checked)"><i></i></label>`).join(''):`<p class="muted">商家暂未设置可选服务。</p>`}</section>${fixed.length?`<section class="rental-section"><h2>税务与服务费</h2>${fixed.map(item=>`<div class="addon required-addon"><span><b>${esc(item.name)}</b><small>${esc(item.description||'商家规定必须计入')}</small><em>将自动加入金额</em></span><strong class="required-note">自动计入</strong></div>`).join('')}</section>`:''}${summary()}<section class="rental-section place-section"><h2>取车和还车</h2>${map()}<p><b>${esc(address())}</b><small>到店取车并原地归还；具体流程以商家确认信息为准。</small></p></section><section class="help-list"><button onclick="Rental.help()">☎ 寻求帮助 <span>›</span></button><button onclick="Rental.faq()">ⓘ 常见问题 <span>›</span></button></section><button class="primary sticky-action" onclick="Rental.contact()">继续查看附加项</button>`:`<button class="primary sticky-action" onclick="Rental.quote()">计算租金与可用性</button>`}`;
  }

  function renderContact(){
    const profile=user(); const v=state.selected;
    app.innerHTML=`${top(state.editingBookingId ? '修改预约' : '查看预约')}<section class="review-head"><div>${photo(v)}</div><p><b>${esc(v.name)}</b><span>${esc([v.year,v.make,v.model].filter(Boolean).join(' '))}</span></p></section><section class="rental-section"><h2>预约开始时间</h2><p class="detail-line">▣ ${displayDate(state.startsAt)}<small>至 ${displayDate(state.endsAt)}</small></p><label>租车人姓名<input id="rentalName" maxlength="80" value="${esc(state.name||profile?.user_metadata?.display_name||profile?.user_metadata?.name||'')}" placeholder="姓名（必填）"></label><label>联系电话<input id="rentalPhone" maxlength="40" inputmode="tel" value="${esc(state.phone)}" placeholder="电话（必填）"></label><label>邮箱（选填）<input id="rentalEmail" maxlength="120" type="email" value="${esc(state.email||profile?.email||'')}" placeholder="用于接收预约信息"></label><label>备注（选填）<textarea id="rentalNote" maxlength="400" placeholder="例如：航班号、取车时间或其他需求">${esc(state.note)}</textarea></label></section>${summary()}<section class="rental-section"><h2>自助取车和还车</h2>${map()}<p class="detail-line">⌖ ${esc(address())}<small>取还车地点与到店流程将由商家确认。</small></p></section><section class="help-list"><button onclick="Rental.help()">☎ 寻求帮助 <span>›</span></button><button onclick="Rental.faq()">ⓘ 常见问题 <span>›</span></button></section>${state.editingBookingId ? '' : '<div class="action-grid"><button class="danger" onclick="Rental.cancel()">取消预约</button><button class="secondary" onclick="Rental.modify()">修改预约</button></div>'}<button class="primary confirm-booking" onclick="Rental.review()">${state.editingBookingId ? '确认修改预约' : '确认预约'}</button>`;
  }
  function renderPayment(){
    const methods=[['apple_pay','Apple Pay','使用 Apple Pay 支付预估总额'],['google_pay','Google Pay','使用 Google Pay 支付预估总额'],['card','信用卡','使用信用卡支付预估总额'],['gift','商家礼品卡','使用商家礼品卡支付预估总额']];
    app.innerHTML=`${top(state.editingBookingId ? '确认修改' : '支付预约')}<section class="payment-banner"><b>确认支付内容</b><span>${esc(state.selected.name)} · ${displayDate(state.startsAt)} 至 ${displayDate(state.endsAt)}</span></section>${summary()}<section class="rental-section"><h2>支付方式</h2>${methods.map(([id,title,detail])=>`<button class="pay-method ${state.paymentMethod===id?'selected':''}" onclick="Rental.pickPayment('${id}')"><span><b>${title}</b><small>${detail}</small></span><i>${state.paymentMethod===id?'✓':''}</i></button>`).join('')}<p class="payment-note">当前为预约确认流程。正式扣款、押金预授权和退款将在商家开通支付服务后启用；提交后商家会确认你的预约。</p></section><button class="primary sticky-action" onclick="Rental.submit()">${state.editingBookingId ? '确认修改并重新计价' : '确认并提交'} ${money(state.quote?.total_amount)}</button>`;
  }
  function renderSuccess(booking){ app.innerHTML=`${top('预约已提交')}<div class="success"><i>✓</i><h1>预约已提交</h1><b>${esc(booking.booking_code||'')}</b><p>商家将确认你的预约和付款安排。</p><section class="price-card"><div><span>车辆租金</span><b>${money(booking.base_amount)}</b></div>${Number(booking.addon_amount||0)?`<div><span>附加服务</span><b>${money(booking.addon_amount)}</b></div>`:''}<div class="total"><span>预估总额</span><b>${money(booking.total_amount)}</b></div></section><button class="primary" onclick="Rental.list()">返回车辆列表</button></div>`; }
  async function quote(){ formTimes(); state.error=''; try { const response=await api('/rest/v1/rpc/merchant_rental_quote',{method:'POST',body:JSON.stringify({p_vehicle_id:state.selected.id,p_starts_at:state.startsAt,p_ends_at:state.endsAt,p_addon_ids:state.selectedAddons})}); const data=await response.json(); if(!response.ok)throw new Error(String(data?.message||data?.hint||'该时间暂不可预约')); state.quote=data; renderVehicle(); } catch(error){ state.quote=null; state.error=error.message.includes('vehicle')?'该车辆在这段时间不可预约，请换一个时间。':error.message.includes('invalid')?'请确认取车和还车时间。':'暂时无法计算，请稍后重试。'; renderVehicle(); } }
  function toggleAddon(id, checked){ state.selectedAddons=checked?[...new Set(state.selectedAddons.concat(String(id)))]:state.selectedAddons.filter(value=>value!==String(id)); quote(); }
  function contact(){ state.screen='contact'; renderContact(); }
  function review(){ state.name=document.getElementById('rentalName')?.value.trim()||''; state.phone=document.getElementById('rentalPhone')?.value.trim()||''; state.email=document.getElementById('rentalEmail')?.value.trim()||''; state.note=document.getElementById('rentalNote')?.value.trim()||''; if(!state.name||!state.phone){ alert('请填写姓名和电话。'); return; } state.screen='payment'; renderPayment(); }
  async function submit(){
    const updating = Boolean(state.editingBookingId);
    const endpoint = updating ? 'merchant_rental_customer_update_booking' : 'merchant_rental_create_booking';
    const body = updating
      ? { p_booking_id:state.editingBookingId, p_starts_at:state.startsAt, p_ends_at:state.endsAt, p_addon_ids:state.selectedAddons, p_customer_name:state.name, p_customer_phone:state.phone, p_customer_email:state.email||null, p_note:state.note||null }
      : { p_vehicle_id:state.selected.id, p_starts_at:state.startsAt, p_ends_at:state.endsAt, p_customer_name:state.name, p_customer_phone:state.phone, p_customer_email:state.email||null, p_note:state.note||null, p_addon_ids:state.selectedAddons };
    const response = await api(`/rest/v1/rpc/${endpoint}`, { method:'POST', body:JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if(!response.ok){
      const message = String(data?.message || '');
      alert(message.includes('unavailable') ? '该时段刚被其他预约占用，请重新选择时间。' : message.includes('cannot') ? '这笔预约目前不能修改，请联系商家协助处理。' : '预约提交失败，请稍后重试。');
      return;
    }
    state.editingBookingId = '';
    await loadBookings();
    renderSuccess(data);
  }
  function refreshList(){ formTimes(); renderList(); }
  function select(id){ state.selected=state.vehicles.find(v=>String(v.id)===String(id))||null; state.quote=null; state.error=''; state.selectedAddons=[]; state.editingBookingId=''; state.screen='vehicle'; renderVehicle(); }
  function back(){ if(state.screen==='payment'){state.screen='contact';renderContact();} else if(state.screen==='contact'){state.screen='vehicle';renderVehicle();} else if(state.screen==='vehicle'){state.screen='list';state.editingBookingId='';renderList();} else if(state.screen==='booking-detail'){state.screen='bookings';renderBookings();} else if(state.screen==='bookings'){state.screen='list';renderList();} else close(); }
  function modify(){ state.screen='vehicle'; renderVehicle(); }
  function cancel(){ if(confirm('确定取消本次尚未提交的预约吗？')) { state.screen='list'; state.selected=null; state.quote=null; state.selectedAddons=[]; renderList(); } }
  async function loadBookings(){
    if(!user()) { state.bookings=[]; return; }
    try {
      const response = await api('/rest/v1/rpc/merchant_rental_customer_bookings', { method:'POST', body:'{}' });
      const data = await response.json();
      state.bookings = response.ok && Array.isArray(data) ? data : [];
    } catch(error) { state.bookings=[]; }
  }
  function renderBookingWithHandover(){
    renderBookingDetail();
    const booking=state.booking; const handover=booking?.handover;
    if(!booking || !handover) return;
    const rows=[];
    if(handover.checkout_at) rows.push(`<div><span>已取车</span><b>${esc(displayDate(handover.checkout_at))}</b><small>里程 ${esc(handover.checkout_mileage ?? '—')} mi · 油量/电量 ${esc(handover.checkout_fuel_percent ?? '—')}%</small></div>`);
    if(handover.return_at) rows.push(`<div><span>已还车</span><b>${esc(displayDate(handover.return_at))}</b><small>里程 ${esc(handover.return_mileage ?? '—')} mi · 油量/电量 ${esc(handover.return_fuel_percent ?? '—')}%${handover.return_condition==='damage'?' · 已记录车况问题':''}</small></div>`);
    if(!rows.length) return;
    const target=app.querySelector('.help-list');
    if(target) target.insertAdjacentHTML('beforebegin',`<section class="rental-section handover-customer"><h2>车辆交接</h2><div class="price-card">${rows.join('')}</div></section>`);
  }
  function openBooking(id){ state.booking=state.bookings.find(item=>String(item.id)===String(id))||null; state.screen='booking-detail'; renderBookingWithHandover(); }
  async function cancelBooking(id){
    if(!confirm('确定取消这笔预约吗？取消后需要重新选择车辆和时间。')) return;
    const response=await api('/rest/v1/rpc/merchant_rental_customer_cancel_booking',{method:'POST',body:JSON.stringify({p_booking_id:id})});
    if(!response.ok){ alert('这笔预约目前无法取消，请联系商家协助处理。'); return; }
    await loadBookings(); state.booking=state.bookings.find(item=>String(item.id)===String(id))||null; renderBookingWithHandover();
  }
  async function editBooking(id){
    const booking=state.bookings.find(item=>String(item.id)===String(id));
    if(!booking || !canChangeBooking(booking)){ alert('这笔预约目前不能修改，请联系商家协助处理。'); return; }
    // The booking snapshot is intentionally compact; use the live catalog entry
    // when available so a customer can still adjust its enabled add-on services.
    state.selected=state.vehicles.find(item=>String(item.id)===String(booking.vehicle_id))||booking.vehicle;
    state.startsAt=booking.starts_at;
    state.endsAt=booking.ends_at;
    state.name=booking.customer_name||'';
    state.phone=booking.customer_phone||'';
    state.email=booking.customer_email||'';
    state.note=booking.operator_note||'';
    state.selectedAddons=(Array.isArray(booking.rental_addons)?booking.rental_addons:[]).map(item=>String(item.id)).filter(Boolean);
    state.editingBookingId=id;
    state.quote={base_amount:booking.base_amount,addon_amount:Number(booking.total_amount||0)-Number(booking.base_amount||0),total_amount:booking.total_amount,deposit_amount:booking.deposit_amount,addons:booking.rental_addons||[]};
    state.screen='vehicle';
    renderVehicle();
  }
  // 5.357: reservation is paid before it becomes available for merchant confirmation.
  function renderPayment(){
    const methods=[['apple_pay','Apple Pay','使用 Apple Pay 支付预估总额'],['google_pay','Google Pay','使用 Google Pay 支付预估总额'],['card','信用卡','使用信用卡支付预估总额'],['gift','商家礼品卡','使用商家礼品卡支付预估总额']];
    app.innerHTML=`${top(state.editingBookingId ? '确认修改' : '支付预约')}<section class="payment-banner"><b>完成付款后等待商家确认</b><span>${esc(state.selected.name)} · ${displayDate(state.startsAt)} 至 ${displayDate(state.endsAt)}</span></section>${summary()}<section class="rental-section"><h2>支付方式</h2>${methods.map(([id,title,detail])=>`<button class="pay-method ${state.paymentMethod===id?'selected':''}" onclick="Rental.pickPayment('${id}')"><span><b>${title}</b><small>${detail}</small></span><i>${state.paymentMethod===id?'✓':''}</i></button>`).join('')}<p class="payment-note">付款后商家才可确认预约。取车前 48 小时以上取消可退款；若商家取消，会展示原因并记录退款金额。</p></section><button class="primary sticky-action" onclick="Rental.submit()">${state.editingBookingId ? '支付并提交修改' : '支付并提交预约'} ${money(state.quote?.total_amount)}</button>`;
  }
  function review(){
    if(!user()){ alert('请先登录后支付并管理租车预约。'); return; }
    state.name=document.getElementById('rentalName')?.value.trim()||''; state.phone=document.getElementById('rentalPhone')?.value.trim()||''; state.email=document.getElementById('rentalEmail')?.value.trim()||''; state.note=document.getElementById('rentalNote')?.value.trim()||'';
    if(!state.name||!state.phone){ alert('请填写姓名和电话。'); return; }
    state.screen='payment'; renderPayment();
  }
  async function submit(){
    const updating=Boolean(state.editingBookingId);
    const endpoint=updating?'merchant_rental_customer_update_booking':'merchant_rental_create_booking';
    const body=updating?{p_booking_id:state.editingBookingId,p_starts_at:state.startsAt,p_ends_at:state.endsAt,p_addon_ids:state.selectedAddons,p_customer_name:state.name,p_customer_phone:state.phone,p_customer_email:state.email||null,p_note:state.note||null}:{p_vehicle_id:state.selected.id,p_starts_at:state.startsAt,p_ends_at:state.endsAt,p_customer_name:state.name,p_customer_phone:state.phone,p_customer_email:state.email||null,p_note:state.note||null,p_addon_ids:state.selectedAddons};
    const response=await api(`/rest/v1/rpc/${endpoint}`,{method:'POST',body:JSON.stringify(body)}); let data=await response.json().catch(()=>({}));
    if(!response.ok){ const message=String(data?.message||''); alert(message.includes('unavailable')?'该时段刚被其他预约占用，请重新选择时间。':message.includes('cannot')?'这笔预约目前不能修改，请联系商家协助处理。':'预约提交失败，请稍后重试。'); return; }
    if(!updating){
      const paid=await api('/rest/v1/rpc/merchant_rental_customer_mark_paid',{method:'POST',body:JSON.stringify({p_booking_id:data.id,p_payment_method:state.paymentMethod})});
      data=await paid.json().catch(()=>({}));
      if(!paid.ok){ alert('预约已创建，但付款状态未完成，请在“我的预约”中重试。'); return; }
    }
    state.editingBookingId=''; await loadBookings(); renderSuccess(data);
  }
  async function cancelBooking(id){
    if(!confirm('确定取消这笔预约吗？取车前 48 小时以上的已付款预约将记录为可退款。')) return;
    const response=await api('/rest/v1/rpc/merchant_rental_customer_cancel_booking',{method:'POST',body:JSON.stringify({p_booking_id:id})});
    if(!response.ok){ alert('这笔预约目前无法取消，请联系商家协助处理。'); return; }
    await loadBookings(); state.booking=state.bookings.find(item=>String(item.id)===String(id))||null; renderBookingDetail();
  }
  const vehicleCategory = vehicle => {
    const raw = String(vehicle?.vehicle_type || '').toLowerCase();
    if(raw.includes('suv')) return 'SUV';
    if(raw.includes('van') || raw.includes('商务') || raw.includes('面包')) return 'VAN';
    if(raw.includes('皮卡') || raw.includes('pickup')) return '皮卡';
    if(raw.includes('紧凑') || raw.includes('compact')) return '紧凑';
    return '标准';
  };
  function filteredVehicles(){
    const filters=state.filters;
    return state.vehicles.filter(vehicle => {
      if(filters.seats && Number(vehicle.seats || 0) < Number(filters.seats)) return false;
      if(filters.fuel && fuel(vehicle.fuel_type) !== filters.fuel) return false;
      if(filters.type && vehicleCategory(vehicle) !== filters.type) return false;
      return true;
    });
  }
  function renderList(){
    const start=state.startsAt?toLocalInput(state.startsAt):toLocalInput();
    const end=state.endsAt?toLocalInput(state.endsAt):toLocalInput(new Date(Date.now()+25*3600000));
    const filters=state.filters; const cars=filteredVehicles();
    app.innerHTML=`${top('租车预约')}<section class="rental-hero"><div class="rental-hero-row"><div><h1>${esc(state.merchant?.business_name||'乐生活租车')}</h1><p>${esc(state.merchant?.address||'请选择取还时间后查看可预约车辆')}</p></div>${user()?'<button onclick="Rental.bookings()">我的预约</button>':''}</div></section><section class="time-filter"><label>取车时间<input id="rentalStart" type="datetime-local" value="${esc(start)}" min="${toLocalInput()}"></label><label>还车时间<input id="rentalEnd" type="datetime-local" value="${esc(end)}" min="${toLocalInput(new Date(Date.now()+3600000))}"></label><button onclick="Rental.refreshList()">查询车辆</button></section><section class="vehicle-filter"><div class="filter-heading"><b>筛选车型</b><button onclick="Rental.clearFilters()">清除筛选</button></div><div class="vehicle-filter-grid"><label>乘客<select onchange="Rental.setFilter('seats',this.value)"><option value="">不限人数</option>${Array.from({length:9},(_,index)=>index+2).map(number=>`<option value="${number}" ${String(filters.seats)===String(number)?'selected':''}>${number} 人及以上</option>`).join('')}</select></label><label>能源<select onchange="Rental.setFilter('fuel',this.value)"><option value="">不限能源</option>${['汽油','柴油','混动','电动'].map(item=>`<option value="${item}" ${filters.fuel===item?'selected':''}>${item}</option>`).join('')}</select></label><label>车型<select onchange="Rental.setFilter('type',this.value)"><option value="">不限车型</option>${['紧凑','标准','SUV','VAN','皮卡'].map(item=>`<option value="${item}" ${filters.type===item?'selected':''}>${item}</option>`).join('')}</select></label></div></section><div class="filter-result">找到 <b>${cars.length}</b> 辆符合条件的车辆</div><div class="vehicle-list">${cars.length?cars.map(vehicle=>`<article class="vehicle">${photo(vehicle)}<div class="vehicle-main"><div class="vehicle-head"><div><h2>${esc(vehicle.name)}</h2><p>${esc([vehicle.year,vehicle.make,vehicle.model].filter(Boolean).join(' '))}</p></div><b>${rate(vehicle)}</b></div><div class="chips"><span>${esc(vehicleCategory(vehicle))}</span><span>${vehicle.seats||5} 座</span><span>${esc(vehicle.transmission||'自动挡')}</span><span>${esc(fuel(vehicle.fuel_type))}</span></div><button onclick="Rental.select('${esc(vehicle.id)}')">查看车辆</button></div></article>`).join(''):'<div class="empty">没有符合条件的车辆。试试减少乘客人数或清除筛选。</div>'}</div>`;
  }
  async function load(){ const slug=query.get('merchant'); if(!slug){ app.innerHTML='<div class="empty">缺少商家信息。</div>'; return; } try { const res=await api('/rest/v1/rpc/merchant_rental_public_catalog',{method:'POST',body:JSON.stringify({p_slug:slug})}); const data=await res.json(); if(!res.ok||!data?.merchant)throw new Error('not_found'); state.merchant=data.merchant; state.vehicles=Array.isArray(data.vehicles)?data.vehicles:[]; await loadBookings(); renderList(); } catch(e){ app.innerHTML=`${top('车辆预约')}<div class="empty">暂时无法读取租车服务，请稍后再试。</div>`; } }
  window.Rental={close,back,refreshList,select,quote,toggleAddon,contact,review,pickPayment:id=>{state.paymentMethod=id;renderPayment();},submit,modify,cancel,bookings:async()=>{await loadBookings();state.screen='bookings';renderBookings();},booking:openBooking,cancelBooking,editBooking,setFilter:(key,value)=>{state.filters[key]=value;renderList();},clearFilters:()=>{state.filters={seats:'',fuel:'',type:''};renderList();},list:()=>{state.screen='list';state.selected=null;state.quote=null;state.editingBookingId='';renderList();},help:()=>alert(`请联系 ${state.merchant?.business_name||'商家'}：${state.merchant?.phone||'商家暂未填写电话'}`),faq:()=>alert('常见问题：预约提交后由商家确认；请在取车前携带有效驾照与预约信息。')};
  load();
})();
