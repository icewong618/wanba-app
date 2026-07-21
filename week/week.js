(() => {
  const SUPABASE_URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
  const app = document.getElementById('weekApp');
  const state = { rows: [], filter: 'all' };
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const session = () => { try { return JSON.parse(localStorage.getItem('wanba_session') || 'null'); } catch(e) { return null; } };
  const request = async path => {
    const active = session();
    return fetch(`${SUPABASE_URL}${path}`, { headers:{ apikey:SUPABASE_KEY, Accept:'application/json', Authorization:`Bearer ${active?.access_token || SUPABASE_KEY}` } });
  };
  const ymdInLa = date => {
    const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
    const read = type => parts.find(part => part.type === type)?.value || '';
    return `${read('year')}-${read('month')}-${read('day')}`;
  };
  const dayFromYmd = value => /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) ? new Date(`${value}T12:00:00Z`) : null;
  const formatYmd = date => date.toISOString().slice(0,10);
  const addDays = (date, amount) => { const next = new Date(date); next.setUTCDate(next.getUTCDate() + amount); return next; };
  const weekRange = () => {
    const today = dayFromYmd(ymdInLa(new Date()));
    const mondayOffset = (today.getUTCDay() + 6) % 7;
    const start = addDays(today, -mondayOffset);
    return { start, end:addDays(start, 6), today };
  };
  const eventFor = row => row?.event && typeof row.event === 'object' ? row.event : null;
  const periodFor = row => {
    const event = eventFor(row);
    const start = dayFromYmd(event?.start_date);
    const end = dayFromYmd(event?.end_date || event?.start_date);
    return start && end && end >= start ? {start,end} : null;
  };
  const textFor = row => [row?.title,row?.content,row?.excerpt,row?.category,row?.subcategory,...(Array.isArray(row?.tags) ? row.tags : [])].filter(Boolean).join(' ').toLowerCase();
  const legacyWeekTag = row => /本周活动|本周末活动/.test(textFor(row));
  const overlaps = (aStart,aEnd,bStart,bEnd) => aStart <= bEnd && aEnd >= bStart;
  const isInWeek = row => { const period = periodFor(row); const range = weekRange(); return period ? overlaps(period.start,period.end,range.start,range.end) : legacyWeekTag(row); };
  const isToday = row => { const period = periodFor(row); const {today} = weekRange(); return period ? overlaps(period.start,period.end,today,today) : legacyWeekTag(row); };
  const isWeekend = row => { const {end} = weekRange(); const saturday = addDays(end,-1); const period = periodFor(row); return period ? overlaps(period.start,period.end,saturday,end) : /本周末活动/.test(textFor(row)); };
  const dateLabel = row => { const period = periodFor(row); if(!period) return '本周活动'; const start = formatYmd(period.start).slice(5).replace('-','/'); const end = formatYmd(period.end).slice(5).replace('-','/'); return start === end ? start : `${start} - ${end}`; };
  const cover = row => row?.image || (Array.isArray(row?.images) ? row.images[0] : '') || '';
  const clean = value => String(value || '').replace(/\[\[.*?\]\]/g,'').trim();
  const rowMatchesFilter = row => state.filter === 'all' ? true : state.filter === 'today' ? isToday(row) : isWeekend(row);
  const filtered = () => state.rows.filter(isInWeek).filter(rowMatchesFilter).sort((a,b) => {
    const aStart = periodFor(a)?.start?.getTime() || Number.MAX_SAFE_INTEGER;
    const bStart = periodFor(b)?.start?.getTime() || Number.MAX_SAFE_INTEGER;
    return aStart - bStart || new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });
  const top = () => `<header class="module-top"><button onclick="WeekEvents.back()" aria-label="返回">‹</button><b>本周活动</b><span class="module-top-actions"><button class="module-language" onclick="window.LeshenghuoI18n&&window.LeshenghuoI18n.openPicker()" aria-label="语言" title="语言">文</button><button onclick="WeekEvents.refresh()" aria-label="刷新">↻</button></span></header>`;
  const card = row => {
    const image = cover(row); const tags = (Array.isArray(row.tags) ? row.tags : []).filter(Boolean).slice(0,2);
    const event = eventFor(row); const type = event?.registration_enabled || Number(event?.capacity || 0) > 0 ? '可报名' : '活动';
    return `<article class="event-card" onclick="WeekEvents.open('${esc(row.id)}')"><div class="event-cover">${image ? `<img src="${esc(image)}" alt="">` : ''}<span class="event-type">${type}</span></div><div class="event-content"><h2>${esc(row.title || '未命名活动')}</h2><div class="event-date">▣ ${esc(dateLabel(row))}</div>${row.location ? `<div class="event-location">⌖ ${esc(row.location)}</div>` : ''}<p class="event-desc">${esc(clean(row.excerpt || row.content) || '查看活动详情、时间与报名信息。')}</p>${tags.length ? `<div class="event-tags">${tags.map(tag => `<span>#${esc(tag)}</span>`).join('')}</div>` : ''}</div></article>`;
  };
  const render = () => {
    const range = weekRange(); const rows = filtered();
    app.innerHTML = `${top()}<section class="week-hero"><h1>本周活动</h1><p>活动笔记、报名活动与后续票务内容统一按时间进入本周。</p><span class="week-range">▣ ${formatYmd(range.start).slice(5).replace('-','/')} - ${formatYmd(range.end).slice(5).replace('-','/')} · 洛杉矶时间</span></section><div class="week-tabs"><button class="${state.filter==='all'?'active':''}" onclick="WeekEvents.filter('all')">全部</button><button class="${state.filter==='today'?'active':''}" onclick="WeekEvents.filter('today')">今天</button><button class="${state.filter==='weekend'?'active':''}" onclick="WeekEvents.filter('weekend')">本周末</button></div><div class="week-summary"><span>本周共 <b>${rows.length}</b> 个活动</span><span>按开始日期排序</span></div><section class="week-feed">${rows.length ? rows.map(card).join('') : '<div class="empty"><div class="empty-icon">▣</div><p>本周还没有活动<br>发布玩乐活动并填写开始、截止日期后，会自动显示在这里。</p></div>'}</section>`;
  };
  const load = async () => {
    app.innerHTML = `${top()}<div class="module-loading">正在读取本周活动...</div>`;
    const select = 'id,title,content,excerpt,category,subcategory,author,image,images,event,tags,user_id,visibility,pinned,created_at,location';
    try {
      const res = await request(`/rest/v1/posts?select=${select}&or=(visibility.eq.public,visibility.is.null)&order=created_at.desc,id.desc&limit=300`);
      if(!res.ok) throw new Error(await res.text());
      state.rows = await res.json();
      render();
    } catch(error) {
      console.warn('本周活动读取失败:', error.message);
      app.innerHTML = `${top()}<div class="empty"><div class="empty-icon">!</div><p>暂时无法读取活动内容<br>请稍后刷新再试。</p></div>`;
    }
  };
  window.WeekEvents = {
    back: () => history.length > 1 ? history.back() : location.assign('/'),
    refresh: load,
    filter: value => { state.filter = value; render(); },
    open: id => location.assign(`/?post=${encodeURIComponent(id)}`)
  };
  load();
})();
