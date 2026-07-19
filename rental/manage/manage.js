(() => {
  const SUPABASE_URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
  const MEDIA_URL = 'https://upload.escoopcity.com';
  const app = document.getElementById('rentalManageApp');
  const query = new URLSearchParams(location.search);
  const state = { merchant:null, merchantId:'', vehicles:[], services:[], photos:[] };

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  const money = value => `$${Number(value || 0).toFixed(2)}`;
  const getSession = () => { try { return JSON.parse(localStorage.getItem('wanba_session') || 'null'); } catch(error) { return null; } };
  const api = (path, options={}) => {
    const session = getSession();
    return fetch(`${SUPABASE_URL}${path}`, {
      ...options,
      headers: { apikey:SUPABASE_KEY, Authorization:`Bearer ${session?.access_token || SUPABASE_KEY}`, 'Content-Type':'application/json', ...(options.headers || {}) }
    });
  };
  const top = title => `<header class="top"><button onclick="RentalManage.back()" aria-label="返回">‹</button><b>${esc(title)}</b><button onclick="RentalManage.close()" aria-label="关闭">×</button></header>`;
  const close = () => { if(window.parent !== window) window.parent.postMessage({ type:'leshenghuo-close-rental' }, '*'); else if(history.length > 1) history.back(); else location.assign('/'); };
  const vehiclePhoto = vehicle => Array.isArray(vehicle?.photos) && vehicle.photos[0] ? `<img src="${esc(vehicle.photos[0])}" alt="">` : '<div class="placeholder">🚗</div>';
  const statusText = value => ({ available:'可预约', cleaning:'清洁中', maintenance:'维修中', inactive:'已下架' }[value] || value || '可预约');
  const rateText = vehicle => vehicle.pricing_mode === 'hour' ? `${money(vehicle.hourly_rate)}/小时` : vehicle.pricing_mode === 'both' ? `${money(vehicle.daily_rate)}/天 · ${money(vehicle.hourly_rate)}/小时` : `${money(vehicle.daily_rate)}/天`;
  const value = id => document.getElementById(id)?.value?.trim() || '';

  async function loadManager() {
    const slug = query.get('merchant');
    if(!slug || !getSession()?.access_token) { app.innerHTML = `${top('租车管理')}<div class="empty">请先登录拥有商家管理权限的账号。</div>`; return; }
    try {
      const publicResponse = await api('/rest/v1/rpc/merchant_rental_public_catalog', { method:'POST', body:JSON.stringify({ p_slug:slug }) });
      const catalog = await publicResponse.json();
      if(!publicResponse.ok || !catalog?.merchant?.user_id) throw new Error('merchant_not_found');
      state.merchant = catalog.merchant;
      state.merchantId = catalog.merchant.user_id;
      const result = await api('/rest/v1/rpc/merchant_rental_manager_list', { method:'POST', body:JSON.stringify({ p_merchant_user_id:state.merchantId }) });
      const data = await result.json();
      if(!result.ok || !data) throw new Error('permission_denied');
      state.vehicles = Array.isArray(data.vehicles) ? data.vehicles : [];
      state.services = Array.isArray(data.services) ? data.services : [];
      renderHome();
    } catch(error) {
      console.warn('租车管理加载失败:', error.message);
      app.innerHTML = `${top('租车管理')}<div class="empty">暂时无法打开管理页面。请确认当前账号是店长或已被授权管理。</div>`;
    }
  }

  function renderHome() {
    const cards = state.vehicles.length ? state.vehicles.map(vehicle => `<article class="card"><div class="vehicle">${vehiclePhoto(vehicle)}<div class="vehicle-info"><b>${esc(vehicle.name)}</b><p>${esc([vehicle.year, vehicle.make, vehicle.model, `${vehicle.seats || 5}座`].filter(Boolean).join(' · '))}</p><em>${rateText(vehicle)}</em></div><i class="status">${esc(statusText(vehicle.status))}</i></div><div class="card-actions"><button class="primary" onclick="RentalManage.editVehicle('${esc(vehicle.id)}')">编辑车辆</button><button onclick="RentalManage.toggleVehicle('${esc(vehicle.id)}')">${vehicle.status === 'inactive' ? '重新上架' : '下架'}</button></div></article>`).join('') : '<div class="empty">还没有车辆。添加后会自动出现在客户租车页面。</div>';
    app.innerHTML = `${top('租车管理')}<section class="hero"><h1>${esc(state.merchant?.business_name || '商家')} · 租车</h1><p>车辆、增值服务和保险服务均在这里独立维护。</p></section><div class="actions"><button class="primary" onclick="RentalManage.editVehicle()">＋ 添加车辆</button><button class="secondary" onclick="RentalManage.services('addon')">添加增值服务</button><button class="secondary" onclick="RentalManage.services('insurance')">添加保险服务</button><button class="secondary" onclick="RentalManage.reload()">刷新</button></div><div class="section-title"><b>车辆 ${state.vehicles.length}</b><span>第一张图片作为客户封面</span></div>${cards}<div class="footer-space"></div>`;
  }

  function renderVehicleEditor(vehicleId) {
    const vehicle = vehicleId ? state.vehicles.find(row => String(row.id) === String(vehicleId)) : null;
    state.photos = Array.isArray(vehicle?.photos) ? vehicle.photos.slice() : [];
    const selectedAddonIds = (vehicle?.addons || []).filter(item => item.service_type === 'addon').map(item => String(item.id));
    const selectedInsuranceId = (vehicle?.addons || []).find(item => item.service_type === 'insurance')?.id || '';
    const addOns = state.services.filter(item => item.service_type === 'addon' && item.is_active !== false);
    const insurance = state.services.filter(item => item.service_type === 'insurance' && item.is_active !== false);
    app.innerHTML = `${top(vehicle ? '编辑车辆' : '添加车辆')}<div class="actions"><button class="secondary" onclick="RentalManage.home()">← 返回车辆</button><button class="secondary" onclick="RentalManage.services('addon')">添加增值服务</button><button class="secondary" onclick="RentalManage.services('insurance')">添加保险服务</button></div><section class="form"><label class="field">车辆名称<input id="vName" maxlength="80" value="${esc(vehicle?.name || '')}" placeholder="例如：2024 Toyota Camry"></label><div class="grid"><label class="field">品牌<input id="vMake" maxlength="50" value="${esc(vehicle?.make || '')}"></label><label class="field">车型<input id="vModel" maxlength="50" value="${esc(vehicle?.model || '')}"></label><label class="field">年份<input id="vYear" type="number" min="1900" max="2100" value="${esc(vehicle?.year || '')}"></label><label class="field">座位数<input id="vSeats" type="number" min="1" max="30" value="${esc(vehicle?.seats || 5)}"></label><label class="field">行李数量<input id="vLuggage" type="number" min="0" max="20" value="${esc(vehicle?.luggage_count ?? 2)}"></label><label class="field">燃油<select id="vFuel">${['汽油','柴油','纯电','混动'].map(item => `<option ${vehicle?.fuel_type === item ? 'selected' : ''}>${item}</option>`).join('')}</select></label><label class="field">档位<select id="vTransmission">${['自动挡','手动挡'].map(item => `<option ${vehicle?.transmission === item ? 'selected' : ''}>${item}</option>`).join('')}</select></label><label class="field">车辆状态<select id="vStatus">${[['available','可预约'],['cleaning','清洁中'],['maintenance','维修中'],['inactive','下架']].map(item => `<option value="${item[0]}" ${vehicle?.status === item[0] ? 'selected' : ''}>${item[1]}</option>`).join('')}</select></label></div><div class="grid"><label class="field">租赁方式<select id="vPricing"><option value="day" ${vehicle?.pricing_mode === 'day' || !vehicle?.pricing_mode ? 'selected' : ''}>按天</option><option value="hour" ${vehicle?.pricing_mode === 'hour' ? 'selected' : ''}>按小时</option><option value="both" ${vehicle?.pricing_mode === 'both' ? 'selected' : ''}>按天和按小时</option></select></label><label class="field">日租价格<input id="vDay" inputmode="decimal" value="${esc(vehicle?.daily_rate ?? 0)}"></label><label class="field">小时价格<input id="vHour" inputmode="decimal" value="${esc(vehicle?.hourly_rate ?? 0)}"></label><label class="field">最少小时数<input id="vMin" type="number" min="1" value="${esc(vehicle?.minimum_hours ?? 1)}"></label><label class="field">押金<input id="vDeposit" inputmode="decimal" value="${esc(vehicle?.deposit_amount ?? 0)}"></label></div><label class="field">取车地点<input id="vAddress" maxlength="180" value="${esc(vehicle?.pickup_address || state.merchant?.address || '')}"></label><label class="field">车辆介绍<textarea id="vDescription" maxlength="600">${esc(vehicle?.description || '')}</textarea></label><label class="field">车辆图片<input type="file" accept="image/*" multiple onchange="RentalManage.photos(this.files)"></label><div id="photos" class="photo-list"></div><div class="notice">图片会压缩上传，第一张为车辆封面。</div><div class="section-title"><b>增值服务</b><button class="button secondary" onclick="RentalManage.services('addon')">添加增值服务</button></div><div class="card">${addOns.length ? addOns.map(item => `<label class="library-row"><input type="checkbox" data-addon-id="${esc(item.id)}" ${selectedAddonIds.includes(String(item.id)) ? 'checked' : ''}><span><b>${esc(item.name)}</b><small>${esc(item.description || '')} · ${money(item.price)}${item.unit === 'day' ? '/天' : '/次'}</small></span></label>`).join('') : '<div class="notice">尚未添加增值服务。</div>'}</div><div class="section-title"><b>保险服务</b><button class="button secondary" onclick="RentalManage.services('insurance')">添加保险服务</button></div><label class="field">为这辆车选择保险<select id="vInsurance"><option value="">暂不提供</option>${insurance.map(item => `<option value="${esc(item.id)}" ${String(selectedInsuranceId) === String(item.id) ? 'selected' : ''}>${esc(item.name)} · ${money(item.price)}${item.unit === 'day' ? '/天' : '/次'}</option>`).join('')}</select></label><button id="vehicleSave" class="button primary full" onclick="RentalManage.saveVehicle('${esc(vehicle?.id || '')}')">保存车辆</button></section>`;
    renderPhotos();
  }

  function renderPhotos() { const target = document.getElementById('photos'); if(target) target.innerHTML = state.photos.map((photo, index) => `<div class="photo"><img src="${esc(photo)}" alt=""><button onclick="RentalManage.removePhoto(${index})">×</button></div>`).join(''); }
  async function addPhotos(files) { for(const file of Array.from(files || []).slice(0, 8 - state.photos.length)) { const original = await new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); }); state.photos.push(await compress(original)); } renderPhotos(); }
  async function compress(dataUrl) { const image = await new Promise((resolve,reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = dataUrl; }); const scale = Math.min(1, 1440 / Math.max(image.width,image.height)); const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale); canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height); return canvas.toDataURL('image/jpeg',.78); }
  async function upload(source) { if(!String(source).startsWith('data:')) return source; const blob = await (await fetch(source)).blob(); const response = await fetch(`${MEDIA_URL}/upload`, { method:'POST', headers:{ Authorization:`Bearer ${getSession()?.access_token || ''}`, 'Content-Type':blob.type, 'x-media-kind':'products' }, body:blob }); const result = await response.json().catch(() => ({})); if(!response.ok || !result.url) throw new Error(result.error || 'media_upload_failed'); return result.url; }

  async function saveVehicle(vehicleId) {
    const name = value('vName');
    if(!name) { alert('请填写车辆名称'); return; }
    const button = document.getElementById('vehicleSave');
    try {
      button.disabled = true; button.textContent = '正在保存…';
      const photos = [];
      for(const source of state.photos) photos.push(await upload(source));
      const payload = { id:vehicleId || undefined, name, make:value('vMake'), model:value('vModel'), year:value('vYear'), seats:value('vSeats'), transmission:value('vTransmission'), fuel_type:value('vFuel'), pricing_mode:value('vPricing'), daily_rate:value('vDay'), hourly_rate:value('vHour'), minimum_hours:value('vMin'), deposit_amount:value('vDeposit'), pickup_address:value('vAddress'), status:value('vStatus'), description:value('vDescription'), photos };
      const vehicleResponse = await api('/rest/v1/rpc/merchant_rental_save_vehicle', { method:'POST', body:JSON.stringify({ p_merchant_user_id:state.merchantId, p_vehicle:payload }) });
      const rawVehicle = await vehicleResponse.json().catch(() => null);
      const savedVehicle = Array.isArray(rawVehicle) ? rawVehicle[0] : rawVehicle;
      if(!vehicleResponse.ok || !savedVehicle?.id) throw new Error('vehicle_save_failed');
      const addonIds = Array.from(document.querySelectorAll('[data-addon-id]:checked')).map(item => item.dataset.addonId).filter(Boolean);
      const serviceResponse = await api('/rest/v1/rpc/merchant_rental_save_vehicle_services', { method:'POST', body:JSON.stringify({ p_vehicle_id:savedVehicle.id, p_addon_service_ids:addonIds, p_insurance_service_id:value('vInsurance') || null }) });
      const serviceResult = await serviceResponse.json().catch(() => null);
      if(!serviceResponse.ok) throw new Error('vehicle_services_save_failed');
      const savedAddonIds = new Set((serviceResult?.addon_service_ids || []).map(String));
      if(addonIds.some(id => !savedAddonIds.has(String(id)))) throw new Error('vehicle_services_verify_failed');
      const luggageResponse = await api('/rest/v1/rpc/merchant_rental_save_vehicle_addons', { method:'POST', body:JSON.stringify({ p_vehicle_id:savedVehicle.id, p_addons:[], p_luggage_count:Math.max(0,Math.min(20,Number(value('vLuggage') || 2))) }) });
      if(!luggageResponse.ok) throw new Error('vehicle_luggage_save_failed');
      await loadManager();
      alert('车辆与已选择的服务已保存。');
    } catch(error) {
      console.warn('保存车辆失败:', error.message);
      alert(error.message.includes('services') ? '增值服务保存失败，请确认服务仍处于启用状态后重试。' : '车辆保存失败，请稍后重试。');
    } finally { if(button) { button.disabled = false; button.textContent = '保存车辆'; } }
  }

  function renderServices(type='addon') {
    const label = type === 'insurance' ? '保险服务' : '增值服务';
    const list = state.services.filter(item => item.service_type === type);
    app.innerHTML = `${top(label)}<div class="actions"><button class="secondary" onclick="RentalManage.home()">← 返回车辆</button><button class="primary" onclick="RentalManage.editService('${type}')">＋ 添加${label}</button></div><div class="notice">${label}为全店公用项目。车辆只需勾选，无需重复填写。</div>${list.length ? list.map(item => `<article class="card"><b>${esc(item.name)}</b><p>${esc(item.description || '暂无说明')}</p><em>${money(item.price)}${item.unit === 'day' ? '/天' : '/次'}</em><div class="card-actions"><button class="primary" onclick="RentalManage.editService('${type}','${esc(item.id)}')">编辑</button><button onclick="RentalManage.toggleService('${esc(item.id)}')">${item.is_active === false ? '重新启用' : '暂停'}</button></div></article>`).join('') : '<div class="empty">还没有服务项目。</div>'}`;
  }
  function editService(type, id) { const item = id ? state.services.find(row => String(row.id) === String(id)) : null; const label = type === 'insurance' ? '保险服务' : '增值服务'; app.innerHTML = `${top(`编辑${label}`)}<div class="actions"><button class="secondary" onclick="RentalManage.services('${type}')">← 返回${label}</button></div><section class="form"><label class="field">名称<input id="sName" maxlength="80" value="${esc(item?.name || '')}"></label><label class="field">说明<textarea id="sDescription" maxlength="180">${esc(item?.description || '')}</textarea></label><div class="grid"><label class="field">价格<input id="sPrice" inputmode="decimal" value="${esc(item?.price ?? '')}"></label><label class="field">收费方式<select id="sUnit"><option value="once" ${item?.unit === 'once' ? 'selected' : ''}>每次</option><option value="day" ${item?.unit === 'day' ? 'selected' : ''}>每天</option></select></label></div><button class="button primary full" onclick="RentalManage.saveService('${type}','${esc(item?.id || '')}')">保存${label}</button></section>`; }
  async function saveService(type, id) { const name = value('sName'); if(!name) { alert('请填写名称'); return; } const response = await api('/rest/v1/rpc/merchant_rental_save_shared_service', { method:'POST', body:JSON.stringify({ p_service:{ id:id || undefined, merchant_user_id:state.merchantId, service_type:type, name, description:value('sDescription'), price:value('sPrice') || 0, unit:value('sUnit'), is_active:true } }) }); if(!response.ok) { alert('服务保存失败'); return; } await loadManager(); renderServices(type); }
  async function toggleService(id) { const item = state.services.find(row => String(row.id) === String(id)); if(!item) return; const response = await api('/rest/v1/rpc/merchant_rental_save_shared_service', { method:'POST', body:JSON.stringify({ p_service:{ ...item, merchant_user_id:state.merchantId, is_active:item.is_active === false } }) }); if(!response.ok) { alert('服务状态更新失败'); return; } await loadManager(); renderServices(item.service_type); }
  async function toggleVehicle(id) { const vehicle = state.vehicles.find(row => String(row.id) === String(id)); if(!vehicle) return; const response = await api('/rest/v1/rpc/merchant_rental_save_vehicle', { method:'POST', body:JSON.stringify({ p_merchant_user_id:state.merchantId, p_vehicle:{ ...vehicle, status:vehicle.status === 'inactive' ? 'available' : 'inactive' } }) }); if(!response.ok) { alert('车辆状态更新失败'); return; } loadManager(); }
  window.RentalManage = { close, back:close, home:renderHome, reload:loadManager, editVehicle:renderVehicleEditor, saveVehicle, toggleVehicle, services:renderServices, editService, saveService, toggleService, photos:addPhotos, removePhoto:index => { state.photos.splice(index,1); renderPhotos(); } };
  loadManager();
})();
