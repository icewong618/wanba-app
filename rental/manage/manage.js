(() => {
  const SUPABASE_URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
  const MEDIA_URL = 'https://upload.escoopcity.com';
  const app = document.getElementById('rentalManageApp');
  const query = new URLSearchParams(location.search);
  const state = { merchant:null, merchantId:'', vehicles:[], services:[], bookings:[], tasks:[], blackouts:[], stats:{}, fleetStats:{}, photos:[], handoverPhotos:[], screen:'home', booking:null, bookingFilter:'all', vehicleFilter:'', handoverAction:'', editingTaskId:'', editingVehicleId:'', serviceType:'addon', editingServiceId:'', scheduleEvent:null, history:[] };

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  const money = value => `$${Number(value || 0).toFixed(2)}`;
  const value = id => document.getElementById(id)?.value?.trim() || '';
  const local = date => { const d = new Date(date); const pad = n => String(n).padStart(2,'0'); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const dateText = date => date ? new Intl.DateTimeFormat('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(date)) : '未设置';
  const statusText = status => ({ pending:'等待确认', confirmed:'已确认', active:'租用中', overdue:'逾期未还', returned:'已完成', cancelled:'已取消', rejected:'未确认' }[status] || status || '等待确认');
  const paymentText = status => ({ pending:'待收款', paid:'已收款', refunded:'已退款', partial_refund:'部分退款', waived:'已免除' }[status] || '待收款');
  const depositText = status => ({ not_collected:'未收取', authorized:'已预授权', collected:'已收取', released:'已释放', forfeited:'已扣除', refunded:'已退回' }[status] || '未收取');
  const getSession = () => { try { return JSON.parse(localStorage.getItem('wanba_session') || 'null'); } catch(error) { return null; } };
  const api = (path, options={}) => {
    const session = getSession();
    return fetch(`${SUPABASE_URL}${path}`, { ...options, headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${session?.access_token || SUPABASE_KEY}`, 'Content-Type':'application/json', ...(options.headers || {}) } });
  };
  const top = title => `<header class="top"><button onclick="RentalManage.back()" aria-label="返回">‹</button><b>${esc(title)}</b><span class="top-actions"><button class="language" onclick="window.LeshenghuoI18n&&window.LeshenghuoI18n.openPicker()" aria-label="语言" title="语言">文</button><button onclick="RentalManage.close()" aria-label="关闭">×</button></span></header>`;
  const exitManager = () => {
    if(window.parent !== window) { window.parent.postMessage({ type:'leshenghuo-close-rental' }, '*'); return; }
    const slug = query.get('merchant');
    location.assign(`/merchant/manage/?merchant=${encodeURIComponent(slug || '')}&admin_v=5.362`);
  };
  const currentRoute = () => ({ screen:state.screen, bookingId:state.booking?.id || '', bookingFilter:state.bookingFilter, vehicleFilter:state.vehicleFilter, taskId:state.editingTaskId, vehicleId:state.editingVehicleId, serviceType:state.serviceType, serviceId:state.editingServiceId, taskVehicleId:state.taskVehicleId || '', scheduleEvent:state.scheduleEvent });
  const restoreRoute = route => {
    state.screen = route.screen;
    state.bookingFilter = route.bookingFilter || 'all';
    state.vehicleFilter = route.vehicleFilter || '';
    state.editingTaskId = route.taskId || '';
    state.editingVehicleId = route.vehicleId || '';
    state.serviceType = route.serviceType || 'addon';
    state.editingServiceId = route.serviceId || '';
    state.taskVehicleId = route.taskVehicleId || '';
    state.scheduleEvent = route.scheduleEvent || null;
    state.booking = route.bookingId ? state.bookings.find(item => String(item.id) === String(route.bookingId)) || null : null;
    renderCurrent();
    window.scrollTo(0,0);
  };
  const go = (screen, updates={}) => {
    if(state.screen !== screen || Object.keys(updates).length) state.history.push(currentRoute());
    Object.assign(state, updates, { screen });
    renderCurrent();
    window.scrollTo(0,0);
  };
  const close = () => state.history.length ? back() : exitManager();
  const vehiclePhoto = vehicle => Array.isArray(vehicle?.photos) && vehicle.photos[0] ? `<img src="${esc(vehicle.photos[0])}" alt="">` : '<div class="placeholder">🚗</div>';
  const vehicleName = booking => booking?.vehicle?.name || state.vehicles.find(item => String(item.id) === String(booking?.vehicle_id))?.name || '租车预约';
  const rateText = vehicle => vehicle.pricing_mode === 'hour' ? `${money(vehicle.hourly_rate)}/小时` : vehicle.pricing_mode === 'both' ? `${money(vehicle.daily_rate)}/天 · ${money(vehicle.hourly_rate)}/小时` : `${money(vehicle.daily_rate)}/天`;
  const parseNumber = id => Math.max(0, Number(value(id) || 0));

  async function loadManager(nextScreen=state.screen) {
    const slug = query.get('merchant');
    if(!slug || !getSession()?.access_token) { app.innerHTML = `${top('租车管理')}<div class="empty">请先登录拥有商家管理权限的账号。</div>`; return; }
    try {
      const catalogResponse = await api('/rest/v1/rpc/merchant_rental_public_catalog', { method:'POST', body:JSON.stringify({ p_slug:slug }) });
      const catalog = await catalogResponse.json();
      if(!catalogResponse.ok || !catalog?.merchant?.user_id) throw new Error('merchant_not_found');
      state.merchant = catalog.merchant;
      state.merchantId = catalog.merchant.user_id;
      const response = await api('/rest/v1/rpc/merchant_rental_manager_list', { method:'POST', body:JSON.stringify({ p_merchant_user_id:state.merchantId }) });
      const data = await response.json();
      if(!response.ok || !data) throw new Error('permission_denied');
      state.vehicles = Array.isArray(data.vehicles) ? data.vehicles : [];
      state.services = Array.isArray(data.services) ? data.services : [];
      state.bookings = Array.isArray(data.bookings) ? data.bookings : [];
      state.tasks = Array.isArray(data.tasks) ? data.tasks : [];
      state.blackouts = Array.isArray(data.blackouts) ? data.blackouts : [];
      state.stats = data.stats || {};
      state.fleetStats = data.fleet_stats || {};
      state.screen = nextScreen;
      renderCurrent();
    } catch(error) {
      console.warn('租车管理加载失败:', error.message);
      app.innerHTML = `${top('租车管理')}<div class="empty">暂时无法打开管理页面。请确认当前账号是店长或已被授权管理。</div>`;
    }
  }

  function renderCurrent() {
    if(state.screen === 'fleet') return renderFleet();
    if(state.screen === 'bookings') return renderBookings();
    if(state.screen === 'booking') return renderBookingWithHandover();
    if(state.screen === 'handover') return renderHandover();
    if(state.screen === 'finance') return renderFinance();
    if(state.screen === 'reprice') return renderReprice();
    if(state.screen === 'tasks') return renderTasks();
    if(state.screen === 'task') return renderTaskEditor(state.editingTaskId);
    if(state.screen === 'schedule') return renderSchedule();
    if(state.screen === 'schedule-event') return renderScheduleEvent();
    if(state.screen === 'vehicle') return renderVehicleEditor(state.editingVehicleId);
    if(state.screen === 'services') return renderServices(state.serviceType);
    if(state.screen === 'service') return editService(state.serviceType, state.editingServiceId);
    renderHome();
  }

  function summaryCard(label, count, tone='') { return `<button class="ops-stat ${tone}" onclick="RentalManage.bookings('${esc(label)}')"><b>${Number(count || 0)}</b><span>${label === 'pending' ? '等待确认' : label === 'confirmed' ? '已确认' : label === 'active' ? '租用中' : '已完成'}</span></button>`; }
  function renderHome() {
    const pending = state.bookings.filter(item => item.status === 'pending');
    const preview = pending.length ? pending.slice(0,3).map(bookingCard).join('') : '<div class="empty compact">目前没有等待确认的预约。</div>';
    const openTasks = state.tasks.filter(item => ['open','in_progress'].includes(item.status)).length;
    app.innerHTML = `${top('租车管理')}<section class="ops-hero"><p>${esc(state.merchant?.business_name || '商家')}</p><h1>租车运营后台</h1><span>先确认预约，再登记收款、押金和后续费用。</span></section><div class="actions rental-home-actions"><button class="primary" onclick="RentalManage.editVehicle()">＋ 添加车辆</button><button class="secondary" onclick="RentalManage.fleet()">车队看板</button></div><section class="ops-stats">${summaryCard('pending',state.stats.pending_count,'warn')}${summaryCard('confirmed',state.stats.confirmed_count)}${summaryCard('active',state.stats.active_count)}${summaryCard('completed',state.stats.completed_count)}</section><section class="ops-entry-grid"><button onclick="RentalManage.bookings('all')"><b>预约管理</b><span>确认、改期、客户资料</span></button><button onclick="RentalManage.bookings('finance')"><b>财务与押金</b><span>收款、优惠、损坏违章</span></button><button onclick="RentalManage.fleet()"><b>车队看板</b><span>出租、清洁、维修状态</span></button><button onclick="RentalManage.tasks()"><b>任务与排期</b><span>${openTasks ? `待处理 ${openTasks} 项` : '维修、清洁与日历'}</span></button><button onclick="RentalManage.schedule()"><b>车辆日历</b><span>预约和任务同屏查看</span></button><button onclick="RentalManage.services('addon')"><b>服务库</b><span>增值服务与保险</span></button></section><div class="section-title"><b>等待商家确认</b><button onclick="RentalManage.bookings('pending')">查看全部</button></div>${preview}<section class="ops-revenue"><span>预约金额合计</span><b>${money(state.stats.booking_total)}</b><span>已登记收款</span><b>${money(state.stats.paid_total)}</b></section><div class="footer-space"></div>`;
  }

  function fleetStatus(vehicle) {
    if(vehicle?.active_booking) return { id:'rented', label: vehicle.active_booking.status === 'overdue' ? '逾期未还' : '租用中' };
    return ({ available:{id:'available',label:'可预约'}, cleaning:{id:'cleaning',label:'清洁中'}, maintenance:{id:'maintenance',label:'维修中'}, inactive:{id:'inactive',label:'已下架'} }[vehicle?.status]) || { id:'inactive',label:'已下架' };
  }

  function fleetVehicleCard(vehicle) {
    const current = fleetStatus(vehicle);
    const next = vehicle.next_booking;
    const active = vehicle.active_booking;
    const statusButtons = [['available','可预约'],['cleaning','清洁中'],['maintenance','维修中'],['inactive','下架']]
      .map(([id,label]) => `<button class="fleet-action ${current.id === id ? 'selected' : ''}" ${active ? 'disabled' : ''} onclick="RentalManage.setVehicleStatus('${esc(vehicle.id)}','${id}')">${label}</button>`).join('');
    const tasks = state.tasks.filter(item => String(item.vehicle_id) === String(vehicle.id) && ['open','in_progress'].includes(item.status));
    return `<article class="fleet-card"><div class="fleet-card-top">${vehiclePhoto(vehicle)}<div><span class="fleet-pill ${esc(current.id)}">${esc(current.label)}</span><h2>${esc(vehicle.name || '未命名车辆')}</h2><p>${esc([vehicle.year,vehicle.make,vehicle.model].filter(Boolean).join(' · ') || '车辆资料待补充')}</p></div></div>${active ? `<div class="fleet-current"><b>${esc(active.customer_name || '客户')} 正在使用</b><span>${esc(dateText(active.ends_at))} 前应还车 · ${esc(active.booking_code || '')}</span></div>` : next ? `<div class="fleet-next"><b>下一笔预约</b><span>${esc(dateText(next.starts_at))} · ${esc(next.customer_name || '客户')}</span></div>` : '<div class="fleet-next"><b>暂无后续预约</b><span>可直接接受新预约</span></div>'}${tasks.length ? `<div class="fleet-task-note">待完成：${tasks.map(item=>esc(item.title)).join('、')}</div>` : ''}<div class="fleet-actions">${statusButtons}</div><div class="card-actions"><button class="primary" onclick="RentalManage.editVehicle('${esc(vehicle.id)}')">编辑车辆</button><button onclick="RentalManage.openVehicleBookings('${esc(vehicle.id)}')">查看预约</button><button onclick="RentalManage.newTask('${esc(vehicle.id)}')">添加任务</button></div></article>`;
  }

  function renderFleet() {
    const stats = state.fleetStats || {};
    app.innerHTML = `${top('车队看板')}<div class="actions"><button class="secondary" onclick="RentalManage.home()">← 返回后台</button><button class="primary" onclick="RentalManage.editVehicle()">＋ 添加车辆</button></div><section class="fleet-stats"><div><b>${Number(stats.total_count || state.vehicles.length || 0)}</b><span>全部车辆</span></div><div><b>${Number(stats.rented_count || 0)}</b><span>租用中</span></div><div><b>${Number(stats.available_count || 0)}</b><span>可预约</span></div><div><b>${Number(stats.cleaning_count || 0)}</b><span>清洁中</span></div><div><b>${Number(stats.maintenance_count || 0)}</b><span>维修中</span></div></section><div class="fleet-help">租用中由有效预约自动计算；车辆还车后，可在这里改为清洁中、维修中或重新开放预约。</div><section class="fleet-list">${state.vehicles.length ? state.vehicles.map(fleetVehicleCard).join('') : '<div class="empty">还没有车辆。添加车辆后即可在这里查看出租和维护状态。</div>'}</section><div class="footer-space"></div>`;
  }

  async function setVehicleStatus(id, status) {
    const labels = { available:'可预约', cleaning:'清洁中', maintenance:'维修中', inactive:'下架' };
    if(!confirm(`将车辆状态改为“${labels[status] || status}”吗？`)) return;
    const response = await api('/rest/v1/rpc/merchant_rental_manager_set_vehicle_status', { method:'POST', body:JSON.stringify({ p_vehicle_id:id, p_status:status }) });
    if(!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message = String(error?.message || '');
      alert(message.includes('currently_rented') ? '该车辆正在租用中，不能手动修改状态。' : message.includes('open_tasks') ? '这辆车还有未完成的清洁或维修任务，完成或取消任务后才能重新开放预约。' : '车辆状态更新失败，请稍后重试。');
      return;
    }
    await loadManager('fleet');
  }

  function openVehicleBookings(vehicleId) {
    go('bookings', { vehicleFilter:vehicleId, bookingFilter:'all' });
  }

  function renderBookingWithHandover() {
    renderBookingDetail();
    const booking = state.booking;
    const actions = app.querySelector('.ops-detail-actions');
    if(!booking || !actions) return;
    const handover = booking.handover || {};
    const buttons = [];
    if(booking.status === 'confirmed' && booking.payment_status === 'paid' && !handover.checkout_at) {
      buttons.push(`<button class="primary" onclick="RentalManage.startHandover('${esc(booking.id)}','checkout')">办理取车交接</button>`);
    }
    if(['active','overdue'].includes(booking.status) && handover.checkout_at && !handover.return_at) {
      buttons.push(`<button class="primary" onclick="RentalManage.startHandover('${esc(booking.id)}','return')">办理还车交接</button>`);
    }
    if(handover.checkout_at || handover.return_at) {
      const checkout = handover.checkout_at ? `取车：${esc(dateText(handover.checkout_at))} · ${esc(handover.checkout_mileage ?? '—')} mi · ${esc(handover.checkout_fuel_percent ?? '—')}%` : '';
      const returned = handover.return_at ? `<br>还车：${esc(dateText(handover.return_at))} · ${esc(handover.return_mileage ?? '—')} mi · ${esc(handover.return_fuel_percent ?? '—')}%` : '';
      actions.insertAdjacentHTML('beforebegin', `<section class="detail-card handover-summary"><h2>交接记录</h2><p>${checkout}${returned}</p></section>`);
    }
    if(buttons.length) actions.insertAdjacentHTML('afterbegin', buttons.join(''));
  }

  function startHandover(id, action) {
    const booking = state.bookings.find(item => String(item.id) === String(id)) || null;
    if(!booking) return;
    go('handover', { booking, handoverAction:action, handoverPhotos:[] });
  }

  function renderHandover() {
    const booking = state.booking;
    if(!booking) { state.screen='bookings'; return renderBookings(); }
    const returning = state.handoverAction === 'return';
    const record = booking.handover || {};
    const title = returning ? '办理还车交接' : '办理取车交接';
    const actionText = returning ? '确认还车并转为清洁中' : '确认取车并开始租用';
    const mileage = returning ? record.checkout_mileage || '' : '';
    const fuel = returning ? record.checkout_fuel_percent ?? 100 : 100;
    app.innerHTML = `${top(title)}<section class="detail-card"><h2>${esc(vehicleName(booking))}</h2><p>${esc(booking.booking_code || '')} · ${esc(booking.customer?.name || booking.customer_name || '')}</p><p>${returning ? '请核对还车车况。完成后车辆会自动变为清洁中。' : '请当面核对车辆、里程和油量后办理交车。'}</p></section><section class="form"><div class="grid"><label class="field">${returning ? '还车' : '取车'}里程（英里）<input id="handoverMileage" type="number" min="0" step="1" value="${esc(mileage)}" placeholder="必填"></label><label class="field">${returning ? '还车' : '取车'}油量 / 电量<select id="handoverFuel">${[[100,'满格 100%'],[75,'约 75%'],[50,'约一半 50%'],[25,'约 25%'],[0,'接近空 0%']].map(([id,label])=>`<option value="${id}" ${Number(fuel)===Number(id)?'selected':''}>${label}</option>`).join('')}</select></label></div>${returning ? `<label class="field">车辆状态<select id="handoverCondition"><option value="normal">正常</option><option value="attention">需要留意</option><option value="damage">发现损坏</option></select></label>` : ''}<label class="field">交接备注<textarea id="handoverNote" maxlength="1000" placeholder="可记录外观、钥匙、油量或客户确认事项"></textarea></label><label class="field">交接照片<input type="file" accept="image/*" multiple onchange="RentalManage.handoverPhotos(this.files)"></label><div id="handoverPhotos" class="photo-list"></div><p class="notice">照片会压缩上传，最多 8 张。</p><button id="handoverSave" class="button primary full" onclick="RentalManage.saveHandover('${esc(booking.id)}','${esc(state.handoverAction)}')">${actionText}</button></section>`;
    renderHandoverPhotos();
  }

  function renderHandoverPhotos() {
    const target = document.getElementById('handoverPhotos');
    if(target) target.innerHTML = state.handoverPhotos.map((photo,index) => `<div class="photo"><img src="${esc(photo)}" alt=""><button onclick="RentalManage.removeHandoverPhoto(${index})">×</button></div>`).join('');
  }

  async function addHandoverPhotos(files) {
    for(const file of Array.from(files || []).slice(0, 8 - state.handoverPhotos.length)) {
      const source = await new Promise((resolve,reject) => { const reader=new FileReader(); reader.onload=()=>resolve(reader.result); reader.onerror=reject; reader.readAsDataURL(file); });
      state.handoverPhotos.push(await compress(source));
    }
    renderHandoverPhotos();
  }

  async function saveHandover(id, action) {
    const mileageValue = value('handoverMileage');
    const mileage = Number(mileageValue);
    if(!mileageValue || !Number.isInteger(mileage) || mileage < 0) { alert('请填写正确的里程。'); return; }
    const button = document.getElementById('handoverSave');
    try {
      button.disabled=true; button.textContent='正在保存交接记录…';
      const photos=[]; for(const source of state.handoverPhotos) photos.push(await upload(source));
      const response = await api('/rest/v1/rpc/merchant_rental_manager_handover',{method:'POST',body:JSON.stringify({p_booking_id:id,p_action:action,p_mileage:mileage,p_fuel_percent:Number(value('handoverFuel')),p_condition:value('handoverCondition')||null,p_note:value('handoverNote')||null,p_photos:photos})});
      const data = await response.json().catch(()=>({}));
      if(!response.ok) {
        const message=String(data?.message||'');
        alert(message.includes('payment_required') ? '客户尚未付款，暂时不能办理取车。' : message.includes('return_mileage_invalid') ? '还车里程不能低于取车里程。' : '交接保存失败，请检查信息后重试。');
        return;
      }
      await loadManager('bookings');
      state.booking=state.bookings.find(item=>String(item.id)===String(id))||null;
      state.screen='booking';
      renderBookingWithHandover();
      alert(action==='return' ? '还车已完成，车辆已转为清洁中。' : '取车交接已完成，车辆已开始租用。');
    } finally { if(button){button.disabled=false;button.textContent=action==='return'?'确认还车并转为清洁中':'确认取车并开始租用';} }
  }

  function bookingCard(booking) {
    return `<article class="booking-card"><div class="booking-card-main" onclick="RentalManage.openBooking('${esc(booking.id)}')"><div class="booking-avatar">${booking.customer?.avatar ? `<img src="${esc(booking.customer.avatar)}" alt="">` : esc((booking.customer_name || '?').slice(0,1))}</div><div><div><span class="booking-pill ${esc(booking.status)}">${esc(statusText(booking.status))}</span><b>${esc(booking.customer?.name || booking.customer_name)}</b></div><p>${esc(vehicleName(booking))} · ${esc(dateText(booking.starts_at))}</p><small>${esc(booking.booking_code)} · ${money(booking.total_amount)}</small></div></div>${booking.status === 'pending' ? `<button class="primary small" onclick="RentalManage.confirm('${esc(booking.id)}')">确认预约</button>` : '<button class="chevron" onclick="RentalManage.openBooking(\''+esc(booking.id)+'\')">›</button>'}</article>`;
  }

  function renderBookings() {
    const filters = [['all','全部'],['pending','待确认'],['confirmed','已确认'],['active','租用中'],['finance','财务']];
    const filtered = state.bookings.filter(item => {
      if(state.vehicleFilter && String(item.vehicle_id) !== String(state.vehicleFilter)) return false;
      if(state.bookingFilter === 'all') return true;
      if(state.bookingFilter === 'finance') return true;
      return item.status === state.bookingFilter;
    });
    app.innerHTML = `${top(state.bookingFilter === 'finance' ? '财务与押金' : '预约管理')}<div class="actions"><button class="secondary" onclick="RentalManage.back()">← 返回上一页</button><button class="secondary" onclick="RentalManage.reload()">刷新</button></div><div class="filter-row">${filters.map(([id,label]) => `<button class="${state.bookingFilter === id ? 'selected' : ''}" onclick="RentalManage.bookings('${id}')">${label}</button>`).join('')}</div>${filtered.length ? filtered.map(bookingCard).join('') : '<div class="empty">没有符合条件的预约。</div>'}<div class="footer-space"></div>`;
  }

  function line(label, amount, tone='') { return `<div class="finance-line ${tone}"><span>${esc(label)}</span><b>${money(amount)}</b></div>`; }
  function renderBookingDetail() {
    const booking = state.booking;
    if(!booking) return renderBookings();
    const extras = Array.isArray(booking.rental_addons) ? booking.rental_addons : [];
    const canConfirm = booking.status === 'pending';
    app.innerHTML = `${top('预约详情')}<section class="booking-detail-head"><div>${vehiclePhoto(booking.vehicle)}</div><section><span class="booking-pill ${esc(booking.status)}">${esc(statusText(booking.status))}</span><h1>${esc(vehicleName(booking))}</h1><p>${esc(booking.booking_code)}</p></section></section><section class="detail-card"><h2>客户与预约</h2><p><b>${esc(booking.customer?.name || booking.customer_name)}</b><span>${esc(booking.customer_phone || '')}</span></p><p>${esc(dateText(booking.starts_at))} 至 ${esc(dateText(booking.ends_at))}</p><small>${esc(booking.customer_email || '未填写邮箱')}</small></section><section class="detail-card"><h2>金额</h2>${line('车辆租金',booking.base_amount)}${extras.map(item => line(item.name || '增值服务',item.amount ?? item.price)).join('')}${line('会员减免',-Number(booking.member_discount_amount || 0),'discount')}${line('优惠减免',-Number(booking.coupon_discount_amount || 0),'discount')}${line('损坏费用',booking.damage_amount,'charge')}${line('违章费用',booking.violation_amount,'charge')}<div class="finance-total"><span>应收合计</span><b>${money(booking.total_amount)}</b></div></section><section class="detail-card"><h2>收款与押金</h2><p>收款状态：<b>${esc(paymentText(booking.payment_status))}</b></p><p>押金状态：<b>${esc(depositText(booking.deposit_status))}</b></p><p>${esc(booking.payment_method || '尚未登记支付方式')}${booking.payment_reference ? ` · ${esc(booking.payment_reference)}` : ''}</p></section>${booking.financial_note ? `<section class="detail-card"><h2>商家备注</h2><p>${esc(booking.financial_note)}</p></section>` : ''}<div class="ops-detail-actions">${canConfirm ? `<button class="primary" onclick="RentalManage.confirm('${esc(booking.id)}')">确认预约</button>` : ''}<button class="secondary" onclick="RentalManage.finance('${esc(booking.id)}')">收款 / 押金 / 减免</button><button class="secondary" onclick="RentalManage.reprice('${esc(booking.id)}')">调整租期并重新计价</button></div><div class="footer-space"></div>`;
  }

  async function confirmBooking(id) {
    if(!confirm('确认这笔预约吗？客户会立即看到“已确认”。')) return;
    const response = await api('/rest/v1/rpc/merchant_rental_manager_confirm_booking',{ method:'POST', body:JSON.stringify({ p_booking_id:id, p_note:null }) });
    if(!response.ok) { const error=await response.json().catch(()=>({})); alert(String(error?.message||'').includes('payment_required') ? '客户尚未付款，暂时不能确认预约。' : '确认失败，请刷新后重试。'); return; }
    await loadManager(state.screen === 'booking' ? 'bookings' : state.screen);
    if(state.screen === 'bookings') openBooking(id);
  }

  function renderFinance() {
    const booking = state.booking;
    if(!booking) return renderBookings();
    app.innerHTML = `${top('收款与押金')}<section class="detail-card"><h2>${esc(booking.booking_code)} · ${esc(vehicleName(booking))}</h2><p>当前应收：<b>${money(booking.total_amount)}</b></p></section><section class="form"><div class="grid"><label class="field">收款状态<select id="financePayment"><option value="pending" ${booking.payment_status === 'pending' ? 'selected' : ''}>待收款</option><option value="paid" ${booking.payment_status === 'paid' ? 'selected' : ''}>已收款</option><option value="refunded" ${booking.payment_status === 'refunded' ? 'selected' : ''}>已退款</option><option value="partial_refund" ${booking.payment_status === 'partial_refund' ? 'selected' : ''}>部分退款</option><option value="waived" ${booking.payment_status === 'waived' ? 'selected' : ''}>已免除</option></select></label><label class="field">押金状态<select id="financeDeposit">${[['not_collected','未收取'],['authorized','已预授权'],['collected','已收取'],['released','已释放'],['forfeited','已扣除'],['refunded','已退回']].map(([id,label])=>`<option value="${id}" ${booking.deposit_status === id ? 'selected' : ''}>${label}</option>`).join('')}</select></label><label class="field">支付方式<input id="financeMethod" maxlength="40" value="${esc(booking.payment_method || '')}" placeholder="现金、刷卡、线上等"></label><label class="field">交易编号（选填）<input id="financeReference" maxlength="120" value="${esc(booking.payment_reference || '')}"></label></div><h2>减免与补收</h2><div class="grid"><label class="field">会员减免<input id="financeMember" inputmode="decimal" value="${esc(booking.member_discount_amount || 0)}"></label><label class="field">优惠券减免<input id="financeCoupon" inputmode="decimal" value="${esc(booking.coupon_discount_amount || 0)}"></label><label class="field">损坏费用<input id="financeDamage" inputmode="decimal" value="${esc(booking.damage_amount || 0)}"></label><label class="field">违章费用<input id="financeViolation" inputmode="decimal" value="${esc(booking.violation_amount || 0)}"></label></div><label class="field">财务备注<textarea id="financeNote" maxlength="800" placeholder="例如：现金收取、押金退款说明或违章编号">${esc(booking.financial_note || '')}</textarea></label><button class="button primary full" onclick="RentalManage.saveFinance('${esc(booking.id)}')">保存并重新计算应收金额</button></section>`;
  }

  async function saveFinance(id) {
    const response = await api('/rest/v1/rpc/merchant_rental_manager_save_finance',{ method:'POST', body:JSON.stringify({ p_booking_id:id, p_payment_status:value('financePayment'), p_deposit_status:value('financeDeposit'), p_payment_method:value('financeMethod'), p_payment_reference:value('financeReference'), p_member_discount:parseNumber('financeMember'), p_coupon_discount:parseNumber('financeCoupon'), p_damage_amount:parseNumber('financeDamage'), p_violation_amount:parseNumber('financeViolation'), p_note:value('financeNote') || null }) });
    if(!response.ok) { alert('财务信息保存失败，请检查后重试。'); return; }
    await loadManager('bookings'); openBooking(id); alert('财务信息已保存，应收金额已更新。');
  }

  function renderReprice() {
    const booking = state.booking;
    if(!booking) return renderBookings();
    app.innerHTML = `${top('调整租期与重新计价')}<section class="detail-card"><h2>${esc(booking.booking_code)}</h2><p>修改后会按当前车辆价格重新计算；已确认预约会回到等待确认状态。</p></section><section class="form"><label class="field">新的取车时间<input id="repriceStart" type="datetime-local" value="${esc(local(booking.starts_at))}"></label><label class="field">新的还车时间<input id="repriceEnd" type="datetime-local" value="${esc(local(booking.ends_at))}"></label><label class="field">调整备注<textarea id="repriceNote" maxlength="800" placeholder="例如：客户要求延长一天">${esc(booking.operator_note || '')}</textarea></label><button class="button primary full" onclick="RentalManage.saveReprice('${esc(booking.id)}')">重新计算并保存</button></section>`;
  }

  async function saveReprice(id) {
    const response = await api('/rest/v1/rpc/merchant_rental_manager_reprice_booking',{ method:'POST', body:JSON.stringify({ p_booking_id:id, p_starts_at:new Date(value('repriceStart')).toISOString(), p_ends_at:new Date(value('repriceEnd')).toISOString(), p_note:value('repriceNote') || null }) });
    if(!response.ok) { const data = await response.json().catch(()=>({})); alert(String(data.message || '').includes('unavailable') ? '该车辆在新时间段已有其他预约。' : '重新计价失败，请检查租期。'); return; }
    await loadManager('bookings'); openBooking(id); alert('租期和金额已更新，请重新确认预约。');
  }

  function renderVehicleEditor(vehicleId) {
    const vehicle = vehicleId ? state.vehicles.find(row => String(row.id) === String(vehicleId)) : null;
    state.photos = Array.isArray(vehicle?.photos) ? vehicle.photos.slice() : [];
    const selectedAddonIds = (vehicle?.addons || []).filter(item => item.service_type === 'addon').map(item => String(item.id));
    const selectedInsuranceId = (vehicle?.addons || []).find(item => item.service_type === 'insurance')?.id || '';
    const addOns = state.services.filter(item => item.service_type === 'addon' && item.is_active !== false);
    const insurance = state.services.filter(item => item.service_type === 'insurance' && item.is_active !== false);
    app.innerHTML = `${top(vehicle ? '编辑车辆' : '添加车辆')}<div class="actions"><button class="secondary" onclick="RentalManage.vehicles()">← 返回车队</button><button class="secondary" onclick="RentalManage.services('addon')">增值服务</button><button class="secondary" onclick="RentalManage.services('insurance')">保险服务</button></div><section class="form"><label class="field">车辆名称<input id="vName" maxlength="80" value="${esc(vehicle?.name || '')}" placeholder="例如：2024 Toyota Camry"></label><div class="grid"><label class="field">品牌<input id="vMake" maxlength="50" value="${esc(vehicle?.make || '')}"></label><label class="field">车型<input id="vModel" maxlength="50" value="${esc(vehicle?.model || '')}"></label><label class="field">年份<input id="vYear" type="number" min="1900" max="2100" value="${esc(vehicle?.year || '')}"></label><label class="field">座位数<input id="vSeats" type="number" min="1" max="30" value="${esc(vehicle?.seats || 5)}"></label><label class="field">行李数量<input id="vLuggage" type="number" min="0" max="20" value="${esc(vehicle?.luggage_count ?? 2)}"></label><label class="field">燃油<select id="vFuel">${['汽油','柴油','纯电','混动'].map(item => `<option ${vehicle?.fuel_type === item ? 'selected' : ''}>${item}</option>`).join('')}</select></label><label class="field">档位<select id="vTransmission">${['自动挡','手动挡'].map(item => `<option ${vehicle?.transmission === item ? 'selected' : ''}>${item}</option>`).join('')}</select></label><label class="field">车辆状态<select id="vStatus">${[['available','可预约'],['cleaning','清洁中'],['maintenance','维修中'],['inactive','下架']].map(item => `<option value="${item[0]}" ${vehicle?.status === item[0] ? 'selected' : ''}>${item[1]}</option>`).join('')}</select></label></div><div class="grid"><label class="field">租赁方式<select id="vPricing"><option value="day" ${vehicle?.pricing_mode === 'day' || !vehicle?.pricing_mode ? 'selected' : ''}>按天</option><option value="hour" ${vehicle?.pricing_mode === 'hour' ? 'selected' : ''}>按小时</option><option value="both" ${vehicle?.pricing_mode === 'both' ? 'selected' : ''}>按天和按小时</option></select></label><label class="field">日租价格<input id="vDay" inputmode="decimal" value="${esc(vehicle?.daily_rate ?? 0)}"></label><label class="field">小时价格<input id="vHour" inputmode="decimal" value="${esc(vehicle?.hourly_rate ?? 0)}"></label><label class="field">最少小时数<input id="vMin" type="number" min="1" value="${esc(vehicle?.minimum_hours ?? 1)}"></label><label class="field">押金<input id="vDeposit" inputmode="decimal" value="${esc(vehicle?.deposit_amount ?? 0)}"></label></div><label class="field">取车地点<input id="vAddress" maxlength="180" value="${esc(vehicle?.pickup_address || state.merchant?.address || '')}"></label><label class="field">车辆介绍<textarea id="vDescription" maxlength="600">${esc(vehicle?.description || '')}</textarea></label><label class="field">车辆图片<input type="file" accept="image/*" multiple onchange="RentalManage.photos(this.files)"></label><div id="photos" class="photo-list"></div><div class="notice">图片会压缩上传，第一张为车辆封面。</div><div class="section-title"><b>增值服务</b><button class="button secondary" onclick="RentalManage.services('addon')">添加增值服务</button></div><div class="card">${addOns.length ? addOns.map(item => `<label class="library-row"><input type="checkbox" data-addon-id="${esc(item.id)}" ${selectedAddonIds.includes(String(item.id)) ? 'checked' : ''}><span><b>${esc(item.name)}</b><small>${esc(item.description || '')} · ${money(item.price)}${item.unit === 'day' ? '/天' : '/次'}</small></span></label>`).join('') : '<div class="notice">尚未添加增值服务。</div>'}</div><div class="section-title"><b>保险服务</b><button class="button secondary" onclick="RentalManage.services('insurance')">添加保险服务</button></div><label class="field">为这辆车选择保险<select id="vInsurance"><option value="">暂不提供</option>${insurance.map(item => `<option value="${esc(item.id)}" ${String(selectedInsuranceId) === String(item.id) ? 'selected' : ''}>${esc(item.name)} · ${money(item.price)}${item.unit === 'day' ? '/天' : '/次'}</option>`).join('')}</select></label><button id="vehicleSave" class="button primary full" onclick="RentalManage.saveVehicle('${esc(vehicle?.id || '')}')">保存车辆</button></section>`;
    const vehicleMetaGrid = app.querySelector('.form > .grid');
    if(vehicleMetaGrid) vehicleMetaGrid.insertAdjacentHTML('beforeend', `<label class="field">车辆类别<select id="vType">${['紧凑','标准','SUV','VAN','皮卡'].map(item => `<option ${String(vehicle?.vehicle_type || '标准') === item ? 'selected' : ''}>${item}</option>`).join('')}</select></label>`);
    renderPhotos();
    [...app.querySelectorAll('.section-title b')].forEach(heading => {
      if(heading.textContent.includes('税率和服务费')) heading.textContent='税务与服务费';
    });
  }

  function renderVehicles() { const cards = state.vehicles.length ? state.vehicles.map(vehicle => `<article class="card"><div class="vehicle">${vehiclePhoto(vehicle)}<div class="vehicle-info"><b>${esc(vehicle.name)}</b><p>${esc([vehicle.year, vehicle.make, vehicle.model, `${vehicle.seats || 5}座`].filter(Boolean).join(' · '))}</p><em>${rateText(vehicle)}</em></div><i class="status">${esc(({available:'可预约',cleaning:'清洁中',maintenance:'维修中',inactive:'已下架'}[vehicle.status]) || vehicle.status)}</i></div><div class="card-actions"><button class="primary" onclick="RentalManage.editVehicle('${esc(vehicle.id)}')">编辑车辆</button><button onclick="RentalManage.toggleVehicle('${esc(vehicle.id)}')">${vehicle.status === 'inactive' ? '重新上架' : '下架'}</button></div></article>`).join('') : '<div class="empty">还没有车辆。添加后会自动出现在客户租车页面。</div>'; app.innerHTML = `${top('车队管理')}<div class="actions"><button class="secondary" onclick="RentalManage.home()">← 返回后台</button><button class="primary" onclick="RentalManage.editVehicle()">＋ 添加车辆</button></div><div class="section-title"><b>车辆 ${state.vehicles.length}</b><span>第一张图片作为客户封面</span></div>${cards}<div class="footer-space"></div>`; }
  function renderPhotos() { const target = document.getElementById('photos'); if(target) target.innerHTML = state.photos.map((photo, index) => `<div class="photo"><img src="${esc(photo)}" alt=""><button onclick="RentalManage.removePhoto(${index})">×</button></div>`).join(''); }
  async function addPhotos(files) { for(const file of Array.from(files || []).slice(0, 8 - state.photos.length)) { const original = await new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); }); state.photos.push(await compress(original)); } renderPhotos(); }
  async function compress(dataUrl) { const image = await new Promise((resolve,reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = dataUrl; }); const scale = Math.min(1, 1440 / Math.max(image.width,image.height)); const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale); canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height); return canvas.toDataURL('image/jpeg',.78); }
  async function upload(source) { if(!String(source).startsWith('data:')) return source; const blob = await (await fetch(source)).blob(); const response = await fetch(`${MEDIA_URL}/upload`, { method:'POST', headers:{ Authorization:`Bearer ${getSession()?.access_token || ''}`, 'Content-Type':blob.type, 'x-media-kind':'products' }, body:blob }); const result = await response.json().catch(() => ({})); if(!response.ok || !result.url) throw new Error(result.error || 'media_upload_failed'); return result.url; }
  async function saveVehicle(vehicleId) { const name = value('vName'); if(!name) { alert('请填写车辆名称'); return; } const button = document.getElementById('vehicleSave'); try { button.disabled=true; button.textContent='正在保存…'; const photos=[]; for(const source of state.photos) photos.push(await upload(source)); const payload={ id:vehicleId||undefined,name,make:value('vMake'),model:value('vModel'),year:value('vYear'),seats:value('vSeats'),transmission:value('vTransmission'),fuel_type:value('vFuel'),pricing_mode:value('vPricing'),daily_rate:value('vDay'),hourly_rate:value('vHour'),minimum_hours:value('vMin'),deposit_amount:value('vDeposit'),pickup_address:value('vAddress'),status:value('vStatus'),description:value('vDescription'),photos }; const vehicleResponse=await api('/rest/v1/rpc/merchant_rental_save_vehicle',{method:'POST',body:JSON.stringify({p_merchant_user_id:state.merchantId,p_vehicle:payload})}); const raw=await vehicleResponse.json().catch(()=>null); const saved=Array.isArray(raw)?raw[0]:raw; if(!vehicleResponse.ok||!saved?.id) throw new Error('vehicle_save_failed'); const addonIds=Array.from(document.querySelectorAll('[data-addon-id]:checked')).map(item=>item.dataset.addonId).filter(Boolean); const services=await api('/rest/v1/rpc/merchant_rental_save_vehicle_services',{method:'POST',body:JSON.stringify({p_vehicle_id:saved.id,p_addon_service_ids:addonIds,p_insurance_service_id:value('vInsurance')||null})}); if(!services.ok) throw new Error('vehicle_services_save_failed'); const luggage=await api('/rest/v1/rpc/merchant_rental_save_vehicle_addons',{method:'POST',body:JSON.stringify({p_vehicle_id:saved.id,p_addons:[],p_luggage_count:Math.max(0,Math.min(20,Number(value('vLuggage')||2)))})}); if(!luggage.ok) throw new Error('vehicle_luggage_save_failed'); await loadManager('vehicles'); alert('车辆与已选择的服务已保存。'); } catch(error) { console.warn('保存车辆失败:',error.message); alert(error.message.includes('services') ? '服务保存失败，请刷新服务库后重新勾选。' : '车辆保存失败，请稍后重试。'); } finally { if(button) { button.disabled=false;button.textContent='保存车辆'; } } }
  async function toggleVehicle(id) { const vehicle=state.vehicles.find(row=>String(row.id)===String(id)); if(!vehicle)return; const response=await api('/rest/v1/rpc/merchant_rental_save_vehicle',{method:'POST',body:JSON.stringify({p_merchant_user_id:state.merchantId,p_vehicle:{...vehicle,status:vehicle.status==='inactive'?'available':'inactive'}})}); if(!response.ok){alert('车辆状态更新失败');return;} loadManager('vehicles'); }

  function renderServices(type='addon') { const label=type==='insurance'?'保险服务':'增值服务'; const list=state.services.filter(item=>item.service_type===type); app.innerHTML=`${top(label)}<div class="actions"><button class="secondary" onclick="RentalManage.home()">← 返回后台</button><button class="primary" onclick="RentalManage.editService('${type}')">＋ 添加${label}</button></div><div class="notice">${label}为全店公用项目。车辆只需勾选，无需重复填写。</div>${list.length?list.map(item=>`<article class="card"><b>${esc(item.name)}</b><p>${esc(item.description||'暂无说明')}</p><em>${money(item.price)}${item.unit==='day'?'/天':'/次'}</em><div class="card-actions"><button class="primary" onclick="RentalManage.editService('${type}','${esc(item.id)}')">编辑</button><button onclick="RentalManage.toggleService('${esc(item.id)}')">${item.is_active===false?'重新启用':'暂停'}</button></div></article>`).join(''):'<div class="empty">还没有服务项目。</div>'}`; }
  function editService(type,id) { state.serviceType=type; state.editingServiceId=id||''; const item=id?state.services.find(row=>String(row.id)===String(id)):null; const label=type==='insurance'?'保险服务':'增值服务'; app.innerHTML=`${top(`编辑${label}`)}<div class="actions"><button class="secondary" onclick="RentalManage.services('${type}')">← 返回${label}</button></div><section class="form"><label class="field">名称<input id="sName" maxlength="80" value="${esc(item?.name||'')}"></label><label class="field">说明<textarea id="sDescription" maxlength="180">${esc(item?.description||'')}</textarea></label><div class="grid"><label class="field">价格<input id="sPrice" inputmode="decimal" value="${esc(item?.price??'')}"></label><label class="field">收费方式<select id="sUnit"><option value="once" ${item?.unit==='once'?'selected':''}>每次</option><option value="day" ${item?.unit==='day'?'selected':''}>每天</option></select></label></div><button class="button primary full" onclick="RentalManage.saveService('${type}','${esc(item?.id||'')}')">保存${label}</button></section>`; }
  async function saveService(type,id) { const name=value('sName'); if(!name){alert('请填写名称');return;} const response=await api('/rest/v1/rpc/merchant_rental_save_shared_service',{method:'POST',body:JSON.stringify({p_service:{id:id||undefined,merchant_user_id:state.merchantId,service_type:type,name,description:value('sDescription'),price:value('sPrice')||0,unit:value('sUnit'),is_active:true}})}); if(!response.ok){alert('服务保存失败');return;} await loadManager('services'); renderServices(type); }
  async function toggleService(id) { const item=state.services.find(row=>String(row.id)===String(id)); if(!item)return; const response=await api('/rest/v1/rpc/merchant_rental_save_shared_service',{method:'POST',body:JSON.stringify({p_service:{...item,merchant_user_id:state.merchantId,is_active:item.is_active===false}})}); if(!response.ok){alert('服务状态更新失败');return;} await loadManager('services'); renderServices(item.service_type); }

  // Service selection is separated by customer choice: add-ons and insurance are optional,
  // while tax and required service rows are included automatically in every quote.
  function serviceLabel(type) { return type === 'insurance' ? '保险服务' : type === 'fixed' ? '税务与服务费' : '增值服务'; }
  function renderVehicleEditor(vehicleId) {
    const vehicle = vehicleId ? state.vehicles.find(row => String(row.id) === String(vehicleId)) : null;
    state.photos = Array.isArray(vehicle?.photos) ? vehicle.photos.slice() : [];
    const selectedIds = new Set((vehicle?.addons || []).map(item => String(item.id)));
    const optional = state.services.filter(item => ['addon','insurance'].includes(item.service_type) && item.is_active !== false);
    const fixed = state.services.filter(item => item.service_type === 'fixed' && item.is_active !== false);
    const row = (item, required) => `<label class="library-row"><input type="checkbox" ${required ? 'data-fixed-id' : 'data-service-id'}="${esc(item.id)}" ${selectedIds.has(String(item.id)) ? 'checked' : ''}><span><b>${esc(item.name)}</b><small>${esc(item.description || '')} · ${item.calculation_type === 'percent' ? `${Number(item.price || 0)}%` : money(item.price)}${item.calculation_type === 'percent' ? '' : item.unit === 'day' ? '/天' : '/次'}</small></span></label>`;
    app.innerHTML = `${top(vehicle ? '编辑车辆' : '添加车辆')}<div class="actions"><button class="secondary" onclick="RentalManage.vehicles()">← 返回车队</button><button class="secondary" onclick="RentalManage.services('addon')">服务库</button></div><section class="form"><label class="field">车辆名称<input id="vName" maxlength="80" value="${esc(vehicle?.name || '')}" placeholder="例如：2024 Toyota Camry"></label><div class="grid"><label class="field">品牌<input id="vMake" maxlength="50" value="${esc(vehicle?.make || '')}"></label><label class="field">车型<input id="vModel" maxlength="50" value="${esc(vehicle?.model || '')}"></label><label class="field">年份<input id="vYear" type="number" min="1900" max="2100" value="${esc(vehicle?.year || '')}"></label><label class="field">座位数<input id="vSeats" type="number" min="1" max="30" value="${esc(vehicle?.seats || 5)}"></label><label class="field">行李数量<input id="vLuggage" type="number" min="0" max="20" value="${esc(vehicle?.luggage_count ?? 2)}"></label><label class="field">燃油<select id="vFuel">${['汽油','柴油','纯电','混动'].map(item => `<option ${vehicle?.fuel_type === item ? 'selected' : ''}>${item}</option>`).join('')}</select></label><label class="field">档位<select id="vTransmission">${['自动挡','手动挡'].map(item => `<option ${vehicle?.transmission === item ? 'selected' : ''}>${item}</option>`).join('')}</select></label><label class="field">车辆状态<select id="vStatus">${[['available','可预约'],['cleaning','清洁中'],['maintenance','维修中'],['inactive','下架']].map(item => `<option value="${item[0]}" ${vehicle?.status === item[0] ? 'selected' : ''}>${item[1]}</option>`).join('')}</select></label></div><div class="grid"><label class="field">租赁方式<select id="vPricing"><option value="day" ${vehicle?.pricing_mode === 'day' || !vehicle?.pricing_mode ? 'selected' : ''}>按天</option><option value="hour" ${vehicle?.pricing_mode === 'hour' ? 'selected' : ''}>按小时</option><option value="both" ${vehicle?.pricing_mode === 'both' ? 'selected' : ''}>按天和按小时</option></select></label><label class="field">日租价格<input id="vDay" inputmode="decimal" value="${esc(vehicle?.daily_rate ?? 0)}"></label><label class="field">小时价格<input id="vHour" inputmode="decimal" value="${esc(vehicle?.hourly_rate ?? 0)}"></label><label class="field">最少小时数<input id="vMin" type="number" min="1" value="${esc(vehicle?.minimum_hours ?? 1)}"></label><label class="field">押金<input id="vDeposit" inputmode="decimal" value="${esc(vehicle?.deposit_amount ?? 0)}"></label></div><label class="field">取车地点<input id="vAddress" maxlength="180" value="${esc(vehicle?.pickup_address || state.merchant?.address || '')}"></label><label class="field">车辆介绍<textarea id="vDescription" maxlength="600">${esc(vehicle?.description || '')}</textarea></label><label class="field">车辆图片<input type="file" accept="image/*" multiple onchange="RentalManage.photos(this.files)"></label><div id="photos" class="photo-list"></div><div class="notice">图片会压缩上传，第一张为车辆封面。</div><div class="section-title"><b>客户可选的增值服务和保险</b><button class="button secondary" onclick="RentalManage.services('addon')">编辑服务库</button></div><div class="card">${optional.length ? optional.map(item => row(item,false)).join('') : '<div class="notice">尚未添加可选服务或保险。</div>'}</div><div class="section-title"><b>强制计入的税率和服务费</b><button class="button secondary" onclick="RentalManage.services('fixed')">添加税率 / 服务费</button></div><div class="notice">此处勾选后，客户无法取消，系统会自动加入报价。</div><div class="card">${fixed.length ? fixed.map(item => row(item,true)).join('') : '<div class="notice">尚未添加税率或固定服务费。</div>'}</div><button id="vehicleSave" class="button primary full" onclick="RentalManage.saveVehicle('${esc(vehicle?.id || '')}')">保存车辆</button></section>`;
    const vehicleMetaGrid = app.querySelector('.form > .grid');
    if(vehicleMetaGrid) vehicleMetaGrid.insertAdjacentHTML('beforeend', `<label class="field">车辆类别<select id="vType">${['紧凑','标准','SUV','VAN','皮卡'].map(item => `<option ${String(vehicle?.vehicle_type || '标准') === item ? 'selected' : ''}>${item}</option>`).join('')}</select></label>`);
    renderPhotos();
  }
  async function saveVehicle(vehicleId) {
    const name=value('vName'); if(!name){alert('请填写车辆名称');return;}
    const button=document.getElementById('vehicleSave');
    try {
      button.disabled=true; button.textContent='正在保存…';
      const photos=[]; for(const source of state.photos) photos.push(await upload(source));
      const payload={id:vehicleId||undefined,name,make:value('vMake'),model:value('vModel'),year:value('vYear'),vehicle_type:value('vType')||'标准',seats:value('vSeats'),transmission:value('vTransmission'),fuel_type:value('vFuel'),pricing_mode:value('vPricing'),daily_rate:value('vDay'),hourly_rate:value('vHour'),minimum_hours:value('vMin'),deposit_amount:value('vDeposit'),pickup_address:value('vAddress'),status:value('vStatus'),description:value('vDescription'),photos};
      const vehicleResponse=await api('/rest/v1/rpc/merchant_rental_save_vehicle',{method:'POST',body:JSON.stringify({p_merchant_user_id:state.merchantId,p_vehicle:payload})});
      const raw=await vehicleResponse.json().catch(()=>null); const saved=Array.isArray(raw)?raw[0]:raw;
      if(!vehicleResponse.ok||!saved?.id) throw new Error('vehicle_save_failed');
      const serviceIds=[...document.querySelectorAll('[data-service-id]:checked,[data-fixed-id]:checked')].map(item=>item.dataset.serviceId||item.dataset.fixedId).filter(Boolean);
      const services=await api('/rest/v1/rpc/merchant_rental_save_vehicle_services',{method:'POST',body:JSON.stringify({p_vehicle_id:saved.id,p_addon_service_ids:serviceIds,p_insurance_service_id:null})});
      if(!services.ok) throw new Error('vehicle_services_save_failed');
      const luggage=await api('/rest/v1/rpc/merchant_rental_save_vehicle_addons',{method:'POST',body:JSON.stringify({p_vehicle_id:saved.id,p_addons:[],p_luggage_count:Math.max(0,Math.min(20,Number(value('vLuggage')||2)))})});
      if(!luggage.ok) throw new Error('vehicle_luggage_save_failed');
      await loadManager('vehicles'); alert('车辆与服务设置已保存。');
    } catch(error) { console.warn('保存车辆失败:',error.message); alert(error.message.includes('services')?'服务保存失败，请刷新服务库后重新勾选。':'车辆保存失败，请稍后重试。'); }
    finally { if(button){button.disabled=false;button.textContent='保存车辆';} }
  }
  function renderServices(type='addon') {
    const label=serviceLabel(type); const list=state.services.filter(item=>item.service_type===type);
    app.innerHTML=`${top(label)}<div class="actions"><button class="secondary" onclick="RentalManage.home()">← 返回后台</button><button class="secondary" onclick="RentalManage.services('addon')">增值服务</button><button class="secondary" onclick="RentalManage.services('insurance')">保险服务</button><button class="secondary" onclick="RentalManage.services('fixed')">税率/服务费</button><button class="primary" onclick="RentalManage.editService('${type}')">＋ 添加</button></div><div class="notice">${type==='fixed'?'车辆勾选后将强制计入报价，客户不可取消。':'车辆勾选后，客户可在预约时自行选择。'}</div>${list.length?list.map(item=>`<article class="card"><b>${esc(item.name)}</b><p>${esc(item.description||'暂无说明')}</p><em>${item.calculation_type==='percent'?`${Number(item.price||0)}%`:`${money(item.price)}${item.unit==='day'?'/天':'/次'}`}</em><div class="card-actions"><button class="primary" onclick="RentalManage.editService('${type}','${esc(item.id)}')">编辑</button><button onclick="RentalManage.toggleService('${esc(item.id)}')">${item.is_active===false?'重新启用':'暂停'}</button></div></article>`).join(''):'<div class="empty">还没有服务项目。</div>'}`;
  }
  function editService(type,id) {
    state.serviceType=type; state.editingServiceId=id||''; const item=id?state.services.find(row=>String(row.id)===String(id)):null; const label=serviceLabel(type); const fixed=type==='fixed';
    app.innerHTML=`${top(`编辑${label}`)}<div class="actions"><button class="secondary" onclick="RentalManage.services('${type}')">← 返回${label}</button></div><section class="form"><label class="field">名称<input id="sName" maxlength="80" value="${esc(item?.name||'')}" placeholder="${fixed?'例如：洛杉矶租车税':'例如：儿童安全座椅'}"></label><label class="field">说明<textarea id="sDescription" maxlength="180">${esc(item?.description||'')}</textarea></label>${fixed?`<div class="grid"><label class="field">项目类型<select id="sKind"><option value="tax" ${item?.charge_kind==='tax'?'selected':''}>税率</option><option value="fee" ${item?.charge_kind==='fee'?'selected':''}>服务费</option></select></label><label class="field">计算方式<select id="sCalculation"><option value="percent" ${item?.calculation_type==='percent'?'selected':''}>百分比</option><option value="fixed" ${item?.calculation_type==='fixed'?'selected':''}>固定金额</option></select></label></div>`:''}<div class="grid"><label class="field">${fixed?'数值':'价格'}<input id="sPrice" inputmode="decimal" value="${esc(item?.price??'')}"></label><label class="field">收费方式<select id="sUnit"><option value="once" ${item?.unit==='once'?'selected':''}>每次</option><option value="day" ${item?.unit==='day'?'selected':''}>每天</option></select></label></div><button class="button primary full" onclick="RentalManage.saveService('${type}','${esc(item?.id||'')}')">保存${label}</button></section>`;
  }
  async function saveService(type,id) {
    const name=value('sName'); if(!name){alert('请填写名称');return;}
    const response=await api('/rest/v1/rpc/merchant_rental_save_shared_service',{method:'POST',body:JSON.stringify({p_service:{id:id||undefined,merchant_user_id:state.merchantId,service_type:type,name,description:value('sDescription'),price:value('sPrice')||0,unit:value('sUnit'),charge_kind:type==='fixed'?value('sKind'):'fee',calculation_type:type==='fixed'?value('sCalculation'):'fixed',is_active:true}})});
    if(!response.ok){alert('服务保存失败');return;} await loadManager('services'); renderServices(type);
  }

  // 5.357: paid reservations may be confirmed; a merchant cancellation requires a reason.
  function renderBookingDetail() {
    const booking=state.booking; if(!booking) return renderBookings();
    const extras=Array.isArray(booking.rental_addons)?booking.rental_addons:[];
    const canConfirm=booking.status==='pending' && booking.payment_status==='paid';
    const canCancel=['pending','confirmed'].includes(booking.status);
    app.innerHTML=`${top('预约详情')}<section class="booking-detail-head"><div>${vehiclePhoto(booking.vehicle)}</div><section><span class="booking-pill ${esc(booking.status)}">${esc(statusText(booking.status))}</span><h1>${esc(vehicleName(booking))}</h1><p>${esc(booking.booking_code)}</p></section></section><section class="detail-card"><h2>客户与预约</h2><p><b>${esc(booking.customer?.name||booking.customer_name)}</b><span>${esc(booking.customer_phone||'')}</span></p><p>${esc(dateText(booking.starts_at))} 至 ${esc(dateText(booking.ends_at))}</p><small>${esc(booking.customer_email||'未填写邮箱')}</small></section><section class="detail-card"><h2>金额</h2>${line('车辆租金',booking.base_amount)}${extras.map(item=>line(item.name||'增值服务',item.amount??item.price)).join('')}${line('会员减免',-Number(booking.member_discount_amount||0),'discount')}${line('优惠减免',-Number(booking.coupon_discount_amount||0),'discount')}${line('损坏费用',booking.damage_amount,'charge')}${line('违章费用',booking.violation_amount,'charge')}<div class="finance-total"><span>应收合计</span><b>${money(booking.total_amount)}</b></div></section><section class="detail-card"><h2>收款与押金</h2><p>收款状态：<b>${esc(paymentText(booking.payment_status))}</b></p><p>押金状态：<b>${esc(depositText(booking.deposit_status))}</b></p><p>${esc(booking.payment_method||'尚未登记支付方式')}${booking.payment_reference?` · ${esc(booking.payment_reference)}`:''}</p></section>${booking.refund_reason?`<section class="detail-card"><h2>取消与退款说明</h2><p>${esc(booking.refund_reason)}</p><p>退款金额：<b>${money(booking.refund_amount)}</b></p></section>`:''}${booking.financial_note?`<section class="detail-card"><h2>商家备注</h2><p>${esc(booking.financial_note)}</p></section>`:''}<div class="ops-detail-actions">${canConfirm?`<button class="primary" onclick="RentalManage.confirm('${esc(booking.id)}')">确认预约</button>`:''}${canCancel?`<button class="danger" onclick="RentalManage.cancelBooking('${esc(booking.id)}')">取消预约${booking.payment_status==='paid'?'并退款':''}</button>`:''}<button class="secondary" onclick="RentalManage.finance('${esc(booking.id)}')">收款 / 押金 / 减免</button><button class="secondary" onclick="RentalManage.reprice('${esc(booking.id)}')">调整租期并重新计价</button></div><div class="footer-space"></div>`;
  }
  async function cancelMerchantBooking(id) {
    const reason=prompt('请填写取消预约原因。该说明会展示给客户。');
    if(reason===null) return;
    if(!reason.trim()){ alert('请填写取消原因。'); return; }
    const response=await api('/rest/v1/rpc/merchant_rental_manager_cancel_booking',{method:'POST',body:JSON.stringify({p_booking_id:id,p_reason:reason.trim()})});
    const data=await response.json().catch(()=>({}));
    if(!response.ok){ alert(String(data?.message||'').includes('cancel_reason_required')?'请填写取消原因。':'取消预约失败，请稍后重试。'); return; }
    await loadManager('bookings'); state.booking=state.bookings.find(item=>String(item.id)===String(id))||data; renderBookingDetail();
  }

  const taskTypeText = type => type === 'maintenance' ? '维修任务' : '清洁任务';
  const taskStatusText = status => ({open:'待处理',in_progress:'处理中',completed:'已完成',cancelled:'已取消'}[status] || status);
  function renderTasks() {
    const active = state.tasks.filter(item => ['open','in_progress'].includes(item.status));
    const history = state.tasks.filter(item => !['open','in_progress'].includes(item.status));
    const taskCard = item => `<article class="task-card"><div class="task-card-head"><span class="task-type ${esc(item.task_type)}">${esc(taskTypeText(item.task_type))}</span><span class="task-status ${esc(item.status)}">${esc(taskStatusText(item.status))}</span></div><h2>${esc(item.title)}</h2><p><b>${esc(item.vehicle?.name || '车辆')}</b>${item.assignee_name ? ` · ${esc(item.assignee_name)}` : ''}</p><p>${esc(dateText(item.starts_at))} 至 ${esc(dateText(item.ends_at))}</p>${item.note ? `<small>${esc(item.note)}</small>` : ''}<div class="card-actions">${item.status === 'open' ? `<button class="primary" onclick="RentalManage.taskStatus('${esc(item.id)}','in_progress')">开始处理</button>` : ''}${item.status === 'in_progress' ? `<button class="primary" onclick="RentalManage.taskStatus('${esc(item.id)}','completed')">标记完成</button>` : ''}<button onclick="RentalManage.editTask('${esc(item.id)}')">${['open','in_progress'].includes(item.status) ? '编辑任务' : '查看记录'}</button>${['open','in_progress'].includes(item.status) ? `<button class="danger" onclick="RentalManage.taskStatus('${esc(item.id)}','cancelled')">取消</button>` : ''}</div></article>`;
    app.innerHTML = `${top('任务与排期')}<div class="actions"><button class="secondary" onclick="RentalManage.home()">← 返回后台</button><button class="secondary" onclick="RentalManage.schedule()">车辆日历</button><button class="primary" onclick="RentalManage.newTask()">＋ 新建任务</button></div><div class="notice">清洁与维修任务会自动占用对应时段。任务未完成时，该车辆不能重新开放预约。</div><div class="section-title"><b>待处理任务</b><span>${active.length} 项</span></div>${active.length ? active.map(taskCard).join('') : '<div class="empty compact">暂无待处理的清洁或维修任务。</div>'}<div class="section-title"><b>已结束记录</b><span>${history.length} 项</span></div>${history.length ? history.map(taskCard).join('') : '<div class="empty compact">暂无历史任务。</div>'}<div class="footer-space"></div>`;
  }

  function renderTaskEditor(taskId) {
    const task = taskId ? state.tasks.find(item => String(item.id) === String(taskId)) : null;
    const now = new Date(); const later = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const vehicleOptions = state.vehicles.map(vehicle => `<option value="${esc(vehicle.id)}" ${String(task?.vehicle_id || state.taskVehicleId || '') === String(vehicle.id) ? 'selected' : ''}>${esc(vehicle.name)}</option>`).join('');
    app.innerHTML = `${top(task ? '编辑任务' : '新建任务')}<div class="actions"><button class="secondary" onclick="RentalManage.tasks()">← 返回任务</button></div><section class="form"><div class="grid"><label class="field">任务类型<select id="taskType"><option value="cleaning" ${task?.task_type !== 'maintenance' ? 'selected' : ''}>清洁任务</option><option value="maintenance" ${task?.task_type === 'maintenance' ? 'selected' : ''}>维修任务</option></select></label><label class="field">状态<select id="taskStatus"><option value="open" ${task?.status === 'open' || !task ? 'selected' : ''}>待处理</option><option value="in_progress" ${task?.status === 'in_progress' ? 'selected' : ''}>处理中</option><option value="completed" ${task?.status === 'completed' ? 'selected' : ''}>已完成</option><option value="cancelled" ${task?.status === 'cancelled' ? 'selected' : ''}>已取消</option></select></label></div><label class="field">车辆<select id="taskVehicle">${vehicleOptions}</select></label><label class="field">任务名称<input id="taskTitle" maxlength="100" value="${esc(task?.title || '')}" placeholder="例如：常规内外清洁、前轮胎检查"></label><label class="field">负责人（选填）<input id="taskAssignee" maxlength="80" value="${esc(task?.assignee_name || '')}" placeholder="例如：张师傅"></label><div class="grid"><label class="field">开始时间<input id="taskStart" type="datetime-local" value="${esc(local(task?.starts_at || now))}"></label><label class="field">预计完成<input id="taskEnd" type="datetime-local" value="${esc(local(task?.ends_at || later))}"></label></div><label class="field">任务备注<textarea id="taskNote" maxlength="1000" placeholder="可记录要处理的问题、耗材或交接说明">${esc(task?.note || '')}</textarea></label><button class="button primary full" onclick="RentalManage.saveTask('${esc(task?.id || '')}')">保存任务</button></section>`;
  }

  async function saveTask(id) {
    const vehicleId = value('taskVehicle');
    const starts = value('taskStart'); const ends = value('taskEnd');
    if(!vehicleId || !starts || !ends || new Date(ends) <= new Date(starts)) { alert('请填写车辆和正确的开始、完成时间。'); return; }
    const response = await api('/rest/v1/rpc/merchant_rental_manager_save_vehicle_task', { method:'POST', body:JSON.stringify({ p_task:{ id:id || undefined, vehicle_id:vehicleId, task_type:value('taskType'), status:value('taskStatus'), title:value('taskTitle'), assignee_name:value('taskAssignee'), starts_at:new Date(starts).toISOString(), ends_at:new Date(ends).toISOString(), note:value('taskNote') } }) });
    const data = await response.json().catch(()=>({}));
    if(!response.ok) { alert(String(data?.message || '').includes('invalid_task_time') ? '任务结束时间必须晚于开始时间。' : '任务保存失败，请稍后重试。'); return; }
    await loadManager('tasks'); alert('任务已保存，车辆排期已同步更新。');
  }

  async function saveTaskStatus(id, status) {
    const task = state.tasks.find(item => String(item.id) === String(id));
    if(!task) return;
    const response = await api('/rest/v1/rpc/merchant_rental_manager_save_vehicle_task', { method:'POST', body:JSON.stringify({ p_task:{ ...task, status, starts_at:task.starts_at, ends_at:task.ends_at } }) });
    if(!response.ok) { alert('任务状态更新失败，请稍后重试。'); return; }
    await loadManager('tasks');
  }

  function renderSchedule() {
    const today = new Date(); today.setHours(0,0,0,0);
    const days = Array.from({length:14}, (_,index) => new Date(today.getTime() + index * 86400000));
    const dayEnd = date => new Date(date.getTime() + 86400000);
    const isInDay = (start,end,date) => new Date(start) < dayEnd(date) && new Date(end) > date;
    const bookingEvents = state.bookings.filter(item => !['cancelled','rejected'].includes(item.status));
    const taskEvents = state.tasks.filter(item => item.status !== 'cancelled');
    const dateLabel = date => new Intl.DateTimeFormat('zh-CN',{month:'numeric',day:'numeric',weekday:'short'}).format(date);
    const dayCard = date => {
      const events = [
        ...bookingEvents.filter(item=>isInDay(item.starts_at,item.ends_at,date)).map(item=>({id:item.id,kind:'booking',title:`${item.vehicle?.name || '车辆'} · ${item.customer?.name || item.customer_name}`,detail:`${statusText(item.status)} · ${dateText(item.starts_at)}`})),
        ...taskEvents.filter(item=>isInDay(item.starts_at,item.ends_at,date)).map(item=>({id:item.id,kind:item.task_type,title:`${item.vehicle?.name || '车辆'} · ${item.title}`,detail:`${taskStatusText(item.status)} · ${dateText(item.ends_at)} 前`}))
      ];
      return `<section class="schedule-day"><h2>${esc(dateLabel(date))}</h2>${events.length ? events.map(event=>`<button class="schedule-event ${esc(event.kind)}" onclick="RentalManage.openScheduleEvent('${esc(event.kind)}','${esc(event.id)}')"><b>${esc(event.title)}</b><span>${esc(event.detail)}</span><i>›</i></button>`).join('') : '<p class="schedule-empty">暂无预约或任务</p>'}</section>`;
    };
    app.innerHTML = `${top('车辆日历')}<div class="actions"><button class="secondary" onclick="RentalManage.back()">← 返回上一页</button><button class="secondary" onclick="RentalManage.tasks()">任务单</button><button class="primary" onclick="RentalManage.newTask()">＋ 添加任务</button></div><div class="notice">未来 14 天：绿色为客户预约，蓝色为清洁任务，红色为维修任务。点击任一项目可查看完整资料；任务进行中会阻止车辆被重新开放预约。</div><div class="schedule-grid">${days.map(dayCard).join('')}</div><div class="footer-space"></div>`;
  }

  function openScheduleEvent(kind, id) {
    const record = kind === 'booking'
      ? state.bookings.find(item => String(item.id) === String(id))
      : state.tasks.find(item => String(item.id) === String(id));
    if(!record) { alert('该日历项目已更新，请返回日历刷新后重试。'); return; }
    go('schedule-event', { scheduleEvent:{ kind, id:String(id) } });
  }

  function renderScheduleEvent() {
    const event = state.scheduleEvent || {};
    const isBooking = event.kind === 'booking';
    const item = isBooking
      ? state.bookings.find(row => String(row.id) === String(event.id))
      : state.tasks.find(row => String(row.id) === String(event.id));
    if(!item) { app.innerHTML = `${top('日历详情')}<div class="empty">该项目已不存在或已更新。</div>`; return; }
    const vehicle = item.vehicle || state.vehicles.find(row => String(row.id) === String(item.vehicle_id)) || {};
    const typeLabel = isBooking ? '客户预约' : taskTypeText(item.task_type);
    const status = isBooking ? statusText(item.status) : taskStatusText(item.status);
    const detail = isBooking
      ? `<section class="detail-card"><h2>预约信息</h2><p><b>${esc(item.customer?.name || item.customer_name || '客户')}</b><span>${esc(item.customer_phone || '未填写电话')}</span></p><p>${esc(dateText(item.starts_at))} 至 ${esc(dateText(item.ends_at))}</p><p>预约编号：<b>${esc(item.booking_code || '—')}</b></p></section><section class="detail-card"><h2>金额与状态</h2><p>预约金额：<b>${money(item.total_amount)}</b></p><p>收款状态：<b>${esc(paymentText(item.payment_status))}</b></p><p>押金状态：<b>${esc(depositText(item.deposit_status))}</b></p></section><div class="actions"><button class="primary" onclick="RentalManage.openScheduleBooking('${esc(item.id)}')">打开预约管理</button></div>`
      : `<section class="detail-card"><h2>任务信息</h2><p><b>${esc(item.title || '未命名任务')}</b><span>${esc(status)}</span></p><p>${esc(dateText(item.starts_at))} 至 ${esc(dateText(item.ends_at))}</p><p>负责人：${esc(item.assignee_name || '暂未指派')}</p>${item.note ? `<p>备注：${esc(item.note)}</p>` : ''}</section><div class="actions"><button class="primary" onclick="RentalManage.openScheduleTask('${esc(item.id)}')">查看任务记录</button></div>`;
    app.innerHTML = `${top('日历项目详情')}<section class="schedule-detail-hero"><span class="task-type ${esc(isBooking ? 'booking' : item.task_type)}">${esc(typeLabel)}</span><h1>${esc(vehicle.name || '车辆')}</h1><p>${esc(status)}</p></section>${detail}<div class="footer-space"></div>`;
  }

  function openBooking(id) { const booking=state.bookings.find(item=>String(item.id)===String(id))||null; if(!booking)return; go('booking',{booking}); }
  function openFinance(id) { const booking=state.bookings.find(item=>String(item.id)===String(id))||null; if(!booking)return; go('finance',{booking}); }
  function openReprice(id) { const booking=state.bookings.find(item=>String(item.id)===String(id))||null; if(!booking)return; go('reprice',{booking}); }
  function back() { const previous=state.history.pop(); if(previous) { restoreRoute(previous); return; } exitManager(); }
  window.RentalManage = { close,back,home:()=>{state.vehicleFilter='';state.history=[];state.screen='home';renderHome();},reload:()=>loadManager(state.screen),bookings:filter=>go('bookings',{vehicleFilter:'',bookingFilter:filter==='finance'?'finance':filter||'all'}),fleet:()=>go('fleet',{vehicleFilter:''}),tasks:()=>go('tasks'),schedule:()=>go('schedule'),newTask:vehicleId=>go('task',{taskVehicleId:vehicleId||'',editingTaskId:''}),editTask:id=>go('task',{editingTaskId:id}),saveTask,taskStatus:saveTaskStatus,openVehicleBookings,setVehicleStatus,startHandover,saveHandover,handoverPhotos:addHandoverPhotos,removeHandoverPhoto:index=>{state.handoverPhotos.splice(index,1);renderHandoverPhotos();},openBooking,finance:openFinance,reprice:openReprice,openScheduleEvent,openScheduleBooking:id=>openBooking(id),openScheduleTask:id=>go('task',{editingTaskId:id}),confirm:confirmBooking,cancelBooking:cancelMerchantBooking,saveFinance,saveReprice,vehicles:()=>go('vehicles'),editVehicle:id=>go('vehicle',{editingVehicleId:id||''}),saveVehicle,toggleVehicle,services:type=>go('services',{serviceType:type||'addon'}),editService:(type,id)=>go('service',{serviceType:type,editingServiceId:id||''}),saveService,toggleService,photos:addPhotos,removePhoto:index=>{state.photos.splice(index,1);renderPhotos();} };
  loadManager();
})();
